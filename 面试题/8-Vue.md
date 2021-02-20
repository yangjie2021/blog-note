## Vue

1. 从源码的角度分析一下vue的生命周期？vue源码中属性和方法哪一个先初始化？

2. vue双向绑定的原理？

   数据发生变化更新视图：

   - 数据响应式：初始化vue实例的时候，创建侦听器，将data中的对象以及子对象递归转换为响应式对象，即通过Object.definePerty添加get和set方法，在添加get方法中给每一个属性收集观察者依赖。观察者是在编译器解析dom上的差值表达式、指令等方法时候创建的用于监听数据变化的对象。在创建观察者的时候，编译器会将修改dom的回调函数传递给它。
   - 更新视图：当数据发生变化时，侦听器通知变化给订阅者Dep，订阅者Dep触发notify方法发送通知给观察者Watcher，Watcher调用update方法触发修改dom的回调函数来更新视图。

   视图发生变化更新数据：

   - 模板编译：初始化vue实例的时候，在创建侦听器过后创建了模板编译器，负责解析指令或差值表达式。即摘取页面中绑定响应式数据属性名，将初始属性值添加dom的具体位置上，并且为v-on，v-model这样的dom节点添加addEventListener事件监听，监听click或input事件。
   - 更新数据：当视图发生变化的时候，触发事件监听，改变vue实例上data中对应字段名的数据为最新的值。

3. vue中如何操作数组？

   当调用array的push方法操作数据的时候，因为push方法是数组的原生方法，无法收集依赖，更不会更新视图。所以vue在创建侦听器的时候对数组进行了特殊处理：创建一个空对象，将对象的原型指向Array.prototype，遍历所有修改原数组的值，如果有新增的元素，将这个元素转换为响应式的数据，最后发送通知更新视图。

4. vue中data属性为什么是一个函数？

5. vue-router的生命周期有哪些？

6. 如果计算属性返回值是一个 `new Date`，当修改这个属性的时候，获取到的是当前时间吗？为什么？

7. vuex的使用场景？数据存储如何划分？

8. 什么是单向数据流？

9. vue计算属性的机制，以及使用场景？

10. 封装过哪些组件库？vue组件通信的方式。

11. vue3.0新增了哪些功能？

12. 什么是单向数据流？

13. 阐述一下 VUE中 eventbus 的原理   （猿辅导）

14. Vue自定义指令懒加载

15. vue3.0的新特性，了解 composition-api 和react hooks的区别？Vue3 究竟好在哪里？

16. Proxy和Object.defineProperty的区别？

    - Proxy代理整个对象，Object.defineProperty只代理对象上的某个属性 
    - 如果对象内部要全部递归代理，则Proxy可以只在调用时递归，而Object.defineProperty需要在一开始就全部递归，Proxy性能优于Object.defineProperty
    - Proxy 可以**监视**读写以外的操作，比如deleteProperty方法监听删除
    - Proxy 可以很方便的监视数组操作，因为set有target, property, value三个入参
    - Proxy 不需要侵入对象
    - Proxy不兼容IE，Object.defineProperty不兼容IE8及以下

17. composition api 和 react hooks的区别是什么？

18. new Vue做了什么

19. vue组件通信方法

20. vue计算属性的使用场景？

21. vuex的使用场景？数据存储如何划分？

22. 解释一下 Backbone 的 MVC 实现方式？

23. 什么是“前端路由”?什么时候适合使用“前端路由”? “前端路由”有哪些优点和缺点?

24. 实现一个页面操作不会整页刷新的网站，并且能在浏览器前进、后退时正确响应。给出你的技术实现方案？

25. 简单实现一个Virtual DOM

