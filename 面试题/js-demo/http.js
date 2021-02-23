/**
* 模拟ajax请求
*/
function ajax (url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'json'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(
          JSON.parse(xhr.responseText)
        )
      } else {
        reject(new Error(xhr.statusText))
      }
    }
    xhr.send()
  })
}
