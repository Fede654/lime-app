#!/bin/bash

# LiMeApp Development Setup Verification Script
# Comprehensive check for all development prerequisites

set -e

echo "🔍 LiMeApp Development Setup Verification"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track verification status
ERRORS=0
WARNINGS=0

# Helper functions
check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        return 1
    fi
}

check_version() {
    local cmd="$1"
    local min_version="$2"
    local current_version="$3"
    
    if command -v "$cmd" >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $cmd is installed ($current_version)"
        # Note: Version comparison would need more sophisticated logic
        return 0
    else
        echo -e "${RED}✗${NC} $cmd is not installed"
        return 1
    fi
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

error() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Check Node.js and npm
echo -e "\n${BLUE}Node.js Environment${NC}"
echo "-------------------"

if check_command "node"; then
    NODE_VERSION=$(node --version)
    echo "  Version: $NODE_VERSION"
    
    # Extract major version number
    MAJOR_VERSION=$(echo "$NODE_VERSION" | sed 's/v\([0-9]*\).*/\1/')
    if [ "$MAJOR_VERSION" -lt 20 ]; then
        warning "Node.js version $NODE_VERSION detected. Recommended: v20 or later"
    fi
else
    error "Node.js is required for development"
fi

if check_command "npm"; then
    NPM_VERSION=$(npm --version)
    echo "  Version: $NPM_VERSION"
else
    error "npm is required for package management"
fi

# Check Git
echo -e "\n${BLUE}Version Control${NC}"
echo "---------------"

if check_command "git"; then
    GIT_VERSION=$(git --version)
    echo "  $GIT_VERSION"
else
    error "Git is required for version control"
fi

# Check project dependencies
echo -e "\n${BLUE}Project Dependencies${NC}"
echo "--------------------"

if [ -f "package.json" ]; then
    success "package.json found"
    
    if [ -d "node_modules" ]; then
        success "node_modules directory exists"
        
        # Check if dependencies are up to date
        if npm outdated --silent; then
            success "All dependencies are up to date"
        else
            warning "Some dependencies may need updating. Run 'npm outdated' for details"
        fi
    else
        warning "node_modules not found. Run 'npm install' to install dependencies"
    fi
else
    error "package.json not found. Are you in the lime-app directory?"
fi

# Check QEMU (for full development environment)
echo -e "\n${BLUE}QEMU Environment (Optional)${NC}"
echo "---------------------------"

if check_command "qemu-system-x86_64"; then
    QEMU_VERSION=$(qemu-system-x86_64 --version | head -n1)
    echo "  $QEMU_VERSION"
else
    warning "QEMU not found. Install with: sudo apt install qemu-system-x86"
    warning "Full LibreMesh development requires QEMU"
fi

if check_command "screen"; then
    success "screen is available for QEMU console access"
else
    warning "screen not found. Install with: sudo apt install screen"
fi

# Check lime-packages repository (for QEMU development)
echo -e "\n${BLUE}LibreMesh Development Environment${NC}"
echo "---------------------------------"

if [ -d "../lime-packages" ]; then
    success "lime-packages repository found"
    
    if [ -f "../lime-packages/tools/qemu_dev_start" ]; then
        success "QEMU development script available"
    else
        warning "QEMU development script not found in lime-packages"
    fi
    
    # Check for LibreMesh images
    if [ -d "../lime-packages/build" ]; then
        if ls ../lime-packages/build/*.tar.gz >/dev/null 2>&1; then
            success "LibreMesh images found in build directory"
        else
            warning "No LibreMesh images found. See DEVELOPMENT_SETUP.md for download instructions"
        fi
    else
        warning "lime-packages/build directory not found"
    fi
else
    warning "lime-packages repository not found. Clone from: https://github.com/libremesh/lime-packages.git"
fi

# Check development tools
echo -e "\n${BLUE}Development Tools${NC}"
echo "-----------------"

# Check TypeScript
if check_command "tsc"; then
    TSC_VERSION=$(tsc --version)
    echo "  $TSC_VERSION"
else
    warning "TypeScript compiler not found globally. Using project dependency"
fi

# Check if build works
echo -e "\n${BLUE}Build Verification${NC}"
echo "------------------"

if [ -f "package.json" ] && [ -d "node_modules" ]; then
    echo "Testing development build..."
    if npm run build >/dev/null 2>&1; then
        success "Development build successful"
        
        if [ -d "build" ]; then
            success "Build output directory created"
        fi
    else
        error "Development build failed. Check dependencies and code"
    fi
else
    warning "Skipping build test - dependencies not installed"
fi

# Platform-specific checks
echo -e "\n${BLUE}Platform Information${NC}"
echo "--------------------"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Platform: Linux"
    success "Primary development platform"
    
    # Check for sudo access (needed for QEMU networking)
    if sudo -n true 2>/dev/null; then
        success "sudo access available (required for QEMU networking)"
    else
        warning "sudo access may be required for QEMU networking setup"
    fi
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Platform: macOS"
    success "Supported development platform"
    
    if check_command "brew"; then
        success "Homebrew available for package management"
    else
        warning "Consider installing Homebrew for easier package management"
    fi
    
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo "Platform: Windows"
    warning "For full development, consider using WSL2 for LibreMesh integration"
    
    # Check for WSL
    if grep -qi microsoft /proc/version 2>/dev/null; then
        success "Running in WSL - good for full development"
    else
        warning "Native Windows - frontend-only development recommended"
    fi
fi

# AI Tools Check (optional)
echo -e "\n${BLUE}AI Development Tools (Optional)${NC}"
echo "-------------------------------"

# Check for common AI development setups
if [ -f ".claude-config.yml" ]; then
    success "Claude Code configuration found"
else
    warning "Claude Code configuration not found (.claude-config.yml)"
fi

if [ -f ".cursor/settings.json" ]; then
    success "Cursor IDE configuration found"
else
    warning "Cursor IDE configuration not found (.cursor/settings.json)"
fi

if [ -f ".vscode/settings.json" ]; then
    success "VS Code configuration found"
else
    warning "VS Code configuration not found (.vscode/settings.json)"
fi

# Network connectivity check
echo -e "\n${BLUE}Network Connectivity${NC}"
echo "--------------------"

if ping -c 1 github.com >/dev/null 2>&1; then
    success "Internet connectivity available"
else
    warning "Internet connectivity issues detected"
fi

# Summary
echo -e "\n${BLUE}Verification Summary${NC}"
echo "===================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Perfect setup! Ready for LiMeApp development${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Setup mostly complete with $WARNINGS warnings${NC}"
    echo "Consider addressing warnings for optimal development experience"
    exit 0
else
    echo -e "${RED}❌ Setup incomplete: $ERRORS errors, $WARNINGS warnings${NC}"
    echo "Please address errors before starting development"
    exit 1
fi