var _ = require('../utility/Util.js');
var wdo_core = require('../../wdo.js');

module.exports = instance = function(data, control){
	var left = data[0], right = data[1];
	control.variables[left.data] = right.data.object || right.data;
	var object, args;
	if(right.type === 'initialize'){
		object = right.data.object;
		args = right.data.args;
		if(control.objects[object] !== undefined){
			control.add('var '+left.data+' = new wdo_modules.'+object+'(');
			control.add((args ? _.printArgs(args) : '') + ');\n');
		} else if(wdo_core[object] !== undefined){
			control.add('var '+left.data+' = new wdo.'+object+'(');
			control.add((args ? _.printArgs(args) : '') + ');\n');
		}
	} else {
		object = right.data;
		if(control.objects[right.data] !== undefined){
			control.add('var '+left.data+' = new wdo_modules.'+object+'();\n');
		} else if(wdo_core[object] !== undefined){
			control.add('var '+left.data+' = new wdo.'+object+'();\n');
		}
	}
}