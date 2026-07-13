import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { spawnSync } from 'node:child_process';

vi.mock('node:child_process', () => ({
  spawnSync: vi.fn(() => ({ status: 0 }))
}));

const {
  collectImageFiles,
  handle,
  renderImageIndex,
  validate
} = await import('../tools/img-index-generate.js');

const temporaryDirectories = [];

async function createImageDirectory() {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'atk-image-index-'));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory =>
    rm(directory, { recursive: true, force: true })
  ));
  vi.clearAllMocks();
});

describe('img-index-generate', () => {
  it('递归收集图片并忽略隐藏项', async () => {
    const directory = await createImageDirectory();
    await mkdir(path.join(directory, 'icons'));
    await mkdir(path.join(directory, '.cache'));
    await writeFile(path.join(directory, 'logo.png'), '');
    await writeFile(path.join(directory, 'icons', 'close.svg'), '');
    await writeFile(path.join(directory, '.hidden.jpg'), '');
    await writeFile(path.join(directory, '.cache', 'ignored.webp'), '');

    expect(collectImageFiles(directory)).toEqual([
      path.join('icons', 'close.svg'),
      'logo.png'
    ]);
  });

  it('渲染 ES Module 图片索引', () => {
    const output = renderImageIndex(['icons/close.svg', 'logo.png']);

    expect(output).toContain("import icons_close from './icons/close.svg';");
    expect(output).toContain('export default images;');
  });

  it('校验有效目录时提供写入和复制两个选项', async () => {
    const directory = await createImageDirectory();

    expect(validate(directory)).toMatchObject({
      strategy: 'options',
      items: [
        { arg: `${directory} --write`, valid: true },
        { arg: `${directory} --copy`, valid: true }
      ]
    });
  });

  it('写入 index.js 并返回成功项', async () => {
    const directory = await createImageDirectory();
    await writeFile(path.join(directory, 'logo.png'), '');

    const [item] = await handle(`${directory} --write`);

    await expect(readFile(path.join(directory, 'index.js'), 'utf8')).resolves.toContain('logo: logo');
    expect(spawnSync).not.toHaveBeenCalled();
    expect(item).toMatchObject({ uid: 'image-index-generated', valid: true });
  });

  it('复制索引到剪贴板而不写入文件', async () => {
    const directory = await createImageDirectory();
    await writeFile(path.join(directory, 'logo.png'), '');

    const [item] = await handle(`${directory} --copy`);

    expect(spawnSync).toHaveBeenCalledWith('pbcopy', expect.objectContaining({ encoding: 'utf8' }));
    await expect(readFile(path.join(directory, 'index.js'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
    expect(item).toMatchObject({ uid: 'image-index-copied', valid: true });
  });
});
