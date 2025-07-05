#!/bin/bash

# Linux-Specific Development Verification

echo "🐧 Linux Development Environment Verification"
echo "=============================================="

# Check distribution
if command -v lsb_release >/dev/null 2>&1; then
    DISTRO=$(lsb_release -d | cut -f2)
    echo "✓ Linux Distribution: $DISTRO"
else
    echo "✓ Linux system detected"
fi

# Check QEMU availability
if command -v qemu-system-x86_64 >/dev/null 2>&1; then
    echo "✓ QEMU available for LibreMesh development"
else
    echo "⚠ QEMU not found - install with: sudo apt install qemu-system-x86"
fi

# Check sudo access
if sudo -n true 2>/dev/null; then
    echo "✓ sudo access available for QEMU networking"
else
    echo "⚠ sudo access may be required for QEMU setup"
fi

echo "✓ Linux verification completed"
exit 0