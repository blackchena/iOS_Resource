import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import { existsSync } from 'fs';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import { run as runImgResize } from '../tools/img-resize.js';

async function createPng(filePath) {
  await sharp({
    create: {
      width: 300,
      height: 200,
      channels: 4,
      background: { r: 120, g: 60, b: 20, alpha: 1 }
    }
  })
    .png()
    .toFile(filePath);
}

describe('img-resize', () => {
  let tempDir;
  let sourceFile;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'atk-img-convert-'));
    sourceFile = path.join(tempDir, 'sample.png');
    await createPng(sourceFile);
  });

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('should resize with width-only size and use name suffix -[size]', async () => {
    const items = await runImgResize(`${sourceFile} 120`);
    expect(items).toHaveLength(1);
    expect(items[0].uid).toBe('resized');
    expect(path.basename(items[0].arg)).toBe('sample-[120].png');
    expect(existsSync(items[0].arg)).toBe(true);
  });

  it('should resize with WIDTHxHEIGHT and use name suffix -[WIDTHxHEIGHT]', async () => {
    const items = await runImgResize(`${sourceFile} 80x40`);
    expect(items).toHaveLength(1);
    expect(items[0].uid).toBe('resized');
    expect(path.basename(items[0].arg)).toBe('sample-[80x40].png');
    expect(existsSync(items[0].arg)).toBe(true);
  });

  it('should reject when size is missing', async () => {
    const items = await runImgResize(`${sourceFile}`);
    expect(items).toHaveLength(1);
    expect(items[0].uid).toBe('error-missing-size');
    expect(items[0].valid).toBe(false);
  });
});
