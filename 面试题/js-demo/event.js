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

/**
 * 一次性插入多个DOM节点，考虑性能该如何实现
 */
const listNode = document.getElementById('list')
const frag = document.createDocumentFragment()
for (let i = 0; i< 10; i++) {
  const li = document.createElement('li')
  li.innerHtml = "list item" + i
  frag.appendChild(li)
}
listNode.appendChild(frag)

/**
 * 创建10个`<a>`标签，点击的时候分别弹出对应的序号
 */
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

/**
 * url参数转json
 */
function getUrlParam() {
  const href = window.location.href;
  const args = href.split('?');
  if (args[0] === href) {
    return ''
  }
  const arr = args[1].split('&');
  const obj = {}
  for (const i = 0; i < arr.length; i++) {
    const arg = arr[i].split('=')
    obj[arg[0]] = arg[1]
  }
  return obj
}

/**
* 将对象使用&拼接成url
*/
function queryStringify (obj) {
  function toQueryPair(key,value) {
    if (!value) {
      return key
    }
    return key + '=' + encodeURIComponent(!value ? '' : String(value))
  }

  var result = []

  for (var key in obj) {
    key = encodeURIComponent(key)
    var values = obj[key]
  
    if (values && values.constructor == Array) {
      var queryValues = []
      for (var i = 0, len = values.length; i < len; i++) {
        queryValues.push(toQueryPair(key, values[i]))
      }
      result = result.concat(queryValues)
    } else {
      result.push(toQueryPair(key,values))
    }
  }

  return result.join('&')

}
// queryStringify({name: 'leafront', list: [1,2,3]})