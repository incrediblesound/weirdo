var _ = require('../../utility/Util.js');

module.exports = processFatArrow = function (control, line, domain){
	line = line.split('=>')[1];

	var processMainLine = require('../../parserModules/processMainLine.js');
	var data = processMainLine(line).data;

	line = 'this.'+data.object+'('+_.printArgs(data.args)+')\n';
	return line;

}