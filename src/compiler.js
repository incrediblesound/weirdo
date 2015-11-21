var _ = require('./utility/Util.js');
var modules = require('./compilerModules/modules.js');

module.exports = compilePieces = function(pieces, control){
	_.each(pieces, function(piece){
		result = modules[piece.type](piece.data, control);
	})
}
