#!/usr/bin/env node
import alfy from "alfy";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Supported image extensions
const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".tiff",
  ".tif",
  ".webp",
  ".svg",
  ".ico",
  ".heic",
  ".heif",
];

// Function to get clipboard content
function getClipboardContent() {
  try {
    return execSync("pbpaste", { encoding: "utf8" });
  } catch (error) {
    throw new Error(`Failed to get clipboard content: ${error.message}`);
  }
}

// Function to check if file is an image
function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

// Function to get file size
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Function to recursively find all image files in a directory
function findImageFiles(dirPath) {
  const imageFiles = [];

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively search subdirectories
        imageFiles.push(...findImageFiles(fullPath));
      } else if (stat.isFile() && isImageFile(fullPath)) {
        imageFiles.push(fullPath);
      }
    }
  } catch (error) {
    // Skip directories that can't be read
    console.error(`Error reading directory ${dirPath}: ${error.message}`);
  }

  return imageFiles;
}

// Function to format file size for display
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Function to parse size string to bytes
function parseSizeToBytes(sizeStr) {
  if (!sizeStr || sizeStr.trim() === "") {
    return 0; // No filter
  }

  const str = sizeStr.trim().toUpperCase();
  const match = str.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)?$/);

  if (!match) {
    throw new Error(
      `Invalid size format: ${sizeStr}. Use format like "1MB", "500KB", "2.5GB"`
    );
  }

  const value = parseFloat(match[1]);
  const unit = match[2] || "B";

  const multipliers = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  };

  return Math.floor(value * multipliers[unit]);
}

// Function to show help
function showHelp() {
  return [
    {
      title: "Image File Sorter",
      subtitle:
        "Recursively find all image files in a directory and sort by file size (largest first)",
      valid: false,
      icon: {
        path: alfy.icon.question,
      },
      text: {
        copy: `Usage:
  node index.js [directory_path] [min_size]

Examples:
  node index.js                                    # Uses clipboard content as directory path
  node index.js "/Users/username/Pictures"         # Uses provided directory path
  node index.js "/Users/username/Pictures" "1MB"   # Filter images larger than 1MB
  node index.js "/Users/username/Pictures" "500KB" # Filter images larger than 500KB
  
  Result: List of image files sorted by size (largest first)

Parameters:
  directory_path: Path to search for images (required)
  min_size: Minimum file size filter (optional)
    - Supports: B, KB, MB, GB (case insensitive)
    - Examples: "1MB", "500KB", "2.5GB", "1024B"
    - Default: No size filter (shows all images)

Features:
  - Recursively searches all subdirectories
  - Supports common image formats: JPG, PNG, GIF, BMP, TIFF, WebP, SVG, ICO, HEIC, HEIF
  - Sorts by file size from largest to smallest
  - Shows file size in human-readable format
  - Optional minimum size filtering
  - Default: reads directory path from clipboard`,
        largetype: "Image File Sorter - Find and sort images by size",
      },
    },
  ];
}

// Function to process Alfred workflow input
function processAlfredInput(input, minSizeStr = "") {
  const results = [];

  if (!input || input.trim() === "") {
    return [
      {
        title: "No directory path provided",
        subtitle:
          "Copy a directory path to clipboard or provide path as argument",
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertNoteIcon.icns",
        },
      },
    ];
  }

  try {
    const dirPath = input.trim();
    let minSizeBytes = 0;

    // Parse minimum size if provided
    if (minSizeStr && minSizeStr.trim() !== "") {
      try {
        minSizeBytes = parseSizeToBytes(minSizeStr);
      } catch (error) {
        results.push({
          title: "Invalid size format",
          subtitle: error.message,
          valid: false,
          icon: {
            path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns",
          },
        });
        return results;
      }
    }

    // Check if the path exists and is a directory
    if (!fs.existsSync(dirPath)) {
      results.push({
        title: "Directory not found",
        subtitle: `Path does not exist: ${dirPath}`,
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns",
        },
      });
      return results;
    }

    const stat = fs.statSync(dirPath);
    if (!stat.isDirectory()) {
      results.push({
        title: "Not a directory",
        subtitle: `Path is not a directory: ${dirPath}`,
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns",
        },
      });
      return results;
    }

    // Find all image files
    const imageFiles = findImageFiles(dirPath);

    if (imageFiles.length === 0) {
      results.push({
        title: "No image files found",
        subtitle: `No supported image files found in: ${dirPath}`,
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericFolderIcon.icns",
        },
      });
      return results;
    }

    // Get file sizes and filter by minimum size
    const imageFilesWithSize = imageFiles.map((filePath) => ({
      path: filePath,
      size: getFileSize(filePath),
      name: path.basename(filePath),
    }));

    // Filter by minimum size if specified
    const filteredFiles =
      minSizeBytes > 0
        ? imageFilesWithSize.filter((file) => file.size >= minSizeBytes)
        : imageFilesWithSize;

    // Sort by size (largest first)
    filteredFiles.sort((a, b) => b.size - a.size);

    // Create results for Alfred
    filteredFiles.forEach((file, index) => {
      const relativePath = path.relative(dirPath, file.path);
      const sizeFormatted = formatFileSize(file.size);

      results.push({
        title: `${file.name} (${sizeFormatted})`,
        subtitle: relativePath,
        valid: true,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
        },
        arg: file.path,
        text: {
          copy: file.path,
          largetype: `${file.name}\n${sizeFormatted}\n${file.path}`,
        },
      });
    });

    // Add summary at the top
    if (results.length > 0) {
      const filterText =
        minSizeBytes > 0 ? ` (filtered: ≥${formatFileSize(minSizeBytes)})` : "";
      results.unshift({
        title: `Found ${filteredFiles.length} image files (sorted by size)${filterText}`,
        subtitle: `Total size: ${formatFileSize(
          filteredFiles.reduce((sum, file) => sum + file.size, 0)
        )}`,
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericFolderIcon.icns",
        },
      });
      results.unshift({
        title: "Copy all file paths",
        subtitle: "Copy all file paths to clipboard",
        valid: true,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
        },
        arg: filteredFiles.map((file) => file.path).join("\n"),
        text: {
          copy: filteredFiles.map((file) => `${file.path} | ${formatFileSize(file.size)}`).join("\n"),
        },
      });
    }
  } catch (error) {
    results.push({
      title: "Image search failed",
      subtitle: error.message,
      valid: false,
      icon: {
        path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns",
      },
    });
  }

  return results;
}

// Main execution
function main() {
  let results = [];
  let inputText = "";
  let minSizeStr = "";

  if (process.argv.length > 2) {
    const arg1 = process.argv[2];

    // Check for help flag
    if (arg1 === "--help" || arg1 === "-h" || arg1 === "help") {
      results = showHelp();
    } else {
      // Use provided directory path
      inputText = arg1;

      // Check for second argument (minimum size)
      if (process.argv.length > 3) {
        minSizeStr = process.argv[3];
      }

      results = processAlfredInput(inputText, minSizeStr);
    }
  } else {
    // Try to get input from Alfred first, then fallback to clipboard
    if (alfy.input && alfy.input.trim() !== "") {
      inputText = alfy.input;
    } else {
      try {
        inputText = getClipboardContent();
      } catch (error) {
        results = [
          {
            title: "Failed to get clipboard content",
            subtitle: error.message,
            valid: false,
            icon: {
              path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns",
            },
          },
        ];
        alfy.output(results);
        return;
      }
    }
    results = processAlfredInput(inputText, minSizeStr);
  }

  // Output results to Alfred
  alfy.output(results);
}

// Run the main function
try {
  main();
} catch (error) {
  alfy.output([
    {
      title: "Unexpected Error",
      subtitle: error.message,
      valid: false,
      icon: {
        path: alfy.icon.error,
      },
    },
  ]);
}
