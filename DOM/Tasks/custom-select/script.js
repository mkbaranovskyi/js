const $select = document.getElementById('select')
const $template = document.getElementById('template-select')

class CustomSearch extends HTMLElement {
	connectedCallback(){
		const shadow = this.attachShadow({ mode: 'open' })
		shadow.innerHTML = `
		<style>
			.closed {
				display: none;
			}
		</style>

		<input type="text" name="text" placeholder="">

		<div class="items-container closed">
			<!-- <slot name="title"></slot> -->
			
			<slot name="item">	</slot name="items">
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

		this.addEventListener('focusout', e => {
			// when custom-select loses focus - it's no longer active
			this.removeAttribute('active')
		})

	}
}

customElements.define('custom-select', CustomSearch)
