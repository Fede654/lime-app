# API Endpoints Reference

> **Purpose**: LibreMesh ubus service endpoints and usage patterns  
> **Audience**: Plugin developers, API integration  
> **Updated**: 2025-07-08

## 🌐 ubus Protocol Overview

LiMeApp communicates with LibreMesh through the ubus (micro bus) system using JSON-RPC over HTTP.

### Request Format

```typescript
interface UbusRequest {
    jsonrpc: "2.0";
    id: number;
    method: "call";
    params: [
        string,    // session_id
        string,    // service_name
        string,    // method_name
        object     // parameters
    ];
}
```

### Response Format

```typescript
interface UbusResponse {
    jsonrpc: "2.0";
    id: number;
    result: [
        number,    // error_code (0 = success)
        any        // response_data
    ];
    error?: {
        code: number;
        message: string;
    };
}
```

### Authentication

```typescript
// Login to get session
const loginRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "call",
    params: [
        "00000000000000000000000000000000",
        "session",
        "login",
        {
            username: "root",
            password: ""
        }
    ]
};

// Use session in subsequent calls
const sessionId = loginResponse.result[1].ubus_rpc_session;
```

## 🔧 Core System Services

### session - Authentication & Session Management

**Login:**
```typescript
POST /ubus
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "call",
    "params": [
        "00000000000000000000000000000000",
        "session",
        "login",
        {
            "username": "root",
            "password": ""
        }
    ]
}
```

**Response:**
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": [
        0,
        {
            "ubus_rpc_session": "abc123...",
            "timeout": 300,
            "expires": 1641234567,
            "acls": {...},
            "data": {...}
        }
    ]
}
```

**Grant Access:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "session",
        "grant",
        {
            "ubus_rpc_session": session_id,
            "scope": "ubus",
            "objects": ["lime-utils", "iwinfo", "system"]
        }
    ]
}
```

### file - File Operations

**Read File:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "file",
        "read",
        {
            "path": "/etc/config/lime"
        }
    ]
}
```

**Write File:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "file",
        "write",
        {
            "path": "/etc/config/lime",
            "data": "config content here"
        }
    ]
}
```

**List Directory:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "file",
        "list",
        {
            "path": "/etc/config/"
        }
    ]
}
```

### system - System Information

**Get System Info:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "system",
        "info",
        {}
    ]
}
```

**Response:**
```json
{
    "result": [0, {
        "hostname": "LibreMesh-abc123",
        "kernel": "4.14.195",
        "model": "Generic x86_64",
        "system": "OpenWrt 19.07.8",
        "release": {
            "distribution": "OpenWrt",
            "version": "19.07.8"
        }
    }]
}
```

## 📡 LibreMesh Services

### lime-utils - Core LibreMesh Utilities

**Get Node Status:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-utils",
        "get_node_status",
        {}
    ]
}
```

**Get Network Status:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-utils",
        "get_network_status",
        {}
    ]
}
```

**Get Station Signal:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-utils",
        "get_station_signal",
        {
            "device": "wlan0-mesh_11s"
        }
    ]
}
```

**Get Associated Stations:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-utils",
        "get_assoc",
        {
            "device": "wlan0-ap"
        }
    ]
}
```

### iwinfo - WiFi Information

**Get WiFi Info:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "iwinfo",
        "info",
        {
            "device": "wlan0"
        }
    ]
}
```

**Scan Networks:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "iwinfo",
        "scan",
        {
            "device": "wlan0"
        }
    ]
}
```

**Get Association List:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "iwinfo",
        "assoclist",
        {
            "device": "wlan0-ap"
        }
    ]
}
```

### lime-batman-adv - Batman Mesh Protocol

**Get Neighbors:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-batman-adv",
        "get_neighbors",
        {}
    ]
}
```

**Get Gateways:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-batman-adv",
        "get_gateways",
        {}
    ]
}
```

**Get Originators:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-batman-adv",
        "get_originators",
        {}
    ]
}
```

### lime-config - Configuration Management

**Get Configuration:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-config",
        "get",
        {
            "key": "wifi.ap_ssid"
        }
    ]
}
```

**Set Configuration:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-config",
        "set",
        {
            "wifi.ap_ssid": "MyNetwork",
            "wifi.ap_key": "MyPassword"
        }
    ]
}
```

**Apply Configuration:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-config",
        "apply",
        {}
    ]
}
```

## 🔌 Plugin-Specific Services

### lime-notes - Notes Management

**Get Notes:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-notes",
        "get",
        {}
    ]
}
```

**Set Note:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-notes",
        "set",
        {
            "note": "This is a note about the node"
        }
    ]
}
```

### lime-ground-routing - Ground Routing

**Get Routes:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-ground-routing",
        "get_routes",
        {}
    ]
}
```

**Set Route:**
```typescript
{
    "method": "call",
    "params": [
        session_id,
        "lime-ground-routing",
        "set_route",
        {
            "destination": "192.168.1.0/24",
            "gateway": "192.168.1.1"
        }
    ]
}
```

## 📊 Usage Patterns

### TanStack Query Integration

```typescript
// API client wrapper
export const uHTTPdCall = async (
    service: string,
    method: string,
    params: any = {}
): Promise<any> => {
    const sessionId = getSessionId();
    
    const response = await fetch('/ubus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'call',
            params: [sessionId, service, method, params],
        }),
    });
    
    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.error.message);
    }
    
    if (data.result[0] !== 0) {
        throw new Error(`ubus error: ${data.result[0]}`);
    }
    
    return data.result[1];
};

// Query hook
export const useNodeStatus = () => {
    return useQuery({
        queryKey: ['lime-utils', 'node-status'],
        queryFn: () => uHTTPdCall('lime-utils', 'get_node_status'),
        staleTime: 5000,
        refetchInterval: 30000,
    });
};

// Mutation hook
export const useSetConfiguration = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (config: Record<string, any>) => 
            uHTTPdCall('lime-config', 'set', config),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lime-config'] });
        },
    });
};
```

### Error Handling

```typescript
// Common error types
enum UbusErrorCode {
    SUCCESS = 0,
    INVALID_COMMAND = 1,
    INVALID_ARGUMENT = 2,
    METHOD_NOT_FOUND = 3,
    NOT_FOUND = 4,
    NO_DATA = 5,
    PERMISSION_DENIED = 6,
    TIMEOUT = 7,
    NOT_SUPPORTED = 8,
    UNKNOWN_ERROR = 9,
}

// Error handling wrapper
export const handleUbusError = (error: any) => {
    if (error.code === UbusErrorCode.PERMISSION_DENIED) {
        // Redirect to login
        window.location.href = '/login';
        return;
    }
    
    if (error.code === UbusErrorCode.TIMEOUT) {
        // Show retry button
        throw new Error('Request timeout. Please try again.');
    }
    
    // Generic error
    throw new Error(`API Error: ${error.message}`);
};
```

### Authentication State Management

```typescript
// Session management
export const useAuth = () => {
    const [session, setSession] = useState<string | null>(null);
    
    const login = async (username: string, password: string) => {
        const response = await uHTTPdCall('session', 'login', {
            username,
            password,
        });
        
        setSession(response.ubus_rpc_session);
        localStorage.setItem('session', response.ubus_rpc_session);
    };
    
    const logout = () => {
        if (session) {
            uHTTPdCall('session', 'destroy', { ubus_rpc_session: session });
        }
        setSession(null);
        localStorage.removeItem('session');
    };
    
    return { session, login, logout };
};
```

## 🔍 Service Discovery

### List Available Services

```typescript
{
    "method": "list",
    "params": ["*"]
}
```

### Get Service Methods

```typescript
{
    "method": "list",
    "params": ["lime-utils"]
}
```

## 🧪 Testing with QEMU

### Test Connectivity

```bash
# Test basic connectivity
curl -X POST http://10.13.0.1/ubus -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "list",
    "params": ["*"]
}'
```

### Test Authentication

```bash
# Login
curl -X POST http://10.13.0.1/ubus -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "call",
    "params": [
        "00000000000000000000000000000000",
        "session",
        "login",
        {"username": "root", "password": ""}
    ]
}'

# Use session
curl -X POST http://10.13.0.1/ubus -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "call",
    "params": [
        "SESSION_ID_HERE",
        "lime-utils",
        "get_node_status",
        {}
    ]
}'
```

## 📚 Common API Patterns

### Polling Pattern

```typescript
// Automatic refresh for real-time data
export const useRealtimeData = (service: string, method: string) => {
    return useQuery({
        queryKey: [service, method],
        queryFn: () => uHTTPdCall(service, method),
        refetchInterval: 5000, // 5 seconds
        refetchIntervalInBackground: true,
    });
};
```

### Optimistic Updates

```typescript
// Update UI immediately, rollback on error
export const useOptimisticUpdate = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: updateConfig,
        onMutate: async (newConfig) => {
            // Cancel outgoing queries
            await queryClient.cancelQueries({ queryKey: ['config'] });
            
            // Snapshot previous value
            const previousConfig = queryClient.getQueryData(['config']);
            
            // Optimistically update
            queryClient.setQueryData(['config'], newConfig);
            
            return { previousConfig };
        },
        onError: (err, newConfig, context) => {
            // Rollback on error
            queryClient.setQueryData(['config'], context?.previousConfig);
        },
        onSettled: () => {
            // Refresh from server
            queryClient.invalidateQueries({ queryKey: ['config'] });
        },
    });
};
```

## 🔗 Related Documentation

- **[Creating Plugins](../03-guides/creating-plugins.md)** - Plugin development guide
- **[Architecture Overview](../01-architecture/overview.md)** - System architecture
- **[Development Setup](../00-quick-start/development-setup.md)** - Environment setup
- **[QEMU Integration](../02-development/qemu-integration.md)** - Testing with QEMU

---

**Need more details?** Check the LibreMesh documentation or inspect network requests in the browser developer tools while using the app.