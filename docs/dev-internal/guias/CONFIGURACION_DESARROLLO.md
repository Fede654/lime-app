# 🛠️ Configuración Completa de Desarrollo LiMeApp

> **Guía comprehensiva para setup avanzado con integración QEMU + IA + Debugging**

## 🎯 Propósito

Esta guía describe la configuración completa del entorno de desarrollo del equipo, incluyendo:
- Integración QEMU LibreMesh para testing real
- Herramientas de IA (Claude Code, Cursor)
- Configuración IDE avanzada
- Scripts de verificación automática

## 📋 Prerequisitos del Sistema

### Herramientas Base
```bash
# Ubuntu/Debian
sudo apt install nodejs npm git qemu-system-x86 screen build-essential

# Fedora/RHEL  
sudo dnf install nodejs npm git qemu-system-x86 screen gcc-c++

# macOS
brew install node git qemu screen
```

### Verificación del Entorno
```bash
# Usar nuestro script de verificación
npm run verify:setup

# Verificación específica de herramientas IA
npm run verify:ai

# Verificación multiplataforma
npm run verify:cross-platform
```

## 🚀 Setup Completo del Workspace

### 1. Estructura de Directorios
```bash
# Crear workspace de desarrollo
mkdir libremesh-dev && cd libremesh-dev

# Clonar repositorios
git clone https://github.com/libremesh/lime-app.git
git clone https://github.com/libremesh/lime-packages.git

# Estructura final:
libremesh-dev/
├── lime-app/          # Proyecto principal
└── lime-packages/     # Entorno QEMU LibreMesh
```

### 2. Configuración lime-app
```bash
cd lime-app

# Instalar dependencias
npm install

# Configurar herramientas de desarrollo
npm run setup:dev-tools

# Verificar configuración
npm run verify:setup
```

### 3. Configuración QEMU LibreMesh

> **📖 Ver documentación completa**: [Guía QEMU](../herramientas/GUIA_QEMU.md)

```bash
# Descargar imágenes LibreMesh recomendadas
mkdir -p ../lime-packages/build
cd ../lime-packages/build

# LibreMesh 2020.4 (recomendado para desarrollo)
wget -O libremesh-2020.4-ow19-x86-64-rootfs.tar.gz \
  "https://downloads.libremesh.org/releases/2020.4-ow19/targets/x86/64/libremesh-2020.4-ow19-default-x86-64-generic-rootfs.tar.gz"

wget -O libremesh-2020.4-ow19-x86-64-ramfs.bzImage \
  "https://downloads.libremesh.org/releases/2020.4-ow19/targets/x86/64/libremesh-2020.4-ow19-default-x86-64-ramfs.bzImage"

cd ../../lime-app
```

## 🔄 Flujos de Trabajo Integrados

### Desarrollo Frontend con Backend Real

```bash
# 1. Iniciar entorno QEMU completo
npm run qemu:start

# 2. Desarrollo con backend real
npm run qemu:dev

# Acceso:
# - Servidor desarrollo: http://localhost:8080
# - QEMU LibreMesh: http://10.13.0.1
# - lime-app en QEMU: http://10.13.0.1/app
```

### Workflow de Testing Completo

```bash
# Testing rápido (unit + mocks)
npm run qa:fast

# Testing completo (incluye QEMU)
npm run qa:full

# Testing con asistencia IA
npm run qa:ai

# Testing multiplataforma
npm run qa:cross-platform
```

### Desarrollo con IA Integrada

```bash
# Verificar herramientas IA
npm run verify:ai

# Review de código con IA
npm run ai:review

# Análisis de seguridad con IA
npm run ai:security

# Documentación automática
npm run ai:docs
```

## 🧪 Estrategia de Testing Avanzada

### Testing con QEMU Auténtico

```bash
# Setup persistente QEMU (una vez)
./scripts/qemu-persistent-setup.sh setup

# Testing autenticado contra LibreMesh real
npm run test:authenticated

# Testing de integración completo
npm run test:integration
```

### Testing de Componentes

```bash
# Desarrollo TDD con watch mode
npm run test -- --watch plugins/lime-plugin-myfeature/

# Testing visual con Storybook
npm run storybook

# Testing de coverage completo
npm run test:coverage
```

## 🎨 Configuración IDE Avanzada

### VS Code Setup

**Extensiones recomendadas:**
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint", 
    "ms-vscode.vscode-jest",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

**Configuración workspace (`.vscode/settings.json`):**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "jest.jestCommandLine": "npm test",
  "jest.autoRun": "watch",
  "typescript.preferences.imports.includePackageJsonAutoImports": "auto",
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "HTML"
  }
}
```

**Configuración debugging (`.vscode/launch.json`):**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "🚀 Desarrollo con QEMU",
      "type": "node",
      "request": "launch", 
      "program": "${workspaceFolder}/node_modules/.bin/preact",
      "args": ["build", "--no-prerender"],
      "env": {
        "NODE_HOST": "10.13.0.1"
      }
    },
    {
      "name": "🧪 Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal"
    },
    {
      "name": "🤖 Testing con IA",
      "type": "node", 
      "request": "launch",
      "program": "${workspaceFolder}/scripts/ai-test-runner.sh",
      "console": "integratedTerminal"
    }
  ]
}
```

### Cursor IDE Integration

```bash
# Configurar Cursor para desarrollo LiMeApp
cp docs/dev-internal/plantillas/.cursorrules .cursorrules

# El archivo incluye:
# - Contexto del proyecto LiMeApp
# - Patrones de código preferidos  
# - Guías de testing
# - Integración con nuestro stack
```

## 🔧 Scripts de Desarrollo Avanzados

### Verificación Automática del Entorno

```bash
# Verificación completa (todas las herramientas)
npm run verify:setup

# Verificaciones específicas
npm run verify:qemu          # QEMU LibreMesh
npm run verify:ai            # Herramientas IA  
npm run verify:cross-platform # Compatibilidad multiplataforma
npm run verify:upstream      # Preparación para upstream
```

### Gestión QEMU Avanzada

```bash
# Gestión del ciclo de vida QEMU
npm run qemu:start           # Iniciar QEMU LibreMesh
npm run qemu:stop            # Detener QEMU limpiamente
npm run qemu:restart         # Reiniciar (stop + start)
npm run qemu:status          # Estado de QEMU y lime-app

# Desarrollo y deployment
npm run deploy:qemu          # Build + deploy to QEMU en un comando
npm run qemu:dev             # Servidor desarrollo con QEMU backend
```

### Quality Assurance Integral

```bash
# QA rápido (para desarrollo iterativo)
npm run qa:fast              # Lint + tests básicos

# QA completo (para PRs)
npm run qa:full              # Tests + lint + build + integración

# QA con IA (análisis avanzado)
npm run qa:ai                # Review IA + security + docs

# QA multiplataforma
npm run qa:cross-platform    # Tests en múltiples entornos

# QA para upstream
npm run qa:upstream          # Preparación para contribución upstream
```

## 🚀 Desarrollo de Plugins Avanzado

### Creación de Plugin con Scaffold Completo

```bash
# Generar estructura completa
npm run create-plugin MyAdvancedFeature

# Estructura generada:
plugins/lime-plugin-myadvancedfeature/
├── index.ts                    # Registro del plugin
├── myadvancedfeature.spec.js   # Tests unitarios
├── myadvancedfeature.stories.js # Stories de Storybook
├── myadvancedfeature.integration.spec.js # Tests integración
└── src/
    ├── MyAdvancedFeaturePage.tsx    # Componente principal
    ├── MyAdvancedFeatureMenu.tsx    # Componente de menú
    ├── myAdvancedFeatureApi.js      # Endpoints API
    ├── myAdvancedFeatureApi.spec.js # Tests de API
    ├── myAdvancedFeatureQueries.js  # React Query hooks
    └── style.less                   # Estilos del componente
```

### Workflow de Desarrollo TDD

```bash
# 1. Desarrollar tests primero
npm run test plugins/lime-plugin-myfeature/ -- --watch

# 2. Desarrollo visual con Storybook
npm run storybook

# 3. Testing con backend real
npm run qemu:dev

# 4. Testing de integración
npm run test:integration plugins/lime-plugin-myfeature/

# 5. QA completo antes de commit
npm run qa:ai
```

## 🌍 Configuración Multiplataforma

### Windows (WSL2)

```bash
# Configuración específica WSL2
npm run setup:wsl2

# Verificación de funcionalidades
npm run verify:cross-platform
```

### macOS

```bash
# Configuración específica macOS
npm run setup:macos

# Instalación herramientas adicionales
brew install --cask docker
```

### Linux

```bash
# Configuración optimizada Linux
npm run setup:linux

# Permisos para QEMU
sudo usermod -a -G kvm $USER
```

## 🐛 Debugging Avanzado

### Debug con QEMU Real

```bash
# Acceder a consola QEMU
screen -r libremesh

# Debug desde el router
ubus list                    # Ver servicios disponibles
ubus call system board      # Test de conectividad
logread                     # Ver logs del sistema
```

### Debug de APIs

```javascript
// Debugging de llamadas ubus
import QemuAuth from 'utils/qemu-auth-helpers';

// Debug habilitado
QemuAuth.QEMU_CONFIG.debug = true;

// Test manual de servicios
const result = await QemuAuth.ubusCall('system', 'board');
console.log('System info:', result);
```

### Análisis de Performance

```bash
# Análisis de bundle
npm run analyze

# Profiling de componentes
npm run profile

# Métricas de performance con IA
npm run ai:performance
```

## 🔄 Integración Upstream

### Preparación para Contribución

```bash
# Verificar compatibilidad upstream
npm run qa:upstream

# Limpiar cambios internos
npm run clean:upstream

# Generar PR description
npm run generate:pr-description
```

### Git Workflow Avanzado

```bash
# Aliases útiles para desarrollo
git config --global alias.sync '!git checkout main && git pull && git checkout - && git rebase main'
git config --global alias.cleanup '!git branch --merged | grep -v "\\*\\|main\\|develop" | xargs -n 1 git branch -d'

# Commits con formato estándar
npm run commit              # Interactive commit con conventional format
```

## 📊 Monitoreo y Métricas

### Métricas de Desarrollo

```bash
# Métricas de código
npm run metrics:code

# Métricas de tests
npm run metrics:coverage

# Métricas de performance
npm run metrics:performance
```

### Dashboard de Estado

```bash
# Estado general del proyecto
npm run status

# Genera reporte comprensivo:
# - Coverage de tests
# - Estado de QA
# - Compatibilidad upstream  
# - Performance metrics
```

## 🆘 Troubleshooting Común

### Problemas de QEMU

```bash
# QEMU no accesible
./scripts/qemu-persistent-setup.sh test
npm run qemu:restart

# Problemas de red
ping 10.13.0.1
screen -r libremesh  # Verificar configuración
```

### Problemas de Build

```bash
# Limpiar estado corrupto
npm run clean:all
rm -rf node_modules package-lock.json
npm install

# Verificar configuración
npm run verify:setup
```

### Problemas de Testing

```bash
# Reset de cache de Jest
npm run clear-jest

# Tests timeouts con QEMU
QEMU_TEST=false npm test  # Fallback a mocks
```

## 📚 Recursos del Equipo

### Documentación Interna

- [Guía de Colaboración IA](../ai-development/GUIA_COLABORACION_IA.md)
- [Plantillas de Prompts](../plantillas/PLANTILLAS_PROMPTS.md)
- [Checklist de PR](../plantillas/PR_CHECKLIST.md)
- [Glosario Técnico](../referencias/GLOSARIO_TECNICO.md)

### Scripts y Herramientas

- **Verificación**: `scripts/verify-*.sh`
- **QEMU Management**: `scripts/qemu-*.sh`
- **IA Tools**: `scripts/ai-*.sh`
- **Setup Automation**: `scripts/setup-*.sh`

---

*Esta configuración proporciona un entorno de desarrollo clase mundial optimizado para equipos hispanohablantes con herramientas de IA.*