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
