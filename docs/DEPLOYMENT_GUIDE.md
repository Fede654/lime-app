# Production Deployment Guide

This guide covers the complete process for building, testing, and deploying LimeApp to production environments within the LibreMesh ecosystem.

## Deployment Overview

LimeApp follows a coordinated release process that integrates with the LibreMesh package management system and OpenWrt distribution channels.

```
┌─────────────────────────────────────────────────────┐
│                Release Pipeline                     │
│                                                     │
│  Development → Testing → Integration → Production   │
│       │           │          │           │         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │Features │ │Security │ │LibreM   │ │OpenWrt  │   │
│  │& Fixes  │ │Testing  │ │Package  │ │Release  │   │
│  │         │ │& CI/CD  │ │Build    │ │Channel  │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────────────────┘
```

## Release Types

### Development Releases
- **Purpose**: Feature testing and development
- **Frequency**: Weekly or on-demand
- **Audience**: Developers and early testers
- **Stability**: Experimental

### Release Candidates
- **Purpose**: Pre-production testing
- **Frequency**: Before major/minor releases
- **Audience**: Beta testers and LibreMesh community
- **Stability**: Feature-complete, undergoing testing

### Production Releases
- **Purpose**: Stable public release
- **Frequency**: Monthly (patch) / Quarterly (minor) / Annually (major)
- **Audience**: All LibreMesh users
- **Stability**: Production-ready

### Security Releases
- **Purpose**: Critical security fixes
- **Frequency**: As needed (emergency)
- **Audience**: All users (immediate update required)
- **Stability**: Minimal changes, focused on security

## Pre-deployment Checklist

### Development Readiness
```bash
# 1. Code Quality
npm run lint                           # No linting errors
npm run test                           # All tests passing
npm run build                          # Successful build

# 2. Security Validation
npm audit --audit-level moderate       # No moderate+ vulnerabilities
npx audit-ci --moderate                # CI security checks pass

# 3. Performance Validation
npm run build:production               # Production bundle created
ls -la build/                          # Check bundle size (<1.5MB)

# 4. Translation Completeness
npm run translations:extract           # Extract new strings
npm run translations:compile           # Compile all locales
```

### Integration Testing
```bash
# 1. LibreMesh Integration
# Test with real LibreMesh backend
env NODE_HOST=192.168.1.1 npm run dev

# 2. Multi-node Testing
# Test shared-state coordination across nodes

# 3. Cross-platform Testing
# Test on multiple OpenWrt versions

# 4. Performance Testing
# Test on router hardware
```

## Build Process

### Development Build
```bash
# Quick build for development
npm run build

# Output: build/ directory with development assets
# - Includes source maps
# - Unminified code
# - Development error messages
```

### Production Build
```bash
# Full production build
npm run build:production

# Process:
# 1. Extract translatable strings
# 2. Compile translations
# 3. Build with optimizations
# 4. Remove source maps
# 5. Compress assets

# Output: build/ directory with production assets
# - Minified and compressed
# - No source maps
# - Optimized bundle splitting
```

### Build Verification
```bash
# Verify build integrity
npm run serve                          # Test production build locally

# Check bundle analysis
npx webpack-bundle-analyzer build/static/js/*.js

# Performance testing
lighthouse http://localhost:5000 --output json

# Security scanning
npm audit --production
```

## Version Management

### Semantic Versioning
LimeApp follows [Semantic Versioning](https://semver.org/):

- **MAJOR.MINOR.PATCH** (e.g., 0.2.26)
- **MAJOR**: Breaking changes, API changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, security patches

### Version Bump Process
```bash
# Patch release (0.2.26 → 0.2.27)
npm version patch

# Minor release (0.2.26 → 0.3.0)
npm version minor

# Major release (0.2.26 → 1.0.0)
npm version major

# Pre-release (0.2.26 → 0.2.27-beta.1)
npm version prerelease --preid=beta
```

### Git Tagging Strategy
```bash
# Automatic tagging with npm version
npm version patch                      # Creates v0.2.27 tag

# Manual tagging for special releases
git tag -a v0.2.27-security -m "Security fix for CVE-2023-XXXX"

# Release candidate tagging
git tag -a v0.3.0-rc.1 -m "Release candidate 1 for v0.3.0"
```

## LibreMesh Package Integration

### Package Build Process
```bash
# 1. Create release archive
npm run build:production
tar -czf lime-app-v0.2.27.tar.gz build/

# 2. Calculate package hash
sha256sum lime-app-v0.2.27.tar.gz

# 3. Update lime-packages Makefile
# Update PKG_VERSION and PKG_HASH in:
# /packages/lime-app/Makefile
```

### Makefile Update
```makefile
# /packages/lime-app/Makefile
PKG_NAME:=lime-app
PKG_VERSION:=0.2.27
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-v$(PKG_VERSION).tar.gz
PKG_HASH:=<calculated_sha256_hash>
PKG_SOURCE_URL:=https://github.com/libremesh/lime-app/releases/download/v$(PKG_VERSION)
```

### OpenWrt Integration
```bash
# Test package build
make package/lime-app/compile V=s

# Full integration test
make clean
make world
```

## Deployment Strategies

### Staged Deployment

#### Stage 1: Development Testing
- **Target**: Development routers and test networks
- **Duration**: 1 week
- **Validation**: Feature functionality, basic integration

#### Stage 2: Beta Testing
- **Target**: LibreMesh community beta testers
- **Duration**: 2 weeks
- **Validation**: Real-world usage, community feedback

#### Stage 3: Release Candidate
- **Target**: Broader testing community
- **Duration**: 1 week
- **Validation**: Production readiness, performance

#### Stage 4: Production Release
- **Target**: All LibreMesh users
- **Process**: Official release through OpenWrt channels

### Rollback Strategy

#### Immediate Rollback (Critical Issues)
```bash
# 1. Revert to previous version
opkg install lime-app=0.2.26

# 2. Restart services
/etc/init.d/uhttpd restart
/etc/init.d/rpcd restart

# 3. Verify functionality
curl -s http://thisnode.info/app/
```

#### Coordinated Rollback (Widespread Issues)
1. **Notify LibreMesh community**
2. **Update package feeds** to previous version
3. **Provide rollback instructions**
4. **Investigate and fix issues**
5. **Prepare emergency patch release**

## Continuous Integration/Continuous Deployment

### CI/CD Pipeline
```yaml
# .github/workflows/cd.yml
name: Continuous Deployment

on:
  push:
    tags:
      - 'v*'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Security audit
        run: npm audit --audit-level moderate
      
      - name: Run tests
        run: npm test
      
      - name: Build production
        run: npm run build:production
      
      - name: Create release archive
        run: tar -czf lime-app-${{ github.ref_name }}.tar.gz build/
      
      - name: Calculate hash
        run: sha256sum lime-app-${{ github.ref_name }}.tar.gz > HASH.txt
      
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            lime-app-${{ github.ref_name }}.tar.gz
            HASH.txt
          draft: false
          prerelease: ${{ contains(github.ref_name, 'rc') || contains(github.ref_name, 'beta') }}
```

### Automated Testing
```yaml
# Quality gates in CI/CD
quality-gates:
  - name: Security Scan
    command: npm audit --audit-level moderate
    required: true
  
  - name: Unit Tests
    command: npm test
    coverage_threshold: 80%
    required: true
  
  - name: Bundle Size Check
    command: npm run build:production && du -sh build/
    max_size: "1.5MB"
    required: true
  
  - name: Performance Audit
    command: lighthouse-ci
    min_score: 85
    required: false
```

## Production Environment Configuration

### Router Deployment
```bash
# 1. Install LimeApp package
opkg update
opkg install lime-app

# 2. Verify installation
ls -la /www/app/
curl -s http://thisnode.info/app/

# 3. Configure services
/etc/init.d/uhttpd enable
/etc/init.d/rpcd enable
/etc/init.d/uhttpd start
/etc/init.d/rpcd start
```

### Network Configuration
```bash
# uHTTPd configuration for production
uci set uhttpd.main.listen_http='0.0.0.0:80'
uci set uhttpd.main.listen_https='0.0.0.0:443'
uci set uhttpd.main.redirect_https='1'
uci commit uhttpd

# Firewall configuration
uci add firewall rule
uci set firewall.@rule[-1].name='Allow-HTTP'
uci set firewall.@rule[-1].target='ACCEPT'
uci set firewall.@rule[-1].src='lan'
uci set firewall.@rule[-1].proto='tcp'
uci set firewall.@rule[-1].dest_port='80'
uci commit firewall
```

### Performance Optimization
```bash
# Enable gzip compression
uci set uhttpd.main.ubus_prefix='/ubus'
uci set uhttpd.main.script_timeout='60'
uci set uhttpd.main.network_timeout='30'
uci commit uhttpd

# Memory optimization
echo 'vm.min_free_kbytes = 2048' >> /etc/sysctl.conf
sysctl -p
```

## Monitoring and Maintenance

### Health Checks
```bash
# Automated health monitoring
#!/bin/sh
# /usr/bin/lime-app-health-check

# Check web server
if ! curl -sf http://localhost/app/ > /dev/null; then
    logger "LimeApp health check failed: Web server not responding"
    /etc/init.d/uhttpd restart
fi

# Check ubus services
if ! ubus list | grep -q lime-utils; then
    logger "LimeApp health check failed: ubus services not available"
    /etc/init.d/rpcd restart
fi

# Check disk space
DISK_USAGE=$(df /www | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    logger "LimeApp health check warning: Low disk space ($DISK_USAGE%)"
fi
```

### Log Monitoring
```bash
# Monitor application logs
tail -f /var/log/uhttpd.log
tail -f /var/log/rpcd.log

# Monitor system logs
logread -f | grep lime-app

# Error pattern detection
logread | grep -E "(error|Error|ERROR)" | grep lime-app
```

### Performance Monitoring
```bash
# Memory usage monitoring
free -m
cat /proc/meminfo | grep -E "(MemTotal|MemFree|MemAvailable)"

# CPU usage monitoring
top -bn1 | grep uhttpd
top -bn1 | grep rpcd

# Network monitoring
netstat -tulpn | grep :80
ss -tulpn | grep uhttpd
```

## Troubleshooting Common Deployment Issues

### Build Failures
```bash
# Common issues and solutions

# 1. Node.js version mismatch
nvm use 18                             # Use Node.js 18
npm rebuild                            # Rebuild native modules

# 2. Memory issues during build
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build:production

# 3. Translation compilation errors
npm run translations:extract           # Re-extract strings
npm run translations:compile           # Re-compile

# 4. Dependency conflicts
rm -rf node_modules package-lock.json
npm install                            # Clean install
```

### Deployment Failures
```bash
# Common deployment issues

# 1. Package installation fails
opkg update                            # Update package lists
opkg list-upgradable                   # Check for conflicts

# 2. Web server not starting
/etc/init.d/uhttpd stop
/etc/init.d/uhttpd start
netstat -tulpn | grep :80              # Check port binding

# 3. ubus services unavailable
/etc/init.d/rpcd restart
ubus list                              # Verify services

# 4. Permission issues
chown -R www-data:www-data /www/app/
chmod -R 644 /www/app/
```

### Performance Issues
```bash
# Performance troubleshooting

# 1. Slow page load
# Check bundle size
ls -lah /www/app/static/js/
# Enable compression
gzip -9 /www/app/static/js/*.js

# 2. Memory leaks
# Monitor memory usage over time
watch -n 5 'free -m'
# Restart services periodically
echo "0 3 * * 0 /etc/init.d/uhttpd restart" >> /etc/crontabs/root

# 3. High CPU usage
# Profile ubus calls
time ubus call lime-utils get_node_status
# Optimize API endpoints
```

## Security Considerations in Deployment

For comprehensive security guidelines, see [SECURITY_GUIDE.md](SECURITY_GUIDE.md).

### Production Security Checklist
- [ ] HTTPS enabled with valid certificates
- [ ] Default passwords changed
- [ ] Unnecessary services disabled
- [ ] Firewall rules configured
- [ ] Access logs enabled
- [ ] Regular security updates scheduled
- [ ] Backup and recovery procedures tested

### Security Updates
```bash
# Emergency security update process
# 1. Receive security advisory
# 2. Build emergency patch
# 3. Test minimal fix
# 4. Deploy to test environment
# 5. Coordinate with LibreMesh team
# 6. Release emergency update
# 7. Notify community immediately
```

## Backup and Recovery

### Backup Procedures
```bash
# Configuration backup
tar -czf lime-app-config-backup.tar.gz \
  /etc/config/uhttpd \
  /etc/config/rpcd \
  /etc/uci-defaults/90_lime-app*

# Application backup
tar -czf lime-app-backup.tar.gz /www/app/

# Full system backup (if needed)
sysupgrade -b /tmp/backup.tar.gz
```

### Recovery Procedures
```bash
# Quick recovery
opkg install --force-reinstall lime-app
/etc/init.d/uhttpd restart
/etc/init.d/rpcd restart

# Full recovery from backup
tar -xzf lime-app-backup.tar.gz -C /
tar -xzf lime-app-config-backup.tar.gz -C /
reboot
```

---

*This deployment guide should be updated with each release to reflect current processes and lessons learned.*