#!/bin/bash

# Optimized deployment script for LibreRouter
# Cleans destination, builds, optimizes, and deploys

set -e

# Configuration
LIME_PACKAGES_DIR="${LIME_PACKAGES_DIR:-../lime-packages}"
TARGET_DIR="$LIME_PACKAGES_DIR/packages/lime-app/files/www/app"
BUILD_DIR="build"
OPTIMIZATION_LEVEL="${1:-moderate}"  # conservative, moderate, aggressive

echo "🚀 LibreRouter Optimized Deployment"
echo "📁 Target: $TARGET_DIR"
echo "⚙️  Optimization: $OPTIMIZATION_LEVEL"
echo ""

# Step 1: Build production bundle
echo "1️⃣ Building production bundle..."
npm run build:production

# Step 2: Run additional optimizations
echo "2️⃣ Running additional optimizations..."
./scripts/optimize-bundle.sh "$BUILD_DIR" "$OPTIMIZATION_LEVEL"

# Step 3: Clean target directory
echo "3️⃣ Cleaning target directory..."
if [ -d "$TARGET_DIR" ]; then
    echo "   Removing old files from $TARGET_DIR"
    rm -rf "$TARGET_DIR"/*
else
    echo "   Creating target directory: $TARGET_DIR"
    mkdir -p "$TARGET_DIR"
fi

# Step 4: Deploy optimized bundle
echo "4️⃣ Deploying optimized bundle..."
cp -r "$BUILD_DIR"/* "$TARGET_DIR/"

# Step 5: Verify deployment
echo "5️⃣ Verifying deployment..."
DEPLOYED_SIZE=$(du -sh "$TARGET_DIR" | cut -f1)
FILE_COUNT=$(find "$TARGET_DIR" -type f | wc -l)

echo ""
echo "✅ Deployment complete!"
echo "📊 Deployed size: $DEPLOYED_SIZE"
echo "📁 Total files: $FILE_COUNT"
echo ""

# List deployed files
echo "📋 Deployed files:"
find "$TARGET_DIR" -type f -printf "%P %s\n" | sort | while read -r file size; do
    size_human=$(numfmt --to=iec-i --suffix=B "$size" 2>/dev/null || echo "${size}B")
    echo "  - $file ($size_human)"
done

# Generate deployment report
REPORT_FILE="$TARGET_DIR/deployment-report.txt"
cat > "$REPORT_FILE" << EOF
LibreRouter LimeApp Deployment Report
=====================================
Date: $(date)
Optimization Level: $OPTIMIZATION_LEVEL
Total Size: $DEPLOYED_SIZE
File Count: $FILE_COUNT
Git Commit: $(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

Files:
$(find "$TARGET_DIR" -type f ! -name "deployment-report.txt" -exec ls -lh {} \; | awk '{print $5 " " $9}' | sort -hr)
EOF

echo ""
echo "📄 Deployment report saved to: $REPORT_FILE"

# Optional: Test with QEMU if available
if command -v qemu-system-x86_64 &> /dev/null && [ -f "$LIME_PACKAGES_DIR/build/openwrt-x86-64-generic-ext4-combined.img" ]; then
    echo ""
    echo "💡 QEMU is available. Run 'npm run qemu:start' to test the deployment."
fi