# 🌐 LiMeApp

> **Beautiful, geek-free web interface for LibreMesh community networks**

[![Build Status](https://img.shields.io/travis/libremesh/lime-app/develop?style=for-the-badge)](https://travis-ci.org/libremesh/lime-app) 
[![License](https://img.shields.io/github/license/libremesh/lime-app?style=for-the-badge)](./LICENSE)
[![LibreMesh](https://img.shields.io/badge/LibreMesh-Community-brightgreen?style=for-the-badge)](https://libremesh.org)
[![Preact](https://img.shields.io/badge/Built_with-Preact-673ab8?style=for-the-badge&logo=preact)](https://preactjs.com)

---

> **🛠️ Team Developer?**  
> **📚 [**Access Complete Development Documentation**](docs/dev-internal/)** - Includes AI+Human workflows, advanced setup, QEMU integration, tools and much more.  
> 
> <sub>💡 *If you're seeing this in upstream, this is development fork specific content - you can ignore it*</sub>

---

<p align="center">
  <img height="480" src="docs/assets/screenshots.gif" alt="LiMeApp Interface Screenshots" />
</p>

---

## 🎯 What is LiMeApp?

**LiMeApp** is the modern web interface that makes LibreMesh mesh networks accessible to everyone. Built with **Preact** for performance and designed for simplicity, it transforms complex network management into an intuitive experience.

### ✨ Key Features

- 🚀 **Zero-configuration setup** - Works out of the box
- 📱 **Responsive design** - Perfect on mobile and desktop  
- 🌍 **24 languages** - Truly international community software
- 🔌 **Plugin architecture** - Extensible and modular
- ⚡ **Optimized bundle** - <1MB total size, fast loading on limited bandwidth
- 🔒 **Secure by design** - Built-in authentication and validation

---

## 🚀 Quick Start

> **🎭 Smart Documentation Routing**
> 
> 📖 **Community Contributors**: Continue with this README for standard setup  
> 🛠️ **Team Members**: Check if you have access to [**internal development docs**](docs/dev-internal/) for enhanced workflows

### 🏃 Get Running in 30 Seconds

```bash
# Clone and setup
git clone https://github.com/libremesh/lime-app.git
cd lime-app
npm install

# Start developing immediately
npm run dev

# 🎉 Open http://localhost:8080
```

### 🎛️ Development Options

<table>
<tr>
<td width="33%">

#### 🏠 **Frontend-Only**
*Perfect for UI development*

```bash
npm run dev
```

✅ Hot-reload development  
✅ Zero dependencies (works immediately)  
✅ Fast iteration  
✅ Localhost backend (no setup needed)  
✅ All deployment infrastructure functional  

</td>
<td width="33%">

#### 🖥️ **Real LibreMesh**
*Full integration testing*

```bash
# See DEVELOPMENT_SETUP.md
npm run qemu:start
npm run qemu:dev
```

✅ Authentic backend  
✅ Real mesh features  
✅ Complete API testing  
✅ Production-like environment  

</td>
<td width="33%">

#### 📡 **Your Router**
*Connect to existing device*

```bash
NODE_HOST=192.168.1.1 npm run dev
```

✅ Real hardware testing  
✅ Live network access  
✅ Custom configurations  
✅ Field testing  

</td>
</tr>
</table>

---

## 🏗️ Architecture

### 🧩 Plugin System

LiMeApp's modular architecture makes it easy to add new features:

```javascript
// Create a new plugin
npm run create-plugin MyFeature

// Automatically generates:
plugins/lime-plugin-myfeature/
├── 📄 index.ts              # Plugin registration
├── 🧪 myfeature.spec.js     # Comprehensive tests  
├── 📚 myfeature.stories.js  # Storybook documentation
└── 📁 src/
    ├── 📱 MyFeaturePage.js  # Main component
    ├── 🧭 MyFeatureMenu.js  # Navigation integration
    ├── 🔌 MyFeatureApi.js   # Backend connectivity
    └── 🎨 style.less        # Component styling
```

### 🔄 State Management

**100% TanStack Query** - Redux completely eliminated for modern, declarative data flow:

```javascript
// Reactive data fetching
const { data: nodes, isLoading } = useQuery(['nodes'], getNetworkNodes);

// Optimistic updates  
const mutation = useMutation(updateNodeConfig, {
  onSuccess: () => queryClient.invalidateQueries(['nodes'])
});
```

### 🌐 Backend Integration

Seamless communication with LibreMesh via **ubus JSON-RPC**:

```javascript
// Clean API abstraction
export const getSystemInfo = () => api.call('system', 'board', {});
export const setNetworkConfig = (config) => api.call('network', 'set', { config });
```

---

## 🧪 Testing & Quality

### 🎯 Testing Strategy

```bash
# 🏃 Quick feedback loop
npm test -- --watch

# 📊 Coverage analysis  
npm test -- --coverage

# 🎨 Visual testing
npm run storybook
```

### 🔍 Code Quality

```bash
# ✨ Linting & formatting
npm run lint
npm run lint:fix

# 🏗️ Build verification
npm run build:production

# 🚀 Local production testing
npm run serve

# 📦 Production build testing
npm run serve:production
```

### 🎭 Visual Development

Interactive component development with **Storybook**:

```bash
npm run storybook
# 🎨 http://localhost:8081 - Isolated component playground
```

---

## 🌍 Internationalization

LiMeApp speaks your language! **24 languages** supported:

- 🇪🇸 **Español** (100% complete)
- 🇬🇧 **English** (100% complete)  
- 🇮🇹 **Italiano** (95% complete)
- 🇫🇷 **Français** (90% complete)
- 🇩🇪 **Deutsch** (85% complete)
- ...and 19 more!

### 🗣️ Contributing Translations

```bash
# Extract translatable strings
npm run translations:extract

# Compile translations  
npm run translations:compile
```

See [CONTRIBUTING.md](CONTRIBUTING.md#translations) for translation guidelines.

---

## 🚀 Production Deployment

### 📦 Build for Production

```bash
# Optimized production build
npm run build:production
```

**Includes:**
- 🗜️ Code minification and tree-shaking
- 🌍 Translation compilation  
- 📊 Bundle analysis and optimization
- 🔒 Security hardening

### 📡 Deploy to Router

```bash
# Build and copy to LibreMesh router
npm run build:production
scp -r build/* root@router-ip:/www/app/
```

**Access your deployment:**
- 🌐 Router web interface: `http://router-ip`
- 🚀 LiMeApp: `http://router-ip/app`
- 📱 Mobile-friendly: `http://thisnode.info/app`

---

## 🤝 Contributing

### 🌟 Join the Community

LiMeApp thrives on community contributions! Whether you're:

- 🎨 **Designer** - Improve UX/UI
- 💻 **Developer** - Add features or fix bugs  
- 🌍 **Translator** - Help reach more communities
- 📚 **Writer** - Enhance documentation
- 🧪 **Tester** - Ensure quality across devices

**Your contribution matters!**

### 🛠️ Development Workflow

1. 🍴 **Fork** the repository
2. 🌿 **Branch**: `git checkout -b feature/amazing-feature`
3. 🧪 **Test**: `npm test` and `npm run lint`
4. 📝 **Commit**: Follow [conventional commits](https://conventionalcommits.org/)
5. 🚀 **Push**: `git push origin feature/amazing-feature`
6. 🎯 **Pull Request**: Clear description with screenshots

### 📋 Quick Contribution Checklist

- [ ] 🧪 Tests pass (`npm test`)
- [ ] ✨ Code is linted (`npm run lint`)
- [ ] 📱 Works on mobile and desktop
- [ ] 🌍 Strings are translatable
- [ ] 📚 Documentation updated
- [ ] 🎨 Screenshots for UI changes

### 📖 Documentation

- 📘 **[Tutorial](docs/Tutorial.md)** - Comprehensive development guide
- 🛠️ **[Development Setup](DEVELOPMENT_SETUP.md)** - Environment configuration  
- 🤝 **[Contributing Guidelines](CONTRIBUTING.md)** - Detailed contribution process
- 🏗️ **[Architecture Overview](docs/dev-internal/01-architecture/overview.md)** - System design (if accessible)

---

## 🌟 Community & Support

### 💬 Get Connected

- 💬 **Matrix**: [#libremesh:matrix.org](https://matrix.to/#/#libremesh:matrix.org)
- 📧 **Mailing List**: [lime-users@lists.libremesh.org](mailto:lime-users@lists.libremesh.org)
- 🐛 **Issues**: [GitHub Issues](https://github.com/libremesh/lime-app/issues)
- 🌐 **Website**: [libremesh.org](https://libremesh.org)

### 🎓 Learning Resources

- 📖 **LibreMesh Docs**: [libremesh.org/docs](https://libremesh.org/docs/)
- 🎥 **Video Tutorials**: Community workshops and talks
- 📱 **Live Demo**: [demo.libremesh.org](http://demo.libremesh.org) (when available)
- 🗺️ **Mesh Maps**: See LibreMesh networks worldwide

### 🏆 Project Stats

- ⭐ **GitHub Stars**: Building a strong community
- 🌍 **Languages**: 24+ supported languages  
- 📱 **Deployments**: Thousands of community networks
- 🤝 **Contributors**: Growing international team
- 📊 **Code Quality**: 85%+ test coverage

---

## 📄 License

**Apache 2.0 License** - see [LICENSE](LICENSE) file for details.

Built with ❤️ by the LibreMesh community for mesh networking worldwide.

---

<p align="center">
  <strong>🌐 Empowering Community Networks Everywhere</strong><br>
  <em>Made with Preact • Powered by LibreMesh • Driven by Community</em>
</p>

<p align="center">
  <a href="https://libremesh.org">🌐 Website</a> •
  <a href="docs/Tutorial.md">📚 Tutorial</a> •
  <a href="CONTRIBUTING.md">🤝 Contribute</a> •
  <a href="https://matrix.to/#/#libremesh:matrix.org">💬 Chat</a>
</p>