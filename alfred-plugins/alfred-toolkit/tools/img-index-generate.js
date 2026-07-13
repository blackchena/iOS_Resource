#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const IMAGE_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif',
]);

export function isImageFile(filePath) {
  return IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function toCamelCase(value) {
  const parts = value
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return 'image';
  return parts[0].toLowerCase() + parts.slice(1)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

function toImportName(relativePath) {
  return relativePath
    .split(path.sep)
    .map((part) => path.parse(part).name
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase())
    .join('_');
}

export function collectImageFiles(imageDir) {
  if (!existsSync(imageDir) || !statSync(imageDir).isDirectory()) {
    throw new Error(`图片目录不存在或不是目录：${imageDir}`);
  }

  const files = [];
  function walk(currentDir) {
    for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      if (entry.isFile() && isImageFile(entry.name)) {
        files.push(path.relative(imageDir, fullPath));
      }
    }
  }
  walk(imageDir);
  return files.sort((a, b) => a.localeCompare(b));
}

function buildImageTree(relativeFiles) {
  const root = {};
  for (const relativePath of relativeFiles) {
    const segments = relativePath.split(path.sep);
    const filename = segments.pop();
    let current = root;
    for (const segment of segments) {
      const key = toCamelCase(segment);
      if (Object.hasOwn(current, key) && typeof current[key] !== 'object') {
        throw new Error(`命名冲突：${relativePath}`);
      }
      current[key] ||= {};
      current = current[key];
    }
    const key = toCamelCase(path.parse(filename).name);
    if (Object.hasOwn(current, key)) {
      throw new Error(`命名冲突：${relativePath}`);
    }
    current[key] = toImportName(relativePath);
  }
  return root;
}

function renderObject(value, indent = 2) {
  const lines = ['{'];
  for (const [key, child] of Object.entries(value)) {
    const padding = ' '.repeat(indent);
    if (typeof child === 'string') {
      lines.push(`${padding}${key}: ${child},`);
    } else {
      const nested = renderObject(child, indent + 2).split('\n');
      lines.push(`${padding}${key}: ${nested[0]}`);
      lines.push(...nested.slice(1, -1));
      lines.push(`${nested.at(-1)},`);
    }
  }
  lines.push(`${' '.repeat(Math.max(0, indent - 2))}}`);
  return lines.join('\n');
}

export function renderImageIndex(relativeFiles) {
  const imports = relativeFiles.map((relativePath) => {
    const importPath = `./${relativePath.replaceAll(path.sep, '/')}`;
    return `import ${toImportName(relativePath)} from '${importPath}';`;
  });
  const tree = buildImageTree(relativeFiles);
  return [
    '// 这是自动生成的图片索引文件，请勿手动修改',
    '',
    ...imports,
    '',
    'const images = ' + renderObject(tree) + ';',
    '',
    'export default images;',
    '',
  ].join('\n');
}

function copyToClipboard(content) {
  const result = spawnSync('pbcopy', { input: content, encoding: 'utf8' });
  if (result.error) throw new Error(`复制到剪贴板失败：${result.error.message}`);
  if (result.status !== 0) throw new Error('复制到剪贴板失败。');
}

function buildGuideItem(title, subtitle) {
  return { uid: 'image-index-guide', title, subtitle, valid: false };
}

function parseInput(input) {
  const trimmed = input?.trim() || '';
  for (const [suffix, action] of Object.entries({ '--write': 'write', '--copy': 'copy' })) {
    if (trimmed.endsWith(` ${suffix}`)) {
      return { imageDir: trimmed.slice(0, -suffix.length).trim(), action };
    }
  }
  return { imageDir: trimmed, action: null };
}

export function validate(input) {
  const { imageDir, action } = parseInput(input);
  if (!imageDir) {
    return {
      strategy: 'reject',
      items: [buildGuideItem('⚠️ 缺少图片目录', '示例: img-index-generate /path/to/assets')]
    };
  }
  if (!existsSync(imageDir) || !statSync(imageDir).isDirectory()) {
    return {
      strategy: 'reject',
      items: [buildGuideItem('⚠️ 图片目录不存在或不是目录', imageDir)]
    };
  }
  if (action) {
    return { strategy: 'handle' };
  }
  return {
    strategy: 'options',
    items: [
      {
        uid: 'image-index-write',
        title: '📝 生成 index.js',
        subtitle: `写入: ${path.join(imageDir, 'index.js')}`,
        arg: `${imageDir} --write`,
        variables: { ATK_ACTION: 'convert-now' },
        valid: true
      },
      {
        uid: 'image-index-copy',
        title: '📋 复制索引到剪贴板',
        subtitle: '不写入文件',
        arg: `${imageDir} --copy`,
        variables: { ATK_ACTION: 'convert-now' },
        valid: true
      }
    ]
  };
}

export async function handle(input) {
  const { imageDir, action } = parseInput(input);
  try {
    if (!imageDir) {
      return [buildGuideItem('⚠️ 缺少图片目录', '示例: img-index-generate /path/to/assets')];
    }
    const relativeFiles = collectImageFiles(imageDir);
    const output = renderImageIndex(relativeFiles);

    if (action === 'write') {
      const outputPath = path.join(imageDir, 'index.js');
      await writeFile(outputPath, output, 'utf8');
      return [{
        uid: 'image-index-generated',
        title: `✅ 已生成 ${relativeFiles.length} 个图片的索引`,
        subtitle: `已写入: ${outputPath}`,
        arg: outputPath,
        valid: true
      }];
    }

    if (action === 'copy') {
      copyToClipboard(output);
      return [{
        uid: 'image-index-copied',
        title: `✅ 已复制 ${relativeFiles.length} 个图片的索引`,
        subtitle: '索引内容已复制到剪贴板',
        arg: output,
        valid: true
      }];
    }

    return [buildGuideItem('⚠️ 请选择操作', '请选择生成 index.js 或复制索引到剪贴板')];
  } catch (error) {
    return [buildGuideItem('⚠️ 图片索引生成失败', error.message)];
  }
}
