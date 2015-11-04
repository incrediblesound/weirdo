var _ = require('../Util.js');
var esprima = require('esprima');
var constants = require('../constants');

module.exports = addMethodBody = function(control, data, domain){
	control.objects[control.get('data')][domain] = { variables: [] };
	var lines = data.data;
	_.each(lines, function(line, i){
		lines[i] = line.replace(/\n|\t|\n\t/g, '');
	})
	control.add(processLines(control, lines, domain));
}

function processLines(control, lines, domain){
	var result = '', line;
	while(lines.length){

		line = lines.shift();

		if(line.length){
			line = _.removeLeadingJunk(line);

			line = basicLineProcess(control, line, domain);

			if(constants.regex.each.test(line)){
				line = makeEachBlock(control, line, lines, domain);
			} 
			else if(constants.regex.ifOpen.test(line)){
				line = makeIfBlock(control, line, lines, domain);
			}

			line = line + ';\n';
			result += line;
		}

	}
	return result;
}

function makeIfBlock(control, startLine, rest, domain){

	var result = '', init, firstLine, block;
	startLine = startLine.split('->');

	init = startLine[0];
	firstLine = startLine[1];
	block = [firstLine];

	while(!constants.regex.ifClose.test(rest[0])){
		block.push(rest.shift());
		if(!rest.length){
			throw new Error('Error: no closing line for each block.');
		}
	}
	rest.shift(); // get rid of "if;" closer

	result += init+'{\n';
	result += processLines(control, block, domain);
	result += '}\n';
	return result;
}

function makeEachBlock(control, startLine, rest, domain){
	var result = '';

	startLine = startLine.split('->');
	var init = startLine[0];
	var firstLine = startLine[1];
	var block = [firstLine];

	while(!constants.regex.each.test(rest[0])){
		block.push(rest.shift());
		if(!rest.length){
			throw new Error('Error: no closing line for each block.');
		}
	}

	rest.shift(); // get rid of "each;" closer

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

	if(domain === 'init'){
		line = line.replace(/Self/g, 'this.data');
	} else {
		line = line.replace(/Self/g, 'this.data[\"'+domain+'\"]');
	}
	if(constants.regex.returnExp.test(line)){
		line = line.replace(/\<\-/, '');
		line = 'return '+ line;
	} else if(constants.regex.notSpecial(line)){
		
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

	if(line.indexOf('.') === -1 && line.indexOf('=') === -1){
		return line;
	}
	if(constants.regex.assignment.test(line)){
		return line.split(' ')[0];
	}
	else if(constants.regex.simpleInvocation.test(line)){
		return line.split('.')[0];
	} else {
		throw new Error('Cant parse variable name of line: '+line);
	}
}
