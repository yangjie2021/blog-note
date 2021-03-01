/**
 * map
 */
const map = (array, fn) => {
  let results = []
  for (let value of array) {
    results.push(fn(value))
  }
  return results
}

/**
 * every
 */
const every = (arr, fn) => {
  let result = true
  for (let value of arr) {
    result = fn(value)
    if (!result) {
      break
    }
  }
  return result
}


/**
 * some
 */
const some = (array, fn) => {
  let result = true
  for (let value of array) {
    result = fn(value)
    if (result) {
      break
    }
  }
  return result
}

/**
 * filter
 */
function filter (array, fn) {
  let results = []
  for (let i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      results.push(array[i])
    }
  }
  return results
}

/**
 * 实现reduce
 */
function reduce(arr, fn, value){
  if(typeof fn !== 'function'){
    throw Error('第2个参数必须为一个函数')
    return 
  }
  var acc = value || arr[0]
  const startIndex = value ? 0 : 1
  for(let i = startIndex; i < arr.length; i++) {
    acc = fn(acc, arr[i], i, arr)
  }
  return acc
}


/**
 * 打平数组
 * 1. 利用 Array.prototype.flat
 * 2. 利用 reduce 和 concat
 * 3. 使用 stack 无限反嵌套多层嵌套数组
 */
function flatten1 (arr) {
  return arr.flat(Math.pow(2, 53) - 1)
}

function flatten2 (arr) {
  return arr.reduce((prev, next) => Array.isArray(next) 
    ? prev.concat(flatten(next)) 
    : prev.concat(next)
  , [])
}

function flatten3 (arr) {
  const stack = [...arr]
  const res = []
  while (stack.length) {
    const next = stack.pop()
    if (Array.isArray(next)) {
      stack.push(...next)
    } else {
      res.push(next)
    }
  }

  return res.reverse()
}

/**
 * 实现数组去重
 * 1. new Set()
 * 2. indexOf
 * 3. includes
 * 4. reduce
 * 5. map
 */
function uniq1 (arr) {
  return [...new Set(arr)]
}

function uniq2 (arr) {
  let res = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (res.indexOf(item) === -1) {
      res.push(item)
    }
  }
  return res
}

function uniq3 (arr) {
  var result = new Array()
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (!result.includes(arr[i])) {
      result.push(item)
    }
  }
  return result
}

function uniq4 (arr) {
  return arr.reduce((pre, cur) => pre.includes(cur) ? pre : [...pre, cur], [])
}

function uniq5 (arr) {
  let map = new Map()
  let result = new Array()
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (map.has(item)) {
      map.set(item, true)
    } else {
      map.set(item, false)
      result.push(item)
    }
  }
  return result
}

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