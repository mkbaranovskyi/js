"use strict"

// Constructors - functions, that are supposed to be called with 'new' and to return an object with the given properties. 

function Test(arg){
    let privateProp = arg     		// private property, only accessible from a closure of a public method
	function privateMethod(){		// private method,	 only accessible from a closure of a public method
		return 'hidden!'
	}	

    this.public = 'public'			// public field
    this.callPrivate = () => {  	// public method
        return [privateMethod(), privateProp]
	}	
}

const test = new Test('private')	// Test {public: "public", callPrivate: ƒ}
test.callPrivate()           		// ["hidden!", "private"]

// If you call 'User' w/o 'new', it will just execute as regular function and use the global object as 'this'



// The "new" keyword makes function create a new object, appoint it to 'this', fill with the given properties and methods, then return 'this'. If constructor function has 'return', then it checks if it returns an object: if yes, then that's what will be returned instead of 'this'

function User(name){
    this.name = name // ignored in the final object
    return { ops: 'something' }
}
var max = new User('max') // {ops: "something"} 

// if not - it's ignored.
function User(name){
    this.name = name
    return 1
}
var max = new User('max') // User { name: "max" }



// https://learn.javascript.ru/constructor-new#sozdayom-accumulator
/* Object that Accumulator creates should:
- Store the “current value” in the property value. The starting value is set to the argument of the constructor startingValue.
- The read() method should use prompt to read a new number and add it to value.
In other words, the value property is the sum of all user-entered values with the initial value startingValue.
*/
function Accumulator(startingValue){
    this.value = startingValue
    this.read = () => {
        this.value += +prompt("New value to add: ", "5")
    }
}

let accumulator = new Accumulator(1); // initial value 1
accumulator.read(); // adds the user-entered value
accumulator.read(); // adds the user-entered value
alert(accumulator.value); // shows the sum of these values

