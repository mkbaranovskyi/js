class CustomSearch extends HTMLElement {
	connectedCallback(){
		const shadow = this.attachShadow({ mode: 'open' })
		shadow.innerHTML = `
		<style>
			.closed {
				display: none;
			}

			:host {
				display: block;
				width: 200px;
			}

			input {
				width: 100%;
			}

			::slotted(*) {
				cursor: pointer;
			}

			.items-container * {
				position: absolute;
				width: 200px;
				max-height: 200px;
				overflow-y: auto;
			}
		</style>

		<input type="text" name="text" placeholder="Select country">

		<div class="items-container closed">			
			<slot name="item">	</slot>
		</div>`

		const $host = this
		const $input = shadow.querySelector('input[name="text"]')
		const $itemsContainer = shadow.querySelector('.items-container')
		const options = Array.from($host.children)
		
		$host.selectedIndex = null	// index of the last (and current) selected option
		let matchedOptions = []
		let highlightedIndex = null,
			inputIndex = 0

		function handleClick(e){
			const target = e.target.closest('[slot="item"]')
			
			// target is not an option - return
			if(!target) return
			
			// set the input value from the clicked option
			$input.value = target.textContent
			// highlight
			options[highlightedIndex].classList.remove('highlighted')
			target.classList.add('highlighted')
			// add property as for `select`
			$host.selectedIndex = highlightedIndex = options.indexOf(target)

			// and hide the options
			finishInput()
			// signal that we made a change
			$input.dispatchEvent(new Event('change'))
		}


		function finishInput(){
			$itemsContainer.classList.add('closed')
			$host.blur()
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


		// === CUSTOM-SELECT ===

		this.addEventListener('focusout', e => {
			finishInput()
		})
		

		// === INPUT ===

		$input.addEventListener('focusin', e => {
			// make all the options visible and matched
			resetMatchedOptions()
			// show options
			$itemsContainer.classList.remove('closed')
			// make all options available
			matchedOptions = Array.from(options)
			// select text in the input to quickly change it
			e.target.select()

			// highlight the previous choice
			if($host.selectedIndex !== null){
				options[$host.selectedIndex].classList.add('highlighted')
			}

			// add handler
			document.addEventListener('mousedown', handleClick)
		})

		$input.addEventListener('focusout', e => {
			options[highlightedIndex].classList.remove('highlighted')
			// remove handler
			document.removeEventListener('mousedown', handleClick)
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
				$input.value = options[$host.selectedIndex].textContent
				$host.blur()

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


		// === SLOT ===

		$itemsContainer.addEventListener('mouseover', e => {
			const target = e.target.closest('[slot]')
			if(target){
				// remove current selection
				if(highlightedIndex !== null){
					options[highlightedIndex].classList.remove('highlighted')
				}
				// set new selection and value 
				highlightedIndex = options.indexOf(target)
				target.classList.add('highlighted')
				$input.value = target.textContent
			}
		})

		$itemsContainer.addEventListener('mouseout', e => {
			const target = e.target.closest('[slot]')
			if(target){
				target.classList.remove('highlighted')
			}
		})
	}
}

customElements.define('custom-select', CustomSearch)