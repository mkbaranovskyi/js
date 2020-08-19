//@ts-check
'use strict'

// Destructuring
// Arrays
let list = [1, 2, [3, 4]]
let [a, , b] = list; // important semicolon! Otherwise it is concatenated with the next string into list[a, b]
[a, b] = [b, a]
console.log(a, b) // [3, 4], 1

// default values can be assigned
let [c = 'c', d = 'd'] = [5] 
console.log(c, d) // 5, 'd'

// works with functions
function f(){
    return [1,2]
}
let [x, y] = f()
console.log(x, y) / 1, 2

// works with 'rest'
let [a, ...b] = [1, 2, 3, 4]
console.log(a) // 1
console.log(b) // [2, 3, 4


// Objects
var { a, b } = {a: 'max', b: 20}
console.log(a)
console.log(b)


let obj = {d: 'CapitalD', p: 42, name: "max"}
let {d: D = "D", p, q = false} = obj // The colon shows “what : goes where”
console.log(D) // CapitalD
console.log(p) // 42 
console.log(q) // false
let {name: who} = obj
console.log(who) // max


// Using '...'
let options = {
    title: "Menu",
    height: 200,
    width: 100
}
let {title, ...rest} = options
console.log(rest) // {height: 200, width: 100}


// Setting function's default parameters. It is wise to use an object instead of a bunch of arguments, especially when many of them are left default when invoking. 
function drawChart({
    size = "big",
    coords = {
        x: 0,
        y: 0
    },
    radius = 10
} = {}) { // assignment in the end is for having the ability to invoke function w/o params at all
    console.log(size, coords, radius)
}

drawChart({
    coords: {
        x: 10, y: 20
    },
    radius: 50
})
drawChart()
// Basically, if you want to get data from the whole giant object in one step, you just need to create the right mask to put it on later, so it would fit perfectly on all levels. 

// When deconstructing an object, if a property is not accessed in itself, it will continue to look up along the prototype chain.
var obj = {self: '123'};
obj.__proto__.prot = '456';
const {self, prot} = obj;
// self "123"
// prot "456"（Access to the prototype chain）

function byField(field, backwards = false){
    return (a, b) => {
        let result
        if(a[field] > b[field]){
            result = 1
        }
        result = -1
        if(backwards){
            result = -result
        }
        return result
    }
}



