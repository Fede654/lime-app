# 🎯 Plantillas de Prompts Efectivos para LiMeApp

## 🏗️ Categoría: Arquitectura y Diseño

### 📐 Diseño de Sistema

```
Diseña un sistema [NOMBRE] para LiMeApp que:

**Requisitos funcionales:**
- [Requisito 1]
- [Requisito 2]
- [Requisito 3]

**Restricciones técnicas:**
- Debe usar React Query para data fetching
- Compatible con arquitectura de plugins existente
- Debe funcionar offline con queue/retry logic
- Seguir patrones de plugins existentes

**Contexto del proyecto:**
- LiMeApp es interface web para routers LibreMesh
- Usa Preact + React Query + TypeScript
- Comunicación vía ubus JSON-RPC
- Ver plugins/lime-plugin-[similar] como referencia

**Entregables esperados:**
1. Diagrama de arquitectura
2. Interfaces TypeScript
3. Plan de implementación por fases
4. Estrategia de testing
```

### 🧩 Refactoring de Componentes

```
Refactoriza el componente [NOMBRE] ubicado en [PATH] para:

**Objetivos:**
- [Objetivo principal]
- Mejorar [aspecto específico]
- Mantener [funcionalidad crítica]

**Restricciones:**
- NO cambiar API pública del componente
- Mantener compatibilidad con tests existentes
- Usar TypeScript strict mode
- Seguir patterns de otros componentes migrados

**Contexto actual:**
[Pegar código actual o descripción del estado]

**Referencias:**
- Ver [componente similar ya refactorizado]
- Seguir patterns en utils/hooks/

**Entregables:**
1. Código refactorizado
2. Tests actualizados
3. Documentación de cambios
```

## 🐛 Categoría: Debugging y Fixes

### 🔍 Análisis de Bug

````
**PROBLEMA:**
Error: [mensaje de error exacto]

**CONTEXTO:**
- Ocurre cuando: [pasos exactos para reproducir]
- Navegador: [Chrome/Firefox/Safari + versión]
- Entorno: [desarrollo/producción/QEMU]
- Frecuencia: [siempre/a veces/específicas condiciones]

**COMPORTAMIENTO ESPERADO:**
[Qué debería pasar en lugar del error]

**YA INTENTÉ:**
- [Solución 1 que no funcionó]
- [Solución 2 que no funcionó]

**CÓDIGO RELEVANTE:**
```[lenguaje]
[Pegar código donde ocurre el error]
````

**LOGS/STACK TRACE:**

```
[Pegar error completo]
```

**ANÁLISIS SOLICITADO:**

1. Causa raíz probable del error
2. Plan de debugging paso a paso
3. Posibles soluciones ordenadas por probabilidad
4. Tests para prevenir regresión

```

### 🩹 Fix Sistemático
```

Necesito arreglar [PROBLEMA] en LiMeApp.

**Contexto del problema:**

-   Componente afectado: [nombre]
-   Síntoma observable: [qué ve el usuario]
-   Condiciones de falla: [cuándo falla]

**Investigación realizada:**

-   [Qué ya revisé]
-   [Hipótesis descartadas]

**Restricciones para la solución:**

-   No debe romper [funcionalidad X]
-   Debe mantener performance
-   Compatible con todos los navegadores soportados

**Entregables necesarios:**

1. Fix implementado
2. Test que reproduzca el bug
3. Test que valide el fix
4. Documentación del issue y solución

```

## 🧪 Categoría: Testing

### 🔬 Estrategia de Testing
```

Diseña una estrategia de testing completa para [COMPONENTE/FEATURE].

**Componente a testear:**
[Descripción del componente y su funcionalidad]

**Casos de uso principales:**

1. [Caso de uso 1]
2. [Caso de uso 2]
3. [Caso de uso 3]

**Dependencias externas:**

-   APIs de ubus: [lista de endpoints]
-   Estado global: [qué usa de React Query]
-   Props: [props que recibe]

**Tipos de test necesarios:**

-   [ ] Unit tests (lógica pura)
-   [ ] Integration tests (con mocks)
-   [ ] E2E tests (con QEMU)
-   [ ] Visual regression tests (Storybook)

**Casos edge a considerar:**

-   Router offline/no responde
-   Datos null/undefined de API
-   Errores de red
-   Estados de loading/error

**Entregables:**

1. Test plan detallado
2. Tests implementados
3. Mocks necesarios
4. Stories de Storybook

```

### 🎭 Implementación de Tests
```

Implementa tests para [COMPONENTE] siguiendo estos casos:

**Estructura del componente:**

```[typescript]
[Pegar definición del componente]
```

**Casos de test requeridos:**

1. **Rendering básico**

    - Renderiza sin errores
    - Muestra elementos esperados

2. **Interacciones de usuario**

    - [Interacción 1 + resultado esperado]
    - [Interacción 2 + resultado esperado]

3. **Estados de datos**

    - Loading state
    - Success state con datos
    - Error state
    - Empty state

4. **Casos edge**
    - [Caso edge específico 1]
    - [Caso edge específico 2]

**Utilidades disponibles:**

-   usar render() de utils/test_utils.js
-   Mock APIs con jest.mock()
-   Utilities de @testing-library/preact

**Patrón a seguir:**
Ver tests de lime-plugin-[similar] como referencia

```

## 🚀 Categoría: Features y Desarrollo

### ✨ Nueva Feature
```

Implementa la feature [NOMBRE] para LiMeApp.

**Descripción de la feature:**
[Qué hace la feature desde perspectiva del usuario]

**Criterios de aceptación:**

-   [ ] [Criterio 1]
-   [ ] [Criterio 2]
-   [ ] [Criterio 3]

**Especificaciones técnicas:**

-   Ubicación: [dónde va en la app]
-   APIs necesarias: [endpoints de ubus]
-   Estados a manejar: [loading, success, error, etc]
-   Integración: [con qué otros componentes interactúa]

**Restricciones:**

-   Debe funcionar offline
-   Responsive design (mobile-first)
-   Accesible (a11y)
-   i18n ready (strings traducibles)

**Referencias:**

-   Design: [link a mockup/wireframe si existe]
-   Similar feature: [componente similar para referencia]
-   API docs: [documentación de ubus endpoint]

**Entregables:**

1. Componente funcional
2. Tests comprehensive
3. Storybook stories
4. Strings i18n
5. Documentación de uso

```

### 🔌 Nuevo Plugin
```

Crea un nuevo plugin lime-plugin-[NOMBRE] para LiMeApp.

**Funcionalidad del plugin:**
[Descripción clara de qué hace]

**Especificaciones:**

-   Menu item: [texto y ubicación en menu]
-   Route: [/[nombre] pattern]
-   Permissions: [si requiere autenticación]
-   API calls: [qué servicios ubus usa]

**Estructura requerida:**
Seguir estructura estándar de plugins:

```
plugins/lime-plugin-[nombre]/
├── index.ts                    # Plugin registration
├── [nombre].spec.js           # Tests
├── [nombre].stories.js        # Storybook
└── src/
    ├── [Nombre]Page.tsx       # Main component
    ├── [Nombre]Menu.tsx       # Menu item
    ├── [nombre]Api.js         # API functions
    ├── [nombre]Queries.js     # React Query hooks
    └── style.less             # Styles
```

**Referencias para copiar estructura:**

-   lime-plugin-metrics (para datos simples)
-   lime-plugin-align (para datos real-time)
-   lime-plugin-firmware (para operaciones complejas)

**Entregables:**

1. Plugin completo y funcional
2. Registro en src/config.ts
3. Tests con 80%+ coverage
4. Stories para todos los estados
5. Documentación del plugin

```

## 📚 Categoría: Documentación

### 📝 Documentación de API
```

Documenta la API [NOMBRE] para LiMeApp.

**Endpoint a documentar:**

-   Service: [nombre del servicio ubus]
-   Method: [método específico]
-   Authentication: [required/optional]

**Información a incluir:**

1. **Propósito:** Qué hace esta API
2. **Parámetros:** Todos los parámetros con tipos y validaciones
3. **Respuesta:** Estructura de datos esperada
4. **Errores:** Códigos de error posibles y significado
5. **Ejemplos:** Request/response reales
6. **Usage:** Cómo usar desde componentes

**Formato de salida:**

-   JSDoc comments en el código
-   Documentación markdown para referencia
-   TypeScript interfaces para types

**Contexto del proyecto:**
LiMeApp usa ubus JSON-RPC para comunicarse con LibreMesh router.
Ver src/utils/uhttpd.service.js para patterns de llamadas.

```

### 📖 Guía de Usuario
```

Crea una guía de usuario para [FEATURE/COMPONENTE].

**Audiencia objetivo:**
[Desarrolladores/usuarios finales/administradores]

**Scope de la guía:**

-   Qué cubre: [alcance específico]
-   Qué NO cubre: [fuera de scope]

**Estructura requerida:**

1. **Introducción:** Qué es y para qué sirve
2. **Setup:** Cómo configurar/habilitar
3. **Uso básico:** Tareas más comunes
4. **Uso avanzado:** Features avanzadas
5. **Troubleshooting:** Problemas comunes
6. **Reference:** Links y documentación relacionada

**Formato:**

-   Markdown con screenshots
-   Pasos numerados para procedimientos
-   Código de ejemplo cuando aplique
-   Tips y warnings destacados

**Consideraciones:**

-   Escribir para nivel [principiante/intermedio/avanzado]
-   Incluir ejemplos reales
-   Anticipar preguntas frecuentes

```

## 🎨 Categoría: UI/UX

### 🖼️ Componente de UI
```

Crea un componente [NOMBRE] para LiMeApp.

**Especificaciones de diseño:**

-   Tipo: [button/modal/form/card/etc]
-   Props esperadas: [lista de props con tipos]
-   Estados visuales: [default, hover, active, disabled, etc]
-   Responsive: [comportamiento en mobile/desktop]

**Requisitos técnicos:**

-   Framework: Preact con TypeScript
-   Styling: CSS modules (.less files)
-   Accesibilidad: ARIA labels apropiados
-   Theming: Compatible con tema existente

**Behaviors:**

-   [Interacción 1 y resultado]
-   [Interacción 2 y resultado]
-   [Estados de loading/error si aplica]

**Referencias:**

-   Design system: [si existe]
-   Componente similar: [para consistency]
-   Library: [si usar alguna lib externa]

**Entregables:**

1. Componente implementado
2. TypeScript interfaces
3. Stories de Storybook para todos los estados
4. Tests de interacción
5. CSS responsive

```

## 🛠️ Prompts de Herramientas Específicas

### Claude Code (Terminal)
```

Análisis arquitectural completo para [PROBLEMA/FEATURE].

Contexto del proyecto LiMeApp:

-   Preact + React Query + TypeScript
-   Arquitectura de plugins
-   Comunicación con routers LibreMesh vía ubus
-   Deployed en routers OpenWrt

[DESCRIPCIÓN DETALLADA DEL PROBLEMA/FEATURE]

Necesito:

1. Análisis completo del problema
2. Diseño de solución con trade-offs
3. Plan de implementación por fases
4. Estrategia de testing comprensiva
5. Consideraciones de performance y seguridad

Por favor proporciona un análisis sistemático y detallado.

```

### Cursor IDE (Ctrl+K)
```

implementa [FUNCIÓN/COMPONENTE] que [DESCRIPCIÓN BREVE]

siguiendo el pattern de [COMPONENTE_SIMILAR]
usando React Query para data fetching
con TypeScript strict types

````

### GitHub Copilot (Comments)
```typescript
// Implementa función que valida configuración de red mesh
// Parámetros: config object con ssid, encryption, channel
// Retorna: array de errores de validación o array vacío
// Validaciones: ssid no vacío, encryption WPA2/WPA3, channel 1-11
````

---

## 🏆 Tips para Prompts Efectivos

### ✅ Hacer

-   **Contexto específico:** Mencionar LiMeApp, LibreMesh, Preact
-   **Ejemplos concretos:** Referenciar componentes existentes
-   **Restricciones claras:** TypeScript, React Query, patterns
-   **Entregables específicos:** Qué exactamente necesitas

### ❌ Evitar

-   Prompts muy genéricos sin contexto
-   Asumir que la IA conoce el proyecto
-   Pedir "todo" sin especificar prioridades
-   Olvidar mencionar restricciones técnicas

### 🎯 Formato CARE

-   **C**ontexto: Situación actual y proyecto
-   **A**cción: Qué necesitas que haga
-   **R**esultado: Qué esperas obtener
-   **E**jemplos: Referencias concretas

---

_Estas plantillas proporcionan estructura base. Adaptar según contexto específico del proyecto._
