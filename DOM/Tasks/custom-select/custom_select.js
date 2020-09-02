class CustomSearch extends HTMLElement {
	connectedCallback(){
		const shadow = this.attachShadow({ mode: 'open' })
		shadow.innerHTML = `
		<style>
			* {
				box-sizing: border-box;
			}

			.closed {
				display: none;
			}

			:host {
				display: block;
				width: 200px;
				height: 30px;
				margin: 10px 20px 0;
			}

			input {
				width: 100%;
				height: 100%;
				font-size: 16px;
			}

			::slotted(.highlighted){
				cursor: pointer;
				background: orange;
			}

			::slotted(option) {
				display: block;
				border-top: 1px solid lightgrey;
				padding: 3px 5px 3px;
			}

			.items-container {
				position: absolute;
				background-color: white;
				border: 1px solid black;
				width: 200px;
				max-height: 800px;
				overflow-y: auto;
				padding-bottom: 5px;
			}

			::placeholder {
				font-size: 16px;
			}
		</style>

		<input type="text" name="text" class="form-control">

		<div class="items-container closed">
			<slot>	</slot>
		</div>`

		const $host = this
		const $input = shadow.querySelector('input[name="text"]')
		const $itemsContainer = shadow.querySelector('.items-container')
		$input.placeholder = $host.getAttribute('placeholder') || ''

		// initialized after `slotchange` event
		let options,
			matchedOptions,
			highlightedIndex,
			inputIndex

		// ===== FUNCTIONS =====

		function initializeCustomElement(){
			options = Array.from($host.children)
			$host.selectedIndex = null
			matchedOptions = [],
			highlightedIndex = null,
			inputIndex = 0
		}
		
		function handleClick(e){

			// clicked on an option
			if(e.target.closest('option')){
				const target = e.target.closest('option')

				// set the input value from the clicked option
				$input.value = target.textContent
				// highlight
				options[highlightedIndex].classList.remove('highlighted')
				target.classList.add('highlighted')
				// add property as for `select`
				$host.selectedIndex = highlightedIndex = options.indexOf(target)
	
				// signal that we made a change
				$input.dispatchEvent(new Event('change'))
				finishInput()
			}

			// not an option but still our element
			else {
				if(e.target === $host){
					inputFinished = false
					$host.focus()
				}

				// anywhere else
				else {
					// restore previous selected value 
					if($host.selectedIndex === null){
						$input.value = ''
					} else {
						$input.value = options[$host.selectedIndex].textContent
					}
					highlightedIndex = $host.selectedIndex
					finishInput()
				}
			}
		}


		function finishInput(){
			$itemsContainer.classList.add('closed')
			$host.blur()
			document.removeEventListener('mouseup', handleClick)
		}

		/** Returns `true` is input is valid, `false` - otherwise */
		function validateInput(){
			if(!matchedOptions.length || !$input.value){
				return false
			}

			return true
		}


		/** Sets `matchedOptions` and builds the list of visible options */
		function filterOptions(e){
			const regexp = new RegExp(`^${e.target.value}`, 'i')
			matchedOptions.length = 0
			resetMatchedOptions(regexp)
		}
		
		/** Makes all the options that passed the regexp match, visible. If no regexp provided, makes all options visible 
		 * @param {RegExp} regexp - regexp to match options against, or nothing at all
		*/
		function resetMatchedOptions(regexp = /.*/){
			options.forEach(option => {
				// hide options that don't match regexp
				if(!regexp.test(option.textContent)){
					option.hidden = true
				} 
				// show options that match and save them additionally to an array
				else {
					option.hidden = false
					matchedOptions.push(option)
				}
			})
		}

		/** Handler for ArrowDown and ArrowUp that loops over the matching options
		 * @param {boolean} down - `true` if ArrowDown, `false` if ArrowUp
		 */
		function moveOverMatches(down){
			// switch to the next matched option
			if(down){
				inputIndex ++
			} else {
				inputIndex --
			}
			// carousel
			if(inputIndex >= matchedOptions.length){
				inputIndex = 0
			} else if(inputIndex < 0){
				inputIndex = matchedOptions.length - 1
			}
			
			// learn the global index of the current matched option and highlight it
			highlightedIndex = options.indexOf(matchedOptions[inputIndex])
			options[highlightedIndex].classList.add('highlighted')
			$input.value = options[highlightedIndex].textContent
		}


		// ===== CUSTOM-SELECT =====

		$itemsContainer.addEventListener('slotchange', initializeCustomElement)
		

		// ===== INPUT =====

		$input.addEventListener('focusin', e => {
			// make all the options visible and matched
			resetMatchedOptions()
			$itemsContainer.classList.remove('closed')
			// select text in the input to quickly change it
			e.target.select()

			// highlight the previous choice
			if($host.selectedIndex !== null){
				highlightedIndex = $host.selectedIndex
				options[highlightedIndex].classList.add('highlighted')
			}

			// add handler
			document.addEventListener('mouseup', handleClick)
		})

		$input.addEventListener('focusout', e => {
			if(highlightedIndex !== null){
				options[highlightedIndex].classList.remove('highlighted')
			}
		})


		$input.addEventListener('input', e => {
			filterOptions(e)
			if(!matchedOptions.length){
				return
			}

			// if there's a hightlight - remove it
			if(highlightedIndex !== null){
				options[highlightedIndex].classList.remove('highlighted')
			}

			// Evaluate an index of the first match and highlight it
			highlightedIndex = options.indexOf(matchedOptions[0])
			options[highlightedIndex].classList.add('highlighted')
		})


		$input.addEventListener('keydown', e => {

			if(e.code === 'Enter' || e.code === 'NumpadEnter'){
				e.preventDefault()
				
				// not valid enter - return
				if(!validateInput()){
					return
				}
				
				// we still didn't move anywhere - return
				if(highlightedIndex === null){
					return
				}

				$input.value = options[highlightedIndex].textContent
				// remember the index
				$host.selectedIndex = highlightedIndex 
				
				finishInput()

			} else if(e.code === 'Escape'){
				if($host.selectedIndex === null){
					$input.value = ''
				} else {
					$input.value = options[$host.selectedIndex].textContent
				}

				finishInput()

			} else if(e.code === 'ArrowDown'){
				e.preventDefault()

				// we start from 0-index
				if(highlightedIndex === null){
					highlightedIndex = -1
				}

				// remove the old highlight
				if(highlightedIndex >= 0){
					options[highlightedIndex].classList.remove('highlighted')
				}

				// if we arrow down after input
				if(matchedOptions.length < options.length){
					moveOverMatches(true)
					return
				}

				// switch to the next option
				highlightedIndex ++
				// carousel
				if(highlightedIndex >= options.length){
					highlightedIndex = 0
				}

				// set the value and highlight
				$input.value = options[highlightedIndex].textContent
				options[highlightedIndex].classList.add('highlighted')

			} else if(e.code === 'ArrowUp'){				
				e.preventDefault()
				
				// the first move
				if(highlightedIndex === null){
					highlightedIndex = 0
				} 
				
				// remove the old highlight
				options[highlightedIndex].classList.remove('highlighted')

				// if we arrow up after input
				if(matchedOptions.length < options.length){
					moveOverMatches(false)
					return
				}

				// switch to the next option
				highlightedIndex --
				// carousel
				if(highlightedIndex < 0){
					highlightedIndex = options.length - 1
				}

				// set the value and highlight
				$input.value = options[highlightedIndex].textContent
				options[highlightedIndex].classList.add('highlighted')
			}
		})

		$input.addEventListener('change', e => {
			// set `value` for our custom-select to be compatible with regular `select`
			$host.value = $input.value
						
			$host.dispatchEvent(new Event('change'))
		})


		// ===== SLOT =====

		$itemsContainer.addEventListener('mouseover', e => {
			const target = e.target.closest('option')
			if(!target){
				return
			}

			// remove current selection
			if(highlightedIndex !== null){
				options[highlightedIndex].classList.remove('highlighted')
			}
			// set new selection and value 
			highlightedIndex = options.indexOf(target)
			target.classList.add('highlighted')
			$input.value = target.textContent
		})

		$itemsContainer.addEventListener('mouseout', e => {
			const target = e.target.closest('option')
			if(target){
				target.classList.remove('highlighted')
			}
		})
	}
}

customElements.define('custom-select', CustomSearch)