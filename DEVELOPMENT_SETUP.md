# LiMeApp Development Setup

Complete guide for setting up a LibreMesh development environment for lime-app.

## Prerequisites

- **Node.js** (v20 or later)
- **npm** (latest version)  
- **Git**

### Install Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora/RHEL
sudo dnf install nodejs npm

# macOS
brew install node
```

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/libremesh/lime-app.git
cd lime-app

# Install dependencies
npm install
```

### 2. Start Development

```bash
# Start development server
npm run dev

# Access the application at http://localhost:8080
```

The development server provides:
- **Hot-reload**: Automatic browser refresh on code changes
- **Mock backend**: Simulated LibreMesh API responses for development
- **Proxy configuration**: Redirects API calls when real backend available

## Development Workflow

### Plugin Development

LiMeApp uses a plugin-based architecture. Create new functionality as plugins:

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

### Testing

```bash
# Run all tests
npm test

# Run specific plugin tests
npm run test plugins/lime-plugin-myfeature/

# Run with coverage
npm run test -- --coverage

# Watch mode for development
npm run test -- --watch
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Type checking (if using TypeScript)
npm run build
```

### Component Development

Use Storybook for isolated component development:

```bash
# Start Storybook
npm run storybook

# Access at http://localhost:8081
```

## API Development

### Backend Communication

LiMeApp communicates with LibreMesh routers via ubus JSON-RPC calls:

```javascript
// Example API endpoint
import api from 'utils/uhttpd';

export const getSystemInfo = () => 
  api.call('system', 'board', {});

export const setConfig = (config) => 
  api.call('uci', 'set', { config });
```

### Testing APIs

Mock APIs in component tests:

```javascript
// Mock the API module
jest.mock('./src/MyFeatureApi');

test('component loads data', async () => {
  getSystemInfo.mockResolvedValue({ status: 'ok', data: {} });
  // Test component behavior
});
```

## Build and Deployment

### Development Build

```bash
npm run build
```

### Production Build

```bash
npm run build:production
```

Production builds include:
- Code minification
- Asset optimization  
- Translation compilation
- Bundle analysis

### Deploy to Router

```bash
# Build production version
npm run build:production

# Copy to LibreMesh router
scp -r build/* root@router-ip:/www/app/
```

## Project Structure

```
lime-app/
├── src/                    # Core application code
│   ├── components/         # Reusable UI components
│   ├── containers/         # Page-level components
│   ├── utils/             # Utilities and helpers
│   └── config.ts          # Plugin registration
├── plugins/               # Plugin modules
│   └── lime-plugin-*/     # Individual plugins
├── i18n/                  # Translation files
└── docs/                  # Documentation
```

## Contributing

### Development Process

1. **Fork** the repository on GitHub
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Write tests** for new functionality
4. **Implement** the feature following existing patterns
5. **Test** thoroughly with `npm test` and `npm run lint`
6. **Submit** a pull request with clear description

### Code Standards

- **ES6+** JavaScript with modern features
- **Preact** components with hooks
- **CSS Modules** for component styling
- **Jest** for testing with Testing Library
- **ESLint** and **Prettier** for code formatting

### Plugin Guidelines

- Follow the standard plugin structure
- Include comprehensive tests
- Add Storybook stories for components
- Document API endpoints
- Support internationalization

## Resources

### Documentation
- **LibreMesh**: https://libremesh.org/docs/
- **Preact**: https://preactjs.com/guide/
- **Testing Library**: https://testing-library.com/docs/preact-testing-library/intro/

### Community
- **GitHub**: https://github.com/libremesh/lime-app
- **Matrix**: #libremesh:matrix.org
- **Mailing List**: lime-users@lists.libremesh.org

---

*For advanced development setups including QEMU integration and debugging tools, see the internal development documentation.*