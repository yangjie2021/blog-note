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
 * 模拟new
 * 1. 创建一个空对象，这个对象将会作为执行构造函数之后返回的对象实例
 * 2. 将这个空对象的隐式原型指向构造函数的显示原型
 * 3. 将这个空对象赋值给构造函数内部的this，并执行构造函数逻辑
 * 4. 如果构造函数返回了一个对象，那么这个对象会取代new出来的结果，否则new函数会自动返回这个新对象
 */
function _new (fn) {
  var ctor = fn.prototype.shift.call(arguments)
  var obj = Object.create(ctor.prototype)
  obj.__proto__ = ctor.prototype
  var result = ctor.apply(obj, arguments)
  return result
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
 * 1. 将参数拆解为数组
 * 2. 获取 this （数组第一项）
 * 3. 返回一个函数，用来返回apply
 */
Function.prototype._bind = function (context, ...params) {
  const _this = this

  return function (...args) {
    return _this.call(context, ...params.concat(args))
}

/**
 * 实现reduce
 */


/**
* 模拟ajax请求
*/
function ajax (method, url, params) {
  let promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, false) // false 异步请求
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) { // 请求状态码
        if(xhr.status === 200) { // 响应状态码
          resolve(
            JSON.parse(xhr.responseText)
          )
        } else {
          reject(new Error('失败'))
        }
      }
    }
    xhr.send(params)
  })
  return p
}

