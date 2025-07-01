# LimeApp Project Flow Diagram

## High-Level System Architecture

```mermaid
graph TB
    User[👤 User] --> Browser[🌐 Web Browser]
    Browser --> LimeApp[📱 LimeApp Frontend]
    LimeApp --> uHTTPd[🔌 uHTTPd Web Server]
    uHTTPd --> ubus[🚌 ubus System Bus]
    ubus --> Services[⚙️ LibreMesh Services]
    
    subgraph "Frontend Components"
        LimeApp --> Router[🔀 Preact Router]
        Router --> Menu[📋 Menu System]
        Router --> Plugins[🔌 Plugin Pages]
        Router --> Banner[📢 Banner System]
    end
    
    subgraph "Data Layer"
        ReactQuery[📊 React Query Cache]
        Redux[🗄️ Redux Store<br/><i>Legacy</i>]
        LocalState[💾 Component State]
    end
    
    subgraph "Backend Services"
        Services --> FBW[🚀 First Boot Wizard]
        Services --> Metrics[📈 Network Metrics]
        Services --> Location[📍 GPS/Location]
        Services --> Pirania[🎫 Captive Portal]
        Services --> Firmware[💿 Firmware Manager]
        Services --> Support[🛠️ Remote Support]
    end
```

## Plugin System Flow

```mermaid
graph TD
    Config[📝 src/config.ts] --> PluginRegistry[🏭 Plugin Registry]
    
    subgraph "Plugin Structure"
        PluginIndex[index.ts] --> PluginPage[Page Component]
        PluginIndex --> PluginMenu[Menu Item]
        PluginIndex --> Routes[Additional Routes]
        
        PluginPage --> Queries[React Query Hooks]
        PluginPage --> Components[UI Components]
        
        Queries --> API[API Endpoints]
        API --> uHTTPd2[uHTTPd Client]
    end
    
    subgraph "Plugin Examples"
        Align[🎯 Signal Alignment]
        Metrics2[📊 Network Metrics]
        Location2[🗺️ Node Location]
        Admin[⚙️ Node Admin]
        Portal[🎫 Captive Portal]
        Support2[🛠️ Remote Support]
    end
    
    PluginRegistry --> Align
    PluginRegistry --> Metrics2
    PluginRegistry --> Location2
    PluginRegistry --> Admin
    PluginRegistry --> Portal
    PluginRegistry --> Support2
```

## Component Hierarchy

```mermaid
graph TD
    App[🏠 App Component] --> AppRouter[🔀 Router]
    
    AppRouter --> Menu[📋 Menu Container]
    AppRouter --> Header[📄 Header]
    AppRouter --> PluginPages[🔌 Plugin Pages]
    
    Menu --> MenuItems[📝 Menu Items]
    
    subgraph "Shared Components"
        Loading[⏳ Loading Spinner]
        Toast[📢 Toast Notifications]
        Banner2[📢 Banner System]
        Box[📦 Content Box]
        Form[📝 Form Controls]
        List[📋 List Components]
        Tabs[🗂️ Tab Navigation]
        Switch[🔘 Toggle Switch]
        Progress[📊 Progress Bar]
        Signal[📶 Signal Bar]
        Help[❓ Help System]
        Collapsible[📁 Collapsible Panels]
    end
    
    PluginPages --> Loading
    PluginPages --> Toast
    PluginPages --> Banner2
    PluginPages --> Box
    PluginPages --> Form
    PluginPages --> List
    PluginPages --> Tabs
    PluginPages --> Switch
    PluginPages --> Progress
    PluginPages --> Signal
    PluginPages --> Help
    PluginPages --> Collapsible
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant ReactQuery
    participant API
    participant uHTTPd
    participant ubus
    participant Service
    
    User->>Component: Interaction
    Component->>ReactQuery: useQuery/useMutation
    ReactQuery->>API: Call endpoint function
    API->>uHTTPd: HTTP POST /ubus
    uHTTPd->>ubus: JSON-RPC call
    ubus->>Service: Service method
    Service-->>ubus: Response
    ubus-->>uHTTPd: JSON response
    uHTTPd-->>API: HTTP response
    API-->>ReactQuery: Parsed data
    ReactQuery-->>Component: Data/Loading/Error state
    Component-->>User: UI Update
```

## Plugin Development Flow

```mermaid
graph LR
    subgraph "Development Steps"
        A[1. Create Plugin] --> B[2. Write Tests]
        B --> C[3. Implement Component]
        C --> D[4. Create API]
        D --> E[5. Add Queries]
        E --> F[6. Style Components]
        F --> G[7. Create Stories]
        G --> H[8. Register Plugin]
    end
    
    subgraph "Testing Strategy"
        ComponentTest[🧪 Component Tests<br/>Mock APIs]
        APITest[🔌 API Tests<br/>Mock uHTTPd]
        Stories[📚 Storybook<br/>Visual Testing]
    end
    
    B --> ComponentTest
    D --> APITest
    G --> Stories
```

## Feature Implementation Status Matrix

```mermaid
graph TD
    subgraph "✅ Fully Implemented"
        RX[📊 Node Status Dashboard]
        Align2[🎯 Signal Alignment]
        Location3[🗺️ Geographic Mapping]
        Metrics3[📈 Network Monitoring]
        Notes2[📝 Node Documentation]
        NodeAdmin[⚙️ Node Configuration]
        NetAdmin[🌐 Network Administration]
        Firmware2[💿 Firmware Management]
        ChangeNode[🔄 Node Switching]
        Support3[🛠️ Remote Support]
        Portal2[🎫 Captive Portal]
        FBW2[🚀 First Boot Wizard]
    end
    
    subgraph "🔄 Migration Needed"
        LegacyRedux[📦 Redux Components<br/><i>Notes, ChangeNode</i>]
    end
    
    subgraph "🚀 Enhancement Opportunities"
        Mobile[📱 Mobile Optimization]
        Offline[🔌 Offline Capabilities]
        Analytics[📊 Usage Analytics]
        Backup[💾 Configuration Backup]
    end
```

## Authentication & Security Flow

```mermaid
graph TD
    PublicRoute[🌐 Public Routes] --> FBW3[First Boot Wizard]
    PublicRoute --> Login[🔐 Login Page]
    
    ProtectedRoute[🔒 Protected Routes] --> AuthCheck{Authenticated?}
    AuthCheck -->|No| Login
    AuthCheck -->|Yes| PluginAccess[Plugin Access]
    
    subgraph "Security Layers"
        SessionAuth[Session Authentication]
        CommunityProtection[Community Protection]
        RootAccess[Root Password]
    end
    
    AuthCheck --> SessionAuth
    PluginAccess --> CommunityProtection
    CommunityProtection --> RootAccess
```

## Network Topology Integration

```mermaid
graph TB
    subgraph "Physical Network"
        Router1[📡 Node 1]
        Router2[📡 Node 2]
        Router3[📡 Node 3]
        Router4[📡 Node 4]
        
        Router1 -.->|WiFi Mesh| Router2
        Router2 -.->|WiFi Mesh| Router3
        Router1 -.->|WiFi Mesh| Router3
        Router3 -.->|WiFi Mesh| Router4
    end
    
    subgraph "LimeApp Instances"
        App1[LimeApp @10.13.0.1]
        App2[LimeApp @10.13.0.2]
        App3[LimeApp @10.13.0.3]
        App4[LimeApp @10.13.0.4]
    end
    
    Router1 --> App1
    Router2 --> App2
    Router3 --> App3
    Router4 --> App4
    
    subgraph "Cross-Node Features"
        ChangeNode2[🔄 Node Switching]
        Metrics4[📊 Network Metrics]
        Location4[🗺️ Community Map]
        Portal3[🎫 Shared Portal]
    end
    
    App1 -.->|Switch to| App2
    App2 -.->|Switch to| App3
    App3 -.->|Switch to| App4
```

## Build & Deployment Pipeline

```mermaid
graph LR
    subgraph "Development"
        DevServer[🔧 npm run dev<br/>Hot Reload<br/>Proxy to Router]
        Storybook2[📚 Storybook<br/>Component Development]
        Tests2[🧪 Jest + Testing Library]
    end
    
    subgraph "Build Process"
        DevBuild[🔨 npm run build<br/>Development Build]
        ProdBuild[📦 npm run build:production<br/>+ Translation Compilation]
        Assets[🎨 Asset Processing<br/>CSS Modules, JSX]
    end
    
    subgraph "Deployment"
        Bundle[📱 Application Bundle]
        RouterFS[💾 Router Filesystem<br/>/www/app/]
        uHTTPd3[🌐 uHTTPd Serving<br/>thisnode.info]
    end
    
    DevServer --> DevBuild
    DevBuild --> ProdBuild
    ProdBuild --> Assets
    Assets --> Bundle
    Bundle --> RouterFS
    RouterFS --> uHTTPd3
```