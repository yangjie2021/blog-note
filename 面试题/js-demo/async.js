// 红绿灯任务控制
function red(){
	console.log('red')
}
function green(){
	console.log('green')
}
function yellow(){
	console.log('yellow')
}

var light = function(timer, cb){
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			cb()
			resolve()
		}, timer)
	})
}

var step = function() {
	Promise.resolve().then(function(){
		return light(3000, red);
	}).then(function(){
		return light(2000, yellow);
	}).then(function(){
		return light(1000, green);
	}).then(function(){
		step();
	});
}

step()

const taskRunner = async () => {
  await light(3000, red)
  await light(2000, yellow)
  await light(1000, green)
  taskRunner()
}

taskRunner()

// 图片预加载


/**
 * 实现一个异步方法的串行和并行
 */
function asyncAdd(a, b, callback) {
  setTimeout(function () {
    callback(null, a + b);
  }, 500);
}

const promiseAdd = (a, b) => new Promise((resolve, reject) => {
  asyncAdd(a, b, (err, res) => {
    if (err) {
      reject(err)
    } else {
      resolve(res)
    }
  })
})

// 串行
async function serialSum(...args) {
  return args.reduce((task, now) => task.then(res => promiseAdd(res, now)), Promise.resolve(0))
}

// 并行
async function parallelSum(...args) {
  if (args.length === 1) return args[0]
  const tasks = []
  for (let i = 0; i < args.length; i += 2) {
    tasks.push(promiseAdd(args[i], args[i + 1] || 0))
  }
  const results = await Promise.all(tasks)
  return parallelSum(...results)
}

/* 测试
(async () => {
  console.log('Running...');
  const res1 = await serialSum(1, 2, 3, 4, 5, 8, 9, 10, 11, 12)
  console.log(res1)
  const res2 = await parallelSum(1, 2, 3, 4, 5, 8, 9, 10, 11, 12)
  console.log(res2)
  console.log('Done');
})()
*/


