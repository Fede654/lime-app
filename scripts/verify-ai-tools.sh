#!/bin/bash

# AI Development Tools Verification Script
# Checks AI assistant configurations and integrations

set -e

echo "🤖 AI Development Tools Verification"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check Claude Code configuration
echo -e "\n${BLUE}Claude Code Configuration${NC}"
echo "-------------------------"

if [ -f ".claude-config.yml" ]; then
    success "Claude Code configuration file found"
    
    # Check configuration content
    if grep -q "project_type" .claude-config.yml; then
        PROJECT_TYPE=$(grep "project_type" .claude-config.yml | cut -d: -f2 | tr -d ' ')
        info "Project type: $PROJECT_TYPE"
    fi
    
    if grep -q "ai_assistance_level" .claude-config.yml; then
        ASSISTANCE_LEVEL=$(grep "ai_assistance_level" .claude-config.yml | cut -d: -f2 | tr -d ' ')
        info "Assistance level: $ASSISTANCE_LEVEL"
    fi
else
    warning "Claude Code configuration not found"
    info "Create with: echo '# Claude Code Configuration\nproject_type: preact_libremesh\nai_assistance_level: collaborative\nfocus_areas: [debugging, testing, documentation]' > .claude-config.yml"
fi

# Check if we're currently in a Claude Code session
if [ -n "$CLAUDE_CODE_SESSION" ] || [ -n "$ANTHROPIC_API_KEY" ]; then
    success "Claude Code environment detected"
else
    info "Not currently in a Claude Code session"
fi

# Check Cursor IDE configuration
echo -e "\n${BLUE}Cursor IDE Configuration${NC}"
echo "------------------------"

if [ -d ".cursor" ]; then
    success "Cursor configuration directory found"
    
    if [ -f ".cursor/settings.json" ]; then
        success "Cursor settings configuration found"
        
        # Check for AI enablement
        if grep -q '"cursor.ai.enabled".*true' .cursor/settings.json; then
            success "Cursor AI assistance enabled"
        else
            warning "Cursor AI assistance not enabled in settings"
        fi
        
        # Check for model configuration
        if grep -q '"cursor.ai.model"' .cursor/settings.json; then
            MODEL=$(grep '"cursor.ai.model"' .cursor/settings.json | cut -d: -f2 | tr -d '", ')
            info "Configured model: $MODEL"
        fi
        
        # Check for codebase indexing
        if grep -q '"cursor.ai.codebase"' .cursor/settings.json; then
            success "Codebase indexing configured"
        fi
    else
        warning "Cursor settings.json not found"
        info "Create .cursor/settings.json with AI configuration"
    fi
else
    warning "Cursor configuration directory not found"
    info "Cursor IDE may not be installed or configured"
fi

# Check VS Code configuration
echo -e "\n${BLUE}VS Code Configuration${NC}"
echo "---------------------"

if [ -d ".vscode" ]; then
    success "VS Code configuration directory found"
    
    if [ -f ".vscode/settings.json" ]; then
        success "VS Code settings found"
        
        # Check for GitHub Copilot
        if grep -q '"github.copilot.enable"' .vscode/settings.json; then
            success "GitHub Copilot configuration found"
        else
            info "GitHub Copilot not configured (optional)"
        fi
        
        # Check for AI-related extensions configuration
        if grep -q '"claude"' .vscode/settings.json; then
            success "Claude extension configuration found"
        fi
        
        if grep -q '"cursor"' .vscode/settings.json; then
            success "Cursor extension configuration found"
        fi
    else
        warning "VS Code settings.json not found"
        info "Configure AI extensions in .vscode/settings.json"
    fi
    
    # Check for launch configurations
    if [ -f ".vscode/launch.json" ]; then
        success "Debug launch configurations found"
    else
        info "Debug configurations not found (optional)"
    fi
    
    # Check for extension recommendations
    if [ -f ".vscode/extensions.json" ]; then
        success "Extension recommendations found"
    else
        info "Extension recommendations not found (optional)"
    fi
else
    warning "VS Code configuration directory not found"
    info "Create .vscode/ directory for VS Code AI integration"
fi

# Check for AI-assisted development patterns
echo -e "\n${BLUE}AI Development Patterns${NC}"
echo "-----------------------"

# Check for AI-generated test files
AI_TEST_COUNT=$(find . -name "*.ai.spec.*" -o -name "*.ai.test.*" 2>/dev/null | wc -l)
if [ "$AI_TEST_COUNT" -gt 0 ]; then
    success "AI-generated test files found ($AI_TEST_COUNT files)"
    info "Use: npm run test:ai-generated"
else
    info "No AI-generated test files found yet"
fi

# Check for AI documentation markers
AI_DOC_COUNT=$(grep -r "🤖 AI-assisted" . --include="*.md" --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" 2>/dev/null | wc -l)
if [ "$AI_DOC_COUNT" -gt 0 ]; then
    success "AI assistance markers found in code ($AI_DOC_COUNT instances)"
    info "Good practice for tracking AI contributions"
else
    info "No AI assistance markers found - consider adding them to track AI contributions"
fi

# Check for commit message patterns
if [ -d ".git" ]; then
    AI_COMMIT_COUNT=$(git log --oneline --grep="🤖 AI-assisted" --since="1 month ago" 2>/dev/null | wc -l)
    if [ "$AI_COMMIT_COUNT" -gt 0 ]; then
        success "AI-assisted commits found ($AI_COMMIT_COUNT in last month)"
        info "Good practice for tracking AI contributions in git history"
    else
        info "No AI-assisted commit markers found - consider using them for transparency"
    fi
fi

# Check AI quality gate scripts
echo -e "\n${BLUE}AI Quality Gates${NC}"
echo "----------------"

# Check if AI quality scripts exist
if [ -f "scripts/ai-code-review.sh" ]; then
    success "AI code review script available"
else
    info "AI code review script not found (will be created)"
fi

if [ -f "scripts/ai-security-scan.sh" ]; then
    success "AI security scan script available"
else
    info "AI security scan script not found (will be created)"
fi

if [ -f "scripts/ai-docs-check.sh" ]; then
    success "AI documentation check script available"
else
    info "AI documentation check script not found (will be created)"
fi

# Check package.json AI scripts
echo -e "\n${BLUE}Package.json AI Scripts${NC}"
echo "-----------------------"

if [ -f "package.json" ]; then
    if grep -q '"ai:review"' package.json; then
        success "AI review script configured"
    else
        warning "AI review script not configured in package.json"
    fi
    
    if grep -q '"qa:ai"' package.json; then
        success "AI quality assurance script configured"
    else
        warning "AI QA script not configured in package.json"
    fi
    
    if grep -q '"verify:ai"' package.json; then
        success "AI verification script configured"
    else
        warning "AI verification script not configured in package.json"
    fi
fi

# Check for AI-friendly project structure
echo -e "\n${BLUE}AI-Friendly Project Structure${NC}"
echo "-----------------------------"

# Check for context files
CONTEXT_FILES=("README.md" "CONTRIBUTING.md" "DEVELOPMENT_SETUP.md" "DEVELOPMENT_ORGANIZATION.md")
for file in "${CONTEXT_FILES[@]}"; do
    if [ -f "$file" ]; then
        success "$file found (good for AI context)"
    else
        warning "$file not found (helpful for AI understanding)"
    fi
done

# Check for component documentation
if [ -d "plugins" ]; then
    PLUGIN_COUNT=$(find plugins -name "*.stories.js" -o -name "*.stories.ts" | wc -l)
    if [ $PLUGIN_COUNT -gt 0 ]; then
        success "Storybook stories found ($PLUGIN_COUNT) - great for AI understanding"
    else
        info "Consider adding Storybook stories for better AI component understanding"
    fi
fi

# Check TypeScript configuration (helps AI understand types)
if [ -f "tsconfig.json" ]; then
    success "TypeScript configuration found (helps AI with type inference)"
else
    warning "TypeScript configuration not found"
fi

# Test AI integration capabilities
echo -e "\n${BLUE}AI Integration Test${NC}"
echo "-------------------"

# Test if we can run AI-related npm scripts
if command -v npm >/dev/null 2>&1; then
    if grep -q '"qa:ai"' package.json; then
        info "AI quality checks available with: npm run qa:ai"
    fi
    
    if grep -q '"ai:review"' package.json; then
        info "AI code review available with: npm run ai:review"
    fi
fi

# Summary and recommendations
echo -e "\n${BLUE}AI Tools Summary${NC}"
echo "=================="

# Calculate completeness score
SCORE=0
TOTAL=10

# Scoring criteria
[ -f ".claude-config.yml" ] && ((SCORE++))
[ -d ".cursor" ] && ((SCORE++))
[ -d ".vscode" ] && ((SCORE++))
[ -f "scripts/ai-code-review.sh" ] && ((SCORE++))
[ -f "scripts/ai-security-scan.sh" ] && ((SCORE++))
grep -q '"qa:ai"' package.json 2>/dev/null && ((SCORE++))
[ -f "README.md" ] && ((SCORE++))
[ -f "DEVELOPMENT_ORGANIZATION.md" ] && ((SCORE++))
[ -f "tsconfig.json" ] && ((SCORE++))
[ $AI_DOC_COUNT -gt 0 ] && ((SCORE++))

PERCENTAGE=$((SCORE * 100 / TOTAL))

if [ $PERCENTAGE -ge 80 ]; then
    echo -e "${GREEN}🎉 Excellent AI integration setup! ($PERCENTAGE% complete)${NC}"
elif [ $PERCENTAGE -ge 60 ]; then
    echo -e "${YELLOW}⚠ Good AI setup with room for improvement ($PERCENTAGE% complete)${NC}"
else
    echo -e "${YELLOW}⚠ Basic AI setup - consider enhancing integration ($PERCENTAGE% complete)${NC}"
fi

echo
echo "Recommendations:"
[ ! -f ".claude-config.yml" ] && echo "  • Create Claude Code configuration: .claude-config.yml"
[ ! -d ".cursor" ] && echo "  • Set up Cursor IDE configuration: .cursor/settings.json"
[ ! -f "scripts/ai-code-review.sh" ] && echo "  • Implement AI quality gate scripts"
[ $AI_DOC_COUNT -eq 0 ] && echo "  • Add AI assistance markers to track contributions"
[ ! -f "tsconfig.json" ] && echo "  • Configure TypeScript for better AI type understanding"

echo
echo "Available AI workflows:"
echo "  • npm run verify:ai      # Run this verification"
echo "  • npm run qa:ai          # AI-assisted quality checks"
echo "  • npm run ai:review      # AI code review"
echo "  • npm run ai:docs        # AI documentation check"

exit 0