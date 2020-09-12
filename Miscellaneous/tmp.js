const str = 'More about JavaScript at https://javascript.info'
const reg = /javascript/ig

console.log(reg.test(str))    // true
console.log(reg.test(str))    // true
console.log(reg.test(str))    // false
