#!/usr/bin/env node
import alfy from "alfy";
import * as jose from "jose";
import { hkdf } from "@panva/hkdf";

async function getDerivedEncryptionKey(enc, keyMaterial, salt) {
  let length;
  switch (enc) {
      case "A256CBC-HS512":
          length = 64;
          break;
      case "A256GCM":
          length = 32;
          break;
      default:
          throw new Error("Unsupported JWT Content Encryption Algorithm");
  }
  return await hkdf("sha256", keyMaterial, salt, `Auth.js Generated Encryption Key (${salt})`, length);
}

// Function to decrypt JWE token
async function decryptJWEToken(jweToken, key) {
  const results = [];

  try {
    // Try to decrypt the JWE token
    // const { plaintext, protectedHeader } = await jose.compactDecrypt(
    //   jweToken,
    //   key
    // );
    const salt = "authjs.session-token";
    const enc = "A256CBC-HS512";
    const res = await jose.jwtDecrypt(
      jweToken,
      async ({ kid, enc }) => {
        const secrets = [key];
        for (const secret of secrets) {
          const encryptionSecret = await getDerivedEncryptionKey(
            enc,
            secret,
            salt
          );
          // console.log(btoa(String.fromCharCode.apply(null, encryptionSecret)), "================");
          return encryptionSecret
        }
        throw new Error("no matching decryption secret");
      },
      {
        clockTolerance: 15,
        keyManagementAlgorithms: ['dir'],
        contentEncryptionAlgorithms: [enc, "A256GCM"],
      }
    );
    // console.log(res, "================");
    const { payload, protectedHeader } = res;
    // console.log(payload, "================");

    // Try to parse as JSON for better formatting
    let formattedContent;
    try {
      formattedContent = JSON.stringify(payload, null, 2);
    } catch {
      // If not valid JSON, use as plain text
      formattedContent = payload;
    }

    results.push({
      title: "JWE Token Decrypted Successfully",
      subtitle: `Algorithm: ${protectedHeader.alg || "Unknown"}, Encryption: ${
        protectedHeader.enc || "Unknown"
      }`,
      valid: true,
      icon: {
        path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns",
      },
      text: {
        copy: formattedContent,
        largetype: formattedContent,
      },
    });

    // Add header information
    results.push({
      title: "Protected Header",
      subtitle: "JWE token header information",
      valid: false,
      icon: {
        path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericQuestionMarkIcon.icns",
      },
      text: {
        copy: JSON.stringify(protectedHeader, null, 2),
        largetype: JSON.stringify(protectedHeader, null, 2),
      },
    });
  } catch (error) {
    results.push({
      title: "Failed to Decrypt JWE Token",
      subtitle: error.message,
      valid: false,
      icon: {
        path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns",
      },
      text: {
        copy: `Error: ${error.message}`,
        largetype: `Decryption failed: ${error.message}`,
      },
    });
  }

  return results;
}

// Function to show help
function showHelp() {
  return [
    {
      title: "JWE Token Decrypter",
      subtitle: "Decrypt JWE tokens using jose library",
      valid: false,
      icon: {
        path: alfy.icon.question,
      },
      text: {
        copy: `Usage:
  node index.js <jwe_token> <key>

Examples:
  node index.js "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0..." "your-key-here"
  node index.js "jwe-token-string" "base64-encoded-key"

Features:
  - Decrypts JWE tokens using the jose library
  - Supports various encryption algorithms
  - Displays decrypted content and header information
  - Handles JSON and plain text content
  - Provides detailed error messages`,
        largetype:
          "JWE Token Decrypter - Decrypt JWE tokens using jose library",
      },
    },
  ];
}

// Function to process Alfred workflow input
async function processAlfredInput() {
  const input = alfy.input;

  if (!input) {
    return [
      {
        title: "Please provide a JWE token",
        subtitle: "Enter a JWE token to decrypt",
        valid: false,
        icon: {
          path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertNoteIcon.icns",
        },
      },
    ];
  }

  // Check if input looks like a JWE token (contains dots and is base64-like)
  if (
    input.includes(".") &&
    /^[A-Za-z0-9+/=_-]+(\.[A-Za-z0-9+/=_-]+)*$/.test(input)
  ) {
    return [
      {
        title: "JWE Token Detected",
        subtitle: "Please provide the decryption key",
        valid: false,
        icon: {
          path: alfy.icon.note,
        },
      },
    ];
  } else {
    return [
      {
        title: "Invalid JWE Token Format",
        subtitle: "JWE tokens should contain dots and be base64-like",
        valid: false,
        icon: {
          path: alfy.icon.error,
        }
      },
    ];
  }
}

// Function to create a key from various formats
function createKey(keyInput) {
  try {
    // Try to decode as base64url
    if (
      keyInput.includes(".") ||
      keyInput.includes("-") ||
      keyInput.includes("_")
    ) {
      return jose.base64url.decode(keyInput);
    }

    // Try to decode as base64
    try {
      return Buffer.from(keyInput, "base64");
    } catch {
      // If not base64, treat as raw string
      return new TextEncoder().encode(keyInput);
    }
  } catch (error) {
    throw new Error(`Invalid key format: ${error.message}`);
  }
}

// Main execution
async function main() {
  let results = [];
  if (process.argv.length > 2) {
    const arg = process.argv[2];

    // Check for help flag
    if (arg === "--help" || arg === "-h" || arg === "help") {
      results = showHelp();
    } else if (process.argv.length > 3) {
      // We have both JWE token and key
      const jweToken = arg;
      const keyInput = process.argv[3];

      try {
        const key = keyInput;
        results = await decryptJWEToken(jweToken, key);
      } catch (error) {
        results = [
          {
            title: "Invalid Key Format",
            subtitle: error.message,
            valid: false,
            icon: {
              path: alfy.icon.error,
            },
          },
        ];
      }
    } else {
      // Only JWE token provided - treat as Alfred input
      results = await processAlfredInput();
    }
  } else {
    // Otherwise, process Alfred input
    results = await processAlfredInput();
  }

  // Output results to Alfred
  alfy.output(results);
}

// Run the main function
main().catch((error) => {
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
});
