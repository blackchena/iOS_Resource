## 前期调研

个大平台提供通过Pod集成SDK的方式，Podspec中s.source的配置链接如下：

* 百度资源链接：https://lbsyun-baidu.cdn.bcebos.com/iossdk/map/6.4.0/BaiduMapKitV6.4.0.zip

* 腾讯资源链接：https://res.wx.qq.com/op_res/DHI055JVxYur-5c7ss5McQZj2Y9KZQlp24xwD7FYnF88x8LA8rWCzSfdStN5tiCD

* 阿里资源链接：http://baichuan-sdk-repository.cn-hangzhou.oss-pub.aliyun-inc.com/baichuanRepo/ios/AlibcAddCartComponent/1.0.2.2/AlibcAddCartComponent.zip

他们三者的都是采用Zip的形式储存，百度阿里在资源链接中区分了SDK版本

## Shell学习

* [输入和输出重定向 — linux-guide 0.2.0 文档](https://zj-linux-guide.readthedocs.io/zh_CN/stable/shell/%E8%BE%93%E5%85%A5%E5%92%8C%E8%BE%93%E5%87%BA%E9%87%8D%E5%AE%9A%E5%90%91.html)
* [Linux中的pushd和popd](https://www.jianshu.com/p/53cccae3c443)

查找我本机拥有的shell脚本文件：`find . -type f -regex '.*\.sh' 2>/dev/null`  其中2>/dev/null标准错误重定向到`/dev/null`（一个特殊文件，写入该文件的内容将被舍弃）

之前在阅读脚本时记得有用过一个shell函数，该函数可以执行命令的同时打印该命令日志，依稀记得叫runcommand，这里我们在本机查找该关键字：`grep runcommand ./ -r --include ".*\.sh" -i`

为了方便我们调试脚本可以在脚本文件开头添加`#!/bin/sh -vx`，`-v`好像是打印执行的脚本内容，-x比较有用可以打印脚本中执行的命令及结果

## Podspec lint过程中遇到的问题

### Error

> Ld /Users/xxx/Library/Developer/Xcode/DerivedData/App-gldsbdzvoybrspdyeruaycihndgw/Build/Intermediates.noindex/App.build/Release-iphonesimulator/App.build/Objects-normal/arm64/Binary/App normal arm64 (in target 'App' from project 'App')

当发布Podspec时报上述错误，无论是universal Framework 或是 xcFramework都会报上述错误，加入以下配置可以消除错误：

`s.user_target_xcconfig = {"EXCLUDED_ARCHS[sdk=iphonesimulator*]" => "arm64"}`  

[SDK as Company-Wide Cocoapod - iOSDefender SDK 1.1](https://www.preemptive.com/iosdefender/userguide/en/cocoapod.html)

>  ERROR | [iOS] unknown: Encountered an unknown error (Pod::DSLError) during validation.

如果遇见上述错误，没有提示原因，逐步排查后发现是版本号比当前已发布版本号低

### Warning

我遇到的是license警告但是添加license文件后还是报相同警告，最后清空本地缓存消除了警告：

`pod cache clean xxx`

## 删除我们私有源仓库 spec-repositories中某个版本

```shell
cd ~/.cocoapods/repos/xxxxSpecs/
cd MineFrameworkPodName/
rm -rf  'version'
git status
git add .
git commit -m '-删除版本'
git push origin master
```

## 清空之前测试的Git提交历史

```shell
git checkout --orphan new_master
git add .
git commit -m '初始化'
git branch -D master
git branch -m master
```

## 创建Pod集成Framework的demo过程中遇到错误

* pod init 时报Unknown object version错误， 打开工程修改project format兼容版本，我设置的是Xcode 10.0-compatible

学习Cocoapods源码，查看本地安装的Cocoapods源码路径，gem list --details



给脚本指定Framework Repository路径，该Git仓库管理Framework所有版本包，通过Tag来标记各个版本

[Distributing universal iOS frameworks as XCFrameworks using Cocoapods | by Anurag Ajwani | Medium](https://anuragajwani.medium.com/distributing-universal-ios-frameworks-as-xcframeworks-using-cocoapods-699c70a5c961)



1. 构建XCFramework
2. 创建Git Repository管理XCFramework及其Podspec，记得需要预先创建Podspec文件，以后每次提交会修改其中版本号，当然也可以自己手动修改该文件其它参数
3. 创建私有Source GIt仓库Manage spec-repositories
4. 创建Podspec文件
5. 发布Podspec到私有Source

