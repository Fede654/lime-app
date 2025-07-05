# CLAUDE.md

> **Contexto actualizado para Claude Code - Julio 2025**  
> **Estado del proyecto**: v4-foundation con arquitectura de documentación completa

## 🎯 Project Overview

LiMeApp es una aplicación web moderna construida con **Preact** para la gestión de routers LibreMesh. Proporciona una interfaz libre de complejidades técnicas para configuración y mantenimiento de nodos LibreMesh, con arquitectura de plugins que se comunica con servicios del router via llamadas ubus JSON-RPC.

### 🌟 Estado Actual del Proyecto

- **Rama activa**: `f/v4-foundation` 
- **Documentación**: Sistema integral en español en `docs/dev-internal/`
- **Desarrollo colaborativo**: Framework IA+Humano completamente implementado
- **Testing**: Integración QEMU con 140+ tests y cobertura 85%+
- **Internacionalización**: 24 idiomas soportados (Español 100%, English 100%)

## 📚 Navegación de Documentación

### 🚀 Para desarrollo interno (team members):
- **[📖 Índice Maestro](../INDICE_MAESTRO.md)** - Navegación central de toda la documentación
- **[🛠️ Configuración Desarrollo](../guias/CONFIGURACION_DESARROLLO.md)** - Setup completo con IA+QEMU
- **[🤖 Guía Colaboración IA](GUIA_COLABORACION_IA.md)** - Workflows con Claude/Cursor/Copilot
- **[🖥️ Guía QEMU](../herramientas/GUIA_QEMU.md)** - Entorno testing LibreMesh auténtico

### 🌍 Para contribución upstream:
- **[📘 Tutorial](../../Tutorial.md)** - Guía completa de desarrollo
- **[🛠️ Development Setup](../../../DEVELOPMENT_SETUP.md)** - Configuración básica upstream-ready
- **[🤝 Contributing](../../../CONTRIBUTING.md)** - Proceso de contribución

## 🛠️ Development Commands

### Setup y Dependencias

```bash
npm install                     # Instalar dependencias del proyecto
npm run verify:setup           # ⭐ Verificación completa del entorno
npm run verify:qemu             # Verificar entorno QEMU LibreMesh
npm run verify:ai               # Verificar herramientas IA
```

### Servidor de Desarrollo

```bash
# Desarrollo básico (frontend + mocks)
npm run dev                     # Servidor con hot-reload (proxies a 10.13.0.1)

# Desarrollo avanzado (con backend real)
npm run qemu:start              # Iniciar LibreMesh en QEMU
npm run qemu:dev                # Servidor desarrollo con backend QEMU real
npm run deploy:qemu             # ⭐ Build + deploy a QEMU (comando único)

# Desarrollo con router personalizado
env NODE_HOST=192.168.1.1 npm run dev
```

### Build Commands

```bash
npm run build                   # Build de desarrollo
npm run build:production        # Build de producción (incluye compilación i18n)
npm run serve                   # Build y servir versión de producción
```

### Testing Comprehensivo

```bash
# Testing básico
npm test                        # Ejecutar todos los tests
npm run test -- --watch         # Modo watch para desarrollo
npm run test -- --coverage      # Tests con reporte de cobertura

# Testing específico
npm run test plugins/lime-plugin-name/  # Tests de plugin específico
npm run test:authenticated      # Tests autenticados contra QEMU real
npm run test:integration        # Tests de integración completos

# Limpieza de cache
npm run clear-jest              # Limpiar cache de Jest
```

### Quality Assurance

```bash
# QA rápido (desarrollo iterativo)
npm run qa:fast                 # Lint + tests básicos

# QA completo (pre-commit)
npm run qa:full                 # Tests + lint + build + integración

# QA con IA (análisis avanzado)
npm run qa:ai                   # Review IA + security + documentación

# QA multiplataforma
npm run qa:cross-platform       # Tests en múltiples entornos

# QA para upstream
npm run qa:upstream             # Preparación para contribución upstream
```

### Linting y Code Quality

```bash
npm run lint                    # TypeScript + ESLint + Prettier
npm run lint:fix                # Auto-fix de issues de linting
```

### QEMU LibreMesh Integration (Workflow Estandarizado)

> **📖 Documentación completa**: Ver [Guía QEMU](../herramientas/GUIA_QEMU.md) para setup detallado

#### 🚀 Inicio Rápido - Deployment con Un Comando

```bash
npm run deploy:qemu             # ⭐ Build + deploy a QEMU (recomendado)
```

#### 🔧 Gestión QEMU

```bash
npm run qemu:start              # Iniciar QEMU LibreMesh limpiamente
npm run qemu:stop               # Detener procesos QEMU correctamente
npm run qemu:restart            # Reinicio limpio (stop + start)
npm run qemu:status             # Verificar estado QEMU y lime-app
```

#### 💻 Workflow de Desarrollo

```bash
npm run qemu:dev                # Servidor desarrollo con backend QEMU
npm run qemu:check              # Verificación básica de estado (legacy)
npm run qemu:deploy             # Build y deploy solo a lime-packages
```

### Translations (i18n)

```bash
npm run translations:extract    # Extraer strings traducibles
npm run translations:compile    # Compilar traducciones
```

### Storybook

```bash
npm run storybook               # Iniciar Storybook en puerto 8081
npm run storybook:build         # Build de Storybook
npm run storybook:deploy        # Deploy a GitHub Pages
```

### Plugin Development

```bash
npm run create-plugin <pluginName>  # Bootstrap estructura de plugin nuevo
```

## 🏗️ Architecture

### 🧩 Plugin System

La arquitectura modular permite extensibilidad y mantenibilidad:

```typescript
// Estructura de un plugin
interface Plugin {
    name: string;
    page: ComponentType;
    menu: ComponentType;
    additionalRoutes?: Route[];
    additionalProtectedRoutes?: Route[];
    menuGroup?: string;  // Agrupación de menús ("meshwide", "node", "admin")
}
```

### 📊 State Management

- **TanStack Query** (moderno): Primary data fetching and caching
- **Redux + RxJS** (legacy): En proceso de migración gradual
- **Shared State**: Componentes mesh-wide con sincronización via `components/shared-state/`

### 🎨 Component Architecture

- **Preact**: Framework React-compatible con bundle de 3kB
- **TypeScript**: Tipado fuerte con soporte completo
- **CSS Modules**: Styling con scope local via imports `.less`
- **Tailwind CSS**: Framework de utilidades CSS
- **Global styles**: Clases Bootstrap-inspired en `src/style/index.less`

### 🌐 Backend Communication

- **uHTTPd client**: Servicio singleton para llamadas ubus JSON-RPC
- **API endpoints**: Funciones que definen URLs de request y payloads
- **Queries**: Operaciones de lectura usando `useQuery`
- **Mutations**: Operaciones de escritura usando `useMutation`

### 🧪 Testing Strategy

1. **Component tests**: Mock API endpoints, test user interactions (`*.spec.js`)
2. **API tests**: Test endpoint calls y transformaciones de datos (`*Api.spec.js`)
3. **Integration tests**: Testing con backend QEMU real
4. **Visual tests**: Storybook stories para testing visual
5. **Test utilities**: `utils/test_utils` proporciona helpers con providers

## 🗂️ Estructura de Archivos Clave

### 🎯 Core Application

- `src/components/app.tsx`: Componente principal con routing
- `src/config.ts`: Registro de plugins
- `src/store.js`: Configuración Redux store (legacy)
- `preact.config.js`: Configuración Webpack y proxy dev server

### 🔌 Plugin Development

- `plugins/lime-plugin-*/index.ts`: Puntos de entrada de plugins
- `plugins/lime-plugin-*/src/`: Implementación del plugin
- `devTools/plugins.js`: Utilidad de creación de plugins

### 🧪 Testing

- `jest.config.js`: Configuración Jest con path mapping
- `utils/test_utils.js`: Utilidades de testing y mocks
- `src/utils/qemu-auth-helpers.js`: Helpers para testing autenticado QEMU

### 🏗️ Build Configuration

- `package.json`: Scripts y dependencias
- `tsconfig.json`: Configuración TypeScript
- `tailwind.config.js`: Setup Tailwind CSS
- `postcss.config.js`: Configuración PostCSS

### 🛠️ Development Scripts

- `scripts/qemu-manager.sh`: Script oficial de integración LibreMesh
- `scripts/qemu-persistent-setup.sh`: Automatización workflow desarrollo
- `scripts/lime-app-integration-tests.sh`: Suite completa de tests integración

## 🎯 Path Aliases

```javascript
~/ → src/
components/ → src/components/
containers/ → src/containers/
utils/ → src/utils/
plugins/ → plugins/
```

## 🌍 Translation System

- **LinguiJS**: Framework de internacionalización
- **Extract-compile workflow**: `lingui extract` → `lingui compile`
- **Locales soportadas**: 24 idiomas con español e inglés al 100%

## 🔄 Workflow de Desarrollo

### 📝 Agregar Nuevo Plugin

1. `npm run create-plugin <pluginName>` para bootstrap estructura
2. Implementar componente con tests first (enfoque TDD)
3. Crear API endpoints con tests (`*Api.js` y `*Api.spec.js`)
4. Implementar TanStack Query hooks (`*Queries.js`)
5. Agregar Storybook stories (`*.stories.js`)
6. Registrar plugin en `src/config.ts`

### 🧪 Component Development Pattern

1. Escribir tests de componente con APIs mockeadas usando `render()` de `utils/test_utils`
2. Implementar componente para pasar tests
3. Escribir tests de API endpoint con cleanup apropiado de mocks
4. Implementar API endpoints siguiendo patrón ubus JSON-RPC
5. Crear stories de Storybook para estados del componente
6. Agregar styling con CSS modules (`.less`) o clases globales

### 🌐 Backend Integration

- Router IP por defecto: `10.13.0.1` (override con `NODE_HOST` env var)
- Llamadas ubus via endpoint `/ubus` (proxied en desarrollo)
- Scripts CGI via endpoint `/cgi-bin/**`
- Gestión de sesión con autenticación username/password
- Protocolo JSON-RPC para toda comunicación API

### 🧪 Testing Best Practices

- Mock API calls usando `jest.mock('./src/<name>Api')`
- Limpiar query cache después de cada test: `act(() => queryCache.clear())`
- Usar `render()` de `utils/test_utils` para setup consistente de providers
- Test user interactions con `@testing-library/preact`
- Verificar cambios de estado UI con queries `screen.findBy*` async
- **Específico Preact**: Usar `Fragment` de `preact` en lugar de fragmentos React (`<>`)

## 🚀 Production Deployment

Los bundles construidos se sirven desde `/www/app/` en routers LibreMesh via servidor web uHTTPd en `thisnode.info` o dirección IP del router.

### 📡 Deploy to Router

```bash
npm run build:production
ssh root@10.13.0.1 "rm -rf /www/app/*" && scp -r ./build/* root@10.13.0.1:/www/app
```

## 🎛️ Development Environment Notes

### 🖥️ Integración QEMU LibreMesh (Workflow Estandarizado 2025)

**Prerequisites:**
1. Clonar repositorio `lime-packages` en directorio padre: `../lime-packages/`
2. Descargar imágenes desarrollo LibreMesh a `../lime-packages/build/`
3. Instalar paquetes `qemu-system-x86_64` y `screen`

**🚀 Comandos de Desarrollo Estandarizados:**

```bash
# ⭐ RECOMENDADO - Deployment con un comando
npm run deploy:qemu                    # Build + deploy a QEMU corriendo

# Gestión QEMU (estandarizado)
npm run qemu:start                     # Iniciar QEMU LibreMesh limpiamente
npm run qemu:stop                      # Detener procesos QEMU apropiadamente
npm run qemu:restart                   # Reinicio limpio (stop + start)
npm run qemu:status                    # Verificar estado QEMU y lime-app

# Workflow de desarrollo
npm run qemu:dev                       # Servidor desarrollo con backend QEMU
```

**Puntos de Acceso:**
- **QEMU LibreMesh**: `http://10.13.0.1` (lime-app de producción)
- **Servidor Desarrollo**: `http://localhost:8080` (live-reload con backend QEMU)

### 🎯 Frontend-Only Development

Sin backend LibreMesh, esperar estos errores de consola (comportamiento normal):
- Errores 500 del endpoint `/ubus` - no hay backend router disponible
- Fallas de conexión WebSocket - limitación hot-reload
- Errores parsing JSON de llamadas API - páginas error HTML en lugar de respuestas JSON

## 🤝 Human-AI Collaborative Development

Este proyecto soporta **desarrollo colaborativo humano-IA** across múltiples plataformas y herramientas AI.

### 🚀 Quick Start para Colaboración IA

```bash
# Verificar integración herramientas IA
npm run verify:ai

# Iniciar desarrollo con verificación de entorno
npm run dev:start

# Verificaciones de calidad asistidas por IA
npm run qa:ai

# Review de código con IA
npm run ai:review
```

### 🎯 Mejores Prácticas IA

**Para Claude Code (Terminal-based):**
- Sesiones debugging complejas y troubleshooting QEMU
- Análisis arquitectural y estrategias testing comprehensivas
- Generación documentación y organización código

**Para Cursor (IDE-integrated):**
- Completado código real-time y desarrollo componentes
- Refactoring inline y exploración código
- Prototipado rápido con `Ctrl+K` para natural language to code

**Para GitHub Copilot:**
- Implementaciones función desde comentarios
- Generación casos test y código boilerplate
- Definiciones tipo e interfaces

### 🔧 AI Quality Gates

El proyecto incluye verificaciones calidad automáticas asistidas por IA:

```bash
npm run qa:ai           # Análisis calidad IA comprehensivo
npm run ai:review       # Code review con sugerencias IA
npm run ai:security     # Escaneo vulnerabilidades seguridad IA
npm run ai:docs         # Verificación completeness documentación IA
```

### 📝 Formato Commit Message para Asistencia IA

```bash
git commit -m "feat(component): add mesh node status visualization

- Implemented TypeScript React component with real-time updates
- Added comprehensive test suite with 95% coverage
- Created Storybook stories for all component states

🤖 AI-assisted with: Cursor for component structure
🤖 AI-assisted with: Claude Code for testing strategy"
```

## 🧠 Development Wisdom & Best Practices

### 🎯 Strategic Development Insights

**Framework Desarrollo Humano-IA Colaborativo**
- Framework clase producción: Integración Claude Code + Cursor + GitHub Copilot validada
- Compatibilidad multiplataforma: Windows WSL2, Linux, macOS alcanzable con tooling verificación apropiado
- Especialización herramientas IA: Claude Code (debugging/arquitectura), Cursor (integración IDE), GitHub Copilot (completion)

**Entorno Desarrollo LibreMesh (Actualizado 2025)**
- Integración QEMU: Gold standard para entorno desarrollo LibreMesh auténtico
- Deployment estandarizado: `npm run deploy:qemu` - comando único para build + deploy
- Gestión QEMU automática: Ciclo vida proceso apropiado con `scripts/qemu-manager.sh`
- Compatibilidad imágenes: Auto-detecta imágenes LibreMesh 2020.4-ow19 o 2024.1
- Configuración red: Automatizada via QEMU manager (no setup manual requerido)

### 🎨 Context Management Best Practices

**Multiplicadores Efectividad IA**
- **Memoria proyecto**: Mantener CLAUDE.md como base conocimiento persistente IA
- **Organización clara**: Estructura archivos afecta comprensión IA dramáticamente
- **Feedback loops**: Scripts verificación proporcionan IA con validación calidad
- **Task tracking**: Listas todo esenciales para coordinación proyecto complejo

**Standards Quality Assurance**
- **Compliance scripts**: Validación shellcheck previene issues scripts shell producción
- **Inversión documentación**: Docs comprehensivos reducen carga soporte largo plazo
- **Higiene commits**: Mensajes commit profesionales facilitan mantenimiento futuro
- **Previsión plataforma**: Consideraciones multiplataforma upfront ahorran tiempo debugging significativo

---

*Esta documentación forma la base para desarrollo colaborativo humano-IA efectivo en proyectos LibreMesh y sirve como referencia para futuros equipos desarrollo.*