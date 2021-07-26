# `this`

- [`this`](#this)
	- [Theory](#theory)
		- [Basics](#basics)
		- [`bind` | `call` | `apply`](#bind--call--apply)
		- [Arrow functions](#arrow-functions)
		- [Methods](#methods)
	- [Examples](#examples)
	- [Conclusion](#conclusion)

***

## Theory

### Basics

`this` is a link to an object that called the function.

In global context `this` always refers to the `globalThis` object (`window` in browsers).

```javascript
console.log(this === window) // true
```

If `this` is not set explicitly:

- In sloppy mode -> `globalThis`
- In strict mode -> `undefined`

```javascript
function sloppy() {
  return this
}

function strict() {
	'use strict'
  return this
}

console.log(sloppy() === window)	// true 
console.log(strict() === undefined)	// true
```

***

### `bind` | `call` | `apply`

An object can be passed to the function as `this`, using `bind/call/apply`, strict and sloppy both.

If a primitive was passed insted of a function, it will be converted to object using internal `toObject` operation, like `new String('Custom')`

```javascript
const obj = { a: 'Custom' }

function whatsThis() {
  return this
}

console.log(whatsThis.call(obj))	// { a: Custom }
console.log(whatsThis.call('str'))	// String {"str"}
```

***

### Arrow functions

Arrow functions don't have `this`. They take it from the **lexical environment** (the context in which they were defined).

```javascript
const fn = () => this
console.log(fn() === window)	// true
```

The rule of the lexical context is **indisputable**, arrow function's `this` is always set to what it was when it was created, `bind/call/apply` **are always ignored**.

***

### Methods

When a function is assigned as a method of an object, it refers to it as its `this`

```javascript
const o1 = {
	m: function() {
		return this
	}
}

const o2 = {
	m: () => this
}

console.log(o1.m())	// { m: function }
// `this` of the regular function is defined at the moment of INVOCATION. At that moment, the function is a method of `obj`
console.log(o2.m())	// window
// 'this' of the arrow function is bound to it at the moment of DECLARATION. At that moment, the arrow function is declared from the global context
```

***

If you want every nested function to define `this` properly, you should bind every one of them, otherwise the inner ones will log `undefined` as their `this` 

```javascript
function one() {
  console.log(this)
  return (function two() {
    console.log(this)
    return (function three() {
      console.log(this)
      return 'Success!'
    }).bind(this)
  }).bind(this)
}

const obj = one.bind({ name: 'max' })
obj()
// logs -> { name: 'max' }
// returns `f`
obj()()
// logs -> { name: 'max' }; { name: 'max' }
// returns `f`
obj()()()
// logs -> { name: 'max' }; { name: 'max' }; { name: 'max' }
// returns 'Success!'
```

But the better way is just to use arrow functions, since their `this` is binded to them at the moment of creation automatically

```javascript
function one () {
	console.log(this)
	return two = () => {
		console.log(this)
		return three = () => {
			console.log(this)
			return 'Success!'
		}
	}
}   

const obj = one.bind({ name: 'max' })
obj()
// logs -> { name: 'max' }
// returns `() => {...}`
obj()()
// logs -> { name: 'max' }; { name: 'max' }
// returns `undefined `
obj()()()
// logs -> { name: 'max' }; { name: 'max' }; { name: 'max' }
// returns 'Success!' 
```

***


## Examples

Let's take a `div` element and try to change its content with a function that is appointed to the event listener.

```javascript
const div = document.getElementsByTagName('div')[0]

function changeContent(content) {
	console.log('1st this', this)	// window
	return function () {
		console.log('2nd this ', this)	// div
		this.textContent = content
	}
}

div.addEventListener('click', changeContent('Worked!'))
```

`changeContent` is called immediately from the global scope, so its `this === window`. The returned inner function is assigned to `div` as its method. So when the inner function is called, it works as a method of `div` getting it as `this`.

***

```javascript
const changeContent = (content) => {
	console.log('1st this ', this)	// window
	return function () {
		console.log('2nd this ', this)	// div
		this.textContent = content
	}
}

div.addEventListener('click', changeContent('Worked!'))
```

`changeContent` is defined in the global scope, so its `this` is bound to `window`. The returned inner function is assigned to `div` as its method. So when the inner function is called, it works as a method of `div`, getting it as `this`.

***

```javascript
const changeContent = (content) => {
	console.log('1st this ', this)	// window
	return function () {
		console.log('2nd this ', this)	// div
		this.textContent = content
	}
}

div.addEventListener('click', changeContent.call(this, 'Worked!'))
```

`changeContent.call()` is called immediately, but `call` does nothing, because the arrow functions ignore `bind/call/apply`. The result is identical to the previous one.

***

```javascript
function changeContent(content) {
	console.log('1st this ', this)	// window
	return () => {
		console.log('2nd this ', this)	// window
		this.textContent = content
	}
}

div.addEventListener('click', changeContent.call(this, 'Worked!'))
```

`changeContent.call()` is called immediately, but `call` does nothing, because `this === window` at the moment of invoking `call`. The returned inner function is assigned to `div` as its method. So when the inner function is called, it works as a method of `div`, getting it as `this`

***

```javascript
function changeContent(content) {
	console.log('1st this ', this)	// div
	return () => {
		console.log('2nd this ', this)	// div
		this.textContent = content
	}
}

div.addEventListener('click', changeContent.call(div, 'Worked!'))
```

`changeContent.call()` is called immediately, `changeContent` gets `this === div`. The inner arrow function is declared and its scope is created with `this === div` (and it sticks). The returned inner function is assigned to `div` as its method with the bound `div` as its `this`. 

***

```javascript
const changeContent = (content) => {
	console.log('2nd this ', this)	// window
	this.textContent = content
}

div.addEventListener('click', () => {
	console.log('1st this ', this)	// window
	changeContent('Worked!')
})
```

The outer arrow function and `changeContent` are both arrow functions declared from the global scope, so they both get `window` as their bound `this`. It never changes in the future.

***

```javascript
function changeContent(content) {
	console.log('2nd this ', this)	// `undefined` in strict, `window` in sloppy mode
	this.textContent = content
}

div.addEventListener('click', () => {
	console.log('1st this ', this)	// window
	changeContent('Worked!')
})
```

The outer arrow function and `changeContent` are declared from the global scope, the arrow function gets `this === window` but `changeContent` is a regular function, so its `this` is defined at the moment of invocation. And it gets invoked from undefined scope, because when event triggers, `this` is long gone. Unless it was bound specifically. And it wasn't. 

***

```javascript
function changeContent(content) {
	console.log('2nd this ', this)	// `undefined` in strict, `window` in sloppy mode
	this.textContent = content
}

div.addEventListener('click', function () {
	console.log('1st this', this)	// div
	changeContent('Worked!')
})
```

The outer function and `changeContent` are both declared and their scopes are created. At this moment `this === undefined` for both outer and inner functions. The outer function is assigned as a method to `div`, so its `this` changes to `div` when it is called. But when the nested `changeContent` is called, its context is not defined, so its `this` refers to either global object in sloppy mode, or `undefined` in strict.

***

```javascript
const changeContent = (content) => {
	console.log('2nd this ', this)	// window
	this.textContent = content
}

div.addEventListener('click', function () {
	console.log('1st this', this)	// div
	changeContent('Worked!')
})
```

The outer function and arrow `changeContent` are both declared and their scopes are created. At this moment `this === undefined` for the outer function. The arrow `changeContent` gets its `this === window` bound. The outer function is assigned as a method to `div`, so its `this` changes to `div` when it is called. But for the inner arrow function `this` remains the same as it was when the function was defined - the global object. 

***


## Conclusion

If a regular function 

- wasn't called from the global object,
- as a method of some object (with dot),
- and wasn't `bound/called/applied`, its `this` will be `undefined` in strict and `window` in sloppy mode. 

Arrow functions don't have their own `this` but if asked, return `this` of their lexical context, it also cannot be altered in any way. 
