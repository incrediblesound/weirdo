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
	isInstance: isInstance,
	isAssignment: isAssignment,
	noSpaces: noSpaces,
	removeEmpties: removeEmpties,
	each: each,
	contains: contains,
	printArgs: printArgs,
	notNull: notNull,
	typeChecks: typeChecks,
	setArgumentVariables: setArgumentVariables
}

function isInstance(line){
	var regex = new RegExp('.*<-.*');
	return regex.test(line);
}

function isAssignment(line){
	var regex = new RegExp('.*->.*');
	return regex.test(line);
}

function noSpaces(string){
	return string.replace(/ /g, '');
}

function removeEmpties(arr){
	var result = [];
	each(arr, function(item){
		if(item.length){
			result.push(noSpaces(item));
		}
	})
	return result;
}

function each(arr, fn){
	var i = 0, l = arr.length;
	for(i; i < l; i++){
		fn(arr[i], i);
	}
}

function contains(arr, target){
	var result = false;
	each(arr, function(item){
		if(item === target){
			result = true;
		}
	})
	return result;
}

function printArgs(args){
	var result = '';
	each(args, function(arg, i){
		result += arg;
		if(i < args.length-1){
			result += ', ';
		}
	})
	return result;
}

function notNull(args){
	if(Array.isArray(args)){
		return args[0] !== '..';
	} else {
		return args !== '..';
	}
}

function setArgumentVariables(control, argNames){
	each(argNames, function(arg, i){
		control.add('var '+arg+' = args['+i+'];\n');
	})
}