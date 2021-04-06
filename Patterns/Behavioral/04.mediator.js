class User {
	constructor(name) {
		this.name = name
		this.room = null
	}

	send(message, to) {
		// `this` represents `from who` here
		this.room.send(message, this, to)
	}

	receive(message, from) {
		console.log(`${from.name} => ${this.name}: ${message}`)
	}
}

class ChatRoom {
	constructor() {
		this.users = {}
	}

	register(user) {
		this.users[user.name] = user
		user.room = this
	}

	send(message, from, to) {
		if (to) {
			to.receive(message, from)
		} else {
			// otherwise - to all users in the chatroom except the sender
			Object.keys(this.users).forEach((user) => {
				if (this.users[user] !== from) {
					this.users[user].receive(message, from)
				}
			})
		}
	}
}

const vlad = new User('Vlad')
const max = new User('Max')
const igor = new User('Igor')

const room = new ChatRoom()

room.register(vlad)
room.register(max)
room.register(igor)

vlad.send('yo', max)
max.send('hey', vlad)
igor.send('Hello everybody')
