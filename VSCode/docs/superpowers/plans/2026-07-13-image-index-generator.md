# Image Index Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一个在资源管理器文件夹右键生成 `index.js` 图片索引的 VS Code 插件。

**Architecture:** `extension.js` 注册资源管理器命令并以动态 `import()` 加载 Alfred 工具包的 ESM 脚本。一个独立的协调模块负责验证 URI、调用脚本函数、写入输出，便于在不启动 VS Code 的情况下使用 Node 内置测试验证。

**Tech Stack:** VS Code Extension API、Node.js CommonJS、Node 内置 `node:test`、外部 ESM 模块。

---

### Task 1: 建立可测试的生成协调模块

**Files:**
- Create: `image-index-generator/src/generate-image-index.js`
- Test: `image-index-generator/test/generate-image-index.test.js`

- [ ] **Step 1: 写入失败测试**

```js
test('writes an index.js generated from selected folder images', async () => {
  const result = await generateImageIndex('/assets', {
    loadGenerator: async () => ({
      collectImageFiles: () => ['icons/add.png'],
      renderImageIndex: (files) => `// ${files.length} images\n`,
    }),
    writeFile: async (path, content) => writes.push({ path, content }),
  });
  assert.deepEqual(writes, [{ path: '/assets/index.js', content: '// 1 images\n' }]);
  assert.equal(result.imageCount, 1);
});

test('propagates generator errors without writing a file', async () => {
  await assert.rejects(
    generateImageIndex('/assets', {
      loadGenerator: async () => ({
        collectImageFiles: () => { throw new Error('命名冲突'); },
        renderImageIndex: () => '',
      }),
      writeFile: async () => assert.fail('writeFile must not run'),
    }),
    /命名冲突/,
  );
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test test/generate-image-index.test.js`

Expected: FAIL，因模块尚不存在。

- [ ] **Step 3: 实现最小协调逻辑**

```js
async function generateImageIndex(folderPath, dependencies) {
  const generator = await dependencies.loadGenerator();
  const files = generator.collectImageFiles(folderPath);
  const outputPath = path.join(folderPath, 'index.js');
  await dependencies.writeFile(outputPath, generator.renderImageIndex(files), 'utf8');
  return { outputPath, imageCount: files.length };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test test/generate-image-index.test.js`

Expected: PASS。

### Task 2: 添加 VS Code 命令与资源管理器菜单

**Files:**
- Create: `image-index-generator/extension.js`
- Create: `image-index-generator/package.json`

- [ ] **Step 1: 写入失败的扩展清单测试**

```js
test('declares the explorer folder command', () => {
  const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.equal(manifest.contributes.commands[0].command, 'imageIndexGenerator.generate');
  assert.match(manifest.contributes.menus['explorer/context'][0].when, /explorerResourceIsFolder/);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test test/manifest.test.js`

Expected: FAIL，因扩展清单尚不存在。

- [ ] **Step 3: 完成最小实现与扩展清单**

`extension.js` 注册 `imageIndexGenerator.generate`，接收文件夹 URI，调用协调模块；成功时显示图片数、打开 `index.js`，失败时调用 `showErrorMessage`。`package.json` 使用 `explorer/context` 的 `resourceScheme == file && explorerResourceIsFolder` 条件，仅显示“生成图片索引”。

- [ ] **Step 4: 运行全部单元测试**

Run: `node --test test/*.test.js`

Expected: PASS。

### Task 3: 验证扩展入口与使用说明

**Files:**
- Modify: `image-index-generator/README.md`


- [ ] **Step 1: 添加 README**

README 说明外部脚本的相对路径依赖、右键使用方式和输出文件位置。

- [ ] **Step 2: 运行最终验证**

Run: `node --test test/*.test.js && node --check extension.js`

Expected: 所有测试通过，扩展入口语法有效。`vscode` 模块由 VS Code 宿主注入，不能在普通 Node 进程中直接加载。
