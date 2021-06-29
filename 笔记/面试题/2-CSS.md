# CSS

## 基础

1. 如何判断浏览器的怪异模式和标准模式

   - 标准模式下，document.compatMode 的值为 CSS1Compat。怪异模式下，值为 BackCompat

   - 怪异模式是为了兼容旧版本的浏览器, 因为IE低版本document.documentElement.clientWidth获取不到

2. 什么是css盒模型？

   CSS盒模型也叫Box model，它的本质是一个盒子，用来设计和布局时使用，它包括：外边距(margin)  内边距(padding) 、边框(border)、内容区(width、height)，盒模型允许我们在两个元素中间放置元素。

3. 盒模型哪两种模式？什么区别？如何设置

   1. 标准模式: box-sizing: content-box; 宽高不包括内边距和边框
   2. 怪异模式: box-sizing: border-box

4. 对 margin 的 top left  right bottom 设置负值，有何效果？

   1. margin-top 和 margin-left 负值，元素向上、向左移动
   2. margin-right 负值，右侧元素左移，自身不会受影响
   3. margin-bottom 负值，下方元素上移，自身不会受影响

5. css优先级

   !important > ID选择器 > 类选择器、属性选择器或伪类 > 元素和伪元素 >通配选择器*****

6. 如何理解BFC？应用场景有哪些？

   BFC的全称是Block Formatting Context，块级格式化上下文，它是一块**独立的渲染区域**或者说是一个隔离的独立容器，容器**内部元素的渲染不会影响边界以外的元素**。

   形成BFC的条件：

   1. 浮动元素，float 除 none 以外的值
   2. 定位元素，position（absolute，fixed）
   3. overflow 除了 visible 以外的值（hidden，auto，scroll
   4. display 为以下其中之一的值 inline-block，table-cell，table-caption

   BFC的常见应用：

   1. 防止浮动导致父元素高度塌陷：给父元素添加`overflow:hidden`属性
   2. 阻止外边距折叠：上下元素间距重合，若给中间添加`overflow:hidden`
   3. 防止文字环绕：文字标签添加`overflow:hidden`，方式环绕在相邻的浮动标签周围
   
7. line-height如何继承？

   1. 百分比：子元素的高度 = 父元素的字体大小*百分比
   2. 具体数值（px）：子元素高度= 数值
   3. 数字/比例：**子元素高度 = 自身字体大小 * 数字**

8. div 里面如果装着一个 img，会被无故撑高几个像素的原因是什么？

   浏览器的标准模式对于文本对齐的一种规范处理，img是一种类似text的标签元素，在结束的时候，会在末尾加上一个空白符（匿名文本），导致下方会多出来 3px 间距。

   解决方案如下：

   - 给div设置和img一样的高度；缺点：一旦img尺寸改变，我们要重新设置div的高度
   - 给img设置`vertical-align`为除`baseline`以外的值
   - 给img添加display:block; 缺点：需要使用margin: auto来代替text-align:center在div中居中
   - 给img设置浮动；缺点：脱离文档流父元素高度不会被img自动撑开
   - 给div设置`font-size:0;`

9. rem，em，px的区别？

   1. rem：相对于根元素的长度单位，常用于响应式布局。
   2. em：相对于父元素的长度单位
   3. px：绝对长度单位

10. css预编译器的作用？

    提供便捷的语法和特性供开发者编写源代码，随后经过专门的编译工具将源码转化为CSS语法。

    - 嵌套：所有预编译器都支持的语法特性，也是原生CSS最让开发者头疼的问题之一；
    - 变量/运算：增强了源码的可编程能力
    - mixin/继承：增强代码复用性，更便于解决浏览器兼容性；
    - 模块化：提高了源码的可维护性

## 布局

1. 清除浮动有哪几种方式？

   当父元素不给高度的时候，内部元素不浮动时会撑开, 而浮动的时候，父元素变成一条线, 造成塌陷

   1. 末尾添加标签，设置 `clear: both`
   2. `:after`伪元素设置`clear: both`
   3. 添加`:before`和`:after`伪元素：完全符合闭合浮动，末尾伪元素添加 `clear: both`
   4. 父元素添加 `overflow：hidden`

2. 防止margin重叠的方式有哪些？

   父子边距重叠

   1. 外层元素用padding代替
   2. 外层元素添加`overflow:hidden`属性
   3. 外层元素相对定位，内层元素绝对定位
   4. 内层元素加 `float:left` 或 `display: inline-block`
   5. 内层元素边框 `border:间距 soild 外层元素背景色`

   相邻元素重叠

   1. 为其中一个添加`display:inline-block`
   2. 为其中一个添加父元素，并为父元素添加`overflow:hidden`属性

3. flex布局常用的属性有哪些？

   Flexible Box，弹性布局，用来为盒状模型提供最大的灵活性。

   1. flex-direction：主轴的方向，元素的排列方向。
      - row：默认值，从左到右
      - row-reverse：从右到左
      - column：从上到下
      - column-reverse：从下到上
      
   2. flex-wrap：一条轴线排不下，换行的方式
      - nowrap：默认值，不换行
      - wrap：换行，第一行在上方
      - wrap-reverse：换行，第一行在下方
      
   3. justify-content：主轴的对齐方式，结合flex-direction，默认为水平轴
      - flex-start：默认值，左对齐
      - flex-end：右对齐
      - center：居中
      - space-between：两端对齐，元素间隔相等
      - space-around：间隔相等，元素间隔=左右两端间隔*2
      
   4. align-items：交叉轴的对齐方式，结合flex-direction，默认为垂直轴
      
      flex-start：顶端对齐
      
      flex-end：底端对齐
      
      center：与交叉轴的中间点对齐
      
      baseline：与第一行文字的基线对齐
      
      stretch：默认值，如果项目未设置高度或为auto，将占满整个容器高度
      
   5. align-self：单个元素的对齐方式，默认值为auto继承align-items的对齐方式，其它值于align-items一致

4. flex几种简写分别代表什么意思？

   **简写**

   - flex: 0 1 auto => flex-grow: 0; flex-shrink:0; flex-basis: auto
   - flex: 1 => flex-grow: 1
   - flex: none => flex: 0 0 auto
   - flex: auto => flex: 1 1 auto

   **含义**

   - flex-grow：空间足够时，元素的放大比例，0不放大，全都是1代表按照1:1比例等分空间
   - flex-shrink：空间不足时，元素缩小比例。0不缩小，全都是1代表按照1:1比例缩小
   - flex-basis：分配空间之前，元素的初始长度分配基准。

5. 删格化的原理

   1. 比如antd的row和col, 将一行等分为24份, col是几就占几份, 底层按百分比实现
   2. 结合媒体查询, 可以实现响应式

6. 响应式布局的常见方案

   1. media-query，根据不同的屏幕宽度设置根元素的 font-size，页面元素的尺寸使用rem相对继承

      - iPhone5：窗口临界值`max-width: 374px`，根元素 `font-size: 86px`
      - iPhone6/7/8/x：窗口临界值`min-width: 375px; max-width:413px`，根元素 `font-size: 100px`
      - iPhone6p：窗口临界值`min-width: 414px`，根元素 `font-size: 110px`

      弊端：阶梯性质，针对一些特殊手机机型的窗口大小，显示效果不理想

   2. 利用网页视口单位实现

      - vw,vh：网页视口宽度或高度的1/100

        **window.innerHeight = 100vh，window.innerWidth = 100vw**

      - vmax：vw和vh中最大的值

      - vmin：vw和vh中最小的值

7. 栅格布局为什么分为12或24个？

   12是1234的最小公倍数，有利于页面的等分

8. 定位的方式有哪些？relative，absolute，fixed分别相对于哪里定位？

   1. static：默认值
   2. relative：相对自身定位
   3. absolute：相对于上面第一层定位元素定位（relative，fixed），如果外层没有定位元素，相对body
   4. fixed：相对于浏览器窗口定位
   5. sticky：粘性定位，元素遮住滚动而来的“正常”的文档流



## 实战

1. 如何实现圣杯布局和双飞翼布局？

      - 兼容低版本浏览器，按照文档加载顺序排列div，最重要的中间区域最先显示
      - 使用float布局：两侧使用margin负值，让左右两侧的块和中间块重合
      - 防止中间内容被两侧覆盖，一个用padding，一个用margin
      
2. 用flex实现一个三点的骰子

      - 主轴两端对齐，单个元素通过align-self单独设置对齐方式

3. 写出几种实现居中对齐的方式

      1. display：flex
      2. margin: 0 auto；水平居中
      3. inline元素：text-align水平居中，行高垂直
      4. 表格，center,middle；水平垂直
      5. display:table-cell；模拟表格，all
      6. 绝对定位已知高度：上左50% 减自身宽高
      7. 绝对定位未知高度：上下左右全0，margin:auto
      8. 绝对定位未知高度：transform(-50%，-50%)
      9. IE6，IE7：给父元素设一个font-size:高度/1.14,vertical-align:middle

4. 至少两种方式实现自适应搜索

      1. rem, em
      2. 百分比
      3. 媒体查询
      4. bs, antd等的栅格布局

5. 设置一段文字的大小为6px

      通过transform: scale实现。谷歌最小12px, 其他浏览器可以更小。

6. 实现css菊花图

      父元素动画：1.2s后 永远旋转；`antRotate 1.2s infinite linear`

      子元素动画：1s后永远旋转，从无到有旋转405度，逐个延迟0.4s；`antRotate 1s infinite linear`

7. 排列组合：实现2,5,8,11...顺序的块背景色与其它不一致

      nth-child(3n+2)

8. 如何用css实现一个空心三角形？

      - 利用border宽度等于盒模型宽度，只有一侧有颜色
      - 另一个与背景色一样的三角形定位重合

9. CSS3实现环形进度条

      两个对半矩形遮罩, 使用`rotate`以及`overflow: hidden`进行旋转

10. 实现自适应的正方形

      1. 使用vw, vh
      2. `width`百分比, `height: 0`, `padding-top(bottom): 50%`

11. 如何实现自适应九宫格布局

       - grid布局
       - flex布局
       - float布局

12. 实现一个div吸顶效果的方式有哪些？

       1. position: sticky
       2. flex布局
          - 父容器设置 `display: flex; flex-direction: column; height: 100vh;`
          - 内容区设置 `flex: 1; overflow-y: scroll;`
       3. 使用 JQuery 的 offset().top 实现
       4. 使用原生的 offsetTop 实现
       5. 使用 obj.getBoundingClientRect().top 实现

