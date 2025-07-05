# Internal Documentation Index

Quick reference to all internal development documentation.

## 📋 Decision Records

| #   | Title                                                                         | Date       | Status   | Description                                                                     |
| --- | ----------------------------------------------------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------- |
| 001 | [Upstream Separation Strategy](decisions/001-upstream-separation-strategy.md) | 2025-07-05 | Accepted | Strategy for maintaining dev tools while preparing clean upstream contributions |
| 002 | [Technical Debt Analysis](decisions/002-technical-debt-analysis.md)           | 2024       | Accepted | Assessment of technical debt and prioritized solutions                          |
| 003 | [QEMU Testing Implementation](decisions/003-qemu-testing-implementation.md)   | 2024       | Accepted | Standardized QEMU LibreMesh development environment setup                       |

## 🔄 Workflows

| Document                                                          | Purpose                                      | Last Updated |
| ----------------------------------------------------------------- | -------------------------------------------- | ------------ |
| [Development Organization](workflows/DEVELOPMENT_ORGANIZATION.md) | Human-AI collaborative development framework | 2024         |

## 🤖 AI Development

| Document                              | Purpose                         | Usage                 |
| ------------------------------------- | ------------------------------- | --------------------- |
| [CLAUDE.md](ai-development/CLAUDE.md) | AI context for Claude assistant | Active - Keep updated |
| [.cursorrules](../../.cursorrules)    | Cursor IDE AI configuration     | Active                |

## 🏗️ Architecture

| Document                                        | Language | Purpose                                  |
| ----------------------------------------------- | -------- | ---------------------------------------- |
| [ARQUITECTURA.md](architecture/ARQUITECTURA.md) | Spanish  | Comprehensive architecture documentation |

## 🚀 Quick Links

### For New Team Members

1. Start with [Development Organization](workflows/DEVELOPMENT_ORGANIZATION.md)
2. Review [Upstream Separation Strategy](decisions/001-upstream-separation-strategy.md)
3. Check [CLAUDE.md](ai-development/CLAUDE.md) if using AI assistants

### For Contributing Upstream

1. Read [Upstream Separation Strategy](decisions/001-upstream-separation-strategy.md)
2. Use git aliases from `scripts/setup-upstream-aliases.sh`
3. Check `.upstream-exclude` for what to exclude

### For Architecture Understanding

1. [ARQUITECTURA.md](architecture/ARQUITECTURA.md) (Spanish - comprehensive)
2. Main README.md (English - overview)
3. [Technical Debt Analysis](decisions/002-technical-debt-analysis.md)

## 📝 Document Status Legend

-   **Proposed**: Under discussion
-   **Accepted**: Current practice
-   **Deprecated**: No longer valid (kept for history)
-   **Active**: Living document, frequently updated

## 🔍 Search Tips

Find documents by:

-   **Topic**: Use grep in `docs/dev-internal/`
-   **Date**: Check decision record numbers (chronological)
-   **Category**: Browse subdirectories
-   **Tags**: Look for #hashtags in documents

---

_Last updated: 2025-07-05_
