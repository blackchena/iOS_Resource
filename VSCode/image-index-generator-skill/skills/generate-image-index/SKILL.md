---
name: generate-image-index
description: 根据指定图片文件夹递归生成 JavaScript 图片导入索引，并直接复制到 macOS 剪贴板。
---

# Generate Image Index

当用户要求从图片目录生成 `import` 语句和嵌套图片对象时使用本技能。

## 执行方式

在插件根目录执行：

```bash
node scripts/generate-image-index.cjs <图片目录>
```

示例：

```bash
node scripts/generate-image-index.cjs ../assets/images
```

脚本会递归扫描 `.png`、`.jpg`、`.jpeg`、`.gif`、`.webp`、`.svg` 与 `.avif` 文件，并将生成的 JavaScript 内容复制到 macOS 剪贴板。

## 生成规则

- 输入的相对目录路径用作 import 前缀；传入 `../assets/images` 会生成 `../assets/images/home/banner.png`。
- 导入变量名使用下划线，例如 `common/default-user.webp` 生成 `common_default_user`。
- 对象键使用 camelCase，例如 `default-user.webp` 生成 `defaultUser`。
- 目录层级映射为嵌套对象。
- 不创建或修改用户项目中的索引文件。

若用户提供绝对路径，提醒其：剪贴板结果中的 import 路径会使用该目录的最后一级目录名作为相对前缀；如需精确的项目相对路径，请提供相对目录路径。
