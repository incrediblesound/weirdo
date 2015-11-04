var _ = require('../Util.js');

module.exports = objectInit = function(data, control){
	if(!control.hasState('object')){
		throw new Error('Error: Init function outside of object definition');
	} else {
		var name = control.get('data');
		control.add('var '+name+' = function(){\n');
		control.add('var args = Array.prototype.slice.call(arguments);\n')
		var argsType = data[0].data;
		var argNames = data[1].data;
		if(_.notNull(argNames)){
			control.objects[name].argNames = argNames;
			_.setArgumentVariables(control, argNames);

			argsType = _.cleanSplit(',', argsType);
			if(argsType.length === 1){
				control.add(''+_.typeChecks[argsType]('args', ''+name+' Init'));
			} else {
				_.each(argNames, function(argName, i){
					console.log(argsType[i])
					control.add(''+_.typeChecks[argsType[i]](argName, ''+name+' Init'));
				})
			}
		} else {
			control.objects[name].argNames = false;
		}
		var body = data[2];
		addMethodBody(control, body, 'init')
		control.add('}\n')
		control.add(name+'.prototype = Object.create(wdo.wdo_object.prototype);\n');
	}
}