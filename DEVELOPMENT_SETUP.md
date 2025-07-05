# LiMeApp Development Setup Guide

Complete guide for setting up a full LibreMesh development environment with QEMU for lime-app development.

## Prerequisites

Ensure you have these installed:
- **Node.js** (v20 or later)
- **npm** (latest version)
- **Git**
- **QEMU** (`qemu-system-x86_64`)
- **screen** or **tmux**
- **sudo** access for QEMU networking

### Install QEMU
```bash
# Ubuntu/Debian
sudo apt install qemu-system-x86 screen

# Fedora/RHEL
sudo dnf install qemu-system-x86 screen

# macOS
brew install qemu screen
```

## Complete Development Environment Setup

### Step 1: Clone Repositories

**Set up the workspace:**
```bash
# Create workspace directory
mkdir libremesh-dev && cd libremesh-dev

# Clone lime-app (main project)
git clone https://github.com/libremesh/lime-app.git
cd lime-app

# Clone lime-packages (for QEMU LibreMesh)
cd ..
git clone https://github.com/libremesh/lime-packages.git
cd lime-app
```

**Your directory structure should be:**
```
libremesh-dev/
├── lime-app/          # Main development project
└── lime-packages/     # LibreMesh QEMU environment
```

### Step 2: Install Dependencies

```bash
# Install lime-app dependencies
cd lime-app
npm install
```

### Step 3: Download LibreMesh Images

Download the recommended LibreMesh images for QEMU development:

```bash
# Create build directory
mkdir -p ../lime-packages/build
cd ../lime-packages/build

# Download LibreMesh 2020.4 (recommended for development)
wget -O libremesh-2020.4-ow19-x86-64-rootfs.tar.gz \
  "https://downloads.libremesh.org/releases/2020.4-ow19/targets/x86/64/libremesh-2020.4-ow19-default-x86-64-generic-rootfs.tar.gz"

wget -O libremesh-2020.4-ow19-x86-64-ramfs.bzImage \
  "https://downloads.libremesh.org/releases/2020.4-ow19/targets/x86/64/libremesh-2020.4-ow19-default-x86-64-ramfs.bzImage"

# Return to lime-app directory
cd ../../lime-app
```

### Step 4: Start LibreMesh QEMU Environment

**Start QEMU LibreMesh in a screen session:**
```bash
screen -S libremesh -d -m sudo ../lime-packages/tools/qemu_dev_start \
  --libremesh-workdir ../lime-packages \
  ../lime-packages/build/libremesh-2020.4-ow19-x86-64-rootfs.tar.gz \
  ../lime-packages/build/libremesh-2020.4-ow19-x86-64-ramfs.bzImage
```

**Wait for boot (30-60 seconds), then connect to console:**
```bash
screen -r libremesh
```

**In the LibreMesh console:**
1. **Wait for boot messages to complete**
2. **Press Enter** when you see "Please press Enter to activate this console"
3. **Configure the network:**
   ```bash
   # Add expected IP address for development
   ip addr add 10.13.0.1/16 dev br-lan
   
   # Start web server
   /etc/init.d/uhttpd start
   
   # Test internal connectivity
   ping -c 2 10.13.0.2
   ```
4. **Detach from screen:** Press `Ctrl+A`, then `D`

### Step 5: Verify QEMU Setup

**Test connectivity from host:**
```bash
# Test ping
ping -c 3 10.13.0.1

# Test web interface
curl -s http://10.13.0.1

# Use the built-in check script
npm run qemu:check
```

**Expected output:**
```
✓ QEMU LibreMesh reachable at 10.13.0.1
✓ LibreMesh web interface accessible
✓ Ready for development
```

## Development Workflows

### Frontend Development (Recommended)

**Start development server with QEMU backend:**
```bash
npm run qemu:dev
```

This provides:
- **Hot-reload development:** http://localhost:8080
- **Real LibreMesh backend:** Proxied to QEMU at 10.13.0.1
- **Live API testing:** Real ubus calls and LibreMesh services

### Direct QEMU Testing

**Access LibreMesh directly:**
- **LibreMesh interface:** http://10.13.0.1
- **lime-app:** http://10.13.0.1/app

**Deploy your changes to QEMU:**
```bash
# Build and deploy lime-app to LibreMesh
npm run qemu:deploy

# Access the deployed version
curl http://10.13.0.1/app
```

### Development Commands

```bash
# Core development
npm run dev                    # Frontend-only development (mocked backend)
npm run qemu:dev              # Development with real LibreMesh backend

# QEMU management
npm run qemu:check            # Verify QEMU LibreMesh is running
npm run qemu:deploy           # Deploy lime-app to QEMU
npm run qemu:start            # Build, deploy, and start QEMU

# Testing and quality
npm test                      # Run test suite
npm run lint                  # Code quality checks
npm run storybook            # Component development environment
```

## Plugin Development Workflow

### Creating a New Plugin

```bash
# Generate plugin structure
npm run create-plugin MyFeature

# This creates:
plugins/lime-plugin-myfeature/
├── index.ts              # Plugin registration
├── myfeature.spec.js     # Tests
├── myfeature.stories.js  # Storybook
└── src/
    ├── MyFeaturePage.js  # Main component
    ├── MyFeatureMenu.js  # Menu component
    ├── MyFeatureApi.js   # Backend API
    └── style.less        # Styles
```

### Development Process

1. **Write component tests:**
   ```bash
   npm run test plugins/lime-plugin-myfeature/myfeature.spec.js -- --watch
   ```

2. **Develop component in Storybook:**
   ```bash
   npm run storybook
   # Visit http://localhost:8081
   ```

3. **Test with real LibreMesh:**
   ```bash
   npm run qemu:dev
   # Visit http://localhost:8080
   ```

4. **Deploy and test in QEMU:**
   ```bash
   npm run qemu:deploy
   # Visit http://10.13.0.1/app
   ```

### API Development

**Example plugin API structure:**
```javascript
// src/MyFeatureApi.js
import api from 'utils/uhttpd';

export const getMyFeatureData = () => 
  api.call('myfeature', 'get_data', {});

export const setMyFeatureConfig = (config) => 
  api.call('myfeature', 'set_config', { config });
```

**Test your APIs:**
```javascript
// myfeature.spec.js
import { getMyFeatureData } from './src/MyFeatureApi';

// Mock the API
jest.mock('./src/MyFeatureApi');

test('loads feature data', async () => {
  getMyFeatureData.mockResolvedValue({ status: 'ok', data: {} });
  // Test component behavior
});
```

## Testing Strategy

### Unit Tests
```bash
# Run all tests
npm test

# Run specific plugin tests
npm run test plugins/lime-plugin-myfeature/

# Run tests with coverage
npm run test -- --coverage

# Watch mode for development
npm run test -- --watch
```

### Integration Testing with QEMU
```bash
# Start QEMU environment
npm run qemu:start

# Run integration tests against real LibreMesh
npm run test:integration  # If available

# Manual testing in browser
npm run qemu:dev
# Test at http://localhost:8080
```

### Visual Testing
```bash
# Start Storybook for component development
npm run storybook

# Build Storybook for deployment
npm run storybook:build
```

## Troubleshooting

### QEMU Network Issues

**If `npm run qemu:check` fails:**

1. **Check QEMU is running:**
   ```bash
   ps aux | grep qemu
   screen -list
   ```

2. **Reconnect to console:**
   ```bash
   screen -r libremesh
   # Check network: ip addr show
   # Reconfigure: ip addr add 10.13.0.1/16 dev br-lan
   ```

3. **Restart QEMU if needed:**
   ```bash
   screen -S libremesh -X quit
   npm run qemu:start
   ```

### Development Server Issues

**If development server doesn't connect to QEMU:**

1. **Verify QEMU connectivity:**
   ```bash
   ping 10.13.0.1
   curl http://10.13.0.1/ubus
   ```

2. **Check proxy configuration:**
   ```bash
   # Development server should proxy to 10.13.0.1
   grep -r "10.13.0.1" preact.config.js
   ```

3. **Use custom backend:**
   ```bash
   env NODE_HOST=10.13.0.1 npm run dev
   ```

### Build Issues

**If builds fail:**

1. **Clean and reinstall:**
   ```bash
   npm run clean
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version:**
   ```bash
   node --version  # Should be v20+
   npm --version   # Should be latest
   ```

## Advanced Configuration

### Custom LibreMesh Configuration

**Modify LibreMesh before starting QEMU:**
```bash
# Edit configuration files in lime-packages
vim ../lime-packages/packages/lime-system/files/etc/config/lime-defaults

# Restart QEMU to apply changes
npm run qemu:start
```

### Multiple QEMU Instances

**Run multiple LibreMesh nodes:**
```bash
# Start second instance with different node ID
sudo ../lime-packages/tools/qemu_dev_start --node-id 1 \
  --libremesh-workdir ../lime-packages \
  ../lime-packages/build/libremesh-2020.4-ow19-x86-64-rootfs.tar.gz \
  ../lime-packages/build/libremesh-2020.4-ow19-x86-64-ramfs.bzImage
```

### Production Builds

**Build for deployment:**
```bash
# Production build
npm run build:production

# Deploy to real LibreMesh router
scp -r build/* root@192.168.1.1:/www/app/
```

## IDE Integration

### VS Code Setup

**Recommended VS Code extensions:**
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Jest
- Auto Import - ES6, TS, JSX, TSX

**VS Code settings (`.vscode/settings.json`):**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "jest.jestCommandLine": "npm test",
  "jest.autoRun": "watch"
}
```

### Debug Configuration

**VS Code debug configuration (`.vscode/launch.json`):**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Getting Help

### Resources
- **LibreMesh Documentation:** https://libremesh.org/docs/
- **lime-app GitHub:** https://github.com/libremesh/lime-app
- **LibreMesh Community:** https://libremesh.org/community.html

### Community Support
- **Matrix:** #libremesh:matrix.org
- **Mailing List:** lime-users@lists.libremesh.org
- **GitHub Issues:** Report bugs and feature requests

### Contributing
- **Code Style:** Follow existing patterns and ESLint rules
- **Testing:** Write tests for new features
- **Documentation:** Update docs for new plugins or features
- **Pull Requests:** Create PRs against the `develop` branch

---

## Quick Reference

### Essential Commands
```bash
# Complete setup
npm install
npm run qemu:start

# Daily development
npm run qemu:dev          # Start development with QEMU backend
npm test -- --watch       # Run tests in watch mode
npm run storybook         # Visual component development

# QEMU management
npm run qemu:check        # Verify QEMU status
screen -r libremesh       # Access LibreMesh console
npm run qemu:deploy       # Deploy changes to QEMU
```

### Key URLs
- **Development Server:** http://localhost:8080
- **QEMU LibreMesh:** http://10.13.0.1
- **lime-app in QEMU:** http://10.13.0.1/app
- **Storybook:** http://localhost:8081

*This setup provides a complete, production-like development environment for lime-app with real LibreMesh backend integration.*