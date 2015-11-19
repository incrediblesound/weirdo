var constants = require('../../utility/constants.js');
var ParseText = require('../../utility/parseText.js');

module.exports = makeIfBlock = function (control, startLine, rest, domain){
	var processLines = require('./processLines.js');
	var innerCount = 1;
	var result = '';
	var block = [];
	while(innerCount > 0 && rest.length){
		var line = rest.shift();
		if(line === 'if'){
			innerCount--;
			block.push('}');
		}
		else if(constants.regex.ifOpen.test(line)){
			innerCount++;
			block.push(line+'{\n');

		}
		else if(constants.regex.elseIf.test(line)){
			var parser = new ParseText(line);
			parser.getWord();
			var expression = parser.getParens();

			line = '} else if('+expression+'){\n';

			block.push(line);

		} else if(line === 'else'){
			var elseExp = '} else {\n';

			block.push(elseExp);

		} else {
			block.push(line);
		}

		if(!rest.length && innerCount > 0){
			throw new Error('Error: no closing line for if block.');
		}
	}
	result += startLine +'{\n';
	result += processLines(control, block, domain, false);
	return result;
}
