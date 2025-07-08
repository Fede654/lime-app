# Architecture Overview

> **Purpose**: System design and architectural decisions for LiMeApp  
> **Audience**: Developers, architects, contributors  
> **Updated**: 2025-07-08

## 🏗️ System Introduction

LiMeApp is a modern web application built with **Preact** that provides a user-friendly interface for managing LibreMesh routers. It abstracts the complexity of router configuration through a plugin-based architecture that communicates with LibreMesh services via ubus JSON-RPC calls.

### Core Principles
- **Simplicity**: Hide technical complexity from users
- **Modularity**: Plugin-based architecture for extensibility
- **Performance**: Lightweight bundle (~858KB) with efficient caching
- **Reliability**: Real-world testing with QEMU LibreMesh integration

## 🛠️ Technology Stack

### Frontend Stack
- **Framework**: Preact (3KB React alternative)
- **Language**: TypeScript with full type safety
- **State Management**: TanStack Query (modern, replacing Redux)
- **Styling**: Tailwind CSS + CSS Modules (scoped styles)
- **Build System**: Preact CLI with Webpack
- **Testing**: Jest + @testing-library/preact
- **Internationalization**: LinguiJS (24 languages)

### Backend Integration
- **Protocol**: ubus JSON-RPC over HTTP
- **Target**: LibreMesh OpenWrt firmware
- **Services**: 50+ LibreMesh services (lime-utils, iwinfo, etc.)
- **Authentication**: Session-based with root credentials

### Development Environment
- **Virtual Testing**: QEMU LibreMesh instances
- **Hot Reload**: Webpack dev server with proxy
- **Quality Assurance**: Automated testing + linting + AI assistance

## 🏛️ High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LiMeApp Frontend                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Plugin A  │  │   Plugin B  │  │   Plugin C  │  ...   │
│  │             │  │             │  │             │        │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │        │
│  │ │  Page   │ │  │ │  Page   │ │  │ │  Page   │ │        │
│  │ │ Component│ │  │ │ Component│ │  │ │ Component│ │        │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │        │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │        │
│  │ │  Menu   │ │  │ │  Menu   │ │  │ │  Menu   │ │        │
│  │ │ Component│ │  │ │ Component│ │  │ │ Component│ │        │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                    Core Application                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Router    │  │    State    │  │   HTTP      │        │
│  │  (preact-   │  │ Management  │  │  Client     │        │
│  │   router)   │  │ (TanStack)  │  │  (ubus)     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                    Proxy Layer                              │
│           HTTP Proxy: /ubus → http://10.13.0.1/ubus       │
│           CGI Proxy: /cgi-bin/** → http://10.13.0.1/       │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    LibreMesh Router                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    ubus     │  │  LibreMesh  │  │    uHTTPd   │        │
│  │   System    │  │   Services  │  │ Web Server  │        │
│  │    Bus      │  │             │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## 🧩 Plugin System Architecture

### Plugin Structure
Each plugin is a self-contained module with:

```typescript
interface Plugin {
    name: string;                    // Unique identifier
    page: ComponentType;             // Main page component
    menu: ComponentType;             // Menu item component
    additionalRoutes?: Route[];      // Extra routes
    additionalProtectedRoutes?: Route[]; // Auth-required routes
    menuGroup?: string;              // Menu grouping
}
```

### Plugin Registration
```typescript
// src/config.ts
import { pluginA } from '../plugins/lime-plugin-a';
import { pluginB } from '../plugins/lime-plugin-b';

export const plugins = [
    pluginA,
    pluginB,
    // ... more plugins
];
```

### Plugin Development Pattern
```
plugins/lime-plugin-example/
├── index.ts              # Plugin entry point
├── src/
│   ├── components/       # Plugin components
│   ├── queries/          # TanStack Query hooks
│   ├── api/              # API endpoints
│   └── types/            # TypeScript types
├── package.json          # Plugin dependencies
└── *.spec.js            # Plugin tests
```

## 🔄 State Management Architecture

### TanStack Query (Current - 95% migrated)
Modern data fetching and caching solution:

```typescript
// Query pattern
const { data, error, isLoading } = useQuery({
    queryKey: ['endpoint', params],
    queryFn: () => apiCall(params),
    staleTime: 5000,
    cacheTime: 10000,
});

// Mutation pattern
const mutation = useMutation({
    mutationFn: (data) => apiCall(data),
    onSuccess: () => {
        queryClient.invalidateQueries(['endpoint']);
    },
});
```

**Benefits achieved:**
- 🎯 **Reduced bundle size**: ~2.5KB smaller
- 🚀 **Better performance**: Automatic caching and deduplication
- 🛠️ **Simplified code**: No Redux boilerplate
- 📊 **Better DX**: Built-in loading states and error handling

### Redux (Legacy - 5% remaining)
Only used for routing with `react-router-redux`:

```typescript
// Limited to routing state only
const store = createStore(
    routerReducer,
    applyMiddleware(routerMiddleware)
);
```

## 🔗 Component Relationships

### Data Flow Pattern
```
User Interaction → Component → TanStack Query → API Call → ubus → LibreMesh
                                    ↓
UI Update ← Component ← Cached Data ← HTTP Response ← JSON-RPC ← Service
```

### Component Hierarchy
```
App Component
├── Router
├── Navigation (generated from plugins)
├── Page Components (plugin-specific)
│   ├── Business Components
│   ├── UI Components
│   └── Query Hooks
└── Shared Components
    ├── Loading States
    ├── Error Boundaries
    └── Common UI Elements
```

## 🌐 Backend Communication Architecture

### ubus JSON-RPC Protocol
```typescript
// API call structure
interface UbusCall {
    jsonrpc: "2.0";
    id: number;
    method: "call";
    params: [
        string,    // session_id
        string,    // service
        string,    // method
        object     // arguments
    ];
}

// Response structure
interface UbusResponse {
    jsonrpc: "2.0";
    id: number;
    result: [
        number,    // error_code
        any        // result_data
    ];
}
```

### Available LibreMesh Services
- **lime-utils**: Core utilities
- **iwinfo**: WiFi information
- **lime-batman-adv**: Batman mesh protocol
- **lime-groundrouting**: Ground routing
- **lime-config**: Configuration management
- **file**: File operations
- **system**: System information
- **network**: Network configuration

## 🛣️ Routing Architecture

### Route Types
```typescript
// Public routes (no authentication)
const publicRoutes = [
    { path: '/', component: Homepage },
    { path: '/login', component: Login },
];

// Protected routes (authentication required)
const protectedRoutes = [
    { path: '/admin', component: Admin },
    { path: '/config', component: Config },
];

// Plugin routes (dynamically generated)
plugins.forEach(plugin => {
    routes.push({
        path: `/${plugin.name}`,
        component: plugin.page,
    });
});
```

### Menu Generation
```typescript
// Automatic menu generation from plugins
const menuItems = plugins.map(plugin => ({
    name: plugin.name,
    component: plugin.menu,
    group: plugin.menuGroup || 'default',
}));
```

## 🧪 Testing Architecture

### Multi-Layer Testing Strategy
1. **Unit Tests**: Component behavior and API functions
2. **Integration Tests**: Plugin interactions and data flow
3. **QEMU Tests**: Real LibreMesh backend testing
4. **Visual Tests**: Storybook component states

### Test Patterns
```typescript
// Component testing
test('renders correctly', () => {
    const { getByText } = render(<Component />);
    expect(getByText('Expected text')).toBeInTheDocument();
});

// API testing
test('API call returns expected data', async () => {
    const data = await apiCall();
    expect(data).toMatchObject(expectedShape);
});

// Integration testing (with QEMU)
test('full workflow', async () => {
    // Test with real LibreMesh backend
    const result = await complexWorkflow();
    expect(result).toBeDefined();
});
```

## ⚡ Performance Optimizations

### Bundle Optimization
- **Code splitting**: Plugin-based chunks
- **Tree shaking**: Remove unused code
- **Dynamic imports**: Load plugins on demand
- **CSS optimization**: PostCSS with cssnano

### Caching Strategy
```typescript
// TanStack Query caching
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5000,      // 5 seconds
            cacheTime: 10000,     // 10 seconds
            refetchOnWindowFocus: false,
        },
    },
});
```

### Memory Management
- **Automatic cleanup**: Query cache invalidation
- **Garbage collection**: Unused component cleanup
- **Efficient re-renders**: React/Preact optimization

## 🌍 Internationalization Architecture

### LinguiJS Integration
```typescript
// Message extraction
import { t } from '@lingui/macro';

const message = t`Hello, world!`;

// Plural forms
const count = plural(items.length, {
    one: `${items.length} item`,
    other: `${items.length} items`,
});
```

### Translation Workflow
1. **Extract**: `lingui extract` - Find translatable strings
2. **Translate**: Update `.po` files
3. **Compile**: `lingui compile` - Generate JavaScript

### Supported Languages
24 languages including:
- **Spanish**: 100% complete
- **English**: 100% complete (source)
- **Portuguese**: ~97% complete
- **Italian**: ~97% complete

## 🛠️ Development Environment

### QEMU LibreMesh Integration
```bash
# Start LibreMesh in QEMU
npm run qemu:start

# Development with real backend
npm run qemu:dev

# Deploy to QEMU
npm run deploy:qemu
```

### Development Workflow
1. **Code**: Edit in IDE with TypeScript support
2. **Test**: Run tests with Jest
3. **Debug**: Use QEMU for integration testing
4. **Deploy**: One-command deployment to QEMU
5. **Iterate**: Hot reload for rapid development

## 📊 Development Workflow

### Plugin Development Process
1. **Create**: `npm run create-plugin <name>`
2. **Develop**: Implement components with tests
3. **Test**: Unit tests + integration tests
4. **Document**: Add to Storybook
5. **Register**: Add to `src/config.ts`

### Quality Assurance
```bash
# Fast QA (development)
npm run qa:fast

# Full QA (pre-commit)
npm run qa:full

# AI-assisted QA
npm run qa:ai
```

## 🎯 Best Practices

### Component Development
- Use TypeScript for type safety
- Implement loading and error states
- Write tests for user interactions
- Create Storybook stories for visual states

### State Management
- Use TanStack Query for server state
- Local state for UI-only concerns
- Avoid global state when possible
- Implement proper error handling

### Testing
- Test user behavior, not implementation
- Use real backend for integration tests
- Mock external dependencies
- Maintain high test coverage

### Performance
- Code split by plugin
- Lazy load components
- Optimize bundle size
- Use efficient caching strategies

## 🔄 Migration Path

### Redux to TanStack Query Migration
**Status**: 95% complete

**Benefits achieved:**
- Reduced bundle size
- Simplified codebase
- Better performance
- Improved developer experience

**Remaining work:**
- Remove routing-related Redux usage
- Complete migration documentation
- Update training materials

## 🔍 Key Architectural Decisions

1. **Plugin-based Architecture**: Enables modularity and extensibility
2. **TanStack Query**: Modern state management with caching
3. **QEMU Integration**: Authentic testing environment
4. **TypeScript**: Type safety and developer productivity
5. **Preact**: Lightweight alternative to React
6. **ubus Protocol**: Direct LibreMesh service communication

## 📚 Related Documentation

- **[Development Workflow](../02-development/workflow.md)** - Day-to-day development process
- **[Plugin Development](../03-guides/creating-plugins.md)** - Creating new plugins
- **[Testing Strategy](../02-development/testing-strategy.md)** - Testing approaches
- **[API Reference](../04-reference/api-endpoints.md)** - ubus API endpoints

---

This architecture supports LiMeApp's mission to provide a simple, powerful interface for LibreMesh router management while maintaining high code quality and developer productivity.