var _ = require('../utility/Util.js');

module.exports = objectInit = function(data, control){
	if(!control.hasState('object')){
		throw new Error('Error: Init function outside of object definition');
	} else {
		var name = control.get('data');
		var argTypes = data[0].data;
		var argNames = data[1].data;
		var body = data[2];

		control.add('var '+name+' = function(){\n');
		control.add('var args = Array.prototype.slice.call(arguments);\n')

		if(_.notNull(argNames)){

			_.setArgumentVariables(control, argNames);

		} else {
			control.objects[name].argNames = false;
		}
		
		addMethodBody(control, body, 'init');
		control.add('}\n');
		control.add(name+'.prototype = Object.create(wdo.wdo_object.prototype);\n');
	}
}