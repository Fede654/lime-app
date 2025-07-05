# LiMeApp

[![Greenkeeper badge](https://badges.greenkeeper.io/libremesh/lime-app.svg)](https://greenkeeper.io/) [![Build Status](https://travis-ci.org/libremesh/lime-app.svg?branch=develop)](https://travis-ci.org/libremesh/lime-app) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> Geek-free Web App for setup and maintenance of LibreMesh nodes built on Preact

<p align="center"><br><br>
    <img height="480" src="docs/assets/screenshots.gif" alt="Screenshots" />
</p>

## Quick Start

**For complete development setup with QEMU LibreMesh backend, see [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)**

### Basic Installation

**Clone this repo:**
```bash
git clone https://github.com/libremesh/lime-app.git limeapp
cd limeapp
npm install
```

### Development Options

#### Option 1: Full LibreMesh Development Environment (Recommended)

For developing with a real LibreMesh backend:

```bash
# Complete setup - see DEVELOPMENT_SETUP.md for details
npm run qemu:start    # Sets up LibreMesh in QEMU
npm run qemu:dev      # Development server with real backend
```

**Provides:**
- Real LibreMesh backend with ubus API
- Complete mesh networking features
- Authentic development environment
- Access to all LibreMesh services

#### Option 2: Frontend-Only Development

For UI development with mocked backend:

```bash
npm run dev
```

**Provides:**
- Hot-reload development server
- Mocked API responses for UI testing
- Faster iteration for frontend changes
- No backend dependencies

#### Option 3: Existing LibreMesh Router

If you have a LibreMesh router available:

```bash
env NODE_HOST=192.168.1.1 npm run dev
```

**Replace `192.168.1.1` with your router's IP address.**

If you want, you can also setup a virtual LibreMesh node following [lime-packages: TESTING.md](https://github.com/libremesh/lime-packages/blob/master/TESTING.md#development-with-qemu-virtual-machine), which will be available at http://10.13.0.1 by default.

### Generate a production build

```bash
npm run build:production
```

Now you can copy the bundles to the router:

```bash
ssh root@10.13.0.1 "rm -rf /www/app/*" && scp -r ./build/* root@10.13.0.1:/www/app
```

### Run tests

```bash
npm test
```

### Development Verification

Ensure your development environment is properly set up:

```bash
npm run verify:setup     # Comprehensive setup verification
npm run verify:qemu      # QEMU LibreMesh environment check
npm run qa:full          # Complete quality assurance
```

### AI-Assisted Development

This project supports human-AI collaborative development:

```bash
npm run verify:ai        # Check AI tools integration
npm run ai:review        # AI-assisted code review
npm run qa:ai            # AI quality checks
```

See [DEVELOPMENT_ORGANIZATION.md](./DEVELOPMENT_ORGANIZATION.md) for complete AI collaboration guidelines.

### Contribute

Please read the ["How to contribute and code of conduct"](CONTRIBUTING.md) documentation.
We also have a [Tutorial](docs/Tutorial.md) for newcomers :)
