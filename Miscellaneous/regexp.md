# Regular Expressions

## Symbol classes:

* \d 	- digit
* \s 	- space
* \w 	- LATIN letter || digit || _ 
* \D 	- NOT a digit
* \S 	- NOT a space
* \W 	- NOT a word character
* .		- any symbol (except the new line symbol)

## Flags

* g     - global
* i     - case-insensitive
* m     - multiline 
* s     - including the new line symbol
* u     - unicode support
* y     - search on the position

```javascript
/\d\s\w/		// digit + space + symbol of a word (e.g. '1 a')
/CSS\d/			// 'CSS' + digit
"I love HTML5!".match(/\s\w\w\w\w\d/) 	// ' HTML5'
```
***

Filter only digits
```javascript
console.log("+7(903)-123-45-67".match(/\d/g	))			// ["7", "9", "0", "3", "1", "2", "3", "4", "5", "6", "7"]
console.log("+7(903)-123-45-67".match(/\d/g	).join(''))	// 79031234567

// The second way

// str.replace(reg, template) replaces matches with a template
console.log(str.replace(/\D/g, ''))		// replace all non-digits with an empty string, leaving only digits
```
***

`$&` pastes all the match
```javascript
"Люблю HTML, CSS".replace(/HTML/, "$& и JavaScript")	// "Люблю HTML и JavaScript, CSS"
```
`$`\` pastes part of of the string **before** the match
```javascript
"Люблю HTML, CSS".replace(/HTML/, "$` и JavaScript")	// "Люблю Люблю  и JavaScript, CSS"
```
`$'` - **after** the match
```javascript
"Люблю HTML, CSS".replace(/HTML/, "$' и JavaScript")	// "Люблю , CSS и JavaScript, CSS"
```
***

`^word` means the **beginning** of the string, `word$` is the **end**
```javascript
console.log(/^Mary/.test("Mary had a little lamb"))			// true, begins with 'Mary'
console.log(/lamb$/.test("Mary had a little lamb"))			// true, ends with 'lamb'

let goodInput = "12:34";
let badInput = "12:345";

let regexp = /^\d\d:\d\d$/;
console.log( regexp.test(goodInput) ); // true
console.log( regexp.test(badInput) ); // false, the search seeks a match from the beginning of the string, since it starts with '^'
```
***

`\m` - multiline, `^` and `$` will not only work on the beginning and the end of the text but also on each line
```javascript
let str = `1 - one
2 - two
3 - three`

console.log(str.match(/^\d/g))		// ["1"]
console.log(str.match(/^\d/gm))		// ["1", "2", "3"]
console.log(str.match(/\w$/gm))		// ["e", "o", "e"]
```
***

We can find the **end of the line** in two ways: with `$` and `\n`
```javascript
let str = `1 - one
2 - two
3 - three`

console.log(str.match(/$/gm))	// ["", "", ""]	 => 3 matches (3 line endings)
console.log(str.match(/\n/g))	// ["↵", "↵"]	=> 2 matches (2 new line symbols, also we don't even need the 'm' flag)
```
***

`\b` - **boundary** of the word, triggers when to the one side is '\w' and to the other is not, *only works for latin letters*.
```javascript
console.log('Hello, world'.match(/\bHello\b/))	// ["Hello", index: 0, input: "Hello, world", groups: undefined]
console.log('HelloWorld'.match(/\bHello\b/))	// null

// also works with digits

console.log('8-21-173-j48'.match(/\b\d\d\b/g))		// ["21"]
```
***

https://learn.javascript.ru/regexp-boundary#naydite-vremya
```javascript
console.log('Завтрак в 09:00 в комнате 123:456'.match(/\b\d\d:\d\d\b/g))	// ["09:00"]
```
***

We use `\` to escape all special characters from the set: [ \ ^ $ . | ? * + ( )
```javascript
console.log('/'.match(/\//))                // ["/"]
console.log('function g()'.match(/g\(\)/))  // ["g()"]
```
***

If we use **`new RegExp`**, we need another kind of excaping:
```javascript
console.log('Chapter 5.1'.match(/\d.\d/))	// ["5.1"]
let regexp = new RegExp("\d\.\d")
console.log('Chapter 5.1'.match(regexp))	// null => '\' symbols in a string need escaping or they'll be deleted (if not \n, \t, ... is found)
regexp = new RegExp('\\d\\.\\d')
console.log('Chapter 5.1'.match(regexp))	// ["5.1"]
// or we can use String.raw(), which means "understand the string literally, without escaping the backslashes"
regexp = new RegExp(String.raw`\d\.\d`)		// Attention! No parentheses after String.raw!
console.log('Chapter 5.1'.match(regexp))	// ["5.1"]
```
***

## Ranges 

`[aeo]` - seek any element of the given range/set. So `a` OR `e` OR `o` (one element). In `[]` no need to escape `. + ( )` 
```javascript
console.log("423-12 d3d3 qw-34a78-7".match(/\d[\w-]\d/g))		// ["423", "3d3", "4a7", "8-7"]
console.log("Exception 0xAF".match(/x[0-9A-F][0-9A-F]/g))		// ["xAF"]
console.log("Exception 0xAF".match(/x[0-9A-Fa-f][0-9A-Fa-f]/g))	// ["xce", "xAF"]
console.log("Exception 0xAF".match(/x[0-9A-Fa-f][0-9A-Fa-f]/g))	// ["xce", "xAF"]
```
\w is basically [a-zA-Z0-9], \d is [0-9], etc.
***

**Excluding ranges**
`[^a-z]` - any symbol except of 'a-z' range
```javascript
// (email) any symbol except latin, digit, '.', '-', '_' or '@' - error
console.log('namba1.php-html_css@mail.com'.match(/[^@^.^_^\-^\w]/))		// null => no forbidden symbols
// (phone number) any symbol except digit, space, '-', parentheses - error
console.log('+375 (29) 817-68-92'.match(/[^\d^\s^\-^\(^\)^+)]/))		// null => no firbidden symbols
```
***

## QUANTIFIERS

q|meaning
-|-
{n}|exactly n}
{n, m}|n to m|
{n, }|n+
```javascript
console.log('I am 12345 years old'.match(/\d{3}/g)) 				// ["123"]
console.log('I am not 12 but 12345 years old'.match(/\d{2,4}/g)) 	// ["12", "1234"]
console.log('I am not 12 but 12345 years old'.match(/\d{3,}/g)) 	// ["12345"]
console.log("+7(903)-123-45-67".match(/\d{1,}/g))					// ["7", "903", "123", "45", "67"]
```

`*`	- 0 or more, the same as {0, } 
```javascript
console.log('100 10 1'.match(/\d0*/g))	// ["100", "10", "1"]
console.log('100 10 1'.match(/\d0+/g))	// ["100", "10"] 
```
`+` - 1+ of 'n', the same as {1, }
```javascript
console.log('+7(903)-123-45-67'.match(/\d+/g))	// ["7", "903", "123", "45", "67"]
```
`?` - 0 or 1, means 'it may be present or not', the same as {0, 1}
```javascript
console.log('color colour'.match(/colou?r/g))   // ["color", "colour"]
```

RegExp for decimal fractions
```javascript
console.log('lol 0.5435 12.0'.match(/\d+\.\d+/g))		// ["0.5435", "12.0"]
// another version
console.log('str 0.5435 12.0'.match(/\d+\.[1-9]\d+/g))	// ["0.5435"] => 12.0 and other 'point zero' numbers excluded
```
**html tags**
```javascript
console.log('<body>...</body>'.match(/<\/?[a-z][a-z0-9]*>/g))	// ["<body>", "</body>"] => '<', optional '/', a letter, zero or more letters of numbers, '>'
console.log('<h1>...</h2>'.match(/<\/?[a-z][a-z0-9]*>/g))		// ["<h1>", "</h2>"]
```
***

https://learn.javascript.ru/regexp-quantifiers#kak-nayti-mnogotochie
```javascript
let regexp = /\.{3,}/g;
console.log( "Привет!... Как дела?.....".match(regexp) ); // ..., .....
```

https://learn.javascript.ru/regexp-quantifiers#regulyarnoe-vyrazhenie-dlya-html-tsvetov
```javascript
let regexp = /#[a-f0-9]{6}\b/gi	// \b is needed to drop #12345678 or we'll get '#123456' match (cropped number)
let str = "color:#121212; background-color:#AA00ef bad-colors:f#fddee #fd2 #12345678";
console.log( str.match(regexp) )      // #121212,#AA00ef
```
***

## Greedy and lazy

**Greedy** is the default behaviour pattern. The regexp will repeat the quantifier as much as it can.

```javascript
console.log('a "witch" and her "broom" is one'.match(/".+"/g))	// [""witch" and her "broom""]
```
The engine didn't choose to return `witch`, instead it returned the whole string, bc `.` means 'any symbol' including `"`. So it seeks till the end of the line, then realizes that the line has ended and the ending wasn't found, so it take steps back to find `"`. 


**Lazy** is the opposite principle: take as less as possible to satisfy the condition. Use `?` _after a quantifier_ to turn this mode on.
```javascript
console.log('a "witch" and her "broom" is one'.match(/".+?"/g))	// [""witch"", ""broom""]
```
Now it worked fine: the engine had to find 1+ entries of any symbol after `"`. As soon as it found the first one, the others are taken reluctantly, just until the closing `"` is found. 

Alternative solution: seek `"`, then {1+} of `non-"`, then `"`. The first match will be returned. 
```javascript
console.log('a "witch" and her "broom" is one'.match(/"[^"]+"/g))
```
Laziness get only those quantifiers that get `?`
```javascript 
console.log('123 455'.match(/\d+ \d+?/g))	// ["123 4"] => the second but not the first
```
***
Task: find `<a href="..." class="doc">` for arbitrary `href`
```javascript
console.log('<a href="link1" class="wrong">... <p style="" class="doc"> <a href="https://ex.ua" class="doc">'.match(/<a href="[^"]*" class="doc">/g))	// ["<a href="https://ex.ua" class="doc">"]
```
Some more examples
```javascript
console.log("123 456 789".match(/\d+? \d+?/g))		// ["123 4", "56 7"]
console.log("123 456 789".match(/\d+? \d+? \d+?/g))	// ["123 456 7"]
```
https://learn.javascript.ru/regexp-greedy-and-lazy#poisk-html-kommentariev
```javascript
let regexp = /<!--.*?-->/gs;
let str = `... <!-- My -- comment
 test --> ..  <!----> ..
`;
console.log(str.match(regexp)); // '<!-- My -- comment \n test -->', '<!---->'
// don't forget /s to be able to search the matches through the line break!
```
https://learn.javascript.ru/regexp-greedy-and-lazy#poisk-html-tegov
```javascript
let regexp = /<[/]*[^>]+>/g;
let str = '<> <a href="/"> <input type="radio" checked> <b>';
console.log( str.match(regexp) ); // '<a href="/">', '<input type="radio" checked>', '<b>'
```
***

## Capturing groups

Using `()` we can apply quantifiers to the whole group of elements rather than a single element.

`go+` would match `go`, `gooo`, `gooooooo`, etc. Means "g and 1 or more 'o'"
```javascript
console.log('Gogo goooooo'.match(/go+/gi))		// ["go", "go", "goooooo"]
```

`(go)+` would match `go`, `gogo`, `gogogo`, etc. Means "1 or more 'go'" 
```javascript
console.log('Gogo goooooo'.match(/(go)+/gi))	// ["Gogo", "go"]
```
***

Task: get domain.

Solution: 1 or more groups of words and hyphens, followed by dot and followed by another word
```javascript
console.log('my-site.com.ua error!@#$ ыаыаы.на'.match(/([\w-]+\.)+\w+/g))	// ["my-site.com.ua "]
```
***

Task: get email.

Solution: the template is `name@domain`. The name includes `\w`, `\.`, `-`.

```javascript
console.log('email@my-site.com.ua wrong@no'.match(/[\w\.-]+@([\w-]+\.)+\w+/g))	// ["email@my-site.com.ua"]
```
***

We can use `()` to get the content of capturing groups. Using `.match()` without `/g` flag puts the result to the 1st index and the capturing groups to the rest of the indices. 
```javascript
let str = '<p>Hello, world!</p>'
let tag = str.match(/<(\w)>/)
console.log(tag)	// ["<p>", "p", index: 0, input: "<p>Hello, world!</p>", groups: undefined]
console.log(tag[0])	// <p>
console.log(tag[1])	// p
```

**Nested groups**

```javascript
let str = '<span class="my">';
let regexp = /<(([a-z]+)\s*([^>]*))>/;
let result = str.match(regexp);

console.log(result)		// ["<span class="my">", "span class="my"", "span", "class="my"", index: 0, input: "<span class="my">", groups: undefined]
console.log(result[0]); // <span class="my">
console.log(result[1]); // span class="my"
console.log(result[2]); // span
console.log(result[3]); // class="my"
```
***

We can **exclude** the groups we are not interested in from the resulting match by adding `?:` at the beginning of the group:
```javascript
console.log('Gogogo John'.match(/(?:go)+ (\w+)/i))	// ["Gogogo John", "John", index: 0, input: "Gogogo John", groups: undefined]
```
We excluded the first group from the match. Otherwise we would have had `["Gogogo John", "go", "John", index: 0, input: "Gogogo John", groups: undefined]`
***

https://learn.javascript.ru/regexp-groups#nayti-tsvet-v-formate-abc-ili-abcdef

Hex colors: 3 and 6-digit.

Solution: find a group of 3 hex-symbols and then double it optionally {1 or 2}.

```javascript
let regexp = /#([0-9A-F]{3}){1,2}\b/gi;	// don't forget \b to drop `#abcd`!
let str = "color: #3f3; background-color: #AA00ef; and: #abcd";
console.log(str.match(regexp)); // #3f3 #AA00ef
```
***

https://learn.javascript.ru/regexp-groups#nayti-vse-chisla

Decimal numbers. 

```javascript
let regexp = /(-?\d+)(\.\d+)?/g;
let str = "-1.5 0 2 -123.4.";
console.log(str.match(regexp)); // ["-1.5", "0", "2", "-123.4"]
```
***

https://learn.javascript.ru/regexp-groups#razobrat-vyrazhenie

Parse an expression.

```javascript
let [a, op, b] = parse("1.2 * 3.4");
console.log(a); // 1.2
console.log(op); // *
console.log(b); // 3.4

function parse(expr){
	let match = expr.match(/\s*(-?\d+(?:\.\d+)?)\s*([-+/*])\s*(-?\d+(?:\.\d+)?)\s*/)
	match.shift()	// drop the full match in [0]
	return match
}
```
***

https://learn.javascript.ru/regexp-groups#proverte-mac-adres

MAC

```javascript
let regexp = /((?:[0-9A-F]){2}:){5}[0-9A-F]/;
console.log( regexp.test('01:32:54:67:89:AB') ); 	// true
console.log( regexp.test('0132546789AB') ); 		// false (нет двоеточий)
console.log( regexp.test('01:32:54:67:89') ); 		// false (5 чисел, должно быть 6)
console.log( regexp.test('01:32:54:67:89:ZZ') ) 	// false (ZZ в конце строки)
```
***

## Backreference by number

Task: find strings in either `"..."` or `'...'`. We need to get the same opening and closing quotations marks, not to mix them!

Solution: use referencing groups by number.

```javascript
console.log(`He said: "She's the one!".`.match(/(['"])(.*?)\1/g))	// [""She's the one!""]\
```
Here's what's going on:

1. The engine finds the first match from the possible options (`'` or `"`) and remembers it as "the first group". In our case it's `"`.
2. Seeks for any other possible symbol (`.*?`).
3. Finishes with the symbol from "the first group" (`"` in our case).
***

## Alternation

`|` means 'OR'. 

```javascript
console.log('Java, then HTML, then JavaScript'.match(/html|php|java(script)?/gi))	// ["Java", "HTML", "JavaScript"]
```

It is similar to `[]` but more powerful:
```javascript
/gr[a|e]y/ === /gr[ae]y/
/gra|ey/ 			// means `gra` or `ey`
/love html|css/		// love html || css
/love (html|css)/	// love html || love css
```
***

https://learn.javascript.ru/regexp-alternation#primer-shablon-dlya-vremeni

Task: strict time template (23:00 format)

```javascript
console.log('00:00 10:10 23:59 25:99 01:87 1:2'.match(/([01]\d|2[0-3]):[0-5]\d/g))	// ["00:00", "10:10", "23:59"]
```
***

https://learn.javascript.ru/regexp-alternation#naydite-yazyki-programmirovaniya

Programming languages: find all suggested

```javascript
let regexp = /Java(Script)?|PHP|C(\+\+)?/g;
console.log("Java JavaScript PHP C++ C".match(regexp)); // ["Java", "JavaScript", "PHP", "C++", "C"]

// or just set the longer words first

regexp = /JavaScript|Java|PHP|C\+\+|C/g
console.log("Java JavaScript PHP C++ C".match(regexp))	// ["Java", "JavaScript", "PHP", "C++", "C"]
```
***

 https://learn.javascript.ru/regexp-alternation#naydite-pary-bb-kodov

 BB-codes

```javascript
let str = `
  [b]привет![/b]
  [quote]
    [url]http://ya.ru[/url]
  [/quote]
  [b][b]error[/b][/b]
`
let regexp = /\[(b|url|quote)\].*?\[\/\1\]/gs
console.log( str.match(regexp) ); // [url]http://ya.ru[/url]
```
***

https://learn.javascript.ru/regexp-alternation#naydite-ves-teg

Style

```javascript
let regexp = /<style(>|\s.*?>)/g;
console.log( '<style> <styler> <style test="...">'.match(regexp) );	// ["<style>", "<style test="...">"]
```


