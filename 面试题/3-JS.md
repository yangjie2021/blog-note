# JavaScript

## 基础

1. 数据类型有哪些？

   基本数据类型：boolean，string，number，undefined，null，symbol

   引用数据类型：对象

   - 原生对象：内置对象（包装类：Symbol，Number，Boolean，String）和arguments
   - 宿主对象：浏览器环境对象（window，document等）NodeJs环境对象（global等）
   
2. undefined 和 null 有什么区别？

   - `undefined `是未指定特定值的变量的默认值，或者没有显式返回值的函数
   - `null`是“不代表任何值的值”， `null`是已明确定义给变量的值，对象的空指针
   - 在比较`null`和`undefined`时，我们使用`==`时得到`true`，使用`===`时得到`false`

3. 值类型和引用类型的区别？

   值类型：String,Number,Boolean,Null,Undefined, Symbol都会分配栈区。它的值是存放在栈中的简单数据段，按值存放，所以可以**按值访问**。

   引用类型： Object （对象）的变量都放到堆区。它在栈内存中保存的实际上是**对象在堆内存中的引用地址**， 通过这个引用地址可以快速查找到堆内存中的对象。

4. symbol的作用

   作为对象的属性名，可以保证属性名不会重复。但要注意，symbol不能过通过for... in...遍历出来

5. 写出代码的打印结果

   ```js
   var a = 1;
   var b = 2;
   console.log(a+++b)
   ```

   结果为3，++运算符的优先级高于+运算符，所以先执行a++得到1，然后1+b=3

6. 严格模式有哪些限制？

   1. 变量必须声明后再使用
   2. 函数的参数不能有同名属性，否则报错
   3. 不能使用`with`语句
   4. 不能对只读属性赋值，否则报错
   5. 不能使用前缀 0 表示八进制数，否则报错
   6. 不能删除不可删除的属性，否则报错
   7. 不能删除变量`delete prop`，会报错，只能删除属性`delete global[prop]`
   8. eval不能在它的外层作用域引入变量
   9. `eval`和`arguments`不能被重新赋值
   10. `arguments`不会自动反映函数参数的变化
   11. 不能使用`arguments.callee`
   12. 不能使用`arguments.caller`
   13. 禁止`this`指向全局对象
   14. 不能使用`fn.caller`和`fn.arguments`获取函数调用的堆栈
   15. 增加了保留字（比如`protected`、`static`和`interface`）

## 类型判断

1. 数据类型判断的方式

   1. typeof 操作符：判断基本类型的数据，但是typeof null 返回的是“object” ，因为null表示一个空对象指针
   2. instanceof 运算符：用来判断数据是否是某个对象的实例，返回一个布尔值。缺点是不能直接判断基本数据类型；不能判断null和undefined；不能区分数组和对象；判断必须在当前页面声明。
   3. constructor：与instanceof 类似，查看目标构造函数，也可以进行数据类型判断。但是不能判断 null 和 undefined，因为这两个特殊类型没有其对应的包装对象
   4. Array.isArray()：为了解决instanceof当前页声明的问题，判断数组是否为数组
   5. Object.prototype.toString.call(xxx)：终极解决方案，定义在Object的原型对象Object.prototype上方法

2. && 运算符能做什么

   `&&` 也可以叫**逻辑与**，在其操作数中找到第一个虚值表达式并返回它，如果没有找到任何虚值表达式，则返回最后一个真值表达式。它采用短路来防止不必要的工作。

3. || 运算符能做什么

   `||`也叫或**逻辑或**，在其操作数中找到第一个真值表达式并返回它。这也使用了短路来防止不必要的工作。在支持 ES6 默认函数参数之前，它用于初始化函数中的默认参数值。
   
4. 为什么在 JS 中比较两个相似的对象时返回 false？

   1. 在基本类型中，JS 通过值对它们进行比较
   2. 在对象中，JS 通过引用或存储变量的内存中的地址对它们进行比较

## 类型转换

1. 隐式和显式转换有什么区别？

   1. 隐式强制转换是一种将值转换为另一种类型的方法，这个过程是自动完成的，无需我们手动操作
   2. 显式强制是将值转换为另一种类型的方法，我们需要手动转换

2. 怎么用没有数字的代码返回-1

   "".indexOf()，-true，~false

3. 何时使用 === ，何时使用 ==？

   除了 `== null`之外，其余都用 `===`，因为 `obj == null`是 `obj === null || obj === undefined`的简写，可以用来判断一个对象是否存在且不为空。eslint校验规则和jq源码中都这样使用的

4. 常见的逻辑判断返回false的值（虚值）有哪些？

   0，NaN，空字符串，null，undefined，false

5. !! 运算符能做什么？

   `!!`运算符可以将右侧的值强制转换为布尔值，这也是将值转换为布尔值的一种简单方法。

6.  如何在不使用`%`模运算符的情况下检查一个数字是否是偶数？

   使用按位`&`运算符，`&`对其操作数进行运算，并将其视为二进制值，然后执行与运算 `num & 1`

## 数组

1. 展开(spread )运算符和 剩余(Rest) 运算符有什么区别？

   - l两者都用三个点表示 **...**
   - 展开运算符将一个数组转为用逗号分隔的参数序列。
   - 剩余运算符用于解构数组和对象。
   - 在某种程度上，剩余元素和展开元素相反，展开元素会“展开”数组变成多个元素，剩余元素会收集多个元素和“压缩”成一个单一的元素。
   
2. 遍历数组的方式有哪些？

   1. 循环：for...in，for...of，forEach()
   2. 筛选：map()，filter，every，some
   3. 累加：reduce ，reduceRight 
   4. 查找：find，findIndex
   5. keys、values、entries 都会返回一个遍历器对象，可以用 for...of 循环进行遍历。
      - keys() — 返回元素索引
      - values() — 返回元素本身
      - entries() — 返回元素和索引

3. for...in 和 for...of的区别

   1. for in 遍历数组会遍历到数组原型上的属性和方法, 更适合遍历对象
   2. 使用for of 可以成功遍历数组的值, 而不是索引, 不会遍历原型
   3. for 循环和 for-in 能正确响应 break、continue 和 return语句，但 forEach 不行
   4. for-of 只有可迭代对象（iterator）才能使用，包括：Array，Map，Set，String，TypedArray，arguments 对象等，普通对象不能使用，常用于异步任务的遍历

4. filter，every，some的区别

      1. filter只会把符合条件的数值返回，形成一个新数组
      2. every() 是对数组中的每一项运行给定函数。如果该函数对每一项返回 true ,则返回 true (全部符合条件)，否则返回 false。
      3. some()是对数组中每一项运行指定函数，如果该函数对任一项返回true，则返回true。(只要有一个符合)，否则返回false

5. forEach 和 map 的区别

      1. forEach() 总是返回 undefined，callback函数可以改变调用他的数组
      2. map 会对数组的每一项进行处理，返回新数组，其中包含对之前每一项处理结果；

6. reduce 和 reduceRight 的区别

      1. reduce 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。reduce 可以作为一个高阶函数，用于函数的 compose
      2. reduceRight 方法的功能和 reduce 功能是一样的，不同的是 reduceRight 从数组的末尾向前将数组中的数组项做累加

7. 什么是迭代器Iterator ？

   迭代器是一种接口，为各种不同的数据结构提供统一的访问机制，任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）

   `Iterator` 的作用有三个：

   1. 为各种数据结构，提供一个统一的、简便的访问接口；
   2. 使得数据结构的成员能够按某种次序排列；
   3. ES6 创造了一种新的遍历命令`for...of`循环，Iterator 接口主要供`for...of`消费。

8. 如何判断一个对象是否为数组？

   1. 判断是否属于数组实例：`[] instanceof Array === true`
   2. 通过对象的原型方法判断：`Object.prototype.toString.call(arr)`
   3. 判断值是不是数组：`Array.isArray([])`
   4. 构造器constructor：`[].constructor === Array`

9. 类数组转数组的方式有哪些？

   由于类数组不具有数组所具有的操作数组的方法，将类数组转换为数组之后就能调用如shift,unshift,splice,slice,concat,reverse,sort等这些强大的方法。

   1. Array.prototype.slice.call(arguments)
   2. Array.from(agruments)
   3. 拓展运算符 ...agruments
   4. 遍历类数组元素, 并push进一个新数组

## 对象

1. 如何在 JS 中创建对象？
      - 使用对象字面量
      - 使用构造函数
      - 使用 Object.create 方法
2. 如何检查对象中是否存在某个属性？
      1. `in` 操作符：如果指定的属性在指定的对象或其原型链中，则`in` 运算符返回`true`。它会检查它或者其原型链是否包含具有指定名称的属性
      2. `hasOwnProperty()` 方法：返回值是一个布尔值，指示对象自身属性中是否具有指定的属性，因此这个方法会忽略掉那些从原型链上继承到的属性。
      3. 使用括号符号`obj["prop"]`
3. Object.seal 和 Object.freeze 方法之间有什么区别？
      1. Object.freeze() 方法可以冻结一个对象
         - 一个被冻结的对象再也不能被修改；
         - 冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。
         - 冻结一个对象后该对象的原型也不能被修改`。freeze()` 返回和传入的参数相同的对象。
      2. Object.seal()方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要可写就可以改变。
      3. 相同点：
         - 对象不可能扩展，也就是不能再添加新的属性或者方法。
         - 对象已有属性不允许被删除。
         - 对象属性特性不可以重新配置。
      4. 不同点：
         - Object.seal方法生成的密封对象，如果属性是可写的，那么可以修改属性值。
         - Object.freeze方法生成的冻结对象，属性都是不可写的，也就是属性值无法更改。
4. Object.freeze() 和 const 的区别是什么？
      1. `const` 声明一个只读的变量，一旦声明，常量的值就不可改变
      2. `Object.freeze`适用于值，更具体地说，适用于对象值，它使对象不可变，即不能更改其属性。
5. 遍历对象的方式有哪些？
      1. for...in：遍历对象**自身和原型**的**可枚举字符串**属性
      2. Object.keys()： 接受一个对象,返回对象的**自身的、可枚举、字符串属性名**组成的一个数组
      3. Object.getOwnPropertyNames()：接受一个对象,返回对象的**自身的、可枚举和不可枚举、字符串属性名**组成的一个数组
      4. Object.getOwnPropertySymbols()：接受一个对象,返回对象**自身的、可枚举和不可枚举、Symbol属性名**组成的一个数组，**不能遍历字符串属性**
      5. Reflect.ownKeys()：接受一个对象,返回对象**自身的、可枚举和不可枚举、字符串和Symbol属性名**组成的一个数组
6. Proxy 和 Object.defineProperty的区别？

      - Proxy代理整个对象，Object.defineProperty只代理对象上的某个属性 
      - 如果对象内部要全部递归代理，则Proxy可以只在调用时递归，而Object.defineProperty需要在一开始就全部递归，Proxy性能优于Object.defineProperty
      - Proxy 可以**监视**读写以外的操作，比如deleteProperty方法监听删除
      - Proxy 可以很方便的监视数组操作，因为set有target, property, value三个入参
      - Proxy 不需要侵入对象
      - Proxy不兼容IE，Object.defineProperty不兼容IE8及以下

## 函数

1. 列举call，apply，bind的应用场景

   call的应用：**类数组转换为数组**

   1.  [].slice.call(arguments)
   2.  Array.prototype.slice.call(arguments)
   3.  [].forEach.call(arguments, item => {})`

   apply应用：**获取数组中的最大值**

   ```js
   let arr = [4, 6, 10, 3, 5];
   console.log(Math.max.apply(Math, arr))
   ```

    bind应用：**改变点击事件的this**

   ```js
   document.body.onclick = func.bind(obj, 10, 20)
   ```

2. 什么时候不使用箭头函数? 说出三个或更多的例子？

   - 当想要函数被提升时(箭头函数是匿名的)
   - 使用命名函数(箭头函数是匿名的)
   - 使用函数作为构造函数时(箭头函数没有构造函数)
   - 要在函数中使用`this/arguments`时，由于箭头函数本身不具有`this/arguments`，因此它们取决于外部上下文
   - 当想在对象字面是以将函数作为属性添加并在其中使用对象时，因为咱们无法访问 `this` 即对象本身。

3. new的实现原理

   - 创建一个空对象，这个对象将会作为执行构造函数之后返回的对象实例
   - 将这个空对象的隐式原型（`__proto__`）指向构造函数的显示原型（ `prototype`）
   - 将这个空对象赋值给构造函数内部的this，并执行构造函数逻辑
   - 如果构造函数返回了一个对象，那么这个对象会取代 new 出来的结果，否则 new 函数会自动返回这个新对象

## 原型链

1. 什么是原型和原型链？

   原型：函数上的prototype属性为**原型**/**显示原型**，对象上的 `__proto__`属性为**隐式原型**

   - 每个class都有显示原型，每个实例都有隐式原型
   - 实例的隐式原型指向对应class的显示原型

   原型链：**对象所有的父类和祖先类的原型所形成的可上溯访问的链表**

   - 实例对象继承了其构造函数的原型对象，原型对象也是对象，它也继承它的构造函数的原型对象，以此类推，实例对象和原型对象之间就形成了一条链路
   - 所有普通对象最终都指向内置的 `Object.prototype`— **对象原型**，它会指向一个空指针 **null**，也就是原型链的顶端，如果在原型链中找不到指定的属性就会停止。

10. instanceof的原理?

    用来检测某个实例对象的原型链上是否存在构造函数的 prototype 属性

    - 判断实例对象的隐式原型`__proto__`是否等于构造函数的显示原型`prototype`
    - 如果相等返回`true`，否则**递归向上查找**至原型链顶端
    - 直至Object.prototype顶端与null比较，如果都不相等，返回`false`

5. 实现继承的方式有哪些？

   1. 原型继承
   2. 借用构造函数继承
   3. 组合继承
   4. 寄生式继承
   5. 寄生组合式继承
   6. 类继承

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

   1. **闭包**就是一个函数在声明时能够记住当前作用域、父函数作用域、及父函数作用域上的变量和参数的引用，直至通过作用域链上全局作用域，基本上闭包是在声明函数时创建的作用域。
   2. 闭包是一种机制：只要函数执行，形成自己的私有上下文，保护了自己的私有变量，不被外界干扰就会形成闭包
   3. 当外界上下文占用了函数执行形成的私有上下文中的变量时，私有上下文得不到出栈释放，使得函数中的变量得以保留不被浏览器的垃圾回收机制销毁，这就是闭包的作用
   4. 闭包 = 包含自由变量的函数 + 使所有自由变量都获得绑定值的环境

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
   7. 函数的防抖和节流：数据隔离

6. this在不同的场景下如何取值？

   this的取值是在函数执行时决定的，不是在定义时决定的。

   1. 当做普通函数被调用时，在严格模式下，函数内的this会被绑定到`undefined`上，在非严格模式下则会被绑定到全局对象`window/global`上。
   2. 通过 `call/apply/bind` 方法显式调用构造函数时，构造函数的 `this` 会被绑定到新创建的对象上
   3. 作为对象方法调用或使用上下文对象调用函数时，函数体内的this会被绑定到该对象上
   4. 使用`new`方法调用构造函数时，构造函数内的this会被绑定到新创建的实例上
   5. 在箭头函数中，`this`的指向是由外层（函数或全局）作用域来决定的



## 异步

1. 有哪些方法可以处理 JS 中的异步代码？

   - 回调
- Promise
   - async/await
   - 还有一些库： async.js, bluebird, q, co
   
2. 同步和异步的区别

   异步是基于js是单线程语言的本质产生的，异步不会阻塞代码执行，同步会阻塞代码执行。

   JavaScript是单线程的，但是浏览器不是单线程的，例如setTimeOut 等 webAPI

3. 异步的应用场景有哪些？

      1. 网络请求：ajax
      2. 图片加载：img.onload
      3. 定时任务：setTimeOut，setInterval

4. 事件循环是怎么回事？event loop/事件循环/事件轮询机制

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

5. 宏任务和微任务的区别？

   1. 宏任务：Callback Queue中等待的任务，执行过程中增加的额外任务可以作为新的宏任务进到队列排队，包括setTimeout，setInterval，Ajax，DOM事件，postMessage，requestAnimationFrame，UI渲染
   2. 微任务：直接在当前任务结束过后立即执行，promise的回调会作为微任务执行，它的作用是为了提高整体的响应能力，包括Promise、MutationObserver、process.nextTick
   3. 事件循环与DOM渲染：因为每次调用栈中同步任务执行之后，浏览器都会DOM渲染，DOM结构如有改变则重新渲染，然后再触发下一次事件循环。
   4. 微任务比宏任务的执行时机早：宏任务是在DOM渲染后触发，微任务是在DOM渲染前触发

6. 手写Promise的实现思路

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
         3. 无法准确的定位错误，所以就有了Promise.allSettled
      4. allSettled：返回一个Promise实例
         1. 返回一个在所有给定的成功或失败的promise实例，并带有一个对象数组，每个对象表示对应的promise结果
         2. 如果我们请求多个接口需要统计错误的次数，就可以用到此方法
      5. race：返回一个Promise实例对象，第一个resolve的实例会直接出发此实例的resolve回调


7. Promise链式调用，如果第一个then返回的结果是数字或者函数，后面的then返回什么？

      1. 返回数字，Promise会无视它，转换为val => val 函数
      2. 返回函数，后面的then会返回函数的返回结果

10. Promise优缺点

      优点: 解决回调地狱, 对异步任务写法更标准化与简洁化

      缺点：

      - 无法取消Promise，一旦新建它就会立即执行，无法中途取消
      - 如果不设置回调函数，Promise内部抛出的错误，不会反应到外部
      - 当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成)

11. 对 async/await 的理解，分析内部原理

         1. 异步的本质还是回调函数，Promise解决了回调地狱的问题，但是如果遇到复杂的业务，代码里面会包含大量的 then 函数，使得代码依然不是太容易阅读。
         2. ES7 引入了 async/await，提供了在不阻塞主线程的情况下使用**同步代码实现异步访问资源的能力**，使得代码逻辑更加清晰，非常符合人的**线性思维**。

10. 什么是生成器 Generator ？

         1. ES6 提供的一种异步编程解决方案, Generator 函数是一个状态机，封装了多个内部状态
         2. Generator 函数是一个遍历器对象生成函数，可暂停(惰性求值)， yield可暂停，next方法可启动。每次返回的是yield后的表达式结果
            3. `Generator`函数可以说是`Iterator`接口的具体实现方式
            4. `Generator`函数可以通过配合Thunk 函数更轻松更优雅的实现异步编程和控制流管理

13. promise，async await ， Generator 的区别

      - async await 是一个通过异步执行并隐式返回 Promise 作为结果的函数
      - await相当于promise.then，使用try-catch 捕获异常类似于Promise.catch
      - async await 是Generator函数的语法糖，能够自动执行生成器函数，且可以更加方便地实现异步流程。

   14. vue中nexttick的原理

   15. 实现异步的方式有哪些？


## DOM

1. DOM 是什么？

   - **DOM** 代表**文档对象模型**，是 HTML 和 XML 文档的接口(API)。
- 当浏览器第一次读取(解析)HTML文档时，它会创建一个基于 HTML文档DOM对象，一个从 HTML 文档中建模的树状结构。
   - DOM 用于交互和修改DOM结构或特定元素或节点。
   
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

   attr 形式

   1. div.getAttribute('data-name')
   2. div.setAttribute('data-name', 'aaa')

3. attr 和 property 的区别

   1. property：修改对象属性，不会体现在html结构中
   2. attribute：修改html属性，会改变html结构
   3. 两者都有可能引起DOM的重绘

4. attr如何改变html结构的？

5. 如何获取屏幕高度、网页视口高度、body高度？

   1. window.screen.height：屏幕高度
2. window.innerHeight：网页视口高度
   
3. document.body.clientHeight：body高度
   
7. offsetWidth的值如何计算？

   offsetWidth = 内容宽度 + 内边距 + 边框，如果设置了 `box-sizing: border-box` ，offsetWidth = 内容宽度

8. offsetTop是div到哪里的距离？
   **HTMLElement.offsetLeft**和**HTMLElement.offsetTop**这两个属性是基于offsetParent的

   - 如果当前元素的父级元素没有进行CSS定位（position为absolute或relative）,offsetParent为body
   - 假如当前元素的父级元素中有CSS定位，offsetParent取最近的那个父级元素。
   - offsetLeft返回当前元素左上角相对于  HTMLElement.offsetParent 节点的左边界偏移的像素值。
   - offsetTop返回当前元素相对于其 offsetParent 元素的顶部的距离

9. window.history有哪些常见的API

10. 获取窗口的宽高相关的API

11. 如何刷新、跳转界面？

12. 如何获取浏览器的几倍屏？

12. 实现置顶效果，缓慢回到顶部

13. 虚拟DOM的优缺点

    **优点**：

    1. 保证性能下限：操作真实的dom结构是一件非常昂贵的事情，虚拟Dom利用js对象来模拟真实的dom，从而降低了逻辑层面对dom结构操作的成本
    2. 无需操作真实的dom：通过双向数据绑定，当数据发生改变的时候，dom结构中的节点自动更新，无需我们手动处理
    3. 可移植性高，跨平台性好：无论是vue、react还是weex等，我们都能看到虚拟dom的身影，通过各自的渲染进制进行将Dom结构渲染出来

    **缺点：**

    - 无法进行极致优化： 虽然虚拟 DOM+合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化。

## BOM

1. 如何识别浏览器类型

   1. navigator.userAgent
   2. screen.width/height
   3. location
   4. history.forward

2. 分析拆解url各个部分

   location.href地址、protocol协议、host域名、search查询参数、hash、pathName
   

## 事件

1. 什么是事件传播?

   当**事件**发生在**DOM**元素上时，该**事件**并不完全发生在那个元素上。 在**“冒泡阶段”**中，事件冒泡或向上传播至父级，祖父母，祖父母或父级，直到到达`window`为止；而在**“捕获阶段”**中，事件从`window`开始向下触发元素 事件或`event.target`。

   事件传播有三个阶段：
   
   1. **捕获阶段**–事件从 `window` 开始，然后向下到每个元素，直到到达目标元素。
   2. **目标阶段**–事件已达到目标元素。
   3. **冒泡阶段**–事件从目标元素冒泡，然后上升到每个元素，直到到达 `window`。
   
2. 描述事件冒泡的流程

   当**事件**发生在**DOM**元素上时，该**事件**并不完全发生在那个元素上。 在冒泡阶段，事件冒泡，或者事件发生在它的父代，祖父母，祖父母的父代，直到到达`window`为止。

   事件冒泡过程：

   1. 基于DOM的属性结构
   2. 事件会顺着触发元素向上冒泡
   3. 应用场景：事件代理/委托

3.  什么是事件捕获？

   - 当事件发生在 **DOM** 元素上时，该事件并不完全发生在那个元素上。在捕获阶段，事件从`window`开始，一直到触发事件的元素。
   - `addEventListener`方法具有第三个可选参数`useCapture`，其默认值为`false`，事件将在冒泡阶段中发生，如果为`true`，则事件将在捕获阶段中发生

4. 无限下拉图片列表，如何监听每个图片的点击？

   在某个父元素上添加点击事件，通过event.target获取触发元素，通过event.matches来判断是否是想要的触发元素

   优点：代码简洁，减少浏览器内存占用，但是不要滥用

5. event的用途

   1. 获取触发的元素，用于事件委托：event.target
   2. 阻止事件默认行为：event.preventDefault()
   3. 阻止冒泡
      - event.stopPropation，让事件只在指定的元素上触发；
      - return false

6.  event.preventDefault() 和 event.stopPropagation()方法之间有什么区别？

   - `event.preventDefault()` 方法可防止元素的默认行为。
     - 在表单元素中使用，它将阻止其提交
     - 在锚元素中使用，它将阻止其导航
     - 如果在上下文菜单中使用，它将阻止其显示或隐藏
   -  `event.stopPropagation()`方法用于阻止捕获和冒泡阶段中当前事件的进一步传播

7. 如何知道是否在元素中使用了event.preventDefault()方法？

   我们可以在事件对象中使用`event.defaultPrevented`属性， 它返回一个布尔值用来表明是否在特定元素中调用了`event.preventDefault()`。

8. event.target 和 event.currentTarget 的区别？

   1. `event.target`是触发事件的元素。
   2. `event.currentTarget`是触发事件的元素的父元素中绑定事件的改事件的元素。

9. 事件绑定的方式

   1. 事件监听addEventlistener，适合动态创建div，虚拟dom用的就是这个
   2. 手写在div上，比如onclick
   3. dom.onclick = function() {}

## 手写系列

### 分析题

1. `[1,2,3].map(parseInt)`的结果

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

2. 求下列题内容输出

   ```js
   let result = 100 + true + 21.2 + null + undefined + "Tencent" + [] + null + 9 + false;
   console.log(result); // NaNTencentnull9false
   
   console.log([]==false);// true
   console.log(![]==false);// true
   ```

   1. 数字+undefined的结果是NaN
   2. 字符串连接值都会转换为字符串
   
3. 写出打印结果并分析

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

4. 按顺序写出控制台打印结果 （2020 碧桂园）

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

5. 如果.then传入不是函数，后面的then会返回什么

   ```js
   Promise.resolve(1).then(2).then(Promise.resolve(3)).then(console.log)
   ```

   结果是1，.then里面的参数如果不是函数，就会无视它，被替换为val=>val

6. 如果promise的执行器函数，调用了resolve之后紧接着又调用了reject，状态会改变吗？

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

### 编程题

1. 实现简易的ajax
2. 实现深拷贝
3. 实现apply，call
4. 实现bind
   1. 保存原函数的this指针
   2. 取出第一个参数作为上下文，剩余参数类数组转数组
   3. 返回一个新的函数，新的函数中绑定目标对象并传参，使用apply将this指向目标对象
5. 实现new
6. 实现Object.Create()
7. 实现map
8. 实现instanceof
9. 实现一个深拷贝

2. 实现一个数组的flatten

3. 实现一个数组的排序函数，返回新的数组

4. 实现柯里化函数

5. 防抖实现方式

   函数防抖是指频繁触发的情况下，只有足够的空闲时间，才执行代码一次

6. 节流实现方式

   函数节流是指一定时间内js方法只跑一次

7. 实现一个sleep函数

   利用一个伪死循环阻塞主线程

8. 实现对象的深冻结

   ```js
   function deepFreeze(object) {
       let propNames = Object.getOwnPropertyNames(object);
       for (let name of propNames) {
           let value = object[name];
           object[name] = value && typeof value === "object" ?
               deepFreeze(value) : value;
       }
       return Object.freeze(object);
   }
   let person = {
       name: "Leonardo",
       profession: {
           name: "developer"
       }
   };
   deepFreeze(person);
   person.profession.name = "doctor"; // TypeError: Cannot assign to read only property 'name' of object
   ```

1. 编写一个通用的事件委托函数

   ul>li>span，对于这样的dom结构，如果span的点击函数想要委托给li，那么就将ul作为外层事件监听，获取点击的目标元素span，span向上查找到li元素，将目标元素指向给li，所以点击span执行的事件就委托给了li

   ```js
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
   ```

2. 一次性插入多个DOM节点，考虑性能该如何实现

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

3. 设置一个变量a，使得if语句能够执行

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

4. 创建10个`<a>`标签，点击的时候分别弹出对应的序号

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

6. 修改下面的代码，让循环输出的结果依次为1， 2， 3， 4， 5

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

10. 实现checkbox全选以及反选

11. 红灯3秒亮一次,绿灯1秒亮一次,黄灯2秒亮一次,  如何让三个灯不断交替重复亮灯? 

    1. 亮灯函数，返回promise对象，将SetTimeout写在执行器里
    2. 执行亮灯函数，利用promise.then，红绿黄亮灯方法依次执行，循环往复调用此函数

12. 写一个请求函数，传入一个url，如果请求失败，第一次1s后重试，第二次1.5s后重试，第三次2.25s，第四次不试了

    fetchAPI

13. 实现异步的串行和并行

    ```js
    // 字节面试题，实现一个异步加法
    function asyncAdd(a, b, callback) {
      setTimeout(function () {
        callback(null, a + b);
      }, 500);
    }
    
    // 1. promisify
    const promiseAdd = (a, b) => new Promise((resolve, reject) => {
      asyncAdd(a, b, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
    
    // 2. 串行处理
    async function serialSum(...args) {
      return args.reduce((task, now) => task.then(res => promiseAdd(res, now)), Promise.resolve(0))
    }
    
    // 3. 并行处理
    async function parallelSum(...args) {
      if (args.length === 1) return args[0]
      const tasks = []
      for (let i = 0; i < args.length; i += 2) {
        tasks.push(promiseAdd(args[i], args[i + 1] || 0))
      }
      const results = await Promise.all(tasks)
      return parallelSum(...results)
    }
    
    // 测试
    (async () => {
      console.log('Running...');
      const res1 = await serialSum(1, 2, 3, 4, 5, 8, 9, 10, 11, 12)
      console.log(res1)
      const res2 = await parallelSum(1, 2, 3, 4, 5, 8, 9, 10, 11, 12)
      console.log(res2)
      console.log('Done');
    })()
    ```

14. 实现一个版本对比的函数，比较版本号大小

15. 创建代理对象,通过代理对象访问属性时抛出错误 `Property "${key}" does not exist`

16. 实现一个请求函数，传入一个url数组，和并发请求的数量。

17. 如何实现js的沙盒模型

18. 对象和url参数的互相转换，分别如何实现？

19. 随机生成16进制颜色与rgb互转

20. 创建代理对象,通过代理对象访问属性时抛出错误 `Property "${key}" does not exist`

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

