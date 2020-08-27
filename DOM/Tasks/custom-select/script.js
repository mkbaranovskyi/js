const $select = document.getElementById('select')
const $template = document.getElementById('template-select')

class CustomSearch extends HTMLElement {
	connectedCallback(){
		// custom-select
		const $host = this
		const matchedOptions = []
		console.log($host)

		const shadow = this.attachShadow({ mode: 'open' })
		shadow.innerHTML = `
		<style>
			.closed {
				display: none;
			}
		</style>

		<input type="text" name="text" placeholder="Select country">

		<div class="items-container closed">
			<!-- <slot name="title"></slot> -->
			
			<slot name="item">	</slot>
		</div>`

		const $input = shadow.querySelector('input[name="text"]')
		const $itemsContainer = shadow.querySelector('.items-container')

		function handleClick(e){
			// if clicked on the option
			if(e.target.closest('div[slot="item"]')) {
				// set input value from the clicked option
				$input.value = e.target.closest('div[slot="item"]').textContent
				// and hide the options
				$itemsContainer.classList.add('closed')
			} 
			// .. on custom-select but not the option
			else if(!e.target.closest('custom-select[active]')){
				$itemsContainer.classList.add('closed')
			} 
		}

		
		// === INPUT ===

		$input.addEventListener('focusin', e => {
			// show options
			$itemsContainer.classList.remove('closed')
			// select text in input to quickly change it
			e.target.select()

			// mark this instance of custom-select as active
			this.setAttribute('active', 'active')

			// add handler
			document.addEventListener('mousedown', handleClick)
		})

		$input.addEventListener('focusout', e => {
			// remove handler
			document.removeEventListener('mousedown', handleClick)
		})

		$input.addEventListener('input', e => {
			// remove consequences of the previous call
			Array.from($host.children).forEach(child => child.hidden = false)

			const regexp = new RegExp(`^${e.target.value}`, 'i')
			const options = Array.from($host.children)
			matchedOptions.length = 0

			options.forEach(option => {
				// hide options that don't match regexp
				if(!regexp.test(option.textContent)){
					option.hidden = true
				} 
				// options that match, gather to another array
				else {
					matchedOptions.push(option)
				}
			})

			// highlight the first matching option
			
			console.log(matchedOptions)
		})

		$input.addEventListener('keypress', e => {
			if(e.code === 'Enter'){
				$input.value = matchedOptions[0].textContent
				$itemsContainer.classList.add('closed')
				this.removeAttribute('active')
			}
		})

		$input.addEventListener('change', e => {
			// make all the options visible again
			Array.from($host.children).forEach(child => child.hidden = false)
		})


		// === CUSTOM-SELECT ===

		this.addEventListener('focusout', e => {
			// when custom-select loses focus - it's no longer active
			this.removeAttribute('active')
		})

	}
}

customElements.define('custom-select', CustomSearch)
