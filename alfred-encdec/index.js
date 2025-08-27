#!/usr/bin/env node
import alfy from "alfy";

// Function to encode text to base64
function encodeBase64(text) {
  try {
    return Buffer.from(text, 'utf8').toString('base64');
  } catch (error) {
    throw new Error(`Base64 encoding failed: ${error.message}`);
  }
}

// Function to decode base64 to text
function decodeBase64(base64String) {
  try {
    return Buffer.from(base64String, 'base64').toString('utf8');
  } catch (error) {
    throw new Error(`Base64 decoding failed: ${error.message}`);
  }
}

// Function to URL encode text
function urlEncode(text) {
  try {
    return encodeURIComponent(text);
  } catch (error) {
    throw new Error(`URL encoding failed: ${error.message}`);
  }
}

// Function to URL decode text
function urlDecode(encodedText) {
  try {
    return decodeURIComponent(encodedText);
  } catch (error) {
    throw new Error(`URL decoding failed: ${error.message}`);
  }
}

// Function to detect if text is base64 encoded
function isBase64(text) {
  try {
    // Check if it's valid base64
    const decoded = Buffer.from(text, 'base64');
    const reEncoded = decoded.toString('base64');
    return reEncoded === text;
  } catch {
    return false;
  }
}

// Function to detect if text is URL encoded
function isUrlEncoded(text) {
  return text.includes('%') && /%[0-9A-Fa-f]{2}/.test(text);
}

// Function to show help
function showHelp() {
  return [
    {
      title: "Base64 & URL Encoder/Decoder",
      subtitle: "Encode and decode base64 and URL encoding",
      valid: false,
      icon: {
        path: alfy.icon.question,
      },
      text: {
        copy: `Usage:
  node index.js <text>

Examples:
  node index.js "Hello World"
  node index.js "SGVsbG8gV29ybGQ="
  node index.js "Hello%20World"

Features:
  - Auto-detect and decode base64 strings
  - Auto-detect and decode URL encoded strings
  - Encode text to base64
  - Encode text to URL format
  - Copy results to clipboard`,
        largetype: "Base64 & URL Encoder/Decoder - Encode and decode text",
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
        title: "Please provide text to encode/decode",
        subtitle: "Enter text, base64 string, or URL encoded string",
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertNoteIcon.icns",
        },
      },
    ];
  }

  const trimmedInput = input.trim();

  // Check if input is base64 encoded
  if (isBase64(trimmedInput)) {
    try {
      const decoded = decodeBase64(trimmedInput);
      results.push({
        title: "Base64 Decoded",
        subtitle: decoded,
        valid: true,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
        },
        text: {
          copy: decoded,
          largetype: decoded,
        },
      });
    } catch (error) {
      results.push({
        title: "Base64 Decode Failed",
        subtitle: error.message,
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns",
        },
      });
    }
  }

  // Check if input is URL encoded
  if (isUrlEncoded(trimmedInput)) {
    try {
      const decoded = urlDecode(trimmedInput);
      results.push({
        title: "URL Decoded",
        subtitle: decoded,
        valid: true,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
        },
        text: {
          copy: decoded,
          largetype: decoded,
        },
      });
    } catch (error) {
      results.push({
        title: "URL Decode Failed",
        subtitle: error.message,
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns",
        },
      });
    }
  }

  // Always provide encoding options for the input
  try {
    const base64Encoded = encodeBase64(trimmedInput);
    results.push({
      title: "Encode to Base64",
      subtitle: base64Encoded,
      valid: true,
      icon: {
        path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
      },
      text: {
        copy: base64Encoded,
        largetype: base64Encoded,
      },
    });
  } catch (error) {
    results.push({
      title: "Base64 Encode Failed",
      subtitle: error.message,
      valid: false,
      icon: {
        path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns",
      },
    });
  }

  try {
    const urlEncoded = urlEncode(trimmedInput);
    results.push({
      title: "Encode to URL",
      subtitle: urlEncoded,
      valid: true,
      icon: {
        path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
      },
      text: {
        copy: urlEncoded,
        largetype: urlEncoded,
      },
    });
  } catch (error) {
    results.push({
      title: "URL Encode Failed",
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

  if (process.argv.length > 2) {
    const arg = process.argv[2];

    // Check for help flag
    if (arg === "--help" || arg === "-h" || arg === "help") {
      results = showHelp();
    } else {
      // Process the input text
      results = processAlfredInput(arg);
    }
  } else {
    // Process Alfred input
    results = processAlfredInput(alfy.input);
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
