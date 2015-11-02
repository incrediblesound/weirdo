var _ = require('./Util.js');
var compilerModules = require('./compilerModules.js');

module.exports = compilePieces = function(pieces, control){
	_.each(pieces, function(piece){
		result = compilerModules[piece.type](piece.data, control);
	})
}
