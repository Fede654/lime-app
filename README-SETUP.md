# LibreMesh Development Environment - Quick Setup

## 🚀 **One-Command Setup**

```bash
./setup-libremesh-dev.sh --auto
```

**Or step-by-step:**
```bash
./setup-libremesh-dev.sh
```

## 📦 **What Gets Installed & Configured**

### **System Dependencies**
- ✅ **QEMU** (qemu-system-x86_64) - Virtual machine engine
- ✅ **Bridge Utils** (brctl/ip) - Network bridge management  
- ✅ **dnsmasq** - DHCP/DNS server for QEMU
- ✅ **Screen** - Console session management
- ✅ **Core Tools** (curl, wget, cpio, tar, gzip) - Build essentials

### **Development Tools**
- ✅ **Node.js & npm** - JavaScript runtime and package manager
- ✅ **Git** - Version control
- ✅ **KVM acceleration** - Hardware virtualization (Linux only)

### **LibreMesh Environment**
- ✅ **QEMU Configuration** - Dual image support (LibreMesh + LibreRouterOS)
- ✅ **Network Setup** - Bridge interfaces and TAP devices
- ✅ **User Permissions** - KVM group membership and sudo rules
- ✅ **Development Scripts** - All lime-app npm scripts configured

## 🎯 **Supported Platforms**

| Platform | Status | Notes |
|----------|--------|-------|
| **Ubuntu/Debian** | ✅ Fully Supported | Recommended platform |
| **RedHat/CentOS/Fedora** | ✅ Fully Supported | Uses yum/dnf |
| **Arch Linux** | ✅ Fully Supported | Uses pacman |
| **macOS** | ✅ Supported | Uses Homebrew, slower QEMU |
| **Windows WSL2** | ✅ Supported | Linux compatibility layer |

## 📋 **Quick Commands**

### **Setup Commands**
```bash
npm run setup:auto           # Automated setup
npm run setup:dev            # Interactive setup  
npm run setup:deps           # Check dependencies only
npm run setup:install-deps   # Install missing dependencies
```

### **Development Commands**
```bash
npm run qemu:start           # Start development environment
npm run deploy:qemu          # Deploy code changes
npm run qemu:stop            # Stop environment
npm run qemu:configs         # Show available configurations
```

## 🔧 **Configuration Options**

### **Image Configurations**
- **LibreMesh 23.05.5** - Stable mesh networking (recommended for beginners)
- **LibreRouterOS 24.10.1** - Latest features with kernel 6.6.86

### **Setup Modes**
- **`--auto`** - Zero-prompt automated setup
- **`--config=libremesh`** - Pre-select LibreMesh stable
- **`--config=librerouteros`** - Pre-select LibreRouterOS development
- **`--skip-deps`** - Skip dependency installation
- **`--verbose`** - Debug output

## 🎓 **For New Developers**

### **Complete Onboarding**
1. **Read**: `DEVELOPER-ONBOARDING.md` - Comprehensive guide
2. **Setup**: `./setup-libremesh-dev.sh --auto` - One command setup
3. **Start**: `npm run qemu:start` - Begin development
4. **Learn**: `npm run qemu:configs` - Explore options

### **Quick Start Workflow**
```bash
# Setup (once)
./setup-libremesh-dev.sh --auto

# Daily development cycle
npm run qemu:start          # Start virtual router
# Edit code in src/...
npm run deploy:qemu         # Deploy changes
# Test at http://10.13.0.1/app/
npm run qemu:stop           # Stop when done
```

## 🛠️ **Advanced Features**

### **Dual Configuration System**
- Automatic image detection
- Image-specific network configuration  
- Custom boot parameters for different kernels
- Seamless switching between stable/development

### **Network Simulation**
- Bridge networking for host-guest communication
- TAP interfaces for router simulation
- DHCP/DNS services for realistic network environment
- Multiple node support with different IDs

### **Development Integration**
- Hot reload development server
- QEMU console access via screen
- Automated testing with virtual environment
- Cross-platform compatibility

## 📊 **System Requirements**

### **Minimum Requirements**
- **OS**: Linux, macOS, or Windows WSL2
- **RAM**: 4GB (8GB recommended)
- **Disk**: 5GB free space (20GB recommended)
- **CPU**: x86_64 with virtualization support

### **Recommended Setup**
- **OS**: Ubuntu 20.04+ or Debian 11+
- **RAM**: 8GB+ 
- **Disk**: SSD with 20GB+ free space
- **CPU**: Multi-core with KVM support
- **Network**: Unrestricted internet access

## 🎉 **Benefits**

### **For New Developers**
- 🚀 **30-second setup** from clone to coding
- 🎓 **Guided onboarding** with comprehensive documentation
- 🔧 **No manual configuration** required
- 📚 **Learn by doing** with real router environment

### **For Development Teams**
- ⚡ **Consistent environments** across all developers
- 🔄 **Reproducible builds** and testing
- 🌐 **Cross-platform support** for diverse teams
- 📋 **Automated dependency management**

### **For the Project**
- 🎯 **Lower barrier to entry** for contributors
- 🛠️ **Standardized development workflow**
- 🧪 **Integrated testing environment**
- 📈 **Faster onboarding** reduces time-to-first-contribution

---

## 📞 **Support & Troubleshooting**

**Issues? Run diagnostics:**
```bash
./scripts/deps-manager.sh check    # Check system dependencies
npm run qemu:configs               # Verify image configurations  
./setup-libremesh-dev.sh --help    # Show all options
```

**Documentation:**
- `DEVELOPER-ONBOARDING.md` - Complete developer guide
- `README-QEMU-CONFIGURATIONS.md` - Technical configuration details
- `LIBREROUTER-KERNEL-INVESTIGATION.md` - Advanced troubleshooting

**Pro Tips:**
- Use `--auto` for CI/CD integration
- Use `--verbose` for debugging setup issues
- Use `npm run qemu:status` to check running environment
- Keep dependencies updated with `npm run setup:install-deps`

---

**Ready to code?** 🎊 Run `./setup-libremesh-dev.sh --auto` and start developing!