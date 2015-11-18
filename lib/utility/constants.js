var Set = require('./set.js');

var constants = {};

constants.letters = new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_');
constants.numbers = new Set('0123456789');
constants.operators = new Set('!@$.:;*/-+=&|');
constants.empty = new Set(' \n\t');
constants.control = new Set('[]{}()<>');
constants.everything = constants.operators.with(constants.numbers.with(constants.letters.with(constants.control)));

constants.OPEN_SQUARE =  '[';
constants.CLOSE_SQUARE = ']';
constants.OPEN_CURLY =   '{';
constants.CLOSE_CURLY =  '}';
constants.OPEN_PARENS =  '(';
constants.CLOSE_PARENS = ')';
constants.OPEN_ANGLE =   '<';
constants.CLOSE_ANGLE =  '>';

constants.regex = {}
constants.regex.each = 			   new RegExp('^each');
constants.regex.ifOpen = 		   /^if\s*\(/;
constants.regex.elseIf =		   /^elif\s*\(/;
constants.regex.elseExp =		   /^else ->/;
constants.regex.jsElseIf =		   /else if\s*\(/;
constants.regex.jsElse =		   /\} else \{/;
constants.regex.ifClose =		   new RegExp('^if');
constants.regex.thisExp = 		   new RegExp('^this');
constants.regex.returnExp = 	   new RegExp('^\<\-');
constants.regex.simpleInvocation = new RegExp('.*\..*\(.*\)');
constants.regex.assignment = 	   new RegExp('.* .* .*');
constants.regex.fatArrow =		   new RegExp('^\=\>');
constants.regex.eventSymbol =	   new RegExp('^@');
constants.regex.include = 		   new RegExp('^include \".+\"');
constants.regex.notSpecial = function(string){
	return (
		!constants.regex.thisExp.test(string) &&
		!constants.regex.each.test(string) &&
		!constants.regex.ifOpen.test(string) &&
		!constants.regex.jsElseIf.test(string) &&
		!constants.regex.jsElse.test(string) &&
		!constants.regex.fatArrow.test(string)
		)
}

constants.QUOTE =  	  '"';
constants.DOT =    	  '.';
constants.COLON =  	  ':';
constants.EQUALS = 	  '=';
constants.PLUS =   	  '+';
constants.MINUS =  	  '-';
constants.AT =     	  '@';
constants.SEMICOLON = ';';
constants.UNDERSCORE ='_';

constants.is_open_square =  MATCH_CHAR(constants.OPEN_SQUARE);
constants.is_close_square = MATCH_CHAR(constants.CLOSE_SQUARE);
constants.is_open_curly =   MATCH_CHAR(constants.OPEN_CURLY);
constants.is_close_curly =  MATCH_CHAR(constants.CLOSE_CURLY);
constants.is_open_parens =  MATCH_CHAR(constants.OPEN_PARENS);
constants.is_close_parens = MATCH_CHAR(constants.CLOSE_PARENS);
constants.is_open_angle =   MATCH_CHAR(constants.OPEN_ANGLE);
constants.is_close_angle =  MATCH_CHAR(constants.CLOSE_ANGLE);
constants.is_at_sign = 		MATCH_CHAR(constants.AT);
constants.is_dot = 			MATCH_CHAR(constants.DOT);
constants.is_semicolon = 	MATCH_CHAR(constants.SEMICOLON);
constants.is_quote = 		MATCH_CHAR(constants.QUOTE);
constants.is_underscore =	MATCH_CHAR(constants.UNDERSCORE);
constants.is_space =		MATCH_CHAR(' ');
constants.is_newline =		MATCH_CHAR('\n');
constants.is_tab =			MATCH_CHAR('\t');

constants.is_empty = function(ch){
	return (
		constants.is_space(ch) ||
		constants.is_newline(ch) ||
		constants.is_tab(ch)
	)
}

constants.matched_square =  GET_MATCHED(constants.OPEN_SQUARE, constants.CLOSE_SQUARE);
constants.matched_curly =   GET_MATCHED(constants.OPEN_CURLY, constants.CLOSE_CURLY);
constants.matched_parens =  GET_MATCHED(constants.OPEN_PARENS, constants.CLOSE_PARENS);
constants.matched_angle =   GET_MATCHED(constants.OPEN_ANGLE, constants.CLOSE_ANGLE);
constants.matched_quote =   GET_MATCHED(constants.QUOTE, constants.QUOTE);

module.exports = constants;

function MATCH_CHAR(token){
	return function(input){
		return token === input;
	}
}

function GET_MATCHED(openChar, closeChar){
	return function(parseText){
		var result = '';
		while(parseText.current() !== openChar){
			parseText.advance();
		}
		parseText.advance();
		var count = 0;
		while(parseText.current() !== closeChar || count > 0){
			if(parseText.current() === openChar){
				count += 1;
			}
			if(parseText.current() === closeChar){
				count -= 1;
			}
			result += parseText.current();
			parseText.advance();
		}
		return result;
	}
}