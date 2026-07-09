// 图片缩放工具模块
import sharp from 'sharp';
import { readdir } from 'fs/promises';
import path from 'path';
import { existsSync, statSync } from 'fs';

const SUPPORTED_FORMATS = ['png', 'jpeg', 'jpg', 'webp', 'svg'];

function buildGuideItem(title, subtitle) {
  return {
    uid: 'validation-guide',
    title,
    subtitle,
    valid: false
  };
}

/**
 * 解析输入：文件/文件夹路径 + 尺寸
 * 格式: "/path/to/file.png 800x600"
 * @param {string} input
 * @returns {{ filePath: string, resizeRaw: string|null }}
 */
function parseInput(input) {
  const trimmed = input.trim();
  const lastSpaceIdx = trimmed.lastIndexOf(' ');

  if (lastSpaceIdx !== -1) {
    const possibleSize = trimmed.substring(lastSpaceIdx + 1).trim();
    if (/^\d+$/.test(possibleSize) || /^\d+x\d+$/i.test(possibleSize)) {
      return {
        filePath: trimmed.substring(0, lastSpaceIdx).trim(),
        resizeRaw: possibleSize
      };
    }
  }

  return {
    filePath: trimmed,
    resizeRaw: null
  };
}

/**
 * 参数校验：图片缩放需要执行前确认
 */
export function validate(input) {
  if (!input || input.trim() === '') {
    return {
      strategy: 'reject',
      items: [buildGuideItem('⚠️ 缺少参数', '示例: img-resize /path/to/img.png 800x600')]
    };
  }

  const { filePath, resizeRaw } = parseInput(input);
  if (!filePath) {
    return {
      strategy: 'reject',
      items: [buildGuideItem('⚠️ 路径不能为空', '示例: img-resize /path/to/img.png 800')]
    };
  }
  if (!existsSync(filePath)) {
    return {
      strategy: 'reject',
      items: [buildGuideItem('⚠️ 路径不存在', filePath)]
    };
  }
  if (!resizeRaw) {
    return {
      strategy: 'reject',
      items: [buildGuideItem('⚠️ 缺少尺寸参数', '示例: img-resize /path/to/img.png 800x600')]
    };
  }

  try {
    parseResizeSize(resizeRaw);
  } catch (error) {
    return {
      strategy: 'reject',
      items: [buildGuideItem('⚠️ 尺寸格式错误', error.message)]
    };
  }

  const type = statSync(filePath).isDirectory() ? '目录批量' : '单文件';
  return {
    strategy: 'confirm',
    summary: `${type} resize，尺寸: ${resizeRaw}`,
    tips: ['输出文件名: 原名-[size].ext']
  };
}

/**
 * 解析尺寸参数，支持 800 或 800x600
 * @param {string} sizeInput
 * @returns {{ width: number, height: number|null, sizeLabel: string }}
 */
function parseResizeSize(sizeInput) {
  const raw = (sizeInput || '').trim();
  if (!raw) {
    throw new Error('尺寸不能为空，示例: 800 或 800x600');
  }

  if (raw.includes('x')) {
    const matched = raw.match(/^(\d+)x(\d+)$/i);
    if (!matched) {
      throw new Error(`无效尺寸格式: ${raw}，示例: 800x600`);
    }
    const width = Number(matched[1]);
    const height = Number(matched[2]);
    if (width <= 0 || height <= 0) {
      throw new Error(`尺寸必须为正整数: ${raw}`);
    }
    return { width, height, sizeLabel: `${width}x${height}` };
  }

  const width = Number(raw);
  if (!Number.isInteger(width) || width <= 0) {
    throw new Error(`无效尺寸: ${raw}，示例: 800`);
  }
  return { width, height: null, sizeLabel: `${width}` };
}

/**
 * 生成不冲突的输出文件路径
 * @param {string} desiredPath
 * @returns {string}
 */
function getUniqueOutputPath(desiredPath) {
  if (!existsSync(desiredPath)) {
    return desiredPath;
  }

  const dir = path.dirname(desiredPath);
  const ext = path.extname(desiredPath);
  const baseName = path.basename(desiredPath, ext);
  let counter = 1;

  while (true) {
    const candidate = path.join(dir, `${baseName}_${counter}${ext}`);
    if (!existsSync(candidate)) {
      return candidate;
    }
    counter += 1;
  }
}

/**
 * 执行单个文件 resize
 * 输出命名: 原名-[size].ext
 * @param {string} filePath
 * @param {string} resizeRaw
 * @returns {Promise<string>} 输出文件路径
 */
async function resizeSingleFile(filePath, resizeRaw) {
  const { width, height, sizeLabel } = parseResizeSize(resizeRaw);
  const ext = path.extname(filePath);
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);
  const desiredOutputPath = path.join(dir, `${baseName}-${sizeLabel}${ext}`);
  const outputPath = getUniqueOutputPath(desiredOutputPath);

  const resizeOptions = height === null
    ? { width }
    : {
      width,
      height,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    };

  await sharp(filePath).resize(resizeOptions).toFile(outputPath);
  return outputPath;
}

/**
 * 图片缩放工具 run
 * @param {string} input - 文件路径/文件夹路径 [尺寸]
 * @returns {Array<AlfredItem>} Alfred 列表项数组
 */
export async function handle(input) {
  try {
    if (!input || input.trim() === '') {
      return [{
        uid: 'guide',
        title: '⚠️ 请输入图片文件/文件夹路径',
        subtitle: '格式: 路径 尺寸，如 /path/to/img.png 800x600',
        valid: false
      }];
    }

    const { filePath, resizeRaw } = parseInput(input);

    if (!existsSync(filePath)) {
      return [{
        uid: 'error-not-found',
        title: '⚠️ 文件不存在',
        subtitle: filePath,
        valid: false
      }];
    }
    if (!resizeRaw) {
      return [{
        uid: 'error-missing-size',
        title: '⚠️ 缺少尺寸参数',
        subtitle: '示例: /path/to/img.png 800x600',
        valid: false
      }];
    }

    // 提前校验尺寸，尽早给出错误
    parseResizeSize(resizeRaw);

    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      const entries = await readdir(filePath, { withFileTypes: true });
      const files = entries
        .filter(entry => entry.isFile())
        .map(entry => path.join(filePath, entry.name))
        .filter(fullPath => {
          const ext = path.extname(fullPath).toLowerCase().replace('.', '');
          const normalized = ext === 'jpg' ? 'jpeg' : ext;
          return SUPPORTED_FORMATS.includes(normalized);
        });

      if (files.length === 0) {
        return [{
          uid: 'error-empty-dir',
          title: '⚠️ 文件夹中没有可处理的图片',
          subtitle: `支持: ${SUPPORTED_FORMATS.join(', ')}`,
          valid: false
        }];
      }

      let resizedCount = 0;
      let failedCount = 0;

      for (const sourceFilePath of files) {
        try {
          await resizeSingleFile(sourceFilePath, resizeRaw);
          resizedCount += 1;
        } catch (_error) {
          failedCount += 1;
        }
      }

      return [{
        uid: 'batch-resized',
        title: `✅ 批量缩放完成：${resizedCount} 个`,
        subtitle: `失败 ${failedCount} 个，目录: ${filePath}`,
        arg: filePath,
        valid: true
      }];
    }

    if (!stat.isFile()) {
      return [{
        uid: 'error-invalid-path',
        title: '⚠️ 路径不是文件或文件夹',
        subtitle: filePath,
        valid: false
      }];
    }

    const sourceExt = path.extname(filePath).toLowerCase().replace('.', '');
    const normalizedSource = sourceExt === 'jpg' ? 'jpeg' : sourceExt;
    if (!SUPPORTED_FORMATS.includes(normalizedSource)) {
      return [{
        uid: 'error-unsupported',
        title: '⚠️ 不支持的图片格式',
        subtitle: `支持: ${SUPPORTED_FORMATS.join(', ')}，当前: .${sourceExt}`,
        valid: false
      }];
    }

    const outputPath = await resizeSingleFile(filePath, resizeRaw);

    return [{
      uid: 'resized',
      title: `📏 ${path.basename(outputPath)}`,
      subtitle: `已保存到: ${outputPath}`,
      arg: outputPath,
      valid: true
    }];
  } catch (error) {
    return [{
      uid: 'error',
      title: '⚠️ 缩放失败',
      subtitle: error.message,
      valid: false
    }];
  }
}

// 兼容旧接口
export const run = handle;
