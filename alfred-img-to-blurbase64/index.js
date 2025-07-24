#!/usr/bin/env node
import fs from "fs";
import path from "path";
import alfy from "alfy";
import { getPlaiceholder } from "plaiceholder";
import os from "os";

const inputPath = process.argv[2];
const imageBuffer = fs.readFileSync(inputPath);
try {
  const { base64 } = await getPlaiceholder(imageBuffer);
  const tempFilePath = saveBase64AsImage(base64, "plaiceholder.png");
  alfy.output([
    {
      uid: "plaiceholder",
      title: "Plaiceholder",
      subtitle: base64,
      arg: base64,
      icon: { type: "file", path: tempFilePath },
      valid: true,
    },
  ]);
} catch (error) {
  alfy.output([
    {
      uid: "error",
      title: "Error",
      subtitle: error.message,
      icon: { path: alfy.icon.error },
      valid: false,
    },
  ]);
}

// 将 base64 转换为临时文件
function saveBase64AsImage(base64String, filename) {
  // 移除 MIME 前缀 (data:image/png;base64,)
  base64String = base64String.replace(/^data:image\/[a-z]+;base64,/, "");
  const buffer = Buffer.from(base64String, "base64");
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, filename);

  fs.writeFileSync(filePath, buffer);
  return filePath;
}

// Get type and path from command line arguments
// const convertType = process.argv[2];
// const inputPath = process.argv[3];

// if (!convertType || !inputPath) {
//   alfy.output([
//     {
//       uid: "error-no-args",
//       title: "Error: Missing arguments",
//       subtitle: "Usage: node index.js <webp|ico> <folder_or_png_file>",
//       icon: { path: alfy.icon.error },
//       valid: false,
//     },
//   ]);
//   process.exit(1);
// }

// if (convertType !== "webp" && convertType !== "ico") {
//   alfy.output([
//     {
//       uid: "error-type",
//       title: "Error: Invalid convert type",
//       subtitle: "Only 'webp' or 'ico' are supported",
//       icon: { path: alfy.icon.error },
//       valid: false,
//     },
//   ]);
//   process.exit(1);
// }

// if (!fs.existsSync(inputPath)) {
//   alfy.output([
//     {
//       uid: "error-path-not-exist",
//       title: `Error: Path does not exist`,
//       subtitle: `Path: ${inputPath}`,
//       icon: { path: alfy.icon.error },
//       valid: false,
//     },
//   ]);
//   process.exit(1);
// }

// const stats = fs.statSync(inputPath);

// // 单文件转换
// async function convertSinglePng(pngPath) {
//   const ext = path.extname(pngPath).toLowerCase();
//   if (ext !== ".png") {
//     alfy.output([
//       {
//         uid: "error-not-png",
//         title: `Error: Not a PNG file`,
//         subtitle: `File: ${pngPath}`,
//         icon: { path: alfy.icon.error },
//         valid: false,
//       },
//     ]);
//     process.exit(1);
//   }
//   if (convertType === "webp") {
//     const webpFile = path.basename(pngPath, ".png") + ".webp";
//     const webpPath = path.join(path.dirname(pngPath), webpFile);
//     try {
//       await sharp(pngPath)
//         .webp({ quality: 80, effort: 4, nearLossless: false })
//         .toFile(webpPath);
//       alfy.output([
//         {
//           uid: `converted-${webpFile}`,
//           title: `✅ ${webpFile}`,
//           subtitle: `Successfully converted from ${path.basename(pngPath)}`,
//           arg: webpPath,
//           icon: { path: webpPath },
//           valid: true,
//         },
//       ]);
//     } catch (error) {
//       alfy.output([
//         {
//           uid: `failed-${path.basename(pngPath)}`,
//           title: `❌ ${path.basename(pngPath)} - Conversion failed`,
//           subtitle: error.message,
//           icon: { path: alfy.icon.error },
//           valid: false,
//         },
//       ]);
//     }
//   } else if (convertType === "ico") {
//     const icoFile = path.basename(pngPath, ".png") + ".ico";
//     const icoPath = path.join(path.dirname(pngPath), icoFile);
//     try {
//       const sizes = [256, 128, 64, 48, 32, 16];
//       const pngBuffers = await Promise.all(
//         sizes.map((size) =>
//           sharp(pngPath)
//             .resize(size, size, {
//               fit: "contain",
//               background: { r: 0, g: 0, b: 0, alpha: 0 },
//             })
//             .png()
//             .toBuffer()
//         )
//       );
//       const buf = await toIco(pngBuffers);
//       fs.writeFileSync(icoPath, buf);
//       alfy.output([
//         {
//           uid: `converted-${icoFile}`,
//           title: `✅ ${icoFile}`,
//           subtitle: `Successfully converted from ${path.basename(pngPath)}`,
//           arg: icoPath,
//           icon: { path: icoPath },
//           valid: true,
//         },
//       ]);
//     } catch (error) {
//       alfy.output([
//         {
//           uid: `failed-${path.basename(pngPath)}`,
//           title: `❌ ${path.basename(pngPath)} - Conversion failed`,
//           subtitle: error.message,
//           icon: { path: alfy.icon.error },
//           valid: false,
//         },
//       ]);
//     }
//   }
// }

// // 文件夹批量转换
// async function convertFolder(folderPath) {
//   try {
//     const files = fs.readdirSync(folderPath);
//     const pngFiles = files.filter(
//       (file) => path.extname(file).toLowerCase() === ".png"
//     );
//     if (pngFiles.length === 0) {
//       alfy.output([
//         {
//           uid: "no-files",
//           title: "⚠️ No PNG files found",
//           subtitle: `No PNG files found in: ${folderPath}`,
//           icon: { path: alfy.icon.warning },
//           valid: false,
//         },
//       ]);
//       return;
//     }
//     const convertedFiles = [];
//     const failedFiles = [];
//     for (const pngFile of pngFiles) {
//       const pngPath = path.join(folderPath, pngFile);
//       if (convertType === "webp") {
//         const webpFile = path.basename(pngFile, ".png") + ".webp";
//         const webpPath = path.join(folderPath, webpFile);
//         try {
//           await sharp(pngPath)
//             .webp({ quality: 80, effort: 4, nearLossless: false })
//             .toFile(webpPath);
//           convertedFiles.push({
//             uid: `converted-${webpFile}`,
//             title: `✅ ${webpFile}`,
//             subtitle: `Successfully converted from ${pngFile}`,
//             arg: webpPath,
//             icon: { path: webpPath },
//             valid: true,
//           });
//         } catch (error) {
//           failedFiles.push({
//             uid: `failed-${pngFile}`,
//             title: `❌ ${pngFile} - Conversion failed`,
//             subtitle: error.message,
//             icon: { path: alfy.icon.error },
//             valid: false,
//           });
//         }
//       } else if (convertType === "ico") {
//         //ico 转换只支持单png文件
//         alfy.output([
//           {
//             uid: "error-ico-only-single-file",
//             title: "Error: ICO conversion only supports single PNG file",
//             subtitle: "Please select a single PNG file",
//             icon: { path: alfy.icon.error },
//             valid: false,
//           },
//         ]);
//         process.exit(1);
//         // const icoFile = path.basename(pngFile, ".png") + ".ico";
//         // const icoPath = path.join(folderPath, icoFile);
//         // try {
//         //   const sizes = [256, 128, 64, 48, 32, 16];
//         //   const pngBuffers = await Promise.all(
//         //     sizes.map(size =>
//         //       sharp(pngPath)
//         //         .resize(size, size)
//         //         .png()
//         //         .toBuffer()
//         //     )
//         //   );
//         //   const buf = await toIco(pngBuffers);
//         //   fs.writeFileSync(icoPath, buf);
//         //   convertedFiles.push({
//         //     uid: `converted-${icoFile}`,
//         //     title: `✅ ${icoFile}`,
//         //     subtitle: `Successfully converted from ${pngFile}`,
//         //     arg: icoPath,
//         //     icon: { path: icoPath },
//         //     valid: true,
//         //   });
//         // } catch (error) {
//         //   failedFiles.push({
//         //     uid: `failed-${pngFile}`,
//         //     title: `❌ ${pngFile} - Conversion failed`,
//         //     subtitle: error.message,
//         //     icon: { path: alfy.icon.error },
//         //     valid: false,
//         //   });
//         // }
//       }
//     }
//     const alfredItems = [
//       {
//         uid: "summary",
//         title: `📊 Conversion Summary: ${convertedFiles.length} files converted`,
//         subtitle:
//           failedFiles.length > 0
//             ? `❌ Failed: ${failedFiles.length} files`
//             : `✅ All files converted successfully`,
//         arg: folderPath,
//         icon: { path: folderPath },
//         valid: true,
//       },
//       {
//         uid: "separator",
//         title: "─".repeat(50),
//         subtitle: "",
//         icon: { path: folderPath },
//         valid: false,
//       },
//       ...convertedFiles,
//       ...(failedFiles.length > 0
//         ? [
//             {
//               uid: "failed-separator",
//               title: "Failed conversions:",
//               subtitle: "",
//               icon: { path: folderPath },
//               valid: false,
//             },
//             ...failedFiles,
//           ]
//         : []),
//     ];
//     alfy.output(alfredItems);
//   } catch (error) {
//     alfy.output([
//       {
//         uid: "error",
//         title: "❌ Error during conversion",
//         subtitle: error.message,
//         icon: { path: alfy.icon.error },
//         valid: false,
//       },
//     ]);
//     process.exit(1);
//   }
// }

// if (stats.isDirectory()) {
//   convertFolder(inputPath);
// } else if (stats.isFile()) {
//   convertSinglePng(inputPath);
// } else {
//   alfy.output([
//     {
//       uid: "error-not-file-or-folder",
//       title: `Error: Path is not a file or directory`,
//       subtitle: `Path: ${inputPath}`,
//       icon: { path: alfy.icon.error },
//       valid: false,
//     },
//   ]);
//   process.exit(1);
// }
