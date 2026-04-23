# Requirements Document

## Introduction

本文档定义了 Alfred Toolkit 项目的需求，这是一个统一的 Alfred workflow，通过关键词 `bla` 唤起，提供多种开发者实用工具。用户输入 `bla` 后可以看到所有可用工具列表，选择具体工具后进入该工具的交互界面。

当前工具集包含：
- **unicode-decode**: 将 Unicode 编码字符串（如 `\u4f60\u597d`）解码为可读文本
- **unicode-encode**: 将普通文本编码为 Unicode 转义序列

该项目为独立的新项目，参考现有 `alfred-png-to-webp` 项目的结构和模式（Node.js ES modules、alfy 库），但不依赖图片处理相关的库。

## Glossary

- **Toolkit**: Alfred 工具集项目，一个统一的 Alfred workflow，包含多个工具，通过关键词 `bla` 唤起
- **Tool_Registry**: 工具注册表，维护所有可用工具的元数据（名称、描述、图标、入口模块），用于动态生成工具列表
- **Unicode_Decoder**: Unicode 解码工具模块，负责将 Unicode 编码字符串转换为可读文本
- **Unicode_Encoder**: Unicode 编码工具模块，负责将普通文本转换为 Unicode 转义序列
- **Alfred_Workflow**: Alfred 应用的工作流插件，通过关键词 `bla` 触发并展示工具列表和结果
- **Tool_List**: 工具列表界面，用户输入 `bla` 后显示的第一级界面，列出所有可用工具
- **Tool_Interface**: 工具交互界面，用户选择具体工具后进入的第二级界面，用于输入参数和查看结果
- **Unicode_Escape_Sequence**: Unicode 转义序列，形如 `\uXXXX` 的编码格式，其中 XXXX 为四位十六进制数
- **Decoded_Text**: 解码后的可读文本，即 Unicode 转义序列对应的实际字符
- **Encoded_Text**: 编码后的 Unicode 转义序列字符串，即普通文本对应的 `\uXXXX` 格式表示
- **Input_String**: 用户在工具交互界面中输入的原始字符串
- **Alfy**: Alfred workflow 的 Node.js 开发工具库，提供输入输出和缓存等功能

## Requirements

### Requirement 1: 项目初始化与可扩展架构

**User Story:** 作为开发者，我希望项目具有可扩展的架构，以便未来可以方便地添加新的工具到工具集中。

#### Acceptance Criteria

1. THE Toolkit SHALL 使用 Node.js ES modules 格式组织代码结构
2. THE Toolkit SHALL 使用 alfy 库作为 Alfred workflow 的开发框架
3. THE Toolkit SHALL 将每个工具作为独立模块组织在 `tools/` 目录下，每个工具模块导出统一的接口（处理函数）
4. THE Toolkit SHALL 包含 package.json 文件，声明项目名称为 `alfred-toolkit`、版本号、依赖项和 Node.js 引擎要求（>=16.0.0）
5. THE Toolkit SHALL 维护一个 Tool_Registry，记录每个工具的名称、描述、图标和入口模块路径
6. WHEN 开发者需要添加新工具时, THE Toolkit SHALL 仅需在 `tools/` 目录下创建新模块并在 Tool_Registry 中注册即可完成集成

### Requirement 2: 统一入口与两级交互模式

**User Story:** 作为用户，我希望通过一个关键词 `bla` 唤起工具集，然后从工具列表中选择需要的工具，以便快速访问所有工具。

#### Acceptance Criteria

1. WHEN 用户在 Alfred 中输入 `bla` 时, THE Alfred_Workflow SHALL 显示 Tool_List，列出所有已注册的工具
2. THE Tool_List SHALL 为每个工具显示工具名称作为标题、工具描述作为副标题
3. WHEN 用户在 `bla` 后输入空格和过滤文本时, THE Alfred_Workflow SHALL 根据过滤文本对 Tool_List 进行模糊匹配筛选
4. WHEN 用户从 Tool_List 中选择一个工具时, THE Alfred_Workflow SHALL 进入该工具的 Tool_Interface，等待用户输入参数
5. WHEN 用户在 Tool_Interface 中输入参数时, THE Alfred_Workflow SHALL 实时显示该工具的处理结果，无需额外确认步骤
6. THE Alfred_Workflow SHALL 支持通过快捷方式直接进入特定工具（如输入 `bla unicode-decode \u4f60\u597d` 直接触发解码）

### Requirement 3: Unicode 转义序列解码

**User Story:** 作为用户，我希望能够将 Unicode 编码字符串解码为可读文本，以便快速理解编码内容。

#### Acceptance Criteria

1. WHEN 用户提供包含 `\uXXXX` 格式转义序列的 Input_String 时, THE Unicode_Decoder SHALL 将所有 `\uXXXX` 转义序列替换为对应的 Unicode 字符
2. WHEN Input_String 包含连续的 Unicode 转义序列（如 `\u4f60\u597d`）时, THE Unicode_Decoder SHALL 将每个转义序列独立解码并拼接为完整的 Decoded_Text
3. WHEN Input_String 同时包含普通文本和 Unicode 转义序列（如 `hello\u4e16\u754c`）时, THE Unicode_Decoder SHALL 保留普通文本部分并仅解码转义序列部分
4. WHEN Input_String 包含大写十六进制字母的转义序列（如 `\u4F60`）时, THE Unicode_Decoder SHALL 以大小写不敏感的方式正确解码
5. WHEN Input_String 包含补充平面字符的代理对（如 `\uD83D\uDE00`）时, THE Unicode_Decoder SHALL 正确解码代理对为对应的 Unicode 字符

### Requirement 4: Unicode 文本编码

**User Story:** 作为用户，我希望能够将普通文本编码为 Unicode 转义序列，以便在代码或配置文件中使用。

#### Acceptance Criteria

1. WHEN 用户提供包含非 ASCII 字符的 Input_String 时, THE Unicode_Encoder SHALL 将所有非 ASCII 字符转换为 `\uXXXX` 格式的转义序列
2. WHEN Input_String 包含 ASCII 字符时, THE Unicode_Encoder SHALL 保留 ASCII 字符原样输出，仅编码非 ASCII 字符
3. WHEN Input_String 包含补充平面字符（如 emoji 😀）时, THE Unicode_Encoder SHALL 将其编码为正确的代理对格式（如 `\uD83D\uDE00`）
4. THE Unicode_Encoder SHALL 在结果列表项的标题中显示 Encoded_Text
5. THE Unicode_Encoder SHALL 在结果列表项的副标题中显示原始 Input_String，以便用户对照确认
6. WHEN 用户选择结果列表项并按下 Enter 键时, THE Unicode_Encoder SHALL 将 Encoded_Text 复制到系统剪贴板

### Requirement 5: Alfred Workflow 结果展示

**User Story:** 作为用户，我希望工具的处理结果以清晰的格式呈现，以便快速识别和使用。

#### Acceptance Criteria

1. THE Unicode_Decoder SHALL 在结果列表项的标题中显示 Decoded_Text
2. THE Unicode_Decoder SHALL 在结果列表项的副标题中显示原始 Input_String，以便用户对照确认
3. WHEN 用户选择 Unicode_Decoder 的结果列表项并按下 Enter 键时, THE Alfred_Workflow SHALL 将 Decoded_Text 复制到系统剪贴板
4. THE Unicode_Decoder SHALL 在解码结果的标题前添加表情符号前缀（如 ✅）以标识成功解码
5. WHEN Decoded_Text 包含不可见字符或控制字符时, THE Unicode_Decoder SHALL 在副标题中标注包含特殊字符的提示
6. THE Unicode_Encoder SHALL 在编码结果的标题前添加表情符号前缀（如 🔤）以标识成功编码

### Requirement 6: 错误处理

**User Story:** 作为用户，我希望在输入无效内容时获得清晰的错误提示，以便了解问题所在。

#### Acceptance Criteria

1. IF Input_String 为空或仅包含空白字符, THEN THE Unicode_Decoder SHALL 显示提示信息，引导用户输入 Unicode 编码字符串
2. IF Input_String 包含不完整的转义序列（如 `\u4f6` 或 `\u`）, THEN THE Unicode_Decoder SHALL 保留不完整的转义序列原样输出，并仅解码有效的转义序列部分
3. IF Input_String 不包含任何 Unicode 转义序列, THEN THE Unicode_Decoder SHALL 将原始文本作为结果显示，并在副标题中提示未检测到 Unicode 转义序列
4. IF Unicode_Encoder 的 Input_String 为空或仅包含空白字符, THEN THE Unicode_Encoder SHALL 显示提示信息，引导用户输入待编码的文本
5. IF Unicode_Encoder 的 Input_String 仅包含 ASCII 字符, THEN THE Unicode_Encoder SHALL 显示原始文本并在副标题中提示所有字符均为 ASCII，无需编码
6. IF 解码或编码过程中发生未预期的错误, THEN THE Alfred_Workflow SHALL 显示包含错误描述的错误提示项
7. IF Tool_Registry 中未找到用户选择的工具, THEN THE Alfred_Workflow SHALL 显示工具未找到的错误提示

### Requirement 7: 转义字符支持

**User Story:** 作为用户，我希望工具能处理常见的转义字符，以便完整地解码包含特殊字符的字符串。

#### Acceptance Criteria

1. THE Unicode_Decoder SHALL 支持解码结果中包含的换行符转义（`\n`），将其转换为换行字符
2. THE Unicode_Decoder SHALL 支持解码结果中包含的制表符转义（`\t`），将其转换为制表字符
3. WHEN Decoded_Text 包含换行符或制表符时, THE Unicode_Decoder SHALL 在显示时使用可见的占位符（如 `↵` 表示换行、`→` 表示制表符）以便用户识别
