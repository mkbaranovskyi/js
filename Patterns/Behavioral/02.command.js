// ============== Math example ===============

class MyMath {
	constructor(initialValue = 0) {
		this.number = initialValue
	}

	square() {
		return this.number ** 2
	}

	cube() {
		return this.number ** 3
	}
}

class Command {
	// Subject is what we form our abstract wrapper around
	constructor(subject) {
		this.subject = subject
		this.commandsExecuted = []
	}

	execute(command) {
		this.commandsExecuted.push(command)
		return this.subject[command]()
	}
}

// We create a wrapper around MyMath class
const x = new Command(new MyMath(3))

console.log(x.execute('square'))
console.log(x.execute('cube'))

console.log(x.commandsExecuted)

// ============= Car example ================

class CarManager {
	requestInfo(model, id) {
		return 'The information for ' + model + ' with ID ' + id + ' is foobar'
	}

	buyVehicle(model, id) {
		return 'You have successfully purchased Item ' + id + ', a ' + model
	}

	arrangeViewing(model, id) {
		return 'You have successfully booked a viewing of ' + model + ' ( ' + id + ' ) '
	}
}

CarManager.prototype.execute = function (name) {
	return this[name] && this[name].apply(this, [].slice.call(arguments, 1))
}

const manager1 = new CarManager()

console.log(manager1.execute('arrangeViewing', 'Ferrari', '14523'))
console.log(manager1.execute('requestInfo', 'Ford Mondeo', '54323'))
console.log(manager1.execute('requestInfo', 'Ford Escort', '34232'))
console.log(manager1.execute('buyVehicle', 'Ford Escort', '34232'))
