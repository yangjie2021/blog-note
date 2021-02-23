/**
 * sleep函数
 * 函数懒加载，在两个函数之间添加一个延迟
 */
function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}

/* function test() {
  console.log('111');
  sleep(2000);
  console.log('222');
}

test() */

/**
 * 一次性函数
 */
function once (fn) {
  let done = false
  return function  () {
    if (!done) {
      done = true
      fn.apply(this, arguments)
    }
  }
}

/* 测试
  let pay = once(function(money) {
    console.log(`支付金额：${money}`)
  })

  pay(5)
  pay(5)
  pay(5)
  pay(5)
*/

/**
 * 函数柯里化
 */
function curry (func) {
  return function curriedFn(...args) {
    // 判断实参和形参的个数
    if (args.length < func.length) {
      return function () {
        return curriedFn(...args.concat(Array.from(arguments)))
      }
    }
    return func(...args)
  }
}

// function getSum (a, b, c) {
//   return a + b + c
// }

// const curried = curry(getSum)

// console.log(curried(1, 2, 3))
// console.log(curried(1)(2, 3))
// console.log(curried(1, 2)(3))

/**
 * 记忆函数
 */
function memoize (fn) {
  let cache = {}
  return function () {
    let key = JSON.stringify(arguments)
    cache[key] = cache[key] || fn(...arguments)
    return cache[key]
  }
}

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
 * js 沙箱
 */
const sandboxProxies = new WeakMap()
function compileCode(src) {
  src = 'with (sandbox) {' + src + '}'
  const code = new Function('sandbox', src)
  function has(target, key) {
    return true
  }

  function get(target, key) {
    if (key === Symbol.unscopables) return undefined
    return target[key]
  }
  return function(sandbox) {
    if (!sandboxProxies.has(sandbox)) {
        const sandboxProxy = new Proxy(sandbox, { has, get })
        sandboxProxies.set(sandbox, sandboxProxy)
    }
    return code(sandboxProxies.get(sandbox))
  }
}

/* compileCode(`
  var name = 'aaa';
  log(name)`
)(console) */