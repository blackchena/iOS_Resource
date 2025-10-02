#!/usr/bin/env node
import alfy from "alfy";
import { execSync } from "child_process";

// Function to get clipboard HTML content using AppleScript
function getClipboardHTMLContent() {
  try {
    const result = execSync('osascript -e \'the clipboard as «class HTML»\'', { 
      encoding: "utf8",
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return result.trim();
  } catch (error) {
    throw new Error(`Failed to get clipboard HTML content: ${error.message}`);
  }
}

// Function to get regular clipboard content
function getClipboardContent() {
  try {
    return execSync("pbpaste", { encoding: "utf8" });
  } catch (error) {
    throw new Error(`Failed to get clipboard content: ${error.message}`);
  }
}

// Function to detect and decode hex-encoded HTML data
function processHTMLClipboard() {
  try {
    const htmlData = getClipboardHTMLContent();
    
    if (htmlData.includes('«data HTML')) {
      // Extract hex data and decode
      const hexData = htmlData.replace(/«data HTML/, '').replace(/»/, '');
      const decodedHTML = Buffer.from(hexData, 'hex').toString('utf8');
      
      return {
        type: 'hex-encoded',
        content: decodedHTML
      };
    } else if (htmlData && htmlData.trim() !== '') {
      return {
        type: 'regular-html',
        content: htmlData
      };
    } else {
      return {
        type: 'no-html',
        content: null
      };
    }
  } catch (error) {
    throw new Error(`Failed to process HTML clipboard: ${error.message}`);
  }
}


// Function to show help
function showHelp() {
  return [
    {
      title: "HTML Clipboard Decoder",
      subtitle: "Decode HTML content from clipboard",
      valid: false,
      icon: {
        path: alfy.icon.question,
      },
      text: {
        copy: `Usage:
  node index.js

Features:
  - Detects hex-encoded HTML data in clipboard
  - Decodes hex-encoded HTML content
  - Displays decoded HTML content
  - Works with regular HTML content as well

The tool will:
  1. Check clipboard for HTML content
  2. Detect if content is hex-encoded
  3. Decode hex data if necessary
  4. Display the HTML content for copying`,
        largetype: "HTML Clipboard Decoder - Decode HTML content from clipboard",
      },
    },
  ];
}

// Function to process HTML clipboard content
function processHTMLClipboardContent() {
  const results = [];

  try {
    const htmlResult = processHTMLClipboard();
    
    if (htmlResult.type === 'hex-encoded') {      
      results.push({
        title: "解码后的 HTML 内容",
        subtitle: "点击复制到剪贴板",
        valid: true,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
        },
        arg: htmlResult.content,
        text: {
          copy: htmlResult.content,
          largetype: htmlResult.content,
        },
      });
      
    } else if (htmlResult.type === 'regular-html') {
      results.push({
        title: "检测到普通 HTML 内容",
        subtitle: "显示HTML内容",
        valid: true,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
        },
        arg: htmlResult.content,
        text: {
          copy: htmlResult.content,
          largetype: htmlResult.content,
        },
      });
      
    } else {
      results.push({
        title: "剪贴板中没有 HTML 内容",
        subtitle: "请复制包含HTML内容到剪贴板",
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertNoteIcon.icns",
        },
      });
    }

  } catch (error) {
    results.push({
      title: "HTML 处理失败",
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
    const arg1 = process.argv[2];

    // Check for help flag
    if (arg1 === "--help" || arg1 === "-h" || arg1 === "help") {
      results = showHelp();
    } else {
      // For any other arguments, show help
      results = showHelp();
    }
  } else {
    // Process HTML clipboard content
    results = processHTMLClipboardContent();
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
