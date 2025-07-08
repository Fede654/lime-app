# Creating Plugins

> **Purpose**: Step-by-step guide to develop new LiMeApp plugins  
> **Audience**: Plugin developers  
> **Updated**: 2025-07-08

## 🎯 Plugin Development Overview

LiMeApp uses a plugin-based architecture where each plugin is a self-contained module that provides:
- A main page component
- A menu item component
- Optional additional routes
- API integration with LibreMesh services

## 🚀 Quick Start

### 1. Create Plugin Structure

```bash
# Generate plugin scaffold
npm run create-plugin my-feature

# This creates:
plugins/lime-plugin-my-feature/
├── index.ts              # Plugin entry point
├── src/
│   ├── components/       # React components
│   ├── api/             # API integration
│   ├── queries/         # TanStack Query hooks
│   └── types/           # TypeScript types
├── package.json         # Plugin dependencies
└── *.spec.js           # Tests
```

### 2. Basic Plugin Implementation

```typescript
// plugins/lime-plugin-my-feature/index.ts
import { ComponentType } from 'preact';
import { MyFeaturePage } from './src/components/MyFeaturePage';
import { MyFeatureMenu } from './src/components/MyFeatureMenu';

export interface Plugin {
    name: string;
    page: ComponentType;
    menu: ComponentType;
    additionalRoutes?: Route[];
    additionalProtectedRoutes?: Route[];
    menuGroup?: string;
}

export const myFeaturePlugin: Plugin = {
    name: 'my-feature',
    page: MyFeaturePage,
    menu: MyFeatureMenu,
    menuGroup: 'node', // or 'meshwide', 'admin'
};
```

### 3. Register Plugin

```typescript
// src/config.ts
import { myFeaturePlugin } from '../plugins/lime-plugin-my-feature';

export const plugins = [
    // ... existing plugins
    myFeaturePlugin,
];
```

## 🏗️ Plugin Architecture

### Component Structure

```
plugins/lime-plugin-my-feature/
├── src/
│   ├── components/
│   │   ├── MyFeaturePage.tsx        # Main page component
│   │   ├── MyFeatureMenu.tsx        # Menu component
│   │   ├── StatusCard.tsx           # Feature-specific components
│   │   └── ConfigForm.tsx
│   ├── api/
│   │   ├── myFeatureApi.ts          # API endpoint definitions
│   │   └── myFeatureApi.spec.ts     # API tests
│   ├── queries/
│   │   ├── useMyFeatureData.ts      # TanStack Query hooks
│   │   └── useMyFeatureConfig.ts
│   └── types/
│       └── index.ts                 # TypeScript interfaces
```

### Plugin Interface

```typescript
interface Plugin {
    name: string;                    // Unique identifier
    page: ComponentType;             // Main page component
    menu: ComponentType;             // Menu item component
    additionalRoutes?: Route[];      // Extra routes
    additionalProtectedRoutes?: Route[]; // Auth-required routes
    menuGroup?: 'meshwide' | 'node' | 'admin'; // Menu grouping
}
```

## 📝 Step-by-Step Development

### Step 1: Plan Your Plugin

```bash
# Define plugin purpose
- What LibreMesh service will it use?
- What functionality will it provide?
- What data will it display/modify?
- How will users interact with it?

# Example: WiFi Management Plugin
- Service: iwinfo ubus service
- Functionality: Display WiFi status, configure access points
- Data: WiFi networks, signal strength, client connections
- Interaction: View status, modify configurations
```

### Step 2: Implement API Integration

```typescript
// src/api/wifiApi.ts
import { uHTTPdJSONRPCClient } from '../../utils/uhttpd-jsonrpc-client';

export interface WifiNetwork {
    ssid: string;
    signal: number;
    encryption: string;
    channel: number;
}

export interface WifiConfig {
    ssid: string;
    password: string;
    encryption: string;
    channel: number;
}

// Get WiFi networks
export const getWifiNetworks = async (): Promise<WifiNetwork[]> => {
    const client = new uHTTPdJSONRPCClient();
    const response = await client.call('iwinfo', 'scan', { device: 'wlan0' });
    return response.map(network => ({
        ssid: network.ssid,
        signal: network.signal,
        encryption: network.encryption.enabled ? network.encryption.description : 'Open',
        channel: network.channel,
    }));
};

// Update WiFi configuration
export const updateWifiConfig = async (config: WifiConfig): Promise<void> => {
    const client = new uHTTPdJSONRPCClient();
    await client.call('lime-config', 'set', {
        'wifi.ap_ssid': config.ssid,
        'wifi.ap_key': config.password,
        'wifi.ap_encryption': config.encryption,
        'wifi.channel': config.channel,
    });
};
```

### Step 3: Create TanStack Query Hooks

```typescript
// src/queries/useWifiData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWifiNetworks, updateWifiConfig } from '../api/wifiApi';

export const useWifiNetworks = () => {
    return useQuery({
        queryKey: ['wifi', 'networks'],
        queryFn: getWifiNetworks,
        staleTime: 30000, // 30 seconds
        refetchInterval: 60000, // 1 minute
    });
};

export const useUpdateWifiConfig = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: updateWifiConfig,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['wifi'] });
        },
    });
};
```

### Step 4: Implement Main Page Component

```typescript
// src/components/WifiPage.tsx
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useWifiNetworks, useUpdateWifiConfig } from '../queries/useWifiData';
import { WifiNetwork, WifiConfig } from '../types';

export const WifiPage = () => {
    const { data: networks, isLoading, error } = useWifiNetworks();
    const updateConfig = useUpdateWifiConfig();
    const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);

    if (isLoading) return <div>Loading WiFi networks...</div>;
    if (error) return <div>Error loading WiFi networks: {error.message}</div>;

    const handleConnect = (network: WifiNetwork) => {
        const config: WifiConfig = {
            ssid: network.ssid,
            password: '', // Would be filled by user
            encryption: network.encryption,
            channel: network.channel,
        };
        
        updateConfig.mutate(config);
    };

    return (
        <div className="wifi-page">
            <h1>WiFi Networks</h1>
            
            <div className="networks-list">
                {networks?.map(network => (
                    <div key={network.ssid} className="network-card">
                        <h3>{network.ssid}</h3>
                        <p>Signal: {network.signal}%</p>
                        <p>Encryption: {network.encryption}</p>
                        <p>Channel: {network.channel}</p>
                        <button 
                            onClick={() => handleConnect(network)}
                            disabled={updateConfig.isLoading}
                        >
                            Connect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
```

### Step 5: Create Menu Component

```typescript
// src/components/WifiMenu.tsx
import { h } from 'preact';
import { useWifiNetworks } from '../queries/useWifiData';

export const WifiMenu = () => {
    const { data: networks } = useWifiNetworks();
    const connectedNetworks = networks?.filter(n => n.signal > 0) || [];

    return (
        <div className="wifi-menu">
            <span>WiFi</span>
            {connectedNetworks.length > 0 && (
                <span className="badge">{connectedNetworks.length}</span>
            )}
        </div>
    );
};
```

### Step 6: Add Tests

```typescript
// src/components/WifiPage.spec.tsx
import { render, screen, fireEvent } from '@testing-library/preact';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WifiPage } from './WifiPage';
import * as wifiApi from '../api/wifiApi';

// Mock the API
jest.mock('../api/wifiApi');
const mockGetWifiNetworks = wifiApi.getWifiNetworks as jest.MockedFunction<typeof wifiApi.getWifiNetworks>;

describe('WifiPage', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
    });

    const renderWithQuery = (component: any) => {
        return render(
            <QueryClientProvider client={queryClient}>
                {component}
            </QueryClientProvider>
        );
    };

    test('displays WiFi networks', async () => {
        mockGetWifiNetworks.mockResolvedValue([
            { ssid: 'TestNetwork', signal: 80, encryption: 'WPA2', channel: 6 },
        ]);

        renderWithQuery(<WifiPage />);

        expect(await screen.findByText('TestNetwork')).toBeInTheDocument();
        expect(screen.getByText('Signal: 80%')).toBeInTheDocument();
        expect(screen.getByText('Encryption: WPA2')).toBeInTheDocument();
    });

    test('handles connect button click', async () => {
        mockGetWifiNetworks.mockResolvedValue([
            { ssid: 'TestNetwork', signal: 80, encryption: 'WPA2', channel: 6 },
        ]);

        renderWithQuery(<WifiPage />);

        const connectButton = await screen.findByText('Connect');
        fireEvent.click(connectButton);

        // Verify API call was made
        expect(wifiApi.updateWifiConfig).toHaveBeenCalledWith({
            ssid: 'TestNetwork',
            password: '',
            encryption: 'WPA2',
            channel: 6,
        });
    });
});
```

## 🎨 Styling Guidelines

### CSS Modules

```css
/* src/components/WifiPage.module.less */
.wifiPage {
    padding: 20px;
    
    .networksList {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
        margin-top: 20px;
    }
    
    .networkCard {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 16px;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        
        h3 {
            margin: 0 0 8px 0;
            color: #333;
        }
        
        p {
            margin: 4px 0;
            color: #666;
        }
        
        button {
            margin-top: 12px;
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            
            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }
    }
}
```

### Tailwind CSS Classes

```typescript
// Alternative: Using Tailwind CSS
export const WifiPage = () => {
    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">WiFi Networks</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {networks?.map(network => (
                    <div key={network.ssid} className="border rounded-lg p-4 bg-white shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">{network.ssid}</h3>
                        <p className="text-gray-600">Signal: {network.signal}%</p>
                        <p className="text-gray-600">Encryption: {network.encryption}</p>
                        <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50">
                            Connect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
```

## 📊 Testing Strategy

### Unit Tests
```typescript
// Test individual components
describe('WifiNetworkCard', () => {
    test('renders network information', () => {
        const network = { ssid: 'Test', signal: 80, encryption: 'WPA2', channel: 6 };
        render(<WifiNetworkCard network={network} />);
        expect(screen.getByText('Test')).toBeInTheDocument();
    });
});
```

### Integration Tests
```typescript
// Test plugin integration
describe('WiFi Plugin Integration', () => {
    test('plugin registers correctly', () => {
        const plugin = wifiPlugin;
        expect(plugin.name).toBe('wifi');
        expect(plugin.page).toBeDefined();
        expect(plugin.menu).toBeDefined();
    });
});
```

### QEMU Tests
```bash
# Test with real LibreMesh
npm run qemu:start
npm run test:authenticated -- --testPathPattern="wifi"
```

## 📚 Advanced Features

### Custom Routes

```typescript
// Add custom routes to your plugin
export const wifiPlugin: Plugin = {
    name: 'wifi',
    page: WifiPage,
    menu: WifiMenu,
    additionalRoutes: [
        { path: '/wifi/settings', component: WifiSettings },
        { path: '/wifi/advanced', component: WifiAdvanced },
    ],
    additionalProtectedRoutes: [
        { path: '/wifi/admin', component: WifiAdmin },
    ],
};
```

### Shared State

```typescript
// Use shared state for cross-plugin communication
import { useSharedState } from '../../components/shared-state';

export const WifiPage = () => {
    const [meshStatus, setMeshStatus] = useSharedState('meshStatus');
    
    // Component can read and update shared state
    const handleStatusChange = (newStatus) => {
        setMeshStatus(newStatus);
    };
};
```

### Error Boundaries

```typescript
// Add error boundaries for robust plugins
import { ErrorBoundary } from '../../components/ErrorBoundary';

export const WifiPage = () => {
    return (
        <ErrorBoundary>
            <WifiContent />
        </ErrorBoundary>
    );
};
```

## 🔧 Debugging Tips

### Development Tools

```bash
# Enable debug mode
DEBUG=true npm run dev

# View TanStack Query dev tools
# Available at /__react_query_devtools__

# Check network requests
# Use browser dev tools Network tab
```

### Common Issues

**Plugin not loading:**
```bash
# Check registration
grep -r "plugin-name" src/config.ts

# Check syntax errors
npm run lint plugins/lime-plugin-name/

# Check tests
npm test plugins/lime-plugin-name/
```

**API calls failing:**
```bash
# Test ubus service directly
curl -X POST http://10.13.0.1/ubus -d '{"jsonrpc":"2.0","id":1,"method":"call","params":["session","service","method",{}]}'

# Check QEMU status
npm run qemu:status

# Verify authentication
# Check if session is valid
```

## 🚀 Publishing and Deployment

### Plugin Checklist

- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] QEMU integration works
- [ ] Documentation updated
- [ ] Storybook stories created
- [ ] Types are complete
- [ ] Error handling implemented
- [ ] Performance optimized

### Deployment Process

```bash
# 1. Run full QA
npm run qa:full

# 2. Test with QEMU
npm run qemu:start
npm run deploy:qemu

# 3. Create PR
git checkout -b feature/wifi-plugin
git add .
git commit -m "feat: add WiFi management plugin

- Implement WiFi network scanning
- Add configuration management
- Include comprehensive tests
- Add Storybook stories

🤖 Assisted by Claude Code for architecture design"

# 4. Deploy after review
npm run deploy:production
```

## 📖 Examples

### Real Plugin Examples

- **lime-plugin-align**: Simple configuration plugin
- **lime-plugin-notes**: CRUD operations with forms
- **lime-plugin-ground-routing**: Complex routing visualization
- **lime-plugin-pirania**: User management with authentication

### Plugin Templates

```bash
# Generate from template
npm run create-plugin --template=crud     # CRUD operations
npm run create-plugin --template=view     # Read-only data display
npm run create-plugin --template=config   # Configuration management
```

## 🔗 Related Documentation

- **[Architecture Overview](../01-architecture/overview.md)** - System architecture
- **[API Reference](../04-reference/api-endpoints.md)** - ubus endpoints
- **[Component Library](../04-reference/component-library.md)** - Reusable components
- **[Testing Strategy](../02-development/testing-strategy.md)** - Testing approaches

---

**Ready to build?** Start with `npm run create-plugin <name>` and follow this guide step by step!