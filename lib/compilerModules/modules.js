var assignment = require('./assignment.js');
var objectInit = require('./objectInit.js');
var addMethodBody = require('./addMethodBody.js');
var instance = require('./instance.js');
var invocation = require('./invocation.js');
var tildeBlock = require('./tildeBlock.js');
var compileArguments = require('./compileArgs.js');
var objectDelaration = require('./objectDeclaration.js');
var objectMethod = require('./objectMethod.js');

module.exports = {
	assignment: assignment,
	objectInit: objectInit,
	addMethodBody: addMethodBody,
	instance: instance,
	invocation: invocation,
	tildeBlock: tildeBlock,
	compileArguments: compileArguments,
	objectMethod: objectMethod,
	objectDeclaration: objectDeclaration
}
