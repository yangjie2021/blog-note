## 1. 配置 React 源码本地调试环境

1. 使用 create-react-app 脚手架创建项目

   `npx create-react-app react-test`

2. 弹射 create-react-app 脚手架内部配置

   `npm run eject`

3. 克隆 react 官方源码 (在项目的根目录下进行克隆)

   `git clone --branch v16.13.1 --depth=1 https://github.com/facebook/react.git src/react`

4. 链接本地源码

   ```javascript
   // 文件位置: react-test/config/webpack.config.js
   resolve: {
     alias: {
       "react-native": "react-native-web",
       "react": path.resolve(__dirname, "../src/react/packages/react"),
       "react-dom": path.resolve(__dirname, "../src/react/packages/react-dom"),
       "shared": path.resolve(__dirname, "../src/react/packages/shared"),
       "react-reconciler": path.resolve(__dirname, "../src/react/packages/react-reconciler"),
       "legacy-events": path.resolve(__dirname, "../src/react/packages/legacy-events")
     }
   }
   ```

5. 修改环境变量

   ```javascript
   // 文件位置: react-test/config/env.js
   const stringified = {
   	"process.env": Object.keys(raw).reduce((env, key) => {
      	env[key] = JSON.stringify(raw[key])
         return env
      }, {}),
      __DEV__: true,
      SharedArrayBuffer: true,
      spyOnDev: true,
      spyOnDevAndProd: true,
      spyOnProd: true,
      __PROFILE__: true,
      __UMD__: true,
      __EXPERIMENTAL__: true,
      __VARIANT__: true,
      gate: true,
      trustedTypes: true
    }
   ```

6. 告诉 babel 在转换代码时忽略类型检查

   `npm install @babel/plugin-transform-flow-strip-types -D`

   ```javascript
   // 文件位置: react-test/config/webpack.config.js [babel-loader]
   plugins: [
     require.resolve("@babel/plugin-transform-flow-strip-types"),
   ]
   ```

7. 导出 HostConfig

   ```javascript
   // 文件位置: /react/packages/react-reconciler/src/ReactFiberHostConfig.js
   + export * from './forks/ReactFiberHostConfig.dom';
   - invariant(false, 'This module must be shimmed by a specific renderer.');
   ```

8. 修改 ReactSharedInternals.js 文件

   ```javascript
   // 文件位置: /react/packages/shared/ReactSharedInternals.js
   - import * as React from 'react';
   - const ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
   + import ReactSharedInternals from '../react/src/ReactSharedInternals';
   ```

9. 关闭 eslint 扩展

   ```javascript
   // 文件位置: react/.eslingrc.js [module.exports]
   // 删除 extends
   extends: [
     'fbjs',
     'prettier'
   ]
   
   ```

10. 禁止 invariant 报错

    ```javascript
    // 文件位置: /react/packages/shared/invariant.js
    export default function invariant(condition, format, a, b, c, d, e, f) {
      if (condition) return;
      throw new Error(
        'Internal React error: invariant() is meant to be replaced at compile ' +
          'time. There is no runtime version.',
      );
    }
    ```

11. eslint 配置

    在 react 源码文件夹中新建 .eslintrc.json 并添加如下配置

    ```react
    {
      "extends": "react-app",
      "globals": {
        "SharedArrayBuffer": true,
        "spyOnDev": true,
        "spyOnDevAndProd": true,
        "spyOnProd": true,
        "__PROFILE__": true,
        "__UMD__": true,
        "__EXPERIMENTAL__": true,
        "__VARIANT__": true,
        "gate": true,
        "trustedTypes": true
      }
    }
    ```

12. 修改 react react-dom 引入方式

    ```javascript
    import * as React from "react"
    import * as ReactDOM from "react-dom"
    ```

13. 解决 vsCode 中 flow 报错

     ```javascript
    "javascript.validate.enable": false
     ```

14. 可选项配置

    如果你的 vscode 编辑器安装了 prettier 插件并且在保存 react 源码文件时右下角出现如下错误，按照如下步骤解决

    <img src="./images/1.png" width="60%" align="left"/>

    1. 全局安装 prettier

       `npm i prettier -g`

    2. 配置 prettier path

       Settings > Extensions > Prettier > Prettier path

       <img src="./images/2.png" width="80%" align="left"/>

15. \_\_DEV\_\_ 报错

    删除 node_modules 文件夹，执行 npm install

## 2. 创建 React 元素

JSX 被 Babel 编译为 React.createElement 方法的调用，createElement 方法在调用后返回的就是 ReactElement，就是 virtualDOM。

### 2.1 createElement

`文件位置：packages/react/src/ReactElement.js`

```react
/**
 * 创建 React Element
 * type      元素类型
 * config    配置属性
 * children  子元素
 * 1. 分离 props 属性和特殊属性
 * 2. 将子元素挂载到 props.children 中
 * 3. 为 props 属性赋默认值 (defaultProps)
 * 4. 创建并返回 ReactElement
 */
export function createElement(type, config, children) {
  /**
   * propName -> 属性名称
   * 用于后面的 for 循环
   */
  let propName;

  /**
   * 存储 React Element 中的普通元素属性 即不包含 key ref self source
   */
  const props = {};

  /**
   * 待提取属性
   * React 内部为了实现某些功能而存在的属性
   */
  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  // 如果 config 不为 null
  if (config != null) {
    // 如果 config 对象中有合法的 ref 属性
    if (hasValidRef(config)) {
      // 将 config.ref 属性提取到 ref 变量中
      ref = config.ref;
      // 在开发环境中
      if (__DEV__) {
        // 如果 ref 属性的值被设置成了字符串形式就报一个提示
        // 说明此用法在将来的版本中会被删除
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }
    // 如果在 config 对象中拥有合法的 key 属性
    if (hasValidKey(config)) {
      // 将 config.key 属性中的值提取到 key 变量中
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 遍历 config 对象
    for (propName in config) {
      // 如果当前遍历到的属性是对象自身属性
      // 并且在 RESERVED_PROPS 对象中不存在该属性
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        // 将满足条件的属性添加到 props 对象中 (普通属性)
        props[propName] = config[propName];
      }
    }
  }

  /**
   * 将第三个及之后的参数挂载到 props.children 属性中
   * 如果子元素是多个 props.children 是数组
   * 如果子元素是一个 props.children 是对象
   */

  // 由于从第三个参数开始及以后都表示子元素
  // 所以减去前两个参数的结果就是子元素的数量
  const childrenLength = arguments.length - 2;
  // 如果子元素的数量是 1
  if (childrenLength === 1) {
    // 直接将子元素挂载到到 props.children 属性上
    // 此时 children 是对象类型
    props.children = children;
    // 如果子元素的数量大于 1
  } else if (childrenLength > 1) {
    // 创建数组, 数组中元素的数量等于子元素的数量
    const childArray = Array(childrenLength);
    // 开启循环 循环次匹配子元素的数量
    for (let i = 0; i < childrenLength; i++) {
      // 将子元素添加到 childArray 数组中
      // i + 2 的原因是实参集合的前两个参数不是子元素
      childArray[i] = arguments[i + 2];
    }
    // 如果是开发环境
    if (__DEV__) {
      // 如果 Object 对象中存在 freeze 方法
      if (Object.freeze) {
        // 调用 freeze 方法 冻结 childArray 数组
        // 防止 React 核心对象被修改 冻结对象提高性能
        Object.freeze(childArray);
      }
    }
    // 将子元素数组挂载到 props.children 属性中
    props.children = childArray;
  }

  /**
   * 如果当前处理是组件
   * 看组件身上是否有 defaultProps 属性
   * 这个属性中存储的是 props 对象中属性的默认值
   * 遍历 defaultProps 对象 查看对应的 props 属性的值是否为 undefined
   * 如果为undefined 就将默认值赋值给对应的 props 属性值
   */

  // 将 type 属性值视为函数 查看其中是否具有 defaultProps 属性
  if (type && type.defaultProps) {
    // 将 type 函数下的 defaultProps 属性赋值给 defaultProps 变量
    const defaultProps = type.defaultProps;
    // 遍历 defaultProps 对象中的属性 将属性名称赋值给 propName 变量
    for (propName in defaultProps) {
      // 如果 props 对象中的该属性的值为 undefined
      if (props[propName] === undefined) {
        // 将 defaultProps 对象中的对应属性的值赋值给 props 对象中的对应属性的值
        props[propName] = defaultProps[propName];
      }
    }
  }

  /**
   * 在开发环境中 如果元素的 key 属性 或者 ref 属性存在
   * 监测开发者是否在组件内部通过 props 对象获取了 key 属性或者 ref 属性
   * 如果获取了 就报错
   */

  // 如果处于开发环境
  if (__DEV__) {
    // 元素具有 key 属性或者 ref 属性
    if (key || ref) {
      // 看一下 type 属性中存储的是否是函数 如果是函数就表示当前元素是组件
      // 如果元素不是组件 就直接返回元素类型字符串
      // displayName 用于在报错过程中显示是哪一个组件报错了
      // 如果开发者显式定义了 displayName 属性 就显示开发者定义的
      // 否者就显示组件名称 如果组件也没有名称 就显示 'Unknown'
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      // 如果 key 属性存在
      if (key) {
        // 为 props 对象添加key 属性
        // 并指定当通过 props 对象获取 key 属性时报错
        defineKeyPropWarningGetter(props, displayName);
      }
      // 如果 ref 属性存在
      if (ref) {
        // 为 props 对象添加 ref 属性
        // 并指定当通过 props 对象获取 ref 属性时报错
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  // 返回 ReactElement
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    // 在 Virtual DOM 中用于识别自定义组件
    ReactCurrentOwner.current,
    props,
  );
}
```

### 2.2 ReactElement

`文件位置：packages/react/src/ReactElement.js`

```react
/**
 * 接收参数 返回 ReactElement
 */
const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    /**
     * 组件的类型, 十六进制数值或者 Symbol 值
     * React 在最终在渲染 DOM 的时候, 需要确保元素的类型是 REACT_ELEMENT_TYPE
     * 需要此属性作为判断的依据
     */
    $$typeof: REACT_ELEMENT_TYPE,

    /**
     * 元素具体的类型值 如果是元素节点 type 属性中存储的就是 div span 等等
     * 如果元素是组件 type 属性中存储的就是组件的构造函数
     */
    type: type,
    /**
     * 元素的唯一标识
     * 用作内部 vdom 比对 提升 DOM 操作性能
     */
    key: key,
    /**
     * 存储元素 DOM 对象或者组件 实例对象
     */
    ref: ref,
    /**
     * 存储向组件内部传递的数据
     */
    props: props,

    /**
     * 记录当前元素所属组件 (记录当前元素是哪个组件创建的)
     */
    _owner: owner,
  };
  // 返回 ReactElement
  return element;
};
```

### 2.3 hasValidRef

`文件位置：packages/react/src/ReactElement.js`

```react
/**
 * 查看参数对象中是否有合法的 ref 属性
 * 返回布尔值
 */
function hasValidRef(config) {
  return config.ref !== undefined;
}
```

### 2.4 hasValidKey

`文件位置：packages/react/src/ReactElement.js`

```react
/**
 * 查看参数对象中是否有合法的 key 属性
 * 返回布尔值
 */
function hasValidKey(config) {
  return config.key !== undefined;
}
```

### 2.5 isValidElement

`文件位置：packages/react/src/ReactElement.js`

```react
/**
 * 验证 object 参数是否是 ReactElement. 返回布尔值
 * 验证成功的条件:
 * object 是对象
 * object 不为null
 * object对象中的 $$typeof 属性值为 REACT_ELEMENT_TYPE
 */
export function isValidElement(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```

### 2.6 defineKeyPropWarningGetter

`文件位置：packages/react/src/ReactElement.js`

```react
/**
 *  指定当通过 props 对象获取 key 属性时报错
 *  props        组件中的 props 对象
 *  displayName  组件名称标识
 */
function defineKeyPropWarningGetter(props, displayName) {
  // 通过 props 对象获取 key 属性报错
  const warnAboutAccessingKey = function () {
    // 在开发环境中
    if (__DEV__) {
      // specialPropKeyWarningShown 控制错误只输出一次的变量
      if (!specialPropKeyWarningShown) {
        // 通过 specialPropKeyWarningShown 变量锁住判断条件
        specialPropKeyWarningShown = true;
        // 指定报错信息和组件名称
        console.error(
          '%s: `key` is not a prop. Trying to access it will result ' +
            'in `undefined` being returned. If you need to access the same ' +
            'value within the child component, you should pass it as a different ' +
            'prop. (https://reactjs.org/link/special-props)',
          displayName,
        );
      }
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  // 为 props 对象添加 key 属性
  Object.defineProperty(props, 'key', {
    // 当获取 key 属性时调用 warnAboutAccessingKey 方法进行报错
    get: warnAboutAccessingKey,
    configurable: true,
  });
}
```

### 2.7 defineRefPropWarningGetter

`文件位置：packages/react/src/ReactElement.js`

```react
/**
 *  指定当通过 props 对象获取 ref 属性时报错
 *  props        组件中的 props 对象
 *  displayName  组件名称标识
 */
function defineRefPropWarningGetter(props, displayName) {
  // 通过 props 对象获取 ref 属性报错
  const warnAboutAccessingRef = function () {
    if (__DEV__) {
      // specialPropRefWarningShown 控制错误只输出一次的变量
      if (!specialPropRefWarningShown) {
        // 通过 specialPropRefWarningShown 变量锁住判断条件
        specialPropRefWarningShown = true;
        // 指定报错信息和组件名称
        console.error(
          '%s: `ref` is not a prop. Trying to access it will result ' +
            'in `undefined` being returned. If you need to access the same ' +
            'value within the child component, you should pass it as a different ' +
            'prop. (https://reactjs.org/link/special-props)',
          displayName,
        );
      }
    }
  };

  warnAboutAccessingRef.isReactWarning = true;
  // 为 props 对象添加 key 属性
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true,
  });
}
```

## 3. React 架构

React 16 版本的架构可以分为三层：调度层、协调层、渲染层。

- Scheduler (调度层)：调度任务的优先级，高优任务优先进入协调器
  - 减少diff时间：virtualDOM 的比对：循环加递归 改为 循环模拟递归
  - 空间时执行任务：使用requestIdleCallback API，让比对在空闲时间完成
  - 设置任务优先级：Scheduler调度库，高优先级任务先执行，低优先级任务后执行
- Reconciler (协调层)：构建 Fiber 数据结构，比对 Fiber 对象找出差异, 记录 Fiber 对象要进行的 DOM 操作
- Renderer (渲染层)：根据协调器标记的差异，同步将发生变化的部分渲染到页面上（调度和协调任务可以被打断，渲染任务不可以）

### 3.1 Scheduler 调度层

在 React 15 的版本中，采用了循环加递归的方式进行了 virtualDOM 的比对，由于递归使用 JavaScript 自身的执行栈，一旦开始就无法停止，直到任务执行完成。如果 VirtualDOM 树的层级比较深，virtualDOM 的比对就会长期占用 JavaScript 主线程，由于 JavaScript 又是单线程的无法同时执行其他任务，所以在比对的过程中无法响应用户操作，无法即时执行元素动画，造成了页面卡顿的现象。

在 React 16 的版本中，放弃了 JavaScript 递归的方式进行 virtualDOM 的比对，而是采用循环模拟递归。而且比对的过程是利用浏览器的空闲时间完成的，不会长期占用主线程，这就解决了 virtualDOM 比对造成页面卡顿的问题。

在 window 对象中提供了 requestIdleCallback API，它可以利用浏览器的空闲时间执行任务，但是它自身也存在一些问题，比如说并不是所有的浏览器都支持它，而且它的触发频率也不是很稳定，所以 React 最终放弃了 requestIdleCallback 的使用。

在 React 中，官方实现了自己的任务调度库，这个库就叫做 Scheduler。它也可以实现在浏览器空闲时执行任务，而且还可以设置任务的优先级，高优先级任务先执行，低优先级任务后执行。

Scheduler 存储在 `packages/scheduler` 文件夹中。

### 3.2 Reconciler 协调层

在 React 15 的版本中，协调器和渲染器交替执行，即找到了差异就直接更新差异。在 React 16 的版本中，这种情况发生了变化，协调器和渲染器不再交替执行。协调器负责找出差异，在所有差异找出之后，统一交给渲染器进行 DOM 的更新。也就是说协调器的主要任务就是找出差异部分，并为差异打上标记。

### 3.3 Renderer 渲染层

渲染器根据协调器为 Fiber 节点打的标记，同步执行对应的DOM操作。

既然比对的过程从递归变成了可以中断的循环，那么 React 是如何解决中断更新时 DOM 渲染不完全的问题呢？

其实根本就不存在这个问题，因为在整个过程中，调度器和协调器的工作是在内存中完成的是可以被打断的，渲染器的工作被设定成不可以被打断，所以不存在DOM 渲染不完全的问题。

## 4. 数据结构

### 4.1 Fiber

DOM 实例相关

```react
type Fiber = {
  /************************  DOM 实例相关  *****************************/
  
  // 标记不同的组件类型, 值详见 WorkTag
  tag: WorkTag,

  // 组件类型 div、span、组件构造函数
  type: any,

  // 实例对象, 如类组件的实例、原生 dom 实例, 而 function 组件没有实例, 因此该属性是空
  stateNode: any,
 
	/************************  构建 Fiber 树相关  ***************************/
  
  // 指向自己的父级 Fiber 对象
  return: Fiber | null,

  // 指向自己的第一个子级 Fiber 对象
  child: Fiber | null,
  
  // 指向自己的下一个兄弟 Fiber 对象
  sibling: Fiber | null,
  
  // 在 Fiber 树更新的过程中，每个 Fiber 都会有一个跟其对应的 Fiber
  // 我们称他为 current <==> workInProgress
  // 在渲染完成之后他们会交换位置
  // alternate 指向当前 Fiber 在 workInProgress 树中的对应 Fiber
	alternate: Fiber | null,
		
  /************************  状态数据相关  ********************************/
  
  // 即将更新的 props
  pendingProps: any, 
  // 旧的 props
  memoizedProps: any,
  // 旧的 state
  memoizedState: any,
		
  /************************  副作用相关 ******************************/

  // 该 Fiber 对应的组件产生的状态更新会存放在这个队列里面 
  updateQueue: UpdateQueue<any> | null,
  
  // 用来记录当前 Fiber 要执行的 DOM 操作
  effectTag: SideEffectTag,

  // 存储要执行的 DOM 操作
  firstEffect: Fiber | null,
  
  // 单链表用来快速查找下一个 side effect
  nextEffect: Fiber | null,
  
  // 存储 DOM 操作完后的副租用 比如调用生命周期函数或者钩子函数的调用
  lastEffect: Fiber | null,

  // 任务的过期时间
  expirationTime: ExpirationTime,
  
	// 当前组件及子组件处于何种渲染模式 详见 TypeOfMode
  mode: TypeOfMode,
};
```

<img src="./images/6.png"/>

### 4.2 WorkTag

`文件位置：packages/shared/ReactWorkTags.js`

```react
type WorkTag =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22;

export const FunctionComponent = 0;
export const ClassComponent = 1;
export const IndeterminateComponent = 2;
export const HostRoot = 3;
export const HostPortal = 4;
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
export const DehydratedFragment = 18;
export const SuspenseListComponent = 19;
export const FundamentalComponent = 20;
export const ScopeComponent = 21;
export const Block = 22;
```

### 4.3 TypeOfMode

`文件位置: packages/react-reconciler/src/ReactTypeOfMode.js`

```react
export type TypeOfMode = number;

// 0 同步渲染模式
export const NoMode = 0b0000;
// 1 严格模式
export const StrictMode = 0b0001;
// 10 异步渲染过渡模式
export const BlockingMode = 0b0010;
// 100 异步渲染模式
export const ConcurrentMode = 0b0100;
// 1000 性能测试模式
export const ProfileMode = 0b1000;
```

### 4.3 SideEffectTag

`文件位置：packages/shared/ReactSideEffectTags.js`

```react
export type SideEffectTag = number;

// Don't change these two values. They're used by React Dev Tools.
export const NoEffect = /*              */ 0b0000000000000; // 0
export const PerformedWork = /*         */ 0b0000000000001; // 1

// You can change the rest (and add more).
export const Placement = /*             */ 0b0000000000010; // 2
export const Update = /*                */ 0b0000000000100; // 4
export const PlacementAndUpdate = /*    */ 0b0000000000110; // 6
export const Deletion = /*              */ 0b0000000001000; // 8
export const ContentReset = /*          */ 0b0000000010000; // 16
export const Callback = /*              */ 0b0000000100000; // 32
export const DidCapture = /*            */ 0b0000001000000; // 64
export const Ref = /*                   */ 0b0000010000000; // 128
export const Snapshot = /*              */ 0b0000100000000; // 256
export const Passive = /*               */ 0b0001000000000; // 512
export const Hydrating = /*             */ 0b0010000000000; // 1024
export const HydratingAndUpdate = /*    */ 0b0010000000100; // 1028

// Passive & Update & Callback & Ref & Snapshot
export const LifecycleEffectMask = /*   */ 0b0001110100100; // 932

// Union of all host effects
export const HostEffectMask = /*        */ 0b0011111111111; // 2047

export const Incomplete = /*            */ 0b0100000000000; // 2048
export const ShouldCapture = /*         */ 0b1000000000000; // 4096
```

### 4.4 Update

```react
let update: Update<*> = {
  expirationTime,
  suspenseConfig,

  tag: UpdateState,
  payload: null,
  callback: null,

  next: (null: any),
};
```

### 4.5 UpdateQueue

```react
const queue: <State> = {
  // 上一次更新之后的 state, 作为下一次更新的基础
  baseState: fiber.memoizedState,
  baseQueue: null,
  shared: {
    pending: null,
  },
  effects: null,
}
fiber.updateQueue = queue;
```

### 4.6 RootTag

`文件位置：packages/shared/ReactRootTags.js`

```react
export type RootTag = 0 | 1 | 2;

// ReactDOM.render
export const LegacyRoot = 0;
// ReactDOM.createBlockingRoot
export const BlockingRoot = 1;
// ReactDOM.createRoot
export const ConcurrentRoot = 2;
```

### 4.7 双缓存技术

在 React 中，DOM 的更新采用了双缓存技术，双缓存技术致力于更快速的 DOM 更新。

什么是双缓存？举个例子，使用 canvas 绘制动画时，在绘制每一帧前都会清除上一帧的画面，清除上一帧需要花费时间，如果当前帧画面计算量又比较大，又需要花费比较长的时间，这就导致上一帧清除到下一帧显示中间会有较长的间隙，就会出现白屏。

为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，这样的话在帧画面替换的过程中就会节约非常多的时间，就不会出现白屏问题。这种**在内存中构建并直接替换**的技术叫做双缓存。

React 使用双缓存技术完成 Fiber 树的构建与替换，实现DOM对象的快速更新。

在 React 中最多会同时存在两棵 Fiber 树，当前在屏幕中显示的内容对应的 Fiber 树叫做 current Fiber 树，当发生更新时，React 会在内存中重新构建一颗新的 Fiber 树，这颗正在构建的 Fiber 树叫做 workInProgress Fiber 树。在双缓存技术中，workInProgress Fiber 树就是即将要显示在页面中的 Fiber 树，当这颗 Fiber 树构建完成后，React 会使用它直接替换 current Fiber 树达到快速更新 DOM 的目的，因为 workInProgress Fiber 树是在内存中构建的所以构建它的速度是非常快的。

一旦 workInProgress Fiber 树在屏幕上呈现，它就会变成 current Fiber 树。

在 current Fiber 节点对象中有一个 alternate 属性指向对应的 workInProgress Fiber 节点对象，在 workInProgress Fiber 节点中有一个 alternate 属性也指向对应的 current Fiber 节点对象。

<img src="./images/3.png" width="40%"/>

<img src="./images/4.png" width="40%"/>

### 4.8 区分 fiberRoot 与 rootFiber

fiberRoot 表示 Fiber 数据结构对象，是 Fiber 数据结构中的最外层对象

rootFiber 表示组件挂载点对应的 Fiber 对象，比如 React 应用中默认的组件挂载点就是 id 为 root 的 div

fiberRoot 包含 rootFiber，在 fiberRoot 对象中有一个 current 属性，存储 rootFiber

rootFiber 指向 fiberRoot，在 rootFiber 对象中有一个 stateNode 属性，指向 fiberRoot

在 React 应用中 FiberRoot 只有一个，而 rootFiber 可以有多个，因为 render 方法是可以调用多次的

fiberRoot 会记录应用的更新信息，比如协调器在完成工作后，会将工作成果存储在 fiberRoot 中。

<img src="./images/7.png" width="90%" align="left"/>

## 5. 初始化渲染

要将 React 元素渲染到页面中，分为两个阶段，render 阶段和 commit 阶段。

render 阶段是协调层负责的阶段，为每一个react元素构建fiber对象，在构建过程中创建对应的dom对象，添加**effectTag**属性，用来标记当前 Fiber 节点要进行的 DOM 操作。这个新创建的fiber对象就是 workInProgress Fiber树。

commit 阶段负责根据 Fiber 节点标记 ( effectTag ) 进行相应的 DOM 操作。



### 5.1 render 阶段

#### 5.1.1 render

`文件位置：packages/react-dom/src/client/ReactDOMLegacy.js`

```react
/**
 * 渲染入口
 * element 要进行渲染的 ReactElement, createElement 方法的返回值
 * container 渲染容器 <div id="root"></div>
 * callback 渲染完成后执行的回调函数
 */
export function render(
  element: React$Element<any>,
  container: Container,
  callback: ?Function,
) {
  // 检测 container 是否是符合要求的渲染容器
  // 即检测 container 是否是真实的DOM对象
  // 如果不符合要求就报错
  invariant(
    isValidContainer(container),
    'Target container is not a DOM element.',
  );
  return legacyRenderSubtreeIntoContainer(
    // 父组件 初始渲染没有父组件 传递 null 占位
    null,
    element,
    container,
    // 是否为服务器端渲染 false 不是服务器端渲染 true 是服务器端渲染
    false,
    callback,
  );
}
```

#### 5.1.2 isValidContainer

`文件位置：packages/react-dom/src/client/ReactDOMRoot.js`

```react
/**
 * 判断 node 是否是符合要求的 DOM 节点
 * 1. node 可以是元素节点
 * 2. node 可以是 document 节点
 * 3. node 可以是 文档碎片节点
 * 4. node 可以是注释节点但注释内容必须是 react-mount-point-unstable
 * 		react 内部会找到注释节点的父级 通过调用父级元素的 insertBefore 方法, 将 element 插入到注释节点的前面
 */
export function isValidContainer(node: mixed): boolean {
  return !!(
    node &&
    (node.nodeType === ELEMENT_NODE ||
      node.nodeType === DOCUMENT_NODE ||
      node.nodeType === DOCUMENT_FRAGMENT_NODE ||
      (node.nodeType === COMMENT_NODE &&
        (node: any).nodeValue === ' react-mount-point-unstable '))
  );
}
```

#### 5.1.3 初始化 FiberRoot

##### 5.1.3.1 legacyRenderSubtreeIntoContainer

`文件位置: packages/react-dom/src/client/ReactDOMLegacy.js`

```react
/**
 * 将子树渲染到容器中 (初始化 Fiber 数据结构: 创建 fiberRoot 及 rootFiber)
 * parentComponent: 父组件, 初始渲染传入了 null
 * children: render 方法中的第一个参数, 要渲染的 ReactElement
 * container: 渲染容器
 * forceHydrate: true 为服务端渲染, false 为客户端渲染
 * callback: 组件渲染完成后需要执行的回调函数
 **/
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: Container,
  forceHydrate: boolean,
  callback: ?Function,
) {
  /**
   * 检测 container 是否已经是初始化过的渲染容器
   * react 在初始渲染时会为最外层容器添加 _reactRootContainer 属性
   * react 会根据此属性进行不同的渲染方式
   * root 不存在 表示初始渲染
   * root 存在 表示更新
   */
  // 获取 container 容器对象下是否有 _reactRootContainer 属性
  let root: RootType = (container._reactRootContainer: any);
  // 即将存储根 Fiber 对象
  let fiberRoot;
  if (!root) {
    // 初始渲染
    // 初始化根 Fiber 数据结构
    // 为 container 容器添加 _reactRootContainer 属性
    // 在 _reactRootContainer 对象中有一个属性叫做 _internalRoot
    // _internalRoot 属性值即为 FiberRoot 表示根节点 Fiber 数据结构
    // legacyCreateRootFromDOMContainer
    // createLegacyRoot
    // new ReactDOMBlockingRoot -> this._internalRoot
    // createRootImpl
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    // 获取 Fiber Root 对象
    fiberRoot = root._internalRoot;
    /**
     * 改变 callback 函数中的 this 指向
     * 使其指向 render 方法第一个参数的真实 DOM 对象
     */
    // 如果 callback 参数是函数类型
    if (typeof callback === 'function') {
      // 使用 originalCallback 存储 callback 函数
      const originalCallback = callback;
      // 为 callback 参数重新赋值
      callback = function () {
        // 获取 render 方法第一个参数的真实 DOM 对象
        // 实际上就是 id="root" 的 div 的子元素
        // rootFiber.child.stateNode
        // rootFiber 就是 id="root" 的 div
        const instance = getPublicRootInstance(fiberRoot);
        // 调用 callback 函数并改变函数内部 this 指向
        originalCallback.call(instance);
      };
    }
    // 初始化渲染不执行批量更新
    // 因为批量更新是异步的是可以被打断的, 但是初始化渲染应该尽快完成不能被打断
    // 所以不执行批量更新
    unbatchedUpdates(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    // 非初始化渲染 即更新
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function () {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  // 返回 render 方法第一个参数的真实 DOM 对象作为 render 方法的返回值
  // 就是说渲染谁 返回谁的真实 DOM 对象
  return getPublicRootInstance(fiberRoot);
}
```

<img src="./images/5.png" width="80%" align="left"/>

##### 5.1.3.2 legacyCreateRootFromDOMContainer

`文件位置: packages/react-dom/src/client/ReactDOMLegacy.js`

```react
/**
 * 判断是否为服务器端渲染 如果不是服务器端渲染
 * 清空 container 容器中的节点
 */
function legacyCreateRootFromDOMContainer(
  container: Container,
  forceHydrate: boolean,
): RootType {
  // container => <div id="root"></div>
  // 检测是否为服务器端渲染
  const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // 如果不是服务器端渲染
  if (!shouldHydrate) {
    let rootSibling;
    // 开启循环 删除 container 容器中的节点
    while ((rootSibling = container.lastChild)) {
      // 删除 container 容器中的节点
      container.removeChild(rootSibling);
      /**
       * 为什么要清除 container 中的元素 ?
       * 为提供首屏加载的用户体验, 有时需要在 container 中放置一些占位图或者 loading 图
       * 就无可避免的要向 container 中加入 html 标记.
       * 在将 ReactElement 渲染到 container 之前, 必然要先清空 container
       * 因为占位图和 ReactElement 不能同时显示
       *
       * 在加入占位代码时, 最好只有一个父级元素, 可以减少内部代码的循环次数以提高性能
       * <div>
       *  <p>placement<p>
       *  <p>placement<p>
       *  <p>placement<p>
       * </div>
       */
    }
  }
  return createLegacyRoot(
    container,
    shouldHydrate
      ? {
          hydrate: true,
        }
      : undefined,
  );
}
```

##### 5.1.3.3 createLegacyRoot

`文件位置: packages/react-dom/src/client/ReactDOMRoot.js`

```react
/**
 * 通过实例化 ReactDOMBlockingRoot 类创建 LegacyRoot
 */
export function createLegacyRoot(
  container: Container,
  options?: RootOptions,
): RootType {
  // container => <div id="root"></div>
  // LegacyRoot 常量, 值为 0,
  // 通过 render 方法创建的 container 就是 LegacyRoot
  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}
```

##### 5.1.3.3 ReactDOMBlockingRoot

`文件位置: packages/react-dom/src/client/ReactDOMRoot.js`

```react
/**
 * 类, 通过它可以创建 LegacyRoot 的 Fiber 数据结构
 */
function ReactDOMBlockingRoot(
  container: Container,
  tag: RootTag,
  options: void | RootOptions,
) {
  // tag => 0 => legacyRoot
  // container => <div id="root"></div>
  // container._reactRootContainer = {_internalRoot: {}}
  this._internalRoot = createRootImpl(container, tag, options);
}
```

##### 5.1.3.4 createRootImpl

`文件位置: packages/react-dom/src/client/ReactDOMRoot.js`

```react

function createRootImpl(
  container: Container,
  tag: RootTag,
  options: void | RootOptions,
) {
  // container => <div id="root"></div>
  // tag => 0
  // options => undefined
  const root = createContainer(container, tag, hydrate, hydrationCallbacks);
  markContainerAsRoot(root.current, container);
  return root;
}
```

##### 5.1.3.5 createContainer

`文件位置: packages/react-reconciler/src/ReactFiberReconciler.js`

```react
// 创建 container
export function createContainer(
  containerInfo: Container,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): OpaqueRoot {
  // containerInfo => <div id="root"></div>
  // tag: 0
  // hydrate: false
  // hydrationCallbacks: null
  // 忽略了和服务器端渲染相关的内容
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
}
```

##### 5.1.3.6 createFiberRoot

`文件位置: packages/react-reconciler/src/ReactFiberRoot.js`

```react
// 创建根节点对应的 fiber 对象
export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): FiberRoot {
  // 创建 FiberRoot
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);
  // 创建根节点对应的 rootFiber
  const uninitializedFiber = createHostRootFiber(tag);
  // 为 fiberRoot 添加 current 属性 值为 rootFiber
  root.current = uninitializedFiber;
  // 为 rootFiber 添加 stateNode 属性 值为 fiberRoot
  uninitializedFiber.stateNode = root;
  // 为 fiber 对象添加 updateQueue 属性, 初始化 updateQueue 对象
  // updateQueue 用于存放 Update 对象
  // Update 对象用于记录组件状态的改变
  initializeUpdateQueue(uninitializedFiber);
  // 返回 root
  return root;
}
```

##### 5.1.3.7 FiberRootNode

`文件位置: packages/react-reconciler/src/ReactFiberRoot.js`

```react
function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag;
  this.current = null;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.pingCache = null;
  this.finishedExpirationTime = NoWork;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.hydrate = hydrate;
  this.callbackNode = null;
  this.callbackPriority = NoPriority;
  this.firstPendingTime = NoWork;
  this.firstSuspendedTime = NoWork;
  this.lastSuspendedTime = NoWork;
  this.nextKnownPendingLevel = NoWork;
  this.lastPingedTime = NoWork;
  this.lastExpiredTime = NoWork;
  if (enableSchedulerTracing) {
    this.interactionThreadID = unstable_getThreadID();
    this.memoizedInteractions = new Set();
    this.pendingInteractionMap = new Map();
  }
  if (enableSuspenseCallback) {
    this.hydrationCallbacks = null;
  }
}
```

##### 5.3.1.8 initializeUpdateQueue

`文件位置: packages/react-reconciler/src/ReactFiberRoot.js`

```react
export function initializeUpdateQueue<State>(fiber: Fiber): void {
  const queue: UpdateQueue<State> = {
    baseState: fiber.memoizedState,
    baseQueue: null,
    shared: {
      pending: null,
    },
    effects: null,
  };
  fiber.updateQueue = queue;
}
```



#### 5.1.4 获取 rootFiber.child 实例对象

##### 5.1.4.1  getPublicRootInstance

`文件位置: packages/react-reconciler/src/ReactFiberReconciler.js`

```react
/**
 * 获取 container 的第一个子元素的实例对象
 */
export function getPublicRootInstance(
  // FiberRoot
  container: OpaqueRoot,
): React$Component<any, any> | PublicInstance | null {
  // 获取 rootFiber
  const containerFiber = container.current;
  // 如果 rootFiber 没有子元素
  // 指的就是 id="root" 的 div 没有子元素
  if (!containerFiber.child) {
    // 返回 null
    return null;
  }
  // 匹配子元素的类型
  switch (containerFiber.child.tag) {
    // 普通
    case HostComponent:
      return getPublicInstance(containerFiber.child.stateNode);
    default:
      // 返回子元素的真实 DOM 对象
      return containerFiber.child.stateNode;
  }
}
```

##### 5.1.4.2 getPublicInstance

`文件位置: packages/react-dom/src/client/ReactDOMHostConfig.js`

```react
export function getPublicInstance(instance: Instance): * {
  return instance;
}
```

#### 5.1.5 updateContainer

`文件位置: packages/react-reconciler/src/ReactFiberReconciler.js`

```react
/**
 * 计算任务的过期时间
 * 再根据任务过期时间创建 Update 任务
 */
export function updateContainer(
	// element 要渲染的 ReactElement
  element: ReactNodeList,
  // container Fiber Root 对象
  container: OpaqueRoot,
  // parentComponent 父组件 初始渲染为 null
  parentComponent: ?React$Component<any, any>,
  // ReactElement 渲染完成执行的回调函数
  callback: ?Function,
): ExpirationTime {  
  // container 获取 rootFiber
  const current = container.current;
  // 获取当前距离 react 应用初始化的时间 1073741805
  const currentTime = requestCurrentTimeForUpdate();
  // 异步加载设置
  const suspenseConfig = requestCurrentSuspenseConfig();

  // 计算过期时间
  // 为防止任务因为优先级的原因一直被打断而未能执行
  // react 会设置一个过期时间, 当时间到了过期时间的时候
  // 如果任务还未执行的话, react 将会强制执行该任务
  // 初始化渲染时, 任务同步执行不涉及被打断的问题 1073741823
  const expirationTime = computeExpirationForFiber(
    currentTime,
    current,
    suspenseConfig,
  );
  // 设置FiberRoot.context, 首次执行返回一个emptyContext, 是一个 {}
  const context = getContextForSubtree(parentComponent);
  // 初始渲染时 Fiber Root 对象中的 context 属性值为 null
  // 所以会进入到 if 中
  if (container.context === null) {
    // 初始渲染时将 context 属性值设置为 {}
    container.context = context;
  } else {
    container.pendingContext = context;
  }
  // 创建一个待执行任务
  const update = createUpdate(expirationTime, suspenseConfig);
  // 将要更新的内容挂载到更新对象中的 payload 中
  // 将要更新的组件存储在 payload 对象中, 方便后期获取
  update.payload = {element};
  // 判断 callback 是否存在
  callback = callback === undefined ? null : callback;
  // 如果 callback 存在
  if (callback !== null) {
    // 将 callback 挂载到 update 对象中
    // 其实就是一层层传递 方便 ReactElement 元素渲染完成调用
    // 回调函数执行完成后会被清除 可以在代码的后面加上 return 进行验证
    update.callback = callback;
  }
  // 将 update 对象加入到当前 Fiber 的更新队列当中 (updateQueue)
  enqueueUpdate(current, update);
  // 调度和更新 current 对象
  scheduleWork(current, expirationTime);
  // 返回过期时间
  return expirationTime;
}
```

#### 5.1.6 enqueueUpdate

`文件位置: packages/react-reconciler/src/ReactUpdateQueue.js`

```react
// 将任务(Update)存放于任务队列(updateQueue)中
// 创建单向链表结构存放 update, next 用来串联 update
export function enqueueUpdate<State>(fiber: Fiber, update: Update<State>) {
  // 获取当前 Fiber 的 更新队列
  const updateQueue = fiber.updateQueue;
  // 如果更新队列不存在 就返回 null
  if (updateQueue === null) {
    // 仅发生在 fiber 已经被卸载
    return;
  }
  // 获取待执行的 Update 任务
  // 初始渲染时没有待执行的任务
  const sharedQueue = updateQueue.shared;
  const pending = sharedQueue.pending;
  // 如果没有待执行的 Update 任务
  if (pending === null) {
    // 这是第一次更新, 创建一个循环列表.
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  // 将 Update 任务存储在 pending 属性中
  sharedQueue.pending = update;
}
```

#### 5.1.7 scheduleUpdateOnFiber

`文件位置: packages/react-reconciler/src/ReactFiberWorkLoop.js`

```react
/**
 * 判断任务是否为同步 调用同步任务入口
 */
export function scheduleUpdateOnFiber(
  // rootFiber
  fiber: Fiber,
  expirationTime: ExpirationTime,
) {
  /**
   * fiber: 初始化渲染时为 rootFiber, 即 <div id="root"></div> 对应的 Fiber 对象
   * expirationTime: 任务过期时间 =>1073741823
   */
  /**
   * 判断是否是无限循环的 update 如果是就报错
   * 在 componentWillUpdate 或者 componentDidUpdate 生命周期函数中重复调用
   * setState 方法时, 可能会发生这种情况, React 限制了嵌套更新的数量以防止无限循环
   * 限制的嵌套更新数量为 50, 可通过 NESTED_UPDATE_LIMIT 全局变量获取
   */
  checkForNestedUpdates();
  // 判断任务是否是同步任务 Sync的值为: 1073741823
  if (expirationTime === Sync) {
    if (
      // 检查是否处于非批量更新模式
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      // 检查是否没有处于正在进行渲染的任务
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // 同步任务入口点
      performSyncWorkOnRoot(root);
    }
  // 忽略了一些初始化渲染不会得到执行的代码
}
```

#### 5.1.8 构建 Fiber 对象

##### 5.1.8.1 performSyncWorkOnRoot

`文件位置: packages/react-reconciler/src/ReactFiberWorkLoop.js`

```react
// 进入 render 阶段, 构建 workInProgress Fiber 树
function performSyncWorkOnRoot(root) {
  // 参数 root 为 fiberRoot 对象
  // 检查是否有过期的任务
  // 如果没有过期的任务 值为 0
  // 初始化渲染没有过期的任务待执行
  const lastExpiredTime = root.lastExpiredTime;
  // NoWork 值为 0
  // 如果有过期的任务 将过期时间设置为 lastExpiredTime 否则将过期时间设置为 Sync
  // 初始渲染过期时间被设置成了 Sync
  const expirationTime = lastExpiredTime !== NoWork ? lastExpiredTime : Sync;

  // 如果 root 和 workInProgressRoot 不相等
  // 说明 workInProgressRoot 不存在, 说明还没有构建 workInProgress Fiber 树
  // workInProgressRoot 为全局变量 默认值为 null, 初始渲染时值为 null
  // expirationTime => 1073741823
  // renderExpirationTime => 0
  // true
  if (root !== workInProgressRoot || expirationTime !== renderExpirationTime) {
    // 构建 workInProgressFiber 树及rootFiber
    prepareFreshStack(root, expirationTime);
  }
  // workInProgress 如果不为 null
  if (workInProgress !== null) {
    do {
      try {
        // 以同步的方式开始构建 Fiber 对象
        workLoopSync();
        // 跳出 while 循环
        break;
      } catch (thrownValue) {
        handleError(root, thrownValue);
      }
    } while (true);
    
    if (workInProgress !== null) {
      // 这是一个同步渲染, 所以我们应该完成整棵树.
      // 无法提交不完整的 root, 此错误可能是由于React中的错误所致. 请提出问题.
      invariant(
        false,
        'Cannot commit an incomplete root. This error is likely caused by a ' +
          'bug in React. Please file an issue.',
      );
    } else {
      // 将构建好的新 Fiber 对象存储在 finishedWork 属性中
      // 提交阶段使用
      root.finishedWork = (root.current.alternate: any);
      root.finishedExpirationTime = expirationTime;
      // 结束 render 阶段
      // 进入 commit 阶段
      finishSyncRender(root);
    }
  }
}
```

##### 5.1.8.2 prepareFreshStack

`文件位置: packages/react-reconciler/src/ReactFiberWorkLoop.js`

```react
/**
 * 根据 currentFiber 树中的 rootFiber
 * 构建 workInProgressFiber 树中的 rootFiber
 */
function prepareFreshStack(root, expirationTime) {
  // 为 FiberRoot 对象添加 finishedWork 属性
  // finishedWork 表示 render 阶段执行完成后构建的待提交的 Fiber 对象
  root.finishedWork = null;
  // 初始化 finishedExpirationTime 值为 0
  root.finishedExpirationTime = NoWork;

  // 建构 workInProgress Fiber 树的 Fiber 对象
  workInProgressRoot = root;
  // 构建 workInProgress Fiber 树中的 rootFiber
  workInProgress = createWorkInProgress(root.current, null);
  renderExpirationTime = expirationTime;
  workInProgressRootExitStatus = RootIncomplete;
}
```

##### 5.1.8.3 createWorkInProgress

`文件位置: packages/react-reconciler/src/ReactFiber.js`

```react
// 构建 workInProgress Fiber 树中的 rootFiber
// 构建完成后会替换 current fiber
// 初始渲染 pendingProps 为 null
export function createWorkInProgress(current: Fiber, pendingProps: any): Fiber {
  // current: current Fiber 中的 rootFiber
  // 获取 current Fiber 中对应的 workInProgress Fiber
  let workInProgress = current.alternate;
  // 如果 workInProgress 不存在
  if (workInProgress === null) {
    // 创建 fiber 对象
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode,
    );
    // 属性复用
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    // 使用 alternate 存储 current
    workInProgress.alternate = current;
    // 使用 alternate 存储 workInProgress
    current.alternate = workInProgress;
  }
  
  workInProgress.childExpirationTime = current.childExpirationTime;
  workInProgress.expirationTime = current.expirationTime;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;
	
  // 返回创建好的 workInProgress Fiber 对象
  return workInProgress;
}
```

##### 5.1.8.4 workLoopSync

`文件位置: packages/react-reconciler/src/ReactFiberWorkLoop.js`

```react
// 以同步的方式构建 workInProgress Fiber 对象
function workLoopSync() {
  // workInProgress 是一个 fiber 对象
  // 它的值不为 null 意味着该 fiber 对象上仍然有更新要执行
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

##### 5.1.8.5 performUnitOfWork

`文件位置: packages/react-reconciler/src/ReactFiberWorkLoop.js`

```react
function performUnitOfWork(unitOfWork: Fiber): Fiber | null {
  // unitOfWork => workInProgress Fiber 树中的 rootFiber
  // current => currentFiber 树中的 rootFiber
  const current = unitOfWork.alternate;
  // 存储下一个要构建的子级 Fiber 对象
  let next;
  // false
  if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    // 初始渲染 不执行
  } else {
    // beginWork: 从父到子, 构建 Fiber 节点对象
    // 返回值 next 为当前节点的子节点
    next = beginWork(current, unitOfWork, renderExpirationTime);
  }
  // 为旧的 props 属性赋值
  // 此次更新后 pendingProps 变为 memoizedProps
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  // 如果子节点不存在说明当前节点向下遍历子节点已经到底了
  // 继续向上返回 遇到兄弟节点 构建兄弟节点的子 Fiber 对象 直到返回到根 Fiber 对象
  if (next === null) {
    // 从子到父, 构建其余节点 Fiber 对象
    next = completeUnitOfWork(unitOfWork);
  }
  return next;
}
```

##### 5.1.8.6 beginWork

`文件位置: packages/react-reconciler/src/ReactFiberBeginWork.js`

```react
// 从父到子, 构建 Fiber 节点对象
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  // NoWork 常量 值为0 清空过期时间
  workInProgress.expirationTime = NoWork;
  // 根据当前 Fiber 的类型决定如何构建起子级 Fiber 对象
  // 文件位置: shared/ReactWorkTags.js
  switch (workInProgress.tag) {
    // 2
    // 函数型组件在第一次渲染组件时使用
    case IndeterminateComponent: {
      return mountIndeterminateComponent(
        // 旧 Fiber
        current,
        // 新 Fiber
        workInProgress,
        // 新 Fiber 的 type 值 初始渲染时是App组件函数
        workInProgress.type,
        // 同步 整数最大值 1073741823
        renderExpirationTime,
      );
    }
    // 0
    case FunctionComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime,
      );
    }
    // 1
    case ClassComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime,
      );
    }
    // 3
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderExpirationTime);
    // 5
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderExpirationTime);
    // 6
    case HostText:
      return updateHostText(current, workInProgress);
  // 组件类型未知 报错
  invariant(
    false,
    'Unknown unit of work tag (%s). This error is likely caused by a bug in ' +
      'React. Please file an issue.',
    workInProgress.tag,
  );
}
```

##### 5.1.8.7 updateHostRoot

`文件位置: packages/react-reconciler/src/ReactFiberBeginWork.js`

```react
// HostRoot => <div id="root"></div> 对应的 Fiber 对象
// 找出 HostRoot 的子 ReactElement 并为其构建 Fiber 对象
function updateHostRoot(current, workInProgress, renderExpirationTime) {
  // 获取更新队列
  const updateQueue = workInProgress.updateQueue;
  // 获取新的 props 对象 null
  const nextProps = workInProgress.pendingProps;
  // 获取上一次渲染使用的 state null
  const prevState = workInProgress.memoizedState;
  // 获取上一次渲染使用的 children null
  const prevChildren = prevState !== null ? prevState.element : null;
  // 浅复制更新队列, 防止引用属性互相影响
  // workInProgress.updateQueue 浅拷贝 current.updateQueue
  cloneUpdateQueue(current, workInProgress);
  // 获取 updateQueue.payload 并赋值到 workInProgress.memoizedState
  // 要更新的内容就是 element 就是 rootFiber 的子元素
  processUpdateQueue(workInProgress, nextProps, null, renderExpirationTime);
  // 获取 element 所在对象
  const nextState = workInProgress.memoizedState;
  // 从对象中获取 element
  const nextChildren = nextState.element;
  // 获取 fiberRoot 对象
  const root: FiberRoot = workInProgress.stateNode;
  // 服务器端渲染走 if
  if (root.hydrate && enterHydrationState(workInProgress)) {
    // 忽略
  } else {
    // 客户端渲染走 else
    // 构建子节点 fiber 对象
    reconcileChildren(
      current,
      workInProgress,
      nextChildren,
      renderExpirationTime,
    );
  }
  // 返回子节点 fiber 对象
  return workInProgress.child;
}
```

##### 5.1.8.8 reconcileChildren

`文件位置: packages/react-reconciler/src/ReactFiberBeginWork.js`

```react
export function reconcileChildren(
  // 旧 Fiber
  current: Fiber | null,
  // 父级 Fiber
  workInProgress: Fiber,
  // 子级 vdom 对象
  nextChildren: any,
  // 初始渲染 整型最大值 代表同步任务
  renderExpirationTime: ExpirationTime,
) {
  /**
   * 为什么要传递 current ?
   * 如果不是初始渲染的情况, 要进行新旧 Fiber 对比
   * 初始渲染时则用不到 current
   */
  // 如果就 Fiber 为 null 表示初始渲染
  if (current === null) {
    // 为当前构建的 Fiber 对象添加子级 Fiber 对象
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime,
    );
  }
  // 忽略了 else 的情况
}
```

##### 5.1.8.9 ChildReconciler

`文件位置: packages/react-reconciler/src/ReactChildFiber.js`

```react
/**
 * shouldTrackSideEffects 标识, 是否为 Fiber 对象添加 effectTag
 * true 添加 false 不添加
 * 对于初始渲染来说, 只有根组件需要添加, 其他元素不需要添加, 防止过多的 DOM 操作
 */
// 用于初始渲染
export const mountChildFibers = ChildReconciler(false);

function ChildReconciler(shouldTrackSideEffects) {
 
  function placeChild(
    newFiber: Fiber,
    lastPlacedIndex: number,
    newIndex: number,
  ): number {
    newFiber.index = newIndex;
    if (!shouldTrackSideEffects) {
      return lastPlacedIndex;
    }
    // 忽略了一部分初始化渲染不执行的代码
  }

  function placeSingleChild(newFiber: Fiber): Fiber {
    // 如果是初始渲染 会在根组件(App)上设置 effectTag 属性为 Placement 值为 1
    // 其他子级节点具有默认值为 0 防止在 commit 阶段反复操作真实DOM
    // 初始渲染时如果当前处理的是根组件 true 其他组件 false
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      // Placement 表示新创建的节点
      newFiber.effectTag = Placement;
    }
    return newFiber;
  }
  
  // 处理子元素是数组的情况
  function reconcileChildrenArray(
    // 父级 Fiber
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    // 子级 vdom 数组
    newChildren: Array<*>,
    expirationTime: ExpirationTime,
  ): Fiber | null {
    /**
     * 存储第一个子节点 Fiber 对象
     * 方法返回的也是第一个子节点 Fiber 对象
     * 因为其他子节点 Fiber 对象都存储在上一个子 Fiber 节点对象的 sibling 属性中
     */
    let resultingFirstChild: Fiber | null = null;
    // 上一次创建的 Fiber 对象
    let previousNewFiber: Fiber | null = null;
    // 初始渲染没有旧的子级 所以为 null
    let oldFiber = currentFirstChild;

    let lastPlacedIndex = 0;
    let newIdx = 0;
    let nextOldFiber = null;

    // oldFiber 为空 说明是初始渲染
    if (oldFiber === null) {
      // 遍历子 vdom 对象
      for (; newIdx < newChildren.length; newIdx++) {
        // 创建子 vdom 对应的 fiber 对象
        const newFiber = createChild(
          returnFiber,
          newChildren[newIdx],
          expirationTime,
        );
        // 如果 newFiber 为 null
        if (newFiber === null) {
          // 进入下次循环
          continue;
        }
        // 初始渲染时只为 newFiber 添加了 index 属性,
        // 其他事没干. lastPlacedIndex 被原封不动的返回了
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        // 为当前节点设置下一个兄弟节点
        if (previousNewFiber === null) {
          // 存储第一个子 Fiber 发生在第一次循环时
          resultingFirstChild = newFiber;
        } else {
          // 为节点设置下一个兄弟 Fiber
          previousNewFiber.sibling = newFiber;
        }
        // 在循环的过程中更新上一个创建的Fiber 对象
        previousNewFiber = newFiber;
      }
      // 返回创建好的子 Fiber
      // 其他 Fiber 都作为 sibling 存在
      return resultingFirstChild;
    }
    // 返回第一个子元素 Fiber 对象
    return resultingFirstChild;
  }

  // 处理子元素是文本或者数值的情况
  function reconcileSingleTextNode(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    textContent: string,
    expirationTime: ExpirationTime,
  ): Fiber {
    // 初始渲染不执行
    if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
      // We already have an existing node so let's just update it and delete
      // the rest.
      deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
      const existing = useFiber(currentFirstChild, textContent);
      existing.return = returnFiber;
      return existing;
    }
    // 现有的第一个子节点不是文本节点，因此我们需要创建一个并删除现有的.
    // 初始渲染不执行
    deleteRemainingChildren(returnFiber, currentFirstChild);
    // 根据文本创建 Fiber 对象
    const created = createFiberFromText(
      textContent,
      returnFiber.mode,
      expirationTime,
    );
    // 设置父 Fiber 对象
    created.return = returnFiber;
    // 返回创建好的 Fiber 对象
    return created;
  }
  // 处理子元素是单个对象的情况
  function reconcileSingleElement(
    // 父 Fiber 对象
    returnFiber: Fiber,
    // 备份子 fiber
    currentFirstChild: Fiber | null,
    // 子 vdom 对象
    element: ReactElement,
    expirationTime: ExpirationTime,
  ): Fiber {
    // 查看子 vdom 对象是否表示 fragment
    if (element.type === REACT_FRAGMENT_TYPE) {
      // false
    } else {
      // 根据 React Element 创建 Fiber 对象
      // 返回创建好的 Fiber 对象
      const created = createFiberFromElement(
        element,
        // 用来表示当前组件下的所有子组件要用处于何种渲染模式
        // 文件位置: ./ReactTypeOfMode.js
        // 0    同步渲染模式
        // 100  异步渲染模式
        returnFiber.mode,
        expirationTime,
      );
      // 添加 ref 属性 { current: DOM }
      created.ref = coerceRef(returnFiber, currentFirstChild, element);
      // 添加父级 Fiber 对象
      created.return = returnFiber;
      // 返回创建好的子 Fiber
      return created;
    }
  }

  function reconcileChildFibers(
    // 父 Fiber 对象
    returnFiber: Fiber,
    // 旧的第一个子 Fiber 初始渲染 null
    currentFirstChild: Fiber | null,
    // 新的子 vdom 对象
    newChild: any,
    // 初始渲染 整型最大值 代表同步任务
    expirationTime: ExpirationTime,
  ): Fiber | null {
    // 这是入口方法, 根据 newChild 类型进行对应处理

    // 判断新的子 vdom 是否为占位组件 比如 <></>
    // false
    const isUnkeyedTopLevelFragment =
      typeof newChild === 'object' &&
      newChild !== null &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      newChild.key === null;

    // 如果 newChild 为占位符, 使用 占位符组件的子元素作为 newChild
    if (isUnkeyedTopLevelFragment) {
      newChild = newChild.props.children;
    }

    // 检测 newChild 是否为对象类型
    const isObject = typeof newChild === 'object' && newChild !== null;

    // newChild 是单个对象的情况
    if (isObject) {
      // 匹配子元素的类型
      switch (newChild.$$typeof) {
        // 子元素为 ReactElement
        case REACT_ELEMENT_TYPE:
          // 为 Fiber 对象设置 effectTag 属性
          // 返回创建好的子 Fiber
          return placeSingleChild(
            // 处理单个 React Element 的情况
            // 内部会调用其他方法创建对应的 Fiber 对象
            reconcileSingleElement(
              returnFiber,
              currentFirstChild,
              newChild,
              expirationTime,
            ),
          );
      }
    }
      
    // 处理 children 为文本和数值的情况 return "App works"
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(
        reconcileSingleTextNode(
          returnFiber,
          currentFirstChild,
          // 如果 newChild 是数值, 转换为字符串
          '' + newChild,
          expirationTime,
        ),
      );
    }

    // children 是数组的情况
    if (isArray(newChild)) {
      // 返回创建好的子 Fiber
      return reconcileChildrenArray(
        returnFiber,
        currentFirstChild,
        newChild,
        expirationTime,
      );
    }
  }
}
```

##### 5.1.8.10 completeUnitOfWork

`文件位置: packages/react-reconciler/src/ReactFiberWorkLoop.js`

```react
/**
 *
 * 从下至上移动到该节点的兄弟节点, 如果一直往上没有兄弟节点就返回父节点, 最终会到达 root 节点
 * 1. 创建其他节点的 Fiber 对象
 * 2. 创建每一个节点的真实 DOM 对象并将其添加到 stateNode 属性中
 * 3. 构建 effect 链表结构
 */
function completeUnitOfWork(unitOfWork: Fiber): Fiber | null {
  // 为 workInProgress 全局变量重新赋值
  workInProgress = unitOfWork;
  do {
    // 获取备份节点
    // 初始化渲染 非根 Fiber 对象没有备份节点 所以 current 为 null
    const current = workInProgress.alternate;
    // 父级 Fiber 对象, 非根 Fiber 对象都有父级
    const returnFiber = workInProgress.return;
    // 判断传入的 Fiber 对象是否构建完成, 任务调度相关
    // & 是表示位的与运算, 把左右两边的数字转化为二进制
    // 然后每一位分别进行比较, 如果相等就为1, 不相等即为0
    // 此处应用"位与"运算符的目的是"清零"
    // true
    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      let next;
      // 如果不能使用分析器的 timer, 直接执行 completeWork
      // enableProfilerTimer => true
      // 但此处无论条件是否成立都会执行 completeWork
      if (
        !enableProfilerTimer ||
        (workInProgress.mode & ProfileMode) === NoMode
      ) {
        // 重点代码(二)
        // 创建节点真实 DOM 对象并将其添加到 stateNode 属性中
        next = completeWork(current, workInProgress, renderExpirationTime);
      } else {
        // 创建节点真实 DOM 对象并将其添加到 stateNode 属性中
        next = completeWork(current, workInProgress, renderExpirationTime);
      }
      // 重点代码(一)
      // 如果子级存在
      if (next !== null) {
        // 返回子级 一直返回到 workLoopSync
        // 再重新执行 performUnitOfWork 构建子级 Fiber 节点对象
        return next;
      }

      // 构建 effect 链表结构
      // 如果不是根 Fiber 就是 true 否则就是 false
      // 将子树和此 Fiber 的所有 effect 附加到父级的 effect 列表中
      if (
        // 如果父 Fiber 存在 并且
        returnFiber !== null &&
        // 父 Fiber 对象中的 effectTag 为 0
        (returnFiber.effectTag & Incomplete) === NoEffect
      ) {
        // 将子树和此 Fiber 的所有副作用附加到父级的 effect 列表上

        // 以下两个判断的作用是搜集子 Fiber的 effect 到父 Fiber
        if (returnFiber.firstEffect === null) {
          // first
          returnFiber.firstEffect = workInProgress.firstEffect;
        }

        if (workInProgress.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            // next
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
          }
          // last
          returnFiber.lastEffect = workInProgress.lastEffect;
        }

        // 获取副作用标记
        // 初始渲染时除[根组件]以外的 Fiber, effectTag 值都为 0, 即不需要执行任何真实DOM操作
        // 根组件的 effectTag 值为 3, 即需要将此节点对应的真实DOM对象添加到页面中
        const effectTag = workInProgress.effectTag;

        // 创建 effect 列表时跳过 NoWork(0) 和 PerformedWork(1) 标记
        // PerformedWork 由 React DevTools 读取, 不提交
        // 初始渲染时 只有遍历到了根组件 判断条件才能成立, 将 effect 链表添加到 rootFiber
        // 初始渲染 FiberRoot 对象中的 firstEffect 和 lastEffect 都是 App 组件
        // 因为当所有节点在内存中构建完成后, 只需要一次将所有 DOM 添加到页面中
        if (effectTag > PerformedWork) {
          // false
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress;
          } else {
            // 为 fiberRoot 添加 firstEffect
            returnFiber.firstEffect = workInProgress;
          }
          // 为 fiberRoot 添加 lastEffect
          returnFiber.lastEffect = workInProgress;
        }
      }
    } else {
    	// 忽略了初始渲染不执行的代码      
    }
    // 获取下一个同级 Fiber 对象
    const siblingFiber = workInProgress.sibling;
    // 如果下一个同级 Fiber 对象存在
    if (siblingFiber !== null) {
      // 返回下一个同级 Fiber 对象
      return siblingFiber;
    }
    // 否则退回父级
    workInProgress = returnFiber;
  } while (workInProgress !== null);

  // 当执行到这里的时候, 说明遍历到了 root 节点, 已完成遍历
  // 更新 workInProgressRootExitStatus 的状态为 已完成
  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootCompleted;
  }
  return null;
}
```

##### 5.1.8.11 completeWork

`文件位置: packages/react-reconciler/src/ReactFiberCompleteWork.js`

```react
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  // 获取待更新 props
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    // 0
    case FunctionComponent:
      return null;
    // 3
    case HostRoot: {
      updateHostContainer(workInProgress);
      return null;
    }
    // 5
    case HostComponent: {
      // 获取 rootDOM 节点 <div id="root"></div>
      const rootContainerInstance = getRootHostContainer();
      // 节点的具体的类型 div span ...
      const type = workInProgress.type;
      // false current = null
      if (current !== null && workInProgress.stateNode != null) {
       // 初始渲染不执行
      } else {
				// false
        if (wasHydrated) {
         // 初始渲染不执行
        } else {
          // 创建节点实例对象 <div></div> <span></span>
          let instance = createInstance(
            type,
            newProps,
            rootContainerInstance,
            currentHostContext,
            workInProgress,
          );
          /**
           * 将所有的子级追加到父级中
           * instance 为父级
           * workInProgress.child 为子级
           */
          appendAllChildren(instance, workInProgress, false, false);
          // 为 Fiber 对象添加 stateNode 属性
          workInProgress.stateNode = instance;
        }
        // 处理 ref DOM 引用
        if (workInProgress.ref !== null) {
          markRef(workInProgress);
        }
      }
      return null;
    } 
  }
}
```

##### 5.1.8.12 appendAllChildren

`文件位置: packages/react-reconciler/src/ReactFiberCompleteWork.js`

```react
appendAllChildren = function (
    parent: Instance,
    workInProgress: Fiber,
    needsVisibilityToggle: boolean,
    isHidden: boolean,
  ) {
    // 获取子级
    let node = workInProgress.child;
    // 如果子级不为空 执行循环
    while (node !== null) {
      // 如果 node 是普通 ReactElement 或者为文本
      if (node.tag === HostComponent || node.tag === HostText) {
        // 将子级追加到父级中
        appendInitialChild(parent, node.stateNode);
      } else if (node.child !== null) {
        // 如果 node 不是普通 ReactElement 又不是文本
        // 将 node 视为组件, 组件本身不能转换为真实 DOM 元素
        // 获取到组件的第一个子元素, 继续执行循环
        node.child.return = node;
        node = node.child;
        continue;
      }
      // 如果 node 和 workInProgress 是同一个节点
      // 说明 node 已经退回到父级 终止循环
      // 说明此时所有子级都已经追加到父级中了
      if (node === workInProgress) {
        return;
      }
      // 处理子级节点的兄弟节点
      while (node.sibling === null) {
        // 如果节点没有父级或者节点的父级是自己, 退出循环
        // 说明此时所有子级都已经追加到父级中了
        if (node.return === null || node.return === workInProgress) {
          return;
        }
        // 更新 node
        node = node.return;
      }
      // 更新父级 方便回退
      node.sibling.return = node.return;
      // 将 node 更新为下一个兄弟节点
      node = node.sibling;
    }
  };
```

### 5.2 commit 阶段

#### 5.2.1 finishSyncRender

`文件位置: packages/react-reconciler/src/ReactFiberWorkLoop.js`

```react
function finishSyncRender(root) {
  // 销毁 workInProgress Fiber 树
  // 因为待提交 Fiber 对象已经被存储在了 root.finishedWork 中
  workInProgressRoot = null;
  // 进入 commit 阶段
  commitRoot(root);
}
```

#### 5.2.2 commitRoot

`文件位置: packages/react-reconciler/src/ReactFiberWorkLoop.js`

```react
function commitRoot(root) {
  // 获取任务优先级 97 => 普通优先级
  const renderPriorityLevel = getCurrentPriorityLevel();
  // 使用最高优先级执行当前任务, 因为 commit 阶段不可以被打断
  // ImmediatePriority, 优先级为 99, 最高优先级
  runWithPriority(
    ImmediatePriority,
    commitRootImpl.bind(null, root, renderPriorityLevel),
  );
  return null;
}
```

#### 5.2.3 commitRootImpl

commit 阶段可以分为三个子阶段：

- before mutation 阶段（执行 DOM 操作前）
- mutation 阶段（执行 DOM 操作）
- layout 阶段（执行 DOM 操作后）

`文件位置: packages/react-reconciler/src/ReactFiberWorkLoop.js`

```react
function commitRootImpl(root, renderPriorityLevel) {
  // 获取待提交 Fiber 对象 rootFiber
  const finishedWork = root.finishedWork;
  // 如果没有任务要执行
  if (finishedWork === null) {
    // 阻止程序继续向下执行
    return null;
  }
  // 重置为默认值
  root.finishedWork = null;
  root.callbackNode = null;
  root.callbackExpirationTime = NoWork;
  root.callbackPriority = NoPriority;
  root.nextKnownPendingLevel = NoWork;
  
  // 获取要执行 DOM 操作的副作用列表
  let firstEffect = finishedWork.firstEffect;

  // true
  if (firstEffect !== null) {
    // commit 第一个子阶段
    nextEffect = firstEffect;
    // 处理类组件的 getSnapShotBeforeUpdate 生命周期函数
    do {
      invokeGuardedCallback(null, commitBeforeMutationEffects, null);
    } while (nextEffect !== null);
    
		// commit 第二个子阶段
    nextEffect = firstEffect;
    do {
      invokeGuardedCallback(null, commitMutationEffects, null, root, renderPriorityLevel);
    } while (nextEffect !== null);
    // 将 workInProgress Fiber 树变成 current Fiber 树
    root.current = finishedWork;
    
		// commit 第三个子阶段
    nextEffect = firstEffect;
    do {
      invokeGuardedCallback(null, commitLayoutEffects, null, root,expirationTime);
    } while (nextEffect !== null);
		
    // 重置 nextEffect
    nextEffect = null;
  }
}
```

#### 5.2.4 第一子阶段

##### 5.2.4.1 commitBeforeMutationEffects

`文件位置: packages/react-reconciler/src/ReactFiberWorkLoop.js`

```react
// commit 阶段的第一个子阶段
// 调用类组件的 getSnapshotBeforeUpdate 生命周期函数
function commitBeforeMutationEffects() {
  // 循环 effect 链
  while (nextEffect !== null) {
    // nextEffect 是 effect 链上从 firstEffect 到 lastEffec 的每一个需要commit的 fiber 对象

    // 初始化渲染第一个 nextEffect 为 App 组件
    // effectTag => 3
    const effectTag = nextEffect.effectTag;
    // console.log(effectTag);
    // nextEffect = null;
    // return;

    // 如果 fiber 对象中里有 Snapshot 这个 effectTag 的话
    // Snapshot 和更新有关系 初始化渲染 不执行
    // false
    if ((effectTag & Snapshot) !== NoEffect) {
      // 获取当前 fiber 节点
      const current = nextEffect.alternate;
      // 当 nextEffect 上有 Snapshot 这个 effectTag 时
      // 执行以下方法, 主要是类组件调用 getSnapshotBeforeUpdate 生命周期函数
      commitBeforeMutationEffectOnFiber(current, nextEffect);
    }
    // 更新循环条件
    nextEffect = nextEffect.nextEffect;
  }
}
```

##### 5.2.4.2 commitBeforeMutationLifeCycles

`文件位置: packages/react-reconciler/src/ReactFiberCommitWork.js`

```react
function commitBeforeMutationLifeCycles(
  current: Fiber | null,
  finishedWork: Fiber,
): void {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block: {
      return;
    }
    // 如果该 fiber 类型是 ClassComponent
    case ClassComponent: {
      if (finishedWork.effectTag & Snapshot) {
        if (current !== null) {
          // 旧的 props
          const prevProps = current.memoizedProps;
          // 旧的 state
          const prevState = current.memoizedState;
          // 获取 classComponent 组件的实例对象
          const instance = finishedWork.stateNode;
          // 执行 getSnapshotBeforeUpdate 生命周期函数
          // 在组件更新前捕获一些 DOM 信息
          // 返回自定义的值或 null, 统称为 snapshot
          const snapshot = instance.getSnapshotBeforeUpdate(
            finishedWork.elementType === finishedWork.type
              ? prevProps
              : resolveDefaultProps(finishedWork.type, prevProps),
            prevState,
          );
        }
      }
      return;
    }
    case HostRoot:
    case HostComponent:
    case HostText:
    case HostPortal:
    case IncompleteClassComponent:
      // Nothing to do for these component types
      return;
  }
}
```

#### 5.2.5 第二子阶段

##### 5.2.5.1 commitMutationEffects

`文件位置: packages/react-reconciler/src/ReactFiberWorkLoop.js`

```react
// commit 阶段的第二个子阶段
// 根据 effectTag 执行 DOM 操作
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  // 循环 effect 链
  while (nextEffect !== null) {
    // 获取 effectTag
    // 初始渲染第一次循环为 App 组件
    // 即将根组件及内部所有内容一次性添加到页面中
    const effectTag = nextEffect.effectTag;

    // 根据 effectTag 分别处理
    let primaryEffectTag =
      effectTag & (Placement | Update | Deletion | Hydrating);
    // 匹配 effectTag
    // 初始渲染 primaryEffectTag 为 2 匹配到 Placement
    switch (primaryEffectTag) {
      // 针对该节点及子节点进行插入操作
      case Placement: {
        commitPlacement(nextEffect);
        // effectTag 从 3 变为 1
        // 从 effect 标签中清除 "placement" 重置 effectTag 值
        // 以便我们知道在调用诸如componentDidMount之类的任何生命周期之前已将其插入。
        nextEffect.effectTag &= ~Placement;
        break;
      }
      // 插入并更新 DOM
      case PlacementAndUpdate: {
        // 插入
        commitPlacement(nextEffect);
        nextEffect.effectTag &= ~Placement;

        // 更新
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 服务器端渲染
      case Hydrating: {
        nextEffect.effectTag &= ~Hydrating;
        break;
      }
      // 服务器端渲染
      case HydratingAndUpdate: {
        nextEffect.effectTag &= ~Hydrating;

        // Update
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 更新 DOM
      case Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 删除 DOM
      case Deletion: {
        commitDeletion(root, nextEffect, renderPriorityLevel);
        break;
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```

##### 5.2.5.2 commitPlacement

`文件位置: packages/react-reconciler/src/ReactFiberCommitWork.js`

```react
// 挂载 DOM 元素
function commitPlacement(finishedWork: Fiber): void {
  // finishedWork 初始化渲染时为根组件 Fiber 对象
  // 获取非组件父级 Fiber 对象
  // 初始渲染时为 <div id="root"></div>
  const parentFiber = getHostParentFiber(finishedWork);

  // 存储真正的父级 DOM 节点对象
  let parent;
  // 是否为渲染容器
  // 渲染容器和普通react元素的主要区别在于是否需要特殊处理注释节点
  let isContainer;
  // 获取父级 DOM 节点对象
  // 但是初始渲染时 rootFiber 对象中的 stateNode 存储的是 FiberRoot
  const parentStateNode = parentFiber.stateNode;
  // 判断父节点的类型
  // 初始渲染时是 hostRoot 3
  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentStateNode;
      isContainer = false;
      break;
    case HostRoot:
      // 获取真正的 DOM 节点对象
      // <div id="root"></div>
      parent = parentStateNode.containerInfo;
      // 是 container 容器
      isContainer = true;
      break;
    case HostPortal:
      parent = parentStateNode.containerInfo;
      isContainer = true;
      break;
    case FundamentalComponent:
      if (enableFundamentalAPI) {
        parent = parentStateNode.instance;
        isContainer = false;
      }
  }
  // 查看当前节点是否有下一个兄弟节点
  // 有, 执行 insertBefore
  // 没有, 执行 appendChild
  const before = getHostSibling(finishedWork);
	// 渲染容器
  if (isContainer) {
    // 向父节点中追加节点 或者 将子节点插入到 before 节点的前面
    insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
  } else {
    // 非渲染容器
    // 向父节点中追加节点 或者 将子节点插入到 before 节点的前面
    insertOrAppendPlacementNode(finishedWork, before, parent);
  }
}
```

##### 5.2.5.3 getHostParentFiber

`文件位置: packages/react-reconciler/src/ReactFiberCommitWork.js`

```react
// 获取 HostRootFiber 对象
function getHostParentFiber(fiber: Fiber): Fiber {
  // 获取当前 Fiber 父级
  let parent = fiber.return;
  // 查看父级是否为 null
  while (parent !== null) {
    // 查看父级是否为 hostRoot
    if (isHostParent(parent)) {
      // 返回
      return parent;
    }
    // 继续向上查找
    parent = parent.return;
  }
}
```

##### 5.2.5.4 insertOrAppendPlacementNodeIntoContainer

`文件位置: packages/react-reconciler/src/ReactFiberCommitWork.js`

```react
// 向容器中追加 | 插入到某一个节点的前面
function insertOrAppendPlacementNodeIntoContainer(
  node: Fiber,
  before: ?Instance,
  parent: Container,
): void {
  const {tag} = node;
  // 如果待插入的节点是一个 DOM 元素或者文本的话
  // 比如 组件fiber => false div => true
  const isHost = tag === HostComponent || tag === HostText;

  if (isHost || (enableFundamentalAPI && tag === FundamentalComponent)) {
    // 获取 DOM 节点
    const stateNode = isHost ? node.stateNode : node.stateNode.instance;
    // 如果 before 存在
    if (before) {
      // 插入到 before 前面
      insertInContainerBefore(parent, stateNode, before);
    } else {
      // 追加到父容器中
      appendChildToContainer(parent, stateNode);
    }
  } else {
    // 如果是组件节点, 比如 ClassComponent, 则找它的第一个子节点(DOM 元素)
    // 进行插入操作
    const child = node.child;
    if (child !== null) {
      // 向父级中追加子节点或者将子节点插入到 before 的前面
      insertOrAppendPlacementNodeIntoContainer(child, before, parent);
      // 获取下一个兄弟节点
      let sibling = child.sibling;
      // 如果兄弟节点存在
      while (sibling !== null) {
        // 向父级中追加子节点或者将子节点插入到 before 的前面
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
        // 同步兄弟节点
        sibling = sibling.sibling;
      }
    }
  }
}
```

##### 5.2.5.5 insertInContainerBefore

`文件位置: packages/react-dom/src/client/ReactDOMHostConfig.js`

```react
export function insertInContainerBefore(
  container: Container,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance | SuspenseInstance,
): void {
  // 如果父容器是注释节点
  if (container.nodeType === COMMENT_NODE) {
    // 找到注释节点的父级节点 因为注释节点没法调用 insertBefore
    (container.parentNode: any).insertBefore(child, beforeChild);
  } else {
    // 将 child 插入到 beforeChild 的前面
    container.insertBefore(child, beforeChild);
  }
}
```

##### 5.2.5.6 appendChildToContainer

`文件位置: packages/react-dom/src/client/ReactDOMHostConfig.js`


```react
export function appendChildToContainer(
  container: Container,
  child: Instance | TextInstance,
): void {
  // 监测 container 是否注释节点
  if (container.nodeType === COMMENT_NODE) {
    // 获取父级的父级
    parentNode = (container.parentNode: any);
    // 将子级节点插入到注释节点的前面
    parentNode.insertBefore(child, container);
  } else {
    // 直接将 child 插入到父级中
    parentNode = container;
    parentNode.appendChild(child);
  }
}
```

#### 5.2.6 第三子阶段

##### 5.2.6.1 commitLayoutEffects

`文件位置: packages/react-reconciler/src/ReactFiberWorkLoop.js`

```react
// commit 阶段的第三个子阶段
function commitLayoutEffects(
  root: FiberRoot,
  committedExpirationTime: ExpirationTime,
) {
  while (nextEffect !== null) {
    // 此时 effectTag 已经被重置为 1, 表示 DOM 操作已经完成
    const effectTag = nextEffect.effectTag;
    // 调用生命周期函数和钩子函数
    // 前提是类组件中调用了生命周期函数 或者函数组件中调用了 useEffect
    if (effectTag & (Update | Callback)) {
      // 类组件处理生命周期函数
      // 函数组件处理钩子函数
      commitLayoutEffectOnFiber(root, current,nextEffect, committedExpirationTime);
    }
    // 更新循环条件
    nextEffect = nextEffect.nextEffect;
  }
}
```

##### 5.2.6.2 commitLifeCycles

`文件位置: packages/react-reconciler/src/ReactFiberCommitWork.js`

```react
function commitLifeCycles(
  finishedRoot: FiberRoot,
  current: Fiber | null,
  finishedWork: Fiber,
  committedExpirationTime: ExpirationTime,
): void {
  switch (finishedWork.tag) {
    case FunctionComponent: {
      // 处理钩子函数
      commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);
      return;
    }
    case ClassComponent: {
      // 获取类组件实例对象
      const instance = finishedWork.stateNode;
      // 如果在类组件中存在生命周期函数判断条件就会成立
      if (finishedWork.effectTag & Update) {
        // 初始渲染阶段
        if (current === null) {
          // 调用 componentDidMount 生命周期函数
          instance.componentDidMount();
        } else {
          // 更新阶段
          // 获取旧的 props
          const prevProps = finishedWork.elementType === finishedWork.type
              ? current.memoizedProps
              : resolveDefaultProps(finishedWork.type, current.memoizedProps);
          // 获取旧的 state
          const prevState = current.memoizedState;
          // 调用 componentDidUpdate 生命周期函数
          // instance.__reactInternalSnapshotBeforeUpdate 快照 getSnapShotBeforeUpdate 方法的返回值
          instance.componentDidUpdate(prevProps, prevState, instance.__reactInternalSnapshotBeforeUpdate);
        }
      }
      // 获取任务队列
      const updateQueue = finishedWork.updateQueue;
      // 如果任务队列存在
      if (updateQueue !== null) {
        /**
         * 调用 ReactElement 渲染完成之后的回调函数
         * 即 render 方法的第三个参数
         */
        commitUpdateQueue(finishedWork, updateQueue, instance);
      }
      return;
    }
}
```

##### 5.2.6.3 commitUpdateQueue

`文件位置: packages/react-reconciler/src/ReactUpdateQueue.js`

```react
/**
 * 执行渲染完成之后的回调函数
 */
export function commitUpdateQueue<State>(
  finishedWork: Fiber,
  finishedQueue: UpdateQueue<State>,
  instance: any,
): void {
  // effects 为数组, 存储任务对象 (Update 对象)
  // 但前提是在调用 render 方法时传递了回调函数, 就是 render 方法的第三个参数
  const effects = finishedQueue.effects;
  // 重置 finishedQueue.effects 数组
  finishedQueue.effects = null;
  // 如果传递了 render 方法的第三个参数, effect 数组就不会为 null
  if (effects !== null) {
    // 遍历 effect 数组
    for (let i = 0; i < effects.length; i++) {
      // 获取数组中的第 i 个需要执行的 effect
      const effect = effects[i];
      // 获取 callback 回调函数
      const callback = effect.callback;
      // 如果回调函数不为 null
      if (callback !== null) {
        // 清空 effect 中的 callback
        effect.callback = null;
        // 执行回调函数
        callCallback(callback, instance);
      }
    }
  }
}
```

##### 5.2.6.4 commitHookEffectListMount

`文件位置: packages/react-reconciler/src/ReactFiberCommitWork.js`

```react
/**
 * useEffect 回调函数调用
 */
function commitHookEffectListMount(tag: number, finishedWork: Fiber) {
  // 获取任务队列
  const updateQueue: FunctionComponentUpdateQueue | null = (finishedWork.updateQueue: any);
  // 获取 lastEffect
  let lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  // 如果 lastEffect 不为 null
  if (lastEffect !== null) {
    // 获取要执行的副作用
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    // 通过遍历的方式调用 useEffect 中的回调函数
    // 在组件中定义了调用了几次 useEffect 遍历就会执行几次
    do {
      if ((effect.tag & tag) === tag) {
        // Mount
        const create = effect.create;
        // create 就是 useEffect 方法的第一个参数
        // 返回值就是清理函数
        effect.destroy = create();
      }
      // 更新循环条件
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```

