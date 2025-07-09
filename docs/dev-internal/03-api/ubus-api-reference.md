# ubus API Reference for LibreMesh

> **Comprehensive reference for all ubus JSON-RPC endpoints available in lime-packages**

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Core System Services](#core-system-services)
- [LibreMesh Core Services](#libremesh-core-services)
- [Plugin-Specific Services](#plugin-specific-services)
- [Network Services](#network-services)
- [Additional Services](#additional-services)
- [CGI Endpoints](#cgi-endpoints)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Overview

LibreMesh uses ubus (micro bus) JSON-RPC over HTTP for all API communication. This document provides a complete reference of all available endpoints used by lime-app.

### Request Format

All ubus requests follow the JSON-RPC 2.0 format:

```javascript
// Standard ubus call format
[sessionId, service, method, params]

// Example
["abc123def456", "lime-utils", "get_notes", {}]
```

### Response Format

```javascript
// Success response
{
  "jsonrpc": "2.0",
  "id": null,
  "result": [0, data]  // 0 = success, data = response payload
}

// Error response
{
  "jsonrpc": "2.0", 
  "id": null,
  "result": [errorCode, errorMessage]
}
```

## Authentication

### Session Management

LibreMesh uses session-based authentication with ubus sessions.

#### `session.login`
Authenticate user and obtain session token.

```javascript
// Request
api.call("session", "login", {
  username: "root",
  password: "admin",
  timeout: 300
});

// Response
{
  ubus_rpc_session: "abc123def456789",
  timeout: 300,
  expires: 1623456789,
  data: {
    username: "root"
  }
}
```

#### `session.access`
Check current session access level.

```javascript
// Request
api.call("session", "access", {});

// Response
{
  "access-group": {
    "root": true,
    "lime-app": true
  }
}
```

**File**: `/src/utils/uhttpd.service.js`, `/src/utils/api.js`

---

## Core System Services

### system

System information and control services.

#### `system.board`
Get hardware board information.

```javascript
// Request
api.call("system", "board", {});

// Response
{
  hostname: "LiMe-abc123",
  kernel: "5.4.124",
  model: "TP-Link Archer C7 v2",
  board_name: "tl-wdr4300",
  system: "Atheros AR9344"
}
```

#### `system.reboot`
Restart the system.

```javascript
// Request
api.call("system", "reboot", {});

// Response
true
```

#### `system.info`
Get detailed system information.

```javascript
// Request
api.call("system", "info", {});

// Response
{
  hostname: "LiMe-abc123",
  kernel: "5.4.124",
  model: "TP-Link Archer C7 v2",
  uptime: 3600,
  load: [0.1, 0.05, 0.02],
  memory: {
    total: 131072,
    free: 65536,
    shared: 1024,
    buffered: 8192
  }
}
```

**Files**: `/src/utils/api.js`, `/plugins/lime-plugin-firmware/src/firmwareApi.js`

---

## LibreMesh Core Services

### lime-utils

Core LibreMesh utility services.

#### `lime-utils.get_community_settings`
Get community-wide configuration settings.

```javascript
// Request
api.call("lime-utils", "get_community_settings", {});

// Response
{
  community_settings: {
    domain: "thisnode.info",
    network_name: "LibreMesh",
    ap_ssid: "LibreMesh.org",
    ap_key: "somethingVerySecret",
    country_code: "US"
  }
}
```

#### `lime-utils.get_mesh_ifaces`
Get available mesh interfaces.

```javascript
// Request
api.call("lime-utils", "get_mesh_ifaces", {});

// Response
{
  ifaces: ["wlan0-mesh", "wlan1-mesh", "eth0.1"]
}
```

#### `lime-utils.get_cloud_nodes`
Get information about nodes in the mesh cloud.

```javascript
// Request
api.call("lime-utils", "get_cloud_nodes", {});

// Response
{
  nodes: {
    "aa:bb:cc:dd:ee:ff": {
      hostname: "LiMe-node1",
      ip: "10.13.0.1",
      status: "reachable"
    },
    "11:22:33:44:55:66": {
      hostname: "LiMe-node2", 
      ip: "10.13.0.2",
      status: "unreachable"
    }
  }
}
```

#### `lime-utils.get_notes`
Get node notes/comments.

```javascript
// Request
api.call("lime-utils", "get_notes", {});

// Response
{
  notes: "This is the main gateway node for the community center"
}
```

#### `lime-utils.set_notes`
Set node notes/comments.

```javascript
// Request
api.call("lime-utils", "set_notes", {
  notes: "Updated notes for this node"
});

// Response
true
```

#### `lime-utils.get_upgrade_info`
Get firmware upgrade information.

```javascript
// Request
api.call("lime-utils", "get_upgrade_info", {});

// Response
{
  status: "safe",
  is_upgrade_confirm_supported: true,
  safe_upgrade_confirm_remaining_s: "600"
}
```

**Files**: `/src/utils/api.js`, `/plugins/lime-plugin-align/src/alignApi.js`, `/plugins/lime-plugin-changeNode/src/changeNodeApi.js`, `/plugins/lime-plugin-notes/src/notesApi.js`, `/plugins/lime-plugin-firmware/src/firmwareApi.js`

### lime-utils-admin

Administrative LibreMesh utilities requiring elevated permissions.

#### `lime-utils-admin.set_hostname`
Change the node hostname.

```javascript
// Request
api.call("lime-utils-admin", "set_hostname", {
  hostname: "LiMe-gateway"
});

// Response
true
```

#### `lime-utils-admin.firmware_upgrade`
Start firmware upgrade process.

```javascript
// Request
api.call("lime-utils-admin", "firmware_upgrade", {
  fw_path: "/tmp/upgrade.bin",
  metadata: {
    version: "2024.1",
    keep_config: true
  }
});

// Response
{
  status: "started",
  estimated_time: 300
}
```

#### `lime-utils-admin.firmware_confirm`
Confirm firmware upgrade after reboot.

```javascript
// Request
api.call("lime-utils-admin", "firmware_confirm", {});

// Response
true
```

**Files**: `/plugins/lime-plugin-node-admin/src/nodeAdminApi.js`, `/plugins/lime-plugin-firmware/src/firmwareApi.js`

---

## Plugin-Specific Services

### lime-fbw

First Boot Wizard service for initial network configuration.

#### `lime-fbw.status`
Get current FBW status.

```javascript
// Request
api.call("lime-fbw", "status", {});

// Response
{
  lock: false,
  scanning: true,
  networks: ["LibreMesh-Community1", "LibreMesh-Community2"]
}
```

#### `lime-fbw.start`
Start network scanning.

```javascript
// Request
api.call("lime-fbw", "start", {});

// Response
{
  status: "started"
}
```

#### `lime-fbw.stop`
Stop network scanning.

```javascript
// Request
api.call("lime-fbw", "stop", {});

// Response
{
  status: "stopped"
}
```

#### `lime-fbw.set_network`
Join existing network.

```javascript
// Request
api.call("lime-fbw", "set_network", {
  file: "LibreMesh-Community1.tar.gz",
  hostname: "LiMe-node3"
});

// Response
{
  status: "configuring",
  restart_required: true
}
```

#### `lime-fbw.create_network`
Create new network.

```javascript
// Request
api.call("lime-fbw", "create_network", {
  network: "MyNewNetwork",
  hostname: "LiMe-gateway",
  adminPassword: "securePassword123"
});

// Response
{
  status: "created",
  config_generated: true
}
```

#### `lime-fbw.dismiss`
Dismiss First Boot Wizard.

```javascript
// Request
api.call("lime-fbw", "dismiss", {});

// Response
true
```

**Files**: `/plugins/lime-plugin-fbw/src/FbwApi.js`

### lime-groundrouting

Ground routing configuration service.

#### `lime-groundrouting.get`
Get ground routing configuration.

```javascript
// Request
api.call("lime-groundrouting", "get", {});

// Response
{
  config: {
    enabled: true,
    gateway: "10.13.0.1",
    dns_servers: ["8.8.8.8", "1.1.1.1"],
    routes: [
      {
        dest: "0.0.0.0/0",
        gateway: "10.13.0.1",
        metric: 100
      }
    ]
  }
}
```

#### `lime-groundrouting.set`
Set ground routing configuration.

```javascript
// Request
api.call("lime-groundrouting", "set", {
  enabled: true,
  gateway: "10.13.0.1",
  dns_servers: ["8.8.8.8", "1.1.1.1"]
});

// Response
{
  status: "configured",
  restart_required: true
}
```

**Files**: `/plugins/lime-plugin-ground-routing/src/groundRoutingApi.js`

### lime-location

Location and mapping services.

#### `lime-location.get`
Get node location.

```javascript
// Request
api.call("lime-location", "get", {});

// Response
{
  lat: "40.7128",
  lon: "-74.0060",
  altitude: 10,
  accuracy: 5
}
```

#### `lime-location.set`
Set node location.

```javascript
// Request
api.call("lime-location", "set", {
  lat: "40.7128",
  lon: "-74.0060"
});

// Response
true
```

#### `lime-location.all_nodes_and_links`
Get all nodes and their interconnections.

```javascript
// Request
api.call("lime-location", "all_nodes_and_links", {});

// Response
{
  nodes: {
    "aa:bb:cc:dd:ee:ff": {
      hostname: "LiMe-node1",
      location: { lat: "40.7128", lon: "-74.0060" },
      status: "online"
    }
  },
  links: [
    {
      from: "aa:bb:cc:dd:ee:ff",
      to: "11:22:33:44:55:66",
      quality: 85,
      signal: -45
    }
  ]
}
```

**Files**: `/plugins/lime-plugin-locate/src/locateApi.js`

### lime-metrics

Network metrics and performance monitoring.

#### `lime-metrics.get_metrics`
Get network metrics for specific target.

```javascript
// Request
api.call("lime-metrics", "get_metrics", {
  target: "10.13.0.2"
});

// Response
{
  target: "10.13.0.2",
  rtt: {
    min: 1.2,
    avg: 2.1,
    max: 3.5
  },
  loss: 0.1,
  bandwidth: 54000
}
```

#### `lime-metrics.get_gateway`
Get current gateway information.

```javascript
// Request
api.call("lime-metrics", "get_gateway", {});

// Response
{
  gateway: "10.13.0.1",
  interface: "wlan0",
  metric: 100
}
```

#### `lime-metrics.get_path`
Get network path to target.

```javascript
// Request
api.call("lime-metrics", "get_path", {});

// Response
{
  path: "10.13.0.3 -> 10.13.0.1 -> 0.0.0.0"
}
```

#### `lime-metrics.get_loss`
Get packet loss to target.

```javascript
// Request
api.call("lime-metrics", "get_loss", {
  target: "10.13.0.2"
});

// Response
{
  loss: "0.5%"
}
```

**Files**: `/plugins/lime-plugin-metrics/src/metricsApi.js`

---

## Network Services

### iwinfo

WiFi information service.

#### `iwinfo.assoclist`
Get list of associated stations.

```javascript
// Request
api.call("iwinfo", "assoclist", {
  device: "wlan0"
});

// Response
{
  results: [
    {
      mac: "aa:bb:cc:dd:ee:ff",
      signal: -45,
      noise: -95,
      inactive: 10,
      rx_rate: 54000,
      tx_rate: 54000
    }
  ]
}
```

**Files**: `/plugins/lime-plugin-align/src/alignApi.js`

### wireless-service

Wireless service management.

#### `wireless-service.get_access_points_data`
Get access points data.

```javascript
// Request
api.call("wireless-service", "get_access_points_data", {});

// Response
{
  access_points: [
    {
      ssid: "LibreMesh.org",
      enabled: true,
      encryption: "psk2",
      key: "somethingVerySecret"
    }
  ]
}
```

**Files**: `/plugins/lime-plugin-node-admin/src/nodeAdminApi.js`

### wireless-service-admin

Administrative wireless service operations.

#### `wireless-service-admin.set_node_ap`
Configure node access point.

```javascript
// Request
api.call("wireless-service-admin", "set_node_ap", {
  password: "newPassword123",
  has_password: true
});

// Response
{
  status: "configured",
  restart_required: true
}
```

#### `wireless-service-admin.set_community_ap`
Configure community access point.

```javascript
// Request
api.call("wireless-service-admin", "set_community_ap", {
  enabled: true
});

// Response
{
  status: "configured"
}
```

**Files**: `/plugins/lime-plugin-node-admin/src/nodeAdminApi.js`

---

## Additional Services

### bat-hosts

Batman-adv host information.

#### `bat-hosts.get_bathost`
Get batman host information.

```javascript
// Request
api.call("bat-hosts", "get_bathost", {
  mac: "aa:bb:cc:dd:ee:ff",
  outgoing_iface: "wlan0-mesh"
});

// Response
{
  bathost: {
    hostname: "LiMe-node1",
    mac: "aa:bb:cc:dd:ee:ff",
    last_seen: 1623456789,
    tq: 255
  }
}
```

**Files**: `/src/utils/api.js`

### check-internet

Internet connectivity testing.

#### `check-internet.is_connected`
Check internet connectivity.

```javascript
// Request
api.call("check-internet", "is_connected", {});

// Response
{
  connected: true,
  ping_time: 12.5,
  dns_working: true
}
```

**Files**: `/src/utils/api.js`

### eupgrade

Enhanced upgrade service.

#### `eupgrade.is_new_version_available`
Check for new firmware version.

```javascript
// Request
api.call("eupgrade", "is_new_version_available", {});

// Response
{
  available: true,
  version: "2024.1",
  download_url: "https://downloads.libremesh.org/...",
  changelog: "Bug fixes and performance improvements"
}
```

#### `eupgrade.download_status`
Get download status.

```javascript
// Request
api.call("eupgrade", "download_status", {});

// Response
{
  status: "downloading",
  progress: 45,
  speed: "1.2 MB/s",
  eta: "2 minutes"
}
```

#### `eupgrade.start_download`
Start firmware download.

```javascript
// Request
api.call("eupgrade", "start_download", {});

// Response
{
  status: "started",
  estimated_time: 300
}
```

**Files**: `/plugins/lime-plugin-firmware/src/firmwareApi.js`

### pirania

Captive portal service.

#### `pirania.get_portal_config`
Get captive portal configuration.

```javascript
// Request
api.call("pirania", "get_portal_config", {});

// Response
{
  enabled: true,
  interface: "wlan0",
  timeout: 3600,
  welcome_message: "Welcome to LibreMesh",
  success_message: "You are now connected!"
}
```

#### `pirania.set_portal_config`
Set captive portal configuration.

```javascript
// Request
api.call("pirania", "set_portal_config", {
  enabled: true,
  timeout: 7200,
  welcome_message: "Welcome to our community network"
});

// Response
{
  status: "configured"
}
```

#### `pirania.list_vouchers`
List available vouchers.

```javascript
// Request
api.call("pirania", "list_vouchers", {});

// Response
{
  vouchers: [
    {
      id: "voucher1",
      name: "Guest Pass",
      duration: 3600,
      remaining_uses: 5,
      created: 1623456789
    }
  ]
}
```

#### `pirania.add_vouchers`
Add new vouchers.

```javascript
// Request
api.call("pirania", "add_vouchers", {
  name: "Daily Pass",
  duration: 86400,
  quantity: 10
});

// Response
{
  vouchers: [
    {
      id: "voucher2",
      name: "Daily Pass",
      code: "DAILY-PASS-001",
      duration: 86400
    }
  ]
}
```

**Files**: `/plugins/lime-plugin-pirania/src/piraniaApi.js`

### tmate

Remote support service.

#### `tmate.get_session`
Get current remote support session.

```javascript
// Request
api.call("tmate", "get_session", {});

// Response
{
  session: {
    rw_ssh: "ssh abc123@tmate.io",
    ro_ssh: "ssh ro-def456@tmate.io",
    web_session: "https://tmate.io/t/ghi789"
  }
}
```

#### `tmate.open_session`
Open remote support session.

```javascript
// Request
api.call("tmate", "open_session", {});

// Response
{
  session: {
    rw_ssh: "ssh abc123@tmate.io",
    status: "connected"
  }
}
```

#### `tmate.close_session`
Close remote support session.

```javascript
// Request
api.call("tmate", "close_session", {});

// Response
{
  status: "closed"
}
```

**Files**: `/plugins/lime-plugin-remotesupport/src/remoteSupportApi.js`

---

## CGI Endpoints

### File Upload

#### `/cgi-bin/cgi-upload`
Upload files to the router.

```javascript
// Request (multipart/form-data)
const formData = new FormData();
formData.append('sessionid', sessionId);
formData.append('filename', 'firmware.bin');
formData.append('filedata', fileBlob);

fetch('/cgi-bin/cgi-upload', {
  method: 'POST',
  body: formData
});

// Response
{
  status: "uploaded",
  filename: "firmware.bin",
  size: 8388608,
  path: "/tmp/firmware.bin"
}
```

#### `/cgi-bin/hostname`
Get current hostname.

```javascript
// Request
fetch('/cgi-bin/hostname');

// Response (plain text)
"LiMe-abc123"
```

**Files**: `/plugins/lime-plugin-firmware/src/firmwareApi.js`, `/plugins/lime-plugin-fbw/src/containers/Setting.js`

---

## Error Handling

### Common Error Codes

| Code | Description | Action |
|------|-------------|--------|
| 0 | Success | Continue normally |
| 1 | Invalid command | Check method name |
| 2 | Invalid argument | Validate parameters |
| 3 | Method not found | Check service availability |
| 4 | Not found | Resource doesn't exist |
| 5 | No data | Empty result set |
| 6 | Permission denied | Check authentication |
| 7 | Timeout | Retry or check connectivity |
| 8 | Not supported | Feature unavailable |
| 9 | Unknown error | Generic error |

### Error Response Format

```javascript
{
  "jsonrpc": "2.0",
  "id": null,
  "result": [6, "Access denied"]
}
```

### Handling Patterns

```javascript
// Standard error handling
api.call("service", "method", params)
  .then(result => {
    if (result && result.length > 0 && result[0] === 0) {
      // Success - result[1] contains data
      return result[1];
    } else {
      // Error - result[1] contains error message
      throw new Error(result[1] || 'Unknown error');
    }
  })
  .catch(error => {
    // Handle network or parsing errors
    console.error('API call failed:', error);
  });
```

---

## Best Practices

### Authentication

1. **Always check session validity** before making authenticated calls
2. **Handle session expiration** gracefully with re-authentication
3. **Store session securely** in sessionStorage, not localStorage
4. **Use appropriate timeout values** for long-running operations

### Error Handling

1. **Check response format** before processing data
2. **Implement retry logic** for transient failures
3. **Provide user feedback** for all error conditions
4. **Log errors appropriately** for debugging

### Performance

1. **Use TanStack Query** for caching and deduplication
2. **Implement optimistic updates** where appropriate
3. **Batch related API calls** when possible
4. **Cache frequently accessed data** like community settings

### Security

1. **Validate all inputs** before sending to API
2. **Sanitize responses** before displaying to users
3. **Use HTTPS** in production environments
4. **Implement proper CORS** headers

### Development

1. **Mock API responses** for frontend development
2. **Use TypeScript** for better API contract enforcement
3. **Document API changes** when adding new endpoints
4. **Test error conditions** thoroughly

---

## Usage Examples

### Basic API Call

```javascript
import api from 'utils/api';

// Simple API call
const getSystemInfo = async () => {
  try {
    const response = await api.call('system', 'board', {});
    return response;
  } catch (error) {
    console.error('Failed to get system info:', error);
    throw error;
  }
};
```

### TanStack Query Integration

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'utils/api';

// Query hook
export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: () => api.call('lime-utils', 'get_notes', {}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hook
export const useUpdateNotes = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notes) => api.call('lime-utils', 'set_notes', { notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
```

### Error Handling with Fallbacks

```javascript
// Robust API call with fallbacks
const getStatusWithFallback = async () => {
  try {
    const response = await api.call('lime-fbw', 'status', {});
    return response;
  } catch (error) {
    if (error.message.includes('Method not found')) {
      // Service not available, return safe default
      return { lock: false };
    }
    throw error;
  }
};
```

---

This reference provides comprehensive documentation for all ubus API endpoints available in LibreMesh. For implementation examples, see the corresponding API files in the lime-app codebase.

**Last Updated**: July 2025  
**Version**: Based on lime-app v4-foundation