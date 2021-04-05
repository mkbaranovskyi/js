class MySum {
	constructor(initialValue = 42) {
		this.sum = initialValue
	}

	add(value) {
		this.sum += value
		// We return our object which allowes us to chain method calls
		return this
	}
}

const sum1 = new MySum()

console.log(sum1.add(5).add(-2).add(3).sum) // 48

const sum2 = new MySum(0)

console.log(sum2.add(5).add(-2).add(3).sum)	// 6
