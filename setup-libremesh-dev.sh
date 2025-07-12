#!/usr/bin/env bash
#
# LibreMesh Development Environment Setup
# One-script setup for new developers to get started with LibreMesh QEMU development
#
# Usage: ./setup-libremesh-dev.sh [--auto] [--config=libremesh|librerouteros]
#

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LIME_BUILD_DIR="$(dirname "$SCRIPT_DIR")"
LIME_PACKAGES_DIR="$LIME_BUILD_DIR/lime-packages"

# Colors and formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Icons for better UX
ICON_SUCCESS="✅"
ICON_WARNING="⚠️"
ICON_ERROR="❌"
ICON_INFO="ℹ️"
ICON_ROCKET="🚀"
ICON_GEAR="⚙️"
ICON_DOWNLOAD="📥"
ICON_CHECK="🔍"

print_header() {
    echo -e "${CYAN}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                     LibreMesh Development Environment Setup                  ║"
    echo "║                                                                              ║"
    echo "║              ${ICON_ROCKET} One-script setup for QEMU development ${ICON_ROCKET}                      ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_status() {
    echo -e "${GREEN}${ICON_SUCCESS} $1${NC}"
}

print_info() {
    echo -e "${BLUE}${ICON_INFO} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}${ICON_WARNING} $1${NC}"
}

print_error() {
    echo -e "${RED}${ICON_ERROR} $1${NC}"
}

print_step() {
    echo -e "${PURPLE}${ICON_GEAR} $1${NC}"
}

print_section() {
    echo -e "\n${CYAN}${BOLD}$1${NC}"
    echo -e "${CYAN}$(printf '=%.0s' {1..60})${NC}"
}

# Progress tracking
declare -a SETUP_STEPS=(
    "System Requirements Check"
    "Dependency Installation"
    "Image Configuration"
    "QEMU Environment Setup"
    "Network Configuration"
    "Development Tools Setup"
    "Environment Verification"
)

current_step=0
total_steps=${#SETUP_STEPS[@]}

show_progress() {
    local step_name="$1"
    ((current_step++))
    echo -e "\n${BOLD}${CYAN}[${current_step}/${total_steps}] ${step_name}${NC}"
    echo -e "${CYAN}$(printf '─%.0s' {1..60})${NC}"
}

# Configuration options
AUTO_MODE=false
SELECTED_CONFIG=""
SKIP_DEPS=false
VERBOSE=false

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --auto)
                AUTO_MODE=true
                shift
                ;;
            --config=*)
                SELECTED_CONFIG="${1#*=}"
                shift
                ;;
            --skip-deps)
                SKIP_DEPS=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                set -x
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

show_help() {
    echo "LibreMesh Development Environment Setup"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --auto              Run in automatic mode (no prompts)"
    echo "  --config=TYPE       Pre-select configuration (libremesh|librerouteros)"
    echo "  --skip-deps         Skip dependency installation"
    echo "  --verbose           Enable verbose output"
    echo "  --help, -h          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Interactive setup"
    echo "  $0 --auto                             # Automatic setup with defaults"
    echo "  $0 --config=libremesh --auto          # Auto setup with LibreMesh"
    echo "  $0 --config=librerouteros             # Setup for LibreRouterOS development"
}

# System requirements check
check_system_requirements() {
    show_progress "System Requirements Check"
    
    local issues=0
    
    # Check Linux distribution
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_status "Running on Linux - compatible"
        
        # Detect distribution
        if [ -f /etc/os-release ]; then
            source /etc/os-release
            print_info "Distribution: $PRETTY_NAME"
        fi
    else
        print_warning "Not running on Linux. QEMU development works best on Linux."
        ((issues++))
    fi
    
    # Check architecture
    ARCH=$(uname -m)
    if [[ "$ARCH" == "x86_64" ]]; then
        print_status "Architecture: x86_64 - compatible"
    else
        print_warning "Architecture: $ARCH - may have compatibility issues"
        ((issues++))
    fi
    
    # Check available memory
    if command -v free >/dev/null 2>&1; then
        TOTAL_MEM=$(free -m | awk '/^Mem:/{print $2}')
        if [[ $TOTAL_MEM -gt 2048 ]]; then
            print_status "Memory: ${TOTAL_MEM}MB - sufficient"
        else
            print_warning "Memory: ${TOTAL_MEM}MB - QEMU may be slow with less than 4GB"
            ((issues++))
        fi
    fi
    
    # Check disk space
    AVAILABLE_SPACE=$(df -BM "$PWD" | awk 'NR==2 {print $4}' | sed 's/M//')
    if [[ $AVAILABLE_SPACE -gt 5000 ]]; then
        print_status "Disk space: ${AVAILABLE_SPACE}MB - sufficient"
    else
        print_warning "Disk space: ${AVAILABLE_SPACE}MB - need at least 5GB for builds"
        ((issues++))
    fi
    
    # Check KVM support
    if [ -r /dev/kvm ]; then
        print_status "KVM acceleration available - QEMU will be fast"
    else
        print_warning "KVM not available - QEMU will be slower"
        print_info "To enable KVM: sudo modprobe kvm-intel (or kvm-amd)"
        ((issues++))
    fi
    
    if [[ $issues -eq 0 ]]; then
        print_status "All system requirements met!"
    else
        print_warning "$issues potential issues detected - continuing anyway"
        if [[ "$AUTO_MODE" == "false" ]]; then
            echo
            read -p "Continue anyway? [Y/n] " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Nn]$ ]]; then
                exit 1
            fi
        fi
    fi
}

# Dependency installation
install_dependencies() {
    show_progress "Dependency Installation"
    
    if [[ "$SKIP_DEPS" == "true" ]]; then
        print_info "Skipping dependency installation as requested"
        return 0
    fi
    
    print_step "Checking required packages..."
    
    local missing_packages=()
    local packages_to_check=(
        "qemu-system-x86"
        "qemu-utils"
        "bridge-utils"
        "dnsmasq"
        "curl"
        "wget"
        "screen"
        "cpio"
        "tar"
        "gzip"
    )
    
    # Check which packages are missing
    for package in "${packages_to_check[@]}"; do
        if ! command -v "$package" >/dev/null 2>&1; then
            # Handle package name variations
            case "$package" in
                "qemu-system-x86")
                    if ! command -v "qemu-system-x86_64" >/dev/null 2>&1; then
                        missing_packages+=("qemu-system-x86")
                    fi
                    ;;
                *)
                    missing_packages+=("$package")
                    ;;
            esac
        fi
    done
    
    if [[ ${#missing_packages[@]} -eq 0 ]]; then
        print_status "All required packages are installed"
        return 0
    fi
    
    print_warning "Missing packages: ${missing_packages[*]}"
    
    # Detect package manager and install
    if command -v apt-get >/dev/null 2>&1; then
        print_step "Installing packages with apt-get..."
        local apt_packages=(
            "qemu-system-x86"
            "qemu-utils"
            "bridge-utils"
            "dnsmasq"
            "curl"
            "wget"
            "screen"
            "cpio"
            "tar"
            "gzip"
        )
        
        if [[ "$AUTO_MODE" == "false" ]]; then
            echo
            read -p "Install missing packages with apt-get? [Y/n] " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Nn]$ ]]; then
                print_warning "Skipping package installation - you may need to install manually"
                return 0
            fi
        fi
        
        sudo apt-get update && sudo apt-get install -y "${apt_packages[@]}"
        
    elif command -v yum >/dev/null 2>&1; then
        print_step "Installing packages with yum..."
        local yum_packages=(
            "qemu-system-x86"
            "qemu-img"
            "bridge-utils"
            "dnsmasq"
            "curl"
            "wget"
            "screen"
            "cpio"
            "tar"
            "gzip"
        )
        
        if [[ "$AUTO_MODE" == "false" ]]; then
            echo
            read -p "Install missing packages with yum? [Y/n] " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Nn]$ ]]; then
                print_warning "Skipping package installation - you may need to install manually"
                return 0
            fi
        fi
        
        sudo yum install -y "${yum_packages[@]}"
        
    elif command -v pacman >/dev/null 2>&1; then
        print_step "Installing packages with pacman..."
        local pacman_packages=(
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
        
        if [[ "$AUTO_MODE" == "false" ]]; then
            echo
            read -p "Install missing packages with pacman? [Y/n] " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Nn]$ ]]; then
                print_warning "Skipping package installation - you may need to install manually"
                return 0
            fi
        fi
        
        sudo pacman -S --needed "${pacman_packages[@]}"
        
    else
        print_warning "Unknown package manager - please install packages manually:"
        echo "Required: qemu-system-x86_64, bridge-utils, dnsmasq, curl, wget, screen, cpio, tar, gzip"
        
        if [[ "$AUTO_MODE" == "false" ]]; then
            echo
            read -p "Continue assuming packages are installed? [Y/n] " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Nn]$ ]]; then
                exit 1
            fi
        fi
    fi
    
    print_status "Dependency installation completed"
}

# Configuration selection
select_configuration() {
    show_progress "Image Configuration"
    
    # Check available images
    local available_configs=()
    
    if [ -f "$LIME_PACKAGES_DIR/build/libremesh-2024.1-ow23.05.5-default-x86-64-generic-squashfs-rootfs.img.gz" ] && \
       [ -f "$LIME_PACKAGES_DIR/build/libremesh-2024.1-ow23.05.5-default-x86-64-generic-initramfs-kernel.bin" ]; then
        available_configs+=("libremesh")
        print_status "LibreMesh 23.05.5 images found"
    fi
    
    if [ -f "$LIME_PACKAGES_DIR/build/librerouteros-24.10.1-r28597-0425664679-x86-64-rootfs.tar.gz" ] && \
       [ -f "$LIME_PACKAGES_DIR/build/librerouteros-24.10.1-r28597-0425664679-x86-64-generic-kernel.bin" ]; then
        available_configs+=("librerouteros")
        print_status "LibreRouterOS 24.10.1 images found"
    fi
    
    if [[ ${#available_configs[@]} -eq 0 ]]; then
        print_error "No compatible images found in $LIME_PACKAGES_DIR/build/"
        print_info "Please ensure you have LibreMesh or LibreRouterOS images available"
        print_info "Run './build-libremesh.sh' or download images first"
        exit 1
    fi
    
    # Use pre-selected configuration if provided
    if [[ -n "$SELECTED_CONFIG" ]]; then
        if [[ " ${available_configs[@]} " =~ " $SELECTED_CONFIG " ]]; then
            CHOSEN_CONFIG="$SELECTED_CONFIG"
            print_info "Using pre-selected configuration: $CHOSEN_CONFIG"
            return 0
        else
            print_error "Selected configuration '$SELECTED_CONFIG' not available"
            print_info "Available: ${available_configs[*]}"
            exit 1
        fi
    fi
    
    # Interactive selection
    if [[ "$AUTO_MODE" == "true" ]]; then
        # Auto-select preferred configuration
        if [[ " ${available_configs[@]} " =~ " libremesh " ]]; then
            CHOSEN_CONFIG="libremesh"
            print_info "Auto-selected: LibreMesh (stable)"
        else
            CHOSEN_CONFIG="librerouteros"
            print_info "Auto-selected: LibreRouterOS (development)"
        fi
    else
        echo
        echo -e "${BOLD}Available configurations:${NC}"
        echo
        
        local i=1
        for config in "${available_configs[@]}"; do
            case "$config" in
                "libremesh")
                    echo -e "  ${GREEN}$i) LibreMesh 23.05.5${NC} - Stable, mesh networking, recommended for new developers"
                    ;;
                "librerouteros")
                    echo -e "  ${BLUE}$i) LibreRouterOS 24.10.1${NC} - Latest features, development build"
                    ;;
            esac
            ((i++))
        done
        
        echo
        read -p "Select configuration [1-${#available_configs[@]}]: " choice
        
        if [[ "$choice" =~ ^[0-9]+$ ]] && [[ $choice -ge 1 ]] && [[ $choice -le ${#available_configs[@]} ]]; then
            CHOSEN_CONFIG="${available_configs[$((choice-1))]}"
        else
            print_error "Invalid selection"
            exit 1
        fi
    fi
    
    print_status "Selected configuration: $CHOSEN_CONFIG"
    
    # Set environment variable for npm scripts
    export QEMU_IMAGE_CONFIG
    case "$CHOSEN_CONFIG" in
        "libremesh")
            QEMU_IMAGE_CONFIG="libremesh-2305"
            ;;
        "librerouteros")
            QEMU_IMAGE_CONFIG="librerouteros-2410"
            ;;
    esac
}

# QEMU environment setup
setup_qemu_environment() {
    show_progress "QEMU Environment Setup"
    
    print_step "Setting up QEMU permissions and groups..."
    
    # Add user to kvm group if KVM is available
    if [ -c /dev/kvm ]; then
        if groups | grep -q kvm; then
            print_status "User already in 'kvm' group"
        else
            print_step "Adding user to 'kvm' group for hardware acceleration..."
            sudo usermod -a -G kvm "$USER"
            print_warning "You may need to log out and back in for group changes to take effect"
        fi
    fi
    
    # Setup sudoers for QEMU operations (optional)
    local sudoers_file="/etc/sudoers.d/libremesh-dev"
    if [[ ! -f "$sudoers_file" ]]; then
        if [[ "$AUTO_MODE" == "false" ]]; then
            echo
            read -p "Add sudo rules for QEMU operations (recommended)? [Y/n] " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Nn]$ ]]; then
                print_step "Creating sudoers rules for QEMU operations..."
                cat << EOF | sudo tee "$sudoers_file" > /dev/null
# LibreMesh development environment
%$USER ALL=(ALL) NOPASSWD: /usr/bin/screen
%$USER ALL=(ALL) NOPASSWD: /usr/bin/qemu-system-x86_64
%$USER ALL=(ALL) NOPASSWD: /sbin/ip
%$USER ALL=(ALL) NOPASSWD: /sbin/brctl
%$USER ALL=(ALL) NOPASSWD: /usr/bin/dnsmasq
EOF
                print_status "Sudoers rules created"
            fi
        fi
    else
        print_status "Sudoers rules already exist"
    fi
    
    print_status "QEMU environment setup completed"
}

# Network configuration
setup_network() {
    show_progress "Network Configuration"
    
    print_step "Configuring network for QEMU development..."
    
    # Check if bridge module is loaded
    if ! lsmod | grep -q bridge; then
        print_step "Loading bridge kernel module..."
        sudo modprobe bridge
    fi
    
    # Check if tun module is loaded
    if ! lsmod | grep -q tun; then
        print_step "Loading tun kernel module..."
        sudo modprobe tun
    fi
    
    # Ensure modules load on boot
    local modules_file="/etc/modules-load.d/libremesh-dev.conf"
    if [[ ! -f "$modules_file" ]]; then
        print_step "Ensuring network modules load on boot..."
        echo -e "bridge\\ntun" | sudo tee "$modules_file" > /dev/null
    fi
    
    print_status "Network configuration completed"
}

# Development tools setup
setup_dev_tools() {
    show_progress "Development Tools Setup"
    
    print_step "Setting up lime-app development tools..."
    
    # Check if we're in the right directory
    if [[ ! -f "$SCRIPT_DIR/package.json" ]]; then
        print_error "package.json not found - are we in the lime-app directory?"
        exit 1
    fi
    
    # Install Node.js dependencies if needed
    if [[ ! -d "$SCRIPT_DIR/node_modules" ]]; then
        if command -v npm >/dev/null 2>&1; then
            print_step "Installing Node.js dependencies..."
            cd "$SCRIPT_DIR"
            npm install
        else
            print_warning "npm not found - you'll need to install Node.js dependencies manually"
        fi
    else
        print_status "Node.js dependencies already installed"
    fi
    
    # Make scripts executable
    print_step "Making scripts executable..."
    chmod +x scripts/*.sh 2>/dev/null || true
    chmod +x "$LIME_PACKAGES_DIR/tools/"* 2>/dev/null || true
    
    print_status "Development tools setup completed"
}

# Environment verification
verify_environment() {
    show_progress "Environment Verification"
    
    print_step "Running comprehensive environment checks..."
    
    local issues=0
    
    # Test QEMU
    if command -v qemu-system-x86_64 >/dev/null 2>&1; then
        print_status "QEMU available"
        QEMU_VERSION=$(qemu-system-x86_64 --version | head -1)
        print_info "Version: $QEMU_VERSION"
    else
        print_error "QEMU not found"
        ((issues++))
    fi
    
    # Test bridge utilities
    if command -v brctl >/dev/null 2>&1 || command -v ip >/dev/null 2>&1; then
        print_status "Bridge utilities available"
    else
        print_error "Bridge utilities not found"
        ((issues++))
    fi
    
    # Test screen
    if command -v screen >/dev/null 2>&1; then
        print_status "Screen available"
    else
        print_error "Screen not found"
        ((issues++))
    fi
    
    # Test npm scripts
    if [[ -f "$SCRIPT_DIR/package.json" ]]; then
        print_step "Testing npm scripts..."
        cd "$SCRIPT_DIR"
        
        if npm run qemu:configs >/dev/null 2>&1; then
            print_status "npm scripts working"
        else
            print_warning "npm scripts may have issues"
            ((issues++))
        fi
    fi
    
    # Test image availability
    print_step "Verifying image configuration..."
    cd "$SCRIPT_DIR"
    if npm run qemu:configs | grep -q "Available QEMU Image Configurations"; then
        print_status "Image configurations available"
    else
        print_error "No image configurations found"
        ((issues++))
    fi
    
    if [[ $issues -eq 0 ]]; then
        print_status "All verification checks passed!"
        return 0
    else
        print_warning "$issues issues detected"
        return 1
    fi
}

# Quick start test
run_quick_test() {
    show_progress "Quick Start Test"
    
    print_step "Running a quick test to verify everything works..."
    
    cd "$SCRIPT_DIR"
    
    # Show available configurations
    print_info "Available configurations:"
    npm run qemu:configs
    
    if [[ "$AUTO_MODE" == "false" ]]; then
        echo
        read -p "Run a quick QEMU test? This will start and stop QEMU briefly. [Y/n] " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Nn]$ ]]; then
            print_info "Skipping quick test"
            return 0
        fi
    fi
    
    print_step "Starting QEMU test (will auto-stop in 30 seconds)..."
    
    # Start QEMU in background
    case "$CHOSEN_CONFIG" in
        "libremesh")
            npm run qemu:start:libremesh &
            ;;
        "librerouteros")
            npm run qemu:start:librerouteros &
            ;;
    esac
    
    local qemu_pid=$!
    
    # Wait for QEMU to start
    sleep 10
    
    # Test if QEMU process is running
    if pgrep -f "qemu-system-x86_64" >/dev/null; then
        print_status "QEMU started successfully!"
        
        # Wait a bit more for boot
        sleep 15
        
        # Test network connectivity
        if ping -c 1 -W 3 10.13.0.1 >/dev/null 2>&1; then
            print_status "Network connectivity working!"
            
            # Test web interface
            if curl -s --max-time 3 "http://10.13.0.1/" >/dev/null 2>&1; then
                print_status "Web interface accessible!"
            else
                print_warning "Web interface not yet ready (normal during boot)"
            fi
        else
            print_warning "Network not yet ready (normal during boot)"
        fi
        
        # Stop QEMU
        print_step "Stopping QEMU test..."
        npm run qemu:stop >/dev/null 2>&1 || true
        
        # Wait for clean shutdown
        sleep 5
        
        print_status "Quick test completed successfully!"
    else
        print_error "QEMU failed to start"
        kill $qemu_pid 2>/dev/null || true
        return 1
    fi
}

# Final instructions
show_final_instructions() {
    clear
    print_header
    
    echo -e "${GREEN}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                          🎉 SETUP COMPLETED! 🎉                             ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "${BOLD}Your LibreMesh development environment is ready!${NC}"
    echo
    
    echo -e "${CYAN}${BOLD}Quick Start Commands:${NC}"
    echo -e "${GREEN}  npm run qemu:start${NC}          # Start QEMU (auto-detects best config)"
    echo -e "${GREEN}  npm run qemu:status${NC}         # Check QEMU status"
    echo -e "${GREEN}  npm run deploy:qemu${NC}         # Deploy lime-app changes"
    echo -e "${GREEN}  npm run qemu:stop${NC}           # Stop QEMU"
    echo
    
    echo -e "${CYAN}${BOLD}Specific Configurations:${NC}"
    case "$CHOSEN_CONFIG" in
        "libremesh")
            echo -e "${GREEN}  npm run qemu:start:libremesh${NC}   # Start LibreMesh (stable)"
            echo -e "  Access: ${BLUE}http://10.13.0.1/${NC} (main interface)"
            echo -e "  lime-app: ${BLUE}http://10.13.0.1/app/${NC}"
            ;;
        "librerouteros")
            echo -e "${GREEN}  npm run qemu:start:librerouteros${NC} # Start LibreRouterOS (development)"
            echo -e "  Access: ${BLUE}http://10.13.0.1/${NC} (main interface)"
            echo -e "  lime-app: ${BLUE}http://10.13.0.1/app/${NC}"
            ;;
    esac
    echo
    
    echo -e "${CYAN}${BOLD}Development Workflow:${NC}"
    echo -e "  1. ${YELLOW}npm run qemu:start${NC}        # Start development environment"
    echo -e "  2. ${YELLOW}Edit code in src/...${NC}      # Make your changes"
    echo -e "  3. ${YELLOW}npm run deploy:qemu${NC}       # Deploy changes to QEMU"
    echo -e "  4. ${YELLOW}Test at http://10.13.0.1/app/${NC} # Verify your changes"
    echo -e "  5. ${YELLOW}npm run qemu:stop${NC}         # Stop when done"
    echo
    
    echo -e "${CYAN}${BOLD}Console Access:${NC}"
    echo -e "  ${GREEN}sudo screen -r libremesh${NC}     # Access QEMU console"
    echo -e "  ${GREEN}Ctrl+A, D${NC}                    # Detach from console"
    echo
    
    echo -e "${CYAN}${BOLD}Configuration Details:${NC}"
    echo -e "  Selected: ${YELLOW}$CHOSEN_CONFIG${NC}"
    echo -e "  Network IP: ${YELLOW}10.13.0.1${NC}"
    echo -e "  Credentials: ${YELLOW}root/admin${NC}"
    echo
    
    echo -e "${CYAN}${BOLD}Getting Help:${NC}"
    echo -e "  ${GREEN}npm run qemu:configs${NC}         # Show all available configurations"
    echo -e "  ${GREEN}./setup-libremesh-dev.sh --help${NC} # Show setup script help"
    echo -e "  ${GREEN}cat README-QEMU-CONFIGURATIONS.md${NC} # Detailed documentation"
    echo
    
    echo -e "${PURPLE}${BOLD}Next Steps:${NC}"
    echo -e "  1. Start development: ${GREEN}npm run qemu:start${NC}"
    echo -e "  2. Open your browser: ${BLUE}http://10.13.0.1/app/${NC}"
    echo -e "  3. Start coding and have fun! ${ICON_ROCKET}"
    echo
    
    if [[ "$AUTO_MODE" == "false" ]]; then
        echo -e "${BOLD}Press any key to continue...${NC}"
        read -n 1 -s
    fi
}

# Main execution
main() {
    parse_args "$@"
    
    # Show header
    print_header
    
    # Welcome message
    echo -e "${BOLD}Welcome to the LibreMesh Development Environment Setup!${NC}"
    echo
    echo "This script will configure everything you need for LibreMesh development"
    echo "with QEMU virtualization support."
    echo
    
    if [[ "$AUTO_MODE" == "false" ]]; then
        echo -e "${BOLD}Press any key to start setup...${NC}"
        read -n 1 -s
        echo
    fi
    
    # Run setup steps
    check_system_requirements
    install_dependencies
    select_configuration
    setup_qemu_environment
    setup_network
    setup_dev_tools
    
    # Verification
    if verify_environment; then
        echo
        if [[ "$AUTO_MODE" == "false" ]]; then
            read -p "Run quick test to verify everything works? [Y/n] " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Nn]$ ]]; then
                run_quick_test
            fi
        else
            print_info "Skipping quick test in auto mode"
        fi
        
        show_final_instructions
    else
        print_error "Setup completed with issues - please review and fix manually"
        exit 1
    fi
    
    print_status "LibreMesh development environment setup completed successfully!"
}

# Run main function with all arguments
main "$@"