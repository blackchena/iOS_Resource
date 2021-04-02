* [Swift org 官方文档](https://docs.swift.org/swift-book/LanguageGuide/TheBasics.html)
* [新的访问控制fileprivate和open](http://www.jianshu.com/p/604305a61e57)
* [ANYCLASS，元类型(.type)和 .SELF](http://swifter.tips/self-anyclass/)
* [Swift Optional Protocol Methods](http://useyourloaf.com/blog/swift-optional-protocol-methods/)
* [playground](https://code.tutsplus.com/zh-hans/tutorials/rapid-interactive-prototyping-with-xcode-playgrounds--cms-26637)
* [swift 调试](http://blog.csdn.net/hello_hwc/article/details/50491813)
* [moya 简书](http://www.jianshu.com/p/c4b57ce13a56)
* [handyjosn 实现原理](http://www.jianshu.com/p/eac4a92b44ef)
* [rxSwift 仿写知乎日报](http://www.jianshu.com/p/7ca8e4b438af)
* [rxswift and RxCocoa 南峰子](http://southpeak.github.io/2017/01/16/Getting-Started-With-RxSwift-and-RxCocoa/)
* [如何写出最简洁优雅的网络封装 Moya + RxSwift](http://www.jianshu.com/p/c1494681400b)
* [swift 协议中的Self](http://swifter.tips/use-self/)
* [Sequence vs Collection](https://academy.realm.io/cn/posts/try-swift-soroush-khanlou-sequence-collection/)
* [Swift UI 学习](https://developer.apple.com/tutorials/swiftui/building-lists-and-navigation)
* [为什么泛型协议不能用于修饰变量或则常量类型(函数参数类型) 还有一个答案讲述类型擦除](https://stackoverflow.com/questions/27725803/how-to-use-generic-protocol-as-a-variable-type)-一个函数不为泛型函数，不可能返回两种不同的类型
* [some 解决Protocol的一些弊端](https://stackoverflow.com/questions/56433665/what-is-the-some-keyword-in-swiftui)
* [swift advance book](https://www.objc.io/books/advanced-swift/)
* [Swift中self和Self](https://www.jianshu.com/p/5059d2993509) - 'Self' is only available in a protocol or as the result of a method in a clas
* [lazy 属性 sequence](https://swift.gg/2016/03/25/being-lazy/)
* [compactMap,flatmap,map](https://www.jianshu.com/p/d8c873e4aee8)

## Swift 必备 tips

* [局部 SCOPE 代码块](https://swifter.tips/local-scope/)
* [Swift 单例的实现与解析](https://juejin.im/post/6844903503689678856) -证明全局变量和静态变量访问时的[懒加载](https://docs.swift.org/swift-book/LanguageGuide/Properties.html#ID263)和[原子性](https://developer.apple.com/swift/blog/?id=7)
* [Enums in swift. An enumeration is a data type… | by Abhimuralidharan | Medium](https://medium.com/@abhimuralidharan/enums-in-swift-9d792b728835)-里面说到了

	> Enum case cannot have a raw value if the enum does not have a raw type

## 缓存/memory disk cache
* [Cache](https://github.com/hyperoslo/Cache)
* [HanekeSwift](https://github.com/Haneke/HanekeSwift)
* write our own cache [1](https://medium.com/@NilStack/swift-world-write-our-own-cache-part-1-data-converter-7941f4701043)-[2](https://medium.com/@NilStack/swift-world-write-our-own-cache-part-2-cache-protocol-a44ae10f5319)-[3](https://medium.com/@NilStack/swift-world-write-our-own-cache-part-3-memory-cache-and-disk-cache-7056948eb52c)-[4](https://medium.com/@NilStack/swift-world-write-our-own-cache-part-4-cache-manager-c117995740d2)-[5](https://medium.com/@NilStack/swift-world-write-our-own-cache-part-5-final-project-98d07df752c1)
* [codable 对象缓存为文件](https://medium.com/@sdrzn/swift-4-codable-lets-make-things-even-easier-c793b6cf29e1)

## SwiftUI@
* [SwiftUI 的 DSL 语法分析](https://mp.weixin.qq.com/s/uP9t72YDo5LLQlDP-7G7wA)
* [How can Property Wrappers and Function Builders be leveraged?](https://medium.com/flawless-app-stories/how-can-property-wrappers-and-function-builders-be-leveraged-d43160de338f)
* [Turning Property Wrappers into Function Wrappers](https://medium.com/flawless-app-stories/turning-property-wrappers-into-function-wrappers-2be3a49229f5)

## Attribute@
* [Dynamic Member Lookup](https://juejin.im/post/5b24c9896fb9a00e69608a71) - 没故事的卓同学

## 闭包@
* 闭包参数名取消 [简书文章](https://www.jianshu.com/p/089542a67d3b) [stackoverflow](https://stackoverflow.com/questions/39613272/xcode-8-function-types-cannot-have-argument-label-breaking-my-build) - error: Function types cannot have argument labels; use \'_ \'before config;

## Pattern@模式@模式匹配
* [介绍所以模式](https://docs.swift.org/swift-book/ReferenceManual/Patterns.html) - wildcard/identifier/value-binding/tuple/Enumeration Case/Optional/Type-Casting/Expression(can overload `~=`)

## 类型转换@
* [Conditional downcast from 'NSDate?' to 'Date' is a bridging conversion; did you mean to use 'as'?](https://stackoverflow.com/questions/43392923/how-to-fix-the-warning-of-type-casting-in-if-let-statement-in-xcode-8-3)

## Any@ AnyObject
* [ANY 和 ANYOBJECT](https://swifter.tips/any-anyobject/)

## Codable@
* [Coadable to Dictionary](https://stackoverflow.com/questions/45209743/how-can-i-use-swift-s-codable-to-encode-into-a-dictionary)
* [Swift 中的结构体与 NSCoding](https://swift.gg/2015/08/27/nscoding_and_swift_structs/)
* [nscoding to codable](https://medium.com/if-let-swift-programming/migrating-to-codable-from-nscoding-ddc2585f28a4)

## warning@error@
* String interpolation produces a debug description for an optional value; did you mean to make this explicit? [stackoverflow](https://stackoverflow.com/questions/42543007/how-to-solve-string-interpolation-produces-a-debug-description-for-an-optional) [Ole Begemann](https://oleb.net/blog/2016/12/optionals-string-interpolation/)

## 代码优化
* [Service-oriented AppDelegate](https://medium.com/ios-os-x-development/pluggableapplicationdelegate-e50b2c5d97dd) - appdelegate 瘦身:http://www.vadimbulavin.com/refactoring-massive-app-delegate/

## MarkDown语法

* [Coding官方markdown语法](https://coding.net/help/doc/project/markdown.html)

## SIL@

* [Swift 底层是怎么调度方法的](https://gpake.github.io/2019/02/11/swiftMethodDispatchBrief/)

* 生成sil `swiftc -emit-silgen -Onone test.swift > test.swift.sil` [来源](https://gpake.github.io/2019/03/06/tryToReadSIL/)
* [Method Dispatch in Swift – RPLabs – Rightpoint Labs](https://www.rightpoint.com/rplabs/switch-method-dispatch-table)
* [Static vs Dynamic Dispatch in Swift: A decisive choice](https://medium.com/flawless-app-stories/static-vs-dynamic-dispatch-in-swift-a-decisive-choice-cece1e872d)
* [Swift 底层是怎么调度方法的 | Gpake's](https://gpake.github.io/2019/02/11/swiftMethodDispatchBrief/)
* [深入理解 Swift 派发机制 | kemchenj](https://kemchenj.github.io/2016-12-25-1/)
* [Swift中的dynamic关键字？ - 简书](https://www.jianshu.com/p/8e1087c79b22)
* [Swift的函数派发 - 简书](https://www.jianshu.com/p/95d8f1cf05bf)
* [Swift的高级中间语言：SIL - 简书](https://www.jianshu.com/p/c2880460c6cd)
* [方法调用的编译和运行:static dispatch和dynamic dispatch - 简书](https://www.jianshu.com/p/e0659093eaac)
* [Swift的函数派发 - 简书](https://www.jianshu.com/p/95d8f1cf05bf)
* [swift的witness table - 简书](https://www.jianshu.com/p/c93d7a7d6771)
* [【基本功】深入剖析Swift性能优化](https://juejin.im/post/5bdbdc876fb9a049f36186c3) nice
* [从一道 iOS 面试题到 Swift 对象模型和运行时细节——「iOS 面试之道」勘误 - 掘金](https://juejin.im/post/5c92b650f265da612f1b973a)
```

* swiftc -emit-silgen -Onone -sdk /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS13.2.sdk -target arm64-apple-ios13.2 /Users/xxx/Desktop/MthodCallTest/MthodCallTest/AppDelegate.swift > test.swift.sil
* swiftc -emit-silgen -Onone  /Users/xxx/Desktop/SwiftCommandLineTest/SwiftCommandLineTest/main.swift > ~/test.swift.sil
* swiftc -o main.out main.swift
* swiftc main.swift -dump-ast
* swiftc main.swift -emit-sil
* swiftc main.swift -emit-ir
* swiftc main.swift -emit-assembly

```

