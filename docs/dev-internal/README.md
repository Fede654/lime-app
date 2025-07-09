# LiMeApp Developer Documentation

> **Language**: 🇬🇧 English (primary) | 🇪🇸 Spanish (summaries)  
> **Updated**: 2025-07-08  
> **Status**: ✅ Current

Welcome to the LiMeApp internal development documentation. This is your single entry point for all developer resources.

## 🚀 Quick Start

New to the project? Start here:

1. **[Development Setup](00-quick-start/development-setup.md)** - Get your environment ready
2. **[Quick Reference](00-quick-start/quick-reference.md)** - Essential commands and workflows
3. **[Troubleshooting](00-quick-start/troubleshooting.md)** - Common issues and solutions

## 📚 Documentation Structure

### [00 - Quick Start](00-quick-start/)
Essential documentation to get developers productive quickly.
- Development environment setup
- Command quick reference  
- Troubleshooting guide

### [Workflows](workflows/)
Complete development workflows and team processes.
- **[Development Workflow](workflows/DEVELOPMENT_WORKFLOW.md)** - Comprehensive daily workflow
- **[Quick Reference](workflows/WORKFLOW_QUICK_REFERENCE.md)** - Essential commands
- **[Development Organization](workflows/DEVELOPMENT_ORGANIZATION.md)** - Team structure and processes

### [01 - Architecture](01-architecture/)
System design and architectural decisions.
- System overview
- Data flow diagrams
- Plugin architecture
- State management (TanStack Query)

### [02 - Development](02-development/)
Day-to-day development workflows and practices.
- Development workflow
- Testing strategy
- QEMU integration for testing
- AI-assisted development

### [03 - Guides](03-guides/)
Step-by-step guides for specific tasks.
- Creating plugins
- Adding translations
- Debugging techniques
- Performance optimization

### [03 - API](03-api/)
API reference and integration patterns.
- **[ubus API Reference](03-api/ubus-api-reference.md)** - Complete endpoint documentation
- **[API Patterns & Best Practices](03-api/api-patterns-best-practices.md)** - Development patterns and conventions

### [04 - Reference](04-reference/)
Technical reference materials.
- API endpoints (ubus)
- Component library
- Technical glossary (ES↔EN)
- Command reference

### [05 - Decisions](05-decisions/)
Architecture Decision Records (ADRs) documenting key technical decisions.
- [ADR Template](05-decisions/template.md)
- [001 - Upstream Separation](05-decisions/001-upstream-separation.md)
- [002 - Technical Debt Analysis](05-decisions/002-technical-debt.md)
- [003 - QEMU Testing](05-decisions/003-qemu-testing.md)
- [004 - Documentation Refactor](05-decisions/004-documentation-refactor.md)

### [06 - Tools](06-tools/)
Developer tools, templates, and utilities.
- Document templates
- Useful scripts
- PR and release checklists

## 🎯 Common Tasks

### I want to...

- **Start developing** → [Development Setup](00-quick-start/development-setup.md)
- **Run the app** → [Quick Reference](00-quick-start/quick-reference.md#development-server-options)
- **Test with real LibreMesh** → [QEMU Integration](02-development/qemu-integration.md)
- **Create a new plugin** → [Creating Plugins](03-guides/creating-plugins.md)
- **Fix a bug** → [Debugging Tips](03-guides/debugging-tips.md)
- **Add translations** → [Adding Translations](03-guides/adding-translations.md)
- **Understand the architecture** → [Architecture Overview](01-architecture/overview.md)
- **Find API endpoints** → [ubus API Reference](03-api/ubus-api-reference.md)
- **Learn API patterns** → [API Patterns & Best Practices](03-api/api-patterns-best-practices.md)
- **Check fork vs upstream status** → [Upstream Advancement Tracking](06-fork-management/upstream-advancement-tracking.md)

## 🔧 Development Commands

```bash
# Quick start
npm install                 # Install dependencies
npm run verify:setup       # Verify environment
npm run dev               # Start development server

# QEMU testing
npm run qemu:start        # Start QEMU LibreMesh
npm run qemu:dev         # Dev server with QEMU backend
npm run deploy:qemu      # Deploy to QEMU

# Quality checks
npm test                 # Run tests
npm run lint            # Check code quality
npm run qa:full         # Complete QA suite
```

## 📖 Key Concepts

- **LibreMesh**: Community mesh networking firmware
- **QEMU**: Virtual environment for testing with real LibreMesh
- **ubus**: OpenWrt system bus for API communication
- **Preact**: Lightweight React alternative (3KB)
- **TanStack Query**: Modern data fetching and caching

## 🤝 Contributing

1. Read our [Development Workflow](02-development/workflow.md)
2. Check the [PR Checklist](06-tools/checklists/pr-checklist.md)
3. Follow the [Testing Strategy](02-development/testing-strategy.md)
4. Use [AI Collaboration](02-development/ai-collaboration.md) tools effectively

## 🔍 Finding Information

- **Search**: Use your IDE's search across `/docs/dev-internal/`
- **Navigation**: Follow the numbered folder structure
- **Cross-references**: Look for "See also" sections
- **Glossary**: Check [Technical Glossary](04-reference/glossary.md) for terms

## 📊 Documentation Status

| Section | Files | Status | Completeness |
|---------|-------|--------|--------------|
| Quick Start | 3 | ✅ Current | 100% |
| Architecture | 2 | ✅ Current | 100% |
| Development | 3 | ✅ Current | 100% |
| API | 2 | ✅ Current | 100% |
| Guides | 1 | ✅ Current | 100% |
| Reference | 2 | ✅ Current | 100% |
| Decisions | 5 | ✅ Current | 100% |
| Tools | 1 | ✅ Current | 100% |

**Total**: 21 documentation files organized in 8 logical sections

## 🌐 Resumen en Español

Esta documentación está organizada para desarrolladores de LiMeApp:

- **00 - Inicio Rápido**: Configuración y referencia esencial
- **01 - Arquitectura**: Diseño del sistema y decisiones
- **02 - Desarrollo**: Flujos de trabajo diarios
- **03 - API**: Referencias API y patrones de integración
- **04 - Guías**: Tutoriales paso a paso
- **05 - Referencia**: Documentación técnica
- **06 - Fork Management**: Tracking de avances respecto upstream
- **07 - Decisiones**: Registros de decisiones arquitectónicas
- **08 - Herramientas**: Utilidades para desarrolladores

Comienza con [Configuración de Desarrollo](00-quick-start/development-setup.md) y [Referencia Rápida](00-quick-start/quick-reference.md).

---

**Questions?** Check [Troubleshooting](00-quick-start/troubleshooting.md) or ask in the development chat.