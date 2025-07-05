#!/bin/bash

# macOS-Specific Development Verification

echo "🍎 macOS Development Environment Verification"
echo "=============================================="

# Check macOS version
if command -v sw_vers >/dev/null 2>&1; then
    VERSION=$(sw_vers -productVersion)
    echo "✓ macOS Version: $VERSION"
fi

# Check Homebrew
if command -v brew >/dev/null 2>&1; then
    echo "✓ Homebrew package manager available"
else
    echo "⚠ Homebrew not found - install from https://brew.sh"
fi

# Check Xcode command line tools
if xcode-select -p >/dev/null 2>&1; then
    echo "✓ Xcode command line tools installed"
else
    echo "⚠ Xcode command line tools missing - install with: xcode-select --install"
fi

# Check QEMU
if command -v qemu-system-x86_64 >/dev/null 2>&1; then
    echo "✓ QEMU available for LibreMesh development"
else
    echo "⚠ QEMU not found - install with: brew install qemu"
fi

echo "✓ macOS verification completed"
exit 0