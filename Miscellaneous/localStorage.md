# LocalStorage, sessionStorage

Web storage objects `localStorage` and `sessionStorage` allow to save key/value pairs **that never expire** in the browser. Changing any of them triggers the `storage` event.

Storage|Description
-|-
`sessionStorage`|Survives page refresh
`localStorage`|Survives browser restart
***

The difference with cookies: 

* Unlike cookies, web storage objects are not sent to server with each request. Because of that, we can store much more. Most browsers allow at least 2 megabytes of data (or more) and have settings to configure that.
* Also unlike cookies, the server can’t manipulate storage objects via HTTP headers. Everything’s done in JavaScript.
* The storage is bound to the origin (domain/protocol/port triplet). That is, different protocols or subdomains infer different storage objects, they can’t access data from each other.
***

Both storage objects provide methods and properties (similar to `Map` and `Set`):

Prop/Method|Description
-|-
`setItem(key, value)`|store key/value pair
`getItem(key)`|get the value by key
`removeItem(key)`|remove the key with its value
`clear()`|delete everything
`key(index)`|get the key on a given position
`length`|the number of stored items
***


## `localStorage`

Shared between all tabs and windows from the same origin. 

```javascript
localStorage.setItem('test', 1)

// reopen the browser

localStorage.getItem('test')	// 1
```

The storages **are not iterable!** Use regular `for(let i = 0; ...)` loops or `Object.keys(localStorage)` (which only returns keys belonging to the object, ignoring the prototype).

Both key and value are strings. Use `JSON.stringify()` to store objects.
***


## `sessionStorage`

Exists only within the current browser tab. Another tab with the same page will have a different storage. The data survives page refresh, but not closing/opening the tab.


## Task: store data from the `textarea`

```html
<!DOCTYPE html>
<textarea style="width:200px; height: 60px;" id="area"></textarea>

<script>
  area.oninput = e => {
    localStorage.setItem('area', e.target.value);
  };

  window.onload = e => {
    area.value = localStorage.getItem('area')
  }
</script>
```

