// @ts-check
"ust strict"
// Tasks: http://gitlab.a-level.com.ua/gitgod/FrontendLectures/src/master/08module.md

// extend
const extend1 = (target, ...source) => Object.assign(target, ...source) // copy inner objects by reference
const extend2 = (target, ...source) => { // deep cloning inner objects
    source.map(item => {
        for (let key in item) {
            if (Array.isArray(item[key])) {
                target[key] = item[key].map(item => {
                    if (Array.isArray(item)) {
                        let tmpArr = []
                        return extend2(tmpArr, item)
                    } else {
                        return item
                    }
                })
            } else {
                if (typeof item[key] === 'object' && item[key] != null) {
                    let tmpObj = {}
                    target[key] = extend2(tmpObj, item[key])
                } else {
                    target[key] = item[key]
                }
            }
        }
    })
    return target
}

let o1 = { a: 1 }
let o2 = { b: {
    arr: [1,2,[11, 12]]
} }
let o3 = { c: {
    name: 'max',
    innerObj: {
        d: 'yo',
        hi(imput){
            alert(imput)
        }
    }
} }



// copy
function copy(obj){
    let newObj = {}
    for(let key in obj){
        if(Array.isArray(obj[key])){
            newObj[key] = [...obj[key]]
        } else{
            newObj[key] = obj[key]
        }
    }
    return newObj
}



// menu builder
function menuBuilder(id, struct){
    let menu = document.createElement('div')
    menu.setAttribute('id', id)
    let ul = document.createElement('ul')
    for(let i=0, li, a; i < struct.length; i++){
        li = document.createElement('li')
        a = document.createElement('a')
        a.setAttribute('href', struct[i].href)
        a.innerText = struct[i].text
        li.appendChild(a)
        ul.appendChild(li)
    }
    menu.appendChild(ul)
    return menu
}



// gallery
function gallery(id, links){
    let index = 0 // index of the active element in the gallery
    let container = document.createElement('section')
    let gallery = document.createElement('div')
    gallery.setAttribute('id', id)
    for(let i=0, img; i < links.length; i++){
        img = document.createElement('img')
        img.setAttribute('src', links[i])
        if(!i){
            index = i
            img.style.display = 'block'
        } else {
            img.style.display = 'none'
        }
        gallery.appendChild(img)
    }
    
    
    let backward = document.createElement('img')
    backward.setAttribute('src', 'https://cdn0.iconfinder.com/data/icons/flat-round-arrow-arrow-head/512/Red_Arrow_Head_Left-2-128.png')
    let forward = document.createElement('img')
    forward.setAttribute('src', 'https://cdn0.iconfinder.com/data/icons/flat-round-arrow-arrow-head/512/Red_Arrow_Head_Right-2-128.png')

    function back(){
        /* Attention! At this point there is no object 'gallery' extsts, only html-element to which 'gallery' refers, 
        so you have to check its attributes instead of the object's properties */
        gallery.children[index].setAttribute('style', 'display: none')
        if(!index){
            gallery.children[gallery.children.length - 1].setAttribute('style', 'display: block')
            index = gallery.childNodes.length - 1
        } else {
            gallery.children[index - 1].setAttribute('style', 'display: block')
            index--
        }
    }
    function forw(){
        gallery.children[index].setAttribute('style', 'display: none')
        if(index == gallery.children.length - 1){
            gallery.children[0].setAttribute('style', 'display: block')
            index = 0
        } else {
            gallery.children[index + 1].setAttribute('style', 'display: block')
            index++
        }
    }
    backward.addEventListener('click', back)
    forward.addEventListener('click', forw)

    container.appendChild(backward)
    container.appendChild(gallery)
    container.appendChild(forward)
    
    return container
}

document.body.appendChild(gallery("galleryContainer",["https://placekitten.com/408/287", "http://s00.yaplakal.com/pics/pics_original/1/9/4/3736491.jpg", 'http://placekitten.com/720/640', 'http://placekitten.com/200/287', 'https://placekitten.com/200/286']))



// multiplyTable
function multiplyTable(id, n = 10){
    let table = document.createElement('table')
    let tr = document.createElement('tr')
    let td
    for(let i=0; i <= n; i++){
        td = document.createElement('td')
        td.textContent = `<b>${i}</b>`
        td.className = 'tableHeader'
        tr.appendChild(td)
    }
    table.appendChild(tr)
    for(let i=1; i <= n; i++){
        tr = document.createElement('tr')
        for(let j=0; j <= n; j++){
            td = document.createElement('td')   
            if(j == 0){
                td.textContent = `<b>${i}</b>`
                td.className = 'tableHeader'
            } else {
                td.textContent = i * j
            }
            td.style.border = "1px solid black"
            td.style.width = "40px"
            td.style.height = "40px"
            tr.appendChild(td)
        }
        table.style.borderCollapse = "collapse"
        table.style.textAlign = "center"
        table.appendChild(tr)
    }
    return table
}

let myTable = multiplyTable('tab')

myTable.addEventListener('mouseover', function(event){
    if(event.target.nodeName == 'TD'){
        let target = event.target
        let myTable = target.parentElement.parentElement
        let widthPosition = target.cellIndex
        let heightPosition = target.parentElement.rowIndex
        // Attention! Don't confuse weightPosition with heightPosition in the cycle! 
        for(let i=1, k = 1; i <= heightPosition; i++){
            for(let j=1; j <= widthPosition; j++){
                myTable.childNodes[i].childNodes[j].innerHTML = k++
                myTable.childNodes[i].childNodes[j].style.backgroundColor = '#99ffcc'
            }
        }
    } 
})
myTable.addEventListener('mouseout', function(event){
    if(event.target.nodeName == 'TD'){
        let target = event.target
        let myTable = target.parentElement.parentElement
        let widthPosition = target.cellIndex
        let heightPosition = target.parentElement.rowIndex
        for(let i=1; i <= heightPosition; i++){
            for(let j=1; j <= widthPosition; j++){
                myTable.childNodes[i].childNodes[j].innerHTML = i * j
                myTable.childNodes[i].childNodes[j].style.backgroundColor = ''
            }
        }
    }
})

document.body.appendChild(myTable)
