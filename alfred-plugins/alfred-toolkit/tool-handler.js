// 第二级入口：工具路由与执行
import alfy from 'alfy';
import { findTool } from './registry.js';

/**
 * 解析工具 ID 和用户参数，路由到对应工具并返回结果
 * 纯逻辑函数，便于测试（不依赖 alfy 环境）
 * @param {string} input - 格式为 `工具ID 用户参数` 的输入
 * @returns {Promise<Array<AlfredItem>>} Alfred 列表项数组
 */
export async function handleToolInput(input) {
  if (!input || input.trim() === '') {
    return [{
      uid: 'error',
      title: '⚠️ 未指定工具',
      subtitle: '请从工具列表中选择一个工具',
      valid: false
    }];
  }

  // Parse: first word is tool ID, rest is user input
  const spaceIndex = input.indexOf(' ');
  const toolId = spaceIndex === -1 ? input : input.substring(0, spaceIndex);
  const userInput = spaceIndex === -1 ? '' : input.substring(spaceIndex + 1);

  const tool = findTool(toolId);
  if (!tool) {
    return [{
      uid: 'error-not-found',
      title: `⚠️ 未找到工具: ${toolId}`,
      subtitle: '请检查工具 ID 是否正确',
      valid: false
    }];
  }

  try {
    const toolModule = await import(tool.module);
    return await toolModule.run(userInput);
  } catch (error) {
    return [{
      uid: 'error-import',
      title: '⚠️ 工具加载失败',
      subtitle: error.message,
      valid: false
    }];
  }
}

const items = await handleToolInput(alfy.input);
alfy.output(items);
