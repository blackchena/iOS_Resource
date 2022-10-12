//
//  BLAForwarder.h
//  ZYHMetroSDKDemo
//
//  Created by chensiyu on 2022/3/24.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

#define BLAForwarder(arg1) [[BLAForwarder alloc] initWithProxy:arg1]

@interface BLAForwarder : NSProxy

@property (nonatomic) id proxy;

- (instancetype)initWithProxy:(id)proxy;
- (id)object;
- (void)setUserName:(NSString *)userName;
- (void)setUserNamea:(NSString *)userName;
- (id)getUserNamea;

@end

NS_ASSUME_NONNULL_END
