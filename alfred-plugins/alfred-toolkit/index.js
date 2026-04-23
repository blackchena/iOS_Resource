// 第一级入口：工具列表展示
import alfy from 'alfy';
import { tools, filterTools, findTool } from './registry.js';

/**
 * 构建工具列表的 Alfred 列表项数组
 * 纯逻辑函数，便于测试（不依赖 alfy 环境）
 * @param {string} input - 用户在 `bla` 后输入的文本
 * @returns {Array<AlfredItem>} Alfred 列表项数组
 */
export function buildToolList(input) {
  // console.log("input", input, !input, input.trim() === '')
  if (!input || input.trim() === '') {
    // No input: show all tools
    // console.log("tools", tools);
    return tools.map(tool => ({
      uid: tool.id,
      title: tool.name,
      subtitle: tool.description,
      arg: tool.id,
      icon: tool.icon
    }));
  }

  // Check if input starts with a registered tool ID (shortcut mode)
  const parts = input.split(' ');
  const possibleToolId = parts[0];
  const tool = findTool(possibleToolId);

  if (tool) {
    // Shortcut: pass remaining input as arg to the tool
    const toolInput = parts.slice(1).join(' ');
    return [{
      uid: tool.id,
      title: tool.name,
      subtitle: toolInput ? `参数: ${toolInput}` : tool.description,
      arg: `${tool.id} ${toolInput}`.trim(),
      icon: tool.icon
    }];
  }

  // Filter tools by query
  const filtered = filterTools(input);
  if (filtered.length === 0) {
    return [{
      uid: 'no-match',
      title: '未找到匹配的工具',
      subtitle: `搜索: ${input}`,
      valid: false
    }];
  }

  return filtered.map(tool => ({
    uid: tool.id,
    title: tool.name,
    subtitle: tool.description,
    arg: tool.id,
    icon: tool.icon
  }));
}

alfy.output(buildToolList(alfy.input));
