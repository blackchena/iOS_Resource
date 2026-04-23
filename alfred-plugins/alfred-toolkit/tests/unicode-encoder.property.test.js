import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { encodeUnicode } from '../lib/unicode-encoder.js';
import { decodeUnicode } from '../lib/unicode-decoder.js';

/**
 * Feature: alfred-toolkit-unicode-decode, Property 1: 编码-解码 Round Trip
 *
 * For any valid Unicode string (containing BMP characters and supplementary plane
 * characters), encoding with encodeUnicode then decoding with decodeUnicode should
 * produce a result equivalent to the original string.
 *
 * Filter out inputs containing backslash characters to avoid ambiguity with
 * literal \u sequences and \n/\t escape sequences.
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.5, 4.1, 4.2, 4.3**
 */
describe('Feature: alfred-toolkit-unicode-decode, Property 1: 编码-解码 Round Trip', () => {
  it('BMP 字符串编码后解码应还原', () => {
    const safeString16Arb = fc.string16bits({ minLength: 1, maxLength: 50 })
      .filter(s => !s.includes('\\'));

    fc.assert(
      fc.property(safeString16Arb, (input) => {
        const encodeResult = encodeUnicode(input);
        const decodeResult = decodeUnicode(encodeResult.encoded);
        expect(decodeResult.decoded).toBe(input);
      }),
      { numRuns: 100 }
    );
  });

  it('全 Unicode 字符串（含补充平面）编码后解码应还原', () => {
    const safeFullUnicodeArb = fc.fullUnicode({ minLength: 1, maxLength: 50 })
      .filter(s => !s.includes('\\'));

    fc.assert(
      fc.property(safeFullUnicodeArb, (input) => {
        const encodeResult = encodeUnicode(input);
        const decodeResult = decodeUnicode(encodeResult.encoded);
        expect(decodeResult.decoded).toBe(input);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: alfred-toolkit-unicode-decode, Property 8: 纯 ASCII 输入检测
 *
 * For any non-empty string containing only ASCII characters (code points 0-127),
 * encodeUnicode should return the original string unchanged and hasNonAscii
 * should be false.
 *
 * **Validates: Requirements 6.5**
 */
describe('Feature: alfred-toolkit-unicode-decode, Property 8: 纯 ASCII 输入检测', () => {
  it('纯 ASCII 输入应原样返回且 hasNonAscii 为 false', () => {
    const asciiArb = fc.stringOf(
      fc.char().filter(c => c.charCodeAt(0) <= 127),
      { minLength: 1, maxLength: 50 }
    );

    fc.assert(
      fc.property(asciiArb, (input) => {
        const result = encodeUnicode(input);
        expect(result.encoded).toBe(input);
        expect(result.hasNonAscii).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});
