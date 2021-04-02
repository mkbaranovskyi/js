class SimpleMembership {
	constructor(name) {
		this.name = name
		this.cost = 50
	}
}

class StandardMembership {
	constructor(name) {
		this.name = name
		this.cost = 150
	}
}

class PremiumMembership {
	constructor(name) {
		this.name = name
		this.cost = 500
	}
}

class MemberFactory {
	static list = {
		simple: SimpleMembership,
		standard: StandardMembership,
		premium: PremiumMembership
	}

	create(name, type = 'simple') {
		const Membership = MemberFactory.list[type] || MemberFactory.list.simple
		const member = new Membership(name)

		// We created an instance of the needed class and are ready to return it.
		// But here we can extend it with additional properties and methods - that's an advantage of the factory pattern.
		member.type = type
		member.define = function () {
			console.log(`${this.name} (${this.type}): ${this.cost}`)
		}

		return member
	}
}

const factory = new MemberFactory()

const members = [factory.create('Boris', 'premium'), factory.create('Inna', 'standard'), factory.create('Oleg')]

members.forEach((member) => member.define())
/* Boris (premium): 500
Inna (standard): 50
Oleg (simple): 50 */
