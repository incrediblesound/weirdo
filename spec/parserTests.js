var ParseText = require('../lib/utility/parseText.js');
var parsers = require('../lib/parsers.js');

describe("Main Parser", function(){
	it("parses instances", function(){
		var lines = ['string <- Str\n'];
		var result = parsers.mainParser(lines);
		result = result[0];
		expect(result).not.toBe(undefined);
		expect(result.type).toBe('instance');
		expect(result.data[0].type).toBe('reference');
		expect(result.data[1].type).toBe('reference');
	})
})