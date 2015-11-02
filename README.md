Weirdo
======

Weirdo is my attempt to manifest all my weird ideas about software into a language that transpiles into JavaScript. It is currently in active development so I am still fleshing out the main features and organizing the code-base.

Module System
-------------
A weirdo program consists of a set of modules and a single main file. Below is a weirdo program that will transpile and run just fine. Lets start with a simple module:

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

sys.out[ result  ]  // print the value of result to the console
```

Stay tuned for more developments, that is, if you're into that kind of weird stuff.
