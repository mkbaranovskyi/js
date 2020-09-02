function getSum(num1: string | number, num2: string | number): number {
    if(typeof num1 === 'string'){
        num1 = parseInt(num1)
    }
    if(typeof num2 === 'string'){
        num2 = parseInt(num2)
    }
    
	return num1 + num2
}

// no error
console.log(getSum(3, '15'))

// interface UserInterface {
//     name: string
//     email: string
//     age: number
//     showAge()
// }

// class User implements UserInterface {
//     name: string
//     email: string
//     private age: number

//     constructor(name: string, email: string, age: number){
//         this.name = name
//         this.email = email
//         this.age = age

//         console.log(`User created: ${this.name}`)
//     }

//     showAge(){
//         return this.age
//     }
// }



// let john = new User ('John', 'john@mail.com', 22)

// console.log(john.showAge())