/* ES5 */
// function Person(name, surname) {
// 	this.name = name
// 	this.surname = surname
// }

// Person.prototype.getFullname = function () {
// 	return this.name + ' ' + this.surname
// }

/* ES6 */
class Person {
	constructor(name, surname) {
		this.name = name
		this.surname = surname
	}

	getFullname() {
		return this.name + ' ' + this.surname
	}
}

const person = new Person('Max', 'Bar')
console.log(person)
console.log(person.getFullname())
