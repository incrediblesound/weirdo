var fileComponents = require('./utility/fileComponents.js');
var modules = require('./compilerModules/modules.js');
var _ = 	  require('./utility/Util.js');


var moduleMap = {
	'object_declaration': objectDeclaration,
	'object_method': objectMethod,
	'tildeExpression': tildeExpression,
    'object_init': modules.objectInit,
	'instance': modules.instance,
	'invocation': modules.invocation,
	'assignment': modules.assignment
}

module.exports = moduleMap;

function objectDeclaration(data, control){
	control.footer += 'wdo_modules.'+data+' = '+data+';\n';
	control.setState('object', data);
	control.objects[data] = {};
	control.objects[data].getters = {};
}

function objectMethod(data, control){
	if(!control.hasState('object')){
		throw new Error('Error: Object method outside of object definition');
	} else {

		var object_name = control.get('data');
		var method_name = data[0].data;
		var argsType = 	  data[1].data;
		var argNames = 	  data[2].data;
		var body = 		  data[3];

		if(argNames[0] === '->'){
			control.objects[object_name].getters[method_name] = true;
			control.add(object_name+'.prototype.'+method_name+'_getter = function(){\n');
			// there's an issue where addMethodBody might overwrite data about the main function
			// with data from the getter
			modules.addMethodBody(control, body, method_name);
			control.add('}\n')
			return;
		}

		control.add(object_name+'.prototype.'+method_name+' = function(){\n');
		control.add('var args = Array.prototype.slice.call(arguments);\n');

		if(argNames[0] === '~'){
			control.setObject(object_name,'argNames','~');
			control.add('var method_body = function(n){\n')
			modules.addMethodBody(control, body, method_name);
			control.add('}\n')
			control.add('wdo.invokeRecursive(method_body, this, args);\n')
		}
		else if(_.notNull(argNames)){
			control.setObject(object_name,'argNames',argNames);
			_.setArgumentVariables(control, argNames);
		}
		else {
			control.setObject(object_name,'argNames' ,false);
		}

		if(_.notNull(argsType)){
			argsType = _.cleanSplit(',', argsType);
			if(argNames === '~' || argsType.length === 1){
				control.add(''+_.typeChecks[argsType]('args', method_name));
			} else {
				_.each(argNames, function(argName, i){
					control.add(''+_.typeChecks[argsType[i]](argName, method_name));
				})
			}
		}
		modules.addMethodBody(control, body, method_name)
		control.add('}\n')
	}
}

function tildeExpression(data, control){
	// for now... just a loop
	var id = _.makeId();
	var expType = data.shift();
	var test = data.shift()[0];
	control.add('var '+id+'_loop = function(){\n')
	while(data.length){
		var current = data.shift()[0];
		moduleMap[current.type](current.data, control);
	}
	control.add('if(');
	moduleMap[test.type](test.data, control);
	control.cleanTail();

	control.add('){\n'+id+'_loop();\n}\n}\n');
	control.add(''+id+'_loop();\n')
}

function convertValue(value){
	var number = parseInt(value);
	if(number === number){
		return number;
	}
}
