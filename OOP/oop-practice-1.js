'use strict'
// http://old.code.mu/tasks/javascript/oop/osnovy-raboty-s-oop-v-javascript.html

// 1.

class Worker {
	constructor(name, surname, rate, days){
		Object.assign(this, {name, surname, rate, days})
	}

	getSalary(){
		return this.rate * this.days
	}
}

const worker = new Worker('Иван', 'Иванов', 10, 31)
const worker2 = new Worker('Petya', 'Pertov', 12, 26)

console.log(worker.name); //выведет 'Иван'
console.log(worker.surname); //выведет 'Иванов'
console.log(worker.rate); //выведет 10
console.log(worker.days); //выведет 31
console.log(worker.getSalary()); //выведет 310 - то есть 10*31
console.log(worker2.getSalary())

console.log(worker.getSalary() + worker2.getSalary())



// 2.

class Worker {
	constructor(name, surname, rate, days){
		Object.assign(this, {_name: name, _surname: surname, _rate: rate, _days: days})
	}

	getSalary(){
		return this._rate * this._days
	}

	getName(){
		return this._name
	}

	getSurname(){
		return this._surname
	}

	getRate(){
		return this._rate
	}

	getDays(){
		return this._days	
	}
}

const worker = new Worker('Иван', 'Иванов', 10, 31)

console.log(worker)

console.log(worker.getName()); //выведет 'Иван'
console.log(worker.getSurname()); //выведет 'Иванов'
console.log(worker.getRate()); //выведет 10
console.log(worker.getDays()); //выведет 31
console.log(worker.getSalary()); //выведет 310 - то есть 10*31



// 3.

class Worker {
	constructor(name, surname, rate, days){
		Object.assign(this, {_name: name, _surname: surname, _rate: rate, _days: days})
	}

	getSalary(){
		return this._rate * this._days
	}

	getName(){
		return this._name
	}

	getSurname(){
		return this._surname
	}

	getRate(){
		return this._rate
	}

	setRate(value){
		this._rate = value
	}

	getDays(){
		return this._days	
	}

	setDays(value){
		this._days = value
	}
}

const worker = new Worker('Иван', 'Иванов', 10, 31);

console.log(worker.getRate()); //выведет 10
console.log(worker.getDays()); //выведет 31
console.log(worker.getSalary()); //выведет 310 - то есть 10*31

//Теперь используем сеттер:
worker.setRate(20); //увеличим ставку
worker.setDays(10); //уменьшим дни
console.log(worker.getSalary()); //выведет 200 - то есть 20*10



// 4. 

class MyString {
	constructor(str){
		Object.assign(this, str)
	}

	reverse(inputStr){
		let newStr = ''
		for(let i = inputStr.length - 1; i >= 0; i--){
			newStr += inputStr[i]
		}
		return newStr
	}

	ucFirst(inputStr){
		return inputStr[0].toUpperCase() + inputStr.slice(1)
	}

	ucWords(inputStr){
		let arr = inputStr.split(' ')
		arr = arr.map(item => item[0].toUpperCase() + item.slice(1))
		return arr.join(' ')
	}
}

const str = new MyString();

console.log(str.reverse('abcde')); //выведет 'edcba'
console.log(str.ucFirst('abcde')); //выведет 'Abcde'
console.log(str.ucWords('abcde abcde abcde')); //выведет 'Abcde Abcde Abcde'



// 5.

class Validator {
	isEmail(inputStr){
		if(inputStr.match(/[^@^.^_^\-^\w]/)){		// if meet any symbol except latin, digit, '.', '-', '_' or '@'
			return false
		}
		if(inputStr.match(/\w@\w/)){
			return true
		}
		return false
	}

	isDomain(inputStr){
		if(inputStr.match(/\w+\.\w+/)){
			return true
		}
		return false
	}

	isDate(inputStr){
		if(inputStr.match(/\d{2}\.\d{2}\.\d{4}/)){
			return true
		}
		return false
	}

	isPhone(inputStr){
		if(inputStr.match(/[^\d^\s^\-^\(^\)^+)]/)){
			return false
		}
		let result = inputStr.match(/\d/g)
		if(result.length >= 6){
			return true
		}
		return false
	}
}

const validator = new Validator();

console.log(validator.isEmail('namba1.php-html_css@mail.com'));
console.log(validator.isDomain('php-html.com.ua'));
console.log(validator.isDate('12.05.2020'));
console.log(validator.isPhone('+375 (29) 817-68-92')); 

