# Pull Request Checklist

> **Purpose**: Ensure code quality and consistency before merging  
> **Usage**: Copy to PR description or use as review guide  
> **Updated**: 2025-07-08

## 📋 Pre-Submission Checklist

### Code Quality
- [ ] Code follows project conventions and style guide
- [ ] TypeScript types are properly defined
- [ ] No console.log statements in production code
- [ ] No hardcoded values (use configuration/constants)
- [ ] Error handling is implemented appropriately
- [ ] Code is readable and well-structured

### Testing
- [ ] Unit tests added/updated for new functionality
- [ ] Integration tests pass with QEMU backend
- [ ] Test coverage maintains or improves project standards
- [ ] All existing tests still pass
- [ ] Manual testing completed for UI changes

### Documentation
- [ ] Code comments added for complex logic
- [ ] Public API changes documented
- [ ] README updated if needed
- [ ] Migration guide provided for breaking changes
- [ ] Storybook stories added/updated for UI components

### Security & Performance
- [ ] No sensitive data exposed in code
- [ ] Input validation implemented where needed
- [ ] Performance impact considered and tested
- [ ] Bundle size impact acceptable
- [ ] Accessibility considerations addressed

### AI Collaboration
- [ ] AI assistance properly attributed in commit messages
- [ ] AI-generated code reviewed and understood
- [ ] Security implications of AI code considered
- [ ] No AI-generated secrets or credentials

## 🔧 Automated Checks

### Build & Quality
- [ ] `npm run build` succeeds without errors
- [ ] `npm run lint` passes without issues
- [ ] `npm run test` passes all tests
- [ ] `npm run qa:full` completes successfully

### QEMU Integration
- [ ] `npm run qemu:start` works correctly
- [ ] `npm run deploy:qemu` succeeds
- [ ] `npm run test:integration` passes
- [ ] QEMU functionality manually verified

## 📊 Change Assessment

### Impact Analysis
- [ ] **Breaking changes**: None or properly documented
- [ ] **Dependencies**: New dependencies justified and secure
- [ ] **Performance**: No negative performance impact
- [ ] **Compatibility**: Works across supported environments
- [ ] **Accessibility**: Maintains or improves accessibility

### Plugin Development (if applicable)
- [ ] Plugin follows established patterns
- [ ] Plugin properly registered in config
- [ ] Plugin tests include integration scenarios
- [ ] Plugin documentation updated
- [ ] Plugin doesn't break existing functionality

## 🎯 Review Focus Areas

### For Reviewers
**Architecture & Design:**
- [ ] Changes align with system architecture
- [ ] Patterns are consistent with existing codebase
- [ ] Design decisions are well-justified
- [ ] Future maintainability considered

**Code Quality:**
- [ ] Code is clean and readable
- [ ] Appropriate abstractions used
- [ ] Error handling is comprehensive
- [ ] Edge cases are handled

**Testing:**
- [ ] Tests cover important scenarios
- [ ] Tests are reliable and not flaky
- [ ] Test quality is high
- [ ] Integration points are tested

## 📝 PR Description Template

```markdown
## Summary
Brief description of changes and why they were made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] CI/CD changes

## Changes Made
- List of specific changes
- New features implemented
- Bug fixes included
- Refactoring done

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] QEMU integration verified
- [ ] Manual testing completed
- [ ] Cross-browser testing (if applicable)
- [ ] Performance testing (if applicable)

## AI Collaboration
- **Claude Code**: [Brief description of assistance]
- **Cursor**: [Brief description of assistance]  
- **GitHub Copilot**: [Brief description of assistance]

## Breaking Changes
- [ ] No breaking changes
- [ ] Breaking changes documented below

[If breaking changes, describe migration path]

## Screenshots/Demo
[If applicable, add screenshots or demo links]

## Checklist
- [ ] Code follows project conventions
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Performance impact considered
- [ ] Security considerations addressed
- [ ] AI assistance properly attributed

🤖 Generated with [Claude Code](https://claude.ai/code)
```

## 🚨 Common Issues to Check

### Code Issues
- **Unused imports**: Remove unused imports
- **Dead code**: Remove commented-out code
- **Hardcoded values**: Move to configuration
- **Missing error handling**: Add appropriate error handling
- **Memory leaks**: Check for proper cleanup

### Testing Issues
- **Test flakiness**: Ensure tests are deterministic
- **Missing edge cases**: Test boundary conditions
- **Incomplete mocking**: Properly mock dependencies
- **Slow tests**: Optimize test performance
- **Test isolation**: Ensure tests don't depend on each other

### Documentation Issues
- **Outdated comments**: Update comments to match code
- **Missing documentation**: Document complex logic
- **Broken links**: Verify all documentation links work
- **Inconsistent style**: Follow documentation standards

### Security Issues
- **Exposed credentials**: No secrets in code
- **Input validation**: Validate all user inputs
- **XSS vulnerabilities**: Sanitize user-generated content
- **Authentication bypass**: Verify auth requirements
- **Dependency vulnerabilities**: Check for security updates

## 🔄 Post-Merge Actions

### Immediate Actions
- [ ] Verify deployment successful
- [ ] Monitor for immediate issues
- [ ] Update related documentation
- [ ] Communicate changes to team
- [ ] Close related issues

### Follow-up Actions
- [ ] Monitor performance metrics
- [ ] Gather user feedback
- [ ] Plan any needed improvements
- [ ] Update documentation as needed
- [ ] Review and learn from the change

## 📚 Resources

### Style Guides
- [TypeScript Style Guide](../04-reference/typescript-style.md)
- [Component Style Guide](../04-reference/component-style.md)
- [Testing Guidelines](../02-development/testing-strategy.md)

### Tools
- [Development Setup](../00-quick-start/development-setup.md)
- [Quick Reference](../00-quick-start/quick-reference.md)
- [Troubleshooting](../00-quick-start/troubleshooting.md)

### Review Process
- [Development Workflow](../02-development/workflow.md)
- [AI Collaboration](../02-development/ai-collaboration.md)
- [Code Review Standards](../02-development/code-review.md)

---

**Remember**: This checklist is a guide, not a burden. Use it to ensure quality while maintaining development velocity.