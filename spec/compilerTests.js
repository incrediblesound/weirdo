var compiler = require('../lib/compiler.js');
var Control = require('../lib/utility/compilerControl.js');
var data = require('./data/data.js');

describe("Compile Modules", function(){
	it("transpiles module methods", function(){
		var control = new Control();
		var declaration = data.parsedPieces.objectDeclaration;
		compiler(declaration, control);
		console.log(control);
		var method = data.parsedPieces.objectMethod;
		compiler(method, control);
	})
})