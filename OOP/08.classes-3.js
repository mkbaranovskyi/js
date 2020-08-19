'use strict'

// GETTERS and SETTERS with classes are simple

class User {
    constructor(name){
        this.name = name // we can do 'this._name', then the addition of '!!!' won't work
    }

    set name(value){
        Object.defineProperty(this, '_name', { // not 'name' but '_name' or you'll get recursive setting until the stack is exceeded
            value: value + "!!!",
            configurable: true
        })
    }

    get name() {
        return this._name
    }
}

let user = new User("Max")
user.name // "Max!!!"
user.name = "Vlad" // "Vlad!!!" => adds '!!!' through setter
user._name = 'ololo' // TypeError: direct assignment doesn't work, writable: false




// STATIC methods and properties belong to the class itself, not its instances.

class Counter {
    constructor(){
        this.constructor.quantity ++
        this.constructor.number ++
    }

    static quantity = 0             // static prop 1
    static showQuantity(){          // static method 1
        console.log(this.quantity)
    }
}

Counter.number = 0                  // static prop 2
Counter.showNumber = function(){    // static method 2
    console.log(this.number)
}

let count1 = new Counter()
let count2 = new Counter()

// access static props
Counter.quantity            // 2
Counter.number              // 2

// access static methods 
Counter.showQuantity()      // 2
Counter.showNumber()        // 2



// We can use static method to create new instances inside of a class instead of using a regular constructor directly

class Article {
    constructor(title, date) {
        this.title = title
        this.date = date
    }

    static createTodays() {
        // this === Article
        return new this("Today's digest", new Date())   // new Article(...)
    }
}

let article = Article.createTodays()

// or manually: 

class User {
	static createInstance(name){
    const obj = Object.create(this.prototype, {
      name: {
        value: name
      }
    })
    
    return obj
  }
}

const a = User.createInstance('max')
const b = User.createInstance('vlad')

console.log(a)
console.log(b)




// Static props and methods can be inherited

class Animal {
    constructor(name, speed) {
        this.speed = speed
        this.name = name
    }

    static compare(animalA, animalB) { // if return > 0 => will switch places, thus, ascending order sort
        return animalA.speed - animalB.speed
    }
}

class Rabbit extends Animal {}

let rabbits = [ 
    new Rabbit("Black", 15), 
    new Rabbit("White", 10)
]

console.log(rabbits[0]) // Black
rabbits.sort(Rabbit.compare) // inherited
console.log(rabbits[0]) // White

// Here we can see that Rabbit inherited 'compare' method from Animal. Again, 'extends' do 2 things:
// 1) Rabbit.prototype.__proto__ = Animal.prototype     (for regular methods and props)
// 2) Rabbit.__proto__ = Animal                         (for static methods and props)



// 'super.method' also works for static methods, invoking their ancestors