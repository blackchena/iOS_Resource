// 工具注册表

export const tools = [
  {
    id: 'unicode-decode',
    name: 'Unicode Decode',
    description: '将 Unicode 编码字符串（如 \\u4f60\\u597d）解码为可读文本',
    icon: { path: 'icons/decode.png' },
    module: './tools/unicode-decode.js'
  },
  {
    id: 'unicode-encode',
    name: 'Unicode Encode',
    description: '将普通文本编码为 Unicode 转义序列',
    icon: { path: 'icons/encode.png' },
    module: './tools/unicode-encode.js'
  },
  {
    id: 'img-convert',
    name: 'Image Convert',
    description: '图片格式转换（支持 SVG/PNG/JPEG/WebP/ICO 互转）',
    icon: { path: 'icons/image.png' },
    module: './tools/img-convert.js'
  },
  {
    id: 'img-resize',
    name: 'Image Resize',
    description: '图片缩放（支持 PNG/JPEG/WebP/SVG，输出命名为 原名-[size]）',
    icon: { path: 'icons/image.png' },
    module: './tools/img-resize.js'
  },
  {
    id: 'img-index-generate',
    name: 'Image Index Generate',
    description: '递归生成图片 ES Module 索引，写入 index.js 并复制到剪贴板',
    icon: { path: 'icons/image.png' },
    module: './tools/img-index-generate.js'
  },
  {
    id: 'news-rss-summary',
    name: 'RSS News Summary',
    description: '抓取 RSS 技术资讯并使用 New API 生成 Markdown 摘要报告',
    icon: { path: 'icons/image.png' },
    module: './tools/news-rss-summary.js'
  }
];

/**
 * 根据 id 精确查找工具
 * @param {string} id - 工具唯一标识
 * @returns {object|undefined} 工具定义对象，未找到返回 undefined
 */
export function findTool(id) {
  return tools.find(tool => tool.id === id);
}

/**
 * 根据 query 对工具名称和描述进行模糊匹配筛选（大小写不敏感）
 * @param {string} query - 过滤查询字符串
 * @returns {Array} 匹配的工具定义数组
 */
export function filterTools(query) {
  if (!query || query.trim() === '') {
    return tools;
  }
  const lowerQuery = query.toLowerCase();
  return tools.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery)
  );
}
