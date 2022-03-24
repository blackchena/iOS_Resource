//
//  BLAForwarder.m
//  ZYHMetroSDKDemo
//
//  Created by chensiyu on 2022/3/24.
//

#import "BLAForwarder.h"

//@interface BLACallResult : NSObject
//
//@property (nonatomic) id result;
//@property (nonatomic) BOOL success;
//@end
//
//@implementation BLACallResult
//
//- (void)dealloc {
//    NSLog(@"class = %@ , _cmd = %@",NSStringFromClass([self class]), NSStringFromSelector(_cmd));
//}
//
//@end
//
//BLACallResult * BLAMsgSend(id self, SEL selector, ...) {
//    NSMethodSignature *signature = [self methodSignatureForSelector:selector];
//    NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:signature];
//    invocation.selector = selector;
//    if (![self respondsToSelector:selector]) {
//        return ({
//            BLACallResult *ret = [BLACallResult new];
//            ret.success = NO;
//            ret;
//        });
//    }
//    va_list args;
//    va_start(args, selector);
//    NSInteger idx = 2;
//    for (NSInteger i = 2; i < signature.numberOfArguments; i++) {
//        const char *type = [signature getArgumentTypeAtIndex:idx];
//        if (strcmp(type, "i") == 0){
//            int64_t arg = va_arg(args, int64_t);
//            [invocation setArgument:&arg atIndex:idx];
//        } else if (strcmp(type, "c") == 0) {
//            int64_t arg = va_arg(args, int64_t);
//            [invocation setArgument:&arg atIndex:idx];
//        } else if (strcmp(type, "s") == 0) {
//            int64_t arg = va_arg(args, int64_t);
//            [invocation setArgument:&arg atIndex:idx];
//        } else if (strcmp(type, "l") == 0) {
//            long arg = va_arg(args, long);
//            [invocation setArgument:&arg atIndex:idx];
//        } else if (strcmp(type, "q") == 0) {
//            long long arg = va_arg(args,long long);
//            [invocation setArgument:&arg atIndex:idx];
//        } else if (strcmp(type, "f") == 0) {
//            double arg = va_arg(args, double);
//            [invocation setArgument:&arg atIndex:idx];
//        } else if (strcmp(type, "d") == 0) {
//            double arg = va_arg(args, double);
//            [invocation setArgument:&arg atIndex:idx];
//        } else if (strcmp(type, "B") == 0) {//https://stackoverflow.com/questions/28054194/char-type-in-va-arg bool
//            int arg = va_arg(args, int);
//            [invocation setArgument:&arg atIndex:idx];
//        } else if (strcmp(type, "*") == 0) {// char *
//            char * arg = va_arg(args, char*);
//            [invocation setArgument:&arg atIndex:idx];
//        } else if (strcmp(type, ":") == 0) {// SEL
//            SEL arg = va_arg(args, SEL);
//            [invocation setArgument:&arg atIndex:idx];
//        } else {// v,@,[array type]等
//            id arg = va_arg(args, id);
//            [invocation setArgument:&arg atIndex:idx];
//        }
//        idx++;
//    }
//    // 清空参数列表，并置参数指针args无效
//    va_end(args);
//    [invocation invokeWithTarget:self];
//    __unsafe_unretained id result = nil;//如果是strong类型，作用域结束会释放对象，但是通过getReturnValue获取返回值并没有持有对象，因此导致多次释放crash
//    [invocation getReturnValue:&result];
//    BLACallResult *ret = [BLACallResult new];
//    ret.result = result;
//    ret.success = YES;
//    return ret;
//}


void test(void) {
    id wxLaunchMiniProgramReq = [BLAForwarder(NSClassFromString(@"WXLaunchMiniProgramReq")) object];
    [BLAForwarder(wxLaunchMiniProgramReq) setUserName:@"hello"];
    
    //        id target = NSClassFromString(@"WXOpenBusinessWebViewReq");
    //        SEL selector = NSSelectorFromString(@"alloc");
    //        BLACallResult *allocObj = BLAMsgSend(target, selector);
    //        BLAMsgSend(allocObj.result, NSSelectorFromString(@"init"));
    //        id result = allocObj.result;
}

@implementation BLAForwarder

- (instancetype)initWithProxy:(id)proxy {
    _proxy = proxy;
    return self;
}

- (NSMethodSignature *)methodSignatureForSelector:(SEL)sel {
    NSMethodSignature *signature = [_proxy methodSignatureForSelector:sel];
    if (signature) {
        return signature;
    }
    signature = [BLAForwarder methodSignatureForSelector:@selector(hello)];
    return signature;
}

- (void)forwardInvocation:(NSInvocation *)invocation {
    if ([_proxy respondsToSelector:invocation.selector]) {
        [invocation invokeWithTarget:_proxy];
    }
}

- (BOOL)respondsToSelector:(SEL)aSelector {
    return [_proxy respondsToSelector:aSelector];
}

+ (void)hello {
    
}

@end
