# CSS

## 简答

1. 什么是css盒模型？

   CSS盒模型也叫Box model，它的本质是一个盒子，用来设计和布局时使用，它包括：外边距(margin)  内边距(padding) 、边框(border)、内容区(width、height)，盒模型允许我们在两个元素中间放置元素。

2. 如何理解BFC？应用场景有哪些？

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

3. 清除浮动有哪几种方式？

   1. 末尾添加标签，设置 `clear: both`
   2. `:after`伪元素设置`clear: both`
   3. 添加`:before`和`:after`伪元素：完全符合闭合浮动，末尾伪元素添加 `clear: both`
   4. 父元素添加 `overflow：hidden`

4. offsetWidth的值如何计算？

   offsetWidth = 内容宽度 + 内边距 + 边框，如果设置了 `box-sizing: border-box` ，offsetWidth = 内容宽度

5. 防止margin重叠的方式有哪些？

   父子边距重叠

   1. 外层元素用padding代替
   2. 外层元素添加`overflow:hidden`属性
   3. 外层元素相对定位，内层元素绝对定位
   4. 内层元素加 `float:left` 或 `display: inline-block`
   5. 内层元素边框 `border:间距 soild 外层元素背景色`

   相邻元素重叠

   1. 为其中一个添加`display:inline-block`
   2. 为其中一个添加父元素，并为父元素添加`overflow:hidden`属性

6. 对 margin 的 top left  right bottom 设置负值，有何效果？

   1. margin-top 和 margin-left 负值，元素向上、向左移动
   2. margin-right 负值，右侧元素左移，自身不会受影响
   3. margin-bottom 负值，下方元素上移，自身不会受影响

7. flex布局常用的属性有哪些？

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

8. flex几种简写分别代表什么意思？

   **简写**

   - flex: 0 1 auto => flex-grow: 0; flex-shrink:0; flex-basis: auto
   - flex: 1 => flex-grow: 1
   - flex: none => flex: 0 0 auto
   - flex: auto => flex: 1 1 auto

   **含义**

   - flex-grow：空间足够时，元素的放大比例，0不放大，全都是1代表按照1:1比例等分空间
   - flex-shrink：空间不足时，元素缩小比例。0不缩小，全都是1代表按照1:1比例缩小
   - flex-basis：分配空间之前，元素的初始长度分配基准。

9. relative，absolute，fixed分别相对于哪里定位？

   1. relative：相对自身定位
   2. absolute：相对于上面第一层定位元素定位（relative，fixed），如果外层没有定位元素，相对body
   3. fixed：相对于浏览器窗口定位

10. line-height如何继承？

   1. 百分比：子元素的高度 = 父元素的字体大小*百分比
   2. 具体数值（px）：子元素高度= 数值
   3. 数字/比例：**子元素高度 = 自身字体大小 * 数字**

11. div 里面如果装着一个 img，会被无故撑高几个像素的原因是什么？

    浏览器的标准模式对于文本对齐的一种规范处理，img是一种类似text的标签元素，在结束的时候，会在末尾加上一个空白符（匿名文本），导致下方会多出来 3px 间距。

    解决方案如下：

    - 给div设置和img一样的高度；缺点：一旦img尺寸改变，我们要重新设置div的高度
    - 给img设置`vertical-align`为除`baseline`以外的值
    - 给img添加display:block; 缺点：需要使用margin: auto来代替text-align:center在div中居中
    - 给img设置浮动；缺点：脱离文档流父元素高度不会被img自动撑开
    - 给div设置`font-size:0;`

12. rem，em，px的区别？

    1. rem：相对于根元素的长度单位，常用于响应式布局。
    2. em：相对于父元素的长度单位
    3. px：绝对长度单位

13. 响应式布局的常见方案

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

14. js的webAPI中如何获取屏幕高度、网页视口高度、body高度？

    1. window.screen.height：屏幕高度
    2. window.innerHeight：网页视口高度
    3. document.body.clientHeight：body高度

15. 栅格布局为什么分为12或24个？

    12是1234的最小公倍数，有利于页面的等分

16. css预编译器的作用？

    提供便捷的语法和特性供开发者编写源代码，随后经过专门的编译工具将源码转化为CSS语法。

    - 嵌套：所有预编译器都支持的语法特性，也是原生CSS最让开发者头疼的问题之一；
    - 变量/运算：增强了源码的可编程能力
    - mixin/继承：增强代码复用性，更便于解决浏览器兼容性；
    - 模块化：提高了源码的可维护性。
    
20. link和@import的区别？

## 笔试

1. 如何实现圣杯布局和双飞翼布局？

      - 兼容低版本浏览器，按照文档加载顺序排列div，最重要的中间区域最先显示
      - 使用float布局：两侧使用margin负值，让左右两侧的块和中间块重合
      - 防止中间内容被两侧覆盖，一个用padding，一个用margin
2. 用flex实现一个三点的骰子

      - 主轴两端对齐，单个元素通过align-self单独设置对齐方式

3. 写出几种实现居中对齐的方式

      水平居中

      - inline元素：text-align:center
      - block元素：margin:auto
      - absolute元素：left:50% + margin-left负值

      垂直居中

      - inline元素：line-height 等于 height 的值
      - absolute元素已知高度：top:50% + margin-top负值
      - absolute元素未知高度：transform(-50%，-50%)
      - absolute元素：top left right bottom = 0 + margin: auto

4. 排列组合：实现2,5,8,11...顺序的块背景色与其它不一致

      nth-child(3n+2)

5. 如何用css实现一个空心三角形？

      - 利用border宽度等于盒模型宽度，只有一侧有颜色
      - 另一个与背景色一样的三角形定位重合

6. 如何实现自适应九宫格布局

      - grid布局
      - flex布局
      - float布局

## 题海

1. 为什么要初始化/重置CSS样式？

2. CSS选择符有哪些？哪些属性可以继承？

3. CSS优先级算法如何计算？

4. CSS3新增伪类有哪些？

5. 伪类和伪元素的区别？

6. 如何修改chrome记住密码后自动填充表单的黄色背景 ？

5. margin和padding分别适合什么场景使？

   **margin:**

      需要在border外侧添加空白时；

      空白处不需要背景（色）时；

     上下相连的两个盒子之间的空白，需要相互抵消时。

   **padding：**

     需要在border内测添加空白时；

     空白处需要背景（色）时；

     上下相连的两个盒子之间的空白，希望等于两者之和时。

8. 请介绍一下CSS3的Flexbox（弹性盒布局模型），以及适用场景？

10. 元素竖向的百分比设定是相对于容器的高度吗？

12. 请解释一下为什么需要清除浮动？清除浮动的方式

13. zoom:1的清除浮动原理?

14. 设置元素浮动后，该元素的display值是多少？

13. 如何在页面上实现一个圆形的可点击区域？

14. 居中对齐有哪些实现方式？div垂直居中的有哪些方式?

15. position有哪些属性？relative和absolute定位原点是？

16. position跟display、margin collapse、overflow、float这些特性相互叠加后会怎么样？

17. absolute的containing block(容器块)计算方式跟正常流有什么不同？

18. box-sizing有哪些值,分别代表?

19. border-radius的值50%和100%的区别？

20. display有哪些值？说明他们的作用。

21. display:inline-block 什么时候会显示间隙？如何解决？(携程)

5. 隐藏元素的方法有哪些？
   display,opcatiy,visibility,position,text-indent(seo时候给H1加背景图，文字偏离出去)

23. CSS里的visibility属性有个collapse属性值是干嘛用的？在不同浏览器下以后什么区别？

24. 你对line-height是如何理解的？line-height继承问题？1,100%，normal分别是什么？

25. 怎么让Chrome支持小于12px 的文字？

26. 让页面里的字体变清晰，变细用CSS怎么做？

27. font-style属性可以让它赋值为“oblique” oblique是什么意思？

28. png、jpg、gif 这些图片格式解释一下，分别什么时候用。

29. 有没有了解过webp？如何判断 当前浏览器是否支持webp？

30. li与li之间有看不见的空白间隔是什么原因引起的？有什么解决办法？

31. 在网页中的应该使用奇数还是偶数的字体？为什么呢？

32. 什么是响应式设计？响应式设计的基本原理是什么？如何兼容低版本的IE？

33. 移动端的布局用过媒体查询吗？

34. rem是什么？rem的原理？rem布局的优缺点

35. 怎么理解rpx属性？

36. rem和em、vw、vh的区别？分别相对于哪个元素？

37. 经常遇到的浏览器的兼容性有哪些？原因，解决方法是什么，常用hack的技巧 ？

38. position:fixed，在android下无效怎么处理？

39. ::before 和 :after中双冒号和单冒号 有什么区别？解释一下这2个伪元素的作用。

40. CSS优化、提高性能的方法有哪些？

41. css3动画怎么实现硬件加速?原理是什么?

42. 如果需要手动写动画，你认为最小时间间隔是多久，为什么？（阿里）

43. overflow: scroll时不能平滑滚动的问题怎么处理？

44. 全屏滚动的原理是什么？用到了CSS的那些属性？

45. requestAnimationFrame有什么用？

46. 什么是CSS 预处理器 / 后处理器？不同预处理器的对比。

47. 抽离样式模块怎么写，说出思路，有无实践经验？[阿里航旅的面试题]

48. css var 自定义变量的兼容性

49. 移动端最小触控区域是多大？

50. 移动端的点击事件的有延迟，时间是多久，为什么会有？ 怎么解决这个延时？（click 有 300ms 延迟,为了实现safari的双击事件的设计，浏览器要知道你是不是要双击操作。）

51. 移动端如何实现边框1px

52. 一个满屏 品 字布局 如何设计?

53. css多列等高如何实现？

54. 有一个高度自适应的div，里面有两个div，一个高度100px，希望另一个填满剩下的高度。

55. 用纯CSS创建一个三角形和扇形？

56. 实现不使用 border 画出1px高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果。

57. 视差滚动效果，如何给每页做不同的动画？（回到顶部，向下滑动要再次出现，和只出现一次分别怎么做？）

58. 实现图标的几种方式？各有什么优劣？

59. 怎么实现iphoneX的安全高度？

60. 实现固定宽高比(width: height = 4: 3)的div，怎么设置
