'use strict'

// We can inherit one class from another using 'extends' keyword. 
// We can override parent's methods also. Let's make our rabbit hide automatically when it stops.

class Animal {
    constructor(name){
        this.name = name
        this.speed = 0
    }

    run(speed){
        this.speed += speed
        console.log(`${this.name} is running at a speed of ${this.speed} m/s`)
    }

    stop(){
        this.speed = 0
        console.log(`${this.name} has stopped`)
    }
}

class Rabbit extends Animal {
	// If we don't create the 'constructor' method directly, it will be created with 'super()' implicitly anyway. 
    constructor(name){
        super(name) // MANDATORY: call the prototype's constructor before accessing 'this'
        this.hidden = false
    }

    hide(){
        this.hidden = true
        console.log(`${this.name} is hiding`) 
    }

    stop(){ // override stop
        super.stop() // OPTIONAL: call the prototype's original method before adding new features
        this.hide() // add new features
    }
}

const rabbit = new Rabbit("Mr. Rabbit")

rabbit // Rabbit {name: "Mr. Rabbit", speed: 0, hidden: false}
rabbit.run(5)   // Mr. Rabbit is running at a speed of 5 m/s
rabbit.stop()   // Rabbit has stopped
                // Mr. Rabbit is hiding



// 'Extends' do 2 things:
// 1) sets Rabbit.prototype.__proto__ = Animal.prototype
// 2) sets Rabbit.__proto__ = Animal
// The latter makes it possible to use ptototype's static methods:

class Rabbit extends Object {}
// We can now call Object's own methods on behalf of Rabbit:
Rabbit.is({a: 1}, {a: 1}) // false, (not undefined!)



// After 'extends' can be any kind of expression

function f(phrase){
    return class {
        sayHi(){ return phrase }
    }
}

class User extends f('Hello') {} // empty 'User' class that has the result of calling f() as its prototype (which is a class that stores 'phrase' in a closure)
// We may use such tricks to dynamically generate classes depending on many condotions and then inherit them



// Arrorw functions don't have 'super'. They take it from the outer function.

class Rabbit extends Animal {
    stop() {
        setTimeout(() => super.stop(), 1000); // super inside an arrow function is the same as in 'stop', so we can call it here
        // if we used a regular function instead of arrow, we would get an error
    }
}



// 'super' is binded to its object/class by the [[HomeObject]] inner property

let animal = {
    sayHi() {
        console.log("I'm an animal");
    }
};

// rabbit inherits from animal
let rabbit = {
    __proto__: animal,
    sayHi() {
        super.sayHi();
    }
};

let plant = {
    sayHi() {
        console.log("I'm a plant");
    }
};

// tree inherits from plant
let tree = {
    __proto__: plant,
    sayHi: rabbit.sayHi // we appointed sayHi from the prototype, but it will have 'this' binded as 'rabbit' forever, so we won't be able to use it properly
};

tree.sayHi(); // I'm an animal (?!?) 
// 'sayHi' ignored 'tree' before the dot and called itself as 'rabbit.sadHi()' bc it had 'super' inside that binded it to the rabbit.
// Thus, it's unsafe to copy methods using 'super'



// ONly methods have can work with 'super', not properties-functions

let animal = {
    eat: function () { // will work
    }
};

let rabbit = {
    __proto__: animal,
    eat: function () {
        super.eat(); // super is unexpected since peoperties don't have 'this' that can be binded to them
    }
    /* the correct way
    eat(){
        super.eat()
    } */
};

rabbit.eat();


``
// https://learn.javascript.ru/class-inheritance#uluchshennye-chasy

'use strict'

class Clock {
    constructor({ template }) {
        this.template = template;
    }

    render() {
        let date = new Date();

        let hours = date.getHours();
        if (hours < 10) hours = '0' + hours;

        let mins = date.getMinutes();
        if (mins < 10) mins = '0' + mins;

        let secs = date.getSeconds();
        if (secs < 10) secs = '0' + secs;

        let output = this.template
            .replace('h', hours)
            .replace('m', mins)
            .replace('s', secs);

        console.log(output);
    }

    stop() {
        clearInterval(this.timer);
    }

    start() {
        this.render();
        this.timer = setInterval(() => this.render(), 1000);
    }
}

class ExtendedClock extends Clock {
    constructor(options) { 
        super(options)
        this.interval = options.interval || 1000
    }

    render(){                   // optional override render method to add ms to the output
        let date = new Date()

        let hours = date.getHours()
        if (hours < 10) hours = '0' + hours

        let mins = date.getMinutes()
        if (mins < 10) mins = '0' + mins

        let secs = date.getSeconds()
        if (secs < 10) secs = '0' + secs

        let ms = date.getMilliseconds()
        if(ms < 10) {
            ms = '00' + ms
        }
        else {
            if(ms < 100){
                ms = '0' + ms
            }
        }

        let output = this.template
            .replace('h', hours)
            .replace('m', mins)
            .replace('s', secs)
            .replace('ms', ms)

        console.log(output)
    }

    start(){                    // override start method to use a custom interval instead of the default one
        this.render()
		this.timer = setInterval(() => this.render(), this.interval) 
		// Remember: calling 'super.start()' is OPTIONAL, you may not do this if you don't need to. The only mandatory 'super()' call is in the constructor.
    }    
}

let clock = new ExtendedClock({ // the one important thing for this object is to have a 'template' prop that the Clock's constructor expects
    template: 'h:m:s:ms',
    interval: 500
})

clock.start()