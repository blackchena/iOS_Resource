// Unicode 解码核心逻辑（纯函数）

/**
 * 替换可见占位符用于显示
 * @param {string} text - 解码后的文本
 * @returns {string} 替换了不可见字符的显示文本
 */
export function toDisplayText(text) {
  return text.replace(/\n/g, '↵').replace(/\t/g, '→');
}

/**
 * 解码包含 Unicode 转义序列的字符串
 * @param {string} input - 包含 \uXXXX 转义序列的字符串
 * @returns {DecodeResult} 解码结果
 */
export function decodeUnicode(input) {
  let hasUnicodeSequences = false;

  // Step 1: Match and replace \uXXXX sequences, handling surrogate pairs
  // The regex matches \u followed by exactly 4 hex digits
  const unicodeEscapeRegex = /\\u([0-9a-fA-F]{4})/g;

  // Collect all matches with their positions first
  const matches = [];
  let match;
  while ((match = unicodeEscapeRegex.exec(input)) !== null) {
    matches.push({
      index: match.index,
      fullMatch: match[0],
      codePoint: parseInt(match[1], 16),
      length: match[0].length
    });
  }

  if (matches.length > 0) {
    hasUnicodeSequences = true;
  }

  // Build the decoded string, handling surrogate pairs
  let decoded = '';
  let lastIndex = 0;
  let i = 0;

  while (i < matches.length) {
    const current = matches[i];

    // Append text before this match
    decoded += input.slice(lastIndex, current.index);

    const cp = current.codePoint;

    // Check if this is a high surrogate and the next match is an adjacent low surrogate
    if (
      cp >= 0xD800 && cp <= 0xDBFF &&
      i + 1 < matches.length
    ) {
      const next = matches[i + 1];
      const nextCp = next.codePoint;

      // Check if next match immediately follows this one and is a low surrogate
      if (
        next.index === current.index + current.length &&
        nextCp >= 0xDC00 && nextCp <= 0xDFFF
      ) {
        // Decode surrogate pair together
        decoded += String.fromCodePoint(
          ((cp - 0xD800) * 0x400) + (nextCp - 0xDC00) + 0x10000
        );
        lastIndex = next.index + next.length;
        i += 2;
        continue;
      }
    }

    // Regular BMP character (or lone surrogate — just decode it as-is)
    decoded += String.fromCharCode(cp);
    lastIndex = current.index + current.length;
    i++;
  }

  // Append remaining text after last match
  decoded += input.slice(lastIndex);

  // Step 2: Replace \n and \t escape sequences with actual characters
  decoded = decoded.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

  const hasSpecialChars = /[\n\t]/.test(decoded);
  const display = toDisplayText(decoded);

  return {
    decoded,
    display,
    hasSpecialChars,
    hasUnicodeSequences
  };
}
