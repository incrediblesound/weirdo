var fileComponents = require('./fileComponents.js');

var typeChecks = {
	Num: function(method_name){
		return 'wdo.argsAreNumbers(args, "'+method_name+'");\n';
	},
	Str: function(method_name){
		return 'wdo.argsAreStrings(args, "'+method_name+'");\n';
	},
	Obj: function(method_name){
		return 'wdo.argsAreObjects(args,"'+method_name+'");\n';
	},
}

module.exports = {
	'object_declaration': objectDeclaration,
    'object_init': objectInit,
	'object_method': objectMethod,
 //    'method_types': methodTypes,
 //    'method_args': methodArgs,
 //    'method_body': methodBody,
    // 'end_object': endObject
}

function objectDeclaration(data, control){
	control.footer += 'wdo_modules.'+data+' = '+data+';\n';
	control.setState('object', data);
	control.objects[data] = {};
}

function objectInit(data, control){
	if(!control.hasState('object')){
		throw new Error('Error: Init function outside of object definition');
	} else {
		var name = control.get('data');
		control.add('var '+name+' = function(){\n');
		control.add('var args = Array.prototype.slice.call(arguments);\n')
		var argsType = data[0].data;
		if(notNull(argsType)){
			control.add(''+typeChecks[argsType](name+' Init'));
		}
		var argNames = data[1].data;
		if(notNull(argNames)){
			// control.objects[name].argNames = argNames;
		} else {
			control.objects[name].argNames = false;
			var body = data[2];
			control.add('this.data = {};\n');
			addMethodBody(control, body, 'init')
		}
		control.add('}\n')
	}
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
		if(notNull(argsType)){
			control.add(''+typeChecks[argsType](method_name));
		}
		var argNames = data[2].data;
		var body = data[3];

		if(argNames === '~'){
			// control.objects[name].argNames = argNames;
			control.add(functionInitialize(method_name));
			control.add('var method_body = function(n){\n')
			addMethodBody(control, body, method_name);
			control.add('}\n')
			control.add('wdo.invokeRecusive(method_body, this, args);\n')
		} else {
			// control.objects[name].argNames = false;
			addMethodBody(control, body, method_name)
		}
		control.add('}\n')
	}
}

function addMethodBody(control, data, domain){
	var lines = data.data;
	var thisExp = new RegExp('^this');
	var returnExp = new RegExp('^\<\-');
	each(lines, function(line){
		line = line.replace(/\n|\t|\n\t/g, '');
		if(!line.length) return;
		while(line[0] === ' ' || line[0] === '\n'){
			line = line.substring(1, line.length);
		}
		line = line.replace(/Self/g, 'this.data[\"'+domain+'\"]');
		if(returnExp.test(line)){
			line = line.replace(/\<\-/, '');
			line = 'return '+ line;
		} else if(!thisExp.test(line)){
			line = 'var ' + line;
		}
		line = line + ';\n';
		control.add(line);
	})
}

function functionInitialize(name){
	var str = 'if(this.data['+name+'] === undefined){\n';
	str += 'this.data['+name+'] = this.data["init"];\n}\n';
	return str;
}

function convertValue(value){
	var number = parseInt(value);
	if(number === number){
		return number;
	}
}

function notNull(string){
	return string !== '..';
}

function each(arr, fn){
	var i = 0, l = arr.length;
	for(i; i < l; i++){
		fn(arr[i], i);
	}
}