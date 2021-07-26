// https://learn.javascript.ru/call-apply-decorators
// Decorator function: stores the results of calling the function with certain parameters
function cachingDecorator(fn) {
	const cache = new Map()
	// Stores the results of func calls with certain arguments

	return function (...args) {
		const stringifiedargs = stringHash(args)

		if (cache.has(stringifiedargs)) {
			// If there's a record about calling the function with such arguments, then take its result from the cache
			console.log(
				`Return the result of calling "${fn.name}" with parameters "${stringifiedargs}" from the cache.`
			)
			return cache.get(stringifiedargs)
		}

		const result = fn.apply(this, args)
		cache.set(stringifiedargs, result)
		// Else, call the function and record the result in the cache
		console.log(
			`The first time "${fn.name}" is called with parameters "${stringifiedargs}". The result is saved to the cache!`
		)
		return result
	}

	function stringHash(...args) {
		const result = args.map((item) => item)
		return result.join(',')
	}
}

function test(x) {
	return `${test.name} was called with '${x}'`
}

const cachedTest = cachingDecorator(test)
console.log(cachedTest(2))
console.log(cachedTest('yo'))
console.log(cachedTest(2))
console.log(cachedTest('yo'))
console.log(cachedTest('yo'))

const worker = {
	previous: '',
	naturalSum(...p) {
		const sum = p.reduce((accum, item) => (accum += item))
		this.previous += sum + ' '
		return `${this.previous}`
	}
}

worker.cachedMethod = cachingDecorator(worker.naturalSum)
console.log(worker.cachedMethod(3, 5, 10))
console.log(worker.cachedMethod(3, 5, 10))
console.log(worker.cachedMethod('new', ' world'))
worker.previousSum = 'Oops!'
console.log(worker.cachedMethod('new', ' world'))
console.log(worker.previous)

// Spy
// Record the arguments with which the function was called each time (as array in array in the body of the function)
function spy(func) {
	function wrapper(...args) {
		wrapper.calls.push(args)
		const result = func.apply(this, args)
		wrapper.results.push(result)
		return result
	}

	// we need them to be available outside so we don't use closures
	wrapper.calls = []
	wrapper.results = []

	return wrapper
}

function work(a, b) {
	return a + b
}

work = spy(work)
work(1, 2) // 3
work(4, 5) // 9

console.log(work.calls) // [1, 2], [4, 5]
console.log(work.results) // [3, 9]

// Delay
const delay =
	(fn, ms) =>
	(...args) => {
		setTimeout(() => fn(...args), ms)
	}

let f1000 = delay(window.alert, 1000)
f1000('test') // Shows `test` in 1000 ms

// Debounce
// Call the function not more often than in 'ms'. Ignore the calls that occur during the cooldown.
function debounce(fn, ms) {
	function wrapper(...args) {
		if (!wrapper.cooldown) return

		const result = fn.apply(this, args)
		wrapper.cooldown = false
		setTimeout(() => (wrapper.cooldown = true), ms)
		return result
	}

	wrapper.cooldown = true
	return wrapper
}

const f = debounce(window.alert, 1000)

console.log(f(1)) // executed immediately
console.log(f(2)) // ignored

setTimeout(() => console.log(f(3)), 100) // ignored (only 100 ms after the last call)
setTimeout(() => console.log(f(4)), 1100) // executed
setTimeout(() => console.log(f(5)), 1500) // ignored (only 500 ms after the last call)

// Throttle
function throttle(fn, ms) {
	function wrapper(...args) {
		if (!cooldown) {
			lastCall = args
			This = this
		} else {
			console.log('this inside wrapper: ', this)
			let result = fn.apply(this, args)
			cooldown = false // red light

			setTimeout(() => {
				cooldown = true // green light
				if (!lastCall) return

				// If there's an entry in the queue
				result = wrapper.apply(This, lastCall)
				lastCall = This = null // don't loose it or you'll have endless loop of self-calling functions
			}, ms)

			return result
		}
	}

	let cooldown = true,
		lastCall,
		This

	return wrapper
}

function f(a) {
	console.log(a)
}

// f1000 passes the calls to f at most 1 time in 1000 ms
const f1000 = throttle(f, 1000)

f1000(1) // shows 1
f1000(2) // limitation: no 1000 ms have passed yet
f1000(3) // limitation: no 1000 ms have passed yet

// After 1000 ms
// print 3, the intermediate value of 2 was ignored

// Passing all arguments along with the context to another function is called 'call forwarding'.
const wrapper = function () {
	return func.apply(this, arguments)
}
// When an external code calls such a wrapper, it's indistinguishable from the call of the original function
