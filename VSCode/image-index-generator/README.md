# Image Index Generator

本地 Codex 插件：递归扫描图片目录，生成 JavaScript 图片索引并复制到 macOS 剪贴板。

## 使用

```bash
node scripts/generate-image-index.cjs ../assets/images
```

支持：PNG、JPG、JPEG、GIF、WebP、SVG、AVIF。

传入相对路径可直接控制导入路径前缀；例如输入 `../assets/images`，生成结果会包含：

```js
import home_banner from '../assets/images/home/banner.png';
```
