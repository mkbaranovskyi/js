class Employee {
	constructor(name, salary) {
		this.name = name
		this.salary = salary
	}

	responsibilities() {}

	work() {
		return `${this.name} is ${this.responsibilities()}`
	}

	getPayed() {
		return `${this.name} earns ${this.salary}`
	}
}

class Developer extends Employee {
	constructor(name, salary) {
		super(name, salary)
	}

	responsibilities() {
		return 'writing software'
	}
}

class Tester extends Employee {
	constructor(name, salary) {
		super(name, salary)
	}

	responsibilities() {
		return 'testing software'
	}
}

const dev = new Developer('Anya', 600)
const tester = new Tester('Olya', 750)

console.log(dev.work())
console.log(tester.getPayed())
