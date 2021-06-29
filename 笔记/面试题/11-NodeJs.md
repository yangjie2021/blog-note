# NodeJS

## 基础

1. server端语言和前端的区别？

   1. 服务稳定性：server端可能会遭受恶意攻击和误操作（pm2做进程守候）
   2. 内存和CPU：server端承载很多请求（使用stream写日志，使用 redis 存session）
   3. 日志记录：server端要记录、存储、分析日志
   4. 安全：越权操作，数据库攻击等（登录验证、预防xss攻击和sql注入）
   5. 集群和服务拆分：拓展机器和服务来承载大流量

2. 为什么要用Node？

   1. 简单：node使用的是javascript,json来进行编码，人人都会
   2. 强大：非阻塞IO,可以适应分块传输数据，较慢的网络环境，尤其擅长高并发访问
   3. 轻量：node本身既是代码，又是服务器，前后端使用统一语言
   4. 可扩展：可以轻松应对多实例，多服务器架构，同时有海量的第三方应用组件

3. 线程、进程、协程之间的关系

   线程：操作系统能够进行运算调度的最小单元，包含在进程中，是进程中的时机运作单位

   进程：计算机中已运行的程序。进程曾经是分时系统的基本运作单位

   协程：微线程，计算机程序的一类组件，推广协作时多任务的子程序，允许执行被挂起与被恢复

4. NodeJs中的线程

   Node启动后，创建V8实例，这个实例时多线程的

   1. 主线程：编译、执行代码
   2. 编译/优化线程：在主线程执行的时候，可以优化代码
   3. 分析器线程：记录分析代码运行时间，为 Crankshaft 优化代码提供依据 、
   4. 垃圾回收的几个线程

5. 什么是非阻塞 I/O？

   **阻塞** 是指在 Node.js 程序中，其它 JavaScript 语句的执行，必须等待一个非 JavaScript 操作完成。这是因为当 **阻塞** 发生时，事件循环无法继续运行 JavaScript。

   在 Node.js 中，JavaScript 由于执行 CPU 密集型操作，而不是等待一个非 JavaScript 操作（例如 I/O）而表现不佳，通常不被称为 **阻塞**。在 Node.js 标准库中使用 libuv 的同步方法是最常用的 **阻塞** 操作。原生模块中也有 **阻塞** 方法。

6. nodejs是什么？和js的区别是什么？

   - nodejs 是基于 chrome V8 引擎的 JavaScript 运行时
   - JavaScript = ECMAScript规范（变量、函数、class等） + WebAPI（DOM，BOM，事件，ajax等）
   - NodeJS = ECMAScript规范（变量、函数、class等） + node API（http，querystring等）
   - js用于网页，在浏览器运行
   - nodejs 可用于服务端，如开发 web server；也可用于本机，如 webpack 等本机的工具

7. Node的架构是什么样子的？

   1. 应用app
   2. V8及node内置架构
      1. 核心模块(javascript实现)
      2. c++绑定
      3. libuv + CAes + http.
   3. 操作系统

   ![](https://mmbiz.qpic.cn/mmbiz_png/o30Kib3GDzuCLt7HFIqPpJWzeBGicniclIF0aGKUYe07iayVjD2iclj1zQELtvEVfTn3ssfGhG3jdUgXBvOkPIGZibOQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 高阶

1. node中的异步和同步怎么理解

   - node是单线程的，异步是通过一次次的循环事件队列来实现的
   - 同步则是说阻塞式的IO，这在高并发环境会是一个很大的性能问题，所以同步一般只在基础框架的启动时使用，用来加载配置文件，初始化程序什么的

2. 有哪些方法可以进行异步流程的控制?

   1. 多层嵌套回调 
   2. 为每一个回调写单独的函数，函数里边再回调
   3. 用第三方框架比方async, q, promise等

3. nodejs 线上环境为何要开启多进程？

   1. 高效使用多核CPU
   2. 充分利用服务器内存
   3. 充分压榨服务器，不浪费资源

4. 怎样绑定node程序到80端口?

   1. sudo
   2. apache/nginx代理 
   3. 用操作系统的firewall iptables进行端口重定向

5. 有哪些方法可以让node程序遇到错误后自动重启?

   1. runit
   2. forever
   3. nohup npm start

6. 怎样充分利用多个CPU?

   一个CPU运行一个node实例

7. 怎样调节node执行单元的内存大小?

   用--max-old-space-size 和 --max-new-space-size 来设置 v8 使用内存的上限

8. 程序总是崩溃，怎样找出问题在哪里?

   1. node --prof 查看哪些函数调用次数多
   2. memwatch和heapdump获得内存快照进行对比，查找内存溢出

9. 有哪些常用方法可以防止程序崩溃?

   1. try-catch-finally 
   2. EventEmitter/Stream error事件处理
   3. domain统一控制 
   4. jshint静态检查
   5.  jasmine/mocha进行单元测试

10. 怎样调试node程序?

    1. node --debug app.js
    2. node-inspector：启动命令添加 --inspect=9229，代码中添加debugger，chrome地址栏输入 chrome://inspect
    3. 使用vscode 工具调试

11. 怎么理解BFF和SFF？

    1. BFF：Backend For Frontend，主要负责快速跟进 UI 迭代，对后 端接口服务进行组合、处理，对数据进行：裁剪、格式化、聚合等

       ![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9sWG9BeFNWZ0ppYjJMaWNma1Z2RW41aWJrMERyREo0cXhLOGt6MUUyTGRFMUZITDRHejhVUnJNRlJZTHkySWRuRXpkbkJrWkh6d2xoN2lhWjdaWEZkOXVwbGcvNjQw?x-oss-process=image/format,png)

    2. SFF：Serverless For Frontend，Serverless = Faas (Function as a service) + Baas (Backend as a service)

       1. Faas ：函数即服务，服务商提供一个平台、提供给用户开发、运行管理这些函数的功能，而无需搭建和维护基础框架，是一种事件驱动由消息触发的函数服务
       2. BaaS：后端即服务，包含了后端服务组件，它是基于 API 的第三方服务，用于实现应用程序中的核心功能，包含常用的数据库、对象存储、消息队列、日志服务等等

       ![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9sWG9BeFNWZ0ppYjJMaWNma1Z2RW41aWJrMERyREo0cXhLOGZtNUNkNGhWdnY5b29DRmliczNUTVJNM2hMenpWSXRFMEJVbFlpYVBmT0xpYTE3amlhZ2U5RDRpYXlRLzY0MA?x-oss-process=image/format,png)

12. GraphQL了解过吗？解决什么问题

    GraphQL 是一种针对 Graph（图状数据）进行查询特别有优势的 Query Language（查询语言），所以叫做 GraphQL。

    1. 架构重复
    2. 服务器/客户端数据不匹配
    3. 多余的数据库调用
    4. 应用程序性能不佳(响应时间,带宽消耗)。
    5. 样本代码过量
    6. restFull API过多难管理
    7. restFull API过多学习成本高

13. node有哪些核心模块?
    1. EventEmitter：node中一个实现观察者模式的类，主要功能是监听和发射消息，用于**处理多模块交互问题**
    2. Stream：基于事件EventEmitter的数据管理模式．由各种不同的抽象接口组成，主要包括可写，可读，可读写，可转换等几种类型．
    3. FS：文件操作
       - 操作系统的原生文件操作：POSIX文件Wrapper
       - 文件流：fs.createReadStream和fs.createWriteStream
       - 同步文件读写：fs.readFileSync和fs.writeFileSync
       - 异步文件读写：fs.readFile和fs.writeFile
    4. Net：node全面支持各种网络服务器和客户端，包括tcp, http/https, tcp, udp, dns, tls/ssl等
    5. 全局对象：global对象
       - process
       - console
       - Buffer
       - __filename： 文件路径
       - __dirname：文件夹路径

## node全局对象

1. process有哪些常用方法?

   process.stdin, process.stdout, process.stderr, process.on, process.env, process.argv, process.arch, process.platform, process.exit

2. console有哪些常用方法?

   console.log/console.info, console.error/console.warning, console.time/console.timeEnd, console.trace, console.table

3. 如何判断当前脚本运行在浏览器还是node环境中？

   `this === window ? 'browser' : 'node';`

4. nodejs有哪些异步任务？

   1. 宏任务： setTimeout/clearTimeout, setInterval/clearInterval, setImmediate/clearImmediate，I/O文件，Socket连接
   2. 微任务：promise，async/await，process.nextTick
   3. 基本执行步骤：同步任务，微任务，宏任务
   4. process.nextTick 优先级最高，最早被执行，但是会阻塞IO，现在已经不推荐使用
   5. setTimeout 比 setImmediate 执行更早，建议用setImmediate 代替 process.nextTick
   6. process.nextTick 比 promise.then 执行更早

5. 事件循环在 nodejs 和浏览器中的区别

   浏览器事件循环过程：调用栈空闲时将触发事件循环机制，执行宏任务；而触发事件循环之前会把现有的微任务执行完，所以微任务比宏任务执行时机早。

   nodejs中事件循环的6个阶段：

   1. timers（定时器）：执行`setTimeout`和`setInterval`的回调
   2. I/O callbacks（待定回调）：执行延迟到下一个循环迭代的 I/O 回调，处理网络、流、TCP的错误回调
   3. idle，prepare：闲置阶段，node内部使用
   4. poll（轮询）：检索新的 I/O 事件；执行与 I/O 相关的回调。除了关闭的回调函数，那些由计时器和 `setImmediate()` 调度的函数之外，其余情况 node 将在适当的时候在此阻塞。
   5. check：存放 setImmediate 回调
   6. close callbacks：关闭回调，例如`Socket.on('close')`

   在每次运行的事件循环之间，Node.js 检查它是否在等待任何异步 I/O 或计时器，如果没有的话，则完全关闭。

6. node中的Buffer如何应用?

   Buffer是用来处理二进制数据的，比如图片，mp3,数据库文件等.Buffer支持各种编码解码，二进制字符串互转．

7. path.resolve 和 path.join 的区别

   1. 两者都是用于拼接文件路径
   2. path.resolve 获取绝对路径，拼接+查找根目录
   3. path.join 获取相对路径

## EventEmitter

1. 如何实现一个EventEmitter?

   定义一个子类，调用构造函数，继承EventEmitter

   ```js
   var util = require('util');
   var EventEmitter = require('events').EventEmitter;
   
   function MyEmitter() {
     EventEmitter.call(this);
   } // 构造函数
   
   util.inherits(MyEmitter, EventEmitter); // 继承
   
   var em = new MyEmitter();
   em.on('hello', function(data) {
     console.log('收到事件hello的数据:', data);
   }); // 接收事件，并打印到控制台
   em.emit('hello', 'EventEmitter传递消息真方便!');
   ```

2. EventEmitter有哪些典型应用?

   1. 模块间传递消息
   2. 回调函数内外传递消息
   3. 处理流数据，因为流是在EventEmitter基础上实现的
   4. 观察者模式发射触发机制相关应用

3. 怎么捕获EventEmitter的错误事件?

   监听error事件即可。如果有多个EventEmitter，也可以用domain来统一处理错误事件

   ```js
   var domain = require('domain');
   var myDomain = domain.create();
   myDomain.on('error', function(err){
     console.log('domain接收到的错误事件:', err);
   }); // 接收事件并打印
   myDomain.run(function(){
     var emitter1 = new MyEmitter();
     emitter1.emit('error', '错误事件来自emitter1');
     emitter2 = new MyEmitter();
     emitter2.emit('error', '错误事件来自emitter2');
   });
   ```

4. EventEmitter中的newListenser事件有什么用处?

   - newListener可以用来做事件机制的反射，特殊应用，事件管理等
   - 当任何on事件添加到EventEmitter时，就会触发newListener事件
   - 基于这种模式，我们可以做很多自定义处理

   ```js
   var emitter3 = new MyEmitter()
   emitter3.on('newListener', function(name, listener) {
   	console.log("新事件的名字:", name)
   	console.log("新事件的代码:", listener)
   	setTimeout(function(){ console.log("我是自定义延时处理机制") }, 1000)
   })
   emitter3.on('hello', function(){
   	console.log('hello　node');
   })
   ```

## Stream

1. Stream有什么好处?

   非阻塞式数据处理提升效率，片断处理节省内存，管道处理方便可扩展等

2. Stream有哪些典型应用?

   文件，网络，数据转换，音频视频等

3. 怎么捕获Stream的错误事件?

   监听error事件，方法同EventEmitter.

4. 有哪些常用Stream,分别什么时候使用?

   1. Readable可被读流，在作为输入数据源时使用
   2. Writable为可被写流,在作为输出源时使用
   3. Duplex为可读写流,它作为输出源接受被写入，同时又作为输入源被后面的流读出
   4. Transform机制和Duplex一样，都是双向流，区别时Transfrom只需要实现一个函数`_transfrom(chunk, encoding, callback)`，而Duplex需要分别实现`_read(size)`函数和`_write(chunk, encoding, callback)`函数

5. 实现一个Writable Stream?

   1. 构造函数call Writable
   2. 继承Writable
   3. 实现_write(chunk, encoding, callback)函数

   ```js
   var Writable = require('stream').Writable;
   var util = require('util');
   
   function MyWritable(options) {
   	Writable.call(this, options);
   } // 构造函数
   util.inherits(MyWritable, Writable); // 继承自Writable
   MyWritable.prototype._write = function(chunk, encoding, callback) {
   	console.log("被写入的数据是:", chunk.toString()); // 此处可对写入的数据进行处理
   	callback()
   }
   
   process.stdin.pipe(new MyWritable()); // stdin作为输入源，MyWritable作为输出源 
   ```

## 文件系统

1. 读写一个文件有多少种方法?

   1.  POSIX文件Wrapper,对应于操作系统的原生文件操作
   2. 文件流 fs.createReadStream和fs.createWriteStream
   3. 同步文件读写,fs.readFileSync和fs.writeFileSync
   4. 异步文件读写, fs.readFile和fs.writeFile

2. 怎么读取json配置文件?

   方式一：利用node内置的`require('data.json')`机制，直接得到js对象

   - 如果多个模块都加载了同一个json文件，那么其中一个改变了js对象，其它跟着改变，这是由node模块的缓存机制造成的，只有一个js模块对象

   方式二：读取文件内容，然后用`JSON.parse(content)`转换成js对象

   - 可以随意改变加载后的js变量，而且各模块互不影响，因为他们都是独立的，是多个js对象

3. fs.watch和fs.watchFile有什么区别，怎么应用?

   1. 二者主要用来监听文件变动
   2. fs.watch利用操作系统原生机制来监听，可能不适用网络文件系统
   3. fs.watchFile则是定期检查文件状态变更，适用于网络文件系统，但是相比fs.watch有些慢，因为不是实时机制

## 网络

1. node是怎样支持https,tls的?

   1. openssl生成公钥私钥
   2. 服务器或客户端使用https替代http
   3. 服务器或客户端加载公钥私钥证书

2. 实现一个简单的http服务器?

   加载http模块，创建服务器，监听端口

   ```js
   var http = require('http'); // 加载http模块
   
   http.createServer(function(req, res) {
     res.writeHead(200, {'Content-Type': 'text/html'}); // 200代表状态成功, 文档类型是给浏览器识别用的
     res.write('<meta charset="UTF-8"> <h1>我是标题啊！</h1> <font color="red">这么原生，初级的服务器，下辈子能用着吗?!</font>'); // 返回给客户端的html数据
     res.end(); // 结束输出流
   }).listen(3000); // 绑定3ooo, 查看效果请访问 http://localhost:3000
   ```

3. session如何实现登录？

   1. cookie登录校验：浏览器发送请求，服务端返回cookie信息，浏览器再次发起请求时携带过去
   2. session存储敏感信息，cookie存储和敏感信息关联的唯一标识
   3. session存储到redis：解决进程有内存限制，进程的内存是相互隔离的问题

## child-process

1. 为什么需要child-process?

   1. 顾名思义，就是把node阻塞的工作交给子进程去做
   2. node是异步非阻塞的，这对高并发非常有效。可是我们还有其它一些常用需求：
      1. 和操作系统shell命令交互
      2. 调用可执行文件
      3. 创建子进程进行阻塞式访问
      4. 高CPU计算等

2. exec,execFile,spawn和fork都是做什么用的?

   1. exec可以用操作系统原生的方式执行各种命令，如管道 cat ab.txt | grep hello
   2. execFile是执行一个文件
   3. spawn是流式和操作系统进行交互
   4. fork是两个node程序(javascript)之间进行交互、

3. 实现一个简单的命令行交互程序?

   将子进程的输出作为当前程序的输入流，然后重定向到当前程序的标准输出，即控制台

   ```js
   var cp = require('child_process');
   
   var child = cp.spawn('echo', ['你好', "钩子"]); // 执行命令
   child.stdout.pipe(process.stdout); // child.stdout是输入流，process.stdout是输出流
   ```

4. 两个node程序之间怎样交互?

   子程序用process.on, process.send，父程序里用child.on,child.send进行交互.

   ```js
   // fork-parent.js
   var cp = require('child_process')
   var child = cp.fork('./fork-child.js')
   child.on('message', function(msg) {
     console.log('老爸从儿子接受到数据:', msg)
   })
   child.send('我是你爸爸，送关怀来了!')
   
   // fork-child.js
   process.on('message', function(msg) {
     console.log("儿子从老爸接收到的数据:", msg)
     process.send("我不要关怀，我要银民币！")
   })
   ```

5. 怎样让一个js文件变得像linux命令一样可执行?

   1. 在myCommand.js文件头部加入 **#!/usr/bin/env node**
   2. chmod命令把js文件改为可执行即可
   3. 进入文件目录，命令行输入myComand就是相当于node myComand.js了

## 第三方库

1. async都有哪些常用方法，分别是怎么用?

   async是一个js类库，它的目的是解决js中异常流程难以控制的问题．async不仅适用在node.js里，浏览器中也可以使用

   1. async.parallel**并行**执行完多个函数后，调用结束函数
   2. async.series**串行**执行完多个函数后，调用结束函数
   3. async.waterfall**依次执行**多个函数，后一个函数以前面函数的结果作为输入参数
   4. async.map异步执行多个数组，返回结果数组
   5. async.filter异步过滤多个数组，返回结果数组

2. express常用函数

   1. express.Router路由组件
   2. app.get路由定向
   3. app.configure配置
   4. app.set设定参数
   5. app.use使用中间件

3. 请描述 koa2 和 express 的中间件机制

   1. 中间件在代码中是一个函数，在业务上是一个独立的模块
   2. 模块拆分、流转完成复杂的功能，符合开放封闭、单一原则

4. child-process和process的stdin,stdout,stderror是一样的吗?

   - 概念都是一样的，输入，输出，错误，都是流
   - 区别是在父程序眼里，子程序的stdout是输入流，stdin是输出流．

5. 描述 koa2 的洋葱模型

   1. 洋葱模型是在处理请求来和响应请求之间的问题。可以类比栈，先进后出。
   2. 为了保障各个中间件的执行顺序，并且保障执行上下文的一致，我们需要将所有符合请求路由规则的`Handler`进行压栈，压栈后的函数，统一推入`compose`中，进行退栈执行。
   3. 通过洋葱模型，使我们可以更容易的监控整个路由请求的全链路，并且可以在中间件做更多的事情。比如统计响应耗时等
   4. 在洋葱模型的支持下，我们可以将整个中间件逻辑写在一起即可。而next就是具体的路由逻辑，我们并不需要关心它具体做了什么，只需要关心我们自己需要做什么。这样可以将同一个业务逻辑的代码聚合到一起，更容易维护。（面向切面编程）