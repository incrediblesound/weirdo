var ParseText = require('../utility/parseText.js');
var constants = require('../utility/constants.js');
var _ = require('../utility/Util.js');

module.exports = processTildeExp = function(line){
	var parseText = new ParseText(line);
	var type = parseText.getWord();
	var content = parseText.getSquare();
	return [type, content]
}