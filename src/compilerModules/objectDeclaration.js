module.exports = objectDeclaration = function(data, control){
	control.footer += 'wdo_modules.'+data+' = '+data+';\n';
	control.setState('object', data);
	control.objects[data] = {};
	control.objects[data].getters = {};
}