class Semaphore {
  private _runningJobs = 0;
  private _jobQueue: { fn: Function, args: any[] }[] = [];

  constructor(private readonly _maxJobs = 1) { }

  async callFunction(fn: Function, ...args: any[]) {
    this._jobQueue.push({ fn, args });
    return this.tryNext();
  }

  private async tryNext() {
    if (!this._jobQueue.length || this._runningJobs >= this._maxJobs) {
      return;
    }

    const { fn, args } = this._jobQueue.shift()!;
    this._runningJobs++;

    try {
      return await fn(...args);
    } finally {
      this._runningJobs--;
      this.tryNext();
    }
  }
}

async function resolveAfterDelay(delay = 1000) {
  await new Promise(res => setTimeout(res, delay));
  return (`Yay! Delay ${delay} ms`);
}

async function throwAfterDelay(delay = 500) {
  await new Promise(res => setTimeout(res, delay));
  throw new Error(`Scheduled error! Delay ${delay} ms`);
}

const throttler = new Semaphore(2);

throttler.callFunction(() => throwAfterDelay(1000)
  .then((res) => console.log(res))
  .catch((err) => console.error(err)));

throttler.callFunction(() => resolveAfterDelay(2000)
  .then((res) => console.log(res))
  .catch((err) => console.error(err)));

throttler.callFunction(() => resolveAfterDelay(1000)
  .then((res) => console.log(res))
  .catch((err) => console.error(err)));
