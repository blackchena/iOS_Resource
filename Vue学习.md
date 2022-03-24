# Vue学习

[vuejs/awesome-vue: 🎉 A curated list of awesome things related to Vue.js](https://github.com/vuejs/awesome-vue)

**import路径**

**1.**@符号代表

Vue项目中不包含webpack.config.js，我们可以使用`vue inspect`来检查动态生成的webpack.config.js配置项，其中有一项如下

```js
alias: {
      '@': '/Users/xxx/Desktop/xxx/xxx/src',
      vue$: 'vue/dist/vue.runtime.esm.js'
    }
```

* [模式和环境变量 | Vue CLI](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)
* [javascript - How to programmatically launch a Vuetify Dialog and wait for the response - Stack Overflow](https://stackoverflow.com/questions/56026220/how-to-programmatically-launch-a-vuetify-dialog-and-wait-for-the-response)函数式弹窗
* [Vue创建组件的方式，你知道几种？ - 掘金](https://juejin.cn/post/6863260665684246542) 函数式弹窗
* [Vue Dialog弹窗解决方案 | springleo's blog](https://lq782655835.github.io/blogs/project/vue-dialog-solution.html)函数式弹窗
* [关于el-dialog，我更推荐的用法 - 云+社区 - 腾讯云](https://cloud.tencent.com/developer/article/1508473)函数式弹窗
* [更优雅的方式使用element的el-dialog - 掘金](https://juejin.cn/post/6980916501314289678)函数式弹窗
* [VSCode 利用 Snippets 设置超实用的代码块 - 掘金](https://juejin.cn/post/6844903869424599053)

## JavaScript

* [块级作用域：var缺陷以及为什么要引入let和const | 浏览器工作原理与实践](https://blog.poetries.top/browser-working-principle/guide/part2/lesson09.html#%E4%BD%9C%E7%94%A8%E5%9F%9F%EF%BC%88scope%EF%BC%89) var vs let
* [ Vue中对象如何新增、修改、删除、筛选属性key值_GongWei_的博客-CSDN博客_vue 删除key](https://blog.csdn.net/GongWei_/article/details/112977859)
* [js改变对象的key，把key替换成想要的key，值不变_w791275692的博客-CSDN博客_js修改对象的key](https://blog.csdn.net/w791275692/article/details/93616293)
* [从[] == ![] 看隐式强制转换机制 · Issue #14 · Aaaaaaaty/blog](https://github.com/Aaaaaaaty/Blog/issues/14)
* [JavaScript中奇特的~运算符 - 知乎](https://zhuanlan.zhihu.com/p/29965306)
* [ECMAScript5.1中文版 + ECMAScript3 + ECMAScript（合集）](http://yanhaijing.com/es5/#203)规范
* [JavaScript 原始值与包装对象 | 微信开放社区](https://developers.weixin.qq.com/community/develop/article/doc/0000e4e55d4b68d7072cbfba85ac13)
* [How to get start and end of day in Javascript? - Stack Overflow](https://stackoverflow.com/questions/8636617/how-to-get-start-and-end-of-day-in-javascript/8636674) setHours

## CSS

* [CSS教學-關於display:inline、block、inline-block的差別 | by YTCLion | Medium](https://ytclion.medium.com/css%E6%95%99%E5%AD%B8-%E9%97%9C%E6%96%BCdisplay-inline-inline-block-block%E7%9A%84%E5%B7%AE%E5%88%A5-1034f38eda82)
* [/deep/ 是什麼？ — 聊聊 Vue 裡的 scoped css | by Debby Ji | Medium](https://medium.com/@debbyji/deep-%E6%98%AF%E4%BB%80%E9%BA%BC-%E8%81%8A%E8%81%8A-vue-%E8%A3%A1%E7%9A%84-scoped-css-d1877f902845)
* [webpack-contrib/css-loader: CSS Loader import 中~符号](https://github.com/webpack-contrib/css-loader#import)
* css中\E794代表unicode字符串:标准unicode字体图标https://utf8-icons.com/，自定义字体可以扩展unicode
* [HTML CSS JS 特殊字符编码表_Jadeon-CSDN博客_javascript特殊符号](https://blog.csdn.net/love_moon821/article/details/103486849)
* 关于child的伪类选择器：`:nth-child(n)、:only-child、:nth-last-child(n)、:first-child、:last-child`
  * `p > :first-child`代表所有p标签的第一个直接子标签
  * `p > span:first-child`代表素有p标签第一个子标签且该子标签是一个span标签
* [CSS 背景图——如何给 Div 添加图片 URL](https://chinese.freecodecamp.org/news/how-to-add-an-image-url-to-your-div/)
* [Specifishity :: Specificity with Fish](https://specifishity.com/)选择器优先级图示
* [带有类的第一个元素的 CSS 选择器 - 协慌网](https://routinepanic.com/questions/css-selector-for-first-element-with-class)
* [css - CSS3 selector :first-of-type with class name? - Stack Overflow](https://stackoverflow.com/questions/6447045/css3-selector-first-of-type-with-class-name) `~`选择器实际上是[General sibling 组合子](https://www.w3.org/TR/css3-selectors/#general-sibling-combinators)
* [HTML中各类空格占位符_lendq的Blog-CSDN博客_html 空格占位符](https://blog.csdn.net/lendq/article/details/78556079)

## VSCode

* [如果prettier开启options.editorconfig不会采用user setting中的prettier配置](https://prettier.io/docs/en/api.html)------[prettier格式化不生效 单引号无效 - shanjinghao - 博客园](https://www.cnblogs.com/shanjinghao/p/12764984.html)

