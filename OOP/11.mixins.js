'use strict'

// MIXIN is a class, whos purpose is to provide its methods for other classes w/o inheritence. We don't use mixins by themselves, we use them to extend the functionality of other classes

const sayHiMixin = {
	sayHi(){
		console.log(`Hi, ${this.name}`)
	},

	sayBye(){
		console.log(`Bye, ${this.name}`)
	}
}

class Person {}

class User extends Person{
	constructor(name){
		this.name = name
	}
}

Object.assign(User.prototype, sayHiMixin)	// copy methods

const user = new User('Max')
user.sayHi()	// "Hi, Max"

// This is not inheritence, just copying of methods. User can inherit from Person and has sayHiMixin's methods



// Mixins can inherit from one another


// Object.prototype.say = function(phrase){ console.log(phrase) }	// если добавить это, начинает работать


let sayMixin = {
	say(phrase){
		console.log(phrase)
	}
}

let sayHiMixin = {
	sayHi() {
		super.say(`Hi, my name is ${this.name}`)	
	},
	sayBye() {
		super.say(`Bye, ${this.name}`)
	}
}

sayHiMixin = Object.create(sayMixin, Object.getOwnPropertyDescriptors(sayHiMixin))	// не работает, потому что тут происходит назначение свойств-функций, а не именно методов, а есть внутренняя разница: только "тру" методы имеют сохраненный [[HomeObject]] и связь с прототипом

// Попробуй поиграться с обоими вариантами: прямое задание прототипа запоминает цепочку прототипов копируемого метода, а свойства, скопированные из созданного Object.create объекта, будут работать с цепочкой прототипов таргета копирования. 

// sayHiMixin = Object.setPrototypeOf(sayHiMixin, sayMixin)

class User{
	constructor(name){
		this.name = name
	}
}

console.log(sayHiMixin)
Object.assign(User.prototype, sayHiMixin)		// User.prototype имеет прототипом Object.prototype, а скопированные методы sayHiMixin пытаются обратиться к родительскому методу, хотя самого родителя нет! Ведь sayMixin вообще нигде не записан у User.prototype

const user = new User("Max")
user.sayHi()
user.sayBye()






// EVENT MIXIN

// We can generate our own events and use mixins for more comfort
// Here we create a mixin with methods 'on(name, handler)', 'off(name, handler)' and 'trigger(name, [data])'

let eventMixin = {
	on(eventName, handler){
		if(!this._eventHandlers){						// if there's no storage for handlers, create it
			this._eventHandlers = {}
		}
		if(!this._eventHandlers[eventName]){			// if there's no storage for the current eventName, create it
			this._eventHandlers[eventName] = []
		}

		this._eventHandlers[eventName].push(handler)	// add the current handler to the list of handlers for this event
	},

	off(eventName, handler){
		let handlersPack = this._eventHandlers && this._eventHandlers[eventName]	// the last true value will be assigned (or undefined)
		if(!handlersPack){	// if there is no outer or inner storage, return - no handlers for this event exist!
			return
		}

		for(let i = 0; i < handlersPack.length; i++){
			if(item === handler){
				handlersPack.splice(i--, 1)		// delete one element and shift back (to be able to check the next one w/o skipping it)
			}
		}
	},

	trigger(eventName, ...args){
		if(!this._eventHandlers || !this._eventHandlers[eventName]){	// if there're no handlers for this event, return
			return
		}

		for(let i = 0; i < this._eventHandlers.length; i++){
			this._eventHandlers[i].apply(this, args)					// call all handlers one by one
		}
	}
}


class Menu {
	choose(value){
		this.trigger('click', value)
	}
}

Object.assign(Menu.prototype, eventMixin)

const menu = new Menu()
menu.on('click', value => console.log(`You invoke 'click' event with ${value} parameter`))
menu.choose('yo')







// Practice

class Human {
	stomach = []

	constructor(name, age){
		this.name = name
		this._age = age
	}

	eat(meal){
		this.stomach.push(meal)
	}

	set age(value){
		if(typeof +value != 'number' || value < 0){
			throw new Error('Wrong input for age') 
		}
		this._age = +value
	}

	get age(){
		return this._age
	}
}

class Man extends Human {
	balls = true
	
	constructor(name, age){
		super(name, age)
	}
}

class Woman extends Human {
	boobs = true

	constructor(name, age){
		super(name, age)
	}
}


const skills = {
	clean(cleaningTarget){
		console.log(`${this.name} has cleaned ${cleaningTarget}`)
	},

	work(salary){
		this.money += salary
	}
}

const specificSkills = {
	cleanHouse(target){
		console.log(`${this.name} is going to clean a house`)
		super.clean(target)
	},

	goToWork(salary){
		super.work(salary)
		console.log(`${this.name} has earned ${salary} money`)
	}
}

const possessions = {
	money: 0,
	get cute(){
		if(this.boobs) {
			return true
		}
		return false
	}
}

Object.setPrototypeOf(specificSkills, skills)
Object.assign(Human.prototype, possessions, specificSkills)

const petya = new Man("Petya", 25)
const masha = new Woman("Masha", 22) 	// I want to be cute, I have boobs!



let masha = {
	prettyFace: true
}

const cuteMixin = {
	get cute(){
		if(this.prettyFace) return true
		return false
	}
}

Object.setPrototypeOf(masha, cuteMixin)
// Object.assign(masha, cuteMixin)	// copying methods directly invokes getter execution, so 'false' will be written to the 'cute' prop

console.log(masha.cute)				// false