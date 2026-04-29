// 图片格式转换工具模块
import sharp from 'sharp';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import toIco from 'png-to-ico';

// 支持的格式
const SUPPORTED_FORMATS = ['png', 'jpeg', 'jpg', 'webp', 'svg', 'ico'];
const OUTPUT_FORMATS = ['png', 'jpeg', 'webp', 'ico'];

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
 * 获取源文件可转换的目标格式列表（排除自身格式）
 */
function getAvailableTargets(sourceExt) {
  const ext = sourceExt.toLowerCase().replace('.', '');
  const normalized = ext === 'jpg' ? 'jpeg' : ext;
  return OUTPUT_FORMATS.filter(f => f !== normalized);
}

/**
 * 图片格式转换工具的 run 函数
 * @param {string} input - 文件路径 [目标格式]
 * @returns {Array<AlfredItem>} Alfred 列表项数组
 */
export async function run(input) {
  console.error("bla input", input)
  try {
    // 空/空白输入返回引导提示项
    if (!input || input.trim() === '') {
      return [{
        uid: 'guide',
        title: '⚠️ 请输入图片文件路径',
        subtitle: '格式: 文件路径 [目标格式]，如 /path/to/img.svg png',
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
        arg: `${filePath} ${fmt}`,
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

        return [{
          uid: 'converted',
          title: `✅ ${path.basename(outputPath)}`,
          subtitle: `已保存到: ${outputPath}（含 ${sizes.join('/')} 多尺寸图标）`,
          arg: outputPath,
          valid: true
        }];
      }
    }

    await pipeline.toFile(outputPath);

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
