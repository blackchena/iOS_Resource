#!/usr/bin/env node
import fs from "fs";
import path from "path";
import alfy from "alfy";
import { getPlaiceholder } from "plaiceholder";
import os from "os";
import sharp from "sharp";

const inputPath = process.argv[2];

if (!inputPath) {
  alfy.output([
    {
      uid: "error-no-path",
      title: "Error: No input path provided",
      subtitle: "Please provide a file or folder path",
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
      title: "Error: Path does not exist",
      subtitle: `Path: ${inputPath}`,
      icon: { path: alfy.icon.error },
      valid: false,
    },
  ]);
  process.exit(1);
}

const stats = fs.statSync(inputPath);

if (stats.isDirectory()) {
  // 处理文件夹
  processFolder(inputPath);
} else if (stats.isFile()) {
  // 处理单个文件
  processSingleFile(inputPath);
} else {
  alfy.output([
    {
      uid: "error-not-file-or-folder",
      title: "Error: Path is not a file or directory",
      subtitle: `Path: ${inputPath}`,
      icon: { path: alfy.icon.error },
      valid: false,
    },
  ]);
  process.exit(1);
}

// 处理单个文件
async function processSingleFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const supportedFormats = ['.webp', '.jpg', '.jpeg', '.png'];
  
  if (!supportedFormats.includes(ext)) {
    alfy.output([
      {
        uid: "error-unsupported-format",
        title: "Error: Unsupported image format",
        subtitle: `Supported formats: ${supportedFormats.join(', ')}`,
        icon: { path: alfy.icon.error },
        valid: false,
      },
    ]);
    return;
  }

  try {
    const imageBuffer = fs.readFileSync(filePath);
    const { base64 } = await getPlaiceholder(imageBuffer);
    const blurFilePath = await saveBase64AsImage(base64, `blur_${path.basename(filePath, ext)}.jpg`);
    
    alfy.output([
      {
        uid: "base64",
        title: "base64",
        subtitle: base64,
        arg: base64,
        icon: { type: "file", path: blurFilePath },
        valid: true,
      },
      {
        uid: "blur-image",
        title: `blur_${path.basename(filePath)}`,
        subtitle: blurFilePath,
        arg: blurFilePath,
        icon: { type: "file", path: blurFilePath },
        valid: true,
      },
    ]);
  } catch (error) {
    alfy.output([
      {
        uid: "error",
        title: "Error processing file",
        subtitle: error.message,
        icon: { path: alfy.icon.error },
        valid: false,
      },
    ]);
  }
}

// 处理文件夹
async function processFolder(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    const supportedFormats = ['.webp', '.jpg', '.jpeg', '.png'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return supportedFormats.includes(ext);
    });

    if (imageFiles.length === 0) {
      alfy.output([
        {
          uid: "no-images",
          title: "No supported image files found",
          subtitle: `Supported formats: ${supportedFormats.join(', ')}`,
          icon: { path: alfy.icon.warning },
          valid: false,
        },
      ]);
      return;
    }

    const results = [];
    const errors = [];

    for (const imageFile of imageFiles) {
      try {
        const imagePath = path.join(folderPath, imageFile);
        const ext = path.extname(imageFile).toLowerCase();
        const imageBuffer = fs.readFileSync(imagePath);
        const { base64 } = await getPlaiceholder(imageBuffer);
        const blurFilePath = await saveBase64AsImage(base64, `blur_${path.basename(imageFile, ext)}.jpg`);
        
        results.push({
          uid: `blur-${imageFile}`,
          title: `✅ blur_${path.basename(imageFile, ext)}.jpg`,
          subtitle: blurFilePath,
          arg: blurFilePath,
          icon: { type: "file", path: blurFilePath },
          valid: true,
        });
      } catch (error) {
        errors.push({
          uid: `error-${imageFile}`,
          title: `❌ ${imageFile} - Failed`,
          subtitle: error.message,
          icon: { path: alfy.icon.error },
          valid: false,
        });
      }
    }

    // 构建输出结果
    const output = [
      {
        uid: "summary",
        title: `📊 Batch Processing Summary`,
        subtitle: `✅ ${results.length} converted, ❌ ${errors.length} failed`,
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
      ...results
    ];

    if (errors.length > 0) {
      output.push(
        {
          uid: "error-separator",
          title: "Failed conversions:",
          subtitle: "",
          icon: { path: folderPath },
          valid: false,
        },
        ...errors
      );
    }

    alfy.output(output);
  } catch (error) {
    alfy.output([
      {
        uid: "error",
        title: "Error processing folder",
        subtitle: error.message,
        icon: { path: alfy.icon.error },
        valid: false,
      },
    ]);
  }
}

// 将 base64 转换为临时文件
async function saveBase64AsImage(base64String, filename) {
  // 移除 MIME 前缀 (data:image/png;base64,)
  base64String = base64String.replace(/^data:image\/[a-z]+;base64,/, "");
  const buffer = Buffer.from(base64String, "base64");
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, filename);
  // 使用Sharp直接转换为JPG
  await sharp(buffer)
    .jpeg({ quality: 80 })
    .toFile(filePath);
  return filePath;
}
