#!/bin/bash

# AI-Assisted Quality Check Script
# Performs comprehensive quality analysis with AI assistance markers

set -e

echo "🤖 AI-Assisted Quality Check"
echo "============================"

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

# Track issues
ISSUES=0
WARNINGS=0

# Check AI assistance documentation
echo -e "\n${BLUE}AI Assistance Documentation${NC}"
echo "---------------------------"

# Check for AI markers in code
AI_MARKERS=$(find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" -o -name "*.md" | \
    xargs grep -l "🤖 AI-assisted\|AI-generated\|Claude Code\|Cursor\|GitHub Copilot" 2>/dev/null | wc -l)

if [ $AI_MARKERS -gt 0 ]; then
    success "AI assistance markers found in $AI_MARKERS files"
    info "Good practice for tracking AI contributions"
else
    warning "No AI assistance markers found"
    info "Consider adding markers like '🤖 AI-assisted with: [tool] for [task]'"
    ((WARNINGS++))
fi

# Check commit messages for AI attribution
if [ -d ".git" ]; then
    AI_COMMITS=$(git log --oneline --grep="🤖 AI-assisted" --since="1 month ago" 2>/dev/null | wc -l)
    if [ $AI_COMMITS -gt 0 ]; then
        success "AI-assisted commits found in history ($AI_COMMITS recent)"
    else
        info "No AI-assisted commit markers found"
        info "Consider using format: '🤖 AI-assisted with: [tool] for [task]'"
    fi
fi

# Check for AI test patterns
echo -e "\n${BLUE}AI Test Quality${NC}"
echo "---------------"

# Find AI-generated test files
AI_TEST_FILES=$(find . -name "*.ai.spec.*" -o -name "*.ai.test.*" | wc -l)
if [ $AI_TEST_FILES -gt 0 ]; then
    success "AI-generated test files found ($AI_TEST_FILES files)"
    
    # Run AI-specific tests
    if npm run test:ai-generated >/dev/null 2>&1; then
        success "AI-generated tests pass"
    else
        error "AI-generated tests failing"
        ((ISSUES++))
    fi
else
    info "No dedicated AI-generated test files found"
fi

# Check for test comments indicating AI assistance
AI_TEST_COMMENTS=$(find . -name "*.spec.*" -o -name "*.test.*" | \
    xargs grep -l "AI-generated\|🤖" 2>/dev/null | wc -l)

if [ $AI_TEST_COMMENTS -gt 0 ]; then
    success "AI assistance markers found in $AI_TEST_COMMENTS test files"
else
    info "Consider marking AI-generated test sections"
fi

# Code quality checks with AI context
echo -e "\n${BLUE}Code Quality Analysis${NC}"
echo "---------------------"

# Check for complex functions that might benefit from AI assistance
COMPLEX_FUNCTIONS=$(find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | \
    xargs grep -c "function\|=>" 2>/dev/null | \
    awk -F: '$2 > 10 {print $1}' | wc -l)

if [ $COMPLEX_FUNCTIONS -gt 0 ]; then
    warning "$COMPLEX_FUNCTIONS files have many functions (>10 each)"
    info "Consider AI assistance for refactoring complex files"
    ((WARNINGS++))
fi

# Check for TODO comments that could use AI help
TODO_COUNT=$(find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | \
    xargs grep -c "TODO\|FIXME\|XXX" 2>/dev/null | \
    awk -F: '{sum += $2} END {print sum}')

if [ -n "$TODO_COUNT" ] && [ $TODO_COUNT -gt 0 ]; then
    info "$TODO_COUNT TODO/FIXME comments found"
    info "Consider using AI assistance to address these items"
fi

# Documentation quality with AI
echo -e "\n${BLUE}Documentation Quality${NC}"
echo "---------------------"

# Check for README sections
if [ -f "README.md" ]; then
    success "README.md found"
    
    # Check for essential sections
    SECTIONS=("Installation" "Development" "Testing" "Contributing")
    for section in "${SECTIONS[@]}"; do
        if grep -qi "$section" README.md; then
            success "$section section found in README"
        else
            warning "$section section missing from README"
            info "Consider AI assistance to generate documentation"
            ((WARNINGS++))
        fi
    done
else
    error "README.md not found"
    ((ISSUES++))
fi

# Check for inline documentation
DOCUMENTED_FUNCTIONS=$(find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | \
    xargs grep -B1 "function\|const.*=.*=>" 2>/dev/null | \
    grep -c "/\*\*\|//" || echo "0")

TOTAL_FUNCTIONS=$(find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | \
    xargs grep -c "function\|const.*=.*=>" 2>/dev/null | \
    awk -F: '{sum += $2} END {print sum}')

if [ -n "$TOTAL_FUNCTIONS" ] && [ $TOTAL_FUNCTIONS -gt 0 ]; then
    DOC_PERCENTAGE=$((DOCUMENTED_FUNCTIONS * 100 / TOTAL_FUNCTIONS))
    if [ $DOC_PERCENTAGE -ge 50 ]; then
        success "Functions documented: $DOC_PERCENTAGE% ($DOCUMENTED_FUNCTIONS/$TOTAL_FUNCTIONS)"
    else
        warning "Functions documented: $DOC_PERCENTAGE% ($DOCUMENTED_FUNCTIONS/$TOTAL_FUNCTIONS)"
        info "Consider AI assistance to improve documentation coverage"
        ((WARNINGS++))
    fi
fi

# Security considerations
echo -e "\n${BLUE}Security Analysis${NC}"
echo "-----------------"

# Check for common security patterns
SECURITY_PATTERNS=("password" "secret" "key" "token" "auth")
SECURITY_ISSUES=0

for pattern in "${SECURITY_PATTERNS[@]}"; do
    FOUND=$(find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | \
        xargs grep -i "$pattern" 2>/dev/null | \
        grep -v "example\|test\|spec\|mock" | wc -l)
    
    if [ $FOUND -gt 0 ]; then
        warning "Found $FOUND references to '$pattern' - review for security"
        ((SECURITY_ISSUES++))
    fi
done

if [ $SECURITY_ISSUES -eq 0 ]; then
    success "No obvious security patterns found in code"
else
    warning "$SECURITY_ISSUES potential security patterns found"
    info "Consider AI security review with: npm run ai:security"
    ((WARNINGS++))
fi

# Type safety check
echo -e "\n${BLUE}Type Safety${NC}"
echo "-----------"

if [ -f "tsconfig.json" ]; then
    success "TypeScript configuration found"
    
    # Check TypeScript strict mode
    if grep -q '"strict".*true' tsconfig.json; then
        success "TypeScript strict mode enabled"
    else
        warning "TypeScript strict mode not enabled"
        info "Enable for better type safety"
        ((WARNINGS++))
    fi
    
    # Run TypeScript check
    if npm run lint >/dev/null 2>&1; then
        success "TypeScript compilation successful"
    else
        error "TypeScript compilation errors found"
        ((ISSUES++))
    fi
else
    warning "TypeScript not configured"
    info "Consider adding TypeScript for better AI assistance"
    ((WARNINGS++))
fi

# AI-specific recommendations
echo -e "\n${BLUE}AI Development Recommendations${NC}"
echo "-------------------------------"

# Check for Storybook (helps AI understand components)
if [ -f ".storybook/main.js" ] || [ -f ".storybook/main.ts" ]; then
    success "Storybook configured - excellent for AI component understanding"
    
    STORY_COUNT=$(find . -name "*.stories.*" | wc -l)
    if [ $STORY_COUNT -gt 0 ]; then
        success "$STORY_COUNT component stories found"
    else
        info "Consider adding component stories for AI context"
    fi
else
    info "Storybook not configured - useful for AI component development"
fi

# Check for comprehensive tests (helps AI understand requirements)
if [ -f "jest.config.js" ] || grep -q '"jest"' package.json; then
    success "Jest testing framework configured"
    
    # Run tests to check AI-generated code quality
    if npm test >/dev/null 2>&1; then
        success "All tests pass - AI-generated code is working"
    else
        warning "Some tests failing - may affect AI-generated code"
        ((WARNINGS++))
    fi
else
    warning "Testing framework not configured"
    info "Testing helps AI understand code requirements"
    ((WARNINGS++))
fi

# Performance recommendations for AI tools
echo -e "\n${BLUE}AI Tool Performance${NC}"
echo "-------------------"

# Check project size (affects AI context window)
PROJECT_SIZE=$(find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | wc -l)
if [ $PROJECT_SIZE -lt 100 ]; then
    success "Project size manageable for AI tools ($PROJECT_SIZE files)"
elif [ $PROJECT_SIZE -lt 500 ]; then
    info "Medium project size for AI tools ($PROJECT_SIZE files)"
    info "Consider using focused context for AI assistance"
else
    warning "Large project size ($PROJECT_SIZE files)"
    info "Break down AI tasks into smaller chunks"
    ((WARNINGS++))
fi

# Check for .gitignore (keeps AI context clean)
if [ -f ".gitignore" ]; then
    success ".gitignore configured to keep AI context clean"
else
    warning ".gitignore missing - may clutter AI context"
    ((WARNINGS++))
fi

# Summary and scoring
echo -e "\n${BLUE}AI Quality Summary${NC}"
echo "=================="

# Calculate quality score
TOTAL_CHECKS=10
PASSED_CHECKS=$((TOTAL_CHECKS - ISSUES - WARNINGS))
SCORE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

if [ $ISSUES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Excellent AI-assisted development quality! (100% score)${NC}"
elif [ $ISSUES -eq 0 ]; then
    echo -e "${YELLOW}⚠ Good quality with $WARNINGS improvements available (Score: $SCORE%)${NC}"
else
    echo -e "${RED}❌ Quality issues found: $ISSUES errors, $WARNINGS warnings (Score: $SCORE%)${NC}"
fi

echo
echo "Improvement recommendations:"
[ $WARNINGS -gt 0 ] && echo "  • Address $WARNINGS warnings for better AI assistance"
[ $AI_MARKERS -eq 0 ] && echo "  • Add AI assistance markers to track contributions"
[ ! -f "tsconfig.json" ] && echo "  • Configure TypeScript for better AI type understanding"
[ $STORY_COUNT -eq 0 ] && echo "  • Add Storybook stories for AI component understanding"

echo
echo "AI-assisted development commands:"
echo "  • npm run ai:review      # AI code review"
echo "  • npm run ai:security    # AI security scan"
echo "  • npm run ai:docs        # AI documentation check"
echo "  • npm run verify:ai      # AI tools verification"

if [ $ISSUES -gt 0 ]; then
    exit 1
else
    exit 0
fi