import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { run as runDecode } from '../tools/unicode-decode.js';
import { run as runEncode } from '../tools/unicode-encode.js';

describe('Feature: alfred-toolkit-unicode-decode, Property 7: 空白输入拒绝', () => {
  /**
   * Validates: Requirements 6.1, 6.4
   *
   * For any string composed only of whitespace characters (spaces, tabs, newlines, etc.),
   * both the decode and encode run functions should return a result containing a guide/prompt
   * item rather than attempting to process.
   */
  it('decode run should reject whitespace-only input with a guide item', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.stringOf(fc.constantFrom(' ', '\t', '\n', '\r')),
        async (whitespaceInput) => {
          const result = await runDecode(whitespaceInput);
          expect(result).toHaveLength(1);
          expect(result[0].valid).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('encode run should reject whitespace-only input with a guide item', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.stringOf(fc.constantFrom(' ', '\t', '\n', '\r')),
        async (whitespaceInput) => {
          const result = await runEncode(whitespaceInput);
          expect(result).toHaveLength(1);
          expect(result[0].valid).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
