var _ =       require('../utility/Util.js');
var addMethodBody = require('./addMethodBody.js');

module.exports = objectMethod = function(data, control){
    if(!control.hasState('object')){
        throw new Error('Error: Object method outside of object definition');
    } else {

        var object_name = control.get('data');
        var method_name = data[0].data;
        var argTypes =    data[1].data;
        var argNames =    data[2].data;
        var body =        data[3];
        control.objects[object_name][method_name] = 
            control.objects[object_name][method_name] || {};
        if(argNames[0] === '->'){
            control.objects[object_name].getters[method_name] = true;
            control.add(object_name+'.prototype.'+method_name+'_getter = function(){\n');
            // there's an issue where addMethodBody might overwrite data about the main function
            // with data from the getter
            addMethodBody(control, body, method_name);
            control.add('}\n')
            return;
        }


        if(argNames[0] === '~'){
            control.add(object_name+'.prototype.'+method_name+' = function(){\n');
            control.add('var args = Array.prototype.slice.call(arguments);\n');

            control.objects[object_name][method_name].args = '~';
            control.add('var method_body = function(n){\n')
            addMethodBody(control, body, method_name);
            control.add('}\n')
            control.add('wdo.invokeRecursive(method_body, this, args);\n')
		}
		else if(_.notNull(argNames)){
            control.add(object_name+'.prototype.'+method_name+
                ' = function('+_.printArgs(argNames)+'){\n');
			control.objects[object_name][method_name].args = argNames;
		}
		else {
            control.add(object_name+'.prototype.'+method_name+' = function(){\n');
			control.objects[object_name][method_name].args = false;
		}

		if(_.notNull(argTypes)){
			control.objects[object_name][method_name].argTypes = argTypes;
		}

		addMethodBody(control, body, method_name)
		control.add('}\n')
	}
}