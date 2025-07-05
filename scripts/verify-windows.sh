#!/bin/bash

# Windows-Specific Development Verification

echo "🪟 Windows Development Environment Verification"
echo "==============================================="

# Check if running in WSL
if grep -qi microsoft /proc/version 2>/dev/null; then
    WSL_VERSION=$(grep -i microsoft /proc/version | grep -o "WSL[0-9]*" || echo "WSL")
    echo "✓ Running in $WSL_VERSION - ideal for LibreMesh development"
else
    echo "⚠ Native Windows detected - frontend-only development recommended"
    echo "  Consider installing WSL2 for full LibreMesh integration"
fi

# Check for Windows package managers
if command -v winget >/dev/null 2>&1; then
    echo "✓ winget package manager available"
elif command -v choco >/dev/null 2>&1; then
    echo "✓ Chocolatey package manager available"
else
    echo "ℹ No Windows package manager detected"
fi

echo "✓ Windows verification completed"
exit 0