var argsAreNumbers = function(args, method){
	var i = 0, l = args.length;
	for(i; i < l; i++){
		if(typeof args[i] !== 'number'){
			throw new Error('Method '+method+' only accepts number arguments');
		}
	}
}

var invokeRecursive = function(func, context, args){
	func.apply(context, args);
}

module.exports = {
	argsAreNumbers: argsAreNumbers,
	invokeRecursive: invokeRecursive
}