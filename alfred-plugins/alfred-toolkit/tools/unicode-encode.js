// Unicode 编码工具模块
import { encodeUnicode } from '../lib/unicode-encoder.js';

/**
 * Unicode 编码工具的 run 函数
 * @param {string} input - 用户输入的参数
 * @returns {Array<AlfredItem>} Alfred 列表项数组
 */
export async function run(input) {
  try {
    // 空/空白输入返回引导提示项
    if (!input || input.trim() === '') {
      return [{
        uid: 'guide',
        title: '⚠️ 请输入待编码的文本',
        subtitle: '请输入待编码的文本',
        valid: false
      }];
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
