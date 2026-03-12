# Alfred Image to WebP Converter

一个 Alfred 工作流插件，用于将 PNG、JPG、JPEG 图片转换为 WebP 格式。使用 Sharp 库进行高性能图片转换。

**兼容 Alfred 5.0.3+**

## 功能特点

- 🚀 使用 Sharp 库进行高性能图片转换
- 📁 支持 PNG、JPG、JPEG 格式的批量转换
- 💾 保持原始文件，生成新的 WebP 文件
- 📊 显示详细的转换统计和文件大小对比
- 🎯 优化的 WebP 设置（80% 质量，平衡文件大小和质量）
- ⚡ 快速转换，支持错误处理和进度显示
- 🔧 完全兼容 Alfred 5.0.3 及以上版本
- 🖼️ 支持单文件和文件夹批量转换

## 系统要求

- macOS 10.14+
- Node.js 16.0.0+
- Alfred 5.0.3+ (Powerpack)

## 安装步骤

### 1. 安装 Node.js

如果还没有安装 Node.js，请从 [nodejs.org](https://nodejs.org/) 下载并安装 Node.js 16+ 版本。

### 2. 安装插件

```bash
# 克隆或下载此项目
cd alfred-png-to-webp

# 运行安装脚本
chmod +x install.sh
./install.sh
```

或者手动安装：

```bash
# 安装依赖
npm install

# 设置脚本权限
chmod +x index.js
```

### 3. 导入 Alfred 工作流

1. 打开 Alfred Preferences
2. 切换到 Workflows 标签页
3. 点击左下角的 "+" 按钮
4. 选择 "Import"
5. 选择项目目录中的 `info.plist` 文件
6. 工作流将被导入并准备使用

## 使用方法

### 基本用法

1. 在 Alfred 中输入 `png2webp` 后跟一个空格
2. 输入包含图片的文件夹路径或单个图片文件路径
3. 按 Enter 开始转换

### 示例

```
# 转换文件夹中的所有图片
png2webp /Users/username/Pictures/screenshots

# 转换单个图片文件
png2webp /Users/username/Pictures/photo.jpg
```

### 支持的格式

- **输入格式**: PNG, JPG, JPEG
- **输出格式**: WebP

### 支持的路径格式

- 绝对路径：`/Users/username/Pictures`
- 相对路径：`./images`
- 拖拽文件夹或文件到 Alfred 输入框

## 输出信息

转换完成后，插件会显示：

- 找到的图片文件数量
- 成功转换的文件数量
- 失败的文件和错误信息
- 每个文件的转换结果
- 转换统计摘要

### 示例输出

```
📊 Conversion Summary: 6 files converted
✅ All files converted successfully

✅ photo1.webp
Successfully converted from photo1.jpg

✅ screenshot1.webp
Successfully converted from screenshot1.png

✅ image2.webp
Successfully converted from image2.jpeg
```

## 配置选项

### WebP 转换设置

在 `index.js` 中可以调整以下参数：

```javascript
.webp({
    quality: 80,        // 质量 (0-100)
    effort: 4,          // 压缩努力程度 (0-6)
    nearLossless: false // 是否使用近无损压缩
})
```

### 推荐设置

- **质量 80**: 平衡文件大小和视觉质量
- **努力程度 4**: 平衡压缩时间和文件大小
- **近无损关闭**: 使用有损压缩以获得更小的文件

## 故障排除

### 常见问题

1. **"Node.js is not installed"**
   - 安装 Node.js 16+ 版本

2. **"Folder does not exist"**
   - 检查文件夹路径是否正确
   - 确保路径没有特殊字符

3. **"No supported image files found"**
   - 确认文件夹中确实包含 PNG、JPG 或 JPEG 文件
   - 检查文件扩展名是否为小写的 `.png`、`.jpg` 或 `.jpeg`

4. **转换失败**
   - 检查图片文件是否损坏
   - 确保有足够的磁盘空间
   - 检查文件权限

5. **Alfred 5.0.3 兼容性问题**
   - 确保使用最新版本的插件
   - 检查 Alfred 版本是否为 5.0.3 或更高

### 调试模式

如果需要查看详细的错误信息，可以手动运行脚本：

```bash
node index.js /path/to/your/folder
```

## 技术细节

### 使用的技术

- **Sharp**: 高性能 Node.js 图片处理库
- **Alfy**: Alfred 工作流开发工具库
- **libvips**: 底层图片处理引擎
- **WebP**: Google 开发的现代图片格式

### 性能特点

- 支持多核处理
- 内存高效的流式处理
- 优化的 WebP 编码器

### Alfred 5.0.3 兼容性

- 更新的脚本执行方式
- 改进的环境变量处理
- 优化的路径解析
- 增强的错误处理

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.3.0
- ✨ 新增支持 JPG 和 JPEG 格式转换为 WebP
- 🔧 改进单文件转换功能，支持直接转换单个图片文件
- 📝 更新错误提示信息，包含所有支持的格式
- 📚 更新文档和使用说明
- 🧪 添加 JPG/JPEG 格式的测试用例

### v1.2.0
- 使用 Alfy 库重构输出格式，提供更标准的 Alfred 输出
- 转换为 ES 模块格式，提升代码现代化
- 简化代码结构，移除手动 XML 生成
- 改进错误处理和用户反馈

### v1.1.0
- 完全兼容 Alfred 5.0.3+
- 更新 Node.js 版本要求至 16+
- 改进脚本执行和环境变量处理
- 更新 Sharp 库至最新版本
- 优化安装脚本和错误处理

### v1.0.0
- 初始版本
- 支持批量 PNG 到 WebP 转换
- 详细的转换统计和文件大小对比
- Alfred 工作流集成 