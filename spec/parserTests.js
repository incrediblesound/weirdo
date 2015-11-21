var ParseText = require('../src/utility/parseText.js');
var parsers = require('../src/parsers.js');
var data = require('./data/data.js');

describe("Main Parser", function(){
	it("parses instances", function(){
		var lines = data.instance;
		var result = parsers.mainParser(lines);
		result = result[0];
		expect(result).not.toBe(undefined);
		expect(result.type).toBe('instance');
		expect(result.data[0].type).toBe('reference');
		expect(result.data[1].type).toBe('reference');
	})
	it("parses invocations", function(){
		var lines = data.invocation;
		var result = parsers.mainParser(lines);
		result = result[0];
		expect(result).not.toBe(undefined);
		expect(result.type).toBe('invocation');
		expect(result.data.object).toBe('calc');
		expect(result.data.method).toBe('max');
		expect(result.data.args).toEqual(['7']);
	})
	it("parses initialization", function(){
		var lines = data.init;
		var result = parsers.mainParser(lines);
		result = result[0];
		var initialization = result.data[1];
		expect(initialization).not.toBe(undefined);
		expect(initialization.type).toBe('initialize');
		expect(initialization.data.object).toBe('Person');
		expect(initialization.data.args).toEqual(['"John"']);
	})
})

describe("Module Parser", function(){
	it("parses declarations", function(){
		var parseText = new ParseText(data.modulePieces.declaration);
		var result = parsers.moduleParser(parseText);
		expect(result[0].type).toBe('object_declaration');
		expect(result[0].data).toBe('Calc');
	})
	it("parses initialization", function(){
		var parseText = new ParseText(data.modulePieces.initialize);
		var result = parsers.moduleParser(parseText);
		expect(result[0].type).toBe('object_init');
		expect(result[0].data[0].type).toBe('method_types');
		expect(result[0].data[0].data).toEqual(['..']);
		expect(result[0].data[1].type).toBe('method_args');
		expect(result[0].data[1].data).toEqual(['..']);
		expect(result[0].data[2].type).toBe('method_body');
		expect(result[0].data[2].data[0]).toMatch(/.*Self\s=\s\{/);
		// expect(result[0].data).toBe('Calc');
	})
	it("parses methods", function(){
		var parseText = new ParseText(data.modulePieces.method_one);
		var result = parsers.moduleParser(parseText);
		expect(result[0].type).toBe('object_method');
		expect(result[0].data[0].type).toBe('method_name');
		expect(result[0].data[0].data).toBe('max');
		expect(result[0].data[1].type).toBe('method_types');
		expect(result[0].data[1].data).toEqual(['Num']);
		expect(result[0].data[2].type).toBe('method_args');
		expect(result[0].data[2].data).toEqual(['~']);
		expect(result[0].data[3].type).toBe('method_body');
		expect(result[0].data[3].data.length).toBe(3);
	})
	it("parses getters", function(){
		var parseText = new ParseText(data.modulePieces.getter);
		var result = parsers.moduleParser(parseText);
		expect(result[0].type).toBe('object_method');
		expect(result[0].data[0].type).toBe('method_name');
		expect(result[0].data[0].data).toBe('deviation');
		expect(result[0].data[1].type).toBe('method_types');
		expect(result[0].data[1].data).toEqual(['..']);
		expect(result[0].data[2].type).toBe('method_args');
		expect(result[0].data[2].data).toEqual(['->']);
		expect(result[0].data[3].type).toBe('method_body');
		expect(result[0].data[3].data.length).toBe(2);
	})
})