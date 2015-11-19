module.exports = {
	modules: [ '@Calc\n\nInit [..][..]{\n  Self = { \n  deviation: {num: 0, avg: 0, sum: 0, log: [], dev: 0 },\n  max: 0\n  };\n}\n\n.max [Num][~]{\n\tx = Self > n ? Self : n;\n\tSelf = x;\n}\n\n.deviation [..][->]{\n\t<- Self.dev;\n}\n\n.deviation [Num][~]{\n\tSelf.num++;\n\tSelf.sum += n;\n\tSelf.log.push(n);\n\tdiffs = [];\n\tx = Self.sum / Self.num;\n\teach Self.log y ->\n\t\tz = y - x;\n\t\tz = z * z;\n\t\tdiffs.push(z);\n\teach;\n\n\ta = 0;\n\teach diffs b ->\n\t\ta += b;\n\teach;\n\tc = a / diffs.length;\n\n\tSelf.dev = Math.sqrt(c);\n}',
  '@Person\n\nInit [Str][name]{\n\tSelf = {info: { name: name, age: null }}\n}\n\n.info [..][->]{\n\tx = Self.name + ", "+ Self.age + " yo."; \n\t<- x;\n}\n\n.info [Num, Str][age, name]{\n\tSelf.age = age;\n\tSelf.name = name;\n}\n\n@Another\n\nInit [..][..]{\n\tSelf = 0;\t\n}\n\n.info [..][n]{\n\tSelf = n\n}\n' ],
    main: [ '', 'calc <- Calc', 'person <- Person[ "John" ]', '', 'sum <- Num', 'dev <- Num', 'info <- Str', 'name <- Str', '', 'calc.max[ 2 , 3 ]', 'calc.max[ 13 ]', 'calc.max[ 7 ]', 'calc.deviation[ 13,24,56,81 ]', 'calc.deviation -> dev', 'sys.out[ dev ]', 'calc.deviation[ 42 ]', 'person.info[ 13, "John Doe" ]', '', 'calc.max -> sum', 'calc.deviation -> dev', 'person.info -> info', '', 'sys.out[ dev  ]', 'sys.out[ info ]' ],
    init: ['person <- Person[ "John" ]'],
    instance: ['string <- Str'],
    invocation: ['calc.max[ 7 ]'],
    modulePieces: {
	    declaration: '@Calc\n\n',
	    initialize: 'Init [..][..]{\n  Self = { \n  deviation: {num: 0, avg: 0, sum: 0, log: [], dev: 0 },\n  max: 0\n  };\n}\n\n',
	    method_one: '.max [Num][~]{\n\tx = Self > n ? Self : n;\n\tSelf = x;\n}\n\n',
	    getter: '.deviation [..][->]{\n\t<- Self.dev;\n}\n\n',
	    method_two:'.deviation [Num][~]{\n\tSelf.num++;\n\tSelf.sum += n;\n\tSelf.log.push(n);\n\tdiffs = [];\n\tx = Self.sum / Self.num;\n\teach Self.log y ->\n\t\tz = y - x;\n\t\tz = z * z;\n\t\tdiffs.push(z);\n\teach;\n\n\ta = 0;\n\teach diffs b ->\n\t\ta += b;\n\teach;\n\tc = a / diffs.length;\n\n\tSelf.dev = Math.sqrt(c);\n}'	
    },
    parsedPieces: {
    	objectDeclaration: [{"type":"object_declaration","data":"Calc"}],
    	objectMethod: [{"type":"object_method","data":[{"type":"method_name","data":"max"},{"type":"method_types","data":"Num"},{"type":"method_args","data":["~"]},{"type":"method_body","data":["\n\tx = Self > n ? Self : n","\n\tSelf = x","\n"]}]}]
    }
}