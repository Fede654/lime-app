#!/bin/bash

# Setup git aliases for clean upstream contribution workflow
# This helps maintain separation between development and upstream-ready code

echo "Setting up git aliases for upstream contribution workflow..."

# Alias to show only upstream-safe files in status
git config alias.upstream-status '!git status --porcelain | grep -v -f .upstream-exclude || true'

# Alias to add only upstream-safe files
git config alias.upstream-add '!f() { git add $(git ls-files --modified --others --exclude-standard | grep -v -f .upstream-exclude); }; f'

# Alias to create upstream-ready commits with marker
git config alias.upstream-commit '!f() { git commit -m "$1" -m "🎯 Upstream-ready: This commit contains only changes suitable for upstream contribution"; }; f'

# Alias to show diff excluding non-upstream files
git config alias.upstream-diff '!f() { git diff "$@" -- $(git ls-files | grep -v -f .upstream-exclude); }; f'

# Alias to create a clean patch for upstream
git config alias.upstream-patch '!f() { 
    BRANCH=${1:-HEAD}
    BASE=${2:-upstream/master}
    echo "Creating upstream patch from $BRANCH against $BASE..."
    git diff $BASE..$BRANCH -- $(git ls-files | grep -v -f .upstream-exclude) > upstream-patch-$(date +%Y%m%d-%H%M%S).patch
    echo "Patch created!"
}; f'

# Alias to check which files in a commit are upstream-safe
git config alias.upstream-check '!f() {
    COMMIT=${1:-HEAD}
    echo "Checking commit $COMMIT for upstream compatibility..."
    echo "Files that would be excluded:"
    git diff-tree --no-commit-id --name-only -r $COMMIT | grep -f .upstream-exclude || echo "✓ All files are upstream-safe!"
}; f'

echo "✅ Git aliases configured successfully!"
echo ""
echo "Available commands:"
echo "  git upstream-status     - Show only upstream-safe changes"
echo "  git upstream-add        - Stage only upstream-safe files"
echo "  git upstream-commit     - Create commit marked as upstream-ready"
echo "  git upstream-diff       - Show diff of upstream-safe files only"
echo "  git upstream-patch      - Create a clean patch file for upstream"
echo "  git upstream-check      - Check if a commit is upstream-safe"
echo ""
echo "Example workflow:"
echo "  1. git upstream-status"
echo "  2. git upstream-add"
echo "  3. git upstream-commit \"fix: resolve TypeScript errors in test mocks\""
echo "  4. git upstream-check HEAD"