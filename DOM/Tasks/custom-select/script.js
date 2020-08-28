class CustomSearch extends HTMLElement {
	connectedCallback(){
		const $host = this		// custom-select
		let matchedOptions = Array.from($host.children)
		let selectedIndex

		const shadow = this.attachShadow({ mode: 'open' })
		shadow.innerHTML = `
		<style>
			.closed {
				display: none;
			}
		</style>

		<input type="text" name="text" placeholder="Select country">

		<div class="items-container closed">			
			<slot name="item">	</slot>
		</div>`

		const $input = shadow.querySelector('input[name="text"]')
		const $itemsContainer = shadow.querySelector('.items-container')


		function handleClick(e){
			// if clicked on the option
			if(e.target.closest('[slot="item"]')) {
				// set input value from the clicked option
				$input.value = e.target.closest('[slot="item"]').textContent
				// remember the index of your choice
				selectedIndex = Array.from($host.children).indexOf(e.target.closest('[slot="item"]'))
				// and hide the options
				finishInput()
				// signal that we made a change
				$input.dispatchEvent(new Event('change'))
			} 
		}


		function finishInput(){
			$itemsContainer.classList.add('closed')
			$host.blur()

			// if incorrect input - set the least correct one to $input.value
			if(!checkCorrectInput()){
				$input.value = ''
				return
			}
		}

		function resetInput(){
			matchedOptions = Array.from($host.children)
			matchedOptions.forEach(option => option.hidden = false)

			// search all options and find the one with a mark, find its index and remove the mark
			let i = 0
			for(const option of matchedOptions){
				if(option.hasAttribute('selected')){
					selectedIndex = i
					option.removeAttribute('selected')
					break
				}
				i++
			}
		}

		function checkCorrectInput(){
			return Array.from($host.children).some(option => $input.value === option.textContent)
		}


		// === CUSTOM-SELECT ===

		this.addEventListener('focusout', e => {
			finishInput()
		})
		

		// === INPUT ===

		$input.addEventListener('focusin', e => {
			resetInput()
			// show options
			$itemsContainer.classList.remove('closed')
			// select text in input to quickly change it
			e.target.select()

			// add handler
			document.addEventListener('mousedown', handleClick)
		})

		$input.addEventListener('focusout', e => {
			// remove handler
			document.removeEventListener('mousedown', handleClick)
		})


		$input.addEventListener('input', e => {
			resetInput()

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

			// if we typed anything - the default selection should be 0 of the matching options
			selectedIndex = 0
		})


		$input.addEventListener('keydown', e => {
			if(e.code === 'Enter' || e.code === 'NumpadEnter'){

				// if no matched options (incorrect input)
				if(!matchedOptions.length){
					$input.value = ''
					return

				} else {
					$input.value = matchedOptions[selectedIndex].textContent
					// set attribute for the further tracking
					matchedOptions[selectedIndex].setAttribute('selected', 'selected')
				}

				finishInput()

			} else if(e.code === 'Escape'){
				$host.blur()

			} else if(e.code === 'ArrowDown'){
				e.preventDefault()

				// going down from the empty input should select 0-index elem
				if($input.value === ''){
					selectedIndex = -1
				}

				selectedIndex ++
				// loop over the options
				if(selectedIndex >= matchedOptions.length){
					selectedIndex = 0
				}

				$input.value = matchedOptions[selectedIndex].textContent

			} else if(e.code === 'ArrowUp'){
				e.preventDefault()

				selectedIndex --
				// loop over the options
				if(selectedIndex < 0){
					selectedIndex = matchedOptions.length - 1
				}

				$input.value = matchedOptions[selectedIndex].textContent
			}
		})

		$input.addEventListener('change', e => {
			$host.setAttribute('value', $input.value)
			resetInput()
		})
	}
}

customElements.define('custom-select', CustomSearch)