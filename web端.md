# Web 前端技术文档

## 目录 (TOC)

- [构建工具](#构建工具)
  - [Webpack](#webpack)
  - [Vite](#vite)
- [框架与库](#框架与库)
  - [Vue](#vue)
  - [Next.js](#nextjs)
  - [React](#react)
- [样式与布局](#样式与布局)
  - [CSS](#css)
  - [Tailwind CSS](#tailwind)
  - [布局](#布局)
- [开发工具](#开发工具)
  - [VSCode](#vscode)
  - [调试工具](#debug)
- [组件与 UI](#组件与ui)
  - [组件库](#组件库)
  - [Element UI/Plus](#elementui)
- [性能优化](#性能优化)
  - [图片处理](#图片处理)
  - [懒加载](#图片懒加载)
  - [媒体预加载](#媒体预加载)
  - [PWA](#pwa)
- [动画与交互](#动画与交互)
  - [动画](#动画)
  - [转场动画](#转场动画)
- [移动端开发](#移动端开发)
  - [适配](#适配)
  - [Uniapp](#uniapp)
- [安全](#安全)
  - [XSS](#XSS)
- [其他技术](#其他技术)
  - [JavaScript](#javascript)
  - [TypeScript](#typescript)
  - [Node.js](#nodejs)
  - [CMS](#cms)
	- [营销](#营销emailnewsletter)

---

## 构建工具

### Webpack

- [webpack 中，module，chunk 和 bundle 的区别是什么？ - 卤蛋实验室 - 博客园](https://www.cnblogs.com/skychx/p/webpack-module-chunk-bundle.html)
- [揭示内部原理 | webpack 中文文档](https://webpack.docschina.org/concepts/under-the-hood/)官方文档介绍 chunk
- [Module Federation 没有魔法仅仅是异步 chunk - 知乎](https://zhuanlan.zhihu.com/p/352936804)
- [umdjs/umd: UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.](https://github.com/umdjs/umd)什么是 UMD
- [webpack-代码拆分模式详解 - SegmentFault 思否](https://segmentfault.com/a/1190000020759399)splitChunks plugin 中 chunks 属性 all，async，initial 区别
- [前端工程基础知识点--Browserslist (基于官方文档翻译） - 掘金](https://juejin.cn/post/6844903669524086797)
- [Webpack 生成企业站静态页面 - 项目搭建\_webpack 打包静态页面-CSDN 博客](https://blog.csdn.net/jiciqiang/article/details/137010572)
- [Webpack5 新功能 Module Federation 用法 Module Federation 模块共享整体是通过 - 掘金](https://juejin.cn/post/6910764120698519560)
- [一文通透讲解 webpack5 module federation 本文通过对 webpack5 的 module federat - 掘金](https://juejin.cn/post/7048125682861703181#heading-10)

## 模块@Module@

- [模块 (Module) 简介](https://zh.javascript.info/modules-intro) 执行一次， deferred 执行，

## 样式与布局

### 布局

- [深入理解 CSS 外边距折叠（Margin Collapse）](https://segmentfault.com/a/1190000010346113)
- [absolute position 的包含元素问题](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/定位#定位上下文)
- [Copy as Fetch - Chrome DevTools - Dev Tips](https://umaar.com/dev-tips/167-copy-as-fetch/)
- [element loading 处理](https://www.jianshu.com/p/c66adc327553)
- [vue 的双向绑定原理及实现 - 前端 - 掘金](https://juejin.im/entry/5923973da22b9d005893805a)
- [vue 单页应用如何在页面刷新时保留状态数据 - 掘金](https://juejin.im/post/5aa7d945518825558453ad8c)
- [一张图彻底掌握 scrollTop, offsetTop, scrollLeft, offsetLeft...... · Issue #10 · pramper/Blog](https://github.com/pramper/blog/issues/10)
- [告别 JS 浮层，全新的 CSS Anchor Positioning 锚点定位 API « 张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2024/06/css-anchor-positioning-api/)
- [fisshy/react-scroll: React scroll component](https://github.com/fisshy/react-scroll)锚点定位

### 字体@

- [什么！一个项目给了 8 个字体包？？？根据语言和字宽的不同，自动选择对应的字体。 一段文本如何使用多个字体？ 一段文本如何根 - 掘金](https://juejin.cn/post/7251884086536781880)

### 瀑布流@

- [15+ CSS Masonry Layout Examples](https://freefrontend.com/css-masonry-layout-examples/#google_vignette)
- [Waterfall.js - Pinterest Grid in Just 1KB](https://raphamorim.io/waterfall.js/)
- [Masonry · Layout](https://masonry.desandro.com/layout)
- [Isotope · Filter & sort magical layouts](https://isotope.metafizzy.co/)
- [lfyfly/vue-waterfall-easy: vue 瀑布流组件(vue-waterfall-easy 2.x)](https://github.com/lfyfly/vue-waterfall-easy)
- [eiriklv/react-masonry-component: A React.js component for using @desandro's Masonry](https://github.com/eiriklv/react-masonry-component)
- [Muuri - Infinite layouts with batteries included](https://muuri.dev/)支持拖拽
- [Packery](https://packery.metafizzy.co/)支持自由拖拽的瀑布流布局库

## 框架与库

### Next.js

- [NiklasMencke/nextjs-breadcrumbs: A dynamic, highly customizable breadcrumbs component for Next.js](https://github.com/NiklasMencke/nextjs-breadcrumbs)
- [Creating a Dynamic Breadcrumb Component in a Next.js App Router | by Kristian Cabading | Medium](https://medium.com/@kcabading/creating-a-breadcrumb-component-in-a-next-js-app-router-a0ea24cdb91a)
- [Why do Client Components get SSR'd to HTML? · reactwg/server-components · Discussion #4](https://github.com/reactwg/server-components/discussions/4)客户端组件在服务端也会被渲染
- [next.config.js: output | Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) 打包模式配置文档
- [What are the best open source projects to learn Next.js : r/nextjs](https://www.reddit.com/r/nextjs/comments/19c71ld/comment/kixk24n/?utm_source=share&utm_medium=web2x&context=3)开源项目 plane
- [isomorphic-dompurify - npm](https://www.npmjs.com/package/isomorphic-dompurify)dompurify server version
- [javascript - Next.js DOMPurify.sanitize() shows TypeError: dompurify**WEBPACK*IMPORTED_MODULE_6***default.a.sanitize is not a function - Stack Overflow](https://stackoverflow.com/questions/65646007/next-js-dompurify-sanitize-shows-typeerror-dompurify-webpack-imported-module)
- [NGINX 反向代理 Next.js 项目配置 - 付小晨](https://fuxiaochen.com/snippet/proxy-nextjs-project-with-nginx)

### 环境搭建@

- [Setup Tailwind CSS in a React project configured from scratch with Webpack | a step-by-step guide - DEV Community](https://dev.to/ivadyhabimana/setup-tailwind-css-in-a-react-project-configured-from-scratch-a-step-by-step-guide-2jc8)
- [从零搭建 Webpack/React/Tailwindcss 项目 | Wenson](https://www.iwenson.com/articles/react-with-tailwindcss-from-scratch)
- [Setting up Tailwind CSS v3.0 - Using PostCSS](https://gist.github.com/xpharsh/929e39f23b2d005c966aa795b6013b02)
- [webpack-contrib/image-minimizer-webpack-plugin: Webpack loader and plugin to compress images using imagemin](https://github.com/webpack-contrib/image-minimizer-webpack-plugin/?tab=readme-ov-file)图片压缩
- [html-loader | webpack 中文文档](https://webpack.docschina.org/loaders/html-loader/#options)避免路径被 webpack 解析，导致 public 文件路径编译时报错

### Tailwind CSS

- [重用样式 - Tailwind CSS 中文网](https://tailwind.nodejs.cn/docs/reusing-styles)
- [Setup Webpack with Tailwind CSS](https://gist.github.com/bradtraversy/1c93938c1fe4f10d1e5b0532ae22e16a)
- ["carousel" 7+ Tailwind CSS Components - search results](https://tailwindflex.com/search?q=carousel)组件

### 开源项目@

- [netease-im/NIM_Web_Demo_H5: 网易云信 Web Demo Html5 移动端适配。【推荐客户得京东卡，首次推荐成单得 1500 元京东卡，连续推荐 2000 元/单，上不封顶。】点击参与 https://yunxin.163.com/promotion/recommend](https://github.com/netease-im/NIM_Web_Demo_H5)
- [Top 21 Amazing VueJs Projects.](https://www.bacancytechnology.com/blog/top-21-amazing-vuejs-projects)
- [OpenLayers 图层(Layers) 详解\_qingyafan 的博客-CSDN 博客\_openlayers](https://blog.csdn.net/qingyafan/article/details/45398131)

### 游戏@

- [tccpc/planeWars: 原生js写的飞机大战游戏/JavaScript wrote the aircraft war game](https://github.com/tccpc/planeWars)

## 组件与 UI

### Element UI/Plus

- [element-ui 的组件源码还能这么看 - 掘金](https://juejin.cn/post/6844903812327538702)
- [element-ui 中 Select 选择器异步加载数据就是这样简单 - 掘金](https://juejin.cn/post/7241875961130696759)分页加载实现
- [【vue+Element】el-select 远程搜索&动态加载\_element 远程搜索下拉加载-CSDN 博客](https://blog.csdn.net/Sylviaswefa/article/details/137678906)
- [[Component] [form] 表单控件内嵌套表单，外部表单 label-position：top 时，内部 label-position 会失效 · Issue #10919 · element-plus/element-plus](https://github.com/element-plus/element-plus/issues/10919)

### 表单验证@
- [React Hook Form - performant, flexible and extensible form library](https://react-hook-form.com/)
- [colinhacks/zod: TypeScript-first schema validation with static type inference](https://github.com/colinhacks/zod)

### 国际化@i18n@

- [The progressive guide to jQuery internationalization (i18n) using i18next](https://locize.com/blog/jquery-i18next/)

### Vue

### Inject@Provide@

- [Provide/Inject + TypeScript 使用 - 掘金](https://juejin.cn/post/7000339697142595592)

### 页面缓存@

- [Vue3 除了 keep-alive，还有哪些页面缓存的实现方案 - 掘金](https://juejin.cn/post/7153140300817367054)
- [xiaocheng555/page-cache: vue3 多种页面缓存方式](https://github.com/xiaocheng555/page-cache)

### awesome@

- [sindresorhus/awesome: 😎 Awesome lists about all kinds of interesting topics](https://github.com/sindresorhus/awesome?tab=readme-ov-file) 查看 Front-End Development 前端相关

### 开源项目@

- [GitHub Top 10 + Vue 开源项目（2021 版) - 知乎](https://zhuanlan.zhihu.com/p/409241661)
- [Top 16+ Vue Open Source Projects - Flatlogic Blog](https://flatlogic.com/blog/top-16-vue-open-source-projects/)
- [Top 21 Amazing VueJs Projects.](https://www.bacancytechnology.com/blog/top-21-amazing-vuejs-projects)
- [vuejs/awesome-vue: 🎉 A curated list of awesome things related to Vue.js](https://github.com/vuejs/awesome-vue)
- [2021 年，20 个值得学习的 Vue 开源项目 - SegmentFault 思否](https://segmentfault.com/a/1190000039166973)
- [hoppscotch/hoppscotch: Open source API development ecosystem - https://hoppscotch.io (open-source alternative to Postman, Insomnia)](https://github.com/hoppscotch/hoppscotch)
- [Big succesfull open source projects in Vue 3 : r/vuejs](https://www.reddit.com/r/vuejs/comments/172ysvk/big_succesfull_open_source_projects_in_vue_3/)
- [vue-element-plus-admin/README.zh-CN.md at master · kailong321200875/vue-element-plus-admin](https://github.com/kailong321200875/vue-element-plus-admin/blob/master/README.zh-CN.md)
- [vuetifyjs/vuetify: 🐉 Vue Component Framework](https://github.com/vuetifyjs/vuetify)
- [ly525/luban-h5: [WIP]en: web design tool || mobile page builder/editor || mini webflow for mobile page. zh: 类似易企秀的 H5 制作、建站工具、可视化搭建系统.](https://github.com/ly525/luban-h5)vue2
- [GrowingGit/GitHub-Chinese-Top-Charts: :cn: GitHub 中文排行榜，各语言分设「软件 | 资料」榜单，精准定位中文好项目。各取所需，高效学习。](https://github.com/GrowingGit/GitHub-Chinese-Top-Charts)
- [webstudio-is/webstudio: Open Source alternative to Webflow, check out our CMS launch https://webstudio.is/cms](https://github.com/webstudio-is/webstudio)
- [qier222/YesPlayMusic: 高颜值的第三方网易云播放器，支持 Windows / macOS / Linux](https://github.com/qier222/YesPlayMusic)
- [components.json - shadcn/ui](https://ui.shadcn.com/docs/components-json)
- [简单易懂的 7 个聊天 UI 设计方案](https://mp.weixin.qq.com/s/Rdu0BqPzc2Qx1hTsxnOgvQ)
- [vbenjs/vue-vben-admin: A modern vue admin panel built with Vue3, Shadcn UI, Vite, TypeScript, and Monorepo. It's fast!](https://github.com/vbenjs/vue-vben-admin)vue3 企业框架
- [ant-design/ant-design-pro: 👨🏻‍💻👩🏻‍💻 Use Ant Design like a Pro!](https://github.com/ant-design/ant-design-pro)react
- [DouyinFE/semi-design: 🚀A modern, comprehensive, flexible design system and React UI library. 🎨 Provide more than 3000+ Design Tokens, easy to build your design system. Make Semi Design to Any Design. 🧑🏻‍💻 Design to Code in one click](https://github.com/DouyinFE/semi-design?tab=readme-ov-file)react
- [21+ Best Next.js Admin Dashboard Templates - 2025](https://nextjstemplates.com/blog/admin-dashboard-templates)
- [AykutSarac/jsoncrack.com: ✨ Innovative and open-source visualization application that transforms various data formats, such as JSON, YAML, XML, CSV and more, into interactive graphs.](https://github.com/AykutSarac/jsoncrack.com)
- [学习 Next.js 的最佳开源项目有哪些？ : r/nextjs](https://www.reddit.com/r/nextjs/comments/19c71ld/what_are_the_best_open_source_projects_to_learn/?tl=zh-hans)这里面介绍的还算靠谱
- [Open Source Projects tagged "Nextjs"](https://openalternative.co/topics/nextjs)也还行
- [gitroomhq/postiz-app: 📨 The ultimate social media scheduling tool, with a bunch of AI 🤖](https://github.com/gitroomhq/postiz-app?utm_source=openalternative.co)
- [Open Source Projects tagged "Nextjs"](https://openalternative.co/topics/nextjs)
- [calcom/cal.com: Scheduling infrastructure for absolutely everyone.](https://github.com/calcom/cal.com)开源的日程安排和会议预约系统
- [CRMS Projects Source Code- Explore New Coding Skills](https://opensourcecollection.com/crms-projects)
- [themeselection/materio-mui-nextjs-admin-template-free: An enterprise-grade Next.js admin dashboard template. Made with developer experience first: Next.js v14 (App Router), Material UI (MUI), Tailwind CSS, TypeScript, ESLint, Prettier, VSCode Configs !! 🚀](https://github.com/themeselection/materio-mui-nextjs-admin-template-free)
- [josdejong/jsoneditor: A web-based tool to view, edit, format, and validate JSON](https://github.com/josdejong/jsoneditor)
- [beikeshop/beikeshop: 🔥🔥🔥 Free open source and easy-to-use laravel eCommerce platform, Base on the Laravel . It supports multiple languages and currencies, integrates ChatGPT OpenAI. The platform features customizable visual design and a rich plugins on marketplace.](https://github.com/beikeshop/beikeshop)开源电商 vue + Laravel php

### 组件库@

- [shadcn-ui/ui: Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.](https://github.com/shadcn-ui/ui)不需要 npm 安装，修改源码更容易
- [ionic-team/ionic-framework: A powerful cross-platform UI toolkit for building native-quality iOS, Android, and Progressive Web Apps with HTML, CSS, and JavaScript.](https://github.com/ionic-team/ionic-framework)夸端组件库及打包工具
- [2023 年前端 UI 组件库概述，百花齐放！](https://mp.weixin.qq.com/s/vnOwHA-Dhc-uhQJkQ8xM_Q)
- [foundation/foundation-sites: The most advanced responsive front-end framework in the world. Quickly create prototypes and production code for sites that work on any kind of device.](https://github.com/foundation/foundation-sites)
- [Premium Bootstrap Themes and Templates: Download @ Creative Tim](https://www.creative-tim.com/)
- [Button | Semantic UI](https://semantic-ui.com/elements/button.html)
- [Image | HeroUI (Previously NextUI) - Beautiful, fast and modern React UI Library](https://www.heroui.com/docs/components/image)
- [React Menu component - Material UI](https://mui.com/material-ui/react-menu/)
- [React Bits - Split Text](https://reactbits.dev/text-animations/split-text)
- [Vue Bits - Animated UI Components For Vue](https://vue-bits.dev/)
- [Headless UI - Unstyled, fully accessible UI components](https://headlessui.com/)
- [Shoelace: A forward-thinking library of web components.](https://shoelace.style/)

### 检索@

- [Search - CodeSandbox](https://codesandbox.io/search?query=Blurhash&page=1&configure%5BhitsPerPage%5D=12)

### 事件@

- [自定义事件传参问题 · Issue #5735 · vuejs/vue](https://github.com/vuejs/vue/issues/5735)自定义参数和事件默认参数

### 语法@

- [vuejs3 - Using globalProperties in Vue 3 and Typescript - Stack Overflow](https://stackoverflow.com/questions/64175742/using-globalproperties-in-vue-3-and-typescript)vue3 中使用全局变量不飘红
- [vue 中 v-model 和.sync 修饰符区别 - 简书](https://www.jianshu.com/p/f0673a9eba3f)
- [vue 修饰符--可能是东半球最详细的文档（滑稽） - SegmentFault 思否](https://segmentfault.com/a/1190000016786254)
- import 路径中，@符号代表如下：
  Vue 项目中不包含 webpack.config.js，我们可以使用`vue inspect`来检查动态生成的 webpack.config.js 配置项，其中有一项如下

  ```js
  alias: {
        '@': '/Users/xxx/Desktop/xxx/xxx/src',
        vue$: 'vue/dist/vue.runtime.esm.js'
      }
  ```

- [Vue3 源码 07: 故事要从 createApp 讲起本文会讲到`runtime-dom`和`runtime-core`之间 - 掘金](https://juejin.cn/post/7078939204734058526)通过 createApp render 函数实现响应式编程

### 引用传递@值传递@

- [es6 导出 哪些是值传递哪些是引用传递起因 前些日子创建了一个前端技术交流群。今天一个群友在群里分享了一个问题 我一看 - 掘金](https://juejin.cn/post/7002907466312712200)

### 组件@

- [javascript - How to programmatically launch a Vuetify Dialog and wait for the response - Stack Overflow](https://stackoverflow.com/questions/56026220/how-to-programmatically-launch-a-vuetify-dialog-and-wait-for-the-response)函数式弹窗
- [Vue 创建组件的方式，你知道几种？ - 掘金](https://juejin.cn/post/6863260665684246542) 函数式弹窗
- [Vue Dialog 弹窗解决方案 | springleo's blog](https://lq782655835.github.io/blogs/project/vue-dialog-solution.html)函数式弹窗
- [关于 el-dialog，我更推荐的用法 - 云+社区 - 腾讯云](https://cloud.tencent.com/developer/article/1508473)函数式弹窗
- [更优雅的方式使用 element 的 el-dialog - 掘金](https://juejin.cn/post/6980916501314289678)函数式弹窗
- [模式和环境变量 | Vue CLI](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)
- [dnzng/vue-element-dialog: An imperative call to the el-dialog in element-ui@2.x](https://github.com/dnzng/vue-element-dialog)函数式弹窗
- [封装一个函数式调用的 el-dialog 弹窗组件\_封装 el-dialog-CSDN 博客](https://blog.csdn.net/shujiaxing/article/details/125037811)
- [eBay/nice-modal-react：React 的模态状态管理器。](https://github.com/eBay/nice-modal-react#)有点像函数式弹窗，但是其实不是
- [blog/markdown/elementUI 源码-打造自己的组件库，系列四：Dialog 组件.md at main · xy-sea/blog](https://github.com/xy-sea/blog/blob/main/markdown/elementUI%20%E6%BA%90%E7%A0%81-%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E7%BB%84%E4%BB%B6%E5%BA%93%EF%BC%8C%E7%B3%BB%E5%88%97%E5%9B%9B%EF%BC%9ADialog%E7%BB%84%E4%BB%B6.md)
- [imengyu/vue3-context-menu: A very simple context menu component for Vue3 一个简洁美观简单的 Vue3 右键菜单组件](https://github.com/imengyu/vue3-context-menu) 右键菜单

###解决方案@

- [有意思的水平横向溢出滚动 - ChokCoco - 博客园](https://www.cnblogs.com/coco1s/p/16663752.html)鼠标水平滚动

#### markdown@toc@
* [tscanlin/tocbot: Build a table of contents from headings in an HTML document.](https://github.com/tscanlin/tocbot)
* [ipikuka/next-mdx-remote-client: A wrapper of `@mdx-js/mdx` for `Next.js` applications in order to load MDX content. It is a fork of `next-mdx-remote`.](https://github.com/ipikuka/next-mdx-remote-client?tab=readme-ov-file)里面有提供一些案例的源码链接



#### 旋转木马@carousel@

- [slick - the last carousel you'll ever need](https://kenwheeler.github.io/slick/)
- [swiperjs.com/demos](https://swiperjs.com/demos)

#### toast@alert@popup@

- [SweetAlert2 - a beautiful, responsive, customizable and accessible (WAI-ARIA) replacement for JavaScript's popup boxes](https://sweetalert2.github.io/#examples)
- [Maronato/vue-toastification: Vue notifications made easy!](https://github.com/Maronato/vue-toastification/tree/next)vue3
- [Tippy Instance | Tippy.js](https://atomiks.github.io/tippyjs/v6/tippy-instance/)弹出菜单
- [SweetAlert2 - a beautiful, responsive, customizable and accessible (WAI-ARIA) replacement for JavaScript's popup boxes](https://sweetalert2.github.io/#examples)
- [Getting Started | Floating UI](https://floating-ui.com/docs/getting-started)
- [jquery.dropotron/jquery.dropotron.js at master · ajlkn/jquery.dropotron](https://github.com/ajlkn/jquery.dropotron/blob/master/jquery.dropotron.js)
- [timolins/react-hot-toast: Smoking Hot React Notifications 🔥](https://github.com/timolins/react-hot-toast?tab=readme-ov-file)
- [Replace the default transition | React-Toastify](https://fkhadra.github.io/react-toastify/replace-default-transition)
- [emilkowalski/sonner: An opinionated toast component for React.](https://github.com/emilkowalski/sonner)

### axios@

- [axios 响应拦截器错误处理及思想\_axios 响应拦截器什么场景走 error-CSDN 博客](https://blog.csdn.net/s2422617864/article/details/116917559)
- [kuitos/axios-extensions: 🍱 axios extensions lib, including throttle, cache, retry features etc...](https://github.com/kuitos/axios-extensions)

### 循环检查@重试@

- [sindresorhus/p-retry: Retry a promise-returning or async function](https://github.com/sindresorhus/p-retry)这个库会用到 node-retry 这个库，可以配置指数退避的 factor 为 1 来避免指数退避
- [tim-kos/node-retry: Abstraction for exponential and custom retry strategies for failed operations.](https://github.com/tim-kos/node-retry)
- [Kong/swrv: Stale-while-revalidate data fetching for Vue](https://github.com/Kong/swrv)
- [入门 – SWR](https://swr.vercel.app/zh-CN/docs/getting-started)

### Lru@

- [isaacs/node-lru-cache: A fast cache that automatically deletes the least recently used items](https://github.com/isaacs/node-lru-cache)

## 安全

### XSS

- [leizongmin/js-xss: Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist](https://github.com/leizongmin/js-xss)

## 其他技术

### webpush@

- [web-push-libs/web-push: Web Push library for Node.js](https://github.com/web-push-libs/web-push)
- [Meet Web Push for Safari - WWDC22 - Videos - Apple Developer](https://developer.apple.com/videos/play/wwdc2022/10098/)
- [Web Push for Web Apps on iOS and iPadOS | WebKit](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- [PushSubscription - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)

### JavaScript

- [块级作用域：var 缺陷以及为什么要引入 let 和 const | 浏览器工作原理与实践](https://blog.poetries.top/browser-working-principle/guide/part2/lesson09.html#%E4%BD%9C%E7%94%A8%E5%9F%9F%EF%BC%88scope%EF%BC%89) var vs let
- [ Vue 中对象如何新增、修改、删除、筛选属性 key 值*GongWei*的博客-CSDN 博客\_vue 删除 key](https://blog.csdn.net/GongWei_/article/details/112977859)
- [js 改变对象的 key，把 key 替换成想要的 key，值不变\_w791275692 的博客-CSDN 博客\_js 修改对象的 key](https://blog.csdn.net/w791275692/article/details/93616293)
- [从[] == ![] 看隐式强制转换机制 · Issue #14 · Aaaaaaaty/blog](https://github.com/Aaaaaaaty/Blog/issues/14)
- [JavaScript 中奇特的~运算符 - 知乎](https://zhuanlan.zhihu.com/p/29965306)
- [ECMAScript5.1 中文版 + ECMAScript3 + ECMAScript（合集）](http://yanhaijing.com/es5/#203)规范
- [JavaScript 原始值与包装对象 | 微信开放社区](https://developers.weixin.qq.com/community/develop/article/doc/0000e4e55d4b68d7072cbfba85ac13)
- [How to get start and end of day in Javascript? - Stack Overflow](https://stackoverflow.com/questions/8636617/how-to-get-start-and-end-of-day-in-javascript/8636674) setHours
- [正则表达式 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)
- [Object initializer - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names)[]中括号修饰包裹变量实现动态属性名
- [模板字符串 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals)\`\`
- [thecreation/breakpoints-js: Awesome Breakpoints in JavaScript. (bootstrap supported)](https://github.com/thecreation/breakpoints-js)

### H5 模板@h5template@

- [HTML5 UP! Responsive HTML5 and CSS3 Site Templates](https://html5up.net/)
- [My Sites | My Account | Wix.com](https://manage.wix.com/account/websites?referralAdditionalInfo=Route)
- [TEMPLATED - Free HTML and CSS Website Templates](https://templated.co/)
- [2,000+ Webflow HTML website templates | Webflow](https://webflow.com/templates?utm_source=marketplace)
- [20 个超好看的落地页/首页模板（附源码）](https://mp.weixin.qq.com/s/99JBv89k0nX1fMotifCmUw)
- [Download 3552 Free Website Templates - CSS & HTML | Free CSS](https://www.free-css.com/free-css-templates)
- [60+ Free HTML Website Templates - Responsive & Mobile Ready](https://www.tooplate.com/)
- [Themes | Astro](https://astro.build/themes/)
- [One Page Love - One Page Website Inspiration and Templates](https://onepagelove.com/page/7)
- [Winning websites. Web Design Inspiration - Awwwards](https://www.awwwards.com/websites/) 比较好的设计网站

### HTML 避免写重复代码@

- [.svelte files • Docs • Svelte](https://svelte.dev/docs/svelte/svelte-files)

### 素材@图片资源@

- [免费素材图片](https://www.pexels.com/zh-cn/)
- [Beautiful Free Images & Pictures | Unsplash](https://unsplash.com/)
- [4.5 million+ Stunning Free Images to Use Anywhere - Pixabay - Pixabay](https://pixabay.com/)
- [reshot](https://www.reshot.com/)
- [other](https://picjumbo.com)
- [TinyPNG – Compress WebP, PNG and JPEG images intelligently](https://tinypng.com/)图片压缩
- [模板王 - 10000+免费网页模板,网站模板下载大全](https://www.mobanwang.com/)
- [Combining Images, Data and Intelligence to Transform Your Business](https://www.imgix.com/)图片马赛克
- [littleHiuman/Copyright-free-picture-website: 无版权图片网站（收集）](https://github.com/littleHiuman/Copyright-free-picture-website?tab=readme-ov-file)


### svg@

- [tanem/react-svg: :art: A React component that injects SVG into the DOM.](https://github.com/tanem/react-svg)
- [Next.js - SVGR](https://react-svgr.com/docs/next/)
- [SVG Path Visualizer](https://svg-path-visualizer.netlify.app/)
- [SvgPathEditor](https://yqnn.github.io/svg-path-editor/) drawer
- [Free SVG Backgrounds and Patterns | SVG Backgrounds](https://www.svgbackgrounds.com/set/free-svg-backgrounds-and-patterns/)纹理，star

### TypeScript

- [TypeScript: Documentation - TypeScript 2.3](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-3.html#generic-parameter-defaults)
- [泛型 默认类型 · TypeScript 入门教程](https://ts.xcatliu.com/advanced/generics.html)
- [[译]Typescript 中的泛型参数默认值——TypeScript Evolution 系列第二十一篇 - 掘金](https://juejin.cn/post/7026524830660821006)里面用到{}类型
- [一文读懂 TS 中 Object, object, {} 类型之间的区别 - 腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/1610691){}代表空类型
- [Typescript 关键字 - 掘金](https://juejin.cn/post/7034035155434110990)in
- [TS 类型表达中常用的关键字 - 掘金](https://juejin.cn/post/6844904131975446536)in
- [What does the `in` keyword do in typescript? - Stack Overflow](https://stackoverflow.com/questions/50214731/what-does-the-in-keyword-do-in-typescript)
- [声明文件 · TypeScript 入门教程](https://ts.xcatliu.com/basics/declaration-files.html)
- [TypeScript 实战：快速掌握全局类型声明的方法 - 掘金](https://juejin.cn/post/7191677701097259069) 设置全局可见的 ts 声明
- [Setting noErrorTruncation to false truncates inferred type of variables/functions; which are not errors · Issue #26238 · microsoft/TypeScript](https://github.com/microsoft/TypeScript/issues/26238)VScode Ts 展示完整类型描述
- [visual studio code - How to see a fully-expanded TypeScript type without "N more" and "..."? - Stack Overflow](https://stackoverflow.com/questions/53113031/how-to-see-a-fully-expanded-typescript-type-without-n-more-and)
- [如何让 vscode 显示 typescript 的完整类型？-慕课网](https://coding.imooc.com/learn/questiondetail/vQW1lPEpQJz6yE9A.html)
- [一文让你彻底掌握 TS 枚举在 JavaScript 中布尔类型的变量含有有限范围的值，即 true 和 false。而 - 掘金](https://juejin.cn/post/6844904112669065224)

### 实用工具@utilities@
- [yt-dlp/yt-dlp: A feature-rich command-line audio/video downloader](https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#installation)youtube视频下载

## 动画与交互

### 转场动画@

- [jamiebuilds/tailwindcss-animate: A Tailwind CSS plugin for creating beautiful animations](https://github.com/jamiebuilds/tailwindcss-animate)
- [View Transitions API 实用教程在本文中，我将解释这个 API 是什么以及它是如何工作的。我们将学习在 - 掘金](https://juejin.cn/post/7289952867053731899) [seyedi/view-transition-demo](https://github.com/seyedi/view-transition-demo)需要设置一下 css 样式才生效

```
@view-transition {
  navigation: auto;
}
```

- [6 月新增 Web 平台  |  Blog  |  web.dev](https://web.dev/blog/web-platform-06-2024?hl=zh-cn)里面提到@view-transition
- [页面级可视动画 View Transitions API 初体验 « 张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2024/08/view-transitions-api/)//主题模式切换遮罩动画原理
- [Next.js View Transitions](https://next-view-transitions.vercel.app/)

### 动画@animation@animate@

- [分享八个非常有意思的 Loading 特效（附源码）](https://mp.weixin.qq.com/s?__biz=Mzg2NjY2NTcyNg==&mid=2247495420&idx=1&sn=d3ea7f0c66346dd6cc111a857cabd49f&chksm=ce45fb6df932727be936aa6a29ef1583185ce1f9a805ea986d934574fad1df0bc99fa27b4603&scene=178&cur_album_id=2003210846134419459#rd)
- [这回试试使用 CSS 实现抛物线运动效果 « 张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2018/08/css-css3-%E6%8A%9B%E7%89%A9%E7%BA%BF%E5%8A%A8%E7%94%BB/)
- [【CSS】使用 will-change 来提高页面的渲染速度 - 掘金](https://juejin.cn/post/7015387929870598158)
- [H5 动画实战 - 掘金](https://juejin.cn/post/6949119408967155725)
- [vueuse/motion: 🤹 Vue Composables putting your components in motion](https://github.com/vueuse/motion)
- [vue2-更改 el-dialog 出场动画 - 掘金](https://juejin.cn/post/7109363462463029255)
- [html - How to use transform:translateX to move a child element horizontally 100% across the parent - Stack Overflow](https://stackoverflow.com/questions/21557476/how-to-use-transformtranslatex-to-move-a-child-element-horizontally-100-across)包一层 wrap，移动 wrap
- [michalsnik/aos: Animate on scroll library](https://github.com/michalsnik/aos)超级好用的滑动呈现动画
- [The Spinner CSS Loaders Collection](https://css-loaders.com/spinner/)loading 样式

- [⭐ SVG 变形动画（Morphing） | SVG 动画开发实战](https://svg-animation-booklet.vercel.app/chapter7.html#%E5%A4%9A%E4%B8%AA%E5%8F%98%E6%8D%A2)
- [Snap.svg - Getting Started](http://snapsvg.io/start/)
- [SVG+JS path 等值变化实现 CSS3 兴叹的图形动画 « 张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2014/06/svg-path-d-polyline-points-bezier-curves/)
- [MorphSVG | GSAP | Docs & Learning](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin/)
- [Quick start | Motion for JavaScript](https://motion.dev/docs/quick-start)
- [chokcoco/iCSS: 不止于 CSS](https://github.com/chokcoco/iCSS?tab=readme-ov-file)
- [cyntler/hamburger-react: Animated hamburger menu icons for React.js weighs only 1.5 KB.](https://github.com/cyntler/hamburger-react)菜单图标动画 
- [VincentGarreau/particles.js: A lightweight JavaScript library for creating particles](https://github.com/VincentGarreau/particles.js/)背景粒子动画

### Banner@swiper@

- [Swiper Vue 幻灯片切换组件 | SwiperJS 中文网](https://www.swiperjs.net/vue/#virtual-slides)
- [10 款精美的 HTML5 图片轮播动画 + 打包源码下载](https://mp.weixin.qq.com/s/R8WmEM31NjW1CbhrGKmSjA)paging

### aws@s3@
- [将临时凭证用于 AWS 资源 - AWS Identity and Access Management](https://docs.aws.amazon.com/zh_cn/IAM/latest/UserGuide/id_credentials_temp_use-resources.html#using-temp-creds-sdk)
- [Amazon S3 的操作、资源和条件键 - 服务授权参考](https://docs.aws.amazon.com/zh_cn/service-authorization/latest/reference/list_amazons3.html)
- [Amazon S3 如何与 IAM 配合使用 - Amazon Simple Storage Service](https://docs.aws.amazon.com/zh_cn/AmazonS3/latest/userguide/security_iam_service-with-iam.html#security_iam_service-with-iam-roles-tempcreds)
- [Amazon S3 API 操作所需的权限 - Amazon Simple Storage Service](https://docs.aws.amazon.com/zh_cn/AmazonS3/latest/userguide/using-with-s3-policy-actions.html#using-with-s3-policy-actions-related-to-buckets)ListObjects（必需）s3:ListBucket

### 进度条@

- [css 渐变实现进度条动画\_linear-gradient 动画 animation-CSDN 博客](https://blog.csdn.net/sam80000/article/details/110190727)

### 主题@

- [pacocoursey/next-themes: Perfect Next.js dark mode in 2 lines of code. Support System preference and any other theme with no flashing](https://github.com/pacocoursey/next-themes?tab=readme-ov-file)

### CMS@WordPress@

- [如何添加 WordPress 的目录：2 种简单的方法和最好的插件如何添加 WordPress 的目录。2 个简单的方法和最好的插件 - 掘金](https://juejin.cn/post/7130977891885514782)
- [Strapi - Open source Node.js Headless CMS 🚀](https://strapi.io/)
- [The Content Operating System | Sanity](https://www.sanity.io/)
- [Try Prismic - Homepage](https://prismic.io/try/pages/aH4JthEAACoAmspv/?s=unclassified&section=Main&id=call_to_action%241d5e99e6-b0c0-4d8f-942c-be30148ebb66)
- [ConnectThink/WP-SCSS: Wordpress Plugin that compiles sass using scssphp](https://github.com/ConnectThink/WP-SCSS)注意编辑该插件的 setting 中的路径，根路径可以选择当前主题，scss 文件会实时编译为 css 文件储存
- [WordPress 更换域名后-后台无法进入，网站模版错乱，css 失效，网页中图片不显示。完整解决方案（含宝塔设置）\_wordpress 替换域名后后台进不去-CSDN 博客](https://blog.csdn.net/cplvfx/article/details/132283426)环境迁移注意事项
- 解决 wordpress 迁移后升级组件报错：Update failed: Could not move the old version to the upgrade-temp-backup directory.
- [WordPress/gutenberg: The Block Editor project for WordPress and beyond. Plugin is available from the official repository.](https://github.com/WordPress/gutenberg)
- [ubuntu+nginx 搭建 wordpress 的建站教程 – RTTR 的博客](https://www.yanwenkai.com/?p=59)
- [如何在 WordPress 中使用本地自定义字段（以及 5 个有用的例子）WordPress 的自定义字段是任意的数据位，你可以应 - 掘金](https://juejin.cn/post/7111553901136085005)
- [WordPress 函数:add_shortcode - 闪电博](https://www.wbolt.com/tools/function-add_shortcode)在内容中插入相当于自定义 html 组件
- [9d8dev/next-wp: Headless WordPress built with the Next.js App Router and React Server Components](https://github.com/9d8dev/next-wp)
- [Key Concepts – REST API Handbook | Developer.WordPress.org](https://developer.wordpress.org/rest-api/key-concepts/)
- [Next.js Starter for WordPress Headless CMS](https://vercel.com/templates/next.js/nextjs-wordpress-headless-cms)

### 营销@Email@Newsletter@

- [Home | Mailchimp](https://us10.admin.mailchimp.com/) Mailchimp 管理后台
- [Create email - Beefree | No-code email & page design suite](https://beefree.io/app/1472981/1459908/2510367/newmessage)
- [Nodemailer 使用Gmail发送邮件_nodemailer gmail-CSDN博客](https://blog.csdn.net/wsj_weixiao/article/details/126158396)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
* [使用 OAuth 2.0 访问 Google API  |  Authorization  |  Google for Developers](https://developers.google.com/identity/protocols/oauth2?hl=zh-cn)
* [Can I email… "position" search results](https://www.caniemail.com/search/?s=position)
* [leemunroe/responsive-html-email-template: A free simple responsive HTML email template](https://github.com/leemunroe/responsive-html-email-template?tab=readme-ov-file)

### XML@/HTML@
- [cheeriojs/cheerio: The fast, flexible, and elegant library for parsing and manipulating HTML and XML.](https://github.com/cheeriojs/cheerio)

### 浏览器指纹@

- [fingerprintjs/fingerprintjs: The most advanced browser fingerprinting library.](https://github.com/fingerprintjs/fingerprintjs?tab=readme-ov-file)//相同浏览器窗口不同显示器生成不一样，不同浏览器不一样

### CSS

- [CSS 教學-關於 display:inline、block、inline-block 的差別 | by YTCLion | Medium](https://ytclion.medium.com/css%E6%95%99%E5%AD%B8-%E9%97%9C%E6%96%BCdisplay-inline-inline-block-block%E7%9A%84%E5%B7%AE%E5%88%A5-1034f38eda82)
- [/deep/ 是什麼？ — 聊聊 Vue 裡的 scoped css | by Debby Ji | Medium](https://medium.com/@debbyji/deep-%E6%98%AF%E4%BB%80%E9%BA%BC-%E8%81%8A%E8%81%8A-vue-%E8%A3%A1%E7%9A%84-scoped-css-d1877f902845)
- [webpack-contrib/css-loader: CSS Loader import 中~符号](https://github.com/webpack-contrib/css-loader#import)
- css 中\E794 代表 unicode 字符串:标准 unicode 字体图标https://utf8-icons.com/，自定义字体可以扩展unicode
- [HTML CSS JS 特殊字符编码表\_Jadeon-CSDN 博客\_javascript 特殊符号](https://blog.csdn.net/love_moon821/article/details/103486849)
- 关于 child 的伪类选择器：`:nth-child(n)、:only-child、:nth-last-child(n)、:first-child、:last-child`
  - `p > :first-child`代表所有 p 标签的第一个直接子标签
  - `p > span:first-child`代表素有 p 标签第一个子标签且该子标签是一个 span 标签
- [CSS 背景图——如何给 Div 添加图片 URL](https://chinese.freecodecamp.org/news/how-to-add-an-image-url-to-your-div/)
- [Specifishity :: Specificity with Fish](https://specifishity.com/)选择器优先级图示
- [带有类的第一个元素的 CSS 选择器 - 协慌网](https://routinepanic.com/questions/css-selector-for-first-element-with-class)
- [css - CSS3 selector :first-of-type with class name? - Stack Overflow](https://stackoverflow.com/questions/6447045/css3-selector-first-of-type-with-class-name) `~`选择器实际上是[General sibling 组合子](https://www.w3.org/TR/css3-selectors/#general-sibling-combinators)
- [HTML 中各类空格占位符\_lendq 的 Blog-CSDN 博客\_html 空格占位符](https://blog.csdn.net/lendq/article/details/78556079)
- [HTML 里如何显示空格和换行？ - 乐码范](https://www.lema.fun/post/show-spaces-in-html-4n0cc828c)
- [Mastering margin collapsing - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)塌陷
- [CSS Modules 用法教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)
- [webpack 中使用 style-resources-loader - 简书](https://www.jianshu.com/p/13d9f18faafe)
- [html - Parent div not expanding over child's padding - Stack Overflow](https://stackoverflow.com/questions/29692627/parent-div-not-expanding-over-childs-padding)
- [css - Duplicating an element (and its style) with JavaScript - Stack Overflow](https://stackoverflow.com/questions/1848445/duplicating-an-element-and-its-style-with-javascript)//拷贝 element 和其样式

### 字体@描边@渐变@阴影@渐变边框@

- [CSS 和 SVG 实现文字渐变、描边、投影在一些 web 活动页中经常能看到特殊处理的标题文字，比如这样的 暂时忽略掉特殊字 - 掘金](https://juejin.cn/post/7010944239609577508)
- [不要图片？CSS 实现圆角边框渐变色+背景透明前言 👏 不要图片？CSS 实现圆角边框渐变色+背景透明，最近在工作中常常实现 - 掘金](https://juejin.cn/post/7240458275269984314)完美
- [CSS 实现渐变圆角边框利用 css 的属性 mask、mask-composite，实现带有圆角、渐变、且内容背景透明的 - 掘金](https://juejin.cn/post/7288568920051056697)
- [巧妙实现带圆角的渐变边框 - ChokCoco - 博客园](https://www.cnblogs.com/coco1s/p/12321837.html)
* [渐变边框文字效果？CSS 轻松拿捏！ - ChokCoco - 博客园](https://www.cnblogs.com/coco1s/p/18312942)
* [CSS实现字体渐变、文字描边（空心文字）、文字倒影、文字渐变色描边一、字体渐变 -webkit-background-c - 掘金](https://juejin.cn/post/7321410824676818981)我使用的渐变字体描边参考

### 低代码@

- [react-dnd 从入门到手写低代码编辑器拖拽是常见的需求，在 react 里我们会用 react-dnd 来做。 不 - 掘金](https://juejin.cn/post/7274140856034017332)

## 性能优化

### 图片处理@

- [GitHub - Jacksgong/webp-converter: Converter PNG/JPG to Webp and scan all changes](https://github.com/Jacksgong/webp-converter)
- [ApiClient.ts — nodebox — CodeSandbox](https://codesandbox.io/p/sandbox/unsplash-image-search-bn3rn?file=%2Fsrc%2Fmodules%2Fmain%2Finfrastructure%2Fhttp%2FApiClient.ts) blurhash 封装加载图片
- [BlurHash](https://blurha.sh/)BlurHash is a compact representation of a placeholder for an image.
- [The "Blur Up" Technique for Loading Background Images | CSS-Tricks](https://css-tricks.com/the-blur-up-technique-for-loading-background-images/)css 背景 blur up 方案
- [Usage | Plaiceholder](https://plaiceholder.co/docs/usage)通过该工具生成 base64 的 lqip 低质量图片占位
- [steambap/png-to-ico: convert png to ico format](https://github.com/steambap/png-to-ico)
- [Add support for ICO format · Issue #1118 · lovell/sharp](https://github.com/lovell/sharp/issues/1118)

### 图片懒加载@

- [aFarkas/lazysizes: High performance and SEO friendly lazy loader for images (responsive and normal), iframes and more, that detects any visibility changes triggered through user interaction, CSS or JavaScript without configuration.](https://github.com/aFarkas/lazysizes) 还可以实现 blurup 效果
- [verlok/vanilla-lazyload: LazyLoad is a lightweight, flexible script that speeds up your website by deferring the loading of your below-the-fold images, backgrounds, videos, iframes and scripts to when they will enter the viewport. Written in plain "vanilla" JavaScript, it leverages IntersectionObserver, supports responsive images and enables native lazy loading.](https://github.com/verlok/vanilla-lazyload)

### 媒体预加载@

- [预加载音频和视频，从而快速播放 | Articles | web.dev](https://web.dev/articles/fast-playback-with-preload?hl=zh-cn)自本文发布以来，Chrome 和 Safari 都不支持 `<link rel="preload" as="video">`

### PWA@

- [1.6 你的第一个 PWA · PWA 应用实战](https://lavas-project.github.io/pwa-book/chapter01/6-your-first-pwa.html)
- [利用 workbox 实现资源的预下载 | wss.cool](https://wss.cool/docs/%E5%B0%8F%E5%8A%9F%E8%83%BD/%E5%88%A9%E7%94%A8workbox%E5%AE%9E%E7%8E%B0%E8%B5%84%E6%BA%90%E7%9A%84%E9%A2%84%E4%B8%8B%E8%BD%BD/)
- [初识 Service Worker —— 使用 Workbox 快速开发 Service Worker - 宝硕博客](https://blog.baoshuo.ren/post/workbox-service-worker/)
- [使用 workbox 开发 PWA](https://mp.weixin.qq.com/s/GU0MR86_a1M6p3iRGJTTXg)Service Worker Packages：在 worker 线程中使用，最终文件代码通过构建编译生成
- [利用 workbox 实现资源的预下载 | wss.cool](https://wss.cool/docs/%E5%B0%8F%E5%8A%9F%E8%83%BD/%E5%88%A9%E7%94%A8workbox%E5%AE%9E%E7%8E%B0%E8%B5%84%E6%BA%90%E7%9A%84%E9%A2%84%E4%B8%8B%E8%BD%BD/) 动态生成 sw.js
- [【PWA 学习与实践】(3) 让你的 WebApp 离线可用 - AlienZHOU's blog](https://alienzhou.github.io/blog/15235151669706.html)
- [4.4 Service Worker 调试 · PWA 应用实战](https://lavas-project.github.io/pwa-book/chapter04/4-service-worker-debug.html) Android 安装 pwa 调试
- [HOME · PWA 应用实战](https://lavas-project.github.io/pwa-book/)
- [workbox-cli  |  Modules  |  Chrome for Developers](https://developer.chrome.com/docs/workbox/modules/workbox-cli?hl=zh-cn)
- [安装  |  web.dev](https://web.dev/learn/pwa/installation?hl=zh-cn) iOS 可以多次安装 pwa
- [Vue | Frameworks | Vite PWA](https://vite-pwa-org.netlify.app/frameworks/vue.html)检查网站是否更新

### prompt@

- [share-best-prompt/Same.dev/Same.dev Prompt_v20250325.txt at main · shareAI-lab/share-best-prompt](https://github.com/shareAI-lab/share-best-prompt/blob/main/Same.dev/Same.dev%20Prompt_v20250325.txt)mock

### mcp@skill@

- [Cursor如何使用Agent Skills？技能功能完整教程 - Cursor](https://cursor.zone/faq/cursor-agent-skills-guide.html)

### clipPath@

- - [Clippy — CSS clip-path maker](https://bennettfeely.com/clippy/)

### cls@

- [优化 Cumulative Layout Shift  |  Articles  |  web.dev](https://web.dev/articles/optimize-cls?hl=zh-cn)
- [PageSpeed Insights](https://pagespeed.web.dev/?hl=zh-cn)测试 cls

### cookie@

- [JSREI/js-cookie-monitor-debugger-hook: js cookie 逆向利器：js cookie 变动监控可视化工具 & js cookie hook 打条件断点](https://github.com/JSREI/js-cookie-monitor-debugger-hook?tab=readme-ov-file)

### Hook@

- [juliencrn/usehooks-ts: React hook library, ready to use, written in Typescript.](https://github.com/juliencrn/usehooks-ts)
- [rehooks/awesome-react-hooks: Awesome React Hooks](https://github.com/rehooks/awesome-react-hooks?tab=readme-ov-file)

## 移动端开发

### 适配@屏幕大小适配@

- [H5 端 rem 适配方案与 viewport 适配 - 耶温 - 博客园](https://www.cnblogs.com/yevin/p/14668202.html)
- [evrone/postcss-px-to-viewport: A plugin for PostCSS that generates viewport units (vw, vh, vmin, vmax) from pixel units. The best choice to create a scalable interface on different displays by one design size.](https://github.com/evrone/postcss-px-to-viewport)
- [kaysonli/v-fit-columns: Auto fit el-table-column with cell content.](https://github.com/kaysonli/v-fit-columns)eltable 自适应宽度

### 文件夹内容对比@

```
rsync -avnc /Users/xxx/Downloads/dist\ 3  /Users/xxx/Desktop/dist
diff -r '/Users/xxx/Downloads/dist 3' /Users/xxx/Desktop/dist
```
* [kpdecker/jsdiff: A javascript text differencing implementation.](https://github.com/kpdecker/jsdiff)

### Html 元素@Html 标签@

- [span 与 span 之间多了一点空白间隔，是什么原因引起的](https://blog.csdn.net/weixin_44730897/article/details/109474429)


## 开发工具

### VSCode@

- [如果 prettier 开启 options.editorconfig 不会采用 user setting 中的 prettier 配置](https://prettier.io/docs/en/api.html)------[prettier 格式化不生效 单引号无效 - shanjinghao - 博客园](https://www.cnblogs.com/shanjinghao/p/12764984.html)
- [VSCode 利用 Snippets 设置超实用的代码块 - 掘金](https://juejin.cn/post/6844903869424599053)
- [vscode 中如何调试 nextjs](https://www.52interview.com/solutions/84)
- [我真是被几百个 page.js 文件搞得一头雾水，还很烦。我知道 vscode 有“模糊搜索”功能，所以“cat/page”应该能用，但当同一个工作区里有多个项目的时候，就还是让人很困惑，而且不准确。有什么解决办法吗？ : r/nextjs](https://www.reddit.com/r/nextjs/comments/1glmmkz/im_so_confused_and_irritated_by_having_hundreds/?tl=zh-hans)index tab 显示不够直观
- [完美解决解决 VSCode remote-ssh 连接云服务器死机的问题\_vs code ssh remote 会卡住-CSDN 博客](https://blog.csdn.net/qq_29619973/article/details/133945381)

### 调试工具@

- [css - Browser developer tools: what is the Position of the HTML element? - Stack Overflow](https://stackoverflow.com/questions/26820942/browser-developer-tools-what-is-the-position-of-the-html-element)打印 getBoundingClientRect
- [查看和更改 CSS  |  Chrome DevTools  |  Chrome for Developers](https://developer.chrome.com/docs/devtools/css?hl=zh-cn)
- [Chrome DevTools 为混淆的文件添加 SourceMap 发布到生产环境的工程常常是经过混淆且不提供 sour - 掘金](https://juejin.cn/post/7135612780006588423)
- [source-map-visualization](https://sokra.github.io/source-map-visualization/)
- [public-apis/public-apis: A collective list of free APIs](https://github.com/public-apis/public-apis)公共api合集
- [mozilla/source-map: Consume and generate source maps.](https://github.com/mozilla/source-map)sourcemap 解析为源文件


### Vite@

- [vitejs/awesome-vite: ⚡️ A curated list of awesome things related to Vite.js](https://github.com/vitejs/awesome-vite#plugins)
- [vite 中环境变量的使用与配置（非常详细） - 掘金](https://juejin.cn/post/7172012247852515335)

### UV@

- [feko2018/python3-brush-ip-uv-pv: 这是一个基于高并发模式来刷网站 ip\uv\pv 量的 python3 脚本！！！](https://github.com/feko2018/python3-brush-ip-uv-pv)
- [python 如何模拟浏览网页 python 模拟浏览器\_imking 的技术博客\_51CTO 博客](https://blog.51cto.com/u_13446/6616515)
- [移动设备模拟  |  ChromeDriver  |  Chrome for Developers](https://developer.chrome.com/docs/chromedriver/mobile-emulation?hl=zh-cn)//selenium 模拟移动设备[Chrome DevTools | Selenium](https://www.selenium.dev/zh-cn/documentation/webdriver/bidirectional/chrome_devtools/)
- [chrome.webRequest  |  API  |  Chrome for Developers](https://developer.chrome.com/docs/extensions/reference/api/webRequest)
- [Selenium-proxy-authentication/main.py at master · Smartproxy/Selenium-proxy-authentication](https://github.com/Smartproxy/Selenium-proxy-authentication/blob/master/main.py)

### CSS

- [sass 中的 @use 与 @forward - 掘金](https://juejin.cn/post/7314109846151217189)

### flex@

- [flex-1 的元素，其高度被子元素撑开的原因及解决方案 - 掘金](https://juejin.cn/post/6931638878512087053)注意没有设定高度/宽度的 flex 容器其 min-height | min-width 被设置为内容高度或者宽度
- [flex:1 不等分的问题\_flex1 没有平分-CSDN 博客](https://blog.csdn.net/weixin_42349568/article/details/124853682) flex 计算拉伸压缩不包含 padding margin，即便设置 borderbox 也没用

### svg@

- [Vue3！ElementPlus！更加优雅的使用 Icon - 掘金](https://juejin.cn/post/7070293505528037389)
- [vue3 引入使用 svg 图标 - ProsperousEnding - 博客园](https://www.cnblogs.com/ProsperousEnding/p/17934783.html)
- [element-plus & unplugin-icons 实现任意 icon svg 自动导入 - 掘金](https://juejin.cn/post/7272566178446180411)
- [GitHub - JetBrains/svg-sprite-loader: Webpack loader for creating SVG sprites.](https://github.com/JetBrains/svg-sprite-loader) 没有使用过

### 剪切板@clipboard@

- [JS 读取用户粘贴内容，太爽了](https://mp.weixin.qq.com/s/T-KNuQmWC-sPysTMzLAUrA)

### ElementPlus@

- [vue3 使用 element-plus 按需引入插件时，自定义颜色主题失效\_elementui-plus 通过 additionaldata 修改主题色失败-CSDN 博客](https://blog.csdn.net/weixin_43951592/article/details/135814867)
- [Sass 报错 “@use rules must be written before any other rules” - 简书](https://www.jianshu.com/p/c84557b6a903)
- [ElementUI 中 table 多选，翻页/切换条数时有记忆功能\_翻页的自动记忆是什么-CSDN 博客](https://blog.csdn.net/chenjiepds/article/details/88034977)

### 媒体查询@

- [正确使用 HTML5 标签：img, picture, figure 的响应式设计 | Harttle Land](https://harttle.land/2018/05/30/responsive-img-picture.html)
- [JavaScript 侦测手机浏览器的五种方法 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2021/09/detecting-mobile-browser.html)判断是否是手机端里面有提到 react-device-detect

### 富文本@

- [Images example | Tiptap Editor Docs](https://tiptap.dev/docs/examples/basics/images)
- [Modules | VueQuill](https://vueup.github.io/vue-quill/guide/modules.html)
- [tinymce/tinymce: The world's #1 JavaScript library for rich text editing. Available for React, Vue and Angular](https://github.com/tinymce/tinymce)
- [上传图片和文件 | TinyMCE 中文文档中文手册](http://tinymce.ax-z.cn/general/upload-images.php)
- [vue 富文本编辑器 wangeditor 自定义上传图片 以及 解决 复制粘贴 word 没有图片的情况 - 掘金](https://juejin.cn/post/7144335819275255845)
- [wangeditor 粘贴文本+图片实现图片上传功能\_wangeditor pastetexthandle-CSDN 博客](https://blog.csdn.net/weixin_42609002/article/details/123004611)
- [wangEditor 富文本编辑器 V5 版本实现插入自定义图片元素 - 掘金](https://juejin.cn/post/7174795844926275639)
- [wangEditor 生成的 Html 自定义样式](https://www.wangeditor.com/v5/content.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F)[1](https://www.wangeditor.com/demo/css/view.css)
- 在 chrome console 中打印粘贴板中 html 类型的内容：(await (await (await navigator.clipboard.read())[0].getType('text/html')).text())

### Input@

- [基于 Vue3+ElementPlus 的数字范围输入框组件\_前端区间输入框-CSDN 博客](https://blog.csdn.net/gsssshuai/article/details/134037216)

### code input@OTP@验证码@
- [guilhermerodz/input-otp: One time passcode Input. Accessible & unstyled.](https://github.com/guilhermerodz/input-otp)
- [devfolioco/react-otp-input: :heavy_check_mark: OTP Input Component for React](https://github.com/devfolioco/react-otp-input)

### Office@word@pdf@excel@

- [GitHub - 501351981/vue-office: 支持 word(.docx)、excel(.xlsx,.xls)、pdf、pptx 等各类型 office 文件预览的 vue 组件集合，提供一站式 office 文件预览方案，支持 vue2 和 3，也支持 React 等非 Vue 框架。Web-based pdf, excel, word, pptx preview library](https://github.com/501351981/vue-office)
- [gitbrent/xlsx-js-style: SheetJS Community Edition + Basic Cell Styles](https://github.com/gitbrent/xlsx-js-style)xlsx 导出支持单元格背景色等格式，是基于 SheetJS/sheetjs 0.18.5 版本修改

### 包体积@

- [Preact](https://www.preactjs.cn/)react 的轻量替代方案

### 接口@api@

- [面试官：如何防止接口重复请求？我给出了三个方案！](https://mp.weixin.qq.com/s/-XH1OapHyEOeaz653wwuzQ)
- [public-apis/public-apis: A collective list of free APIs](https://github.com/public-apis/public-apis?tab=readme-ov-file)免费测试api

### 文件浏览@

- [filebrowser/filebrowser: 📂 Web File Browser](https://github.com/filebrowser/filebrowser?tab=readme-ov-file)

### 控件@

### 列表@list@
- [ankeetmaini/react-infinite-scroll-component: An awesome Infinite Scroll component in react.](https://github.com/ankeetmaini/react-infinite-scroll-component#readme)列表复用
- [TanStack Virtual](https://tanstack.com/virtual/latest)复用

### banner@

- [Home | Owl Carousel | 2.3.4](https://owlcarousel2.github.io/OwlCarousel2/)
- [slick - the last carousel you'll ever need](https://kenwheeler.github.io/slick/)
- [Tiny slider](https://ganlanyuan.github.io/tiny-slider/demo/)

### Slider@

- [noUiSlider - JavaScript Range Slider | Refreshless.com](https://refreshless.com/nouislider/)多滑块 slider
- [Examples | TypeGPU](https://docs.swmansion.com/TypeGPU/examples/#example=rendering--jelly-slider)胶条果冻duangduang进度条

### astro@ssg@ssr@

- [CSS Styles | Astro Breadcrumbs](https://docs.astro-breadcrumbs.kasimir.dev/styling/css-api/)

### VSCode@

### VSCode 插件@

- [vscode 快捷键-选中 html 标签内文本(效率大大提高)\_vscode html 选中标签-CSDN 博客](https://blog.csdn.net/billycoder/article/details/122688379)快捷选择标签

### Jquery@

### JQuery 插件@

- [Jquery 合集\_w3cschool](https://www.w3cschool.cn/jquerygroup/)

### Refactor@

- [Refactoring source code in Visual Studio Code](https://code.visualstudio.com/docs/editor/refactoring)

### 杂记@

- `<div class="overflow-hidden"><div class="overflow-auto"></div></div> //监听内部div ResizeObserver这种情况下div即便设置了max-height即盒高度不变也会触发监听`

### Uniapp@

### 插件@

- [uni_modules | uni-app 官网](https://uniapp.dcloud.net.cn/plugin/uni_modules.html)
  > uni_modules 插件内 components 目录同样支持 easycom 规范，插件使用者可以直接在项目中使用插件内符合 easycom 规范的组件，当项目或插件内存在 easycom 组件冲突，编译时会给予提示，您可以通过修改组件目录及组件文件名称来解决冲突问题。
- [已有 iOS 工程集成 uni 小程序 SDK](https://nativesupport.dcloud.net.cn/UniMPDocs/UseSdk/ios?id=%e7%94%9f%e6%88%90%e5%b0%8f%e7%a8%8b%e5%ba%8f%e5%ba%94%e7%94%a8%e8%b5%84%e6%ba%90)
- [原生插件开发](https://nativesupport.dcloud.net.cn/NativePlugin/offline_package/ios)已有 iOS 工程集成 uni 小程序 SDK 后如何集成插件并使用
- [(uniapp 下拉刷新避坑指南\_前端新手 W 的博客-CSDN 博客](https://blog.csdn.net/weixin_43167546/article/details/111594328)
- [Cheat Sheet](https://docs.emmet.io/cheat-sheet/)emmet html 可用的 abbreviations

### Node.js

- [config | npm Docs](https://docs.npmjs.com/cli/v8/using-npm/config#registry)npm config 可用配置
- [phpwkhtmltopdf - Wkhtmltopdf does not render Chart.JS 2.5.0 graph - Stack Overflow](https://stackoverflow.com/questions/42561036/wkhtmltopdf-does-not-render-chart-js-2-5-0-graph)
- [ES6 conversion ES5 (Babel.js online test) js escape js new syntax compatible with old browsers](https://jstool.gitlab.io/babel-es6-to-es5/)

### html 转 pdf 或图片@

- [将 Flex/CSS 与 wkhtmltopdf 一起使用 - SegmentFault 思否](https://segmentfault.com/q/1010000043113156)
  与 wkhtmltopdf 作用相同的库（即将 HTML 转换为 PDF 的库）有很多，常见的替代方案包括：

### 1. [WeasyPrint](https://weasyprint.org/)

- 语言：Python
- 特点：支持 CSS3，跨平台，易于集成，开源。
- 适用场景：适合 Python 项目，需要较好 CSS 支持。

### 2. [Puppeteer](https://pptr.dev/) / [playwright](https://playwright.dev/)

- 语言：Node.js
- 特点：基于 Chromium，无头浏览器，支持高度自定义渲染和抓取。
- 适用场景：需要复杂 JS 渲染的网页，或自动化截图/PDF 导出。

### 3. [PrinceXML](https://www.princexml.com/)

- 语言：独立软件（多语言调用）
- 特点：商业软件，专业支持，支持高级排版。
- 适用场景：商业项目，要求高质量 PDF 输出。

### 4. [PDFKit](https://pdfkit.org/)

- 语言：Node.js
- 特点：直接生成 PDF，不依赖浏览器，支持自定义内容。
- 适用场景：需要用脚本生成 PDF，但对 HTML/CSS 支持有限。

### 5. [DomPDF](https://github.com/dompdf/dompdf)

- 语言：PHP
- 特点：简单易用，适合 PHP 项目，HTML/CSS 支持有限。
- 适用场景：PHP 项目。

### 6. [mpdf](https://mpdf.github.io/)

- 语言：PHP
- 特点：支持大部分 HTML/CSS，开源，社区活跃。
- 适用场景：PHP 项目，需要较好 HTML/CSS 支持。

### 7. [jsPDF](https://github.com/parallax/jsPDF)

### 8. [zumerlab/snapdom: snapDOM captures HTML elements to images with exceptional speed and accuracy.](https://github.com/zumerlab/snapdom)

### 数据可视化@

- [What is D3? | D3 by Observable](https://d3js.org/what-is-d3)

### shell@

- `find . -maxdepth 1 -name '*pic.jpg' | while read filename; do newfilename=`echo $filename | sed -E 's|\./(..)pic(\.jpg)|\./pic\1\2|'`; echo  mv $filename $newfilename; done | bash`

### 技术栈检测@

- 在线检测工具
  WhatCMS.org - 输入域名自动检测
  BuiltWith.com - 技术栈分析
  Wappalyzer - 浏览器扩展，自动识别技术
