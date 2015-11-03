var _ = require('../Util.js');
var esprima = require('esprima');

module.exports = addMethodBody = function(control, data, domain){
	control.objects[control.get('data')][domain] = { variables: [] };
	var lines = data.data;
	_.each(lines, function(line, i){
		lines[i] = line.replace(/\n|\t|\n\t/g, '');
	})
	control.add(processLines(control, lines, domain));
}

function processLines(control, lines, domain){
	var eachExp = new RegExp('^each');
	var result = '';
	while(lines.length){
		var line = lines.shift();
		if(line.length){
			while(line[0] === ' ' || line[0] === '\n' || line[0] === '\t'){
				line = line.substring(1, line.length);
			}
			line = basicLineProcess(control, line, domain);
			if(eachExp.test(line)){
				line = makeEachBlock(control, line, lines, domain);
			}
			line = line + ';\n';
			result += line;
		}
	}
	return result;
}

function makeEachBlock(control, startLine, rest, domain){
	var eachExp = new RegExp('^each');
	var result = '';

	startLine = startLine.split('->');
	var init = startLine[0];
	var firstLine = startLine[1];
	var block = [firstLine];

	while(!eachExp.test(rest[0])){
		block.push(rest.shift());
		if(!rest.length){
			throw new Error('Error: no closing line for each block.');
		}
	}

	rest.shift();

	var parts = init.split(' ');
	var array = parts[1];
	var member = parts[2];

	result += 'var '+member+';\n';
	result += 'for(var i = 0; i < '+array+'.length; i++){\n';
	result += member+' = '+array+'[i];\n';

	var current;
	result += processLines(control, block, domain);

	result += '}';
	return result;
}


function basicLineProcess(control, line, domain){
	var thisExp = new RegExp('^this');
	var returnExp = new RegExp('^\<\-');
	var eachExp = new RegExp('^each');

	if(domain === 'init'){
		line = line.replace(/Self/g, 'this.data');
	} else {
		line = line.replace(/Self/g, 'this.data[\"'+domain+'\"]');
	}
	if(returnExp.test(line)){
		line = line.replace(/\<\-/, '');
		line = 'return '+ line;
	} else if(!thisExp.test(line) && !eachExp.test(line)){
		var expression = esprima.parse(line).body[0].expression;
		var varName = expression.type === 'AssignmentExpression' ? expression.left.name : expression.callee.object.name;
		var methodVariables = control.objects[control.get('data')][domain].variables;
		if(methodVariables[varName] === undefined){
			line = 'var ' + line;
			methodVariables[varName] = true;
 		}
	}

	return line;
}

function returnVariableName(line){

	var simpleInvocation = new RegExp('.*\..*\(.*\)');
	var assignment = new RegExp('.* .* .*');
	if(line.indexOf('.') === -1 && line.indexOf('=') === -1){
		return line;
	}
	if(assignment.test(line)){
		return line.split(' ')[0];
	}
	else if(simpleInvocation.test(line)){
		return line.split('.')[0];
	} else {
		throw new Error('Cant parse variable name of line: '+line);
	}
}
