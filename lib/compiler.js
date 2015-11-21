var _ = require('./utility/Util.js');
var modules = require('./compilerModules/modules.js');

var moduleMap = {
	'object_declaration': modules.objectDeclaration,
	'object_method': modules.objectMethod,
	'tildeExpression': modules.tildeBlock,
    'object_init': modules.objectInit,
	'instance': modules.instance,
	'invocation': modules.invocation,
	'assignment': modules.assignment
}

module.exports = compilePieces = function(pieces, control){
	_.each(pieces, function(piece){
		result = moduleMap[piece.type](piece.data, control);
	})
}
