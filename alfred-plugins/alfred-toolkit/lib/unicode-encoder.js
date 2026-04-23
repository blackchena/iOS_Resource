// Unicode 编码核心逻辑（纯函数）

/**
 * 将文本中的非 ASCII 字符编码为 Unicode 转义序列
 * @param {string} input - 普通文本
 * @returns {EncodeResult} 编码结果 { encoded, hasNonAscii }
 */
export function encodeUnicode(input) {
  let encoded = '';
  let hasNonAscii = false;

  for (let i = 0; i < input.length; i++) {
    const codePoint = input.codePointAt(i);

    if (codePoint <= 0x7F) {
      // ASCII character (0-127): keep as-is
      encoded += input[i];
    } else {
      hasNonAscii = true;

      if (codePoint > 0xFFFF) {
        // Supplementary plane character: encode as surrogate pair
        const highSurrogate = Math.floor((codePoint - 0x10000) / 0x400) + 0xD800;
        const lowSurrogate = ((codePoint - 0x10000) % 0x400) + 0xDC00;
        encoded += `\\u${highSurrogate.toString(16).padStart(4, '0')}`;
        encoded += `\\u${lowSurrogate.toString(16).padStart(4, '0')}`;
        // Skip the next code unit (surrogate pair takes 2 JS chars)
        i++;
      } else {
        // BMP non-ASCII character (128-0xFFFF): encode as \uXXXX
        encoded += `\\u${codePoint.toString(16).padStart(4, '0')}`;
      }
    }
  }

  return { encoded, hasNonAscii };
}
