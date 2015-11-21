var constants = require('../../utility/constants');

module.exports = makeEachBlock = function (control, startLine, rest, domain){
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
	
	var processLines = require('./processLines.js');
	result += processLines(control, block, domain);

	result += '}';
	return result;
}