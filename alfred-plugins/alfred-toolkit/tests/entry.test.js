import { describe, it, expect, vi } from 'vitest';

// Mock alfy before importing modules that depend on it
vi.mock('alfy', () => ({
  default: {
    input: '',
    output: vi.fn()
  }
}));

const { buildToolList } = await import('../index.js');
const { handleToolInput } = await import('../tool-handler.js');

describe('buildToolList (index.js)', () => {
  describe('no input - show all tools', () => {
    it('should return all registered tools when input is empty', () => {
      const items = buildToolList('');
      expect(items).toHaveLength(2);
      expect(items[0].uid).toBe('unicode-decode');
      expect(items[1].uid).toBe('unicode-encode');
    });

    it('should return all registered tools when input is undefined', () => {
      const items = buildToolList(undefined);
      expect(items).toHaveLength(2);
    });

    it('should return all registered tools when input is whitespace', () => {
      const items = buildToolList('   ');
      expect(items).toHaveLength(2);
    });

    it('each tool item should have correct fields', () => {
      const items = buildToolList('');
      for (const item of items) {
        expect(item).toHaveProperty('uid');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('subtitle');
        expect(item).toHaveProperty('arg');
        expect(item).toHaveProperty('icon');
      }
    });

    it('tool item title should be tool name and subtitle should be description', () => {
      const items = buildToolList('');
      expect(items[0].title).toBe('Unicode Decode');
      expect(items[0].subtitle).toContain('解码');
      expect(items[1].title).toBe('Unicode Encode');
      expect(items[1].subtitle).toContain('编码');
    });

    it('tool item arg should be tool id', () => {
      const items = buildToolList('');
      expect(items[0].arg).toBe('unicode-decode');
      expect(items[1].arg).toBe('unicode-encode');
    });
  });

  describe('shortcut mode - input matches tool ID', () => {
    it('should route to tool when input starts with a registered tool ID', () => {
      const items = buildToolList('unicode-decode \\u4f60');
      expect(items).toHaveLength(1);
      expect(items[0].uid).toBe('unicode-decode');
      expect(items[0].arg).toBe('unicode-decode \\u4f60');
    });

    it('should show tool description when no extra args provided', () => {
      const items = buildToolList('unicode-decode');
      expect(items).toHaveLength(1);
      expect(items[0].uid).toBe('unicode-decode');
      expect(items[0].subtitle).toContain('解码');
      expect(items[0].arg).toBe('unicode-decode');
    });

    it('should show parameter in subtitle when extra args provided', () => {
      const items = buildToolList('unicode-encode 你好');
      expect(items).toHaveLength(1);
      expect(items[0].subtitle).toBe('参数: 你好');
      expect(items[0].arg).toBe('unicode-encode 你好');
    });
  });

  describe('filter mode - fuzzy matching', () => {
    it('should filter tools by query matching name', () => {
      const items = buildToolList('decode');
      expect(items).toHaveLength(1);
      expect(items[0].uid).toBe('unicode-decode');
      expect(items[0].arg).toBe('unicode-decode');
    });

    it('should filter tools by query matching description', () => {
      const items = buildToolList('转义序列');
      expect(items).toHaveLength(1);
      expect(items[0].uid).toBe('unicode-encode');
    });

    it('should return both tools when query matches common text', () => {
      const items = buildToolList('unicode');
      // 'unicode' is not a registered tool ID, so it goes to filter mode
      // Both tools have 'unicode' in their name
      expect(items).toHaveLength(2);
    });

    it('should return no-match item when no tools match', () => {
      const items = buildToolList('zzz-nonexistent');
      expect(items).toHaveLength(1);
      expect(items[0].uid).toBe('no-match');
      expect(items[0].title).toBe('未找到匹配的工具');
      expect(items[0].valid).toBe(false);
    });
  });
});

describe('handleToolInput (tool-handler.js)', () => {
  describe('empty input', () => {
    it('should return error when input is empty', async () => {
      const items = await handleToolInput('');
      expect(items).toHaveLength(1);
      expect(items[0].uid).toBe('error');
      expect(items[0].title).toContain('未指定工具');
      expect(items[0].valid).toBe(false);
    });

    it('should return error when input is undefined', async () => {
      const items = await handleToolInput(undefined);
      expect(items).toHaveLength(1);
      expect(items[0].uid).toBe('error');
    });

    it('should return error when input is whitespace', async () => {
      const items = await handleToolInput('   ');
      expect(items).toHaveLength(1);
      expect(items[0].uid).toBe('error');
    });
  });

  describe('tool not found', () => {
    it('should return error when tool ID is not registered', async () => {
      const items = await handleToolInput('nonexistent-tool');
      expect(items).toHaveLength(1);
      expect(items[0].uid).toBe('error-not-found');
      expect(items[0].title).toContain('未找到工具');
      expect(items[0].title).toContain('nonexistent-tool');
      expect(items[0].valid).toBe(false);
    });
  });

  describe('tool routing', () => {
    it('should route to unicode-decode tool and return results', async () => {
      const items = await handleToolInput('unicode-decode \\u4f60');
      expect(items).toHaveLength(1);
      // The tool should process the input and return decoded result
      expect(items[0].uid).toBe('decoded');
      expect(items[0].title).toContain('✅');
      expect(items[0].title).toContain('你');
    });

    it('should route to unicode-encode tool and return results', async () => {
      const items = await handleToolInput('unicode-encode 你好');
      expect(items).toHaveLength(1);
      expect(items[0].uid).toBe('encoded');
      expect(items[0].title).toContain('🔤');
    });

    it('should pass empty string to tool when no user input after tool ID', async () => {
      const items = await handleToolInput('unicode-decode');
      expect(items).toHaveLength(1);
      // Empty input to unicode-decode should return guide prompt
      expect(items[0].uid).toBe('guide');
      expect(items[0].valid).toBe(false);
    });
  });
});
