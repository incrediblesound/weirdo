var _ = require('../../utility/Util.js');
var constants = require('../../utility/constants');
var esprima = 	require('esprima');
var makeEachBlock = require('./makeEachBlock.js');
var makeIfBlock = 	require('./makeIfBlock.js');
var processFatArrow = require('./processFatArrow.js');

module.exports = processLines = function(control, lines, domain){
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
			else if(constants.regex.ifOpen.test(line)){
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

	if(domain === 'init'){
		line = line.replace(/Self/g, 'this.data');
	} else {
		line = line.replace(/Self/g, 'this.data[\"'+domain+'\"]');
	}
	line = line.replace(/sys./, 'wdo.');

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
			if(expression.type !== 'CallExpression'){
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