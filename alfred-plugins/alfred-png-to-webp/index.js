#!/usr/bin/env node

import sharp from "sharp";
import fs from "fs";
import path from "path";
import alfy from "alfy";
import toIco from "png-to-ico";

// Get type and path from command line arguments
const convertType = process.argv[2];
const inputPath = process.argv[3];
const compressQuality = Number(process.argv[4]) || 80;
const resizeDimensions = process.argv[5] || "1024"; // Default resize dimensions (width only)

if (!convertType || !inputPath) {
  alfy.output([
    {
      uid: "error-no-args",
      title: "Error: Missing arguments",
      subtitle: "Usage: node index.js <webp|ico|compress|png|resize> <folder_or_image_file> [quality_or_dimensions]. For resize: WIDTH or WIDTHxHEIGHT",
      icon: { path: alfy.icon.error },
      valid: false,
    },
  ]);
  process.exit(1);
}

if (convertType !== "webp" && convertType !== "ico" && convertType !== "compress" && convertType !== "png" && convertType !== "resize") {
  alfy.output([
    {
      uid: "error-type",
      title: "Error: Invalid convert type",
      subtitle: "Only 'webp', 'ico', 'compress', 'png', or 'resize' are supported",
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
  if (dimensionsStr.includes('x')) {
    const match = dimensionsStr.match(/^(\d+)x(\d+)$/);
    if (!match) {
      throw new Error(`Invalid dimensions format: ${dimensionsStr}. Expected format: WIDTHxHEIGHT (e.g., 800x600)`);
    }
    return {
      width: parseInt(match[1], 10),
      height: parseInt(match[2], 10)
    };
  } else {
    // 只指定width
    const width = parseInt(dimensionsStr, 10);
    if (isNaN(width) || width <= 0) {
      throw new Error(`Invalid width: ${dimensionsStr}. Expected a positive number`);
    }
    return {
      width: width,
      height: null
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

// 单文件转换
async function convertSingleImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const supportedFormats = [".png", ".jpg", ".jpeg", ".webp"];
  
  if (!supportedFormats.includes(ext)) {
    alfy.output([
      {
        uid: "error-unsupported-format",
        title: `Error: Unsupported image format`,
        subtitle: `Supported formats: PNG, JPG, JPEG, WEBP. File: ${imagePath}`,
        icon: { path: alfy.icon.error },
        valid: false,
      },
    ]);
    process.exit(1);
  }
  if (convertType === "webp") {
    const baseName = path.basename(imagePath, ext);
    const webpFile = baseName + ".webp";
    const webpPath = path.join(path.dirname(imagePath), webpFile);
    const uniqueWebpPath = getUniqueFilePath(webpPath);
    const finalWebpFile = path.basename(uniqueWebpPath);
    
    try {
      await sharp(imagePath)
        .webp({ quality: 80, effort: 4, nearLossless: false })
        .toFile(uniqueWebpPath);
      alfy.output([
        {
          uid: `converted-${finalWebpFile}`,
          title: `✅ ${finalWebpFile}`,
          subtitle: `Successfully converted from ${path.basename(imagePath)}`,
          arg: uniqueWebpPath,
          icon: { path: uniqueWebpPath },
          valid: true,
        },
      ]);
    } catch (error) {
      alfy.output([
        {
          uid: `failed-${path.basename(imagePath)}`,
          title: `❌ ${path.basename(imagePath)} - Conversion failed`,
          subtitle: error.message,
          icon: { path: alfy.icon.error },
          valid: false,
        },
      ]);
    }
  } else if (convertType === "ico") {    
    const icoFile = path.basename(imagePath, ext) + ".ico";
    const icoPath = path.join(path.dirname(imagePath), icoFile);
    const uniqueIcoPath = getUniqueFilePath(icoPath);
    const finalIcoFile = path.basename(uniqueIcoPath);
    
    try {
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
      alfy.output([
        {
          uid: `converted-${finalIcoFile}`,
          title: `✅ ${finalIcoFile}`,
          subtitle: `Successfully converted from ${path.basename(imagePath)}`,
          arg: uniqueIcoPath,
          icon: { path: uniqueIcoPath },
          valid: true,
        },
      ]);
    } catch (error) {
      alfy.output([
        {
          uid: `failed-${path.basename(imagePath)}`,
          title: `❌ ${path.basename(imagePath)} - Conversion failed`,
          subtitle: error.message,
          icon: { path: alfy.icon.error },
          valid: false,
        },
      ]);
    }
  } else if (convertType === "compress") {
    const baseName = path.basename(imagePath, ext);
    const compressedFile = baseName + "_compressed" + ext;
    const compressedPath = path.join(path.dirname(imagePath), compressedFile);
    const uniqueCompressedPath = getUniqueFilePath(compressedPath);
    const finalCompressedFile = path.basename(uniqueCompressedPath);
    
    try {
      let sharpInstance = sharp(imagePath);
      
      // 根据文件格式应用不同的压缩策略
      if (ext === ".png") {
        sharpInstance = sharpInstance.png({ 
          quality: compressQuality, 
          compressionLevel: 9,
          progressive: true 
        });
      } else if (ext === ".jpg" || ext === ".jpeg") {
        sharpInstance = sharpInstance.jpeg({ 
          quality: compressQuality, 
          progressive: true,
          mozjpeg: true 
        });
      } else if (ext === ".webp") {
        sharpInstance = sharpInstance.webp({ 
          quality: compressQuality, 
          effort: 4 
        });
      }
      
      await sharpInstance.toFile(uniqueCompressedPath);
      
      // 获取原始文件大小和压缩后文件大小
      const originalStats = fs.statSync(imagePath);
      const compressedStats = fs.statSync(uniqueCompressedPath);
      const compressionRatio = ((originalStats.size - compressedStats.size) / originalStats.size * 100).toFixed(1);
      
      alfy.output([
        {
          uid: `compressed-${finalCompressedFile}`,
          title: `🗜️ ${finalCompressedFile}`,
          subtitle: `Compressed from ${path.basename(imagePath)} (${compressionRatio}% smaller)`,
          arg: uniqueCompressedPath,
          icon: { path: uniqueCompressedPath },
          valid: true,
        },
      ]);
    } catch (error) {
      alfy.output([
        {
          uid: `failed-${path.basename(imagePath)}`,
          title: `❌ ${path.basename(imagePath)} - Compression failed`,
          subtitle: error.message,
          icon: { path: alfy.icon.error },
          valid: false,
        },
      ]);
    }
  } else if (convertType === "png") {
    const baseName = path.basename(imagePath, ext);
    const pngFile = baseName + ".png";
    const pngPath = path.join(path.dirname(imagePath), pngFile);
    const uniquePngPath = getUniqueFilePath(pngPath);
    const finalPngFile = path.basename(uniquePngPath);
    
    try {
      await sharp(imagePath)
        .png({ 
          quality: 90, 
          compressionLevel: 6,
          progressive: true 
        })
        .toFile(uniquePngPath);
      alfy.output([
        {
          uid: `converted-${finalPngFile}`,
          title: `✅ ${finalPngFile}`,
          subtitle: `Successfully converted from ${path.basename(imagePath)}`,
          arg: uniquePngPath,
          icon: { path: uniquePngPath },
          valid: true,
        },
      ]);
    } catch (error) {
      alfy.output([
        {
          uid: `failed-${path.basename(imagePath)}`,
          title: `❌ ${path.basename(imagePath)} - Conversion failed`,
          subtitle: error.message,
          icon: { path: alfy.icon.error },
          valid: false,
        },
      ]);
    }
  } else if (convertType === "resize") {
    const baseName = path.basename(imagePath, ext);
    const resizedFile = baseName + "_resized" + ext;
    const resizedPath = path.join(path.dirname(imagePath), resizedFile);
    const uniqueResizedPath = getUniqueFilePath(resizedPath);
    const finalResizedFile = path.basename(uniqueResizedPath);
    
    try {
      const dimensions = parseDimensions(resizeDimensions);
      
      const resizeOptions = dimensions.height === null 
        ? { width: dimensions.width }
        : { 
            width: dimensions.width, 
            height: dimensions.height,
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          };
      
      await sharp(imagePath)
        .resize(resizeOptions)
        .toFile(uniqueResizedPath);
      
      // 获取原始图片尺寸和调整后的尺寸
      const originalMetadata = await sharp(imagePath).metadata();
      const resizedMetadata = await sharp(uniqueResizedPath).metadata();
      
      const sizeInfo = dimensions.height === null 
        ? `from ${originalMetadata.width}x${originalMetadata.height} to ${resizedMetadata.width}x${resizedMetadata.height} (width: ${dimensions.width})`
        : `from ${originalMetadata.width}x${originalMetadata.height} to ${dimensions.width}x${dimensions.height}`;
      
      alfy.output([
        {
          uid: `resized-${finalResizedFile}`,
          title: `📏 ${finalResizedFile}`,
          subtitle: `Resized ${sizeInfo}`,
          arg: uniqueResizedPath,
          icon: { path: uniqueResizedPath },
          valid: true,
        },
      ]);
    } catch (error) {
      alfy.output([
        {
          uid: `failed-${path.basename(imagePath)}`,
          title: `❌ ${path.basename(imagePath)} - Resize failed`,
          subtitle: error.message,
          icon: { path: alfy.icon.error },
          valid: false,
        },
      ]);
    }
  }
}

// 文件夹批量转换
async function convertFolder(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    const supportedFormats = [".png", ".jpg", ".jpeg", ".webp"];
    const imageFiles = files.filter(
      (file) => supportedFormats.includes(path.extname(file).toLowerCase())
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
    const convertedFiles = [];
    const failedFiles = [];
    for (const imageFile of imageFiles) {
      const imagePath = path.join(folderPath, imageFile);
      const ext = path.extname(imageFile).toLowerCase();
      
      if (convertType === "webp") {
        if (ext === ".webp") {
          continue;
        }
        const baseName = path.basename(imageFile, ext);
        const webpFile = baseName + ".webp";
        const webpPath = path.join(folderPath, webpFile);
        const uniqueWebpPath = getUniqueFilePath(webpPath);
        const finalWebpFile = path.basename(uniqueWebpPath);
        
        try {
          await sharp(imagePath)
            .webp({ quality: 80, effort: 4, nearLossless: false })
            .toFile(uniqueWebpPath);
          convertedFiles.push({
            uid: `converted-${finalWebpFile}`,
            title: `✅ ${finalWebpFile}`,
            subtitle: `Successfully converted from ${imageFile}`,
            arg: uniqueWebpPath,
            icon: { path: uniqueWebpPath },
            valid: true,
          });
        } catch (error) {
          failedFiles.push({
            uid: `failed-${imageFile}`,
            title: `❌ ${imageFile} - Conversion failed`,
            subtitle: error.message,
            icon: { path: alfy.icon.error },
            valid: false,
          });
        }
      } else if (convertType === "ico") {
        // ICO conversion only supports single PNG file
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
        // const icoFile = path.basename(pngFile, ".png") + ".ico";
        // const icoPath = path.join(folderPath, icoFile);
        // try {
        //   const sizes = [256, 128, 64, 48, 32, 16];
        //   const pngBuffers = await Promise.all(
        //     sizes.map(size =>
        //       sharp(pngPath)
        //         .resize(size, size)
        //         .png()
        //         .toBuffer()
        //     )
        //   );
        //   const buf = await toIco(pngBuffers);
        //   fs.writeFileSync(icoPath, buf);
        //   convertedFiles.push({
        //     uid: `converted-${icoFile}`,
        //     title: `✅ ${icoFile}`,
        //     subtitle: `Successfully converted from ${pngFile}`,
        //     arg: icoPath,
        //     icon: { path: icoPath },
        //     valid: true,
        //   });
        // } catch (error) {
        //   failedFiles.push({
        //     uid: `failed-${pngFile}`,
        //     title: `❌ ${pngFile} - Conversion failed`,
        //     subtitle: error.message,
        //     icon: { path: alfy.icon.error },
        //     valid: false,
        //   });
        // }
      } else if (convertType === "compress") {
        const baseName = path.basename(imageFile, ext);
        const compressedFile = baseName + "_compressed" + ext;
        const compressedPath = path.join(folderPath, compressedFile);
        const uniqueCompressedPath = getUniqueFilePath(compressedPath);
        const finalCompressedFile = path.basename(uniqueCompressedPath);
        
        try {
          let sharpInstance = sharp(imagePath);
          
          // 根据文件格式应用不同的压缩策略
          if (ext === ".png") {
            sharpInstance = sharpInstance.png({ 
              quality: 80, 
              compressionLevel: 9,
              progressive: true 
            });
          } else if (ext === ".jpg" || ext === ".jpeg") {
            sharpInstance = sharpInstance.jpeg({ 
              quality: 80, 
              progressive: true,
              mozjpeg: true 
            });
          } else if (ext === ".webp") {
            sharpInstance = sharpInstance.webp({ 
              quality: 80, 
              effort: 4 
            });
          }
          
          await sharpInstance.toFile(uniqueCompressedPath);
          
          // 获取原始文件大小和压缩后文件大小
          const originalStats = fs.statSync(imagePath);
          const compressedStats = fs.statSync(uniqueCompressedPath);
          const compressionRatio = ((originalStats.size - compressedStats.size) / originalStats.size * 100).toFixed(1);
          
          convertedFiles.push({
            uid: `compressed-${finalCompressedFile}`,
            title: `🗜️ ${finalCompressedFile}`,
            subtitle: `Compressed from ${imageFile} (${compressionRatio}% smaller)`,
            arg: uniqueCompressedPath,
            icon: { path: uniqueCompressedPath },
            valid: true,
          });
        } catch (error) {
          failedFiles.push({
            uid: `failed-${imageFile}`,
            title: `❌ ${imageFile} - Compression failed`,
            subtitle: error.message,
            icon: { path: alfy.icon.error },
            valid: false,
          });
        }
      } else if (convertType === "png") {
        if (ext === ".png") {
          continue;
        }
        const baseName = path.basename(imageFile, ext);
        const pngFile = baseName + ".png";
        const pngPath = path.join(folderPath, pngFile);
        const uniquePngPath = getUniqueFilePath(pngPath);
        const finalPngFile = path.basename(uniquePngPath);
        
        try {
          await sharp(imagePath)
            .png({ 
              quality: 90, 
              compressionLevel: 6,
              progressive: true 
            })
            .toFile(uniquePngPath);
          convertedFiles.push({
            uid: `converted-${finalPngFile}`,
            title: `✅ ${finalPngFile}`,
            subtitle: `Successfully converted from ${imageFile}`,
            arg: uniquePngPath,
            icon: { path: uniquePngPath },
            valid: true,
          });
        } catch (error) {
          failedFiles.push({
            uid: `failed-${imageFile}`,
            title: `❌ ${imageFile} - Conversion failed`,
            subtitle: error.message,
            icon: { path: alfy.icon.error },
            valid: false,
          });
        }
      } else if (convertType === "resize") {
        const baseName = path.basename(imageFile, ext);
        const resizedFile = baseName + "_resized" + ext;
        const resizedPath = path.join(folderPath, resizedFile);
        const uniqueResizedPath = getUniqueFilePath(resizedPath);
        const finalResizedFile = path.basename(uniqueResizedPath);
        
        try {
          const dimensions = parseDimensions(resizeDimensions);
          
          const resizeOptions = dimensions.height === null 
            ? { width: dimensions.width }
            : { 
                width: dimensions.width, 
                height: dimensions.height,
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
              };
          
          await sharp(imagePath)
            .resize(resizeOptions)
            .toFile(uniqueResizedPath);
          
          // 获取原始图片尺寸和调整后的尺寸
          const originalMetadata = await sharp(imagePath).metadata();
          const resizedMetadata = await sharp(uniqueResizedPath).metadata();
          
          const sizeInfo = dimensions.height === null 
            ? `from ${originalMetadata.width}x${originalMetadata.height} to ${resizedMetadata.width}x${resizedMetadata.height} (width: ${dimensions.width})`
            : `from ${originalMetadata.width}x${originalMetadata.height} to ${dimensions.width}x${dimensions.height}`;
          
          convertedFiles.push({
            uid: `resized-${finalResizedFile}`,
            title: `📏 ${finalResizedFile}`,
            subtitle: `Resized ${sizeInfo}`,
            arg: uniqueResizedPath,
            icon: { path: uniqueResizedPath },
            valid: true,
          });
        } catch (error) {
          failedFiles.push({
            uid: `failed-${imageFile}`,
            title: `❌ ${imageFile} - Resize failed`,
            subtitle: error.message,
            icon: { path: alfy.icon.error },
            valid: false,
          });
        }
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
