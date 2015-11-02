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
	if(control.variables[object] !== undefined && method === undefined){
		// either you're a variable without a method
		control.add(object+'.get()');
	} else {
		// or you're an object instance...? this needs a better mechanism
		control.add(object+'.wdo_get("'+method+'")');
	}
	control.add(');\n');
}