# JavaScript

## 基础

1. 数据类型有哪些？

   基本数据类型：boolean，string，number，undefined，null，symbol

   引用数据类型：对象

   - 原生对象：内置对象（包装类：Symbol，Number，Boolean，String）和arguments
   - 宿主对象：浏览器环境对象（window，document等）NodeJs环境对象（global等）
   - 引擎扩展对象：XML，Script等

2. 数据类型判断的方式

   - typeof 操作符：判断基本类型的数据，但是typeof null 返回的是“object” ，因为null表示一个空对象指针
   - instanceof 运算符：用来判断数据是否是某个对象的实例，返回一个布尔值。缺点是不能直接判断基本数据类型；不能判断null和undefined；不能区分数组和对象；判断必须在当前页面声明。
   - constructor：与instanceof 类似，查看目标构造函数，也可以进行数据类型判断。但是不能判断 null 和 undefined，因为这两个特殊类型没有其对应的包装对象
   - Array.isArray()：为了解决instanceof当前页声明的问题，判断数组是否为数组
   - Object.prototype.toString.call(xxx)：终极解决方案，定义在Object的原型对象Object.prototype上方法

3. 值类型和引用类型的区别？

   值类型：String,Number,Boolean,Null,Undefined, Symbol都会分配栈区。它的值是存放在栈中的简单数据段，数据大小确定，内存空间大小可以分配；按值存放，所以可以**按值访问**。

   引用类型： Object （对象）的变量都放到堆区。它在栈内存中保存的实际上是**对象在堆内存中的引用地址**， 通过这个引用地址可以快速查找到保存在堆内存中的对象。存放在堆内存中的对象，每个空间大小不一样，要根据情况进行特定的配置。

4. 写出代码的打印结果

   ```js
   var a = 1;
   var b = 2;
   console.log(a+++b)
   ```

   结果为3，++运算符的优先级高于+运算符，所以先执行a++得到1，然后1+b=3

## 类型转换

1. 怎么用没有数字的代码返回-1

   "".indexOf()，-true，~false

2. 何时使用 === ，何时使用 ==？

   除了 `== null`之外，其余都用 `===`，因为 `obj == null`是 `obj === null || obj === undefined`的简写，可以用来判断一个对象是否存在且不为空。eslint校验规则和jq源码中都这样使用

3. 常见的逻辑判断返回false的值有哪些？

   0，NaN，空字符串，null，undefined，false

4. 设置一个变量a，使得if语句能够执行

   ```
   var a = ?;
   if (a == 1 && a == 2 && a == 3) {
       console.log(1);
   }
   ```

   方式1. 将a设置为一个对象，并自定义一个`toString`方法

      因为隐式类型转换，`==`时会将**对象a**转为字符串再转为数字类型，过程中会调用到对象原型链中的`toString`方法

      ```js
   var a = {
     i: 0,
     toString() {
       return ++this.i
     }
   }
   
   if (a == 1 && a == 2 & a == 3) {
     console.log(1)
   }
      ```

   方式2. 使用`Object.definedProperty`（或者Proxy）数据拦截再处理，拦截到获取a的时候，按对应次数返回1，2，3

      ```js
   var i = 0;
   Object.defineProperty(window, "a", {
     get() {
       return ++i;
     }
   })
   
   if (a == 1 && a == 2 & a == 3) {
     console.log(1)
   }
      ```

9.    `[1,2,3].map(parseInt)`的结果

   代码补全如下：

   ```js
   [1,2,3].map((item, index) => {
     return parseInt(item, index);
   })
   
   parseInt(1, 0)	// 把1当做10进制，转为10进制
   parseInt(2, 1)	// 把2当做1进制，没有在2-36之间，所以转为NaN
   parseInt(3, 2)	// 把3当做2进制，转为10进制，但是2进制只有1，0符合，所以为NaN
   // 1, NaN, NaN
   ```

10. 求下列题内容输出

    ```js
    let result = 100 + true + 21.2 + null + undefined + "Tencent" + [] + null + 9 + false;
    console.log(result); // NaNTencentnull9false
    
    console.log([]==false);// true
    console.log(![]==false);// true
    ```

    1. 数字+undefined的结果是NaN
    2. 字符串连接值都会转换为字符串

## 原型链

1. 什么是原型和原型链？

   原型：函数上的prototype属性为**原型**/**显示原型**，对象上的 `__proto__`属性为**隐式原型**

   - 每个class都有显示原型，每个实例都有隐式原型
   - 实例的隐式原型指向对应class的显示原型

   原型链：**对象所有的父类和祖先类的原型所形成的可上溯访问的链表**

   - 实例对象继承了其构造函数的原型对象，原型对象也是对象，它也继承它的构造函数的原型对象，以此类推，实例对象和原型对象之间就形成了一条链路
   - 所有普通对象最终都指向内置的 `Object.prototype`— **对象原型**，它会指向一个空指针 **null**，也就是原型链的顶端，如果在原型链中找不到指定的属性就会停止。

9. 如何判断一个对象是否为数组？

   1. 判断是否属于数组实例：`[] instanceof Array === true`
   2. 通过对象的原型方法判断：`Object.prototype.toString.call(arr)`
   3. 判断值是不是数组：`Array.isArray([])`
   4. 构造器constructor：`[].constructor === Array`

10. instanceof的原理?

    用来检测某个实例对象的原型链上是否存在构造函数的 prototype 属性

    - 判断实例对象的隐式原型`__proto__`是否等于构造函数的显示原型`prototype`
    - 如果相等返回`true`，否则**递归向上查找**至原型链顶端
    - 直至Object.prototype顶端与null比较，如果都不相等，返回`false`

11. class的原型本质如何理解？

    获取实例的属性时，先在自身的属性和方法中寻找，找不到就会自动查找隐式原型

12. new的实现原理

    - 创建一个空对象，这个对象将会作为执行构造函数之后返回的对象实例
    - 将这个空对象的隐式原型（`__proto__`）指向构造函数的显示原型（ `prototype`）
    - 将这个空对象赋值给构造函数内部的this，并执行构造函数逻辑
    - **根据构造函数执行逻辑，如果构造函数返回了一个对象，那么这个对象会取代 new 出来的结果，否则 new 函数会自动返回这个新对象**

13. 遍历对象的方式有哪些？

    | 遍历方式\支持特性              | string属性 | Symbol属性 | 不可枚举属性 | 原型属性 |
    | ------------------------------ | ---------- | ---------- | ------------ | -------- |
    | for...in                       | √          | ×          | ×            | √        |
    | Object.keys()                  | √          | ×          | ×            | ×        |
    | Object.getOwnPropertyNames()   | √          | ×          | √            | ×        |
    | Object.getOwnPropertySymbols() | ×          | √          | √            | ×        |
    | Reflect.ownKeys()              | √          | √          | √            | ×        |

7. for...in 、forEach 和 for...of，map的区别

   1. for...of是异步执行的，常用于异步的遍历，for...in和forEach是同步执行的

      ```js
      !(async function() {
        for (let i of nums) {
          const res = await muti(i)
          console.log(res)
        }
      })()
      ```

   

8. 类数组转数组的方式有哪些？

## 作用域和闭包

1. 什么是作用域？

   标识符（变量）在程序中的可见性范围。作用域按照具体规则维护标识符的可见性，以确定当前执行的代码对这些标识符的访问权限。

   1. 全局作用域
   2. 局部作用域
   3. 块级作用域（ES6新增）

2. 什么是暂时性死区？

   运行流程一进入作用域创建变量，到变量开始可被访问之间的一段时间，就称之为暂时性死区，作用是防止变量提升，即变量预解析。
   var定义的变量会预解析,如果变量没有定义就直接使用的话,JavaScript回去解析这个变量,代码不会报错,只会输出undefined。let/const定义的变量不会预解析,必须先声明再使用,否则会报错

3. js的解析过程

   **编译阶段**：

   1. 编译器先进行词法分析，创建**词法作用域**和**变量对象** Variable Object（简称VO），同时会进行变量/函数提升。
   2. 将代码转换成**词法单元**，生成**抽象语法树**（AST）
   3. 解析AST后生成浏览器识别的代码，丢给执行环境执行。

   **执行阶段**：

   1. 解释执行全局代码、调用函数等都会创建并进入一个新的**执行环境**，而这个执行环境被称之为**执行上下文**。
   2. 执行上下文包含了变量对象，作用域链及this指向等属性。
   3. 变量对象转换成了**活动对象**Active Object（简称AO）
   4. 当前执行环境的变量对象和所有外层已经完成激活的活动对象组成了**作用域链**，作用域链的查找规则遵循**LHS规则**：如果未在当前作用域中找到变量，则继续向上查找直到全局作用域，注意变量查找是在函数定义的地方查找，不是在执行的地方。
   5. 执行上下文会被压入执行环境栈，即**入栈**。
   6. 函数执行之后，上下文即被销毁，即**出栈**，销毁的过程中就会触发**垃圾回收**。

4. 闭包的原理？

   1. 闭包是一种机制：只要函数执行，形成自己的私有上下文，保护了自己的私有变量，不被外界干扰就会形成闭包
   2. 当外界上下文占用了函数执行形成的私有上下文中的变量时，私有上下文得不到出栈释放，使得函数中的变量得以保留不被浏览器的垃圾回收机制销毁，这就是闭包的作用
   3. 闭包 = 包含自由变量的函数 + 使所有自由变量都获得绑定值的环境

5. 实际开发中闭包的应用场景，举例说明

   实现方式：

   1. 函数作为参数被传递
   2. 函数作为返回值被返回

   应用场景：

   1. 隐藏数据：缓存函数
   4. **getter/setter**：数据响应式，保存oldValue
   3. 迭代器：iterator
   4. 模块化：单例模式，利用单独的实例来管理事物相关的特征，实现模块划分
   5. 惰性函数：储存已经执行过一次的函数
   6. 函数柯里化：利用闭包保存机制，把一些信息预先存储下来（预处理的思想）
   7. 函数的防抖和节流

6. this在不同的场景下如何取值？

   this的取值是在函数执行时决定的，不是在定义时决定的。

   1. 当做普通函数被调用时，在严格模式下，函数内的this会被绑定到`undefined`上，在非严格模式下则会被绑定到全局对象`window/global`上。
   2. 通过 `call/apply/bind` 方法显式调用构造函数时，构造函数的 `this` 会被绑定到新创建的对象上
   3. 作为对象方法调用或使用上下文对象调用函数时，函数体内的this会被绑定到该对象上
   4. 使用`new`方法调用构造函数时，构造函数内的this会被绑定到新创建的实例上
   5. 在箭头函数中，`this`的指向是由外层（函数或全局）作用域来决定的

7. 创建10个`<a>`标签，点击的时候分别弹出对应的序号

   ```js
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
   ```

8. 写出打印结果并分析

   ```js
   var x = 1;
   function func(x, y = function anonymous1() {x = 2}) {
       x = 3;
       y();
       console.log(x);
   }
   func(5);
   console.log(x);
   ```

   答案：2，1

   1. `EC(func)`中的`x = 3;`影响`EC(func)`中的形参x
   2. `EC(anonymous1)`中的`x=2`影响  `EC(func)`中的形参x，因为`EC(anonymous1)`并没有x，所以打印2
   3. 最后一个log打印`EC(G)`中的x = 1

9. 修改下面的代码，让循环输出的结果依次为1， 2， 3， 4， 5

   ```js
   for (var i=1; i<=5; i++) {
       setTimeout(function timer() {
           console.log(i)
       }, 1000 )
   }
   ```

   方案1：闭包

   ```js
   for (var i = 1; i <= 5; i++) {
     log(i) // 1 2 3 4 5
   }
   function log(i) {
     setTimeout(function timer() {
       console.log(i)
     }, 1000)
   }
   ```

   方案2：立即执行函数

   ```js
   for (var i = 1; i <= 5; i++) {
     (function (i) {
       setTimeout(function timer() {
         console.log(i)
       }, 1000)
     })(i)
   }
   ```

    方案3：块级作用域

   ```js
   for (let i=1; i<=5; i++) {
     setTimeout(function timer() {
       console.log(i)
     }, 1000 )
   }
   ```

10.  列举call，apply，bind的应用场景

     call的应用：**类数组转换为数组**

     1. ` [].slice.call(arguments)`` 
     2. ``Array.prototype.slice.call(arguments)`
     3. [].forEach.call(arguments, item => {})`

     apply应用：**获取数组中的最大值**

     ```js
     let arr = [4, 6, 10, 3, 5];
     console.log(Math.max.apply(Math, arr))
     ```

      bind应用：**改变点击事件的this**

     ```js
     document.body.onclick = func.bind(obj, 10, 20)
     ```

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

    结果：result 2 undefined，result 1 undefined

    1. result 2  中执行的函数getCount()没有执行主体，里面函数的 this 是window，所以打印undefined
    2. result 1 中执行的方法getCount()前面的执行者是action，而action中没有count熟悉，所以打印结果是 undefined。如果想输出1，可以通过`bind(user)`的方式改变this指向


## 异步

1. 同步和异步的区别

   异步是基于js是单线程语言的本质产生的，异步不会阻塞代码执行，同步会阻塞代码执行。

   JavaScript是单线程的，但是浏览器不是单线程的，例如setTimeOut 等 webAPI
   
2. 异步的应用场景有哪些？

      1. 网络请求：ajax
      2. 图片加载：img.onload
      3. 定时任务：setTimeOut，setInterval

3. 事件循环是怎么回事？event loop/事件循环/事件轮询机制

   主线程读取任务队列中事件的过程是循环不断的，所以这种运行机制又称为Event Loop（事件循环）。

   - 主线程：代码执行的线程
   - 任务队列：一个事件的队列，执行任务的时候需要排队，所以形成了任务队列。

   event loop过程：

   1. 同步代码，一行一行放在call Stack执行
   2. 遇到异步，先记录下来，等待时机（定时，网络请求等）
   3. 时机到了，移动到Callback Queue
   4. 同步代码执行完，event loop开始工作
   5. 轮询查找 Callback Queue，如果有任务移动到call Stack执行
   6. 继续轮询查找，循环往复，直到两个queue中的任务都取完

4. 宏任务和微任务的区别？

   1. 宏任务：Callback Queue中等待的任务，执行过程中增加的额外任务可以作为新的宏任务进到队列排队，包括setTimeout，setInterval，Ajax，DOM事件，postMessage，requestAnimationFrame，UI渲染
   2. 微任务：直接在当前任务结束过后立即执行，promise的回调会作为微任务执行，它的作用是为了提高整体的响应能力，包括Promise、MutationObserver、process.nextTick
   3. 事件循环与DOM渲染：因为每次调用栈中同步任务执行之后，浏览器都会DOM渲染，DOM结构如有改变则重新渲染，然后再触发下一次事件循环。
   4. 微任务比宏任务的执行时机早：宏任务是在DOM渲染后触发，微任务是在DOM渲染前触发

5. 手写Promise的实现思路

      **基础结构**

      1. 入参：立即执行的执行器函数 executor(resolve,reject)
      2. 状态：成功 fulfilled、失败 rejected、等待 pending
      3. 成功/失败返回值：成功返回结果 result，失败返回原因 reason
      4. 等待状态存储成功/失败回调：成功存储 resolveCbStack，失败存储 rejectCbStack

      **实例方法**

      1. resolve：将状态改为fulfilled，记录成功返回结果
      2. reject：将状态更改为rejected，记录失败原因
      3. then：返回一个promise实例，根据状态调用对应的函数，并支持链式调用
         1. 成功状态：执行成功回调函数，将上一个then的返回值要传递给下一个then
            1. 返回值是普通值，直接调用resolve(result)，将结果传给下一个then方法
            2. 返回值是其它promise实例，新的promise继续调用then
            3. 返回值是当前promise实例，promise循环调用，抛出错误
         2. 失败状态：执行失败回调函数
         3. 等待状态：在异步任务中回调或多次调用时，将成功/失败任务存储在数组中，循环数组执行函数
         4. 不传回调函数参数：将返回结果一直透传下去，直至有回调函数的then方法
      4. catch：因为then的第二个参数是用来捕获错误的，所以catch方法等价于 `then(undefined, rejectCb)`
      5. finally：无论成功还是失败，此方法都会执行，并且可以和then方法链式调用

      **静态方法**

      1. resolve：返回一个以给定值解析之后的promise对象
      2. reject：同上
      3. all：返回一个Promise实例
         1. 如果promise实例，在iterable参数内的所有 Promise 实例都成功或不包含promise时完成回调
         2. 如果参数中的Promise实例有一个失败，则此实例回调失败，失败原因是第一个Promise实例失败的原因
      4. race：返回一个Promise实例对象，第一个resolve的实例会直接出发此实例的resolve回调
      5. allSettled


7. Promise链式调用，如果第一个then返回的结果是数字或者函数，后面的then返回什么？

      1. 返回数字，Promise会无视它，转换为val => val 函数
      2. 返回函数，后面的then会返回函数的返回结果

8. 如果.then传入不是函数，后面的then会返回什么

      ```js
      Promise.resolve(1).then(2).then(Promise.resolve(3)).then(console.log)
      ```

      结果是1，.then里面的参数如果不是函数，就会无视它，被替换为val=>val

9. 如果promise的执行器函数，调用了resolve之后紧接着又调用了reject，状态会改变吗？

      ```js
      const promise = new Promise((resolve, reject) => {
        resolve('success')
        reject('error')
      })
      promise.then(res => {
        console.log('then', res)
      }).catch(err => {
         console.log('catch', err)
      })
      ```

      不会，返回结果为then success，因为状态只会从pending变为fufilled或rejected

10. 对 async/await 的理解，分析内部原理

      1. 背景：Promise解决了回调地狱的问题，但是如果遇到复杂的业务，代码里面会包含大量的 then 函数，使得代码依然不是太容易阅读。
      2. ES7 引入了 async/await，提供了在不阻塞主线程的情况下使用**同步代码实现异步访问资源的能力**，并且使得代码逻辑更加清晰，支持 try-catch 来捕获异常，非常符合人的**线性思维**。
      3. 异步的本质还是回调函数

11. promise，async await ， Generator 的区别

    - async await 是一个通过异步执行并隐式返回 Promise 作为结果的函数，相当于promise.then
    - async await 是Generator函数的语法糖，能够自动执行生成器函数，且可以更加方便地实现异步流程。


## DOM文档对象模型

1. DOM是哪种数据结构？

   树结构

2. DOM操作常用的API有哪些？

   节点操作

   1. document.getElementById()
   2. document.getElementsByTagName()
   3. document.getElementsByClassName()
   4. document.querySelectorAll()

   结构操作

   1. 新建节点：document.createElement()
   2. 插入节点：div.appendChild()
   3. 获取父元素：div.parentNode()
   4. 获取子元素列表：div.childNodes()
   5. 删除节点：div.removeChild(child[0])

   property形式

   1. div.style.width
   2. div.className
   3. div.nodeName
   4. div.nodeType

   attribute形式

   1. div.getAttribute('data-name')
   2. div.setAttribute('data-name', 'aaa')

3. attr 和 property 的区别

   1. property：修改对象属性，不会体现在html结构中
   2. attribute：修改html属性，会改变html结构
   3. 两者都有可能引起DOM的重绘

4. 一次性插入多个DOM节点，考虑性能该如何实现

   思路：将频繁操作改为一次性操作

   实现：创建文档片段，循环插入片段后再将片段插入真实DOM

   ```js
   const listNode = document.getElementById('list')
   const frag = document.createDocumentFragment()
   for (let i = 0; i< 10; i++) {
     const li = document.createElement('li')
     li.innerHtml = "list item" + i
     frag.appendChild(li)
   }
   listNode.appendChild(frag)
   ```

## BOM浏览器对象模型

1. 如何识别浏览器类型

   1. navigator.userAgent
   2. screen.width/height
   3. location
   4. history.forward

2. 分析拆解url各个部分

   location.href地址、protocol协议、host域名、search查询参数、hash、pathName

## 事件

1. 编写一个通用的事件监听函数

   通过addEventListener为div添加监听事件

   ```js
   function bindEvent(el, type, selector, fn) {
     if (fn == null) {
       fn = selector
       selector = null
     }
     el.addEventlistener(type, event => {
       const target = event.target
       if (selector) {
         if (target.matches(selector)) {
           fn.call(target, event)
         }
       } else {
         fn.call(target, event)
       }
     })
   }
   ```

2. 描述事件冒泡的流程

   多层div添加绑定事件，事件会从最底层向上依次触发，可以用e.stopPropation来阻止冒泡

   1. 基于DOM的属性结构
   2. 事件会顺着触发元素向上冒泡
   3. 应用场景：事件代理/委托

3. 无限下拉图片列表，如何监听每个图片的点击？

   事件代理：在某个父元素上添加点击事件，通过event.target获取到当前点击的子元素。优点：代码简洁，减少浏览器内存占用，但是不要滥用

4. event的用途

   1. 获取触发的元素，用于事件委托：event.target
   2. 阻止事件默认行为：event.preventDefault()

5. 事件传播是怎么回事？

## ajax

1. 

## 存储


# 手写系列

## 模拟JavaScript API

1. 手写一个ajax

2. 实现一个数组的flatten

3. 实现一个深拷贝
4. 实现一个apply，call
5. 实现一个bind

## 模拟lodash

1. 实现一个深拷贝
2. 防抖实现方式
3. 节流实现方式

## 实战场景

1. 红灯3秒亮一次,绿灯1秒亮一次,黄灯2秒亮一次,  如何让三个灯不断交替重复亮灯? 

   1. 亮灯函数，返回promise对象，将SetTimeout写在执行器里
   2. 执行亮灯函数，利用promise.then，红绿黄亮灯方法依次执行，循环往复调用此函数

2. 写一个请求函数，传入一个url，如果请求失败，第一次1s后重试，第二次1.5s后重试，第三次2.25s，第四次不试了

   fetchAPI

3. 实现一个版本对比的函数，比较版本号大小

4. 创建代理对象,通过代理对象访问属性时抛出错误 `Property "${key}" does not exist`

5. 实现一个请求函数，传入一个url数组，和并发请求的数量。

## 算法

1. 实现一个柯里化函数，sum(1,2,3)=6

2. 二分查找

3. 以最快的方式取出数组中第二大的值

4. “abcabcdabcdeabcdefhijklmnkjhxlkdslkcjdslk”，查找字符串中最长的连续字母片段

8. 创建代理对象,通过代理对象访问属性时抛出错误 `Property "${key}" does not exist`

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

