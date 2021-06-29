# vue源码解析

## 准备工作

### 运行调试

- 项目地址：https://github.com/vuejs/vue

- 下载到本地后，安装依赖`npm i`

- 打包工具 Rollup：比 Webpack 轻量，Rollup 打包不会生成冗余的代码，Webpack 把所有文件当做模块，Rollup 只处理 js 文件，所以更适合在 Vue.js 这样的库中使用

- 在dev脚本中添加源码地图命令

  package.json

  ```json
   "scripts": {
      "dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev",
   }
  ```

- 将案例中使用的dist/vue.min.js改为dist/vue.js

  index.html

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Vue.js grid component example</title>
      <link rel="stylesheet" href="style.css">
      <!-- Delete ".min" for console warnings in development -->
      <script src="../../dist/vue.js"></script>
      </head>
    <body>
    </body>
  </html>
  ```

### 打包不同版本

完整版和运行时版的 Vue，编译后的文件中会同时存在支持 UMD、CommonJS、ESM 三种模块化的方式，VueCLI 生成的项目默认使用 Vue 是 ESM 模块化方式的运行时版本。运行时版本的 Vue 体积比编译器版本的 Vue 要小 30% 左右，并且运行时版本的 Vue 的运行效率要比完整版的 Vue 要高。

[官方文档-对于不同构建版本的解释](https://cn.vuejs.org/v2/guide/installation.html#%E5%AF%B9%E4%B8%8D%E5%90%8C%E6%9E%84%E5%BB%BA%E7%89%88%E6%9C%AC%E7%9A%84%E8%A7%A3%E9%87%8A)

 | UMD |  CommonJs  | EsModule（基于构建工具使用） | ES Module (直接用于浏览器) 
-|-|-|-|-
Full：完整版（运行时+编译器） | vue.js | vue.common.js | vue.esm.js | vue.esm.browser.js 
Runtime-only：只包含运行时版 | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |  
Full(production)：生产环境完整版 | vue.min.js |  |  |  
Runtime-only(production)：生产环境运行时版 | vue.runtime.min.js |  |  |  

- 编译器：用来将模板字符串编译成为 JavaScript 渲染函数的代码，将template转换成render函数。**体积大，效率低。**
- 运行时：用来创建 Vue 实例、渲染并处理虚拟 DOM 等的代码。体积小，效率高。基本上就是除去编译器（3000+ code）的其它一切。
- **[UMD](https://github.com/umdjs/umd)**：UMD 版本可以通过 `<script>` 标签直接用在浏览器中。jsDelivr CDN 的 https://cdn.jsdelivr.net/npm/vue 默认文件就是运行时 + 编译器的 UMD 版本 (`vue.js`)。
- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**：CommonJS 版本用来配合老的打包工具比如 [Browserify](http://browserify.org/) 或 [webpack 1](https://webpack.github.io/)。这些打包工具的默认文件 (`pkg.main`) 是只包含运行时的 CommonJS 版本 (`vue.runtime.common.js`)。
- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**：从 2.6 开始 Vue 会提供两个 ES Modules (ESM) 构建文件：
  - 为打包工具提供的 ESM：为诸如 [webpack 2](https://webpack.js.org/) 或 [Rollup](https://rollupjs.org/) 提供的现代打包工具。ESM 格式被设计为可以被静态分析，所以打包工具可以利用这一点来进行“tree-shaking”并将用不到的代码排除出最终的包。为这些打包工具提供的默认文件 (`pkg.module`) 是只有运行时的 ES Module 构建 (`vue.runtime.esm.js`)。
  - 为浏览器提供的 ESM (2.6+)：用于在现代浏览器中通过 `<script type="module">` 直接导入。

## 入口文件

### 查找

由执行构建的脚本得知，rollup构建入口文件是scripts/config.js

```js
const path = require('path')
const alias = require('rollup-plugin-alias')
const flow = require('rollup-plugin-flow-no-whitespace')
const version = process.env.VERSION || require('../package.json').version

const banner =
  '/*!\n' +
  ` * Vue.js v${version}\n` +
  ` * (c) 2014-${new Date().getFullYear()} Evan You\n` +
  ' * Released under the MIT License.\n' +
  ' */'

// 4. 路径处理
const aliases = require('./alias')
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) { // 获取入口和出口文件的绝对路径
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}

// 3. 环境变量配置
const builds = {
  ...
  'web-full-dev': {
    // 入口 ../src/platforms/web/entry-runtime-with-compiler.js
    entry: resolve('web/entry-runtime-with-compiler.js'), // 入口
    // 出口 ../dist/vue.js
    dest: resolve('dist/vue.js'),
    format: 'umd', // 模块输出方式
    env: 'development', // 打包环境
    alias: { he: './entity-decoder' }, // 别名
    banner // 输出文件的文件头
  },
  ...
}

// 2. 生成配置
function genConfig (name) {
  // 环境变量配置
  const opts = builds[name]
  
  // 创建配置信息
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      flow(),
      alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'Vue'
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  ...

  // 返回rollup配置对象
  return config
}

// 1. 判断环境变量是否有环境变量
if (process.env.TARGET) {
  // 如果有，导出生成配置对象函数
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}
```

获取入口和出口文件的绝对路径：alias.js

```js
const path = require('path')

const resolve = p => path.resolve(__dirname, '../', p)

module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  sfc: resolve('src/sfc')
}
```

- 把 src/platforms/web/entry-runtime-with-compiler.js 构建成 dist/vue.js，如果设置 --sourcemap 会生成 vue.js.map
- src/platform 文件夹下是 Vue 可以构建成不同平台下使用的库，目前有 weex 和 web，还有服务器端渲染的库

### 分析

src/platforms/web/entry-runtime-with-compiler.js

```js
/* @flow */
import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

const mount = Vue.prototype.$mount
// 1. 将设置的DOM挂载到页面上，重写了平台相关的 $mount() 方法
Vue.prototype.$mount = function (
  el?: string | Element,
  // 开启ssr时 为 true
  hydrating?: boolean
): Component {
  // 获取Dom对象：元素选择器对应的DOM元素
  el = el && query(el)

  // 2. 开发环境中，DOM对象不能是body或者html
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // 3. 把 template/el 转换成render函数
  if (!options.render) {
    let template = options.template
    ...
  }

  // 4. 挂载DOM
  return mount.call(this, el, hydrating)
}

...

// 5. 注册了 Vue.compile() 方法，传递一个 HTML 字符串返回 render 函数
Vue.compile = compileToFunctions

export default Vue
```

问：如果template和render同时设置，会如何执行？

答：如果有template会将template转换为render函数，如果没有直接执行render函数渲染Dom

```js
const vm = new Vue({
  el: '#app',
  template: '<h3>Hello template</h3>',
  render (h) {
    return h('h4', 'Hello render')
  }
})
```

## Vue初始化

### 构造函数

1. src/**platforms/web**/entry-runtime-with-compiler.js：web 平台相关的入口，由此得Vue实例的上级文件

   ```js
   import Vue from './runtime/index'
   ```

2. src/**platforms/web**/runtime/index.js：web 平台相关，注册平台独有的指令，组件及方法

   ```js
   import Vue from 'core/index'
   import { patch } from './patch'
   import platformDirectives from './directives/index'
   import platformComponents from './components/index'
   ...
   
   // 1. 注册指令
   extend(Vue.options.directives, platformDirectives)
   // 2. 注册组件
   extend(Vue.options.components, platformComponents)
   
   // 3. 把虚拟 DOM 转换成真实 DOM
   Vue.prototype.__patch__ = inBrowser ? patch : noop
   
   // 4. 挂载方法
   Vue.prototype.$mount = function (
     el?: string | Element,
     hydrating?: boolean
   ): Component {
     el = el && inBrowser ? query(el) : undefined
     // 渲染DOM
     return mountComponent(this, el, hydrating)
   }
   
   ...
   
   export default Vue
   ```

3. src/**core**/index.js：与平台无关，核心部分代码入口

   ```js
   import Vue from './instance/index'
   import { initGlobalAPI } from './global-api/index'
   import { isServerRendering } from 'core/util/env'
   import { FunctionalRenderContext } from 'core/vdom/create-functional-component'
   
   // 初始化Vue静态成员
   initGlobalAPI(Vue)
   
   // 设置静态方法
   Object.defineProperty(Vue.prototype, '$isServer', {
     get: isServerRendering
   })
   
   Object.defineProperty(Vue.prototype, '$ssrContext', {
     get () {
       /* istanbul ignore next */
       return this.$vnode && this.$vnode.ssrContext
     }
   })
   
   // expose FunctionalRenderContext for ssr runtime helper installation
   Object.defineProperty(Vue, 'FunctionalRenderContext', {
     value: FunctionalRenderContext
   })
   
   // 设置版本号
   Vue.version = '__VERSION__'
   
   export default Vue
   ```

4. src/**core**/instance/index.js：核心部分-vue实例入口，定义了构造函数

   ```js
   import { initMixin } from './init'
   import { stateMixin } from './state'
   import { renderMixin } from './render'
   import { eventsMixin } from './events'
   import { lifecycleMixin } from './lifecycle'
   import { warn } from '../util/index'
   
   // 此处不用 class 的原因是为了方便后续给Vue混入实例成员，在原型上挂载一些方法和属性
   function Vue (options) {
     if (process.env.NODE_ENV !== 'production' &&
       !(this instanceof Vue)
     ) {
       warn('Vue is a constructor and should be called with the `new` keyword')
     }
     this._init(options)
   }
   
   // 注册 vm 的 _init() 方法，初始化vm
   initMixin(Vue)
   // 注册 vm 的 $data/$props/$set/$delete/$watch
   stateMixin(Vue)
   // 初始化事件($on/$once)及相关方法
   eventsMixin(Vue)
   // 初始化生命周期相关的混入方法，_update/$forceUpdate/$destroy
   lifecycleMixin(Vue)
   // 混入 render，$nextTick/_render
   renderMixin(Vue)
   
   export default Vue
   ```

### 静态成员

src/core/global-api/index.js

```js
/* @flow */
import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import { observe } from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  // 初始化 Vue.config 对象
  // 在web平台运行时入口（src/**platforms/web**/runtime/index.js）设置了属性
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // 这些工具方法不视为全局API的一部分，除非你已经意识到风险，否则不要去依赖他们
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 2.6 explicit observable API
  // 将对象设置成响应式的
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }

  // 初始化 options 对象，并给其扩展
  Vue.options = Object.create(null)
  // 初始化全局的'component'组件，'directive'指令，'filter'过滤器
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  // 设置 Keep-alive 组件 builtInComponents：KeepAlive
  extend(Vue.options.components, builtInComponents)

  // 注册插件
  initUse(Vue)
  // 实现混入
  initMixin(Vue)
  // 基于传入的options返回一个组件的构造函数
  initExtend(Vue)
  // 注册'component'组件，'directive'指令，'filter'过滤器
  initAssetRegisters(Vue)
}
```

src/core/global-api/use.js：initUse 注册插件

```js
/* @flow */
import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    // 将plugin删除后，剩余参数就是传入的其它参数
    // 把数组中的第一个元素(plugin)去除
    const args = toArray(arguments, 1)
    // 把this(Vue)插入第一个元素的位置，方便后面apply方法使用
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    // 保存已安装的插件
    installedPlugins.push(plugin)
    return this
  }
}
```

src/core/global-api/mixin.js：initMixin注册混入

```js
/* @flow */
import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```

src/core/global-api/extend.js：initExtend

```js
/* @flow */
import { ASSET_TYPES } from 'shared/constants'
import { defineComputed, proxy } from '../instance/state'
import { extend, mergeOptions, validateComponentName } from '../util/index'

export function initExtend (Vue: GlobalAPI) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0
  let cid = 1

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}

    // Vue构造函数
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})

    // 从缓存中加载组件的构造函数
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      // 如果是开发环境，验证组件的名称
      validateComponentName(name)
    }

    const Sub = function VueComponent (options) {
      this._init(options)
    }

    // 原型继承自 Vue
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    // 合并选项
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor 构造函数缓存
    cachedCtors[SuperId] = Sub

    // 把组件的构造函数缓存到 options._Ctor
    return Sub
  }
}

function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key)
  }
}

function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    defineComputed(Comp.prototype, key, computed[key])
  }
}
```

src/core/global-api/assets.js：initAssetRegisters

```js
/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    // type：component, directive, filter
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        // 如果没有定义，返回存储在配置项中的component, directive, filter
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        // 判断当前类型是否为组件且为原始的对象
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          // 把组件配置转换为组件的构造函数，options._base = Vue
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // 全局注册，存储资源并赋值 this.option['components']['my-component'] = definition
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
```

### 实例成员

src/**core**/instance/index.js：定义 Vue 的构造函数，初始化 Vue 的实例成员

```js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// 此处不用 class 的原因是为了方便后续给Vue混入实例成员，在原型上挂载一些方法和属性
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

// Vue.prototype 上添加 _init() 方法，初始化vm
initMixin(Vue)
// Vue.prototype 上添加 $data/$props/$set/$delete/$watch
stateMixin(Vue)
// Vue.prototype 上添加 $on/$once/$off/$emit 及相关方法
eventsMixin(Vue)
// 初始化生命周期相关的混入方法，_update/$forceUpdate/$destroy
lifecycleMixin(Vue)
// 混入 render相关函数/$nextTick/_render
renderMixin(Vue)

export default Vue
```

### Vue数据变化过程

1. 核心代码实例初始化入口：src/**core**/instance/index.js，初始化实例成员

```json
Vue: {
  prototype: {
    // 1. initMixin(Vue)
    _init: ƒ (options)
    // 2. stateMixin(Vue)
    $data: undefined
    $props: undefined
    $set: ƒ (target, key, val)
    $delete: ƒ del(target, key)
    $watch: ƒ ( expOrFn, cb, options )
    // 3. eventsMixin(Vue)
    $on: ƒ (event, fn)
    $once: ƒ (event, fn)
    $off: ƒ (event, fn)
    $emit: ƒ (event)
    // 4. lifecycleMixin(Vue)
    _update: ƒ (vnode, hydrating)
    $forceUpdate: ƒ ()
    $destroy: ƒ ()
    // 5. renderMixin(Vue)
    // 5-1. installRenderHelpers()
    _b: ƒ bindObjectProps( data, tag, value, asProp, isSync )
    _d: ƒ bindDynamicKeys(baseObj, values)
    _e: ƒ (text)
    _f: ƒ resolveFilter(id)
    _g: ƒ bindObjectListeners(data, value)
    _i: ƒ looseIndexOf(arr, val)
    _k: ƒ checkKeyCodes( eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName )
    _l: ƒ renderList( val, render )
    _m: ƒ renderStatic( index, isInFor )
    _n: ƒ toNumber(val)
    _o: ƒ markOnce( tree, index, key )
    _p: ƒ prependModifier(value, symbol)
    _q: ƒ looseEqual(a, b)
    _s: ƒ toString(val)
    _t: ƒ renderSlot( name, fallback, props, bindObject )
    _u: ƒ resolveScopedSlots( fns, // see flow/vnode res, // the following are added in 2.6 hasDynamicKeys, contentHashKey )
    _v: ƒ createTextVNode(val)
    // 5-2
    $nextTick: ƒ (fn)
    // 5-3
    _render: ƒ ()
  }
}
```

 	2. 核心代码入口：src/**core**/index.js，vue初始化实例成员

```json
Vue: {
  prototype: {...}
  // 1. Object.defineProperty(Vue, 'config', configDef)
  config: Object
  // 2. 注册插件 set deletenextTick
  util: {warn: ƒ, extend: ƒ, mergeOptions: ƒ, defineReactive: ƒ}
  set: ƒ (target, key, val)
  delete: ƒ del(target, key)
  nextTick: ƒ nextTick(cb, ctx)
  // 3. 添加响应式函数
  observable: ƒ (obj)
  // 4. Vue.options = Object.create(null)
  options: {
    // ASSET_TYPES
    components: { KeepAlive }
    directives: {}
    filters: {}
    _base: ƒ Vue(options)
  }
  // 5. initUse(Vue)
  use: ƒ (plugin)
  // 6. initMixin(Vue)
  mixin: ƒ (mixin)
  // 7. initExtend(Vue)
  extend: ƒ (extendOptions)
  // 8. initAssetRegisters(Vue)
  component: ƒ ( id, definition )
  directive: ƒ ( id, definition )
  filter: ƒ ( id, definition )
}
```

3. web平台运行时入口：src/**platforms/web**/runtime/index.js，初始化平台相关指令，组件等

```json
Vue: {
  config: {
    // 1. 添加一些平台相关配置
  }
  options: {
    // ASSET_TYPES
    directives: {
      // 2. 添加v-show，v-model
      model: {inserted: ƒ, componentUpdated: ƒ}
      show: {bind: ƒ, update: ƒ, unbind: ƒ}
    }
    components: { 
      KeepAlive,
      // 3. 添加动画组件
      Transition,
      TransitionGroup
    }
    ...
  },
  prototype: {
    // 4. 添加DOM渲染相关原型方法
    __patch__: ƒ patch(oldVnode, vnode, hydrating, removeOnly),
    $mount: ƒ ( el, hydrating )
    ...
  }
  ...
}
```

4. web平台运行时+编译器入口：src/**platforms/web**/entry-runtime-with-compiler.js

```json
Vue: {
  prototype: {
    // 1. 重写$mount
    $mount: ƒ ( el, hydrating )
    ...
  },
  // 2. 添加编译函数，将html字符串转换成render函数
	compile: ƒ compileToFunctions( template, options, vm )
...
}
```

## 首次渲染

### 1. Vue初始化实例成员，静态成员

### 2. new Vue() 创建Vue实例 

src/core/instance/index.js

### 3. this._init() 首次渲染入口

   src/core/instance/init.js

   ```js
   /* @flow */
   import config from '../config'
   import { initProxy } from './proxy'
   import { initState } from './state'
   import { initRender } from './render'
   import { initEvents } from './events'
   import { mark, measure } from '../util/perf'
   import { initLifecycle, callHook } from './lifecycle'
   import { initProvide, initInjections } from './inject'
   import { extend, mergeOptions, formatComponentName } from '../util/index'
   
   let uid = 0
   
   export function initMixin (Vue: Class<Component>) {
     // 给 Vue 实例增加 _init() 方法，合并 options / 初始化操作
     Vue.prototype._init = function (options?: Object) {
       const vm: Component = this
       // a uid
       vm._uid = uid++
   
       ...
   
       // 开始渲染：调用 $mount() 挂载 dom
       if (vm.$options.el) {
         vm.$mount(vm.$options.el)
       }
     }
   }
   ...
   ```

### 4. vm.$mount() ：编译器入口

将模板编译成render函数

   1. 如果没有传递render，通过complieToFunction把模板编译成render函数
   2. 将render函数存储在 Vue.options.render 中

   src/platforms/web/entry-runtime-with-compiler.js

   ```js
   /* @flow */
   
   import config from 'core/config'
   import { warn, cached } from 'core/util/index'
   import { mark, measure } from 'core/util/perf'
   
   import Vue from './runtime/index'
   import { query } from './util/index'
   import { compileToFunctions } from './compiler/index'
   import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'
   
   const idToTemplate = cached(id => {
     const el = query(id)
     return el && el.innerHTML
   })
   
   const mount = Vue.prototype.$mount
   // 将设置的DOM挂载到页面上
   Vue.prototype.$mount = function (
     el?: string | Element,
     // 开启ssr时 为 true
     hydrating?: boolean
   ): Component {
     // 获取Dom对象：元素选择器对应的DOM元素
     el = el && query(el)
   
     ...
   
     const options = this.$options
     // resolve template/el and convert to render function
     // 把 template/el 编译成render函数
     if (!options.render) {
       let template = options.template
       ...
       if (template) {
         ...
         // 把 template 转换成 render 函数
         const { render, staticRenderFns } = compileToFunctions(template, {
           outputSourceRange: process.env.NODE_ENV !== 'production',
           shouldDecodeNewlines,
           shouldDecodeNewlinesForHref,
           delimiters: options.delimiters,
           comments: options.comments
         }, this)
         options.render = render
         options.staticRenderFns =  // 渲染优化函数
   
         ...
       }
     }
   
     // 挂载DOM
     return mount.call(this, el, hydrating)
   }
   ...
   
   // 将html字符串编译成render函数，传递一个 HTML 字符串返回 render 函数
   Vue.compile = compileToFunctions
   
   export default Vue
   ```

### 5. vm.$mount()：运行时入口

重新获取el，通过mountComponent重新渲染DOM

   src/platforms/web/runtime/index.js

   ```js
   /* @flow */
   import Vue from 'core/index'
   import config from 'core/config'
   import { extend, noop } from 'shared/util'
   import { mountComponent } from 'core/instance/lifecycle'
   import { devtools, inBrowser } from 'core/util/index'
   
   ...
   
   // public mount method
   Vue.prototype.$mount = function (
     el?: string | Element,
     hydrating?: boolean
   ): Component {
     // 只包含运行时版本要重新获取 el
     el = el && inBrowser ? query(el) : undefined
     // 渲染DOM
     return mountComponent(this, el, hydrating)
   }
   
   ...
   
   export default Vue
   ```

### 6. mountComponent(this,el)

   1. 判断是否有render选项，如果没有但是传入了模板，并且当前是开发环境，会发送警告
   2. 触发beforeMount
   3. 定义 updateComponent
      1. vm._render() 渲染虚拟 DOM
      2. vm._update() 将虚拟 DOM 转换成真实 DOM
   4. 创建 Watcher 实例
      1. 传递updateComponent
      2. 调用Watcher.get方法
   5. 触发 mounted
   6. return vm

   src/core/instance/lifestyle.js

   ```js
   /* @flow */
   import config from '../config'
   import Watcher from '../observer/watcher'
   import { mark, measure } from '../util/perf'
   import { createEmptyVNode } from '../vdom/vnode'
   import { updateComponentListeners } from './events'
   import { resolveSlots } from './render-helpers/resolve-slots'
   import { toggleObserving } from '../observer/index'
   import { pushTarget, popTarget } from '../observer/dep'
   
   import {
     warn,
     noop,
     remove,
     emptyObject,
     validateProp,
     invokeWithErrorHandling
   } from '../util/index'
   
   ...
   
   export function mountComponent (
     vm: Component,
     el: ?Element,
     hydrating?: boolean
   ): Component {
     vm.$el = el
     if (!vm.$options.render) {
       vm.$options.render = createEmptyVNode
       if (process.env.NODE_ENV !== 'production') {
         // 没有render函数，提示当前使用的是运行时版本，如果需要编译器，切换完整版
         if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
           vm.$options.el || el) {
           warn(
             'You are using the runtime-only build of Vue where the template ' +
             'compiler is not available. Either pre-compile the templates into ' +
             'render functions, or use the compiler-included build.',
             vm
           )
         } else {
           warn(
             'Failed to mount component: template or render function not defined.',
             vm
           )
         }
       }
     }
     // 触发生命周期 beforeMount 钩子函数
     callHook(vm, 'beforeMount')
   
     let updateComponent
     /* istanbul ignore if */
     if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
       // 生产环境 + 性能检测时，进行性能优化
       ...
     } else {
       // 定义 updateComponent 更新组件函数
       // _render：调用用户传入/编译器生产的 render 转换成 render函数，生成虚拟DOM
       updateComponent = () => {
         vm._update(vm._render(), hydrating)
       }
     }
   
     // 4. 创建Watcher对象：执行 updateComponent
     new Watcher(vm, updateComponent, noop, {
       before () {
         if (vm._isMounted && !vm._isDestroyed) {
           callHook(vm, 'beforeUpdate')
         }
       }
     }, true /* isRenderWatcher */)
     hydrating = false
   
     if (vm.$vnode == null) {
       vm._isMounted = true
       // 触发生命周期 mounted 页面挂载结束钩子函数
       callHook(vm, 'mounted')
     }
     return vm
   }
   
   ...
   ```

### 7. watcher.get()

   1. 创建结束调用get()
   2. get中调用updateComponent()
   3. 调用vm._render 创建 VNode：调用实例化时传入的 / 编译template生成的 render函数，返回Vnode
   4. 调用vm._update(vnode,...)：挂载真实DOM，记录在vm.$el中

   ```js
   /* @flow */
   ...
   
   // 在 vue 中， Watcher有3种：DOM渲染/计算属性/侦听器
   export default class Watcher {
    ...
   
     /**
      * 监听器
      * @param {*} vm vue实例
      * @param {*} expOrFn 渲染监听 updateComponent
      * @param {*} cb 
      * @param {*} options beforeUpdate
      * @param {*} isRenderWatcher 是否为渲染监听器
      */
     constructor (
       vm: Component,
       expOrFn: string | Function,
       cb: Function,
       options?: ?Object,
       isRenderWatcher?: boolean
     ) {
       this.vm = vm
       ...
       // parse expression for getter
       if (typeof expOrFn === 'function') {
         // 首次渲染，传入 updateComponent 函数
         this.getter = expOrFn
       } else {
         ...
       }
       this.value = this.lazy
         ? undefined
         : this.get()
     }
   
     get () {
       // 将当前的 Watcher 对象传入栈中
       // 渲染嵌套组件的时候，先渲染子组件，所以父组件的Watcher需要保存起来
       pushTarget(this)
       let value
       const vm = this.vm
       try {
         // 调用 updateComponent，改变 this 指向为 vue 实例
         value = this.getter.call(vm, vm)
       } catch (e) {
        ...
       } finally {
   			...
       }
       return value
     }
   
     ...
   }
   ```


## 数据响应式

### 1. initState() -> initData() -> observe()

初始化vue实例状态 -> 将data注入到vue实例上 -> 将data对象转换为响应式对象

### 2. observe(value)

- src/core/observer/index.js：响应式入口
- value为对象 且 value对象有 **__ ob __**属性时，创建 observer 对象实例

```js
...

/**
 * 1. 响应式入口函数,将数据转换为响应式的
 * 试图创建一个 observer 对象赋值给value, 如果创建成功返回 新的observer 对象，否则返回已经存在的对象
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  // 判断 value 是否为对象
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  // 如果 value 有 _ob_ 属性，并且这个属性是 Observer 的实例，将属性赋值给 ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue // value 是否为 vue 实例
  ) {
    // 创建一个 Observer 对象
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    // 如果是 响应式 根数据
    ob.vmCount++
  }
  return ob
}
...
```

### 3. Observer

- 位置：src/core/observer/index.js
- 给value对象定义不可枚举的 **__ ob __** 属性，记录的当前的observer对象
- 数组的响应式处理，修补数组的原型方法 arrayMethods
- 对象的响应式处理，调用walk(value)

```js
... 
/**
 * 2. 对数组/对象做响应式处理
 * Observer类被附加到每一个被观察的对象,一旦附加 observer 会为目标对象中的每个属性添加 getter/setter
 * 用来收集依赖和派发更新（发送通知）
 */
export class Observer {
  // 观测对象
  value: any;
  // 依赖对象
  dep: Dep;
  // 实例计数器
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    // 初始化实例的 vmCount 为 0
    this.vmCount = 0
    // 将实例挂载到观察对象的 __ob__ 属性上
    // def方法是对 Object.defineProperty 的封装，有4个形参
    // 最后一个形参是enumerable，observer对象不需要被遍历，所以不传（undefined转false）
    def(value, '__ob__', this)
    // 数组的响应式处理
    if (Array.isArray(value)) {
      // 判断对象中是否有 __proto__，浏览器是否兼容对象的原型属性
      if (hasProto) {
        // value.__proto__ = arrayMethods（修补了push/unshift/splice后的数组原型方法）
        protoAugment(value, arrayMethods)
      } else {
        // arrayKeys：获取修补后的数组原型方法名字
        copyAugment(value, arrayMethods, arrayKeys)
      }
      // 为数组中的每一个对象创建一个 observer 实例
      this.observeArray(value)
    } else {
      // 编译对象的每一个属性，转换成 setter/getter
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      // 把属性转换为 getter和setter
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   * 对数组做响应式处理
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
...
```

### 4. defineReactive

- 位置：src/core/observer/index.js
- 为对象定义一个响应式属性
- 如果当前属性是对象，调用observe
- 定义getter：收集依赖
- 定义setter：保存新值（如果新值是对象调用observe），派发更新（发送通知，调用dep.notify())

```js
...
/**
 * Define a reactive property on an Object.
 * 为对象定义一个响应式属性
 * @param shallow 是否深度监听
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 为当前属性添加依赖，获取这个观察这个属性的所有Watcher
  const dep = new Dep()
  // 获取 obj 的属性描述符对象
  const property = Object.getOwnPropertyDescriptor(obj, key)
  // 如果当前属性不可配置，即不可以通过delte删除，也不可以使用Object.defineProperty定义，直接返回
  if (property && property.configurable === false) {
    return
  }

  // 提供预定义的存取器函数
  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  // 如果没有定义存取器，获取对象的所有属性
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  // 判断如果递归观察子对象（深度监听），将子对象属性都转换成 getter/setter 并返回
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      // 如果预定义的 getter(property.get) 存在，则value等于getter调用的返回值，否则直接赋属性值
      const value = getter ? getter.call(obj) : val
      // 如果存在当前依赖目标，即Watcher对象，则建立依赖
      if (Dep.target) {
        // 建立依赖，将 Dep 添加到 Watcher.newDeps 中，将 Watcher 添加到 Dep.subs 中
        dep.depend()
        // 建立子对象的依赖关系
        if (childOb) {
          childOb.dep.depend()
          // 如果属性是数组，特殊处理收集数组对象依赖
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      // 返回属性值
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      // 如果新值和旧值相等，或者新值旧值都为 NaN 则不执行
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      // 只读属性不做赋值处理
      if (getter && !setter) return
      // 如果预定义 setter 存在则调用，否则直接更新新值
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      // 如果新值是对象，观察子对象并返回子的 observer 对象
      childOb = !shallow && observe(newVal)
      // 派发更新（发布更改通知）
      dep.notify()
    }
  })
}
...
```

### 5. 依赖收集

- 在watcher对象的get方法中调用 pushTarget 记录 Dep.target 属性
- 访问data中的成员的时候收集依赖，defineReactive 的 getter 中收集依赖
- 把属性对应的 watcher 对象添加到 dep 的 subs 数组中
- 给 childOb 收集依赖，目的是子对象添加和删除成员时发送通知

### 6. Watcher

- 数据发生变化时：dep.notify()发送通知，会调用watcher对象的update方法
- queueWatcher() 判断 watcher 是否已经被处理，如果没有添加到队列中，并调用 flushSchedulerQueue 刷新队列函数
- flushSchedulerQueue()
  - 触发beforeUpdate钩子函数
  - 调用 watcher.run()：run() -> get() -> getter() -> updateComponent
  - 清空上一次的依赖
  - 触发actived钩子函数
  - 触发 updated 钩子函数

src\core\observer\watcher.js

```js
/* @flow */

import {
  warn,
  remove,
  isObject,
  parsePath,
  _Set as Set,
  handleError,
  noop
} from '../util/index'

import { traverse } from './traverse'
import { queueWatcher } from './scheduler'
import Dep, { pushTarget, popTarget } from './dep'

import type { SimpleSet } from '../util/index'

let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
// 在 vue 中， Watcher有3种：渲染 Watcher/计算属性 Computed Watcher/侦听器（用户 Watcher)
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  /**
   * 监听器
   * @param {*} vm vue实例
   * @param {*} expOrFn 渲染监听 updateComponent
   * @param {*} cb 回调函数，对比新旧值
   * @param {*} options beforeUpdate
   * @param {*} isRenderWatcher 是否为渲染监听器
   */
  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      // 延迟执行 如果没有传入值，为false，计算属性lazy为true
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    // 批处理 vue 实例标记
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    // 记录依赖对象
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      // 首次渲染，传入 updateComponent 函数
      this.getter = expOrFn
    } else {
      // expOrFn 是字符串的时候，例如 watch: { 'person.name': function... }
      // parsePath('person.name') 返回一个函数获取 person.name 的值
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   * 
   */
  get () {
    // 将当前的 Watcher 对象传入栈中
    // 渲染嵌套组件的时候，先渲染子组件，所以父组件的Watcher需要保存起来
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      // 渲染Watcher：调用 updateComponent，改变 this 指向为 vue 实例
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        // 对于用户watcher的异常处理
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * Add a dependency to this directive.
   * 收集依赖
   */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      // 如果是渲染 Watcher，会将当前 Watcher 放入到队列中
      queueWatcher(this)
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.数据更新到视图，
   */
  run () {
    // 是否存活
    if (this.active) {
      // 对于渲染 Watcher 而言，value为undefined
      const value = this.get()
      // 如果是其它类型watcher
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        // 如果是用户watcher，调用新旧值对比的回调函数，并进行异常处理
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   */
  teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}
```

src\core\observer\scheduler.js

```js
/* @flow */

import type Watcher from './watcher'
import config from '../config'
import { callHook, activateChildComponent } from '../instance/lifecycle'

import {
  warn,
  nextTick,
  devtools,
  inBrowser,
  isIE
} from '../util/index'

export const MAX_UPDATE_COUNT = 100

const queue: Array<Watcher> = []
const activatedChildren: Array<Component> = []
let has: { [key: number]: ?true } = {}
let circular: { [key: number]: number } = {}
let waiting = false
let flushing = false
let index = 0

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0
  has = {}
  if (process.env.NODE_ENV !== 'production') {
    circular = {}
  }
  waiting = flushing = false
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
export let currentFlushTimestamp = 0

// Async edge case fix requires storing an event listener's attach timestamp.
let getNow: () => number = Date.now

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  const performance = window.performance
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = () => performance.now()
  }
}

/**
 * Flush both queues and run the watchers.
 * 刷新任务队列
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow()
  flushing = true
  let watcher, id
 
  // 排序之前要确保：
  // 1. 组件更新的顺序是从父组件到子组件，因为先创建的父组件
  // 2. 组件的用户 watcher 在它对应的渲染 watcher 之前运行，因为users是在render之前创建的
  // 3. 如果父组件在执行之前被销毁了，那么这个watcher直接跳过
  queue.sort((a, b) => a.id - b.id)

  // do not cache length because more watchers might be pushed
  // as we run existing watchers 不要缓存个数，因为在 wather 执行过程中还有可能放入新的 watcher
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    // 为了数据变化后，watcher还可以运行
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  // 设置队列状态
  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  // 触发 Updated 更新完毕钩子函数
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}

function callUpdatedHooks (queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated')
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
export function queueActivatedComponent (vm: Component) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false
  activatedChildren.push(vm)
}

function callActivatedHooks (queue) {
  for (let i = 0; i < queue.length; i++) {
    queue[i]._inactive = true
    activateChildComponent(queue[i], true /* true */)
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  // 标记当前 watcher 是都已经被处理
  if (has[id] == null) {
    has[id] = true
    // 如果没有被处理
    if (!flushing) {
      // 将当前watcher 放在末尾
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      // 如果正在处理
      // i > index 获取队列中正在处理的 Watcher 索引
      // 从后向前获取队列的id，判断是否大于当前 Watcher.id
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      // 将当前 watcher 放入对应位置
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush 当前队列没有被执行
    if (!waiting) {
      waiting = true
      // 刷新任务队列
      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      nextTick(flushSchedulerQueue)
    }
  }
}
```

## Set

功能：向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新属性，因为 Vue 无法探测普通的新增属性 (比如this.myObject.newProperty = 'hi')

**注意：**对象不能是 Vue 实例，或者 Vue 实例的根数据对象。

### Vue.set入口

静态方法：src\core\global-api\index.js

```js
...
import { set, del } from '../observer/index'
...

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  ...
}
```

### this.$set入口

实例方法：src\core\instance\state.js

```js
...
export function stateMixin (Vue: Class<Component>) {
  ...

  Vue.prototype.$set = set
  Vue.prototype.$delete = del

  ...
}
```

### 源码

```js
...
/**
 * 为对象设置属性。如果这个属性不存在，则添加一个新的属性并触发变更通知。
 */
export function set (target: Array<any> | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  // 判断 target 是否为数组，key 是否是合法的索引
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    // 通过 splice 对 key 位置的元素进行替换
    // splice 在 array.js 进行了响应式处理
    target.splice(key, 1, val)
    return val
  }
  // 如果 key 在对象中已经存在直接赋值
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  // 获取目标数据 target 的响应式 observer 对象
  const ob = (target: any).__ob__
  // 如果 target 是 vue 实例或者 $data 直接返回，$data上的ob.vmCount = 1，其它等于0
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  // 如果目标数据 target 不是响应式对象，不做响应式处理
  if (!ob) {
    target[key] = val
    return val
  }
  // 把 key 设置为响应式属性：挂载到 target上，并设置 getter/setter
  defineReactive(ob.value, key, val)
  // 发送通知，收集依赖的时候会给子属性添加依赖
  ob.dep.notify()
  return val
}
...
```

## Delete

功能：删除对象的属性。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue不能检测到属性被删除的限制，但是你应该很少会使用它。

**注意：**目标对象不能是一个 Vue 实例或 Vue 实例的根数据对象。

### Vue.delete入口

静态方法：src\core\global-api\index.js

```js
...
import { set, del } from '../observer/index'
...

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  ...
}
```

### this.$delete入口

实例方法：src\core\instance\state.js

```js
...
export function stateMixin (Vue: Class<Component>) {
  ...

  Vue.prototype.$set = set
  Vue.prototype.$delete = del

  ...
}
```

### 源码

```js
/**
 * Delete a property and trigger change if necessary.
 */
export function del (target: Array<any> | Object, key: any) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  // 判断 target 是否为数组，key 是否是合法的索引
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 如果时数组，通过做过响应式处理的splice删除
    target.splice(key, 1)
    return
  }
  // 获取 target 的 ob 对象
  const ob = (target: any).__ob__
  // 如果 target 是 vue 实例或者 $data 直接返回，$data上的ob.vmCount = 1，其它等于0
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  // 如果 target 对象没有 key 属性，直接返回
  if (!hasOwn(target, key)) {
    return
  }
  // 删除属性
  delete target[key]
  // 如果目标数据 target 不是响应式对象，不做响应式处理
  if (!ob) {
    return
  }
  // 发送通知，收集依赖的时候会给子属性添加依赖
  ob.dep.notify()
}
```

## $watch

### 使用

vm.$watch( expOrFn, callback, [options] )：https://cn.vuejs.org/v2/api/#vm-watch

- 功能：观察 Vue 实例变化的一个表达式或计算属性函数。回调函数得到的参数为新值和旧值。表达式只接受监督的键路径。对于更复杂的表达式，用一个函数取代

- 参数

  - expOrFn：要监视的 $data 中的属性，可以是表达式或函数
  - callback：数据变化后执行的函数
    - 函数：回调函数
    - 对象：具有 handler 属性(字符串或者函数)，如果该属性为字符串则 methods 中相应的定义
  - options：可选的选项
  - deep：布尔类型，深度监听
  - immediate：布尔类型，是否立即执行一次回调函数

- 示例

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Runtime+Compiler</title>
  </head>
  <body>
    <div id="app">
      {{ reversedMessage }}
      <hr>
      {{ user.fullName }}
    </div>
  
    <script src="../dist/vue.js"></script>
    <script>
      const vm = new Vue({
        el: '#app',
        data: {
          message: 'Hello Vue',
          user: {
            firstName: '诸葛',
            lastName: '亮',
            fullName: ''
          }
        },
        computed: {
          reversedMessage: function () {
            return this.message.split('').reverse().join('')
          }
        },
        watch: {
          // 'user.firstName': function (newValue, oldValue) {
          //   this.user.fullName = this.user.firstName + ' ' + this.user.lastName
          // },
          // 'user.lastName': function (newValue, oldValue) {
          //   this.user.fullName = this.user.firstName + ' ' + this.user.lastName
          // },
          'user': {
            handler: function (newValue, oldValue) {
              this.user.fullName = this.user.firstName + ' ' + this.user.lastName
            },
            deep: true,
            immediate: true
          }
        }
      })
    </script>
  </body>
  </html>
  ```

### 源码

- $watch没有静态方法，因为$watch方法中要使用Vue实例。在vue内部，除了渲染 Watcher，还有两种类型的监听器，计算属性和用户watcher，他们的创建顺序是：计算属性 => 用户 Watcher => 渲染 Watcher

- watcher执行过程

  - 当数据更新，defifineReactive 的 set 方法中调用 dep.notify()
  - 调用 watcher 的 update()
  - 调用 queueWatcher()，把 wacher 存入队列，如果已经存入，不重复添加
  - 循环调用 flushSchedulerQueue()
    - 通过 nextTick()，在消息循环结束之前时候调用 flushSchedulerQueue()
  - 调用 wacher.run()
    - 调用 wacher.get() 获取最新值
    - 如果是渲染 wacher 结束
    - 如果是用户 watcher，调用 this.cb()

- 侦听器watch

  src\core\instance\state.js

  1. 用户自定义watcher初始化
  2. 遍历用户传入的wathcer对象，判断监听的属性是对象还是数组
  3. 创建watcher，返回$watch方法
  4. 执行用户传入的回调函数和相关配置，options.user 的作用是在watcher触发之前做try catch处理

  ```js
  ...
  export function initState (vm: Component) {
    vm._watchers = []
    const opts = vm.$options
    // 将 opts.props 上的成员转换为响应式数据，注入到vue实例中
    if (opts.props) initProps(vm, opts.props)
    // 将选项中的 methods 注入到vue实例中
    if (opts.methods) initMethods(vm, opts.methods)
    if (opts.data) {
      // 将data中的属性注入到响应式中，做重名处理，并转换为响应式成员
      initData(vm)
    } else {
      // data不存在，初始化为一个空的响应式的data对象
      observe(vm._data = {}, true /* asRootData */)
    }
    // 计算属性初始化，创建 计算属性watcher
    if (opts.computed) initComputed(vm, opts.computed)
    // 1. 用户自定义watcher初始化，创建 用户watcher
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch)
    }
  }
  
  function initWatch (vm: Component, watch: Object) {
    // 2. 遍历用户传入的wathcer对象
    for (const key in watch) {
      const handler = watch[key]
      // 判断监听的属性是对象还是数组
      if (Array.isArray(handler)) {
        for (let i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i])
        }
      } else {
        createWatcher(vm, key, handler)
      }
    }
  }
  
  // 3. 创建wathcer
  function createWatcher (
    vm: Component,
    expOrFn: string | Function,
    handler: any,
    options?: Object
  ) {
    // 判断属性值是对象还是 function
    // 如果是对象，会将选项设置上，并且取出对象的回调函数
    if (isPlainObject(handler)) {
      options = handler
      handler = handler.handler
    }
    // 如果传入的是字符串，会去寻找methods中定义的字符串同名方法
    if (typeof handler === 'string') {
      handler = vm[handler]
    }
    // 3. 调用$watch方法
    return vm.$watch(expOrFn, handler, options)
  }
  
  export function stateMixin (Vue: Class<Component>) {
    ...
  
    Object.defineProperty(Vue.prototype, '$data', dataDef)
    Object.defineProperty(Vue.prototype, '$props', propsDef)
  
    Vue.prototype.$set = set
    Vue.prototype.$delete = del
  
    Vue.prototype.$watch = function (
      expOrFn: string | Function,
      cb: any,
      options?: Object
    ): Function {
      // 4. 获取 Vue 实例 this，watch不能作为静态方法的原因是因为用到了实例本身
      const vm: Component = this
      // 判断如果传入的是原始对象，对对象重新解析
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
      }
      // 初始化配置
      options = options || {}
      // 标记为用户 watcher，作用是在watcher触发之前做try catch处理
      options.user = true
      // 创建 watcher 对象
      const watcher = new Watcher(vm, expOrFn, cb, options)
      // 如果 options.immediate = true
      if (options.immediate) {
        try {
          // 立即执行一次回调，并且把当前值传入
          cb.call(vm, watcher.value)
        } catch (error) {
          handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
        }
      }
      // 返回取消监听的方法
      return function unwatchFn () {
        watcher.teardown()
      }
    }
  }
  ...
  ```

- 计算属性watch

  src\core\instance\state.js

  1. initComputed，初始化计算属性
  2. 遍历每一个属性，创建watcher

  ```js
  ...
  export function initState (vm: Component) {
    vm._watchers = []
    const opts = vm.$options
    // 将 opts.props 上的成员转换为响应式数据，注入到vue实例中
    if (opts.props) initProps(vm, opts.props)
    // 将选项中的 methods 注入到vue实例中
    if (opts.methods) initMethods(vm, opts.methods)
    if (opts.data) {
      // 将data中的属性注入到响应式中，做重名处理，并转换为响应式成员
      initData(vm)
    } else {
      // data不存在，初始化为一个空的响应式的data对象
      observe(vm._data = {}, true /* asRootData */)
    }
    // 1. 计算属性初始化，创建 计算属性watcher
    if (opts.computed) initComputed(vm, opts.computed)
    // 用户自定义watcher初始化，创建 用户watcher
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch)
    }
  }
  
  function initComputed (vm: Component, computed: Object) {
    // $flow-disable-line
    const watchers = vm._computedWatchers = Object.create(null)
    // computed properties are just getters during SSR
    const isSSR = isServerRendering()
  
    for (const key in computed) {
      const userDef = computed[key]
      const getter = typeof userDef === 'function' ? userDef : userDef.get
      ...
  
      if (!isSSR) {
        // create internal watcher for the computed property.
        // 2. 创建 计算属性 watcher，此处lazy=true，为了在watcher中不用调用get方法
        //  computedWatcherOptions = { lazy: true }
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        )
      }
  		...
    }
  }
  ...
  ```

## nextTick

- Vue 更新 DOM 是异步执行的，批量的在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
- vm.$nextTick(function () { /* 操作 DOM */ }) / Vue.nextTick(function () {})

### 定义位置

静态方法：src\core\global-api\index.js

```js
...
import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'
...

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  ...
}
```

实例方法：src\core\instance\render.js

```js
import {
  warn,
  nextTick,
  emptyObject,
  handleError,
  defineReactive
} from '../util/index'

...

export function renderMixin (Vue: Class<Component>) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype)

  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }

  ...
}
```

### 源码

1. 手动调用 vm.$nextTick()
2. 在 Watcher 的 queueWatcher 中执行 nextTick()

```js
/* @flow */
/* globals MutationObserver */

import { noop } from 'shared/util'
import { handleError } from './error'
import { isIE, isIOS, isNative } from './env'

export let isUsingMicroTask = false

const callbacks = []
let pending = false

// 刷新回调函数
function flushCallbacks () {
  // 标记处理结束
  pending = false
  // 备份回调函数数组
  const copies = callbacks.slice(0)
  // 清空原数组
  callbacks.length = 0
  // 循环调用拷贝的回调函数
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let timerFunc

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    // UIWebView IOS的一个控件版本大于9.3.3的时候，自动降级为setTimeout
    if (isIOS) setTimeout(noop)
  }
  // 微任务标记
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // 不是IE浏览器，并且支持MutationObserver，兼容 PhantomJS, iOS7, Android 4.4 等环境
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // setImmediate只有IE浏览器和NodeJS支持，性能比setTimeout好
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

/**
 * @param {*} cb 回调函数
 * @param {*} ctx 上下文：vue实例
 */
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  // 把 cb 加上异常处理存入 callbacks 数组中
  callbacks.push(() => {
    if (cb) {
      try {
        // 调用 cb()
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    // 判断队列是都正在被处理，遍历数组，找到所有函数并调用
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    // 返回Promise对象
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

src/core/util/next-tick.js

问：nextTick内部 优先使用 promise微任务，当微任务执行的时候，DOM没有渲染到浏览器上，此时如何获取值？
答：当nextTick回调函数执行之前，数据已经被改变。当我们重新改变数据的时候，会立即发送通知，通知watcher渲染视图。在watcher中，会先把DOM上的数据进行更新，更改DOM树，在当前事件循环结束之后才会进行DOM更新操作。在nextTick中，如果使用promise微任务，是从dom树上获取数据，此时DOM还没有渲染到浏览器中。

## 虚拟DOM

### 简介

虚拟 DOM(Virtual DOM) 是使用 JavaScript 对象来描述 DOM，虚拟 DOM 的本质就是 JavaScript 对象，使用 JavaScript 对象来描述 DOM 的结构。应用的各种状态变化首先作用于虚拟 DOM，最终映射到 DOM。Vue.js 中的虚拟 DOM 借鉴了 Snabbdom，并添加了一些 Vue.js 中的特性，例如：指令和组件机制。

Vue 1.x 中细粒度监测数据的变化，每一个属性对应一个 watcher，开销太大。Vue 2.x 中每个组件对应一个 watcher，状态变化通知到组件，再引入虚拟 DOM 进行比对和渲染。

### 作用

- 使用虚拟 DOM，可以避免用户直接操作真实DOM，开发过程关注在业务代码的实现，不需要关注如何操作 DOM，从而提高开发效率
- 作为一个中间层可以跨平台，除了 Web 平台外，还支持 SSR、Weex。
- 关于性能方面，在首次渲染的时候肯定不如直接操作 DOM，因为要维护一层额外的虚拟 DOM。如果后续有频繁操作 DOM 的操作，这个时候可能会有性能的提升，虚拟 DOM 在更新真实 DOM之前会通过 Diff 算法对比新旧两个虚拟 DOM 树的差异，最终把差异更新到真实 DOM。
- 通过给节点设置Key属性，可以让节点重用，避免大量的重绘。

### h函数

vm.$createElement(tag, data, children, normalizeChildren)

#### 入参

- tag：标签名称或者组件对象
- data：描述tag，可以设置DOM的属性或者标签的属性
- children：tag中的文本内容或者子节点

#### 返回结果

Vnode核心属性：

- tag：调用h函数时候传入
- data：调用h函数时候传入
- children：调用h函数时候传入
- text：dom中的文本
- elm：记录真实DOM
- key：用来标记复用当前元素

### Vnode实现过程

#### 1. 首次渲染

`vm_init() => vm.$mount => mountComponent => new Watcher() => updateComponent => vm._ update(vm._ render(), hydrating)`

#### 2. 创建节点

`vm._ render() => Vue.prototype._render() => $createElement() => createElement(vm, a, b, c, d, true) => _createElement(context, tag, data, children, normalizationType) => return vnode  `

src\core\instance\render.js

```js
export function renderMixin (Vue: Class<Component>) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype)

  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }

  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options
		...

    // render self
    let vnode
    try {
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      ...
    } finally {
      currentRenderingInstance = null
    }
    ...
    return vnode
  }
}
...
export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject

  // 模板编译时使用：对编译生成的render进行渲染的方法，内部会在 render 渲染函数模板编译的时候使用
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // 用户传递render时使用：将虚拟DOM 转换为真实DOM
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  ...
}
...
```

src\core\vdom\create-element.js

```js
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  // 对于data参数省略情况的处理
  if (Array.isArray(data) || isPrimitive(data)) {
    // 改变参数位置
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}

export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
   // 传入的配置避免是响应式数据
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n `` +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return createEmptyVNode()
  }
  // object syntax in v-bind
  // <component v-bind:is="currentTabComponent"></component>
  // is 属性的作用将动态组件记录到tag中
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value 相当于将is设置成了false
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      )
    }
  }
  // support single function children as default scoped slot
  // 处理作用域插槽
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  // 判断传入的render类型，将children转换为一维数组
  if (normalizationType === ALWAYS_NORMALIZE) {
    // 返回一维数组，处理用户手写的render
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    // 包含函数式组件时，二维数组转一维数组
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    // 判断是否为 html 中的保留标签
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if (process.env.NODE_ENV !== 'production' && isDef(data) && isDef(data.nativeOn)) {
        warn(
          `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
          context
        )
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    // 判断是否是 自定义组件
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component 查找自定义组件构造函数的声明，根据 Ctor 创建组件的 VNode
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      // 自定义标签，创建 VNode 对象
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // 如果标签不是字符串，那就是组件，创建这个组件对应的VNode
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  // 如果最终的 vnode 是数组，直接返回
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    // 已经定义的vnode
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    // 返回空节点
    return createEmptyVNode()
  }
}
```

#### 3. 更新节点

vm._update负责把虚拟DOM渲染成真实DOM，如果是首次执行调用 vm.__ patch __ (prevVnode, vnode，hydating， false)，如果是数据更新调用 vm.__ patch __(prevVnode, vnode)

 `vm._update(vm._ render(), hydrating) => Vue.prototype._update() => vm.__patch__(prevVnode, vnode) `

src\core\instance\lifecycle.js

```js
export function lifecycleMixin (Vue: Class<Component>) {
  // _update方法的作用是把VNode渲染成真实的 DOM
  // 首次渲染和数据更新时都会调用
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    // prevVnode 是之前处理过的 vnode对象
    if (!prevVnode) {
      // initial render 首次渲染，将 vm.$el 真实 DOM 转换为虚拟 DOM，和新的vnode做比较，最后将差异更新到$el上
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates 数据更新后，直接获取新老节点对比结果
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }

  Vue.prototype.$forceUpdate = function () {
   ...
  }

  Vue.prototype.$destroy = function () {
    ...
  }
}
...
```

#### 4. 对比节点差异

`vm.__patch__() => createPatchFunction({ nodeOps, modules }) => createElm(vnode, insertedVnodeQueue) / patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)`

- 定义位置：src\platforms\web\runtime\index.js

  ```js
  import { patch } from './patch'
  
  // install platform patch function
  Vue.prototype.__patch__ = inBrowser ? patch : noop
  ```

- patch函数定义：src\platforms\web\runtime\patch.js

  ```js
  /* @flow */
  
  // 导出DOM操作，对snabbdom的createElement等方法加工
  import * as nodeOps from 'web/runtime/node-ops'
  import { createPatchFunction } from 'core/vdom/patch'
  // 处理指令 directives 和 ref 属性
  import baseModules from 'core/vdom/modules/index'
  // 平台相关的模块，导出create和update两个钩子函数
  import platformModules from 'web/runtime/modules/index'
  
  // the directive module should be applied last, after all
  // built-in modules have been applied.
  const modules = platformModules.concat(baseModules)
  
  // createPatchFunction 创建patch函数（高阶函数，柯里化函数）
  export const patch: Function = createPatchFunction({ nodeOps, modules })
  ```

- patch函数实现：src\core\vdom\patch.js

  ```js
  // 相当于snabbdom 中的init函数
  export function createPatchFunction (backend) {
    let i, j
    // 存储模块中调用的钩子函数
    const cbs = {}
  
    // modules DOM模块，节点属性/事件/样式的操作
    // nodeOps 节点操作
    const { modules, nodeOps } = backend
  
    // ['create', 'activate', 'update', 'remove', 'destroy']
    for (i = 0; i < hooks.length; ++i) {
      // cbs['update'] = []
      cbs[hooks[i]] = []
      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          // cbs['update'] = [updateAttrs, updateClass, update...]
          cbs[hooks[i]].push(modules[j][hooks[i]])
        }
      }
    }
  
    ...
    // 函数柯里化，让一个函数返回一个函数
    // createFunction({ nodeOps, modules }) 传入平台相关的两个参数，可以在上面的函数中使用这两个参数
  
    return function patch (oldVnode, vnode, hydrating, removeOnly) {
      // 新 VNode 不存在
      if (isUndef(vnode)) {
        // 旧 VNode 存在，执行 Destroy 钩子函数
        if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
        return
      }
  
      let isInitialPatch = false
      const insertedVnodeQueue = []
  
      // 旧 VNode 不存在，调用组件的$mount方法，没有传入参数，即只创建组件，存在内存中，不挂在到视图上
      if (isUndef(oldVnode)) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true
        // 1. 创建新的 VNode ，转换成真实的 DOM 但不挂载，因为没有传入父节点
        createElm(vnode, insertedVnodeQueue)
      } else {
        // 新旧将 VNode 都存在，更新
        const isRealElement = isDef(oldVnode.nodeType)
        // 如果 oldVnode 不是真实 DOM（nodeType是DOM对象的属性，如果这个属性被定义，说明是一个真实的DOM）
        // sameVnode主要对比节点 key 和 tag 是否相同
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          // 2. 更新操作，diff算法
          patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
        } else {
          // oldVnode 是真实DOM，创建 VNode
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR)
              hydrating = true
            }
            if (isTrue(hydrating)) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true)
                return oldVnode
              } else if (process.env.NODE_ENV !== 'production') {
                warn(
                  'The client-side rendered virtual DOM tree is not matching ' +
                  'server-rendered content. This is likely caused by incorrect ' +
                  'HTML markup, for example nesting block-level elements inside ' +
                  '<p>, or missing <tbody>. Bailing hydration and performing ' +
                  'full client-side render.'
                )
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            // 将真实DOM存储在elm属性中，转换为虚拟DOM（VNode）节点
            oldVnode = emptyNodeAt(oldVnode)
          }
  
          // replacing existing element
          // 创建新 VNode
          const oldElm = oldVnode.elm
          const parentElm = nodeOps.parentNode(oldElm)
  
          // create new node
          // 将新的真实的 DOM 节点转换为虚拟 DOM，并将转换后的虚拟 DOM 插入到旧节点之前，记录到插入节点队列中
          createElm(
            vnode,
            insertedVnodeQueue,
            // extremely rare edge case: do not insert if old element is in a
            // leaving transition. Only happens when combining transition +
            // keep-alive + HOCs. (#4590)
            // 如果界面上正在执行 transition 的消失动画，此时是将 parentElm 设置为了none
            oldElm._leaveCb ? null : parentElm,
            nodeOps.nextSibling(oldElm)
          )
  
          // update parent placeholder node element, recursively
          // 处理父节点的占位符问题
          if (isDef(vnode.parent)) {
            ...
          }
  
          // 判断 oldVNode 中的父节点是否存在，即oldVNode是否在DOM树上
          // destroy old node
          if (isDef(parentElm)) {
            // 如果存在，移除旧节点
            removeVnodes([oldVnode], 0, 0)
          } else if (isDef(oldVnode.tag)) {
            // 如果不存在，判断是否是 tag 标签，如果是触发 Destroy 钩子函数
            invokeDestroyHook(oldVnode)
          }
        }
      }
  
      // 触发插入节点的钩子函数
      // isInitialPatch 记录 VNode 是否挂载到DOM树上，如果为true，说明没有挂载
      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
      return vnode.elm
    }
  }
  ```

- 新/旧节点不存在，创建节点：src\core\vdom\patch.js

  createElm：把虚拟节点的和虚拟节点的children，转换为真实DOM，插入到DOM树中

  `createElm(vnode, insertedVnodeQueue...) => createChildren(vnode, children, insertedVnodeQueue) => invokeCreateHooks (vnode, insertedVnodeQueue) => insert (parent, elm, ref) `

  ```js
  ...
  export function createPatchFunction (backend) {
  	/**
     * 将新的真实的 DOM 节点转换为虚拟 DOM，并将转换后的虚拟 DOM 插入到旧节点之前，记录到插入节点队列中
     * @param {*} vnode 节点：将 VNode 转换为真实 DOM，并挂载到DOM树上
     * @param {*} insertedVnodeQueue 节点插入队列
     * @param {*} parentElm 父节点的真实 DOM 节点属性，转换后的elm会添加到末尾
     * @param {*} refElm 对标插入某个位置的节点
     * @param {*} nested 
     * @param {*} ownerArray 子节点数组
     * @param {*} index 子节点索引
     */
    function createElm (
      vnode,
      insertedVnodeQueue,
      parentElm,
      refElm,
      nested,
      ownerArray,
      index
    ) {
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // This vnode was used in a previous render!
        // now it's used as a new node, overwriting its elm would cause
        // potential patch errors down the road when it's used as an insertion
        // reference node. Instead, we clone the node on-demand before creating
        // associated DOM element for it.  
        vnode = ownerArray[index] = cloneVNode(vnode)
      }
  
      vnode.isRootInsert = !nested // for transition enter check
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
      }
  
      const data = vnode.data
      const children = vnode.children
      const tag = vnode.tag
      if (isDef(tag)) {
        // 标签节点
        if (process.env.NODE_ENV !== 'production') {
          if (data && data.pre) {
            creatingElmInVPre++
          }
          if (isUnknownElement(vnode, creatingElmInVPre)) {
            warn(
              'Unknown custom element: <' + tag + '> - did you ' +
              'register the component correctly? For recursive components, ' +
              'make sure to provide the "name" option.',
              vnode.context
            )
          }
        }
  
        // 是否有命名空间 namespace 比如svg
        vnode.elm = vnode.ns
          ? nodeOps.createElementNS(vnode.ns, tag)
          : nodeOps.createElement(tag, vnode)
        setScope(vnode) // 设置样式作用域
  
        /* istanbul ignore if */
        if (__WEEX__) {
          ...
        } else {
          // 将vnode中所有的子元素转换为 DOM 对象
          createChildren(vnode, children, insertedVnodeQueue)
          if (isDef(data)) {
            // 触发 create 钩子函数
            invokeCreateHooks(vnode, insertedVnodeQueue)
          }
          // 将创建好的DOM对象插入父节点
          insert(parentElm, vnode.elm, refElm)
        }
  
        if (process.env.NODE_ENV !== 'production' && data && data.pre) {
          creatingElmInVPre--
        }
      } else if (isTrue(vnode.isComment)) {
        // 注释节点
        vnode.elm = nodeOps.createComment(vnode.text)
        insert(parentElm, vnode.elm, refElm)
      } else {
        // 文本节点
        vnode.elm = nodeOps.createTextNode(vnode.text)
        // 将 VNode 对应的Dom元素挂载到父节点中，并渲染视图，前提是父节点被定义
        insert(parentElm, vnode.elm, refElm)
      }
    }
    
    function createChildren (vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        if (process.env.NODE_ENV !== 'production') {
          // 判断所有的子元素是否有相同的Key
          checkDuplicateKeys(children)
        }
        for (let i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
        }
      } else if (isPrimitive(vnode.text)) {
        // 判断文本是原始值，转换为字符串后创建一个文本节点，挂载dom树上
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
      }
    }
        
    // 判断所有的子元素是否有相同的Key
    function checkDuplicateKeys (children) {
      const seenKeys = {}
      for (let i = 0; i < children.length; i++) {
        const vnode = children[i]
        const key = vnode.key
        if (isDef(key)) {
          if (seenKeys[key]) {
            warn(
              `Duplicate keys detected: '${key}'. This may cause an update error.`,
              vnode.context
            )
          } else {
            seenKeys[key] = true
          }
        }
      }
    }
        
    function invokeCreateHooks (vnode, insertedVnodeQueue) {
      // 调用 VNode 的钩子函数
      for (let i = 0; i < cbs.create.length; ++i) {
        // 触发模块中的钩子
        cbs.create[i](emptyNode, vnode)
      }
      i = vnode.data.hook // Reuse variable
      // 调用组件的钩子函数
      if (isDef(i)) {
        // 触发vnode中的钩子
        if (isDef(i.create)) i.create(emptyNode, vnode)
        // VNode 没有添加到Dom树上，所有只是添加到插入队列
        if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
      }
    }
        
    function insert (parent, elm, ref) {
      if (isDef(parent)) {
        if (isDef(ref)) {
          // ref 相对元素的父节点和要插入是否相同
          if (nodeOps.parentNode(ref) === parent) {
            nodeOps.insertBefore(parent, elm, ref)
          }
        } else {
          // 没有相对节点，直接添加到父节点中
          nodeOps.appendChild(parent, elm)
        }
      }
    }
    ...
  }
  ...
  ```

- 新旧节点存在，对比差异

  patchVnode：对比新旧 VNode 的差异，更新视图

  updateChildren：

  - 从头到尾开始依次找到相同的子节点进行比较 patchVNode
  - 在旧节点的子节点中查找 newStartVNode，并进行处理
  - 如果新节点个数 > 旧节点个数，把新增的子节点插入到DOM树中
  - 如果新节点个数 < 旧节点个数，把多余的老节点删除

  `patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly) => updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly) => addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) => removeVnodes (vnodes, startIdx, endIdx) ` 

  ```js
  ...
  export function createPatchFunction (backend) {
  	...
    function patchVnode (
      oldVnode,
      vnode,
      insertedVnodeQueue,
      ownerArray,
      index,
      removeOnly
    ) {
      if (oldVnode === vnode) {
        return
      }
  
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // clone reused vnode
        vnode = ownerArray[index] = cloneVNode(vnode)
      }
  
      const elm = vnode.elm = oldVnode.elm
  
      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved)) {
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
        } else {
          vnode.isAsyncPlaceholder = true
        }
        return
      }
  
      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      // 如果新旧 VNode 都是今天的，那么只需要替换compoentinstance
      if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
        vnode.componentInstance = oldVnode.componentInstance
        return
      }
  
      let i
      const data = vnode.data
      // 触发prepatch钩子函数
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode)
      }
  
      const oldCh = oldVnode.children
      const ch = vnode.children
      // 1. 触发update钩子函数
      if (isDef(data) && isPatchable(vnode)) {
        // 触发 cbs 中的钩子函数,操作节点的属性/样式/事件...
        for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
        // 用户的自定义钩子
        if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
      }
      // 2. 新节点没有文本
      if (isUndef(vnode.text)) {
        // 2-1. 新旧节点都有子节点
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
        } else if (isDef(ch)) {
          // 2-2. 新节点有子节点，旧节点没有
          if (process.env.NODE_ENV !== 'production') {
            checkDuplicateKeys(ch)
          }
          if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
          // 清空旧节点文本，为当前DOM节点加入子节点
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
        } else if (isDef(oldCh)) {
          // 2-3. 旧节点有子节点，新节点没有，删除旧节点的子节点
          removeVnodes(oldCh, 0, oldCh.length - 1)
        } else if (isDef(oldVnode.text)) {
          // 2-4. 旧节点有文本，新节点没有文本，清空文本内容
          nodeOps.setTextContent(elm, '')
        }
      } else if (oldVnode.text !== vnode.text) {
        // 3. 新旧节点文本不同，修改文本
        nodeOps.setTextContent(elm, vnode.text)
      }
      if (isDef(data)) {
        // 4. 触发postpatch钩子函数
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
      }
    }
    
    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      let oldStartIdx = 0
      let newStartIdx = 0
      let oldEndIdx = oldCh.length - 1
      let oldStartVnode = oldCh[0]
      let oldEndVnode = oldCh[oldEndIdx]
      let newEndIdx = newCh.length - 1
      let newStartVnode = newCh[0]
      let newEndVnode = newCh[newEndIdx]
      let oldKeyToIdx, idxInOld, vnodeToMove, refElm
  
      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      const canMove = !removeOnly
  
      if (process.env.NODE_ENV !== 'production') {
        // 校验重复key
        checkDuplicateKeys(newCh)
      }
  
      // diff算法
      // 新节点和旧节点没有遍历完成
      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        // 1. 新/旧节点未定义
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx]
        // 2. 旧开始 = 新开始 / 旧结束 = 新结束
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          // 将 VNode 新旧节点差异更新
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
          // 获取下一组节点
          oldStartVnode = oldCh[++oldStartIdx]
          newStartVnode = newCh[++newStartIdx]
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          // 将 VNode 新旧节点差异更新
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
          // 获取下一组节点
          oldEndVnode = oldCh[--oldEndIdx]
          newEndVnode = newCh[--newEndIdx]
        // 3. 旧开始 = 新结束 / 旧结束 = 新开始
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          // 差异更新，将 旧开始 移动至 新结束 的后面
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
          oldStartVnode = oldCh[++oldStartIdx]
          newEndVnode = newCh[--newEndIdx]
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          // 差异更新，将 旧结束 移动至 新开始 的前面
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
          // 移动游标，获取下一组节点
          oldEndVnode = oldCh[--oldEndIdx]
          newStartVnode = newCh[++newStartIdx]
        } else {
        // 4. 所有节点均不相同，新开始节点依旧和旧节点比较
  
          // 从新开始节点的第一个开始， 去旧节点队列中查找，先找相同索引，找到了再找相同节点
          if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
          // 没找到，创建节点插入最前面
          if (isUndef(idxInOld)) { // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          } else {
            // 找到了，获取要移动的旧节点
            vnodeToMove = oldCh[idxInOld]
            // 节点相同
            if (sameVnode(vnodeToMove, newStartVnode)) {
              // 更新差异，将旧节点移动到最前面
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
              oldCh[idxInOld] = undefined
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
            } else {
              // 如果key相同，元素不同，创建新元素
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
            }
          }
          newStartVnode = newCh[++newStartIdx]
        }
      }
      if (oldStartIdx > oldEndIdx) {
        // 新节点个数 > 老节点个数，新增剩余节点
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
      } else if (newStartIdx > newEndIdx) {
        // 新节点个数 < 老节点个数，删除剩余节点
        removeVnodes(oldCh, oldStartIdx, oldEndIdx)
      }
    }
    
    // 删除节点的子节点
    function removeVnodes (vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx]
        // 遍历节点数组中的所有节点，判断节点是否存在
        if (isDef(ch)) {
          // 如果存在，并且是tag标签
          if (isDef(ch.tag)) {
            // 将节点移除，并且触发destroy钩子函数
            removeAndInvokeRemoveHook(ch)
            invokeDestroyHook(ch)
          } else { // Text node
            removeNode(ch.elm)
          }
        }
      }
    }
    // 遍历所有真实节点的子节点，将子节点转换为真实 DOM，挂载到DOM树上
    function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx)
      }
    }
    ...
  }
  ```

### Key的作用

没有key

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Runtime+Compiler</title>
</head>
<body>
  <div id="app">
    <li v-for="value in arr">{{ value }}</li>
  </div>

  <script src="../dist/vue.js"></script>
  <script>
    const vm = new Vue({
      el: '#app',
      data: {
        arr: ['a', 'b', 'c', 'd']
      },
      methods: {
        handler () {
          this.arr.splice(1, 0, 'x')
        }
      }
    })
  </script>
</body>
</html>
```

在 updateChildren 中比较子节点的时候，会做三次更新 DOM 操作和一次插入 DOM 的操作

   `updateChildren => sameVnode(oldStartVnode, newStartVnode) => patchVnode() => oldVnode.text !== newVnode.text => nodeOps.setTextContent() => oldStartIdx > oldEndIdx => addVnodes()   ` 

有key：

```html
<li v-for="value in arr" :key="value">{{ value }}</li>
```

在 updateChildren 中比较子节点的时候，因为 oldVnode 的子节点的 b,c,d 和 newVnode 的 x,b,c 的 key 相同，所以只做比较，没有更新 DOM 的操作，当遍历完毕后，会再把 x 插入到 DOM 上DOM 操作只有一次插入操作。

`updateChildren => sameVnode(oldEndVnode, newEndVnode) => patchVnode() => updateChildren => oldStartIdx > oldEndIdx => addVnodes()   `

## 模板编译

### 作用

- Vue 2.x 使用 VNode 描述视图以及各种交互，用户自己编写 VNode 比较复杂
- 用户只需要编写类似 HTML 的代码 - Vue 模板，通过编译器将模板转换为返回 VNode 的 render 函数
- .vue 文件会被 webpack 在构建的过程中转换成 render 函数
- 根据编译时机不同分为运行时编译和编译器编译

### 示例分析

根据div生成rendr函数：https://template-explorer.vuejs.org/

分析编译后 render 输出的结果：

```html
<div id="app">
  <h1>Vue<span>模板编译过程</span></h1>
	<p>{{ msg }}</p>
	<comp @myclick="handler"></comp>
</div>
```

```js
function render() {
  with(this) {
    return _c('div', {
      attrs: {
        "id": "app"
      }
    }, [_m(0), _c('p', [_v(_s(msg))]), _c('comp', {
      on: {
        "myclick": handler
      }
    })], 1)
  }
}
```

- _ c 是 createElement() 方法，定义的位置 instance/render.js 中

  ```js
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  ```

- 相关的渲染函数(_ 开头的方法定义)，在 instance/render-helps/index.js 中 

  ```js
  /* @flow */
  
  import { toNumber, toString, looseEqual, looseIndexOf } from 'shared/util'
  import { createTextVNode, createEmptyVNode } from 'core/vdom/vnode'
  import { renderList } from './render-list'
  import { renderSlot } from './render-slot'
  import { resolveFilter } from './resolve-filter'
  import { checkKeyCodes } from './check-keycodes'
  import { bindObjectProps } from './bind-object-props'
  import { renderStatic, markOnce } from './render-static'
  import { bindObjectListeners } from './bind-object-listeners'
  import { resolveScopedSlots } from './resolve-scoped-slots'
  import { bindDynamicKeys, prependModifier } from './bind-dynamic-keys'
  
  export function installRenderHelpers (target: any) {
    target._o = markOnce
    target._n = toNumber
    target._s = toString
    target._l = renderList
    target._t = renderSlot
    target._q = looseEqual
    target._i = looseIndexOf
    target._m = renderStatic
    target._f = resolveFilter
    target._k = checkKeyCodes
    target._b = bindObjectProps
    target._v = createTextVNode
    target._e = createEmptyVNode
    target._u = resolveScopedSlots
    target._g = bindObjectListeners
    target._d = bindDynamicKeys
    target._p = prependModifier
  }
  ```

### 入口函数

1. src\platforms\web\entry-runtime-with-compiler.js

   ```js
   ...
   // 将设置的DOM挂载到页面上
   Vue.prototype.$mount = function (
     el?: string | Element,
     // 开启ssr时 为 true
     hydrating?: boolean
   ): Component {
   	...
     if (!options.render) {
       ...
       if (template) {
         ...
         // 把 template 转换成 render 函数
         const { render, staticRenderFns } = compileToFunctions(template, {
           outputSourceRange: process.env.NODE_ENV !== 'production',
           shouldDecodeNewlines,
           shouldDecodeNewlinesForHref,
           delimiters: options.delimiters,
           comments: options.comments
         }, this)
         ...
       }
       ...
     }
     ...
   }
   ...
   ```

2. src\platforms\web\compiler\index.js

   ```js
   /* @flow */
   
   import { baseOptions } from './options'
   import { createCompiler } from 'compiler/index'
   
   const { compile, compileToFunctions } = createCompiler(baseOptions)
   
   export { compile, compileToFunctions }
   ```

3. src\compiler\index.js

   ```js
   /* @flow */
   
   import { parse } from './parser/index'
   import { optimize } from './optimizer'
   import { generate } from './codegen/index'
   import { createCompilerCreator } from './create-compiler'
   
   // `createCompilerCreator` allows creating compilers that use alternative
   // parser/optimizer/codegen, e.g the SSR optimizing compiler.
   // Here we just export a default compiler using the default parts.
   /**
    * @param template 模板
    * @param options 合并后的选项参数
    */
   export const createCompiler = createCompilerCreator(function baseCompile (
     template: string,
     options: CompilerOptions
   ): CompiledResult {
     // 1. 把模板编译成抽象语法树 ast（用来以树形的方式描述代码结构）
     const ast = parse(template.trim(), options)
     if (options.optimize !== false) {
       // 2. 优化抽象语法树
       optimize(ast, options)
     }
     // 3. 把抽象语法树 转换成 字符串形式的 js 代码
     const code = generate(ast, options)
     return {
       ast,
       render: code.render,
       staticRenderFns: code.staticRenderFns
     }
   })
   ```

4. src\compiler\create-compiler.js

   ```js
   import { extend } from 'shared/util'
   import { detectErrors } from './error-detector'
   // 导入编译入口函数   
   import { createCompileToFunctionFn } from './to-function'
   
   export function createCompilerCreator (baseCompile: Function): Function {
     // baseOptions 平台相关的选项参数，在src\platforms\web\compiler\options.js中定义
     return function createCompiler (baseOptions: CompilerOptions) {
       function compile (
         template: string,
         options?: CompilerOptions
       ): CompiledResult {
           ...
       }
       return {
         compile,
         compileToFunctions: createCompileToFunctionFn(compile)
       }
     }
   }
   ```

### 抽象语法树

- 编译测试地址：https://astexplorer.net/

- 简介：简称AST（Abstract Syntax Tree），使用对象的形式描述树形的代码结构，此处的抽象语法树是用来描述树形结构的HTML字符串。
- 作用：模板字符串转换成AST后，可以通过AST对模板做优化处理。标记模板中的静态内容（没有绑定变量的内容），在patch的时候直接跳过静态内容，不需要对比和重新渲染，从而提高性能。

### 过程

1. createCompileToFunctionFn：先从缓存中加载编译好的渲染函数，缓存没有执行下一步
2. complie(template,options)：合并options，执行下一步
3. baseCompile{ parse(template.trim(), options)：
   1. parse：把template转换成AST tree
   2. optimize
      - 标记AST tree中的静态 sub trees
      - 检测到静态子树，设置为静态节点，避免在每次冲刺你渲染的时候重新生成节点
      - patch 差异更新节点跳过静态子树
   3. generate：AST tree生成js字符串形式的创建代码
   4. compileToFunctions：继续把上一步中生成的字符串形式的js代码，通过createFunction() 转换为函数，render和StaticRenderFns 初始化完毕，挂载 vue 实例的 options 对应的属性中

`compileToFunctions(template, {}, this) => createCompiler(baseOptions) => createCompilerCreator(function baseCompile{}) => createCompileToFunctionFn(compile) => compile(template, options) === baseCompile{ parse(template.trim(), options) => optimize(ast, options) => generate(ast, options) } ` 

#### 创建编译器函数

createCompileToFunctionFn

1. 判断缓存中是否有编译的结果，如果有直接返回
2. 开始编译，把模板编译为编译对象（字符串形式的js代码）
   1. compile：合并选项，调用baseCompile编译模板，将结果返回
   2. baseCompile：src\compiler\index.js
      - 编译：把模板编译成抽象语法树 ast
      - 优化：优化抽象语法树
      - 生成：把抽象语法树 转换成 字符串形式的 js 代码
3. 把字符串形式的js代码转换为函数
4. 将函数缓存并返回res对象{ render, staticRenders }

src\compiler\to-function.js

```js
/* @flow */

import { noop, extend } from 'shared/util'
import { warn as baseWarn, tip } from 'core/util/debug'
import { generateCodeFrame } from './codeframe'

type CompiledFunctionResult = {
  render: Function;
  staticRenderFns: Array<Function>;
};

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}

export function createCompileToFunctionFn (compile: Function): Function {
  // 通过闭包缓存编译之后的结果
  const cache = Object.create(null)

  return function compileToFunctions (
    template: string,
    options?: CompilerOptions,
    vm?: Component
  ): CompiledFunctionResult {
    // 防止污染vue中的options
    options = extend({}, options)
    const warn = options.warn || baseWarn
    delete options.warn

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      // detect possible CSP restriction
      try {
        new Function('return 1')
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          )
        }
      }
    }

    // check cache
    // 1. 判断缓存中是否有编译的结果，读取 CompiledFunctionResult 对象，如果有直接返回
    // delimiters：差值表达式使用的符号 默认为{{}}，只有完整版的vue才有
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template
    if (cache[key]) {
      // 空间换时间，将模板内容作为key
      return cache[key]
    }

    // compile
    // 2. 把模板编译为编译对象{render, staticRenderFns}，字符串形式的js代码
    const compiled = compile(template, options)

    // check compilation errors/tips
    // 检查模板编译中的错误和信息
    ...

    // turn code into functions
    const res = {}
    const fnGenErrors = []

    // 3. 把字符串形式的js代码转换为函数
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors)
    })

    ...

    // 4. 缓存并返回res对象{render,staticRenders}
    return (cache[key] = res)
  }
}
```

#### 编译

parse(template.trim(), options)

依次遍历Html模板字符串，把模板字符串转换成AST对象，模板中的属性和指令都会记录在AST对象对应的属性上

src\compiler\parser\index.js

```js
...
export function parse (
  template: string,
  options: CompilerOptions
): ASTElement | void {
  // 1. 解析options
  warn = options.warn || baseWarn

  platformIsPreTag = options.isPreTag || no
  platformMustUseProp = options.mustUseProp || no
  platformGetTagNamespace = options.getTagNamespace || no
  const isReservedTag = options.isReservedTag || no
  maybeComponent = (el: ASTElement) => !!el.component || !isReservedTag(el.tag)

  transforms = pluckModuleFunction(options.modules, 'transformNode')
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')

  delimiters = options.delimiters

 	...
 
  // 2. 解析HTML模板
  // start开始标签/end结束标签/chars文本内容/comment注释，解析过程中的回调函数，用于生成AST
  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    outputSourceRange: options.outputSourceRange,
    start (tag, attrs, unary, start, end) {
      // check namespace.
      // inherit parent ns if there is one
      const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag)

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs)
      }

      // 创建AST对象
      let element: ASTElement = createASTElement(tag, attrs, currentParent)
      if (ns) {
        element.ns = ns
      }

      ...

      if (!inVPre) {
        // 处理指令 v-pre
        processPre(element)
        if (element.pre) {
          inVPre = true
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true
      }
      if (inVPre) {
        processRawAttrs(element)
      } else if (!element.processed) {
        // structural directives
        // 处理结构化指令 v-for v-if v-once
        processFor(element)
        processIf(element)
        processOnce(element)
      }

      if (!root) {
        root = element
        if (process.env.NODE_ENV !== 'production') {
          checkRootConstraints(root)
        }
      }

      // unary 自闭合并标签
      if (!unary) {
        currentParent = element
        stack.push(element)
      } else {
        closeElement(element)
      }
    },

    end (tag, start, end) {
      const element = stack[stack.length - 1]
      // pop stack
      stack.length -= 1
      currentParent = stack[stack.length - 1]
      if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
        element.end = end
      }
      closeElement(element)
    },

    chars (text: string, start: number, end: number) {
      if (!currentParent) {
        if (process.env.NODE_ENV !== 'production') {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.',
              { start }
            )
          } else if ((text = text.trim())) {
            warnOnce(
              `text "${text}" outside root element will be ignored.`,
              { start }
            )
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      const children = currentParent.children
      if (inPre || text.trim()) {
        text = isTextTag(currentParent) ? text : decodeHTMLCached(text)
      } else if (!children.length) {
        // remove the whitespace-only node right after an opening tag
        text = ''
      } else if (whitespaceOption) {
        if (whitespaceOption === 'condense') {
          // in condense mode, remove the whitespace node if it contains
          // line break, otherwise condense to a single space
          text = lineBreakRE.test(text) ? '' : ' '
        } else {
          text = ' '
        }
      } else {
        text = preserveWhitespace ? ' ' : ''
      }
      if (text) {
        if (!inPre && whitespaceOption === 'condense') {
          // condense consecutive whitespaces into single space
          text = text.replace(whitespaceRE, ' ')
        }
        let res
        let child: ?ASTNode
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text
          }
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          child = {
            type: 3,
            text
          }
        }
        if (child) {
          if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
            child.start = start
            child.end = end
          }
          children.push(child)
        }
      }
    },
    comment (text: string, start, end) {
      // adding anything as a sibling to the root node is forbidden
      // comments should still be allowed, but ignored
      if (currentParent) {
        const child: ASTText = {
          type: 3,
          text,
          isComment: true
        }
        if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
          child.start = start
          child.end = end
        }
        currentParent.children.push(child)
      }
    }
  })
  // 返回解析好的html对象
  return root
}
...
```

#### 优化

optimize(ast, options)

src\compiler\optimizer.js

```js
/* @flow */

import { makeMap, isBuiltInTag, cached, no } from 'shared/util'

let isStaticKey
let isPlatformReservedTag

const genStaticKeysCached = cached(genStaticKeys)
/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 * 优化的目的是用来标记抽象语法树中的静态节点(对应的DOM子树永远不会发生变化)
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render; 将来创建新节点的时候不需要重新渲染
 * 2. Completely skip them in the patching process. 差异更新的时候可以直接跳过
 */
export function optimize (root: ?ASTElement, options: CompilerOptions) {
  // 在传递了AST对象的前提下
  if (!root) return
  isStaticKey = genStaticKeysCached(options.staticKeys || '')
  isPlatformReservedTag = options.isReservedTag || no
  // first pass: mark all non-static nodes.
  // 标记静态节点
  markStatic(root)
  // second pass: mark static roots.
  // 标记静态根节点
  markStaticRoots(root, false)
}

// 标记静态节点
function markStatic (node: ASTNode) {
  node.static = isStatic(node)
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    // 元素节点，处理元素中的子节点
    // isPlatformReservedTag(node.tag) 判断是否为非保留标签，即组件
    // 是组件 && 是组件中的slot，不去标记
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    // 遍历子节点
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i]
      // 递归调用标记静态方法
      markStatic(child)
      if (!child.static) {
        // 如果有一个 child 不是静态的，那么当前节点就不是静态的
        node.static = false
      }
    }
    // 处理条件渲染中的AST对象
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block
        markStatic(block)
        if (!block.static) {
          node.static = false
        }
      }
    }
  }
}

function markStaticRoots (node: ASTNode, isInFor: boolean) {
  if (node.type === 1) {
    // 判断节点是否为静态的，只渲染一次
    if (node.static || node.once) {
      node.staticInFor = isInFor
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    // 静态节点 && 有子节点 && 不能只有一个文本类型的子节点
    // 如果一个元素内只有文本节点，此时这个元素不是静态的根节点，这种优化会带来负面影响
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true
      return
    } else {
      node.staticRoot = false
    }
    // 递归检测当前节点的子节点中是否有静态的根节点
    if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for)
      }
    }
    // 条件渲染子节点
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor)
      }
    }
  }
}

function isStatic (node: ASTNode): boolean {
  // 差值表达式
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in 不能是内置组件
    isPlatformReservedTag(node.tag) && // not a component 不能是组件
    !isDirectChildOfTemplateFor(node) && // 不能是v-for的直属子节点
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node: ASTElement): boolean {
  while (node.parent) {
    node = node.parent
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}
```

#### 生成

 generate(ast, options)：将优化好的AST对象转换对象形式的js代码

src\compiler\codegen\index.js

```js
...
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  // 代码生成过程中的状态对象
  const state = new CodegenState(options)
  // AST对象存在，转换为代码，否则创建一个空的div标签
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}

export class CodegenState {
  options: CompilerOptions;
  warn: Function;
  transforms: Array<TransformFunction>;
  dataGenFns: Array<DataGenFunction>;
  directives: { [key: string]: DirectiveFunction };
  maybeComponent: (el: ASTElement) => boolean;
  onceId: number;
  staticRenderFns: Array<string>;
  pre: boolean;

  constructor (options: CompilerOptions) {
    this.options = options
    this.warn = options.warn || baseWarn
    this.transforms = pluckModuleFunction(options.modules, 'transformCode')
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
    this.directives = extend(extend({}, baseDirectives), options.directives)
    const isReservedTag = options.isReservedTag || no
    this.maybeComponent = (el: ASTElement) => !!el.component || !isReservedTag(el.tag)
    this.onceId = 0
    // 字符串形式的代码
    this.staticRenderFns = []
    this.pre = false
  }
}

export function genElement (el: ASTElement, state: CodegenState): string {
  // 可以是节点的pre或父节点的pre v-pre 标记静态节点
  if (el.parent) {
    el.pre = el.pre || el.parent.pre
  }

  // staticProcessed 标记当前节点是否被处理
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  // template 标签，不是静态的，会生成对应的子节点
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    let code
    if (el.component) {
      code = genComponent(el.component, el, state)
    } else {
      let data
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        // 生成元素的属性/指令/事件等，处理各种指令，包括 genDirectives(model/text/html)
        // data 为 createElement 的第二个参数
        data = genData(el, state)
      }

      // createElement 的第三个参数 children，生成render函数需要的代码
      const children = el.inlineTemplate ? null : genChildren(el, state, true)
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
    // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code)
    }
    return code
  }
}

export function genChildren (
  el: ASTElement,
  state: CodegenState,
  checkSkip?: boolean,
  altGenElement?: Function,
  altGenNode?: Function
): string | void {
  const children = el.children
  if (children.length) {
    const el: any = children[0]
    // optimize single v-for
    if (children.length === 1 &&
      el.for &&
      el.tag !== 'template' &&
      el.tag !== 'slot'
    ) {
      // createElement 的第三个参数 normalizationType 数组是否打平
      const normalizationType = checkSkip
        ? state.maybeComponent(el) ? `,1` : `,0`
        : ``
      return `${(altGenElement || genElement)(el, state)}${normalizationType}`
    }
    const normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0
    const gen = altGenNode || genNode
    return `[${children.map(c => gen(c, state)).join(',')}]${
      normalizationType ? `,${normalizationType}` : ''
    }`
  }
}

// hoist static sub-trees out
// 生成静态节点
function genStatic (el: ASTElement, state: CodegenState): string {
  // 标记节点已经被处理
  el.staticProcessed = true
  // Some elements (templates) need to behave differently inside of a v-pre
  // node.  All pre nodes are static roots, so we can use this as a location to
  // wrap a state change and reset it upon exiting the pre node.
  // 某些元素/模板的 v-pre 内部需要不同的处理方式，所有的静态子节点都在静态根节点数组中
  // 所以这里使用一个中间状态改变，并且在 return 之前重置
  // originalPreState 存储每一个静态子树对应的代码
  const originalPreState = state.pre
  if (el.pre) {
    state.pre = el.pre
  }
  state.staticRenderFns.push(`with(this){return ${genElement(el, state)}}`)
  state.pre = originalPreState
  // 返回当前索引对应节点的代码，最终传入的是函数的形式
  // _m ---> renderStatic
  return `_m(${
    state.staticRenderFns.length - 1
  }${
    el.staticInFor ? ',true' : ''
  })`
}
...
```

## 组件注册

https://cn.vuejs.org/v2/guide/components.html#ad

- 一个Vue组件就是一个拥有预定义选项的Vue实例
- 一个组件可以组成页面上一个功能完备的区域，组件可以包含脚本、样式、模板

### 注册全局组件

#### 使用

```js
const Comp = Vue.component('comp', {
  template: '<div>Hello Component</div>'
})
const vm = new Vue({
  el: '#app',
  render (h) {
    return h(Comp)
	}
})
```

#### 源码

- 全局组件之所以可以在任意组件中使用是因为 Vue 构造函数的选项被合并到了 VueComponent 组件构造函数的选项中
- 局部组件的使用范围被限制在当前组件内是因为，在创建当前组件的过程中传入的局部组件选项，其它位置无法访问

src\core\global-api\index.js

```js
...
export function initGlobalAPI (Vue: GlobalAPI) {
  ...
  // 注册'component'组件，'directive'指令，'filter'过滤器
  initAssetRegisters(Vue)
}
```

src\core\global-api\assets.js

```js
/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    // type：component, directive, filter
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        // 如果没有定义，返回存储在配置项中的component, directive, filter
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          // 验证组件的名称是否合法
          validateComponentName(id)
        }
        // 判断当前类型是否为组件且为对象
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          // 把组件配置转换为组件的构造函数，options._base = Vue
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // 全局注册，如果是函数，将函数存储并赋值
        // this.option['components']['my-component'] = definition
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
```

Vue.extend():src\core\global-api\extend.js

```js
...
export function initExtend (Vue: GlobalAPI) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   * 保证创建一个包裹的子构造函数通过原型继承并且缓存他们
   */
  Vue.cid = 0
  let cid = 1

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}

    // Vue构造函数
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})

    // 从缓存中加载组件的构造函数
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      // 如果是开发环境，验证组件的名称，这里验证是因为extend可以被外部直接调用
      validateComponentName(name)
    }

    const Sub = function VueComponent (options) {
      // 组件对应的构造函数初始化
      this._init(options)
    }

    // 原型继承自 Vue Super = Vue vue有_init，所有Sub有_init
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    // 为了缓存使用
    Sub.cid = cid++
    // 合并选项
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      // 在当前组件的components属性中记录自己，保存组件的构造函数 Ctor.options.components.comp = Ctor
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    // 通过Super.cid缓存构造函数，把组件的构造函数缓存到 options._Ctor
    cachedCtors[SuperId] = Sub

    return Sub
  }
}
...
```

### 创建组件

src\core\vdom\create-element.js

```js
...
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
    ...
    if (typeof tag === 'string') {
    	...
    } else {
      // 如果标签不是字符串，那就是组件，创建这个组件对应的VNode
      // direct component options / constructor
      vnode = createComponent(tag, data, context, children)
    }
    ...
  }
...
```

src\core\vdom\create-component.js

```js
/**
 * 创建组件
 * @param {*} Ctor 组件类构造函数 | 函数 | 对象
 * @param {*} data 组件需要的数据
 * @param {*} context 上下文：当前组件实例 || vue实例
 * @param {*} children 子节点
 * @param {*} tag 标签名称
 */
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }

  // vue构造函数
  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  // 如果 Ctor 不是一个构造函数，是一个对象，使用 Vue.extend() 创造一个子组件的构造函数
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  ...

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  // 1. 当前组件构造函数创建完毕后，合并当前组件选项 和 通过 Vue.minxin 混入的选项
  resolveConstructorOptions(Ctor)

  ...

  // install component management hooks onto the placeholder node
  // 2. 注册组件的钩子函数 init/prepatch/insert/destroy
  // init内部通过 new vnode.componentOptions.Ctor(options) 创建组件对象
  installComponentHooks(data)

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  // 3. 获取组件的名称，创建组件对应的VNode对象
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  ...

  return vnode
}

export function createComponentInstanceForVnode (
  // we know it's MountedComponentVNode but flow doesn't
  vnode: any,
  // activeInstance in lifecycle state
  parent: any
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  // check inline-template render functions
  // 获取 inline-template <comp inline-template> xxxx </comp>
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  // 创建组件实例
  return new vnode.componentOptions.Ctor(options)
}

// 定义组件的钩子函数
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      // 创建组件实例
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },

  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    ...
  },

  insert (vnode: MountedComponentVNode) {
   ...
  },

  destroy (vnode: MountedComponentVNode) {
   ...
  }
}

const hooksToMerge = Object.keys(componentVNodeHooks)

function installComponentHooks (data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  // 把用户传入的自定义钩子函数和 componentVNodeHooks 中预定义的钩子函数合并
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    // 用户传入的钩子函数
    const existing = hooks[key]
    // 默认的钩子函数
    const toMerge = componentVNodeHooks[key]
    if (existing !== toMerge && !(existing && existing._merged)) {
      // mergeHook 合并钩子函数
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
    }
  }
}
```

### 差异更新

- 在 createElement() 函数中调用 createComponent() 创建的是组件的 VNode。组件对象是在组件的 init 钩子函数中创建的，然后在  patch() --> createElm() --> createComponent() 中挂载组件

## 面试题

```js
const vm = new Vue({
  el: '#app',
  data: {
  	msg: 'Hello vue',
    arr: [2, 3, 5],
    obj: {
      title: 'Hello vue'
    }
  }
})
```

1. vm.msg = { count: 0 } ，重新给属性赋值，是否是响应式的？

   是

2. vm.arr[0] = 4 ，给数组元素赋值，视图是否会更新？

   不会，因为数组上的元素不会触发dep.notify()，通知watcher更新视图。如果想要修改数组中的元素，可以通过splice方法进行修改或删除。

3. vm.arr.length = 0 ，修改数组的 length，视图是否会更新？

   不会，length和索引都输入arr的属性，vue内部没有遍历数组的属性，并将它响应化。

4. vm.arr.push(4) ，视图是否会更新？

   会，因为vue内部修补了数组中会改变数组个数的方法，然后会触发dep.notify()，通知watcher更新视图。

5. vm.obj.name = 'aaa'，视图是否会更新？

   不会，可以通过vm.$set(vm.obj, 'name', 'zhangsan')，Set方法会为对象设置属性，如果这个属性不存在，则添加一个新的属性并触发变更通知Watcher，重新渲染视图。