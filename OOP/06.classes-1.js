'use strict'

// Class is a kind of a constructor function with some differencies.
// When we call 'new className(...args)', two things happen:
// 1. A new object is created.
// 2. The 'constructor' method is called automatically with arguments passed to className(...) to initialize an instance with its own properties and methods
// 3. Functions declared inside a class are accessible through a prototype as methods of the instance. 

class User {
    constructor(name, isFriend){
		this.name = name	// own public field

        this.secret = function(){	// own public method
            console.log(protectedSecret())
        }


		let friend = isFriend   // own protected field, only exists in the closure

		function protectedSecret(){  // own protected method, only exists in the closure
			if(friend){
				return 'I have a pony!'
			}
			return 'No secret for you!'
        }
    }

    greet(){	// prototype method, accessible from the instances as long as the prototype chain remains
        console.log(`Hi, my name is ${this.name}`)
    }
}

const user = new User('Max', true)
console.log(user)

console.log(user.greet())	// Hi, my name is Max
console.log(user.secret())	// I have a pony!

// console.log(user.friend)	// undefined -> protected field
// console.log(user.protectedSecret())	// TypeError -> protected method




// the above is the equivalent of 

function User(name){
    this.name = name
    this.ownMethod = function(){
        alert('Own method, this name === ' + this.name)
    }
}

User.prototype.protoMethod = function(){
    alert("Proto method, this.name === " + this.name)
}

const user = new User('Vlad')
user.protoMethod() // is taken from the prototype
user.ownMethod() // is taken from the user

// The difference is 
// 1. Class function cannot be called w/o 'new' - TypeError!
// 2. All class methods has 'enumerable: false', so they won't appear in for..in loop through the object keys
// 3. Classes automatically 'use strict' 



// Class expression, works like Named Function Expression

const User = class MyClass {
    sayHi(){
        alert(MyClass)
    }
}

new User().sayHi() // MyClass is only seen inside the class



// We can create classes on demand. 

function makeClass(greeting){
    return class {
        constructor(name) {
            this.name = name
        }
        sayHi(){
            alert(greeting + " " + this.name + '!')
        }
    }
}

const User = makeClass('Hello, my dear friend') // create new class
new User('Maxim').sayHi() // Hello, my dear friend Maxim!



// Also, there is a syntax sugar for making properties that start with fixed values and need not to be passed as parameters

class User {
    name = 'Max' // the same as 'this.name = "Max"' in the constructor method
}

// the above is the equivalent of 

class User{
    constructor(){
        this.name = 'Max'
    }
}



// We can use setters and getters

class User{
    constructor(name){
        this.name = name
    }

    set name(value){
        if(value.length < 3){
            alert("The name is too short!")
            return
        }
        Object.defineProperty(this, '_name', {
            value,
            configurable: true
        })
    }

    get name(){
        return this._name
    }
}

let user = new User('M')
user.name // undefined
user = new User('Max')
user.name // Max



// https://learn.javascript.ru/class#perepishite-klass

class Clock {
    constructor({ template }) {
        this.template = template // we catch here what we passed invoking 'new Clock'
    }

    render() {
        let date = new Date()

        let hours = date.getHours()
        if (hours < 10) hours = '0' + hours

        let mins = date.getMinutes()
        if (mins < 10) mins = '0' + mins

        let secs = date.getSeconds()
        if (secs < 10) secs = '0' + secs

        let output = this.template
            .replace('h', hours)
            .replace('m', mins)
            .replace('s', secs)

        console.log(output);
    }

    stop() {
        clearInterval(this.timer)
    }

    start() {
        this.render()
        this.timer = setInterval(() => this.render(), 1000) // don't lose 'this'
    }
}

const clock = new Clock({template: 'h:m:s'})
clock.start()
