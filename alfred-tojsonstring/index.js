#!/usr/bin/env node
import alfy from "alfy";
import { execSync } from "child_process";

// Function to get clipboard content
function getClipboardContent() {
  try {
    return execSync("pbpaste", { encoding: "utf8" });
  } catch (error) {
    throw new Error(`Failed to get clipboard content: ${error.message}`);
  }
}

// Function to convert string to JSON string
function stringToJsonString(inputString) {
  try {
    // First try to parse as JSON to validate
    const parsed = JSON.parse(inputString);
    // If successful, return the original string (it's already valid JSON)
    return inputString;
  } catch (error) {
    // If not valid JSON, convert to JSON string
    return JSON.stringify(inputString);
  }
}

// Function to format JSON string with proper indentation
function formatJsonString(jsonString, pretty = false) {
  try {
    const parsed = JSON.parse(jsonString);
    return pretty ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
  } catch (error) {
    // If it's not valid JSON, just return the stringified version
    return JSON.stringify(jsonString);
  }
}

// Function to remove newlines from JSON string
function removeNewlinesFromJson(jsonString) {
  // 删除jsonString中的换行符
  jsonString = jsonString.replace(/\\n/g, "");
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch (error) {
    // If it's not valid JSON, just return the stringified version without newlines
    return JSON.stringify(jsonString);
  }
}

// Function to show help
function showHelp() {
  return [
    {
      title: "String to JSON Converter",
      subtitle: "Convert input string to JSON string format",
      valid: false,
      icon: {
        path: alfy.icon.question,
      },
      text: {
        copy: `Usage:
  node index.js [input_string] [--pretty]

Examples:
  node index.js                                    # Uses clipboard content as input
  node index.js "hello world"                      # Convert string to JSON
  node index.js '{"name": "test"}'                 # Format existing JSON
  node index.js "hello world" --pretty             # Pretty format output
  
  Result: JSON formatted string

Parameters:
  input_string: String to convert to JSON (optional)
    - If not provided, uses clipboard content
    - If already valid JSON, formats it properly
    - If plain text, converts to JSON string

Options:
  --pretty: Format JSON with indentation (optional)

Features:
  - Converts any string to JSON format
  - Validates and formats existing JSON
  - Pretty printing option for readable output
  - Default: reads input from clipboard`,
        largetype: "String to JSON Converter - Convert strings to JSON format",
      },
    },
  ];
}

// Function to process Alfred workflow input
function processAlfredInput(input, pretty = false) {
  const results = [];

  if (!input || input.trim() === "") {
    return [
      {
        title: "No input string provided",
        subtitle: "Copy a string to clipboard or provide string as argument",
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertNoteIcon.icns",
        },
      },
    ];
  }

  try {
    const inputString = input.trim();
    // Convert to JSON string
    const jsonString = stringToJsonString(inputString);
    const formattedJson = formatJsonString(jsonString, pretty);
    
    // Create results for Alfred
    results.push({
      title: "JSON String",
      subtitle: "Click to copy JSON formatted string",
      valid: true,
      icon: {
        path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
      },
      arg: formattedJson,
      text: {
        copy: formattedJson,
        largetype: formattedJson,
      },
    });

    // Add compact version if pretty was requested
    if (pretty) {
      const compactJson = formatJsonString(jsonString, false);
      results.push({
        title: "Compact JSON String",
        subtitle: "Click to copy compact JSON string",
        valid: true,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
        },
        arg: compactJson,
        text: {
          copy: compactJson,
          largetype: compactJson,
        },
      });
    }

    // Add original string as JSON without newlines
    const jsonWithoutNewlines = removeNewlinesFromJson(jsonString);
    results.push({
      title: "No newlines String",
      subtitle: "Click to copy no newlines input string",
      valid: true,
      icon: {
        path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
      },
      arg: jsonWithoutNewlines,
      text: {
        copy: jsonWithoutNewlines,
        largetype: jsonWithoutNewlines,
      },
    });

  } catch (error) {
    results.push({
      title: "JSON conversion failed",
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
  let pretty = false;

  if (process.argv.length > 2) {
    const arg1 = process.argv[2];

    // Check for help flag
    if (arg1 === "--help" || arg1 === "-h" || arg1 === "help") {
      results = showHelp();
    } else {
      // Use provided input string
      inputText = arg1;

      // Check for pretty flag
      if (process.argv.length > 3) {
        const arg2 = process.argv[3];
        if (arg2 === "--pretty") {
          pretty = true;
        }
      }
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
  }

  // Process the input if we have it
  if (inputText) {
    results = processAlfredInput(inputText, pretty);
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
