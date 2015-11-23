var _ = require('../../utility/Util.js');
var ParseText = require('../../utility/parseText.js');
var constants = require('../../utility/constants');
var esprima = 	require('esprima');
var makeEachBlock = require('./makeEachBlock.js');
var makeIfBlock = 	require('./makeIfBlock.js');
var processFatArrow = require('./processFatArrow.js');

module.exports = processLines = function(control, lines, domain, checkIf){
	var result = '', line;
	while(lines.length){
		line = lines.shift();
		if(line.length){
			line = _.removeLeadingJunk(line);
			line = basicLineProcess(control, line, domain);

			// special syntax caught here
			if(constants.regex.each.test(line)){
				line = makeEachBlock(control, line, lines, domain);
			}
			else if(constants.regex.eventSymbol.test(line)){
				// this function @ line 79 this file
				line = processEventCall(line);
			}
			else if(constants.regex.ifOpen.test(line) && !(checkIf === false)){
				line = makeIfBlock(control, line, lines, domain);
			}
			else if(constants.regex.fatArrow.test(line)){
				line = processFatArrow(control, line, domain);
			}

			line = line + ';\n';
			result += line;
		}

	}
	return result;
}

function basicLineProcess(control, line, domain){
	var objectName = control.state.data;
	var recursiveCall = /^\..*\(/;

	if(domain === 'init'){
		line = line.replace(/Self/g, 'this.data');
	} else {
		line = line.replace(/Self/g, 'this.data[\"'+domain+'\"]');
	}

	line = line.replace(/sys./g, 'wdo.');
	if(recursiveCall.test(line)){
		line = 'this'+line;
	}

	if(constants.regex.returnExp.test(line)){
		line = line.replace(/\<\-/, '');
		line = 'return '+ line;
	} else if(constants.regex.notSpecial(line)){
		var parsedExp;
		try {
			parsedExp = esprima.parse(line).body[0]
		} catch(e){
			return line;
		}
		// convoluted code to determine whether or not to add "var"
		// TODO: replace with non-convoluted code
		if(parsedExp.expression !== undefined){
			var expression = parsedExp.expression;
			if(expression.type !== 'CallExpression' &&
			   expression.left.type !== 'MemberExpression'){
				var varName = expression.type === 'AssignmentExpression' ? expression.left.name : expression.callee.object.name;
				var methodVariables = control.objects[control.get('data')][domain].variables;
				if(methodVariables[varName] === undefined){
					line = 'var ' + line;
					methodVariables[varName] = true;
		 		}
			}
		}
	}
	return line;
}

function processEventCall(line){
	line = line.substring(1, line.length);
	var parser = new ParseText(line);
	var eventName = parser.getWord();
	var arg = parser.getParens();
	line = 'this.emit(\"'+eventName+'\"';
	if(arg !== undefined){
		line += ', '+arg+');\n';
	} else {
		line += ');\n';
	}
	return line;
}