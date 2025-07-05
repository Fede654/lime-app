# 📚 Índice Maestro - Documentación de Desarrollo LiMeApp

> **Documentación integral para desarrollo colaborativo IA+Humano en español**

## 🎯 Visión General

Este índice maestro organiza toda la documentación interna de desarrollo, optimizada para equipos hispanohablantes trabajando con asistentes de IA.

### Principios Guía

-   🇪🇸 **Español primero** para desarrollo interno
-   🤖 **IA-compatible** con contexto estructurado
-   🚀 **Orientado a productividad** con herramientas modernas
-   🌐 **Upstream-ready** con separación clara

## 📂 Estructura de Documentación

### 1. 🚀 **Inicio Rápido**

| Documento                                                        | Propósito                       | Estado       |
| ---------------------------------------------------------------- | ------------------------------- | ------------ |
| [README Español](guias/README_es.md)                             | Introducción rápida al proyecto | 🔄 Por crear |
| [Configuración de Desarrollo](guias/CONFIGURACION_DESARROLLO.md) | Setup completo del entorno      | ✅ Existente |
| [Tutorial Interactivo](guias/TUTORIAL_INTERACTIVO.md)            | Aprende haciendo                | 🔄 Por crear |

### 2. 🏗️ **Arquitectura y Diseño**

| Documento                                                        | Propósito                    | Estado       |
| ---------------------------------------------------------------- | ---------------------------- | ------------ |
| [Arquitectura General](architecture/ARQUITECTURA.md)             | Diseño completo del sistema  | ✅ Existente |
| [Patrones de Diseño](arquitectura/PATRONES_DISENO.md)            | Patterns y mejores prácticas | 🔄 Por crear |
| [Flujo de Datos](arquitectura/FLUJO_DATOS.md)                    | Cómo fluye la información    | 🔄 Por crear |
| [Diagrama de Componentes](arquitectura/diagrama-componentes.svg) | Visualización del sistema    | 🔄 Por crear |

### 3. 🤝 **Colaboración IA+Humano**

| Documento                                                         | Propósito                       | Estado       |
| ----------------------------------------------------------------- | ------------------------------- | ------------ |
| [Guía de Colaboración IA](ai-development/GUIA_COLABORACION_IA.md) | Cómo trabajar con Claude/Cursor | 🔄 Por crear |
| [Contexto Claude](../../CLAUDE.md)                       | Memoria persistente para IA     | ✅ Existente |
| [Plantillas de Prompts](ai-development/PLANTILLAS_PROMPTS.md)     | Prompts efectivos probados      | 🔄 Por crear |
| [Casos de Éxito](ai-development/CASOS_EXITO.md)                   | Ejemplos reales de colaboración | 🔄 Por crear |

### 4. 🔧 **Guías de Desarrollo**

| Documento                                            | Propósito               | Estado       |
| ---------------------------------------------------- | ----------------------- | ------------ |
| [Desarrollo de Plugins](guias/DESARROLLO_PLUGINS.md) | Crear nuevos plugins    | 🔄 Por crear |
| [Testing Completo](guias/TESTING_COMPLETO.md)        | Unit, integration, e2e  | 🔄 Por crear |
| [Debugging Avanzado](guias/DEBUGGING_AVANZADO.md)    | Técnicas y herramientas | 🔄 Por crear |
| [Performance](guias/OPTIMIZACION_PERFORMANCE.md)     | Optimización y métricas | 🔄 Por crear |

### 5. 📋 **Decisiones Técnicas**

| #   | Decisión                                                                        | Fecha       | Estado       |
| --- | ------------------------------------------------------------------------------- | ----------- | ------------ |
| 001 | [Estrategia Separación Upstream](decisions/001-upstream-separation-strategy.md) | 2025-07-05  | ✅ Aceptada  |
| 002 | [Análisis Deuda Técnica](decisions/002-technical-debt-analysis.md)              | 2024        | ✅ Aceptada  |
| 003 | [Implementación Testing QEMU](decisions/003-qemu-testing-implementation.md)     | 2024        | ✅ Aceptada  |
| 004 | [Migración a React Query](decisiones/004-migracion-react-query.md)              | Por definir | 🔄 Por crear |

### 6. 🛠️ **Herramientas y Scripts**

| Herramienta          | Propósito                    | Documentación                                      | Estado       |
| -------------------- | ---------------------------- | -------------------------------------------------- | ------------ |
| QEMU Manager         | Gestión de entorno LibreMesh | [Guía QEMU](herramientas/GUIA_QEMU.md)             | ✅ Existente |
| Git Aliases Upstream | Commits limpios para PR      | [Flujo Git](herramientas/FLUJO_GIT.md)             | 🔄 Por crear |
| Scripts AI           | Review, test, security       | [Herramientas IA](herramientas/HERRAMIENTAS_IA.md) | 🔄 Por crear |

### 7. 🌐 **Glosario y Referencias**

| Recurso                                                   | Contenido             | Estado       |
| --------------------------------------------------------- | --------------------- | ------------ |
| [Glosario Técnico ES↔EN](referencias/GLOSARIO_TECNICO.md) | Términos bilingües    | 🔄 Por crear |
| [API ubus Reference](referencias/API_UBUS.md)             | Documentación de APIs | 🔄 Por crear |
| [Conceptos LibreMesh](referencias/CONCEPTOS_LIBREMESH.md) | Mesh, nodos, enlaces  | 🔄 Por crear |

### 8. 📊 **Plantillas y Checklists**

| Plantilla                                        | Uso                 | Estado       |
| ------------------------------------------------ | ------------------- | ------------ |
| [PR Checklist](plantillas/PR_CHECKLIST.md)       | Antes de crear PR   | 🔄 Por crear |
| [Plugin Template](plantillas/PLUGIN_TEMPLATE.md) | Nuevo plugin base   | 🔄 Por crear |
| [Test Template](plantillas/TEST_TEMPLATE.md)     | Estructura de tests | 🔄 Por crear |
| [Decision Record](plantillas/ADR_TEMPLATE.md)    | Nueva decisión      | 🔄 Por crear |

## 🗺️ Rutas de Aprendizaje

### 🌱 Para Nuevos Desarrolladores

1. [README Español](guias/README_es.md)
2. [Configuración de Desarrollo](guias/CONFIGURACION_DESARROLLO.md)
3. [Tutorial Interactivo](guias/TUTORIAL_INTERACTIVO.md)
4. [Arquitectura General](architecture/ARQUITECTURA.md)

### 🤖 Para Desarrollo con IA

1. [Guía de Colaboración IA](ai-development/GUIA_COLABORACION_IA.md)
2. [Contexto Claude](../../CLAUDE.md)
3. [Plantillas de Prompts](ai-development/PLANTILLAS_PROMPTS.md)
4. [Herramientas IA](herramientas/HERRAMIENTAS_IA.md)

### 🏆 Para Contribuir Upstream

1. [Estrategia Separación](decisions/001-upstream-separation-strategy.md)
2. [Flujo Git](herramientas/FLUJO_GIT.md)
3. [PR Checklist](plantillas/PR_CHECKLIST.md)
4. [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📈 Estado de Documentación

-   **Documentos planificados**: 35
-   **Completados**: 7 (20%)
-   **En desarrollo**: 0 (0%)
-   **Pendientes**: 28 (80%)

## 🔄 Prioridades de Desarrollo

1. **Guías fundamentales** - README, configuración, tutorial
2. **Documentación de IA** - Colaboración, plantillas de prompts
3. **Diagramas arquitectónicos** - Flujo de datos, componentes
4. **Terminología técnica** - Glosario bilingüe ES↔EN
5. **Plantillas operativas** - PR, plugins, testing

## 💡 Cómo Contribuir

1. Elige un documento marcado como "🔄 Por crear"
2. Crea el archivo en la ubicación indicada
3. Sigue la estructura de documentos existentes
4. Actualiza este índice maestro
5. Commit con: `docs: agregar [nombre del documento] 📚`

---

_Última actualización: 2025-07-05_
_Mantenido por: Equipo de Desarrollo LiMeApp_
