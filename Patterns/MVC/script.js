'use strict'
const model = { items: [] }

const view = {
	clearList() {
		const range = document.createRange()
		range.selectNodeContents(document.getElementById('list'))
		range.deleteContents()
	},

	render() {
		this.clearList()

		if (model.items.length > 0) {
			const list = document.getElementById('list')

			for (let i = model.items.length - 1; i >= 0; i--) {
				const item = document.createElement('li')
				const span = document.createElement('span')
				const check = document.createElement('a')
				const cross = document.createElement('a')
				const iconCheck = document.createElement('i')
				const iconCross = document.createElement('i')

				item.className = 'item'
				span.className = 'item-text'
				check.className = 'item-complete'
				cross.className = 'item-delete'

				span.textContent = model.items[i].text

				// Put a line through any items we've 'ticked' off
				if (model.items[i].completed) {
					span.setAttribute(
						'style',
						'text-decoration: line-through; color: #bbb'
					)
				}

				// Add our icons
				iconCheck.setAttribute('class', 'icon ion-md-checkmark')
				iconCheck.setAttribute('data-id', i)
				iconCross.setAttribute('class', 'icon ion-md-trash')
				iconCross.setAttribute('data-id', i)

				// Add our onclick functions for complete/delete actions
				check.setAttribute('onclick', "controller.completeItem('" + i + "')")
				cross.setAttribute('onclick', "controller.deleteItem('" + i + "')")

				// Append all our elements and add to DOM
				check.append(iconCheck)
				cross.append(iconCross)
				item.append(span)
				item.append(check)
				item.append(cross)
				list.append(item)
			}
		}
	},

	addItem(e) {
		if (e.code === 'Enter' || e.code === 'NumpadEnter') {
			const inputValue = document.getElementById('add-item').value
			if (inputValue !== '' && inputValue !== ' ') {
				controller.addItem(inputValue)
				return false
			}
		}
	}
}

const controller = {
	init() {
		view.render()
	},

	addItem(item) {
		const list_item = { text: item, completed: false }
		model.items.push(list_item)
		document.getElementById('add-item').value = ''
		view.render()
	},

	completeItem(item_index) {
		model.items[item_index].completed = !model.items[item_index].completed
		view.render()
	},

	deleteItem(item_index) {
		model.items.splice(item_index, 1)
		view.render()
	}
}

document.getElementById('add-item').addEventListener('keypress', (e) => {
	view.addItem(e)
})

controller.addItem('Feed doggo.')
controller.addItem('Feed catto.')

controller.init() // Render the initial data
