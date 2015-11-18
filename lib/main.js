var _ =				  require('./utility/Util.js');
var compilePieces =   require('./compiler.js');
var parsers = 		  require('./parsers.js');
var prepModuleState = require('./prepareModuleState.js');
var CompilerControl = require('./utility/compilerControl.js');
var ParseText = 	  require('./utility/parseText.js');

module.exports = main = function(modules, main){
console.log(modules);
console.log(main);
	var IS_MODULE = true;
	var IS_MAIN = false;

	var control = new CompilerControl();

	var parseText, pieces, moduleText;

	_.each(modules, function(module){
		parseText = new ParseText(module);
		pieces = parsers.moduleParser(parseText);
		prepModuleState(pieces, control);
		compilePieces(pieces, control);

		control.empty();
	})

	main = _.removeEmpties(main);
	pieces = parsers.mainParser(main);
	compilePieces(pieces, control, IS_MAIN);

	control.empty();

	return control.finalResult;

}