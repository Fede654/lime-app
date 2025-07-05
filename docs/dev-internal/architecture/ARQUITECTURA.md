# Arquitectura del Proyecto LiMeApp

## Introducción

LiMeApp es una aplicación web construida con Preact que proporciona una interfaz de usuario para la gestión de routers LibreMesh. Este documento describe la arquitectura del sistema, los patrones de diseño utilizados y las mejores prácticas para el desarrollo.

## Visión General del Sistema

### Propósito

LiMeApp ofrece una interfaz web sin complejidades técnicas para la configuración y mantenimiento de nodos LibreMesh, facilitando la gestión de redes mesh comunitarias.

### Tecnologías Principales

-   **Frontend**: Preact (alternativa ligera a React, 3kB)
-   **Lenguaje**: TypeScript con JavaScript
-   **Estilos**: CSS Modules + Tailwind CSS + Less
-   **Gestión de Estado**: TanStack Query (React Query) + Redux legacy
-   **Testing**: Jest + Testing Library
-   **Build**: Preact CLI con configuración Webpack personalizada

## Arquitectura de la Aplicación

### 1. Estructura de Directorios

```
lime-app/
├── src/                    # Código fuente principal
│   ├── components/         # Componentes reutilizables
│   ├── containers/         # Contenedores de páginas
│   ├── utils/             # Utilidades y helpers
│   ├── store.js           # Configuración Redux (legacy)
│   └── config.ts          # Configuración de plugins
├── plugins/               # Sistema de plugins
│   └── lime-plugin-*/     # Plugins individuales
├── i18n/                  # Archivos de traducción (24 idiomas)
├── scripts/               # Scripts de desarrollo y verificación
└── docs/                  # Documentación
```

### 2. Sistema de Plugins

#### Arquitectura Modular

La aplicación utiliza un sistema de plugins que permite extensibilidad y mantenibilidad:

```typescript
// Estructura de un plugin
interface Plugin {
    name: string;
    page: ComponentType;
    menu: ComponentType;
    additionalRoutes?: Route[];
    additionalProtectedRoutes?: Route[];
    menuGroup?: string;
}
```

#### Registro de Plugins

Los plugins se registran en `src/config.ts`:

```typescript
import { meshWidePlugin } from "plugins/lime-plugin-mesh-wide";
import { nodesPlugin } from "plugins/lime-plugin-nodes";

export const plugins = [
    meshWidePlugin,
    nodesPlugin,
    // ... otros plugins
];
```

#### Estructura de Plugin Estándar

```
plugins/lime-plugin-ejemplo/
├── index.ts               # Punto de entrada y registro
├── ejemplo.spec.js        # Tests del componente
├── ejemplo.stories.js     # Historias de Storybook
└── src/
    ├── EjemploPage.js     # Componente principal
    ├── EjemploMenu.js     # Elemento de menú
    ├── EjemploApi.js      # Endpoints del backend
    ├── EjemploApi.spec.js # Tests de API
    ├── EjemploQueries.js  # Hooks de TanStack Query
    └── style.less         # Estilos del componente
```

### 3. Gestión de Estado

#### TanStack Query (Enfoque Moderno)

Utilizado para operaciones de red y caché:

```javascript
// Ejemplo de query
import { useQuery } from "@tanstack/react-query";

import { getSystemInfo } from "./SystemApi";

export const useSystemInfo = () => {
    return useQuery({
        queryKey: ["system", "info"],
        queryFn: getSystemInfo,
        staleTime: 30000,
    });
};
```

#### Redux (Sistema Legacy)

Mantiene estado global para compatibilidad:

```javascript
// store.js
import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "./reducers";

export const store = configureStore({
    reducer: rootReducer,
    middleware: [...middleware],
});
```

### 4. Comunicación con Backend

#### Protocolo ubus JSON-RPC

La comunicación con LibreMesh utiliza llamadas ubus:

```javascript
// Ejemplo de llamada ubus
import api from "utils/uhttpd";

export const getNodeStatus = () =>
    api.call("lime-utils", "get_node_status", {});

export const setNodeConfig = (config) =>
    api.call("lime-utils", "set_config", { config });
```

#### Endpoints Principales

-   `/ubus` - Llamadas JSON-RPC a servicios LibreMesh
-   `/cgi-bin/**` - Scripts CGI del router

### 5. Sistema de Routing

#### Rutas Públicas y Protegidas

```javascript
// app.tsx
<Router>
    <Route path="/" component={HomePage} />
    <CommunityProtectedRoute path="/admin" component={AdminPage} />
    <Route path="/status" component={StatusPage} />
</Router>
```

#### Generación Automática de Menús

Los elementos de menú se generan automáticamente desde las definiciones de plugins:

```typescript
// Agrupación de menús
const menuGroups = {
    meshwide: "Red Mesh",
    node: "Nodo Local",
    admin: "Administración",
};
```

## Patrones de Desarrollo

### 1. Desarrollo Dirigido por Tests (TDD)

#### Estructura de Tests

```javascript
// ejemplo.spec.js
import { render, screen } from "utils/test_utils";

import { EjemploComponent } from "./EjemploComponent";

// Mock de APIs
jest.mock("./src/EjemploApi");

describe("EjemploComponent", () => {
    it("renderiza sin errores", () => {
        render(<EjemploComponent />);
        expect(screen.getByTestId("ejemplo-component")).toBeInTheDocument();
    });

    it("maneja interacciones de usuario", async () => {
        render(<EjemploComponent />);
        // Tests de interacción...
    });
});
```

#### Tests de API

```javascript
// EjemploApi.spec.js
import { getEjemploData } from "./EjemploApi";

describe("EjemploApi", () => {
    it("realiza llamadas ubus correctas", async () => {
        const resultado = await getEjemploData();
        expect(resultado).toEqual(
            expect.objectContaining({
                status: "ok",
                data: expect.any(Object),
            })
        );
    });
});
```

### 2. Internacionalización (i18n)

#### Sistema LinguiJS

```javascript
// Uso de traducciones
import { Trans, t } from "@lingui/macro";

function MiComponente() {
    return (
        <div>
            <Trans>Bienvenido a LiMeApp</Trans>
            <button title={t`Guardar configuración`}>
                <Trans>Guardar</Trans>
            </button>
        </div>
    );
}
```

#### Proceso de Traducción

```bash
# Extraer strings para traducir
npm run translations:extract

# Compilar traducciones
npm run translations:compile
```

### 3. Desarrollo de Componentes con Storybook

#### Historias de Componentes

```javascript
// ejemplo.stories.js
export default {
    title: "Plugins/Ejemplo",
    component: EjemploComponent,
};

export const Default = () => <EjemploComponent />;
export const ConDatos = () => <EjemploComponent data={mockData} />;
export const EstadoCarga = () => <EjemploComponent loading={true} />;
```

## Configuración del Entorno de Desarrollo

### Requisitos del Sistema

-   Node.js v20 o superior
-   npm (última versión)
-   Git
-   QEMU (para entorno LibreMesh completo)

### Comandos Principales

```bash
# Instalación inicial
npm install

# Desarrollo con backend mockeado
npm run dev

# Desarrollo con LibreMesh real (QEMU)
npm run qemu:start
npm run qemu:dev

# Verificación del entorno
npm run verify:setup

# Tests
npm test
npm run test:watch
npm run test:coverage

# Calidad de código
npm run lint
npm run lint:fix

# Construcción para producción
npm run build:production
```

### Verificación del Entorno

El proyecto incluye scripts de verificación automática:

```bash
# Verificación completa del entorno
npm run verify:setup

# Verificación del entorno QEMU
npm run verify:qemu

# Verificación multiplataforma
npm run verify:cross-platform
```

## Integración con LibreMesh

### Entorno QEMU

Para desarrollo auténtico con LibreMesh:

1. **Configuración de QEMU**:

    ```bash
    # Iniciar LibreMesh en QEMU
    npm run qemu:start

    # Verificar conectividad
    npm run qemu:check
    ```

2. **Acceso al Sistema**:

    - LibreMesh Web: `http://10.13.0.1`
    - LiMeApp en QEMU: `http://10.13.0.1/app`
    - Servidor de desarrollo: `http://localhost:8080`

3. **Consola LibreMesh**:

    ```bash
    # Acceder a la consola
    screen -r libremesh

    # Configurar red (si es necesario)
    ip addr add 10.13.0.1/16 dev br-lan
    ```

### Comunicación ubus

El protocolo ubus permite interactuar con servicios LibreMesh:

```javascript
// Ejemplo de servicio de red
export const getNetworkStatus = () =>
    api.call("network.interface", "status", { interface: "lan" });

export const getWirelessStatus = () =>
    api.call("network.wireless", "status", {});
```

## Mejores Prácticas

### 1. Desarrollo de Componentes

-   Utilizar TypeScript para tipado fuerte
-   Implementar PropTypes o interfaces TypeScript
-   Crear tests para cada componente
-   Desarrollar historias de Storybook
-   Seguir convenciones de nomenclatura del proyecto

### 2. Gestión de Estado

-   Preferir TanStack Query para operaciones de red
-   Usar Redux solo para estado global compartido
-   Implementar patrones de caché apropiados
-   Manejar estados de carga y error consistentemente

### 3. Testing

-   Mockear llamadas API en tests de componentes
-   Usar `render()` de `utils/test_utils` para configuración consistente
-   Implementar tests de integración para flujos críticos
-   Mantener cobertura de tests superior al 80%

### 4. Accesibilidad

-   Implementar ARIA labels apropiados
-   Asegurar navegación por teclado
-   Mantener contraste de colores adecuado
-   Probar con lectores de pantalla

### 5. Rendimiento

-   Utilizar `React.memo()` para componentes pesados
-   Implementar lazy loading para rutas
-   Optimizar imágenes y assets
-   Minimizar re-renderizados innecesarios

## Contribución al Proyecto

### Flujo de Desarrollo

1. Crear rama de feature desde `develop`
2. Implementar funcionalidad con tests
3. Ejecutar verificaciones de calidad
4. Crear Pull Request hacia `develop`
5. Revisión de código y merge

### Comandos de Calidad

```bash
# Verificaciones rápidas
npm run qa:fast

# Verificaciones completas
npm run qa:full

# Preparación para upstream
npm run qa:upstream
```

### Mensajes de Commit

Seguir el formato conventional commits:

```bash
git commit -m "feat(mesh): agregar visualización de estado de nodos

- Implementar componente de estado de red
- Agregar tests unitarios y de integración
- Crear historias de Storybook para estados

🤖 AI-assisted with: Claude Code for component structure"
```

## Conclusión

Esta arquitectura proporciona una base sólida para el desarrollo de LiMeApp, facilitando la extensibilidad mediante plugins, manteniendo la calidad del código a través de tests automatizados, y asegurando la compatibilidad con el ecosistema LibreMesh.

Para información más detallada sobre configuración y desarrollo, consultar:

-   [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) - Configuración completa del entorno
-   [DEVELOPMENT_ORGANIZATION.md](./DEVELOPMENT_ORGANIZATION.md) - Colaboración humano-AI
-   [CONTRIBUTING.md](./CONTRIBUTING.md) - Guías de contribución
