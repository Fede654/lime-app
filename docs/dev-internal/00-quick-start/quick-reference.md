# Development Quick Reference

> **Generated**: 2025-07-08  
> **Purpose**: Quick reference for LiMeApp development workflow based on real deployment experience

## 🚀 Development Workflow Overview

This document captures the complete development workflow from initial setup to QEMU deployment, with technical reasoning for each step.

## 📋 Pre-Development Checklist

### 1. Check Project Dependencies (`package.json`)
```bash
cat package.json | head -20
```
**Purpose**: Verify project type, available scripts, and dependencies  
**Looking for**: 
- Build system (Preact CLI)
- Available npm scripts
- Development dependencies
- Node/npm version requirements

### 2. Verify Development Environment
```bash
npm run verify:setup
```
**Purpose**: Comprehensive environment check  
**Looking for**:
- ✅ Node.js and npm installed
- ✅ Git version control
- ✅ Dependencies installed (`node_modules`)
- ⚠️ Outdated packages (informational)

**Common Issues**:
- Missing `node_modules` → Run `npm install`
- Outdated dependencies → Consider `npm update` (with caution)

## 🛠️ Development Server Options

### Option 1: Basic Frontend Development
```bash
npm run dev
```
**Purpose**: Quick frontend development without backend  
**Technical Details**:
- Starts on http://localhost:8080
- Proxies `/ubus` calls to 10.13.0.1 (will fail without router)
- Hot module replacement enabled
- Good for UI/component development

**Expected Warnings**: Source map warnings from `timeago.js` (harmless)

### Option 2: Full Stack Development with QEMU

#### Step 1: Check QEMU Status
```bash
npm run qemu:status
```
**Purpose**: Verify QEMU LibreMesh instance state  
**Possible States**:
- ✗ Not running → Need to start QEMU
- ✓ Running → Ready for development

#### Step 2: Start QEMU (if needed)
```bash
npm run qemu:start
```
**Purpose**: Launch LibreMesh in QEMU  
**Technical Process**:
1. Detects LibreMesh image format
2. Falls back to 2020.4 if 2024.1 squashfs detected
3. Starts QEMU in screen session
4. Auto-configures network (10.13.0.1)
5. Waits for boot completion

**Success Indicators**:
- "✓ QEMU LibreMesh ready at http://10.13.0.1"
- "✓ lime-app available at http://10.13.0.1/app"

#### Step 3: Development with QEMU Backend
```bash
npm run qemu:dev
```
**Purpose**: Development server with real LibreMesh backend  
**Benefits**:
- Real ubus API calls
- Actual LibreMesh services
- Test real router functionality
- Hot reload with backend integration

## 🚢 Deployment to QEMU

### One-Command Deployment (Recommended)
```bash
npm run deploy:qemu
```
**Purpose**: Build and deploy in single command  
**Process**:
1. Runs production build
2. Deploys to lime-packages structure
3. Restarts QEMU if needed
4. Applies overlay automatically

### Manual Deployment Steps

#### 1. Build Production Version
```bash
npm run build:production
```
**Technical Details**:
- Extracts and compiles translations
- Creates optimized bundle (~858KB)
- Removes source maps
- Generates chunk files for code splitting

#### 2. Deploy to QEMU
```bash
npm run qemu:deploy
```
**Purpose**: Copy built files to QEMU instance  
**Process**:
- Copies to `lime-packages/packages/lime-app/files/www/app/`
- Attempts live deployment
- Restarts QEMU if live deploy fails

## 🔍 Verification & Testing

### 1. Check Deployment Status
```bash
curl -s http://10.13.0.1/app/ | head -20
```
**Purpose**: Verify HTML is served correctly  
**Looking for**: 
- Proper HTML structure
- Correct bundle references
- No 404 errors

### 2. Test ubus API
```bash
curl -s -X POST http://10.13.0.1/ubus \
  -d '{"jsonrpc":"2.0","id":1,"method":"call","params":["00000000000000000000000000000000","session","login",{"username":"root","password":""}]}' \
  | jq .
```
**Purpose**: Verify backend API functionality  
**Expected**: JSON response with session result

### 3. Check Available Services
```bash
curl -s http://10.13.0.1/ubus -X POST \
  -d '{"jsonrpc":"2.0","id":1,"method":"list","params":["*"]}' \
  | jq -r '.result | keys[]' | head -10
```
**Purpose**: List available LibreMesh services  
**Looking for**: Services like `lime-utils`, `iwinfo`, etc.

### 4. Verify Bundle Size
```bash
curl -s http://10.13.0.1/app/bundle.*.js | wc -c
```
**Purpose**: Check deployed bundle size  
**Expected**: ~858KB for full application

## 🐛 Debugging & Troubleshooting

### Check IDE Diagnostics
```bash
npm run test            # Run test suite
```
**Via VS Code MCP**:
```typescript
mcp__ide__getDiagnostics()  // Check for TypeScript/ESLint errors
```

### Common Issues & Solutions

#### Issue: QEMU Won't Start
**Symptoms**: "QEMU is not running" after start attempt  
**Solutions**:
1. Check if port 10.13.0.1 is in use
2. Verify QEMU installation: `which qemu-system-x86_64`
3. Check screen sessions: `screen -ls`
4. Kill stale processes: `npm run qemu:stop`

#### Issue: 500 Errors on /ubus
**Symptoms**: API calls failing in dev server  
**Solutions**:
1. Ensure QEMU is running: `npm run qemu:status`
2. Check proxy configuration in `preact.config.js`
3. Verify network connectivity to 10.13.0.1

#### Issue: Bundle Too Large Warning
**Symptoms**: "Asset size limit" warnings during build  
**Understanding**: 
- Normal for full app (858KB > 195KB limit)
- Not a critical issue
- Consider lazy loading for optimization

## 📊 Development Decision Tree

```
Start Development
├── UI/Component Work Only?
│   └── npm run dev
├── Need Real Backend?
│   ├── Check QEMU: npm run qemu:status
│   ├── Start if needed: npm run qemu:start
│   └── Dev with backend: npm run qemu:dev
└── Ready to Deploy?
    └── npm run deploy:qemu
```

## 🎯 Quick Command Reference

```bash
# Environment Setup
npm install                  # Install dependencies
npm run verify:setup        # Verify environment

# Development
npm run dev                 # Basic frontend dev
npm run qemu:dev           # Dev with QEMU backend

# QEMU Management
npm run qemu:status        # Check status
npm run qemu:start         # Start QEMU
npm run qemu:stop          # Stop QEMU
npm run qemu:restart       # Restart QEMU

# Deployment
npm run deploy:qemu        # Build + deploy (recommended)
npm run build:production   # Build only
npm run qemu:deploy        # Deploy only

# Testing
npm test                   # Run test suite
npm run test:integration   # Integration tests
npm run lint              # Code quality checks
```

## 🔗 Access Points

- **Development Server**: http://localhost:8080
- **QEMU LibreMesh**: http://10.13.0.1
- **Deployed App**: http://10.13.0.1/app
- **QEMU Console**: `sudo screen -r libremesh`

## 💡 Pro Tips

1. **Always verify QEMU status** before assuming backend issues
2. **Use one-command deployment** (`npm run deploy:qemu`) for consistency
3. **Monitor logs** during deployment for hidden issues
4. **Source map warnings** from timeago.js are harmless
5. **Bundle size warnings** are expected for production builds
6. **Keep QEMU running** during development for faster iteration

## 📚 Further Reading

- [CLAUDE.md](../../CLAUDE.md) - Comprehensive project context
- [QEMU Integration](../02-development/qemu-integration.md) - Detailed QEMU setup
- [Development Setup](development-setup.md) - Complete setup guide
- [Architecture Overview](../01-architecture/overview.md) - System architecture
- [Tutorial.md](../../Tutorial.md) - Complete development guide