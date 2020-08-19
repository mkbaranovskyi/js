// https://learn.javascript.ru/call-apply-decorators
// Decorator function: stores the results of calling the function with certain parameters
function cachingDecorator(func){
    let cache = new Map() // Map object to store the results of func calls with certain parameters

    return function(...params){
        let stigrifiedParams = stringHash(params)

        if(cache.has(stigrifiedParams)){ // if there's a record about calling the function with such parameters, then take its result from the cache
            console.log(`Return the result of calling "${func.name}" with parameters "${stigrifiedParams}" from the cache.`)
            return cache.get(stigrifiedParams)
        }

        let result = func.apply(this, params)
        cache.set(stigrifiedParams, result) // else, call the function and record the result in the cache
        console.log(`The first time "${func.name}" is called with parameters "${stigrifiedParams}". The result is saved to the cache!`)
        return result
    }

    function stringHash(...args) {
        let result = args.map(item => item)
        return result.join(",")
    }

}

function test(x){
    return `${test.name} was called with '${x}'`
}

let cachedTest = cachingDecorator(test)
console.log(cachedTest(2))
console.log(cachedTest("yo"))
console.log(cachedTest(2))
console.log(cachedTest("yo"))
console.log(cachedTest("yo"))

let worker = {
    previous: "",
    naturalSum: function(...p){
        let sum = p.reduce((accum, item) => accum += item)
        this.previous += sum + " "
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
function spy(func){

    function wrapper(...args){
        wrapper.calls.push(args)
        let result = func.apply(this, args)
        wrapper.results.push(result)
        return result
    }

    wrapper.calls = [] // we could've used regular closured, but we need them to be available outside
    wrapper.results = []

    return wrapper
}

function work(a, b) {
    return a + b // произвольная функция или метод
}

work = spy(work);
work(1, 2); // 3
work(4, 5); // 9

console.log(work.calls)
console.log(work.results)




// delay
// Call the function after a 'ms' delay
function delay(func, ms){
    return function (...args){
        setTimeout(() => func.apply(this, args), ms)
    }
}

let f1000 = delay(alert, 1000);
f1000("test"); // показывает "test" после 1000 мс




// debounce
// Call the function not more often than in 'ms'. Ignore the calls that occur during the cooldown.
function debounce(func, ms){
    
    function wrapper(...args){
        if(wrapper.cooldown){
            let result = func.apply(wrapper, args)
            wrapper.cooldown = false
            setTimeout(() => wrapper.cooldown = true, ms)
            return result
        }
    }

    wrapper.cooldown = true

    return wrapper
}

let f = debounce(alert, 1000);

f(1); // выполняется немедленно
f(2); // проигнорирован

setTimeout( () => f(3), 100); // проигнорирован (прошло только 100 мс)
setTimeout( () => f(4), 1100); // выполняется
setTimeout( () => f(5), 1500); // проигнорирован (прошло только 400 мс от последнего вызова)




// throttle
function throttle(func, ms){

    function wrapper(...args){

        if(cooldown){
            console.log('this inside wrapper: ', this)
            let result = func.apply(this, args)
            cooldown = false // red light

            setTimeout(() => {
                cooldown = true // green light
                if(lastCall){ // if there's an entry in the queue 
                    result = wrapper.apply(This, lastCall)
                    lastCall = This = null // don't loose it or you'll have endless cycle of self-calling functions
                }
            }, ms)

            return result

        } else {
            lastCall = args
            This = this
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

// f1000 передаёт вызовы f максимум раз в 1000 мс
let f1000 = throttle(f, 1000);

f1000(1); // показывает 1
f1000(2); // (ограничение, 1000 мс ещё нет)
f1000(3); // (ограничение, 1000 мс ещё нет)

// когда 1000 мс истекли ...
// ...выводим 3, промежуточное значение 2 было проигнорировано





// Passing all arguments along with the context to another function is called 'call forwarding'.

let wrapper = function () {
    return func.apply(this, arguments);
}

// When an external code calls such wrapper, it is indistinguishable from the call of the original function func.