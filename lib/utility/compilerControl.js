var CompilerControl = function(){
	this.state = {
		current: null,
		data: null
	};
	this.objects = {};
	this.variables = {};
	this.result = '';
	this.footer = '';
}

CompilerControl.prototype.empty = function(){
	var result = this.result + this.footer;
	this.result = '';
	this.footer = '';
	return result;
}

CompilerControl.prototype.add = function(text){
	this.result += text;
}

CompilerControl.prototype.get = function(prop){
	return this.state[prop];
}

CompilerControl.prototype.getObject = function(obj, prop){
	return this.objects[obj][prop];
}

CompilerControl.prototype.setObjectProp = function(obj, prop, val){
	this.objects[obj][prop] = val;
}

CompilerControl.prototype.hasState = function(state){
	return this.state.current === state;
}

CompilerControl.prototype.setState = function(state, data){
	if(state){
		this.state.current = state;
	}
	if(data){
		this.state.data = data;
	}
}

CompilerControl.prototype.cleanTail = function(){
	while(this.result[this.result.length-1] === '\n'||
		  this.result[this.result.length-1] === ';' ||
		  this.result[this.result.length-1] === ' '){
		this.result = this.result.substring(0, this.result.length-1);
	}
}

module.exports = CompilerControl;