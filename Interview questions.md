# Interview questions

- [Interview questions](#interview-questions)
  - [Common Programming Concepts](#common-programming-concepts)
    - [Pure function](#pure-function)
    - [Парадигмы программирования: ООП, Функциональное, Реактивное](#парадигмы-программирования-ооп-функциональное-реактивное)
    - [Принципы ООП](#принципы-ооп)
    - [SOLID](#solid)
    - [HTTP vs HTTPS](#http-vs-https)
  - [JS](#js)
    - [Итераторы и генераторы](#итераторы-и-генераторы)
    - [Способы получить и установить свойства в объекте. Дескрипторы свойств](#способы-получить-и-установить-свойства-в-объекте-дескрипторы-свойств)
    - [Разница между обычной и стрелочной функциями](#разница-между-обычной-и-стрелочной-функциями)
    - [Что такое лексическое окружение?](#что-такое-лексическое-окружение)
    - [Как изменить `this` в стрелочной функции?](#как-изменить-this-в-стрелочной-функции)
    - [Как мы можем установить значение свойства в объекте-прототипе?](#как-мы-можем-установить-значение-свойства-в-объекте-прототипе)
  - [Node](#node)
    - [Event Loop](#event-loop)
    - [Нода - однопоточная или многопоточная?](#нода---однопоточная-или-многопоточная)
    - [Утечки памяти в ноде](#утечки-памяти-в-ноде)
    - [Workers](#workers)
  - [React](#react)
    - [Pure Component](#pure-component)
    - [Controlled and Uncontrolled components](#controlled-and-uncontrolled-components)
    - [](#)

***

## Common Programming Concepts

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

***

### Парадигмы программирования: ООП, Функциональное, Реактивное

1. [Good article](https://dev.to/tamerlang/the-simple-guide-to-programming-paradigms-36o)
2. [Wiki](https://ru.wikipedia.org/wiki/Реактивное_программирование)

***

### Принципы ООП

Знать всегда.

***

### SOLID

1. [Отличная статья](https://web-creator.ru/articles/solid_the_open_closed_principle)

Аббревиатура, отражающая 5 принципов для построения масштабируемых приложений с использованием ООП:

- `S` - Single responsibility
- `O` - Open-closed
- `L` - Liskov *(surname)* substitution
- `I` - Interface segregation
- `D` - Dependency inversion

**NB**: Все перечисленные принципы не всегда нужно возводить в абсолют, возможны исключения. 
  
`S`: Объект/метод должен выполнять одну простую задачу, и эта задача должна быть инкапсулирована в класс. Следование этому принципу включает **декомпозицию сложных классов** на более простые узкоспециализированные, а также **объединение однотипной функциональности**, которая могла быть разбросана по разным классам, в отдельный класс. 

```ts
class News {
  constructor(
    public title: string,
    public text: string,
    public modified = false,
  ) { }

  update(text: string) {
    this.text = text;
    this.modified = true;
  }
}

class NewsFormatter {
  constructor(
    private readonly _news: News,
  ) { }

  html() {
    return `
    <div class="news">
      <h1>${this._news.title}</h1>
      <p>${this._news.text}</p>
    </div>
    `;
  }

  json() {
    return JSON.stringify({
      title: this._news.title,
      text: this._news.text,
      modified: this._news.modified,
    }, null, 2);
  }
}

const news = new News('The whale is saved', 'Great news, everyone! The whale is saved!');

const formatter = new NewsFormatter(news);

console.log(formatter.html());
console.log(formatter.json());
```

Adding `html()` and `json()` to the `News` class would be the violation of `S` because formatting isn't directly related to the news itself. 

---

`O`: Программные сущности - классы, модули, функции - должны быть открыты для расширения, но закрыты для изменения. Это позволяет сущностям **изменять свое поведение, не изменяя исходный код**. Новый функционал при этом добавляется посредством наследования, абстрактных интерфейсов и полиморфизма, а старый работающий код остается нетронутым. 

```ts
enum FIGURE_TYPE {
  SQUARE = 'square',
  CIRCLE = 'circle',
}

class Figure {
  constructor(
    public type: string,
  ) { }
}

class Square extends Figure {
  constructor(
    public size: number,
  ) {
    super(FIGURE_TYPE.SQUARE);
  }
}

class Circle extends Figure {
  constructor(
    public radius: number,
  ) {
    super(FIGURE_TYPE.CIRCLE);
  }
}

class AreaCalculator {
  constructor(
    private _figures: Figure[] = [],
  ) { }

  sum() {
    return this._figures.reduce((accum, figure) => {
      if (figure instanceof Square) {
        return accum += this.calcSquare(figure);
      }

      if (figure instanceof Circle) {
        return accum += this.calcCircle(figure);
      }

      throw new Error('Invalid figure type');
    }, 0);
  }

  private calcSquare(square: Square) {
    return square.size ** 2;
  }

  private calcCircle(circle: Circle) {
    return (circle.radius ** 2) * Math.PI;
  }
}

const calc = new AreaCalculator([
  new Circle(4),
  new Square(7),
  new Circle(3),
])

console.log(calc.sum()); // 127.53981633974483
```

If we need to add Rectangle logic, we cannot just add it to the existing AreaCalculator's `sum` method because it will be the violation of the Open-closed principle.

Instead, it's better to add a common `getArea()` method to the base class and make the clildren implement it their own way. 

We don't even need the `type` property this way (though we might still keep it for other purposes).

```ts
abstract class Figure {
  getArea(): number {
    throw new Error('This method should be implemented in the descendents');
  }
}

class Square extends Figure {
  constructor(
    public size: number,
  ) {
    super();
  }

  getArea(): number {
    return this.size ** 2;
  }
}

class Circle extends Figure {
  constructor(
    public radius: number,
  ) {
    super();
  }

  getArea(): number {
    return (this.radius ** 2) * Math.PI;
  }
}

class AreaCalculator {
  constructor(
    private _figures: Figure[] = [],
  ) { }

  sum() {
    return this._figures.reduce((accum, figure) => accum += figure.getArea(), 0);
  }
}

const calc = new AreaCalculator([
  new Circle(4),
  new Square(7),
  new Circle(3),
])

console.log(calc.sum()); // 127.53981633974483
```

---

`L`: При построении иерархий наследования, создаваемые наследники должны корректно реализовывать поведение базового типа. Наследник класса дополняет, но не заменяет поведение базового класса. То есть в любом месте программы замена базового класса на класс-наследник не должна сломать код, который работал ранее с базовым классом.

[Видос с объяснением](https://youtu.be/NqvwYcjrwdw)

Простыми словами:

- Классы-наследники должны предоставлять **не меньше функционала, чем базовый класс**. Т.е. если тебе нужно унаследовать от базового класса лишь некоторые его методы, **не переопределяй другие выкидыванием ошибок или `null`** - это непредсказуемое для других поведение! Кто-то когда-то будет использовать твой класс, думая, что раз он наследует от базового, то и базовый функционал у него есть, и столкнется с неприятностями.
- Подкласс не должен требовать от вызывающего кода больше, чем базовый класс. Например, в базовом классе ты можешь нормально вызвать какой-то метод, а в подклассе сначала надо делать какой-то `init()` до того, Как заюзать метод - это будет нарушением `L`. 

Исключения могут быть. Например, когда нужно мокнуть какой-то класс, и тебе реально не нужны все его методы. Тогда стоит написать комментарий о том, что `L` тут нарушается.

---

`Interface segregation`: Клиенты не должны зависеть от методов, которые они не используют. Т.е. изменение кода, не используемого клиентом, не должно ломать код, **используемый** клиентом. Это перекликается с `S`.

```ts
abstract class Animal {
  constructor(
    public name: string,
  ) { }

  walk() {
    console.log(`${this.name} can walk`);
  }

  fly() {
    console.log(`${this.name} can fly`);
  }

  swim() {
    console.log(`${this.name} can swim`);
  }
}

class Dog extends Animal { }
class Eagle extends Animal { }
class Whale extends Animal { }

const dog = new Dog('Doge');
const eagle = new Eagle('Feather');
const whale = new Whale('Fail');

dog.walk();
dog.swim();
dog.fly(); // shouldn't be here
```

Как ограничить возможность собаки летать? 

Плохой способ - переопределить ее метод `fly()`:

```ts
class Dog extends Animal {
  fly() {
    throw new Error("The dog can't fly");
  }
}
```

Хороший способ:

```ts

```

---

`D`: Модули верхних уровней не должны зависеть от модулей нижних уровней. Оба типа модулей должны зависеть от абстракций. Т.е. наверху должны быть базовые абстракции (абстрактные классы или интерфейсы), которые не должны подстраиваться под частности ниже по иерархии. 

***

### HTTP vs HTTPS

HTTPS - это защиенная версия HTTP, использующая протокол шифрования **TLS**. 

Используется **ассиметричное** шифрование:

- **секретный** ключ лежит на сервере
- **публичный** ключ доступен любому пользователю. Данные, зашифрованные им, могут быть расшифрованы лишь секретным ключом (лежащим на сервере).

При использовании HTTP, пакеты передаются в открытом виде, поэтому их легко можно перехватить и прочитать. При использовании HTTPS, пакеты передаются в зашифрованном виде, поэтому их перехват без наличия секретного ключа (который есть лишь у сервера) - бесполезен. 

Когда клиент заходит на страницу, сервер присылает ему свой Сертификат (**TLS certificate**), выданный Центром Сертификации (**Certificate Authority, CA**). Он представляет собой обертку вокруг твоего Открытого Ключа с подписью CA, типа нотариально заверенного ключа. Так клиент достоверно знает, что общается именно с тем сервером, который ожидает. Это обеспечивает защиту от **MITM** (man in the middle) атаки. 

После получения открытого ключа сервера, клиент использует его, чтобы шифровать свои сообщения для сервера (и лишь сервер имеет секретный ключ для их расшифровки). Клиент и сервер обмениваются некоторыми данными, это называется **TLS handshake** (рукопожатие). [Подробнее](https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/). В процессе рукопожатия, клиент и сервер вырабатывают т.н. **сеансовые ключи (session keys)** - уже на **симметричном** алгоритме шифрования. Когда рукопожатие завершено, дальнейшее общение с сервером происходит при помощи **именно этого ключа**. 

Многие хостинги и другие сервисы предоставляют Сертификаты. Часто они являются общими для множества сайтов (один сертификат на всех). Самый простой способ бесплатно получить Сертификат для своего сайта - [Let's Encrypt](https://letsencrypt.org)

***


## JS 

### Итераторы и генераторы

См. мой конспект в `JS/Async-Fetch-Generators` (07-10).

***

### Способы получить и установить свойства в объекте. Дескрипторы свойств

См. мой конспект в `JS/OOP` (02 и др.).

***

### Разница между обычной и стрелочной функциями

***

### Что такое лексическое окружение?

Совокупность всех переменных, доступных функции (т.е. все, что находится на ее уровне и выше, а также переданные параметры). 

Ответ можно улучшить.

***

### Как изменить `this` в стрелочной функции?

Никак, это невозможно. Стрелочная функция берет `this` из лексического окружения. Ей **никак** нельзя передать другой `this` - `call/apply/bind` не работают.

***

### Как мы можем установить значение свойства в объекте-прототипе? 

Никак, нельзя изменить ничего в прототипе, мы можем лишь читать значения из него.

***


## Node

### Event Loop

См. мой конспект в `Node/12.event-loop.md`.

***

### Нода - однопоточная или многопоточная?

См. мой конспект в `Node/12.event-loop.md` до конца.

***

### Утечки памяти в ноде

***

### Workers

См. мой конспект в `Node` (еще не написан).

***


## React

### Pure Component

1. [Source](https://medium.com/technofunnel/working-with-react-pure-components-166ded26ae48)

Similar to a Pure Function, it's a component that:

- doesn't re-render if the value of state and props has been updated **with the same values** (for higher performance).
- state and props are **shallow**-compared (which means changing the properties of the existing state object won't cause re-render - you should `{...state}` it).

One way of using them is to extend the `React.PureComponent` class - this way your component won't re-render if the state hasn't change:

Using standard hooks makes pure components.

***

### Controlled and Uncontrolled components

See the `Controlled and Uncontrolled components` chapter in the first React lesson.

***

### 
