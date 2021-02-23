// 缓存函数：通过闭包隐藏数据
function createCache () {
  const data = {}
  return {
    set (key, val) {
      data[key] = val
    },
    get (key) {
      return data[key]
    }
  }
}

// const cacheObj = createCache()
// cacheObj.set('a', 100)
// console.log(cacheObj.get('a'))

/**
 * 修改下面的代码，让循环输出的结果依次为1， 2， 3， 4， 5
  for (var i=1; i<=5; i++) {
    setTimeout(function timer() {
        console.log(i)
    }, 1000 )
  }
 */
// 1. 闭包
for (var i = 1; i <= 5; i++) {
  log(i) // 1 2 3 4 5
}
function log(i) {
  setTimeout(function timer() {
    console.log(i)
  }, 1000)
}
// 2. IIF
for (var i = 1; i <= 5; i++) {
  (function (i) {
    setTimeout(function timer() {
      console.log(i)
    }, 1000)
  })(i)
}

// 3. 块级作用域
for (let i=1; i<=5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, 1000 )
}