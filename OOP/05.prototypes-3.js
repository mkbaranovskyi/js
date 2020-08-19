'use strict'

// The global prototype chain

// 'Object.prototype' is the top of the prototype chain

Object.prototype.__proto__ === null // only the sky above

// All primitive values inherit from their corresponding constructorFunction.prototype-s

var n = 5
var s = 's'
var b = true
var a = []
var o = {}
function f(n){ return n }

n.__proto__ === Number.prototype    
s.__proto__ === String.prototype    
b.__proto__ === Boolean.prototype   
a.__proto__ === Array.prototype     
o.__proto__ === Object.prototype    
f.__proto__ === Function.prototype  

// The same for objects created with corresponding constructors

n = new Number(5)
s = new String('s')
b = new Boolean(true)
a = new Array([])
o = new Object({})
var f = new Function('n', 'return n')

n.__proto__ === Number.prototype    
s.__proto__ === String.prototype    
b.__proto__ === Boolean.prototype   
a.__proto__ === Array.prototype     
o.__proto__ === Object.prototype    
f.__proto__ === Function.prototype  


// 'Function.prorotype' is the only global prototype with typeof == 'function', the others are 'object'. 

typeof Number.prototype     === 'object' 
typeof String.prototype     === 'object' 
typeof Boolean.prototype    === 'object' 
typeof Array.prototype      === 'object' 
typeof Object.prototype     === 'object' 
typeof Function.prototype   === 'function' 


// 'Function.prorotype' is set as __proto__ for all built-in constructor functions. This lets them to borrow common for all functions methods (call, apply, bind) and properties (length, arguments, name).

Number.__proto__    === Function.prototype
String.__proto__    === Function.prototype
Boolean.__proto__   === Function.prototype
Array.__proto__     === Function.prototype
Object.__proto__    === Function.prototype
Function.__proto__  === Function.prototype // 'Function.__proto__' is explicitly set to Function.prototype for the same reason: 'Function' to have access to common function's methods and properties that are set in 'Function.prototype'


// 'Function.prototype' itself inherits from 'Object.prototype' 

Function.prototype.__proto__ === Object.prototype



// But what methods and properties (divided by ;) do global constructors have compared to their .prototype-s ?

// Constructors only contain static methods

console.dir(Number) // isNaN, isInteger, isFinite
console.dir(String) // fromCharCode, fromCodePoint, raw
console.dir(Boolean) // -
console.dir(Array) // isArray, from, of
console.dir(Object) // keys, values, entries, assign, create, seal, freeze, defineProperty, getOwnPropertyDescriptor, getPrototypeOf, setPrototypeOf
// Why does 'Object' has so many methods? This is for the purpose of being able to use them even for objects created with 'Object.create(null)'
console.dir(Function) // -
// All constructors have 'length' property which indicates the max number of arguments (if any) a constructor expects when creating new instances


// Methods and properties of constructor's .prototype objects are borrowed by instances.

console.dir(Number.prototype) // toPrecision, toFixed, toExponential
console.dir(String.prototype) // all string methods; length
console.dir(Boolean.prototype) // valueOf
console.dir(Array.prototype) // all array methods; length
console.dir(Object.prototype) // hasOwnProperty, isPrototypeOf, propertyIsEnumerable
console.dir(Function.prototype) // call, apply, bind; arguments, length, name
// All built-in prototypes have 'toString' method

