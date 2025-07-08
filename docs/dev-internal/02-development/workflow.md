# Development Workflow

> **Purpose**: Daily development processes and team collaboration  
> **Audience**: All developers  
> **Updated**: 2025-07-08

## 🌅 Daily Development Workflow

### Morning Routine (5 minutes)

```bash
# 1. Update local repository
git checkout main
git pull origin main

# 2. Check environment health
npm run verify:setup

# 3. Start development services
npm run qemu:start          # If using QEMU
npm run dev                 # Or npm run qemu:dev

# 4. Check pending work
git branch --list           # Review local branches
npm run qa:fast            # Quick health check
```

### Feature Development Cycle

```bash
# 1. Create feature branch
git checkout -b feature/new-functionality

# 2. Develop with TDD approach
npm run test -- --watch    # Keep tests running
# Write failing test → Implement → Make test pass → Refactor

# 3. Regular commits
git add .
git commit -m "feat: implement user authentication

- Add login form component with validation
- Implement session management
- Add authentication tests

🤖 Assisted by Claude Code for architecture design
🤖 Assisted by Cursor for component implementation"

# 4. Integration testing
npm run qemu:dev           # Test with real LibreMesh
npm run test:integration   # Full integration suite

# 5. Quality checks
npm run qa:full            # Complete QA suite
npm run qa:ai              # AI-assisted review
```

### End of Day Workflow

```bash
# 1. Save work
git add .
git commit -m "wip: save current progress"

# 2. Clean up environment
npm run qemu:stop          # Stop QEMU cleanly
npm run clear-jest         # Clear test cache

# 3. Push work (if ready)
git push origin feature/branch-name

# 4. Update documentation
# Update CLAUDE.md if needed
# Update relevant documentation
```

## 🌿 Git Branching Strategy

### Branch Types

```bash
# Feature branches
feature/user-authentication
feature/mesh-visualization
feature/plugin-management

# Bug fixes
fix/login-validation-error
fix/qemu-network-timeout
fix/translation-missing-keys

# Technical debt
tech-debt/redux-to-tanstack-migration
tech-debt/component-refactoring
tech-debt/test-coverage-improvement

# Documentation
docs/api-reference-update
docs/development-workflow
docs/architecture-diagrams
```

### Branch Workflow

```bash
# 1. Start new work
git checkout main
git pull origin main
git checkout -b feature/descriptive-name

# 2. Work on feature
# Make commits regularly
# Keep branch updated with main

# 3. Before creating PR
git checkout main
git pull origin main
git checkout feature/descriptive-name
git rebase main              # Rebase instead of merge

# 4. Final checks
npm run qa:full
npm run test:integration

# 5. Create PR
git push origin feature/descriptive-name
gh pr create --title "feat: descriptive title" --body "$(cat <<'EOF'
## Summary
- Brief description of changes
- Key features implemented
- Issues resolved

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [x] QEMU integration verified
- [x] Manual testing completed

## AI Collaboration
- Claude Code: Architecture design and debugging
- Cursor: Component implementation and refactoring
- GitHub Copilot: Code completion and test generation

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
```

### Commit Message Standards

```bash
# Format: type(scope): description
# 
# Body (optional)
# 
# 🤖 AI assistance attribution

# Examples:
git commit -m "feat(auth): implement user session management

- Add session storage utilities
- Implement login/logout flow
- Add session timeout handling

🤖 Assisted by Claude Code for architecture design"

git commit -m "fix(qemu): resolve network connectivity timeout

- Increase connection timeout to 30s
- Add retry logic for network calls
- Improve error handling

🤖 Assisted by Cursor for debugging"

git commit -m "docs: update development workflow guide

- Add AI collaboration patterns
- Update testing procedures
- Include troubleshooting steps

🤖 Assisted by Claude Code for documentation structure"
```

## 🔍 Code Review Process

### Pre-Review Checklist

```bash
# Automated checks
npm run qa:full             # Complete QA suite
npm run test:integration    # Integration tests
npm run build              # Verify build works
npm run lint               # Code quality

# Manual checks
- [ ] Code follows project conventions
- [ ] Tests cover new functionality
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No hardcoded values
- [ ] Error handling implemented
- [ ] Performance considerations addressed
```

### PR Template

```markdown
## Summary
Brief description of changes and why they were made.

## Changes Made
- List of key changes
- New features added
- Bug fixes included

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] QEMU integration verified
- [ ] Manual testing completed
- [ ] Performance testing (if applicable)

## AI Collaboration
- Claude Code: [Brief description of assistance]
- Cursor: [Brief description of assistance]
- GitHub Copilot: [Brief description of assistance]

## Checklist
- [ ] Code follows project conventions
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Performance impact considered
- [ ] Security considerations addressed

## Screenshots/Demo
(If applicable)

🤖 Generated with [Claude Code](https://claude.ai/code)
```

### Review Assignment

1. **Auto-assign**: Use GitHub auto-assignment
2. **Expertise-based**: Assign based on changed files
3. **AI-assisted**: Use AI tools to identify complex changes
4. **Pair review**: Complex changes get 2+ reviewers

### Review Standards

**Must Fix (Blocking):**
- Breaking changes
- Security vulnerabilities
- Performance regressions
- Test failures

**Should Fix (Strong suggestion):**
- Code style violations
- Missing documentation
- Suboptimal patterns
- Missing tests

**Nice to Have (Optional):**
- Code optimizations
- Better naming
- Additional tests
- Documentation improvements

## 🧪 Testing Workflow

### Test Development Strategy

```bash
# 1. Test-Driven Development
npm run test -- --watch     # Keep tests running

# Write failing test first
test('user can login with valid credentials', () => {
    // Test implementation
});

# Implement feature to make test pass
# Refactor while keeping tests green
```

### Daily Testing Practices

```bash
# Development testing
npm run test -- --watch     # Continuous testing
npm run test -- --coverage  # Check coverage

# Pre-commit testing
npm run qa:fast             # Quick quality check
npm run test:integration    # Integration tests

# QEMU testing
npm run qemu:start          # Start LibreMesh
npm run test:authenticated  # Test with real backend
```

### Test Categories

**Unit Tests (70% of tests):**
- Component behavior
- Utility functions
- API functions
- State management

**Integration Tests (25% of tests):**
- Plugin interactions
- Data flow
- API integration
- User workflows

**E2E Tests (5% of tests):**
- Critical user paths
- Cross-browser compatibility
- QEMU integration
- Performance testing

## 🚀 Release Process

### Feature Release

```bash
# 1. Prepare release
git checkout main
git pull origin main
npm run qa:full

# 2. Version bump
npm version patch          # or minor/major
git push origin main --tags

# 3. Deploy to staging
npm run deploy:staging

# 4. Final testing
npm run test:integration
npm run qa:cross-platform

# 5. Deploy to production
npm run deploy:production
```

### Hotfix Release

```bash
# 1. Create hotfix branch
git checkout main
git checkout -b hotfix/critical-fix

# 2. Implement fix
# Keep changes minimal
# Add tests for the fix

# 3. Quick quality check
npm run qa:fast
npm run test:integration

# 4. Deploy immediately
git checkout main
git merge hotfix/critical-fix
npm run deploy:production
```

### Release Checklist

**Pre-Release:**
- [ ] All tests pass
- [ ] QA approval
- [ ] Documentation updated
- [ ] Performance benchmarks met
- [ ] Security scan passed
- [ ] Cross-browser testing completed

**Release:**
- [ ] Version tagged
- [ ] Release notes created
- [ ] Deployment successful
- [ ] Smoke tests pass
- [ ] Monitoring alerts configured

**Post-Release:**
- [ ] Monitor for issues
- [ ] Update documentation
- [ ] Gather feedback
- [ ] Plan next iteration

## 🎯 Quality Gates

### Pre-Commit Hooks

```bash
# Automated checks (via husky)
npm run lint                # Code style
npm run test               # Unit tests
npm run build              # Build verification
```

### Development Quality Gates

```bash
# Daily quality checks
npm run qa:fast            # Lint + basic tests
npm run qa:full            # Complete QA suite
npm run qa:ai              # AI-assisted review
```

### AI-Assisted Quality Gates

```bash
# AI code review
npm run ai:review          # Code review suggestions
npm run ai:security        # Security scan
npm run ai:performance     # Performance analysis
npm run ai:docs           # Documentation check
```

### Quality Standards

**Code Quality:**
- ESLint compliance
- TypeScript type safety
- Test coverage >85%
- No console.log statements

**Performance:**
- Bundle size <1MB
- Initial load <3 seconds
- QEMU integration <30 seconds
- Memory usage reasonable

**Security:**
- No hardcoded secrets
- Input validation
- XSS prevention
- CSRF protection

## 🤝 Collaboration Practices

### Human-AI Collaboration

**Claude Code Specialization:**
- Architecture design
- Complex debugging
- Documentation generation
- Code review assistance

**Cursor Specialization:**
- Real-time code completion
- Component implementation
- Refactoring assistance
- IDE integration

**GitHub Copilot Specialization:**
- Function implementation
- Test generation
- Boilerplate code
- Pattern recognition

### Communication Standards

**Daily Standup:**
- What I did yesterday
- What I'm doing today
- Any blockers
- AI assistance used

**Sprint Planning:**
- Story point estimation
- AI assistance planning
- Risk assessment
- Capacity planning

### Documentation Standards

**Code Comments:**
- Document why, not what
- Include AI assistance notes
- Keep comments current
- Use JSDoc for functions

**Documentation Updates:**
- Update with feature changes
- Include AI collaboration notes
- Keep examples current
- Regular review cycles

## 🚨 Emergency Procedures

### Critical Bug Response

```bash
# 1. Immediate response
git checkout main
git checkout -b hotfix/critical-issue

# 2. Quick fix
# Minimal changes only
# Add test for the issue

# 3. Fast track review
# Skip normal review process
# Get approval from senior dev

# 4. Deploy immediately
npm run deploy:production
```

### System Down Response

```bash
# 1. Diagnose
npm run verify:setup
npm run qemu:status

# 2. Quick fixes
npm run qemu:restart
npm run dev

# 3. Escalate if needed
# Contact team lead
# Document issue
# Implement monitoring
```

## 📊 Metrics and Monitoring

### Development Metrics

- **Code coverage**: >85%
- **Build time**: <2 minutes
- **Test execution**: <30 seconds
- **Deploy time**: <5 minutes

### Quality Metrics

- **Bug escape rate**: <5%
- **Code review time**: <24 hours
- **Feature delivery**: Within sprint
- **Technical debt**: Tracked and managed

### AI Collaboration Metrics

- **AI assistance usage**: Track across tools
- **Productivity gains**: Measure impact
- **Code quality**: AI-assisted vs manual
- **Learning curve**: New developer onboarding

## 🔄 Continuous Improvement

### Weekly Retrospectives

- What worked well?
- What didn't work?
- What can we improve?
- AI collaboration effectiveness?

### Monthly Process Review

- Update workflows
- Improve quality gates
- Optimize AI collaboration
- Update documentation

### Quarterly Architecture Review

- Technical debt assessment
- Performance optimization
- Security review
- Technology updates

---

This workflow supports efficient, high-quality development while maintaining team collaboration and leveraging AI assistance effectively.