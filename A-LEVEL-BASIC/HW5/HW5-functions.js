// Tasks: http://gitlab.a-level.com.ua/gitgod/FrontendLectures/src/master/05FunctionsHomeWork.md

// a

function a(arg){ alert(arg) }



// cube

function cube(n){
    return n ** 3
}



// sum

function sum(){
    let sum = 0
    for(let i = 0; i < arguments.length; i++){
        sum += +arguments[i]
    }
    return sum
}



// avg

function avg(){
    let sum = 0
    for(let i=0; i < arguments.length; i++){
        sum += +arguments[i]
    }
    return sum / arguments.length
}



// intRandom

function intRandom(bottom, upper){
    if (arguments.length === 1) {
        upper = arguments[0]
        bottom = 0
    }
    let number = Math.round(Math.random() * (upper - bottom) + bottom)
    return number
}



// greetAll

function greetAll(){
    let str = 'Hello '
    for(let i=0; i < arguments.length; i++){
        str += arguments[i]
        if(i != arguments.length - 1){
            str += ', '
        }
    }
    return str
}



// Union 

function aSample() {
	a('Привет!') // вызывает alert('Привет!')
}

function cubeSample() {
	console.log(cube(5)) // => 125
}

function sumSample() {
	console.log(sum(1)) // => 1
	console.log(sum(2)) // => 2
	console.log(sum(10, 20, 40, 100)) // => 170
}

function avgSample() {
	console.log(avg(1)) // => 1
	console.log(avg(2)) // => 2
	console.log(avg(10, 20, 40, 100)) // => 42.5
}

function intRandomSample() {
	console.log(intRandom(2, 15)) // возвращает целое случайное число от 2 до 15 (включительно)
	console.log(intRandom(-1, -1)) // вернет -1
	console.log(intRandom(0, 1)) // вернет 0 или 1
	console.log(intRandom(10)) // вернет 0 до 10 включительно
}

function greetAllSample() {
	console.log(greetAll('Superman')) // выводит 'Hello Superman'
	console.log(greetAll('Superman', 'SpiderMan')) // выводит 'Hello Superman, SpiderMan'
	console.log(greetAll('Superman', 'SpiderMan', 'Captain Obvious')) // выводит 'Hello Superman, SpiderMan, Captain Obvious'
}

/*
// Union switch
function unionSwitch(){
    do{
		let sample = prompt('Enter the task name: ')
		if(sample === null) {
			break
		}

        switch (sample.toLowerCase()){
            case 'a': aSample()
                    break
            case 'cube': cubeSample()
                    break
            case 'sum': sumSample()
                    break
            case 'avg': avgSample()
                    break
            case 'intrandom': intRandomSample()
                    break
            case 'greetall': greetAllSample()
					break
			default: alert('No such task! Try again or press Esc to exit.')
        }
    } while(true)
} 
*/

// Union declarative

let samples = {
    a: aSample,
    cube: cubeSample,
    sum: sumSample,
    avg: avgSample,
    intrandom: intRandomSample,
    greetall: greetAllSample
}

function union(){
    do {
        let sample = prompt('Введите название задания', '')
        if (sample === null) {
            break
        } else {
            if (sample in samples){
                samples[sample.toLowerCase()]()
            } else {
                alert('No such task! Try again or press Esc to exit.')
            }
        }
    } while (true)
}

union()



// Person

let person = {
    name: "Max",
    surname: "Bar",
    fatherName: "Alex",
    age: 25
}

person.getAgeCategory = function () {
    if (person.age < 0) {
        return ("Не может быть!")
    } else {
        if (person.age < 19) {
            return ("Школьник")
        } else {
            if (person.age < 30) {
                return ("Молодежь")
            } else {
                if (person.age < 45) {
                    return ("Зрелость")
                } else {
                    if (person.age < 60) {
                        return ("Закат")
                    } else {
                        if (person.age >= 60) {
                            return ("Как пенсия?")
                        }
                    }
                }
            }
        }
    }
}

console.log(person.getAgeCategory())

// Input person 

function inputPerson(){
    let person = {}
    person.firstName = prompt('Enter your name: ', 'Max')
    person.surName = prompt('Enter your surname: ', 'Bar')
    person.fatherName = prompt('Enter your fathername: ', 'Alex')
    return person
}

inputPerson()



// Input anything

function inputAnything(template){
    let obj = {}
    for(let i = 0; i < template.length; i++){
        obj[template[i].field] = prompt(template[i].prompt, template[i].default_)
    }
    return obj
}

var inputStructure = [
    {prompt: "Введите Фамилию",
     default_: "",
     field: "surname"
    },
    {prompt: "Введите Имя",
     default_: "",
     field: "name"
    },
    {prompt: "Введите Отчество",
     default_: "",
     field: "fatherName"
    },
    {prompt: "Введите возраст",
     default_: "0",
     field: "age"
    },
]

inputAnything(inputStructure)