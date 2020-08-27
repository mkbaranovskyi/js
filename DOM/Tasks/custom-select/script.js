const $select = document.getElementById('select')
const $template = document.getElementById('template-select')

class CustomSearch extends HTMLElement {
	connectedCallback(){
		const shadow = this.attachShadow({ mode: 'open' })
		shadow.append($template.content.cloneNode(true))

		const $input = shadow.querySelector('#input-select')
		const $itemsContainer = shadow.querySelector('.items-container')
		console.log($itemsContainer)

		$input.addEventListener('focusin', e => {
			$itemsContainer.classList.remove('closed')

			// add handler
			document.addEventListener('mousedown', handleBlur)
		})

		$input.addEventListener('focusout', e => {
			// remove handler
			document.removeEventListener('mousedown', handleBlur)
		})

		function handleBlur(e){
			console.log(e)
			
			// if clicked on the option - change the input value
			const target = e.target.closest('div[slot="item"]')
			if(target) {
				$input.value = target.textContent
			}

			// either way - hide the container
			$itemsContainer.classList.add('closed')
			console.log('hidden')
		}


		// function handleBlur(e){
		// 	console.log('yo')
		// 	// // if called the first time - return
		// 	// if(firstCall) {
		// 	// 	firstCall = false
		// 	// 	return
		// 	// }

		// 	// if clicked on the option - change the input value
		// 	const target = e.target.closest('div[slot="item"]')
		// 	if(target) {
		// 		$input.value = target.textContent
		// 	}

		// 	// either way - hide the container
		// 	$itemsContainer.classList.add('closed')
		// 	console.log('hidden')
		// }
	}
}

customElements.define('custom-select', CustomSearch)
