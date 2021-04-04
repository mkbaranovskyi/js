class Complaints {
	constructor() {
		this.complaints = []
	}

	reply() {}

	add(complaint) {
		this.complaints.push(complaint)
		return this.reply(complaint)
	}
}

class ProductComplaints extends Complaints {
	reply({ id, customer, details }) {
		return `Product ${id}, ${customer}: "${details}"`
	}
}

class ServiceComplaints extends Complaints {
	reply({ id, customer, details }) {
		return `Service ${id}, ${customer}: "${details}"`
	}
}

// Our facade decides to which class to apply our complaint
class ComplaintRegistry {
	register({ customer, type, details }) {
		const id = Date.now()
		let complaint

		if (type === 'product') {
			complaint = new ProductComplaints()
		} else {
			complaint = new ServiceComplaints()
		}

		return complaint.add({ id, customer, details })
	}
}

const registry = new ComplaintRegistry()

console.log(registry.register({ customer: 'Petya', type: 'product', details: 'You product is lame' }))
console.log(registry.register({ customer: 'Vasilisa', details: 'Your service sucks' }))
