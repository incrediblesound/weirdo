Weirdo
======

Weirdo is my attempt to manifest all my weird ideas about software into a language that transpiles into JavaScript. It is currently in active development so I am still fleshing out the main features and organizing the code-base.

How to Transpile
---------
The weirdo main file takes two arguments: the path to the main file of your weirdo program and the output file to be generated.
```shell
node weirdo.js /path/to/main output.js
```

Module System
-------------
A weirdo program consists of a set of modules and a single main file. Modules have methods that maintain state and all most logic should be encapsulated in modules. In the main file you create instances of modules and feed them data. Below is a weirdo program that will transpile and run just fine. Lets start with a simple module:

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
Pretty weird huh? We can import and use that module in a main file like this:

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

Ok, now lets try a more complicated example. I will add a method to the Calc module that takes numbers and whose state reflects the current standard deviation of all numbers inputed so far.

```code
@Calc

// first of all, we add a comlex state object for our 
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
	
	each Self.log y ->			// if loop sugar!
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
More Syntax
-----------

###Typed Arguments:

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

###if / else if sugar:

```code
@Stuff

Init [..][..]{
	Self = 0;
}

.action[Num][n]{
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
I've decided to implement certain patterns as "tilde expressions". Currently the first and only tilde expression in the conditional loop. Consider the following example, first the module:
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
