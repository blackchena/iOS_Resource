#!/usr/bin/env node

import sharp from "sharp";
import fs from "fs";
import path from "path";
import alfy from "alfy";
import toIco from "png-to-ico";

// 转换类型常量
const CONVERT_TYPES = {
  WEBP: "webp",
  ICO: "ico",
  COMPRESS: "compress",
  PNG: "png",
  JPG: "jpg",
  RESIZE: "resize",
  BLUR: "blur",
  PIXELATE: "pixel",
};

// 获取所有支持的转换类型数组
const SUPPORTED_TYPES = Object.values(CONVERT_TYPES);

// Get type and path from command line arguments
const convertType = process.argv[2];
const inputPath = process.argv[3];
const param4 = process.argv[4];


// Parse parameters based on convert type
let compressQuality = 80;
let resizeDimensions = "1024";
let blurSigma = 10;
let pixelateSize = 12;

if (convertType === CONVERT_TYPES.COMPRESS) {
  compressQuality = Number(param4) || compressQuality;
} else if (convertType === CONVERT_TYPES.RESIZE) {
  resizeDimensions = param4 || resizeDimensions;
} else if (convertType === CONVERT_TYPES.BLUR) {
  blurSigma = Number(param4) || blurSigma;
} else if (convertType === CONVERT_TYPES.PIXELATE) {
  pixelateSize = Number(param4) || pixelateSize;
}

if (!convertType || !inputPath) {
  const typesList = SUPPORTED_TYPES.join("|");
  alfy.output([
    {
      uid: "error-no-args",
      title: "Error: Missing arguments",
      subtitle: `Usage: node index.js <${typesList}> <folder_or_image_file> [quality_or_dimensions_or_parameter]`,
      icon: { path: alfy.icon.error },
      valid: false,
    },
  ]);
  process.exit(1);
}

if (!SUPPORTED_TYPES.includes(convertType)) {
  const typesList = SUPPORTED_TYPES.map((t) => `'${t}'`).join(", ");
  alfy.output([
    {
      uid: "error-type",
      title: "Error: Invalid convert type",
      subtitle: `Only ${typesList} are supported`,
      icon: { path: alfy.icon.error },
      valid: false,
    },
  ]);
  process.exit(1);
}
if (!fs.existsSync(inputPath)) {
  alfy.output([
    {
      uid: "error-path-not-exist",
      title: `Error: Path does not exist`,
      subtitle: `Path: ${inputPath}`,
      icon: { path: alfy.icon.error },
      valid: false,
    },
  ]);
  process.exit(1);
}

const stats = fs.statSync(inputPath);

// 解析尺寸参数的函数
function parseDimensions(dimensionsStr) {
  // 支持 "800x600" 或 "800" 格式
  if (dimensionsStr.includes("x")) {
    const match = dimensionsStr.match(/^(\d+)x(\d+)$/);
    if (!match) {
      throw new Error(
        `Invalid dimensions format: ${dimensionsStr}. Expected format: WIDTHxHEIGHT (e.g., 800x600)`
      );
    }
    return {
      width: parseInt(match[1], 10),
      height: parseInt(match[2], 10),
    };
  } else {
    // 只指定width
    const width = parseInt(dimensionsStr, 10);
    if (isNaN(width) || width <= 0) {
      throw new Error(
        `Invalid width: ${dimensionsStr}. Expected a positive number`
      );
    }
    return {
      width: width,
      height: null,
    };
  }
}

// 生成唯一文件名的函数
function getUniqueFilePath(originalPath) {
  const dir = path.dirname(originalPath);
  const ext = path.extname(originalPath);
  const baseName = path.basename(originalPath, ext);

  let counter = 1;
  let newPath = originalPath;

  while (fs.existsSync(newPath)) {
    const newFileName = `${baseName}_${counter}${ext}`;
    newPath = path.join(dir, newFileName);
    counter++;
  }

  return newPath;
}

// 验证图片格式
function validateImageFormat(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const supportedFormats = [".png", ".jpg", ".jpeg", ".webp"];

  if (!supportedFormats.includes(ext)) {
    return {
      valid: false,
      error: {
        uid: "error-unsupported-format",
        title: `Error: Unsupported image format`,
        subtitle: `Supported formats: PNG, JPG, JPEG, WEBP. File: ${imagePath}`,
        icon: { path: alfy.icon.error },
        valid: false,
      },
    };
  }
  return { valid: true, ext };
}

// 通用格式转换函数 - 支持将图片转换为 png/jpg/webp
async function convertToFormat(imagePath, targetFormat, options = {}) {
  const ext = path.extname(imagePath).toLowerCase();
  const dir = path.dirname(imagePath);
  const displayName = options.displayName || path.basename(imagePath);

  // 目标格式与源格式相同，跳过
  const formatExtMap = { png: ".png", jpg: ".jpg", jpeg: ".jpg", webp: ".webp" };
  const targetExt = formatExtMap[targetFormat];
  if (ext === targetExt || (targetFormat === "jpg" && ext === ".jpeg")) {
    return { success: false, result: null, skip: true };
  }

  const baseName = path.basename(imagePath, ext);
  const outputFile = baseName + targetExt;
  const outputPath = path.join(dir, outputFile);
  const uniqueOutputPath = getUniqueFilePath(outputPath);
  const finalFileName = path.basename(uniqueOutputPath);

  // 各格式默认参数
  const formatOptions = {
    png: { quality: 90, compressionLevel: 6, progressive: true, ...options.png },
    jpg: { quality: 90, progressive: true, mozjpeg: true, ...options.jpg },
    webp: { quality: 80, effort: 4, nearLossless: false, ...options.webp },
  };

  const sharpFormat = targetFormat === "jpg" ? "jpeg" : targetFormat;
  const opts = formatOptions[targetFormat] || formatOptions[sharpFormat] || {};

  await sharp(imagePath)[sharpFormat](opts).toFile(uniqueOutputPath);

  return {
    success: true,
    result: {
      uid: `converted-${finalFileName}`,
      title: `✅ ${finalFileName}`,
      subtitle: `Successfully converted from ${displayName}`,
      arg: uniqueOutputPath,
      icon: { path: uniqueOutputPath },
      valid: true,
    },
  };
}

// 核心图片处理函数 - 处理单个图片的转换逻辑
async function processImage(imagePath, fileName = null) {
  const validation = validateImageFormat(imagePath);
  if (!validation.valid) {
    return { success: false, result: validation.error };
  }

  const ext = validation.ext;
  const displayName = fileName || path.basename(imagePath);
  const dir = path.dirname(imagePath);

  try {
    if (convertType === CONVERT_TYPES.WEBP) {
      return await convertToFormat(imagePath, "webp", { displayName });
    } else if (convertType === CONVERT_TYPES.ICO) {
      const icoFile = path.basename(imagePath, ext) + ".ico";
      const icoPath = path.join(dir, icoFile);
      const uniqueIcoPath = getUniqueFilePath(icoPath);
      const finalIcoFile = path.basename(uniqueIcoPath);

      const sizes = [256, 128, 64, 48, 32, 16];
      const pngBuffers = await Promise.all(
        sizes.map((size) =>
          sharp(imagePath)
            .resize(size, size, {
              fit: "contain",
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .png()
            .toBuffer()
        )
      );
      const buf = await toIco(pngBuffers);
      fs.writeFileSync(uniqueIcoPath, buf);

      return {
        success: true,
        result: {
          uid: `converted-${finalIcoFile}`,
          title: `✅ ${finalIcoFile}`,
          subtitle: `Successfully converted from ${displayName}`,
          arg: uniqueIcoPath,
          icon: { path: uniqueIcoPath },
          valid: true,
        },
      };
    } else if (convertType === CONVERT_TYPES.COMPRESS) {
      const baseName = path.basename(imagePath, ext);
      const compressedFile = baseName + "_compressed" + ext;
      const compressedPath = path.join(dir, compressedFile);
      const uniqueCompressedPath = getUniqueFilePath(compressedPath);
      const finalCompressedFile = path.basename(uniqueCompressedPath);

      let sharpInstance = sharp(imagePath);

      // 根据文件格式应用不同的压缩策略
      if (ext === ".png") {
        sharpInstance = sharpInstance.png({
          quality: compressQuality,
          compressionLevel: 9,
          progressive: true,
        });
      } else if (ext === ".jpg" || ext === ".jpeg") {
        sharpInstance = sharpInstance.jpeg({
          quality: compressQuality,
          progressive: true,
          mozjpeg: true,
        });
      } else if (ext === ".webp") {
        sharpInstance = sharpInstance.webp({
          quality: compressQuality,
          effort: 4,
        });
      }

      await sharpInstance.toFile(uniqueCompressedPath);

      // 获取原始文件大小和压缩后文件大小
      const originalStats = fs.statSync(imagePath);
      const compressedStats = fs.statSync(uniqueCompressedPath);
      const compressionRatio = (
        ((originalStats.size - compressedStats.size) / originalStats.size) *
        100
      ).toFixed(1);

      return {
        success: true,
        result: {
          uid: `compressed-${finalCompressedFile}`,
          title: `🗜️ ${finalCompressedFile}`,
          subtitle: `Compressed from ${displayName} (${compressionRatio}% smaller)`,
          arg: uniqueCompressedPath,
          icon: { path: uniqueCompressedPath },
          valid: true,
        },
      };
    } else if (convertType === CONVERT_TYPES.PNG) {
      return await convertToFormat(imagePath, "png", { displayName });
    } else if (convertType === CONVERT_TYPES.JPG) {
      return await convertToFormat(imagePath, "jpg", { displayName });
    } else if (convertType === CONVERT_TYPES.RESIZE) {
      const baseName = path.basename(imagePath, ext);
      const resizedFile = baseName + "_resized" + ext;
      const resizedPath = path.join(dir, resizedFile);
      const uniqueResizedPath = getUniqueFilePath(resizedPath);
      const finalResizedFile = path.basename(uniqueResizedPath);

      const dimensions = parseDimensions(resizeDimensions);

      const resizeOptions =
        dimensions.height === null
          ? { width: dimensions.width }
          : {
              width: dimensions.width,
              height: dimensions.height,
              fit: "contain",
              background: { r: 255, g: 255, b: 255, alpha: 1 },
            };

      await sharp(imagePath).resize(resizeOptions).toFile(uniqueResizedPath);

      // 获取原始图片尺寸和调整后的尺寸
      const originalMetadata = await sharp(imagePath).metadata();
      const resizedMetadata = await sharp(uniqueResizedPath).metadata();

      const sizeInfo =
        dimensions.height === null
          ? `from ${originalMetadata.width}x${originalMetadata.height} to ${resizedMetadata.width}x${resizedMetadata.height} (width: ${dimensions.width})`
          : `from ${originalMetadata.width}x${originalMetadata.height} to ${dimensions.width}x${dimensions.height}`;

      return {
        success: true,
        result: {
          uid: `resized-${finalResizedFile}`,
          title: `📏 ${finalResizedFile}`,
          subtitle: `Resized ${sizeInfo}`,
          arg: uniqueResizedPath,
          icon: { path: uniqueResizedPath },
          valid: true,
        },
      };
    } else if (convertType === CONVERT_TYPES.BLUR) {
      const baseName = path.basename(imagePath, ext);
      const blurredFile = baseName + "_blurred" + ext;
      const blurredPath = path.join(dir, blurredFile);
      const uniqueBlurredPath = getUniqueFilePath(blurredPath);
      const finalBlurredFile = path.basename(uniqueBlurredPath);
      
      const metadata = await sharp(imagePath).metadata();
      await sharp(imagePath)
        // .composite([
        //   {
        //     input: {
        //       create: {
        //         width: metadata.width,
        //         height: metadata.height,
        //         channels: 4,
        //         background: { r: 255, g: 255, b: 255, alpha: 0.1 }
        //       }
        //     },
        //     blend: 'over'
        //   }
        // ])
        .blur(blurSigma)
        .toFile(uniqueBlurredPath);

      return {
        success: true,
        result: {
          uid: `blurred-${finalBlurredFile}`,
          title: `🌫️ ${finalBlurredFile}`,
          subtitle: `Blurred with sigma=${blurSigma} from ${displayName}`,
          arg: uniqueBlurredPath,
          icon: { path: uniqueBlurredPath },
          valid: true,
        },
      };
    } else if (convertType === CONVERT_TYPES.PIXELATE) {
      const baseName = path.basename(imagePath, ext);
      const pixelatedFile = baseName + "_pixelated" + ext;
      const pixelatedPath = path.join(dir, pixelatedFile);
      const uniquePixelatedPath = getUniqueFilePath(pixelatedPath);
      const finalPixelatedFile = path.basename(uniquePixelatedPath);

      const metadata = await sharp(imagePath).metadata();
      const smallWidth = Math.max(1, Math.floor(metadata.width / pixelateSize));
      const smallHeight = Math.max(1, Math.floor(metadata.height / pixelateSize));
      
      // First resize to small size and get buffer
      const smallImageBuffer = await sharp(imagePath)
        .resize(smallWidth, smallHeight, {
          kernel: sharp.kernel.nearest,
        })
        .toBuffer();
      
      // Then resize the small image back to original size
      await sharp(smallImageBuffer)
        .resize(metadata.width, metadata.height, {
          kernel: sharp.kernel.nearest,
        })
        .toFile(uniquePixelatedPath);

      return {
        success: true,
        result: {
          uid: `pixelated-${finalPixelatedFile}`,
          title: `🎨 ${finalPixelatedFile}`,
          subtitle: `Pixelated with size=${pixelateSize} from ${displayName}`,
          arg: uniquePixelatedPath,
          icon: { path: uniquePixelatedPath },
          valid: true,
        },
      };
    }
  } catch (error) {
    const errorMessage =
      convertType === CONVERT_TYPES.BLUR
        ? "Blur failed"
        : convertType === CONVERT_TYPES.PIXELATE
        ? "Pixelate failed"
        : convertType === CONVERT_TYPES.RESIZE
        ? "Resize failed"
        : convertType === CONVERT_TYPES.COMPRESS
        ? "Compression failed"
        : "Conversion failed";

    return {
      success: false,
      result: {
        uid: `failed-${displayName}`,
        title: `❌ ${displayName} - ${errorMessage}`,
        subtitle: error.message,
        icon: { path: alfy.icon.error },
        valid: false,
      },
    };
  }
}

// 单文件转换
async function convertSingleImage(imagePath) {
  const validation = validateImageFormat(imagePath);
  if (!validation.valid) {
    alfy.output([validation.error]);
    process.exit(1);
  }

  const result = await processImage(imagePath);

  if (result.skip) {
    return;
  }

  if (result.success) {
    alfy.output([result.result]);
  } else {
    alfy.output([result.result]);
    if (result.result && result.result.uid === "error-unsupported-format") {
      process.exit(1);
    }
  }
}

// 文件夹批量转换
async function convertFolder(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    const supportedFormats = [".png", ".jpg", ".jpeg", ".webp"];
    const imageFiles = files.filter((file) =>
      supportedFormats.includes(path.extname(file).toLowerCase())
    );

    if (imageFiles.length === 0) {
      alfy.output([
        {
          uid: "no-files",
          title: "⚠️ No supported image files found",
          subtitle: `No PNG, JPG, JPEG, or WEBP files found in: ${folderPath}`,
          icon: { path: alfy.icon.warning },
          valid: false,
        },
      ]);
      return;
    }

    // ICO conversion only supports single PNG file
    if (convertType === CONVERT_TYPES.ICO) {
      alfy.output([
        {
          uid: "error-ico-only-single-file",
          title: "Error: ICO conversion only supports single PNG file",
          subtitle: "Please select a single PNG file for ICO conversion",
          icon: { path: alfy.icon.error },
          valid: false,
        },
      ]);
      process.exit(1);
    }

    const convertedFiles = [];
    const failedFiles = [];

    for (const imageFile of imageFiles) {
      const imagePath = path.join(folderPath, imageFile);
      const result = await processImage(imagePath, imageFile);

      if (result.skip) {
        continue;
      }

      if (result.success) {
        convertedFiles.push(result.result);
      } else {
        failedFiles.push(result.result);
      }
    }

    const alfredItems = [
      {
        uid: "summary",
        title: `📊 Conversion Summary: ${convertedFiles.length} files converted`,
        subtitle:
          failedFiles.length > 0
            ? `❌ Failed: ${failedFiles.length} files`
            : `✅ All files converted successfully`,
        arg: folderPath,
        icon: { path: folderPath },
        valid: true,
      },
      {
        uid: "separator",
        title: "─".repeat(50),
        subtitle: "",
        icon: { path: folderPath },
        valid: false,
      },
      ...convertedFiles,
      ...(failedFiles.length > 0
        ? [
            {
              uid: "failed-separator",
              title: "Failed conversions:",
              subtitle: "",
              icon: { path: folderPath },
              valid: false,
            },
            ...failedFiles,
          ]
        : []),
    ];
    alfy.output(alfredItems);
  } catch (error) {
    alfy.output([
      {
        uid: "error",
        title: "❌ Error during conversion",
        subtitle: error.message,
        icon: { path: alfy.icon.error },
        valid: false,
      },
    ]);
    process.exit(1);
  }
}

if (stats.isDirectory()) {
  convertFolder(inputPath);
} else if (stats.isFile()) {
  convertSingleImage(inputPath);
} else {
  alfy.output([
    {
      uid: "error-not-file-or-folder",
      title: `Error: Path is not a file or directory`,
      subtitle: `Path: ${inputPath}`,
      icon: { path: alfy.icon.error },
      valid: false,
    },
  ]);
  process.exit(1);
}
