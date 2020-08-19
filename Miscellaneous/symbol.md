# Symbol

- [Symbol](#symbol)
	- [Intro](#intro)
	- [Global registry of symbols](#global-registry-of-symbols)
	- [Notable Symbols](#notable-symbols)
		- [`Symbol.toPrimitive`](#symboltoprimitive)
		- [`Symbol.iterator`,`[Symbol.asyncIterator]()`](#symboliteratorsymbolasynciterator)
		- [`[Symbol.match]`, `[Symbol.matchAll]`, `[Symbol.search]`, `[Symbol.split]`](#symbolmatch-symbolmatchall-symbolsearch-symbolsplit)
		- [`[Symbol.species]`](#symbolspecies)


## Intro

Symbol is a uqinue identifier. They are never equal to each other.

```javascript
let id = Symbol()
```

We could also add an optional description, which doesn't make symbols equal. 

```javascript
let id1 = Symbol('id')
let id2 = Symbol('id')

console.log(id1 === id2)		// false
console.log(id1.description)	// id
```

Symbols don't automatically convert to strings, if we need, we should do this explicilty. 

```javascript
let id1 = Symbol('id')
// alert(id1)			// TypeError
alert(id1.toString())	// Symbol(id)
```

The main purpose of Symbols is to create hidden props and methods for objects, that cannot be accessed accidently (e.g. via looping). We might need this if we work with a third-party code and don't want to break it adding our own visible properties. 

```javascript
let user = {
	name: 'Max'
}

let id = Symbol('id')
user[id] = 47
console.log(user[id])	// 47

// Now third-party can even create their own id.

user[id] = 23
console.log(user[id])	// 23
```

***

To use Symbols in object literal we should access them via `[]`.

```javascript
let id = Symbol('id')

let user = {
	name: 'Max',
	[id]: 544
}
```

***

Symbols are ignored by loops

```javascript
let id = Symbol('id')

let user = {
	name: 'Max',
	[id]: 544
}

for(const key in user){
	console.log(key)	// name
}
```

Thus, it's impossible to accidently access Symbol properties, unless you really try to.

***

`Object.getOwnPropertyNames()` will not return symbols. To get them, you should use `Object.getOwnPropertySymbols()`. We can use `Reflect.ownKeys(obj)` to get all its keys including symbols.

`Object.assign` **do** copy both string and symbol props. We use it when we want to copy all props, including the hidden ones, so its logical.  

```javascript
let id = Symbol('id')

let user = {
	name: 'Max',
	[id]: 544
}

let clone = Object.assign({}, user)
console.log(clone)		// {name: "Max", Symbol(id): 544}
```

***

Symbol-keyed properties are ignored when using `JSON.stringify`

```javascript
let obj = { age: 22, [Symbol('foo') ] : 'foo' }
JSON.stringify(obj)		// {"age":22}
```

***


## Global registry of symbols

Symbols are unique and don't match each other, even having the same names. But what if we want the opposite: the symbols with the same names to be the same entities? Like if we want to access the `id` symbol meaning the same property. For this we need the Global registry of symbols. 

`Symbol.for(key)` is used to get (or create if none exists) symbols from the registry.

```javascript
let id = Symbol.for('id')		// read symbol from the global registry (or create if it didn't existed)
let isAgain = Symbol.for('id')	// read it again
console.log(id === isAgain)		// true
```

`Symbol.keyFor(sym)` does the opposite: takes the link to the symbol are returns its name

```javascript
let idSymbol = Symbol.for('id')
console.log(Symbol.keyFor(idSymbol))	// id
```

These two methods only work for the global registry of symbols!

***


## Notable Symbols

### `[Symbol.toPrimitive]()`

Method called when the conversion to the primitive value is needed.

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
alert(obj)		// 'fourty two' -> alert calls `toString()` internally
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

Specifies the species of what constructor will be considered created objects.

By default, derived objects will consider themselves the instances of the new class (and all the classes in the prototype chain).

```javascript
class MyArray extends Array {}

const myarr = new MyArray()
const testSubject = myarr.map(item => item)

console.log(testSubject instanceof MyArray)	// true
console.log(testSubject instanceof Array)	// true
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
console.log(testSubject instanceof Array)	// true
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
console.log(testSubject instanceof Array)		// false
console.log(testSubject instanceof Object)		// true
console.log(testSubject instanceof NewClass)	// true
```

***



