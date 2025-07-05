#!/usr/bin/env bash
#
# Setup script for QEMU development with LibreMesh
# Configures passwordless sudo for development workflow
#
# Usage: ./scripts/setup-sudo.sh
#

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "scripts" ]; then
    print_error "This script must be run from the lime-app root directory"
    exit 1
fi

# Get the absolute path to lime-packages
LIME_PACKAGES_DIR="$(cd ../lime-packages && pwd)"
QEMU_TOOL="$LIME_PACKAGES_DIR/tools/qemu_dev_start"

if [ ! -f "$QEMU_TOOL" ]; then
    print_error "lime-packages repository not found at $LIME_PACKAGES_DIR"
    print_error "Please ensure lime-packages is cloned in the parent directory"
    exit 1
fi

print_status "Setting up passwordless sudo for QEMU development..."

# Create sudoers rule for QEMU development
SUDOERS_RULE="$USER ALL=(ALL) NOPASSWD: $QEMU_TOOL"
SUDOERS_FILE="/etc/sudoers.d/qemu-dev"

# Check if rule already exists
if sudo test -f "$SUDOERS_FILE" && sudo grep -q "$QEMU_TOOL" "$SUDOERS_FILE"; then
    print_status "Passwordless sudo already configured for QEMU development"
else
    print_status "Adding passwordless sudo rule..."
    echo "$SUDOERS_RULE" | sudo tee "$SUDOERS_FILE" > /dev/null
    sudo chmod 440 "$SUDOERS_FILE"
    print_status "✅ Passwordless sudo configured successfully"
fi

# Test the configuration
print_status "Testing passwordless sudo..."
if sudo -n "$QEMU_TOOL" --help > /dev/null 2>&1; then
    print_status "✅ Passwordless sudo test successful"
else
    print_error "❌ Passwordless sudo test failed"
    print_error "You may need to restart your session or run: sudo -k"
    exit 1
fi

print_status "🎉 QEMU development setup complete!"
print_status ""
print_status "You can now run:"
print_status "  npm run qemu:start     # Start QEMU LibreMesh"
print_status "  npm run qemu:dev       # Start development server"
print_status "  npm run qemu:deploy    # Deploy lime-app to QEMU"