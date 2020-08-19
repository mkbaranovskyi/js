'use strict'

// We can inherit from built-in classes, like Array, Map, etc.
class PowerArray extends Array {
	isEmpty(){
		return this.length === 0
	}
}

let arr = new PowerArray(1,2,3,4,5)
console.log(arr.isEmpty())	// false

// Fun fact: methods that return an array/string/etc. will now return our custom object (bc they use 'constructor' prop to determine its origin)
let tmp = arr.filter((item, index) => !(index % 2))	// PowerArray(3) [1, 3, 5]

// We can prevent this
class PowerArray extends Array {
	isEmpty(){
		return this.length === 0
	}

	// this prop is used by all methods of built-in constructor functions (like filter, map, etc.) to determine the type of returned objects
	static get [Symbol.species](){	
		return Array
	}
}

let arr = new PowerArray(1,2,3,4,5)
let tmp = arr.filter((item, index) => !(index % 2))	// Array(3) [1, 3, 5]
console.log(tmp.isEmpty())	// TypeError: no such function



// Usually static props and methods are inherited from with no problem. But built-in classes is the exception.
// Although, 'Array.prototype.__proto__ === Object.prototype', 'Array.__proto__ !== Object', so no 'Array.keys()' is possible 




// The 'instanceof' operator checks the 'obj'.[[Prototype]] chain against 'Class.prototype' (not Class itself!)

console.log([] instanceof Array)	// true, => [].__proto__ === Array.prototype
console.log([] instanceof Object)	// true, => [].__proto__.__proto__ === Object.prototype

// If a class has `static [Symbol.hasInstance]` method, then it is called to perform a custom check

class Animal {
	static [Symbol.hasInstance](obj){
		if(obj.eat()){	// such a check will consider all objects with 'eat' method to be 'Animal' instances
			return true	
		}
	}
}

// It makes possible to cheat the check

function A() {}
function B() {}

A.prototype = B.prototype = {}	// A and B refer to the same object

let a = new A()

console.log(a instanceof B)		// true => the nameless object, which is set as 'B.prototype' is also present in the 'a' prototype chain


// The 'isPrototypeOf' method checks if an object exists in another's prototype chain

function Foo() {}
function Bar() {}
function Baz() {}

Bar.prototype = Object.create(Foo.prototype)
Baz.prototype = Object.create(Bar.prototype)

var baz = new Baz()

console.log(Baz.prototype.isPrototypeOf(baz)) 		// true
console.log(Bar.prototype.isPrototypeOf(baz)) 		// true
console.log(Foo.prototype.isPrototypeOf(baz)) 		// true
console.log(Object.prototype.isPrototypeOf(baz)) 	// true

console.log(baz instanceof Baz)						// true
console.log(baz instanceof Bar)						// true
console.log(baz instanceof Foo)						// true
console.log(baz instanceof Object)					// true



// Object.prototype.toString() can be used to get the type of an object as a string. It returns "[object ...]", where '...' is the value of 'Symbol.toStringTag' (if any)

console.log(({}).toString.call([]));	// "[object Array]"
console.log(({}).toString.call(null));	// "[object Null]"
console.log(({}).toString.call(5));		// "[object Number]"

// But the main job is done by 'Symbol.toStringTag' that returns the actual type. It can also be tweaked manually ...

let user = { 
	[Symbol.toStringTag]: 'User'
}

console.log(user.toString())			// "[object User]"

// ... or user as it is

console.log(window[Symbol.toStringTag])	// "Window"
console.log(XMLHttpRequest.prototype[Symbol.toStringTag])	// "XMLHttpRequest"

// We can use this trick to get the type of any instance as a string


