var constants = require('./constants.js');

module.exports = ParseText = function(text){
	this.text = text;
	this.index = 0;
}

ParseText.prototype.done = function(){
	return this.index >= this.text.length;
}

ParseText.prototype.current = function(){
	return this.text[this.index];
}

ParseText.prototype.advance = function(){
	this.index++;
}

ParseText.prototype.getWord = function(){
	this.nextWord();
	var result = '';
	while(constants.letters.contains( this.current() )){
		result += this.current();
		this.advance();
	}
	return result;
}

ParseText.prototype.checkWord = function(word){
	if(word.length > this.text.length - this.index){
		return false;	
	} 

	var dummyIndex = this.index;
	while(!constants.letters.contains(this.text[dummyIndex])){
		dummyIndex++;
	}
	var result = '';
	while(constants.letters.contains( this.text[dummyIndex] )){
		result += this.text[dummyIndex];
		dummyIndex++;
	}
	return result === word;
}

ParseText.prototype.nextWord = function(){
	while(!constants.letters.contains(this.current())){
		this.advance();
	}
}

ParseText.prototype.nextToken = function(){
	while(constants.empty.contains(this.current())
		&& !this.done()){
		this.advance();
	}
}

ParseText.prototype.getSquare = PARSE_MATCHED('square bracket', 'is_open_square','matched_square')

ParseText.prototype.getQuote = PARSE_MATCHED('open quote', 'is_quote','matched_quote')

ParseText.prototype.simpleExpression = function(){
	var result = {};
	result.left = this.nextChunk();
	result.operator = this.getOperator();
	result.right = this.nextChunk();
	return result;
}

ParseText.prototype.nextChunk = function(){
	this.nextToken();
	var result = '';
	while(constants.everything.contains(this.current())){
		result += this.current();
		this.advance();
	}
	return result;
}

ParseText.prototype.getOperator = function(){
	var result = '';
	this.nextToken();
	while(constants.operators.contains(this.current())){
		result += this.current();
		this.advance();
	}
	return result;
}

ParseText.prototype.getCurly = PARSE_MATCHED('curly brace', 'is_open_curly','matched_curly')


function PARSE_MATCHED(name, is_a, getMatched){
	return function(){
		this.nextToken();
		if(!constants[is_a](this.current())){
			throw new Error('Expected '+name);
		} else {
			var result = constants[getMatched](this);
		}
		this.advance();
		return result;
	}
}