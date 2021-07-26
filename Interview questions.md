# Interview questions

- [Interview questions](#interview-questions)
	- [JS | Common Programming Concepts](#js--common-programming-concepts)
		- [Pure function](#pure-function)
		- [Tasks](#tasks)
			- [seq](#seq)
	- [Node](#node)
	- [React](#react)
		- [Pure Component](#pure-component)
		- [Controlled and Uncontrolled components](#controlled-and-uncontrolled-components)

---

## JS | Common Programming Concepts

### Pure function

1. [Source](https://medium.com/technofunnel/working-with-react-pure-components-166ded26ae48)

A function which:

- **Deterministic**: given the same input, will always return the same output
- Produces **no side effects**:
  - change the arguments or the outer variables
  - change files
  - make async data calls: requests, timers, etc.
  - generate random values
  - log data to the console
  - call another impure function

Pure function is **independent** of the outside state. It takes some input and return some output based on that input.

If you call a function without using its returned value - it's an **impure** function.

Pros:

- immune to a large number of bugs thanks to its abstraction
- easy to move and reuse in different places

---

###

---

### Tasks

#### seq

Write a functions capable of doing this:

```js
seq((x) => x + 7)((x) => x * 2)(5) // 17
```

Solution:

```js
const seq = (operator1) => (operator2) => (x) => operator1(operator2(x))
```

---

## Node

---

## React

### Pure Component

1. [Source](https://medium.com/technofunnel/working-with-react-pure-components-166ded26ae48)

Similar to a Pure Function, it's a component that:

- doesn't re-render if the value of state and props has been updated **with the same values** (for higher performance).
- state and props are **shallow**-compared (which means changing the properties of the existing state object won't cause re-render - you should `{...state}` it).

One way of using them is to extend the `React.PureComponent` class - this way your component won't re-render if the state hasn't change:

Using standard hooks makes pure components.

---

### Controlled and Uncontrolled components

See the `Controlled and Uncontrolled components` chapter in the first React lesson.

---

###
