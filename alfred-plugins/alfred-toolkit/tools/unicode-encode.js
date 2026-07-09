// Unicode 编码工具模块
import { encodeUnicode } from '../lib/unicode-encoder.js';

function buildGuideItem(title, subtitle) {
  return {
    uid: 'guide',
    title,
    subtitle,
    valid: false
  };
}

/**
 * 工具参数校验
 * strategy:
 * - reject: 参数不合法，直接返回提示项
 * - handle: 跳过确认，直接进入 handle
 */
export function validate(input) {
  if (!input || input.trim() === '') {
    return {
      strategy: 'reject',
      items: [
        buildGuideItem('⚠️ 请输入待编码的文本', '请输入待编码的文本')
      ]
    };
  }

  return { strategy: 'handle' };
}

/**
 * Unicode 编码工具的 run 函数
 * @param {string} input - 用户输入的参数
 * @returns {Array<AlfredItem>} Alfred 列表项数组
 */
export async function handle(input) {
  try {
    // 空/空白输入返回引导提示项
    if (!input || input.trim() === '') {
      return [buildGuideItem('⚠️ 请输入待编码的文本', '请输入待编码的文本')];
    }

    const result = encodeUnicode(input);

    // 纯 ASCII 输入返回原始文本并提示无需编码
    if (!result.hasNonAscii) {
      return [{
        uid: 'ascii-only',
        title: input,
        subtitle: '所有字符均为 ASCII，无需编码',
        arg: input,
        valid: true
      }];
    }

    // 正常编码：标题前添加 🔤 前缀，副标题显示原始输入
    return [{
      uid: 'encoded',
      title: `🔤 ${result.encoded}`,
      subtitle: `原始输入: ${input}`,
      arg: result.encoded,
      valid: true
    }];
  } catch (error) {
    return [{
      uid: 'error',
      title: '⚠️ 编码错误',
      subtitle: error.message,
      valid: false
    }];
  }
}

// 兼容旧接口
export const run = handle;
