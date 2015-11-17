var _ = require('../utility/Util.js');
var processMainLine = require('../parserModules/processMainLine.js');
var processLines = require('./methodBodyModules/processLines.js');

/*
 * Because module methods are mostly JS but have some special sugar just for
 * them, they are parsed and compiled separately from the rest of the code.
 * the overall module syntax is parsed in parsers.js[moduleParser] but another
 * layer of parsing is done in this "compiler module" which branches off into
 * its own parser/compiler modules via processLines.js
 */

module.exports = addMethodBody = function(control, data, domain){
	control.objects[control.get('data')][domain] = control.objects[control.get('data')][domain] || {};
	if(control.objects[control.get('data')][domain].variables === undefined){
		control.objects[control.get('data')][domain].variables = [];
	}
	var lines = data.data;
	_.each(lines, function(line, i){
		lines[i] = line.replace(/\n|\t|\n\t/g, '');
	})
	control.add(processLines(control, lines, domain));
}
