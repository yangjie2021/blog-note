# 虚拟DOM

## 介绍

1. 简介

   由普通的JS对象来描述DOM对象，创建虚拟DOM的开销更小一些，因为不是真实的DOM，所以叫Virtual DOM

2. 为什么使用？

   手动操作 DOM 比较麻烦，还需要考虑浏览器兼容性问题，虽然有 jQuery 等库简化 DOM 操作，但是随着项目的复杂 DOM 操作复杂提升，为了简化 DOM 的复杂操作于是出现了各种 MVVM 框架，MVVM 框架解决了视图和状态的同步问题，为了简化视图的操作我们可以使用模板引擎，但是模板引擎没有解决跟踪状态变化的问题，于是Virtual DOM 出现了

3. 优势：[virtual-dom动机](https://github.com/Matt-Esch/virtual-dom)

   - Virtual DOM 的好处是当状态改变时不需要立即更新 DOM，只需要创建一个虚拟树来描述DOM， Virtual DOM 内部将弄清楚如何有效(diffff)的更新 DOM
   - 虚拟 DOM 可以维护程序的状态，跟踪上一次的状态
   - 通过比较前后两次状态的差异更新真实 DOM

4. 作用：

   - 维护视图和状态的关系
   - 复杂视图情况下提升渲染性能
   - 除了渲染 DOM 以外，还可以实现 SSR(Nuxt.js/Next.js)、原生应用(Weex/React Native)、小程序(mpvue/uni-app)等 

## Virtual DOM 库

### Snabbdom

​	Vue 2.x 内部使用的 Virtual DOM 就是改造的 Snabbdom，代码量大约 200 SLOC（single line of code），通过模块可扩展，源码使用 TypeScript 开发，是最快的 Virtual DOM 之一

参考资料：[文档](https://github.com/snabbdom/snabbdom)，[文档翻译](https://github.com/coconilu/Blog/issues/152)

#### 准备工作

- 创建项目

```shell
# 创建 package.json
$ yarn init -y
# 本地安装
$ parcel yarn add parcel-bundler
# 导入 snabbdom
yarn add snabbdom
```

- 配置 package.json 的 scripts

```json
"scripts": {
  "dev": "parcel index.html --open",
  "build": "parcel build index.html"
}
```

#### 基本使用

1. 导入：Snabbdom 的核心仅提供最基本的功能，只导出了三个函数 init()、h()、thunk()
   - init() 是一个高阶函数，返回 patch()
   - h() 返回虚拟节点 VNode
   - thunk() 是一种优化策略，优化复杂的视图，可以在处理不可变数据时使用

2.  模块：Snabbdom 的核心库并不能处理元素的属性/样式/事件等，如果需要处理的话，可以使用模块
   - attributes：使用 setAttribute () 设置 DOM 元素的属性，处理布尔类型的属性
   - props：设置 DOM 元素的属性 element[attr] = value，但是不处理布尔类型的属性
   - class：切换类样式，给元素设置类样式是通过 sel 选择器
   - dataset：设置 data-* 的自定义属性
   - eventlisteners：注册和移除事件
   - style：设置行内样式，支持动画，增加属性-delayed/remove/destroy

```js
/**
 * 导入snabbdom
 * commonjs方式导入：var snabbdom = require('snabbdom')
 * 导入时候不能使用 import snabbdom from 'snabbdom'
 * 因为node_modules/src/snabbdom.ts 末尾导出使用的语法是 export 导出 API
 * 没有使用export default 导出默认输出
 */
import { h, init } from 'snabbdom'

// 导入模块
import style from 'snabbdom/modules/style'
import eventlisteners from 'snabbdom/modules/eventlisteners'

/**
 * 1.初始化patch函数，对比两个vnode的差异更新到真实DOM
 * @param {Array} 模块
 */
let patch = init([
  style,
  eventlisteners
])

/**
 * 2.创建虚拟dom
 * @param {String} 标签+选择器
 * @param {Object} 模块配置参数
 * @param {String} 标签中的内容 @param {Array} 子元素节点
 */
let vnode = h('div#container.cls', 
{
  style: {
    backgroundColor: 'red'
  },
  on: {
    click: eventHandler
  },
  hook: {
    init (vnode) {
      console.log(vnode.elm)
    },
    create (emptyVnode, vnode) {
      console.log(vnode.elm)
    }
  }
},
[
  h('h1', 'Hello Snabbdom'),
  h('p', '这是一个p标签')
])

function eventHandler () {
  console.log('点击我了')
}

/**
 * 3.获取真正DOM，通过patch函数把DOM元素转换成VNode，更新到真实DOM
 * @param {DOM/VNode} 标签+选择器
 * @param {VNode} 标签+选择器
 */
let app = document.querySelector('#app')
let oldVnode = patch(app, vnode)

/**
 * 4.重新渲染dom(假设从服务器获取新的数据）
 */
setTimeout(() => {
  vnode = h('div#container', [
    h('h1', 'Hello World'),
    h('p', 'Hello P')
  ])
  patch(oldVnode, vnode)

  // 清空页面元素
  // patch(oldVnode, null) // 错误写法
  patch(oldVnode, h('!')) // 正确元素
}, 2000)
```

#### 源码解析

1. 源码地址：https://github.com/snabbdom/snabbdom

2. 核心流程：

   - 使用 h() 函数创建 JavaScript 对象(VNode)描述真实 DOM
   - init() 设置模块，创建 patch()
   - patch() 比较新旧两个 VNode
   - 把变化的内容更新到真实 DOM 树上

3. 目录结构

   │ h.ts h() 函数，用来创建 VNode 

   │ hooks.ts 所有钩子函数的定义 

   │ htmldomapi.ts 对 DOM API 的包装 

   │ is.ts 判断数组和原始值的函数 

   │ jsx-global.d.ts jsx 的类型声明文件 

   │ jsx.ts 处理 jsx 

   │ snabbdom.bundle.ts 入口，已经注册了模块 

   │ snabbdom.ts 初始化，返回 init/h/thunk 

   │ thunk.ts 优化处理，对复杂视图不可变值得优化 

   │ tovnode.ts DOM 转换成 VNode 

   │ vnode.ts 虚拟节点定义 

   ├─helpers 

   ​		│ attachto.ts 定义了 vnode.ts 中 AttachData 的数据结构 

   └─modules 所有模块定义 

   ​		attributes.ts 

   ​		class.ts 

##### h()函数

h() 函数最早见于 hyperscript，使用 JavaScript 创建超文本，Snabbdom 中的 h() 函数不是用来创建超文本，而是创建 VNode

- 在vue中的使用

  ```js
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
  ```

- 源码：src/h.ts

  ```js
  // h 函数的重载：调用vode函数，返回虚拟节点
  export function h(sel: string): VNode; 
  export function h(sel: string, data: VNodeData | null): VNode; 
  export function h(sel: string, children: VNodeChildren): VNode; 
  export function h(sel: string, data: VNodeData | null, children: VNodeChildren): VNode; 
  export function h(sel: any, b?: any, c?: any): VNode { 
  	var data: VNodeData = {}, children: any, text: any, i: number; 
    // 处理参数，实现重载的机制 
    if (c !== undefined) { 
      // 处理三个参数的情况 
      // sel、data、children/text 
      if (b !== null) { data = b; }
      // 数组为子元素，赋值给children
      if (is.array(c)) { children = c; } 
      // 如果 c 是字符串或者数字 
      else if (is.primitive(c)) { text = c; } 
      // VNode转换为数组
      else if (c && c.sel) { children = [c]; } 
    } else if (b !== undefined && b !== null) { 
      // 处理两个参数的情况 
      // 如果 b 是数组 
      if (is.array(b)) { children = b; } 
      // 如果 b 是字符串或者数字 
      else if (is.primitive(b)) { text = b; } 
      // 如果 b 是 VNode 
      else if (b && b.sel) { children = [b]; } 
      else { data = b; } 
  	}
  	if (children !== undefined) { 
      // 处理 children 中的原始值(string/number) 
      for (i = 0; i < children.length; ++i) { 
      // 如果 child 是 string/number，创建文本节点 
      if (is.primitive(children[i])) children[i] = vnode(undefined, undefined, undefined, children[i], undefined); 
      }
  	}
  
    // 如果是 svg，添加命名空间 
  	if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' && (sel.length === 3 || sel[3] === '.' || sel[3] === '#') ) {
      addNS(data, children, sel);
  	}
    // 返回 VNode 
    return vnode(sel, data, children, text, undefined); 
  };
  // 导出模块 
  export default h;
  ```

##### VNode

一个 VNode 就是一个虚拟节点用来描述一个 DOM 元素，如果这个 VNode 有 children 就是Virtual DOM

源码：src/vnode.ts

```js
export interface VNode {
  sel: string | undefined; // 选择器 
  data: VNodeData | undefined; // 节点数据：属性/样式/事件等
  children: Array<VNode | string> | undefined; // 子节点，和 text 只能互斥 
  elm: Node | undefined; // 记录 vnode 对应的真实 DOM 
  text: string | undefined; // 节点中的内容，和 children 只能互斥 
  key: Key | undefined; // 优化用
}

export function vnode(sel: string | undefined, 
                      data: any | undefined, 
                      children: Array<VNode | string> | undefined, 
                      text: string | undefined, 
                      elm: Element | Text | undefined): VNode { 
  let key = data === undefined ? undefined : data.key; 
  // 返回一个可以描述dom的js对象
  return {sel, data, children, text, elm, key}; 
}
export default vnode; 
```

##### init

源码位置：src/init.ts

init(modules, domApi)，返回 patch() 函数（高阶函数），init() 在返回 patch() 之前，首先收集了所有模块中的钩子函数存储到 cbs 对象中

```typescript
const hooks: Array<keyof Module> = ['create', 'update', 'remove', 'destroy', 'pre', 'post']

export function init (modules: Array<Partial<Module>>, domApi?: DOMAPI) {
  let i: number
  let j: number
  const cbs: ModuleHooks = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: []
  }
	// 初始化 api htmlDomApi是通过js创建的dom对象
  const api: DOMAPI = domApi !== undefined ? domApi : htmlDomApi
	// 把传入的所有模块的钩子方法，统一存储到 cbs 对象中 // 最终构建的 cbs 对象的形式 cbs = [ create: [fn1, fn2], update: [], ... ]
  for (i = 0; i < hooks.length; ++i) {
    // cbs['create'] = []
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      // const hook = modules[0]['create']
      const hook = modules[j][hooks[i]]
      if (hook !== undefined) {
        (cbs[hooks[i]] as any[]).push(hook)
      }
    }
  }
  
  ....
  
  // 传入新旧 VNode，对比差异，把差异渲染到 DOM，返回新的 VNode，作为下一次 patch() 的 oldVnode
  return function patch (oldVnode: VNode | Element, vnode: VNode): VNode {}
}
```

###### patch

​	patch(oldVnode, newVnode)，patch翻译为打补丁，传入新旧 VNode对比差异，把差异渲染到真实 DOM，最后返回新的 VNode作为下一次作为下一次 patch() 的 oldVnode。

- 执行过程:
   - 首先执行**模块**中的**钩子**函数 pre
   - 对比新旧 VNode 是否相同节点(节点的 key 和 sel 相同)
   - 如果不是相同节点，删除之前的内容，重新渲染
   - 如果是相同节点，再判断新的 VNode 是否有 text，如果有并且和 oldVnode 的 text 不同，直接更新文本内容
   - 如果新的 VNode 有子节点 children，判断子节点是否有变化，判断子节点的过程使用的就是 diff 算法，diff 过程只进行**同层级**比较
- 为什么使用patch高阶函数？
   - 因为 patch() 函数再外部会调用多次，每次调用依赖一些参数，比如：modules/domApi/cbs
   - 通过高阶函数让 init() 内部形成闭包，返回的 patch() 可以访问到 modules/domApi/cbs，而不需要重新创建

```typescript
const emptyNode = vnode('', {}, [], undefined, undefined)

function sameVnode (vnode1: VNode, vnode2: VNode): boolean {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel
}

function isVnode (vnode: any): vnode is VNode {
  return vnode.sel !== undefined
}

patch (oldVnode: VNode | Element, vnode: VNode): VNode {
    // 保存新插入节点的队列，为了触发钩子函数
    let i: number, elm: Node, parent: Node
    const insertedVnodeQueue: VNodeQueue = []
    // 执行模块的 pre 钩子函数
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]()

    // 如果 oldVnode 不是 VNode，创建 VNode 并设置 elm
    if (!isVnode(oldVnode)) {
      // 把 DOM 元素转换成空的 VNode
      oldVnode = emptyNodeAt(oldVnode)
    }

    // 如果新旧节点是相同节点(key 和 sel 相同)
    if (sameVnode(oldVnode, vnode)) {
      // 找节点的差异并更新 DOM
      patchVnode(oldVnode, vnode, insertedVnodeQueue)
    } else {
      // 如果新旧节点不同，vnode 创建对应的 DOM
      // 获取当前的 DOM 元素
      elm = oldVnode.elm!
      parent = api.parentNode(elm) as Node
			// 触发 init/create 钩子函数,创建 DOM
      createElm(vnode, insertedVnodeQueue)

      if (parent !== null) {
        // 如果父节点不为空，把 vnode 对应的 DOM 插入到文档中
        api.insertBefore(parent, vnode.elm!, api.nextSibling(elm))
        // 移除老节点
        removeVnodes(parent, [oldVnode], 0, 0)
      }
    }
		// 执行用户设置的 insert 钩子函数
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data!.hook!.insert!(insertedVnodeQueue[i])
    }
    // 执行模块的 post 钩子函数
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]()
    // 返回 vnode
    return vnode
}
```

###### createElm

createElm(vnode, insertedVnodeQueue)，返回创建的 DOM 元素

- 首先触发**用户**设置的 **init** **钩子**函数：如果选择器是!，创建评论节点；如果选择器为空，创建文本节点；如果选择器不为空，解析选择器，设置标签的 id 和 class 属性
- 执行**模块**的 **create** **钩子**函数：如果 vnode 有 children，创建子 vnode 对应的 DOM，追加到 DOM 树；如果 vnode 的 text 值是 string/number，创建文本节点并追击到 DOM 树
- 执行**用户**设置的 **create** **钩子**函数：如果有用户设置的 insert 钩子函数，把 vnode 添加到队列中

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cccaef226d346ca9928497abff27090~tplv-k3u1fbpfcp-watermark.image)

```typescript
// 是否未定义
function isUndef (s: any): boolean {
  return s === undefined
}

// 是否有定义
function isDef<A> (s: A): s is NonUndefined<A> {
  return s !== undefined
}

function createElm (vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {
    let i: any
    let data = vnode.data
    // 1. 执行用户设置的 init 钩子函数
    if (data !== undefined) {
      const init = data.hook?.init
      if (isDef(init)) {
        init(vnode)
        // init是用户传入的，可能会修改vnode.data
        data = vnode.data
      }
    }
  	// 2. 把vnode转换成真实DOM对象（没有渲染到页面）
    const children = vnode.children
    const sel = vnode.sel
    if (sel === '!') {
      // 如果选择器是!，创建注释节点
      if (isUndef(vnode.text)) {
        vnode.text = ''
      }
      vnode.elm = api.createComment(vnode.text!)
    } else if (sel !== undefined) {
      // 如果选择器不为空，创建Dom元素，解析选择器
      // Parse selector
      const hashIdx = sel.indexOf('#')
      const dotIdx = sel.indexOf('.', hashIdx)
      const hash = hashIdx > 0 ? hashIdx : sel.length
      const dot = dotIdx > 0 ? dotIdx : sel.length
      const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel
      const elm = vnode.elm = isDef(data) && isDef(i = data.ns)
        ? api.createElementNS(i, tag)
        : api.createElement(tag)
      if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot))
      if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '))
      // 执行模块的 create 钩子函数
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode)
      // 如果 vnode 中有子节点，创建子 vnode 对应的 DOM 元素并追加到 DOM 树上
      if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
          const ch = children[i]
          if (ch != null) {
            api.appendChild(elm, createElm(ch as VNode, insertedVnodeQueue))
          }
        }
      } else if (is.primitive(vnode.text)) {
        // 如果 vnode 的 text 值是 string/number，创建文本节点并追加到 DOM 树
        api.appendChild(elm, api.createTextNode(vnode.text))
      }
      const hook = vnode.data!.hook
      if (isDef(hook)) {
        // 执行用户传入的钩子 create  hook.create?如果有值再调用后面的方法
        hook.create?.(emptyNode, vnode)
        if (hook.insert) {
          // 把 vnode 添加到队列中，为后续执行 insert 钩子做准备
          insertedVnodeQueue.push(vnode)
        }
      }
    } else {
      // 如果选择器为空，创建文本节点，vnode.text!确定一定有值
      vnode.elm = api.createTextNode(vnode.text!)
    }
  // 返回新创建的 DOM
    return vnode.elm
  }
```
###### removeNodes

```typescript
function removeVnodes (parentElm: Node,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number): void {
    for (; startIdx <= endIdx; ++startIdx) {
      let listeners: number
      let rm: () => void
      const ch = vnodes[startIdx]
      if (ch != null) {
        // 如果是元素节点
        if (isDef(ch.sel)) {
          // 执行 destroy 钩子函数（会执行所有子节点的destroy钩子函数）
          invokeDestroyHook(ch)
          listeners = cbs.remove.length + 1
          // 创建删除的回调函数
          rm = createRmCb(ch.elm!, listeners)
          for (let i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm)
          // 执行用户设置的remove钩子函数
          const removeHook = ch?.data?.hook?.remove
          if (isDef(removeHook)) {
            removeHook(ch, rm)
          } else {
            // 如果没有用户钩子函数，直接调用删除元素的方法
            rm()
          }
        } else {
          // 如果是文本节点，直接调用删除元素的方法
          api.removeChild(parentElm, ch.elm!)
        }
      }
    }
  }
// 触发destroy钩子函数
function invokeDestroyHook (vnode: VNode) {
  const data = vnode.data
  if (data !== undefined) {
    // 执行用户设置的钩子函数
    data?.hook?.destroy?.(vnode)
    // 调用模块的destroy钩子函数
    for (let i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
    // 执行子节点的destroy钩子函数
    if (vnode.children !== undefined) {
      for (let j = 0; j < vnode.children.length; ++j) {
        const child = vnode.children[j]
        if (child != null && typeof child !== 'string') {
          invokeDestroyHook(child)
        }
      }
    }
  }
}
// 创建删除的回调函数
function createRmCb (childElm: Node, listeners: number) {
  return function rmCb () {
    // 防止removeChild多次调用
    if (--listeners === 0) {
      const parent = api.parentNode(childElm) as Node
      api.removeChild(parent, childElm)
    }
  }
}
```

###### patchVNode

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44eb60591a6d453cb5b8a98f2ab420f9~tplv-k3u1fbpfcp-watermark.image)

```typescript
// 更新节点
function patchVnode (oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNodeQueue) {
  const hook = vnode.data?.hook
  // 首先执行用户设置的prepatch钩子函数
  hook?.prepatch?.(oldVnode, vnode)
  const elm = vnode.elm = oldVnode.elm!
        const oldCh = oldVnode.children as VNode[]
        const ch = vnode.children as VNode[]
        // 如果新老节点相同，不需要对比
        if (oldVnode === vnode) return
  // 如果新节点有值
  if (vnode.data !== undefined) {
    // 执行模块的update钩子函数  update和prepatch的区别是：prepatch不需要判断新老节点的差异
    for (let i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    // 执行用户设置的update钩子函数
    vnode.data.hook?.update?.(oldVnode, vnode)
  }
  // 如果新节点的文本text未定义
  if (isUndef(vnode.text)) {
    // 新老节点是否都有子节点
    if (isDef(oldCh) && isDef(ch)) {
      // 使用diff算法对比子节点，更新子节点
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue)
    } else if (isDef(ch)) {  // 新节点有子节点，老节点没有
      // 老节点有文本内容，清空dom元素的内容
      if (isDef(oldVnode.text)) api.setTextContent(elm, '')
      // 批量添加子节点
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      // 新爸爸有儿子，旧爸爸没儿子，把旧爸爸的儿子赶出家门
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      // 旧爸爸有资产，清空资产和银行卡
      api.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    // 如果新旧爸爸的资产金额不一致
    // 旧爸爸有儿子，将旧爸爸的儿子赶出家门
    if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    }
    // 将旧爸爸的银行卡里的金额改为新爸爸的资产金额
    api.setTextContent(elm, vnode.text!)
  }
  // 最后执行用户设置的 postpatch 钩子函数
  hook?.postpatch?.(oldVnode, vnode)
}
// 添加节点
function addVnodes (
	parentElm: Node,
 	before: Node | null, // 参考节点
 	vnodes: VNode[],
 	startIdx: number,
 	endIdx: number,
 	insertedVnodeQueue: VNodeQueue // 节点队列
) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]
      if (ch != null) {
        // 将节点转换为Dom之后，插入参考节点之前
        api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before)
      }
  }
}
```

###### updateChildren（diff算法核心）

diffff 算法的核心，对比新旧节点的 children，更新 DOM。对比两棵树的差异，一般是取第一棵树的每一个节点依次和第二棵树的每一个节点比较，但是这样的时间复杂度为 O(n^3)，在DOM 操作的时候我们很少很少会把一个父节点移动/更新到某一个子节点，因此只需要找**同级别**的子**节点**依次**比较**，然后再找下一级别的节点比较，这样算法的时间复杂度为 O(n)。

第一步：新/旧 开始/结束节点为空：结束节点为空，对应的索引-1；开始节点为空，对应的索引+1

第二步：新/旧 开始/结束节点相同

  - 新**开始**节点 = 旧**开始**节点：对比差异更新DOM，对应的新旧节点索引+1
  - 新**结束**节点 = 旧**结束**节点：对比差异更新DOM，对应的新旧节点索引-1
  - 新结束节点 = 旧开始节点：对比差异更新DOM，将**旧开始**节点移动到**旧结束**节点之后，开始节点索引+1，结束节点索引-1
  - 新开始节点 = 旧结束节点：对比差异更新DOM，将**旧结束**节点移动到**旧开始**节点之前，开始节点索引+1，结束节点索引-1

第三步：新/旧开始/结束节点不同：使用新开始节点的key在旧节点数组中找相同节点

- 有相同节点，将新节点和新增节点队列移动到旧开始节点之前
- 没有相同节点：如果 相同key的旧节点选择器和新节点 不同，创建新的开始节点对应的DOM元素，插入到DOM树中；反之在更新节点之后，将相同key的旧节点对应的DOM元素，移动到新节点之前
- 最后重新给新开始节点赋值，指向下一个新节点

第四步：循环结束后，剩余节点处理：旧节点/新节点数组遍历结束代表循环结束

- 旧节点数组遍历结束 = 新节点有剩余，将新剩余接待追加
- 新节点数组遍历结束 = 旧节点有剩余，批量删除旧剩余节点

```typescript
/**
 * 更新子节点
 * @param parentElm 父节点
 * @param oldCh 旧子节点数组
 * @param newCh 新子节点数组
 * @param insertedVnodeQueue 新增节点队列
 */
function updateChildren (parentElm: Node,
  oldCh: VNode[],
  newCh: VNode[],
  insertedVnodeQueue: VNodeQueue) {
  // 新/旧开始/结束节点
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]

  let oldKeyToIdx: KeyToIndexMap | undefined
  let idxInOld: number
  let elmToMove: VNode
  let before: any

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 1.索引变化后，可能会把节点设置为空，索引为空的节点，移动索引
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx] // Vnode might have been moved left
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx]
    // 2. 比较开始和结束节点四情况
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
      // 将旧开始节点移动到旧的结束节点之后
      api.insertBefore(parentElm, oldStartVnode.elm!, api.nextSibling(oldEndVnode.elm!))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
      // 将旧结束节点移动到旧的开始节点之前
      api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    // 3. 开始节点和结束节点都不相同
    } else {
      // 使用新开始节点的key在旧节点数组中找相同节点
      // 先设置记录key和index的对象
      if (oldKeyToIdx === undefined) {
        // { 旧节点的key：旧节点的索引 }
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      }
      idxInOld = oldKeyToIdx[newStartVnode.key as string]
      // 1. 如果从旧节点中 没有 找到和新节点相同的 key 的索引
      if (isUndef(idxInOld)) { // New element
        // 将新节点和新增节点队列移动到旧开始节点之前
        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm!)
      } else {
  			// 使用key可以提高遍历次数，减少DOM渲染的过程
        // 2. 如果从旧节点中 找到了 和新节点相同的 key 的索引，遍历旧节点的这个key
        elmToMove = oldCh[idxInOld]
        if (elmToMove.sel !== newStartVnode.sel) {
          // 如果 相同key的旧节点选择器和新节点 不同，创建新的开始节点对应的DOM元素，插入到DOM树中
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm!)
        } else {
          // 如果 相同key的旧节点选择器和新节点 相同，更新节点之后，将相同key的旧节点对应的DOM元素，移动到新节点之前
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
          oldCh[idxInOld] = undefined as any
          api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!)
        }
      }
      // 重新给newStartVnode赋值，指向下一个新节点
      newStartVnode = newCh[++newStartIdx]
    }
  }
  // 循环结束，旧节点/新节点数组遍历结束
  if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
    if (oldStartIdx > oldEndIdx) {
      // 如果旧节点数组遍历结束 = 新节点有剩余，将新剩余接待追加
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else {
      // 如果新节点数组遍历结束 = 旧节点有剩余，批量删除旧剩余节点
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }
}

function createKeyToOldIdx (children: VNode[], beginIdx: number, endIdx: number): KeyToIndexMap {
  const map: KeyToIndexMap = {}
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i]?.key
    if (key !== undefined) {
      map[key] = i
    }
  }
  return map
}
```

##### Moudles

Snabbdom 为了保证核心库的精简，把处理元素的属性/事件/样式等工作，放置到模块中。模块可以按照需要引入，模块实现的核心是基于 Hooks

###### Hooks

预定义的钩子函数的名称

src/hokks.ts

```typescript
import { VNode } from './vnode'

export type PreHook = () => any
export type InitHook = (vNode: VNode) => any
export type CreateHook = (emptyVNode: VNode, vNode: VNode) => any
export type InsertHook = (vNode: VNode) => any
export type PrePatchHook = (oldVNode: VNode, vNode: VNode) => any
export type UpdateHook = (oldVNode: VNode, vNode: VNode) => any
export type PostPatchHook = (oldVNode: VNode, vNode: VNode) => any
export type DestroyHook = (vNode: VNode) => any
export type RemoveHook = (vNode: VNode, removeCallback: () => void) => any
export type PostHook = () => any

export interface Hooks {
  // patch 函数开始执行
  pre?: PreHook
  // createElm 开始之前
  init?: InitHook
  // createElm 函数末尾调用
  create?: CreateHook
  // patch 函数末尾执行
  insert?: InsertHook
  // patchVnode 开头，对比两个 Vnode 差异之前
  prepatch?: PrePatchHook
  // patchVnode 开头，对比两个 Vnode 差异过程中
  update?: UpdateHook
  // patchVnode 末尾调用，对比两个 Vnode 差异结束时
  postpatch?: PostPatchHook
  // removeVnodes 删除元素之前触发invokeDestroyHook中调用，同时子节点的destroy也被触发
  destroy?: DestroyHook
  // removeVnodes 元素呗删除时触发
  remove?: RemoveHook
  // patch 全部执行完毕触发
  post?: PostHook
}
```

**模块文件的定义**

Snabbdom 提供的所有模块在src/modules 文件夹下，主要模块有：

1. attributes.ts：使用 setAttribute/removeAttribute 操作属性；能够处理 boolean 类型的属性
2. class.ts：切换类样式
3. dataset.ts：操作元素的 data-* 属性
4. eventlisteners.ts：注册和移除事件
5. module.ts：定义模块遵守的钩子函数
6. props.ts：和 attributes.ts 类似，但是是使用 elm[attrName] = value 的方式操作属性
7. style.ts：操作行内样式，可以使动画更平滑
8. hero.ts：自定义的模块，examples/hero 示例中使用

###### attributes

```typescript
import { VNode, VNodeData } from '../vnode'
import { Module } from './module'

export type Attrs = Record<string, string | number | boolean>

const xlinkNS = 'http://www.w3.org/1999/xlink'
const xmlNS = 'http://www.w3.org/XML/1998/namespace'
const colonChar = 58
const xChar = 120

// 更新节点属性,如果节点属性值是 true 设置空置,如果节点属性值是 false 移除属性
function updateAttrs (oldVnode: VNode, vnode: VNode): void {
  var key: string
  var elm: Element = vnode.elm as Element
  var oldAttrs = (oldVnode.data as VNodeData).attrs
  var attrs = (vnode.data as VNodeData).attrs

  // 新老节点没有 attrs 属性，返回
  if (!oldAttrs && !attrs) return
  // 新老节点的 attrs 属性相同，返回
  if (oldAttrs === attrs) return
  oldAttrs = oldAttrs || {}
  attrs = attrs || {}

  // update modified attributes, add new attributes
  // 遍历新节点的属性
  for (key in attrs) {
    const cur = attrs[key]
    const old = oldAttrs[key]
    // 如果新老节点的属性值不同
    if (old !== cur) {
      // 布尔类型值的处理
      if (cur === true) {
        elm.setAttribute(key, '')
      } else if (cur === false) {
        elm.removeAttribute(key)
      } else {
        // 非布尔类型
        // 首字母是否为x（类似xmlns这样有命名空间的属性） <svg xmlns="http://www.w3.org/2000/svg">
        if (key.charCodeAt(0) !== xChar) {
          elm.setAttribute(key, cur as any)
        } else if (key.charCodeAt(3) === colonChar) {
          // 首字母是否为 >
          // Assume xml namespace
          elm.setAttributeNS(xmlNS, key, cur as any)
        } else if (key.charCodeAt(5) === colonChar) {
          // 首字母是否为 xlink  <svg xmlns:xlink="http://www.w3.org/1999/xlink">
          // Assume xlink namespace
          elm.setAttributeNS(xlinkNS, key, cur as any)
        } else {
          elm.setAttribute(key, cur as any)
        }
      }
    }
  }
  // remove removed attributes
  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
  // the other option is to remove all attributes with value == undefined
  // 如果旧节点的属性在新节点中不存在，移除
  for (key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key)
    }
  }
}

// 模块到出成员
export const attributesModule: Module = { create: updateAttrs, update: updateAttrs }
```