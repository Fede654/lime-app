#!/bin/bash

# Cross-Platform Testing Script
# Tests compatibility across different platforms

echo "🌍 Cross-Platform Testing"
echo "========================="
echo
echo "Platform: $(uname -s) $(uname -m)"
echo

# Run standard tests
if npm test >/dev/null 2>&1; then
    echo "✓ Unit tests pass on this platform"
else
    echo "❌ Unit tests failing on this platform"
    exit 1
fi

# Test build process
if npm run build >/dev/null 2>&1; then
    echo "✓ Build process works on this platform"
else
    echo "❌ Build process failing on this platform"
    exit 1
fi

echo "✓ Cross-platform testing completed successfully"
exit 0