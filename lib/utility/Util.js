
module.exports = {
	isInstance: isInstance,
	isAssignment: isAssignment,
	noSpaces: noSpaces,
	removeEmpties: removeEmpties,
	each: each,
	contains: contains,
	findWhere: findWhere,
	regexFind: regexFind,
	printArgs: printArgs,
	notNull: notNull,
	setArgumentVariables: setArgumentVariables,
	removeLeadingJunk: removeLeadingJunk,
	cleanSplit: cleanSplit,
	trim: trim,
	beginsWithTilde: beginsWithTilde,
	makeId: makeId(),
	checkArgTypes: checkArgTypes
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

function printArgs(args, types){
	var result = '', currentType;
	each(args, function(arg, i){
		if(types !== undefined){
			currentType = types[i] || types[0];
			if(currentType === 'Val'){
				result += arg+'.get()';
			} else {
				result += arg;
			}
		} else {
			result += arg;
		}
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

function findWhere(arr, key, val){
	var result;
	each(arr, function(item){
		if(item[key] !== undefined && item[key] === val){
			result = item;
		}
	})
	return result;
}

function regexFind(arr, regex){
	for(var i = 0, l = arr.length; i < l; i++){
		if(regex.test(arr[i])){
			return i;
		}
	}
	return -1;
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

function valueToType(value){
	if(value.indexOf('{') !== -1 &&
	   value.indexOf('}')!== -1){
		return 'Obj'
	}
	else if(value.indexOf('"') !== -1 ||
	   value.indexOf('\'')!== -1){
		return 'Str';
	}
	else if(parseInt(value) === parseInt(value)){
		return 'Num';
	}
}

function checkArgTypes(argTypes, data, variables){
	var special = ['request','response', 'data'];
	var basicTypes = { Num: true, Str: true, Map: true};
	var args = data.args;

	if(argTypes.length === 1 && args.length > 1){
		each(args, function(arg){
			if(argTypes[0] === 'Val'){
				if(variables[arg] === undefined || basicTypes[variables[arg]] !== true){
					throw new Error('Method '+data.method+' of module '+data.object+
						' has incorrect argument type '+valueToType(arg));
				}
			}
			else if(valueToType(arg) !== argTypes[0]){
				throw new Error('Method '+data.method+' of module '+data.object+
					' has incorrect argument type '+valueToType(arg));
			}
		})
	} else {
		for(var i = 0; i < argTypes.length; i++){
			if(argTypes[0] === 'Val'){
				if(variables[args[i]] === undefined || basicTypes[variables[args[i]]] !== true){
					throw new Error('Method '+data.method+' of module '+data.object+
						' has incorrect argument type '+valueToType(args[i]));
				}
			}
			else if(valueToType(args[i]) !== argTypes[i]){
				throw new Error('Method '+data.method+' of module '+data.object+
					' has incorrect argument type '+valueToType(args[i]));
			}
		}
	}
}