var compilerModules = require('./compilerModules.js');

module.exports = compilePieces = function(pieces, control){
	each(pieces, function(piece){
		result = compilerModules[piece.type](piece.data, control);
	})
}

function each(arr, fn){
	var i = 0, l = arr.length;
	for(i; i < l; i++){
		fn(arr[i], i);
	}
}