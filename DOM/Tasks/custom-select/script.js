const $select = document.getElementById('select')
const $template = document.getElementById('template-select')

class CustomSearch extends HTMLElement {
	connectedCallback(){
		const shadow = this.attachShadow({ mode: 'open' })
		shadow.append($template.content.cloneNode(true))

		const $input = shadow.querySelector('#input-select')
		const $item = shadow.querySelector('slot[name="item"]')

		$input.addEventListener('focusin', e => {
			$item.classList.remove('closed')
		})

		$input.addEventListener('focusout', e => {
			$item.classList.add('closed')
		})
	}
}

customElements.define('custom-select', CustomSearch)
