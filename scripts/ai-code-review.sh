#!/bin/bash

# AI-Assisted Code Review Script
# Performs code analysis and suggests improvements with AI context

set -e

echo "🔍 AI-Assisted Code Review"
echo "=========================="

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

suggestion() {
    echo -e "${BLUE}💡${NC} $1"
}

# Configuration
REVIEW_FILES=()
CHANGED_FILES=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --files)
            shift
            REVIEW_FILES=("$@")
            break
            ;;
        --changed)
            CHANGED_FILES="true"
            shift
            ;;
        *)
            echo "Usage: $0 [--files file1 file2 ...] [--changed]"
            echo "  --files: Review specific files"
            echo "  --changed: Review only changed files (git)"
            exit 1
            ;;
    esac
done

# Determine files to review
if [ "$CHANGED_FILES" = "true" ]; then
    if [ -d ".git" ]; then
        mapfile -t REVIEW_FILES < <(git diff --name-only --diff-filter=AM | grep -E '\.(js|ts|jsx|tsx)$')
        if [ ${#REVIEW_FILES[@]} -eq 0 ]; then
            mapfile -t REVIEW_FILES < <(git diff --cached --name-only --diff-filter=AM | grep -E '\.(js|ts|jsx|tsx)$')
        fi
    fi
fi

# Default to reviewing all source files if none specified
if [ ${#REVIEW_FILES[@]} -eq 0 ]; then
    mapfile -t REVIEW_FILES < <(find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | head -20)
fi

echo "Reviewing ${#REVIEW_FILES[@]} files..."

# Code complexity analysis
echo -e "\n${BLUE}Code Complexity Analysis${NC}"
echo "------------------------"

HIGH_COMPLEXITY_FILES=()
for file in "${REVIEW_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Count lines, functions, and nested blocks
        LINES=$(wc -l < "$file")
        FUNCTIONS=$(grep -c "function\|=>\|class " "$file" 2>/dev/null || echo "0")
        NESTED_BLOCKS=$(grep -c "if.*{.*if\|for.*{.*for\|while.*{.*while" "$file" 2>/dev/null || echo "0")
        
        # Simple complexity score
        COMPLEXITY=$((LINES / 10 + FUNCTIONS * 2 + NESTED_BLOCKS * 3))
        
        if [ $COMPLEXITY -gt 50 ]; then
            HIGH_COMPLEXITY_FILES+=("$file")
            warning "High complexity in $file (score: $COMPLEXITY)"
            suggestion "Consider breaking down this file with AI assistance"
        elif [ $COMPLEXITY -gt 20 ]; then
            info "Moderate complexity in $file (score: $COMPLEXITY)"
        fi
    fi
done

if [ ${#HIGH_COMPLEXITY_FILES[@]} -eq 0 ]; then
    success "No high-complexity files found"
fi

# Code duplication detection
echo -e "\n${BLUE}Code Duplication Analysis${NC}"
echo "-------------------------"

DUPLICATE_PATTERNS=()
for file in "${REVIEW_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Look for repeated patterns (simple heuristic)
        REPEATED_LINES=$(sort "$file" | uniq -d | wc -l)
        if [ $REPEATED_LINES -gt 5 ]; then
            warning "Potential duplication in $file ($REPEATED_LINES repeated lines)"
            suggestion "Consider extracting common patterns into reusable functions"
            DUPLICATE_PATTERNS+=("$file")
        fi
    fi
done

if [ ${#DUPLICATE_PATTERNS[@]} -eq 0 ]; then
    success "No significant code duplication detected"
fi

# AI-assistance opportunities
echo -e "\n${BLUE}AI-Assistance Opportunities${NC}"
echo "----------------------------"

AI_OPPORTUNITIES=0

for file in "${REVIEW_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Check for TODO/FIXME comments
        TODOS=$(grep -c "TODO\|FIXME\|XXX" "$file" 2>/dev/null || echo "0")
        if [ $TODOS -gt 0 ]; then
            info "$TODOS TODO/FIXME items in $file"
            suggestion "Use AI assistance to address these items"
            ((AI_OPPORTUNITIES++))
        fi
        
        # Check for long functions
        LONG_FUNCTIONS=$(awk '/function|=>.*{/{func=1; lines=0} func && /{/{depth++} func && /}/{depth--; if(depth==0 && lines>30) print "Line " NR-lines "-" NR ": Long function"; if(depth==0) func=0} func{lines++}' "$file" | wc -l)
        if [ $LONG_FUNCTIONS -gt 0 ]; then
            warning "$LONG_FUNCTIONS long functions in $file"
            suggestion "Consider AI assistance to refactor long functions"
            ((AI_OPPORTUNITIES++))
        fi
        
        # Check for missing documentation
        FUNCTIONS=$(grep -c "function\|const.*=.*=>" "$file" 2>/dev/null || echo "0")
        DOCUMENTED=$(grep -B1 "function\|const.*=.*=>" "$file" 2>/dev/null | grep -c "/\*\*\|//" || echo "0")
        
        if [ $FUNCTIONS -gt 0 ] && [ $DOCUMENTED -lt $((FUNCTIONS / 2)) ]; then
            warning "Limited documentation in $file ($DOCUMENTED/$FUNCTIONS functions documented)"
            suggestion "Use AI to generate JSDoc comments"
            ((AI_OPPORTUNITIES++))
        fi
    fi
done

if [ $AI_OPPORTUNITIES -eq 0 ]; then
    success "Code is well-structured with minimal AI assistance opportunities"
else
    info "$AI_OPPORTUNITIES AI assistance opportunities identified"
fi

# Security review
echo -e "\n${BLUE}Security Review${NC}"
echo "---------------"

SECURITY_ISSUES=0

for file in "${REVIEW_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Check for potential security issues
        SECURITY_PATTERNS=("eval(" "innerHTML" "dangerouslySetInnerHTML" "document.write" "localStorage" "sessionStorage")
        
        for pattern in "${SECURITY_PATTERNS[@]}"; do
            if grep -q "$pattern" "$file"; then
                warning "Security pattern '$pattern' found in $file"
                suggestion "Review for XSS/injection vulnerabilities"
                ((SECURITY_ISSUES++))
            fi
        done
        
        # Check for hardcoded secrets (basic patterns)
        SECRET_PATTERNS=("password.*=" "secret.*=" "key.*=" "token.*=")
        for pattern in "${SECRET_PATTERNS[@]}"; do
            if grep -i "$pattern" "$file" | grep -v "example\|test\|spec"; then
                error "Potential hardcoded secret in $file"
                suggestion "Move secrets to environment variables"
                ((SECURITY_ISSUES++))
            fi
        done
    fi
done

if [ $SECURITY_ISSUES -eq 0 ]; then
    success "No obvious security issues found"
else
    warning "$SECURITY_ISSUES potential security issues identified"
fi

# Type safety review (for TypeScript files)
echo -e "\n${BLUE}Type Safety Review${NC}"
echo "------------------"

TS_FILES=($(printf '%s\n' "${REVIEW_FILES[@]}" | grep -E '\.(ts|tsx)$'))

if [ ${#TS_FILES[@]} -gt 0 ]; then
    ANY_USAGE=0
    WEAK_TYPING=0
    
    for file in "${TS_FILES[@]}"; do
        # Check for 'any' type usage
        ANY_COUNT=$(grep -c ": any\|<any>" "$file" 2>/dev/null || echo "0")
        if [ $ANY_COUNT -gt 0 ]; then
            warning "$ANY_COUNT 'any' type usages in $file"
            suggestion "Consider more specific types"
            ((ANY_USAGE++))
        fi
        
        # Check for weak typing patterns
        if grep -q "// @ts-ignore\|// @ts-nocheck" "$file"; then
            warning "TypeScript suppression comments in $file"
            suggestion "Address type issues instead of suppressing"
            ((WEAK_TYPING++))
        fi
    done
    
    if [ $ANY_USAGE -eq 0 ] && [ $WEAK_TYPING -eq 0 ]; then
        success "Strong type safety in TypeScript files"
    fi
else
    info "No TypeScript files to review for type safety"
fi

# Performance review
echo -e "\n${BLUE}Performance Review${NC}"
echo "------------------"

PERFORMANCE_ISSUES=0

for file in "${REVIEW_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Check for potential performance issues
        PERF_PATTERNS=("console.log" "debugger" "alert(" "confirm(")
        
        for pattern in "${PERF_PATTERNS[@]}"; do
            if grep -q "$pattern" "$file"; then
                warning "Debug code found in $file: $pattern"
                suggestion "Remove debug code before production"
                ((PERFORMANCE_ISSUES++))
            fi
        done
        
        # Check for React-specific performance patterns
        if [[ "$file" == *.jsx ]] || [[ "$file" == *.tsx ]]; then
            if grep -q "useEffect.*\[\]" "$file"; then
                info "Empty dependency arrays found in $file"
                suggestion "Verify useEffect dependencies are correct"
            fi
            
            if grep -q "inline.*function\|onClick={() =>" "$file"; then
                warning "Inline function props in $file"
                suggestion "Consider useCallback for performance"
                ((PERFORMANCE_ISSUES++))
            fi
        fi
    fi
done

if [ $PERFORMANCE_ISSUES -eq 0 ]; then
    success "No obvious performance issues found"
fi

# Testing coverage review
echo -e "\n${BLUE}Testing Coverage Review${NC}"
echo "-----------------------"

TEST_COVERAGE_ISSUES=0

for file in "${REVIEW_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Check if corresponding test file exists
        BASE_NAME=$(basename "$file" | sed 's/\.[^.]*$//')
        DIR_NAME=$(dirname "$file")
        
        TEST_PATTERNS=("$DIR_NAME/$BASE_NAME.test.*" "$DIR_NAME/$BASE_NAME.spec.*" "**/*$BASE_NAME*.test.*" "**/*$BASE_NAME*.spec.*")
        
        TEST_EXISTS=false
        for pattern in "${TEST_PATTERNS[@]}"; do
            if find . -path "*$pattern" 2>/dev/null | grep -q .; then
                TEST_EXISTS=true
                break
            fi
        done
        
        if [ "$TEST_EXISTS" = false ]; then
            warning "No test file found for $file"
            suggestion "Consider AI assistance to generate tests"
            ((TEST_COVERAGE_ISSUES++))
        fi
    fi
done

if [ $TEST_COVERAGE_ISSUES -eq 0 ]; then
    success "Test files exist for all reviewed components"
fi

# AI-specific recommendations
echo -e "\n${BLUE}AI Development Recommendations${NC}"
echo "-------------------------------"

# Check for AI-friendly patterns
AI_FRIENDLY_SCORE=0
TOTAL_AI_CHECKS=5

# Check for clear function names
CLEAR_FUNCTIONS=0
for file in "${REVIEW_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Count descriptive function names (simple heuristic)
        DESCRIPTIVE=$(grep -c "function [a-z][a-zA-Z]*[A-Z]\|const [a-z][a-zA-Z]*[A-Z].*=" "$file" 2>/dev/null || echo "0")
        TOTAL_FUNCS=$(grep -c "function\|const.*=.*=>" "$file" 2>/dev/null || echo "1")
        if [ $DESCRIPTIVE -gt $((TOTAL_FUNCS / 2)) ]; then
            ((CLEAR_FUNCTIONS++))
        fi
    fi
done

if [ $CLEAR_FUNCTIONS -gt $((${#REVIEW_FILES[@]} / 2)) ]; then
    success "Good function naming for AI understanding"
    ((AI_FRIENDLY_SCORE++))
fi

# Check for type definitions
if [ ${#TS_FILES[@]} -gt $((${#REVIEW_FILES[@]} / 2)) ]; then
    success "Good TypeScript adoption for AI assistance"
    ((AI_FRIENDLY_SCORE++))
fi

# Check for component documentation
DOCUMENTED_COMPONENTS=0
for file in "${REVIEW_FILES[@]}"; do
    if [[ "$file" == *.jsx ]] || [[ "$file" == *.tsx ]]; then
        if grep -q "/\*\*\|PropTypes\|interface.*Props" "$file"; then
            ((DOCUMENTED_COMPONENTS++))
        fi
    fi
done

JSX_FILES=($(printf '%s\n' "${REVIEW_FILES[@]}" | grep -E '\.(jsx|tsx)$'))
if [ ${#JSX_FILES[@]} -gt 0 ] && [ $DOCUMENTED_COMPONENTS -gt $((${#JSX_FILES[@]} / 2)) ]; then
    success "Good component documentation for AI"
    ((AI_FRIENDLY_SCORE++))
fi

# Summary
echo -e "\n${BLUE}Review Summary${NC}"
echo "=============="

TOTAL_ISSUES=$((${#HIGH_COMPLEXITY_FILES[@]} + ${#DUPLICATE_PATTERNS[@]} + SECURITY_ISSUES + PERFORMANCE_ISSUES + TEST_COVERAGE_ISSUES))

if [ $TOTAL_ISSUES -eq 0 ]; then
    echo -e "${GREEN}🎉 Excellent code quality! No issues found.${NC}"
    echo -e "${GREEN}AI-Friendly Score: $AI_FRIENDLY_SCORE/$TOTAL_AI_CHECKS${NC}"
elif [ $TOTAL_ISSUES -lt 5 ]; then
    echo -e "${YELLOW}⚠ Good code quality with minor improvements available.${NC}"
    echo -e "${YELLOW}Total issues: $TOTAL_ISSUES${NC}"
    echo -e "${YELLOW}AI-Friendly Score: $AI_FRIENDLY_SCORE/$TOTAL_AI_CHECKS${NC}"
else
    echo -e "${RED}❌ Code quality needs attention.${NC}"
    echo -e "${RED}Total issues: $TOTAL_ISSUES${NC}"
    echo -e "${YELLOW}AI-Friendly Score: $AI_FRIENDLY_SCORE/$TOTAL_AI_CHECKS${NC}"
fi

echo
echo "Next steps:"
[ ${#HIGH_COMPLEXITY_FILES[@]} -gt 0 ] && echo "  • Refactor complex files with AI assistance"
[ $SECURITY_ISSUES -gt 0 ] && echo "  • Run security scan: npm run ai:security"
[ $TEST_COVERAGE_ISSUES -gt 0 ] && echo "  • Generate tests with AI: npm run ai:test"
[ $AI_OPPORTUNITIES -gt 0 ] && echo "  • Address TODO items with AI assistance"

echo
echo "AI assistance commands:"
echo "  • npm run ai:security     # Security-focused review"
echo "  • npm run ai:test         # Test generation assistance"
echo "  • npm run ai:docs         # Documentation assistance"
echo "  • npm run qa:ai           # Full AI quality check"

if [ $TOTAL_ISSUES -gt 10 ]; then
    exit 1
else
    exit 0
fi