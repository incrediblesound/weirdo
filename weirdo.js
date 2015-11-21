var fs = require('fs');
var program = require('commander');

var _ =				  require('./src/utility/Util.js');
var main =			  require('./src/main.js');
var constants =		  require('./src/utility/constants.js');
var fileComponents =  require('./src/utility/fileComponents.js');

program.parse(process.argv);

var src_arg = program.args[0];
var out_arg = program.args[1];
var sourcePath = src_arg.split('/');
sourcePath.pop();
sourcePath = sourcePath.join('/');

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

var finalResult = fileComponents.headerString;
finalResult += compiledText;

fs.writeFileSync(out_arg, finalResult);