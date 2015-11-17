var _ = require('./utility/Util.js');
var esprima = require('esprima');

var METHOD_BODY_IDX = 2;

module.exports = prepareModuleState = function(pieces, control){
	var data = separateModules(pieces);
	_.each(data.name, function(name){
		var pieces = data.map[name];
		var initData = pieces[0].data;
		var methodPart = initData[ METHOD_BODY_IDX ];
		
		var index = _.regexFind(methodPart.data, /Self\s*\=.*/);
		if(index < 0){ throw new Error("Missing self statement for module "+name+".")}
		var line = methodPart.data[index];

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
			initData[ METHOD_BODY_IDX ].data[index] = 'Self = ' + JSON.stringify(newSelf);
		}
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