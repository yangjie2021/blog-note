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

17. composition api 和 react hooks的区别是什么？

18. new Vue做了什么

19. vue组件通信方法

20. vue计算属性的使用场景？

21. vuex的使用场景？数据存储如何划分？

22. 解释一下 Backbone 的 MVC 实现方式？

23. 什么是“前端路由”?什么时候适合使用“前端路由”? “前端路由”有哪些优点和缺点?

24. 实现一个页面操作不会整页刷新的网站，并且能在浏览器前进、后退时正确响应。给出你的技术实现方案？

25. 简单实现一个Virtual DOM

## vue框架篇

### vue的优点

轻量级框架：只关注视图层，是一个构建数据的视图集合，大小只有几十kb；

简单易学：国人开发，中文文档，不存在语言障碍 ，易于理解和学习；

双向数据绑定：保留了angular的特点，在数据操作方面更为简单；

组件化：保留了react的优点，实现了html的封装和重用，在构建单页面应用方面有着独特的优势；

视图，数据，结构分离：使数据的更改更为简单，不需要进行逻辑代码的修改，只需要操作数据就能完成相关操作；

虚拟DOM：dom操作是非常耗费性能的，不再使用原生的dom操作节点，极大解放dom操作，但具体操作的还是dom不过是换了另一种方式；

运行速度更快:相比较与react而言，同样是操作虚拟dom，就性能而言，vue存在很大的优势。

### 请详细说下你对vue生命周期的理解？

总共分为8个阶段创建前/后，载入前/后，更新前/后，销毁前/后。

> 创建前/后： 在beforeCreate阶段，vue实例的挂载元素el和数据对象data都为undefined，还未初始化。在created阶段，vue实例的数据对象data有了，el为undefined，还未初始化。

> 载入前/后：在beforeMount阶段，vue实例的$el和data都初始化了，但还是挂载之前为虚拟的dom节点，data.message还未替换。在mounted阶段，vue实例挂载完成，data.message成功渲染。

> 更新前/后：当data变化时，会触发beforeUpdate和updated方法

> 销毁前/后：在执行destroy方法后，对data的改变不会再触发周期函数，说明此时vue实例已经解除了事件监听以及和dom的绑定，但是dom结构依然存在

### 为什么vue组件中data必须是一个函数？

对象为引用类型，当复用组件时，由于数据对象都指向同一个data对象，当在一个组件中修改data时，其他重用的组件中的data会同时被修改；而使用返回对象的函数，由于每次返回的都是一个新对象（Object的实例），引用地址不同，则不会出现这个问题。

### vue中v-if和v-show有什么区别？

v-if和v-show看起来似乎差不多，当条件不成立时，其所对应的标签元素都不可见，但是这两个选项是有区别的:

1、v-if在条件切换时，会对标签进行适当的创建和销毁，而v-show则仅在初始化时加载一次，因此v-if的开销相对来说会比v-show大。

2、v-if是惰性的，只有当条件为真时才会真正渲染标签；如果初始条件不为真，则v-if不会去渲染标签。v-show则无论初始条件是否成立，都会渲染标签，它仅仅做的只是简单的CSS切换。

### computed和watch的区别

#### 计算属性computed：

- 支持缓存，只有依赖数据发生改变，才会重新进行计算
- 不支持异步，当computed内有异步操作时无效，无法监听数据的变化
- computed 属性值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的，也就是基于data中声明过或者父组件传递的props中的数据通过计算得到的值
- 如果一个属性是由其他属性计算而来的，这个属性依赖其他属性，是一个多对一或者一对一，一般用computed
- 如果computed属性属性值是函数，那么默认会走get方法；函数的返回值就是属性的属性值；在computed中的，属性都有一个get和一个set方法，当数据变化时，调用set方法。

#### 侦听属性watch：

- 不支持缓存，数据变，直接会触发相应的操作；
- watch支持异步；
- 监听的函数接收两个参数，第一个参数是最新的值；第二个参数是输入之前的值；
- 当一个属性发生变化时，需要执行对应的操作；一对多；
- 监听数据必须是data中声明过或者父组件传递过来的props中的数据，当数据变化时，触发其他操作，函数有两个参数：

> immediate：组件加载立即触发回调函数执行

```
watch: {
  firstName: {
    handler(newName, oldName) {
      this.fullName = newName + ' ' + this.lastName;
    },
    // 代表在wacth里声明了firstName这个方法之后立即执行handler方法
    immediate: true
  }
}
复制代码
```

> deep: deep的意思就是深入观察，监听器会一层层的往下遍历，给对象的所有属性都加上这个监听器，但是这样性能开销就会非常大了，任何修改obj里面任何一个属性都会触发这个监听器里的 handler

```
watch: {
  obj: {
    handler(newName, oldName) {
      console.log('obj.a changed');
    },
    immediate: true,
    deep: true
  }
}
复制代码
```

优化：我们可以使用字符串的形式监听

```
watch: {
  'obj.a': {
    handler(newName, oldName) {
      console.log('obj.a changed');
    },
    immediate: true,
    // deep: true
  }
}
复制代码
```

这样Vue.js才会一层一层解析下去，直到遇到属性a，然后才给a设置监听函数。

### vue-loader是什么？使用它的用途有哪些？

vue文件的一个加载器，跟template/js/style转换成js模块。

### $nextTick是什么？

vue实现响应式并不是数据发生变化后dom立即变化，而是按照一定的策略来进行dom更新。

> nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用nextTick，则可以在回调中获取更新后的 DOM

### v-for key的作用

当Vue用 v-for 正在更新已渲染过的元素列表是，它默认用“就地复用”策略。如果数据项的顺序被改变，Vue将不是移动DOM元素来匹配数据项的改变，而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。

为了给Vue一个提示，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素，你需要为每项提供一个唯一 key 属性。key属性的类型只能为 string或者number类型。

key 的特殊属性主要用在Vue的虚拟DOM算法，在新旧nodes对比时辨识VNodes。如果不使用 key，Vue会使用一种最大限度减少动态元素并且尽可能的尝试修复/再利用相同类型元素的算法。使用key，它会基于key的变化重新排列元素顺序，并且会移除 key 不存在的元素。

### Vue的双向数据绑定原理是什么？

vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。主要分为以下几个步骤：

> 1、需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化

> 2、compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图

> 3、Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是: ①在自身实例化时往属性订阅器(dep)里面添加自己 ②自身必须有一个update()方法 ③待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

> 4、MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。

### 组件传值

#### 父传子

通过props传递

```
父组件： <child value = '传递的数据' />

子组件: props['value'],接收数据,接受之后使用和data中定义数据使用方式一样
复制代码
```

#### 子传父

在父组件中给子组件绑定一个自定义的事件，子组件通过$emit()触发该事件并传值。

```
父组件： <child @receive = 'receive' />

 子组件: this.$emit('receive','传递的数据')
复制代码
```

#### 兄弟组件传值

- 通过中央通信 let bus = new Vue()

> A：methods :{ 函数{bus.$emit(‘自定义事件名’，数据)} 发送

> B：created （）{bus.$on(‘A发送过来的自定义事件名’，函数)} 进行数据接收

- 通过vuex

### prop 验证，和默认值

我们在父组件给子组件传值的时候，可以指定该props的默认值及类型，当传递数据类型不正确的时候，vue会发出警告

```
props: {
    visible: {
        default: true,
        type: Boolean,
        required: true
    },
}
```

### 请说下封装 vue 组件的过程

首先，组件可以提升整个项目的开发效率。能够把页面抽象成多个相对独立的模块，解决了我们传统项目开发：效率低、难维护、复用性等问题。

然后，使用Vue.extend方法创建一个组件，然后使用Vue.component方法注册组件。子组件需要数据，可以在props中接受定义。而子组件修改好数据后，想把数据传递给父组件。可以采用emit方法。

### Vue.js的template编译

简而言之，就是先转化成AST树，再得到的render函数返回VNode（Vue的虚拟DOM节点），详细步骤如下：

> 首先，通过compile编译器把template编译成AST语法树（abstract syntax tree 即 源代码的抽象语法结构的树状表现形式），compile是createCompiler的返回值，createCompiler是用以创建编译器的。另外compile还负责合并option。

> 然后，AST会经过generate（将AST语法树转化成render funtion字符串的过程）得到render函数，render的返回值是VNode，VNode是Vue的虚拟DOM节点，里面有（标签名、子节点、文本等等）

### scss是什么？在vue.cli中的安装使用步骤是？有哪几大特性？

css的预编译,使用步骤如下：

第一步：用npm 下三个loader（sass-loader、css-loader、node-sass）

第二步：在build目录找到webpack.base.config.js，在那个extends属性中加一个拓展.scss

第三步：还是在同一个文件，配置一个module属性

第四步：然后在组件的style标签加上lang属性 ，例如：lang=”scss”

特性主要有:

- 可以用变量，例如（$变量名称=值）
- 可以用混合器，例如（）
- 可以嵌套

### vue如何监听对象或者数组某个属性的变化

当在项目中直接设置数组的某一项的值，或者直接设置对象的某个属性值，这个时候，你会发现页面并没有更新。这是因为Object.defineProperty()限制，监听不到变化。

解决方式：

- this.$set(你要改变的数组/对象，你要改变的位置/key，你要改成什么value)

```
this.$set(this.arr, 0, "OBKoro1"); // 改变数组
this.$set(this.obj, "c", "OBKoro1"); // 改变对象
复制代码
```

- 调用以下几个数组的方法

```
splice()、 push()、pop()、shift()、unshift()、sort()、reverse()
复制代码
```

vue源码里缓存了array的原型链，然后重写了这几个方法，触发这几个方法的时候会observer数据，意思是使用这些方法不用我们再进行额外的操作，视图自动进行更新。 推荐使用splice方法会比较好自定义,因为splice可以在数组的任何位置进行删除/添加操作

### 常用的事件修饰符

- .stop:阻止冒泡
- .prevent:阻止默认行为
- .self:仅绑定元素自身触发
- .once: 2.1.4 新增,只触发一次
- passive: 2.3.0 新增,滚动事件的默认行为 (即滚动行为) 将会立即触发,不能和.prevent 一起使用
- .sync 修饰符

从 2.3.0 起vue重新引入了.sync修饰符，但是这次它只是作为一个编译时的语法糖存在。它会被扩展为一个自动更新父组件属性的 v-on 监听器。示例代码如下：

```
<comp :foo.sync="bar"></comp>
复制代码
```

会被扩展为：

```
<comp :foo="bar" @update:foo="val => bar = val"></comp>
复制代码
```

当子组件需要更新 foo 的值时，它需要显式地触发一个更新事件：

```
this.$emit('update:foo', newValue)
复制代码
```

### vue如何获取dom

先给标签设置一个ref值，再通过this.$refs.domName获取，例如：

```
<div ref="test"></div>

const dom = this.$refs.test
复制代码
```

### v-on可以监听多个方法吗？

是可以的，来个例子：

```
<input type="text" v-on="{ input:onInput,focus:onFocus,blur:onBlur, }">
复制代码
```

### assets和static的区别

这两个都是用来存放项目中所使用的静态资源文件。

两者的区别：

assets中的文件在运行npm run build的时候会打包，简单来说就是会被压缩体积，代码格式化之类的。打包之后也会放到static中。

static中的文件则不会被打包。

> 建议：将图片等未处理的文件放在assets中，打包减少体积。而对于第三方引入的一些资源文件如iconfont.css等可以放在static中，因为这些文件已经经过处理了。

### slot插槽

很多时候，我们封装了一个子组件之后，在父组件使用的时候，想添加一些dom元素，这个时候就可以使用slot插槽了，但是这些dom是否显示以及在哪里显示，则是看子组件中slot组件的位置了。

### vue初始化页面闪动问题

使用vue开发时，在vue初始化之前，由于div是不归vue管的，所以我们写的代码在还没有解析的情况下会容易出现花屏现象，看到类似于{{message}}的字样，虽然一般情况下这个时间很短暂，但是我们还是有必要让解决这个问题的。

首先：在css里加上以下代码

```
[v-cloak] {
    display: none;
}
复制代码
```

如果没有彻底解决问题，则在根元素加上style="display: none;" :style="{display: 'block'}"

## vue插件篇

### 状态管理（vuex）

#### vuex是什么

Vuex 是一个专为 Vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 也集成到 Vue 的官方调试工具 devtools extension，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

#### 怎么使用vuex

第一步安装

```
npm install vuex -S
复制代码
```

第二步创建store

```
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
//不是在生产环境debug为true
const debug = process.env.NODE_ENV !== 'production';
//创建Vuex实例对象
const store = new Vuex.Store({
    strict:debug,//在不是生产环境下都开启严格模式
    state:{
    },
    getters:{
    },
    mutations:{
    },
    actions:{
    }
})
export default store;
复制代码
```

第三步注入vuex

```
import Vue from 'vue';
import App from './App.vue';
import store from './store';
const vm = new Vue({
    store:store,
    render: h => h(App)
}).$mount('#app')
复制代码
```

#### vuex中有几个核心属性，分别是什么？

一共有5个核心属性，分别是:

- state 唯一数据源,Vue 实例中的 data 遵循相同的规则
- getters 可以认为是 store 的计算属性,就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。Getter 会暴露为 store.getters 对象，你可以以属性的形式访问这些值.

```
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})

store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
复制代码
```

- mutation 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation,非常类似于事件,通过store.commit 方法触发

```
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})

store.commit('increment')
复制代码
```

- action Action 类似于 mutation，不同在于Action 提交的是 mutation，而不是直接变更状态，Action 可以包含任意异步操作

```
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
复制代码
```

- module  由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。

```
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
复制代码
```

#### ajax请求代码应该写在组件的methods中还是vuex的actions中

如果请求来的数据是不是要被其他组件公用，仅仅在请求的组件内使用，就不需要放入vuex 的state里。

如果被其他地方复用，这个很大几率上是需要的，如果需要，请将请求放入action里，方便复用。

#### 从vuex中获取的数据能直接更改吗？

从vuex中取的数据，不能直接更改，需要浅拷贝对象之后更改，否则报错；

#### vuex中的数据在页面刷新后数据消失

用sessionstorage 或者 localstorage 存储数据

```
存储： sessionStorage.setItem( '名', JSON.stringify(值) )
使用： sessionStorage.getItem('名') ---得到的值为字符串类型，用JSON.parse()去引号；
复制代码
```

也可以引入插件vuex-persist，使用方法如下：

- 安装

```
npm install --save vuex-persist
or
yarn add vuex-persist
复制代码
```

- 引入

```
import VuexPersistence from 'vuex-persist'
复制代码
```

- 先创建一个对象并进行配置

```
const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})
复制代码
```

- 引入进vuex插件

```
const store = new Vuex.Store({
  state: { ... },
  mutations: { ... },
  actions: { ... },
  plugins: [vuexLocal.plugin]
}) 
复制代码
```

通过以上设置，在图3中各个页面之间跳转，如果刷新某个视图，数据并不会丢失，依然存在，并且不需要在每个 mutations 中手动存取 storage 。

#### Vuex的严格模式是什么,有什么作用,怎么开启？

在严格模式下，无论何时发生了状态变更且不是由mutation函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。

在Vuex.Store 构造器选项中开启,如下

```
const store = new Vuex.Store({
    strict:true,
})
复制代码
```

#### 怎么在组件中批量使用Vuex的getter属性

使用mapGetters辅助函数, 利用对象展开运算符将getter混入computed 对象中

```
import {mapGetters} from 'vuex'
export default{
    computed:{
        ...mapGetters(['total','discountTotal'])
    }
}
复制代码
```

#### 组件中重复使用mutation

使用mapMutations辅助函数,在组件中这么使用

```
import { mapMutations } from 'vuex'
methods:{
    ...mapMutations({
        setNumber:'SET_NUMBER',
    })
}
复制代码
```

然后调用this.setNumber(10)相当调用this.$store.commit('SET_NUMBER',10)

#### mutation和action有什么区别

- action 提交的是 mutation，而不是直接变更状态。mutation可以直接变更状态
- action 可以包含任意异步操作。mutation只能是同步操作
- 提交方式不同

```
action 是用this.store.dispatch('ACTION_NAME',data)来提交。
mutation是用this.$store.commit('SET_NUMBER',10)来提交
复制代码
```

- 接收参数不同，mutation第一个参数是state，而action第一个参数是context，其包含了

```
{
    state,      // 等同于 `store.state`，若在模块中则为局部状态
    rootState,  // 等同于 `store.state`，只存在于模块中
    commit,     // 等同于 `store.commit`
    dispatch,   // 等同于 `store.dispatch`
    getters,    // 等同于 `store.getters`
    rootGetters // 等同于 `store.getters`，只存在于模块中
}

复制代码
```

#### 在v-model上怎么用Vuex中state的值？

需要通过computed计算属性来转换。

```
<input v-model="message">
// ...
computed: {
    message: {
        get () {
            return this.$store.state.message
        },
        set (value) {
            this.$store.commit('updateMessage', value)
        }
    }
}

复制代码
```

### 路由页面管理（vue-router）

#### 什么是vue-router

Vue Router 是 Vue.js 官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。包含的功能有：

- 嵌套的路由/视图表
- 模块化的、基于组件的路由配置
- 路由参数、查询、通配符
- 基于 Vue.js 过渡系统的视图过渡效果
- 细粒度的导航控制
- 带有自动激活的 CSS class 的链接
- HTML5 历史模式或 hash 模式，在 IE9 中自动降级
- 自定义的滚动条行为

#### 怎么使用vue-router

第一步安装

```
npm install vue-router -S

复制代码
```

第二步在main.js中使用Vue Router组件

![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="577" height="290"></svg>)

第三步配置路由

- 定义 (路由) 组件

路由组件可以是直接定义，也可以是导入已经定义好的组件。这里导入已经定义好的组件。如下

![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="408" height="87"></svg>)

- 定义路由（路由对象数组）

定义路由对象数组。对象的path是自定义的路径（即使用这个路径可以找到对应的组件），component是指该路由对应的组件。如下：

![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="678" height="152"></svg>)

- 实例化Vue Router对象

调用Vue Router的构造方法创建一个Vue Router的实例对象，将上一步定义的路由对象数组作为参数对象的值传入。如下

![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="621" height="74"></svg>)

- 挂载根实例

![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="288" height="175"></svg>)

第四步在App.vue中使用路由

在App.vue中使用标签来显示路由对应的组件，使用标签指定当点击时显示的对应的组件，to属性就是指定组件对应的路由。如下：

![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="476" height="178"></svg>)

#### 怎么定义vue-router的动态路由？怎么获取传过来的动态参数？

在router目录下的index.js文件中，对path属性加上/:id。使用router对象的params.id获取动态参数

#### vue-router的导航钩子

常用的是router.beforeEach(to,from,next)，在跳转前进行权限判断。一共有三种：

- 全局导航钩子：router.beforeEach(to,from,next)
- 组件内的钩子
- 单独路由独享组件

#### vue路由传参

> 使用query方法传入的参数使用this.$route.query接受

> 使用params方式传入的参数使用this.$route.params接受

#### router和route的区别

> route为当前router跳转对象里面可以获取name、path、query、params等

> router为VueRouter实例，想要导航到不同URL，则使用router.push方法

#### 路由 TypeError: Cannot read property 'matched' of undefined 的错误问题

找到入口文件main.js里的new Vue()，必须使用router名，不能把router改成Router或者其他的别名

```
// 引入路由
import router from './routers/router.js'

new Vue({
    el: '#app',
    router,    // 这个名字必须使用router
    render: h => h(App)
});

复制代码
```

#### 路由按需加载

随着项目功能模块的增加，引入的文件数量剧增。如果不做任何处理，那么首屏加载会相当的缓慢，这个时候，路由按需加载就闪亮登场了。

```
webpack< 2.4 时
{ 
    path:'/', 
    name:'home',
    components:resolve=>require(['@/components/home'],resolve)
} 
webpack> 2.4 时
{ 
    path:'/', 
    name:'home', 
    components:()=>import('@/components/home')
}

复制代码
```

import()方法是由es6提出的，动态加载返回一个Promise对象，then方法的参数是加载到的模块。类似于Node.js的require方法，主要import()方法是异步加载的。

#### Vue里面router-link在电脑上有用，在安卓上没反应怎么解决

Vue路由在Android机上有问题，babel问题，安装babel polypill插件解决

#### Vue2中注册在router-link上事件无效解决方法

使用@click.native。原因：router-link会阻止click事件，.native指直接监听一个原生事件

#### RouterLink在IE和Firefox中不起作用（路由不跳转）的问题

- 只用a标签，不使用button标签
- 使用button标签和Router.navigate方法

### 网络请求(axios)

这个模块请看我的另一篇文章，此处不再整理（我太懒了）

[学会了axios封装，世界都是你的](https://juejin.im/post/6847009771606769677)

### 视频播放(video.js)

这个模块请看我的另一篇文章，此处不再整理（我太懒了）

[手把手从零开始---封装一个vue视频播放器组件](https://juejin.im/post/6850037269227634702)

### vue常用ui库

#### 移动端

- mint-ui （http://mint-ui.github.io/#!/zh-cn）
- Vant（https://youzan.github.io/vant/#/zh-CN/home）
- VUX (https://vux.li/)

#### pc端

- element-ui（https://element.eleme.cn/2.13/#/zh-CN/component/installation）
- Ant Design of Vue（https://www.antdv.com/docs/vue/introduce-cn/）
- Avue (https://avuejs.com/)

## 常用webpack配置

### vue-lic3脚手架（vue.config.js）

#### publicPath

类型：String

默认：'/'

部署应用包时的基本 URL。默认情况下，Vue CLI会假设你的应用是被部署在一个域名的根路径上，例如https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在https://www.my-app.com/my-app/，则设置publicPath为/my-app/

这个值也可以被设置为空字符串 ('') 或是相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径，也可以用在类似 Cordova hybrid 应用的文件系统中。

#### productionSourceMap

类型：boolean

moren：true

不允许打包时生成项目来源映射文件，在生产环境下可以显著的减少包的体积

> 注 Source map的作用：针对打包后的代码进行的处理，就是一个信息文件，里面储存着位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。有了它，出错的时候，除错工具将直接显示原始代码，而不是转换后的代码。这无疑给开发者带来了很大方便

#### assetsDir

放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录,默认是'',

#### indexPath

指定生成的 index.html 的输出路径(相对于outputDir)。也可以是一个绝对路径。默认是'index.html'

#### lintOnSave

是否在每次保存时使用eslint检查，这个对语法的要求比较严格，对自己有要求的同学可以使用

#### css

```
css: {
    //是否启用css分离插件，默认是true，如果不启用css样式分离插件，打包出来的css是通过内联样式的方式注入至dom中的，
    extract: true,
    sourceMap: false,//效果同上
    modules: false,// 为所有的 CSS 及其预处理文件开启 CSS Modules。
    // 这个选项不会影响 `*.vue` 文件。
  },

复制代码
```

#### devServer

本地开发服务器配置，此处直接贴上我常用的配置，以注释的方式介绍

```
devServer: { 
    //配置开发服务器
    host: "0.0.0.0",
    //是否启用热加载，就是每次更新代码，是否需要重新刷新浏览器才能看到新代码效果
    hot: true,
    //服务启动端口
    port: "8080",
    //是否自动打开浏览器默认为false
    open: false,
    //配置http代理
    proxy: { 
      "/api": { //如果ajax请求的地址是http://192.168.0.118:9999/api1那么你就可以在jajx中使用/api/api1路径,其请求路径会解析
        // http://192.168.0.118:9999/api1，当然你在浏览器上开到的还是http://localhost:8080/api/api1;
        target: "http://192.168.0.118:9999",
        //是否允许跨域，这里是在开发环境会起作用，但在生产环境下，还是由后台去处理，所以不必太在意
        changeOrigin: true,
        pathRewrite: {
            //把多余的路径置为''
          "api": ""
        }
      },
      "/api2": {//可以配置多个代理，匹配上那个就使用哪种解析方式
        target: "http://api2",
        // ...
      }
    }
},

复制代码
```

#### pluginOptions

这是一个不进行任何 schema 验证的对象，因此它可以用来传递任何第三方插件选项，例如：

```
{
    //定义一个全局的less文件，把公共样式变量放入其中，这样每次使用的时候就不用重新引用了
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        './src/assets/public.less'
      ]
    }
}

复制代码
```

#### chainWebpack

是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。例如：

```
chainWebpack(config) { 
//添加一个路径别名 假设有在assets/img/menu/目录下有十张图片，如果全路径require("/assets/img/menu/img1.png")
//去引入在不同的层级下实在是太不方便了，这时候向下方一样定义一个路劲别名就很实用了
    config.resolve.alias
      //添加多个别名支持链式调用
      .set("assets", path.join(__dirname, "/src/assets"))
      .set("img", path.join(__dirname, "/src/assets/img/menu"))
      //引入图片时只需require("img/img1.png");即可
}
```

