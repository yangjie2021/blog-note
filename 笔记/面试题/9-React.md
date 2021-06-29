## React

### 基础

1. 什么是JSX？JSX的原理或本质是什么？

   JSX 是 JavaScript 语法的扩展，它允许编写类似于 HTML 的代码。JSX的本质是通过babel解析后生成createElement方法，执行返回VNode，让开发人员使用更加舒服的代码构建用户界面。

   createElement需要传递三个参数：
   
   1. type：当前ReactElement的类型
      - 如果是标签元素，那么就使用字符串表示 “div”；
      - 如果是组件元素，那么就直接使用组件的名称；
   2. config：所有jsx中的属性都在config中以对象的属性和值的形式存储
   3. children：存放在标签中的内容，以children数组的方式进行存储
   
2. react 16.x的架构

   1. Scheduler (调度层)：调度任务的优先级，高优任务优先进入协调器
      - 减少diff时间：virtualDOM 的比对：循环加递归 改为 循环模拟递归
      - 空间时执行任务：使用requestIdleCallback API，让比对在空闲时间完成
      - 设置任务优先级：Scheduler调度库，高优先级任务先执行，低优先级任务后执行
   2. Reconciler (协调层)：构建 Fiber 数据结构，比对 Fiber 对象找出差异, 记录 Fiber 对象要进行的 DOM 操作
   3. Renderer (渲染层)：根据协调器标记的差异，同步将发生变化的部分渲染到页面上（调度和协调任务可以被打断，渲染任务不可以）

3. 组件之间如何通讯

   - 父传子：父组件可以向子组件通过传props 的方式，向子组件进行通讯
   - 子传父：props+回调的方式，父组件向⼦组件传递props进行通讯，此props为作用域为父组件自身的函数，子组件调用该函数，将子组件想要传递的信息，作为参数，传递到父组件的作用域中；
   - 兄弟互传：找到这两个兄弟节点共同的父节点，结合上面两种方式由父节点转发信息进行通信；
   - 跨层级通信：**Context**设计⽬的是为了共享那些对于⼀个组件树⽽⾔是“全局”的数据，例如当前认证的⽤户、主题或⾸选语⾔，对于跨越多层的全局数据通过 Context通信再适合不过；
   - 发布订阅模式：发布者发布事件，订阅者监听事件并做出反应，我们可以通过引⼊**event模块**进⾏通信；
   - 全局状态管理⼯具：借助Redux或者Mobx等全局状态管理⼯具进⾏通信，这种⼯具会维护⼀个全局状态中⼼Store，并根据不同的事件产⽣新的状态

4. 渲染列表，为何使用key

   Keys 是 React 用于追踪哪些列表中元素被修改、被添加或者被移除的辅助标识

   - diff算法中通过tag和key来判断是否是sameCode
   - 减少渲染次数，提升渲染性能

5. react-router 如何配置懒加载

   导入：`lazy(()=> import(../home))`

   使用：Suspense

6. React 事件和 DOM 事件的区别

   1. React 事件使用驼峰命名，而不是全部小写
   2. React 中的 event 不是原生的，是 SyntheticEvent 合成事件对象
   3. React在 document上进行统一的事件分发， `dispatchEvent`通过循环调用所有层级的事件来模拟事件冒泡和捕获

7. react 元素首次初始化如何渲染到页面中的？

   **render阶段(协调层)**：构建Fiber树，创建Fiber对象节点对应的DOM对象，添加节点操作方式（插入，删除，更新），最终保存在fiberRoot对象中

   1. render函数三个入参：element(虚拟dom)、container(渲染容器)、callback(渲染完成的回调函数)
   2. 检测容器是否为真实DOM
   3. 初始化Fiber树最外层对象FiberRoot
      1. 将子树渲染到容器中：创建Fiber数据结构，fiberRoot和rootFiber
      2. 判断是否为服务器端渲染，如果不是服务器端渲染清空 container 容器中的节点
      3. 创建容器的Fiber对象，即FibeRoot，让fiberRoot.current和rootFiber.stateNode互相指向
   4. 获取 rootFiber.child 实例对象：改变 callback 函数中的 this 指向，使其指向根节点对象的子元素
   5. 计算任务的过期时间，再根据任务过期时间创建 Update 任务
      1. 初始化渲染不执行批量更新，因为不能被打断
      2. 创建初始化渲染的任务对象，放置在任务队列中，调度和更新任务
   6. 将任务(Update)存放于任务队列(updateQueue)中，创建单向链表结构存放 update, next 用来串联 update
   7. 判断任务是否为同步，调用同步任务入口
   8. 进入 render 阶段, 构建 workInProgress Fiber 树

   **commit阶段**：获取fiberRoot对象新创建的Fiber树，根据操作方式进行dom操作

8. 为什么虚拟 dom 会提高性能?

   虚拟DOM用一个原生的JavaScript对象去描述一个DOM节点，是对真实DOM的一层抽象。

   虚拟 dom 相当于在 js 和真实 dom 中间加了一个缓存，利用 dom diff 算法避免了没有必要的 dom 操作，从而提高性能。

   虚拟DOM对象最基本的三个属性：

   1. 标签类型
   2. 标签元素的属性
   3. 标签元素的子节点

9. react diff 原理

   - 把树形结构按照层级分解，只比较同级元素。
   - 给列表结构的每个单元添加唯一的 key 属性，方便比较。
   - React 只会匹配相同名字（class）的组件
   - 合并操作：调用 component 的 setState 方法的时候，React 将其标记为 dirty。到每一个事件循环结束, React检查所有标记 dirty 的 component 重新绘制
   - 选择性子树渲染：开发人员可以重写 shouldComponentUpdate 提高 diff 的性能

10. 当组件的setState函数被调用之后，发生了什么？

       向任务队列中调度更新的任务，重新为每一个节点构建fiber对象，添加修改后的state对象(partialState)，

       执行任务过程中，找到对应的state，和旧的state进行合并，最后调用render方法更新Dom。

       1. 将传入的参数对象与组件当前的状态合并，然后触发调和过程。shouldComponentUpdate

       2. 调和过程：利用浏览器空闲时间根据新的状态构建元素树并且着手重新渲染整个 UI 界面componentWillUpdate

       3. 得到元素树之后，自动计算出新老树节点差异，在差异计算过程中，React 能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。render 

       4. 最后根据差异对界面进行最小化重渲染。componentDidUpdate

11. 触发多次setstate，那么render会执行几次？

    多次setState会**合并为一次**render，因为setState并不会立即改变state的值，而是将其放到一个**任务队列**里，最终将多个setState合并，一次性更新页面。所以我们可以在代码里多次调用setState，每次只需要关注当前修改的字段即可。

12. setState 到底是异步还是同步函数？

    setState 在原生事件和setTimeout中都是同步的，在对同一个值批量更新时是异步的

    1. setState有两个参数：
       - partialState：需要修改的数据，对象/函数都可以，如果是函数，传入的是需要修改的state和prop，`(prevState,prop)=>({})`
       - callback：回调函数，可以用来验证数据是否修改成功，同时可以获取到数据更新后的DOM结构，等同于componentDidMount。因为this.props 和this.state的更新可能是异步的，不能依赖它们的值去计算下一个state，所以callback是一个回调函数。
    2. setState只在合成事件和钩子函数中是“异步”的，在原⽣事件和setTimeout中都是同步的；
    3. setState的“异步”并不是说内部由异步代码实现，其实本身执⾏的过程和代码都是同步的，只是合成事件和钩⼦函数的调用是在更新之前，导致这两个函数没法立即拿到更新后的值，形成了所谓的“异步”，当然所以通过callback拿到更新后的结果
    4. setState的**批量更新优化**也是建⽴在合成事件和钩⼦函数之上的，在原⽣事件和setTimeout中不会批量更新，在“异步”中如果对同⼀个值进⾏多次 setState，setState的批量更新策略会对其进⾏覆盖，取最后⼀次的执⾏，如果是同时setState多个不同的值，在更新时会对其进⾏合并批量更新。

13. React 中 keys 的作用是什么？

    作用：Diff算法中借助元素的Key值来追踪哪些列表中元素被修改、被添加或者被移除，从而减少不必要的元素重渲染

    原理：react利用key来识别组件，它是一种身份标识标识，相同的key是同一个组件，这样后续相同的key对应组件都不会被创建。有了key属性后，就可以与组件建立了一种对应关系，react根据key来决定是销毁重新创建组件还是更新组件。过程如下：

    1. key相同，若组件属性有所变化，则react只更新组件对应的属性；没有变化则不更新。
    2. key值不同，则react先销毁该组件(有状态组件的componentWillUnmount会执行)，然后重新创建该组件（有状态组件的constructor和componentWillUnmount都会执行）

14. 为什么循环产生的组件中要利用上key这个特殊的属性？

    如果数组做了reverse操作，对应的组件列表的顺序会颠倒，如果diff过程中使用数组的下标来寻找组件，前后子元素不一样就重新删除并更新。但如果添加了key，diff算法在变化前后找到的值是一样的，就不会进行删除和更新操作，只做移动操作。

15. React 中 refs 的作用是什么？

    - refs 是 React 提供给我们的安全访问DOM元素或者某个组件实例的句柄。
    - refs 可以设置为字符串，也可以设置为箭头函数
    - refs 并不是类组件的专属，函数式组件同样能够利用闭包暂存其值
    - refs是父组件用来获取子组件的dom元素方式：可以为元素添加 ref 属性然后在回调函数中接受该元素在 DOM 树中的句柄，该值会作为回调函数的第一个参数返回

16. 谈一下你对fiber的理解？

    问题：JS是单线程，且和DOM渲染共用一个线程；当组件足够复杂，组件更新时计算和渲染都压力大；同时再有DOM操作需求(动画，鼠标拖拽等)，将卡顿。

    解决方案：将reconciliation阶段进行任务拆分（commit无法拆分）；DOM需要渲染时暂停，空闲时恢复；
    利用window.requestIdleCallback方法将在浏览器的空闲时段内对要调用的函数进行排队


### 组件

1. React组件生命周期

   挂载阶段：

   1. constructor：构造函数，最先被执⾏，我们通常在构造函数⾥初始化state对象或者给⾃定义⽅法绑定this；
   2. getDerivedStateFromProps：静态⽅法，当我们接收到新的属性想去修改我们state， 可以使⽤getDerivedStateFromProps
   3. componentWillMount：在渲染之前执行，用于根组件中的 App 级配置；
   4. render：render函数是纯函数，只返回需要渲染的东⻄，不应该包含其它的业务逻辑，可以返回原⽣的DOM、React组件、Fragment、Portals、字符串和数字、 Boolean和null等内容；
   5. **componentDidMount**：在第一次渲染之后执行，可以在这里做AJAX请求，获取到DOM节点并操作，⽐如对canvas，svg的操作，服务器请求，订阅都可以写在这个⾥⾯，但是记得在componentWillUnmount中取消订阅；

   更新阶段：

   1. getDerivedStateFromProps: 此⽅法在更新和挂载阶段都可能会调⽤；
   2. componentWillReceiveProps：在初始化render的时候不会执行，它会在组件接受到新的状态(Props)时被触发，一般用于父组件状态更新时子组件的重新渲染
   3. **shouldComponentUpdate**：确定是否更新组件，有2个参数nextProps和nextState，表示新的属性和变化之后的state，返回⼀个布尔值，true表示会触发重新渲染，false表示不会触发重新渲染，默认返回true，我们通常利用此生命周期来**优化程序性能**；
   4. componentWillUpdate：在shouldComponentUpdate返回true，确定要更新组件之前件之前执行；
   5. render：更新阶段也会触发此⽣命周期；
   6. getSnapshotBeforeUpdate：getSnapshotBeforeUpdate(prevProps, prevState),这个⽅法在render之后，componentDidUpdate之前调⽤，有两个参数prevProps和prevState，表示之前的属性和之前的state，这个函数有⼀个返回值，会作为第三个参数传给componentDidUpdate，如果你不想要返回值，可以返回null，此⽣命周期必须与componentDidUpdate搭配使⽤；
   7. **componentDidUpdate**：在getSnapshotBeforeUpdate⽅法之后被调⽤，用于更新DOM以响应props或state更改。有3个参数，分别是之前的props，之前的state，和snapshot。snapshot是getSnapshotBeforeUpdate返回的，如果触发某些回调函数时需要⽤到DOM元素的状态，则将对⽐或计算的过程迁移⾄getSnapshotBeforeUpdate，然后在componentDidUpdate中统⼀触发回调或更新状态。

   卸载阶段:

   1. **componentWillUnmount**：当我们的组件被卸载或者销毁了就会调⽤，我们可以在这个函数⾥去清除⼀些定时器，取消⽹络请求，清理⽆效的DOM元素等垃圾清理⼯作

2. react生命周期中，最适合与服务端进行数据交互的是哪个函数

3. React发起ajax应该在哪个生命周期

   componentDidMount，如果有特殊需求需要提前请求，也可以在特殊情况下在constructor中请求

4. 什么是纯函数?

   - 对于相同的输入始终保持相同的输出
   - 返回一个新值，没有副作用
   - 不可变值（slice是纯函数，splice是非纯函数）

5. 函数组件和class组件区别

   - 函数组件是无状态的，没有实例、生命周期和state，不能扩展其他方法。
   - 函数组件是纯展示性组件，输入props，输出JSX，没有this
   - 函数组件只是一个纯函数，不执行与UI无关的逻辑处理

6. 什么是受控组件？受控组件与非受控组件的区别

   - 受控组件（Controlled Component）是受state控制中的组件，表单数据真实的唯一来源。
   - 受控组件支持即时字段验证，允许有条件地禁用/启用按钮，强制输入格式。
   - 非受控组件(Uncontrolled Component)是由DOM处理表单数据的地方，而不是在 React 组件中。
   - 非受控组件通常更易于实现，因为只需使用refs即可从DOM中获取值，但是不支持实时校验

7. 如何避免组件的重新渲染？

   1. React.memo()：这可以防止不必要地重新渲染函数组件；
   2. PureComponent：这可以防止不必要地重新渲染类组件。

   影响：这两种方法都依赖于对传递给组件的props的浅比较，如果props没有改变，那么组件将不会重新渲染。但是浅比较会带来额外的性能损失，因此如果使用不当，这两种方法都会对性能产生负面影响。

   通过使用**React Profiler**，可以在使用这些方法前后对性能进行测量，从而确保通过进行给定的更改来实际改进性能。

8. 什么是HoC（Higher-Order Component）/高阶组件？适用于什么场景？

   高阶组件(HOC)是接受一个组件并返回一个新组件的函数。基本上，这是一个模式，是从React的组合特性中衍生出来的，称其为纯组件，因为它们可以接受任何动态提供的子组件，但不会修改或复制输入组件中的任何行为。

   HOC 可以用于以下许多用例：

   1. 代码重用、逻辑和引导抽象
   2. 渲染劫持
   3. state抽象和操作
   4. props处理

9. 何时使用异步组件

   加载大组件、路由懒加载

10. 多个组件有公共逻辑，如何抽离？

    1. 高阶组件HOC
    2. Render Props

11. React 中有三种构建组件的方式有哪些？

    jsx、组件式、函数式

12. PureComponent有何区别

    实现了一个前比较的 shouldComponentUpdate，目的是性能优化，但是要结合不可变值使用

22. 什么时候应该选择用class实现一个组件，什么时候用一个函数实现一个组件？

    组件用到了state或者用了生命周期函数，那么就该使用Class component。其他情况下，应使用Functional component。

23. 并不是父子关系的组件，如何实现相互的数据通信？

    使用父组件，通过props将变量传入子组件（如通过refs，父组件获取一个子组件的方法，简单包装后，将包装后的方法通过props传入另一个子组件）

### 状态管理

1. 讲下redux的⼯作流程？

   redux工作过程中数据都是单向流动的，这种⽅式保证了流程的清晰

   1. ⾸先，⽤户（通过View）发出Action，发出⽅式就⽤到了dispatch⽅法；
   2. 然后，Store⾃动调⽤Reducer，并且传⼊当前State和收到的Action，Reducer会返回新的State；
   3. State⼀旦有变化，Store就会调⽤监听函数，来更新View

   核心概念：

   1. Store：保存数据的地⽅，你可以把它看成⼀个容器，整个应⽤只能有⼀个Store；
   2. State：Store对象包含所有数据，如果想得到某个时点的数据，就要对Store⽣成快照，这种时点的数据集合，就叫State；
   3. Action： State的变化， 会导致View的变化。但是，⽤户接触不到State，只能接触到View。所以，State的变化必须是View导致的。Action就是View发出的通知，表示State应该要发⽣变化了；
   4. Action Creator：View要发送多少种消息，就会有多少种Action。如果都⼿写，会很麻烦，所以我们定义⼀个函数来⽣成Action，这个函数就叫Action Creator；
   5. Reducer：Store收到Action以后，必须给出⼀个新的State，这样View才会发⽣变化。这种State的计算过程就叫做Reducer。Reducer是⼀个函数，它接受Action和当前State作为参数，返回⼀个新的State
   6. dispatch：是View发出Action的唯⼀⽅法。

2. react和redux之间是如何工作的

   Provider: Provider的作⽤是从最外部封装了整个react应⽤，并向connect模块传递store

   connect: 负责连接React和Redux

   1. 获取state: connect通过context获取Provider中的store， 通过store.getState()获取整个store tree 上所有state
   2. 包装原组件: 将state和action通过props的⽅式传⼊到原组件内部wrapWithConnect返回⼀个ReactComponent对象Connect，Connect重新render外部传⼊的原组件WrappedComponent，并把connect中传⼊的mapStateToProps, mapDispatchToProps与组件上原有的props合并后，通过属性的⽅式传给WrappedComponent
   3. 监听store tree变化: connect缓存了store tree中state的状态,通过当前state状态和变更前state状态进⾏⽐较，从⽽确定是否调⽤ this.setState() ⽅法触发Connect及其⼦组件的重新渲染

3. redux与mobx的区别？

   - redux将数据保存在单⼀的store中，mobx将数据保存在分散的多个store中
   - redux使⽤plain object保存数据，需要⼿动处理变化后的操作；mobx适⽤observable保存数据，数据变化后⾃动处理响应的操作
   - redux使⽤不可变状态，这意味着状态是只读的，不能直接去修改它，⽽是应该返回⼀个新的状态，同时使⽤纯函数；mobx中的状态是可变的，可以直接对其进⾏修改
   - mobx 使用的是面向对象的编程思维，redux使用的是函数式编程的思想
   - mobx中有更多的抽象和封装，调试会⽐较困难，同时结果也难以预测；⽽redux提供能够进⾏时间回溯的开发⼯具，同时其纯函数以及更少的抽象，让调试变得更加的容易

   场景比较

   1. mobx更适合数据不复杂的应⽤：mobx难以调试，很多状态⽆法回溯，⾯对复杂度⾼的应⽤时，往往⼒不从⼼。
   2. redux适合有回溯需求的应⽤：⽐如⼀个画板应⽤、⼀个表格应⽤，很多时候需要撤销、重做等操作，由于redux不可变的特性，天然⽀持这些操作。
   3. mobx适合短平快的项⽬：mobx上⼿简单，样板代码少，可以很⼤程度上提⾼开发效率。
   4. 当然mobx和redux也并不⼀定是⾮此即彼的关系，你也可以在项⽬中⽤redux作为全局状态管理，⽤mobx作为组件局部状态管理器来⽤。

4. redux如何进行异步请求

   一般情况下，我们可以在componentDidmount中直接进⾏请求⽆须借助redux。但是在⼀定规模的项⽬中，上述⽅法很难进⾏异步流的管理，通常情况下我们会借助redux的异步中间件（action）进⾏异步处理。

   主流的异步中间件：redux-thunk、redux-saga，redux-observable

5. redux异步中间件之间的优劣？

   redux-thunk优点：

   1. 体积⼩：redux-thunk的实现⽅式很简单，只有不到20⾏代码；
   2. 使⽤简单：redux-thunk没有引⼊像redux-saga或者redux-observable额外的范式，上⼿简单。

   redux-thunk缺陷：

   1. 样板代码过多：与redux本身⼀样，通常⼀个请求需要⼤量的代码，⽽且很多都是重复性质的；
   2. 耦合严重：异步操作与redux的action偶合在⼀起，不⽅便管理；
   3. 功能孱弱：有⼀些实际开发中常⽤的功能需要⾃⼰进⾏封装。

   redux-saga优点：

   1. 异步解耦：异步操作被被转移到单独saga.js中，不再是掺杂在action.js或component.js中；
   2. action摆脱thunk function: dispatch的参数依然是⼀个纯粹的 action (FSA)，⽽不是充满 “⿊魔法” thunk function；
   3. 异常处理：受益于 generator function 的saga实现，代码异常/请求失败都可以直接通过try/catch语法直接捕获处理；
   4. 功能强⼤：redux-saga提供了⼤量的Saga辅助函数和Effect创建器供开发者使⽤，开发者⽆须封装或者简单封装即可使⽤；
   5. 灵活：redux-saga可以将多个Saga可以串⾏/并⾏组合起来，形成⼀个⾮常实⽤的异步flow；
   6. 易测试，提供了各种case的测试⽅案，包括mock task，分⽀覆盖等等。

   redux-saga缺陷：

   1. 额外的学习成本：redux-saga不仅在使⽤难以理解的generator function，⽽且有数⼗个API，学习成本远超reduxthunk，最重要的是你的额外学习成本是只服务于这个库的，与redux-observable不同，redux-observable虽然也有额外学习成本但是背后是rxjs和⼀整套思想；
   2. 体积庞⼤：体积略⼤，代码近2000⾏，min版25KB左右；
   3. 功能过剩：实际上并发控制等功能很难⽤到，但是我们依然需要引⼊这些代码；
   4. ts⽀持不友好：yield⽆法返回TS类型。

   redux-observable优点：

   1. 功能最强：由于背靠rxjs这个强⼤的响应式编程的库，借助rxjs的操作符，你可以⼏乎做任何你能想到的异步处理；
   2. 背靠rxjs：由于有rxjs的加持，如果你已经学习了rxjs，redux-observable的学习成本并不⾼，⽽且随着rxjs的升级reduxobservable也会变得更强⼤。

   redux-observable缺陷：

   1. 学习成本奇⾼：如果你不会rxjs，则需要额外学习两个复杂的库；
   2. 社区⼀般：redux-observable的下载量只有redux-saga的1/5，社区也不够活跃，在复杂异步流中间件这个层⾯reduxsaga仍处于领导地位。


### Hook

1. hook的原理

   hook是一个有序链表，在函数组件中，state与effect 是按照顺序存储 fiber 中的，因此使用的时候一定要注意 Hook 的顺序问题，保证其稳定性。所以使用hook需要遵守以下规则：**不要在循环、条件或嵌套函数中调用 Hook，确保总是在你的 React 函数的最顶层调用它们**。

   成为hook的两个特定条件：

   1. 可组合：具有复用价值，因为hook的一大目标就是完成组件的复用。开发者可以自定义hook，而不必使用官方指定的hook。
   2. 可调试：如果应用出现差错，能够从错误的 props 和 state 中找到错误的组件或逻辑，具有这样调试功能的特性才有资格成为一个hook。

2. hook常用的API有哪些？

   1. useState：使函数组件具有操作state的能力。入参为初始state值，返回一个数组，数组第一项是state，第二项是改变state的函数

      为什么返回数组：表意更加清晰且简单，也支持我们自动设置别名。

   2. useEffect：用来模拟函数组件的生命周期，useEffect声明的回调函数会在组件挂载、更新、卸载的时候执行。入参为回调函数和依赖数组，如果数组中任何一项有变化，都会执行回调函数。

   3. useReducer：让state更加 Redux 化，让我们能够更清晰地处理状态数据。

   4. useContext：获取context的值

3. 何时使用useState？何时使用useReducer？

   useSate本质上是useReducer的语法糖

   useSate 的使用：

   - state为基本数据类型，转换逻辑简单的场景
   - state转换只会在当前组件中出现，其他组件不需要感知这个state
   - 多个useState hook 之间的 state 并没有关联关系

   useReducer 的使用：

   - state 为引用类型，转换逻辑比较复杂的场景
   - 不同的state之间存在较强的关联关系，应该作为一个object，用一个state来表示的场景
   - 需要更换的可维护性和可测试性的场景

### 性能优化

1. React性能优化的方式有哪些？

   - 渲染列表时加 key
   - DOM事件、自定义事件及时销毁
   - 合理使用异步组件
   - 减少函数 bind this 的次数
   - 合理使用 PureComponent 和 memo
   - 合理使用 Immutable.js
   - webpack 层面的优化
   - 前端通用的性能优化，如图片懒加载
   - 使用SSR

2. React 和 Vue 的区别

   相同点

   - 都支持组件化
   - 都是数据驱动视图
   - 都是用 vdom 操作 DOM

   不同点

   - React 使用 JSX 拥抱 JS，Vue 使用模板拥抱 html
   - React 函数式编程，Vue 声明式编程
   - React 更多需要自力更生，Vue 把想要的都给你
