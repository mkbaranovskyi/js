const car = {
	wheels: 4,

	init() {
		console.log(`I have ${this.wheels} wheels and my owner is ${this.owner}`)
	}
}

function vehicle(owner) {
	function F(owner) {
		this.owner = owner
	}
	F.prototype = car

	const f = new F(owner)

	return f
}

const carWithOwner = vehicle('Max')
console.log(carWithOwner)
carWithOwner.init()
