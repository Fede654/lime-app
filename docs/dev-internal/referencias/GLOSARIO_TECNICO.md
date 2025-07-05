# 📖 Glosario Técnico ES ↔ EN - LiMeApp

## 🎯 Propósito

Este glosario facilita la comunicación entre desarrolladores hispanohablantes y la documentación técnica en inglés, asegurando consistencia en terminología para el proyecto LiMeApp.

---

## 🌐 Conceptos LibreMesh / Redes Mesh

| Español                       | English           | Contexto LiMeApp                                          |
| ----------------------------- | ----------------- | --------------------------------------------------------- |
| **Red mesh**                  | Mesh network      | Red descentralizada donde cada nodo puede enrutar tráfico |
| **Nodo mesh**                 | Mesh node         | Router LibreMesh individual en la red                     |
| **Enlace**                    | Link              | Conexión entre dos nodos mesh                             |
| **Salto**                     | Hop               | Cada nodo intermedio en una ruta de red                   |
| **Puerta de enlace**          | Gateway           | Nodo que proporciona acceso a Internet                    |
| **Red comunitaria**           | Community network | Red mesh gestionada por una comunidad                     |
| **Calidad del enlace**        | Link quality      | Métrica de calidad de conexión entre nodos                |
| **Enrutamiento**              | Routing           | Proceso de determinar rutas de red                        |
| **Protocolo de enrutamiento** | Routing protocol  | BATMAN-adv, BMX7, OLSRv2                                  |
| **Topología de red**          | Network topology  | Estructura de conexiones de la red mesh                   |

## 🖥️ Conceptos Técnicos de Sistemas

| Español                       | English               | Contexto LiMeApp                                |
| ----------------------------- | --------------------- | ----------------------------------------------- |
| **Firmware**                  | Firmware              | Software base del router (OpenWrt + LibreMesh)  |
| **Actualización de firmware** | Firmware upgrade      | Proceso de actualizar el software del router    |
| **Configuración**             | Configuration         | Settings del router y aplicación                |
| **Configuración por defecto** | Default configuration | Config inicial de LibreMesh                     |
| **Configuración de red**      | Network configuration | Settings específicos de la red mesh             |
| **Punto de acceso**           | Access Point (AP)     | Modo WiFi para que clientes se conecten         |
| **Modo cliente**              | Client mode           | Router conectándose a otra red como cliente     |
| **Modo ad-hoc**               | Ad-hoc mode           | Modo WiFi para comunicación directa entre nodos |
| **Interfaz de red**           | Network interface     | eth0, wlan0, etc.                               |
| **Dirección IP**              | IP address            | Identificador único en la red                   |

## 📡 Comunicación y APIs

| Español               | English        | Contexto LiMeApp                         |
| --------------------- | -------------- | ---------------------------------------- |
| **Llamada a la API**  | API call       | Request a endpoints de ubus              |
| **Punto de conexión** | Endpoint       | URL/service específico de ubus           |
| **Servicio**          | Service        | Servicio ubus (lime-utils, system, etc.) |
| **Método**            | Method         | Función específica dentro de un servicio |
| **Parámetros**        | Parameters     | Datos enviados en la llamada             |
| **Respuesta**         | Response       | Datos devueltos por la API               |
| **Tiempo de espera**  | Timeout        | Tiempo límite para respuesta             |
| **Error de red**      | Network error  | Fallo en comunicación con el router      |
| **Autenticación**     | Authentication | Login con usuario/password               |
| **Sesión**            | Session        | Período autenticado con session_id       |

## 💻 Desarrollo Frontend

| Español            | English      | Contexto LiMeApp                             |
| ------------------ | ------------ | -------------------------------------------- |
| **Componente**     | Component    | Elemento reutilizable de React/Preact        |
| **Propiedades**    | Props        | Parámetros pasados a un componente           |
| **Estado**         | State        | Datos que pueden cambiar en el componente    |
| **Renderizado**    | Rendering    | Proceso de mostrar componentes en pantalla   |
| **Re-renderizado** | Re-rendering | Actualización visual cuando cambia el estado |
| **Ciclo de vida**  | Lifecycle    | Fases de existencia de un componente         |
| **Gancho**         | Hook         | Hook de React (useState, useEffect, etc.)    |
| **Contexto**       | Context      | Mecanismo para compartir datos globalmente   |
| **Enrutado**       | Routing      | Navegación entre páginas de la app           |
| **Paquete**        | Bundle       | Código JavaScript compilado para producción  |

## 🔌 Arquitectura de Plugins

| Español                     | English              | Contexto LiMeApp                             |
| --------------------------- | -------------------- | -------------------------------------------- |
| **Plugin**                  | Plugin               | Módulo extensible de funcionalidad           |
| **Registro de plugin**      | Plugin registration  | Proceso de añadir plugin al sistema          |
| **Cargador de plugins**     | Plugin loader        | Sistema que gestiona plugins                 |
| **Configuración de plugin** | Plugin configuration | Settings específicos del plugin              |
| **Punto de montaje**        | Mount point          | Donde se integra el plugin en la app         |
| **Dependencia**             | Dependency           | Plugin o librería requerida                  |
| **Modular**                 | Modular              | Diseño basado en módulos independientes      |
| **Extensible**              | Extensible           | Capacidad de agregar funcionalidad           |
| **Reutilizable**            | Reusable             | Código que puede usarse en múltiples lugares |

## 🧪 Testing y Calidad

| Español                      | English               | Contexto LiMeApp                           |
| ---------------------------- | --------------------- | ------------------------------------------ |
| **Prueba unitaria**          | Unit test             | Test de función/componente individual      |
| **Prueba de integración**    | Integration test      | Test de múltiples componentes juntos       |
| **Prueba extremo a extremo** | End-to-end (E2E) test | Test de flujo completo de usuario          |
| **Simulacro**                | Mock                  | Reemplazo de dependencia real para testing |
| **Cobertura de pruebas**     | Test coverage         | Porcentaje de código cubierto por tests    |
| **Caso de prueba**           | Test case             | Escenario específico a probar              |
| **Aserción**                 | Assertion             | Verificación de resultado esperado         |
| **Regresión**                | Regression            | Bug reintroducido por cambios              |
| **Depuración**               | Debugging             | Proceso de encontrar y arreglar bugs       |
| **Lint**                     | Linting               | Análisis estático de código para errores   |

## 🛠️ Herramientas de Desarrollo

| Español                    | English                 | Contexto LiMeApp                            |
| -------------------------- | ----------------------- | ------------------------------------------- |
| **Entorno de desarrollo**  | Development environment | Setup local para desarrollar                |
| **Servidor de desarrollo** | Development server      | Servidor local con hot-reload               |
| **Construcción**           | Build                   | Proceso de compilar código para producción  |
| **Compilación**            | Compilation             | Traducir código fuente a ejecutable         |
| **Transpilación**          | Transpilation           | Convertir TypeScript a JavaScript           |
| **Empaquetado**            | Bundling                | Combinar múltiples archivos en uno          |
| **Minificación**           | Minification            | Reducir tamaño de archivos                  |
| **Mapa de código fuente**  | Source map              | Mapeo entre código compilado y original     |
| **Recarga en caliente**    | Hot reload              | Actualización automática durante desarrollo |
| **Observador**             | Watcher                 | Sistema que detecta cambios en archivos     |

## 🤖 Desarrollo con IA

| Español                  | English         | Contexto LiMeApp                               |
| ------------------------ | --------------- | ---------------------------------------------- |
| **Asistente de IA**      | AI assistant    | Claude, Cursor, GitHub Copilot                 |
| **Prompt**               | Prompt          | Instrucción dada a la IA                       |
| **Contexto**             | Context         | Información proporcionada a la IA              |
| **Completado de código** | Code completion | IA sugiriendo código automáticamente           |
| **Generación de código** | Code generation | IA creando código desde descripción            |
| **Revisión de código**   | Code review     | IA analizando código para mejoras              |
| **Refactorización**      | Refactoring     | Reestructurar código manteniendo funcionalidad |
| **Plantilla**            | Template        | Estructura predefinida para reutilizar         |
| **Patrón**               | Pattern         | Solución reutilizable a problema común         |

## 🌍 Internacionalización

| Español                     | English                     | Contexto LiMeApp                         |
| --------------------------- | --------------------------- | ---------------------------------------- |
| **Internacionalización**    | Internationalization (i18n) | Preparar app para múltiples idiomas      |
| **Localización**            | Localization (l10n)         | Adaptar app a idioma/región específica   |
| **Cadena de texto**         | String                      | Texto mostrado al usuario                |
| **Cadena traducible**       | Translatable string         | Texto marcado para traducción            |
| **Clave de traducción**     | Translation key             | Identificador único para cada string     |
| **Archivo de traducciones** | Translation file            | Archivo .po con traducciones             |
| **Extracción**              | Extraction                  | Proceso de encontrar strings traducibles |
| **Compilación**             | Compilation                 | Generar archivos .js desde .po           |
| **Interpolación**           | Interpolation               | Insertar variables en strings            |
| **Pluralización**           | Pluralization               | Diferentes formas según cantidad         |

## 🚀 DevOps y Deployment

| Español                     | English                     | Contexto LiMeApp                         |
| --------------------------- | --------------------------- | ---------------------------------------- |
| **Despliegue**              | Deployment                  | Proceso de subir código a producción     |
| **Integración continua**    | Continuous Integration (CI) | Tests automáticos en cada commit         |
| **Entorno de producción**   | Production environment      | Router real con usuarios                 |
| **Entorno de staging**      | Staging environment         | Entorno de pruebas pre-producción        |
| **Control de versiones**    | Version control             | Git para rastrear cambios                |
| **Rama**                    | Branch                      | Línea de desarrollo independiente        |
| **Fusión**                  | Merge                       | Combinar cambios de diferentes ramas     |
| **Solicitud de extracción** | Pull request                | Proceso de revisar código antes de merge |
| **Etiqueta**                | Tag                         | Marcador de versión específica           |
| **Lanzamiento**             | Release                     | Versión oficial publicada                |

---

## 🎯 Guía de Uso

### Para Desarrolladores

1. **Consulta antes de escribir** - Usa términos consistentes
2. **Contribuye nuevos términos** - Actualiza el glosario
3. **Prioriza claridad** - Explica contexto cuando sea necesario

### Para Documentación

-   **Código y comentarios técnicos**: Inglés (upstream compatibility)
-   **Documentación de proceso**: Español (team efficiency)
-   **Interface de usuario**: Ambos idiomas (i18n)

### Para Comunicación

-   **Issues y PRs públicos**: Inglés (comunidad internacional)
-   **Discusiones internas**: Español (eficiencia del equipo)
-   **Commits**: Inglés (convención estándar)

---

## 🔄 Convenciones de Nomenclatura

### Archivos y Directorios

```bash
# ✅ Correcto (inglés, estándar)
src/components/MetricsPage.tsx
src/hooks/useNetworkStatus.js
docs/api/network-configuration.md

# ❌ Evitar (español en código)
src/componentes/PaginaMetricas.tsx
src/ganchos/useEstadoRed.js
```

### Variables y Funciones

```typescript
// ✅ Correcto (inglés para compatibilidad)
const networkNodes = getNetworkNodes();
const isLoading = useQuery("nodes", fetchNodes);

// ❌ Evitar (español en código)
const nodosRed = obtenerNodosRed();
const estaCargando = useQuery("nodos", buscarNodos);
```

### Comentarios

```typescript
// ✅ Comentarios técnicos en inglés
// Fetch node metrics from ubus lime-metrics service
const getNodeMetrics = async () => {
    // TODO: Add retry logic for failed requests
    return await ubusCall("lime-metrics", "get");
};

// ✅ Comentarios de proceso en español (cuando necesario)
// NOTA: Este endpoint puede tardar 30+ segundos en redes grandes
// Ver documentación interna sobre optimización de timeouts
```

---

_Este glosario se actualiza continuamente. Agregar nuevos términos conforme evoluciona el proyecto._
