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
 * 事件委托
 * 1. 目标选择器可能存在（需要委托）或者不存在（不需要委托）
 * 2. 当点击的元素是目标元素的子元素，就继续查找找父级，
 * 3. 如果找到目标元素，执行事件委托
 * 4. 如果找不到，即找到了委托元素，则不执行委托
 * 缺点：不支持多个样式名
 */
function eventDelegate(element, eventType, selector, fn) {
  if (fn == null) {
    fn = selector
    selector = null
  }
  element.addEventListener(eventType, event => {
      let target = event.target
      if (selector) {
        while (!target.matches(selector)) {
            if (element === target) {
                target = null
                break
            }
            target = target.parentNode
        }
        target && fn.call(target, event)
      } else {
        fn(event)
      }
  })
  return element
}
// eventDelegate(ul, 'click', 'li', function(e, el) {
//   console.log(`点击了${this}标签`)
// })