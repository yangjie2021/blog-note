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


// 创建10个<a>标签，点击的时候分别弹出对应的序号
let aDom
for (let i = 0; i < 10; i++) {
  aDom = document.createElement('a')
  aDom.innerHTML = i + '<br/>'
  aDom.addEventListener('click', function (e) {
    e.preventDefault()
    console.log(i)
  })
  document.body.appendChild(aDom)
}