# 状态管理

通过状态集中管理和分发解决多个组件共享状态的问题

组成：

- state：状态，驱动应用的数据源
- view：视图，以声明方式将state映射到视图，通过将状态绑定到视图呈现给用户
- actions：响应在view上的用户输入导致的状态变化

## 组件间的通信方式

父传子

- 子组件通过props接收数据
- 父组件中子组件通过该响应的属性传值

子传父：

- 通过子组件触发事件的时候携带参数，然后在父组件中注册子组件内部触发的事件，并接收传递的数据，完成子向父的传值。在注册事件的时候，行内可以通过$event获取事件传递的参数，在事件处理函数中不能这样使用。

- 在子组件中使用 $emit 发布一个自定义事件，父组件在使用这个组件的时候，使用 v-on 监听这个自定义事件

非父子组件

- EventBus：使用自定义事件传递数据，因为没有父子组件，所以需要事件中心，通过事件中心来注册和触发事件

其它方式

- $refs：在普通HTML标签上使用，获取到的是DOM，在组件便签上使用，获取的是组件实例。
- $root
- $parent
- $children

## vuex

- 简介：Vuex是专门为Vue.js设计的状态管理库，采用集中式的方式存储需要共享的状态。
- 作用：进行状态管理，解决复杂组件通信，数据共享等问题
- Vuex继承到了devtools中，提供了 time-travel 时光旅行、历史回滚等功能
- 使用场景：组件少的小项目非必要情况下不要使用，推荐在大型的单页面应用程序中，当多个视图依赖同一个状态，或来自不同视图的行为需要变更同一状态时使用

### State

单一状态树，集中存储所有的状态数据，并且是**响应式的**

mapState：使用 mapState 简化 State 在视图中的使用，mapState 返回计算属性

store.js

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'Hello Vuex'
  }
})
```

App.vue

```vue
<template>
  <div id="app">
    <!-- 普通方式 -->
    count：{{ $store.state.count }} <br>
    msg: {{ $store.state.msg }}
    
   <!-- mapState方式 -->
    count：{{ num }} <br>
    msg: {{ message }}
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    // count: state => state.count
    // ...mapState(['count', 'msg']) // 数组形式
    // 对象形式，可以修改的计算属性名字
    ...mapState({ num: 'count', message: 'msg' })
  }
}
```

### Getter

Getter 就是 store 中的计算属性，使用 mapGetter 简化视图中的使用

store.js

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  }
})
```

App.vue

```vue
<template>
  <div id="app">
    reverseMsg: {{ reverseMsg }}
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['reverseMsg'])
  }
}
```

### Mutation

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation，它是**同步**执行的。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 **事件类型** **(type)** 和 一个 **回调函数** **(handler)**。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数。

store.js

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increate (state, payload) {
      state.count += payload
    }
  }
})
```

App.vue

```vue
<template>
  <div id="app">
    count：{{ $store.state.count }} <br>
    <button @click="increate(3)">Mutation</button>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState({ num: 'count'})
  },
  methods: {
    ...mapMutations(['increate'])
  }
}
```

使用 Mutation 改变状态的好处是，集中的一个位置对状态修改，不管在什么地方修改，都可以追踪到状态的修改。devtools 中可以实现高级的 time-travel 调试功能。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2f1a28de6e943c58c7a4b351aabadc3~tplv-k3u1fbpfcp-watermark.image)

### Action

Action 类似于 mutation，不同在于Action 提交的是 mutation，而不是直接变更状态；而且Action 可以包含任意异步操作。

store.js

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increate (state, payload) {
      state.count += payload
    }
  },
  actions: {
    increateAsync (context, payload) {
      setTimeout(() => {
        context.commit('increate', payload)
      }, 2000)
    }
  }
})
```

App.vue

```vue
<template>
  <div id="app">
    count：{{ $store.state.count }} <br>
    <button @click="$store.dispatch('increateAsync', 6)">Action1</button>
    <button @click="increateAsync(6)">Action2</button>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({ num: 'count'})
  },
  methods: {
    // ...mapActions(['increateAsync']), 
    // 传对象解决重名的问题
    ...mapActions({ increateAction: 'increateAsync' })
  }
}
```

### Moudle

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。为了解决以上问题，Vuex 允许我们将 store 分割成**模块（****module****）**。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块。

namespace：命名空间，有了命名空间可以直接将不同的模块的state导入组件，使用起来更方便。

```vue
<template>
  <div id="app">
    <!-- 有命名空间 -->
    products: {{ $store.state.products.products }} <br>
    <button @click="$store.commit('setProducts', [])">Mutation</button>
    <!-- 没有命名空间 -->
    products: {{ products }} <br>
    <button @click="setProducts([])">Mutation</button>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('products', ['products'])
  },
  methods: {
    ...mapMutations('products', ['setProducts'])
  }
}
```

store.js

```js
import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    products
  }
})
```

products.js

```js
const state = {
  products: [
    { id: 1, title: 'iPhone 11', price: 8000 },
    { id: 2, title: 'iPhone 12', price: 10000 }
  ]
}
const getters = {}
const mutations = {
  setProducts (state, payload) {
    state.products = payload
  }
}
const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

### 严格模式

所有的状态变更必须通过mutation，这个逻辑是可以被破坏的，因为从语法层面，直接修改$store.state是没有问题。如果想要遵守这约定，可以参与vuex的严格模式。

store.js

```js
import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  // 生成环境下会影响性能，因为严格模式会深度遍历状态树中不合规的状态改变
  strict: process.env.NODE_ENV !== 'production',
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  },
  mutations: {
    increate (state, payload) {
      state.count += payload
    }
  },
  actions: {
    increateAsync (context, payload) {
      setTimeout(() => {
        context.commit('increate', payload)
      }, 2000)
    }
  },
  modules: {
    products,
    cart
  }
})
```

## 案例-购物车

### 商品列表组件

products.vue

### 商品列表中弹出框组件

### 购物车列表组件



Vuex插件

在提交mutation之前持久化存储数据

```js
import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'
import cart from './modules/cart'

Vue.use(Vuex)

const myPlugin = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type.startsWith('cart/')) {
      window.localStorage.setItem('cart-products', JSON.stringify(state.cart.cartProducts))
    }
  })
}

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    products,
    cart
  },
  plugins: [myPlugin]
})
```

## 模拟Vuex

myvuex.js

```js
let _Vue = null
class Store {
  constructor (options) {
    const {
      state = {},
      getters = {},
      mutations = {},
      actions = {}
    } = options
    this.state = _Vue.observable(state)
    this.getters = Object.create(null)
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get: () => getters[key](state)
      })
    })
    this._mutations = mutations
    this._actions = actions
  }

  commit (type, payload) {
    this._mutations[type](this.state, payload)
  }

  dispatch (type, payload) {
    this._actions[type](this, payload)
  }
}

function install (Vue) {
  _Vue = Vue
  _Vue.mixin({
    beforeCreate () {
      if (this.$options.store) {
        _Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default {
  Store,
  install
}
```

