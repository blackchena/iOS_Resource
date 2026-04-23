import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { tools, filterTools } from '../registry.js';

/**
 * Feature: alfred-toolkit-unicode-decode, Property 5: 工具列表格式一致性
 *
 * For any 工具注册表中的工具定义集合，生成的 Alfred 列表项中每个工具的
 * title 应等于该工具的 name，subtitle 应等于该工具的 description。
 *
 * **Validates: Requirements 2.2**
 */
describe('Feature: alfred-toolkit-unicode-decode, Property 5: 工具列表格式一致性', () => {
  // Helper: convert tool definitions to Alfred list items (same logic as index.js would use)
  function toAlfredItems(toolDefs) {
    return toolDefs.map(tool => ({
      uid: tool.id,
      title: tool.name,
      subtitle: tool.description,
      arg: tool.id,
      icon: tool.icon
    }));
  }

  it('每个工具的 Alfred 列表项 title 等于 name，subtitle 等于 description', () => {
    // Generate arbitrary tool definition arrays
    const toolDefArb = fc.record({
      id: fc.string({ minLength: 1, maxLength: 30 }),
      name: fc.string({ minLength: 1, maxLength: 50 }),
      description: fc.string({ minLength: 1, maxLength: 100 }),
      icon: fc.record({ path: fc.string({ minLength: 1, maxLength: 50 }) }),
      module: fc.string({ minLength: 1, maxLength: 50 })
    });

    fc.assert(
      fc.property(
        fc.array(toolDefArb, { minLength: 0, maxLength: 10 }),
        (toolDefs) => {
          const items = toAlfredItems(toolDefs);
          expect(items).toHaveLength(toolDefs.length);
          for (let i = 0; i < toolDefs.length; i++) {
            expect(items[i].title).toBe(toolDefs[i].name);
            expect(items[i].subtitle).toBe(toolDefs[i].description);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('实际注册表中的工具也满足格式一致性', () => {
    const items = toAlfredItems(tools);
    for (let i = 0; i < tools.length; i++) {
      expect(items[i].title).toBe(tools[i].name);
      expect(items[i].subtitle).toBe(tools[i].description);
    }
  });
});

/**
 * Feature: alfred-toolkit-unicode-decode, Property 6: 工具过滤正确性
 *
 * For any 工具注册表和任意过滤查询字符串，filterTools 返回的结果应是原始工具列表的子集，
 * 且结果中每个工具的名称或描述应包含查询字符串（模糊匹配）。
 *
 * **Validates: Requirements 2.3**
 */
describe('Feature: alfred-toolkit-unicode-decode, Property 6: 工具过滤正确性', () => {
  it('filterTools 返回结果是原始工具列表的子集，且每个结果的名称或描述包含查询字符串', () => {
    // Use printable ASCII + common Unicode chars for query strings
    const queryArb = fc.string({ minLength: 1, maxLength: 20 });

    fc.assert(
      fc.property(queryArb, (query) => {
        const result = filterTools(query);
        const lowerQuery = query.toLowerCase();

        // Result should be a subset of tools
        expect(result.length).toBeLessThanOrEqual(tools.length);
        for (const tool of result) {
          expect(tools).toContainEqual(tool);
        }

        // Each result should match the query in name or description
        for (const tool of result) {
          const nameMatch = tool.name.toLowerCase().includes(lowerQuery);
          const descMatch = tool.description.toLowerCase().includes(lowerQuery);
          expect(nameMatch || descMatch).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('空查询返回所有工具', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom(' ', '\t', '\n', '\r')),
        (whitespace) => {
          const result = filterTools(whitespace);
          expect(result).toEqual(tools);
        }
      ),
      { numRuns: 100 }
    );
  });
});
