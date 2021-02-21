const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor (executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }

  status = PENDING
  result = undefined
  reason = undefined
  resolveCbStack = []
  rejectCbStack = []

  resolve = result => {
    if(this.status !== PENDING) return
    this.result = result
    this.status = FULFILLED

    while (this.resolveCbStack.length) {
      this.resolveCbStack.shift()()
    }
  }
  reject = reason => {
    if(this.status !== PENDING) return
    this.reason = reason
    this.status = REJECTED

    while (this.rejectCbStack.length) {
      this.rejectCbStack.shift()()
    }
  }
  then (resolveCb, rejectCb) {
    // 透传
    resolveCb = resolveCb ? resolveCb : value => value
    rejectCb = resolveCb ? resolveCb : reason => { throw reason }
    /**
     * setTimeout的作用
     * 将执行器函数放在异步任务中执行是为了获取到promise2的值
     * 对比上一个then的结果，防止循环调用同一个promise
     */
    let promise2
    if (this.status === FULFILLED) {
      promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let prevResult = resolveCb(this.result)
            resolvePromise(promise2, prevResult, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      })
    }
    if (this.status === REJECTED) {
      promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let prevReason = rejectCb(this.reason)
            resolvePromise(promise2, prevReason, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
    } 
    if (this.status === PENDING) {
      promise2 = new MyPromise((resolve, reject) => {
        this.resolveCbStack.push(() =>{
          setTimeout(() => {
            try {
              let prevResult = resolveCb(this.result)
              resolvePromise(promise2, prevResult, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.rejectCbStack.push(() => {
          setTimeout(() => {
            try {
              let prevReason = rejectCb(this.reason)
              resolvePromise(promise2, prevReason, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      })
    }
    return promise2
  }
  finally (callback) {
    return this.then(value => {
      return MyPromise.resolve(callback()).then(() => value);
    }, reason => {
      return MyPromise.resolve(callback()).then(() => { throw reason })
    })
  }
  catch (rejectCallback) {
    return this.then(undefined, failCallback)
  }
  static all (array) {
    let result = [];
    let index = 0;
    return new MyPromise((resolve, reject) => {
      function addData (key, value) {
        result[key] = value;
        index++;
        if (index === array.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < array.length; i++) {
        let current = array[i];
        if (current instanceof MyPromise) {
          // promise 对象
          current.then(value => addData(i, value), reason => reject(reason))
        }else {
          // 普通值
          addData(i, array[i]);
        }
      }
    })
  }
  static resolve (result) {
    if (result instanceof MyPromise) return result;
    return new MyPromise(resolve => resolve(result));
  }
  static reject (reason) {
    if (reason instanceof MyPromise) return reason;
    return new MyPromise(reason => { throw reason });
  }
}

function resolvePromise(promise2, prevResult, resolve, reject) {
  if(promise2 === prevResult) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  
  if (prevResult instanceof MyPromise) {
    prevResult.then(resolve, reject)
  } else {
    resolve(prevResult)
  }
}

