var compiler = require('../lib/compiler.js');
var Control = require('../lib/utility/compilerControl.js');
var data = require('./data/data.js');

describe("Compile Modules", function(){
	it("transpiles module methods", function(){
		var control = new Control();
		var declaration = data.parsedPieces.objectDeclaration;

		compiler(declaration, control);

		expect(control.objects["Calc"]).toEqual({ getters: {} });
		expect(control.footer).toBe('wdo_modules.Calc = Calc;\n');

		var method = data.parsedPieces.objectMethod;
		compiler(method, control);

		expect(control.objects.Calc.max).toBeDefined();
		expect(control.objects.Calc.max).toEqual({ args: '~', variables: { x:true }, argTypes: 'Num' })
		expect(control.result).toBe('Calc.prototype.max = function(){\nvar args = Array.prototype.slice.call(arguments);\nvar method_body = function(n){\nvar x = this.data["max"] > n ? this.data["max"] : n;\nthis.data["max"] = x;\n}\nwdo.invokeRecursive(method_body, this, args);\nx = this.data["max"] > n ? this.data["max"] : n;\nthis.data["max"] = x;\n}\n');
	})
})