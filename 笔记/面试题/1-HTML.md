## 浏览器

1. **一个页面从输入 URL 到页面加载显示完成，这个过程中都发生了什么？**
   
   1. 用户输入过程中，浏览器进行下拉联想，根据历史记录补全url，或者添加http协议头
   2. 判断强缓存：是否存在未过期的缓存，如果存在直接渲染页面，否则发起网络请求
   3. 网络请求阶段：
      1. DNS解析域名，读取缓存的ip地址，向服务端发起请求
      2. 建立TCP连接
      3. 浏览器发送get请求
      4. 服务端如果负载均衡的服务器，就会分发给具体的服务器
      5. 返回数据，浏览器根据状态码确认缓存方式(判断协商缓存)
         - 304-读取缓存文件
         - 200-覆盖or创建新的缓存文件
   4. 如果文件是html，开始渲染页面
   5. 页面渲染阶段：
      1. 处理HTML标记，通过HTML Parser+CSS Parser 构建 DOM Tree + CSSOM Tree
         - Doctype：浏览器通过判断文档类型来决定用什么模式来解析，以及切换浏览器模式
         - meta：用来定义的元信息：渲染模式，SEO相关信息
         - title：显示页面标题
         - link：通过href加载或解析外链资源，主要是css
         - style：正常情况下，css不会阻塞DOM树渲染，除非有通过@import动态导入的样式才会阻塞
         - script：正常情况下，js会阻塞页面渲染，除了外链的js添加defer属性
         - img：不会阻塞DOM渲染，但是如果没有设置宽高，加载完成后会触发DOM回流
      2. 整合渲染树：DOM Tree + CSSOM Tree = Render Tree
      3. 布局=>回流/重排：根据渲染树，计算它们在设备视口内的确切位置和大小，生成layout Tree
      4. Painting：根据渲染树和回流得到的几何信息和节点的绝对像素绘制GUI，将图层转换为位图
      5. display：将内容都呈现出来，展示给用户
   6. 静置一段时间后关闭TCP连接
   
2. 浏览器有哪些进程？

   1. 主进程：负责浏览器界面显示；各个页面的管理，创建以及销毁；将渲染进程的结果绘制到用户界面上；网络资源管理
   2. GPU 进程：用于 3D 渲染绘制
   3. 网络进程：发起网络请求
   4. 插件进程：第三方插件处理，运行在沙箱中
   5. 渲染进程：页面渲染、脚本执行、事件处理

6. 介绍一下你对浏览器内核的理解？常见的浏览器内核有哪些？

   **浏览器内核**决定了浏览器如何显示网页的内容以及页面的格式信息。浏览器内核是多线程，在内核控制下各线程相互配合以保持同步，一个浏览器通常由以下常驻线程组成：

   - GUI 渲染线程：页面的渲染，解析HTML、CSS，构建DOM树，布局和绘制
   - JavaScript引擎线程：处理 JavaScript脚本，执行代码
   - 定时触发器线程：执行异步定时器一类的函数的线程，如： setTimeout，setInterval
   - 事件触发线程：将准备好的事件交给 JS引擎线程执行
   - 异步http请求线程：执行异步请求一类的函数的线程，如： Promise，axios，ajax等

   常见5大内核

   | 浏览器  | 内核           | 备注                                                         |
   | ------- | -------------- | ------------------------------------------------------------ |
   | IE      | Trident        | IE、猎豹安全、360极速浏览器、百度浏览器                      |
   | firefox | Gecko          | 打开速度慢、升级频繁、猪一样的队友flash、神一样的对手chrome。 |
   | Safari  | webkit         | 从Safari推出之时起，它的渲染引擎就是Webkit，一提到 webkit，首先想到的便是 chrome，可以说，chrome 将 Webkit内核 深入人心，殊不知，Webkit 的鼻祖其实是 Safari |
   | chrome  | Chromium/Blink | 在 Chromium 项目中研发 Blink 渲染引擎（即浏览器核心），内置于 Chrome 浏览器之中。Blink 其实是 WebKit 的分支。大部分国产浏览器最新版都采用Blink内核。二次开发 |
   | Opera   | blink          | 现在跟随chrome用blink内核                                    |

7. 怎么实现script的异步加载？

   - 标签加上defer或async：两者的区别在于脚本加载完成之后何时执行，如果存在多个有defer属性的脚本，那么它们是按照加载顺序执行脚本的；而对于async，它的加载和执行是紧紧挨着的，无论声明顺序如何，只要加载完成就立刻执行，它对于应用脚本用处不大，因为它完全不考虑依赖。

   - 异步加载JS

     ```js
     getMap.onclick = function(){
        //获得需要插入的位置
        var oDiv = document.getElementById('div');
        //异步创建script
        var script = document.createElement('script');
     
        script.src = 'https://map.baidu.com/...'
     
        oDiv.appendChild(script)
      }
     ```

   - 通过 ajax 去获取 js 代码，然后通过 eval 执行

   - 创建并插入 iframe，让它异步执行 js

     ```js
     var iframe = document.createElement('iframe')
      document.body.appendChild(iframe)
      var doc = iframe.contentWindow.document
      doc.open().write('<body onload="insertJS()">')
      doc.close()
     ```

8. `defer` 和 `async` 的区别

   - defer 要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），在window.onload 之前执行；
   - async 一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。
   - 如果有多个 `defer` 脚本，会按照它们在页面出现的顺序加载
   - 多个 `async` 脚本不能保证加载顺序

9. preload和prefetch的区别？

   浏览器资源加载优先级总共分为五级：very-high、high、medium、low、very-low，其中MainRescource页面、CSS、字体这三个的优先级是最高的，然后就是Script、Ajax这种，而图片、音视频的默认优先级是比较低的，最低的是prefetch预加载的资源。

   prefetch：有时候你可能需要让一些资源先加载好等着用，例如用户输入出错的时候在输入框右边显示一个X的图片，如果等要显示的时候再去加载就会有延时，这个时候可以用一个link标签：

   ```html
   <link rel="prefetch" href="image.png">
   ```

   preload：在早期浏览器，script资源是阻塞加载的，当页面遇到一个script，那么要等这个script下载和执行完了，才会继续解析剩下的DOM结构，也就是说script是串行加载的，并且会堵塞页面其它资源的加载，这样会导致页面整体的加载速度很慢，所以早在2008年的时候浏览器出了一个**推测加载策略**，即遇到script的时候，DOM会停止构建，但是会继续去搜索页面需要加载的资源，如看下后续的html有没有img/script标签，先进行预加载，而不用等到构建DOM的时候才去加载。这样大大提高了页面整体的加载速度。

10. iframe有哪些优缺点？

    iframe的优点：

    - 方便快捷，可以做多个页面的统一风格的头尾
    - 如果遇到加载缓慢的第三方内容（如图标和广告），这些问题可以由iframe来解决。

    iframe的缺点：

    - 会产生很多页面，不容易管理。
    - 用户体验差：框架个数多的话，可能会出现上下、左右滚动条，会分散访问者的注意力。
    - 不利于SEO：搜索引擎爬虫还不能很好的处理iframe中的内容
    - 兼容性差：很多的移动设备（PDA 手机）无法完全显示框架
    - iframe框架页面会增加服务器的http请求，对于大型网站是不可取的

11. 什么是PWA？怎么实现PWA

    PWA全称Progressive Web App，**即渐进式web应用**。一个PWA应用首先是一个网页，可以通过Web技术编写出一个网页应用。随后添加上App Manifest和Service Worker来实现PWA的安装和离线等功能，使得Web应用渐进式接近原生APP

    App Manifest：**Web应用程序清单**在一个JSON文本文件中提供有关应用程序的信息（如名称，作者，图标和描述）。manifest 的目的是**将Web应用程序安装到设备的主屏幕**，不需要用户通过应用商店，伴随着其他功能, 比如离线可用和接收推送通知，为用户提供更快的访问和更丰富的体验。

    Service Worker：Chrome 团队提出和力推的一个 WEB API，用于给 web 应用提供高级的可持续的后台处理能力。

    解决了哪些问题？

    - 可以添加至主屏幕，点击主屏幕图标可以实现启动动画以及隐藏地址栏
    - 实现离线缓存功能，即时用户手机没有网络，依然可以使用一些离线功能
    - 实现了消息推送

12. 什么是FOUC？你如何来避免FOUC？

    FOUC：文档样式短暂失效(Flash of Unstyled Content)的简称，浏览器以无样式显示页面内容的瞬间闪烁现象。

    场景：

    - 使用import方法导入样式表
    - 将样式表放在页面底部
    - 多个样式表放在HTML的不同位置

    原因：当样式表晚于结构性html 加载，当加载到此样式表时，页面将停止之前的渲染。

    解决方案：使用link标签将样式表放在文档head中

## HTML

1. 浏览器的渲染过程？

   1. 处理HTML标记，通过HTML Parser 构建DOM Tree
   2. 处理CSS标记，通过 CSS Parser 构建 CSSOM Tree
   3. 整合渲染树：DOM Tree + CSSOM Tree = Render Tree
   4. 回流=>布局/重排：根据渲染树，计算它们在设备视口内的确切位置和大小
   5. Painting：根据渲染树和回流得到的几何信息和节点的绝对像素进行绘制
   6. display：将内容都呈现出来，展示给用户

2. 浏览器解析html标签的具体过程？

   html标签的解析过程是在GUI渲染线程中进行的。

   1. Doctype：浏览器通过判断文档类型来决定用什么模式来解析，以及切换浏览器模式
   2. Meta：用来定义的元信息：渲染模式，SEO相关信息
   3. title：显示页面标题
   4. Link：通过href加载或解析外链资源，主要是样式
   5. CSS
      - link外链式 ：不阻塞DOM 树渲染，开辟HTTP线程加载资源
      - style内嵌式：不阻塞DOM树渲染，先记录下来，等所有css资源加载成功后，按照顺序依次渲染生成CSSOM树
      - @import导入式：阻塞DOM树渲染，开辟HTTP线程加载资源，资源加载回来，才会继续渲染
   6. script
      - 内嵌式：阻塞DOM树渲染，立即执行js
      - 普通外链式：阻塞DOM树渲染，同时开辟HTTP线程加载资源，加载回来后立即执行js
      - async外链式：开辟HTTP线程加载资源，继续渲染Dom树，加载完成停止DOM渲染，先执行js（不考虑导入顺序，按照加载回来的先后顺序执行）
      - defer外链式：开辟HTTP线程加载资源，等待DOM树渲染完，按照js导入顺序依次执行js
   7. img：不会阻塞DOM渲染，开辟HTTP线程加载src，加载回来后如果没有设置宽高会触发回流

3. 什么回流Reflow？触发机制有哪些？

   DOM结构中各个元素都有自己的盒模型，需要浏览器根据样式计算结果将元素放置在它该出现的位置上，这个过程称之为回流。

   **触发机制**

   - 增删改元素时，导致重绘和回流
   - 移动DOM位置或添加动画时
   - 修改css样式时
   - 浏览器窗口缩放Resize时，滚动页面时
   - 修改网页的默认字体时

4. 什么重绘Repaint？触发机制有哪些？

   当各种盒子的位置、大小、颜色、字体等确定之后，浏览器按照各自的特性绘制后呈现在在页面上，这个过程叫重绘。

   **触发机制**

   - Dom改动
   - Css改动

   **回流必将引起重绘，而重绘不一定会引起回流**

5. 什么是Doctype，它的作用是什么？传统模式和严格模式的区别？

   DTD（document type definition，文档类型定义）是一系列的语法规则，用来定义XML或XHTML的文件类型。浏览器会使用它来判断文档类型，决定使用何种模式来解析，以及切换浏览器模式。

   DOCTYPE是用来声明文档类型定义规范的，一个主要的用途就是验证文件的合法性。如果不合法，浏览器解析会出错。

   **DTD（文档类型定义）定义了一些文档类型，DOCTYPE将类型告诉浏览器，浏览器根据它来决定用什么模式来解析，以及切换浏览器模式。**

   传统模式：包含所有HTML元素和属性，**不包括**展示性和弃用的元素

   严格模式：包含所有HTML元素和属性，**包括**展示性和弃用的元素（浏览器能正常解析）

6. meta标签的viewport对应的content有哪些属性？

   1.  width：设置 viewport 的宽度，正整数/字符串 device-width
   2.  height：设置 viewport 的高度，正整数/字符串 device-height
   3.  initial-scale：设置设备宽度与 viewport大小之间的缩放比例，0.0-10.0之间的正数
   4.  maximum-scale：设置最大缩放系数，0.0-10.0之间的正数
   5.  minimum-scale：设置最小缩放系数，0.0-10.0之间的正数
   6.  user-scalable：如果设置为 no 用户将不能缩放网页，默认为 yes，yes / no

7. 如何理解HTML语义化？

   HTML语义化可以增加代码可读性，有利于搜索引擎优化（SEO）

8. 哪些Html标签是块级元素，哪些是内联元素？

   - 块状元素指的是display:block/table 的元素，特点内容是可以**独占一行**。其中包括：div h1-h6 table ul ol p，pre
   - 内联元素指的是display:inline/inline-block的元素，特点是内容**依次连接直至浏览器的边缘换行**为止。其中包括：span img input button i figure
   
9. 把`<script>`标签放在`</body>`之前和之后有什么区别？浏览器会如何解析它们？

   按照HTML5标准中的HTML语法规则，如果在`</body>`后再出现`<script>`或任何元素的开始标签，都是parse error，浏览器会忽略之前的`</body>`，即视作仍旧在body内。所以实际效果和写在`</body>`之前是没有区别的。

   浏览器解析时，所有标签都会解析进这 head 和body两个标签里边。body之前的任何位置都会解析进head里边，之后的都会解析进body里边。

10. HTML5与之前版本区别？

    1. 文档类型声明方式
    2. 新增元素和属性：布局、表单、音频视频
    3. 更加适应时代要求：移动互联网时代相比pc时代更加迫切希望有一个统一的标准。之前由于各个浏览器不统一，因为修改浏览器兼容引起的bug浪费了大量的时间。在HTML5中视频、音频、图像、动画都会标准化，会解决浏览器兼容这个令人头疼的问题。
    4. 如何处理HTML5新标签的浏览器兼容问题？
       1. 使用静态资源的html5shiv
       2. 使用skill IE6:， 在`</body>`之前调用
       3. 载入后，初始化新标签的样式为 `display: block;`
       4. IE6/IE7/IE8支持通过 `document` 创建标签，利用这一特性让这些浏览器支持HTML5新标签

11. html5有哪些新特性

    1. 布局语义化标签：section、article、aside、header、hgroup、footer、nav、figure、figcaption
    2. form表单属性：formaction、formmetho、placeholder、autofocus、list、autocomplete、
    3. 视频和音频：video、audio 
    4. canvas画布：图形容器、必须使用js脚本来绘制图形

12. HTM5移除了哪些元素？

    默认字体`<basefont>`、字体标签`<font>`、水平居中`<center>` 、下划线 `<u>`、

13. section和article的区别
    - section：表示页面中的一个内容区块，比如章节、页眉、页脚或页面中的其他部分。它可以与h1、h2、h3、h4、h5、h6等元素结合起来使用标记文档结构。
    - article：表示页面中的一块与上下文不相关的独立内容，例如博客中的一篇文章。

14. HTML5的form如何关闭自动完成功能？

    1. 在IE的Internet选项菜单里的内容--自动完成里面设置
    2. 设置form的autocomplete为"off"来关闭form中所有输入框的自动完成功能
    3. 设置input的autocomplete为"off"来关闭该输入框的自动完成功能

15. 页面可见性（Page Visibility API） 可以有哪些用途？

    Page Visibility API由以下三部分组成：

    - document.hidden：表示页面是否隐藏的布尔值。页面隐藏包括 页面在后台标签页中 或者 浏览器最小化 （注意，页面被其他软件遮盖并不算隐藏，比如打开的 sublime 遮住了浏览器）
    - document.visibilityState：表示下面 4 个可能状态的值
       - hidden：页面在后台标签页中或者浏览器最小化，当浏览器最小化、切换tab、电脑锁屏时发生
       - visible：页面在前台标签页中，用户正在查看当前页面时发生
       - prerender：页面在屏幕外执行预渲染处理 document.hidden 的值为 true，文档加载离屏或者不可见发生
       - unloaded：页面正在从内存中卸载，当文档将要被unload时发生
    - Visibilitychange事件：当文档从可见变为不可见或者从不可见变为可见时，会触发该事件

    用途：当浏览器切换标签页的时候动画或者视频暂停播放，切换回来又继续播放动画或视频，可以使用Visibilitychange监测变化

