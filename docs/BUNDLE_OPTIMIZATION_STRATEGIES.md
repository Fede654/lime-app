# Bundle Size Optimization Strategies for LiMeApp

## Current Bundle Analysis (January 2025)

### Bundle Composition
- **Main Bundle**: 439 KB (bundle.db6f1.js)
- **Vendors Bundle**: 424 KB (vendors.chunk.496f8.js)
- **CSS Bundle**: 46 KB (bundle.69540.css)
- **Language Chunks**: ~150 KB (i18n chunks 3-26)
- **Polyfills**: 1.6 KB
- **Total Size**: ~1.2 MB (actual deployed files)

### Important Note on File Sizes
The discrepancy between the "909KB" bundle report and the "1.4MB" in lime-packages was due to:
1. **Build accumulation**: Old builds weren't cleaned during deployment
2. **Multiple bundle versions**: Each build creates new hashed filenames
3. **Actual size**: A fresh build deploys ~1.2MB of files

### Key Findings

#### 1. Large Dependencies in Runtime
- **react-spring**: Animation library (estimated ~30-40KB minified)
- **leaflet + react-leaflet**: Map functionality (~140KB combined)
- **@tanstack/react-query**: State management (~25KB)
- **compressorjs**: Image compression (~10KB)

#### 2. Development Dependencies Mistakenly Included
- **tailwindcss** is listed in both devDependencies AND dependencies
- This alone could save ~20-30KB if moved to devDependencies only

#### 3. Current Optimizations Already in Place
- Basic vendor code splitting
- i18n plural rules are dynamically loaded per locale
- Production builds remove source maps
- Service worker and ESM builds are disabled for production

## Recommended Optimization Strategies

### 1. **Immediate Quick Wins** (Low effort, High impact)

#### a) Fix Dependency Categorization
```bash
npm uninstall tailwindcss
npm install --save-dev tailwindcss
```
**Impact**: ~20-30KB reduction

#### b) Replace Heavy Dependencies
- Replace `compressorjs` with native browser APIs or lighter alternative
- Consider replacing `simple-color-scale` with a custom implementation
**Impact**: ~15-20KB reduction

### 2. **Route-Based Code Splitting** (Medium effort, High impact)

#### Implementation Plan:
```typescript
// src/config.ts - Convert to lazy loading
const Align = lazy(() => import("plugins/lime-plugin-align"));
const ChangeNode = lazy(() => import("plugins/lime-plugin-changeNode"));
// ... etc for all plugins

// Wrap routes with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Router>
    {/* routes */}
  </Router>
</Suspense>
```

**Impact**: Initial load reduced by ~200-300KB, plugins loaded on-demand

### 3. **Advanced Vendor Splitting** (Medium effort, Medium impact)

Update `preact.config.js`:
```javascript
splitChunks: {
    chunks: "all",
    cacheGroups: {
        // Framework code
        framework: {
            test: /[\\/]node_modules[\\/](preact|@tanstack|@lingui)[\\/]/,
            name: "framework",
            priority: 30,
        },
        // Map libraries
        maps: {
            test: /[\\/]node_modules[\\/](leaflet|react-leaflet)[\\/]/,
            name: "maps",
            priority: 20,
        },
        // All other vendors
        vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
        },
    },
},
```

**Impact**: Better caching, ~50-100KB reduction in initial load for non-map pages

### 4. **Plugin-Specific Chunks** (High effort, High impact)

Create separate entry points for each plugin group:
```javascript
// Group plugins by usage frequency
entry: {
    main: "./src/index.js",
    admin: ["./plugins/lime-plugin-node-admin", "./plugins/lime-plugin-network-admin"],
    mesh: ["./plugins/lime-plugin-mesh-wide", "./plugins/lime-plugin-mesh-wide-config"],
    tools: ["./plugins/lime-plugin-align", "./plugins/lime-plugin-ground-routing"],
}
```

**Impact**: 300-400KB reduction in initial load

### 5. **Asset Optimization** (Low effort, Low impact)

- The SVG logos (190KB + 20KB) could be optimized with SVGO
- Consider lazy loading large SVGs
```bash
npx svgo src/assets/icons/*.svg
```

**Impact**: ~50-100KB reduction in assets

### 6. **Tree Shaking Improvements** (Medium effort, Medium impact)

- Ensure all imports use named imports instead of default imports
- Add sideEffects: false to package.json for better tree shaking
- Review react-spring usage - import only needed components

**Impact**: ~20-50KB reduction

### 7. **Build-Time Optimizations**

Add to `preact.config.js`:
```javascript
if (isProd) {
    config.optimization.minimizer[0].options.terserOptions = {
        compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info'],
        },
    };
}
```

**Impact**: ~5-10KB reduction

## Implementation Priority

1. **Phase 1 - Quick Wins** (1-2 hours)
   - Fix tailwindcss dependency
   - Optimize SVG assets
   - Add build-time optimizations

2. **Phase 2 - Route Splitting** (4-6 hours)
   - Implement lazy loading for all plugins
   - Add loading states
   - Test all routes

3. **Phase 3 - Advanced Splitting** (1-2 days)
   - Implement advanced vendor splitting
   - Create plugin-specific chunks
   - Optimize for LibreRouter hardware

## Expected Total Impact

- **Current Bundle**: ~1.2MB (actual deployed size)
- **After Phase 1**: ~1.1MB (-100KB, 8.3% reduction)
- **After Phase 2**: ~850KB (-350KB, 29% reduction)
- **After Phase 3**: ~650KB (-550KB, 46% reduction)

## Monitoring and Analysis

Use the newly added webpack-bundle-analyzer:
```bash
npm run analyze
```

This will open a visual representation of the bundle at http://localhost:8888

## Notes for LibreRouter Environment

Given the resource constraints of LibreRouter devices (32MB RAM):
- Prioritize initial load time over runtime performance
- Consider implementing a lightweight "shell" that loads first
- Use service workers for offline caching (when network allows)
- Monitor memory usage during development