# CLAUDE.md

> **Contexto actualizado para Claude Code - Julio 2025**  
> **Estado del proyecto**: v4-foundation con arquitectura de documentación completa

## 🎯 Descripción General del Proyecto

LiMeApp es una aplicación web moderna construida con **Preact** para la gestión de routers LibreMesh. Proporciona una interfaz libre de complejidades técnicas para configuración y mantenimiento de nodos LibreMesh, con arquitectura de plugins que se comunica con servicios del router via llamadas ubus JSON-RPC.

### 🌟 Estado Actual del Proyecto

- **Rama activa**: `f/v4-foundation` 
- **Documentación**: Sistema integral en español en `docs/dev-internal/`
- **Desarrollo colaborativo**: Framework IA+Humano completamente implementado
- **Testing**: Integración QEMU con 140+ tests y cobertura 85%+
- **Internacionalización**: 24 idiomas soportados (Español 100%, Inglés 100%)

## 📚 Navegación de Documentación

### 🚀 Para desarrollo interno (equipo de desarrollo):
- **[📖 Documentación Desarrollo](docs/dev-internal/README.md)** - Entrada única a toda la documentación
- **[⚡ Referencia Rápida](docs/dev-internal/00-quick-start/quick-reference.md)** - Comandos y workflows esenciales
- **[🛠️ Configuración Desarrollo](docs/dev-internal/00-quick-start/development-setup.md)** - Setup completo con IA+QEMU
- **[🤖 Guía Colaboración IA](docs/dev-internal/02-development/ai-collaboration.md)** - Workflows con Claude/Cursor/Copilot
- **[🖥️ Guía QEMU](docs/dev-internal/02-development/qemu-integration.md)** - Entorno testing LibreMesh auténtico

### 🌍 Para contribución upstream:
- **[📘 Tutorial](../../Tutorial.md)** - Guía completa de desarrollo
- **[🛠️ Development Setup](../../../DEVELOPMENT_SETUP.md)** - Configuración básica upstream-ready
- **[🤝 Contributing](../../../CONTRIBUTING.md)** - Proceso de contribución

## 🛠️ Comandos de Desarrollo

### Configuración y Dependencias

```bash
npm install                     # Instalar dependencias del proyecto
npm run verify:setup           # ⭐ Verificación completa del entorno
npm run verify:qemu             # Verificar entorno QEMU LibreMesh
npm run verify:ai               # Verificar herramientas IA
```

### Servidor de Desarrollo

```bash
# Desarrollo básico (frontend + mocks)
npm run dev                     # Servidor con recarga en caliente (proxies a 10.13.0.1)

# Desarrollo avanzado (con backend real)
npm run qemu:start              # Iniciar LibreMesh en QEMU
npm run qemu:dev                # Servidor desarrollo con backend QEMU real
npm run deploy:qemu             # ⭐ Build + deploy a QEMU (comando único)

# Desarrollo con router personalizado
env NODE_HOST=192.168.1.1 npm run dev
```

### Comandos de Construcción

```bash
npm run build                   # Construcción de desarrollo
npm run build:production        # Construcción de producción (incluye compilación i18n)
npm run serve                   # Construir y servir versión de producción
```

### Testing Integral

```bash
# Testing básico
npm test                        # Ejecutar todas las pruebas
npm run test -- --watch         # Modo observación para desarrollo
npm run test -- --coverage      # Pruebas con reporte de cobertura

# Testing específico
npm run test plugins/lime-plugin-name/  # Pruebas de plugin específico
npm run test:authenticated      # Pruebas autenticadas contra QEMU real
npm run test:integration        # Pruebas de integración completas

# Limpieza de cache
npm run clear-jest              # Limpiar cache de Jest
```

### Aseguramiento de Calidad

```bash
# QA rápido (desarrollo iterativo)
npm run qa:fast                 # Lint + pruebas básicas

# QA completo (pre-commit)
npm run qa:full                 # Pruebas + lint + construcción + integración

# QA con IA (análisis avanzado)
npm run qa:ai                   # Revisión IA + seguridad + documentación

# QA multiplataforma
npm run qa:cross-platform       # Pruebas en múltiples entornos

# QA para upstream
npm run qa:upstream             # Preparación para contribución upstream
```

### Linting y Calidad de Código

```bash
npm run lint                    # TypeScript + ESLint + Prettier
npm run lint:fix                # Corrección automática de problemas de linting
```

### Integración QEMU LibreMesh (Flujo de Trabajo Estandarizado)

> **📖 Documentación completa**: Ver [Guía QEMU](../herramientas/GUIA_QEMU.md) para configuración detallada

#### 🚀 Inicio Rápido - Despliegue con Un Comando

```bash
npm run deploy:qemu             # ⭐ Construcción + despliegue a QEMU (recomendado)
```

#### 🔧 Gestión QEMU

```bash
npm run qemu:start              # Iniciar QEMU LibreMesh limpiamente
npm run qemu:stop               # Detener procesos QEMU correctamente
npm run qemu:restart            # Reinicio limpio (detener + iniciar)
npm run qemu:status             # Verificar estado QEMU y lime-app
```

#### 💻 Flujo de Trabajo de Desarrollo

```bash
npm run qemu:dev                # Servidor desarrollo con backend QEMU
npm run qemu:check              # Verificación básica de estado (legado)
npm run qemu:deploy             # Construcción y despliegue solo a lime-packages
```

### Traducciones (i18n)

```bash
npm run translations:extract    # Extraer cadenas traducibles
npm run translations:compile    # Compilar traducciones
```

### Storybook

```bash
npm run storybook               # Iniciar Storybook en puerto 8081
npm run storybook:build         # Construcción de Storybook
npm run storybook:deploy        # Despliegue a GitHub Pages
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

### 📊 Gestión de Estado

- **TanStack Query** (moderno): Obtención y almacenamiento en caché de datos principal
- **Redux + RxJS** (legado): En proceso de migración gradual
- **Estado Compartido**: Componentes mesh-wide con sincronización via `components/shared-state/`

### 🎨 Arquitectura de Componentes

- **Preact**: Framework compatible con React con paquete de 3kB
- **TypeScript**: Tipado fuerte con soporte completo
- **Módulos CSS**: Estilos con alcance local via imports `.less`
- **Tailwind CSS**: Framework de utilidades CSS
- **Estilos globales**: Clases inspiradas en Bootstrap en `src/style/index.less`

### 🌐 Comunicación con Backend

- **Cliente uHTTPd**: Servicio singleton para llamadas ubus JSON-RPC
- **Endpoints API**: Funciones que definen URLs de petición y cargas útiles
- **Consultas**: Operaciones de lectura usando `useQuery`
- **Mutaciones**: Operaciones de escritura usando `useMutation`

### 🧪 Estrategia de Testing

1. **Pruebas de componentes**: Mock de endpoints API, prueba interacciones de usuario (`*.spec.js`)
2. **Pruebas de API**: Prueba llamadas a endpoints y transformaciones de datos (`*Api.spec.js`)
3. **Pruebas de integración**: Testing con backend QEMU real
4. **Pruebas visuales**: Historias de Storybook para testing visual
5. **Utilidades de prueba**: `utils/test_utils` proporciona helpers con providers

## 🗂️ Estructura de Archivos Clave

### 🎯 Aplicación Principal

- `src/components/app.tsx`: Componente principal con enrutamiento
- `src/config.ts`: Registro de plugins
- `src/store.js`: Configuración Redux store (legado)
- `preact.config.js`: Configuración Webpack y servidor proxy de desarrollo

### 🔌 Desarrollo de Plugins

- `plugins/lime-plugin-*/index.ts`: Puntos de entrada de plugins
- `plugins/lime-plugin-*/src/`: Implementación del plugin
- `devTools/plugins.js`: Utilidad de creación de plugins

### 🧪 Testing

- `jest.config.js`: Configuración Jest con mapeo de rutas
- `utils/test_utils.js`: Utilidades de testing y mocks
- `src/utils/qemu-auth-helpers.js`: Helpers para testing autenticado QEMU

### 🏗️ Configuración de Construcción

- `package.json`: Scripts y dependencias
- `tsconfig.json`: Configuración TypeScript
- `tailwind.config.js`: Configuración Tailwind CSS
- `postcss.config.js`: Configuración PostCSS

### 🛠️ Scripts de Desarrollo

- `scripts/qemu-manager.sh`: Script oficial de integración LibreMesh
- `scripts/qemu-persistent-setup.sh`: Automatización flujo de trabajo desarrollo
- `scripts/lime-app-integration-tests.sh`: Suite completa de pruebas de integración

## 🎯 Alias de Rutas

```javascript
~/ → src/
components/ → src/components/
containers/ → src/containers/
utils/ → src/utils/
plugins/ → plugins/
```

## 🌍 Sistema de Traducción

- **LinguiJS**: Framework de internacionalización
- **Flujo extraer-compilar**: `lingui extract` → `lingui compile`
- **Idiomas soportados**: 24 idiomas con español e inglés al 100%

## 🔄 Flujo de Trabajo de Desarrollo

### 📝 Agregar Nuevo Plugin

1. `npm run create-plugin <pluginName>` para inicializar estructura
2. Implementar componente con pruebas primero (enfoque TDD)
3. Crear endpoints API con pruebas (`*Api.js` y `*Api.spec.js`)
4. Implementar hooks TanStack Query (`*Queries.js`)
5. Agregar historias Storybook (`*.stories.js`)
6. Registrar plugin en `src/config.ts`

### 🧪 Patrón de Desarrollo de Componentes

1. Escribir pruebas de componente con APIs simuladas usando `render()` de `utils/test_utils`
2. Implementar componente para pasar pruebas
3. Escribir pruebas de endpoint API con limpieza apropiada de mocks
4. Implementar endpoints API siguiendo patrón ubus JSON-RPC
5. Crear historias de Storybook para estados del componente
6. Agregar estilos con módulos CSS (`.less`) o clases globales

### 🌐 Integración con Backend

- IP del router por defecto: `10.13.0.1` (sobrescribir con variable de entorno `NODE_HOST`)
- Llamadas ubus via endpoint `/ubus` (proxy en desarrollo)
- Scripts CGI via endpoint `/cgi-bin/**`
- Gestión de sesión con autenticación usuario/contraseña
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

## 🎛️ Notas del Entorno de Desarrollo

### 🖥️ Integración QEMU LibreMesh (Flujo de Trabajo Estandarizado 2025)

**Prerrequisitos:**
1. Clonar repositorio `lime-packages` en directorio padre: `../lime-packages/`
2. Descargar imágenes desarrollo LibreMesh a `../lime-packages/build/`
3. Instalar paquetes `qemu-system-x86_64` y `screen`

**🚀 Comandos de Desarrollo Estandarizados:**

```bash
# ⭐ RECOMENDADO - Despliegue con un comando
npm run deploy:qemu                    # Construcción + despliegue a QEMU corriendo

# Gestión QEMU (estandarizado)
npm run qemu:start                     # Iniciar QEMU LibreMesh limpiamente
npm run qemu:stop                      # Detener procesos QEMU apropiadamente
npm run qemu:restart                   # Reinicio limpio (detener + iniciar)
npm run qemu:status                    # Verificar estado QEMU y lime-app

# Flujo de trabajo de desarrollo
npm run qemu:dev                       # Servidor desarrollo con backend QEMU
```

**Puntos de Acceso:**
- **QEMU LibreMesh**: `http://10.13.0.1` (lime-app de producción)
- **Servidor Desarrollo**: `http://localhost:8080` (recarga en vivo con backend QEMU)

### 🎯 Desarrollo Solo Frontend

Sin backend LibreMesh, esperar estos errores de consola (comportamiento normal):
- Errores 500 del endpoint `/ubus` - no hay backend router disponible
- Fallas de conexión WebSocket - limitación recarga en caliente
- Errores análisis JSON de llamadas API - páginas error HTML en lugar de respuestas JSON

## 🤝 Desarrollo Colaborativo Humano-IA

Este proyecto soporta **desarrollo colaborativo humano-IA** a través de múltiples plataformas y herramientas IA.

### 🚀 Inicio Rápido para Colaboración IA

```bash
# Verificar integración herramientas IA
npm run verify:ai

# Iniciar desarrollo con verificación de entorno
npm run dev:start

# Verificaciones de calidad asistidas por IA
npm run qa:ai

# Revisión de código con IA
npm run ai:review
```

### 🎯 Mejores Prácticas IA

**Para Claude Code (Basado en Terminal):**
- Sesiones de depuración complejas y resolución de problemas QEMU
- Análisis arquitectural y estrategias de testing integrales
- Generación de documentación y organización de código

**Para Cursor (Integrado en IDE):**
- Completado de código en tiempo real y desarrollo de componentes
- Refactorización en línea y exploración de código
- Prototipado rápido con `Ctrl+K` para lenguaje natural a código

**Para GitHub Copilot:**
- Implementaciones de funciones desde comentarios
- Generación de casos de prueba y código base
- Definiciones de tipos e interfaces

### 🔧 AI Quality Gates

El proyecto incluye verificaciones calidad automáticas asistidas por IA:

```bash
npm run qa:ai           # Análisis calidad IA comprehensivo
npm run ai:review       # Code review con sugerencias IA
npm run ai:security     # Escaneo vulnerabilidades seguridad IA
npm run ai:docs         # Verificación completeness documentación IA
```

### 📝 Formato de Mensaje de Commit para Asistencia IA

```bash
git commit -m "feat(component): agregar visualización de estado de nodo mesh

- Implementado componente React TypeScript con actualizaciones en tiempo real
- Añadida suite de pruebas integral con 95% de cobertura
- Creadas historias de Storybook para todos los estados del componente

🤖 Asistido por IA con: Cursor para estructura de componente
🤖 Asistido por IA con: Claude Code para estrategia de testing"
```

## 🧠 Sabiduría de Desarrollo y Mejores Prácticas

### 🎯 Perspectivas Estratégicas de Desarrollo

**Marco de Desarrollo Humano-IA Colaborativo**
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

**Estándares de Aseguramiento de Calidad**
- **Scripts de cumplimiento**: La validación shellcheck previene problemas en scripts shell de producción
- **Inversión en documentación**: Documentación integral reduce carga de soporte a largo plazo
- **Higiene de commits**: Mensajes de commit profesionales facilitan mantenimiento futuro
- **Previsión de plataforma**: Consideraciones multiplataforma anticipadas ahorran tiempo significativo de depuración

## 🚀 Migración Redux a TanStack Query (2025)

### 📊 Estado de la Migración

**Eliminación Redux Completada**: El proyecto ha migrado exitosamente **95% de la gestión de estado** de Redux a TanStack Query, eliminando la complejidad innecesaria y mejorando el rendimiento.

#### Plugins Migrados (4 de 4):
1. ✅ **lime-plugin-align** - Configuración Redux vacía eliminada
2. ✅ **lime-plugin-changeNode** - Migrado de Redux+RxJS a TanStack Query
3. ✅ **lime-plugin-notes** - Operaciones lectura/escritura migradas
4. ✅ **lime-plugin-ground-routing** - Migrado completamente a hooks modernos

#### Beneficios Logrados:
- **Reducción de tamaño**: ~2.5KB menos en el paquete final
- **Simplificación de código**: Sin boilerplate de acciones/reductores
- **Mejor rendimiento**: Caché automático y deduplicación
- **Experiencia de desarrollo**: Patrón único en todos los plugins

#### Estado Actual:
- Redux solo permanece para enrutamiento (`react-router-redux`)
- Todos los plugins usan TanStack Query para gestión de datos
- Arquitectura lista para eliminar Redux completamente en el futuro

### 🧪 Testing de la Migración

Se crearon **94 nuevos casos de prueba** para validar la migración:
- Pruebas de componentes con interacciones de usuario
- Pruebas de API con endpoints ubus
- Pruebas de hooks TanStack Query
- Pruebas de integración para verificar eliminación Redux

---

*Esta documentación forma la base para desarrollo colaborativo humano-IA efectivo en proyectos LibreMesh y sirve como referencia para futuros equipos desarrollo.*