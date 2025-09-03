#!/usr/bin/env node
import alfy from "alfy";
import { execSync } from "child_process";

// Function to get clipboard content
function getClipboardContent() {
  try {
    return execSync('pbpaste', { encoding: 'utf8' });
  } catch (error) {
    throw new Error(`Failed to get clipboard content: ${error.message}`);
  }
}

// Function to join lines and trim whitespace
function joinLines(text) {
  try {
    // Split by newlines, trim each line, filter out empty lines, then join with space
    const lines = text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join(' ');
    
    return lines;
  } catch (error) {
    throw new Error(`Line joining failed: ${error.message}`);
  }
}

// Function to show help
function showHelp() {
  return [
    {
      title: "Join Lines Tool",
      subtitle: "Merge multiple lines of text into a single line and remove leading/trailing spaces",
      valid: false,
      icon: {
        path: alfy.icon.question,
      },
      text: {
        copy: `Usage:
  node index.js [text]

Examples:
  node index.js                    # Uses clipboard content
  node index.js "Line 1
Line 2
Line 3"                           # Uses provided text
  
  Result: "Line 1 Line 2 Line 3"

Features:
  - Default: reads from clipboard
  - Merge multiple lines into a single line
  - Remove leading and trailing spaces from each line
  - Filter out empty lines
  - Join lines with a single space
  - Copy results to clipboard`,
        largetype: "Join Lines Tool - Merge multiple lines into one",
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
        title: "Clipboard is empty or no text provided",
        subtitle: "Copy some multiline text to clipboard or provide text as argument",
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertNoteIcon.icns",
        },
      },
    ];
  }

  try {
    const joinedText = joinLines(input);
    
    // If the result is the same as input (single line), show a different message
    if (joinedText === input.trim()) {
      results.push({
        title: "Text is already a single line",
        subtitle: "No changes needed - text is already joined",
        valid: true,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
        },
        arg: joinedText,
        text: {
          copy: joinedText,
          largetype: joinedText,
        },
      });
    } else {
      results.push({
        title: "Lines Joined",
        subtitle: joinedText,
        valid: true,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
        },
        arg: joinedText,
        text: {
          copy: joinedText,
          largetype: joinedText,
        },
      });
    }
  } catch (error) {
    results.push({
      title: "Line Joining Failed",
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