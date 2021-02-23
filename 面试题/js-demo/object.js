import {
  getType,
  isPrimitive,
  isObject,
  isArray
} from './type.js'

// 深拷贝
function cloneDeep (data, map = new WeakMap()) {
  let result
  if (isPrimitive(data)) {
    return data
  } else if (isObject(data)) {
    result = { ...data }
  } else if (isArray(data)) {
    result = [...data]
  }

  // 循环引用
  if (map.get(data)) {
    return map.get(data)
  }
  map.set(data, result)

  Reflect.ownKeys(result).forEach(key => {
    if (result[key] && getType(result[key]) === "object") {
      result[key] = cloneDeep(data[key], map)
    }
  })

  return result
}