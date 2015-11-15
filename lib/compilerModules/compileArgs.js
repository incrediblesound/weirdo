var _ = require('../utility/Util.js');

module.exports = compileArguments = 
function(control, argNames, argTypes, method_name){
	if(argNames === '~' || argTypes.length === 1){
		control.add(''+_.typeChecks[argTypes]('args', method_name));
	} else {
		_.each(argNames, function(argName, i){
			control.add(''+_.typeChecks[argTypes[i]](argName, method_name));
		})
	}
}