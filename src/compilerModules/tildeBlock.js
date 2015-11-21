var _ = require('../utility/Util.js');

module.exports = tildeExpression = function(data, control){
	var expType = data.shift();
	if(expType === 'on'){
		tildeOn(data, control);
	}
	else if(expType === 'loop'){
		tildeLoop(data, control);
	}
}

function tildeLoop(data, control){
	var moduleMap = require('../compilerModules.js');

	var id = _.makeId();
	var test = data.shift()[0];
	control.add('var '+id+'_loop = function(){\n')
	while(data.length){
		var current = data.shift()[0];
		moduleMap[current.type](current.data, control);
	}
	control.add('if(');
	moduleMap[test.type](test.data, control);
	control.cleanTail();

	control.add('){\n'+id+'_loop();\n}\n}\n');
	control.add(''+id+'_loop();\n')
}

function tildeOn(data, control){
	var moduleMap = require('../compilerModules.js');

	var source = data.shift()[0];
	if(source === 'sys.server.receive'){
		httpServer(data, control);
	} else {
		moduleEvent(source, data, control);
	}
}

function httpServer(data, control){
	var moduleMap = require('../compilerModules.js');

	var id = _.makeId();
	control.add('var '+id+'_event = function(request, response){\n');
	while(data.length){
		var current = data.shift()[0];
		moduleMap[current.type](current.data, control);
	}
	control.add('}\n');
	control.add('var http = require(\'http\');\n');
	control.add('var server = http.createServer('+id+'_event);\n');
	control.add('var PORT = process.env.PORT || 3000;\n');
	control.add('server.listen(PORT);\n')
	control.add('console.log("http server listening on port "+PORT);\n');
}

function moduleEvent(source, data, control){
	var moduleMap = require('../compilerModules.js');

	var path = source.data.split('.');
	var module = path[0];
	var eventName = path[1];
	var id = _.makeId();
	control.add('var '+id+'_event = function(data){\n');
	while(data.length){
		var current = data.shift()[0];
		moduleMap[current.type](current.data, control);
	}
	control.add('}\n');
	control.add(module+'.on(\"'+eventName+'\", '+id+'_event);\n');
}