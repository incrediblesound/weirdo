var assignment = require('./assignment.js');
var objectInit = require('./objectInit.js');
var addMethodBody = require('./addMethodBody.js');

var typeChecks = {
	Num: function(method_name){
		return 'wdo.argsAreNumbers(args, "'+method_name+'");\n';
	},
	Str: function(method_name){
		return 'wdo.argsAreStrings(args, "'+method_name+'");\n';
	},
	Obj: function(method_name){
		return 'wdo.argsAreObjects(args,"'+method_name+'");\n';
	},
}

module.exports = {
	assignment: assignment,
	objectInit: objectInit,
	addMethodBody: addMethodBody,
	typeChecks: typeChecks
}
