class Car {
	constructor(model, price) {
		this.model = model
		this.price = price
	}
}

// Before creating a new instance, we check if it exists: if yes - return the existing instance, otherwise - create, add to the array of cars and return the new instance
class CarFactory {
	constructor() {
		this.cars = []
	}

	create(model, price) {
		const candidate = this.getCar(model)
		if (candidate) {
			return candidate
		}

		const newCar = new Car(model, price)
		this.cars.push(newCar)
		return newCar
	}

	getCar(model) {
		return this.cars.find((car) => car.model === model)
	}
}

const factory = new CarFactory()

const bmwX6 = factory.create('bmw', 40000)
const bmwI3 = factory.create('bmw', 30000) // won't be created since bmw already exists
const audi = factory.create('audi', 50000)

console.log(bmwX6)
console.log(bmwI3)
console.log(audi)

console.log(bmwI3 === bmwX6) // true
