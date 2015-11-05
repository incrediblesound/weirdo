var constants = require('./constants.js');
var Chunk = require('./chunk.js');
var ParseText = require('./parseText.js');
var _ = require('./Util.js');

var moduleParser = function(parseText, result){
	result = result || [];
	parseText.nextToken();
	while(!parseText.done()){
		if(constants.is_at_sign(parseText.current())){
			var data = parseText.getWord();
			var type = 'object_declaration';
			result.push(new Chunk(type, data));
		} else if(constants.is_dot(parseText.current())){

			var name = parseText.getWord();
			var method_chunks = [new Chunk('method_name', name)]
			result.push(
				new Chunk('object_method', getMethodData(parseText, method_chunks))
				)
			
		} else if(parseText.checkWord('Init')){
			parseText.getWord();
			result.push(new Chunk('object_init', getMethodData(parseText, [])))
			
		// } else if(parseText.checkWord('Self')){
		// 	var expression = parseText.simpleExpression();
		// 	result.push(new Chunk('simple_expression', expression));
		} else if( constants.is_semicolon(parseText.current()) ){
			result.push(new Chunk('end_object'));
			parseText.advance();
		} else if(parseText.checkWord('import')){
			parseText.getWord();
			var module = parseText.getQuote();
			result.push(new Chunk('import', module));
		} else if(constants.is_underscore(parseText.current())){
			parseText.advance();
			var name = parseText.getWord();
			var operator = parseText.getOperator();
			var target = parseText.nextChunk();
			result.push(new Chunk('instance', {
				name: name,
				operator: operator,
				target: target
			}))
		}
		else {
			parseText.advance();
		}
		parseText.nextToken();
	}
	return result;
}

var mainParser = function(lines){
	var result = [];
	_.each(lines, function(line){
		if(_.isInstance(line)){
			line = line.split('<-');
			var left = processInvocation(line[0]);
			var right = processInvocation(line[1]);
			result.push(new Chunk('instance', [left, right]))
		} 
		else if(_.isAssignment(line)){
			line = line.split('->');
			var left = processInvocation(line[0]);
			var right = processInvocation(line[1]);
			result.push(new Chunk('assignment', [left, right]))
		} else {
			line = processInvocation(line);
			result.push(line);
		}
	})
	return result;
}

function processInvocation(string){
	string = _.trim(string);
	var isInit = /\[.*\]/;
	var isInvocation = /.*\..*\[.*\]/;
	if(!isInit.test(string)){
		return new Chunk('reference', string);
	}
	if(isInvocation.test(string)){
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

module.exports = {
	moduleParser: moduleParser,
	mainParser: mainParser	
}

function getMethodData(parseText, result){
	var types = parseText.getSquare();
	result.push(new Chunk('method_types', types))

	var args = parseText.getSquare();
	args = _.removeEmpties(args.split(','));
	result.push(new Chunk('method_args', args))

	var body = parseText.getCurly();
	result.push(new Chunk('method_body', body.split(';')))
	return result;
}
