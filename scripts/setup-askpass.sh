#!/usr/bin/env bash
#
# Setup askpass helper for QEMU development
# Ensures smooth sudo operations without terminal password prompts
#
# Usage: ./scripts/setup-askpass.sh
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

# Detect package manager and install askpass
install_askpass() {
    print_status "Installing askpass helper..."
    
    if command -v apt >/dev/null 2>&1; then
        # Debian/Ubuntu
        print_status "Detected apt package manager (Debian/Ubuntu)"
        sudo apt update && sudo apt install -y ssh-askpass
        ASKPASS_PATH="/usr/bin/ssh-askpass"
    elif command -v yum >/dev/null 2>&1; then
        # RHEL/CentOS
        print_status "Detected yum package manager (RHEL/CentOS)"
        sudo yum install -y openssh-askpass
        ASKPASS_PATH="/usr/libexec/openssh/ssh-askpass"
    elif command -v dnf >/dev/null 2>&1; then
        # Fedora
        print_status "Detected dnf package manager (Fedora)"
        sudo dnf install -y openssh-askpass
        ASKPASS_PATH="/usr/libexec/openssh/ssh-askpass"
    elif command -v pacman >/dev/null 2>&1; then
        # Arch Linux
        print_status "Detected pacman package manager (Arch Linux)"
        sudo pacman -S --noconfirm openssh-askpass
        ASKPASS_PATH="/usr/lib/ssh/ssh-askpass"
    else
        print_error "Unsupported package manager. Please install ssh-askpass manually."
        exit 1
    fi
    
    echo "$ASKPASS_PATH"
}

# Check if askpass is already installed
check_askpass() {
    if command -v ssh-askpass >/dev/null 2>&1; then
        print_status "ssh-askpass is already installed"
        return 0
    elif [ -f "/usr/bin/ssh-askpass" ]; then
        print_status "ssh-askpass found at /usr/bin/ssh-askpass"
        return 0
    elif [ -f "/usr/libexec/openssh/ssh-askpass" ]; then
        print_status "ssh-askpass found at /usr/libexec/openssh/ssh-askpass"
        return 0
    else
        return 1
    fi
}

# Configure environment
configure_environment() {
    local askpass_path="$1"
    
    print_status "Configuring askpass environment..."
    
    # Add to current session
    export SUDO_ASKPASS="$askpass_path"
    
    # Add to shell profiles for persistence
    local shell_configs=("$HOME/.bashrc" "$HOME/.zshrc" "$HOME/.profile")
    
    for config in "${shell_configs[@]}"; do
        if [ -f "$config" ]; then
            if ! grep -q "SUDO_ASKPASS" "$config"; then
                echo "" >> "$config"
                echo "# LibreMesh QEMU development - askpass helper" >> "$config"
                echo "export SUDO_ASKPASS=\"$askpass_path\"" >> "$config"
                print_status "Added SUDO_ASKPASS to $config"
            else
                print_status "SUDO_ASKPASS already configured in $config"
            fi
        fi
    done
    
    # Create project-specific env file
    echo "SUDO_ASKPASS=$askpass_path" > .env.askpass
    print_status "Created .env.askpass for project-specific configuration"
}

# Test askpass configuration
test_askpass() {
    print_status "Testing askpass configuration..."
    
    if sudo -A echo "askpass test successful" >/dev/null 2>&1; then
        print_status "✅ Askpass helper is working correctly"
        return 0
    else
        print_error "❌ Askpass helper test failed"
        return 1
    fi
}

# Main execution
main() {
    print_status "=== LibreMesh QEMU Askpass Setup ==="
    
    if check_askpass; then
        # Find existing askpass
        if [ -f "/usr/bin/ssh-askpass" ]; then
            ASKPASS_PATH="/usr/bin/ssh-askpass"
        elif [ -f "/usr/libexec/openssh/ssh-askpass" ]; then
            ASKPASS_PATH="/usr/libexec/openssh/ssh-askpass"
        else
            ASKPASS_PATH=$(command -v ssh-askpass)
        fi
    else
        print_warning "askpass helper not found, installing..."
        ASKPASS_PATH=$(install_askpass)
    fi
    
    configure_environment "$ASKPASS_PATH"
    
    if test_askpass; then
        print_status "🎉 Askpass setup complete!"
        print_status ""
        print_status "You can now run QEMU commands without password prompts:"
        print_status "  npm run qemu:start"
        print_status "  npm run qemu:dev" 
        print_status ""
        print_status "Note: You may need to restart your terminal or run:"
        print_status "  source ~/.bashrc"
    else
        print_error "Setup failed. Please check your configuration."
        exit 1
    fi
}

main "$@"