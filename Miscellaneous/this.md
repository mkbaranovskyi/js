# This

## Theory

**This** is a link to an object that called the function.

In global context `this` always refers to the `globalThis` object (window in browsers).
```javascript
console.log(this === window) // true
```

In sloppy mode `this`, if not set explicitly, will refer to the `globalThis`
```javascript
function f1() {
    return this
}
f1() === window // true 
```
In strict mode it will be `undefined`, since not set explicitly
```javascript
function f2() {
'use strict'
    return this
}
f2() === undefined // true
```
* * *
An object can be passed to the function as `this`, using `bind/call/apply`, strict and sloppy both
```javascript
let obj = {a: 'Custom'}
function whatsThis() {
    return this  // The value of this is dependent on how the function is called
}
whatsThis.call(obj)  // {a: Custom}
```
If a primitive was passed insted of a function, it will be converted to object using internal `toObject` operation, like `new String('Custom')`
```javascript
function whatsThis() {
    return this  // The value of this is dependent on how the function is called
}
whatsThis.call('str')  // String {"str"}
```
* * *
The arrow function doesn't have 'this', but if asked, returns it from the lexical context (means the context in which it was defined).
```javascript
let foo = () => this
foo() === window // true
```
The rule of lexical context is indisputable, arrow function's this is always set to what it was when it was created, bind/call/apply are always ignored.
***
When a function is assigned as a method of an object, it refers to it as its 'this'
```javascript
let obj = { 
    m: function(){ 
        return this 
    }
}
obj.m() // {m: function}, since 'this' of the regular function is defined at the moment it gets invoked, and at this moment the function is a method of 'obj'

let obj = {
    m: () => {
        return this
    }
}
        
obj.m() // window, since 'this' of the arrow function is binded to it at the moment of declaring, and at this moment the arrow function is declared from the global context
```
* * *
If you want every nested function to define 'this' properly, you should bind every one of them, otherwise the inner ones will log `undefined` as their `this` 
```javascript
function one (){
    console.log(this)
    return (function two(){
        console.log(this)
        return (function three(){
            console.log(this)
            return 'Success!'
        }).bind(this)
    }).bind(this)
}   
let obj = one.bind({name: 'max'})
obj() 
// console.log == {name: 'max'}
// retrn == f
obj()()
// console.log == {name: 'max'}; {name: 'max'}
// return == f
obj()()()
// console.log == {name: 'max'}; {name: 'max'}; {name: 'max'}
// return == 'Success!'
```

... or just use arrow functions, since they have their 'this' binded to them at the moment of creation automatically 
```javascript
function one (){
    console.log(this)
    return two = () => {
        console.log(this)
        return three = () => {
            console.log(this)
            return 'Success!'
        }
    }
}   
let obj = one.bind({name: 'max'})
obj()
// console.log == {name: 'max'}
// retrn == () => {...}
obj()()
// console.log == {name: 'max'}; {name: 'max'}
// return == undefined 
obj()()()
// console.log == {name: 'max'}; {name: 'max'}; {name: 'max'}
// return == 'Success!' 
```
* * *
## Examples
### A function to process the entered password
```javascript
function askPassword(ok, fail) {
    let password = prompt("Password?", '');
    if (password == "rockstar") ok();
    else fail();
}

let user = {
    name: 'John',

    loginOk() {
        alert(`${this.name} logged in`);
    },

    loginFail() {
        alert(`${this.name} failed to log in`);
    },

};

askPassword(user.loginOk, user.loginFail); // when functions loginOk and loginFail are finally called, the context (user) is long lost
askPassword(user.loginOk.bind(user), user.loginFail.bind(user)); // will do
askPassword(() => user.loginOk(), () => user.loginFail()) // will also do
askPassword(function() { user.loginOk() }, function (){ user.loginFail() }) // will also do
```
***
### `this` in different scenarios
Let's take a `div` element and try to change its content with a function that is appointed to the event listener.
```javascript
const div = document.getElementsByTagName('div')[0]
```
```javascript
function changeContent (content){
    console.log('1st this', this) // window
    return function() {
        console.log('2nd this ', this) // div
        this.textContent = content
    }
}
div.addEventListener('click', changeContent('Worked!'))
```
`changeContent` is called immediately from the global object, so its `this == window`. The result (returned inner function) is assigned to `div` as its method. So when the inner function is called, it works as a method of `div`, getting it as `this`.
***
```javascript
let changeContent = content => {
    console.log('1st this ', this) // window
    return function() {
        console.log('2nd this ', this) // div
        this.textContent = content
    }
}
div.addEventListener('click', changeContent('Worked!')) 
```
`changeContent` is called immediately from the global object, so its `this === window`. The result (the returned inner function) is assigned to `div` as its method. So when the inner function is called, it works as a method of `div`, getting it as `this`.
***
```javascript
let changeContent = content => {
    console.log('1st this ', this) // window
    return function() {
        console.log('2nd this ', this) // div
        this.textContent = content
    }
}
div.addEventListener('click', changeContent.call(this, 'Worked!'))
```
`changeContent.call()` is called immediately, but `call` does nothing, because the arrow functions ignore `bind/call/apply`. The result (returned inner function) is assigned to `div` as its method. So when the inner function is called, it works as a method of `div`, getting it as `this`.
***
```javascript
function changeContent(content) {
    console.log('1st this ', this) // window
    return () => {
        console.log('2nd this ', this) // window
        this.textContent = content
    }
}
div.addEventListener('click', changeContent.call(this, 'Worked!'))
```
`changeContent.call()` is called immediately, but `call` does nothing, because `this === window` at the moment of invoking `call`. The result (returned inner function) is assigned to `div` as its method. So when the inner function is called, it works as a method of `div`, getting it as `this`
***
```javascript
function changeContent(content) {
    console.log('1st this ', this) // div
    return () => {
        console.log('2nd this ', this) // div
        this.textContent = content
    }
}
div.addEventListener('click', changeContent.call(div, 'Worked!'))
```
`changeContent.call()` is called immediately, `changeContent` gets `this === div`. The inner arrow function is declared and its scope is created with `this === div` (and it sticks). The result (returned inner function) is assigned to `div` as its method with binded `div` as its `this`. 
***
```javascript
let changeContent = content => {
    console.log('2nd this ', this) // window
    this.textContent = content
}
div.addEventListener('click', () => { 
    console.log('1st this ', this); // window
    changeContent('Worked!') 
})
```
The outer arrow function and `changeContent` are both arrow functions declared from the global context, so they both get `window` as their binded `this`. So it never changes in the future.
***
```javascript
function changeContent (content) {
    console.log('2nd this ', this) // undefined in strict, window in sloppy mode
    this.textContent = content
}
div.addEventListener('click', () => {
    console.log('1st this ', this) // window
    changeContent('Worked!')
})
```
The outer arrow function and `changeContent` are declared from the global context, the arrow function gets `this === window`, but `changeContent` is a regular function, so its `this` is defined when it's invoked. And it gets invoked from the global content, because when event triggers, `this` is long gone. Unless it was binded specifically. And it wasn't. 
***
```javascript
function changeContent (content) {
    console.log('2nd this ', this) // undefined in strict, window in sloppy mode
    this.textContent = content
}
div.addEventListener('click', function() { 
    console.log('1st this', this); // div
    changeContent('Worked!') 
}) 
```
The outer function and `changeContent` are both declared and their scopes are created. At this moment `this === undefined` for both outer and inner functions. The outer function is assigned as a method to `div`, so its `this` changes to `div` when it is called. But when the resulad `changeContent` is called, its content is not defined, so its `this` refers to either global object in sloppy mode, or undefined in strict.
***
```javascript
let changeContent = content => {
    console.log('2nd this ', this) // window
    this.textContent = content
}
div.addEventListener('click', function() { 
    console.log('1st this', this); // div
    changeContent('Worked!') 
})
```
The outer function and arrow `changeContent` are both declared and their scopes are created. At this moment `this === undefined` for the outer function, and the arrow `changeContent` gets its `this === window` binded. The outer function is assigned as a method to `div`, so its `this` changes to `div` when it is called. But for the inner arrow function `this` remains the same as it was when the function was defined - the global object. 
***

## Conclusion
If a regular function wasn't called from the global object or explicitly as a method of some object (with dot) or wasn't binded/called/applied with the given `this`, its `this` will be undefined. Arrow functions don't have their own `this` but if asked, return their `this` of their lexical context, it also cannot be altered in any way. 
