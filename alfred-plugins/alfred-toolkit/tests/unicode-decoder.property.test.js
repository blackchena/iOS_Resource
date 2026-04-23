import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { decodeUnicode, toDisplayText } from '../lib/unicode-decoder.js';

/**
 * Feature: alfred-toolkit-unicode-decode, Property 2: 解码大小写不敏感
 *
 * For any valid Unicode code point, its \uXXXX escape sequence in uppercase
 * (e.g. \u4F60) and lowercase (e.g. \u4f60) should decode to the same character.
 *
 * **Validates: Requirements 3.4**
 */
describe('Feature: alfred-toolkit-unicode-decode, Property 2: 解码大小写不敏感', () => {
  it('大写和小写十六进制转义序列解码结果相同', () => {
    // Generate random BMP code points excluding surrogates (0xD800-0xDFFF)
    const bmpCodePointArb = fc.integer({ min: 0x0000, max: 0xFFFF }).filter(
      cp => cp < 0xD800 || cp > 0xDFFF
    );

    fc.assert(
      fc.property(bmpCodePointArb, (codePoint) => {
        const hex = codePoint.toString(16).padStart(4, '0');
        const upperInput = `\\u${hex.toUpperCase()}`;
        const lowerInput = `\\u${hex.toLowerCase()}`;

        const upperResult = decodeUnicode(upperInput);
        const lowerResult = decodeUnicode(lowerInput);

        expect(upperResult.decoded).toBe(lowerResult.decoded);
        expect(upperResult.decoded).toBe(String.fromCharCode(codePoint));
        expect(upperResult.hasUnicodeSequences).toBe(true);
        expect(lowerResult.hasUnicodeSequences).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: alfred-toolkit-unicode-decode, Property 3: 不完整转义序列保留
 *
 * For any string containing incomplete Unicode escape sequences (like \u4f6, \u, \u4f),
 * decodeUnicode should preserve the incomplete parts as-is while correctly decoding
 * all complete \uXXXX sequences.
 *
 * **Validates: Requirements 6.2**
 */
describe('Feature: alfred-toolkit-unicode-decode, Property 3: 不完整转义序列保留', () => {
  it('不完整转义序列保留原样，完整序列正确解码', () => {
    // Generate incomplete escape sequences: \u followed by 0-3 hex digits
    const hexDigitArb = fc.constantFrom(
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F'
    );
    const incompleteHexArb = fc.array(hexDigitArb, { minLength: 0, maxLength: 3 })
      .map(arr => arr.join(''));

    // Generate a complete \uXXXX sequence (BMP, no surrogates)
    const completeSeqArb = fc.integer({ min: 0x0020, max: 0xFFFF })
      .filter(cp => cp < 0xD800 || cp > 0xDFFF)
      .map(cp => ({
        seq: `\\u${cp.toString(16).padStart(4, '0')}`,
        char: String.fromCharCode(cp)
      }));

    // Test: incomplete sequence alone should be preserved
    fc.assert(
      fc.property(incompleteHexArb, (hexPart) => {
        const input = `\\u${hexPart}`;
        const result = decodeUnicode(input);
        // The incomplete sequence should be preserved as-is
        expect(result.decoded).toBe(input);
        expect(result.hasUnicodeSequences).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('混合完整和不完整序列时，完整序列解码，不完整序列保留', () => {
    const hexDigitArb = fc.constantFrom(
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f'
    );
    const incompleteHexArb = fc.array(hexDigitArb, { minLength: 0, maxLength: 3 })
      .map(arr => arr.join(''));

    const completeCodePointArb = fc.integer({ min: 0x0041, max: 0x9FFF })
      .filter(cp => cp < 0xD800 || cp > 0xDFFF);

    fc.assert(
      fc.property(
        completeCodePointArb,
        incompleteHexArb,
        (codePoint, hexPart) => {
          const completeSeq = `\\u${codePoint.toString(16).padStart(4, '0')}`;
          const incompleteSeq = `\\u${hexPart}`;
          const expectedChar = String.fromCharCode(codePoint);

          // Put incomplete sequence after complete one with a separator
          const input = `${completeSeq}text${incompleteSeq}`;
          const result = decodeUnicode(input);

          expect(result.decoded).toBe(`${expectedChar}text${incompleteSeq}`);
          expect(result.hasUnicodeSequences).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: alfred-toolkit-unicode-decode, Property 4: 不可见字符显示替换
 *
 * For any text containing newlines (\n) or tabs (\t), toDisplayText should replace
 * all newlines with ↵ and all tabs with →, without changing other characters.
 *
 * **Validates: Requirements 5.5, 7.3**
 */
describe('Feature: alfred-toolkit-unicode-decode, Property 4: 不可见字符显示替换', () => {
  it('所有换行符替换为↵，所有制表符替换为→，其他字符不变', () => {
    // Generate strings that may contain \n and \t mixed with other content
    const mixedStringArb = fc.array(
      fc.oneof(
        { weight: 3, arbitrary: fc.char().filter(c => c !== '\n' && c !== '\t') },
        { weight: 1, arbitrary: fc.constant('\n') },
        { weight: 1, arbitrary: fc.constant('\t') }
      ),
      { minLength: 1, maxLength: 50 }
    ).map(arr => arr.join(''));

    fc.assert(
      fc.property(mixedStringArb, (text) => {
        const result = toDisplayText(text);

        // Result should not contain actual newlines or tabs
        expect(result).not.toContain('\n');
        expect(result).not.toContain('\t');

        // Count replacements: number of ↵ in result should equal number of \n in input
        const newlineCount = (text.match(/\n/g) || []).length;
        const arrowDownCount = (result.match(/↵/g) || []).length;
        expect(arrowDownCount).toBe(newlineCount);

        // Count replacements: number of → in result should equal number of \t in input
        const tabCount = (text.match(/\t/g) || []).length;
        const arrowRightCount = (result.match(/→/g) || []).length;
        expect(arrowRightCount).toBe(tabCount);

        // Other characters should be preserved: length should be consistent
        // Each \n becomes ↵ (1 char) and each \t becomes → (1 char), so length is the same
        expect(result.length).toBe(text.length);
      }),
      { numRuns: 100 }
    );
  });

  it('不包含换行符和制表符的文本应保持不变', () => {
    // Generate strings without \n and \t
    const noSpecialArb = fc.string({ minLength: 0, maxLength: 50 }).filter(
      s => !s.includes('\n') && !s.includes('\t')
    );

    fc.assert(
      fc.property(noSpecialArb, (text) => {
        const result = toDisplayText(text);
        expect(result).toBe(text);
      }),
      { numRuns: 100 }
    );
  });
});
