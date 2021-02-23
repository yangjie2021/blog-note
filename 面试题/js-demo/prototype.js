/**
 * 模拟new
 * 1. 创建一个空对象，这个对象将会作为执行构造函数之后返回的对象实例
 * 2. 将这个空对象的隐式原型指向构造函数的显示原型
 * 3. 将这个空对象赋值给构造函数内部的this，并执行构造函数逻辑
 * 4. 如果构造函数返回了一个对象，那么这个对象会取代new出来的结果，否则new函数会自动返回这个新对象
 */
function _new (fn) {
  var ctor = fn.prototype.shift.call(arguments)
  var args = Array.prototype.slice.call(arguments, 1)
  var obj = Object.create(ctor.prototype) // 创建空对象
  
  obj.__proto__ = ctor.prototype
  obj.__proto__.constructor = ctor

  var res = constructor.apply(obj, arguments)
  return res instanceof Object ? res : obj
}


/**
 * instanceOf
 */
function _instanceOf (obj, ctor) {
  const protoObj = ctor.prototype
  obj = obj.__proto__

  while (obj) {
    if(protoObj === obj) {
      return true
    }

    obj = obj.__proto__
  }
  return false
}


/**
 * Object.create()
 * 1. 创建一个类，返回这个类的实例
 * 2. 传递的prototype: 实例.__proto__=类.prototype
 */
if(!Object.create) {
  Object.create = function create(prototype) {
    if (prototype === null || typeof prototype !== "object") {
        throw new TypeError(`Object prototype may only be an Object: ${prototype}`);
    }
    function Temp() { }
    Temp.prototype = prototype
    return new Temp;
  }
}


/**
 * 模拟call
 * 1. 把函数作为要改变this的对象的一个成员，确保成员属性的唯一性
 * 2. 基于目标对象的成员访问执行函数，目标如果不是对象，转换为对象
 */
Function.prototype._call = function call(context, ...args) {
  context = context == null ? window : context
  let contextType = typeof context
  if(!/^(object|function)$/i.test(contextType)) {
    context = Object(context)
  }

  let result
  let key = Symbol('KEY')
  context[key] = this
  result = context[key](...args)

  delete context[key]
  return result
}


/**
 * 模拟bind
 * 1. 保存原函数的this指针
 * 2. 取出第一个参数作为上下文，剩余参数类数组转数组
 * 3. 返回一个新的函数，新的函数中绑定目标对象并传参，使用apply将this指向目标对象
 */
Function.prototype._bind = function (context, ...args1) {
  const _this = this

  var res = function (...args2) {
    return _this.call(context, ...args1.concat(args2))
  }

  return res
}



