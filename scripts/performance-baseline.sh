#!/bin/bash

# Performance Baseline Script - Framework de Iteración Inteligente
# Establece métricas baseline antes de optimizaciones

set -e

echo "🔍 Estableciendo Performance Baseline para LiMe-App"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Crear directorio de métricas si no existe
mkdir -p metrics/baselines
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BASELINE_FILE="metrics/baselines/baseline_${TIMESTAMP}.json"

echo -e "${BLUE}📊 Midiendo Bundle Size Actual${NC}"

# 1. Build production limpio
echo "Construyendo bundle de producción..."
npm run build:production > /dev/null 2>&1

# 2. Métricas de Bundle Size
echo "Calculando tamaños de archivos..."
MAIN_JS=$(find build -name "bundle.*.js" -exec stat -c %s {} \; | head -1)
VENDORS_JS=$(find build -name "vendors.*.js" -exec stat -c %s {} \; | head -1)
CSS_SIZE=$(find build -name "bundle.*.css" -exec stat -c %s {} \; | head -1)
TOTAL_BUILD=$(du -sb build/ | cut -f1)

# Convertir a KB
MAIN_KB=$((MAIN_JS / 1024))
VENDORS_KB=$((VENDORS_JS / 1024))
CSS_KB=$((CSS_SIZE / 1024))
TOTAL_KB=$((TOTAL_BUILD / 1024))

echo -e "${GREEN}Bundle Sizes:${NC}"
echo "  Main JS: ${MAIN_KB} KB"
echo "  Vendors: ${VENDORS_KB} KB" 
echo "  CSS: ${CSS_KB} KB"
echo "  Total: ${TOTAL_KB} KB"

# 3. Métricas de Dependencias
echo -e "\n${BLUE}📦 Analizando Dependencias${NC}"
NODE_MODULES_SIZE=$(du -sb node_modules/ 2>/dev/null | cut -f1 || echo "0")
NODE_MODULES_MB=$((NODE_MODULES_SIZE / 1024 / 1024))
DEPS_COUNT=$(npm ls --depth=0 2>/dev/null | grep -c "├\|└" || echo "0")

echo "  node_modules: ${NODE_MODULES_MB} MB"
echo "  Dependencies: ${DEPS_COUNT} packages"

# 4. Métricas de Testing
echo -e "\n${BLUE}🧪 Métricas de Testing${NC}"
TEST_OUTPUT=$(npm test 2>&1 | grep -E "Tests:|passed|failed|Test Suites" || echo "No test output")
echo "$TEST_OUTPUT"

# 5. Build Time
echo -e "\n${BLUE}⏱️  Midiendo Build Time${NC}"
BUILD_START=$(date +%s.%N)
npm run build:production > /dev/null 2>&1
BUILD_END=$(date +%s.%N)
BUILD_TIME=$(echo "$BUILD_END - $BUILD_START" | bc -l | xargs printf "%.2f")

echo "  Build time: ${BUILD_TIME}s"

# 6. Crear reporte JSON
cat > "$BASELINE_FILE" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "git_commit": "$(git rev-parse --short HEAD)",
  "git_branch": "$(git branch --show-current)",
  "bundle_sizes": {
    "main_js_kb": $MAIN_KB,
    "vendors_js_kb": $VENDORS_KB,
    "css_kb": $CSS_KB,
    "total_kb": $TOTAL_KB,
    "total_bytes": $TOTAL_BUILD
  },
  "dependencies": {
    "node_modules_mb": $NODE_MODULES_MB,
    "package_count": $DEPS_COUNT
  },
  "build_performance": {
    "build_time_seconds": $BUILD_TIME
  },
  "testing": {
    "output": $(echo "$TEST_OUTPUT" | jq -Rs .)
  }
}
EOF

echo -e "\n${GREEN}✅ Baseline guardado en: ${BASELINE_FILE}${NC}"

# 7. Mostrar resumen
echo -e "\n${YELLOW}📋 RESUMEN BASELINE${NC}"
echo "================================"
echo "🎯 Bundle Total: ${TOTAL_KB} KB"
echo "⚡ Build Time: ${BUILD_TIME}s"
echo "📦 Dependencies: ${DEPS_COUNT} packages"
echo "💾 node_modules: ${NODE_MODULES_MB} MB"

# 8. Guardar baseline como "current" para comparaciones
cp "$BASELINE_FILE" "metrics/baselines/current_baseline.json"

echo -e "\n${BLUE}💡 Próximo paso: npm run performance:compare después de optimizaciones${NC}"