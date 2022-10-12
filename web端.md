# web

## webpack@

* [webpack 中，module，chunk 和 bundle 的区别是什么？ - 卤蛋实验室 - 博客园](https://www.cnblogs.com/skychx/p/webpack-module-chunk-bundle.html)
* [揭示内部原理 | webpack 中文文档](https://webpack.docschina.org/concepts/under-the-hood/)官方文档介绍chunk
* [Module Federation 没有魔法仅仅是异步chunk - 知乎](https://zhuanlan.zhihu.com/p/352936804)
* [umdjs/umd: UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.](https://github.com/umdjs/umd)什么是UMD
* [webpack-代码拆分模式详解 - SegmentFault 思否](https://segmentfault.com/a/1190000020759399)splitChunks plugin中chunks属性all，async，initial区别
* [前端工程基础知识点--Browserslist (基于官方文档翻译） - 掘金](https://juejin.cn/post/6844903669524086797)

## 布局

* [深入理解CSS外边距折叠（Margin Collapse）](https://segmentfault.com/a/1190000010346113)
* [absolute position的包含元素问题](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/定位#定位上下文)
* [Copy as Fetch - Chrome DevTools - Dev Tips](https://umaar.com/dev-tips/167-copy-as-fetch/)
* [element loading 处理](https://www.jianshu.com/p/c66adc327553)
* [vue 的双向绑定原理及实现 - 前端 - 掘金](https://juejin.im/entry/5923973da22b9d005893805a)
* [vue单页应用如何在页面刷新时保留状态数据 - 掘金](https://juejin.im/post/5aa7d945518825558453ad8c)
* [一张图彻底掌握scrollTop, offsetTop, scrollLeft, offsetLeft...... · Issue #10 · pramper/Blog](https://github.com/pramper/blog/issues/10)


## 开源项目@

* [netease-im/NIM_Web_Demo_H5: 网易云信Web Demo Html5 移动端适配。【推荐客户得京东卡，首次推荐成单得1500元京东卡，连续推荐2000元/单，上不封顶。】点击参与https://yunxin.163.com/promotion/recommend](https://github.com/netease-im/NIM_Web_Demo_H5)
* [Top 21 Amazing VueJs Projects.](https://www.bacancytechnology.com/blog/top-21-amazing-vuejs-projects)
* [OpenLayers 图层(Layers) 详解_qingyafan的博客-CSDN博客_openlayers](https://blog.csdn.net/qingyafan/article/details/45398131)

## ElementUI@

* [element-ui 的组件源码还能这么看 - 掘金](https://juejin.cn/post/6844903812327538702)


## Vue@

### 开源项目@
* [GitHub Top 10 + Vue 开源项目（2021版) - 知乎](https://zhuanlan.zhihu.com/p/409241661)
* [Top 16+ Vue Open Source Projects - Flatlogic Blog](https://flatlogic.com/blog/top-16-vue-open-source-projects/)
* [Top 21 Amazing VueJs Projects.](https://www.bacancytechnology.com/blog/top-21-amazing-vuejs-projects)
* [vuejs/awesome-vue: 🎉 A curated list of awesome things related to Vue.js](https://github.com/vuejs/awesome-vue)
* [2021年，20 个值得学习的 Vue 开源项目 - SegmentFault 思否](https://segmentfault.com/a/1190000039166973)

### 语法@

* [vue中v-model和.sync修饰符区别 - 简书](https://www.jianshu.com/p/f0673a9eba3f)
* [vue修饰符--可能是东半球最详细的文档（滑稽） - SegmentFault 思否](https://segmentfault.com/a/1190000016786254)
* import路径中，@符号代表如下：
	Vue项目中不包含webpack.config.js，我们可以使用`vue inspect`来检查动态生成的webpack.config.js配置项，其中有一项如下

	```js
	alias: {
	      '@': '/Users/xxx/Desktop/xxx/xxx/src',
	      vue$: 'vue/dist/vue.runtime.esm.js'
	    }
	```

### 组件@
* [javascript - How to programmatically launch a Vuetify Dialog and wait for the response - Stack Overflow](https://stackoverflow.com/questions/56026220/how-to-programmatically-launch-a-vuetify-dialog-and-wait-for-the-response)函数式弹窗
* [Vue创建组件的方式，你知道几种？ - 掘金](https://juejin.cn/post/6863260665684246542) 函数式弹窗
* [Vue Dialog弹窗解决方案 | springleo's blog](https://lq782655835.github.io/blogs/project/vue-dialog-solution.html)函数式弹窗
* [关于el-dialog，我更推荐的用法 - 云+社区 - 腾讯云](https://cloud.tencent.com/developer/article/1508473)函数式弹窗
* [更优雅的方式使用element的el-dialog - 掘金](https://juejin.cn/post/6980916501314289678)函数式弹窗
* [模式和环境变量 | Vue CLI](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)



## JavaScript@

* [块级作用域：var缺陷以及为什么要引入let和const | 浏览器工作原理与实践](https://blog.poetries.top/browser-working-principle/guide/part2/lesson09.html#%E4%BD%9C%E7%94%A8%E5%9F%9F%EF%BC%88scope%EF%BC%89) var vs let
* [ Vue中对象如何新增、修改、删除、筛选属性key值_GongWei_的博客-CSDN博客_vue 删除key](https://blog.csdn.net/GongWei_/article/details/112977859)
* [js改变对象的key，把key替换成想要的key，值不变_w791275692的博客-CSDN博客_js修改对象的key](https://blog.csdn.net/w791275692/article/details/93616293)
* [从[] == ![] 看隐式强制转换机制 · Issue #14 · Aaaaaaaty/blog](https://github.com/Aaaaaaaty/Blog/issues/14)
* [JavaScript中奇特的~运算符 - 知乎](https://zhuanlan.zhihu.com/p/29965306)
* [ECMAScript5.1中文版 + ECMAScript3 + ECMAScript（合集）](http://yanhaijing.com/es5/#203)规范
* [JavaScript 原始值与包装对象 | 微信开放社区](https://developers.weixin.qq.com/community/develop/article/doc/0000e4e55d4b68d7072cbfba85ac13)
* [How to get start and end of day in Javascript? - Stack Overflow](https://stackoverflow.com/questions/8636617/how-to-get-start-and-end-of-day-in-javascript/8636674) setHours
* [正则表达式 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)
* [Object initializer - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names)[]中括号修饰包裹变量实现动态属性名
* [模板字符串 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals)\`\`

## Typescript@

* [TypeScript: Documentation - TypeScript 2.3](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-3.html#generic-parameter-defaults)
* [泛型 默认类型 · TypeScript 入门教程](https://ts.xcatliu.com/advanced/generics.html)
* [[译]Typescript 中的泛型参数默认值——TypeScript Evolution 系列第二十一篇 - 掘金](https://juejin.cn/post/7026524830660821006)里面用到{}类型
* [一文读懂 TS 中 Object, object, {} 类型之间的区别 - 腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/1610691){}代表空类型
* [Typescript 关键字 - 掘金](https://juejin.cn/post/7034035155434110990)in
* [TS 类型表达中常用的关键字 - 掘金](https://juejin.cn/post/6844904131975446536)in
* [What does the `in` keyword do in typescript? - Stack Overflow](https://stackoverflow.com/questions/50214731/what-does-the-in-keyword-do-in-typescript)

## CSS@

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
* [Mastering margin collapsing - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)塌陷
* [CSS Modules 用法教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)
* [webpack中使用style-resources-loader - 简书](https://www.jianshu.com/p/13d9f18faafe)
* [html - Parent div not expanding over child's padding - Stack Overflow](https://stackoverflow.com/questions/29692627/parent-div-not-expanding-over-childs-padding)
* [css - Duplicating an element (and its style) with JavaScript - Stack Overflow](https://stackoverflow.com/questions/1848445/duplicating-an-element-and-its-style-with-javascript)//拷贝element和其样式

## 动画@
* [这回试试使用CSS实现抛物线运动效果 « 张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2018/08/css-css3-%E6%8A%9B%E7%89%A9%E7%BA%BF%E5%8A%A8%E7%94%BB/)

## Html元素@Html标签@
* [span与span之间多了一点空白间隔，是什么原因引起的](https://blog.csdn.net/weixin_44730897/article/details/109474429)

## VSCode@

* [如果prettier开启options.editorconfig不会采用user setting中的prettier配置](https://prettier.io/docs/en/api.html)------[prettier格式化不生效 单引号无效 - shanjinghao - 博客园](https://www.cnblogs.com/shanjinghao/p/12764984.html)
* [VSCode 利用 Snippets 设置超实用的代码块 - 掘金](https://juejin.cn/post/6844903869424599053)


## Uniapp@

### 插件@
* [uni_modules | uni-app官网](https://uniapp.dcloud.net.cn/plugin/uni_modules.html) 
> uni_modules插件内components目录同样支持easycom规范，插件使用者可以直接在项目中使用插件内符合easycom规范的组件，当项目或插件内存在easycom组件冲突，编译时会给予提示，您可以通过修改组件目录及组件文件名称来解决冲突问题。
* [已有iOS工程集成uni小程序SDK](https://nativesupport.dcloud.net.cn/UniMPDocs/UseSdk/ios?id=%e7%94%9f%e6%88%90%e5%b0%8f%e7%a8%8b%e5%ba%8f%e5%ba%94%e7%94%a8%e8%b5%84%e6%ba%90)
* [原生插件开发](https://nativesupport.dcloud.net.cn/NativePlugin/offline_package/ios)已有iOS工程集成uni小程序SDK后如何集成插件并使用
* [(uniapp下拉刷新避坑指南_前端新手W的博客-CSDN博客](https://blog.csdn.net/weixin_43167546/article/details/111594328)


## nodejs@

* [config | npm Docs](https://docs.npmjs.com/cli/v8/using-npm/config#registry)npm config 可用配置