"use strict"

// Each object has a special inner property [[Prototype]] that stores a reference to the prototype object (or null). __proto__ is its setter/getter.

var animal = {
    eats: true,
}
var rabbit = {
    jumps: true
}

rabbit.__proto__ = animal

console.log(rabbit.eats) // true
console.log(rabbit.jumps) // true

// When the interpreter can't find a property in an object, it then checks if [[Prototype]] is referring to another object. If yes, it searches the prototype object and so on. 

var animal = {
    eats: true,
    walk(){
        console.log("Animal walks")
    }
}
var rabbit = {
    jumps: true,
    __proto__: animal   
    // When an object has a '__proto__' property with the value being an object or null, it doesn't create a property with a name '__proto__', it changes the [[Prototype]] of this object (if the value is not an object or null, the object is not changed)
}

var longEar = {
    earLength: 10,
    __proto__: rabbit
}

console.log(longEar.jumps) // true
longEar.walk() // Animal walks


// __proto__ should be object or null, otherwise ignored.
// There can only be one prototype.
// The prototype is only used for reading properties. You cannot write down a value to a property in the prototype. 

var animal = {
    eats: true,
    walk() {} // will not be called for rabbit
};

var rabbit = {
    __proto__: animal
};

rabbit.walk = function () {
    console.log("Rabbit! Bounce-bounce!");
};

rabbit.walk(); // Rabbit! Bounce-bounce!


// We can use setter/getter

var user = {
    name: "John",
    surname: "Smith",

    set fullName(value) {
        [this.name, this.surname] = value.split(" ")
    },

    get fullName() {
        return `${this.name} ${this.surname}`
    }
}

var admin = {
    __proto__: user,
    isAdmin: true
}

// getter
console.log(admin.fullName) // John Smith
// setter
admin.fullName = "Alice Cooper"
console.log(admin.name) // Alice
console.log(admin.surname) // Cooper


// 'this' is always the object before the dot. The object can borrow methods of properties from its prototype, but 'this' refers to the object itself. 

var animal = {
    walk() {
        if (!this.isSleeping) {
            console.log(`I walk`)
        }
    },
    sleep() {
        this.isSleeping = true
    }
}

var rabbit = {
    name: "White Rabbit",
    __proto__: animal
}

rabbit.sleep() // added 'isSleeping: true' property to our rabbit

console.log(rabbit.isSleeping) // true
console.log(animal.isSleeping) // undefined
animal.walk() // I walk


// for..in walks through both object's own and the prototype's properties 

var animal = {
    eats: true
}

var rabbit = {
    jumps: true,
    __proto__: animal
}

// Object.keys(), Object.values(), Object.entries() return only their own keys
console.log(Object.keys(rabbit)) // jumps
// for..in returns alson inherited
for (let key in rabbit) console.log(key) // jumps, eats

// If we want to filter them...
for(let key in rabbit){
    if(rabbit.hasOwnProperty(key)){ // .hasOwnProperty() was taken from the Object.prototype, and it isn't shown in the loop because of 'enumerable: false' it has
        console.log("Own: ", key)
    } 
    else {
        console.log("Inherited: ", key)
    }
}



// https://learn.javascript.ru/prototype-inheritance#pochemu-naedayutsya-oba-homyaka
// hamsters
var hamster = {
    stomach: [],

    eat(food) {
        // this.stomach.push(food) // this will use the existing stomach to add food for both hamsters
        if (!this.stomach.length) {
            this.stomach = [] // now we use '=' to create 'this.stomach' for each hamster separately
        }
        this.stomach.push(food)
    }
}

var speedy = {
    __proto__: hamster
}

var lazy = {
    __proto__: hamster
}

// Этот хомяк нашёл еду
speedy.eat("apple")
alert(speedy.stomach) // apple

// У этого хомяка тоже есть еда. Почему? Исправьте
alert(lazy.stomach) // apple
