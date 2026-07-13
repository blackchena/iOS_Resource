// 第二级入口：参数校验与执行确认
import alfy from 'alfy';
import { pathToFileURL } from 'url';
import { findTool } from './registry.js';
import { handleToolInput } from './tool-handler.js';

const EXEC_PREFIX = '__RUN__ ';

function splitToolInput(input) {
  const trimmed = (input || '').trim();
  const spaceIndex = trimmed.indexOf(' ');
  return {
    toolId: spaceIndex === -1 ? trimmed : trimmed.substring(0, spaceIndex),
    userInput: spaceIndex === -1 ? '' : trimmed.substring(spaceIndex + 1).trim()
  };
}

function buildConfirmItem(rawInput, toolName, summary) {
  return {
    uid: 'confirm-run',
    title: `✅ 确认执行: ${toolName}`,
    subtitle: summary,
    // arg: `${EXEC_PREFIX}${rawInput}`,
    arg: `${rawInput}`,
    variables: {
      ATK_ACTION: 'convert-now'
    },
    valid: true
  };
}

function buildGuideItem(title, subtitle) {
  return {
    uid: 'validation-guide',
    title,
    subtitle,
    valid: false
  };
}

/**
 * validate 协议
 * - { strategy: 'handle' }            -> 直接透传到 handle 执行
 * - { strategy: 'confirm', summary }  -> 展示确认项，回车后执行
 * - { strategy: 'reject', items }     -> 展示校验错误，不执行
 */
async function validateInput(rawInput) {
  if (!rawInput || rawInput.trim() === '') {
    return [buildGuideItem('⚠️ 未指定工具', '请先在上一步选择工具')];
  }

  const { toolId, userInput } = splitToolInput(rawInput);
  const tool = findTool(toolId);
  if (!tool) {
    return [buildGuideItem(`⚠️ 未找到工具: ${toolId}`, '请检查工具 ID 是否正确')];
  }

  const toolModule = await import(tool.module);
  if (typeof toolModule.validate !== 'function') {
    // 没有 validate 时默认直接透传执行
    return handleToolInput(rawInput);
  }

  const validation = await toolModule.validate(userInput, { toolId, tool, rawInput });
  if (!validation || validation.strategy === 'handle') {
    return handleToolInput(rawInput);
  }

  if (validation.strategy === 'reject') {
    return Array.isArray(validation.items) && validation.items.length > 0
      ? validation.items
      : [buildGuideItem('⚠️ 参数校验失败', `工具: ${toolId}`)];
  }

  if (validation.strategy === 'options') {
    if (!Array.isArray(validation.items) || validation.items.length === 0) {
      return [buildGuideItem('⚠️ 没有可用操作', `工具: ${toolId}`)];
    }
    return validation.items.map(item => ({
      ...item,
      arg: `${toolId} ${item.arg || ''}`.trim()
    }));
  }

  if (validation.strategy === 'confirm') {
    const execInput = validation.execInput ? `${toolId} ${validation.execInput}`.trim() : rawInput;
    const items = [buildConfirmItem(execInput, tool.name, validation.summary || `参数: ${userInput}`)];
    if (Array.isArray(validation.tips)) {
      for (const tip of validation.tips) {
        items.push(buildGuideItem('提示', tip));
      }
    }
    return items;
  }

  return [buildGuideItem('⚠️ 未知校验策略', `工具: ${toolId}`)];
}

/**
 * Script Filter 输出：
 * 1) 普通输入 -> 参数校验与确认项
 * 2) __RUN__ 前缀输入 -> 真正执行工具
 */
export async function handleValidationInput(input) {
  const rawInput = (input || '').trim();
  if (rawInput.startsWith(EXEC_PREFIX)) {
    const executeInput = rawInput.substring(EXEC_PREFIX.length).trim();
    return handleToolInput(executeInput);
  }
  return await validateInput(rawInput);
}

function isDirectRun() {
  if (!process.argv[1]) {
    return false;
  }
  return import.meta.url === pathToFileURL(process.argv[1]).href;
}

if (isDirectRun()) {
  const items = await handleValidationInput(alfy.input);
  alfy.output(items);
}
