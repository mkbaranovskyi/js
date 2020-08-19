// Tasks: http://gitlab.a-level.com.ua/gitgod/FrontendLectures/src/master/06FunctionJQHomeWork.md

// sort

function sortArraysOfObjects(array, field, ascent = true){
    if(ascent) {
        return array.sort((a, b) => a[field] > b[field] ? 1 : -1)
    } else {
        return array.sort((a, b) => a[field] < b[field] ? 1 : -1)
    }
} 

let persons = [ // test subject
    {name: "Иван", age: 17},
    {name: "Мария", age: 35},
    {name: "Алексей", age: 73},
    {name: "Яков", age: 12},
]



// array map

function stringsToNumber(arr){
    for(let i=0; i < arr.length; i++){
        if(typeof arr[i] == 'string') {
            arr[i] = +arr[i]
        }
    }
    return arr
}

stringToNumber(["1", {}, null, undefined, "500", 700]) // [1, {}, null, undefined, 500, 700]



// array reduce

function myReduce(arr){
    return arr.reduce((accumulator, currentValue) => {
        if(typeof currentValue == 'number' && !isNaN(currentValue)){ 
            return accumulator * currentValue
        }
        return accumulator
    }, 1)
}

myReduce(["0", 5, 3, "string", null]) // 15



// object filter

function filterObject(obj, func){
    let newObj = {}
    for(let key in obj){
        if(func(key, obj[key])){
            newObj[key] = obj[key]
        }
    }
    return newObj
}

var phone = { // test subject
    brand: "meizu",
    model: "m2",
    ram: 2,
    color: "black",
};

filterObject(phone,function(key,value){
    return (key == "color" || value == 2); 
}); // {ram: 2, color: "black"}



// object map

Object.defineProperty(Object.prototype, 'map', {
	value: function(callback){
        const obj = {}
        for(const key in this){
            Object.assign(obj, callback.call(this, key, this[key]))
        }
        return obj
    }
})

let obj = {
    name: "Иван",
    age: 17
}

obj.map(function (key, value) {
    var result = {};
    result[key + "_"] = value + "$";
    return result;
})

// classic solution

function mapObject(obj, func){
    let newObj = {}
    for(let key in obj){
        let tmpObj = func(key, obj[key])
        for(let tmpKey in tmpObj){
            newObj[tmpKey] = tmpObj[tmpKey]
        }
    }
    return newObj
}

mapObject({name: "Иван", age: 17}, function(key,value){
    var result = {};
    result[key+"_"] = value + "$";
    return result;
}) // {name_: "Иван$", age_: "17$"}
