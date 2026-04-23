import { describe, it, expect } from 'vitest';
import { encodeUnicode } from '../lib/unicode-encoder.js';

describe('encodeUnicode', () => {
  it('should encode 你好 to \\u4f60\\u597d', () => {
    const result = encodeUnicode('你好');
    expect(result.encoded).toBe('\\u4f60\\u597d');
    expect(result.hasNonAscii).toBe(true);
  });

  it('should encode mixed content hello世界 to hello\\u4e16\\u754c', () => {
    const result = encodeUnicode('hello世界');
    expect(result.encoded).toBe('hello\\u4e16\\u754c');
    expect(result.hasNonAscii).toBe(true);
  });

  it('should encode emoji 😀 as surrogate pair \\ud83d\\ude00', () => {
    const result = encodeUnicode('😀');
    expect(result.encoded).toBe('\\ud83d\\ude00');
    expect(result.hasNonAscii).toBe(true);
  });

  it('should return pure ASCII input unchanged with hasNonAscii=false', () => {
    const result = encodeUnicode('hello');
    expect(result.encoded).toBe('hello');
    expect(result.hasNonAscii).toBe(false);
  });

  it('should handle empty string', () => {
    const result = encodeUnicode('');
    expect(result.encoded).toBe('');
    expect(result.hasNonAscii).toBe(false);
  });

  it('should encode mixed ASCII, BMP, and supplementary characters', () => {
    const result = encodeUnicode('A你😀');
    expect(result.encoded).toBe('A\\u4f60\\ud83d\\ude00');
    expect(result.hasNonAscii).toBe(true);
  });

  it('should use lowercase hex digits', () => {
    // 'Ā' is U+0100
    const result = encodeUnicode('Ā');
    expect(result.encoded).toBe('\\u0100');
    // Verify no uppercase hex letters
    expect(result.encoded).not.toMatch(/[A-F]/);
  });
});
