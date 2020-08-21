'use strict'

/*
public поля доступны отовсюду - из класса, классов-потомков и инстансов.

protected поля доступны только из класса и классов-потомков. Это значит, что если ты хочешь обратиться к ним из инстанса, ты можешь сделать это только через публичный метод в классе, лежащий на том же уровне и имеющий доступ к защищенным полям. У меня в примере это есть. Это и называется инкапсуляцией, когда ты закрываешь полный доступ к внутренним полям и оставляешь только доступ через выбранный тобой интерфейс. Хочешь достучаться до защищенной переменной - только через вот этот сеттер или геттер - не напрямую через точку.

private - то же самое, но минус доступ из классов-потомков. То есть потомки лишаются возможности изменить возвращаемое приватное свойство. Допустим, класс-родитель установил приватное свойство #secret = 42. Если бы оно было protected, классы-потомки могли бы переписать геттер и сеттер для доступа к нему таким образом, чтобы он возвращал, например, 33. Но поскольку это свойство private, они не могут написать никакие новые методы (или переопределить старые) для доступа к этому приватному полю - к нему можно будет обратиться только через оригинальные геттеры и сеттеры из класса-родителя через цепочку прототипов.

Truly private fields can be created using modules: 
1. Put your class to a module
2. Put a variable outside of that class in a module.
3. Make an interface in the class to access the outer variable via the closure. There will be no other way to access it from the outside. 
*/

// Incapsulation is the separation of the inner interface from the outer one.
// PUBLIC accessible from anywhere: the class, descendent classes, instances, etc. (default).
// PROTECTED are accessible from the class and its descendent classes (not the instances).
// PRIVATE fields are those that only accessible from inside the class.

// Synopsis
class Example {
	publicField 	= 'public'
	_protectedField = 'protected'
	#privateField 	= 'private'

	set protectedField(value){
		this._protectedField = value
	}
	get protectedField(){
		return this._protectedField.toUpperCase()
	}

	getPrivateProp(){
		return this.#privateField
	}

	setPrivateProp(value){
		this.#privateField = value
	}
}

const example = new Example()

console.log(example.publicField)			// "public"
// the protected prop is accessible via getter/setter and is processed before output the result
console.log(example.protectedField)			// "PROTECTED"
example.protectedField = 'NewProtected'	
console.log(example.protectedField)			// "NEWPROTECTED"
// console.log(example.#privateField) 		// SyntaxError, private fields cannot be accessed outside of their home class

console.log(example.getPrivateProp())		// "private", the only way to access a private field is through a function in the same class


class Ext extends Example {
	// We can override protected fields from a descendent class
	set protectedField(value){
		this._protectedField = value + "!!!"
	}

	get protectedField(){
		return `That's how we get protected fields from the descendent class: _protectedField === ${this._protectedField}`
	}

	// But we can't do anything related to a private prop, other than using the existing 'outerInterface' function
	// getPrivateProp(){
	// 	return this.#privateField			// SyntaxError, no access to a private prop from the other class
	// }
}

const extension = new Ext()

console.log(extension.publicField)			// "public"
console.log(extension.protectedField)		// "That's how we get protected fields from the descendent class: _protectedField === protected"
// console.log(extension.#privateField) 	// SyntaxError, private fields cannot be accessed outside of their home class
extension.protectedField = 'NewProtected'	
console.log(extension.protectedField)		// "That's how we get protected fields from the descendent class: _protectedField === NewProtected!!!"

console.log(extension.getPrivateProp())		// "private", the only way to access a private field is through a function in the same class





// In details

// PUBLIC
class CoffeeMachine {
	constructor(power) {
		this.power = power
		this.waterAmount = 0
	}
}

const coffeeMachine = new CoffeeMachine(100)
coffeeMachine.waterAmount = 200

// Now both props are public: we can access them from anywhere and set any values. Let's make them protected



// PROTECTED
// We'll treat '_prop' as protected fields (inner interface) and only access 'prop' through getters/setters (outer interface)

// Basic example

class CoffeMachine {
	constructor(power){
		this._power = power
		this._waterAmount = 0
	}

	set waterAmount(value){
		if (value < 0)  throw new Error("Negative amount of water!")

		this._waterAmount = value
	}

	get waterAmount(){
		return this._waterAmount
	}

	get power(){ // Power of a device is constant, so let's make it read-only. For this we'll create getter but no setter
		return this._power
	}
}

const coffeMachine = new CoffeMachine(800)
// coffeMachine.waterAmount = -500 		// TypeError, setter works
// coffeMachine.power = 100 			// won't do anything - no setter
console.log(coffeMachine.power) 		// 800
coffeMachine.waterAmount = 200
console.log(coffeMachine.waterAmount)	// 200

// Remember: there are no real protected fields in JS yet, so we can accidently do 'coffeMathing._power = 1000' and it'll work. We can prevent this accidents from happening using 'Object.defineProperties()'



// More advanced example

class CoffeMachine {
	constructor(power) {
		Object.defineProperties(this, {
			_power: {
				value: power
			},

			_waterAmount: {
				value: 0,
				configurable: true
			}
		})
	}

	set waterAmount(value) {
		if (value < 0) throw new Error(`Water amount can't be below zero!`)

		Object.defineProperty(this, '_waterAmount', {
			value,
			configurable: true
		})
	}

	get waterAmount() {
		return this._waterAmount
	}

	// we have getter but no setter - read-only prop
	get power() {
		return this._power
	}
}

const coffeeMashine = new CoffeMachine(800)
console.log(coffeeMashine) // _power: 800, _waterAmount: 0

coffeeMashine.waterAmount = 250 // assigned successfully via the setter
coffeeMashine._waterAmount = 1000 // direct assigning doesn't work 
console.log(coffeeMashine.waterAmount) // 250

// 'power' is read-only prop, no way to change it
coffeeMashine.power = 1000 // doesn't work, no setter
coffeeMashine._power = 1000 // doesn't work either
console.log(coffeeMashine) // _power: 800, _waterAmount: 250

// Now we can only set new value to '_waterAmount' by using 'Object.defineProperty', but this will definitely be not an accident. Other than that, both fields are protected.




// Alternatively to setters and getters we can use real functions. This gives us more flexibility (e.g. we can pass multiple arguments to a setter if needed)

class CoffeMachine {
	constructor(power) {
		Object.defineProperties(this, {
			_power: {
				value: power
			},

			_waterAmount: {
				value: 0,
				configurable: true
			}
		})
	}

	setWaterAmount(value) {
		if (value < 0)  throw new Error("Negative amount of water!")

		Object.defineProperty(this, '_waterAmount', {
			value,
			configurable: true
		})
	}

	getWaterAmount() {
		return this._waterAmount
	}
}

let coffeMachine = new CoffeMachine()
coffeMachine.setWaterAmount(200)
console.log(coffeMachine.getWaterAmount())	// 200




// PRIVATE
// We can inherit protected fields with no problem. But not the private ones. Private props and methods can only be accessed from the class they were declared in. Private props and methods start with '#'. 

class CoffeMachine {
	#waterLimit = 1000		// <---

	constructor(power) {
		Object.defineProperties(this, {
			_power: {
				value: power
			},

			_waterAmount: {
				value: 0,
				configurable: true
			}
		})
	}

	setWaterAmount(value) {
		if (value < 0)  throw new Error("Negative amount of water!")
        if (value > this.#waterLimit)  throw new Error("Too much water!")	// <---

		Object.defineProperty(this, '_waterAmount', {
			value,
			configurable: true
		})
	}

	getWaterAmount() {
		return this._waterAmount
	}
}

let coffeMachine = new CoffeMachine()

// We cannot access a private prop from the outside of its class:
// coffeMachine.#waterLimit		// SyntaxError

// But we can use class methods for this:
// coffeMachine.setWaterAmount(1200)	// Error: Too much water!
coffeMachine.setWaterAmount(500)
console.log(coffeMachine.getWaterAmount())	// 500




// We can also have 2 fields with the same name: one private (with #) and one public (w/o #) - these are different fields!

class Test {
	#priv = 42
	
	setPriv(v){
		this.#priv = v
    }

	getPriv(){
		return this.#priv
    }
}

const test = new Test()
console.log(test.priv)	// 42
test.priv = 69			
console.log(test.priv)	// 69


// We cannot access private props from anywhere except their own home class, including a descendent class, bc they can't be inherited from

// class Child extends Test {
// 	output(){ return this.#priv } 	// SyntaxError -> #priv doesn't exist in this Lexical Environment
// }

// We'd have to rely on the getter/setter of 'Test' 

class Child extends Test {}

const child = new Child()
console.log(child.priv)	//42


// Static props and methods can be private as well
