/**
 * 原型继承
 * 1. 通过构造函数的方式，将父类的实例赋值给子类的显示原型（`prototype`）上
 * 2. 以此类推，每一层都可以继承上一层的属性。
 */
function Parent() {}
Parent.prototype.package = ['书']

function Children() {}
// 继承了 Parent
Children.prototype = new Parent()

/** 测试
  var instance1 = new Children()
  var instance2 = new Children()
  instance1.package.push('笔')

  console.log(instance1.package) // ['书', '笔']
  console.log(instance2.package) // ['书', '笔']
  console.log(instance1.package === instance2.package) // true
*/

/**
 * 借用构造函数继承
 * 1. 在子类构造函数中调用父类构造函数
 */
function Parent (name) {
  this.name = name
}

function Children () {
  // 继承了 Parent，同时传递了参数
  Parent.call(this, 'sunshine')
  // this.name = 'sunshine'

  // 实例属性
  this.age = 25
}
/** 测试
  var instance = new Children()
  console.log(instance) // { age: 25, name: "sunshine" }
*/

/**
 * 对象继承
 */
function object(o) {
  // 创建一个临时构造函数
  function F () {}
  // 将传入的对象赋值给这个构造函数的原型
  F.prototype = o
  // 返回这个临时类型的一个实例
  return new F()
}

var parent = {
  name: '父亲',
  getName: function() {
    console.log(this.name)
  }
}

/** 测试
  var children = object(parent)

  parent.getName() // "父亲"
  children.getName() // "儿子"
*/

/**
 * 寄生式继承
 */
function inherit (obj) {
  var cloneObj = Object.create(obj)
  cloneObj.getName = function() {
    console.log(this.name)
  }
  return cloneObj
}

var parent = {
  name: 'sunshine'
}

/** 测试
  var children = inherit(parent)
  children.getName() // 'sunshine'
 */

/**
 * 组合继承
 */
function Parent(name) {
  this.name = name
  this.package = ['书']
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Children (name, age) {
  // 继承属性
  Parent.call(this, name) // 第2次调用Parent

  this.age = age
}

// 继承方法
Children.prototype = new Parent() // 第1次调用Parent
Children.prototype.getAge = function () {
  console.log(this.age)
}

/** 测试
  var instance1 = new Children('sunshine', 20)
  var instance2 = new Children('colorful', 30)
  instance1.package.push('笔')

  console.log(instance1.package)
  instance1.getName()
  instance1.getAge()

  console.log(instance2.package)
  instance2.getName()
  instance2.getAge()

  console.log(instance1 instanceof Parent) // true
  console.log(Parent.prototype.isPrototypeOf(instance1)) // true
 */

/**
 * 寄生式组合继承
 */
function inherit(Child, Parent) {
  // 继承原型上的属性
	Child.prototype = Object.create(Parent.prototype)
  
  // 修复 constructor
  Child.prototype.constructor = Child
  
  // 存储超类
  Child.super = Parent
  
  // 静态属性继承
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(Child, Parent)
	} else if (children.__proto__) {
    Child.__proto__ = Parent
  } else {
    for (var k in Parent) {
      if (Parent.hasOwnProperty(k) && !(k in Child)) {
        Child[k] = Parent[k]
      }
    }
  }
}

/** 测试
  function Parent(name) {
    this.name = name
    this.package = ['书']
  }

  Parent.prototype.getName = function () {
    console.log(this.name)
  }

  function Children (name, age) {
    // 继承属性
    Parent.call(this, name)

    this.age = age
  }

  inherit(Children, Parent)
  Children.prototype.getAge = function () {
    console.log(this.age)
  }
  var instance1 = new Children('sunshine', 20)
  instance1.getName()
  instance1.getAge()
 */

/**
 * 类继承
 */
class Parent {
  constructor () {
    this.type = 'parent'
  }
}

class Children extends Parent {
  constructor () {
    super()
    this.type = 'children'
  }
}

/** 测试
  let child = new Children()
  child.type // 'parent'

  child instanceof Children // true
  child instanceof Parent // true
  child.hasOwnProperty('type') // true
 */



