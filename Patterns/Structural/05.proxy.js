function tryFetch(url) {
	return `${url} - server response`
}

const cache = new Set()

const proxiedFetch = new Proxy(tryFetch, {
	apply(target, thisArg, args) {
		const url = args[0]

		if (cache.has(url)) {
			return `${url} - cache response`
		}

		cache.add(url)
		return Reflect.apply(target, thisArg, args)
	}
})

console.log(proxiedFetch('yahoo.com'))
console.log(proxiedFetch('bing.com'))
console.log(proxiedFetch('yahoo.com')) // cache response
