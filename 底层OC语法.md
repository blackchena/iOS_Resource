# 底层OC语法

## KVC

```objective-c
@interface BLAKVOKVCTest : NSObject {
  NSString *_testValue;
}
@end
...

BLAKVOKVCTest *test = [BLAKVOKVCTest new];
[test addObserver:self forKeyPath:@"testValue" options:NSKeyValueObservingOptionNew context:nil];
[test setValue:@"hello" forKey:@"testValue"];//这里的key必须和上面的keyPath一致，不然不会触发KVO回调
```

调用KVC方法时，如果有setter方法则和直接调用setter方法执行逻辑相似（实际调用的 _NSSetXXXValueAndNotify方法），如果没有setter方法只有成员变量，则不会调用上述方法而是调用NSKeyValueDidChangeWithPerThreadPendingNotifications触发KVO回调

如果需要手动触发KVO请重写BLAKVOKVCTest对象的类方法automaticallyNotifiesObserversForKey 的返回值，该值也会影响KVC的设置方式



## Category, Load，initialize

Load(call_load_methods)方法调用之前会先调用load_categories，所以我们可以在Load方法中进行方法交换

如果子类没有实现initialize方法，第一次调用子类方法时(如果父类的initialize方法没有被调用则先调用它，self指向父类)会调用继承自父类的initialize方法，此时self指向子类
