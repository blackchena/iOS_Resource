分析iOS Crash文件：符号化iOS Crash文件的3种方法
Home About Guestbook Categories Tags Links Subscribe
当你的应用提交到AppStore或者各个渠道之后，请问你多久会拿到crash文件？你如何分析crash文件的呢？



上传crash文件
你的应用应当有模块能够在应用程序crash的时候上传crash信息。 要么通过用户反馈拿到crash文件，要么借助自己或第3方的crash上传模块拿到crash文件。

今天要分析的场景是你拿到用户的.crash文件之后，如何符合化crash文件（Symbolicating crash logs）的3种方法。帮助尽快找到crash原因。



crash文件例子
crash文件的部分内容：

Last Exception Backtrace:

0 CoreFoundation 0x30acaf46 exceptionPreprocess + 126

1 libobjc.A.dylib 0x3af0b6aa objc_exception_throw + 34

2 CoreFoundation 0x30a0152e -[__NSArrayM objectAtIndex:] + 226

3 appName 0x000f462a 0x4000 + 984618

4 appName 0x00352aee 0x4000 + 3468014

…

18 appName 0x00009404 0x4000 + 21508

大家一眼就能看到：

2 CoreFoundation 0x30a0152e -[__NSArrayM objectAtIndex:] + 226
这一行有问题。

但是，第3行和第4行的：

3 appName 0x000f462a 0x4000 + 984618

4 appName 0x00352aee 0x4000 + 3468014

并没有指出到底是app的那个模块导致的问题，如何排查呢？



有如下3种方法



方法1 使用XCode
这种方法可能是最容易的方法了。

要使用Xcode符号化 crash log，你需要下面所列的3个文件：

crash报告（.crash文件）
符号文件 (.dsymb文件)
应用程序文件 (appName.app文件，把IPA文件后缀改为zip，然后解压，Payload目录下的appName.app文件), 这里的appName是你的应用程序的名称。
把这3个文件放到同一个目录下，打开Xcode的Window菜单下的organizer，然后点击Devices tab，然后选中左边的Device Logs。

然后把.crash文件拖到Device Logs或者选择下面的import导入.crash文件。

这样你就可以看到crash的详细log了。 如下图：



方法2 使用命令行工具symbolicatecrash
有时候Xcode不能够很好的符号化crash文件。我们这里介绍如何通过symbolicatecrash来手动符号化crash log。

在处理之前，请依然将“.app“, “.dSYM”和 ".crash"文件放到同一个目录下。现在打开终端(Terminal)然后输入如下的命令：

export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer

然后输入命令：

/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/Library/PrivateFrameworks/DTDeviceKitBase.framework/Versions/A/Resources/symbolicatecrash appName.crash appName.app > appName.log

现在，符号化的crash log就保存在appName.log中了。



方法3 使用命令行工具atos
如果你有多个“.ipa”文件，多个".dSYMB"文件，你并不太确定到底“dSYMB”文件对应哪个".ipa"文件，那么，这个方法就非常适合你。

特别当你的应用发布到多个渠道的时候，你需要对不同渠道的crash文件，写一个自动化的分析脚本的时候，这个方法就极其有用。

这里先介绍一个概念:UUID

什么是UUID
每一个可执行程序都有一个build UUID来唯一标识。Crash日志包含发生crash的这个应用（app）的 build UUID以及crash发生的时候，应用加载的所有库文件的[build UUID]。

那如何知道crash文件的UUID呢？
可以用：

grep "appName armv" *crash

或者

grep --after-context=2 "Binary Images:" *crash

可以得到类似如下的结果：

appName.crash-0x4000 - 0x9e7fff appName armv7 <8bdeaf1a0b233ac199728c2a0ebb4165> /var/mobile/Applications/A0F8AB29-35D1-4E6E-84E2-954DE7D21CA1/appName.crash.app/appName

（请注意这里的0x4000，是模块的加载地址，后面用atos的时候会用到）

如何找到app的UUID
可以使用命令：xcrun dwarfdump -–uuid <AppName.app/ExecutableName>

比如：

xcrun dwarfdump --uuid appName.app/appName

结果如下：

UUID: 8BDEAF1A-0B23-3AC1-9972-8C2A0EBB4165 (armv7) appName.app/appName

UUID: 5EA16BAC-BB52-3519-B218-342455A52E11 (armv7s) appName.app/appName

这个app有2个UUID，表明它是一个fat binnary。

它能利用最新硬件的特性，又能兼容老版本的设备。

对比上面crash文件和app文件的UUID，发现它们是匹配的

8BDEAF1A-0B23-3AC1-9972-8C2A0EBB4165

用atos命令来符号化某个特定模块加载地址
命令是：

atos [-o AppName.app/AppName] [-l loadAddress] [-arch architecture]
亲测：下面3种都可以：

xcrun atos -o appName.app.dSYM/Contents/Resources/DWARF/appName -l 0x4000 -arch armv7

xcrun atos -o appName.app.dSYM/Contents/Resources/DWARF/appName -arch armv7

xcrun atos -o appName.app/appName -arch armv7

（这3行选任意一行执行都可以达到目的，其中0x4000是模块的加载地址，从上面的章节可以找到如何得到这个地址。）

文章开头提到crash文件中有如下两行，

* 3 appName 0x000f462a 0x4000 + 984618 
* 4 appName **0x00352aee** 0x4000 + 3468014  
在执行了上面的

xcrun atos -o appName.app.dSYM/Contents/Resources/DWARF/appName -l 0x4000 -arch armv7
之后，输入如下地址：

0x00352aee

（crash文件中的第4行：4 appName **0x00352aee** 0x4000 + 3468014）

可以得到结果：

-[UIScrollView(UITouch) touchesEnded:withEvent:] (in appName) (UIScrollView+UITouch.h:26)

这样就找到了应用种到底是哪个模块导致的crash问题。



总结
本文分析了拿到用户的.crash文件之后，如何符合化crash文件的3种方法，分别有其适用场景，方法3适用于自动化crash文件的分析