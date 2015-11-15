var constants = require('../../utility/constants.js');
var ParseText = require('../../utility/parseText.js');

module.exports = makeIfBlock = function (control, startLine, rest, domain){

	var result = '', init, firstLine, block;
	startLine = startLine.split('->');

	init = startLine[0];
	firstLine = startLine[1];
	block = [firstLine];

	while(!constants.regex.ifClose.test(rest[0])){
		var line = rest.shift();
		var hasElse = false;
		if(constants.regex.elseIf.test(line)){
			var parts = line.split('->');
			line = parts[0];
			console.log(line);
			var parser = new ParseText(line);
			parser.getWord();
			var expression = parser.getParens();
			line = '} else if('+expression+'){\n';
			block.push(line);
			block.push(parts[1]);

		} else if(constants.regex.elseExp.test(line)){
			hasElse = true;
			var line = line.split('->')[1];
			var elseExp = '} else {\n';
			block.push(elseExp);
			block.push(line);

		} else {
			block.push(line);
		}
		if(!rest.length){
			throw new Error('Error: no closing line for each block.');
		}
	}
	rest.shift(); // get rid of "if;" closer
	
	result += init+'{\n';

	var processLines = require('./processLines.js');
	result += processLines(control, block, domain);
	result += '}\n';
	return result;
}