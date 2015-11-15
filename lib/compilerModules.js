var fileComponents = require('./utility/fileComponents.js');
var modules = require('./compilerModules/modules.js');
var _ = 	  require('./utility/Util.js');


var moduleMap = {
	'object_declaration': objectDeclaration,
	'object_method': objectMethod,
	'tildeExpression': modules.tildeBlock,
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
			control.setObjectProp(object_name,'argNames','~');
			control.add('var method_body = function(n){\n')
			modules.addMethodBody(control, body, method_name);
			control.add('}\n')
			control.add('wdo.invokeRecursive(method_body, this, args);\n')
		}
		else if(_.notNull(argNames)){
			control.setObjectProp(object_name,'argNames',argNames);
			_.setArgumentVariables(control, argNames);
		}
		else {
			control.setObjectProp(object_name,'argNames' ,false);
		}

		if(_.notNull(argsType)){
			argsType = _.cleanSplit(',', argsType);
			modules.compileArguments(control, argNames, argsType, method_name);

		}
		modules.addMethodBody(control, body, method_name)
		control.add('}\n')
	}
}

function convertValue(value){
	var number = parseInt(value);
	if(number === number){
		return number;
	}
}
