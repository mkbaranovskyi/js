// Tasks: http://gitlab.a-level.com.ua/gitgod/FrontendLectures/src/master/DOMHomeWork.md
function multiplicationTable(finish = 10, start = 0) {
    let table = document.createElement('table'),
        tr,
        td

    if(start > 0){ 
        start--
    }

    for (let i = start; i <= finish; i++) {
        tr = document.createElement('tr')
        for (let j = start; j <= finish; j++) {
            td = document.createElement('td')
            if (i == start) {
                td.textContent = j
                td.style.fontWeight = 'bold'
            } else {
                if(i != start && j == start){
                    td.textContent = i
                    td.style.fontWeight = 'bold'
                } else {
                    td.textContent = i * j
                }
            }
            td.style.border = "1px solid black"
            td.style.width = "40px"
            td.style.height = "40px"
            tr.appendChild(td)
        }
        if(i % 2 == 1){
            tr.style.backgroundColor = '#eee'
            tr.bgc = tr.style.backgroundColor
        }
        table.appendChild(tr)
    }
    table.style.borderCollapse = "collapse"
    table.style.textAlign = "center"
    return table
}

let Global = {
    triggerField: '', 
    offsetTop: '',
    offsetLeft: ''
}


// TABLE
let table = multiplicationTable(10)
let div = document.createElement('div')
div.style.position = 'static'
div.appendChild(table)

table.addEventListener('mouseover', function(event){
    if(event.target.nodeName == 'TD'){
        let myTable = event.target.parentElement.parentElement    
        let myTr = event.target.parentElement
        let index = event.target.cellIndex
        myTr.style.backgroundColor = '#99ffcc'
        for(let i=0; i < myTable.childNodes.length; i++){
            if(!myTable.childNodes[i].childNodes[index].bgc){
                myTable.childNodes[i].childNodes[index].style.backgroundColor = '#99ffcc'
            }
        }
    }
})
table.addEventListener('mouseout', function(event){
    if(event.target.nodeName == 'TD'){
        let myTable = event.target.parentElement.parentElement
        let myTr = event.target.parentElement
        let index = event.target.cellIndex
        myTr.style.backgroundColor = myTr.bgc || ''
        for(let i=0; i < myTable.childNodes.length; i++){
            if(!myTable.childNodes[i].childNodes[index].bgc){
                myTable.childNodes[i].childNodes[index].style.backgroundColor = ''
            }
        }
    }
})
table.addEventListener('mouseover', function(event){
    if(event.target.nodeName == 'TD'){
        event.target.style.backgroundColor = '#ffcc99'
    }
})
table.addEventListener('mouseout', function(event){
    if(event.target.nodeName == 'TD'){
        event.target.style.backgroundColor = event.target.style.backgroundColor = event.target.bgc
    }
})


// INPUT
let text = document.createElement('input')
text.setAttribute('type', 'text')
text.style.position = 'relative'
text.style.visibility = 'hidden'
text.addEventListener('focus', function(event){
    this.value = Global.triggerField.textContent
    this.select()
})
text.addEventListener('focusout', function(event){
    if(this.value != Global.triggerField.textContent){
        Global.triggerField.textContent = this.value || Global.triggerField.textContent
        Global.triggerField.style.backgroundColor = '#ffcccc'
        Global.triggerField.bgc = Global.triggerField.style.backgroundColor
    } 
    event.target.style.visibility = 'hidden'
    //event.target.style.display = 'none'
})
text.addEventListener('keypress', function(event){
    if(event.keyCode == 13){
        if(this.value != Global.triggerField.textContent){
            Global.triggerField.textContent = this.value || Global.triggerField.textContent
            Global.triggerField.style.backgroundColor = '#ffcccc'
            Global.triggerField.bgc = Global.triggerField.style.backgroundColor
        } 
        event.target.style.visibility = 'hidden'
        //event.target.style.display = 'none'
    }
})

document.body.appendChild(text)


// Additional task: double click creates text form for changing the value of the cell
table.addEventListener('dblclick', function(event){
    if(event.target.nodeName == 'TD'){
        Global.triggerField = event.target
        Global.offsetTop = event.target.offsetTop
        Global.offsetLeft = event.target.offsetLeft
        
        text.style.top = `${Global.offsetTop + 40}px`
        text.style.left = `${Global.offsetLeft}px`
        text.style.visibility = 'visible'
        text.focus()
    }
})

let dragged
document.addEventListener('dragstart', function(event){
    dragged = event.target // Why is it 'tr' and not 'td'?
    console.log(dragged)
    event.target.style.opacity = .5
})
document.addEventListener('dragend', function(event){
    event.target.style.opacity = ''
})
document.addEventListener('dragover', function(event){
    event.preventDefault()
})
document.addEventListener('dragenter', function(event){
    event.target.style.background = 'purple'
})
document.addEventListener('dragleave', function(event){
    event.target.style.background = ''
})
document.addEventListener('drop', function(event){
    event.preventDefault()
    if(event.target.classList.contains('dropzone')){
        dragged.parentElement.removeChild(dragged)
        event.target.parentElement.parentElement.insertBefore(dragged, event.target.parentElement)
    }
})

document.body.appendChild(div)
