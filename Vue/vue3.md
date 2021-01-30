## 性能提升

### 响应式系统升级

vue2.x 中使用 defineProperty 定义响应式数据。vue3.x 中使用 proxy 对象重写响应式系统。

这样做的优点是：

1. 可以监听动态新增的属性
2. 可以监听删除的属性
3. 可以监听数组的索引和 length 属性

### 编译优化

vue2.x 中通过标记静态根节点，对比静态子节点，优化diff的过程。

测试地址：https://template-explorer.vuejs.org/#

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04548985e5854078a0b01a41decbbf00~tplv-k3u1fbpfcp-watermark.image)

vue3.x 编译过程的优化主要包括以下几点：

1. Fragments
2. 静态提升
3. Patch flag
4. 缓存事件处理函数

vue3.x 在编译的过程中，会通过标记提升静态节点，通过patch flag在 diff 的时候跳过静态根节点，只需要更新动态节点中的内容，大大提升的 diff 的性能。另外通过对事件处理函数的减少了不必要的更新操作。

测试地址：https://vue-next-template-explorer.netlify.app/#

#### Fragments

当删除了根节点之后，render函数会创建一个Fragment代码片段，同时还会维护一套树形结构

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5fbdad7e4b69408cae0103a544ca81e6~tplv-k3u1fbpfcp-watermark.image)

#### 静态提升

提升静态节点：vue3将静态节点单独提取出来，这样这些静态节点之后再初始化的时候创建一次，下一次调用render函数的时候不需要重新创建，可以直接重用。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/174551dd12c84f82834f05b3474989be~tplv-k3u1fbpfcp-watermark.image)

#### Patch flag

_createVNode 的第三个参数(下面的8和9)代表着差异标记，TEXT代表这是一个动态的文本节点，PROPS代表这里动态绑定了属性。通过这个标记，在对比新旧节点过程中只会对比属性或文本是否发生变化，以此提升diff性能。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/549029bc09a24859a70430680afee2e2~tplv-k3u1fbpfcp-watermark.image)

#### 缓存事件处理函数

vue3 会将函数 `_ctx.handler`缓存到`catche`对象中，避免不必要的更

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c25f9fe268e04113a811142955263123~tplv-k3u1fbpfcp-watermark.image)

### 源码体积优化

vue3中移除了一些不常用的API：inline-template、filter等。对tree-shaking的依赖支持更好，比如组件动态引入。

## composition API

### 创建响应式数据

reactive：将对象转换为响应式对象（代理对象）

toRefs：将代理对象中的所有属性转换为响应式的，返回的对象可以进行结构操作（`...obj`）

ref：将基本类型的数据转换为响应式的

### computed

入参：2种形式

1. 传入一个获取值的函数，函数内部依赖响应式数据，当数据变化后重新执行函数获取数据
2. 传入一个具有getter和setter的对象

返回值：一个不可变的响应式对象，获取对象的值要通过value属性来获取。模板中的计算属性可以省略value。

### watch

入参：3个参数

1. 要监听的数据：可以是一个获取值的函数，也可以是一个ref或reactive返回的对象，也可以是数据
2. 监听到数据变化后执行的回调函数，这函数有两个参数：新值和旧值
3. 选项对象，deep和immediate

返回值：取消监听的函数

### watchEffect

watch的简化版本，不同的是没有第二个回调函数的参数，它只接收一个函数作为参数，监听函数内响应式数据的变化，默认立即执行这个函数，数据变化后重新执行。

返回值：取消监听的函数

## 响应式系统

通过proxy实现属性监听，多层属性嵌套，在访问属性过程中处理下一级属性

1. 可以监听动态新增的属性
2. 可以监听删除的属性
3. 可以监听数组的索引和 length 属性

创建响应式对象

1. reactive：将对象转换为响应式对象（代理对象），返回的对象重新赋值后会丢失响应式，并且不能结构
2. toRefs：将代理对象中的所有属性转换为响应式的，返回的对象可以进行结构操作（`...obj`）
3. ref：将基本类型的数据转换为响应式的，ref返回的对象，重新赋值成对象也是响应式的

依赖收集

1. effect：用于定义副作用，它的参数就是副作用函数，当响应式数据变化后，会导致副作用函数重新执行
2. track：用来跟踪收集依赖
3. trigger：用来触发响应执行

计算属性

1. computed：接收一个有返回值的函数作为参数，这个返回值就是计算属性的值，并且监听函数内部响应式数据的变化，最后将函数的结果返回。
## vite