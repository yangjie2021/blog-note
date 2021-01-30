# JavaScript

1. Javascript 代码中的"use strict";是什么意思 ? 使用它区别是什么？

## ES6

1. 谈一谈你对ECMAScript6的了解？
2. JavaScript中的作用域与变量声明提升？
3. 说下暂时性死区
4. let,const,var的区别？
5. const真的不能修改吗？
6. 怎么实现一个对象真的不能修改？
7. WeakMap和WeakSet的使用场景
8. 数组和对象有哪些原生方法，列举一下？
9. Object.is() 与原来的比较操作符“ ===”、“ ==”的区别？
10. 创建代理对象,通过代理对象访问属性时抛出错误 Property "${key}" does not exist。

## 基础

1. 介绍js的基本数据类型。
2. JavaScript有几种类型的值？
3. 如何将字符串转化为数字，例如'12.3b'?
4. null，undefined 的区别？
5. 用js实现千位分隔符?
6. 使用JS实现获取文件扩展名？（node&js两种方案）
7. 实现驼峰和下划线转换函数

## 正则表达式

1. 正则表达式 . * + ?分别表示什么？
2. 替换日期格式，xxxx-yy-zz 替换成 xxx-zz-yy 可以使用 正则的捕获组来实现

## 数组

1. 如何实现数组的随机排序？
2. 如何实现数组去重？
3. ["1", "2", "3"].map(parseInt) 答案是多少？
4. 类数组和数组的区别？怎么实现类数组转数组？
5. 怎么判断一个元素存在数组中？

## 函数

1. Javascript作用链域
2. 谈谈this对象的理解。
3. eval是做什么的，有什么缺点和漏洞
4. 什么是闭包（closure），为什么要用它？
5. new操作符具体干了什么呢?
6. call、apply、bind 的区别？
7. 手写call、apply
8. 防抖和节流函数的应用场景，手写实现方式
9. 实现一个柯里化函数
10. 普通函数和箭头函数的区别
11. 写一个深拷贝，考虑 正则，Date这种类型的数据
12. 单例的应用场景

## 事件

1. 事件是？IE与火狐的事件机制有什么区别？ 如何阻止冒泡？
2. 我们给一个dom同时绑定两个点击事件，一个用捕获，一个用冒泡。会执行几次事件，会先执行冒泡还是捕获？
3. 实现一个发布订阅模式（自定义事件） 
4. 为什么会出现事件穿透

## 异步

1. Promise 中的三兄弟 .all(), .race(), .allSettled()

   - Promise.all：返回一个 `Promise` 实例，迭代器所有的`promise`都完成或参数中不包含`promise`时回调完成。有一个失败回调就失败，失败原因是第一个promise的结果
   - Promise.race：返回一个 `promise`函数，迭代器只要有一个promise解决或拒绝，返回的`promise`就会解决或拒绝。
   - Promise.allSettled：回一个`promise`函数，该`promise`在所有给定的`promise`已被解析或被拒绝后解析，并且每个对象都描述每个`promise`的结果。

2. 同步和异步的区别?

3. 对 async/await 的理解，分析内部原理。

4. async/await如果右边方法执行出错该怎么解决？

5. 说一下Event Loop的过程? promise 定义时传入的函数什么时候执行？（小米 三面）

6. setTimeout(()=>{}, 0)的原理

7. 怎么实现一个倒计时

8. 简单实现一个Promise

9. 红灯3秒亮一次,绿灯1秒亮一次,黄灯2秒亮一次,  如何让三个灯不断交替重复亮灯? (用Promise实现)

10. 说说你对同步阻塞，异步非阻塞的理解

11. 按顺序写出控制台打印结果 （2020 碧桂园）

    ```js
    var User = {
         count:1,
         action:{
         getCount:function () {
             return this.count
             }
         }
    }
    var getCount = User.action.getCount;
        setTimeout(() => {
        console.log("result 1",User.action.getCount())
    })
    console.log("result 2",getCount())
    ```

## 对象系统

1. 介绍js有哪些内置对象？
2. 什么是window对象? 什么是document对象?
3. JavaScript原型，原型链 ? 有什么特点？
4. Javascript如何实现继承？
5. JavaScript继承的几种实现方式？
6. javascript创建对象的几种方式？
7. 如何判断一个对象是否属于某个类？
8. Javascript中，有一个函数，执行时对象查找时，永远不会去查找原型，这个函数是？
9. 怎么实现一个JSON.stringfy()？
10. JS 怎么实现一个类。怎么实例化这个类？ECMAScript6 怎么写class么，为什么会出现class这种东西?

## DOM

1. documen.write和 innerHTML的区别

2. DOM操作——怎样添加、移除、移动、复制、创建和查找节点?

3. 怎么实现getElementsByClassName

4. 统计HTML标签中以b开头的标签数量

5. 统计HTML标签中出现次数最多的标签

6. 判断DOM标签的合法性
   - 标签的闭合
   - span里面不能有div
   - 其他符合HTML标签合法性的规则
   
7. 如何监听你调到了其他页面`document.hidden`，监听 `docuemnt.vibibleChange`事件

8. JS原生3种绑定事件?

9. offsetTop是div到哪里的距离？

   **HTMLElement.offsetLeft**和**HTMLElement.offsetTop**这两个属性是基于offsetParent的。

   - 如果当前元素的父级元素没有进行CSS定位（position为absolute或relative）,offsetParent为body.
   - 假如当前元素的父级元素中有CSS定位，offsetParent取最近的那个父级元素。
   - offsetLeft返回当前元素左上角相对于  HTMLElement.offsetParent 节点的左边界偏移的像素值。
   - offsetTop返回当前元素相对于其 offsetParent 元素的顶部的距离。

## 编程题

1. 手写一个ajax

   ```js
   // get
   const xhr = new XMLHttpRequest()
   xhr.open('GET', '/api', false) // false 异步请求
   xhr.onreadystatechange = function () {
     if (xhr.readyState === 4) { // 请求状态码
       if(xhr.status === 200) { // 响应状态码
   			console.log(JSON.parse(xhr.responseText))
   		} else {
         console.log('返回数据失败')
       }
   	}
   }
   xhr.send(null)
   
   // post
   const postData = {
     userName: 'sunshine',
     password: '123'
   }
   xhr.send(JSON.stringfy(postData))
   ```

2. 防抖实现方式

   ```js
   function debounce (fn, delay) {
     let timer = null
     return function () {
       if (timer) clearTimeout(timer)
       timer = setTimeout(() => {
         fn.apply(this, arguments)
       }, delay)
     }
   }
   
   function debounceFn(text){
     console.log(text)
   }
   
   window.addEventListener("scroll", debounce(debounceFn,1000).bind(window, '防抖'))
   ```

3. 节流实现方式

   ```js
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
   
   function throttleFn (text) {
     console.log(text)
   }
   
   window.addEventListener("scroll", throttle(throttleFn, 1000).bind(window, '节流'))
   ```

4. 实现一个数组的flatten

   ```js
   function flatten(arr){
        while(arr.some(item => Array.isArray(item))){
              arr =  [].concat.apply([],arr);
        }
         return arr;
   }
   ```

5. 实现一个深拷贝

6. 实现一个apply，call

7. 实现一个bind

8. 实现一个柯里化函数，sum(1,2,3)=6

9. 二分查找

10. 实现一个请求函数，传入一个url数组，和并发请求的数量。

11. “abcabcdabcdeabcdefhijklmnkjhxlkdslkcjdslk”，查找字符串中最长的连续字母片段

12. 写一个请求函数，传入一个url，如果请求失败，第一次1s后重试，第二次1.5s后重试，第三次2.25s，第四次不试了

    fetchAPI

13. 实现一个版本对比的函数，比较版本号大小

14. 创建代理对象,通过代理对象访问属性时抛出错误 `Property "${key}" does not exist`

    ```js
    const man = {
    	name: 'jscoder',
    	age: 22
    }
    
    const pMan = new Proxy(man, {
    	get(target, key){
    		if (key in target) {
    			return target[key]
    		} else {
    			throw new Error(`Property "${key}" does not exist`)
    		}
    	}
    })
    ```

15. 红灯3秒亮一次,绿灯1秒亮一次,黄灯2秒亮一次,  如何让三个灯不断交替重复亮灯? 

    用Promise实现三个亮灯函数已经存在

    ```js
    function red(){
    	console.log('red')
    }
    function green(){
    	console.log('green')
    }
    function yellow(){
    	console.log('yellow')
    }
    
    var light = function(timmer, cb){
    	return new Promise(function(resolve, reject) {
    		setTimeout(function() {
    			cb()
    			resolve()
    		}, timmer)
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
    ```

16. 按顺序写出控制台打印结果 （2020 碧桂园）

    ```js
    var User = {
         count:1,
         action:{
         getCount:function () {
             return this.count
             }
         }
    }
    var getCount = User.action.getCount;
        setTimeout(() => {
        console.log("result 1",User.action.getCount())
    })
    console.log("result 2",getCount())
    ```

    在浏览器环境下打印结果是：result 2 undefined，result 1 undefined

    result 2  中执行的函数getCount()没有执行主体，里面函数的 this 是window，所以打印undefined

    result 1 中执行的方法getCount()前面的执行者是action，而action中没有count熟悉，所以打印结果是 undefined

    尝试改变this指向：

    ```js
    var User = {
      count: 1,
      action: {
        getCount: function() {
          return this.count
        }
      }
    }
    var getCount = User.action.getCount.bind(User)
    setTimeout(() => {
    	console.log('result1-', User.action.getCount.call(User))
    })
    console.log('reslut2-', getCount())
    ```


## 库

1. Underscore 对哪些 JS 原生对象进行了扩展以及提供了哪些好用的函数方法？
2. 前端templating(Mustache, underscore, handlebars)是干嘛的, 怎么用?
3. 简述一下 Handlebars 的基本用法？
4. 简述一下 Handlerbars 的对模板的基本处理流程， 如何编译的？如何缓存的？

## 题海

1. 第一次访问页面中时弹出引导，用户关闭引导，之后再次进入页面时不希望出现引导，如何实现？

