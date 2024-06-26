import "./index.scss";

interface Data {
  a: number;
  b: string;
  c: boolean;
}

const data: Data = {
  a: 1,
  b: "2",
  c: true,
};

console.log("data:", data);

const app: HTMLElement = document.querySelector("#app")!;

const p: HTMLParagraphElement = document.createElement("p");

p.textContent = "我是动态创建的p标签";
p.classList.add("orange_font");

app.appendChild(p);

type GetTotal = {
  (a: number, b: number): number;
};

const getTotal: GetTotal = (a, b) => {
  return a + b;
};

function getTotalb(a: string, b: string): string {
  return a + b;
}

console.log("number total:", getTotal(1, 2));
console.log("string total:", getTotalb("a", "b"));

// 面试题目

// 数据实例
interface Example {
  a: String;
  b: Number;
  c: () => void;
}

// 1. 实现Pick<T, K>
type MyPick<T, K extends keyof T = keyof T> = {
  [P in K]: T[P];
};

type MyPickResult = MyPick<Example, "a" | "c">;

const pickObj: MyPickResult = {
  a: "aaa",
  c: () => {
    return 123;
  },
};

const pickObj2: Pick<Example, "a" | "c"> = {
  a: "a22",
  c: () => 123,
};

console.log(pickObj2.c());

// tips： Pick不能对函数类型进行具体的限制
// Pick 是用来选择对象类型的属性的，而不是用来限制函数类型的。函数类型不是对象类型的属性，而是对象类型值的一部分

// 2. 实现Readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

const readonlyExample: Readonly<Example> = {
  a: "readonly",
  b: 222,
  c: () => 123,
};

// readonlyExample.a = 'ddd' //不能允许赋值，只可以读

// 3. 将数组转换为对象
const tuple = ["tesla", "model 3", "model X", "model Y"] as const;

type arrToObje<T extends readonly any[]> = {
  [P in T[number]]: P;
};

type tupleType = typeof tuple;

type Flatten<T> = T extends readonly any[] ? T[number] : T;
type Str = Flatten<tupleType>;

type tupleObj = arrToObje<tupleType>;

// T[number] 获取数组的值的类型

// 第一个元素First<T>
type arr1 = ["a", "b", "c"];
// type First<T extends any[]> = T['length'] extends 0 ? never : T[0];
type First<T extends any[]> = T extends [] ? never : T[0];

type FirstElement = First<arr1>;

// 装饰器

/**
 * @desc 类装饰器
 * @param {Function} target
 */

// declare type ClassDecorator = <TFunction extends Function>(
//   target: TFunction
// ) => TFunction | void;

function Greeter(target: Function): void {
  target.prototype.greet = function (): void {
    console.log("Hello Semlinker!");
  };
}

@Greeter
class Greeting {
  [x: string]: any;

  constructor() {
    // 内部实现
  }
}

let myGreeting = new Greeting();
myGreeting.greet();
console.log(myGreeting);


/**
 * @desc 属性装饰器
 * @param {Object} target class.prototype
 * @param {String} key 属性
 */
function logProperty(target: any, key: string) {
  console.log('属性装饰器target', target);
  delete target[key];

  const backingField = "_" + key;

  Object.defineProperty(target, backingField, {
    writable: true,
    enumerable: true,
    configurable: true,
  });

  // property getter
  const getter = function (this: any) {
    const currVal = this[backingField];
    console.log(`Get: ${key} => ${currVal}`);
    return currVal;
  };

  // property setter
  const setter = function (this: any, newVal: any) {
    console.log(`Set: ${key} => ${newVal}`);
    this[backingField] = newVal;
  };

  // Create new property with getter and setter
  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

class Person {
  @logProperty
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const p1 = new Person("semlinker");
p1.name = "kakuqo";


/**
 * @desc 方法装饰器
 * @param {Object} target class.prototype
 * @param {String} key 属性名
 * @param {Object} descriptor 描述属性
 */
function LogOutput(
  target: any,
  key: string,
  descriptor: TypedPropertyDescriptor<any>
) {
  const originalMethod = descriptor.value;

  console.log(target, "Target");

  descriptor.value = function (...args: any[]): any {
    // 如果实例上没有loggedOutput属性，则初始化它
    if (!this.loggedOutput) {
      this.loggedOutput = [];
    }

    const result = originalMethod.apply(this, args);

    this.loggedOutput.push({
      method: key,
      parameters: args,
      output: result,
      timestamp: new Date(),
    });

    return result;
  };
}

class Calculator {
  [x: string]: any;
  // 不需要在这里初始化loggedOutput，它将在装饰器中处理

  constructor(name: string) {
    this.name = name;
  }

  @LogOutput
  double(num: number): number {
    return num * 2;
  }
}

let calc = new Calculator("小花");
calc.double(11);

// 输出应该是包含日志信息的数组
console.log(calc.loggedOutput); // 输出类似: [{method: "double", parameters: [11], output: 22, timestamp: ...}]
console.log(Calculator.prototype);


/**
 * @desc 参数装饰器
 * @param {Function} target class
 * @param {String} key 类名
 * @param {Number} parameterIndex 参数的索引
 */
function Log(target: Function, key: string, parameterIndex: number) {
  console.log(target);
  let functionLogged = key || target.prototype.constructor.name;
  console.log(`The parameter in position ${parameterIndex} at ${functionLogged} has
  been decorated`);
}

class Greeterb {
  greeting: string;
  constructor(@Log phrase: string) {
    this.greeting = phrase;
  }
}

new Greeterb('xxxx');

// 接口和类型别名
interface A {
  a: number,
  b: string,
  c: boolean
}

type B = {
  a: number,
  b: number,
  d: number
}

// 联合类型
type C = A | B;

const c: C = {
  a: 10,
  b: 'aaa',
  c: true
}

// 交叉类型
interface E {
  a: number,
  c: boolean
}

type F = {
  a: number,
  d: number
}

type D = E & F;

const d: D = {
  a: 10,
  c: true,
  d: 20
}

// type 和 interface 的区别
// 1. type 和 interface 都可以声明函数和对象类型；
type Point = {
  x: number,
  y: number
}

type SetPoint = (x: number, b: number) => Point;

interface Point2 {
  x: number;
  y: number;
}

interface SetPoint2 {
  (x: number, y: number): Point2
}

// 2. type 还可以声明原始类型，联合类型，元祖类型
type Name = string;
type Sex = 'man' | 'woman';
type tuple = [string, number];

// 3. 都可以被扩展
type Persons = {
  name: string,
  age: number
}

type Student = Persons & {
  class: string,
  no: number
}

interface Teacher extends Persons {
  class: string;
  work: string;
}

const student: Student = {
  name: '小花',
  class: '五年级一班',
  no: 10,
  age: 12
}

const teacher: Teacher = {
  name: '王老师',
  class: '五年级一班',
  work: '语文',
  age: 12
}

interface Cars {
  type: 'car' | 'bicycle' | 'motorcycle',
  cost: number
}

interface Bicycle extends Cars {
  hasBox: boolean
}

type Motorcycle = Cars & {
  speed: number;
}

const bicycle: Bicycle = {
  type: 'bicycle',
  hasBox: true,
  cost: 200
}

const motorcycle: Motorcycle = {
  type: 'motorcycle',
  cost: 5000,
  speed: 200
}

// 4. Implements
// 类可以以相同的方式实现接口或类型别名，但类不能实现使用类型别名定义的联合类型；
class DjMotorcycle implements Motorcycle {
  // type: 'car' | 'bicycle' | 'motorcycle';
  // cost: number;
  // speed: number;

  type: 'bicycle';
  cost: 5000;
  speed: 200;
  

  constructor() {
    // this.type = 'motorcycle';
    // this.cost = 5000;
    // this.speed = 200;
  }

  jiao() {
    console.log('跑起来嘎嘎快');
  }
}

class DjBicycle implements Bicycle {
  // type: 'car' | 'bicycle' | 'motorcycle';
  // cost: number;
  // speed: number;

  type: 'bicycle';
  cost: 5000;
  hasBox: true;
  

  constructor() {
    // this.type = 'bicycle';
    // this.cost = 5000;
    // this.speed = 200;
  }

  jiao() {
    console.log('跑起来嗖嗖快');
  }
}

// 5. 接口可以多次定义，会自动合并
interface Killer {
  sex: String
}

interface Killer {
  age: Number
}

const killer: Killer = {
  sex: 'man',
  age: 30
}

// declare 全局声明的类型
const globalData: GlobalData = {
  statu: 200,
  data: [1,2,3],
  msg: 'ok'
}