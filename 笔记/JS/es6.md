## ECMAScript简介

### ECMAScript && Javascript

ECMAScript是Javascript的标准化规范，实际上Javascript是ECMAScript的扩展语言，ES只是提供了最基本的语法。在浏览器环境中，Javascript = ECMAScript + Web APIs(BOM + DOM)。在node环境中，Javascript  = ECMAScript + Node APIs(fs + net + etc.)

### ES6的由来

​	ES2015中的上一个版本（ES5）是经历6年才发布，是新时代的代表版本，因为间隔时间长，发布内容多，导致ES2015后的版本开始，ES决定按照年份命名，因为发布过程中做的觉定，所以很多都把ES2015叫做ES6，后人将ES2015以上的版本都泛指为ES6，例如async await其实是ES2017中发布的

## ES5及以下

### 数据类型

- 基本类型：布尔、数值、字符串、Symbol
- 特殊数据类型：undefined、null
- 引用数据类型：Object
- 包装对象：Boolean、Number、String
- 内置对象：Array、Function、Date、RegExp
- 宿主环境：浏览器-document、window；Node环境-global

### 函数

### 原型链

### this

## ES2015（ES6）

es6新特性主要体现在：解决原有语法上的不足和问题，对原有语法进行增强，全新的对象&方法&功能和全新的数据类型和数据结构

### 变量声明

### 模板字符串

1. 模板字符串

- 模板字符串的标签就是一个特殊的函数，使用这个标签就是调用这个函数
  
  ```javascript
  const str = console.log`hello world`
  
  const name = 'tom'
  const gender = false
  
  function myTagFunc (strings, name, gender) {
    // console.log(strings, name, gender)
    const sex = gender ? 'man' : 'woman'
    return strings[0] + name + strings[1] + sex + strings[2]
  }
  
  const result = myTagFunc`hey, ${name} is a ${gender}.`
  
  console.log(result)
  ```
```

  2. 字符串的扩展方法

  ```javascript
const message = 'Error: foo is not defined.'
  
  console.log(
    message.startsWith('Error'),
  message.endsWith('.'),
    message.includes('foo')
  )
```

  ### 数组

  1. 数组的解构

```javascript
  const arr = [100, 200, 300]

  // 注意：...只能放在最后
const [foo, ...rest] = arr
  console.log(rest)
  
  // 默认值
  const [foo, bar, baz = 123, more = 'default value'] = arr
  console.log(baz, more)
  
  // 解析字符串
  const path = '/foo/bar/baz'
  const [, rootdir] = path.split('/') // [ '', 'foo', 'bar', 'baz' ]
  console.log(rootdir) // foo
  
  // 获取数组的最小值
  var arr = [12, 34, 32, 89, 4]
  Math.min(...arr)
```

  2. 展开数组参数

  ```javascript
  const arr = ['foo', 'bar', 'baz']
  console.log(...arr)
  ```

### 对象

  1. 对象的解构

  ```javascript
  const obj = { name: 'zce', age: 18 }
  
  // 解构重命名
  const name = 'tom'
  const { name: objName } = obj
  console.log(objName)
  
  // 默认值
  const name = 'tom'
  const { name: objName = 'jack' } = obj
  console.log(objName)

  // console.log的使用
const { log } = console
  log('foo')
log('bar')
  log('123')
  ```

  2. 对象字面量

  - 属性名与变量名相同，可以省略 : bar
  - 方法可以省略 : function
  - 通过 [] 让表达式的结果作为属性名

  ```javascript
const bar = '345'
  const obj = {
  [bar]: 123,
    [Math.random()]: 111
}
  console.log(obj) // { '345': 123, '0.4245971247866489': 111 }
  ```

  3. Object.assign

  - 原理：用合并对象以此覆盖前面的对象，并改变第一个对象的值

  ```javascript
  const source1 = {
    a: 123,
    b: 123
  }
  
  const source2 = {
    b: 789,
    d: 789
  }
  
  const target = {
    a: 456,
    c: 456
  }
  
  const result = Object.assign(target, source1, source2)
  
  console.log(target)
  console.log(result === target) // true
  ```

  - 使用场景: 避免对象指针覆盖导致的数据污染问题（浅拷贝）

  ```javascript
function func (obj) {
  // obj.name = 'func obj'
  // console.log(obj)

  const funcObj = Object.assign({}, obj)
  funcObj.name = 'func obj'
  console.log(funcObj)
}
  
const obj = { name: 'global obj' }
  
func(obj)
console.log(obj)
  ```

  4. Object.is（不常用）

  - 解决精确数学运算等问题

  ```javascript
  console.log(
    0 == false,             // => true
    0 === false,            // => false
    +0 === -0,              // => true
    NaN === NaN,            // => false
    Object.is(+0, -0),      // => false
    Object.is(NaN, NaN)     // => true
  )
  ```

### Proxy 对象

  - 基本用法

  ```javascript
  const person = {
    name: 'zce',
    age: 20
  }
  
  const personProxy = new Proxy(person, {
    /**
     * 监视属性读取
     * @param {*} target 目标对象
     * @param {*} property 属性名
   */
    get (target, property) {
    return property in target ? target[property] : 'default'
    },
    /**
     * 监视属性设置
     * @param {*} target 目标对象
     * @param {*} property 属性名
     * @param {*} value 属性值
     */
    set (target, property, value) {
      if (property === 'age') {
        if (!Number.isInteger(value)) {
          throw new TypeError(`${value} is not an int`)
        }
      }
  
      target[property] = value
      console.log(target, property, value)
    }
  })
  
  personProxy.age = 100
  personProxy.gender = true
  
  console.log(personProxy.name)
  console.log(personProxy.xxx)
  ```

  - 对比Object.defineProperty()
  - 优势1：Proxy 可以监视读写以外的操作
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/204aab2ff7e6466fa37f5b66391032d7~tplv-k3u1fbpfcp-zoom-1.image)

  ```js
  const person = {
    name: 'zce',
    age: 20
  }
  
  const personProxy = new Proxy(person, {
    deleteProperty (target, property) {
      console.log('delete', property)
      delete target[property]
    }
  })
  
  delete personProxy.age
  console.log(person)
  ```

  - 优势2：Proxy 可以很方便的监视数组操作

  ```javascript
const list = []
  
const listProxy = new Proxy(list, {
    set (target, property, value) {
      console.log('set', property, value)
      target[property] = value
    	return true // 表示设置成功
    }
  })
  
  listProxy.push(100)
  listProxy.push(100)
  ```

  - 优势3：Proxy 不需要侵入对象

  ```javascript
  // Object.defineProperty()方式操作对象
  const person = {}
  
  Object.defineProperty(person, 'name', {
  get () {
      console.log('name 被访问')
    return person._name
    },
  set (value) {
      console.log('name 被设置')
      person._name = value
  }
  })
  Object.defineProperty(person, 'age', {
    get () {
      console.log('age 被访问')
      return person._age
    },
    set (value) {
    console.log('age 被设置')
      person._age = value
  }
  })

  person.name = 'jack'
  
  console.log(person.name)
  
  // Proxy 方式操作对象方式更为合理
  const person2 = {
    name: 'zce',
    age: 20
  }
  
  const personProxy = new Proxy(person2, {
    get (target, property) {
      console.log('get', property)
      return target[property]
    },
    set (target, property, value) {
      console.log('set', property, value)
      target[property] = value
    }
  })
  
  personProxy.name = 'jack'
  
  console.log(personProxy.name)
  ```

6. Reflect 对象

  - Reflect属于一个静态类, 不能构建实例对象(new),Reflect内部提供了13个对对象底层操作的方法，这些方法就是proxy处理对象的默认实现
- Reflect的价值在于提供了一套统一的用于操作对象的API
  - Reflect顾名思义就是反射的意思，所谓反射，就是映射对象方法和属性的一种叫法，所有映射对象方法和属性都可以叫做反射
  
  ```javascript
  const obj = {
    name: 'zce',
    age: 18
  }
  
  // console.log('name' in obj)
  // console.log(delete obj['age'])
  // console.log(Object.keys(obj))
  
  console.log(Reflect.has(obj, 'name'))
  console.log(Reflect.deleteProperty(obj, 'age'))
  console.log(Reflect.ownKeys(obj))
  ```
  
  7. Promise：解决了传统异步编程中回调函数嵌套过深的问题

  ### 函数

  1. 函数参数可以设置默认值
  2. 剩余参数
  
  ```javascript
  function foo (first, ...args) {
    console.log(args)
  }
  
  foo(1, 2, 3, 4)
  ```
  
  3. 箭头函数
  
  - 由于箭头函数内部没有this机制，所以不会改变this的指向, setTimeout是宏任务，时间循环后可以去到obj作用域中的this
  
  ```javascript
  var a = 10;
  var obj = {
    a: 20,
    fn () {
      setTimeout(() => {
        console.log(this.a) // 20
      }, 1000)
    }
  }
  
  // 闭包写法
  var obj = {
    a: 20,
    fn () {
      const _this = this
      setTimeout(function () {
        console.log(_this.a)
      }, 1000)
    }
  }
  
  obj.fn()
  ```
  
  4. Class类
  
  - 实例方法和静态方法的区别在于一个需要通过类型构建的实例对象调用，一个直接通过类型本身调用
  - static静态方法的this指向的不是实例对象，而是构建对象的类型
  
  ```javascript
  class Person {
    constructor (name) {
      this.name = name
    }
  
    say () {
      console.log(`hi, my name is ${this.name}`)
    }
  
    static create (name) {
      return new Person(name)
    }
  }
  
  const tom = Person.create('tom')
  tom.say()
  ```
  
  - 类的继承 extends：相比原型继承更清晰
  
  ```javascript
  class Person {
    constructor (name) {
      this.name = name
    }
  
    say () {
      console.log(`hi, my name is ${this.name}`)
    }
  }
  
  class Student extends Person {
    constructor (name, number) {
      super(name) // 父类构造函数
      this.number = number
    }
  
    hello () {
      super.say() // 调用父类成员
      console.log(`my school number is ${this.number}`)
    }
  }
  
  const s = new Student('jack', '100')
  s.hello()
  ```


  ### Set数据结构

  1. set的API

  ```javascript
  const s = new Set()
  
  s.add(1).add(2).add(3).add(4).add(2)
  
  s.forEach(i => console.log(i))
  
  for (let i of s) {
    console.log(i)
  }
  
  console.log(
    s.size,
    s.has(100)
  )
  s.delete(3)
  s.clear()
  console.log(s)
  
  // 应用场景：数组去重
  const arr = [1, 2, 1, 3, 4, 1]
  
  // const result = Array.from(new Set(arr))
  const result = [...new Set(arr)]
  
  console.log(result)
  ```

  3. WeakSet  弱引用版本 

  - 差异就是 Set 中会对所使用到的数据产生引用
  - 即便这个数据在外面被消耗，但是由于 Set 引用了这个数据，所以依然不会回收
  - 而 WeakSet 的特点就是不会产生引用，
  - 一旦数据销毁，就可以被回收，所以不会产生内存泄漏问题

  ### Map

  1. map

  - 对于一个普通对象而言，键只能是字符类型，即便手动设置为其它类型，最后也会转换为字符类型
  - map是真正意义上的键值对集合，可以使用任何数据类型作为键

  2. 弱引用版本 WeakMap （同WeakSet）

  ```javascript
  const m = new Map()
  const tom = { name: 'tom' }
  
  m.set(tom, 90)
  m.get(tom)
  m.has()
  m.delete()
  m.clear()
  m.forEach((value, key) => {
    console.log(value, key)
  })
  ```

  ### Symbol 数据类型

  - 最主要的作用就是为对象添加一个独一无二的属性名

  1. 解决扩展对象，属性名冲突问题

  - Symbol可以为对象添加用不重复的键, 也可以在计算属性名中使用
  - 两个 Symbol 永远不会相等

  ```javascript
  const obj = {
    [Symbol()]: 123
    [Symbol()]: 'hello'
  }
  console.log(obj)
  
  console.log(
    Symbol() === Symbol()
  ) // false
  ```

  2. Symbol 模拟实现私有成员

  ```javascript
  // a.js ======================================
  
  const name = Symbol()
  const person = {
    [name]: 'zce',
    say () {
      console.log(this[name])
    }
  }
  // 只对外暴露 person
  
  // b.js =======================================
  
  // 由于无法创建出一样的 Symbol 值，
  // 所以无法直接访问到 person 中的「私有」成员
  // person[Symbol()]
  person.say()
  ```

  3. Symbol扩展方法

  - Symbol 全局注册表

  ```javascript
  const s1 = Symbol.for('foo')
  const s2 = Symbol.for('foo')
  console.log(s1 === s2)
  
  console.log(
    Symbol.for(true) === Symbol.for('true')
  )
  ```

  - 内置 Symbol 常量

  ```javascript
  console.log(Symbol.iterator)
  console.log(Symbol.hasInstance)
  
  const obj = {
    [Symbol.toStringTag]: 'XObject'
  }
  console.log(obj.toString())
  ```

  - Symbol 属性名获取

  ```javascript
  const obj = {
    [Symbol()]: 'symbol value',
    foo: 'normal value'
  }
  
  // for...in,Object.keys(),JSON.stringify()都获取不到
  console.log(Object.getOwnPropertySymbols(obj))
  ```

  ### 遍历

  1. for...of

  - for...of 循环可以替代 数组对象的 forEach 方法，和foreach的区别是for...of中可以使用break关键字终止循环，foreach不能
  - forEach 无法跳出循环，必须使用 some 或者 every 方法

  ```javascript
  const arr = [100, 200, 300, 400]
  for (const item of arr) {
    console.log(item)
    if (item > 100) {
      break
    }
  }
  ```

  - 遍历 Set 与遍历数组相同
  - 遍历 Map 可以配合数组结构语法，直接获取键值

  ```javascript
  const m = new Map()
  m.set('foo', '123')
  m.set('bar', '345')
  
  for (const [key, value] of m) {
    console.log(key, value)
  }
  ```

  ### 迭代器

  1. 可迭代接口

  - Iterator 迭代器接口（统一的编程标准），iterator是for of遍历的前提
  - 数组，Set，Map能被for of遍历的原因是因为它们的原型对象上都有一个Symbol(Symbol.iterator)方法
  - 由于Object的原型对象上没有这个方法，所以如果用for of遍历对象，需要实现一个iterator接口
  - ==iterable >>> iterator >>> iterationResult==

  ```javascript
  const obj = {
    store: ['foo', 'bar', 'baz'],
  
    [Symbol.iterator]: function () { // iterable 可迭代接口
      let index = 0
      const self = this
  
      return { // iterator迭代器: 带有next方法的对象
        next: function () {
          const result = { // iterationResult 迭代结果接口：next方法返回的接口
            value: self.store[index],
            done: index >= self.store.length
          }
          index++
          return result
        }
      }
    }
  }
  
  for (const item of obj) {
    console.log('循环体', item)
  }
  ```

  2. 迭代器模式

  ```javascript
  // 场景：你我协同开发一个任务清单应用
  
  // 我的代码 ===============================
  
  const todos = {
    life: ['吃饭', '睡觉', '打豆豆'],
    learn: ['语文', '数学', '外语'],
    work: ['喝茶'],
  
    // 提供迭代器（ES2015 统一遍历访问接口）
    [Symbol.iterator]: function () {
      const all = [...this.life, ...this.learn, ...this.work]
      let index = 0
      return {
        next: function () {
          return {
            value: all[index],
            done: index++ >= all.length
          }
        }
      }
    }
  }
  
  // 你的代码 ===============================
  for (const item of todos) {
    console.log(item)
  }
  ```

  ### 生成器

  - 生成器函数会自动返回一个生成器对象， 调用next方法才会让函数体开始执行，遇到yeild暂停，yeild的关键词会作为结果返回
  - 最大的特点：惰性执行
  - 作用：解决异步编程中回调函数嵌套过深导致的问题
  - 使用场景：实现iterator方法

  ```javascript
  const todos = {
    life: ['吃饭', '睡觉', '打豆豆'],
    learn: ['语文', '数学', '外语'],
    work: ['喝茶'],
    [Symbol.iterator]: function * () {
      const all = [...this.life, ...this.learn, ...this.work]
      for (const item of all) {
        yield item
      }
    }
  }
  
  for (const item of todos) {
    console.log(item)
  }
  ```

  ## ES2016

  1. Array.prototype.includes

  - 判断数组中是否存在某个元素
  - 与indexOf的区别是，indexOf不能查找数组中导入NAN

  ```javascript
  const arr = ['foo', 1, NaN, false]
  
  console.log(arr.indexOf(NaN)) // -1
  console.log(arr.includes('foo')) // true
  console.log(arr.includes(NaN)) // true
  ```

  2. 指数运算符

  - 应用于一些数学密集型运算的场景

  ```javascript
  // ES2016前
  console.log(Math.pow(2, 10))
  // ES2016后
  console.log(2 ** 10)
  ```

  ## ES2017

  1. Object.values
  2. Object.entries

  - 以数组的形式返回对象Hong Kong所有的键值对
  - 支持for...of遍历
  - 支持构建map

  ```javascript
  const obj = {
    foo: 'value1',
    bar: 'value2'
  }
  for (const [key, value] of Object.entries(obj)) {
    console.log(key, value)
  }
  console.log(new Map(Object.entries(obj)))
  ```

  3. Object.getOwnPropertyDescriptors：获取对象的属性完整描述信息

  - 解决Object.assign复制对象时不能复制get属性问题

  ```javascript
  const p1 = {
    firstName: 'Lei',
    lastName: 'Wang',
    get fullName () {
      return this.firstName + ' ' + this.lastName
    }
  }
  
  // const p2 = Object.assign({}, p1)
  // p2.firstName = 'zce'
  // console.log(p2.fullName)
  
  const descriptors = Object.getOwnPropertyDescriptors(p1)
  const p2 = Object.defineProperties({}, descriptors)
  p2.firstName = 'zce'
  console.log(p2.fullName)
  ```

  4. 字符串填充方法：String.prototype.padStart / padEnd

  ```javascript
  const books = {
    html: 5,
    css: 16,
    javascript: 128
  }
  
  for (const [name, count] of Object.entries(books)) {
    console.log(`${name.padEnd(16, '-')}|${count.toString().padStart(3, '0')}`)
  }
  ```

  5. 在函数参数中添加尾逗号
  6. Async/Await