# Symbol

- [Symbol](#symbol)
	- [Intro](#intro)
	- [Global registry of symbols](#global-registry-of-symbols)
	- [Notable Symbols](#notable-symbols)
		- [`Symbol.toPrimitive`](#symboltoprimitive)
		- [`Symbol.iterator`,`[Symbol.asyncIterator]()`](#symboliteratorsymbolasynciterator)
		- [`[Symbol.match]`, `[Symbol.matchAll]`, `[Symbol.search]`, `[Symbol.split]`](#symbolmatch-symbolmatchall-symbolsearch-symbolsplit)
		- [`[Symbol.species]`](#symbolspecies)

***

## Intro

Symbol is a uqinue identifier. They are never equal to each other.

```javascript
const id = Symbol()
```

We could also add an optional description, which doesn't make symbols equal. 

```javascript
const id1 = Symbol('id')
const id2 = Symbol('id')

console.log(id1 === id2)		// false
console.log(id1.description)	// id
```

Symbols don't automatically convert to strings, if we need, we should do this explicilty. 

```javascript
const id1 = Symbol('id')
// alert(id1)	// TypeError
alert(id1.toString())	// Symbol(id)
```

The main purpose of Symbols is to create hidden props and methods for objects, that cannot be accessed accidentally (e.g. via looping). We might need this if we work with a third-party code and don't want to break it adding our own visible properties. 

```javascript
const user = {
	name: 'Max'
}

const id = Symbol('id')
user[id] = 47
console.log(user[id])	// 47

// Now third-party can even create their own id.
user[id] = 23
console.log(user[id])	// 23
```

***

To use Symbols in object literal we should access them via `[]`.

```javascript
const id = Symbol('id')

const user = {
	name: 'Max',
	[id]: 544
}
```

***

Symbols are ignored by `for..in` loop and `Object.keys/values/entries`.

```javascript
const id = Symbol('id')

const user = {
	name: 'Max',
	[id]: 544
}

for(const key in user){
	console.log(key)	// name
}

console.log(Object.keys(user))	// ['name']
console.log(Object.values(user))	// ['Max']
```

Thus, it's impossible to accidently access Symbol properties, unless you really try to.

***

- `Object.getOwnPropertyNames()` returns **only string** props
- `Object.getOwnPropertySymbols()` returns **only symbol** props
- `Reflect.ownKeys(obj)` returns **string + symbol** props

`Object.assign` and spread `...` copy **both string and symbol** props. We use it when we want to copy all props.

```javascript
const id = Symbol('id')

const user = {
	name: 'Max',
	[id]: 544
}

console.log(Object.getOwnPropertyNames(user))		// ['name']
console.log(Object.getOwnPropertySymbols(user))	// Symbol('id')
console.log(Reflect.ownKeys(user))	// ['name', Symbol('id')]

const clone1 = Object.assign({}, user)
const clone1 = {...user}
console.log(clone)	// {name: "Max", Symbol(id): 544}
console.log(clone)	// {name: "Max", Symbol(id): 544}
```

***

Symbol-keyed properties are ignored by `JSON.stringify`

```javascript
const obj = { age: 22, [Symbol('foo') ] : 'foo' }
JSON.stringify(obj)		// {"age":22}
```

***


## Global registry of symbols

Symbols are unique and don't match each other even having the same names. But what if we want the opposite: the symbols with the same names to be the same entities? Like if we want to access the `id` symbol meaning the same property. For this we need the Global registry of symbols. 

`Symbol.for(key)` is used to get (or create if none exists) symbols from the registry. 

```javascript
const id = Symbol.for('id')		// read symbol from the global registry (or create if it doesn't exist)
const isAgain = Symbol.for('id')	// read it again
console.log(id === isAgain)		// true
```

`Symbol.keyFor(sym)` takes the link to the symbol and returns its description.

```javascript
const ID = Symbol.for('id')
console.log(Symbol.keyFor(ID))	// 'id'
```

Symbols with the same names or without names at all will be considered the same symbols in the registry.

```js
const id1 = Symbol.for()
const id2 = Symbol.for()
console.log(id1 === id2)	// true

const age1 = Symbol.for(33)
const age2 = Symbol.for(42)
const age3 = Symbol.for(42)
console.log(age1 === age2)	// false
console.log(age2 === age3)	// true
```

These two methods only work for the global registry of symbols!

```js
const id = Symbol('id')
console.log(Symbol.keyFor(id))	// undefined
```

***


## Notable Symbols

### `[Symbol.toPrimitive]()`

Method is called when the conversion to the primitive value is needed.

```javascript
const obj = {
	[Symbol.toPrimitive](hint){
		if(hint === 'number'){
			return 42
		} else if(hint === 'string'){
			return 'fourty two'
		}
		return null
	}
}

console.log(+obj)	// 42
alert(obj)	// 'fourty two' -> alert calls `toString()` internally
console.log(obj[Symbol.toPromitive]())	// null
```

***


### `[Symbol.iterator]()`,`[Symbol.asyncIterator]()`

Both return iterator objects. See `promise/07-09` for more. 

***


### `[Symbol.match]`, `[Symbol.matchAll]`, `[Symbol.search]`, `[Symbol.split]`

Used for tweaking `regexp`.

***


### `[Symbol.species]`

Specifies the species of what constructor the created objects will be considered.

By default, derived objects will consider themselves the instances of the new class (and all the classes in the prototype chain).

```javascript
class MyArray extends Array {}

const myarr = new MyArray()
const testSubject = myarr.map(item => item)

console.log(testSubject instanceof MyArray)	// true
console.log(testSubject instanceof Array)		// true
console.log(testSubject instanceof Object)	// true
```

But we can change that behavior making them the instances of the original class:

```javascript
class MyArray extends Array {
	static get [Symbol.species](){
		return Array
	}
}

const myarr = new MyArray()
const testSubject = myarr.map(item => item)

console.log(testSubject instanceof MyArray)	// false
console.log(testSubject instanceof Array)		// true
console.log(testSubject instanceof Object)	// true
```

or even different class at all

```javascript
class NewClass {}

class MyArray extends Array {
	static get [Symbol.species](){
		return NewClass
	}
}

const myarr = new MyArray()
const testSubject = myarr.map(item => item)

console.log(testSubject instanceof MyArray)		// false
console.log(testSubject instanceof Array)			// false
console.log(testSubject instanceof Object)		// true
console.log(testSubject instanceof NewClass)	// true
```

***