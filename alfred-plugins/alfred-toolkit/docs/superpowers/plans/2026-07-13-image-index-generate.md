# Image Index Generate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将图片索引生成器转为 ES Module，并作为会写入 `index.js` 和复制到剪贴板的 Alfred 工具提供。

**Architecture:** `tools/img-index-generate.js` 同时提供可测试的图片扫描/渲染纯函数和 Alfred 的 `validate()`、`handle()` 接口。`registry.js` 仅注册新工具；现有 `tool-validate.js` 自动负责确认与执行分派。

**Tech Stack:** Node.js ES Module、`fs/promises`、`child_process.spawnSync`、Vitest。

---

### Task 1: 为图片索引工具编写失败测试

**Files:**
- Create: `tests/img-index-generate.test.js`
- Modify: `tests/registry.test.js`

- [ ] **Step 1: 写入生成、写入文件和 Alfred 适配层的失败测试**

```js
import { mkdtemp, mkdir, rm, writeFile, readFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { collectImageFiles, handle, renderImageIndex, validate } from '../tools/img-index-generate.js';

vi.mock('node:child_process', () => ({ spawnSync: vi.fn(() => ({ status: 0 })) }));

describe('img-index-generate', () => {
  it('递归收集图片并忽略隐藏项', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'atk-image-index-'));
    await mkdir(path.join(directory, 'icons'));
    await writeFile(path.join(directory, 'logo.png'), '');
    await writeFile(path.join(directory, 'icons', 'close.svg'), '');
    await writeFile(path.join(directory, '.hidden.jpg'), '');
    await expect(collectImageFiles(directory)).resolves.toEqual(['icons/close.svg', 'logo.png']);
    await rm(directory, { recursive: true, force: true });
  });

  it('渲染 ES Module 图片索引', () => {
    expect(renderImageIndex('/project/assets', ['icons/close.svg', 'logo.png'])).toContain("export default images;");
  });

  it('写入 index.js 并返回成功项', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'atk-image-index-'));
    await writeFile(path.join(directory, 'logo.png'), '');
    const [item] = await handle(directory);
    expect(await readFile(path.join(directory, 'index.js'), 'utf8')).toContain('logo: logo');
    expect(item.valid).toBe(true);
    await rm(directory, { recursive: true, force: true });
  });

  it('对有效目录要求确认执行', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'atk-image-index-'));
    expect(validate(directory)).toMatchObject({ strategy: 'confirm' });
    await rm(directory, { recursive: true, force: true });
  });
});
```

- [ ] **Step 2: 运行测试并确认因缺少 ES Module 导出而失败**

Run: `npm test -- tests/img-index-generate.test.js`

Expected: FAIL，错误指出模块未提供所导入的导出项。

- [ ] **Step 3: 为注册表添加失败断言**

```js
expect(tools.map(tool => tool.id)).toContain('img-index-generate');
```

- [ ] **Step 4: 运行注册表测试并确认失败**

Run: `npm test -- tests/registry.test.js`

Expected: FAIL，断言缺少 `img-index-generate`。

### Task 2: 实现 ES Module 图片索引生成工具

**Files:**
- Modify: `tools/img-index-generate.js`

- [ ] **Step 1: 将 CommonJS 导入和导出改为 ES Module**

```js
import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function collectImageFiles(imageDir) { /* 异步递归扫描 */ }
export function isImageFile(filePath) { /* 现有扩展名判断 */ }
export function renderImageIndex(imageDir, relativeFiles) { /* 现有渲染规则 */ }
```

- [ ] **Step 2: 实现 Alfred 输入校验与执行函数**

```js
export function validate(input) {
  if (!input || !input.trim()) return { strategy: 'reject', items: [buildGuideItem('⚠️ 缺少图片目录', '示例: img-index-generate /path/to/assets')] };
  if (!existsSync(input.trim()) || !statSync(input.trim()).isDirectory()) return { strategy: 'reject', items: [buildGuideItem('⚠️ 图片目录不存在或不是目录', input.trim())] };
  return { strategy: 'confirm', summary: `将生成并覆盖 ${path.join(input.trim(), 'index.js')}`, tips: ['生成内容也会复制到剪贴板'] };
}

export async function handle(input) {
  const imageDir = input.trim();
  try {
    const files = await collectImageFiles(imageDir);
    const output = renderImageIndex(imageDir, files);
    const outputPath = path.join(imageDir, 'index.js');
    await writeFile(outputPath, output, 'utf8');
    copyToClipboard(output);
    return [{ uid: 'image-index-generated', title: `✅ 已生成 ${files.length} 个图片的索引`, subtitle: `已写入并复制: ${outputPath}`, arg: outputPath, valid: true }];
  } catch (error) {
    return [buildGuideItem('⚠️ 图片索引生成失败', error.message)];
  }
}
```

- [ ] **Step 3: 移除 CommonJS 的 `require.main` 与 `module.exports` 分支**

```js
// 工具通过 Alfred 动态导入执行；导出函数供测试与复用。
```

- [ ] **Step 4: 运行图片索引工具测试并确认通过**

Run: `npm test -- tests/img-index-generate.test.js`

Expected: PASS。

### Task 3: 注册工具并验证确认流程

**Files:**
- Modify: `registry.js`
- Modify: `tests/registry.test.js`
- Modify: `tests/entry.test.js`
- Modify: `tests/tool-validate.test.js`

- [ ] **Step 1: 在注册表中加入工具定义**

```js
{
  id: 'img-index-generate',
  name: 'Image Index Generate',
  description: '递归生成图片 ES Module 索引，写入 index.js 并复制到剪贴板',
  icon: { path: 'icons/image.png' },
  module: './tools/img-index-generate.js'
}
```

- [ ] **Step 2: 更新入口和注册表断言为五个工具，并验证新 ID 和模块路径**

```js
expect(tools).toHaveLength(5);
expect(findTool('img-index-generate')).toMatchObject({ module: './tools/img-index-generate.js' });
```

- [ ] **Step 3: 增加经 `handleValidationInput()` 返回确认项的测试**

```js
const items = await handleValidationInput(`img-index-generate ${directory}`);
expect(items[0]).toMatchObject({ uid: 'confirm-run', valid: true });
expect(items[0].subtitle).toContain('index.js');
```

- [ ] **Step 4: 运行受影响测试并确认通过**

Run: `npm test -- tests/img-index-generate.test.js tests/registry.test.js tests/entry.test.js tests/tool-validate.test.js`

Expected: PASS。

### Task 4: 执行完整回归验证

**Files:**
- Verify only: `tools/img-index-generate.js`, `registry.js`, `tests/img-index-generate.test.js`, `tests/registry.test.js`, `tests/entry.test.js`, `tests/tool-validate.test.js`

- [ ] **Step 1: 运行完整测试套件**

Run: `npm test`

Expected: 所有 Vitest 测试通过。

- [ ] **Step 2: 检查工作区变更范围**

Run: `git diff --check && git status --short`

Expected: 无空白错误；仅显示本功能文件以及先前已有的用户改动。
