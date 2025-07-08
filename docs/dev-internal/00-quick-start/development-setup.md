# Development Setup

> **Audience**: New developers, environment setup  
> **Time**: 10-30 minutes depending on options  
> **Prerequisites**: Basic command line knowledge

## 🚀 Quick Start (30 seconds)

```bash
# Clone and setup
git clone https://github.com/libremesh/lime-app.git
cd lime-app
npm install

# Start developing
npm run dev
# Access at http://localhost:8080
```

## 📋 Prerequisites

### Essential Tools
- **Node.js v20+** (critical requirement)
- **npm** (latest version)
- **Git** for version control

### Optional but Recommended
- **QEMU** for full LibreMesh development
- **screen** for QEMU console access
- **VS Code** with recommended extensions

### Platform-specific Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nodejs npm git qemu-system-x86 screen build-essential
```

**Fedora/RHEL:**
```bash
sudo dnf install nodejs npm git qemu-system-x86 screen gcc-c++
```

**macOS:**
```bash
brew install node git qemu screen
```

## 🛠️ Installation Steps

### Option 1: Frontend Development Only

Perfect for UI work, component development, and basic testing:

```bash
# 1. Clone repository
git clone https://github.com/libremesh/lime-app.git
cd lime-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# Access at http://localhost:8080
```

**What you get:**
- ✅ Hot module replacement
- ✅ Component development
- ✅ UI testing
- ⚠️ Mocked API responses (no real LibreMesh)

### Option 2: Full Development Environment

For complete development including real LibreMesh testing:

```bash
# 1. Create workspace
mkdir libremesh-dev && cd libremesh-dev

# 2. Clone repositories
git clone https://github.com/libremesh/lime-app.git
git clone https://github.com/libremesh/lime-packages.git

# 3. Setup lime-app
cd lime-app
npm install

# 4. Setup QEMU environment
npm run qemu:start
npm run qemu:dev
# Access at http://localhost:8080 (with real LibreMesh backend)
```

**What you get:**
- ✅ Everything from Option 1
- ✅ Real LibreMesh ubus API
- ✅ Actual router functionality
- ✅ Integration testing

## 🔧 Environment Configuration

### Development Server Options

**Basic frontend development:**
```bash
npm run dev
# - Hot reload enabled
# - Proxies to 10.13.0.1 (will fail without router)
# - Good for UI work
```

**With QEMU LibreMesh:**
```bash
npm run qemu:dev
# - Real LibreMesh backend
# - Full API functionality
# - Integration testing
```

**Custom router IP:**
```bash
env NODE_HOST=192.168.1.1 npm run dev
# - Connect to real router
# - Replace IP with your router's address
```

### QEMU LibreMesh Setup

If you chose full development environment:

```bash
# Download LibreMesh images (one time setup)
cd ../lime-packages/build

# Download LibreMesh 2020.4 (recommended for development)
wget -O libremesh-2020.4-ow19-x86-64-rootfs.tar.gz \
  "https://downloads.libremesh.org/releases/2020.4-ow19/targets/x86/64/libremesh-2020.4-ow19-default-x86-64-generic-rootfs.tar.gz"

wget -O libremesh-2020.4-ow19-x86-64-ramfs.bzImage \
  "https://downloads.libremesh.org/releases/2020.4-ow19/targets/x86/64/libremesh-2020.4-ow19-default-x86-64-ramfs.bzImage"
```

## ✅ Verification

### Automated Verification

```bash
# Complete environment check
npm run verify:setup

# Specific checks
npm run verify:qemu              # QEMU LibreMesh environment
npm run verify:ai                # AI development tools
npm run verify:cross-platform    # Multi-platform compatibility
```

### Manual Verification

```bash
# Test build
npm run build

# Test basic functionality
npm test

# Test with QEMU (if available)
npm run qemu:start
npm run test:integration
```

### Success Indicators

You should see:
- ✅ Node.js v20+ installed
- ✅ npm working
- ✅ Dependencies installed
- ✅ Development server starts
- ✅ Tests pass

## 🎯 Development Workflows

### Basic Development

```bash
npm run dev          # Frontend development server
npm run test         # Run test suite
npm run lint         # Code quality checks
npm run storybook    # Component development
```

### Advanced Development (with QEMU)

```bash
# QEMU Management
npm run qemu:start      # Start LibreMesh VM
npm run qemu:stop       # Stop LibreMesh VM
npm run qemu:status     # Check QEMU status
npm run qemu:restart    # Restart QEMU cleanly

# Development with real backend
npm run qemu:dev        # Dev server + QEMU backend
npm run deploy:qemu     # Build + deploy in one command

# Quality Assurance
npm run qa:fast         # Quick QA (lint + basic tests)
npm run qa:full         # Complete QA (tests + lint + build + integration)
npm run qa:ai           # AI-assisted quality checks
```

## 🐛 Common Issues & Solutions

### Node.js Version Issues

**Problem**: "Node.js version not supported"
**Solution**: 
```bash
# Check version
node --version

# Update via package manager
sudo apt update nodejs  # Ubuntu
brew upgrade node       # macOS

# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### QEMU Connectivity Issues

**Problem**: "QEMU is not running" or connection errors
**Solutions**:
```bash
# Check QEMU status
npm run qemu:status

# Check if QEMU process exists
pgrep -f "qemu-system-x86_64"

# Verify network connectivity
ping 10.13.0.1

# Restart QEMU cleanly
npm run qemu:restart

# Kill stale processes
npm run qemu:stop
```

### Dependency Issues

**Problem**: Build or test failures
**Solutions**:
```bash
# Clear cache
npm run clear-jest

# Fresh install
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated

# Update dependencies (careful!)
npm update
```

### Build Issues

**Problem**: TypeScript or build errors
**Solutions**:
```bash
# Check TypeScript
tsc

# Verify ESLint
npm run lint

# Check for syntax errors
npm run lint:fix
```

## 📁 Project Structure Overview

```
lime-app/
├── src/                    # Core application
│   ├── components/         # Reusable UI components
│   ├── containers/         # Page-level components
│   ├── utils/             # Utilities and helpers
│   └── config.ts          # Plugin registration
├── plugins/               # Plugin modules
│   └── lime-plugin-*/     # Individual plugins
├── scripts/               # Development scripts
│   ├── verify-*.sh        # Environment verification
│   └── qemu-*.sh          # QEMU management
├── docs/                  # Documentation
│   └── dev-internal/      # Internal development docs
└── tests/                 # Test files
```

## 🔗 Next Steps

1. **[Quick Reference](quick-reference.md)** - Essential commands and workflows
2. **[Development Workflow](../02-development/workflow.md)** - Day-to-day development
3. **[QEMU Integration](../02-development/qemu-integration.md)** - Testing with real LibreMesh
4. **[Creating Plugins](../03-guides/creating-plugins.md)** - Build new functionality

## 🆘 Getting Help

- **[Troubleshooting Guide](troubleshooting.md)** - Common issues and solutions
- **GitHub Issues**: https://github.com/libremesh/lime-app/issues
- **Matrix Chat**: #libremesh:matrix.org
- **Mailing List**: lime-users@lists.libremesh.org

---

**🎉 Ready to develop?** Start with `npm run dev` and check the [Quick Reference](quick-reference.md) for essential commands.