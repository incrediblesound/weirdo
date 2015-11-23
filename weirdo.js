var fs = require('fs');
var program = require('commander');

var _ =				  require('./src/utility/Util.js');
var main =			  require('./src/main.js');
var constants =		  require('./src/utility/constants.js');
var fileComponents =  require('./src/utility/fileComponents.js');

program.parse(process.argv);

var src_arg = program.args[0];
var out_arg = program.args[1];
var copySource = program.args[2];
var programSource = _.getSourcePath(program.rawArgs[1]);

var sourcePath = _.getSourcePath(src_arg);
var outputPath = _.getSourcePath(out_arg);

var text = fs.readFileSync(''+src_arg+'.wdo').toString();

var mainLines = text.split(/\n|\r|\n\r/);

// strip the module declarations out of main
// fetch the text content of the modules
var moduleFiles = [];
var i = 0, l = mainLines.length;
for(i; i < l; i++){
	if(constants.regex.include.test(mainLines[i])){
		var module = mainLines[i];
		module = module.replace(/include |"/g, '')
		moduleFiles.push(module);	
	} else {
		break;
	}
}
mainLines = mainLines.slice(i, mainLines.length);

var moduleText = [];
_.each(moduleFiles, function(moduleName){
	var text = fs.readFileSync(sourcePath+'/'+moduleName+'.wdo').toString();
	moduleText.push(text);
})


var compiledText = main(moduleText, mainLines);
var finalResult;

if(copySource === 'nocore'){
	finalResult = fileComponents.simpleHeader;
} else {
	finalResult = fileComponents.headerString;	
}

finalResult += compiledText;

fs.writeFileSync(out_arg, finalResult);

if(copySource === 'src'){
	var readCore = fs.createReadStream(programSource+'/wdo.js');
	readCore.on('error', function(err){
		console.log('Error reading core file: '+err);
	})
	var writeCore = fs.createWriteStream(outputPath+'/wdo.js');
	readCore.on('error', function(err){
		console.log('Error writing core file: '+err);
	})
	readCore.pipe(writeCore);
}