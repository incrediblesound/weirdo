var _ = require('../utility/Util.js');
var Chunk = require('../utility/chunk.js');

module.exports = processMainLine = function (string){

	string = _.trim(string);
	var isInit = /\[.*\]/;
	var isInvocation = /.*\..*\[.*\]/;

	if(!isInit.test(string)){
		return new Chunk('reference', string);
	}
	else if(isInvocation.test(string)){
		var parseText = new ParseText(string);

		var object = parseText.getWord();
		parseText.advance();
		var method = parseText.getWord();
		var args = parseText.getSquare();

		args = _.removeEmpties(args.split(','));

		return new Chunk('invocation', { 
			object: object, 
			method: method, 
			args: args 
		});

	} else if(isInit.test(string)){
		var parseText = new ParseText(string);

		var name = parseText.getWord();
		var args = parseText.getSquare();

		args = _.removeEmpties(args.split(','));

		return new Chunk('initialize', { object: name, args: args });

	} else {
		throw new Error('Syntax error for line: '+string);
	}
}