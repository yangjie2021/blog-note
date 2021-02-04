# JavaScript

1. 数据类型有哪些？

   基本数据类型：boolean，string，number，undefined，null，symbol

   引用数据类型：对象

   - 原生对象：内置对象（包装类：Symbol，Number，Boolean，String）和arguments
   - 宿主对象：浏览器环境对象（window，document等）NodeJs环境对象（global等）
   - 引擎扩展对象：XML，Script等

2. 数据类型判断的方式

   - typeof 操作符：判断基本类型的数据，但是typeof null 返回的是“object” ，因为null表示一个空对象指针
   - instanceof 运算符：用来判断数据是否是某个对象的实例，返回一个布尔值。缺点：不能直接判断基本数据类型；不能判断null和undefined；不能区分数组和对象；判断必须在当前页面声明。
   - constructor：与instanceof 类似，查看目标构造函数，也可以进行数据类型判断。但是不能判断 null 和 undefined，因为这两个特殊类型没有其对应的包装对象
   - Array.isArray()：为了解决instanceof当前页声明的问题，判断数组是否为数组
   - Object.prototype.toString：toString()方法是定义在Object的原型对象Object.prototype上的，Object的每个实例化对象都可以共享Object.prototype.toString()方法，可以说Object.prototype.toString.call(xxx) 是类型判断的终极解决方案

3. instanceof的原理?

   用来检测某个实例对象的原型链上是否存在构造函数的 prototype 属性。

   - 判断实例对象的隐式原型`__proto__`是否等于构造函数的显示原型`prototype`
   - 如果相等返回`true`，否则**递归向上查找**至原型链顶端
   - 直至Object.prototype顶端与null比较，如果都不相等，返回`false`

4. 什么是原型链？

   函数上的prototype属性为**原型**/**显示原型**，原型指向的对象称之为**原型对象**。函数上的constructor属性为函数构造器。对象上的 `__proto__`属性为**隐式原型**。函数被new之后就变成了**构造函数**，构造函数返回的值为**实例**。

   实例对象继承了其构造函数的原型对象，原型对象也是对象，它也继承它的构造函数的原型对象，以此类推，实例对象和原型对象之间就形成了一条链路，即**对象所有的父类和祖先类的原型所形成的可上溯访问的链表**，称之为**原型链**。

   所有普通对象最终都指向内置的 `Object.prototype`— **对象原型**，它会指向一个空指针 **null**，也就是原型链的顶端，如果在原型链中找不到指定的属性就会停止。

5. 如何判断一个对象是否为数组？

   ```js
   // 1.判断是否属于数组实例
   [] instanceof Array === true
   // 2. 通过对象的原型方法判断
   Object.prototype.toString.call(arr)
   // 3. 判断值是不是数组
   Array.isArray([])
   // 4. constructor
   [].constructor === Array
   ```

6. 何时使用 === ，何时使用 ==？

   除了 `== null`之外，其余都用 `===`，因为 `obj == null`是 `obj === null || obj === undefined`的简写，可以用来判断一个对象是否存在且不为空。eslint校验规则和jq源码中都这样使用

7. 值类型和引用类型的区别？

   值类型：String,Number,Boolean,Null,Undefined, Symbol都会分配栈区。它的值是存放在栈中的简单数据段，数据大小确定，内存空间大小可以分配；按值存放，所以可以**按值访问**。

   引用类型： Object （对象）的变量都放到堆区。它在栈内存中保存的实际上是**对象在堆内存中的引用地址**， 通过这个引用地址可以快速查找到保存在堆内存中的对象。存放在堆内存中的对象，每个空间大小不一样，要根据情况进行特定的配置。

8. new的实现原理

   - 创建一个空对象，这个对象将会作为执行构造函数之后返回的对象实例
   - 将这个空对象的隐式原型（`__proto__`）指向构造函数的显示原型（ `prototype`）
   - 将这个空对象赋值给构造函数内部的this，并执行构造函数逻辑
   - 根据构造函数执行逻辑，如果构造函数返回了一个对象，那么这个对象会取代 new 出来的结果，否则 new 函数会自动返回这个新对象

9. 事件循环是怎么回事？

   主线程读取任务队列中事件的过程是循环不断的，所以这种运行机制又称为Event Loop（事件循环）。

   - 主线程：代码执行的线程。JavaScript是单线程的，但是浏览器不是单线程的，或者说js调用的某些浏览器内部API不是单线程的，例如setTimeOut计时器
   - 任务队列：一个事件的队列，执行任务的时候需要排队，所以形成了任务队列。IO设备完成一项任务，就在任务队列中添加一个事件，表示相关的异步任务可以进入**执行栈**了

10. 宏任务和微任务的区别？

   事件循环用两个队列来处理异步任务。以setTimeout为代表的任务被称为宏任务，放到宏任务队列中，而以Promise 为代表任务被称为微任务，放到微任务队列中。

   事件循环对这两个队列的处理逻辑也不一样，一次事件循环会处理**一个宏任务**和所有**这次循环中产生的微任务**。

   - JavaScript引擎首先从宏任务队列中取出第一个任务
   - 执行完毕后，将微任务队列中的所有任务取出，按顺序全部执行（执行当前微任务和执行过程中产生的微任务）
   - 然后再从宏任务队列中取出下一个， 执行完毕后，再次将微任务队列中的全部取出； 
   - 循环往复，直到两个queue中的任务都取完

11. 什么是作用域？

    标识符（变量）在程序中的可见性范围。作用域是按照具体规则维护标识符的可见性，以确定当前执行的代码对这些标识符的访问权限。作用域是在具体的作用域规则之下确定的。

12. 闭包的原理？

    一段代码丢给了浏览器，**编译阶段**编译器先进行词法分析，创建**词法作用域**和**变量对象** Variable Object（简称VO），同时会进行变量/函数提升。然后将代码转换成**词法单元**，生成**抽象语法树**（AST），最后解析AST后生成浏览器识别的代码，然后这段代码就丢给了执行环境执行。

    在**执行阶段**，解释执行全局代码、调用函数等都会创建并进入一个新的**执行环境**，而这个执行环境被称之为**执行上下文**。执行上下文包含了变量对象，作用域链及this指向等属性。其中变量对象转换成了**活动对象**Active Object（简称AO），然后当前执行环境的变量对象和所有外层已经完成激活的活动对象组成了**作用域链**，作用域链的查找规则遵循**LHS规则**，这个规则规定了如果未在当前作用域中找到变量，则继续向上查找直到全局作用域。执行上下文会被压入执行环境栈，即**入栈**。函数执行之后，上下文即被销毁，即**出栈**，销毁的过程中就会触发**垃圾回收**。

    因为作用域链有由内而外的，所以全局作用域是无法访问函数内部作用域变量的。但是，如果外部函数中返回了一个函数，这个函数提供一个了**执行上下文**，在这个上下文中引用其它上下文的变量对象时，垃圾回收监听这个引用（可达对象）还在，就不会进项回收。当你在当前执行环境中访问它时，它还是在内存当中的。

    这就是**闭包**的基本原理。

13. Promise链式调用，如果第一个then返回的结果是数字或者函数，后面的then返回什么？

14. Promise 中的三兄弟 .all(), .race(), .allSettled()分贝代表什么含义？

15. 对 async/await 的理解，分析内部原理

    Promise解决了回调地狱的问题，但是如果遇到复杂的业务，代码里面会包含大量的 then 函数，使得代码依然不是太容易阅读。基于这个原因，ES7 引入了 async/await，提供了在不阻塞主线程的情况下使用同步代码实现异步访问资源的能力，并且使得代码逻辑更加清晰，而且还支持 try-catch 来捕获异常，非常符合人的线性思维。

    async 是一个通过异步执行并隐式返回 Promise 作为结果的函数。是Generator函数的语法糖，并对Generator函数进行了改进，彻底告别**执行器和生成器**，实现更加直观简洁的代码。

    它的重点是自带了执行器，相当于把我们要额外做的(写执行器/依赖co模块)都封装了在内部。

    ```js
    function getNum(num){
    	return new Promise((resolve, reject) => {
      	setTimeout(() => {
        	resolve(num+1)
      	}, 1000)
      })
    }
    
    //自动执行器,如果一个Generator函数没有执行完,则递归调用
    function asyncFun(func){
      var gen = func()
    
      function next(data){
        var result = gen.next(data);
        if (result.done) return result.value;
        result.value.then(function(data){
        next(data)
        })
      }
    
      next()
    }
    
    // 所需要执行的Generator函数,内部的数据在执行完成一步的promise之后,再调用下一步
    var func = function* (){
      var f1 = yield getNum(1)
      var f2 = yield getNum(f1)
      console.log(f2)
    }
    asyncFun(func)
    ```

16. 若 `a=1，b=2 表达式`a+++b`的返回结果是什么？引擎是如何解析的

    结果为3，++运算符的优先级高于+运算符，所以先执行a++得到1，然后1+b=3

17. 遍历数组的方式有哪些？

18. 防抖和节流的区别是什么？实现原理是怎样的？

19. 事件传播是怎么回事？

20. offsetTop是元素相对于哪里的距离？

21. Proxy和Object.defineProperty的区别？

    - Proxy代理整个对象，Object.defineProperty只代理对象上的某个属性 
    - 如果对象内部要全部递归代理，则Proxy可以只在调用时递归，而Object.defineProperty需要在一开始就全部递归，Proxy性能优于Object.defineProperty
    - Proxy 可以**监视**读写以外的操作，比如deleteProperty方法监听删除
    - Proxy 可以很方便的监视数组操作，因为set有target, property, value三个入参
    - Proxy 不需要侵入对象
    - Proxy不兼容IE，Object.defineProperty不兼容IE8及以下

## 编程题

1. 实现一个深拷贝

2. 手写一个ajax

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

3. 防抖实现方式

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

4. 节流实现方式

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

5. 实现一个数组的flatten

   ```js
   function flatten(arr){
        while(arr.some(item => Array.isArray(item))){
              arr =  [].concat.apply([],arr);
        }
         return arr;
   }
   ```

6. 实现一个深拷贝

7. 实现一个apply，call

8. 实现一个bind

9. 实现一个柯里化函数，sum(1,2,3)=6

10. 二分查找

11. 实现一个请求函数，传入一个url数组，和并发请求的数量。

12. “abcabcdabcdeabcdefhijklmnkjhxlkdslkcjdslk”，查找字符串中最长的连续字母片段

13. 写一个请求函数，传入一个url，如果请求失败，第一次1s后重试，第二次1.5s后重试，第三次2.25s，第四次不试了

    fetchAPI

14. 实现一个版本对比的函数，比较版本号大小

15. 创建代理对象,通过代理对象访问属性时抛出错误 `Property "${key}" does not exist`

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

16. 红灯3秒亮一次,绿灯1秒亮一次,黄灯2秒亮一次,  如何让三个灯不断交替重复亮灯? 

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

17. 按顺序写出控制台打印结果 （2020 碧桂园）

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
1. Javascript 代码中的"use strict";是什么意思 ? 使用它区别是什么？
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
1. 介绍js的基本数据类型。
2. JavaScript有几种类型的值？
3. 如何将字符串转化为数字，例如'12.3b'?
4. null，undefined 的区别？
5. 用js实现千位分隔符?
6. 使用JS实现获取文件扩展名？（node&js两种方案）
7. 实现驼峰和下划线转换函数
1. 正则表达式 . * + ?分别表示什么？
2. 替换日期格式，xxxx-yy-zz 替换成 xxx-zz-yy 可以使用 正则的捕获组来实现
1. 如何实现数组的随机排序？
2. 如何实现数组去重？
3. ["1", "2", "3"].map(parseInt) 答案是多少？
4. 类数组和数组的区别？怎么实现类数组转数组？
5. 怎么判断一个元素存在数组中？
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
1. 事件是？IE与火狐的事件机制有什么区别？ 如何阻止冒泡？
2. 我们给一个dom同时绑定两个点击事件，一个用捕获，一个用冒泡。会执行几次事件，会先执行冒泡还是捕获？
3. 实现一个发布订阅模式（自定义事件） 
4. 为什么会出现事件穿透
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