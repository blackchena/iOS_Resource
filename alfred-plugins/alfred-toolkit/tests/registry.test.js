import { describe, it, expect } from 'vitest';
import { tools, findTool, filterTools } from '../registry.js';

describe('registry', () => {
  describe('tools array', () => {
    it('should contain unicode-decode and unicode-encode tools', () => {
      expect(tools).toHaveLength(2);
      const ids = tools.map(t => t.id);
      expect(ids).toContain('unicode-decode');
      expect(ids).toContain('unicode-encode');
    });

    it('each tool should have required fields', () => {
      for (const tool of tools) {
        expect(tool).toHaveProperty('id');
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('icon');
        expect(tool).toHaveProperty('module');
        expect(tool.icon).toHaveProperty('path');
      }
    });
  });

  describe('findTool', () => {
    it('should find a registered tool by id', () => {
      const tool = findTool('unicode-decode');
      expect(tool).toBeDefined();
      expect(tool.id).toBe('unicode-decode');
      expect(tool.name).toBe('Unicode Decode');
    });

    it('should find unicode-encode tool by id', () => {
      const tool = findTool('unicode-encode');
      expect(tool).toBeDefined();
      expect(tool.id).toBe('unicode-encode');
      expect(tool.name).toBe('Unicode Encode');
    });

    it('should return undefined for unregistered tool id', () => {
      const tool = findTool('nonexistent-tool');
      expect(tool).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const tool = findTool('');
      expect(tool).toBeUndefined();
    });
  });

  describe('filterTools', () => {
    it('should return all tools when query is empty', () => {
      const result = filterTools('');
      expect(result).toEqual(tools);
    });

    it('should return all tools when query is undefined', () => {
      const result = filterTools(undefined);
      expect(result).toEqual(tools);
    });

    it('should return all tools when query is whitespace only', () => {
      const result = filterTools('   ');
      expect(result).toEqual(tools);
    });

    it('should filter by tool name (case insensitive)', () => {
      const result = filterTools('decode');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('unicode-decode');
    });

    it('should filter by tool name with different case', () => {
      const result = filterTools('ENCODE');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('unicode-encode');
    });

    it('should filter by description content', () => {
      const result = filterTools('解码');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('unicode-decode');
    });

    it('should match both tools when query matches common text', () => {
      const result = filterTools('unicode');
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no tools match', () => {
      const result = filterTools('zzz-no-match');
      expect(result).toHaveLength(0);
    });
  });
});
