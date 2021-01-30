## React

1. React 使用场景？

2. 描述一下React 生命周期

3. 实现组件有哪些方式？

4. 应该在React生命周期的什么阶段发出ajax请求，为什么？

5. shouldComponentUpdate函数有什么作用？

6. 当组件的setState函数被调用之后，发生了什么？

7. 为什么循环产生的组件中要利用上key这个特殊的prop？

8. React-router 路由的实现原理？

9. 说说React Native,Weex框架的实现原理？

10. 受控组件(Controlled Component)与非受控组件(Uncontrolled Component)的区别

11. refs 是什么?

12. React为什么自己定义一套事件体系呢，与浏览器原生事件体系有什么关系？

13. 什么时候应该选择用class实现一个组件，什么时候用一个函数实现一个组件？

    ```
      	组件用到了state或者用了生命周期函数，那么就该使用Class component。其他情况下，应使用Functional component。
    ```

14. 什么是HoC（Higher-Order Component）？适用于什么场景？

    ```
      	高阶组件就是一个 React 组件包裹着另外一个 React 组件
    ```

15. 并不是父子关系的组件，如何实现相互的数据通信？

    ```
      	使用父组件，通过props将变量传入子组件 （如通过refs，父组件获取一个子组件的方法，简单包装后，将包装后的方法通过props传入另一个子组件 ）
    ```

16. 用过 React 技术栈中哪些数据流管理库？

    ```
      	Redux\Dva
    ```

17. Redux是如何做到可预测呢？

18. Redux将React组件划分为哪两种？

19. Redux是如何将state注入到React组件上的？

20. 请描述一次完整的 Redux 数据流

21. React的批量更新机制 BatchUpdates？

22. React与Vue，各自的组件更新进行对比，它们有哪些区别？

23. redux-saga 和 mobx 的比较

24. 不通过redux这类状态机怎么改变props的值？