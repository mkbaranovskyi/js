class Subject {
	constructor() {
		this.observers = []
	}

	subscribe(observer) {
		this.observers.push(observer)
	}

	ubsubscribe(observer) {
		this.observers.splice(this.observers.indexOf(observer), 1)
	}

	emit(action) {
		this.observers.forEach((observer) => {
			observer.update(action)
		})
	}
}

// The simplest observer may be just a function, not necessarily a class
class Observer {
	constructor(state = 0) {
		this.state = this.initialState = state
	}

	update(action) {
		switch (action.type) {
			case 'INCREMENT':
				++this.state
				break
			case 'DECREMENT':
				--this.state
				break
			case 'ADD':
				this.state += action.payload
				break
			default:
				this.state = this.initialState
		}
	}
}

const stream = new Subject()

const obs1 = new Observer()
const obs2 = new Observer(42)

stream.subscribe(obs1)
stream.subscribe(obs2)

stream.emit({ type: 'DECREMENT' })
stream.emit({ type: 'ADD', payload: 10 })
stream.emit({ type: 'DECREMENT' })

console.log(stream)
