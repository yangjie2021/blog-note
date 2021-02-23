// 获取数据类型
const getType = obj => {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

// 判断是否是基本数据类型
const isPrimitive = data => {
  const primitiveType = [
    'undefined','null','boolean','string','symbol',
    'number','bigint','map','set','weakmap','weakset'
  ]
  return primitiveType.includes(getType(data))
}

const isObject = data => getType(data) === 'object'
const isArray = data => getType(data) === 'array'

export {
  getType,
  isPrimitive,
  isObject,
  isArray
}