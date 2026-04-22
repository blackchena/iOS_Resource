#!/bin/bash

# Alfred PNG to WebP Converter - Installation Script
# Compatible with Alfred 5.0.3+

echo "Installing Alfred PNG to WebP Converter..."
echo "Compatible with Alfred 5.0.3+"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 16+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "Error: Node.js version 16+ is required. Current version: $(node -v)"
    echo "Please update Node.js to version 16 or later."
    exit 1
fi

echo "Node.js version: $(node -v) ✓"

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "✗ Failed to install dependencies"
    exit 1
fi

# Make index.js executable
chmod +x index.js

echo ""
echo "Installation completed successfully!"
echo ""
echo "Usage:"
echo "1. Type 'png2webp' in Alfred"
echo "2. Enter the folder path containing PNG images"
echo "3. Press Enter to convert"
echo ""
echo "The workflow will convert all PNG files to WebP format with 80% quality." 