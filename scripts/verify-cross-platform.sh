#!/bin/bash

# Cross-Platform Development Verification Script
# Checks compatibility across Windows, Linux, and macOS

set -e

echo "🌍 Cross-Platform Development Verification"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Detect platform
echo -e "\n${BLUE}Platform Detection${NC}"
echo "------------------"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLATFORM="Linux"
    DISTRO=$(lsb_release -d 2>/dev/null | cut -f2 || echo "Unknown")
    success "Platform: Linux ($DISTRO)"
    PRIMARY_PLATFORM=true
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macOS"
    VERSION=$(sw_vers -productVersion 2>/dev/null || echo "Unknown")
    success "Platform: macOS ($VERSION)"
    PRIMARY_PLATFORM=true
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    PLATFORM="Windows"
    if grep -qi microsoft /proc/version 2>/dev/null; then
        WSL_VERSION=$(grep -i microsoft /proc/version | grep -o "WSL[0-9]*" || echo "WSL")
        success "Platform: Windows ($WSL_VERSION)"
        PRIMARY_PLATFORM=true
    else
        warning "Platform: Windows (Native)"
        info "Consider using WSL2 for full LibreMesh development"
        PRIMARY_PLATFORM=false
    fi
else
    warning "Platform: Unknown ($OSTYPE)"
    PRIMARY_PLATFORM=false
fi

# Check Git configuration for cross-platform compatibility
echo -e "\n${BLUE}Git Configuration${NC}"
echo "------------------"

# Check line ending configuration
AUTOCRLF=$(git config core.autocrlf 2>/dev/null || echo "not set")
EOL=$(git config core.eol 2>/dev/null || echo "not set")
FILEMODE=$(git config core.filemode 2>/dev/null || echo "not set")

if [ "$AUTOCRLF" = "false" ]; then
    success "core.autocrlf is correctly set to false"
else
    warning "core.autocrlf is '$AUTOCRLF' - should be 'false' for cross-platform compatibility"
    info "Fix with: git config --global core.autocrlf false"
fi

if [ "$EOL" = "lf" ]; then
    success "core.eol is correctly set to lf"
else
    warning "core.eol is '$EOL' - should be 'lf' for cross-platform compatibility"
    info "Fix with: git config --global core.eol lf"
fi

if [ "$FILEMODE" = "false" ]; then
    success "core.filemode is correctly set to false"
else
    warning "core.filemode is '$FILEMODE' - consider setting to 'false' for Windows compatibility"
    info "Fix with: git config --global core.filemode false"
fi

# Check for cross-platform dependencies
echo -e "\n${BLUE}Cross-Platform Dependencies${NC}"
echo "---------------------------"

# Check for cross-env (needed for Windows npm scripts)
if [ -f "package.json" ]; then
    if grep -q '"cross-env"' package.json; then
        success "cross-env dependency found for cross-platform npm scripts"
    else
        warning "cross-env not found - needed for Windows npm script compatibility"
        info "Install with: npm install --save-dev cross-env"
    fi
    
    # Check npm scripts for cross-platform compatibility
    if grep -q 'NODE_ENV=' package.json; then
        if grep -q 'cross-env NODE_ENV=' package.json; then
            success "npm scripts use cross-env for environment variables"
        else
            warning "npm scripts set NODE_ENV without cross-env - may fail on Windows"
            info "Prefix with cross-env: 'cross-env NODE_ENV=development npm start'"
        fi
    fi
fi

# Check file path handling
echo -e "\n${BLUE}File Path Compatibility${NC}"
echo "-----------------------"

# Check for hardcoded path separators in code
HARDCODED_PATHS=$(find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | \
    xargs grep -l '["'"'"'][^"'"'"']*[/\\][^"'"'"']*["'"'"']' 2>/dev/null | wc -l)

if [ "$HARDCODED_PATHS" -eq 0 ]; then
    success "No hardcoded file paths found"
else
    warning "$HARDCODED_PATHS files may contain hardcoded paths"
    info "Use path.join() for cross-platform path handling"
fi

# Check for use of path module
PATH_MODULE_USAGE=$(find . -name "*.js" -o -name "*.ts" | \
    xargs grep -l "require.*path\|import.*path" 2>/dev/null | wc -l)

if [ "$PATH_MODULE_USAGE" -gt 0 ]; then
    success "Node.js path module used in $PATH_MODULE_USAGE files"
else
    info "Consider using Node.js path module for file operations"
fi

# Check script execution permissions
echo -e "\n${BLUE}Script Compatibility${NC}"
echo "--------------------"

# Check if scripts have proper shebangs
SCRIPT_COUNT=0
MISSING_SHEBANG=0

if [ -d "scripts" ]; then
    for script in scripts/*.sh; do
        if [ -f "$script" ]; then
            ((SCRIPT_COUNT++))
            if ! head -n 1 "$script" | grep -q '^#!/'; then
                ((MISSING_SHEBANG++))
            fi
        fi
    done
    
    if [ $SCRIPT_COUNT -gt 0 ]; then
        if [ $MISSING_SHEBANG -eq 0 ]; then
            success "All $SCRIPT_COUNT shell scripts have proper shebangs"
        else
            warning "$MISSING_SHEBANG of $SCRIPT_COUNT scripts missing shebangs"
            info "Add #!/bin/bash to the top of shell scripts"
        fi
        
        # Check script permissions on Unix-like systems
        if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "darwin"* ]]; then
            NON_EXECUTABLE=$(find scripts -name "*.sh" ! -executable | wc -l)
            if [ $NON_EXECUTABLE -eq 0 ]; then
                success "All shell scripts are executable"
            else
                warning "$NON_EXECUTABLE shell scripts are not executable"
                info "Fix with: chmod +x scripts/*.sh"
            fi
        fi
    fi
fi

# Check package.json script compatibility
echo -e "\n${BLUE}Package.json Script Compatibility${NC}"
echo "---------------------------------"

if [ -f "package.json" ]; then
    # Check for platform-specific commands
    PLATFORM_SPECIFIC=$(grep -E '"[^"]*": ".*(\bclear\b|\brm -rf\b|\bmkdir -p\b|\bcp -r\b)"' package.json | wc -l)
    
    if [ $PLATFORM_SPECIFIC -eq 0 ]; then
        success "No platform-specific commands found in npm scripts"
    else
        warning "$PLATFORM_SPECIFIC potentially platform-specific commands in npm scripts"
        info "Consider using cross-platform alternatives (rimraf, mkdirp, etc.)"
    fi
    
    # Check for shell operators
    SHELL_OPERATORS=$(grep -E '"[^"]*": ".*(\s&&\s|\s\|\|\s|\s;\s)"' package.json | wc -l)
    
    if [ $SHELL_OPERATORS -gt 0 ]; then
        info "$SHELL_OPERATORS npm scripts use shell operators (should work cross-platform)"
    fi
fi

# Check Node.js and npm versions
echo -e "\n${BLUE}Runtime Environment${NC}"
echo "-------------------"

if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    success "Node.js version: $NODE_VERSION"
    
    # Check if version is compatible
    MAJOR_VERSION=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
    if [ "$MAJOR_VERSION" -ge 20 ]; then
        success "Node.js version is compatible (>=20)"
    else
        warning "Node.js version may be too old (recommended: >=20)"
    fi
else
    error "Node.js not found"
fi

if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    success "npm version: $NPM_VERSION"
else
    error "npm not found"
fi

# Check for Windows-specific tools
if [[ "$PLATFORM" == "Windows" ]]; then
    echo -e "\n${BLUE}Windows-Specific Tools${NC}"
    echo "----------------------"
    
    if command -v winget >/dev/null 2>&1; then
        success "winget package manager available"
    else
        info "winget not available - consider upgrading Windows"
    fi
    
    if command -v choco >/dev/null 2>&1; then
        success "Chocolatey package manager available"
    else
        info "Chocolatey not installed - useful for development tools"
    fi
    
    # Check if running in WSL
    if grep -qi microsoft /proc/version 2>/dev/null; then
        success "Running in WSL - ideal for LibreMesh development"
        
        # Check WSL version
        if grep -qi "WSL2" /proc/version 2>/dev/null; then
            success "WSL2 detected - optimal performance"
        else
            warning "WSL1 detected - consider upgrading to WSL2"
        fi
    else
        warning "Native Windows - limited LibreMesh integration"
        info "Install WSL2 for full development capabilities"
    fi
fi

# Check for macOS-specific tools
if [[ "$PLATFORM" == "macOS" ]]; then
    echo -e "\n${BLUE}macOS-Specific Tools${NC}"
    echo "--------------------"
    
    if command -v brew >/dev/null 2>&1; then
        success "Homebrew package manager available"
    else
        warning "Homebrew not installed - useful for development tools"
        info "Install from: https://brew.sh"
    fi
    
    # Check Xcode command line tools
    if xcode-select -p >/dev/null 2>&1; then
        success "Xcode command line tools installed"
    else
        warning "Xcode command line tools not found"
        info "Install with: xcode-select --install"
    fi
fi

# Test build process
echo -e "\n${BLUE}Build Process Test${NC}"
echo "-------------------"

if [ -f "package.json" ] && [ -d "node_modules" ]; then
    info "Testing development build..."
    
    # Create a temporary test to ensure builds work
    if timeout 60 npm run build >/dev/null 2>&1; then
        success "Development build successful on $PLATFORM"
        
        # Check build output
        if [ -d "build" ]; then
            BUILD_SIZE=$(du -sh build 2>/dev/null | cut -f1 || echo "Unknown")
            info "Build output size: $BUILD_SIZE"
        fi
    else
        error "Development build failed on $PLATFORM"
        warning "Check dependencies and platform-specific issues"
    fi
else
    warning "Skipping build test - dependencies not installed"
fi

# Performance check
echo -e "\n${BLUE}Performance Check${NC}"
echo "-----------------"

# Basic system info
if command -v uname >/dev/null 2>&1; then
    ARCH=$(uname -m)
    info "Architecture: $ARCH"
    
    # Warn about potential performance issues
    if [[ "$ARCH" == "arm64" ]] && [[ "$PLATFORM" == "macOS" ]]; then
        success "Apple Silicon Mac - excellent performance expected"
    elif [[ "$ARCH" == "x86_64" ]]; then
        success "x86_64 architecture - good performance expected"
    fi
fi

# Check available memory
if command -v free >/dev/null 2>&1; then
    TOTAL_MEM=$(free -h | grep "Mem:" | awk '{print $2}')
    info "Available memory: $TOTAL_MEM"
elif command -v vm_stat >/dev/null 2>&1; then
    # macOS
    info "Memory information available via vm_stat"
fi

# Summary and recommendations
echo -e "\n${BLUE}Cross-Platform Summary${NC}"
echo "======================"

# Calculate compatibility score
SCORE=0
TOTAL=8

# Scoring criteria
[ "$AUTOCRLF" = "false" ] && ((SCORE++))
[ "$EOL" = "lf" ] && ((SCORE++))
[ -f "package.json" ] && grep -q '"cross-env"' package.json && ((SCORE++))
[ $HARDCODED_PATHS -eq 0 ] && ((SCORE++))
[ $MISSING_SHEBANG -eq 0 ] && ((SCORE++))
[ $PLATFORM_SPECIFIC -eq 0 ] && ((SCORE++))
command -v node >/dev/null 2>&1 && ((SCORE++))
[ "$PRIMARY_PLATFORM" = true ] && ((SCORE++))

PERCENTAGE=$((SCORE * 100 / TOTAL))

if [ $PERCENTAGE -ge 90 ]; then
    echo -e "${GREEN}🎉 Excellent cross-platform compatibility! ($PERCENTAGE% score)${NC}"
elif [ $PERCENTAGE -ge 70 ]; then
    echo -e "${YELLOW}⚠ Good cross-platform setup with minor issues ($PERCENTAGE% score)${NC}"
else
    echo -e "${YELLOW}⚠ Cross-platform compatibility needs improvement ($PERCENTAGE% score)${NC}"
fi

echo
echo "Platform-specific recommendations:"

if [[ "$PLATFORM" == "Windows" ]]; then
    if ! grep -qi microsoft /proc/version 2>/dev/null; then
        echo "  • Install WSL2 for full LibreMesh development"
        echo "  • Use VS Code with WSL extension"
    fi
    echo "  • Install cross-env: npm install --save-dev cross-env"
    echo "  • Configure Git line endings: git config --global core.autocrlf false"
fi

if [[ "$PLATFORM" == "macOS" ]]; then
    if ! command -v brew >/dev/null 2>&1; then
        echo "  • Install Homebrew for package management"
    fi
    echo "  • Install QEMU via Homebrew: brew install qemu"
fi

if [[ "$PLATFORM" == "Linux" ]]; then
    echo "  • Ensure QEMU is installed: sudo apt install qemu-system-x86"
    echo "  • Verify sudo access for QEMU networking"
fi

echo
echo "Next steps:"
echo "  • npm run verify:$PLATFORM   # Platform-specific checks"
echo "  • npm run test:cross-platform # Cross-platform testing"
echo "  • npm run qa:cross-platform   # Full cross-platform QA"

exit 0