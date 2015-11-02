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

module.exports = CompilerControl;