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