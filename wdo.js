var readline = require('readline-sync');
var fs = require('fs');
var qs = require('querystring');
var http = require('http');
var mustache = require('mustache');
var events = require('events');

// Utility functions for convenience //

var output = function(obj){
	console.log(obj.get());
}

var input = function(value){
	var answer = readline.question('> ');
	value.set(answer);
	return value;
}

var loadText = function(path){
	var file = fs.readFileSync(path, 'utf8');
	file = file.toString();
	return file;
}

var processPost = function(req, res, callback) {
    var body = '';
    if(typeof callback !== 'function') return null;

    req.on('data', function(data) {
        body += data;
        if(body.length > 1e6) {
            body = '';
            res.writeHead(413, {'Content-Type': 'text/plain'}).end();
            req.connection.destroy();
        }
    });

    req.on('end', function() {
        body = qs.parse(body);
        callback(body);
    });
}

// renderView is a little silly: if I take the route of building lots
// of convenience functions this will be one of them. If instead I decide
// to improve support for external libraries, this will prob. go away.

var renderView = function(string, view){
	return mustache.render(string, view);
}

// Used to invoke recursive methods //

var invokeRecursive = function(func, context, args){
	while(args.length){
		func.apply(context, [args.shift()]);
	}
}

// basic types for Weirdo values //
var WdoValue = function(){}
WdoValue.prototype.get = function(){
	return this.value;
}

WdoValue.prototype.isWdoValue = function(){
	return true;
}

var _Number = function(){}
_Number.prototype = Object.create(WdoValue.prototype);
_Number.prototype.set = function(value){
	if(typeof value !== 'number'){
		throw new Error('Error: non-number assigned to number value');
	} else {
		this.value = value;
	}
}

var _String = function(){}
_String.prototype = Object.create(WdoValue.prototype);
_String.prototype.set = function(value){
	if(typeof value !== 'string'){
		throw new Error('Error: non-string assigned to string value');
	} else {
		this.value = value;
	}
}

var _Object = function(){}
_Object.prototype = Object.create(WdoValue.prototype);
_Object.prototype.set = function(value){
	if(typeof value !== 'object'){
		throw new Error('Error: non-object assigned to number value');
	} else {
		this.value = value;
	}
}

// Parent class of Weirdo modules //

var wdo_object = function(){};

wdo_object.prototype = Object.create(events.EventEmitter.prototype);

wdo_object.prototype.wdo_get = function(attr){
	if(this.data[attr] === undefined){
		throw new Error('Error: attribute \"'+attr+'\" has not been initialized.');
	} else {
		return this.data[attr];
	}
}

module.exports = {
	invokeRecursive: invokeRecursive,
	loadText: loadText,
	processPost: processPost,
	renderView: renderView,
	Num: _Number,
	Str: _String,
	Map: _Object,
	out: output,
	wdo_object: wdo_object,
	in: input
}