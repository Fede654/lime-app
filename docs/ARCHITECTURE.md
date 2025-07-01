# LimeApp Architecture

LimeApp is a Preact-based web application that provides a geek-free interface for LibreMesh router management.

## High-Level Overview

```
┌─────────────────┐    HTTP/JSON-RPC    ┌──────────────────┐
│   LimeApp       │ ◄─────────────────► │ LibreMesh Router │
│   (Frontend)    │                     │   (Backend)      │
└─────────────────┘                     └──────────────────┘
       │                                          │
   Preact App                                 uHTTPd
   Port 8080                                 ubus services
```

## Frontend Architecture

### Core Technologies
- **Preact**: React-like framework (3kB bundle size)
- **JSX**: Component templates
- **CSS Modules**: Scoped styling via `.less` imports
- **TanStack Query**: Modern data fetching and caching
- **Redux + RxJS**: Legacy state management (being phased out)

### Component Hierarchy

```
App (app.tsx)
├── Router
├── Menu
├── Banner System
└── Plugin Pages
    ├── Plugin Components
    ├── Containers
    └── Utility Components
```

## Plugin System

LimeApp uses a plugin-based architecture where each feature is implemented as a self-contained plugin.

### Plugin Structure
```
plugins/lime-plugin-<name>/
├── index.js                 # Plugin definition and exports
├── src/
│   ├── <name>Page.js       # Main page component
│   ├── <name>Api.js        # Backend API endpoints
│   ├── <name>Api.spec.js   # API tests
│   ├── <name>Queries.js    # TanStack Query hooks
│   ├── <name>Menu.js       # Menu item definition
│   └── <name>Style.less    # Component styles
├── <name>.spec.js          # Component tests
└── <name>.stories.js       # Storybook stories
```

### Plugin Registration
Plugins are registered in `src/config.ts`:

```javascript
export const plugins = [
  RemoteSupport,
  Metrics,
  NodeAdmin,
  // ... other plugins
];
```

Each plugin exports:
```javascript
export default {
  name: 'plugin-name',
  page: PluginPageComponent,
  menu: () => <MenuItemComponent />,
  additionalRoutes?: [...], // Optional public routes
  additionalProtectedRoutes?: [...] // Optional protected routes
}
```

## Data Flow Architecture

### Modern Approach (TanStack Query)
```
Component ◄─── useQuery/useMutation ◄─── API Endpoint ◄─── uHTTPd Client ◄─── Router
    │                   │                     │
    │                   │                     └─ JSON-RPC calls
    │                   │
    │                   └─ QueryCache (global state)
    │
    └─ UI Updates (automatic re-rendering)
```

### Legacy Approach (Redux + RxJS)
```
Component ◄─── Redux Store ◄─── Reducers ◄─── Actions ◄─── Epics ◄─── API
    │              │             │           │         │
    │              │             │           │         └─ RxJS streams
    │              │             │           │
    │              │             │           └─ Async action creators
    │              │             │
    │              │             └─ State transformations
    │              │
    │              └─ Global application state
    │
    └─ connect() HOCs
```

## Backend Communication

For detailed LibreMesh backend integration, see [LIBREMESH_INTEGRATION.md](LIBREMESH_INTEGRATION.md).

### uHTTPd Client
- **Singleton service**: `utils/uhttpd.service.js`
- **JSON-RPC protocol**: Standardized communication format
- **Session management**: Handles authentication tokens
- **Base URL abstraction**: Manages router IP addressing

### API Endpoints
- **Function-based**: Each endpoint is a simple async function
- **Consistent interface**: All return promises
- **Error handling**: Standardized error responses
- **Parameter validation**: Input sanitization

Example:
```javascript
export function getSystemInfo() {
  return api.call('system', 'board', {})
    .then(result => result.board);
}
```

### ubus Integration
- **Service calls**: `api.call(service, method, params)`
- **Session handling**: Automatic login/logout
- **Error propagation**: Network and ubus errors bubble up
- **Caching**: TanStack Query handles response caching

## Routing Architecture

### Route Types
1. **Public routes**: Available without authentication
2. **Protected routes**: Require root password via `CommunityProtectedRoute`
3. **Plugin routes**: Generated from plugin definitions
4. **Additional routes**: Custom routes defined by plugins

### First Boot Wizard
- **Special routing logic**: Bypasses normal navigation
- **Banner system**: Contextual user guidance
- **Progressive setup**: Step-by-step router configuration

### Route Configuration
```javascript
// Auto-generated from plugins
plugins.map(plugin => ({
  path: `/${plugin.name}`,
  component: plugin.page
}))

// Additional custom routes
additionalRoutes.concat(
  plugins.flatMap(p => p.additionalRoutes || [])
)
```

## State Management Evolution

### Current Strategy
- **TanStack Query**: Primary for server state
- **Local component state**: For UI-only state
- **Context API**: For global UI state (themes, locale)

### Migration from Redux
- **Gradual transition**: New features use TanStack Query
- **Legacy support**: Existing Redux code remains functional
- **Simplified mental model**: Less boilerplate, clearer data flow

## Build and Deployment

### Development
- **Webpack Dev Server**: Hot reload, proxy configuration
- **Proxy setup**: Routes API calls to router backend
- **Asset processing**: CSS modules, JSX compilation

### Production
- **Bundle optimization**: Tree shaking, minification
- **Translation compilation**: i18n message processing
- **Asset fingerprinting**: Cache busting for updates

### Deployment Target
- **Router filesystem**: `/www/app/` directory
- **uHTTPd serving**: Static file serving
- **Domain access**: `thisnode.info` or router IP
- **Offline capability**: Self-contained bundle

## Testing Architecture

### Test Types
1. **Component tests**: User interaction testing
2. **API tests**: Backend communication testing
3. **Integration tests**: End-to-end workflows
4. **Visual tests**: Storybook component states

### Test Strategy
- **Isolation**: Mock external dependencies
- **User-centric**: Test from user perspective
- **Regression protection**: Prevent breaking changes
- **Documentation**: Tests serve as usage examples

## Plugin Development Patterns

### Component Design
- **Separation of concerns**: Logic vs. presentation
- **Testable components**: Easy to mock and test
- **Reusable utilities**: Shared component library

### API Design
- **Consistent naming**: Service and method conventions
- **Error handling**: Standardized error responses
- **Type safety**: TypeScript definitions where applicable

### State Management
- **Query keys**: Consistent cache key patterns
- **Optimistic updates**: Immediate UI feedback
- **Cache invalidation**: Proper data synchronization

## Security Considerations

### Authentication
- **Session-based**: uHTTPd session management
- **Route protection**: Authentication gates
- **Credential handling**: Secure token storage

### Input Validation
- **Client-side**: User experience optimization
- **Server-side**: Security boundary enforcement
- **Sanitization**: XSS prevention

### Network Security
- **Same-origin**: Router-hosted application
- **HTTPS upgrade**: Automatic protocol upgrade
- **CORS handling**: Controlled cross-origin requests