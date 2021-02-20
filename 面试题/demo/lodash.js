/**
 * 防抖
 */
function debounce (fn, delay) {
  let timer = null
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}


/**
 * 节流
 */
function throttle(fn, delay) {
  let lastTime = 0
  return function(...args) {
    let nowTime = Date.now()
    if (nowTime - lastTime > delay) {
      fn.apply(this, args)
      lastTime = nowTime
    }
  }
}

/**
 * 打平数组
 */
function flatten(arr){
  while(arr.some(item => Array.isArray(item))){
    arr =  [].concat.apply([],arr);
  }
   return arr;
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

/**
 * 事件监听函数
 */
function bindEvent(el, type, selector, fn) {
  if (fn == null) {
    fn = selector
    selector = null
  }
  el.addEventlistener(type, event => {
    const target = event.target
    if (selector) {
      if (target.matches(selector)) {
        fn.call(target, event)
      }
    } else {
      fn(event)
    }
  })
}