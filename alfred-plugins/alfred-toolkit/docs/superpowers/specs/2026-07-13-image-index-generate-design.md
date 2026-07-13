# Image Index Generate 工具设计

## 目标

将 `tools/img-index-generate.js` 从 CommonJS 转为 ES Module，并将其注册为 Alfred 工具。用户输入图片目录后，工具递归生成该目录的 ES Module 图片索引，覆盖写入 `index.js`，同时将相同内容复制到 macOS 剪贴板。

## 接口与流程

- 工具 ID 为 `img-index-generate`，名称为 `Image Index Generate`。
- 输入为图片目录的绝对或相对路径。
- `validate()` 验证路径存在且为目录，并返回两个可执行选项：生成并写入 `<图片目录>/index.js`，或仅复制索引到剪贴板。
- `handle()` 根据选项收集图片并渲染索引，执行写入或复制操作，并返回 Alfred 成功项。

## 生成规则

- 递归扫描 `png`、`jpg`、`jpeg`、`gif`、`webp`、`svg`、`avif` 文件，跳过隐藏文件和隐藏目录。
- 使用既有 camelCase 属性名、基于相对路径的导入名及冲突检测规则。
- 生成文件使用 ES Module `import` 与 `export default`。
- 空目录仍生成一个空的 `images` 对象。

## 错误处理

- 缺少路径、目录不存在或输入不是目录时，返回不可执行的引导或错误项。
- 生成期间的命名冲突、写入失败或剪贴板失败会返回不可执行的错误项，且错误消息包含原因。

## 测试

- 为纯生成函数测试递归扫描、隐藏项忽略、索引渲染和命名冲突。
- 为 Alfred 适配层测试输入校验、输出文件写入、工具注册及确认流程。
