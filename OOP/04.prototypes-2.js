"use strict"

// All functions have a 'prototype' property containing an object that looks like { constructor: f } by default. 

function Rabbit(name) {
    this.name = name
}
Rabbit.prototype // { constructor: Rabbit }

// Objects created by a constructor will use this object as its prototype. 

var rabbit = new Rabbit("Max")
rabbit.__proto__ // { constructor: Rabbit }

// So all objects have a reference to the constructor that created them

// We can appoint another object to the 'prototype' property of the constructor.

var animal = {
    eats: true
}

function Rabbit(name) {
    this.name = name
}

Rabbit.prototype = animal

var rabbit = new Rabbit("White Rabbit")

rabbit.eats // true
rabbit.name // White Rabbit

rabbit.constructor // Object

// We've lost a reference to the constructor! If we wanted, we could fix this by adding a 'constructor' property to the prototype or by creating the whole new object as a prototype with a reference to the constructor

Rabbit.prototype.constructor = Rabbit

// If the prototype object has changed, its descendents will also change, including existing ones. Because the properties of its prototype are not stored in the object, but are requested if necessary

rabbit.sleeps // undefined
Rabbit.prototype.sleeps = true
rabbit.sleeps // true


// the 'constructor' property is available for all rabbits via [[Prototype]]
rabbit.constructor == Rabbit // true


// We can use the object's 'prototype' property for creating new objects
function Rabbit(name){
    this.name = name
}

var rabbit = new Rabbit('longEar')
Rabbit = null // kill the `Rabbit` reference to the constructor
var rabbit2 = new rabbit.constructor('Bunny') // works anyway, because the constructor function lives as there are other links to it


// But if we change the prototype object of the constructor, we won't 

function Rabbit(name){
    this.name = name
}

Rabbit.prototype = {} // changed the prototype object, now it doesn't have a 'constructor' property referring to 'Rabbit' function

var rabbit = new Rabbit('longEar')

var rabbit2 = new rabbit.constructor('Bunny') // 



// https://learn.javascript.ru/native-prototypes#dobavte-funktsiyam-dekoriruyuschiy-metod-defer
// New method to the 'Function' object to defer custom functions call. Makes wrapper

// Solution 1:

Function.prototype.defer = function(ms){
	return (...args) => {
		setTimeout(() => this.apply(this, args), ms)
  }
}

function sum(a, b) {
  	console.log(this)
  	console.log(a + b)
}

sum.defer(1000)(1, 2)		// this === sum (internal-binded function, common case)


const user = {
  name: 'John'
}

user.hello = (function(msg){
    console.log(`Hello, ${this.name}! ${msg}`)
	console.log('this: ', this)  
}).bind(user)

user.hello.defer(2000)('Nice to meet you')		// this === user (external-binded object, special case)



// Solution 2 (w/o decorator function): 

Function.prototype.defer = function (ms, ...args){
	setTimeout(() => this.apply(this, args), ms)
  // Биндим нашу функцию в `this` (сработает, если не прибиндино снаружи ничего другое, например, объект, методом которого является функция)
}

const user = {
  name: 'John'
}

user.hello = (function(msg){
  console.log(`Hello, ${this.name}! ${msg}`)
  console.log('this: ', this)
}).bind(user)	// биндим объект

user.hello.defer(2000, 'Nice to meet you')	
// this === user, частный случай прибинденного объекта, методом которого является функция


function sum (a, b){
  console.log('this: ', this)
  return a + b
}

sum.defer(2000, 4, 5)		
// this === sum, общий случай прибиндинной функции





// Instead of using __proto__ we should use Object.getPrototypeOf and Object.setPrototypeOf. Also, there is Object.create(proto, {})

var animal = {
    eats: true
}

var rabbit = Object.create(animal, {
    jumps: {
        value: true,
        enumerable: true,
        configurable: true,
        writable: true
    }
})

Object.getPrototypeOf(rabbit) === animal // true
Object.setPrototypeOf(rabbit, null)
Object.getPrototypeOf(rabbit) === animal // false


// It is possible to shallow clone objects using Object.create, which will retain prototype chain and properties' flags

var clone = Object.create(
    Object.getPrototypeOf(rabbit) /*set target's prototype as prototype for the new object*/, 
    Object.getOwnPropertyDescriptors(rabbit) /*get and paste target's properties along with their flags*/
)


// Changing prototype 'on the fly' is a very slow operation, avoid it if possible! It is better to create object with a given prototype than adding it later



// Example

function fruits(){
	this.name = 'fruit 1'
	this.season = 'summer'
}

function apple(){
	console.log('this: ', this)
	fruits.call(this)
}

apple.prototype = Object.create(fruits.prototype) // create {} with [[Prototype]] set as fruits.prototype

var app = Object.create(fruits)



// https://learn.javascript.ru/prototype-methods#dobavte-tostring-v-slovar

let dictionary = Object.create(null, {
    'toString': {
        value(){
            return Object.keys(this).join(',')
        }
    }
})

dictionary.apple = "Apple";
dictionary.__proto__ = "test"; // __proto__ is a regular key here, it works bc the object was created with Object.create(null) and did'nt inherit any Object.prototype properties, including set __proto__ and get __proto__ 

// only apple and __proto__ show up in a loop
for(let key in dictionary) {
  alert(key); // "apple", "__proto__"
}

alert(dictionary); // "apple,__proto__"



