// Tasks: http://gitlab.a-level.com.ua/gitgod/FrontendLectures/src/master/A/08moduleFS2.md
// Array Combine (3 m)
function combine(arr1, arr2){
    if(arr1.length != arr2.length){
        console.log('Error! Enter arrays with the same length!')
        return
    }
    let obj = {}
    for(let i=0; i < arr1.length; i++){
        obj[arr1[i]] = arr2[i]
    }
    return obj
}



// Object sum (5 m)
function objSum(obj){
    let sum = [], i = 0
    for(let key in obj){
        if(typeof +key == 'number' && typeof +obj[key] == 'number'){
            sum[i++] = +key + +obj[key]
        }
        else {
            sum[i++] = 'NaN'
        }
    }
    return sum
}



// Form builder (9 m)
function formBuilder(obj){
    let form = document.createElement('form')
    let input
    for(let key in obj){
        input = document.createElement('input')
        input.setAttribute('type', obj[key])
        input.value = key

        input.addEventListener('focus', function(event){
            this.select()
        })

        form.appendChild(input)
    }
    return form
}

document.body.appendChild(formBuilder({'5': 'number', 'login': 'text', '': 'password'} ))



// setPropertyBySelector (3 m)
function setPropertyBySelector(selector, prop, val){
    let nodelist = document.querySelectorAll(selector)
    nodelist.forEach(item => item[prop] = val)
    return nodelist
}



// UpScroll (1 h)
function upScroll(){
    let button = document.createElement('img')
    let up = 'https://cdn3.iconfinder.com/data/icons/iconic-1/32/arrow_up_alt1-256.png'
    let down = 'https://cdn3.iconfinder.com/data/icons/iconic-1/32/arrow_down_alt1-256.png'
    button.src = up
    button.style.position = 'fixed'
    button.style.zIndex = 1
    let current = 0, previous = 0
    button.addEventListener('click', function(event){
        current = window.scrollY

        if(current < previous){
            button.src = up
        } else {
            button.src = down
        }

        if(current && !previous){
            window.scroll(0, 0)
        } else {
            window.scroll(0, previous)
        }
        previous = current
    })
    
    return button
}

document.body.prepend(upScroll())