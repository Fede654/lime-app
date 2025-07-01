# Security Guide

This guide provides security guidelines and vulnerability management practices for LimeApp development and deployment.

## Security Overview

LimeApp operates in a security-sensitive environment as the primary management interface for mesh network infrastructure. Security considerations span from development practices to production deployment.

```
┌─────────────────────────────────────────────────────┐
│                Security Layers                      │
│                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │Application  │ │   Network   │ │   System    │   │
│  │Security     │ │  Security   │ │  Security   │   │
│  │             │ │             │ │             │   │
│  │• XSS Protect│ │• HTTPS      │ │• Auth       │   │
│  │• Input Valid│ │• CSRF Token │ │• Session    │   │
│  │• Dep. Mgmt  │ │• Same Origin│ │• Access Ctrl│   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Current Security Status

### Vulnerability Assessment (as of 2025-01-07)
```
Current Status: 🚨 CRITICAL
Total Vulnerabilities: 117
├── Critical: 9   (Code execution, supply chain)
├── High: 36      (CSRF, path traversal, XSS)
├── Moderate: 72  (Dependency chain issues)

Risk Assessment:
├── Development Risk: HIGH - Vulnerable build process
├── Runtime Risk: HIGH - Production CSRF/XSS exposure
├── Supply Chain Risk: CRITICAL - Compromised packages
└── Compliance Risk: CRITICAL - Security audits fail
```

### Priority Vulnerabilities

#### Critical (Fix Immediately)
1. **Babel Code Execution (CVE-2023-45133)**
   - **Package**: `@babel/traverse`
   - **Risk**: Remote code execution during build
   - **Fix**: Update to `@babel/traverse@7.23.2+`

2. **Supply Chain Attacks**
   - **Packages**: Multiple transitive dependencies
   - **Risk**: Malicious code injection
   - **Fix**: Audit and update entire dependency tree

#### High Priority (Fix This Week)
1. **CSRF Vulnerabilities**
   - **Package**: `tough-cookie@4.0.0`
   - **Risk**: Cross-site request forgery
   - **Fix**: Update to `tough-cookie@4.1.3+`

2. **Path Traversal**
   - **Package**: `webpack-dev-middleware@5.3.3`
   - **Risk**: Arbitrary file access
   - **Fix**: Update to `webpack-dev-middleware@5.3.4+`

## Development Security Practices

### Dependency Management

#### Vulnerability Scanning
```bash
# Regular security audits
npm audit                              # Basic audit
npm audit --audit-level moderate       # Moderate+ only
npm audit fix                          # Auto-fix safe issues
npm audit fix --force                  # Force fix (review changes)

# Advanced scanning
npx audit-ci --moderate                # CI/CD integration
npx better-npm-audit audit             # Enhanced reporting
```

#### Dependency Updates
```bash
# Check for updates
npm outdated                           # Show outdated packages
npx npm-check-updates                  # Interactive update tool
npx npm-check-updates -u               # Update package.json

# Security-focused updates
npm update --save                      # Update within semver range
npm install package@latest             # Update to latest version
```

#### Dependency Policies
```json
// package.json security policies
{
  "overrides": {
    "tough-cookie": ">=4.1.3",
    "@babel/traverse": ">=7.23.2",
    "webpack-dev-middleware": ">=5.3.4"
  },
  "resolutions": {
    "minimist": ">=1.2.6",
    "follow-redirects": ">=1.15.4"
  }
}
```

### Secure Coding Practices

#### Input Validation
```javascript
// Always validate and sanitize user input
const validateHostname = (hostname) => {
  // Prevent injection attacks
  if (!/^[a-zA-Z0-9-]+$/.test(hostname)) {
    throw new Error('Invalid hostname format');
  }
  if (hostname.length > 63) {
    throw new Error('Hostname too long');
  }
  return hostname.toLowerCase();
};

// API parameter validation
export const setHostname = (hostname) => {
  const validHostname = validateHostname(hostname);
  return api.call('lime-utils', 'set_hostname', { 
    hostname: validHostname 
  });
};
```

#### XSS Prevention
```javascript
// Use framework XSS protection
import { Trans } from '@lingui/macro';

// ✅ Safe - framework handles escaping
const SafeComponent = ({ userInput }) => (
  <div>
    <Trans>Welcome {userInput}</Trans>
  </div>
);

// ❌ Dangerous - direct HTML injection
const DangerousComponent = ({ userInput }) => (
  <div dangerouslySetInnerHTML={{ __html: userInput }} />
);

// ✅ Safe alternative with sanitization
import DOMPurify from 'dompurify';

const SafeHTMLComponent = ({ userInput }) => (
  <div dangerouslySetInnerHTML={{ 
    __html: DOMPurify.sanitize(userInput) 
  }} />
);
```

#### Secret Management
```javascript
// ❌ Never commit secrets
const API_KEY = 'sk-1234567890abcdef'; // DON'T DO THIS

// ✅ Use environment variables
const API_KEY = process.env.LIME_APP_API_KEY;

// ❌ Never log sensitive data
console.log('User credentials:', { username, password });

// ✅ Log safely
console.log('Authentication attempt for user:', username);
```

### Authentication and Authorization

#### Session Management
```javascript
// Secure session handling
export const authenticateUser = async (username, password) => {
  try {
    // Use secure API call
    const response = await api.call('session', 'login', {
      username: username.trim(),
      password: password // Don't log this
    });
    
    // Store session securely
    sessionStorage.setItem('sessionId', response.ubus_rpc_session);
    
    return response;
  } catch (error) {
    // Don't expose internal error details
    throw new Error('Authentication failed');
  }
};

// Session validation
export const validateSession = async () => {
  const sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    throw new Error('No session found');
  }
  
  try {
    await api.call('session', 'access', {}, sessionId);
    return true;
  } catch (error) {
    // Clear invalid session
    sessionStorage.removeItem('sessionId');
    throw new Error('Session expired');
  }
};
```

#### Route Protection
```javascript
// Protected route component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    validateSession()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);
  
  if (isLoading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return children;
};
```

### Content Security Policy

#### CSP Configuration
```javascript
// uhttpd CSP configuration
const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'", // Minimize unsafe-inline
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self' ws: wss:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join('; ');

// Apply via meta tag or HTTP header
<meta httpEquiv="Content-Security-Policy" content={cspHeader} />
```

## Production Security

### HTTPS Configuration
```bash
# Generate SSL certificate for router
opkg update
opkg install luci-ssl
```

### Router Security Hardening
```bash
# Disable unnecessary services
/etc/init.d/telnet stop
/etc/init.d/telnet disable

# Configure firewall
uci set firewall.@defaults[0].input='REJECT'
uci set firewall.@defaults[0].output='ACCEPT'
uci set firewall.@defaults[0].forward='REJECT'
uci commit firewall
```

### Access Control
```json
// /usr/share/rpcd/acl.d/lime-app.json
{
  "lime-app": {
    "description": "LimeApp access control",
    "read": {
      "ubus": {
        "lime-utils": ["get_node_status", "get_config"],
        "lime-location": ["get_location"],
        "lime-metrics": ["get_internet_status"]
      }
    },
    "write": {
      "ubus": {
        "lime-utils": ["set_hostname", "set_password"],
        "lime-location": ["set_location"]
      }
    }
  }
}
```

## Vulnerability Management Process

### Detection and Assessment
```bash
# Automated vulnerability scanning (CI/CD)
name: Security Audit
on: [push, pull_request, schedule]

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm audit --audit-level moderate
      - run: npx audit-ci --moderate
```

### Incident Response Process

#### Severity Classification
- **Critical**: Remote code execution, privilege escalation
- **High**: Data disclosure, authentication bypass  
- **Medium**: Information disclosure, DoS
- **Low**: Minor security weaknesses

#### Response Timeline
- **Critical**: 24 hours to patch/mitigation
- **High**: 72 hours to patch/mitigation
- **Medium**: 1 week to patch
- **Low**: Next release cycle

#### Incident Response Steps
1. **Detection**: Automated scanning or manual discovery
2. **Assessment**: Determine severity and impact
3. **Containment**: Immediate mitigation if possible
4. **Resolution**: Develop and test fix
5. **Deployment**: Release security update
6. **Communication**: Notify stakeholders
7. **Post-mortem**: Prevent similar issues

### Security Updates

#### Emergency Security Release Process
```bash
# 1. Create security branch
git checkout -b security/fix-cve-2023-xxxx

# 2. Apply minimal fix
git commit -m "security: fix CVE-2023-XXXX"

# 3. Security testing
npm audit
npm test
npm run build

# 4. Emergency release
npm version patch
npm run build:production
git tag -a v0.2.27-security -m "Security fix for CVE-2023-XXXX"

# 5. Deploy immediately
# 6. Notify LibreMesh maintainers
```

## Security Testing

### Static Analysis
```bash
# ESLint security rules
npm install --save-dev eslint-plugin-security

# .eslintrc.js
{
  "plugins": ["security"],
  "extends": ["plugin:security/recommended"],
  "rules": {
    "security/detect-object-injection": "error",
    "security/detect-non-literal-regexp": "error",
    "security/detect-eval-with-expression": "error"
  }
}
```

### Dynamic Testing
```javascript
// Security test examples
describe('Security Tests', () => {
  it('should sanitize user input', () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const result = sanitizeInput(maliciousInput);
    expect(result).not.toContain('<script>');
  });
  
  it('should validate session tokens', async () => {
    const invalidToken = 'invalid-token';
    await expect(validateSession(invalidToken))
      .rejects.toThrow('Invalid session');
  });
  
  it('should prevent SQL injection in API calls', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    await expect(setHostname(maliciousInput))
      .rejects.toThrow('Invalid hostname format');
  });
});
```

### Penetration Testing
```bash
# OWASP ZAP automated testing
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://thisnode.info/app/

# Manual testing checklist
- [ ] XSS in all input fields
- [ ] CSRF protection on state-changing operations
- [ ] Session management security
- [ ] Authentication bypass attempts
- [ ] Authorization privilege escalation
- [ ] Input validation on all APIs
```

## Security Monitoring

### Runtime Security Monitoring
```javascript
// Security event logging
const logSecurityEvent = (event, details) => {
  console.warn(`[SECURITY] ${event}:`, {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...details
  });
};

// Monitor for suspicious activity
window.addEventListener('error', (event) => {
  if (event.message.includes('script')) {
    logSecurityEvent('POTENTIAL_XSS', {
      message: event.message,
      source: event.filename
    });
  }
});

// API call monitoring
const secureApiCall = (originalCall) => {
  return async (service, method, params) => {
    // Log sensitive operations
    if (method.includes('set_') || method.includes('delete_')) {
      logSecurityEvent('ADMIN_OPERATION', {
        service,
        method,
        paramsKeys: Object.keys(params || {})
      });
    }
    
    return originalCall(service, method, params);
  };
};
```

### Compliance and Auditing

#### Security Checklist for Releases
- [ ] All dependencies updated to secure versions
- [ ] No high/critical vulnerabilities in npm audit
- [ ] Security tests passing
- [ ] Input validation on all user inputs
- [ ] Authentication/authorization working correctly
- [ ] HTTPS configured in production
- [ ] CSP headers configured
- [ ] No secrets in code/logs
- [ ] Session management secure
- [ ] Error messages don't leak sensitive info

#### Regular Security Reviews
- **Monthly**: Dependency vulnerability scan
- **Quarterly**: Full security audit
- **Annually**: Penetration testing
- **Release**: Complete security checklist

## Reporting Security Issues

### Responsible Disclosure
**Contact**: Create issue with `[SECURITY]` prefix or email maintainers directly

**Information to Include**:
- Vulnerability description
- Steps to reproduce
- Impact assessment
- Suggested mitigation
- Affected versions

**Response Timeline**:
- **24 hours**: Acknowledgment
- **72 hours**: Initial assessment
- **1 week**: Detailed response and timeline
- **Timeline varies**: Fix development and release

### Security Advisory Process
1. **Private disclosure** to maintainers
2. **Assessment** and fix development
3. **Coordinated disclosure** with fix release
4. **Public advisory** publication
5. **CVE assignment** if applicable

---

*This security guide should be reviewed and updated regularly as new threats emerge and security practices evolve.*