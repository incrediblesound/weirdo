var argsAreNumbers = function(args, method){
	var i = 0, l = args.length;
	for(i; i < l; i++){
		if(typeof args[i] !== 'number'){
			throw new Error('Method '+method+' only accepts number arguments');
		}
	}
}

var argsAreStrings = function(args, method){
	var i = 0, l = args.length;
	for(i; i < l; i++){
		if(typeof args[i] !== 'string'){
			throw new Error('Method '+method+' only accepts string arguments');
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
		return this.data["init"];
	} else {
		return this.data[attr];
	}
}

var out = function(obj){
	console.log(obj.get());
}


module.exports = {
	argsAreNumbers: argsAreNumbers,
	argsAreStrings: argsAreStrings,
	invokeRecursive: invokeRecursive,
	Num: _Number,
	Str: _String,
	out: out,
	wdo_object: wdo_object
}