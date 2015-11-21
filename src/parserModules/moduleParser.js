var _ = require('../utility/Util.js');
var constants = require('../utility/constants.js');
var Chunk = require('../utility/chunk.js');

module.exports = moduleParser = function(parseText, result){
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
		
		} else if(constants.is_semicolon(parseText.current()) ){
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

function getMethodData(parseText, result){
	var types = parseText.getSquare();
	types = _.removeEmpties(types.split(','));
	result.push(new Chunk('method_types', types))

	var args = parseText.getSquare();
	args = _.removeEmpties(args.split(','));
	result.push(new Chunk('method_args', args))

	var body = parseText.getCurly();
	result.push(new Chunk('method_body', body.split(/;|->/)))
	return result;
}