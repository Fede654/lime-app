#!/bin/bash

# Advanced bundle optimization for LibreRouter storage constraints
# This script applies multiple optimizations to reduce bundle size

set -e

BUILD_DIR="${1:-build}"
OPTIMIZE_LEVEL="${2:-aggressive}"  # conservative, moderate, aggressive

echo "🚀 LibreRouter Bundle Optimizer"
echo "📁 Build directory: $BUILD_DIR"
echo "⚙️  Optimization level: $OPTIMIZE_LEVEL"
echo ""

# Get initial size
INITIAL_SIZE=$(du -sb "$BUILD_DIR" | cut -f1)

# Step 1: Remove ESM bundles (always)
echo "1️⃣ Removing ESM bundles..."
find "$BUILD_DIR" -name "*.esm.js" -type f -delete 2>/dev/null || true
find "$BUILD_DIR" -name "*.esm.js.map" -type f -delete 2>/dev/null || true

# Step 2: Remove service workers (always)
echo "2️⃣ Removing service worker files..."
rm -f "$BUILD_DIR/sw.js" "$BUILD_DIR/sw-esm.js" "$BUILD_DIR/sw.js.map" "$BUILD_DIR/sw-esm.js.map" 2>/dev/null || true

# Step 3: Remove source maps (moderate+)
if [[ "$OPTIMIZE_LEVEL" == "moderate" ]] || [[ "$OPTIMIZE_LEVEL" == "aggressive" ]]; then
    echo "3️⃣ Removing source maps..."
    find "$BUILD_DIR" -name "*.map" -type f -delete 2>/dev/null || true
fi

# Step 4: Optimize images (aggressive)
if [[ "$OPTIMIZE_LEVEL" == "aggressive" ]]; then
    echo "4️⃣ Optimizing images..."
    # Convert large PNGs to WebP if possible
    if command -v cwebp &> /dev/null; then
        find "$BUILD_DIR" -name "*.png" -size +50k | while read -r img; do
            cwebp -q 80 "$img" -o "${img%.png}.webp" 2>/dev/null && rm "$img" || true
        done
    fi
    
    # Optimize SVGs
    if command -v svgo &> /dev/null; then
        find "$BUILD_DIR" -name "*.svg" -exec svgo {} \; 2>/dev/null || true
    fi
fi

# Step 5: Fix HTML files
echo "5️⃣ Optimizing HTML files..."
for html_file in "$BUILD_DIR"/*.html; do
    if [ -f "$html_file" ]; then
        # Remove module/nomodule pattern
        sed -i '/<link[^>]*rel="modulepreload"[^>]*>/d' "$html_file"
        sed -i '/<script[^>]*type="module"[^>]*>/,/<\/script>/d' "$html_file"
        sed -i 's/ nomodule//g' "$html_file"
        
        # Remove comments (aggressive)
        if [[ "$OPTIMIZE_LEVEL" == "aggressive" ]]; then
            sed -i '/<!--.*-->/d' "$html_file"
        fi
        
        # Minify HTML (remove unnecessary whitespace)
        if [[ "$OPTIMIZE_LEVEL" == "aggressive" ]]; then
            sed -i ':a;N;$!ba;s/>\s*</></g' "$html_file"
        fi
    fi
done

# Step 6: Additional JS optimizations (aggressive)
if [[ "$OPTIMIZE_LEVEL" == "aggressive" ]]; then
    echo "6️⃣ Additional JS optimizations..."
    # Remove console.log statements (already done by Terser, but double-check)
    find "$BUILD_DIR" -name "*.js" ! -name "*.min.js" -exec sed -i 's/console\.log[^;]*;//g' {} \; 2>/dev/null || true
fi

# Step 7: Compress assets (optional, for transfer)
if [[ "$OPTIMIZE_LEVEL" == "aggressive" ]] && command -v gzip &> /dev/null; then
    echo "7️⃣ Creating compressed versions..."
    find "$BUILD_DIR" -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) ! -name "*.gz" | while read -r file; do
        gzip -9 -k "$file" 2>/dev/null || true
    done
fi

# Calculate final size and savings
FINAL_SIZE=$(du -sb "$BUILD_DIR" | cut -f1)
SAVED=$((INITIAL_SIZE - FINAL_SIZE))
SAVED_MB=$(echo "scale=2; $SAVED / 1048576" | bc)
PERCENT=$(echo "scale=1; ($SAVED * 100) / $INITIAL_SIZE" | bc)

echo ""
echo "✅ Optimization complete!"
echo "📊 Size reduction: ${SAVED_MB}MB (${PERCENT}%)"
echo "📦 Initial size: $(echo "scale=2; $INITIAL_SIZE / 1048576" | bc)MB"
echo "📦 Final size: $(echo "scale=2; $FINAL_SIZE / 1048576" | bc)MB"
echo ""

# List final bundle composition
echo "📋 Final bundle composition:"
find "$BUILD_DIR" -type f \( -name "*.js" -o -name "*.css" \) ! -name "*.map" ! -name "*.gz" | sort | while read -r file; do
    size=$(ls -lh "$file" | awk '{print $5}')
    echo "  - $(basename "$file"): $size"
done

# Generate manifest for deployment
echo ""
echo "📝 Generating deployment manifest..."
cat > "$BUILD_DIR/manifest.txt" << EOF
LibreRouter LimeApp Bundle Manifest
Generated: $(date)
Optimization Level: $OPTIMIZE_LEVEL
Total Size: $(echo "scale=2; $FINAL_SIZE / 1048576" | bc)MB
Files:
$(find "$BUILD_DIR" -type f ! -name "manifest.txt" -printf "%P %s\n" | sort)
EOF

echo "✅ Manifest saved to $BUILD_DIR/manifest.txt"