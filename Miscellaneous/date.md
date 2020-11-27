# Date

- [Date](#date)
	- [Sources](#sources)
	- [Upgraded `toISOString()`](#upgraded-toisostring)

***


## Sources

1. https://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript - solution below
2. https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date

***


## Upgraded `toISOString()`

```js
Date.prototype.toIsoString = function() {
    const tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            const norm = Math.floor(Math.abs(num))
            return (norm < 10 ? '0' : '') + norm
        }
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60)
}

const dt = new Date()
console.log(dt.toIsoString())
console.log(dt.toIsoString().slice(0, 10))
```