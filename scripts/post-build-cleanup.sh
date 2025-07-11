#!/bin/bash

# Post-build cleanup script to remove ESM bundles and optimize for LibreRouter storage constraints
# This removes dual bundle generation artifacts from Preact CLI

set -e

BUILD_DIR="build"

echo "🧹 Starting post-build cleanup for LibreRouter optimization..."

# Remove all ESM bundles (they have .esm.js extension)
echo "Removing ESM bundles..."
find "$BUILD_DIR" -name "*.esm.js" -type f -delete 2>/dev/null || true
find "$BUILD_DIR" -name "*.esm.js.map" -type f -delete 2>/dev/null || true

# Remove service worker files if not needed
echo "Removing service worker files..."
rm -f "$BUILD_DIR/sw.js" "$BUILD_DIR/sw-esm.js" "$BUILD_DIR/sw.js.map" "$BUILD_DIR/sw-esm.js.map" 2>/dev/null || true

# Fix index.html to remove module/nomodule pattern
if [ -f "$BUILD_DIR/index.html" ]; then
    echo "Fixing index.html to remove module/nomodule references..."
    
    # Create backup
    cp "$BUILD_DIR/index.html" "$BUILD_DIR/index.html.backup"
    
    # Remove all <link rel="modulepreload"> tags
    sed -i '/<link[^>]*rel="modulepreload"[^>]*>/d' "$BUILD_DIR/index.html"
    
    # Remove all <script type="module"> tags
    sed -i '/<script[^>]*type="module"[^>]*>/,/<\/script>/d' "$BUILD_DIR/index.html"
    
    # Remove nomodule attribute from legacy scripts
    sed -i 's/ nomodule//g' "$BUILD_DIR/index.html"
    
    # Also fix 200.html if it exists
    if [ -f "$BUILD_DIR/200.html" ]; then
        cp "$BUILD_DIR/index.html" "$BUILD_DIR/200.html"
    fi
fi

# Remove duplicate meta tags or unnecessary preloads
if [ -f "$BUILD_DIR/index.html" ]; then
    echo "Optimizing HTML meta tags..."
    # Remove duplicate viewport meta tags (keep only the first one)
    awk '!/<meta name="viewport"/ || !seen++' "$BUILD_DIR/index.html" > "$BUILD_DIR/index.html.tmp"
    mv "$BUILD_DIR/index.html.tmp" "$BUILD_DIR/index.html"
fi

# Calculate space saved
BEFORE_SIZE=$(du -sh "$BUILD_DIR" 2>/dev/null | cut -f1 || echo "Unknown")
echo "✅ Cleanup complete!"
echo "📊 Build directory size: $BEFORE_SIZE"

# List remaining files
echo ""
echo "📦 Remaining bundle files:"
find "$BUILD_DIR" -name "*.js" -o -name "*.css" | grep -v ".map" | sort | while read -r file; do
    size=$(ls -lh "$file" | awk '{print $5}')
    echo "  - $(basename "$file") ($size)"
done

# Total JS+CSS size
total_size=$(find "$BUILD_DIR" \( -name "*.js" -o -name "*.css" \) ! -name "*.map" -exec ls -l {} \; | awk '{sum += $5} END {printf "%.2f", sum/1024/1024}')
echo ""
echo "📏 Total JS+CSS size: ${total_size} MB"