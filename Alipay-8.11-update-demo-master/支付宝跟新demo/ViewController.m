//
//  ViewController.m
//  支付宝跟新demo
//
//  Created by zgy_smile on 16/8/11.
//  Copyright © 2016年 zgy_smile. All rights reserved.
//

#import "ViewController.h"
#import "Fg_tableView.h"
#import <MJRefresh.h>
@interface ViewController () <UIScrollViewDelegate>
@property (weak, nonatomic) UITableView *tableView;
@property (weak, nonatomic) UIView *topView;
//@property (strong, nonatomic) UIScrollView *rootView;
@property(assign,nonatomic) CGFloat lastY;
@property(strong,nonatomic) UIImageView * imageView;
@property (nonatomic, assign) CGPoint tableViewVelocity;
@end

#define kWidth [UIScreen mainScreen].bounds.size.width
#define kHeight [UIScreen mainScreen].bounds.size.height

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self setupUI];
}

-(void)setupUI {
    UILabel * titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 20, kWidth, 20)];
    titleLabel.text = @"支付宝首页跟新demo";
    titleLabel.textAlignment = NSTextAlignmentCenter;
    [self.view addSubview:titleLabel];
    
//    self.rootView = [[UIScrollView alloc] initWithFrame:CGRectMake(0, 40, kWidth, kHeight-40)];
//    self.rootView.contentSize = CGSizeMake(0, kHeight * 5);
//    self.rootView.scrollIndicatorInsets = UIEdgeInsetsMake(310, 0, 0, 0);
//    self.rootView.delegate = self;
    UITableView * tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 40, kWidth, kHeight) style:UITableViewStylePlain];
    tableView.contentInset = UIEdgeInsetsMake(300, 0, 0, 0);
    self.tableView = tableView;
    self.tableView.dataSource = self;
    self.tableView.delegate = self;
    self.tableView.mj_header = [MJRefreshNormalHeader headerWithRefreshingBlock:^{
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 2 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
            [self.tableView.mj_header endRefreshing];
        });
    }];
    [self.view addSubview:tableView];
    
    UIView * topView = [[UIView alloc] initWithFrame:CGRectMake(0, -300, kWidth, 300)];
    self.topView = topView;
    topView.backgroundColor = [UIColor yellowColor];
    [tableView addSubview:topView];
    
    UIImageView * imageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, kWidth, 150)];
    imageView.image = [UIImage imageNamed:@"monkey"];
    [topView addSubview:imageView];
    self.imageView = imageView;
    
    UILabel * dangban = [[UILabel alloc] initWithFrame:CGRectMake(0, 150, kWidth, 150)];
    dangban.text = @"视差挡板";
    dangban.textAlignment = NSTextAlignmentCenter;
    dangban.backgroundColor = [UIColor lightGrayColor];
    [topView addSubview:dangban];
    

}

-(void)scrollViewDidScroll:(UIScrollView *)scrollView {
    CGFloat y = scrollView.contentOffset.y;
    NSLog(@"contentOffset.y = %@",@(scrollView.contentOffset.y));
    if (y <= -scrollView.contentInset.top) {
        CGRect imgFrame = self.imageView.frame;
        imgFrame.origin.y = 0;
        self.imageView.frame = imgFrame;
        CGRect newFrame = self.topView.frame;
        newFrame.origin.y = y;
        self.topView.frame = newFrame;
    } else if (-scrollView.contentInset.top < y && y < -scrollView.contentInset.top/2.0){
        CGRect topFrame = self.topView.frame;
        topFrame.origin.y = -scrollView.contentInset.top;
        self.topView.frame = topFrame;
        //视差处理
        CGRect newFrame = self.imageView.frame;
        newFrame.origin.y = (y + self.tableView.contentInset.top)/2.0;
//        NSLog(@"newFrame.y = %@",@(newFrame.origin.y));
        self.imageView.frame = newFrame;
    } else {
        CGRect newFrame = self.imageView.frame;
        newFrame.origin.y = self.tableView.contentInset.top/2.0;
        //        NSLog(@"newFrame.y = %@",@(newFrame.origin.y));
        self.imageView.frame = newFrame;
    }
}




- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate {
    if (decelerate) {
        return;
    }
    if (scrollView.contentOffset.y < -scrollView.contentInset.top/2) {
        if (scrollView.contentOffset.y < -scrollView.contentInset.top*3/4) {
            [scrollView setContentOffset:CGPointMake(0, -scrollView.contentInset.top) animated:YES];
        } else {
            [scrollView setContentOffset:CGPointMake(0, -scrollView.contentInset.top/2) animated:YES];
        }
        
    }
}

- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset {
    
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
    if (!scrollView.isDecelerating) {
        return;
    }
    if (scrollView.contentOffset.y < -scrollView.contentInset.top/2) {
        if (scrollView.contentOffset.y < -scrollView.contentInset.top*3/4) {
            [scrollView setContentOffset:CGPointMake(0, -scrollView.contentInset.top) animated:YES];
        } else {
            [scrollView setContentOffset:CGPointMake(0, -scrollView.contentInset.top/2) animated:YES];
        }
        
    }

}

- (void)scrollViewDidEndScrollingAnimation:(UIScrollView *)scrollView {

}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    
    return 20;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    UITableViewCell * cell = [tableView dequeueReusableCellWithIdentifier:@"cell"];
    
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"cell"];
    }
    
    cell.textLabel.text = [NSString stringWithFormat:@"%ld",indexPath.row];
    
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
}

@end
