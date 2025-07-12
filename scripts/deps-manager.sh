#!/usr/bin/env bash
#
# LibreMesh Development Dependencies Manager
# Comprehensive dependency checking and installation across multiple platforms
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Platform detection
detect_platform() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        PLATFORM="linux"
        
        # Detect specific distribution
        if [ -f /etc/os-release ]; then
            source /etc/os-release
            DISTRO_ID="$ID"
            DISTRO_VERSION="$VERSION_ID"
        elif command -v lsb_release >/dev/null 2>&1; then
            DISTRO_ID=$(lsb_release -si | tr '[:upper:]' '[:lower:]')
            DISTRO_VERSION=$(lsb_release -sr)
        else
            DISTRO_ID="unknown"
            DISTRO_VERSION="unknown"
        fi
        
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        PLATFORM="macos"
        DISTRO_ID="macos"
        DISTRO_VERSION=$(sw_vers -productVersion)
        
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
        PLATFORM="windows"
        DISTRO_ID="windows"
        DISTRO_VERSION="unknown"
        
    else
        PLATFORM="unknown"
        DISTRO_ID="unknown"
        DISTRO_VERSION="unknown"
    fi
    
    print_info "Platform: $PLATFORM ($DISTRO_ID $DISTRO_VERSION)"
}

# Package manager detection
detect_package_manager() {
    if command -v apt-get >/dev/null 2>&1; then
        PKG_MANAGER="apt"
        PKG_INSTALL_CMD="sudo apt-get update && sudo apt-get install -y"
        PKG_CHECK_CMD="dpkg -l"
        
    elif command -v yum >/dev/null 2>&1; then
        PKG_MANAGER="yum"
        PKG_INSTALL_CMD="sudo yum install -y"
        PKG_CHECK_CMD="rpm -qa"
        
    elif command -v dnf >/dev/null 2>&1; then
        PKG_MANAGER="dnf"
        PKG_INSTALL_CMD="sudo dnf install -y"
        PKG_CHECK_CMD="rpm -qa"
        
    elif command -v pacman >/dev/null 2>&1; then
        PKG_MANAGER="pacman"
        PKG_INSTALL_CMD="sudo pacman -S --needed"
        PKG_CHECK_CMD="pacman -Qs"
        
    elif command -v zypper >/dev/null 2>&1; then
        PKG_MANAGER="zypper"
        PKG_INSTALL_CMD="sudo zypper install -y"
        PKG_CHECK_CMD="rpm -qa"
        
    elif command -v brew >/dev/null 2>&1; then
        PKG_MANAGER="brew"
        PKG_INSTALL_CMD="brew install"
        PKG_CHECK_CMD="brew list"
        
    else
        PKG_MANAGER="unknown"
        PKG_INSTALL_CMD=""
        PKG_CHECK_CMD=""
    fi
    
    print_info "Package manager: $PKG_MANAGER"
}

# Define package mappings for different package managers
declare -A PACKAGES_APT=(
    ["qemu"]="qemu-system-x86"
    ["qemu-utils"]="qemu-utils"
    ["bridge-utils"]="bridge-utils"
    ["dnsmasq"]="dnsmasq"
    ["curl"]="curl"
    ["wget"]="wget"
    ["screen"]="screen"
    ["cpio"]="cpio"
    ["tar"]="tar"
    ["gzip"]="gzip"
    ["nodejs"]="nodejs"
    ["npm"]="npm"
    ["git"]="git"
)

declare -A PACKAGES_YUM=(
    ["qemu"]="qemu-kvm"
    ["qemu-utils"]="qemu-img"
    ["bridge-utils"]="bridge-utils"
    ["dnsmasq"]="dnsmasq"
    ["curl"]="curl"
    ["wget"]="wget"
    ["screen"]="screen"
    ["cpio"]="cpio"
    ["tar"]="tar"
    ["gzip"]="gzip"
    ["nodejs"]="nodejs"
    ["npm"]="npm"
    ["git"]="git"
)

declare -A PACKAGES_DNF=(
    ["qemu"]="qemu-system-x86"
    ["qemu-utils"]="qemu-img"
    ["bridge-utils"]="bridge-utils"
    ["dnsmasq"]="dnsmasq"
    ["curl"]="curl"
    ["wget"]="wget"
    ["screen"]="screen"
    ["cpio"]="cpio"
    ["tar"]="tar"
    ["gzip"]="gzip"
    ["nodejs"]="nodejs"
    ["npm"]="npm"
    ["git"]="git"
)

declare -A PACKAGES_PACMAN=(
    ["qemu"]="qemu"
    ["qemu-utils"]="qemu"
    ["bridge-utils"]="bridge-utils"
    ["dnsmasq"]="dnsmasq"
    ["curl"]="curl"
    ["wget"]="wget"
    ["screen"]="screen"
    ["cpio"]="cpio"
    ["tar"]="tar"
    ["gzip"]="gzip"
    ["nodejs"]="nodejs"
    ["npm"]="npm"
    ["git"]="git"
)

declare -A PACKAGES_BREW=(
    ["qemu"]="qemu"
    ["qemu-utils"]="qemu"
    ["bridge-utils"]="bridge-utils"
    ["dnsmasq"]="dnsmasq"
    ["curl"]="curl"
    ["wget"]="wget"
    ["screen"]="screen"
    ["cpio"]="cpio"
    ["tar"]="gtar"
    ["gzip"]="gzip"
    ["nodejs"]="node"
    ["npm"]="npm"
    ["git"]="git"
)

# Check if a package is installed
is_package_installed() {
    local package="$1"
    
    case "$PKG_MANAGER" in
        "apt")
            dpkg -l | grep -q "^ii.*$package" 2>/dev/null
            ;;
        "yum"|"dnf")
            rpm -qa | grep -q "$package" 2>/dev/null
            ;;
        "pacman")
            pacman -Qs "$package" >/dev/null 2>&1
            ;;
        "brew")
            brew list | grep -q "$package" 2>/dev/null
            ;;
        *)
            command -v "$package" >/dev/null 2>&1
            ;;
    esac
}

# Check if a command is available
is_command_available() {
    local cmd="$1"
    command -v "$cmd" >/dev/null 2>&1
}

# Get package name for current package manager
get_package_name() {
    local generic_name="$1"
    local pkg_var="PACKAGES_${PKG_MANAGER^^}"
    
    if [[ -n "${!pkg_var}" ]]; then
        # Use associative array reference
        local -n pkg_array="$pkg_var"
        echo "${pkg_array[$generic_name]:-$generic_name}"
    else
        echo "$generic_name"
    fi
}

# Check all dependencies
check_dependencies() {
    local issues=0
    local missing_packages=()
    
    print_info "Checking dependencies for LibreMesh development..."
    
    # Essential packages for QEMU development
    local essential_packages=(
        "qemu"
        "bridge-utils"
        "dnsmasq"
        "curl"
        "wget"
        "screen"
        "cpio"
        "tar"
        "gzip"
    )
    
    # Development packages
    local dev_packages=(
        "nodejs"
        "npm"
        "git"
    )
    
    # Check essential packages
    print_info "Essential packages:"
    for package in "${essential_packages[@]}"; do
        local pkg_name
        pkg_name=$(get_package_name "$package")
        
        # Special handling for qemu
        if [[ "$package" == "qemu" ]]; then
            if is_command_available "qemu-system-x86_64"; then
                print_status "$package (qemu-system-x86_64 available)"
            else
                print_warning "$package (qemu-system-x86_64 not found)"
                missing_packages+=("$pkg_name")
                ((issues++))
            fi
        # Special handling for bridge-utils
        elif [[ "$package" == "bridge-utils" ]]; then
            if is_command_available "brctl" || is_command_available "ip"; then
                print_status "$package (bridge tools available)"
            else
                print_warning "$package (bridge tools not found)"
                missing_packages+=("$pkg_name")
                ((issues++))
            fi
        else
            if is_command_available "$package"; then
                print_status "$package"
            else
                print_warning "$package not found"
                missing_packages+=("$pkg_name")
                ((issues++))
            fi
        fi
    done
    
    # Check development packages
    print_info "Development packages:"
    for package in "${dev_packages[@]}"; do
        local pkg_name
        pkg_name=$(get_package_name "$package")
        
        if is_command_available "$package"; then
            print_status "$package"
            
            # Show versions for important tools
            case "$package" in
                "nodejs")
                    local version
                    version=$(node --version 2>/dev/null || echo "unknown")
                    print_info "  Version: $version"
                    ;;
                "npm")
                    local version
                    version=$(npm --version 2>/dev/null || echo "unknown")
                    print_info "  Version: $version"
                    ;;
                "git")
                    local version
                    version=$(git --version 2>/dev/null | cut -d' ' -f3 || echo "unknown")
                    print_info "  Version: $version"
                    ;;
            esac
        else
            print_warning "$package not found"
            missing_packages+=("$pkg_name")
            ((issues++))
        fi
    done
    
    # Check system requirements
    print_info "System requirements:"
    
    # Check KVM support (Linux only)
    if [[ "$PLATFORM" == "linux" ]]; then
        if [ -r /dev/kvm ]; then
            print_status "KVM acceleration available"
        else
            print_warning "KVM not available (QEMU will be slower)"
            print_info "  Enable with: sudo modprobe kvm-intel (or kvm-amd)"
        fi
        
        # Check if user is in kvm group
        if groups | grep -q kvm; then
            print_status "User in 'kvm' group"
        else
            print_warning "User not in 'kvm' group"
            print_info "  Add with: sudo usermod -a -G kvm \$USER"
        fi
    fi
    
    # Check memory
    if command -v free >/dev/null 2>&1; then
        local total_mem
        total_mem=$(free -m | awk '/^Mem:/{print $2}')
        if [[ $total_mem -gt 4096 ]]; then
            print_status "Memory: ${total_mem}MB (sufficient)"
        elif [[ $total_mem -gt 2048 ]]; then
            print_warning "Memory: ${total_mem}MB (minimum - may be slow)"
        else
            print_error "Memory: ${total_mem}MB (insufficient - need at least 2GB)"
            ((issues++))
        fi
    elif command -v sysctl >/dev/null 2>&1 && [[ "$PLATFORM" == "macos" ]]; then
        local total_mem
        total_mem=$(($(sysctl -n hw.memsize) / 1024 / 1024))
        if [[ $total_mem -gt 4096 ]]; then
            print_status "Memory: ${total_mem}MB (sufficient)"
        else
            print_warning "Memory: ${total_mem}MB (may be insufficient)"
        fi
    fi
    
    # Check disk space
    local available_space
    available_space=$(df -BM "$PWD" | awk 'NR==2 {print $4}' | sed 's/M//' 2>/dev/null || echo "0")
    if [[ $available_space -gt 10000 ]]; then
        print_status "Disk space: ${available_space}MB (sufficient)"
    elif [[ $available_space -gt 5000 ]]; then
        print_warning "Disk space: ${available_space}MB (minimum)"
    else
        print_error "Disk space: ${available_space}MB (insufficient - need at least 5GB)"
        ((issues++))
    fi
    
    # Summary
    echo
    if [[ $issues -eq 0 ]]; then
        print_status "All dependencies satisfied!"
        return 0
    else
        print_warning "$issues issues found"
        
        if [[ ${#missing_packages[@]} -gt 0 ]]; then
            echo
            print_info "Missing packages: ${missing_packages[*]}"
            
            if [[ "$PKG_MANAGER" != "unknown" ]]; then
                echo
                print_info "Install command:"
                echo "  $PKG_INSTALL_CMD ${missing_packages[*]}"
            fi
        fi
        
        return 1
    fi
}

# Install missing dependencies
install_dependencies() {
    local packages=("$@")
    
    if [[ ${#packages[@]} -eq 0 ]]; then
        print_info "No packages to install"
        return 0
    fi
    
    if [[ "$PKG_MANAGER" == "unknown" ]]; then
        print_error "Unknown package manager - cannot auto-install"
        print_info "Please install manually: ${packages[*]}"
        return 1
    fi
    
    print_info "Installing packages: ${packages[*]}"
    
    case "$PKG_MANAGER" in
        "apt")
            sudo apt-get update
            sudo apt-get install -y "${packages[@]}"
            ;;
        "yum")
            sudo yum install -y "${packages[@]}"
            ;;
        "dnf")
            sudo dnf install -y "${packages[@]}"
            ;;
        "pacman")
            sudo pacman -S --needed "${packages[@]}"
            ;;
        "brew")
            brew install "${packages[@]}"
            ;;
        *)
            print_error "Unsupported package manager: $PKG_MANAGER"
            return 1
            ;;
    esac
    
    print_status "Package installation completed"
}

# Setup platform-specific configuration
setup_platform_config() {
    print_info "Setting up platform-specific configuration..."
    
    case "$PLATFORM" in
        "linux")
            # Load required kernel modules
            local modules=("bridge" "tun" "kvm")
            for module in "${modules[@]}"; do
                if ! lsmod | grep -q "^$module"; then
                    if [[ "$module" == "kvm" ]]; then
                        # Detect CPU type for KVM
                        if grep -q "vmx" /proc/cpuinfo; then
                            sudo modprobe kvm-intel 2>/dev/null || print_warning "Could not load kvm-intel"
                        elif grep -q "svm" /proc/cpuinfo; then
                            sudo modprobe kvm-amd 2>/dev/null || print_warning "Could not load kvm-amd"
                        fi
                    else
                        sudo modprobe "$module" 2>/dev/null || print_warning "Could not load $module"
                    fi
                fi
            done
            
            # Setup modules to load on boot
            local modules_file="/etc/modules-load.d/libremesh-dev.conf"
            if [[ ! -f "$modules_file" ]] && [[ -w /etc/modules-load.d/ ]] 2>/dev/null; then
                echo -e "bridge\\ntun" | sudo tee "$modules_file" >/dev/null
                print_status "Configured modules to load on boot"
            fi
            ;;
            
        "macos")
            print_info "macOS detected - QEMU may require additional setup"
            print_info "Consider using UTM for better macOS integration"
            ;;
            
        "windows")
            print_info "Windows detected - WSL2 recommended for QEMU development"
            ;;
    esac
}

# Generate installation script
generate_install_script() {
    local script_file="install-libremesh-deps.sh"
    
    cat > "$script_file" << 'EOF'
#!/usr/bin/env bash
# Generated LibreMesh dependencies installation script

set -e

# This script was generated by deps-manager.sh
# It contains the specific commands for your platform

EOF

    # Add platform-specific installation commands
    case "$PKG_MANAGER" in
        "apt")
            cat >> "$script_file" << 'EOF'
echo "Installing dependencies for Ubuntu/Debian..."
sudo apt-get update
sudo apt-get install -y qemu-system-x86 qemu-utils bridge-utils dnsmasq curl wget screen cpio tar gzip nodejs npm git

# Setup kernel modules
sudo modprobe bridge
sudo modprobe tun
if grep -q "vmx\|svm" /proc/cpuinfo; then
    sudo modprobe kvm-intel 2>/dev/null || sudo modprobe kvm-amd 2>/dev/null || true
fi

# Add user to kvm group
sudo usermod -a -G kvm "$USER"

echo "Dependencies installed! Please log out and back in for group changes to take effect."
EOF
            ;;
            
        "yum"|"dnf")
            cat >> "$script_file" << 'EOF'
echo "Installing dependencies for RedHat/CentOS/Fedora..."
if command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y qemu-kvm qemu-img bridge-utils dnsmasq curl wget screen cpio tar gzip nodejs npm git
else
    sudo yum install -y qemu-kvm qemu-img bridge-utils dnsmasq curl wget screen cpio tar gzip nodejs npm git
fi

# Setup kernel modules
sudo modprobe bridge
sudo modprobe tun
if grep -q "vmx\|svm" /proc/cpuinfo; then
    sudo modprobe kvm-intel 2>/dev/null || sudo modprobe kvm-amd 2>/dev/null || true
fi

# Add user to kvm group
sudo usermod -a -G kvm "$USER"

echo "Dependencies installed! Please log out and back in for group changes to take effect."
EOF
            ;;
            
        "pacman")
            cat >> "$script_file" << 'EOF'
echo "Installing dependencies for Arch Linux..."
sudo pacman -S --needed qemu bridge-utils dnsmasq curl wget screen cpio tar gzip nodejs npm git

# Setup kernel modules
sudo modprobe bridge
sudo modprobe tun
if grep -q "vmx\|svm" /proc/cpuinfo; then
    sudo modprobe kvm-intel 2>/dev/null || sudo modprobe kvm-amd 2>/dev/null || true
fi

# Add user to kvm group
sudo usermod -a -G kvm "$USER"

echo "Dependencies installed! Please log out and back in for group changes to take effect."
EOF
            ;;
            
        "brew")
            cat >> "$script_file" << 'EOF'
echo "Installing dependencies for macOS..."
brew install qemu bridge-utils dnsmasq curl wget screen cpio gtar gzip node npm git

echo "Dependencies installed!"
echo "Note: QEMU on macOS may require additional configuration for optimal performance."
EOF
            ;;
            
        *)
            cat >> "$script_file" << 'EOF'
echo "Unknown package manager - please install dependencies manually:"
echo "Required: qemu-system-x86_64, bridge-utils, dnsmasq, curl, wget, screen, cpio, tar, gzip, nodejs, npm, git"
EOF
            ;;
    esac
    
    chmod +x "$script_file"
    print_status "Generated installation script: $script_file"
}

# Main function
main() {
    echo "LibreMesh Development Dependencies Manager"
    echo "=========================================="
    
    detect_platform
    detect_package_manager
    
    case "${1:-check}" in
        "check")
            check_dependencies
            ;;
        "install")
            shift
            if [[ $# -eq 0 ]]; then
                print_error "No packages specified for installation"
                print_info "Usage: $0 install <package1> <package2> ..."
                exit 1
            fi
            install_dependencies "$@"
            ;;
        "setup")
            setup_platform_config
            ;;
        "generate")
            generate_install_script
            ;;
        "full")
            if ! check_dependencies; then
                print_info "Installing missing dependencies..."
                # This would need to extract missing packages from check_dependencies
                # For now, we'll generate a script
                generate_install_script
                print_info "Run ./install-libremesh-deps.sh to install dependencies"
            fi
            setup_platform_config
            ;;
        "help"|"--help"|"-h")
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  check      Check all dependencies (default)"
            echo "  install    Install specific packages"
            echo "  setup      Setup platform-specific configuration"
            echo "  generate   Generate installation script"
            echo "  full       Check, install, and setup everything"
            echo "  help       Show this help"
            ;;
        *)
            print_error "Unknown command: $1"
            print_info "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

main "$@"