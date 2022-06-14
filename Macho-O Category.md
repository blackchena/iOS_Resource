# Mach-O

## Category中的方法是什么时候加入到类的方法列表的

BlackParent.m

```
#import "BlackParent.h"
//主类没有load和子类没有load，ro里面含有category方法
//主类有load和子类没有load，ro里面含有category方法
//主类有load和子类有load，ro里面没有含有category方法
//主类没有有load和子类有load，ro里面含有category方法
@implementation BlackParent

- (void)hello {
    
}

@end
```

BlackParent+BLAAdd.m

```
#import "BlackParent+BLAAdd.h"

@implementation BlackParent (BLAAdd)
+ (void)load {

}
- (void)hello1 {
    NSLog(@"hello");
}

@end

@implementation BlackParent (BLAAdd1)

- (void)hello2 {
    NSLog(@"hello");
}

@end
```



![image-20220330140718376](https://raw.githubusercontent.com/blackchena/MarkdowPicture/main/img/image-20220330140718376.png)

![image-20220330141021435](https://raw.githubusercontent.com/blackchena/MarkdowPicture/main/img/image-20220330141021435.png)

(const class_ro_t *)cls->data()函数内部运算1000008068 & FAST_DATA_MASK 即  1000008068 & 0x00007ffffffffff8UL 值为 1000008068

,该值最初指向ro，ro内部值如下

![image-20220330141925169](https://raw.githubusercontent.com/blackchena/MarkdowPicture/main/img/image-20220330141925169.png)

![image-20220330142126390](https://raw.githubusercontent.com/blackchena/MarkdowPicture/main/img/image-20220330142126390.png)

![image-20220330142331388](https://raw.githubusercontent.com/blackchena/MarkdowPicture/main/img/image-20220330142331388.png)

对比上面三张图可以知道1000080e8位baseMethodList地址，地址指向内存如下：

![image-20220330143224549](https://raw.githubusercontent.com/blackchena/MarkdowPicture/main/img/image-20220330143224549.png)

```
struct method_list_t : entsize_list_tt<method_t, method_list_t, 0xffff0003, method_t::pointer_modifier>

...

template <typename Element, typename List, uint32_t FlagMask, typename PointerModifier = PointerModifierNop>
struct entsize_list_tt {
    uint32_t entsizeAndFlags;
    uint32_t count;//由内存中的值可以得出: 3

    uint32_t entsize() const {
        return entsizeAndFlags & ~FlagMask;//计算 0x18 & 0xfffc得出:0x18 = 24
    }
    uint32_t flags() const {
        return entsizeAndFlags & FlagMask;
    }

    Element& getOrEnd(uint32_t i) const { 
        ASSERT(i <= count);
        //如果i==1  sizeof(method_list_t) == 8, (uint8_t *)this + 8 + 24 0x80e8 + 8 + 24 == 0x8108
        return *PointerModifier::modify(*this, (Element *)((uint8_t *)this + sizeof(*this) + i*entsize()));
    }
    Element& get(uint32_t i) const { 
        ASSERT(i < count);
        return getOrEnd(i);
    }
 ...

struct method_t {
    static const uint32_t smallMethodListFlag = 0x80000000;

    method_t(const method_t &other) = delete;

    // The representation of a "big" method. This is the traditional
    // representation of three pointers storing the selector, types
    // and implementation.
    struct big {
        SEL name;
        const char *types;
        MethodListIMP imp;
    };
   ...
```

如果获取method_list_t中第一个元素（get(0)）,其name指向0x100003f62,其值如下图所示：

![image-20220330150748761](https://raw.githubusercontent.com/blackchena/MarkdowPicture/main/img/image-20220330150748761.png)

结论得出主类没有实现load方法，分类实现load方法，其Class的ro->baseMethodList已经包含了分类方法即编译期间已经给我们加到方法列表中了，而不是像网上说的那样分类方法在运行时加入方法列表即加入rwe

## +load方法与\_\_attribute__((constructor))修饰方法的调用顺序

先说结论，打个断点就可以看见load方便调用在\__attribute__((constructor))修饰的方法之前（下面是两种方法的调用堆栈）：

注意在该工程中只有添加+[BlackParent load]的符号断点才能断到

![image-20220411085853847](https://raw.githubusercontent.com/blackchena/MarkdowPicture/main/img/image-20220411085853847.png)

![image-20220411084431584](https://raw.githubusercontent.com/blackchena/MarkdowPicture/main/img/image-20220411084431584.png)

上述调用栈的共同父节点为如下方法注意其中两个方法的调用顺序决定了load与constructor方法的调用顺序：

```
void ImageLoader::recursiveInitialization(const LinkContext& context, mach_port_t this_thread, const char* pathToInitialize,
										  InitializerTimingList& timingInfo, UninitedUpwards& uninitUps)
{
...
			context.notifySingle(dyld_image_state_dependents_initialized, this, &timingInfo);
			
			// initialize this image
			bool hasInitializers = this->doInitialization(context);

...
}
```

### 如何从Mach-O中获取constructor方法

```c++
__attribute__((constructor))

static void beforeMain(void) {
    NSLog(@"beforeMain");
}

void ImageLoaderMachO::doModInitFunctions(const LinkContext& context)
{
	if ( fHasInitializers ) {
		const uint32_t cmd_count = ((macho_header*)fMachOData)->ncmds;
		const struct load_command* const cmds = (struct load_command*)&fMachOData[sizeof(macho_header)];
		const struct load_command* cmd = cmds;
		for (uint32_t i = 0; i < cmd_count; ++i) {
			if ( cmd->cmd == LC_SEGMENT_COMMAND ) {
				const struct macho_segment_command* seg = (struct macho_segment_command*)cmd;
				const struct macho_section* const sectionsStart = (struct macho_section*)((char*)seg + sizeof(struct macho_segment_command));
				const struct macho_section* const sectionsEnd = &sectionsStart[seg->nsects];
				for (const struct macho_section* sect=sectionsStart; sect < sectionsEnd; ++sect) {
					const uint8_t type = sect->flags & SECTION_TYPE;
					if ( type == S_MOD_INIT_FUNC_POINTERS ) {//获取type为0x9的LC中的section如下图：
						Initializer* inits = (Initializer*)(sect->addr + fSlide);
						const size_t count = sect->size / sizeof(uintptr_t);
						// <rdar://problem/23929217> Ensure __mod_init_func section is within segment
						if ( (sect->addr < seg->vmaddr) || (sect->addr+sect->size > seg->vmaddr+seg->vmsize) || (sect->addr+sect->size < sect->addr) )
							dyld::throwf("__mod_init_funcs section has malformed address range for %s\n", this->getPath());
						for (size_t j=0; j < count; ++j) {
							Initializer func = inits[j];
							// <rdar://problem/8543820&9228031> verify initializers are in image
							if ( ! this->containsAddress(stripPointer((void*)func)) ) {
								dyld::throwf("initializer function %p not in mapped image for %s\n", func, this->getPath());
							}
							if ( ! dyld::gProcessInfo->libSystemInitialized ) {
								// <rdar://problem/17973316> libSystem initializer must run first
								const char* installPath = getInstallPath();
								if ( (installPath == NULL) || (strcmp(installPath, LIBSYSTEM_DYLIB_PATH) != 0) )
									dyld::throwf("initializer in image (%s) that does not link with libSystem.dylib\n", this->getPath());
							}
							if ( context.verboseInit )
								dyld::log("dyld: calling initializer function %p in %s\n", func, this->getPath());
							bool haveLibSystemHelpersBefore = (dyld::gLibSystemHelpers != NULL);
							{
								dyld3::ScopedTimer(DBG_DYLD_TIMING_STATIC_INITIALIZER, (uint64_t)fMachOData, (uint64_t)func, 0);
								func(context.argc, context.argv, context.envp, context.apple, &context.programVars);
							}
							bool haveLibSystemHelpersAfter = (dyld::gLibSystemHelpers != NULL);
							if ( !haveLibSystemHelpersBefore && haveLibSystemHelpersAfter ) {
								// now safe to use malloc() and other calls in libSystem.dylib
								dyld::gProcessInfo->libSystemInitialized = true;
							}
						}
					}
				}
			}
			cmd = (const struct load_command*)(((char*)cmd)+cmd->cmdsize);
		}
	}
}
```



![image-20220408152345291](https://raw.githubusercontent.com/blackchena/MarkdowPicture/main/img/image-20220408152345291.png)

其中的address指向下图的位置

![image-20220408152504529](https://raw.githubusercontent.com/blackchena/MarkdowPicture/main/img/image-20220408152504529.png)

上图地址中保存的值又是一个地址是经\__attribute__((constructor))修饰的函数地址0x3d40

![image-20220408152746125](https://raw.githubusercontent.com/blackchena/MarkdowPicture/main/img/image-20220408152746125.png)

上图中的第一次出现rdi为NSLog的参数地址，rip指向当前指令的下一条指令这里代表0x3d4b，第三行指令lea...代表将rip + 0x2d5 = 0x4020的8字节地址存储在rdi寄存器中，0x4020指向如下图所示位置

![image-20220408153649200](/Users/blackchena/Library/Application Support/typora-user-images/image-20220408153649200.png)

cfstring的第三个值指向了字符串的地址如下图

![image-20220408153801650](/Users/blackchena/Library/Application Support/typora-user-images/image-20220408153801650.png)