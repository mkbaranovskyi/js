// Tasks: http://gitlab.a-level.com.ua/gitgod/FrontendLectures/src/master/04AssociativeArraysHomeWork.md
// 3 persons
let a = { name: "Elon", surname: "Musk" },
b = { name: "Bill", surname: "Gates" },
c = { name: "Steve", surname: "Jobes" }

// different fields
a.age = 47
b.fatherName = "William"
c.sex = "male"

// field check
if("age" in a) alert(a.age)
if(typeof(b.fatherName)) alert(b.fatherName)
if(typeof c.sex) alert(c.sex)

// array of persons
let persons = [a, b, c, {name: "Max", surname: "Bar", fatherName: "Alex", sex: "male"}]

// loop of persons
for(let i=0; i < persons.length; i++){
    console.log(persons[i])
}

// loop of fields loop of persons
for(let i=0, tmpPerson; i < persons.length; i++){
    tmpPerson = {}
    for(let key in persons[i]){
        if(key == "name" || key == "surname") {
            tmpPerson[key] = persons[i][key]
        }
    }
    console.log(tmpPerson)
}

// loop of loop of keys
for(let i=0, tmpPerson, keys; i < persons.length; i++){
    tmpPerson = {}
    keys = Object.keys(persons[i])
    for(let j=0; j < keys.length; j++){
        if(keys[j] == "name" || keys[j] == "surname") {
            tmpPerson[keys[j]] = persons[i][keys[j]]
        }
    }
    console.log(tmpPerson)
}

// loop of loop with optional fields
for(let i=0, output; i < persons.length; i++){
    output = ""
    output = "Person #" + +(i+1) + ": "
    if("name" in persons[i]){
        output += "name: " + persons[i]["name"] + "\n"
    }
    if("surname" in persons[i]){
        output += "surname: " + persons[i]["surname"] + "\n"
    }
    for(let key in persons[i]){
        if(key != "name" && key != "surname"){
            output += "Unique field! " + key + ": " + persons[i][key] + "\n"
        }
    }
    console.log(output)
}

// fullName
for(let i=0; i < persons.length; i++){
    if("name" in persons[i] && "surname" in persons[i] && "fatherName" in persons[i]){
        persons[i].fullName = persons[i].name + " " + persons[i].fatherName + " " + persons[i].surname
    } else if("name" in persons[i] && "surname" in persons[i]){
        persons[i].fullName = persons[i].name + " " + persons[i].surname
    }
}

// serialize
let json_persons = JSON.stringify(persons)

// deserialize
let json_vasya = '{"name": "Vasya", "surname": "Petrov"}';
persons.push(JSON.parse(json_vasya))



// HTML

let persons = [
	{
		name: 'max',
		age: 20
	},
	{
		name: 'masha',
		sex: 'female'
	},
	{
		fullName: 'Thomas Anderson',
		nick: 'Neo'
	}
]

function uniqueKeys(objects){
	let allKeysObj = Object.assign({}, ...objects)
	return Object.keys(allKeysObj)
}

let keys = uniqueKeys(persons)

// str = '<table><tr>'
// for(let i = 0; i < keys.length; i++){
// 	str += `<th>${keys[i]}</th>`
// }
// str += `</tr>`
// for (let i = 0; i < persons.length; i++) {
// 	str += `<tr>`
// 	for (let j = 0; j < keys.length; j++) {
// 		if(keys[j] in persons[i]){
// 			str += `<td>${persons[i][keys[j]]}</td>`
// 		}
// 		else {
// 			str += `<td></td>`
// 		}
// 	}
// 	str += `</tr>`
// }
// str += '</table>'
// document.write(str)

const table = document.createElement('table')
const tr = document.createElement('tr')

for(let i = 0; i < keys.length; i++){
	const th = document.createElement('th')
	th.textContent = keys[i]
	th.style.backgroundColor = '#cce'
	tr.append(th)
}

table.append(tr)

for (let i = 0; i < persons.length; i++) {
	const tr = document.createElement('tr')

	for (let j = 0; j < keys.length; j++) {
		const td = document.createElement('td')

		if(keys[j] in persons[i]){
			td.textContent = persons[i][keys[j]]
		}

		tr.append(td) 
	}

    if(i % 2) tr.style.backgroundColor = '#cee'
	else tr.style.backgroundColor = '#cea'
	
	table.append(tr)
}

document.body.prepend(table)




// Blue belt. Tree Constructor from the structure. 

function treeConstructorDOM(obj){
    if('tagName' in obj == false){
        return null
    }
    
	let currentElement = document.createElement(obj.tagName)
	
	if('attrs' in obj){
		for(let key in obj.attrs){
			currentElement.setAttribute(key, obj.attrs[key])
    	}
    }
	if('text' in obj){
		currentElement.textContent = obj.text
    }
	if('subTags' in obj){
		for(let i = 0; i < obj.subTags.length; i++){
        	currentElement.append(treeConstructorDOM(obj.subTags[i]))
		}
	}
	
  	return currentElement
} 

function treeConstructorString(obj){
    if('tagName' in obj == false){
        return null
    }

	let currentElement = `<${obj.tagName}`
	
	if('attrs' in obj){
		for(let key in obj.attrs){
			currentElement += ` ${key}=${obj.attrs[key]}`
    	}
    } 

	currentElement += `>`

	if('text' in obj){
		currentElement += `${obj.text}`
    }

	if('subTags' in obj){
		for(let i = 0; i < obj.subTags.length; i++){
			currentElement += `${treeConstructorString(obj.subTags[i])}`
		}
    }
	
	currentElement += `</${obj.tagName}>`

  	return currentElement
} 

var html = {
    tagName: 'body',
    subTags: [{
            tagName: 'div',
            subTags: [{
                tagName: 'span',
                text: "Enter a data please:",
                subTags: [{
                    tagName: 'br',
                    subTags: [{
                            tagName: "input",
                            attrs: {
                                type: "text",
                                id: "name"
                            }
                        },
                        {
                            tagName: "input",
                            attrs: {
                                type: "text",
                                id: "surname"
                            }
                        }
                    ]
                }]
            }]
        },
        {
            tagName: 'div',
            subTags: [{
                    tagName: "button",
                    attrs: {
                        id: "ok"
                    },
                    text: "OK"
                },
                {
                    tagName: "button",
                    attrs: {
                        id: "cancel"
                    },
                    text: "Cancel"
                }
            ]
        }
    ]
}

document.write(treeConstructorString(html))
// document.body.prepend(treeConstructorDOM(html))



// Black belt. Guess 0 or 1 based on previous inputs.

function guess() {          // Object solution
    let newValue = '', 
        history = '0101', 
        predictValue,
        counter = 0,
        guessedRight = 0, 
        pool = {}
        for(let i=0, zero = '0000', tmp; i < 16; i++){
            tmp = zero.substring(0, (zero.length - ((i).toString(2)).length)) + (i).toString(2)
            pool[tmp] = Math.round(Math.random())
        }

    do{
        predictValue = pool[history]
        console.log('Our prediction: ', predictValue)

        newValue = prompt('Enter 0 or 1: ', '')
        if(!newValue) {
            break
        }
        console.log('You entered: ', newValue)

        pool[history] = newValue
        history = history.slice(1) + newValue

        counter++
        if(predictValue == newValue) {
            guessedRight++
        } 
    } while(newValue)
    console.log('Total: ', counter, ', Right: ', guessedRight, ', Correct guesses: ', ((guessedRight / counter * 100).toPrecision(2)) + '%')
    return pool
}



function guessArr(){        // Array solution
    let newValue = '', 
        history = [0,1,0,1], 
        predictValue,
        counter = 0,
        guessedRight = 0, 
        pool = []
        for(let i=0; i < 2; i++){
            pool[i] = new Array(2)
            for(let j=0; j < 2; j++){
                pool[i][j] = new Array(2)
                for(let k=0; k < 2; k++){
                    pool[i][j][k] = new Array(2)
                    for(let n=0; n < 2; n++){
                        pool[i][j][k][n] = Math.round(Math.random())
                    }
                }
            }
        }

    do{
        predictValue = pool[history[0]][history[1]][history[2]][history[3]]
        console.log('Our prediction: ', predictValue)

        newValue = prompt('Enter 0 or 1: ', '')
        if(!newValue) {
            break
        }
        console.log('You entered: ', newValue)

        pool[history[0]][history[1]][history[2]][history[3]] = newValue
        history.shift()
        history.push(newValue)

        counter++
        if(predictValue == newValue) {
            guessedRight++
        } else if(predictValue == undefined){
            counter--
        }
    } while(newValue)
    console.log((guessedRight / counter * 100).toPrecision(2) + '% correct guesses')
    console.log('Total: ', counter, ', Right: ', guessedRight)
    return pool
}