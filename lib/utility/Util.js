
var typeChecks = {
	Num: function(args, method_name){
		return 'wdo.argsAreNumbers('+args+', "'+method_name+'");\n';
	},
	Str: function(args, method_name){
		return 'wdo.argsAreStrings('+args+', "'+method_name+'");\n';
	},
	Obj: function(args, method_name){
		return 'wdo.argsAreObjects('+args+',"'+method_name+'");\n';
	},
	Val: function(args, method_name){
		return 'wdo.argIsValue('+args+',"'+method_name+'");\n';
	}
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
	setArgumentVariables: setArgumentVariables,
	removeLeadingJunk: removeLeadingJunk,
	cleanSplit: cleanSplit,
	trim: trim,
	beginsWithTilde: beginsWithTilde,
	makeId: makeId()
}

function isInstance(line){
	var regex = new RegExp('.*<-.*');
	return regex.test(line);
}

function isAssignment(line){
	var regex = new RegExp('.*->.*');
	return regex.test(line);
}

function beginsWithTilde(line){
	return line[0] === '~';
}

function noSpaces(string){
	return string.replace(/ /g, '');
}

function removeEmpties(arr){
	var result = [];
	each(arr, function(item){
		if(item.length){
			result.push(trim(item));
		}
	})
	return result;
}

function trim(string){
	var first = string[0];
	var last = string[string.length-1];
	if(first === ' ' || first === '\n' || first === '\t'){
		string = string.substring(1, string.length);
		return trim(string);
	}
	else if(last === ' ' || last === '\n' || last === '\t'){
		string = string.substring(0, string.length-1);
		return trim(string);
	} else {
		return string;
	}
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

function cleanSplit(splitter, string){
	var arr = string.split(splitter);
	each(arr, function(item, i){
		arr[i] = removeLeadingJunk(item);
	})
	return arr;
}

function removeLeadingJunk(string){
	while(string[0] === ' ' || string[0] === '\n' || string[0] === '\t'){
		string = string.substring(1, string.length);
	}
	return string;
}

function makeId(){
	var existing = {};
	return function(){
		var id = makeIdString();
		while(existing[id] !== undefined){
			id = makeIdString();
		}
		existing[id] = true;
		return id;

		function makeIdString(){
			var id = '';
			var letters = 'abcdefghijklmnopqrstuvwxyz';
			for(var i = 0; i < 4; i++){
				id += letters[Math.floor(Math.random() * 26)]
			}
			return id;
		}

	}
}