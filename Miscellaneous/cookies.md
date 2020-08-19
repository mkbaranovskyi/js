- [Cookies](#cookies)
	- [Intro](#intro)
	- [Options](#options)
		- [`path=/mypath`](#pathmypath)
		- [`domain=site.com`](#domainsitecom)
		- [`expires`, `max-age`](#expires-max-age)
		- [`secure`](#secure)
		- [`samesite`](#samesite)

# Cookies

## Intro

Cookies are small strings of data that are stored directly in the browser. They are a part of HTTP protocol. 

Cookies are usually set by a web-server using response `Set-Cookie` HTTP-header. Then the browser automatically adds them to (almost) every request to the same domain using `Cookie` HTTP-header.

One of the most widespread use cases is authentication:

1. Upon sign in, the server uses Set-Cookie HTTP-header in the response to set a cookie with a unique “session identifier”.
2. Next time when the request is set to the same domain, the browser sends the cookie over the net using Cookie HTTP-header.
3. So the server knows who made the request.
***

We can use `document.cookie` to acces cookies. 

The value of document.cookie consists of name=value pairs, delimited by `;`. Each one is a separate cookie.

This is not a data property, it's an accessor (get/set)! **A write operation to document.cookie updates only cookies mentioned in it, but doesn’t touch other cookies.**

```javascript
document.cookie = `user=Max`	// updates only 'user'
```

Use `encodeURIComponent()` to encode special characters (like spaces):

```javascript
const name = 'my name'
const value = 'Max Bar'

document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)
```
***

There are few **limitations**:

* The `name=value` pair, after `encodeURIComponent`, should not exceed `4kb`. So we can’t store anything huge in a cookie.
* The total number of cookies per domain is limited to around 20+, the exact limit depends on a browser.
***


## Options

### `path=/mypath`

The url path prefix, the cookie will be accessible for pages under that path. Must be absolute. If a cookie is set with `path=/admin`, it’s visible at pages `/admin` and `/admin/something`, but not at /home or /adminpage.

Usually, we should set path to the root: `path=/` to make the cookie accessible from all website pages.
***


### `domain=site.com`

A domain where the cookie is accessible. Allows to make a cookie accessible at subdomains. To allow `site.com` cookies be accessible in subdomain `forum.site.com`, we should explicitly set it:

```javascript
// at site.com
// make the cookie accessible on any subdomain *.site.com:
document.cookie = "user=John; domain=site.com"

// later

// at forum.site.com
alert(document.cookie); // has cookie user=John
```

There's no way to make cookies accessible on other 2nd-level domain. 
***


### `expires`, `max-age`

If a cookie doesn’t have one of these options, it disappears when the browser is closed. 

`expires=Tue, 19 Jan 2038 03:14:07 GMT` - the required format. Use `date.toUTCString()` to obtain it. 

```javascript
// expires in 1 day

let date = new Date()		// 'Thu Apr 09 2020 20:17:03 GMT+0300'
date.setDate(date.getDate() + 1)	// +1 day
date = date.toUTCString()	// 'Fri, 10 Apr 2020 17:15:56 GMT'

document.cookie = 'user=Max; expires=' + date
```

If we set expires to a date in the past, the cookie is deleted.

`max-age` specifies the cookie expiration in seconds from the current moment.

```javascript
document.cookie = 'user=Max; max-age=3600'

document.cookie = 'user=Max; max-age=0'	// delete the cookie
```
***


### `secure`

Use this option to forbid sending an important cookie that was set for `https://` over `http://`

```javascript
// assuming we're on https:// now
// set the cookie secure (only accessible if over HTTPS)
document.cookie = "user=John; secure"
```
***


### `samesite`

Forbids the browser to send the cookie with requests coming from outside the site, helps to prevent XSRF attacks.


