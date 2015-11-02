var _ = require('../Util.js');

module.exports = addMethodBody = function(control, data, domain){
	var lines = data.data;
	var thisExp = new RegExp('^this');
	var returnExp = new RegExp('^\<\-');
	_.each(lines, function(line){
		line = line.replace(/\n|\t|\n\t/g, '');
		if(!line.length) return;
		while(line[0] === ' ' || line[0] === '\n'){
			line = line.substring(1, line.length);
		}
		line = line.replace(/Self/g, 'this.data[\"'+domain+'\"]');
		if(returnExp.test(line)){
			line = line.replace(/\<\-/, '');
			line = 'return '+ line;
		} else if(!thisExp.test(line)){
			line = 'var ' + line;
		}
		line = line + ';\n';
		control.add(line);
	})
}