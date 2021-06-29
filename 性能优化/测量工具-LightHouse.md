# 前言

工欲善其事，必先利其器。了解完性能指标之后，性能优化的目标已经明确了。接下来我们借助一些性能测量工具，明确网页距离优化目标之前还有多大的差距。一个好的工具可以让你事半功倍，接下来我将用3篇文章分别介绍3款主流的测量工具：

1. Chrome DevTools Performance 主要用于日常开发过程中分析运行时的性能表现。
2. Lighthouse 用来生成网页的性能评测报告。
3. WebPageTest 用来进行整体的网站质量评估、一站式性能评估。

有了这3个工具我们就可以从多个维度对网站性能进行全方位的评估。

# 性能测量工具-Lighthouse

Lighthouse是Google开发的一款开源工具，提供一套全面的测试来评估网页质量，包括加载性能、可访问性、最佳实践和PWA。在chrome 60之后的版本，DevTool里已经内置了Lighthouse。

Lighthouse的目标是“Do Better Web”，旨在帮助Web开发者改进他们现有的Web应用程序。通过运行一整套的测试，开发者可以发现新的 Web 平台 API，意识到性能的隐患，并学习（新的）最佳实践。换句话说，就是让开发者在 Web 开发上做得更好。

## 1. 使用方式

### 1.1 使用命令行工具 Node CLI 进行测试

命令行工具则允许开发者将 Lighthouse 集成到持续集成系统。

1. 安装 Lighthouse 作为一个全局节点模块 `npm install -g lighthouse`
2. 针对一个页面运行 Lighthouse 审查 `lighthouse https://www.taobao.com`
   
    ![](https://files.mdnice.com/user/6656/536466f8-0b23-43c3-aa21-31a210e24a6f.png)
3. 最后命令行中会输出一个html页面，打开页面我们就可以查看评估报告了

    ![](https://files.mdnice.com/user/6656/d6e1e854-d6a1-4bd9-8135-d62fb9492ce5.png)
    
    默认情况下，命令行生成的报告页面会从性能（Performance）、易用性（Accessibility）、最佳实践（Best Practices）、SEO、PWA支持程度等几个方面生成评估报告。如果我们想设置类别，只进行 performance 类别测试，可以在命令后面添加 `--only-categories=performance`。
    
    除此之外，lighthouse命令提供了很多选项，以下几个是需要注意的：

    - `--chrome-flags`：用来传入chrome命令行参数，chrome命令行参数是Chrome为了实现实验性功能、方便调试、延伸选项而做的特殊功能，目前已经提供了一千多个参数，完整列表点这里，其中有些参数在服务器部署和运行chrome的时候很有用。
    - `--disable-storage-reset`：在运行前不清空浏览器缓存和其他storage API，可以用来测二次访问的性能情况
    - `--disable-device-emulation`：Lighthouse默认会用Nexus 5X的模拟器测试页面，可以用这个选项禁用掉，尤其是测试PC端页面的时候
    - `--disable-network-throttling`：Lighthouse默认会模拟使用fast 3G的网速，使用这个参数禁用掉网速模拟
    
    
### 1.2 作为node模块使用

我们还可以将Lighthouse作为一个node模块，在自己的工程里调用，代码如下：

```js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

function launchChromeAndRunLighthouse(url, opts, config = null) {
  // 1. 使用chrome launcher打开一个chrome窗口
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    // 2. 在相同的端口运行lighthouse
    return lighthouse(url, opts, config).then(results =>
      chrome.kill().then(() => results));
  });
}

const opts = {
  chromeFlags: ['--show-paint-rects']
};

// Usage:
launchChromeAndRunLighthouse('https://example.com', opts).then(results => {
  // Use results!
});
```


### 1.3 在Chrome DevTools 中使用


1. 按下Command+Opiton+I（Mac）或者Control+shift+I (Windows, Linux) 来打开Devtools
2. 点击LightHouse面板（旧版本的Chrome浏览器是 Audits 面板），可以看到如下界面

   ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42dedbfc12144451b74c0e9fb8ee06de~tplv-k3u1fbpfcp-watermark.image)
   - Device 用来测试设备，移动端或者桌面端
   - Categorles 中选择性能评估的类别
   
3. 比如我们测试淘宝首页，选择测试PC端的网页性能，点击**Generate report**按钮，我们可以在控制台中直接生成有关性能的评估报告

![](https://files.mdnice.com/user/6656/2df0c6b4-89ed-4b06-8aba-81d297b7e09b.png)


### 1.4 通过 Chrome 应用商店安装扩展程序  

   安装地址：https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk

   ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ba33420d1634d78b04aa3e423090ede~tplv-k3u1fbpfcp-watermark.image)

   点击 Generate report 按钮以针对当前打开的页面运行 Lighthouse 测试

   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c43c9425201403fb8799ca6bb2baa86~tplv-k3u1fbpfcp-watermark.image)

**浏览器扩展程序和 devTools 面板的区别**

LightHouse 的扩展程序主要用于测试国外的网站，因为国内好多网站没有国际cdn，测出来的结果往往不太准确。而 devTools中的 LightHouse 面板是在本地的网络环境下测试。

比如我用本地的devTools lightHouse访问抖音官网，评估得分是81分，而扩展程序评估的结果减少1倍的得分，只有40分左右，就是因为CDN资源请求过长导致的。当然如果做国外网站的性能评估，就不用考虑这个问题。

## 2. 评估报告分析

### 2.1 整体质量评估

整体质量评估主要有5个方面：性能（Performance）、可访问性（Accessibility）、网络最佳实践（Best Practies）、搜索引擎优化（SEO）渐进式应用PWA（Progressive Web Apps）

![](https://files.mdnice.com/user/6656/9de24494-5275-4fbf-908a-72e52350b18f.png)


其中**PWA** 是Chrome一直推的一个渐进式Web应用开发，旨在增强 Web 能力，缩小与原生应用的差距并创建与其类似的用户体验。主要包含四大模块，这里简答介绍一下，如下图：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae433b0145474e52a69a30fc9b4e19b0~tplv-k3u1fbpfcp-watermark.image)

### 2.2 性能评估

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64ecafbc983941169bee09ae6ba61772~tplv-k3u1fbpfcp-watermark.image)

性能评估主要包含6大指标：

1. 首次有内容绘制时间（**FCP**，First Contentful Paint）：用于记录页面首次绘制文本、图片、非空白 Canvas 或 SVG 的时间。
2. 最大内容绘制时间（**LCP**，Largest Contentful Paint）：用于记录视窗内最大的元素绘制的时间，该时间会随着页面渲染变化而变化，因为页面中的最大元素在渲染过程中可能会发生改变，另外该指标会在用户第一次交互后停止记录。
3. 速度指数（Speed Index）: 指的是网页以多快的速度展示内容，标准时间是**4s**。
4. 阻塞交互时间（**TBT**, Total Blocking Time）：用户体验指标，代表着页面何时真正进入可用的状态。毕竟光内容渲染的快也不够，还要能迅速响应用户的交互。
5. 用户可交互时间（**TTI**, Time to Interactive）：这个指标并不是指的最早的可交互时间，而是可流畅交互的时间，具体的值为FMP之后，5秒后没有long task执行（50ms以上的任务）的时间
6. 累计布局偏移（**CLS**, Cumulative Layout Shift）：记录了页面上非预期的位移波动。


### 2.3 优化建议

评估之后，LightHouse会给出一些优化建议，如图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba426899041542688fa18e0681e9a319~tplv-k3u1fbpfcp-watermark.image)

我们可以看到两条红色的建议：

1. Preload Largest Contentful Paint image：预加载最大内容绘制图像时间，预加载LCP元素使用的图像以缩短LCP时间（视窗最大可见图片或者文本块的渲染时间）。
2. Avoid multiple page redirects：避免多页重定向，重定向会在加载页面之前引入额外的延迟。

## 3. 测试流程及核心模块

在 CLI 中会输出测试过程中的日志，截图显示如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adf5c012ed9e410e84ff7cbbb29011a1~tplv-k3u1fbpfcp-watermark.image)

通过lighthouse测试过程中输出的日志，可以画出 Lighthouse 的测试流程图：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9747b6c8386b492b9ae9c4ed97d40bed~tplv-k3u1fbpfcp-watermark.image)

1. Lighthouse 与浏览器建立连接。
2. 测试的初始化配置与加载待测试页面。
3. 在页面加载过程中，运行一系列的采集器（Gatherers），每个采集器都会收集自己的目标信息，并生成中间产物（artifacts）。
4. 运行一系列的审计项（Audits），每个审计项都会从中间产物（artifacts）中获取所需的数据，计算出各自的评分。
5. 基于审计项的评分计算出大类的评分，汇总生成报告。

初步了解了基本的测试流程后，我们再看下官方给出的 Lighthouse 架构图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d57d59407ff410ea19f256bbd6acba9~tplv-k3u1fbpfcp-watermark.image)

这里简单介绍一下这几个模块，就不深入研究源码了：

1. Driver 模块：驱动器负责与浏览器的双向通信、记录事件日志、模拟器的设置等。
2. Gatherer 模块：采集者模块会通过 pass 这个配置，定义页面如何加载，并运行配置的所有 gatherers 来采集页面加载过程中的信息，并生成中间产物 artifacts。有了 artifacts，就可以进入下一步的 Audits 模块。
3. Audits 模块：审计模块，与 gatherers 类似，在配置文件中也会定义需要运行的 audits，每一个 audits 也都有与之对应的同名实现文件。当运行完配置文件中定义的所有审计项后，就得到了每个审计项的评分与详情，后续就进入 Report 模块。
4. Report 模块：报告模块的配置文件中，会定义每个测试类别所需的审计项，以及每个审计项所占的权重。

在最终汇总阶段，Lighthouse 会基于该配置文件以及上一个环节中计算出的每个审计项的评分，加权计算出 performance 的评分。并基于每个审计项的评分与种类，将审计项划分为通过与不通过，对于不通过的审计项会给出详细的测试详情与优化指引。

# 参考资料

1. [Lighthouse 测试内幕](https://zhuanlan.zhihu.com/p/91365316)
2. [前端性能其一：使用Lighthouse对掘金主站进行性能分析](https://juejin.cn/post/6844903971727884296#heading-7)
3. [官方文档](https://github.com/GoogleChrome/lighthouse/tree/master/docs)
4. [页面加载性能之LCP](https://zhuanlan.zhihu.com/p/174837488)
5. [Lighthouse架构剖析](https://zhuanlan.zhihu.com/p/343447713)
6. [还在看那些老掉牙的性能优化文章么？这些最新性能指标了解下](https://zhuanlan.zhihu.com/p/159375292)

# 最后

Lighthouse可以作为集成性能测试工具。为我们提供标准的性能报告，在使用过程中我们可以将其集成于CD流程，作为测试的一种，保证我们上线的功能在大多环境下有着优秀的表现。

文中如有错误，欢迎在评论区指正，如果这篇文章帮助到了你，欢迎点赞和关注。

阅读更多优质文章，可以关注我的微信公众号【阳姐讲前端】，每天推送高质量文章，我们一起交流成长。