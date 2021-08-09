# RACSignal switchlastest

signal of signals信号在所有子信号sendComplete和主信号sendComplete后才会结束订阅，任意一方没有sendComplete都不会结束订阅。主要因为switchLastest -> flatmap -> bind 而bind中有这块代码

signalCount 初始值为1
`__block volatile int32_t signalCount = 1;   // indicates self`

completeSignal Block会在一下两种时刻调用：

*  addSignal Block传入的signal complete时调用
*  self complete时调用

```
void (^completeSignal)(RACDisposable *) = ^(RACDisposable *finishedDisposable) {
			if (OSAtomicDecrement32Barrier(&signalCount) == 0) {
				[subscriber sendCompleted];
				[compoundDisposable dispose];
			} else {
				[compoundDisposable removeDisposable:finishedDisposable];
			}
		};

void (^addSignal)(RACSignal *) = ^(RACSignal *signal) {
			OSAtomicIncrement32Barrier(&signalCount);

			RACSerialDisposable *selfDisposable = [[RACSerialDisposable alloc] init];
			[compoundDisposable addDisposable:selfDisposable];

			RACDisposable *disposable = [signal subscribeNext:^(id x) {
				[subscriber sendNext:x];
			} error:^(NSError *error) {
				[compoundDisposable dispose];
				[subscriber sendError:error];
			} completed:^{
				@autoreleasepool {
					completeSignal(selfDisposable);
				}
			}];

			selfDisposable.disposable = disposable;
		};

```
```
RACDisposable *bindingDisposable = [self subscribeNext:^(id x) {
				// Manually check disposal to handle synchronous errors.
				if (compoundDisposable.disposed) return;

				BOOL stop = NO;
				id signal = bindingBlock(x, &stop);

				@autoreleasepool {
					if (signal != nil) addSignal(signal);
					if (signal == nil || stop) {
						[selfDisposable dispose];
						completeSignal(selfDisposable);
					}
				}
			} error:^(NSError *error) {
				[compoundDisposable dispose];
				[subscriber sendError:error];
			} completed:^{
				@autoreleasepool {
					completeSignal(selfDisposable);
				}
			}];

```





在面试中autoreleasepool的使用常常和内存峰值及和Runloop的关系放在一起考察。我在这里主要验证它对内存峰值的影响。

TLS((Thread Local Storage)

```NSString *jsonString = @"{\"price\":0.07}";
    NSDictionary *jsonObj = [NSJSONSerialization JSONObjectWithData:[jsonString dataUsingEncoding:NSUTF8StringEncoding] options:kNilOptions error:NULL];
    NSDecimalNumber *oneNumber = [NSDecimalNumber decimalNumberWithString:@"0.07"];
    NSDecimalNumber *twoNumber = [NSDecimalNumber decimalNumberWithDecimal:[jsonObj[@"price"] decimalValue]];
```
