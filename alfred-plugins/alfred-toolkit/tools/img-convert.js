// 图片格式转换工具模块
import sharp from 'sharp';
import { readFile, writeFile, readdir } from 'fs/promises';
import path from 'path';
import { existsSync, statSync } from 'fs';
import toIco from 'png-to-ico';

// 支持的格式
const SUPPORTED_FORMATS = ['png', 'jpeg', 'jpg', 'webp', 'svg', 'ico'];
const OUTPUT_FORMATS = ['png', 'jpeg', 'webp', 'ico'];

function buildGuideItem(title, subtitle) {
  return {
    uid: 'validation-guide',
    title,
    subtitle,
    valid: false
  };
}

/**
 * 解析输入：文件路径 + 可选的目标格式
 * 格式: "/path/to/file.svg png" 或 "/path/to/file.svg"
 * @param {string} input
 * @returns {{ filePath: string, targetFormat: string|null }}
 */
function parseInput(input) {
  const trimmed = input.trim();

  // 尝试从末尾提取目标格式（空格分隔的最后一个词）
  const lastSpaceIdx = trimmed.lastIndexOf(' ');
  if (lastSpaceIdx !== -1) {
    const possibleFormat = trimmed.substring(lastSpaceIdx + 1).toLowerCase();
    if (OUTPUT_FORMATS.includes(possibleFormat) || possibleFormat === 'jpg') {
      return {
        filePath: trimmed.substring(0, lastSpaceIdx).trim(),
        targetFormat: possibleFormat === 'jpg' ? 'jpeg' : possibleFormat
      };
    }
  }

  return { filePath: trimmed, targetFormat: null };
}

/**
 * 参数校验：图片转换需要执行前确认
 */
export function validate(input) {
  if (!input || input.trim() === '') {
    return {
      strategy: 'reject',
      items: [buildGuideItem('⚠️ 缺少参数', '示例: img-convert /path/to/img.png webp')]
    };
  }

  const { filePath, targetFormat } = parseInput(input);
  if (!filePath) {
    return {
      strategy: 'reject',
      items: [buildGuideItem('⚠️ 路径不能为空', '示例: img-convert /path/to/img.png webp')]
    };
  }
  if (!existsSync(filePath)) {
    return {
      strategy: 'reject',
      items: [buildGuideItem('⚠️ 文件不存在', filePath)]
    };
  }

  const stat = statSync(filePath);
  const scope = stat.isDirectory() ? '目录批量' : '单文件';
  const summary = targetFormat
    ? `${scope} 转换，目标格式: ${targetFormat.toUpperCase()}`
    : `${scope} 转换，未指定目标格式（将展示可选格式）`;

  return {
    strategy: 'confirm',
    summary,
    tips: ['回车确认后执行图片格式转换']
  };
}

/**
 * 获取源文件可转换的目标格式列表（排除自身格式）
 */
function getAvailableTargets(sourceExt) {
  const ext = sourceExt.toLowerCase().replace('.', '');
  const normalized = ext === 'jpg' ? 'jpeg' : ext;
  return OUTPUT_FORMATS.filter(f => f !== normalized);
}

/**
 * 执行单个文件转换
 * @param {string} filePath
 * @param {'png'|'jpeg'|'webp'|'ico'} targetFormat
 * @returns {Promise<string>} 输出文件路径
 */
async function convertSingleFile(filePath, targetFormat) {
  const outputExt = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
  const outputPath = filePath.replace(/\.[^.]+$/, `.${outputExt}`);

  const buffer = await readFile(filePath);
  let pipeline = sharp(buffer);

  switch (targetFormat) {
    case 'png':
      pipeline = pipeline.png();
      break;
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality: 90 });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality: 90 });
      break;
    case 'ico': {
      // ICO: 生成多尺寸 PNG 缓冲区，再用 png-to-ico 合成真正的 ICO 文件
      const sizes = [256, 128, 64, 48, 32, 16];
      const pngBuffers = await Promise.all(
        sizes.map(size =>
          sharp(buffer)
            .resize(size, size, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .png()
            .toBuffer()
        )
      );
      const icoBuf = await toIco(pngBuffers);
      await writeFile(outputPath, icoBuf);
      return outputPath;
    }
  }

  await pipeline.toFile(outputPath);
  return outputPath;
}

/**
 * 图片格式转换工具的 run 函数
 * @param {string} input - 文件路径/文件夹路径 [目标格式]
 * @returns {Array<AlfredItem>} Alfred 列表项数组
 */
export async function handle(input) {
  // console.error("bla input", input)
  try {
    // 空/空白输入返回引导提示项
    if (!input || input.trim() === '') {
      return [{
        uid: 'guide',
        title: '⚠️ 请输入图片文件/文件夹路径',
        subtitle: '格式: 路径 [目标格式]，如 /path/to/img.svg png 或 /path/to/dir webp',
        valid: false
      }];
    }

    const { filePath, targetFormat } = parseInput(input);

    // 检查文件是否存在
    if (!existsSync(filePath)) {
      return [{
        uid: 'error-not-found',
        title: '⚠️ 文件不存在',
        subtitle: filePath,
        valid: false
      }];
    }

    const stat = statSync(filePath);
    const isDirectory = stat.isDirectory();

    if (isDirectory) {
      // 目录输入未指定目标格式：列出所有可选目标格式
      if (!targetFormat) {
        return OUTPUT_FORMATS.map(fmt => ({
          uid: `convert-dir-${fmt}`,
          title: `🔄 批量转换为 ${fmt.toUpperCase()}`,
          subtitle: `${path.basename(filePath)}/* → .${fmt === 'jpeg' ? 'jpg' : fmt}`,
          arg: `img-convert ${filePath} ${fmt}`,
          variables: {
            ATK_ACTION: 'convert-now'
          },
          valid: true
        }));
      }

      // 批量转换目录下（非递归）支持格式的图片
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
          title: '⚠️ 文件夹中没有可转换的图片',
          subtitle: `支持: ${SUPPORTED_FORMATS.join(', ')}`,
          valid: false
        }];
      }

      let convertedCount = 0;
      let skippedCount = 0;
      let failedCount = 0;

      for (const sourceFilePath of files) {
        try {
          const sourceExt = path.extname(sourceFilePath).toLowerCase().replace('.', '');
          const normalizedSource = sourceExt === 'jpg' ? 'jpeg' : sourceExt;

          if (targetFormat === normalizedSource) {
            skippedCount += 1;
            continue;
          }

          await convertSingleFile(sourceFilePath, targetFormat);
          convertedCount += 1;
        } catch (_error) {
          failedCount += 1;
        }
      }

      if (convertedCount === 0 && failedCount === 0) {
        return [{
          uid: 'batch-skipped',
          title: '⚠️ 没有可转换的文件',
          subtitle: `目标格式 ${targetFormat.toUpperCase()} 与源格式相同`,
          valid: false
        }];
      }

      return [{
        uid: 'batch-converted',
        title: `✅ 批量转换完成：${convertedCount} 个`,
        subtitle: `已跳过 ${skippedCount} 个，失败 ${failedCount} 个，目录: ${filePath}`,
        arg: filePath,
        valid: true
      }];
    }

    // 检查源文件格式
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

    // 未指定目标格式：列出所有可转换的格式供选择
    if (!targetFormat) {
      const targets = getAvailableTargets(sourceExt);
      return targets.map(fmt => ({
        uid: `convert-${fmt}`,
        title: `🔄 转换为 ${fmt.toUpperCase()}`,
        subtitle: `${path.basename(filePath)} → .${fmt === 'jpeg' ? 'jpg' : fmt}`,
        arg: `img-convert ${filePath} ${fmt}`,
        variables: {
          ATK_ACTION: 'convert-now'
        },
        valid: true
      }));
    }

    // 目标格式与源格式相同
    if (targetFormat === normalizedSource) {
      return [{
        uid: 'error-same',
        title: '⚠️ 目标格式与源格式相同',
        subtitle: `文件已经是 ${targetFormat.toUpperCase()} 格式`,
        valid: false
      }];
    }

    // 执行转换
    const outputPath = await convertSingleFile(filePath, targetFormat);

    return [{
      uid: 'converted',
      title: `✅ ${path.basename(outputPath)}`,
      subtitle: `已保存到: ${outputPath}`,
      arg: outputPath,
      valid: true
    }];
  } catch (error) {
    return [{
      uid: 'error',
      title: '⚠️ 转换失败',
      subtitle: error.message,
      valid: false
    }];
  }
}

// 兼容旧接口
export const run = handle;
