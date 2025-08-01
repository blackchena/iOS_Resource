#!/usr/bin/env node
import fs from "fs";
import path from "path";
import alfy from "alfy";
import _ from "lodash";
import os from "os";

// Function to convert string to kebabCase
function toKebabCase(str) {
  return _.kebabCase(str.toLowerCase());
}

// Function to rename files in a directory to kebabCase
function renameFilesToKebabCase(directoryPath) {
  const results = [];
  
  try {
    // Check if directory exists
    if (!fs.existsSync(directoryPath)) {
      results.push({
        title: `Directory does not exist: ${directoryPath}`,
        subtitle: "Please check the path and try again",
        valid: false,
        icon: { path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns" }
      });
      return results;
    }

    // Read all files in the directory
    const files = fs.readdirSync(directoryPath);
    
    if (files.length === 0) {
      results.push({
        title: "Directory is empty",
        subtitle: "No files to rename",
        valid: false,
        icon: { path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertNoteIcon.icns" }
      });
      return results;
    }
    
    let renamedCount = 0;
    let skippedCount = 0;
    const renamedFiles = [];
    const skippedFiles = [];
    
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      
      // Skip directories, only process files
      if (stats.isFile()) {
        // Get file extension
        const ext = path.extname(file);
        const nameWithoutExt = path.basename(file, ext);
        
        // Convert name to kebabCase
        const newName = toKebabCase(nameWithoutExt) + ext;
        
        const newFilePath = path.join(directoryPath, newName);
        
        // Skip if the new name is the same as the old name
        if (file === newName) {
          console.log(newName,"newName===", file);
          skippedFiles.push(`${file} (already in kebabCase format)`);
          skippedCount++;
          return;
        }
        
        // // Check if target file already exists
        // if (fs.existsSync(newFilePath)) {
        //   skippedFiles.push(`${file} (${newName} already exists)`);
        //   skippedCount++;
        //   return;
        // }
        
        // Rename the file
        fs.renameSync(filePath, newFilePath);
        renamedFiles.push(`${file} → ${newName}`);
        renamedCount++;
      }
    });
    
    // Add summary result
    if (renamedCount > 0) {
      results.push({
        title: `Successfully renamed ${renamedCount} files`,
        subtitle: `Skipped ${skippedCount} files`,
        valid: true,
        icon: { path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns" },
        text: {
          copy: `Renamed files:\n${renamedFiles.join('\n')}`,
          largetype: `Renamed ${renamedCount} files, skipped ${skippedCount} files`
        }
      });
    } else if (skippedCount > 0) {
      results.push({
        title: `No files renamed`,
        subtitle: `${skippedCount} files skipped`,
        valid: false,
        icon: { path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertNoteIcon.icns" },
        text: {
          copy: `Skipped files:\n${skippedFiles.join('\n')}`,
          largetype: `No files renamed, ${skippedCount} files skipped`
        }
      });
    } else {
      results.push({
        title: "No files found to rename",
        subtitle: "Only directories found in the specified path",
        valid: false,
        icon: { path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertNoteIcon.icns" }
      });
    }
    
    // Add detailed results if there are renamed files
    if (renamedFiles.length > 0) {
      renamedFiles.forEach((renameInfo, index) => {
        results.push({
          title: renameInfo,
          subtitle: "File renamed successfully",
          valid: true,
          icon: { path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns" }
        });
      });
    }
    
  } catch (error) {
    results.push({
      title: "Error renaming files",
      subtitle: error.message,
      valid: false,
      icon: { path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns" },
      text: {
        copy: `Error: ${error.message}`,
        largetype: `Error renaming files: ${error.message}`
      }
    });
  }
  
  return results;
}

// Function to show help
function showHelp() {
  return [{
    title: "KebabCase File Renamer",
    subtitle: "Convert file names to kebabCase format",
    valid: false,
    icon: { path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericQuestionMarkIcon.icns" },
    text: {
      copy: `Usage:
  node index.js <directory_path>

Examples:
  node index.js ~/Pictures
  node index.js /Users/username/Documents
  node index.js ./my-folder

Features:
  - Converts file names to kebabCase format
  - Preserves file extensions
  - Skips files already in kebabCase format
  - Handles conflicts safely
  - Only processes files, not directories`,
      largetype: "KebabCase File Renamer - Convert file names to kebabCase format"
    }
  }];
}

// Function to process Alfred workflow input
function processAlfredInput() {
  const input = alfy.input;
  
  if (!input) {
    return [{
      title: "Please provide a directory path",
      subtitle: "Enter a directory path to rename files",
      valid: false,
      icon: { path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertNoteIcon.icns" }
    }];
  }
  
  // Resolve the path (handle ~ for home directory)
  const resolvedPath = input.startsWith('~') 
    ? input.replace('~', os.homedir())
    : path.resolve(input);
  
  return renameFilesToKebabCase(resolvedPath);
}

// Main execution
let results = [];

if (process.argv.length > 2) {
  const arg = process.argv[2];
  
  // Check for help flag
  if (arg === '--help' || arg === '-h' || arg === 'help') {
    results = showHelp();
  } else {
    // Use the first argument as directory path
    const resolvedPath = arg.startsWith('~') 
      ? arg.replace('~', os.homedir())
      : path.resolve(arg);
    
    results = renameFilesToKebabCase(resolvedPath);
  }
} else {
  // Otherwise, process Alfred input
  results = processAlfredInput();
}

// Output results to Alfred
alfy.output(results);

