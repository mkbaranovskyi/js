// Tasks: http://gitlab.a-level.com.ua/gitgod/FrontendLectures/src/master/07ObjectsFunctionalStyleHomeWork.md
// OOP
function Person(Name, Surname, Age, Sex, Salary = 0, Married = false){ 
    let name = Name
    let surname = Surname
    let age = Age
    let sex = Sex
    let salary = Salary
    let married = Married
    let father = null
    let fatherName = null
    let children = []

    this.setName = function(Name){
        name = Name
        return name
    }
    this.getName = function(){
        return name
    }

    this.setSurname = function(Surname){
        surname = Surname
        return surname
    }
    this.getSurname = function(){
        return surname
    }

    this.setAge = function(Age){
        if (+Age != NaN && +Age >= 0 && +Age < 150) {
            age = +Age
        }
        return age
    }
    this.getAge = function(){
        return age
    }

    this.setSex = function(Sex){
        if (Sex == 'male' || Sex == 'female'){
            sex = Sex
        } else {
            throw new Error('Enter correct gender!')
        }
        return sex
    }
    this.getSex = function(){
        return sex
    }

    this.setSalary = function(Salary){
        if (+Salary != NaN && +Salary >= 0){
            salary = Salary
        } else {
            throw new Error('Enter correct salary!')
        }
        return salary
    }
    this.getSalary = function(){
        return salary
    }

    this.setMarried = function(Married){
        if (Married === true || Married === false){
            married = Married
        } else {
            throw new Error('Enter correct marriage status!')
        }
        return married
    }
    this.getMarried = function(){
        return married
    }

    this.setFather = function(Father){
        if(Father instanceof Person){
            father = Father
            if(this.getSex() === 'male'){
                fatherName = Father.getName() + 'ovich'
            } else if(this.getSex() === 'female'){
                fatherName = Father.getName() + 'ovna'
            } else {
                throw new Error('Enter your person\'s sex first!')
            }
            return father
        }
    }
    this.setFatherName = function(FatherName){
        fatherName = FatherName
        return fatherName
    }
    this.getFatherName = function(){
        return fatherName
    }

    this.addChild = function(Child){
        if(Child instanceof Person && Child.getAge() <= this.getAge() - 15){
            for(let i=0; i < children.length; i++){
                if(children[i] == Child){
                    throw new Error('You\'ve already added this child!')
                }
                if(children[i].getAge() < Child.getAge()){
                    throw new Error('Your new child cannot be older than you previous one!')
                }
            }
            children.push(Child)
        } else {
            throw new Error('Cannot add the child! Check child\'s parameters')
        }
        return children.length
    }
    this.getChildren = function(){
        return children
    }
}



// makeProfileTimer
function makeProfileTimer(){
    let first = performance.now()
    return function(){
        let second = performance.now()
        return (second - first).toFixed(6)
    }
}
// test subjects
function doSomething(){ 
    for(let i=0; i < 100000000; i++)
    return 
}
var timer = makeProfileTimer()
   doSomething();  //некий код, время выполнения которого мы хотим измерить с высокой точностью
   alert(timer()); //alert должен вывести время в микросекундах от выполнения makeProfileTimer до момента вызова timer(), 
                   // т. е. измерить время выполнения doSomething



// makeSaver
function makeSaver(func){
    if(typeof func != 'function'){
        throw new Error('Given parameter should be a function!')
    }
    let immutableValue
    let wasInvoked = false

    return function(){
        if(!wasInvoked){
            immutableValue = func()
            wasInvoked = true
        }
        return immutableValue
    }
}

// test subjects
var saver = makeSaver(Math.random)  //создает функцию-хранилище результата переданной в качестве параметра функции (Math.random 
                                    // в примере). На этом этапе Math.random НЕ вызывается
var value1 = saver()                //saver вызывает переданную в makeSaver функцию, запоминает результат и возвращает его
var value2 = saver()                //saver в дальнейшем просто хранит результат функции, и более НЕ вызывает переданную 
                                    //в makeSaver функцию;
value1 === value2 // всегда true

var saver2 = makeSaver(() => console.log('saved function called') || [null, undefined, false, '', 0, Math.random()][Math.ceil(Math.random() * 6)])
var value3 = saver2()
var value4 = saver2()

value3 === value4 // тоже должно быть true


// Final Countdown

// new solution with an arrow function

function finalCountdown(sec){
    for(let i = sec - 1; i >= 0; i--){
        setTimeout(() => console.log(sec - i), i * 1000) 
    }

    setTimeout(() => console.log('Поехали!'), sec * 1000)
}

finalCountdown(3)



// classic closure-based solution

function finalCountdown(sec){
    for(let i = 0; i < 5; i++){
        (function(){
            setTimeout(console.log, i*1000, sec - i)
        })()
    }

    setTimeout(console.log, sec * 1000, 'Поехали!')
}

finalCountdown(3)



// My Bind
function myBind(func, This, parameters){
    return function(){
        let finalArgs = []
        for(let i=0, j=0; i < parameters.length; i++){
            if(parameters[i] == undefined){
                finalArgs[i] = arguments[j++]
            } else {
                finalArgs[i] = parameters[i]
            }
        }
        return func.apply(This, finalArgs)
    }
}

// test subjects
var pow5 = myBind(Math.pow, Math, [undefined, 5]) 
var cube = myBind(Math.pow, Math, [undefined, 3])
var chessMin = myBind(Math.min, Math, [undefined, 4, undefined, 5, undefined, 8, undefined, 9])
console.log(chessMin(-1, -5, 3, 15))
console.log("pow5(2) = " + pow5(2)) 
console.log("pow5(3) = " + pow5(3))
console.log("cube(3) = " + cube(3))
console.log("cube(5) = " + cube(5))
var zeroPrompt = myBind(prompt, window, [undefined, "0"])
var someNumber = zeroPrompt("Введите число") // вызывает prompt("Введите число","0")


// sum
let arithmeticProgression = {
    formula: function formula(first, n, d){
        let last = first + (n-1) * d
        let sum = (first + last) * n / 2
        return sum
    },

    iterative: function iterative(first, n, d){
        let last = first + (n-1) * d
        let sum = 0
        for(let i = first; i <= last; i += d){
            sum += i
        }
        return sum
    },

    recursion: function recursion(first, n, d){
        let last = first + (n - 1) * d
        if(n == 1) {
            return first
        }
        return last + recursion(first, n - 1, d);
    }
}

console.log('formula: ', arithmeticProgression.formula(1, 6, 1))
console.log('iterative: ', arithmeticProgression.iterative(1, 6, 1))
console.log('recursion: ', arithmeticProgression.recursion(1, 6, 1))