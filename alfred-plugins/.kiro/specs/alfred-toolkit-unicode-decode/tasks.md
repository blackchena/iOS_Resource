# 实现计划: Alfred Toolkit Unicode Decode/Encode

## 概述

将设计文档中的 Alfred Toolkit 架构转化为可执行的编码任务。项目采用 Node.js ES modules，使用 alfy 库，包含工具注册表、两级交互入口、Unicode 编解码核心逻辑和完整的测试覆盖。实现语言为 JavaScript (ES modules)。

## 任务列表

- [x] 1. 初始化项目结构与依赖配置
  - [x] 1.1 创建 `alfred-toolkit/package.json`，声明项目名称为 `alfred-toolkit`，`"type": "module"`，依赖 `alfy`，开发依赖 `vitest` 和 `fast-check`，引擎要求 `>=16.0.0`
    - 参考 `alfred-png-to-webp/package.json` 的结构
    - _需求: 1.1, 1.2, 1.4_

  - [x] 1.2 创建目录结构：`tools/`、`lib/`、`icons/`，以及空的入口文件 `index.js`、`tool-handler.js`、`registry.js`
    - 按照设计文档的项目目录结构创建
    - _需求: 1.3, 1.5_

- [x] 2. 实现工具注册表与过滤逻辑
  - [x] 2.1 实现 `registry.js`，导出 `tools` 数组、`findTool(id)` 函数和 `filterTools(query)` 函数
    - `tools` 数组包含 `unicode-decode` 和 `unicode-encode` 两个工具定义（id、name、description、icon、module）
    - `findTool` 根据 id 精确查找工具
    - `filterTools` 根据 query 对工具名称和描述进行模糊匹配筛选
    - _需求: 1.5, 1.6, 2.1, 2.3_

  - [x] 2.2 编写 `registry.js` 的单元测试
    - 测试 `findTool` 查找已注册工具和未注册工具
    - 测试 `filterTools` 的模糊匹配逻辑
    - _需求: 1.5, 2.3_

  - [x] 2.3 编写属性测试：工具列表格式一致性
    - **Property 5: 工具列表格式一致性**
    - **验证: 需求 2.2**

  - [x] 2.4 编写属性测试：工具过滤正确性
    - **Property 6: 工具过滤正确性**
    - **验证: 需求 2.3**

- [x] 3. 实现 Unicode 解码核心逻辑
  - [x] 3.1 实现 `lib/unicode-decoder.js`，导出 `decodeUnicode(input)` 和 `toDisplayText(text)` 函数
    - `decodeUnicode` 使用正则表达式匹配 `\uXXXX` 转义序列并替换为对应字符
    - 支持大小写不敏感的十六进制字母
    - 支持代理对（surrogate pair）解码
    - 支持 `\n`、`\t` 转义字符处理
    - 不完整转义序列保留原样
    - 返回 `DecodeResult` 对象（decoded、display、hasSpecialChars、hasUnicodeSequences）
    - `toDisplayText` 将换行符替换为 `↵`、制表符替换为 `→`
    - _需求: 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3, 6.2_

  - [x] 3.2 编写 `lib/unicode-decoder.js` 的单元测试
    - 测试 `\u4f60\u597d` → `你好`
    - 测试 `hello\u4e16\u754c` → `hello世界`
    - 测试 `\uD83D\uDE00` → `😀`
    - 测试 `\n`、`\t` 转义字符处理
    - 测试不完整序列保留
    - 测试 `toDisplayText` 的占位符替换
    - _需求: 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3_

  - [x] 3.3 编写属性测试：解码大小写不敏感
    - **Property 2: 解码大小写不敏感**
    - **验证: 需求 3.4**

  - [x] 3.4 编写属性测试：不完整转义序列保留
    - **Property 3: 不完整转义序列保留**
    - **验证: 需求 6.2**

  - [x] 3.5 编写属性测试：不可见字符显示替换
    - **Property 4: 不可见字符显示替换**
    - **验证: 需求 5.5, 7.3**

- [x] 4. 实现 Unicode 编码核心逻辑
  - [x] 4.1 实现 `lib/unicode-encoder.js`，导出 `encodeUnicode(input)` 函数
    - 将非 ASCII 字符转换为 `\uXXXX` 格式
    - ASCII 字符保留原样
    - 补充平面字符编码为代理对格式
    - 返回 `EncodeResult` 对象（encoded、hasNonAscii）
    - _需求: 4.1, 4.2, 4.3_

  - [x] 4.2 编写 `lib/unicode-encoder.js` 的单元测试
    - 测试中文编码：`你好` → `\u4f60\u597d`
    - 测试混合内容：`hello世界` → `hello\u4e16\u754c`
    - 测试 emoji 编码为代理对
    - 测试纯 ASCII 输入
    - _需求: 4.1, 4.2, 4.3, 6.5_

  - [x] 4.3 编写属性测试：编码-解码 Round Trip
    - **Property 1: 编码-解码 Round Trip**
    - **验证: 需求 3.1, 3.2, 3.3, 3.5, 4.1, 4.2, 4.3**

  - [x] 4.4 编写属性测试：纯 ASCII 输入检测
    - **Property 8: 纯 ASCII 输入检测**
    - **验证: 需求 6.5**

- [x] 5. 检查点 - 确保核心逻辑测试通过
  - 确保所有测试通过，如有问题请询问用户。

- [x] 6. 实现工具模块（tools 层）
  - [x] 6.1 实现 `tools/unicode-decode.js`，导出 `run(input)` 函数
    - 调用 `lib/unicode-decoder.js` 的 `decodeUnicode` 和 `toDisplayText`
    - 空/空白输入返回引导提示项（"请输入包含 \\uXXXX 格式的 Unicode 编码字符串"）
    - 无 Unicode 转义序列时返回原始文本并提示
    - 正常解码时标题前添加 ✅ 前缀，副标题显示原始输入
    - 包含特殊字符时在副标题中标注提示
    - `arg` 字段设为解码后的文本（用于复制到剪贴板）
    - 使用 try-catch 包裹，捕获未预期异常
    - _需求: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.6_

  - [x] 6.2 实现 `tools/unicode-encode.js`，导出 `run(input)` 函数
    - 调用 `lib/unicode-encoder.js` 的 `encodeUnicode`
    - 空/空白输入返回引导提示项（"请输入待编码的文本"）
    - 纯 ASCII 输入返回原始文本并提示无需编码
    - 正常编码时标题前添加 🔤 前缀，副标题显示原始输入
    - `arg` 字段设为编码后的文本（用于复制到剪贴板）
    - 使用 try-catch 包裹，捕获未预期异常
    - _需求: 4.4, 4.5, 4.6, 5.6, 6.4, 6.5, 6.6_

  - [x] 6.3 编写属性测试：空白输入拒绝
    - **Property 7: 空白输入拒绝**
    - **验证: 需求 6.1, 6.4**

- [x] 7. 实现两级入口与路由
  - [x] 7.1 实现 `index.js`（第一级入口），使用 alfy 显示工具列表
    - 从 `registry.js` 导入工具列表
    - 无输入时显示所有工具
    - 有输入时检测是否为快捷方式调用（输入匹配已注册工具名称），若匹配则直接传递参数给对应工具
    - 否则使用 `filterTools` 进行模糊匹配筛选
    - 每个列表项的 `arg` 传递工具 ID
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.6_

  - [x] 7.2 实现 `tool-handler.js`（第二级入口），解析工具 ID 和用户参数并路由到对应工具
    - 从 `alfy.input` 解析格式为 `工具ID 用户参数` 的输入
    - 使用 `findTool` 查找工具定义
    - 动态导入工具模块并调用 `run` 函数
    - 工具未找到时显示错误提示
    - 导入失败时捕获错误并显示提示
    - _需求: 2.4, 2.5, 6.7_

  - [x] 7.3 编写 `index.js` 和 `tool-handler.js` 的单元测试
    - 测试快捷方式路由：`unicode-decode \u4f60` 正确路由
    - 测试工具未找到的错误提示
    - 测试工具列表过滤
    - _需求: 2.3, 2.6, 6.7_

- [x] 8. 创建 Alfred Workflow 配置
  - [x] 8.1 创建 `alfred-toolkit/info.plist`，配置两个 Script Filter 节点
    - 第一级 Script Filter：关键词 `bla`，执行 `node index.js "{query}"`
    - 第二级 Script Filter：由第一级选择结果触发，执行 `node tool-handler.js "{query}"`
    - 配置 Copy to Clipboard 动作，将选中项的 `arg` 复制到剪贴板
    - _需求: 2.1, 2.4, 5.3, 4.6_

- [x] 9. 最终检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户。

## 备注

- 标记 `*` 的任务为可选任务，可跳过以加快 MVP 进度
- 每个任务引用了具体的需求编号以确保可追溯性
- 检查点任务确保增量验证
- 属性测试使用 `fast-check` 库，测试框架使用 `vitest`
- 单元测试验证具体示例和边界情况，属性测试验证通用正确性
