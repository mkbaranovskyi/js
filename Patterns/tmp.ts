interface IObserver {
  update(subject: ISubject): void;
}

interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(): void;
}


class PadawanGeneratorSubject implements ISubject {
  state = 0;
  private readonly _observers: IObserver[] = [];

  attach(observer: IObserver): void {
    const existingObserver = this._observers.includes(observer);
    if (existingObserver) {
      throw new Error('The observer is already attached');
    }

    this._observers.push(observer);
  }

  detach(observer: IObserver): void {
    const observerIndex = this._observers.indexOf(observer);
    if (observerIndex === -1) {
      throw new Error('The observer is not attached');
    }

    this._observers.splice(observerIndex, 1);
  }

  notify(): void {
    this._observers.forEach((observer) => observer.update(this));
  }

  /**
   * Publishers usually have lots of its own logic along with subscription logic
   */
  generatePadawan() {
    this.state = Math.random(); 
    this.notify();
  }
}

class JediObserver implements IObserver {
  update(subject: ISubject): void {
    // some logic that uses the subject's state
    if (subject instanceof PadawanGeneratorSubject && subject.state >= 0.5) {
      console.log(`There is peace`);
    }
  }
}

class SithObserver implements IObserver {
  update(subject: ISubject): void {
    // some logic that uses the subject's state
    if (subject instanceof PadawanGeneratorSubject && subject.state < 0.5) {
      console.log(`Passion - strength - power - victory!`);
    }
  }
}


const padawanGenerator = new PadawanGeneratorSubject();

const jediObserver = new JediObserver();
const sithObserver = new SithObserver();

padawanGenerator.attach(jediObserver);
padawanGenerator.attach(sithObserver);

padawanGenerator.generatePadawan();
padawanGenerator.generatePadawan();
padawanGenerator.generatePadawan();
padawanGenerator.generatePadawan();

padawanGenerator.detach(sithObserver);

console.log('Sith observer is detached - no more sith!');

padawanGenerator.generatePadawan();
padawanGenerator.generatePadawan();
padawanGenerator.generatePadawan();
padawanGenerator.generatePadawan();


