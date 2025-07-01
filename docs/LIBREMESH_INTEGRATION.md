# LibreMesh Integration Guide

This guide explains how LimeApp integrates with the LibreMesh ecosystem and provides essential information for developers working on the integration.

## Overview

LimeApp serves as the web-based management interface for LibreMesh mesh networks, running on router hardware and communicating with LibreMesh backend services through a well-defined API layer.

```
┌─────────────────────────────────────────────────────┐
│                    LimeApp                          │
│  ┌─────────────────┐    ┌─────────────────────────┐ │
│  │   Frontend      │    │     Backend Services    │ │
│  │                 │    │                         │ │
│  │ • Preact UI     │◄──►│ • uHTTPd Web Server     │ │
│  │ • TanStack Query│    │ • rpcd RPC Daemon       │ │
│  │ • Component Lib│    │ • ubus Service Bus      │ │
│  └─────────────────┘    └─────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                            │
                 JSON-RPC over HTTP
                            │
┌─────────────────────────────────────────────────────┐
│              LibreMesh Core Services                │
│                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ubus-lime-   │ │shared-state │ │lime-system  │   │
│  │utils        │ │             │ │             │   │
│  │• Node info  │ │• Multi-node │ │• Config mgmt│   │
│  │• WiFi mgmt  │ │  state sync │ │• Network    │   │
│  │• Network    │ │• CRDT impl  │ │  setup      │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ubus-lime-   │ │ubus-lime-   │ │ubus-lime-   │   │
│  │location     │ │metrics      │ │groundrouting│   │
│  │• GPS coords │ │• Bandwidth  │ │• Static     │   │
│  │• Node map   │ │• Latency    │ │  routes     │   │
│  │• Neighbors  │ │• Topology   │ │• Gateway    │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Core Integration Components

### 1. uHTTPd Web Server
- **Role**: Hosts LimeApp static files and provides HTTP API gateway
- **Configuration**: `/etc/config/uhttpd`
- **Integration Points**:
  - Serves static files from `/www/app/`
  - Proxies ubus calls via `/ubus` endpoint
  - Handles authentication via session management

### 2. rpcd RPC Daemon
- **Role**: Translates HTTP requests to ubus calls
- **Configuration**: `/etc/config/rpcd`
- **Authentication**: Session-based with root password
- **API Format**: JSON-RPC 2.0

### 3. ubus Service Bus
- **Role**: Inter-process communication between LimeApp and LibreMesh services
- **Protocol**: Binary message passing with JSON data
- **Discovery**: Dynamic service registration and discovery

## LibreMesh Service Integration

### ubus-lime-utils
**Purpose**: Core system utilities and node management

**Key Methods**:**
```javascript
// Node status and system information
api.call('lime-utils', 'get_node_status', {})
// Returns: { hostname, uptime, load, memory, etc. }

// Network configuration
api.call('lime-utils', 'get_config', {})
// Returns: Current lime-config settings

// WiFi management
api.call('lime-utils', 'wifi_scan', { device: 'radio0' })
// Returns: Available WiFi networks

// Hostname configuration
api.call('lime-utils', 'set_hostname', { hostname: 'new-name' })
// Sets node hostname
```

**Integration Points:**
- Node administration plugin
- First boot wizard
- System information display

### ubus-lime-location  
**Purpose**: Geographic location and node mapping

**Key Methods:**
```javascript
// Get node coordinates
api.call('lime-location', 'get_location', {})
// Returns: { lat, lon, altitude }

// Set node location
api.call('lime-location', 'set_location', { 
  lat: -34.6037,
  lon: -58.3816 
})

// Get neighboring nodes
api.call('lime-location', 'get_neighbors', {})
// Returns: Array of nearby nodes with distances
```

**Integration Points:**
- Node location plugin
- Network map visualization
- Distance-based features

### ubus-lime-metrics
**Purpose**: Network performance monitoring and metrics

**Key Methods:**
```javascript
// Internet connectivity test
api.call('lime-metrics', 'get_internet_status', {})
// Returns: { ipv4: true, ipv6: false, dns: true }

// Network path to gateway
api.call('lime-metrics', 'get_path_to_internet', {})
// Returns: Hop-by-hop routing information

// Link quality measurements  
api.call('lime-metrics', 'get_link_quality', {})
// Returns: Signal strength, packet loss, etc.
```

**Integration Points:**
- Metrics monitoring plugin
- Network diagnostics
- Performance dashboards

### ubus-lime-groundrouting
**Purpose**: Static routing and gateway configuration

**Key Methods:**
```javascript
// Get routing table
api.call('lime-groundrouting', 'get_routes', {})
// Returns: Current static routes

// Add static route
api.call('lime-groundrouting', 'set_route', {
  destination: '192.168.1.0/24',
  gateway: '10.13.0.1'
})
```

**Integration Points:**
- Advanced network configuration
- Gateway management
- Custom routing setup

### shared-state System
**Purpose**: Multi-node state synchronization using CRDT

**Key Concepts:**
- **CRDT (Conflict-free Replicated Data Types)**: Ensures consistency across nodes
- **Eventual Consistency**: Changes propagate through mesh network
- **Partition Tolerance**: Operates during network splits

**Integration Methods:**
```javascript
// Get shared network state
api.call('shared-state', 'get', { data_type: 'nodes_and_links' })
// Returns: Network topology from all nodes

// Publish local state
api.call('shared-state', 'publish', {
  data_type: 'node_info',
  data: { ... }
})
```

## Development Integration Patterns

### API Layer Architecture
```javascript
// plugins/lime-plugin-example/src/exampleApi.js
import api from 'utils/uhttpd.service';

export const getNodeInfo = () => 
  api.call('lime-utils', 'get_node_status', {});

export const setHostname = (hostname) =>
  api.call('lime-utils', 'set_hostname', { hostname });
```

### Query Integration with TanStack Query
```javascript
// plugins/lime-plugin-example/src/exampleQueries.js
import { useQuery, useMutation } from '@tanstack/react-query';
import { getNodeInfo, setHostname } from './exampleApi';

export const useNodeInfo = () =>
  useQuery(['lime-utils', 'node_status'], getNodeInfo);

export const useSetHostname = () =>
  useMutation(setHostname, {
    onSuccess: () => {
      queryCache.invalidateQueries(['lime-utils', 'node_status']);
    }
  });
```

### Component Integration
```javascript
// plugins/lime-plugin-example/src/examplePage.js
import { useNodeInfo, useSetHostname } from './exampleQueries';

const ExamplePage = () => {
  const { data: nodeInfo, isLoading } = useNodeInfo();
  const setHostnameMutation = useSetHostname();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Node: {nodeInfo.hostname}</h1>
      <button 
        onClick={() => setHostnameMutation.mutate('new-hostname')}
      >
        Change Hostname
      </button>
    </div>
  );
};
```

## Error Handling and Resilience

### Network Error Handling
```javascript
// Common error patterns and handling
const handleLibreMeshError = (error) => {
  if (error.code === 'UBUS_STATUS_NOT_FOUND') {
    // Service not available
    return 'LibreMesh service not available';
  }
  if (error.code === 'UBUS_STATUS_ACCESS_DENIED') {
    // Authentication required
    return 'Authentication required';
  }
  if (error.code === 'UBUS_STATUS_TIMEOUT') {
    // Network timeout
    return 'Network timeout - check connection';
  }
  return 'Unknown error occurred';
};
```

### Offline Handling
```javascript
// Graceful degradation for offline scenarios
export const useNodeInfoWithFallback = () => {
  const query = useQuery(['lime-utils', 'node_status'], getNodeInfo, {
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
    fallbackData: {
      hostname: 'Unknown',
      status: 'offline'
    }
  });
  
  return query;
};
```

## Testing LibreMesh Integration

### Mock ubus Services
```javascript
// tests/mocks/ubusService.js
export const mockUbusService = {
  call: jest.fn((service, method, params) => {
    if (service === 'lime-utils' && method === 'get_node_status') {
      return Promise.resolve({
        hostname: 'test-node',
        uptime: 3600,
        load: [0.1, 0.2, 0.3]
      });
    }
    return Promise.reject(new Error('Method not found'));
  })
};
```

### Integration Tests
```javascript
// tests/integration/libremeshIntegration.test.js
describe('LibreMesh Integration', () => {
  beforeEach(() => {
    mockUbusService.call.mockClear();
  });

  it('should get node status from lime-utils', async () => {
    const nodeInfo = await getNodeInfo();
    
    expect(mockUbusService.call).toHaveBeenCalledWith(
      'lime-utils', 
      'get_node_status', 
      {}
    );
    expect(nodeInfo.hostname).toBe('test-node');
  });
});
```

## Deployment Integration

### Package Dependencies
```makefile
# Required packages in OpenWrt
DEPENDS:=+rpcd +uhttpd +uhttpd-mod-ubus +uhttpd-mod-lua \
    +ubus-lime-location +ubus-lime-metrics +ubus-lime-utils \
    +rpcd-mod-iwinfo +ubus-lime-groundrouting
```

### Configuration Files
```bash
# uHTTPd configuration for LimeApp
/etc/config/uhttpd
/etc/uci-defaults/90_lime-app
/etc/uci-defaults/95-lime-app-rpc-acl
```

### File Installation
```bash
# LimeApp files on router
/www/app/                    # Frontend bundle
/www/lime_app_index.html     # Entry point
/usr/share/rpcd/             # RPC ACL definitions
```

## Performance Considerations

### Router Hardware Constraints
- **Memory**: Typically 32-128MB RAM
- **Storage**: 4-16MB flash storage
- **CPU**: Single-core MIPS/ARM processors
- **Network**: Limited bandwidth mesh links

### Optimization Strategies
- **Bundle Size**: Keep under 1.5MB compressed
- **Memory Usage**: Minimize runtime memory footprint
- **Network Calls**: Batch ubus requests when possible
- **Caching**: Aggressive caching of infrequently changing data

### Performance Monitoring
```javascript
// Monitor ubus call performance
const performanceWrapper = (originalCall) => {
  return async (service, method, params) => {
    const start = performance.now();
    try {
      const result = await originalCall(service, method, params);
      const duration = performance.now() - start;
      console.log(`ubus ${service}.${method}: ${duration}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`ubus ${service}.${method} failed: ${duration}ms`, error);
      throw error;
    }
  };
};
```

## Security Integration

### Authentication Flow
1. User accesses LimeApp via `thisnode.info` or router IP
2. uHTTPd serves static files if no authentication required
3. Protected routes require root password authentication
4. rpcd validates credentials and issues session token
5. Subsequent requests include session token

### Access Control
```javascript
// RPC ACL configuration
{
  "unauthenticated": {
    "description": "Access controls for unauthenticated requests",
    "read": {
      "ubus": {
        "lime-utils": ["get_node_status"]
      }
    }
  },
  "root": {
    "description": "Access controls for root user",
    "read": {
      "ubus": {
        "*": ["*"]
      }
    },
    "write": {
      "ubus": {
        "*": ["*"]
      }
    }
  }
}
```

## Troubleshooting Common Issues

### ubus Service Not Found
```bash
# Check if service is running
ubus list | grep lime-utils

# Restart services
/etc/init.d/rpcd restart
/etc/init.d/uhttpd restart
```

### Authentication Failures
```bash
# Check rpcd configuration
/etc/init.d/rpcd restart

# Verify uHTTPd ACL
cat /usr/share/rpcd/acl.d/lime-app.json
```

### Performance Issues
```bash
# Monitor memory usage
free -m

# Check ubus performance
ubus -v call lime-utils get_node_status
```

## Contributing to LibreMesh Integration

### Development Setup
1. Set up LibreMesh development environment
2. Configure ubus service mocking
3. Test with real router hardware
4. Validate multi-node behavior

### Testing Requirements
- **Unit Tests**: Mock all ubus calls
- **Integration Tests**: Real ubus service interaction
- **Multi-node Tests**: Mesh network scenarios
- **Performance Tests**: Router hardware validation

### Documentation Updates
- Update this guide when adding new ubus integrations
- Document any breaking changes to API contracts
- Provide migration guides for service updates