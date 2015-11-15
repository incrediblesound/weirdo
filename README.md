Weirdo
======

Weirdo is my attempt to manifest all my weird ideas about software into a language that transpiles into JavaScript. Other than experimenting with weird ideas, Weirdo is also my attempt to create a fun language that has what I personally consider attractive syntax.

How to Transpile
---------
The weirdo main file takes two arguments: the path to the main file of your weirdo program and the output file to be generated.
```shell
node weirdo.js /path/to/main output.js
```

Module System
-------------
A weirdo program consists of a set of modules and a single main file. Modules have methods that maintain state. Most logic should be encapsulated in modules. In the main file you create instances of modules and feed them data. Below is a weirdo program that will transpile and run just fine. Lets start with a simple module:

```code
@Calc             // declare a module named Calc

                  // every module requires an Init function
Init [..][..]{    // this function takes no arguments
  Self = {max: 0 };       // the module has an initial state for each method
}

.max [Num][~]{                // max takes number arguments and is invoked recursively
	x = Self > n ? Self : n;  // n stands for the current argument in the iteration
	Self = x;                 // the state of the module (specific to this method) is set to x
}
```
Pretty weird huh? Here is the basic module syntax:
###Declaration
First declare the module with an @ symbol and an uppercase name
```code
@Module
```
###Init function
Each module must have an init function that defines the structure of that modules state. The state can be defined as either a map of method names to values, in which case it will be untouched, or as a single primitive value, in which case it will be converted into a map where each method starts with a state of that value. For example:
```code
Init [..][..]{
  Self = 0;
}
```
If we use the above init function in a module and then go on to define methods called min, max, sum and average, the actual value of self will be converted during transpilation into this:
```javascript
this.data = { min: 0, max: 0, sum: 0, average: 0 };
```
If instead you want to set unique starting values for each method, just set the value of Self to a map of method names like this:
```code
Init [..][..]{
  Self = { min: 0, max: 100, sum: 0, average: [] };
}
```
Once you have an init function you can go on to define module methods. Each method starts with a period followed by the method name, the argument types in brackets, the argument names in brackets and finally the method body surrounded by curly braces. Argument types and names are optional and you may supply the double dot ".." to ignore that feature.

Argument types:

*Str* -  string literal    
*Num* -  JavaScript number    
*Val* -  Weirdo value (instantiated in main)    

There are also two speical symbols that can be used in the argument names position:

"->" designates this function as the getter method for the state of the named method    
"~"  designated this function as a recursive call on an indeterminate number of arguments    

There is also some special syntax for writing the function bodies of the methods themselves, but we'll get into that later on. Once you have some basic methods you can only use them in a Weirdo main file. A main file is a high-level input-output layer for manipulating modules. Here's an example using the module we defined above:

```code
include "calc"  // import all modules in the file named calc.wdo

calc <- Calc    // make a new instance of the Calc module

result <- Num   // make a number container called result

calc.max[ 2 , 3 ]    // pass all kinds of numbers into the max method
calc.max[ 13 ]
calc.max[ 7, 1, 5 ]

calc.max -> result  // dump the state of the max method into result

sys.out[ result  ]  // print the value of result to the console (which is 13 btw)
```
That main file doesn't look much like JavaScript does it! A Weirdo main file contains three different kinds of basic expressions:

###Instance
```code
calc <- Calc   // calc is now an instance of the Calc module with its own state
sum  <- Num    // sum is an instance of a Weirdo number value
name <- Str    // name is an instance of a Weirdo string value
```
###Invocation
```code
calc.max[ 2, 3 ] // This invokes the method "max" on the module instance calc with the arguments 2 and 3
sys.out[ name ]  // This invokes the system out function with the string instance "name"
```
###assignment
```code
calc.max -> num  // num is set to the state of the max method or the return value of the max getter
```

Before jumping into method syntax I want to show you a more complicated example. I will add a method to the Calc module that takes numbers and whose state reflects the current standard deviation of all numbers inputed so far.

```code
@Calc

// first of all, we add a complex state object for our 
// standard deviation method

Init [..][..]{
  Self = { 
  deviation: {num: 0, avg: 0, sum: 0, log: [], dev: 0 },
  max: 0
  };
}

.max [Num][~]{ ... }

// we've decided to represent the computed deviation with the
// property "dev" so we only want to return that when using 
// the right arrow. The arrow in the arguments place indicates
// that this method overrides the normal state return
.deviation [..][->]{
	<- Self.dev;
}

.deviation [Num][~]{
	Self.num++;					// increment the count of input values
	Self.sum += n;				// increment the sum of inputs
	Self.log.push(n);       	// store this input value
	
	diffs = [];             
	x = Self.sum / Self.num;	// x is our current average
	
	each Self.log y ->			// for loop sugar!
		z = y - x;				// z is current input minus avg of inputs
		z = z * z;				// z is now z squared
		diffs.push(z);			// store z
	each;						// remember to end if loops with "each;"

	a = 0;
	
	each diffs b ->				// calculate total of diffs
		a += b;
	each;
	
	c = a / diffs.length;		// store average of diffs in c

	Self.dev = Math.sqrt(c);	// store square root of c on Self.dev
}
```
Now we can use our new method like this:
```code
include "calc"

calc <- Calc
dev <- Num

calc.deviation[ 13,24,56,81 ]
calc.deviation -> dev
sys.out[ dev ]

calc.deviation[ 42 ]
calc.deviation -> dev
sys.out[ dev ]

```
The above code will log
```shell
26.800186566514792
23.978323544401512
```
Features
--------
Each method has its own state which is determined by a property of the module's state and is pointed to by "Self" when inside the method. When assigning the state of a method to a variable in the main file the entire state will be dumped into the variable unless you define a special function like in the deviation example above.

Main files are basically a high level coordination of input/output values and module methods. There is very little control except for that which is currently provided in tilde blocks.

There are certain core functions available in the "sys" namespace some of which are available in methods and some in main. Here is the current list:

**loadText** - method::(path) - synchronously loads a file as text with the fs module    
**processPost** - method::(req, res, callback) - loads and parses post data which is returned in the callback    
**renderView** - method::(string, data) - just a wrapper around mustache.parse    
**out** - main/method:: console.log    
**in** - main::(value) - reads a line from stdin and places it in value 

More Syntax
-----------

###Typed Arguments
For methods that take primitives you can specify basic types:

```code
@Person

Init [Str][name]{
	Self = {info: { name: name, age: null }}
}

.info [..][->]{
	x = Self.name + ", "+ Self.age + " yo."; 
	<- x;
}

.info [Num, Str][age, name]{
	Self.age = age;
	Self.name = name;
}
```

###if / else if sugar
Inside modules if / else if blocks have a little syntactic sugar:

```code
.method[Num][n]{
	if(n > 8) ->
		Self = n;
	elif(n > 5) ->
		Self = false;
	else ->
		Self = true;
	if;
}
```
###conditional loop:
I've decided to implement certain patterns as "tilde expressions". The idea is to create high-level control structures by wrapping block of code between two tildes. Consider the following example, first the module:
```
@Looper

Init [..][..]{
	Self = {action: ''};
}

.action[..][->]{
	<- Self;
}

.action[..][n]{
	Self = "You typed: " + n.get();
}

.checkExit[..][x]{
	if(x.get() !== "quit") ->
		<- true;
	else ->
		<- false;
	if;
}
```
Now the main file:
```code
include "looper"

looper <- Looper
input <- Str
output <- Str

~loop[ looper.checkExit[ input ] ]   // loops the following code as long as checkExit returns true 

sys.in[ input ]                      // gets a line and puts it in input

looper.action[ input ]               // feed input into action
looper.action -> output              // dump action into output

sys.out[ output ]                    // print output
~                                    // end loop block
```
The previous example shows how a tilde block with keyword "loop" can be used to conditionally loop over a block of code. The other use of a tilde block is to set up an event listener. Currently this feature has two distinct use cases: the http server and module events. [Here is a full example](https://github.com/incrediblesound/weirdo/tree/master/example/one) of an http server that parses post data and render templates with [mustache](https://github.com/janl/mustache.js). The tilde block event listener for the http server looks like this:
```code
~on[ sys.server.receive ]

router.process[ request, response ]

~
```
This block of code will create an http server and set it listening to process.env.PORT or port 3000. When the http server receives a request, the block of code inside the tildes will run with the request and response objects automatically instantiated.

You can also use the ~on block for normal events. [This example](https://github.com/incrediblesound/weirdo/tree/master/example/two) is simple but functional. The basic usage is like this:
```code
~on[ module.event ]

module.method[ data ]

~
```
In the square brackets following the ~on you enter the module name and event name separated by a period. You can call that event inside any method inside the module using the @ symbol. The variable "data" will be automatically passed into the scope inside the tildes and is defined by an optional argument to the event as shown below. 
```code
@Module

someMethod[..][n]{

if(n > 100) ->
  @event(n);
if;

}
