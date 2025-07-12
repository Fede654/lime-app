# LibreMesh Development Environment - Developer Onboarding Guide

Welcome to LibreMesh development! This guide will get you from zero to productive development in under 30 minutes.

## 🚀 **Quick Start (30 seconds)**

```bash
# Clone and setup in one command
git clone <your-repo-url>
cd lime-app
./setup-libremesh-dev.sh --auto
```

**That's it!** The script handles everything automatically.

---

## 📋 **What You'll Get**

### **Complete Development Environment**
- ✅ **QEMU Virtual Router** - Real LibreMesh/LibreRouterOS instance
- ✅ **Dual Configuration Support** - Stable LibreMesh + Latest LibreRouterOS
- ✅ **Hot Reload Development** - Changes deploy instantly
- ✅ **Network Simulation** - Full mesh networking environment
- ✅ **Automated Testing** - 140+ tests with QEMU integration

### **Pre-configured Tools**
- ✅ **QEMU with KVM acceleration** - Fast virtualization
- ✅ **Network bridge setup** - Host-guest connectivity
- ✅ **Development scripts** - One-command deploy and testing
- ✅ **Cross-platform support** - Linux, macOS, Windows WSL2

---

## 🎯 **Setup Options**

### **Option 1: Fully Automated (Recommended)**
```bash
./setup-libremesh-dev.sh --auto
```
- Zero prompts, uses best defaults
- Installs dependencies automatically
- Configures everything for you

### **Option 2: Interactive Setup**
```bash
./setup-libremesh-dev.sh
```
- Guided setup with explanations
- Choose your configuration
- Learn about each step

### **Option 3: Custom Configuration**
```bash
# Use stable LibreMesh (recommended for beginners)
./setup-libremesh-dev.sh --config=libremesh --auto

# Use latest LibreRouterOS (for advanced development)
./setup-libremesh-dev.sh --config=librerouteros --auto

# Skip dependency installation (if already installed)
./setup-libremesh-dev.sh --skip-deps
```

---

## 🔧 **Development Workflow**

### **Daily Development Cycle**
```bash
# 1. Start your development environment
npm run qemu:start

# 2. Make changes to your code
# Edit files in src/...

# 3. Deploy changes to QEMU
npm run deploy:qemu

# 4. Test your changes
# Visit http://10.13.0.1/app/

# 5. Stop when done
npm run qemu:stop
```

### **Available Configurations**
```bash
# Auto-detect best configuration
npm run qemu:start

# Use stable LibreMesh (OpenWrt 23.05)
npm run qemu:start:libremesh

# Use latest LibreRouterOS (6.6.86 kernel)
npm run qemu:start:librerouteros

# Check what's available
npm run qemu:configs
```

---

## 🌐 **Access Points**

Once QEMU is running, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Main Interface** | http://10.13.0.1/ | Router web interface |
| **lime-app** | http://10.13.0.1/app/ | Your development target |
| **Console** | `sudo screen -r libremesh` | Router console access |

**Default Credentials:** `root` / `admin`

---

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **"Permission denied" errors**
```bash
# Add yourself to required groups
sudo usermod -a -G kvm $USER
# Log out and back in
```

#### **"QEMU not starting"**
```bash
# Check dependencies
./scripts/deps-manager.sh check

# Clean restart
npm run qemu:stop
npm run qemu:start
```

#### **"No images found"**
```bash
# Check what's available
npm run qemu:configs

# You may need to build or download images first
```

#### **"Network not working"**
```bash
# Check bridge configuration
ip link show | grep lime_br

# Restart network setup
npm run qemu:restart
```

### **Getting Help**
```bash
# Check system requirements
./scripts/deps-manager.sh check

# Show all available commands
npm run qemu:configs

# Verbose output for debugging
./setup-libremesh-dev.sh --verbose

# Get detailed help
./setup-libremesh-dev.sh --help
```

---

## 🎓 **Learning Resources**

### **Architecture Understanding**
- **LibreMesh 23.05.5**: Stable mesh networking platform
- **LibreRouterOS 24.10.1**: Latest features with kernel 6.6.86
- **QEMU Integration**: Full virtualization with network simulation
- **lime-app**: Preact-based web interface with TanStack Query

### **Key Directories**
```bash
src/                          # Main application source
├── components/               # React/Preact components
├── pages/                   # Application pages
├── hooks/                   # Custom hooks
├── utils/                   # Utility functions
└── styles/                  # CSS and styling

scripts/                     # Development scripts
├── qemu-manager.sh          # Main QEMU orchestrator
├── deps-manager.sh          # Dependency management
└── debug-*.sh              # Debugging utilities

../lime-packages/            # LibreMesh packages
├── build/                   # Built images
├── packages/                # Package definitions
└── tools/                   # QEMU and build tools
```

### **Configuration Files**
```bash
package.json                 # npm scripts and dependencies
README-QEMU-CONFIGURATIONS.md # Detailed configuration docs
LIBREROUTER-KERNEL-INVESTIGATION.md # Technical deep-dive
```

---

## 🚀 **Advanced Development**

### **Testing**
```bash
# Run all tests
npm test

# Run tests with QEMU integration
npm run test:qemu

# Run integration tests
npm run test:integration
```

### **Building**
```bash
# Development build
npm run build

# Production build
npm run build:production

# Deploy to QEMU
npm run deploy:qemu
```

### **Multiple Environments**
```bash
# Switch between configurations
QEMU_IMAGE_CONFIG=libremesh-2305 npm run qemu:start
QEMU_IMAGE_CONFIG=librerouteros-2410 npm run qemu:start

# Custom node IDs for multiple instances
NODE_ID=01 npm run qemu:start  # Uses different ports/interfaces
```

---

## 📊 **Performance & Optimization**

### **System Requirements**
- **Minimum**: 4GB RAM, 5GB disk space
- **Recommended**: 8GB RAM, 20GB disk space, KVM support
- **Optimal**: 16GB RAM, SSD, dedicated development machine

### **Speed Optimizations**
- **KVM Acceleration**: 10x faster than software emulation
- **Bridge Networking**: Direct host-guest communication
- **Hot Reload**: Sub-second deployment cycles
- **Parallel Testing**: Multi-core test execution

---

## 🎯 **Contributing**

### **Development Standards**
- **Code Style**: ESLint + Prettier configured
- **Testing**: Minimum 75% coverage, QEMU integration tests
- **Documentation**: Update docs for new features
- **Compatibility**: Support both LibreMesh and LibreRouterOS

### **Pull Request Process**
1. **Setup**: Use this onboarding guide
2. **Develop**: Follow the daily workflow
3. **Test**: Run full test suite
4. **Document**: Update relevant docs
5. **Submit**: Create PR with clear description

---

## 🏆 **Success Metrics**

After completing this onboarding, you should be able to:

- ✅ **Start development environment** in under 2 minutes
- ✅ **Deploy code changes** in under 30 seconds  
- ✅ **Access running router** via web and console
- ✅ **Run full test suite** with QEMU integration
- ✅ **Switch configurations** between LibreMesh/LibreRouterOS
- ✅ **Debug issues** using provided tools

---

## 🎉 **Welcome to LibreMesh Development!**

You now have a **professional-grade development environment** that rivals any production development setup. 

**Key Benefits:**
- 🚀 **Fast Setup**: From zero to coding in minutes
- 🔄 **Hot Reload**: Instant feedback loops
- 🌐 **Real Environment**: Actual router, not mocks
- 🧪 **Comprehensive Testing**: 140+ tests covering all scenarios
- 📱 **Cross-platform**: Works on Linux, macOS, Windows
- 🔧 **Dual Configuration**: Stable + cutting-edge options

**Happy coding!** 🎊

---

## 📞 **Support**

**Issues or Questions?**
- 📖 Check `README-QEMU-CONFIGURATIONS.md` for technical details
- 🔍 Run `./scripts/deps-manager.sh check` for diagnostics
- 🛠️ Use `npm run qemu:configs` to see available options
- 📝 Create GitHub issues for bugs or feature requests

**Pro Tips:**
- Use `sudo screen -r libremesh` to access router console
- Run `npm run qemu:status` to check system status
- Keep `http://10.13.0.1/app/` bookmarked for quick access
- Use `--verbose` flags for troubleshooting