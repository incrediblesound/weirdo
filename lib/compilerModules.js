var fileComponents = require('./fileComponents.js');
var modules = require('./compilerModules/modules.js');
var wdo_core = require('../wdo.js');
var _ = require('./Util.js');

module.exports = {
	'object_declaration': objectDeclaration,
    'object_init': modules.objectInit,
	'object_method': objectMethod,
	'instance': instance,
	'invocation': invocation,
	'assignment': modules.assignment
}

function objectDeclaration(data, control){
	control.footer += 'wdo_modules.'+data+' = '+data+';\n';
	control.setState('object', data);
	control.objects[data] = {};
}

function objectMethod(data, control){
	if(!control.hasState('object')){
		throw new Error('Error: Object method outside of object definition');
	} else {
		var object_name = control.get('data');
		var method_name = data[0].data;
		control.add(object_name+'.prototype.'+method_name+' = function(){\n');
		control.add('var args = Array.prototype.slice.call(arguments);\n')
		var argsType = data[1].data;
		if(_.notNull(argsType)){
			control.add(''+_.typeChecks[argsType](method_name));
		}
		var argNames = data[2].data;
		var body = data[3];
		control.add(functionInitialize(method_name));
		if(argNames[0] === '~'){
			// control.objects[name].argNames = argNames;
			control.add(functionInitialize(method_name));
			control.add('var method_body = function(n){\n')
			modules.addMethodBody(control, body, method_name);
			control.add('}\n')
			control.add('wdo.invokeRecursive(method_body, this, args);\n')
		}
		else if(_.notNull(argNames)){
			control.objects[object_name].argNames = argNames;
			_.setArgumentVariables(control, argNames);
			modules.addMethodBody(control, body, method_name);
		}
		else {
			control.objects[object_name].argNames = false;
			modules.addMethodBody(control, body, method_name)
		}
		control.add('}\n')
	}
}

function instance(data, control){
	var left = data[0], right = data[1];
	control.variables[left.data] = true;
	var object, args;
	if(right.type === 'initialize'){
		object = right.data.object;
		args = right.data.args;
		if(control.objects[object] !== undefined){
			control.add('var '+left.data+' = new wdo_modules.'+object+'(');
			control.add((args ? _.printArgs(args) : '') + ');\n');
		} else if(wdo_core[object] !== undefined){
			control.add('var '+left.data+' = new wdo.'+object+'(');
			control.add((args ? _.printArgs(args) : '') + ');\n');
		}
	} else {
		object = right.data;
		if(control.objects[right.data] !== undefined){
			control.add('var '+left.data+' = new wdo_modules.'+object+'();\n');
		} else if(wdo_core[object] !== undefined){
			control.add('var '+left.data+' = new wdo.'+object+'();\n');
		}
	}
}

function invocation(data, control){
	if(control.variables[data.object] !== undefined){
		control.add(''+data.object+'.'+data.method+'(');
	} else if(control.objects[data.object] !== undefined){
		control.add('wdo_modules.'+data.object+'.'+data.method+'(');
	} else if(data.object === 'sys'){
		if(wdo_core[data.method] === undefined){
			throw new Error('Error: unknown core method: '+data.method);
		}
		control.add('wdo.'+data.method+'(');
	} else {
		throw new Error('Error: unknown object '+data.object);
	}
	control.add((data.args ? _.printArgs(data.args) : '') + ');\n');
}


function functionInitialize(name){
	var str = 'if(this.data["'+name+'"] === undefined){\n';
	str += 'this.data["'+name+'"] = this.data["init"];\n}\n';
	return str;
}

function convertValue(value){
	var number = parseInt(value);
	if(number === number){
		return number;
	}
}
