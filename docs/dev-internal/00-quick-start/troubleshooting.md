# Troubleshooting Guide

> **Purpose**: Common issues and solutions for LiMeApp development  
> **Updated**: 2025-07-08  
> **Audience**: All developers

## 🔍 Quick Diagnosis

### Health Check Commands

```bash
# Complete environment check
npm run verify:setup

# Check specific components
npm run verify:qemu              # QEMU LibreMesh
npm run verify:ai                # AI development tools
npm run verify:cross-platform    # Multi-platform issues

# Check current status
npm run qemu:status             # QEMU state
npm test                        # Test suite
npm run lint                    # Code quality
```

### Common Error Patterns

| Error Type | Quick Fix |
|------------|-----------|
| `ENOENT: no such file` | `npm install` |
| `Port already in use` | `npm run qemu:stop` |
| `Permission denied` | Check file permissions |
| `Network unreachable` | Check QEMU network |
| `Jest timeout` | Check test environment |

## 🚨 Critical Issues

### 1. Node.js Version Problems

**Symptoms:**
- "Node.js version not supported"
- Build failures
- Dependency conflicts

**Solutions:**
```bash
# Check current version
node --version

# Should be v20+ for LiMeApp
# Update via package manager
sudo apt update nodejs           # Ubuntu/Debian
brew upgrade node               # macOS
sudo dnf update nodejs          # Fedora

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### 2. QEMU Won't Start

**Symptoms:**
- "QEMU is not running" after start attempt
- Connection timeouts to 10.13.0.1
- No LibreMesh console access

**Diagnosis:**
```bash
# Check QEMU process
pgrep -f "qemu-system-x86_64"

# Check screen sessions
screen -ls

# Check network interfaces
ip addr show | grep lime

# Check for port conflicts
netstat -tuln | grep 10.13.0.1
```

**Solutions:**
```bash
# Clean restart
npm run qemu:stop
npm run qemu:start

# Force kill if stuck
sudo pkill -f "qemu-system-x86_64"
sudo pkill -f "screen.*libremesh"

# Check QEMU installation
which qemu-system-x86_64
sudo apt install qemu-system-x86  # If missing

# Network issues
sudo ip link delete lime_br0 2>/dev/null
sudo ip link delete lime_tap00_0 2>/dev/null
```

### 3. Build Failures

**Symptoms:**
- TypeScript compilation errors
- Missing dependencies
- Bundle size warnings

**Solutions:**
```bash
# Clear everything and rebuild
rm -rf node_modules package-lock.json
npm install

# Check TypeScript
tsc

# Fix linting issues
npm run lint:fix

# Clear Jest cache
npm run clear-jest

# Bundle size warnings are normal (858KB > 195KB limit)
```

## 🌐 Network & Connectivity

### QEMU Network Issues

**Problem**: Can't reach 10.13.0.1
**Solutions:**
```bash
# Check QEMU status
npm run qemu:status

# Test network connectivity
ping 10.13.0.1

# Check routing
ip route | grep 10.13.0.1

# Restart network config
npm run qemu:restart
```

### Development Server Issues

**Problem**: Development server won't start
**Solutions:**
```bash
# Check if port is in use
lsof -i :8080

# Kill processes using port
sudo kill -9 $(lsof -t -i:8080)

# Try different port
PORT=3000 npm run dev
```

### API Connection Problems

**Problem**: ubus API calls failing
**Solutions:**
```bash
# Test ubus directly
curl -s -X POST http://10.13.0.1/ubus \
  -d '{"jsonrpc":"2.0","id":1,"method":"list","params":["*"]}'

# Check proxy configuration
cat preact.config.js | grep proxy

# Verify QEMU backend
npm run qemu:status
```

## 🧪 Testing Issues

### Test Suite Failures

**Problem**: Tests failing after changes
**Solutions:**
```bash
# Clear Jest cache
npm run clear-jest

# Run tests in isolation
npm test -- --runInBand

# Check test environment
npm run test -- --verbose

# Run specific test
npm test -- --testNamePattern="specific test"
```

### Integration Test Problems

**Problem**: Integration tests hanging or failing
**Solutions:**
```bash
# Ensure QEMU is running
npm run qemu:start

# Check QEMU health
npm run qemu:status

# Run integration tests separately
npm run test:integration:quick

# Debug test timeout
npm run test -- --timeout=10000
```

## 🔧 Development Workflow Issues

### Hot Reload Not Working

**Problem**: Changes not reflecting in browser
**Solutions:**
```bash
# Check if dev server is running
ps aux | grep "preact watch"

# Restart development server
# Ctrl+C then npm run dev

# Check file watching
lsof +D src/ | grep node

# Clear browser cache
# Hard refresh: Ctrl+Shift+R
```

### Plugin Development Issues

**Problem**: New plugin not loading
**Solutions:**
```bash
# Check plugin registration
grep -r "plugin-name" src/config.ts

# Verify plugin structure
ls plugins/lime-plugin-name/

# Check for syntax errors
npm run lint plugins/lime-plugin-name/

# Restart dev server
npm run dev
```

## 🎨 UI & Component Issues

### Storybook Problems

**Problem**: Storybook won't start or components not loading
**Solutions:**
```bash
# Clear Storybook cache
rm -rf .storybook/dist

# Restart Storybook
npm run storybook

# Check component stories
find . -name "*.stories.js" | head -5

# Check Storybook configuration
cat .storybook/main.js
```

### CSS/Styling Issues

**Problem**: Styles not applying or conflicting
**Solutions:**
```bash
# Check Tailwind configuration
cat tailwind.config.js

# Verify CSS build
npm run build

# Check for CSS conflicts
grep -r "className" src/ | grep -v node_modules

# Clear browser cache
# Hard refresh: Ctrl+Shift+R
```

## 📦 Dependency & Package Issues

### npm Install Failures

**Problem**: Package installation errors
**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete lock file and reinstall
rm package-lock.json
npm install

# Check for permission issues
ls -la node_modules/

# Update npm
npm install -g npm@latest
```

### Version Conflicts

**Problem**: Dependency version mismatches
**Solutions:**
```bash
# Check outdated packages
npm outdated

# Check for duplicate dependencies
npm ls --depth=0

# Fix peer dependency warnings
npm install --legacy-peer-deps

# Check for security vulnerabilities
npm audit
npm audit fix
```

## 🤖 AI Development Issues

### AI Tools Not Working

**Problem**: AI collaboration tools failing
**Solutions:**
```bash
# Check AI tool verification
npm run verify:ai

# Check available tools
which cursor
which github-copilot-cli

# Verify AI configuration
ls ~/.config/cursor/
ls ~/.config/github-copilot/
```

## 🔍 Debugging Techniques

### Development Console

**Check browser console for:**
- JavaScript errors
- Network request failures
- Component mounting issues

**Common patterns:**
```javascript
// Check if APIs are being called
console.log('API call:', endpoint, data);

// Check component state
console.log('Component state:', this.state);

// Check props
console.log('Props:', props);
```

### Network Debugging

```bash
# Monitor network requests
curl -v http://10.13.0.1/ubus

# Check proxy behavior
curl -v http://localhost:8080/ubus

# Monitor QEMU logs
sudo screen -r libremesh
# Then check dmesg or logread
```

### Build Debugging

```bash
# Verbose build
npm run build -- --verbose

# Check webpack output
npm run dev -- --verbose

# Analyze bundle size
npm run build -- --analyze
```

## 📊 Performance Issues

### Slow Development Server

**Problem**: Development server slow to start or reload
**Solutions:**
```bash
# Check system resources
htop

# Reduce file watching
# Edit preact.config.js to exclude directories

# Clear caches
npm run clear-jest
rm -rf .cache/

# Check for large files
find . -size +100M -not -path "./node_modules/*"
```

### Memory Issues

**Problem**: Out of memory errors during build
**Solutions:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Check memory usage
free -h

# Close unnecessary applications
# Monitor with htop
```

## 🆘 Getting Help

### Before Asking for Help

1. **Check this guide** for your specific issue
2. **Run diagnostics**: `npm run verify:setup`
3. **Check logs**: Look for error messages in console
4. **Try basic fixes**: Restart, clear cache, reinstall

### Where to Get Help

- **GitHub Issues**: https://github.com/libremesh/lime-app/issues
- **Matrix Chat**: #libremesh:matrix.org
- **Mailing List**: lime-users@lists.libremesh.org
- **Team Chat**: Development team channels

### What to Include in Help Requests

```bash
# System information
uname -a
node --version
npm --version

# Environment status
npm run verify:setup

# Error logs
npm run dev 2>&1 | head -20
```

## 🔄 Recovery Procedures

### Nuclear Option: Complete Reset

If all else fails:
```bash
# 1. Backup any important changes
git stash

# 2. Clean everything
rm -rf node_modules package-lock.json
npm run qemu:stop
sudo pkill -f "qemu-system-x86_64"

# 3. Fresh install
npm install

# 4. Restart services
npm run qemu:start
npm run dev

# 5. Restore changes
git stash pop
```

### Partial Reset: Just Dependencies

```bash
# Clean install only
rm -rf node_modules package-lock.json
npm install
```

### Partial Reset: Just QEMU

```bash
# Clean QEMU only
npm run qemu:stop
npm run qemu:start
```

---

**Still having issues?** Check the [Development Setup](development-setup.md) guide or ask for help in the team chat.