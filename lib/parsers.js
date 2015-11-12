var constants = require('./utility/constants.js');
var Chunk = 	require('./utility/chunk.js');
var ParseText = require('./utility/parseText.js');
var processMainLine = require('./parserModules/processMainLine.js');
var processTildeExp = require('./parserModules/processTildeExp.js');
var _ = require('./utility/Util.js');

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

var mainParser = function(lines){
	var result = [];
	while(lines.length){
		var line = lines.shift();
		if(_.isInstance(line)){
			line = line.split('<-');
			var left = processMainLine(line[0]);
			var right = processMainLine(line[1]);
			result.push(new Chunk('instance', [left, right]))
		} 
		else if(_.isAssignment(line)){
			line = line.split('->');
			var left = processMainLine(line[0]);
			var right = processMainLine(line[1]);
			result.push(new Chunk('assignment', [left, right]))
		}
		else if(_.beginsWithTilde(line)){
			line = line.substring(1, line.length);
			line = processTildeExp(line);
			line[1] = mainParser([line[1]]);
			var block = [];
			while(!_.beginsWithTilde(lines[0])){
				block.push(mainParser([lines.shift()]));
			}
			lines.shift(); // get rid of closing "~"
			result.push(new Chunk('tildeExpression', line.concat(block)));
		} 
		else {
			line = processMainLine(line);
			result.push(line);
		}
	}
	return result;
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
