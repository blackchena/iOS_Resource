#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const IMAGE_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif',
]);

function isImageFile(filePath) {
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

function collectImageFiles(imageDir) {
  if (!fs.existsSync(imageDir) || !fs.statSync(imageDir).isDirectory()) {
    throw new Error(`图片目录不存在或不是目录：${imageDir}`);
  }

  const files = [];
  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
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

function normalizeImportBase(imageDir) {
  if (path.isAbsolute(imageDir)) return `./${path.basename(imageDir)}`;
  return imageDir.replace(/\\/g, '/').replace(/\/$/, '');
}

function renderImageIndex(imageDir, relativeFiles) {
  const importBase = normalizeImportBase(imageDir);
  const imports = relativeFiles.map((relativePath) => {
    const importPath = `${importBase}/${relativePath.replaceAll(path.sep, '/')}`;
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

function main() {
  const imageDir = process.argv[2];
  if (!imageDir) {
    throw new Error('用法：node scripts/generate-image-index.cjs <图片目录>');
  }
  const output = renderImageIndex(imageDir, collectImageFiles(imageDir));
  copyToClipboard(output);
  console.log(`已生成 ${collectImageFiles(imageDir).length} 个图片的索引内容，并复制到剪贴板。`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`错误：${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { collectImageFiles, isImageFile, renderImageIndex };
