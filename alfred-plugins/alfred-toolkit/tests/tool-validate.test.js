import { describe, it, expect, vi } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import { existsSync } from 'fs';
import os from 'os';
import path from 'path';
import sharp from 'sharp';

vi.mock('alfy', () => ({
  default: {
    input: '',
    output: vi.fn()
  }
}));

const { handleValidationInput } = await import('../tool-validate.js');

describe('tool-validate', () => {
  it('should pass through and execute for unicode-encode (no confirm)', async () => {
    const items = await handleValidationInput('unicode-encode 你好');
    expect(items).toHaveLength(1);
    expect(items[0].uid).toBe('encoded');
    expect(items[0].valid).toBe(true);
  });

  it('should return guide item for missing unicode-decode argument', async () => {
    const items = await handleValidationInput('unicode-decode');
    expect(items).toHaveLength(1);
    expect(items[0].valid).toBe(false);
    expect(items[0].title).toContain('请输入 Unicode');
  });

  it('should execute handler when prefixed by __RUN__', async () => {
    const items = await handleValidationInput('__RUN__ unicode-decode \\u4f60');
    expect(items).toHaveLength(1);
    expect(items[0].uid).toBe('decoded');
    expect(items[0].title).toContain('你');
  });

  it('should return confirm item for img-resize', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'atk-tool-validate-'));
    const imagePath = path.join(tempDir, 'test.png');
    await sharp({
      create: {
        width: 50,
        height: 50,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    }).png().toFile(imagePath);

    const items = await handleValidationInput(`img-resize ${imagePath} 120`);
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].uid).toBe('confirm-run');
    expect(items[0].valid).toBe(true);
    expect(items[0].variables.ATK_ACTION).toBe('convert-now');
    expect(items[0].arg.startsWith('__RUN__ img-resize')).toBe(true);

    await rm(tempDir, { recursive: true, force: true });
    expect(existsSync(tempDir)).toBe(false);
  });

  it('should return write and copy options for img-index-generate', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'atk-tool-validate-'));

    const items = await handleValidationInput(`img-index-generate ${tempDir}`);

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ valid: true });
    expect(items[0].arg).toBe(`img-index-generate ${tempDir} --write`);
    expect(items[1].arg).toBe(`img-index-generate ${tempDir} --copy`);

    await rm(tempDir, { recursive: true, force: true });
  });

  it('should reject RSS summary when the feed configuration is missing', async () => {
    const items = await handleValidationInput('news-rss-summary feeds=/tmp/missing-news-feeds.json');
    expect(items).toHaveLength(1);
    expect(items[0].valid).toBe(false);
    expect(items[0].title).toContain('RSS 新闻摘要');
  });
});
