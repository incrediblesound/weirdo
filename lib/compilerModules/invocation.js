var _ = require('../Util.js');
var wdo_core = require('../../wdo.js');

module.exports = invocation = function(data, control){
	if(control.variables[data.object] !== undefined){
		control.add(''+data.object+'.'+data.method+'(');
	} else if(control.objects[data.object] !== undefined){
		control.add('wdo_modules.'+data.object+'.'+data.method+'(');
	} else if(data.object === 'sys'){
		if(wdo_core[data.method] === undefined){
			throw new Error('Error: unknown core method: '+data.method);
		}
		control.add('wdo.'+data.method+'(');
	} else {
		throw new Error('Error: unknown object '+data.object);
	}
	control.add((data.args ? _.printArgs(data.args) : '') + ');\n');
}