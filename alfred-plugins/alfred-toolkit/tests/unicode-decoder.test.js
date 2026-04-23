import { describe, it, expect } from 'vitest';
import { decodeUnicode, toDisplayText } from '../lib/unicode-decoder.js';

describe('decodeUnicode', () => {
  it('should decode \\u4f60\\u597d to 你好', () => {
    const result = decodeUnicode('\\u4f60\\u597d');
    expect(result.decoded).toBe('你好');
    expect(result.hasUnicodeSequences).toBe(true);
  });

  it('should decode hello\\u4e16\\u754c to hello世界', () => {
    const result = decodeUnicode('hello\\u4e16\\u754c');
    expect(result.decoded).toBe('hello世界');
    expect(result.hasUnicodeSequences).toBe(true);
  });

  it('should decode surrogate pair \\uD83D\\uDE00 to 😀', () => {
    const result = decodeUnicode('\\uD83D\\uDE00');
    expect(result.decoded).toBe('😀');
    expect(result.hasUnicodeSequences).toBe(true);
  });

  it('should handle \\n escape as newline', () => {
    const result = decodeUnicode('line1\\nline2');
    expect(result.decoded).toBe('line1\nline2');
    expect(result.hasSpecialChars).toBe(true);
  });

  it('should handle \\t escape as tab', () => {
    const result = decodeUnicode('col1\\tcol2');
    expect(result.decoded).toBe('col1\tcol2');
    expect(result.hasSpecialChars).toBe(true);
  });

  it('should handle \\n and \\t after unicode decoding', () => {
    const result = decodeUnicode('\\u4f60\\u597d\\nworld');
    expect(result.decoded).toBe('你好\nworld');
    expect(result.hasSpecialChars).toBe(true);
    expect(result.hasUnicodeSequences).toBe(true);
  });

  it('should preserve incomplete escape sequence \\u4f6', () => {
    const result = decodeUnicode('\\u4f6');
    expect(result.decoded).toBe('\\u4f6');
    expect(result.hasUnicodeSequences).toBe(false);
  });

  it('should preserve incomplete escape sequence \\u', () => {
    const result = decodeUnicode('\\u');
    expect(result.decoded).toBe('\\u');
    expect(result.hasUnicodeSequences).toBe(false);
  });

  it('should decode valid sequences and preserve incomplete ones', () => {
    const result = decodeUnicode('\\u4f60\\u4f6');
    expect(result.decoded).toBe('你\\u4f6');
    expect(result.hasUnicodeSequences).toBe(true);
  });

  it('should handle case-insensitive hex digits', () => {
    const upper = decodeUnicode('\\u4F60');
    const lower = decodeUnicode('\\u4f60');
    expect(upper.decoded).toBe(lower.decoded);
    expect(upper.decoded).toBe('你');
  });

  it('should return hasSpecialChars false when no special chars', () => {
    const result = decodeUnicode('\\u4f60\\u597d');
    expect(result.hasSpecialChars).toBe(false);
  });

  it('should return hasUnicodeSequences false for plain text', () => {
    const result = decodeUnicode('hello world');
    expect(result.hasUnicodeSequences).toBe(false);
    expect(result.decoded).toBe('hello world');
  });

  it('should return display text with placeholders', () => {
    const result = decodeUnicode('line1\\nline2\\tcol');
    expect(result.display).toBe('line1↵line2→col');
  });
});

describe('toDisplayText', () => {
  it('should replace newlines with ↵', () => {
    expect(toDisplayText('line1\nline2')).toBe('line1↵line2');
  });

  it('should replace tabs with →', () => {
    expect(toDisplayText('col1\tcol2')).toBe('col1→col2');
  });

  it('should replace both newlines and tabs', () => {
    expect(toDisplayText('a\nb\tc')).toBe('a↵b→c');
  });

  it('should not change text without special chars', () => {
    expect(toDisplayText('hello world')).toBe('hello world');
  });

  it('should handle empty string', () => {
    expect(toDisplayText('')).toBe('');
  });
});
