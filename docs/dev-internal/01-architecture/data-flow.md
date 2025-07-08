# 🌊 Flujo de Datos Visual - LiMeApp

## 🎯 Diagrama Principal de Arquitectura

```mermaid
graph TB
    subgraph "Cliente (Navegador)"
        UI[🎨 Interfaz Usuario]
        RC[⚡ React Components]
        RQ[🔄 React Query Cache]
        SW[👷 Service Worker]
    end

    subgraph "Estado y Gestión"
        QC[💾 Query Client]
        LS[🗃️ Local Storage]
        SS[🔒 Session Storage]
    end

    subgraph "Router LibreMesh"
        UH[🌐 uHTTPd Server]
        UB[📡 ubus JSON-RPC]
        LS2[📊 Lime Services]
    end

    subgraph "Sistema LibreMesh"
        BWM[📶 BatMAN-adv]
        OLSRv2[🗺️ OLSRv2]
        BMX7[🚀 BMX7]
        WIFI[📶 WiFi]
    end

    UI --> RC
    RC --> RQ
    RQ --> QC
    QC --> UH
    UH --> UB
    UB --> LS2
    LS2 --> BWM
    LS2 --> OLSRv2
    LS2 --> BMX7
    LS2 --> WIFI

    QC -.-> LS
    QC -.-> SS
    RC -.-> SW
```

## 🔄 Flujo de Datos Detallado

### 1. 📱 Interacción del Usuario

```mermaid
sequenceDiagram
    participant U as Usuario
    participant UI as Interfaz
    participant RC as React Component
    participant RQ as React Query
    participant API as ubus API
    participant R as Router

    U->>UI: Click/Acción
    UI->>RC: Event Handler
    RC->>RQ: useQuery/useMutation
    RQ->>API: HTTP Request
    API->>R: JSON-RPC Call
    R-->>API: Respuesta
    API-->>RQ: Datos/Error
    RQ-->>RC: Estado actualizado
    RC-->>UI: Re-render
    UI-->>U: Feedback visual
```

### 2. 🏗️ Arquitectura de Plugins

```mermaid
graph LR
    subgraph "Core App"
        Router[🧭 Router]
        Menu[📋 Menu System]
        Layout[📐 Layout]
    end

    subgraph "Plugin Loader"
        PL[🔌 Plugin Loader]
        PR[📝 Plugin Registry]
    end

    subgraph "Plugins"
        PM[📊 Metrics]
        PL2[📍 Locate]
        PA[📶 Align]
        PF[🔧 Firmware]
        PN[📝 Notes]
    end

    Router --> PL
    PL --> PR
    PR --> PM
    PR --> PL2
    PR --> PA
    PR --> PF
    PR --> PN

    PM --> Menu
    PL2 --> Menu
    PA --> Menu
    PF --> Menu
    PN --> Menu
```

### 3. 💾 Gestión de Estado (React Query)

```mermaid
stateDiagram-v2
    [*] --> idle: Initial
    idle --> loading: fetch()
    loading --> success: data received
    loading --> error: fetch failed
    success --> refetching: refetch()
    error --> loading: retry()
    refetching --> success: data updated
    refetching --> error: refetch failed
    success --> stale: after staleTime
    stale --> refetching: background refetch

    state success {
        [*] --> fresh
        fresh --> stale: after staleTime
    }
```

## 🌐 Comunicación con Router

### ubus JSON-RPC Protocol

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "call",
    "params": [
        "session_id",
        "service_name",
        "method_name",
        { "param1": "value1" }
    ]
}
```

### Servicios LibreMesh Principales

```mermaid
graph TD
    UBUS[📡 ubus] --> LW[lime-utils]
    UBUS --> LC[lime-config]
    UBUS --> LM[lime-metrics]
    UBUS --> LS[lime-system]
    UBUS --> file[file]
    UBUS --> system[system]

    LW --> NODE[Node Info]
    LC --> CONFIG[Configuration]
    LM --> METRICS[Network Metrics]
    LS --> STATUS[System Status]
    file --> FILES[File Operations]
    system --> SYS[System Calls]
```

## 🧩 Flujo de Desarrollo Plugin

### Ciclo de Vida Plugin

```mermaid
graph TB
    START[🚀 Inicio] --> REG[📝 Registro en config.ts]
    REG --> LOAD[⚡ Carga dinámica]
    LOAD --> ROUTE[🧭 Routing setup]
    ROUTE --> MENU[📋 Menu integration]
    MENU --> RENDER[🎨 Component render]
    RENDER --> API[📡 API calls]
    API --> STATE[💾 State management]
    STATE --> CACHE[🗃️ Query cache]
    CACHE --> UI[✨ UI update]
```

### Estructura Plugin Estándar

```
plugins/lime-plugin-example/
├── index.ts                 # Plugin registration
├── example.spec.js         # Component tests
├── example.stories.js      # Storybook stories
└── src/
    ├── ExamplePage.tsx     # Main component
    ├── ExampleMenu.tsx     # Menu component
    ├── ExampleApi.js       # API endpoints
    ├── ExampleQueries.js   # React Query hooks
    └── style.less          # Styles
```

## 🔄 Migration Path: Redux → React Query

```mermaid
graph LR
    subgraph "Legacy (Redux)"
        Actions[Actions]
        Epics[RxJS Epics]
        Reducers[Reducers]
        Selectors[Selectors]
        Store[Redux Store]
    end

    subgraph "Modern (React Query)"
        Queries[useQuery]
        Mutations[useMutation]
        Cache[Query Cache]
        Keys[Query Keys]
    end

    Actions --> Queries
    Epics --> Mutations
    Reducers --> Cache
    Selectors --> Keys
    Store --> Cache
```

## 🧪 Testing Architecture

```mermaid
graph TD
    subgraph "Testing Layers"
        UT[🧪 Unit Tests]
        IT[🔗 Integration Tests]
        E2E[🌐 E2E Tests]
        VT[👁️ Visual Tests]
    end

    subgraph "Test Tools"
        JEST[Jest]
        RTL[React Testing Library]
        MSW[Mock Service Worker]
        SB[Storybook]
    end

    UT --> JEST
    UT --> RTL
    IT --> MSW
    E2E --> QEMU[🖥️ QEMU LibreMesh]
    VT --> SB
```

## 🚀 Performance Optimizations

### Bundle Optimization

```mermaid
graph LR
    subgraph "Build Process"
        SRC[📦 Source Code]
        WP[⚙️ Webpack]
        SPLIT[✂️ Code Splitting]
        LAZY[😴 Lazy Loading]
        TREE[🌳 Tree Shaking]
        MIN[🗜️ Minification]
    end

    SRC --> WP
    WP --> SPLIT
    WP --> LAZY
    WP --> TREE
    WP --> MIN

    SPLIT --> CHUNKS[📦 Chunks]
    LAZY --> DYNAMIC[⚡ Dynamic Imports]
    TREE --> UNUSED[🗑️ Dead Code Elimination]
    MIN --> SMALL[📉 Smaller Bundle]
```

### Caching Strategy

```mermaid
graph TD
    REQ[📡 Request] --> CACHE{🗃️ Cache?}
    CACHE -->|Hit| RETURN[✅ Return Cached]
    CACHE -->|Miss| FETCH[📡 Fetch Data]
    FETCH --> STORE[💾 Store in Cache]
    STORE --> RETURN2[✅ Return Fresh]

    RETURN -.-> STALE{⏰ Stale?}
    STALE -->|Yes| BG[🔄 Background Refetch]
    STALE -->|No| FRESH[✨ Use Fresh Data]

    BG --> UPDATE[🔄 Update Cache]
    UPDATE --> NOTIFY[📢 Notify Components]
```

## 🌍 Internacionalización (i18n)

```mermaid
graph TB
    subgraph "Source"
        CODE[📝 Source Code]
        MACRO[🏷️ i18n Macros]
    end

    subgraph "Extraction"
        EXT[📤 lingui extract]
        PO[📄 .po files]
    end

    subgraph "Translation"
        ES[🇪🇸 Español]
        EN[🇺🇸 English]
        IT[🇮🇹 Italiano]
        PT[🇧🇷 Português]
        OTHER[🌍 Others...]
    end

    subgraph "Build"
        COMP[⚙️ lingui compile]
        JS[📦 Compiled JS]
    end

    CODE --> MACRO
    MACRO --> EXT
    EXT --> PO
    PO --> ES
    PO --> EN
    PO --> IT
    PO --> PT
    PO --> OTHER
    ES --> COMP
    EN --> COMP
    IT --> COMP
    PT --> COMP
    COMP --> JS
```

---

_Diagramas implementados con Mermaid.js para compatibilidad multiplataforma_
