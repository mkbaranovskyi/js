# Event Loop

- [Event Loop](#event-loop)
	- [Sources](#sources)
	- [Terms](#terms)
		- [Heap](#heap)
		- [Queues](#queues)
		- [Stack](#stack)
	- [Adding Macro- and Microtasks](#adding-macro--and-microtasks)
	- [Full picture](#full-picture)
	- [Examples](#examples)

***

## Sources 

1. https://careersjs.com/magazine/javascript-job-queue-microtask/ - best explanation
2. https://javascript.info/event-loop - read about optimizations
3. https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop - not good, too simplified, Job Queue never mentioned
4. https://frarizzi.science/journal/web-engineering/browser-rendering-queue-in-depth - rendering queue (not covered in this lesson)

***


## Terms

![](img/2020-06-25-15-12-11.png)

### Heap

Objects are allocated in the Heap - a large mostly unstructured region of memory. 

***


### Queues

There are 2 separate queues based on the **FIFO** principle (first in, first out) in JS:

1. The Message Queue (aka the Task / **Macro**task Queue). It stores the majority of callbacks: from events, timers, network connections, etc.
2. The Job Queue (aka the **Micro**task Queue). It stores Promise callbacks (thens) and other microtasks.

Examples of **macrotasks**:

- When an external script `<script src="...">` loads, the task is to execute it.
- When a user moves their mouse, the task is to dispatch mousemove event and execute handlers.
- When the time is due for a scheduled `setTimeout`, the task is to run its callback.
- …and so on.

**All microtasks** from the Job Queue are executed until the Job Queue is empty **after each message execution from the Macrotask Queue**. Again: 

1. **One** function from the Macrotask Queue executed.
2. **All** functions in the Microtask Queue executed.
3. Repeat 1-2 until there's no pending tasks of any kind anymore. 

It is possible for the code in the **Microtask Queue** to schedule more callbacks. These will **not be deferred** until future iterations but will instead run in the **current iteration**, meaning it is possible to **starve** your program by creating an endless loop of Job Queue callbacks. So be careful adding new microtasks!

***


### Stack

The FILO (first in - last out) queue. The best analogy - a toy pyramid. 

Stack represents the only execution thread present in JS. When a function executs, expressions from the function get into the Stack, execute and then pop out. When the Stack is **completely empty**, only then the Queue proceeds to the next task. 

***



## Adding Macro- and Microtasks

Sometimes you may want to not execute something immediately but rather delay its execution to the next Event Loop iteration. Here's how you can do this:

Task|How to do|Notes
-|-|-
Macro|`setTimeout(fn)`|Useful to break large tasks on the smaller ones to let microtasks and rendering changes in between. 
Micro|**Promises**, `queueMicrotask(fn)`, `MutationObserver`|These are run as soon as the Stack is empty. Be cautious to not **starve** your app as the microtasks added from the Misrotask Queue are not deferred to the next iteration of it but rather run in the current one.

To perform more complex calculations use `Web Workers` - they have their own event loops and can work in parallel with the main loop in the browser. 

***



## Full picture

The Event Loop concept is very simple. There’s an endless loop, where the JavaScript engine waits for tasks, executes them and then sleeps, waiting for more tasks. **It doesn't work all the time** - only when there're tasks! 

The best analogy - a roller coaster. People wait in line. Every few minutes the cart returns, takes another group of people (another function from the Macrotask Queue) and goes on for another ride. But as soon as people with VIP tickets arrive (the Microtask Queue), they take a ride without waiting in line **as soon as the cart arrives** (the current task is finished and the Stack is empty). After all VIPs are satisfied, the common line continues. And the loop works to the last passanger. Then it goes dormant until new tasks arrive. 

The general algorithm of the engine (not the actual code, consider it a **pseudo code**!):

```js
// These 2 arrays and object are filled from somewhere else
let tasks, 
	microtasks,
	renderQueue,
	stack

function eventLoop(){
	// While there are tasks of any kind
	while(tasks.length || microtasks.length){
		// Execute all microtasks if any
		if(microtasks.length){
			runMicrotasks()
		}

		// Execute ONE macrotask to completion if any
		if(tasks.length){
			runTask(tasks[0])
			// Remove the finished task from the Message Queue
			tasks.shift()
		}

		// Render changes if any
		if(renderQueue.length){
			renderAllChanges()
		}
	}
}

function runMicrotasks(){
	// Remember: the Microtask Queue DOES allow adding new functions to itself to be executed right away, on the current Microtask Queue run
	while(microtasks.length){
		runTask(microtasks[0])
		microtasks.shift()
	}
}

function runTask(task){
	if(stack.isEmpty){
		addToStack()
	} else {
		stack.addEventListener('emptyAgain', addToStack)
		stack.removeEventListener('emptyAgain', addToStack)
	}

	function addToStack(){
		stack.add(task)
	}
}
```

While there are tasks:

1. Execute them, starting with the oldest task.
2. Execute all microtasks from the Microtask Queue between different macrotasks.
3. Render changes if any.
4. To execute any taks, it is placed to the Stack and **runs to completion**. This means that until the Stack is empty again, no further tasks of any kind will be touched. 
5. Repeat paragraphs 1-4 until there're no more tasks. Go to sleep after that until new tasks arrive. 

The JavaScript engine **does nothing most of the time**, it only runs if a script/handler/event activates.

***


## Examples

Example 1

```javascript
main()

function main() {
	console.log('A')

	setTimeout(function exec() {
		console.log('c')
	})

	console.log('C')
}
```

Output:

```
A
C
B
```

![](img/2020-06-26-13-13-15.png)

1. The Stack is empty so `main()` is added to it immediately as frame 1.
2. `console.log('A')` is added to the Stack as frame 2, then executed and removed from the Stack.
3. `setTimeout` callback `exec` is added to the Stack as frame 2. The browser API is used to delay the callback. Frame 2 is removed from the Stack. 
4. `console.log('C')` is added to the Stack as frame 2, then executed and removed from the Stack.
5. `main` has finished its work and removed from the Stack (it lived as frame 1). The Stack is empty. Other tasks can be executed now.
6. As 0 s (actually 0.000004 s) passed, the `exec` callback is added to the Message Queue and will be executed as soon as possible.
7. `exec` begins execution, becoming frame 1 in the Stack. Then removed from the Stack. 

***

Example 2 

```javascript
// 1. Added to the Job Queue as Microtask 1
queueMicrotask(() => console.log('micro outer 1'))

// 2. Added to the Stack and begins execution
main()	// -> go inside
// 6. Function finished and removed from the Stack.

// 7. Added to the Job Queue as Microtask 3
queueMicrotask(() => console.log('micro outer 2'))

function main() {
	// 3. Added to the Stack, callback planned as Macrotask 1, removed from the Stack
	setTimeout(function exec() {
		console.log('timeout')
	})

	// 4. Added to the Stack, callback enqueued to the Job Queue as Microtask 2, removed from the Stack
	queueMicrotask(() => {
  		console.log('micro inner')
	})
  
	// 5. Added to the Stack, executed, removed from the Stack.
	console.log('A')
}
```

Only 'A' is printed immediately. The rest of the output is planned in the Queues and will be executed with minimal delay.
The result: 

```
A

micro outer 1
micro inner
micro outer 2

timeout
```

***

Example 3. This example shows that `setTimeout` represents the **minimal** time to run a task, not the actual one. Here we set up timer for 500 ms but then block execution with the 2 s task. While the Stack is busy running the loop, no other tasks cab be performed, so the timer callback can only run in 2 s - when the Stack is finally ompry. 

```javascript
const s = new Date().getSeconds();

setTimeout(function () {
	// prints out "2", meaning that the callback is not called immediately after 500 milliseconds.
	console.log("Ran after " + (new Date().getSeconds() - s) + " seconds");
}, 500)

while (true) {
	if (new Date().getSeconds() - s >= 2) {
		console.log("Good, looped for 2 seconds")
		break;
	}
}
```

***

Example 4

```js
setTimeout(() => {
  console.log('first timeout')
})

firstFunction()
secondFunction()
console.log('first console log')

function firstFunction() {
  thirdFunction()

  const firstResponse = Promise.resolve('1st Promise')
  const secondResponse = Promise.resolve('2nd Promise')

  setTimeout(() => {
    firstResponse.then(res=> {
      console.log(res)
    })
  })

  secondResponse.then(res=> {
    console.log(res)
  })
}

function thirdFunction() {
  const thirdResponse = Promise.resolve('3rd Promise')
  const fourthResponse = Promise.resolve('4th Promise')

  thirdResponse.then(res=> {
    console.log(res)
  })

    console.log('Hello from the microtask queue')
  })

  setTimeout(() => {
    fourthResponse.then(res=> {
      console.log(res)
    })
  })
}

function secondFunction() {
  let i = 0
  let start = Date.now()

  for (let j = 0; j < 5.e9; j++) {
    i++
  }
  console.log("Loop done in " + (Date.now() - start) + 'ms')
}
```

Output:

```
# Sync code output

Loop done in 5865ms
first console log


# Async Job Queue

3rd Promise
Hello from the microtask queue
2nd Promise


# Async Message Queue

first timeout
4th Promise
1st Promise
```

1. Sync code runs first. 
   1. `setTimeout` is set.
   2. `firstFunction` runs. It immediately calls the `thirdFunction`
      1. `thirdFunction` runs. Promises are resolved and `then`-s` are planned as callbacks in their corresponding queues. 
   3. Back to the `firstFunction`. Promises are resolved and `then`-s` are planned as callbacks in their corresponding queues. 
   4. `secondFunction` runs. It **blocks** execution for several seconds while the loop is running **synchronously** inside. Then it produces the first output. 
   5. Sync `first console log` it printed. The **sync code is finished**, all callbacks are set to their queues.
2. Now it's time for **async** callbacks.
   1. The Job Queue runs all stored callbacks in the FIFO order.
   2. The Message Queue runs all stored callbacks in the FIFO order.

![](img/loop_pic.png)