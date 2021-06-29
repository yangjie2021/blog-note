# 前言

工欲善其事，必先利其器。了解完性能指标之后，性能优化的目标已经明确了。接下来我们借助一些性能测量工具，明确网页距离优化目标之前还有多大的差距。一个好的工具可以让你事半功倍，接下来我将用3篇文章分别介绍3个主流的测量工具：

1. Chrome DevTools Performance 主要用于日常开发过程中分析运行时的性能表现。
2. Lighthouse 用来生成网页的性能评测报告。
3. WebPageTest 用来进行整体的网站质量评估、一站式性能评估。

有了这3个工具我们就可以从多个维度对网站性能进行全方位的评估。

# 性能测量工具-DevTools Performance

运行时性能表现（runtime performance）指的是当你的页面在浏览器运行时的性能表现，而不是在加载页面的时候的表现。本文将会告诉你怎么用Chrome DevToos Performance功能去分析运行时性能表现。

Performance工具的原名叫TimeLine，也称时序图，在Chrome 58版本中 DevTools Timeline 改名为 Performance。

## 1. 基本配置

### 1.1 启用无痕模式

无痕模式可以保证Chrome在一个相对干净的环境下运行。比如安装了许多chrome插件，这些插件可能会影响我们分析性能表现。

点击浏览器的右上角-打开新的无痕窗口

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f96cb7e6fa894aee8ae8c36ae4d71062~tplv-k3u1fbpfcp-watermark.image)

### 1.2 使用devTools工具

1. 输入需要测试的网站地址，我这里测试的谷歌官方给出的一个测试demo地址：

    https://googlechrome.github.io/devtools-samples/jank/

2. 按下Command+Opiton+I（Mac）或者Control+shift+I (Windows, Linux) 来打开Devtools，点击Performace，我们可以看到如下界面：

    ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc8e29b2c45846a4ae77ba9633ec3732~tplv-k3u1fbpfcp-watermark.image)

### 1.3 设置移动设备CPU

移动设备的CPU一般比台式机和笔记本弱很多。当你想分析页面的时候，可以用CPU控制器（CPU Throttling）来模拟移动端设备CPU。

1. 在DevTools中，点击 Performance 的 tab。
2. 确保 Screenshots checkbox 被选中
3. 点击 Capture Settings 按钮，DevTools会展示很多设置，来模拟各种状况
4. 对于模拟CPU，选择4x slowdown，于是Devtools就开始模拟4倍低速CPU

![image-20210506221901343.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ec5e81bb4c24f83a27f5ae966b9ba0d~tplv-k3u1fbpfcp-watermark.image)

### 1.4 设置DEMO

为了使得这个DEMO有相对统一的运行表现（不同的读者，机器的性能千差万别）。这个DEMO提供了自定义功能，用来确保这个DEMO的统一表现

1. 一直点击 Add 10 这个按钮直到你能很明显看到蓝色小方块移动变慢，在性能比较好的机器上，大概要点击20次左右。
2. 点击 Optimize按钮，你会发现蓝色小方块会变的很快而且动画变得平滑。
3. 点击 un-optimize 按钮，蓝色小方块又会变成之前的模样。

![image-20210506222134945.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c3ed393bb8449c3bfa2f8eacfec401d~tplv-k3u1fbpfcp-watermark.image)
### 1.5 记录运行时表现

在之前的DEMO中，当你运行优化模式的时候，蓝色小方块移动地非常快。为什么呢？明明两个模式都是移动了同样数量的小方块而且移动的时间也一样。那么现在我们在Performance界面下录制下发生的一切，并且学习如何分析这个记录，从而找到非优化模式下的性能瓶颈。

1. 在DevTools中，点击 Record 。这时候Devtools就开始录制各种性能指标

2. 等待8秒钟左右

3. 点击Stop按钮，Devtools停止录制，处理数据，最后后显示性能报告

   ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fb556a0954741d78358e9dfe2c38d80~tplv-k3u1fbpfcp-watermark.image)

   ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8495dc6474e4e69b0c030136a82fcfe~tplv-k3u1fbpfcp-watermark.image)

   ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efc399f025d149fab7e9bc7aa4609901~tplv-k3u1fbpfcp-watermark.image)

## 2. 分析报告

一旦你得到了页面的性能表现报告，那么就可以用它来分析页面的性能，从而找到性能瓶颈。

### 2.1 FPS图

FPS（frames per second）是用来分析动画的一个主要性能指标。能保持在60的FPS的话，那么用户体验就是不错的。

观察FPS图表，如果你发现了一个红色的长条，那么就说明这些帧存在严重问题，有可能导致非常差的用户体验。一般来说，绿色的长条越高，说明FPS越高，用户体验越好。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf84bffbf48342deac55d9fcfe32f238~tplv-k3u1fbpfcp-watermark.image)

### 2.2 CPU图

观察FPS图下方的CPU图，图中的各种颜色代表着在这个时间段内，CPU在各种处理上所花费的时间。如果你看到了某个处理占用了大量的时间，那么这可能就是一个可以找到性能瓶颈的线索。

在CPU图中的各种颜色与Summary面板里的颜色是相互对应的。如下所示：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbe82ebc76354c1392d242e1442b63a9~tplv-k3u1fbpfcp-watermark.image)

### 2.3 屏幕快照

把鼠标移动到FPS，CPU或者NET图表之上，DevToos就会展示这个时间点界面的截图。左右移动鼠标，可以重发当时的屏幕录像。这被称为scrubbing, 他可以用来分析动画的各个细节。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33e7aaebad624c558cbdff3d13c298d2~tplv-k3u1fbpfcp-watermark.image)

### 2.4 Frames

在Frames图表中，把鼠标移动到绿色条状图上，Devtools会展示这个帧的FPS。可以看到每个帧可能都在60ms以上，说明动画对于用户而言已经很卡顿了。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35b97801697c47c7b93a468e2266b1b4~tplv-k3u1fbpfcp-watermark.image)

另外一个好用的小工具就是实时FPS面板，它可以实时展示页面的FPS指标：

1. 按下 Escape 在下方打开控制面板

2. 点击左侧“三个点”的按钮，选择Rendering，打开Rendering面板

   ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1513a23910a84fef80cae0db06e58f36~tplv-k3u1fbpfcp-watermark.image)

3. 在Rendering面板里，激活 Frame Rendering Stats。FPS实时面板就出现在页面的右上方。

   ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfb139be09284781966eb9cc411722fe~tplv-k3u1fbpfcp-watermark.image)

当然这个对于DEMO，可以相当容易观察到性能的问题。但是在现实使用场景下，就不是那么容易观察到了。所以要把常常使用这些工具来分析页面。

## 3. 定位瓶颈

现在已经确定到这个页面的动画性能表现不太好，那么下一步就是找到为什么

1. 注意Summary面板，你会发现CPU花费了大量的时间在rendering上。因为提高性能就是一门做减法的艺术，你的目标就是减少rendering的时间

   ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a10932391db46fe936660b621f0f900~tplv-k3u1fbpfcp-watermark.image)

2. 展开Main图表，Devtools展示了主线程运行状况。X轴代表着时间。每个长条代表着一个event。长条越长就代表这个event花费的时间越长。Y轴代表了调用栈（call stack）。在栈里，上面的event调用了下面的event。

3. 在性能报告中，有很多的数据。可以通过双击，拖动等等动作来放大缩小报告范围，从各种时间段来观察分析报告。

   ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9d0c5f6186c42a79224b40a9282f321~tplv-k3u1fbpfcp-watermark.image)

4. 在事件长条的右上角出，如果出现了红色小三角，说明这个事件是存在问题的，需要特别注意。

5. 双击这个带有红色小三角，在Summary面板会看到详细信息。注意reveal这个链接，双击它会让高亮触发这个事件的event。如果点击了app.js:94这个链接，就会跳转到对应的代码处。

   ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5971a5a50cc14dc9a7986c1e0ae53645~tplv-k3u1fbpfcp-watermark.image)

6. 在`app.update`这个事件的长条下方，有很多被触发的**紫色长条**。如果放大这些事件长条，你会看到它们每个都带有**红色小三角**。点击其中一个紫色事件长条，Devtools在Summary面板里展示了更多关于这个事件的信息。确实，这里有很多reflow的警告。

   ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dc43a4908e5410c84509beeeca0e65c~tplv-k3u1fbpfcp-watermark.image)

7. 在summary面板里点击**app.js:71**链接，Devtools会跳转到需要优化的代码处

   ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41930e71b0534d87a1fc00ab8c94cd04~tplv-k3u1fbpfcp-watermark.image)

OK，性能瓶颈我们已经找到了！除了Performace面板之外，我们还可以通过 **NetWork** 面板分析网络资源的加载情况，通过 **Throtting** 调整网络吞吐，Audit（LIghtHouse）生产评估报告等等。

## 参考资料

1. [Chrome官网文档](https://developer.chrome.com/docs/devtools/evaluate-performance/)
2. [全新Chrome Devtool Performance使用指南](https://zhuanlan.zhihu.com/p/29879682)
3. [chrome开发者工具中的performance面板](https://zhuanlan.zhihu.com/p/267845575)

## 最后

Devtools里面还有很多很多指标需要你去探索，但是，对于怎么用Devtools去分析网页的运行时性能表现，你现在已经有了一个基本的概念。

文中如有错误，欢迎在评论区指正，如果这篇文章帮助到了你，欢迎点赞和关注。

阅读更多优质文章、可以关注我的微信公众号【阳姐讲前端】，每天推送高质量文章，我们一起交流成长。