
module.exports = assignment = function(data, control){
	var target = data[1], source = data[0];
	control.add(target.data+'.set(');
	var object, method;
	if(source.data.split('.').length === 2){
		object = source.data.split('.')[0];
		method = source.data.split('.')[1];
	} else {
		object = source.data;
	}
	if(control.variables[object] !== undefined && 
		method === undefined && 
		control.objects[control.variables[object]] === undefined){
		// either you're a variable without a method
		control.add(object+'.get()');
	} else {
		// or you're an object instance...? this needs a better mechanism
		var prototype = control.variables[object];
		if(control.objects[prototype] && control.objects[prototype].getters[method] === true){
			control.add(object+'.'+method+'_getter()');
		} else {
			control.add(object+'.wdo_get("'+method+'")');
		}
	}
	control.add(');\n');
}