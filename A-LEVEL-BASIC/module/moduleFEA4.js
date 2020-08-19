// // Tasks: http://gitlab.a-level.com.ua/gitgod/FrontendLectures/src/master/A/08moduleFEA4.md
// Type Stats
function typeStats(arr){
	let obj = {}
	for(let i=0; i < arr.length; i++){		
		if(obj[typeof arr[i]] == undefined){
			obj[typeof arr[i]] = 1
		} else {
			++obj[typeof arr[i]]
		}
	}
	return obj
}

var arr = ['1', 0, Math.random, alert, prompt, prompt(), null, undefined, "name", {}]

typeStats(arr); //вернет { string: 3 /* или два */, number: 1, function: 3, object: 2 /* или три */, undefined: 1}





// Intersect
function intersect(arr1, arr2){
	let newArr = []
	for(let i=0; i < arr1.length; i++){
		for(let j=0, flag = true; j < arr2.length; j++){
			if(arr1[i] === arr2[j]){
				for(let k=0; k < newArr.length; k++){
					if(arr1[i] === newArr[k]){
						flag = false
						break
					} 
				}
				if(flag){
					newArr.push(arr1[i])
				}
			}
		}
	}
	return newArr
}





// oddEvenClass
function oddEvenClass(id, class1, class2){
	let children = document.getElementById(id).children

	for(let i=0; i < children.length; i++){
		if(i % 2 == 0) {
			children[i].className += ` ${class1}`
		} else {
			children[i].className += ` ${class2}`
		}
	}

	return children
}

 



// upScroll
function upScroll(id){
	let button = document.createElement('img')
	let up = 'https://cdn3.iconfinder.com/data/icons/iconic-1/32/arrow_up_alt1-256.png'
	let down = 'https://cdn3.iconfinder.com/data/icons/iconic-1/32/arrow_down_alt1-256.png'
	button.src = up
	button.style.position = 'fixed'
	button.style.zIndex = 1
	let current = 0, previous = 0
	button.addEventListener('click', function(){
		current = window.scrollY
		if(previous && current){ 
			window.scroll(0, 0)
		} else {
			window.scroll(0, previous)
		}
		if(current > previous){
			button.src = down
		} else {
			button.src = up
		}
		previous = current
	})
	return button
}

document.body.prepend(upScroll())





// tabs 
function tabs(arr){
	for(let i=0; i < arr.length; i++){
		if(i){
			arr[i].block.style.display = 'none'
		}
		arr[i].button.addEventListener('click', function(){
			if(arr[i].block.style.display === 'none'){
				arr[i].block.style.display = 'block'
			} else {
				arr[i].block.style.display = 'none'
			}
		})
	}
}    

/*<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <section>
        <button class="switch">CLick 1</button>
        <div class="block">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia laudantium vitae error id. Quidem velit explicabo facilis alias animi eos odit obcaecati dolorem? Laudantium cum repudiandae optio sint excepturi voluptas.</div>
    </section>
    <section>
        <button class="switch">CLick 2</button>
        <div class="block">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia laudantium vitae error id. Quidem velit explicabo facilis alias animi eos odit obcaecati dolorem? Laudantium cum repudiandae optio sint excepturi voluptas.</div>
    </section>
    <section>
        <button class="switch">CLick 3</button>
        <div class="block">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia laudantium vitae error id. Quidem velit explicabo facilis alias animi eos odit obcaecati dolorem? Laudantium cum repudiandae optio sint excepturi voluptas.</div>
    </section>

    <script>
        function tabs(arr){
	        for(let i=0; i < arr.length; i++){
		        if(i){
			        arr[i].block.style.display = 'none'
                }
                arr[i].button.addEventListener('click', function(){
                    if(arr[i].block.style.display === 'none'){
                        arr[i].block.style.display = 'block'
                    } else {
                        arr[i].block.style.display = 'none'
                    }
                })
	        }
        }    

        let arr = []
        let buttons = document.querySelectorAll('button.switch')
        let blocks = document.querySelectorAll('div.block')
        for(let i=0, obj = {}; i < buttons.length; i++){
            arr[i] = {}
            arr[i].button = buttons[i]
            arr[i].block = blocks[i]
        }
        tabs(arr)
    </script>
</body>
</html>*/