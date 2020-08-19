// http://gitlab.a-level.com.ua/gitgod/FrontendLectures/src/master/module2_FE8.md
// reverse
function reverse(obj){
    let newObj = {}
    for(let key in obj){
        newObj[obj[key]] = key
    }
    return newObj
}

var obj = {
    foo: 'bar',
    for: 'in',
}

reverse(obj) // возвращает {bar: 'foo', 'in': 'for' }




// unique
function unique(arr){
    if(!Array.isArray(arr)){
        throw new Error("Please provide an array!")
    }
    let newArr = [arr[0]]
    for(let i=1; i < arr.length; i++){
        let flag = false
        for(let j=0; j < newArr.length; j++){
            if(arr[i] == newArr[j]){
                flag = true
                break
            }
        }
        if(!flag){
            newArr.push(arr[i])
        }
    }
    return newArr
}

unique(["lorem", null, 5, "15", 45, null, "45", "lorem", {}, {}, 5, 15]) // должно вернуть ["lorem", null, 5, "15", 45, {}, {}]





// chekboxlist
function checkboxList(id, arr){
    let div = document.createElement('div')
    for(let i=0; i < arr.length; i++){
        let label = document.createElement('label')
        label.textContent = arr[i] + ' '
        let check = document.createElement('input')
        check.type = "checkbox"
        label.appendChild(check)
        div.appendChild(label)
    }
    return div
}

var checkboxes = ['Пол', 'Высшее образование', 'Трудоустроен']


document.body.appendChild(checkboxList("checksContainer",checkboxes) /*создает три чекбокса с текстами из массива (пол, наличие высшего образование и трудоустроен или нет человек на текущий момент) один под другим в контейнере с id = checksContainer*/)





// modal
function modal(id){
    let modalElement = document.getElementById(id)
    let backgr = document.createElement('div')

    backgr.style.position = 'absolute'
    backgr.style.zIndex = 1
    backgr.style.opacity = .5
    backgr.style.background = 'lightgrey'
    backgr.style.width = '100%'
    backgr.style.height = '100%'
    backgr.addEventListener('click', function(event){
        modalElement.style.display = 'none'
        backgr.parentElement.removeChild(backgr)
    })
    document.body.appendChild(backgr)

    modalElement.style.display = 'block'
    modalElement.style.visibility = 'visible'
    modalElement.style.position = 'absolute'
    modalElement.style.top = '50%'
    modalElement.style.left = '50%'
    modalElement.style.marginRight = '-50%'
    modalElement.style.transform = 'translate(-50%, -50%)'
    modalElement.style.zIndex = 2

    return backgr
}

modal('modal') //параметр - id div-а, который покажется в качестве содержимого модального окна

/*<!DOCTYPE html>
<html>

<head>
    <title>modal</title>
    <meta charset="UTF8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body style="margin: 0; background: url('http://placekitten.com/2000/1000')">
    <button id="trigger">Click me!</button>
    <div id='modal' style='display: none'>
        <!-- изначально окно спрятано, и показывается только в модалке -->
        ВВедите логин: <input type='text'><br />
        ВВедите пароль: <input type='password'><br />
        <input type='submit'>
    </div>

    <script>
        function modal(id){
            let modalElement = document.getElementById(id)
            let backgr = document.createElement('div')

            backgr.style.position = 'absolute'
            backgr.style.zIndex = 1
            backgr.style.opacity = .5
            backgr.style.background = 'lightgrey'
            backgr.style.width = '100%'
            backgr.style.height = '100%'
            backgr.addEventListener('click', function(event){
                modalElement.style.display = 'none'
                backgr.parentElement.removeChild(backgr)
            })
            document.body.appendChild(backgr)

            modalElement.style.display = 'block'
            modalElement.style.visibility = 'visible'
            modalElement.style.position = 'absolute'
            modalElement.style.top = '50%'
            modalElement.style.left = '50%'
            modalElement.style.marginRight = '-50%'
            modalElement.style.transform = 'translate(-50%, -50%)'
            modalElement.style.zIndex = 2

            return backgr
        }

        modal('modal') //параметр - id div-а, который покажется в качестве содержимого модального окна

        trigger.onclick = function(){
            modal('modal')
        }
    </script>
</body>

</html>*/





// recursiveTree
function recursiveTree(element, struct, container, flag = false){  // flag is boolean, true == ol, false == ul
    container = container || element
    let tree; 
    if(typeof element === 'string') {
        tree = document.getElementById(element)
    } else {
        tree = element
    }
    let list = (flag) ? document.createElement('ol') : document.createElement('ul')
    
    for(let i=0; i < struct.length; i++){
        let li = document.createElement('li')
        if(Array.isArray(struct[i])){
            li.appendChild(recursiveTree(li, struct[i], container))
        } else {
            let a = document.createElement('a')
            a.href = "#"
            a.textContent = struct[i]
            li.appendChild(a)
        }
        li.addEventListener('mouseover', function(event){
            let parents = [], el = event.target
            while(el.id !== container){
                parents.push(el)
                el = el.parentNode
            }
            for(let i=0; i < parents.length -1; i++){  // -1 for excluding root ul/ol
                if(parents[i].nodeName === 'LI') {
                    parents[i].style.color = 'orange'
                }
            }
        })
        li.addEventListener('mouseout', function(event){
            let parents = [], el = event.target
            while(el.id !== container){
                parents.push(el)
                el = el.parentNode
            }
            for(let i=0; i < parents.length -1; i++){  // -1 for excluding root ul/ol
                parents[i].style.color = ''
            }
        })
        list.appendChild(li)
    }

    tree.appendChild(list)
    return list
}


var tree = [1,[21,22],3,[41,[421,422]],5]

recursiveTree('treeContainer',tree)   

/*<!DOCTYPE html>
<html>

<head>
    <title>recursiveTree</title>
    <meta charset="UTF8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
    
<div id="treeContainer"></div>

<script>
    function recursiveTree(element, struct, container, flag = false){  // flag is boolean, true == ol, false == ul
        container = container || element
        let tree; 
        if(typeof element === 'string') {
            tree = document.getElementById(element)
        } else {
            tree = element
        }
        let list = (flag) ? document.createElement('ol') : document.createElement('ul')
        
        for(let i=0; i < struct.length; i++){
            let li = document.createElement('li')
            if(Array.isArray(struct[i])){
                li.appendChild(recursiveTree(li, struct[i], container))
            } else {
                let a = document.createElement('a')
                a.href = "#"
                a.textContent = struct[i]
                li.appendChild(a)
            }
            li.addEventListener('mouseover', function(event){
                let parents = [], el = event.target
                while(el.id !== container){
                    parents.push(el)
                    el = el.parentNode
                }
                for(let i=0; i < parents.length -1; i++){  // -1 for excluding root ul/ol
                    if(parents[i].nodeName === 'LI') {
                        parents[i].style.color = 'orange'
                    }
                }
            })
            li.addEventListener('mouseout', function(event){
                let parents = [], el = event.target
                while(el.id !== container){
                    parents.push(el)
                    el = el.parentNode
                }
                for(let i=0; i < parents.length -1; i++){  // -1 for excluding root ul/ol
                    parents[i].style.color = ''
                }
            })
            list.appendChild(li)
        }

        tree.appendChild(list)
        return list
    }


    var tree = [1,[21,22],3,[41,[421,422]],5]

    recursiveTree('treeContainer',tree)    
</script>
</body>

</html>*/