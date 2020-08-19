"use strict"

// Getters and Setters
// https://learn.javascript.ru/property-accessors
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get

// Accessors - Getters and setters - work as usual (virtual) properties, no need to call them with parentheses. Inside they bind these properties to functions that are called during reading or writing to that properties.
// Getters should have 0, and setters - 1 parameter. It's key must be string or number. Two setters/getters are forbidden. Having a setter/getter and data property is forbidden. No exceptions. 

const user = {
    name: "John",
    surname: "Smith"
}

Object.defineProperty(user, 'fullName', { // We can use 'Object.defineProperty' to append a setter/getter to an existing object at any time
    get() {
        return `${this.name} ${this.surname}`
    },
    set(value){
        [this.name, this.surname] = value.split(" ")
    }
})

// Getters and setters can be easily deleted if 'configurable: true'
delete user.fullName        // false, since 'configurable: false'


user.fullName = 'Max Baranovskyi'
console.log(user.fullName)  // Max Baranovskyi


// Accessor properties don't have 'value' and 'writable' attributes, but have 'get' and 'set'
const descr = Object.getOwnPropertyDescriptor(user, 'fullName')
/*configurable: true
enumerable: true
get: ƒ fullName()
set: ƒ fullName(value)*/

const user = {
    name: "John",
    surname: "Smith",
    get fullName() {
        return `${this.name} ${this.surname}`
    },
    set fullName(value){
        [this.name, this.surname] = value.split(" ")
    }
}

delete user.fullName        // true
console.log(user.fullName)  // undefined


// NB: property can be either accessor (with set/get) or data property (with value). Trying to do both result in TypeError.

// We can use accessors to make more complicated properties
const user = {
    get name(){
        return this._name
    },
    set name(value){
        if(value.length < 4){
            console.log("Too short name")
            return
        }
        this._name = value
    }
}

// NB: You can still access user._name from the outside, but there's a convention that props starting with '_' are not to be used directly
user.name = "Max"           // Too short name
for(const key in user) console.log(`user[${key}] == ${user[key]}`) 
// Too short name
// user[name] == undefined

user.name = "Maximus"       // Maximus
for(const key in user) console.log(`user[${key}] == ${user[key]}`) 
// user[name] == Maximus
// user[_name] == Maximus

Object.defineProperty(user, '_name', { enumerable: false , writable: false })
for(const key in user) console.log(`user[${key}] == ${user[key]}`) 
// user[name] == Maximus


// We can prevent accessing '_name' from accessing directly. For this we should define properties with Object.defineProperties (not literal notation!) and write down the value in setter with Object.defineProperty (bc it will be impossible to wrote down directly with 'writable': false)
const user = {}

Object.defineProperties(user, {
    _name: {
        configurable: true  // to allow to define properties in setter, the rest of flags should be false
    },
    name: {
        enumerable: true,
        get(){
            return this._name
        },
        set(value){
            Object.defineProperty(this, '_name', {
                value       // 'value': value
            }) 
        }
    }
})




// We can use accessors to change regular data property to getter/setter. Let's say we have a usual constructor
function User(name, age) {
    this.name = name
    this.age = age
}

const max = new User("John", 25) // User {name: "John", age: 25}

// Now we want to provide birthdate instead of age. And not to lose the possibility to store age. So we change our constructor
function User(name, birthday) {
    this.name = name
    this.birthday = birthday

    Object.defineProperty(this, "age", {
        get(){ // we have only getter, no setter, so it's impossible to change 'age' directly, 'max.age = 222' won't work silently
            let start = new Date(1970, 0, 1)
            let fullAge = Date.now() - this.birthday // in ms
            let msSinceStart = fullAge - start 
            return new Date(msSinceStart).getFullYear() - start.getFullYear() // not precise, needs correction for leap years, otherwise 1 day mistake is possible
        },
        configurable: true
    })
}

const max = new User("John", new Date(1992, 10, 18))



// If we have setter but no getter, undefined will be always returned. But this is not always useless

const language = {
    log: [],
    set current(value){
        this.log.push(value)
    }
}

language.current = 'EN'
language.current = 'UA'

language.current    // undefined
language.log        // ['EN', 'UA]



// A LAZY getter calculates its value once and then just reads it without further calculation (useful for resources economy in case if the value is not expected to change)

const user = {
    get id(){
        let id = Math.floor(Math.random() * 100 + 1)
        
        Object.defineProperty(this, 'id', {     // during the first call the calculated value will be just hard-written to the prop
            value: id                           // the next calls will just read it as a regular property
        })

        return id 
    }
}

console.log(user.id)

// or just use a protected prop with 'if' to generate an '_id' the first time