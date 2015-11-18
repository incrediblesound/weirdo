var _ = require('../utility/Util.js');
var constants = require('../utility/constants.js');
var Chunk = require('../utility/chunk.js');
var processMainLine = require('./processMainLine.js');
var processTildeExp = require('./processTildeExp.js');

module.exports = mainParser = function(lines){
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