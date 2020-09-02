# TypeScript

- [TypeScript](#typescript)
  - [Types](#types)
  - [Composing Types](#composing-types)
  - [Functions](#functions)
  - [Duck typing](#duck-typing)
  - [Interfaces](#interfaces)
  - [Classes](#classes)

***

TypeScript is a pre-processor for JS. The idea is simple: you **work in TS**, then **compile** it into the regular JS and **add JS** to your project. 

TS will color errors for you to fix them. But even you messed the types or something else, as long as this is a valid JS code, it will compile into the working JS anyway. 

***

**Install**:

```bash
sudo npm i -g typescript
```

Create a file: `script.ts`. Then **compile** it into the regular JS: 

```bash
# once
tsc script.ts

# in watch mode
tsc script.ts -w
```

***



## Types

```ts
// basic types

let str: string = 'str'
let num: number = 5
let bool: boolean = true
let Var: any = 'any type'


// typed arrays expect certain types of elements

let strArr = string[]       // Array<string>
let numArr = number[]       // Array<number>
let boolArr = boolean[]     // Array<boolean>

// mixed (tuple)
let numStrArr: [string, number] = ['kartoshka', 1]  // good
let numStrArr: [string, number] = [1]   // error, mush follow the template precisely
let numStrArr: [string, number] = ['str', 1, 1]   // error, mush follow the template precisely


// extra types

let myVoid: void = undefined
let myNull: null = null   // undefined will also work
let myUndefined: undefined = undefined    // null will also work


// unknown - a placeholder that should be changed to an actual type before used

let tmp: unknown

// error
let zero: void = 0
```

***



## Composing Types

You can create new types combining the existing ones:

```ts
type StrNum = string | number

// no errors
const test1: StrNum = 5
const test2: StrNum = 'str'

// error
const test3: StrNum = true
```

Or we can set exclusive values:

```ts
type WindowStatus = 'open' | 'closed' | 'minimized'

function windowControl(status: WindowStatus): void {
    console.log(`Window is ${status}`)
}

// no error
windowControl('closed')

// error
windowControl('something')
```


***



## Functions

We can define the types of arguments and the return value of functions.

```ts
function getSum(num1:number, num2: number = 5): number{
    return num1 + num2
}

// no error
console.log(getSum(1, 3))

// error
console.log(getSum('wrong param'))
```

We can accept both `strings` and `numbers`

```js
function getLength(obj: string | string[]) {
    return obj.length;
}

// no error
console.log(getLength('strochka'))
```

Use `void` if you don't want to return anyting from a function. 

***

To use **optional arguments** without error, we need one of following:

1. Default value: `function(arg: any = 'val'){}`
2. Question mark: `function(arg?: any){}`

***



## Duck typing

TS uses so called "duck typing". Example

```ts
interface Point {
  x: number
  y: number
}

function printPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`)
}

// prints "12, 26"
const point = { x: 12, y: 26 }
printPoint(point)
```

The `point` variable is never declared to be a `Point` type. However, TS compares the shape of point to the shape of `Point` in the type-check. They have the same shape, so the code passes.

***

## Interfaces

Instead of doing this: 

```ts
function showToDo(todo: { title: string, text: string }){
    console.log(todo.title + ': ' + todo.text)
}

showToDo({ title: 'Trash', text: 'Take out trash' })
```

you can do this:

```ts
interface Todo{
    title: string
    text: string
}

function showToDo(todo: Todo){
    console.log(todo.title + ': ' + todo.text)
}

showToDo({ title: 'Trash', text: 'Take out trash' })
```

Also workd for objects:

```ts
interface UserInterface {
    name: string
    id: number
}

const user: UserInterface = {
    name: 'max',
    id: 25
}

/* if you try
const user: UserInterface = {
    username: 'max',
    id: 25
}
you'll get error as there's no 'username' property in the interface */
```

This way the code is cleaner.

***



## Classes

```ts
class User {

	// fields are `public` by default
    name: string
    email: string
    age: number

    constructor(name: string, email: string, age: number){
        this.name = name
        this.email = email
        this.age = age

        console.log(`User created: ${this.name}`)
    }
}

let john = new User ('John', 'john@mail.com', 22)

console.log(john.age)
```