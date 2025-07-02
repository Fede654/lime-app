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
```

### Linting and Code Quality
```bash
npm run lint                    # Run TypeScript, ESLint, and Prettier checks
npm run lint:fix                # Auto-fix linting issues
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

## Architecture

### Plugin System
- Each plugin lives in `plugins/lime-plugin-<name>/`
- Plugin structure: `index.ts` exports `{ name, page, menu, additionalRoutes?, additionalProtectedRoutes? }`
- Plugins are registered in `src/config.ts`
- Menu items are automatically generated from plugin definitions

### State Management
- **React Query**: Primary data fetching and caching (modern approach)
- **Redux + RxJS**: Legacy state management (being phased out)
- Global query cache managed by `@tanstack/react-query`

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
- Use `render()` from `utils/test_utils` for consistent provider setup
- Test user interactions with `@testing-library/preact`
- Verify UI state changes with `screen.findBy*` async queries

## Production Deployment
Built bundles are served from `/www/app/` on LibreMesh routers via uHTTPd webserver at `thisnode.info` or router IP address. The production build includes translation compilation and asset optimization.