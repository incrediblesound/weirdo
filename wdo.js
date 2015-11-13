var readline = require('readline-sync');
var fs = require('fs');
var http = require('http');

var input = function(value){
	var answer = readline.question('> ');
	value.set(answer);
	return value;
}

var loadText = function(path){
	var file = fs.readFileSync(path, 'utf8');
	file = file.toString();
	return file;
}

var argsAreNumbers = ARG_IS_TYPE('number');

var argsAreStrings = ARG_IS_TYPE('string');

function ARG_IS_TYPE(type){
	return function(args, method){
		if(!Array.isArray(args)){
			if(typeof args !== type){
				throw new Error('Method '+method+' has '+typeof args+
					' argument in a '+type+' argument position');
			};
		} else {
			var i = 0, l = args.length;
			for(i; i < l; i++){
				if(typeof args[i] !== type){
					throw new Error('Method '+method+' has '+typeof args[i]+
						' argument in a '+type+' argument position');
				}
			}
		}
	}
}

var invokeRecursive = function(func, context, args){
	while(args.length){
		func.apply(context, [args.shift()]);
	}
}

var _Number = function(){}
_Number.prototype.set = function(value){
	if(typeof value !== 'number'){
		throw new Error('Error: non-number assigned to number value');
	} else {
		this.value = value;
	}
}
_Number.prototype.get = function(){
	return this.value;
}

var _String = function(){}
_String.prototype.set = function(value){
	if(typeof value !== 'string'){
		throw new Error('Error: non-string assigned to string value');
	} else {
		this.value = value;
	}
}
_String.prototype.get = function(){
	return this.value;
}

var wdo_object = function(){};

wdo_object.prototype.wdo_get = function(attr){
	if(this.data[attr] === undefined){
		throw new Error('Error: attribute \"'+attr+'\" has not been initialized.');
	} else {
		return this.data[attr];
	}
}

var output = function(obj){
	console.log(obj.get());
}


module.exports = {
	argsAreNumbers: argsAreNumbers,
	argsAreStrings: argsAreStrings,
	invokeRecursive: invokeRecursive,
	loadText: loadText,
	Num: _Number,
	Str: _String,
	out: output,
	wdo_object: wdo_object,
	in: input
}