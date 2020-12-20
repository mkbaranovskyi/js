# Cookies

- [Cookies](#cookies)
	- [Intro](#intro)
	- [Vanilla](#vanilla)
		- [Options](#options)
			- [`path=/mypath`](#pathmypath)
			- [`domain=site.com`](#domainsitecom)
			- [`expires`, `max-age`](#expires-max-age)
			- [`secure`](#secure)
			- [`samesite`](#samesite)
	- [`js-cookie` module](#js-cookie-module)
			- [`get (key)`](#get-key)
			- [`remove (key)`](#remove-key)
			- [`getJSON (key)`](#getjson-key)
		- [Namespace conflicts](#namespace-conflicts)
	- [Server-side](#server-side)

---

## Intro

Here will be described 2 ways of handling cookies:

- archaic (but valid) vanilla JS
- 3rd-party lib `js-cookie`

## Vanilla

Cookies are small strings of data that are stored directly in the browser. They are a part of HTTP protocol.

Cookies are usually set by a web-server using response `Set-Cookie` HTTP-header. Then the browser automatically adds them to (almost) every request to the same domain using `Cookie` HTTP-header.

One of the most widespread use cases is authentication:

1. Upon sign in, the server uses Set-Cookie HTTP-header in the response to set a cookie with a unique “session identifier”.
2. Next time when the request is set to the same domain, the browser sends the cookie over the net using Cookie HTTP-header.
3. So the server knows who made the request.

---

We can use `document.cookie` to acces cookies.

The value of document.cookie consists of name=value pairs, delimited by `;`. Each one is a separate cookie.

This is not a data property, it's an accessor (get/set)! **A write operation to document.cookie updates only cookies mentioned in it, but doesn’t touch other cookies.**

```javascript
document.cookie = `user=Max` // updates only 'user'
```

Use `encodeURIComponent()` to encode special characters (like spaces):

```javascript
const name = 'my name'
const value = 'Max Bar'

document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)
```

---

There are few **limitations**:

- The `name=value` pair, after `encodeURIComponent`, should not exceed `4kb`. So we can’t store anything huge in a cookie.
- The total number of cookies per domain is limited to around 20+, the exact limit depends on a browser.

---

### Options

#### `path=/mypath`

The url path prefix, the cookie will be accessible for pages under that path. Must be absolute. If a cookie is set with `path=/admin`, it’s visible at pages `/admin` and `/admin/something`, but not at /home or /adminpage.

Usually, we should set path to the root: `path=/` to make the cookie accessible from all website pages.

---

#### `domain=site.com`

A domain where the cookie is accessible. Allows to make a cookie accessible at subdomains. To allow `site.com` cookies be accessible in subdomain `forum.site.com`, we should explicitly set it:

```javascript
// at site.com
// make the cookie accessible on any subdomain *.site.com:
document.cookie = 'user=John; domain=site.com'

// later

// at forum.site.com
alert(document.cookie) // has cookie user=John
```

There's no way to make cookies accessible on other 2nd-level domain.

---

#### `expires`, `max-age`

If a cookie doesn’t have one of these options, it disappears when the browser is closed.

`expires=Tue, 19 Jan 2038 03:14:07 GMT` - the required format. Use `date.toUTCString()` to obtain it.

```javascript
// expires in 1 day

let date = new Date() // 'Thu Apr 09 2020 20:17:03 GMT+0300'
date.setDate(date.getDate() + 1) // +1 day
date = date.toUTCString() // 'Fri, 10 Apr 2020 17:15:56 GMT'

document.cookie = 'user=Max; expires=' + date
```

If we set expires to a date in the past, the cookie is deleted.

`max-age` specifies the cookie expiration in seconds from the current moment.

```javascript
document.cookie = 'user=Max; max-age=3600'

document.cookie = 'user=Max; max-age=0' // delete the cookie
```

---

#### `secure`

Use this option to forbid sending an important cookie that was set for `https://` over `http://`

```javascript
// assuming we're on https:// now
// set the cookie secure (only accessible if over HTTPS)
document.cookie = 'user=John; secure'
```

---

#### `samesite`

Forbids the browser to send the cookie with requests coming from outside the site, helps to prevent XSRF attacks.

---

## `js-cookie` module

1. https://www.npmjs.com/package/js-cookie

Easy to use (**Map-like** methods), **cross-platform** library.

````html
<script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script>

--- ### Methods These methods are **static** (e.g. `Cookie.set()`)and used on
the Client-side #### `set (key, value)` Sets a cookie. Returns the set cookie as
a string. ```js // Create a cookie, valid across the entire site
Cookies.set('age', '20') // Create an expiring cookie, valid to the path of the
current page Cookies.set('age', '20', { expires: 7, path: '' }) // returns
`name=value; expires=Sun, 27 Dec 2020 00:29:33 GMT`
````

#### `get (key)`

Returns a cookie value.

```js
// Get a specific cookie
Cookies.get('age') // 20

// Get all cookies as an OBJECT of key-value pairs
Cookies.get() // {name: "value", age: "20"}
```

#### `remove (key)`

Removes a cookie. Returns nothing.

Don't rely on default values, pass the exact same **path** and **domain** attributes that were used to set the cookie!

```js
Cookies.remove('name', { path: '', domain: '.yourdomain.com' })
```

#### `getJSON (key)`

You can not only pass strings as values but also **objects**. They will be `JSON.stringify(obj)` automatically.

Calling `get()` on them will return you their **string** representation.

Calling `getJSON()` will return them **parsed**.

```js
Cookies.set('name', { foo: 'bar' })

console.log(Cookies.getJSON('name')) // {foo: "bar"}
console.log(Cookie.getJSON()) // {daria: {…}, peter: {…}}

console.log(Cookies.get('name')) // '{"foo":"bar"}'
console.log(document.cookie) // 'name={%22foo%22:%22bar%22}'
```

---

### Namespace conflicts

You can use this to define your cookies and avoid conflicts with already existing ones (e.g. if you set it on a 3rd-party site - widget, etc.)

```js
const Cookies2 = Cookies.noConflict()
Cookies2.set('name', 'value')
```

---

## Server-side

1. https://www.youtube.com/watch?v=2so3hh8n-3w
