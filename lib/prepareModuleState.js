var _ = require('./utility/Util.js');
var esprima = require('esprima');

module.exports = prepareModuleState = function(pieces){
	var data = separateModules(pieces);
	_.each(data.name, function(name){
		var pieces = data.map[name];
		var initData = pieces[0].data;
		_.each(initData, function(methodPart, idx_a){
			if(methodPart.type === 'method_body'){
				_.each(methodPart.data, function(line, idx_b){
					if(/Self\s*\=.*/.test(line)){
						var ast = esprima.parse(line);
						var selfValue = ast.body[0].expression;
						if(selfValue.right.type === 'ObjectExpression'){
							return;
						} else {
							var value = selfValue.right.raw;
							var newSelf = {};
							for(var i = 1; i < pieces.length; i++){
								var method = pieces[i];
								var methodName = method.data[0].data;
								newSelf[ methodName ] = value;
							}
							initData[idx_a].data[idx_b] = 'Self = ' + JSON.stringify(newSelf);
						}
					}
				})
			}
		})
	})
	return pieces;
}

function separateModules(pieces){
	var moduleNames = [];
	var modules = {};
	var currentModule;

	var l = pieces.length;
	for(var i = 0; i < l; i++){
		var piece = pieces[i];
		if(piece.type === 'object_declaration'){
			modules[piece.data] = [];
			currentModule = piece.data;
			moduleNames.push(currentModule);
		} else {
			modules[currentModule].push(piece);
		}
	}
	return { name: moduleNames, map: modules };
}