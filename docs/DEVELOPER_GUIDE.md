# Developer Guide

Quick reference for LimeApp development. For a comprehensive tutorial, see [Tutorial.md](Tutorial.md).

## Quick Setup

```bash
npm install                     # Install dependencies
npm run dev                     # Start development server (proxies to 10.13.0.1)
```

### Custom Router IP
```bash
env NODE_HOST=10.5.0.9 npm run dev  # Use different router as backend
```

## Essential Commands

### Development
```bash
npm run dev                     # Development server with hot reload
npm run build                   # Development build
npm run build:production        # Production build with translations
npm run serve                   # Build and serve production version
```

### Testing
```bash
npm test                        # Run all tests
npm run clear-jest              # Clear Jest cache
npm run test plugins/lime-plugin-name/plugin.spec.js  # Run specific test
```

### Code Quality
```bash
npm run lint                    # Run TypeScript, ESLint, and Prettier checks
npm run lint:fix                # Auto-fix linting issues
```

### Translations
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

## Project Structure

### Core Files
- `src/components/app.tsx` - Main app component with routing
- `src/config.ts` - Plugin registration
- `preact.config.js` - Webpack configuration and dev server proxy

### Plugin Structure
```
plugins/lime-plugin-<name>/
├── index.js                 # Plugin entry point
├── src/
│   ├── <name>Page.js       # Main page component
│   ├── <name>Api.js        # API endpoints
│   ├── <name>Api.spec.js   # API tests
│   ├── <name>Queries.js    # TanStack Query hooks
│   ├── <name>Menu.js       # Menu item definition
│   └── <name>Style.less    # Component styles
├── <name>.spec.js          # Component tests
└── <name>.stories.js       # Storybook stories
```

## Path Aliases

```javascript
~/ → src/
components/ → src/components/
containers/ → src/containers/
utils/ → src/utils/
plugins/ → plugins/
```

## Backend Communication

- **Default router IP**: `10.13.0.1`
- **ubus calls**: Via `/ubus` endpoint using JSON-RPC
- **Session management**: Username/password authentication
- **Development proxy**: Configured in `preact.config.js`

## Plugin Development Workflow

1. **Bootstrap**: `npm run create-plugin <pluginName>`
2. **Write tests**: Component tests with mocked APIs
3. **Implement component**: Pass the tests
4. **Write API tests**: Test endpoint calls
5. **Implement API**: Pass API tests
6. **Add styling**: CSS modules or global classes
7. **Create stories**: Storybook for visual testing
8. **Register plugin**: Add to `src/config.ts`

## Testing Strategy

### Component Tests
- Mock API endpoints using Jest
- Test user interactions and UI states
- Use `utils/test_utils` for rendering with context

### API Tests
- Mock `utils/uhttpd.service`
- Test endpoint calls and data transformations
- Verify correct ubus parameters

## Common Issues

### Development Server
- If proxy fails, check router IP in `preact.config.js`
- Default backend: `10.13.0.1`

### Tests
- Clear Jest cache if tests behave unexpectedly: `npm run clear-jest`
- Ensure QueryCache is cleared between tests: `act(() => queryCache.clear())`

### Build
- Production builds require translation compilation
- Run `npm run translations:compile` before production build

## State Management

- **Primary**: TanStack Query for data fetching and caching
- **Legacy**: Redux + RxJS (being phased out)
- **Global cache**: Managed by `@tanstack/react-query`

For comprehensive technical debt resolution strategy, see [LIBREMESH_INTERVENTION_PLAN.md](LIBREMESH_INTERVENTION_PLAN.md).

## Styling

### Component-specific styles
```javascript
import style from './style.less'
<div class={style.someClass} />
```

### Global styles
```javascript
<div class="d-flex container" />  // Bootstrap-inspired classes
```

## Translation Support

Supported locales: ar, ast, ca, da, de, el, en, es, eu, fr, it, ko, lb, mk, nb, pt, ru, skr-ARAB, sr-EC, sv, tr, zh-HANS, zh-HANT, zh

Use LinguiJS for internationalization:
```javascript
import { Trans } from '@lingui/macro';
<Trans>Text to translate</Trans>
```