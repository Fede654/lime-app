# Internal Development Documentation

This directory contains development-specific documentation that is **not intended for upstream contribution**. It includes our team's decisions, workflows, and development practices.

## Directory Structure

```
docs/dev-internal/
├── decisions/           # Architectural Decision Records (ADRs)
├── workflows/          # Development workflows and processes
├── ai-development/     # AI-assisted development documentation
└── architecture/       # Internal architecture documentation
```

## Documentation Categories

### 📋 Decisions (`decisions/`)

Numbered decision records documenting important choices:

-   `001-upstream-separation-strategy.md` - How we separate dev tools from upstream
-   `002-technical-debt-analysis.md` - Technical debt assessment and solutions
-   `003-qemu-testing-implementation.md` - QEMU development environment setup

**Naming Convention**: `NNN-decision-title.md` (three-digit prefix for sorting)

### 🔄 Workflows (`workflows/`)

Development processes and team practices:

-   `DEVELOPMENT_ORGANIZATION.md` - Human-AI collaborative development framework
-   Future: PR workflows, release processes, testing strategies

### 🤖 AI Development (`ai-development/`)

AI-assisted development documentation:

-   `CLAUDE.md` - Context for Claude AI assistant
-   Future: Cursor setup, GitHub Copilot patterns, AI prompt templates

### 🏗️ Architecture (`architecture/`)

Internal architecture documentation and diagrams:

-   `ARQUITECTURA.md` - Spanish architecture documentation
-   Future: Component diagrams, data flow, decision trees

## Documentation Standards

### For Decision Records

Use this template for new decisions:

```markdown
# NNN: Decision Title

**Date**: YYYY-MM-DD
**Status**: Proposed | Accepted | Deprecated
**Tags**: #category #topic

## Context

What is the issue that we're seeing that is motivating this decision?

## Decision

What is the change that we're proposing/doing?

## Consequences

What becomes easier or more difficult as a result?

## Alternatives Considered

What other options were evaluated?
```

### For Workflow Documentation

1. Use clear headings and step-by-step instructions
2. Include practical examples
3. Link to related decisions
4. Keep updated as workflows evolve

### For AI Development

1. Document prompts that work well
2. Track AI tool configurations
3. Share patterns for effective AI collaboration
4. Note limitations and workarounds

## Upstream vs Internal Docs

| Type           | Location              | Purpose                | Upstream? |
| -------------- | --------------------- | ---------------------- | --------- |
| User guides    | `/docs/`              | Help users use the app | ✅ Yes    |
| API docs       | `/docs/`              | Technical reference    | ✅ Yes    |
| Tutorials      | `/docs/`              | Getting started guides | ✅ Yes    |
| Dev decisions  | `/docs/dev-internal/` | Team choices           | ❌ No     |
| AI workflows   | `/docs/dev-internal/` | Productivity tools     | ❌ No     |
| Personal prefs | `/docs/dev-internal/` | Team practices         | ❌ No     |

## Adding New Documentation

1. Choose the appropriate category
2. Use consistent naming (decisions get numbers)
3. Update this README if adding new categories
4. Consider if it could ever be upstream-ready
5. Link related documents together

## Future Organization

As documentation grows, consider:

-   Sub-categories within each folder
-   Cross-referencing index
-   Search functionality
-   Auto-generated documentation site (for internal use)

---

_Remember: This documentation helps our team work efficiently. Keep it organized, current, and focused on our actual practices._
