# AI Collaboration Guide

> **Purpose**: Effective human-AI collaboration for LiMeApp development  
> **Audience**: All developers using AI tools  
> **Updated**: 2025-07-08

## 🤖 AI Tools Overview

### Tool Specialization

**Claude Code (Terminal-based):**
- 🏗️ **Architecture design** and system analysis
- 🐛 **Complex debugging** and problem-solving
- 📚 **Documentation generation** and maintenance
- 🔍 **Code review** and quality analysis

**Cursor (IDE-integrated):**
- ⚡ **Real-time code completion** and suggestions
- 🔧 **Component implementation** and refactoring
- 🎨 **UI development** and styling
- 🔄 **Quick iterations** and prototyping

**GitHub Copilot:**
- 📝 **Function implementation** from comments
- 🧪 **Test generation** and boilerplate
- 🔤 **Code completion** and patterns
- 🏷️ **Type definitions** and interfaces

### When to Use Which Tool

```bash
# Starting new feature
Claude Code → Architecture design
Cursor → Component implementation  
GitHub Copilot → Test generation

# Debugging complex issue
Claude Code → Problem analysis
Cursor → Code fixes
GitHub Copilot → Error handling

# Refactoring code
Cursor → Structural changes
Claude Code → Architecture review
GitHub Copilot → Pattern completion
```

## 🎯 Development Workflows

### 1. Architecture-First Workflow

```bash
# 1. Architecture design with Claude Code
"Design the architecture for a new mesh status plugin that shows:
- Node connectivity status
- Network topology visualization
- Real-time updates via ubus
- Integration with existing LibreMesh services"

# 2. Component structure with Cursor
# Use Ctrl+K in Cursor to generate component scaffolding

# 3. Implementation details with GitHub Copilot
# Write function signatures, let Copilot complete
```

### 2. TDD with AI Workflow

```bash
# 1. Write failing test (human-driven)
test('mesh status component displays node count', () => {
    // Test implementation
});

# 2. Use AI to implement feature
# Cursor: Implement component to make test pass
# GitHub Copilot: Generate helper functions

# 3. Refactor with AI assistance
# Claude Code: Review architecture
# Cursor: Optimize implementation
```

### 3. Debug-Driven Workflow

```bash
# 1. Problem analysis with Claude Code
"I'm getting a 500 error when calling the lime-batman-adv ubus service. 
The error occurs in the mesh status component. Here's the code and error log..."

# 2. Fix implementation with Cursor
# Apply suggested fixes in real-time

# 3. Test and validate
# GitHub Copilot: Generate test cases for the fix
```

## 💡 Effective Prompt Patterns

### CARE Structure

**Context**: Provide relevant background
**Action**: Clearly state what you want
**Result**: Describe expected outcome
**Examples**: Include specific examples

```markdown
# Good prompt example
Context: I'm working on a LibreMesh plugin that displays mesh network topology
Action: Create a React component that fetches node data from the lime-batman-adv service
Result: Component should show nodes as circles with connections as lines
Examples: Similar to the existing network status component but with topology view

# Bad prompt example
"Make a network component"
```

### Category-Specific Prompts

**Architecture Design:**
```markdown
Design a scalable architecture for [feature] that integrates with:
- Existing LibreMesh services: [list services]
- Current plugin system: [describe constraints]
- Performance requirements: [specify needs]
- Future extensibility: [describe growth]
```

**Component Implementation:**
```markdown
Create a React component that:
- Fetches data from: [specify API endpoint]
- Displays: [describe UI requirements]
- Handles: [list user interactions]
- Integrates with: [existing components]
- Follows: [project conventions]
```

**Testing:**
```markdown
Generate comprehensive tests for [component/function] that cover:
- Happy path scenarios
- Error conditions
- Edge cases
- Integration with [dependencies]
- Performance considerations
```

## 🔧 LiMeApp-Specific Use Cases

### Plugin Development

```bash
# 1. Architecture with Claude Code
"Design a plugin for managing LibreMesh WiFi access points that:
- Uses the iwinfo ubus service
- Shows AP status and client connections
- Allows configuration changes
- Integrates with existing lime-config"

# 2. Component implementation with Cursor
# Create plugin structure, components, and API calls

# 3. Testing with GitHub Copilot
# Generate test cases for ubus integration and UI components
```

### ubus Integration

```bash
# Common pattern for ubus API calls
"Create a TanStack Query hook for the lime-utils service that:
- Calls the get_node_status method
- Handles authentication
- Implements proper error handling
- Includes TypeScript types"
```

### QEMU Testing

```bash
# Testing with real LibreMesh
"Help me debug why the mesh status component isn't connecting to QEMU LibreMesh:
- QEMU is running at 10.13.0.1
- ubus calls are timing out
- Network seems configured correctly
- Here's the error log..."
```

## 🛡️ Security and Best Practices

### Always Do

✅ **Review AI-generated code** for security issues
✅ **Validate inputs** in AI-generated functions
✅ **Test thoroughly** before committing AI code
✅ **Document AI assistance** in commit messages
✅ **Understand the code** before using it

### Never Do

❌ **Commit secrets** exposed in AI conversations
❌ **Use AI code blindly** without understanding
❌ **Skip testing** AI-generated code
❌ **Ignore security** implications
❌ **Rely solely on AI** for critical decisions

### Security Checklist

```bash
# Before using AI-generated code
- [ ] No hardcoded credentials
- [ ] Input validation present
- [ ] Error handling implemented
- [ ] No console.log with sensitive data
- [ ] Proper authentication checks
- [ ] XSS prevention measures
```

## 📊 Quality Assurance with AI

### AI-Assisted Code Review

```bash
# Use Claude Code for comprehensive review
"Review this LibreMesh plugin code for:
- Security vulnerabilities
- Performance issues
- Code quality concerns
- Architecture alignment
- Best practices compliance"
```

### Automated Quality Checks

```bash
# Scripts for AI-assisted QA
npm run ai:review          # Code review suggestions
npm run ai:security        # Security scan
npm run ai:performance     # Performance analysis
npm run ai:docs           # Documentation check
```

### Quality Metrics

**Effectiveness Indicators:**
- Reduced debugging time
- Faster feature implementation
- Improved code quality
- Better test coverage
- Enhanced documentation

**Red Flags:**
- Over-reliance on AI
- Decreased code understanding
- Security vulnerabilities
- Poor performance
- Inconsistent patterns

## 🎨 Complete Workflow Example

### Adding Push Notification Support

**Step 1: Architecture Design (Claude Code)**
```bash
"Design architecture for push notifications in LiMeApp that:
- Integrates with LibreMesh system events
- Uses WebSocket for real-time updates
- Supports different notification types
- Works with existing plugin system"
```

**Step 2: Component Implementation (Cursor)**
```typescript
// Use Ctrl+K to generate:
// - NotificationProvider component
// - useNotifications hook
// - NotificationDisplay component
```

**Step 3: Backend Integration (GitHub Copilot)**
```typescript
// Write function signature, let Copilot complete:
function subscribeToSystemEvents(callback: (event: SystemEvent) => void) {
    // Copilot generates WebSocket connection logic
}
```

**Step 4: Testing (All Tools)**
```typescript
// Claude Code: Test strategy
// Cursor: Component tests
// GitHub Copilot: Mock implementations
```

**Step 5: Quality Assurance (Claude Code)**
```bash
"Review the push notification implementation for:
- Performance impact
- Error handling
- Security considerations
- Integration with existing code"
```

## 🚀 Advanced Techniques

### Context Management

```bash
# Maintain context across sessions
# Save important decisions in CLAUDE.md
# Reference previous conversations
# Build on existing knowledge
```

### Multi-Tool Coordination

```bash
# Use tools in sequence
Claude Code → Architecture
Cursor → Implementation
GitHub Copilot → Completion
Claude Code → Review
```

### Prompt Engineering

```bash
# Iterative refinement
Initial prompt → Review output → Refine prompt → Better output

# Context stacking
Base context + Specific request + Examples + Constraints
```

## 📈 Measuring AI Collaboration Success

### Development Metrics

- **Feature delivery time**: Before/after AI adoption
- **Code quality**: Defect rates and review feedback
- **Test coverage**: Automated test generation impact
- **Documentation quality**: Completeness and accuracy

### Team Metrics

- **Developer satisfaction**: Survey responses
- **Learning curve**: New developer onboarding
- **Productivity**: Stories completed per sprint
- **Knowledge sharing**: Documentation usage

### Quality Metrics

- **Bug rates**: Production issues
- **Security issues**: Vulnerabilities found
- **Performance**: Application performance metrics
- **Maintainability**: Code complexity scores

## 🔄 Continuous Improvement

### Weekly AI Review

- What AI assistance worked well?
- What didn't work as expected?
- New techniques discovered?
- Tool effectiveness comparison?

### Monthly Process Update

- Update prompt templates
- Refine tool usage patterns
- Share best practices
- Update documentation

### Quarterly AI Strategy

- Evaluate new AI tools
- Update collaboration patterns
- Assess productivity gains
- Plan training needs

## 🎯 Antipatterns to Avoid

### Over-reliance
```bash
# Bad: Let AI decide everything
# Good: Use AI as a powerful assistant
```

### Under-contextualization
```bash
# Bad: "Fix this code"
# Good: "Fix this LibreMesh ubus integration that's failing with timeout errors"
```

### Blind Implementation
```bash
# Bad: Copy AI code without understanding
# Good: Review, understand, and adapt AI suggestions
```

### Security Negligence
```bash
# Bad: Ignore security implications
# Good: Always review AI code for security issues
```

## 📚 Resources

### Tool Documentation
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Cursor Documentation](https://cursor.sh/docs)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)

### Best Practices
- [AI-Assisted Development Guide](../03-guides/ai-development-practices.md)
- [Security with AI](../04-reference/security-guidelines.md)
- [Code Review with AI](../06-tools/checklists/ai-code-review.md)

### Project Context
- [Architecture Overview](../01-architecture/overview.md)
- [Development Workflow](workflow.md)
- [Quick Reference](../00-quick-start/quick-reference.md)

---

**Remember**: AI is a powerful tool to augment human capability, not replace human judgment. Use it wisely, responsibly, and always with proper understanding of the generated code.