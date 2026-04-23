// Unicode 解码工具模块
import { decodeUnicode, toDisplayText } from '../lib/unicode-decoder.js';

/**
 * Unicode 解码工具的 run 函数
 * @param {string} input - 用户输入的参数
 * @returns {Array<AlfredItem>} Alfred 列表项数组
 */
export async function run(input) {
  try {
    // 空/空白输入返回引导提示项
    if (!input || input.trim() === '') {
      return [{
        uid: 'guide',
        title: '⚠️ 请输入 Unicode 编码字符串',
        subtitle: '请输入包含 \\uXXXX 格式的 Unicode 编码字符串',
        valid: false
      }];
    }

    const result = decodeUnicode(input);

    // 无 Unicode 转义序列时返回原始文本并提示
    if (!result.hasUnicodeSequences) {
      return [{
        uid: 'no-unicode',
        title: input,
        subtitle: '未检测到 Unicode 转义序列',
        arg: input,
        valid: true
      }];
    }

    // 正常解码：标题前添加 ✅ 前缀，副标题显示原始输入
    let subtitle = `原始输入: ${input}`;
    if (result.hasSpecialChars) {
      subtitle += ' (包含特殊字符：换行/制表符)';
    }

    return [{
      uid: 'decoded',
      title: `✅ ${result.display}`,
      subtitle,
      arg: result.decoded,
      valid: true
    }];
  } catch (error) {
    return [{
      uid: 'error',
      title: '⚠️ 解码错误',
      subtitle: error.message,
      valid: false
    }];
  }
}
