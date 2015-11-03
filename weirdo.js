var fs = require('fs');

var _ =				  require('./lib/Util.js');
var parsers = 		  require('./lib/tokenStream.js');
var ParseText = 	  require('./lib/parseText.js');
var CompilerControl = require('./lib/compilerControl.js');
var compilePieces =   require('./lib/compiler.js');
var fileComponents =  require('./lib/fileComponents.js');
var program = 	  	  require('commander');

program.parse(process.argv);
var src_arg = program.args[0];
var out_arg = program.args[1];

var pathParts = src_arg.split('/');
pathParts.pop();
var sourcePath = pathParts.join('/');

var text = fs.readFileSync(''+src_arg+'.wdo').toString();
var mainLines = text.split(/\n|\r|\n\r/);

var include = new RegExp('^include \".+\"');
var moduleFiles = [];

while(include.test(mainLines[0])){
	var module = mainLines.shift();
	module = module.replace(/include |"/g, '')
	moduleFiles.push(module);
}


var control = new CompilerControl();

var finalResult = fileComponents.headerString;
var parseText, pieces, moduleText;

_.each(moduleFiles, function(module){
	moduleText = fs.readFileSync(sourcePath+'/'+module+'.wdo').toString();
	parseText = new ParseText(moduleText);
	pieces = parsers.moduleParser(parseText);
	compilePieces(pieces, control);
	finalResult += control.empty();
})

mainLines = _.removeEmpties(mainLines);
pieces = parsers.mainParser(mainLines);

compilePieces(pieces, control);

finalResult += control.empty();
fs.writeFileSync(out_arg, finalResult);
