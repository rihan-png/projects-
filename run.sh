#!/bin/bash

# YouTube Frame Capture - Quick Run Script
# This script starts a local web server for the application

echo "🚀 Starting YouTube Frame Capture Application..."
echo ""

# Check if youtube-frame-capture directory exists
if [ ! -d "youtube-frame-capture" ]; then
    echo "❌ Error: youtube-frame-capture directory not found!"
    echo "   Make sure you're in the project root directory."
    exit 1
fi

# Navigate to the application directory
cd youtube-frame-capture

# Try to find an available server
echo "🔍 Looking for available web server..."
echo ""

# Check for Python 3
if command -v python3 &> /dev/null; then
    echo "✅ Found Python 3"
    echo "📡 Starting server on http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "Open your browser and navigate to: http://localhost:8000"
    echo ""
    python3 -m http.server 8000
    exit 0
fi

# Check for Python 2
if command -v python &> /dev/null; then
    echo "✅ Found Python 2"
    echo "📡 Starting server on http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "Open your browser and navigate to: http://localhost:8000"
    echo ""
    python -m SimpleHTTPServer 8000
    exit 0
fi

# Check for Node.js
if command -v node &> /dev/null; then
    echo "✅ Found Node.js"
    echo "📡 Starting server on http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "Open your browser and navigate to: http://localhost:8000"
    echo ""
    npx http-server -p 8000
    exit 0
fi

# Check for PHP
if command -v php &> /dev/null; then
    echo "✅ Found PHP"
    echo "📡 Starting server on http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "Open your browser and navigate to: http://localhost:8000"
    echo ""
    php -S localhost:8000
    exit 0
fi

# No server found
echo "❌ No web server found!"
echo ""
echo "Please install one of the following:"
echo "  - Python 3: https://www.python.org/downloads/"
echo "  - Node.js: https://nodejs.org/"
echo "  - PHP: https://www.php.net/"
echo ""
echo "Then run this script again."
exit 1
