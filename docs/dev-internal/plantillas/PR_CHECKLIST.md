# ✅ Checklist para Pull Requests - LiMeApp

## 📋 Pre-Submit Checklist

### 🔍 Revisión de Código

-   [ ] **Código revisado** - He leído todo mi código línea por línea
-   [ ] **Sin console.logs** - Removidos logs de debugging
-   [ ] **Imports limpios** - Sin imports no utilizados
-   [ ] **TypeScript** - Sin errores de tipos (run `npm run lint`)
-   [ ] **Estilo consistente** - Código formateado con Prettier

### 🧪 Testing

-   [ ] **Tests pasan** - `npm test` ejecuta sin errores
-   [ ] **Nuevos tests** - Agregados para nueva funcionalidad
-   [ ] **Cobertura** - Mantiene o mejora cobertura de tests
-   [ ] **Testing manual** - Probado en navegador/QEMU
-   [ ] **Casos edge** - Considerados escenarios límite

### 📚 Documentación

-   [ ] **README actualizado** - Si cambios requieren nueva setup
-   [ ] **JSDoc comments** - Funciones complejas documentadas
-   [ ] **Stories** - Storybook stories para nuevos componentes
-   [ ] **i18n** - Strings traducibles marcados correctamente

### 🎯 Funcionalidad

-   [ ] **Requirement completo** - Issue/feature totalmente implementado
-   [ ] **No breaking changes** - O claramente documentados
-   [ ] **Performance** - No degradación notable de velocidad
-   [ ] **Accesibilidad** - Componentes accesibles (a11y)

### 🔧 Upstream Compatibility

-   [ ] **Archivo .upstream-exclude** - Revisado que cambios son upstream-safe
-   [ ] **Commits limpios** - Mensajes descriptivos siguiendo conventional commits
-   [ ] **Sin files personales** - No incluye configuraciones específicas del dev
-   [ ] **Inglés técnico** - Código y comentarios en inglés para upstream

### 🤖 AI-Assisted Development

-   [ ] **IA documentada** - Si usé IA, está marcado en commit/PR
-   [ ] **Código entendido** - Entiendo 100% del código generado por IA
-   [ ] **Validación manual** - Código de IA revisado y validado
-   [ ] **Patrones seguidos** - IA siguió patrones existentes del proyecto

---

## 📝 Template de PR Description

```markdown
## 🎯 Descripción

[Qué hace este PR - en una oración]

## 🔗 Issue Relacionado

Closes #[número]

## 🤖 AI-Assistance (si aplica)

-   🤖 Claude Code: [descripción del trabajo]
-   🤖 Cursor: [descripción del trabajo]
-   🤖 GitHub Copilot: [descripción del trabajo]

## 🧪 Tipo de Cambio

-   [ ] 🐛 Bug fix (cambio que arregla un issue)
-   [ ] ✨ Nueva feature (cambio que agrega funcionalidad)
-   [ ] ♻️ Refactor (cambio que no agrega funcionalidad ni arregla bugs)
-   [ ] 📚 Documentación (solo cambios de documentación)
-   [ ] 🎨 Estilo (formato, espacios en blanco, etc)
-   [ ] ⚡ Performance (mejora de performance)
-   [ ] 🧪 Test (agregar tests faltantes o corregir existentes)

## 🧪 Cómo se probó

-   [ ] Tests unitarios
-   [ ] Tests de integración
-   [ ] Testing manual en desarrollo
-   [ ] Testing en QEMU LibreMesh
-   [ ] Testing cross-browser
-   [ ] Testing mobile

## 📋 Cambios incluidos

-   [x] Feature/fix implementado
-   [x] Tests agregados/actualizados
-   [x] Documentación actualizada
-   [x] i18n strings agregadas
-   [x] Storybook stories agregadas

## 📸 Screenshots (si aplica)

[Agregar screenshots de UI changes]

## 🚀 Deployment Notes

[Cualquier consideración especial para deployment]

## ✅ Checklist Final

-   [ ] ✅ PR Checklist completado
-   [ ] 🧪 Todos los tests pasan
-   [ ] 📚 Documentación actualizada
-   [ ] 🎯 Feature funciona como se esperaba
-   [ ] 🤖 Código de IA validado (si aplica)
```

---

## 🚨 Red Flags - Revisar Antes de Submit

### 🔴 Nunca Commitear

-   Credenciales, tokens, passwords
-   Archivos de configuración local (.env.local, etc)
-   node_modules/ o build artifacts
-   console.log para debugging
-   Código comentado "por si acaso"

### 🟡 Revisar Extra

-   Cambios grandes sin tests
-   Nuevas dependencias sin justificación
-   Cambios de performance sin medición
-   Breaking changes sin documentar
-   Código generado por IA sin entender

### 🟢 Buenas Señales

-   Commits atómicos y bien descritos
-   Tests que cubren casos edge
-   Documentación actualizada
-   Performance mejorada o mantenida
-   Feedback de code review aplicado

---

## 🏆 Tips para PRs Exitosos

### 📏 Tamaño del PR

-   **Ideal**: 100-300 líneas cambiadas
-   **Máximo**: 500 líneas (más es difícil de revisar)
-   **Si es más grande**: Dividir en múltiples PRs

### 💬 Comunicación

-   Título claro y descriptivo
-   Descripción explica el "por qué", no solo el "qué"
-   Screenshots/GIFs para cambios de UI
-   Link a issue/discussion relacionado

### 🔄 Durante Review

-   Responder feedback constructivamente
-   Hacer commits adicionales en lugar de rebase durante review
-   Resolver comments cuando sean addressed
-   Agradecer feedback recibido

---

_Este checklist reduce el tiempo de revisión y mejora la calidad del código._
