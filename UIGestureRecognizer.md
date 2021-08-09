# UIGestureRecognizer
**cancelsTouchesInView** 属性官方解释如下：
>When this property is true (the default) and the receiver recognizes its gesture, the touches of that gesture that are pending are not delivered to the view and previously delivered touches are cancelled through a touchesCancelled(_:with:) message sent to the view. If a gesture recognizer doesn’t recognize its gesture or if the value of this property is false, the view receives all touches in the multi-touch sequence.

属性值为YES(默认值)：**当gesture(手势)被识别时(state值改变为began、changed、ended代表被识别)，接下来发生的touches将不会传递给hitTestView，之前hitTestView如果已接受到的touches将调用hitTestView的touchesCancelled(_:with:)方法cancel掉，如果没有接收到touches过则什么touch相关方法都不会被调用，如果手势没有被识别(state 为possible、cancel、failed时)，hitTestView将持续接收touches。 当值为YES时总结下来也就是在手势被识别时阻止touch传递给hitTestView, 且手势的touchesBegan比hitTestView的touchesBegan先调用**

属性值为NO：**不会对touch传递给hitTestView产生影响**

**delaysTouchesBegan** 属性官方解释如下：
>When the value of this property is false (the default), views analyze touch events in UITouch.Phase.began and UITouch.Phase.moved in parallel with the receiver. When the value of the property is true, the window suspends delivery of touch objects in the UITouchPhaseBegan phase to the view. If the gesture recognizer subsequently recognizes its gesture, these touch objects are discarded. If the gesture recognizer, however, does not recognize its gesture, the window delivers these objects to the view in a touchesBegan(_:with:) message (and possibly a follow-up touchesMoved(_:with:) message to inform it of the touches’ current locations). Set this property to true to prevent views from processing any touches in the UITouchPhaseBegan phase that may be recognized as part of this gesture.

属性值为NO(默认值)：**忽略其它属性影响，touch并行传递给gesture和hitTestView**

属性值为YES：**延缓传递给hitTestView的began事件，如果接下来gesture被识别，touch事件不会传递给hitTestView。如果gesture没有被识别，touch事件将会传递给hitTestView。总结下来当值为YES时，会防止所有可能作为手势一部分的touch传递给hitTestView**

**delaysTouchesEnded** 属性官方解释如下：
>When the value of this property is true (the default) and the receiver is analyzing touch events, the window suspends delivery of touch objects in the UITouch.Phase.ended phase to the attached view. If the gesture recognizer subsequently recognizes its gesture, these touch objects are cancelled (via a touchesCancelled(_:with:) message). If the gesture recognizer does not recognize its gesture, the window delivers these objects in an invocation of the view’s touchesEnded(_:with:) method. Set this property to false to have touch objects in the UITouch.Phase.ended delivered to the view while the gesture recognizer is analyzing the same touches.

属性值为YES(默认值)：**按照官方的解释我自己进行了实验(给view添加一个双击手势，设置其cancelsTouchesInView为NO，delaysTouchesEnded为YES，delaysTouchesBegan为NO)，1.当只点击一次当手势识别失败时，若此时触摸事件已经结束，会延迟一小段时间（0.15s）再调用响应者的 touchesEnded:withEvent: 2.当快速点击两次手势识别成功只会在最后调用一次view的touchbegan和touchend 3.当点击一次再快速点击第二次不立即抬起手指隔一段时间触发流程如下:**

```
touchesBegan(_:with:)
Optional([__C.NSKeyValueChangeKey(_rawValue: old): 0, 	__C.NSKeyValueChangeKey(_rawValue: kind): 1, 	__C.NSKeyValueChangeKey(_rawValue: new): 5])
touchesEnded(_:with:)
touchesBegan(_:with:)
touchesEnded(_:with:)
```



属性值为NO：**忽略其它属性影响，touch并行传递给gesture和hitTestView触发流程如下：**

```
touchesBegan(_:with:)
touchesEnded(_:with:)
touchesBegan(_:with:)
Optional([__C.NSKeyValueChangeKey(_rawValue: old): 0, __C.NSKeyValueChangeKey(_rawValue: new): 3, __C.NSKeyValueChangeKey(_rawValue: kind): 1])
touchesEnded(_:with:)
```
综上所述我个人认为delaysTouchesEnded延迟了发送给view的began和end事件这是第一次点击加移动再快速发起第二次点击事件的触发流程：

```
touchesBegan(_:with:)
touchesMoved(_:with:)
touchesMoved(_:with:)
touchesMoved(_:with:)
Optional([__C.NSKeyValueChangeKey(_rawValue: new): 3, __C.NSKeyValueChangeKey(_rawValue: old): 0, __C.NSKeyValueChangeKey(_rawValue: kind): 1])
touchesEnded(_:with:)
```