# VueRouter

## 基本使用

1. 注册路由插件
2. 创建 router 对象
3. 注册 router 对象：给vue实例注入几个属性：**$route**路由规则、**$router**路由对象、**mode**路由模式、**currentRoute**当前路由规则
4. 创建路由组建的占位：<router-view/>
5. 创建链接: <router-link/>

路由入口文件：src/router/index.js

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
// 1. 注册路由插件
// Vue.use支持对象和函数两种形式的入参。如果传入对象会调用这个对象的install方法，如果传入函数会直接调用
Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  { 
    path: '/blog',
    name: 'Blog',
    component: () => import(/* webpackChunkName: "blog" */ '../views/Blog.vue')
  },
  {
    path: '/photo',
    name: 'Photo',
    component: () => import(/* webpackChunkName: "photo" */ '../views/Photo.vue')
  }
]
// 2. 创建 router 对象
// VueRouter是一个类，有一个静态的install方法
const router = new VueRouter({
  routes
})

export default router
```

项目入口：src/main.js

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  // 3. 注册 router 对象
  router,
  render: h => h(App)
}).$mount('#app')
```

根组件：src/App.vue

```vue
<template>
  <div id="app">
    <div>
      <img src="@/assets/logo.png" alt="">
    </div>
    <div id="nav">
      <!-- 5. 创建链接 -->
      <router-link to="/">Index</router-link> |
      <router-link to="/blog">Blog</router-link> |
      <router-link to="/photo">Photo</router-link>
    </div>
    <!-- 4. 创建路由组建的占位 -->
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
```

## 动态路由

动态路由通过一个占位符匹配路由中变化的位置，推荐使用props传参

router/index.js

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    // 开启 props，会把 URL 中的参数传递给组件
    // 在组件中通过 props 来接收 URL 参数
    props: true,
    // 懒加载，只有路由访问的时候才加载
    component: () => import(/* webpackChunkName: "detail" */ '../views/Detail.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
```

使用方式：Detail.vue

```vue
<template>
  <div>
    <!-- 方式1： 通过当前路由规则，获取数据 -->
    通过当前路由规则获取：{{ $route.params.id }}

    <br>
    <!-- 方式2(推荐)：路由规则中开启 props 传参 -->
    通过开启 props 获取：{{ id }}
  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: ['id']
}
</script>
```

## 嵌套路由

router/index.js

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
// 加载组件
import Layout from '@/components/Layout.vue'
import Index from '@/views/Index.vue'
import Login from '@/views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    name: 'login',
    path: '/login',
    component: Login
  },
  // 嵌套路由
  {
    path: '/',
    component: Layout,
    children: [
      {
        name: 'index',
        path: '', // locallhost/#/  输入父级有path，子路由可以为空，可以为相对路径或绝对路径
        component: Index
      },
      {
        name: 'detail',
        path: 'detail/:id', // locallhost/#/detail/5
        props: true,
        component: () => import('@/views/Detail.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
```

公共组件：layout.vue

```vue
<template>
  <div>
    <div>
      <img width="25%" src="@/assets/logo.png">
    </div>
    <div>
      <router-view></router-view>
    </div>
    <div>
      Footer
    </div>
  </div>
</template>

<script>
export default {
  name: 'layout'
}
</script>
```

首页：Index.vue

```vue
<template>
  <div>
    这里是首页 <br>
    <router-link to="login">登录</router-link> |

    <router-link to="detail/5">详情</router-link>
  </div>
</template>

<script>
export default {
  name: 'Index'
}
</script>
```

## 编程式导航

```vue
<template>
  <div class="home">
    <button @click="push"> push </button>
    <button @click="replace">replace </button>

    <button @click="goDetail"> Detail </button>

    <button @click="go"> go(-2) </button>
  </div>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    push () {
      this.$router.push('/')
    },
    replace () {
  		// 相比于push方法，replace不会产生历史记录
      this.$router.replace('/login')
    },
    goDetail () {
      // 通过push方法传递路由参数
      // 命名式导航: name对应的router.js中的name
      this.$router.push({ name: 'Detail', params: { id: 1 } })
    },
    go () {
      // 跳转到历史中的某一次
      this.$router.go(-2)
    }
  }
}
</script>
```

## 路由模式

无论哪一种模式，都是客户端路由的方式，当路径发生变化时，不会向服务器发送请求。 

### Hash模式

1. 表现：URL中#后面的内容作为路径地址
2. 实现原理：基于锚点，以及监听hashchange事件，根据当前路由地址找到对应组件重新渲染

### History模式

1. 表现：路径中没有#，需要服务端配置

2. 实现原理：基于HTML5中的History API

   - 通过history.pushState()方法改变地址栏—和history.push()的区别是不会发送请求  IE10以后才支持
   - 监听popstate事件，根据当前路由地址找到对应的组件重新渲染
   - history.replaceState()

3. 基本使用

   History需要服务器的支持，因为在单页应用中，服务端不存在http://www/testurl.com/login这样的地址，访问的时候会返回找不到该页面，所以在服务端应该配置除了静态资源外部都返回单页应用的index.html

   router/index.js

   ```js
   import Vue from 'vue'
   import VueRouter from 'vue-router'
   import Home from '../views/Home.vue'
   
   Vue.use(VueRouter)
   
   const routes = [
     {
       path: '/',
       name: 'Home',
       component: Home
     },
     {
       path: '/about',
       name: 'About',
       // route level code-splitting
       // this generates a separate chunk (about.[hash].js) for this route
       // which is lazy-loaded when the route is visited.
       component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
     },
     {
       path: '*',
       name: '404',
       component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
     }
   ]
   
   const router = new VueRouter({
     mode: 'history',
     routes
   })
   
   export default router
   ```

### Node服务器配置

1. 将vue项目打包到dist目录之后，将资源文件拷贝在服务器的部署**网站根目录**下

2. 在服务器中创建node工程
	app.js

   ```js
   const path = require('path')
   // 导入处理 history 模式的模块
   const history = require('connect-history-api-fallback')
   // 导入 express-基于node的web开发框架
   const express = require('express')
   
   const app = express()
   // 注册处理 history 模式的中间件
   app.use(history())
   // 处理静态资源的中间件，网站根目录 ../web
   app.use(express.static(path.join(__dirname, '../web')))
   
   // 开启服务器，端口是 3000
   app.listen(3000, () => {
     console.log('服务器开启，端口：3000')
   })
   ```

   package.json

   ```json
   {
     "name": "backend",
     "version": "1.0.0",
     "description": "",
     "main": "index.js",
     "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1"
     },
     "keywords": [],
     "author": "",
     "license": "ISC",
     "dependencies": {
       "connect-history-api-fallback": "^1.6.0",
       "express": "^4.17.1"
     }
   }
   ```


### Nginx服务器配置

1. 从官网下载[nginx](http://nginx.org/en/download.html)的压缩包

2. 把压缩包解压到 c 盘根目录，c:\nginx-1.18.0 文件夹

3. 修改 c:\nginx-1.18.0\conf\nginx.conf 文件

   ```nginx
   location / { 
     root html; 
     index index.html index.htm; 
     #新添加内容 
     #尝试读取$uri(当前请求的路径)，如果读取不到读取$uri/这个文件夹下的首页 
     #如果都获取不到返回根目录中的 
     index.html try_files $uri $uri/ /index.html; 
   }
   ```

4. 打开命名行，切换到目录c:\nginx-1.18.0

```shell
# 启动
start nginx
# 重启
nginx -s reload
# 停止
nginx -s stop
```


## 模拟Vue Router

- Vue.use支持对象和函数两种形式的入参。如果传入对象会调用这个对象的install方法，如果传入函数会直接调用
- 使用路由时，传入的是VueRouter对象，所以VueRouter是一个拥有静态的install方法的类

### 分析：VueRouter类成员

1. 属性
   - options 记录构造函数中传入的对象（路由规则等）
   - app vue实例，包含一个响应式的对象data(Vue.observable)，data.current用来记录当前路由地址
   - routeMap 包含了路由地址和组件的对应关系，路由规则会解析到这里

2. 方法
   - Constructor(options):VueRouter 构造函数，初始化属性和方法
   - _install(Vue):voild   静态方法，用来实现vue的插件机制
   - init():void 调用下面的方法，组合函数
   - initEvent():void 注册PopState事件，监听浏览器地址的变化
   - createRouteMap():void 初始化routeMap属性，将构造函数传入的路由规则转换成键值对的形式，存储到routeMap中。`{ 路由地址：组件 }`
   - initComponents(Vue):void  创建`router-view`和`router-link`组件

### 实现思路

1. 创建 VueRouter 插件，静态方法 install
   - 判断插件是否已经被加载
   - 当 Vue 加载的时候把传入的 router 对象挂载到 Vue 实例上（注意：只执行一次）
2. 创建 VueRouter 类
   - 初始化，options、routeMap、app(简化操作，创建 Vue 实例作为响应式数据记录当前路径)
   - initRouteMap() 遍历所有路由信息，把组件和路由的映射记录到 routeMap 对象中
   - 注册 popstate 事件，当路由地址发生变化，重新记录当前的路径
   - 创建 router-link 和 router-view 组件
   - 当路径改变的时候通过当前路径在 routerMap 对象中找到对应的组件，渲染 router-view

```js
const _Vue = null
class VueRouter {
  constructor(options) {
    this.options = options
    this.routeMap = {}
    this.app = new _Vue({ 
      data: {
        // 当前的默认路径
        current: '/'
      }
    })
    // this.data = _Vue.observable({
    //  current: '/'
    //})
  }

  static install (Vue) {
    // 如果插件已经安装直接返回
    if (VueRouter.install.installed && _Vue === Vue) return
  
    VueRouter.install.installed = true
    _Vue = Vue // 将vue构造函数记录到全局变量

    // this在这里代表的是VueRouter类本身，mixin可以改变this指向
    // 把创建Vue的实例传入的router对象注入到Vue实例
    _Vue.mixin({
      beforeCreate() {
        // 判断 router 对象是否已经挂载了 Vue 实例上
        if (this.$option.router) {
          // this代表的是每一个vue组件的vue实例
          _Vue.prototype.$router = this.$option.router
          this.$options.router.init()
        }
      }
    })
    
  }

  init(){
    this.createRouteMap()
    this.initComponent()
    this.initEvent()
  }

  initRouteMap() {
    // 遍历所有的路由信息
    // routes => [{ name: '', path: '', component: }]
    this.options.routes.forEach(route => {
      // 记录路径和组件的映射
      this.routeMap[route.path] = route.component
    })
  }

  initComponents() {
    // 将vueRouterthis指向缓存
    const _this = this
  
    Vue.component('router-link', {
      // 以下this代表的是router-link组件的vue实例
      props: {
        to: String
      },
      render(h) {
        // template只在运行时+编译器版本有效，需要配置vue.config.js中的runtimeComplier为true
      	// template:"<a :href='to'><slot></slot></a>"
        if (_this.options.mode === 'hash') {
          return h("a", {
            attrs: {
              href: `#${this.to}`
            },
          }, [this.$slots.default])
        }
        
        if (_this.options.mode === 'history') {
          return h("a", {
            attrs: {
              href: this.to
            },
            on: {
              click: this.clickhander
            }
          }, [this.$slots.default])
        }
      },
      methods: {
        clickhander(e) {
          history.pushState({}, '', this.to)
          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
    })

    _Vue.component("router-view", {
      render(h) {
        // 根据当前路径找到对应的组件，注意 this 的问题
        const cm = _this.routeMap[_this.data.current]
        return h(cm)
      }
    })
  }

  initEvent() {
    // 当路径变化之后，重新获取当前路径并记录到 current
    if (this.options.mode === 'hash') {
      window.addEventListener('hashchange', this.onHashChange.bind(this))
      window.addEventListener('load', this.onHashChange.bind(this))
    }
 
    if (this.options.mode === 'history') {
      window.addEventListener('popstate', () => {
        this.app.current = window.location.pathname
      })
    }
  }
  
  onHashChange () {
    this.app.current = window.location.hash.substr(1) || '/'
  }
}

export default VueRouter
```

### 运行时和完整版的Vue

- 运行时版：不支持template模板，需要打包的时候提前编译

- 完整版：包含运行时和编译器，体积比运行时版答10K左右，程序运行的时候把模板转换成render函数

  参考链接：https://cli.vuejs.org/zh/config/#runtimecompiler