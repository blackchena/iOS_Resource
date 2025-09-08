#!/usr/bin/env node
import alfy from "alfy";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp', '.svg', '.ico', '.heic', '.heif'];

// Function to get clipboard content
function getClipboardContent() {
  try {
    return execSync('pbpaste', { encoding: 'utf8' });
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
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to show help
function showHelp() {
  return [
    {
      title: "Image File Sorter",
      subtitle: "Recursively find all image files in a directory and sort by file size (largest first)",
      valid: false,
      icon: {
        path: alfy.icon.question,
      },
      text: {
        copy: `Usage:
  node index.js [directory_path]

Examples:
  node index.js                    # Uses clipboard content as directory path
  node index.js "/Users/username/Pictures"  # Uses provided directory path
  
  Result: List of image files sorted by size (largest first)

Features:
  - Recursively searches all subdirectories
  - Supports common image formats: JPG, PNG, GIF, BMP, TIFF, WebP, SVG, ICO, HEIC, HEIF
  - Sorts by file size from largest to smallest
  - Shows file size in human-readable format
  - Default: reads directory path from clipboard`,
        largetype: "Image File Sorter - Find and sort images by size",
      },
    },
  ];
}

// Function to process Alfred workflow input
function processAlfredInput(input) {
  const results = [];

  if (!input || input.trim() === '') {
    return [
      {
        title: "No directory path provided",
        subtitle: "Copy a directory path to clipboard or provide path as argument",
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertNoteIcon.icns",
        },
      },
    ];
  }

  try {
    const dirPath = input.trim();
    
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

    // Get file sizes and sort by size (largest first)
    const imageFilesWithSize = imageFiles.map(filePath => ({
      path: filePath,
      size: getFileSize(filePath),
      name: path.basename(filePath)
    }));

    imageFilesWithSize.sort((a, b) => b.size - a.size);

    // Create results for Alfred
    imageFilesWithSize.forEach((file, index) => {
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
      results.unshift({
        title: `Found ${imageFiles.length} image files (sorted by size)`,
        subtitle: `Total size: ${formatFileSize(imageFilesWithSize.reduce((sum, file) => sum + file.size, 0))}`,
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericFolderIcon.icns",
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
  let inputText = '';

  if (process.argv.length > 2) {
    const arg = process.argv[2];

    // Check for help flag
    if (arg === "--help" || arg === "-h" || arg === "help") {
      results = showHelp();
    } else {
      // Use provided text
      inputText = arg;
      results = processAlfredInput(inputText);
    }
  } else {
    // Try to get input from Alfred first, then fallback to clipboard
    if (alfy.input && alfy.input.trim() !== '') {
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
    results = processAlfredInput(inputText);
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