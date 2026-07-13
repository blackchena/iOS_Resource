const assert = require('node:assert/strict');
const { mkdtemp, readFile, rm, writeFile } = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { generateImageIndex } = require('../src/generate-image-index');

test('writes an index.js generated from selected folder images', async () => {
  const writes = [];

  const result = await generateImageIndex('/assets', {
    loadGenerator: async () => ({
      collectImageFiles: () => ['icons/add.png'],
      renderImageIndex: (files) => `// ${files.length} images\n`,
    }),
    writeFile: async (filePath, content, encoding) => writes.push({ filePath, content, encoding }),
  });

  assert.deepEqual(writes, [{
    filePath: '/assets/index.js',
    content: '// 1 images\n',
    encoding: 'utf8',
  }]);
  assert.deepEqual(result, { outputPath: '/assets/index.js', imageCount: 1 });
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

test('loads the shared generator through its relative path', async () => {
  const folderPath = await mkdtemp(path.join(os.tmpdir(), 'image-index-generator-'));

  try {
    await writeFile(path.join(folderPath, 'add.png'), '');

    const result = await generateImageIndex(folderPath);
    const output = await readFile(result.outputPath, 'utf8');

    assert.equal(result.imageCount, 1);
    assert.match(output, /import add from '.\/add\.png';/);
  } finally {
    await rm(folderPath, { recursive: true, force: true });
  }
});
