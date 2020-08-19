// Tasks: http://gitlab.a-level.com.ua/gitgod/FrontendLectures/src/master/module2_FE10.md
// objectValues
objectValues = obj => Object.values(obj)

var notebook = {
    brand: "HP",
    type:  "440 G4",
    model: "Y7Z75EA",
    ram: 4,
    size: "14",
    weight: 1.8,
    resolution: {
        width: 1920,
        height: 1080
    },
};

objectValues(notebook) //возвращает ["HP", "440 G4", "Y7Z75EA", 4, "14", 1.8, { width: 1920, height: 1080 } ]


// objectCombine
function objectCombine(arr1, arr2){
    if(arr1.length != arr2.length) return null
    let obj = {}
    for(let i=0; i < arr1.length; i++){
        obj[arr1[i]] = arr2[i]
    }
    return obj    
}



// <!DOCTYPE html>
// <html>
//     <head>
//         <title>choiceBuilder</title>
//         <meta charset="UTF8">
//     </head>
//     <body>
//         <div id="someId">         
//         </div>
//         <select id="someOtherId">
//         </select>
//         <script>
//          // choiceBuilder('someId', {default: 'Не указан', male: "Мужской", female: 'Женский'})
            function choiceBuilder(id, options){
                let element = document.getElementById(id)
                if(element.tagName === 'SELECT'){
                    for(let key in options){
                    
                        let option = document.createElement('option')
                        option.value = key
                        if(key === 'default'){
                            option.selected = 'selected'
                        }
                        option.textContent = options[key]
                        element.appendChild(option)
                    }
                } else {
                    for(let key in options){
                        let radio = document.createElement('input')
                        radio.type = 'radio'
                        radio.value = key
                        if(key === 'default'){
                            radio.checked = 'checked'
                        }
                        radio.name = 'myradio'
                        let label = document.createElement('label')
                        label.innerText = options[key]
                        label.prepend(radio)
                        element.appendChild(label)
                    }
                }
                return element
            }
{/* 
            choiceBuilder('someId', {default: 'Не указан', male: "Мужской", female: 'Женский'})
            choiceBuilder('someOtherId', {default: 'Не указан', male: "Мужской", female: 'Женский'})
        </script>
    </body>
</html> */}




// tableEditor
function tableEditor(id, arr) {
    let table = document.createElement('table')
    let tr
    let td
    for (let i = 0; i < arr.length; i++) {
        tr = document.createElement('tr')
        for (let j = 0; j < arr[i].length; j++) {
            td = document.createElement('td')
            td.innerHTML = arr[i][j]

            td.style.border = "1px solid black"
            td.style.width = "40px"
            td.style.height = "40px"
            tr.appendChild(td)
        }
        table.appendChild(tr)
    }
    table.style.borderCollapse = "collapse"
    table.style.textAlign = "center"

    let triggerField = {}

    let input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.style.display = 'none'
    input.addEventListener('focus', function(event){
        input.setAttribute('value', triggerField.element.innerHTML)
        input.select()
    })
    input.addEventListener('keypress', function(event){
        if(event.keyCode == 13){
            arr[triggerField.indexes[0]][triggerField.indexes[1]] = triggerField.element.innerHTML
            input.style.display = 'none'
            triggerField.element.innerHTML = this.value
        }
    })
    input.addEventListener('keypress', function(event){
        if(event.keyCode == 27){
            input.style.display = 'none'
        }
    })

    table.addEventListener('dblclick', function(event){
        let target = event.target
        if(target.nodeName == 'TD'){
            triggerField.element = target
            triggerField.indexes = [target.parentElement.rowIndex, target.cellIndex]
            input.style.display = 'block'
            input.setAttribute('value', target.innerHTML)
            input.focus()
        }
    })
    document.body.appendChild(input)
    document.body.appendChild(table)
    return table
}





// formBuilder
function formBuilder(id, obj, funcResult){
    let form = document.createElement('form')
    for(let key in obj){
        let input = document.createElement('input')
        input.setAttribute('type', key)
        input.setAttribute('placeholder', obj[key].placeholder)
        input.setAttribute('validator', obj[key].validator)
        form.appendChild(input)
    }

    let send = document.createElement('button')
    send.innerHTML = 'Send'
    send.addEventListener('click', function(event){
        event.preventDefault()
        let nodes = form.childNodes
        let currentFieldsValues = {}, 
            i = 0
        for(let key in obj){
            currentFieldsValues[key] = nodes[i++].value
        }
        let failed = false
        i = 0
        for(let key in obj){            
            if(!obj[key].validator(nodes[i], currentFieldsValues)){
                failed = true
                nodes[i].style.background = '#ff9999'
            }
            i++
        }
        if (!failed) {
            funcResult(form)
        }
    })
    form.appendChild(send)
    document.body.appendChild(form)
    return form
}