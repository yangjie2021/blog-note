## 类型系统
1. 强类型与弱类型（类型安全）
- 强类型：实参类型 === 形参类型
- 强类型语言中不**允许任意的隐式类型转换**，弱类型语言允许
- 变量类型允许随时改变的特点并不是强弱类型的差异

2. 静态类型与动态类型（类型检查）
- 静态类型语言，一个变量声明时类型就是明确的，并且声明过后不允许修改
- 动态类型语言，在运行阶段才能明确变量类型，变量类型可以随时发生变化
- 动态类型语言中，变量没有类型，变量中存放的值是有类型的

3. Javascript自有类型系统的问题：Javascript是一个动态类型且弱类型的语言，早前的js应用简单，没有编译环节。但是在大规模应用中，弱类型的优势就变成了短板

4. 弱类型的问题
- 使用了对象上不存在的属性/方法
- 实参和形参类型不匹配，造成函数功能发生改变
- 隐式转换（对象的索引类型），导致使用时的错误用法

5. 强类型的优势
- 错误更早暴露
- 代码更智能，编码更准确
- 重构更牢靠
- 减少不必要的类型判断

## TypeScript
1. 简介：
TypeScript是JavaScript的超集，TypeScript = Javascript + 类型系统 + ES2015+，ts最终编译会成Javascript,最低可以编译到ES3版本，任何js环境都支持ts开发。
2. 优点：
   1. 程序更容易理解
   2. 效率更高：不同代码块定义跳转，自动补全，接口提示
   3. 功能更加强大：编译时的强类型判断，杜绝比较常见的错误
   4. 非常好的兼容性：兼容Javascript，react，vue等流行框架都支持
   5. 生态更健全、更完善，对开发工具的支持更友好，Anuglar/Vue.js 3.0等知名框架都在使用
   6. 适合长周期的大型项目
3. 缺点：
   1. 学习成本高：语言本身多了很多概念（类，接口，枚举，泛型）等，但是好在ts是渐进式的，可以向下兼容
   2. 不适合中小型项目，Ts会增加一些成本
## 数据类型
### 基本数据类型
1. 布尔值(boolean): true/false
```javascript
let isBoolean: boolean = false
console.log('布尔类型', isBoolean) // false
```

2. 数字(number)：浮点数（二进制，八进制，十进制，十六进制的数值）
```javascript
let num1: number = 6
let num2: number = 0xf00d
let num3: number = 0b1010
let num4: number = 0o744
let num5: number = NaN
let num6: number = Infinity

console.log('数字',num1, num2, num3, num4)//6 61453 10 484
```

3. 字符串（string）：文本数据类型
```javascript
let name: string = "sunshine"
let f: string = `Hello, my name is ${name}`
console.log('字符串', f) // Hello, my name is sunshine
```

4. 数组（array）：两种定义方式，元素类型[ ] 或 Array<元素类型>
```javascript
let list1: Array<number> = [1, 2, 3]
let list2: number[] = [1, 2, 3]
console.log('数组', list1, list2) // [1, 2, 3][1, 2, 3]

// 案例-求和函数
// 如果是 JS，需要判断是不是每个成员都是数字
// 使用 TS，类型有保障，不用添加类型判断
function sum (...args: number[]) {
  return args.reduce((prev, current) => prev + current, 0)
}

sum(1, 2, 3) // => 6
```

5. null和undefined：默认是所有类型的子类型，但是在严格模式下(指定--strictNullChecks标记等)，null和undefined只能赋值给void和它们各自。
```javascript
let u: undefined = undefined; // if `--strictNullChecks` is not given
let n: null = null;
console.log(u, n)
```

6. Object:非原始类型,除了基本类型之外的变量或函数都可以使用object类型
```javascript
const fn: object = function() {}
const obj: { a: number, b: string } = { a: 1, b: '111' }
```

7. Symbol：表示独一无二的值，它和字符串的区别是，它不可以和其他类型的值进行运算，但是可以转为字符串和布尔值类型。注意：tsconfig 
```javascript
const h: symbol = Symbol()
```

### ts新增类型
8. 元组（Tuple）
- 数组的拓展，表示已知元素数量和类型的数组
- 通过 let a:[number,string] 方式定义
- 各个位置上的元素类型都要对应，元素个数也要一致
```javascript
let tuple: [string, number]
tuple = ['hello', 10]
console.log('元组', tuple) // ["hello", 10]

// 使用场景：Object.entries获取对象数组时，得到的结果类型也是元组类型
const entries: [string, number][] = Object.entries({
  foo: 123,
  bar: 456
})

const [key, value] = entries[0]
// key => foo, value => 123
```

9.枚举（enum）：定义一组角色，每一个角色用一个数字代表，从0开始编号
- 数值枚举存在索引递增机制：如果给其中属性默认值，下面的其它属性值会累加
```javascript
enum Status {
  success = 200, //字面量||常量
  error,
  notFound = 400,
  accepted
}
console.log(Status)
console.log(Status['success'], Status[200]) //反向映射

```
- 枚举成员可以作为类型使用

```javascript
enum Foods {
  cake = 20,
  meal = 30
}
let local1:{ arg1: Foods.cake , arg2: Foods.meal } = { arg1:18, arg2: 20 }
console.log(local1)
```

- 枚举作为函数参数使用

```javascript
enum Letter {
  A,
  B = 'haha'
}
const getIndex = (enumObj:{A:number, B:string}): string => {
  return enumObj.A + '-' + enumObj.B
}
console.log(getIndex(Letter))
```
- 枚举经常用来做状态值标记等功能
- 枚举类型会入侵到运行时代码, 编译结果会编译成一个双向的键值对对象，如果不需要通过索引器访问属性值，就在enum前加上const（问：const enum 和 enum 的区别是什么？）
```javascript
const enum PostStatus {
  Draft,
  Unpublished,
  Published
}

const post = {
  title: 'Hello TypeScript',
  content: 'TypeScript is a typed superset of JavaScript.',
  status: PostStatus.Draft // 3 // 1 // 0
}
```

10. any: 任意的，不清楚类型的变量类型
- 可以用来兼容老项目
- 存在类型安全问题，不要滥用
```javascript
function stringify (value: any) {
  return JSON.stringify(value)
}
stringify('string')
stringify(100)
stringify(true)
```

11. void
-   与any类型相反，它表示没有任何类型
-   定义函数，函数没有返回值时会用到
-   void类型的变量只能赋值给undefined和null，其他类型不能赋值给void类型的变量

```javascript
let text = '000'
const setValue = (text:string):void => {
  console.log(text)
  return null
}
setValue('111')
```
12. never：永不存在的值的类型，是任何类型的子类型，除它自身外的任何类型都不能赋值给never类型

```javascript
const errorFunc = (message:string):never => {
  throw new Error(message)
}
const infiniteFunc = ():never => {
  while (true) {}
}
```



## 类型拓展

1. 交叉类型
- 多个类型的并集，使用 & 符号定义
- 类型同时具备连接起来的类型的特性
```javascript
const merge = ( arg1:{name:string}, arg2:{age:number} ): {name:string} & {age:number} =>{
  let res = Object.assign(arg1, arg2)
  return res
}
const data = merge({name:'sunshine'},{age:18})
console.log(data) // {name: "sunshine", age: 18}
```

2. 联合类型
- 几个类型的结合，使用 | 符号定义
- 只要符合任意一种类型即可

```javascript
const getStringLength = ( content:string | number ):number => {
  if(typeof content === 'string'){
    return content.length
  }
  else return content.toString().length
}
console.log(getStringLength('abc')) // 3
console.log(getStringLength(123)) // 3
```

4. 类型索引
```typescript
const getProp = <T, K extends keyof T>(object: T, propName: K) => {
  return object[propName];
};
const obj = { a: "aa", b: "bb" };
getProp(obj, 'c'); // 类型"c"的参数不能赋给类型“"a" | "b"”的参数
```

5. 类型断言(as 类型 或 <类型>)

```typescript
const getStrLength = (target: string | number): number => {
  if ((<string>target).length) {
    return (target as string).length
  } else {
    return target.toString().length
  }
})

console.log(getStrLength(123))
console.log(getStrLength('123'))

// 绕开多余属性检查
interface NameInfo {
  firstName: string
  lastName?: string // 可选属性
}
const getFullName = ({ firstName, lastName }: NameInfo) =>
  `${firstName} ${lastName ? lastName : ''}`
let name = getFullName({ firstName: 'sunshine'})
console.log(name)

let name2 = getFullName({ 
  firstName: 'sunshine', 
  age: 18
  } as NameInfo) //类型断言
console.log(name2)
```

## 接口和别名
### 接口
1. 定义：接口就是用来约束对象结构的契约，一个对象实现一个接口，就必须拥有接口的所有成员
- 作用：在代码中或者项目外部定义代码的强大方式，解决多人协作时代码规范问题
```javascript
interface NameInfo {
  firstName: string;
  lastName?: string; // 可选属性
}
const getFullName = ({ firstName, lastName }: NameInfo) =>
  `${firstName} ${lastName ? lastName : ''}`
let name = getFullName({ firstName: 'sunshine'})
console.log(name)
```

2. 只读成员、可选成员、动态成员
- 只读成员：readonly VS const：readonly保证对象的属性值不可修改，const保证一个常量指针不可修改
```javascript
interface Role {
  readonly name: object
}
const info:Role = {
  name: {'admin':'111'}
}
info['name'] = 'aaa' // 不能重复赋值

// const
const names:string = '111'
names = '222' // Cannot assign to 'names' because it is a constant
```
- 可选成员
```javascript
interface Post {
  title: string
  content: string
  subtitle?: string
  readonly summary: string
}

const hello: Post = {
  title: 'Hello TypeScript',
  content: 'A javascript superset',
  summary: 'A javascript'
}
```
- 动态成员
```javascript
interface Cache {
  [prop: string]: string
}

const cache: Cache = {}

cache.foo = 'value1'
cache.bar = 'value2'
```

3. 接口的继承
```javascript
interface Cake {
  kinds: Array<number | string>;
}
interface Meal {
  info: string;
}
interface Food extends Cake, Meal{
  people: number;
}
const finish: Food = {
  info: "vegetables",
  kinds: ['red',1],
  people: 2
};  
console.log(finish)
```

4. 混合类型接口
```javascript
interface Counter {
  (): void; 
  count: number; 
}
const getCounter = (): Counter => { 
  const c = () => {
    c.count++;
  };
  c.count = 0;
  return c;
};
const counter: Counter = getCounter();
counter();
counter();
console.log(counter.count);
```

### 别名
- 给类型创建一个引用方式 ，使用type关键字定义
1. 定义泛型
```javascript
type PositionType<T> = { x:T; y:T }
const position1: PositionType<number> = {
  x:1,
  y:-1
}
const position2: PositionType<string> = {
  x: 'right',
  y: 'top'
}
console.log(position1, position2)
```

2. 引用自己
```javascript
type Child<T> = {
  current: T;
  child?: Child<T>
}
let ccc: Child<string> = {
  current: 'first',
  child: {
    current: 'second',
    child: {
      current: 'third',
      // child: 'test' 
    }
  }
}
console.log(ccc)
```

### 接口 VS 别名(Type Aliases)
#### 相同点
- 都可以定义一个对象或函数
```typescript
interface User {
  name: string
  age: number
}
 
interface SetUser {
  (name: string, age: number): void;
}

type User = {
  name: string
  age: number
};
 
type SetUser = (name: string, age: number): void;
```

#### 别名可以但是接口不可以
1. type 可以声明基本类型别名，联合类型，元组等类型
```typescript
// 基本类型别名
type Name = string
 
// 联合类型
interface Dog {
    wong();
}
interface Cat {
    miao();
}
 
type Pet = Dog | Cat

//交叉类型
type Pet = Dog & Cat
 
// 具体定义数组每个位置的类型
type PetList = [Dog, Pet]
```

2. type 语句中还可以使用操作符 typeof & keyof
- typeof 操作符获取一个变量声明或对象的类型
```typescript
// 获取对象类型
let div = document.createElement('div')
type B = typeof div

// 获取函数类型
function toArray(x: number): Array<number> {
  return [x]
}
type Func = typeof toArray // -> (x: number) => number[]
let fn: Func = function (value: number): number[] {
  return [1,2]
}

// 获取某种类型的所有键
const colors = {
  red: '1',
  blue: '2'
}

// 首先通过typeof操作符获取Colors变量的类型，然后通过keyof操作符获取该类型的所有键，
// 即字符串字面量联合类型 'red' | 'blue'
type Colors = keyof typeof colors
let color: Colors = 'yellow' // error
```

#### 接口可以但是别名不可以
1. interface 能够声明合并
```typescript
interface User {
  name: string
  age: number
}
 
interface User {
  sex: string
}
 
/*
User 接口为 {
  name: string
  age: number
  sex: string 
}
*/
```

2. interface 可以使用 extends 关键字
```typescript
interface A {
  a: string
}

interface B extends A {
  b: number
}
```

## 类：描述一类具体事物的抽象特征
1. 基本使用
```typescript
class Person {
  name: string // = 'init name'
  age: number
  
  constructor (name: string, age: number) {
    this.name = name
    this.age = age
  }

  sayHi (msg: string): void {
    console.log(`I am ${this.name}, ${msg}`)
  }
}
```

2. 成员的访问修饰符（关键字）
- public：公共的，类定义的外部可以访问的属性和方法
- private：私有的，标记的属性在类的定义外面无法访问到，在继承的子类中也没法访问
- protected：受保护的，和private的不同是修饰的成员在继承该类的子类中可以访问
- readonly：设置只读的属性不可更改（ps：接口的readonly属性需要实现后才能使用）
- static（ES2015原有）：静态属性，不会添加到实例上，也不会继承这个静态方法

```typescript
class Ancestor {
  public name: string;
  public static alias: string;
  private sex: string;
  protected age: number;
  readonly size: number;
  constructor(name: string, sex: string, age: number) {
    this.name = name;
    this.sex = sex;
    this.age = age;
  }
}

class Parent extends Ancestor {
  constructor(name: string, sex: string, age: number, size?:number) {
    super(name,sex,age);
    sex = this.sex // 私有属性不可继承
    age = this.age // 受保护属性可以继承
  }
}
class Child extends Parent {
  constructor(name: string, sex: string, age: number) {
    super(name,sex,age);
  }
}
const parent = new Parent('sunshine', 'female', 23, 120)
const child = new Child('colorful', 'male', 31)
console.log(parent.sex, parent.age) // 私有和只读属性外部不可访问
parent.size = 130 // 只读属性不可更改
console.log(child.alias) //静态属性实例不可访问
console.log(Ancestor.alias) //静态属性类可以访问
console.log(parent,child)
```

3. 实现es6的存取器
```typescript
class UserInfo {
  private _fullName: string;
  constructor() {}
  get fullName() {
    return this._fullName;
  }
  set fullName(value) {
    console.log(`setter: ${value}`);
    this._fullName = value;
  }
}
const user = new UserInfo();
user.fullName = "Lison Li"; // "setter: Lison Li"
console.log(user.fullName); // "Lison Li"
```

4. 类和接口
- 类实现接口
```typescript
interface Eat {
  eat (food: string): void
}

interface Run {
  run (distance: number): void
}

class Person implements Eat, Run {
  eat (food: string): void {
    console.log(`优雅的进餐: ${food}`)
  }

  run (distance: number) {
    console.log(`直立行走: ${distance}`)
  }
}

class Animal implements Eat, Run {
  eat (food: string): void {
    console.log(`呼噜呼噜的吃: ${food}`)
  }

  run (distance: number) {
    console.log(`爬行: ${distance}`)
  }
}
```

- 接口继承类
```javascript
class A {
  name: string;
}
interface B extends A {
  getName(): void
}
class C extends A implements B {
  name = '111'
  getName() {
    return this.name
  }
}
let aaa = new C()
console.log(aaa.getName())
```

5. 抽象类：实现类的一种接口，**只能用来继承，不能实例化（new）**
- 抽象类和接口的区别：**抽象类有实现，接口是纯定义**
```typescript
abstract class People {
  constructor(public name: string) {}
  abstract printName(): void;
}
class Man extends People {
  constructor(name: string) {
    super(name);
    this.name = name;
  }
  printName() {
    console.log(this.name);
  }
}
const man = new Man("lison");
man.printName(); // 'lison'
```
- 类继承抽象类
```typescript
abstract class FoodAbstractClass {
  abstract type: string;
}
class Food extends FoodAbstractClass {
  constructor(public type: string) {
    super();
  }
}
```

## 泛型
软件工程中，我们不仅要创建一致的定义良好的 API，同时也要考虑**可重用性**。组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。

在像 C# 和 Java 这样的语言中，可以使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据。这样用户就可以以自己的数据类型来使用组件。

设计泛型的关键目的是在**成员之间提供有意义的约束**，这些成员可以是：类的实例成员、类的方法、函数参数和函数返回值。

### 使用场景
- 当你的函数、接口或类将处理多种数据类型时；
- 当函数、接口或类在多个地方使用该数据类型时。

### 基本使用
- 定义在函数、接口或类的时候，不预先指定的类型，而是在指定类型时候使用的一种特性，节省代码的使用   
- 解决强类型语言，将多种类型方法抽象为一个方法
- 使用 <> 符号定义一个泛型变量

```typescript
const merge = <T,U>(arg1:T, arg2:U): T & U =>{
  let res = <T & U>{}
  res = Object.assign(arg1, arg2)
  return res
}
const data = merge({name:'sunshine'}, {age:18})
console.log(data) // {name: "sunshine", age: 18}
```

### 泛型接口：用于返回多种类型的对象
```typescript
interface Identities<V, M> {
  value: V,
  message: M
}

function identity<T, U> (value: T, message: U): Identities<T, U> {
  console.log(value + ": " + typeof (value));
  console.log(message + ": " + typeof (message));
  let identities: Identities<T, U> = {
    value,
    message
  };
  return identities;
}

console.log(identity(68, "Semlinker"))
// 68: number
// Semlinker: string
// {value: 68, message: "Semlinker"}
```

### 泛型类：泛型类可确保在整个类中一致地使用指定的数据类型
- 在实例化 IdentityClass 对象时，我们传入 Number 类型和构造函数参数值 68;
- 之后在 IdentityClass 类中，类型变量 T 的值变成 Number 类型;
- IdentityClass 类实现了 GenericInterface<T>，而此时 T 表示 Number 类型，因此等价于该类实现了 GenericInterface<Number> 接口；
- 而对于 GenericInterface < U > 接口来说，类型变量 U 也变成了 Number
```typescript
interface GenericInterface<U> {
  value: U
  getIdentity: () => U
}

class IdentityClass<T> implements GenericInterface<T> {
  value: T

  constructor(value: T) {
    this.value = value
  }

  getIdentity(): T {
    return this.value
  }
  
  // 创建对象
  create<T>(c: { new (): T }): T {
    return new c();
  }
}

const myNumberClass = new IdentityClass<Number>(68);
console.log(myNumberClass.getIdentity()); // 68

const myStringClass = new IdentityClass<string>("Semlinker!");
console.log(myStringClass.getIdentity()); // Semlinker!
```

### 泛型约束
1. 约束属性，确保属性存在
- 类型继承：当定义的泛型不想过于灵活或者说想继承某些类时，可以通过 **extends** 关键字添加泛型约束 
- A extends B 等价于 A >= B
- 尽管使用了 extends 关键字，也不一定要强制满足继承关系，而是检查是否满足结构兼容性，因为ts里的extends是用来结构是否一致的。
```typescript
interface ILengthwise {
  length: number;
}

function loggingIdentity<T extends ILengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

loggingIdentity(3);  // Error, number doesn't have a .length property
// 必须包含必须的属性(length)
loggingIdentity({length: 10, value: 3})
```

2. 检查对象上的键是否存在
- keyof 操作符是在 TypeScript 2.1 版本引入的，该操作符可以用于获取某种类型的所有键，其返回类型是联合类型
```typescript
interface Person {
  name: string;
  age: number;
  location: string;
}

type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[];  // number | "length" | "push" | "concat" | ...
type K3 = keyof { [x: string]: Person };  // string | number
```
- 关于{ [x: string]: Person }可索引类型的说明：https://www.typescriptlang.org/docs/handbook/interfaces.html#indexable-types
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94d6996506b0477c86dfb95796c7a336~tplv-k3u1fbpfcp-zoom-1.image)
如果索引类型为 number，那么实现该接口的对象的属性名必须是 number 类型；但是如果接口的索引类型是 string 类型，那么实现该接口的对象的属性名设置为数值类型的值也是可以的，因为数值最后还是会先转换为字符串
- 0（number）可以转换为"0"（string），"x"（string）不能转换为x（number）
2. 获取一个属性的所有键
```typescript
type Todo = {
  id: number;
  text: string;
  done: boolean;
}

const todo: Todo = {
  id: 1,
  text: "Learn TypeScript keyof",
  done: false
}

// 暴力方案
function prop(obj: object, key: string) {
  return (obj as any)[key];
}

// keyof方案
function prop<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const id = prop(todo, "id"); // const id: number
```

### 泛型参数默认类型
- 泛型参数默认类型与普通函数默认值类似，对应的语法很简单，即 <T=Default Type>
```typescript
interface A<T=string> {
  name: T;
}

const strA: A = { name: "Semlinker" };
const numB: A<number> = { name: 101 };
```
泛型参数的默认类型遵循以下规则：
- 有默认类型的类型参数被认为是可选的。
- 必选的类型参数不能在可选的类型参数后。
- 如果类型参数有约束，类型参数的默认类型必须满足这个约束。
- 当指定类型实参时，你只需要指定必选类型参数的类型实参。未指定的类型参数会被解析为它们的默认类型。
- 如果指定了默认类型，且类型推断无法选择一个候选类型，那么将使用默认类型作为推断结果。
- 一个被现有类或接口合并的类或者接口的声明可以为现有类型参数引入默认类型。
- 一个被现有类或接口合并的类或者接口的声明可以引入新的类型参数，只要它指定了默认类型。

### 泛型条件类型
条件类型会以一个条件表达式进行类型关系检测，从而在两种类型中选择其一, 在条件类型表达式中，我们通常结合 infer 关键字，实现类型抽取.
- **infer** 声明一个类型变量并且对它进行使用
- 声明一个变量来承载传入函数签名的返回值类型，简单说就是用它取到函数返回值的类型方便之后使用
- 尽管使用了 extends 关键字，也不一定要强制满足继承关系，而是检查是否满足结构兼容性。ts里的extends判断是结构一致。
```typescript
interface Dictionary<T = any> {
  [key: string]: T;
}
 
type StrDict = Dictionary<string>
type DictMember<U> = U extends Dictionary<infer V> ? V : never
type StrDictMember = DictMember<StrDict> // string

// StrDict T = string 
// let V = T = string
// DictMember<T> = string

interface X<T> {
  name: T;
}
 
type StrDict = X<string>
type StrDictMember = DictMember<StrDict> // never

```
> 没有类型是 never 的子类型或可以赋值给 never 类型（除了 never 本身之外）。即使 any 也不可以赋值给 never。没有类型是 never 的子类型或可以赋值给 never 类型（除了 never 本身之外）。即使 any 也不可以赋值给 never

- 获取 Promise 对象的返回值类型
```typescript
async function stringPromise() {
  return "Hello, Semlinker!";
}

type PromiseType<T> = (args: any[]) => Promise<T>;
type UnPromisify<T> = T extends PromiseType<infer U> ? U : never;
type extractStringPromise = UnPromisify<typeof stringPromise>; // string 
// typeof stringPromise = Promise<string>
// UnPromisify<T> = UnPromisify<Promise<string>>
// PromiseType<infer U> = PromiseType<T> = Promise<T>
// 因为Promise<string>与Promise<T>结构相似，所以 let U = T = string

type extractStringPromise = UnPromisify<string>; // never 
```

### 泛型工具类型
1.  **Partial** 可选类型转换
```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```
- Partial<T> 的作用就是将某个类型里的属性全部变为可选项 ?
- 首先通过 keyof T 拿到 T 的所有属性名，然后使用 in 进行遍历，将值赋给 P，最后通过 T[P] 取得相应的属性值。中间的 ? 号，用于将所有属性变为可选
- 示例：
```typescript
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});

updateTodo(todo1, todo2)

// fieldsToUpdate: Partial<Todo>等价于
{
   title?: string | undefined;
   description?: string | undefined;
}
```
2. Record
- Record<K extends keyof any, T> 的作用是将 K 中所有的属性的值转化为 T 类型
```typescript
// 定义
type Record<K extends keyof any, T> = {
  [P in K]: T;
};


// 示例
interface PageInfo {
  title: string;
}

type Page = "home" | "about" | "contact";

const x: Record<Page, PageInfo> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" }
};
```

3. ==Pick==
- Pick<T, K extends keyof T> 的作用是将某个类型中的子属性挑出来，变成包含这个类型部分属性的子类型。
```typescript
// 定义
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// 示例
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false
};
```

4. Exclude
- Exclude<T, U> 的作用是将某个类型中属于另一个的类型移除掉
- 定义:  T 能赋值给 U 类型的话，那么就会返回 never 类型，否则返回 T 类型。最终实现的效果就是将 T 中某些属于 U 的类型移除掉
```typescript
// 定义
type Exclude<T, U> = T extends U ? never : T;

// 示例
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | numbe
```

5. ReturnType
- ReturnType<T> 的作用是用于获取函数 T 的返回类型。
```typescript
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

type T0 = ReturnType<() => string>; // string
type T1 = ReturnType<(s: string) => void>; // void
type T2 = ReturnType<<T>() => T>; // {}
type T3 = ReturnType<<T extends U, U extends number[]>() => T>; // number[]
type T4 = ReturnType<any>; // any
type T5 = ReturnType<never>; // any
type T6 = ReturnType<string>; // Error
type T7 = ReturnType<Function>; // Error
```

## 函数
1. 函数的定义
- 演示：https://stackblitz.com/edit/typescript-function-define
- 接口定义函数

```javascript
interface Add {
  (x: number, y: number): number
}
let add:Add = (n1: number, n2: number): number => n1+n2
console.log(add(1,2))
```
- 类型别名定义函数
```javascript
type Sub = (x: number, y: number) => number
let sub: Sub = (n1: number, n2: number): number => n1-n2
console.log(sub(3,2))
```
- 泛型定义函数

```javascript
function getMin<T>(arr: T[]): T {
  var min = arr[0];
  arr.forEach(val => {
    if (val < min) {
      min = val;
    }
  });
  return min;
}
console.log(getMin(["12", 10, 8, 2, 4]));
```

2. 函数参数：可选参数、默认参数、剩余参数
```javascript
type Plus = (x: number, y:number, z?: number, ...args:number[]) => number
const plus:Plus = (x:number, y:number = 2, z?: number, ...args:number[]):number => {
  return x + y + (z ? z : 0) + eval(args.join("+"))
}
console.log(plus(1,2,3,4,5))
```

3. 函数重载（案例: vue-property-decorator的Mixins）
- js中的函数重载：定义几个同名实体函数，然后根据不同的参数个数或类型来自动调用相应的函数。JavaScript 并没有真正意义上的重载，但是重载的效果在JavaScript中却非常常见。比如：数组的splice()方法，一个参数可以删除，两个参数可以删除一部分，三个参数可以删除完了，再添加新元素。 再比如：parseInt( )方法 传入一个参数，就判断是用十六进制解析，还是用十进制解析，如果传入两个参数，就用第二个参数作为数字的基数，来进行解析。
- TypeScript 中函数重载的概念是在类型系统层面的，是为了更好地进行类型推断。TypeScript的函数重载通过为一个函数指定多个函数类型定义，从而对函数调用的返回值进行检查。

```javascript
function handleData(x: string): string[];
function handleData(x: number): string;
function handleData(x: any): any{
  if (typeof x === 'string') {
    return x.split("")
  } else {
    return x
      .toString()
      .split('')
      .join('_')
  }
}
let arr = handleData('abc').join('_')
console.log(arr)
```

## 注解
- 演示：https://stackblitz.com/edit/typescript-function-annotation
- 注解能够作用于类声明、方法、访问符、属性和参数上，使用 @函数名 方式定义
- 注解要紧挨着要修饰的内容的前面，并且不能用在声明文件(.d.ts)中，和外部上下文(declare)中。
- 注解工厂和注解组合：
  - 注解工厂：从上到下依次执行，但是只是用于返回函数但不能调用函数
  - 注解组合：从下到上依次执行，也就是执行工厂函数返回的函数

```javascript
function setName () {
  console.log('get setName')
  return function (target) {
    console.log('setName')
  }
}
function setAge () {
    console.log('get setAge')
  return function (target) {
    console.log('setAge')
  }
}
@setName()
@setAge()
class Test {}
```

- 类注解-修改原型对象和构造函数

> 定义了一个注解函数，它返回一个类，这个类继承要修饰的类，所以最后创建的实例不仅包含原 Greeter 类中定义的实例属性，还包含注解函数中定义的实例属性。还有一个点，我们在注解函数里给实例添加的属性，设置的属性值会覆盖被修饰的类里定义的实例属性，所以我们创建实例的时候虽然传入了字符串，但是 hello 还是注解函数里设置的"override"。

```javascript
function classDecorator<T extends { new (...args: any[]): {} }>(target: T) {
  return class extends target {
    newProperty = "new property";
    hello = "override";
  };
}
@classDecorator
class Greeter {
  property = "property";
  hello: string;
  constructor(m: string) {
    this.hello = m;
  }
}
console.log(new Greeter("world"));
```

- 函数注解
> 定义一个函数注解工厂，注解工厂返回一个注解；因为这个注解修饰在下面使用的时候修饰的是实例(或者实例继承的)的方法，所以注解的第一个参数是类的原型对象；第二个参数是这个方法名；第三个参数是这个属性的属性描述符的对象，可以直接通过设置这个对象上包含的属性描述符的值，来控制这个属性的行为。我们这里定义的这个函数注解，通过传入注解工厂的一个布尔值，来设置这个注解修饰的方法的可枚举性。如果去掉@enumerable(false)，那么最后 for in 循环打印的结果，会既有"age"又有"getAge"。

```typescript
function enumerable(bool: boolean) {
  return function(
    target: any, // 类的原型对象
    propertyName: string, // 方法名
    descriptor: PropertyDescriptor // 这个属性的属性描述符的对象
  ) {
    console.log(target);
    descriptor.enumerable = bool;
  };
}
class Info {
  constructor(public age: number) {}
  @enumerable(false)
  getAge() {
    return this.age;
  }
}
const info = new Info(18);
console.log(info);
//遍历这个实例
for (let propertyName in info) {
  console.log(propertyName);
}
```

- 存取器注解
```typescript
function enumerable1(bool: boolean) {
  return function(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = bool;
  }
}
class Info1 {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }
  @enumerable1(false)
  get name() {
    return this._name;
  }
  set name(name) {
    this._name = name;
  }
}
const myData = new Info1('sunshine')
console.log(myData)
for(let obj in myData){
  console.log(obj)
}
```
- 类属性注解(了解)
- 函数参数注解(了解)

## 模块
> 当我们引用模块文件的时候省略了 .ts 后缀也是可以的，这就涉及到一个模块解析策略。我们以下面例子中这个moduleB 为例，编译器在解析模块引用的时候，如果遇到省略后缀的情况，会依次查找以该名称为文件名的.ts、.tsx、.d.ts文件；如果没找到，会在当前文件夹下的 package.json 文件里查找 types 字段指定的模块路径，然后通过这个路径去查找模块；如果没找到package.json文件或者types字段，则会将 moduleB 当做文件夹去查找，如果它确实是文件夹，将会在这个文件夹下依次查找 index.ts、index.tsx、index.d.ts。  如果还没找到，会在上面例子中 module 文件夹的上级文件夹继续查找，查找规则和前面这些顺序一致。
- 相对和非相对导入
```typescript
src
 ╠═ module
 ║    ╠═ moduleA.ts
 ║    ╚═ moduleB.ts
 ╚═ core
      ╚═ index.ts
```

```typescript
// moduleA.ts
import moduleB from "./moduleB.ts"; // 这里在moduleA.ts文件里引入同级的moduleB.ts文件，所以使用./表示moduleA.ts文件当前所在路径
// index.ts
import moduleA from "../module/moduleA.ts";
import moduleB from "../module/moduleB"; // 这里省略了.ts后缀也可以
```
- 当引入第三方库时，如果暴露的方法没有定义类型
1) 可以通过安装类型声明模块(@types/xxx)的方式添加类型声明
2) 通过declare关键字声明
```typescript
import { camelCase } from 'lodash'

declare function camelCase (input: string): string

const res = camelCase('hello typed')
```

## 命名空间
- 命名空间的定义实际相当于定义了一个大的对象，里面可以定义变量、接口、类、方法等等，但是如果不使用export关键字指定此内容要对外可见的话，外部是没法访问到的。
- 命名空间和模块的区别：
> - 当我们是在程序内部用于防止全局污染，想把相关的内容都放在一起的时候，使用命名空间；
> - 当我们封装了一个工具或者库，要适用于模块系统中引入使用时，适合使用模块。
- 定义
```typescript
namespace Validation {
  const isLetterReg = /^[A-Za-z]+$/; // 这里定义一个正则
  export const isNumberReg = /^[0-9]+$/; // 这里再定义一个正则，与isLetterReg的区别在于他使用export导出了
  export const checkLetter = (text: any) => {
    return isLetterReg.test(text);
  };
}
```

- 使用
```typescript
/// <reference path="validation.ts"/>
let isLetter = Validation.checkLetter("sdfsd");
const reg = Validation.isNumberReg;
console.log(isLetter);
console.log(reg);
```
命名空间如果不是使用 webpack 等工具编译，而是使用 tsc 编译，那只需要在使用外部命名空间的地方使用```/// <reference path=“namespace.ts”/>```来引入，注意三斜线 ”///“ 开头，然后在 path 属性指定相对于当前文件，这个命名空间文件的路径。
- 编译时，需要指定一个参数outFile，这个参数来制定输出的文件名：
```
tsc --outFile src/index.js src/index.ts
```
- 编译后

```typescript
var Validation;
(function(Validation) {
  var isLetterReg = /^[A-Za-z]+$/;
  Validation.isNumberReg = /^[0-9]+$/;
  Validation.checkLetter = function(text) {
    return isLetterReg.test(text);
  };
})(Validation || (Validation = {}));
/// <reference path="namespace.ts"/>
var isLetter = Validation.checkLetter("sdfsd");
var reg = Validation.isNumberReg;
console.log(isLetter);
console.log(reg);
```

## 案例
### ts实现异步
- 演示：https://stackblitz.com/edit/typescript-async-await-type?file=index.ts
> 首先我们定义一个命名空间 axios，定义它用来简单模拟 axios 这个 ajax 请求库。我们在命名空间内定义一个 post 方法，第一个参数是要请求的 url，第二个参数是一些配置，这里我们只是定义一个参数，不做具体参数的处理和判断。这个 post 方法返回一个 Promise，这和 axios 库是一样的，使用 setTimeout 来模拟 ajax 请求的异步行为和延迟，当 1 秒后调用 resolve 回调函数，并根据调用的 url 返回不同的结果。post 方法返回的是一个 Promise，所以这个函数返回类型我们使用 TypeScript 内置的条件类型
>
> <p>接下来要定义两个发起 ajax 请求的函数了，这里我们使用 async/await 来定义这两个函数。先来看 loginReq 函数。我们在 function 关键字前加<code>async</code>表明这是一个异步函数，然后就可以在它的函数体内使用<code>await</code>关键字来让异步代码同步执行了。如果不使用 await，我们可以通过<code>.then()</code>拿到 axios.post 的结果并且进行后面的操作。我们这里在 axios.post 方法调用前面加上<code>await</code>，这样就可以让这个异步函数同步返回结果，它的返回值就是 Promise 中 resolve 回调函数传入的实际参数。我们在使用 Promise 时，可以使用<code>.catch(error =&gt; {})</code>来捕获异常拿到错误信息，如果使用 await，需要使用 try catch 来捕获异常。</p>

> 我们再定义一个 getRoleReq 函数来发起获取用户角色的请求，这个请求依赖登录请求返回的用户 id，形式和 loginReq 函数差不多。使用 async/await 要注意，await 只能出现在使用 async 修饰的函数或方法体内。

> 最后我们调用这两个函数，还是使用.then 的方式，这样要比使用 async/await 的形式简单些。这里我们在几个地方打印几个标记，让大家看下执行顺序，可以看到，打印出来的数字，是按 1->2->3 的顺序打印出来的，这是因为代码执行到 console.log(1)后会等 await 修饰的异步代码执行完，才会往后执行，所以 3 在 2 后面执行。

```typescript
interface Res { // 我们定义一个接口，用来定义接口返回结果的结构
  data: {
    [key: string]: any;
  };
}
namespace axios { // 现在我们来定义一个命名空间，用来模拟axios实现接口调用
  export function post(url: string, config: object): Promise<Res> { // 返回值类型是一个Promise，resolve传的参数的类型是Res
    return new Promise((resolve, reject) => { // 然后这里返回一个Promise
      setTimeout(() => { // 通过setTimeout实现异步效果
        let res: Res = { data: {} };
        if (url === "/login") res.data.user_id = 111; // 我们这里通过简单判断，来模拟调用不同接口返回不同数据的效果
        else res.data.role = "admin";
        console.log(2);
        resolve(res); // 在这里传入res结果
      }, 1000);
    });
  }
}
interface Info {
  user_name: string;
  password: string;
}
async function loginReq({ user_name, password }: Info) { // 这里使用async关键字修饰这个函数，那么他内部就可以包含异步逻辑了
  try {
    console.log(1);
    const res = await axios.post("/login", { // 这里调用/login接口
      data: {
        user_name,
        password
      }
    });
    console.log(3);
    return res;
  } catch (error) {
    throw new Error(error);
  }
}
async function getRoleReq(user_id: number) {
  try {
    const res = await axios.post("/user_roles", {
      data: {
        user_id
      }
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
}
loginReq({ user_name: "lison", password: "123" }).then(res => {
  const {
    data: { user_id }
  } = res;
  getRoleReq(user_id).then(res => {
    const {
      data: { role }
    } = res;
    console.log(role);
  });
});
```
