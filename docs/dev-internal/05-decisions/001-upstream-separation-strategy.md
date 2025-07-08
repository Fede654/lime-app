# Upstream Separation Strategy

## Overview

This document outlines the strategy for maintaining development productivity tools while preparing clean contributions for the upstream LibreMesh project.

## Key Principles

1. **Maintain Development Velocity**: Keep all tools that enhance productivity
2. **Clean Upstream Path**: Clear separation between development and upstream-ready code
3. **Progressive Refinement**: Development tools can evolve into upstream contributions

## Implementation

### 1. File Exclusion System

The `.upstream-exclude` file tracks components that should not be included in upstream PRs:

```bash
# Core exclusions
/scripts/ai-*.sh              # AI development tools
/DEVELOPMENT_ORGANIZATION.md  # Personal workflow documentation
/.cursorrules                 # IDE-specific configuration
/CLAUDE.md                    # AI assistant context

# Temporary exclusions (may become upstream-ready)
#/scripts/qemu-*.sh           # QEMU development tools
#/scripts/dev-with-qemu.sh    # Currently useful, could be made optional
```

### 2. Git Workflow Aliases

Run `./scripts/setup-upstream-aliases.sh` to configure git aliases:

-   `git upstream-status` - Show only upstream-safe changes
-   `git upstream-add` - Stage only upstream-safe files
-   `git upstream-commit` - Create marked upstream-ready commits
-   `git upstream-diff` - Show diff excluding development files
-   `git upstream-patch` - Generate clean patch files
-   `git upstream-check` - Verify commit upstream compatibility

### 3. Branch Strategy

```
tech-debt/*    → Bug fixes (upstream-ready)
feature/*      → New features (case-by-case evaluation)
dev-infra/*    → Development tools (not for upstream)
upstream/*     → Clean branches for PRs
```

### 4. Commit Markers

Use clear markers in commit messages:

```bash
# Upstream-ready commits
git commit -m "fix: resolve TypeScript errors 🎯 Upstream-ready"

# Development infrastructure
git commit -m "feat: add AI code review script 🔧 Dev-infra"

# Mixed commits (to be split later)
git commit -m "feat: improve tests and add AI validation 🤖 AI-assisted"
```

## Practical Workflow

### Daily Development

1. Work freely with all development tools
2. Commit normally, using appropriate markers
3. Use `git upstream-check` periodically to track upstream-ready changes

### Preparing Upstream PR

```bash
# 1. Check what's upstream-ready
git upstream-status
git log --oneline | grep "🎯"

# 2. Create clean branch
git checkout -b upstream/fix-typescript-errors

# 3. Cherry-pick only upstream commits
git cherry-pick abc123 def456  # upstream-ready commits

# 4. Verify and push
git upstream-check HEAD
git push origin upstream/fix-typescript-errors
```

### Making Dev Tools Upstream-Compatible

Transform development tools into optional upstream contributions:

1. **Modularize**: Move to `contrib/` or `dev-tools/` directory
2. **Document**: Add "Optional Development Tools" section to README
3. **Make Optional**: Ensure core functionality works without them
4. **Remove Personal Preferences**: Keep tools generic and configurable

Example transformation:

```
scripts/qemu-manager.sh → contrib/qemu-dev/qemu-manager.sh
scripts/ai-*.sh         → (probably never upstream)
CLAUDE.md              → contrib/dev-tools/ai-context-example.md
```

## Benefits

1. **No Productivity Loss**: Keep using tools that help you code effectively
2. **Clean History**: Upstream sees only relevant, high-quality contributions
3. **Future Flexibility**: Development tools can mature into upstream contributions
4. **Clear Intent**: Commit markers make review and cherry-picking easy

## Next Steps

1. Continue development with full tool suite
2. Mark commits appropriately from now on
3. When ready, use upstream workflow to create clean PRs
4. Consider which dev tools could benefit upstream community

---

_This strategy ensures we can work efficiently while respecting upstream project standards._
