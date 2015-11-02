var _ = require('../Util.js');

module.exports = objectInit = function(data, control){
	if(!control.hasState('object')){
		throw new Error('Error: Init function outside of object definition');
	} else {
		var name = control.get('data');
		control.add('var '+name+' = function(){\n');
		control.add('var args = Array.prototype.slice.call(arguments);\n')
		var argsType = data[0].data;
		if(_.notNull(argsType)){
			control.add(''+_.typeChecks[argsType](name+' Init'));
		}
		var argNames = data[1].data;
		if(_.notNull(argNames)){
			control.objects[name].argNames = argNames;
			_.setArgumentVariables(control, argNames);
		} else {
			control.objects[name].argNames = false;
		}
		var body = data[2];
		control.add('this.data = {};\n');
		addMethodBody(control, body, 'init')
		control.add('}\n')
	}
}