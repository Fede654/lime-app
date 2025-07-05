# Development Organization - Human-AI Collaborative LiMeApp

## Overview

This document outlines the organization and processes for **human-AI collaborative development** on LiMeApp across multiple platforms (Windows, Linux, macOS) and AI tools (Claude Code, Cursor). This framework ensures effective collaboration while maintaining quality standards for eventual upstream contribution.

## Table of Contents

1. [Team Composition](#team-composition)
2. [Development Environment Setup](#development-environment-setup)
3. [AI-Assisted Development Guidelines](#ai-assisted-development-guidelines)
4. [Quality Assurance Framework](#quality-assurance-framework)
5. [Cross-Platform Development](#cross-platform-development)
6. [Documentation Standards](#documentation-standards)
7. [Contribution Workflow](#contribution-workflow)

## Team Composition

### Human Developers

-   **Platforms:** Windows (WSL2), Linux, macOS
-   **IDEs:** VS Code, JetBrains, vim/neovim
-   **Responsibilities:** Architecture, business logic, code review, user experience

### AI Assistants

-   **Claude Code:** Terminal-based development, debugging, complex problem-solving
-   **Cursor:** IDE-integrated coding, real-time assistance, refactoring
-   **Other tools:** As they become available and useful

## Development Environment Setup

### Quick Start Verification

Run this comprehensive setup check:

```bash
# Clone and setup
git clone <your-repo-url>
cd lime-app
npm install

# Verify development environment
npm run verify:setup    # Checks all prerequisites
npm run verify:qemu     # Verifies QEMU LibreMesh setup
npm run verify:ai       # Checks AI tools integration
```

### Platform-Specific Setup

#### Linux (Primary Platform)

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y \
  nodejs npm git build-essential \
  qemu-system-x86 screen curl

# Fedora
sudo dnf install -y nodejs npm git gcc-c++ qemu-system-x86 screen

# Arch Linux
sudo pacman -S nodejs npm git base-devel qemu screen

# Verify installation
npm run verify:linux
```

#### Windows Development

```powershell
# Option 1: WSL2 (Recommended for full development)
wsl --install -d Ubuntu
# Then follow Linux setup inside WSL2

# Option 2: Native Windows (Frontend-only)
# Install via winget
winget install OpenJS.NodeJS
winget install Git.Git

# Or via Chocolatey
choco install nodejs git

# Verify installation
npm run verify:windows
```

#### macOS Development

```bash
# Install via Homebrew
brew install node git qemu screen

# Verify installation
npm run verify:macos
```

### AI Tools Integration

#### Claude Code Setup

```bash
# Install Claude Code CLI (if available)
# Configure for project-specific context
echo "# Claude Code Configuration
project_type: preact_libremesh
ai_assistance_level: collaborative
focus_areas: [debugging, testing, documentation]" > .claude-config.yml
```

#### Cursor IDE Setup

```json
// .cursor/settings.json
{
    "cursor.ai.enabled": true,
    "cursor.ai.model": "claude-4-sonnet",
    "cursor.ai.contextWindow": "large",
    "cursor.ai.codebase": {
        "indexing": true,
        "focusAreas": ["src/", "plugins/", "tests/"]
    }
}
```

#### VS Code + AI Extensions

```json
// .vscode/settings.json
{
    "github.copilot.enable": {
        "*": true,
        "yaml": false,
        "plaintext": false
    },
    "cursor.ai.autocomplete": true,
    "claude.contextFiles": ["DEVELOPMENT_ORGANIZATION.md", "README.md"]
}
```

## AI-Assisted Development Guidelines

### Collaborative Workflow Patterns

#### Pattern 1: Architecture-First Development

```
1. Human: Define component architecture and interfaces
2. AI: Generate component scaffolding and initial structure
3. Human: Implement complex business logic
4. AI: Generate comprehensive test suite
5. Both: Review, refine, and optimize
```

#### Pattern 2: TDD with AI Assistance

```
1. Human: Write failing test for feature requirement
2. AI: Generate initial implementation to pass test
3. Human: Review and refine implementation
4. AI: Generate edge case tests
5. Both: Refactor and optimize
```

#### Pattern 3: Debug-Driven Development

```
1. Human: Identify bug or issue
2. AI (Claude Code): Analyze and debug systematically
3. Human: Validate fix approach
4. AI: Implement fix with tests
5. Human: Verify fix across platforms
```

### AI Tool Specialization

#### Claude Code (Terminal-based)

**Best for:**

-   Complex debugging sessions
-   QEMU LibreMesh setup and troubleshooting
-   Architectural analysis and planning
-   Comprehensive testing strategies
-   Documentation generation

**Usage patterns:**

```bash
# Effective prompts
"Debug the failing mesh-wide tests step by step"
"Analyze the test coverage gaps and suggest improvements"
"Set up cross-platform QEMU development environment"
"Review this plugin architecture for LibreMesh integration"
```

#### Cursor (IDE-integrated)

**Best for:**

-   Real-time code completion and suggestions
-   Component development and refactoring
-   Inline documentation and comments
-   Code exploration and understanding
-   Quick prototyping

**Usage patterns:**

-   `Ctrl+K`: Generate code from natural language
-   `Ctrl+L`: Explain selected code
-   `@codebase`: Ask questions about the entire project
-   `@file`: Focus on specific file context

**Usage patterns:**

```javascript
// Comment-driven development
// TODO: Create a React component for mesh node status display
// with TypeScript props and error handling
```

### Quality Assurance with AI

#### Pre-commit AI Checks

```bash
# AI-assisted quality gates
npm run ai:review      # AI code review suggestions
npm run ai:test        # AI-generated test validation
npm run ai:docs        # AI documentation completeness check
npm run ai:security    # AI security vulnerability scan
```

#### Commit Message Standards for AI-Assisted Work

```bash
# Format: type(scope): description
#
# body explaining what was done and AI assistance used
#
# 🤖 AI-assisted with: [tool] for [specific task]

# Examples:
git commit -m "feat(mesh): add node status visualization component

- Implemented TypeScript React component with real-time updates
- Added comprehensive test suite with 95% coverage
- Created Storybook stories for all component states
- Integrated with LibreMesh ubus API for live data

🤖 AI-assisted with: Cursor for component structure and types
🤖 AI-assisted with: Claude Code for testing strategy"

git commit -m "fix(qemu): resolve network connectivity issues

- Fixed LibreMesh IP configuration in QEMU setup
- Updated documentation for cross-platform compatibility
- Added network verification scripts

🤖 AI-assisted with: Claude Code for systematic debugging
```

## Quality Assurance Framework

### Automated Quality Gates

#### Development Quality Checks

```json
{
    "scripts": {
        "qa:fast": "npm run lint && npm run type-check",
        "qa:full": "npm run test && npm run lint && npm run build && npm run test:integration",
        "qa:ai": "npm run ai:review && npm run ai:security",
        "qa:cross-platform": "npm run test:windows && npm run test:linux && npm run test:macos",
        "qa:upstream": "npm run qa:full && npm run qa:cross-platform && npm run qa:ai"
    }
}
```

#### Pre-commit Hooks

```yaml
# .pre-commit-config.yaml
repos:
    - repo: local
      hooks:
          - id: npm-test
            name: Run npm tests
            entry: npm test
            language: system
            pass_filenames: false

          - id: ai-review
            name: AI-assisted code review
            entry: npm run ai:review
            language: system
            pass_filenames: false

          - id: cross-platform-check
            name: Cross-platform compatibility check
            entry: npm run verify:cross-platform
            language: system
            pass_filenames: false
```

#### Continuous Integration

```yaml
# .github/workflows/development-qa.yml
name: Development Quality Assurance
on: [push, pull_request]

jobs:
    human-ai-collaboration-test:
        strategy:
            matrix:
                os: [ubuntu-latest, windows-latest, macos-latest]
                ai-tools: [with-ai, without-ai]

        runs-on: ${{ matrix.os }}

        steps:
            - uses: actions/checkout@v3

            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: "20"
                  cache: "npm"

            - name: Install dependencies
              run: npm ci

            - name: Run quality checks
              run: npm run qa:full

            - name: Test QEMU integration (Linux only)
              if: matrix.os == 'ubuntu-latest'
              run: |
                  sudo apt-get install qemu-system-x86 screen
                  npm run test:qemu

            - name: AI-assisted checks
              if: matrix.ai-tools == 'with-ai'
              run: npm run qa:ai

            - name: Upload coverage
              uses: codecov/codecov-action@v3
```

### Testing Standards

#### Test Categories and Coverage

```bash
# Unit tests (90% coverage minimum)
npm run test:unit          # Jest + Testing Library

# Integration tests (80% coverage minimum)
npm run test:integration   # Real LibreMesh API tests

# AI-generated test validation
npm run test:ai-generated  # Verify AI-written tests

# Cross-platform tests
npm run test:cross-platform

# Performance tests
npm run test:performance

# Visual regression tests
npm run test:visual        # Storybook + Chromatic
```

#### AI-Assisted Testing Workflow

```javascript
// Example: AI-generated test with human review
describe("MeshNodeStatus Component (AI-generated + human-reviewed)", () => {
    // 🤖 AI-generated: Basic component rendering tests
    it("renders without crashing", () => {
        render(<MeshNodeStatus nodeId="test-node" />);
        expect(screen.getByTestId("mesh-node-status")).toBeInTheDocument();
    });

    // 🤖 AI-generated: Props validation tests
    it("displays node information correctly", () => {
        const mockNode = { id: "node-1", status: "online", signal: 85 };
        render(<MeshNodeStatus node={mockNode} />);
        expect(screen.getByText("node-1")).toBeInTheDocument();
        expect(screen.getByText("85%")).toBeInTheDocument();
    });

    // 👤 Human-written: Complex interaction tests
    it("handles node status changes with proper animations", async () => {
        const onStatusChange = jest.fn();
        const { rerender } = render(
            <MeshNodeStatus
                node={{ ...mockNode, status: "online" }}
                onStatusChange={onStatusChange}
            />
        );

        // Test complex state transitions that require domain knowledge
        rerender(
            <MeshNodeStatus
                node={{ ...mockNode, status: "offline" }}
                onStatusChange={onStatusChange}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId("status-indicator")).toHaveClass(
                "status-offline"
            );
        });
        expect(onStatusChange).toHaveBeenCalledWith("offline");
    });
});
```

## Cross-Platform Development

### Platform-Specific Considerations

#### File System Handling

```javascript
// ✅ Good: Cross-platform path handling
const path = require('path');
const configPath = path.join(__dirname, 'config', 'development.json');

// ❌ Bad: Platform-specific paths
const configPath = __dirname + '/config/development.json'; // Fails on Windows
```

#### Environment Variables

```json
{
    "scripts": {
        "dev:linux": "NODE_ENV=development npm start",
        "dev:windows": "set NODE_ENV=development && npm start",
        "dev:cross-platform": "cross-env NODE_ENV=development npm start"
    }
}
```

#### Git Configuration

```bash
# Essential cross-platform Git settings
git config --global core.autocrlf false    # Prevents Windows line ending issues
git config --global core.eol lf           # Use LF line endings everywhere
git config --global core.filemode false   # Ignore file permission changes
```

### Platform Testing Strategy

#### Automated Cross-Platform Testing

```bash
# Test matrix for different platforms
npm run test:matrix

# Platform-specific test commands
npm run test:windows:native    # Native Windows testing
npm run test:windows:wsl       # WSL2 testing
npm run test:linux:ubuntu      # Ubuntu testing
npm run test:linux:fedora      # Fedora testing
npm run test:macos:intel       # Intel Mac testing
npm run test:macos:arm         # Apple Silicon testing
```

#### Manual Testing Checklist

```markdown
### Pre-release Cross-Platform Checklist

#### Windows Testing

-   [ ] Native Windows development works (frontend-only)
-   [ ] WSL2 development works (full stack with QEMU)
-   [ ] Git line endings are correct
-   [ ] Build process succeeds
-   [ ] All tests pass

#### Linux Testing

-   [ ] Ubuntu/Debian development works
-   [ ] Fedora development works
-   [ ] QEMU LibreMesh integration works
-   [ ] All quality gates pass

#### macOS Testing

-   [ ] Intel Mac development works
-   [ ] Apple Silicon development works
-   [ ] QEMU setup functions properly
-   [ ] Performance is acceptable

#### AI Tools Testing

-   [ ] Claude Code works on all platforms
-   [ ] Cursor integration functions properly
-   [ ] AI-generated code works cross-platform
```

## Documentation Standards

### Multi-Level Documentation Architecture

#### 1. Quick Reference (README.md)

-   Development options overview
-   Quick start commands
-   Links to detailed documentation

#### 2. Comprehensive Setup (DEVELOPMENT_SETUP.md)

-   Complete installation instructions
-   Environment configuration
-   Troubleshooting guides

#### 3. Contribution Guidelines (CONTRIBUTING.md)

-   Git workflow and standards
-   Code review process
-   Translation contributions

#### 4. Organization & Process (This Document)

-   Human-AI collaboration patterns
-   Quality assurance framework
-   Cross-platform development

#### 5. Technical Documentation

```
docs/
├── api/                 # API documentation
├── architecture/        # System architecture
├── plugins/            # Plugin development guides
├── testing/            # Testing strategies
└── deployment/         # Production deployment
```

### AI-Assisted Documentation

#### Documentation Generation Workflow

```bash
# AI-generated documentation
npm run docs:generate:api        # Generate API docs from code
npm run docs:generate:components  # Generate component docs
npm run docs:generate:plugins    # Generate plugin documentation

# Human review and enhancement
npm run docs:review             # Review AI-generated docs
npm run docs:validate          # Validate documentation completeness
```

#### Documentation Quality Standards

```markdown
### Documentation Review Checklist

#### AI-Generated Documentation

-   [ ] **Accuracy**: All generated content is factually correct
-   [ ] **Completeness**: Covers all public APIs and components
-   [ ] **Examples**: Includes working code examples
-   [ ] **Context**: Provides appropriate context for LibreMesh

#### Human-Enhanced Documentation

-   [ ] **User Experience**: Written from user perspective
-   [ ] **Troubleshooting**: Includes common issues and solutions
-   [ ] **Best Practices**: Documents recommended approaches
-   [ ] **Cross-Platform**: Addresses platform-specific considerations
```

## Contribution Workflow

### Internal Development Workflow

#### 1. Feature Planning

```bash
# Create feature branch
git checkout -b feature/mesh-node-dashboard

# Plan with AI assistance
# - Use Claude Code for architecture planning
# - Use Cursor for component design
# - Document approach in feature branch
```

#### 2. Collaborative Implementation

```bash
# Daily development cycle
npm run dev:start              # Start development environment
npm run ai:assist:active       # Activate AI assistance for session

# Development loop:
# 1. Human: Define requirements and architecture
# 2. AI: Generate scaffolding and initial implementation
# 3. Human: Review and enhance implementation
# 4. AI: Generate comprehensive tests
# 5. Both: Refactor and optimize
```

#### 3. Quality Assurance

```bash
# Pre-commit checks
npm run qa:pre-commit          # Fast quality checks
git add . && git commit        # Trigger pre-commit hooks

# Pre-push checks
npm run qa:full                # Comprehensive testing
npm run qa:cross-platform      # Cross-platform validation
git push origin feature/mesh-node-dashboard
```

#### 4. Code Review Process

```markdown
### Code Review Checklist

#### Human Reviewer Focus

-   [ ] **Business Logic**: Requirements implementation correctness
-   [ ] **User Experience**: Interface design and usability
-   [ ] **Architecture**: Design patterns and maintainability
-   [ ] **Security**: Potential vulnerabilities or issues
-   [ ] **Performance**: Impact on application performance

#### AI-Assisted Review Areas

-   [ ] **Code Style**: Consistent formatting and conventions
-   [ ] **Test Coverage**: Comprehensive test implementation
-   [ ] **Documentation**: Code comments and API documentation
-   [ ] **Type Safety**: TypeScript usage and type correctness
-   [ ] **Cross-Platform**: Compatibility across environments
```

### Upstream Contribution Preparation

#### Upstream Readiness Checklist

```bash
# Quality gates for upstream contribution
npm run qa:upstream:preparation

# Includes:
# ✅ Zero ESLint errors (warnings documented)
# ✅ 95%+ test coverage for new features
# ✅ TypeScript strict mode compliance
# ✅ Cross-browser compatibility verified
# ✅ Mobile responsiveness tested
# ✅ Accessibility compliance (WCAG 2.1 AA)
# ✅ Documentation complete and accurate
# ✅ AI assistance properly attributed
```

#### Upstream Contribution Process

```bash
# 1. Prepare upstream branch
git checkout -b upstream/feature-name
git rebase -i main              # Clean up commit history

# 2. Verify upstream compliance
npm run qa:upstream:strict      # Stricter quality checks

# 3. Create upstream PR
# - Fork original libremesh/lime-app repository
# - Push to your fork
# - Create PR with detailed description
# - Include AI assistance attribution

# 4. Maintain synchronization
git remote add upstream https://github.com/libremesh/lime-app.git
git fetch upstream develop
git rebase upstream/develop
```

## Development Team Organization

### Roles and Responsibilities

#### Human Developers

-   **Lead Developer**: Architecture decisions, code review, release management
-   **Frontend Specialists**: UI/UX implementation, responsive design, accessibility
-   **Backend Integration**: LibreMesh API integration, networking features
-   **DevOps**: CI/CD, deployment, cross-platform compatibility
-   **Quality Assurance**: Testing strategies, quality gates, performance

#### AI Assistants

-   **Primary AI (Claude Code)**: Complex debugging, architecture analysis, documentation
-   **IDE AI (Cursor)**: Real-time coding assistance, refactoring, exploration
-   **Code Completion (Copilot)**: Function implementation, test generation, boilerplate

### Communication and Coordination

#### Daily Standup Template

```markdown
### Human Developer Update

-   **Yesterday**: [What was accomplished]
-   **Today**: [What will be worked on]
-   **Blockers**: [Any issues or dependencies]
-   **AI Assistance Used**: [Which AI tools for what tasks]

### AI Assistance Summary

-   **Code Generation**: [Lines of code generated by AI]
-   **Test Coverage**: [Tests written by AI vs human]
-   **Documentation**: [AI-generated vs human-written docs]
-   **Issues Resolved**: [Bugs fixed with AI assistance]
```

#### Sprint Planning with AI

```markdown
### Sprint Planning Considerations

#### Human-Led Tasks

-   [ ] **User story definition** and acceptance criteria
-   [ ] **Architecture decisions** and technical planning
-   [ ] **Code review** and quality assurance
-   [ ] **Integration testing** with real LibreMesh environment

#### AI-Assisted Tasks

-   [ ] **Component scaffolding** and boilerplate generation
-   [ ] **Test implementation** with comprehensive coverage
-   [ ] **Documentation generation** from code comments
-   [ ] **Bug reproduction** and systematic debugging

#### Collaborative Tasks

-   [ ] **Feature implementation** (human logic + AI structure)
-   [ ] **Refactoring efforts** (human decisions + AI execution)
-   [ ] **Performance optimization** (human analysis + AI implementation)
-   [ ] **Cross-platform validation** (human testing + AI automation)
```

---

## Getting Started

### For New Human Developers

1. **Read** this document and [CONTRIBUTING.md](./CONTRIBUTING.md)
2. **Set up** development environment using [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)
3. **Configure** AI tools for your platform and IDE
4. **Join** team communication channels
5. **Start** with a good first issue to learn the workflow

### For AI Tool Integration

1. **Configure** AI tools according to platform-specific sections
2. **Test** AI assistance with simple tasks first
3. **Learn** project-specific patterns and conventions
4. **Establish** quality gates for AI-generated content
5. **Document** AI assistance usage in commits and PRs

### For Cross-Platform Development

1. **Verify** setup works on your target platform
2. **Test** QEMU integration if applicable
3. **Validate** build and test processes
4. **Check** Git configuration for cross-platform compatibility
5. **Report** any platform-specific issues found

---

_Document maintained by: Human-AI collaborative development team_  
_Last updated: December 2024_  
_Review cycle: Monthly or after significant process changes_
