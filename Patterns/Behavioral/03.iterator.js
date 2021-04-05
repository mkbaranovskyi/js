// ====== iterator ======
class MyIterator {
	constructor(data) {
		this.index = 0
		this.data = data
	}

	[Symbol.iterator]() {
		return {
			// this === MyIterator
			next: () => {
				if (this.index < this.data.length) {
					return {
						value: this.data[this.index++],
						done: false
					}
				}

				this.index = 0
				return { done: true }
			}
		}
	}
}

const iterator = new MyIterator(['This', 'is', 'iterator'])

for (const value of iterator) {
	console.log(value)
}

// ====== generator ======

function* generator(collection) {
	let index = 0

	while (index < collection.length) {
		yield collection[index++]
	}
}

const gen = generator(['This', 'is', 'generator'])

for (const value of gen) {
	console.log(value)
}
