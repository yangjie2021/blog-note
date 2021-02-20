## React

### 基础

1. react 元素如何渲染到页面中的？

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

2. react diff 原理

3. 当组件的setState函数被调用之后，发生了什么？

   向任务队列中调度更新的任务，重新为每一个节点构建fiber对象，添加修改后的state对象(partialState)，

   执行任务过程中，找到对应的state，和旧的state进行合并，最后调用render方法更新Dom

4. React 中 keys 的作用是什么？为什么循环产生的组件中要利用上key这个特殊的prop？

5. React 中 refs 的作用是什么？

6. React 中有三种构建组件的方式

   jsx 组件式 函数式

7. 为什么建议传递给 setState 的参数是一个 callback 而不是一个对象

8. 除了在构造函数中绑定 this，还有其它方式吗

9. setState第二个参数的作用

10. (在构造函数中)调用 super(props) 的目的是什么

11. 简述 flux 思想

12. 在 React 当中 Element 和 Component 有何区别？

13. 描述事件在 React 中的处理方式。

14. createElement 和 cloneElement 有什么区别？

15. 如何告诉 React 它应该编译生产环境版本？

16. React的批量更新机制 BatchUpdates？

17. React-router 路由的实现原理？

### 生命周期

1. 描述一下React 生命周期，指出(组件)生命周期方法的不同
   1. componentDidUpdate: `componentDidUpdate(prevProps, prevState, snapshot) {}`
   2. getSnapshotBeforeUpdate ：在组件完成更新之前执行，用于执行某种逻辑或计算，返回值可以在 componentDidUpdate 方法中的第三个参数中获取，就是说在组件更新之后可以拿到这个值再去做其他事情。
2. react生命周期中，最适合与服务端进行数据交互的是哪个函数
3. 运行阶段生命周期调用顺序
4. shouldComponentUpdate 是做什么的，（react 性能优化是哪个周期函数？）
5. 应该在React生命周期的什么阶段发出ajax请求，为什么？
6. shouldComponentUpdate函数有什么作用？

### 组件

1. 受控组件(Controlled Component)与非受控组件(Uncontrolled Component)的区别

2. 实现组件有哪些方式？

3. 展示组件(Presentational component)和容器组件(Container component)之间有何不同

4. 类组件(Class component)和函数式组件(Functional component)之间有何不同

5. (组件的)状态(state)和属性(props)之间有何不同

6. 何为高阶组件(higher order component)

7. 应该在 React 组件的何处发起 Ajax 请求

8. react中组件传值

9. 什么时候在功能组件( Class Component )上使用类组件( Functional Component )？

10. 受控组件( controlled component )与不受控制的组件( uncontrolled component )有什么区别？

11. react 组件的划分业务组件技术组件？

12. 什么时候应该选择用class实现一个组件，什么时候用一个函数实现一个组件？

    ```
      	组件用到了state或者用了生命周期函数，那么就该使用Class component。其他情况下，应使用Functional component。
    ```

13. 什么是HoC（Higher-Order Component）？适用于什么场景？

    ```
      	高阶组件就是一个 React 组件包裹着另外一个 React 组件
    ```

14. 并不是父子关系的组件，如何实现相互的数据通信？

    ```
      	使用父组件，通过props将变量传入子组件（如通过refs，父组件获取一个子组件的方法，简单包装后，将包装后的方法通过props传入另一个子组件）
    ```

### redux

1. 用过 React 技术栈中哪些数据流管理库？

   Redux\Dva

2. Redux是如何做到可预测呢？

3. Redux将React组件划分为哪两种？

4. Redux是如何将state注入到React组件上的？

5. 请描述一次完整的 Redux 数据流

6. redux中间件

7. redux有什么缺点

8. redux-saga 和 mobx 的比较

9. 不通过redux这类状态机怎么改变props的值？

### 性能优化

1. vue和react的区别

   react16架构：

   1. Scheduler (调度层)：调度任务的优先级，高优任务优先进入协调器
      - 减少diff时间：virtualDOM 的比对：循环加递归 改为 循环模拟递归
      - 空间时执行任务：使用requestIdleCallback API，让比对在空闲时间完成
      - 设置任务优先级：Scheduler调度库，高优先级任务先执行，低优先级任务后执行
   2. Reconciler (协调层)：构建 Fiber 数据结构，比对 Fiber 对象找出差异, 记录 Fiber 对象要进行的 DOM 操作
   3. Renderer (渲染层)：根据协调器标记的差异，同步将发生变化的部分渲染到页面上（调度和协调任务可以被打断，渲染任务不可以）

2. 说说React Native,Weex框架的实现原理？

3. React为什么自己定义一套事件体系呢，与浏览器原生事件体系有什么关系？

4. React与Vue，各自的组件更新进行对比，它们有哪些区别？

5. react性能优化的方案

6. React 项目用过什么脚手架

7. 如果你创建了类似于下面的 Twitter 元素，那么它相关的类定义是啥样子的？

8. 为什么我们需要使用 React 提供的 Children API 而不是 JavaScript 的 map？