// 遍历
function arrayEach(array, iteratee) {
  let index = -1
  const length = array.length

  while (++index < length) {
    if (iteratee(array[index], index) === false) {
      break
    }
  }
  return array
}


// 深拷贝
function cloneDeep (target, map = new WeakMap()) {
  if (typeof target !== 'object' || target == null) return target

  const isArray = target instanceof Array || Array.isArray(target)
  let cloneTarget = isArray ? [] : {}

  // 循环引用
  if (map.get(target)) {
    return map.get(target)
  }
  map.set(target, cloneTarget)

  // while代替for in
  const keys = isArray ? undefined : Object.keys(target)
  arrayEach(keys || target, (value, key) => {
    if (keys) key = value
   
    cloneTarget[key] = cloneDeep(target[key], map)
  })

  return cloneTarget
}

// instanceof
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

function _new (fn) {
  var ctor = fn.prototype.shift.call(arguments)
  var obj = Object.create(ctor.prototype)
  obj.__proto__ = ctor.prototype
  var result = ctor.apply(obj, arguments)
  return result
}