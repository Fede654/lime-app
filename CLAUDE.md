# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LiMeApp is a Preact-based web application for LibreMesh router management. It provides a geek-free interface for setup and maintenance of LibreMesh nodes, built with a plugin architecture that communicates with router services via ubus JSON-RPC calls.

## Development Commands

### Setup and Dependencies
```bash
npm install                     # Install dependencies
npm install                     # Or with Docker: docker-compose run --rm ui npm i
```

### Development Server
```bash
npm run dev                     # Start development server with hot reload (proxies to 10.13.0.1)
env NODE_HOST=10.5.0.9 npm run dev  # Use custom router IP as backend
```

### Build Commands
```bash
npm run build                   # Development build
npm run build:production        # Production build (extracts and compiles translations)
npm run serve                   # Build and serve production version
```

### Testing
```bash
npm test                        # Run all tests
npm run clear-jest              # Clear Jest cache
npm run test plugins/lime-plugin-name/plugin.spec.js  # Run specific plugin test
npm run test -- --watch         # Run tests in watch mode
npm run test -- --coverage      # Run tests with coverage report
npm run test -- --testPathPattern="filename.spec.tsx"  # Run specific test file
```

### Linting and Code Quality
```bash
npm run lint                    # Run TypeScript, ESLint, and Prettier checks
npm run lint:fix                # Auto-fix linting issues
```

### Development Verification and Quality Assurance
```bash
# Environment Verification
npm run verify:setup            # Comprehensive development environment check
npm run verify:qemu             # QEMU LibreMesh environment validation
npm run verify:ai               # AI tools integration check
npm run verify:cross-platform   # Cross-platform compatibility check

# Quality Assurance
npm run qa:fast                 # Quick quality checks (lint)
npm run qa:full                 # Complete QA (test + lint + build + integration)
npm run qa:ai                   # AI-assisted quality analysis
npm run qa:cross-platform       # Cross-platform testing
npm run qa:upstream             # Upstream contribution readiness

# AI-Assisted Development
npm run ai:review               # AI code review and suggestions
npm run ai:security             # AI security vulnerability scan
npm run ai:docs                 # AI documentation completeness check
npm run ai:test                 # AI test validation
```

### Translations (i18n)
```bash
npm run translations:extract    # Extract translatable strings
npm run translations:compile    # Compile translations
```

### Storybook
```bash
npm run storybook              # Start Storybook on port 8081
npm run storybook:build        # Build Storybook
npm run storybook:deploy       # Deploy to GitHub Pages
```

### Plugin Development
```bash
npm run create-plugin <pluginName>  # Bootstrap new plugin structure
```

### QEMU LibreMesh Integration
```bash
npm run qemu:deploy                  # Build and deploy lime-app to lime-packages
npm run qemu:start                   # Build, deploy, and start QEMU LibreMesh
npm run qemu:check                   # Check if QEMU LibreMesh is running
npm run qemu:dev                     # Start development server connected to QEMU
```

## Architecture

### Plugin System
- Each plugin lives in `plugins/lime-plugin-<name>/`
- Plugin structure: `index.ts` exports `{ name, page, menu, additionalRoutes?, additionalProtectedRoutes?, menuGroup? }`
- Plugins are registered in `src/config.ts`
- Menu items are automatically generated from plugin definitions
- **Menu Groups**: Plugins can be grouped using `menuGroup` property (e.g., "meshwide" for mesh-wide related plugins)

### State Management
- **TanStack Query** (formerly React Query): Primary data fetching and caching (modern approach)
- **Redux + RxJS**: Legacy state management (being phased out)
- Global query cache managed by `@tanstack/react-query`
- **Shared State**: Mesh-wide components use shared state synchronization via `components/shared-state/`

### Component Architecture
- **Preact**: React-like framework with smaller bundle size (3kB)
- **JSX**: Component templates with TypeScript support
- **CSS Modules**: Scoped styling via `.less` imports
- **Global styles**: Bootstrap-inspired classes in `src/style/index.less`
- **Tailwind CSS**: Utility-first CSS framework integration

### Backend Communication
- **uHTTPd client**: Singleton service for ubus JSON-RPC calls
- **API endpoints**: Functions that define request URLs and payloads
- **Queries**: Read operations using `useQuery`
- **Mutations**: Write operations using `useMutation`

### Routing
- **Public routes**: Available without authentication
- **Protected routes**: Require root authentication via `CommunityProtectedRoute`
- **First Boot Wizard**: Special routing logic with banner system
- **Path aliases**: Configured in `preact.config.js`

### Testing Strategy
1. **Component tests**: Mock API endpoints, test user interactions (`*.spec.js`)
2. **API tests**: Test endpoint calls and data transformations (`*Api.spec.js`)
3. **Jest + Testing Library**: Primary testing stack with Preact extensions
4. **Test utilities**: `utils/test_utils` provides render helpers with providers
5. **Test isolation**: Each test cleans up query cache and mocks

### Path Aliases
```javascript
~/ → src/
components/ → src/components/
containers/ → src/containers/
utils/ → src/utils/
plugins/ → plugins/
```

### Translation System
- **LinguiJS**: Internationalization framework
- **Extract-compile workflow**: `lingui extract` → `lingui compile`
- **Supported locales**: ar, ast, ca, da, de, el, en, es, eu, fr, it, ko, lb, mk, nb, pt, ru, skr-ARAB, sr-EC, sv, tr, zh-HANS, zh-HANT, zh

## Key Files and Directories

### Core Application
- `src/components/app.tsx`: Main app component with routing
- `src/config.ts`: Plugin registration
- `src/store.js`: Redux store setup (legacy)
- `preact.config.js`: Webpack configuration and dev server proxy

### Plugin Development
- `plugins/lime-plugin-*/index.ts`: Plugin entry points
- `plugins/lime-plugin-*/src/`: Plugin implementation
- `devTools/plugins.js`: Plugin creation utility

### Testing
- `jest.config.js`: Jest configuration with path mapping
- `utils/test_utils.js`: Test utilities and mocks

### Build Configuration
- `package.json`: Scripts and dependencies
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.js`: Tailwind CSS setup
- `postcss.config.js`: PostCSS configuration

### Development Scripts
- `scripts/deploy-to-qemu.sh`: Official LibreMesh integration script
- `scripts/dev-with-qemu.sh`: Development workflow automation

## Development Workflow

### Adding a New Plugin
1. Use `npm run create-plugin <pluginName>` to bootstrap structure
2. Implement component with tests first (TDD approach)
3. Create API endpoints with tests (`*Api.js` and `*Api.spec.js`)
4. Implement TanStack Query hooks (`*Queries.js`)
5. Add Storybook stories for visual testing (`*.stories.js`)
6. Register plugin in `src/config.ts`

### Component Development Pattern
1. Write component tests with mocked APIs using `render()` from `utils/test_utils`
2. Implement component to pass tests
3. Write API endpoint tests with proper mock cleanup
4. Implement API endpoints following ubus JSON-RPC pattern
5. Create Storybook stories for component states
6. Add styling with CSS modules (`.less`) or global classes

### Plugin Structure Convention
```
plugins/lime-plugin-<name>/
├── index.ts                    # Plugin registration { name, page, menu }
├── <name>.spec.js             # Component tests
├── <name>.stories.js          # Storybook stories
└── src/
    ├── <name>Page.js          # Main component
    ├── <name>Menu.js          # Menu item component
    ├── <name>Api.js           # Backend endpoints
    ├── <name>Api.spec.js      # API tests
    ├── <name>Queries.js       # TanStack Query hooks
    └── style.less             # Component styles
```

### Backend Integration
- Default router IP: `10.13.0.1` (override with `NODE_HOST` env var)
- ubus calls via `/ubus` endpoint (proxied in development)
- CGI scripts via `/cgi-bin/**` endpoint
- Session management with username/password authentication
- JSON-RPC protocol for all API communication

### Testing Best Practices
- Mock API calls using `jest.mock('./src/<name>Api')`
- Clean up query cache after each test: `act(() => queryCache.clear())`
- Use `render()` from `utils/test_utils` for consistent provider setup (includes ToastProvider, I18nProvider, QueryClientProvider)
- Test user interactions with `@testing-library/preact`
- Verify UI state changes with `screen.findBy*` async queries
- **Preact-specific**: Use `Fragment` from `preact` instead of React fragments (`<>`) to avoid "React is not defined" errors
- **Test utilities**: `flushPromises()` available for async test scenarios

## Production Deployment
Built bundles are served from `/www/app/` on LibreMesh routers via uHTTPd webserver at `thisnode.info` or router IP address. The production build includes translation compilation and asset optimization.

### Deployment to Router
```bash
npm run build:production
ssh root@10.13.0.1 "rm -rf /www/app/*" && scp -r ./build/* root@10.13.0.1:/www/app
```

## Development Environment Notes

### QEMU LibreMesh Integration (Official Workflow)

**Prerequisites:**
1. Clone `lime-packages` repository in parent directory: `../lime-packages/`
2. Download LibreMesh development images to `../lime-packages/build/`:
   - `libremesh-2020.4-ow19-x86-64-rootfs.tar.gz` (recommended)
   - `libremesh-2020.4-ow19-x86-64-ramfs.bzImage`
3. Install `qemu-system-x86_64` and `screen` packages

**Recommended LibreMesh Images (Tested & Working):**
```bash
# Download to ../lime-packages/build/
wget -O libremesh-2020.4-ow19-x86-64-rootfs.tar.gz \
  "https://downloads.libremesh.org/releases/2020.4-ow19/targets/x86/64/libremesh-2020.4-ow19-default-x86-64-generic-rootfs.tar.gz"

wget -O libremesh-2020.4-ow19-x86-64-ramfs.bzImage \
  "https://downloads.libremesh.org/releases/2020.4-ow19/targets/x86/64/libremesh-2020.4-ow19-default-x86-64-ramfs.bzImage"
```

**Official Development Commands:**
```bash
# Deploy lime-app to QEMU (official LibreMesh method)
npm run qemu:deploy                    # Build and deploy lime-app
npm run qemu:start                     # Build, deploy, and start QEMU
npm run qemu:check                     # Check QEMU status
npm run qemu:dev                       # Start development server with QEMU backend

# Manual workflow with recommended images
screen -S libremesh -d -m sudo ../lime-packages/tools/qemu_dev_start \
  --libremesh-workdir ../lime-packages \
  ../lime-packages/build/libremesh-2020.4-ow19-x86-64-rootfs.tar.gz \
  ../lime-packages/build/libremesh-2020.4-ow19-x86-64-ramfs.bzImage

# Configure LibreMesh network (in screen session)
screen -r libremesh
ip addr add 10.13.0.1/16 dev br-lan
/etc/init.d/uhttpd start
```

**Development Workflow:**
1. **Deploy to QEMU**: `npm run qemu:deploy` builds and copies lime-app to lime-packages
2. **Start QEMU**: `npm run qemu:start` launches LibreMesh at `http://10.13.0.1`
3. **Development Server**: `npm run qemu:dev` runs lime-app dev server connected to QEMU
4. **Access Points**:
   - **QEMU LibreMesh**: `http://10.13.0.1` (production lime-app)
   - **Development Server**: `http://localhost:8080` (live-reload lime-app with QEMU backend)

**Network Configuration:**
- QEMU creates LibreMesh node at `10.13.0.1`
- Development server proxies `/ubus` and `/cgi-bin/**` to QEMU
- Real ubus JSON-RPC API endpoints for complete testing

### Frontend-Only Development
Without a LibreMesh backend, expect these console errors (normal behavior):
- `/ubus` endpoint 500 errors - no router backend available
- WebSocket connection failures - hot-reload limitation
- JSON parsing errors from API calls - HTML error pages instead of JSON responses

### Common Fixes for Development Issues
- **I18n warnings**: Ensure `i18n.activate()` is called before rendering I18nProvider
- **React fragments in Preact**: Use `import { Fragment } from "preact"` instead of `<>` syntax
- **Missing providers in tests**: Use `render()` from `utils/test_utils` which includes all necessary providers

## Human-AI Collaborative Development

This project supports **human-AI collaborative development** across multiple platforms and AI tools. The framework is designed for teams using Claude Code, Cursor, GitHub Copilot, and other AI assistants.

### Quick Start for AI Collaboration

```bash
# Verify AI tools integration
npm run verify:ai

# Start development with environment verification
npm run dev:start

# AI-assisted quality checks
npm run qa:ai

# AI code review
npm run ai:review
```

### Development Organization Framework

See [DEVELOPMENT_ORGANIZATION.md](./DEVELOPMENT_ORGANIZATION.md) for complete guidelines on:

- **Team Composition**: Human developers + AI assistants roles and responsibilities
- **AI Tool Specialization**: When to use Claude Code vs Cursor vs GitHub Copilot
- **Collaborative Workflow Patterns**: Architecture-first, TDD with AI, Debug-driven development
- **Quality Assurance Framework**: AI-assisted code review, security scanning, documentation checks
- **Cross-Platform Development**: Windows (WSL2), Linux, macOS support with AI tools
- **Contribution Workflow**: From internal development to upstream contribution

### AI Assistance Best Practices

**For Claude Code (Terminal-based):**
- Complex debugging sessions and QEMU troubleshooting
- Architectural analysis and comprehensive testing strategies
- Documentation generation and code organization

**For Cursor (IDE-integrated):**
- Real-time code completion and component development
- Inline refactoring and code exploration
- Quick prototyping with `Ctrl+K` for natural language to code

**For GitHub Copilot:**
- Function implementations from comments
- Test case generation and boilerplate code
- Type definitions and interface creation

### AI Quality Gates

The project includes automated AI-assisted quality checks:

```bash
npm run qa:ai           # Comprehensive AI quality analysis
npm run ai:review       # Code review with AI suggestions
npm run ai:security     # AI security vulnerability scanning
npm run ai:docs         # AI documentation completeness check
```

### Commit Message Format for AI Assistance

When AI tools assist with development, use this format:

```bash
git commit -m "feat(component): add mesh node status visualization

- Implemented TypeScript React component with real-time updates
- Added comprehensive test suite with 95% coverage
- Created Storybook stories for all component states

🤖 AI-assisted with: Cursor for component structure
🤖 AI-assisted with: Claude Code for testing strategy"
```

This framework ensures effective collaboration while maintaining code quality and preparing for upstream contributions to the LibreMesh project.

## Development Wisdom & Best Practices

### Strategic Development Insights

**Human-AI Collaborative Development**
- **Production-ready framework**: Claude Code + Cursor + GitHub Copilot integration tested and validated
- **Cross-platform compatibility**: Windows WSL2, Linux, macOS achievable with proper verification tooling
- **AI tool specialization**: Claude Code (debugging/architecture), Cursor (IDE integration), GitHub Copilot (completion)

**LibreMesh Development Environment**
- **QEMU integration**: Gold standard for authentic LibreMesh development environment
- **Stable images**: Use LibreMesh 2020.4-ow19 (avoid 2024.1 due to missing ethernet drivers)
- **Network configuration**: Essential command `ip addr add 10.13.0.1/16 dev br-lan`
- **Workflow**: Console access via `screen -r libremesh`, development via `npm run qemu:dev`

**Documentation as Development Infrastructure**
- **Multi-level architecture**: README (quick start) → DEVELOPMENT_SETUP (comprehensive) → DEVELOPMENT_ORGANIZATION (framework)
- **Verification scripts**: `npm run verify:setup` dramatically improves developer onboarding success rate
- **AI transparency**: Assistance markers (`🤖 AI-assisted with: [tool] for [task]`) provide valuable contribution tracking

### Technical Architecture Patterns

**Quality Gates Framework**
```bash
npm run verify:setup         # Prevents 90% of setup issues
npm run qa:ai                # AI-assisted quality checks complement human review
npm run qa:upstream          # Prepares code for main repository standards
npm run test:cross-platform  # Catches platform-specific bugs early
```

**npm Scripts as Development Orchestration**
- **Organized naming**: 25+ scripts with clear patterns `verify:*`, `qa:*`, `ai:*`, `test:*`
- **Workflow simplification**: `npm run dev:start` = verify + setup + dev server
- **Cognitive load reduction**: Discoverable workflows improve team productivity

### AI Collaboration Patterns Validated

**Tool Specialization Strategy**
- **Claude Code**: Complex debugging, systematic problem-solving, comprehensive documentation
- **Cursor**: Real-time coding assistance, component development, IDE integration  
- **GitHub Copilot**: Function completion, boilerplate generation, test scaffolding

**Proven Workflow Patterns**
- **Architecture-First**: Human defines structure → AI generates implementation
- **TDD with AI**: Human writes failing tests → AI creates passing implementation
- **Debug-Driven**: Human identifies issue → AI provides systematic debugging
- **Documentation-Enhanced**: Better project docs = better AI assistance quality

### Context Management Best Practices

**AI Effectiveness Multipliers**
- **Project memory**: Maintain CLAUDE.md as AI's persistent knowledge base
- **Clear organization**: File structure affects AI understanding dramatically
- **Feedback loops**: Verification scripts provide AI with quality validation
- **Task tracking**: Todo lists essential for complex project coordination

**Quality Assurance Standards**
- **Script compliance**: shellcheck validation prevents production shell script issues
- **Documentation investment**: Comprehensive docs reduce long-term support burden
- **Commit hygiene**: Professional commit messages facilitate future maintenance
- **Platform foresight**: Cross-platform considerations upfront save significant debugging time

### Repository Community Insights

**LibreMesh Project Spirit**
- **Multilingual nature**: Genuinely international (24 languages, Spanish 100% translated)
- **Standards balance**: International development standards (English) + local community needs coexist
- **Contribution timing**: Consolidate technical presence first, expand linguistically when established

**Upstream Contribution Strategy**
- **Quality alignment**: Use quality gates (`npm run qa:upstream`) to meet main repository standards
- **Documentation organization**: Clear structure facilitates contribution back to LibreMesh project
- **Collaboration transparency**: Human-AI partnership transparency builds maintainer trust

### Development Velocity & Success Patterns

**Proven Implementation Approach**
- **Systematic methodology**: plan → implement → test → polish → commit
- **Verification-first development**: Catch issues before they become problems
- **Focused productivity**: 3,716 lines of production-ready code/documentation in single focused session
- **AI partnership model**: Treat AI assistants as specialized team members, not magic solutions

**Success Factors for Human-AI Projects**
- **Context excellence**: Provide AI with comprehensive context (documentation, verification scripts, clear structure)
- **Quality investment**: Focus on quality over speed - tooling investments pay immediate dividends
- **Synergy achievement**: Human creativity + AI efficiency = force multiplier for complex technical projects

---

*This wisdom forms the foundation for effective human-AI collaborative development on LibreMesh projects and serves as a reference for future development teams.*