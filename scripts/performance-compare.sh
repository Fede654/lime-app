#!/bin/bash

# Performance Compare Script - Framework de Iteración Inteligente
# Compara métricas actuales vs baseline

set -e

echo "📊 Performance Comparison - LiMe-App"
echo "===================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Verificar que existe baseline
if [ ! -f "metrics/baselines/current_baseline.json" ]; then
    echo -e "${RED}❌ No se encuentra baseline. Ejecuta: npm run performance:baseline${NC}"
    exit 1
fi

# Crear métricas actuales
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
CURRENT_FILE="metrics/baselines/current_${TIMESTAMP}.json"

echo -e "${BLUE}🔄 Generando métricas actuales...${NC}"

# Ejecutar medición actual (reutilizando lógica del baseline)
./scripts/performance-baseline.sh > /dev/null 2>&1

# Leer baseline y actual
BASELINE="metrics/baselines/current_baseline.json"
CURRENT="metrics/baselines/current_baseline.json" # El script baseline actualiza este archivo

# Función para calcular diferencia porcentual
calc_diff() {
    local old=$1
    local new=$2
    if [ "$old" -eq 0 ]; then
        echo "N/A"
    else
        local diff=$(echo "scale=2; (($new - $old) * 100) / $old" | bc -l)
        echo "$diff"
    fi
}

# Función para mostrar cambio con color
show_change() {
    local diff=$1
    local unit=$2
    local reverse=${3:-false} # true si menor es mejor
    
    if [ "$diff" = "N/A" ]; then
        echo -e "${YELLOW}N/A${NC}"
        return
    fi
    
    local abs_diff=$(echo "$diff" | tr -d '-')
    local is_negative=$(echo "$diff" | grep -q '^-' && echo true || echo false)
    
    # Determinar color basado en si menor es mejor
    if [ "$reverse" = "true" ]; then
        if [ "$is_negative" = "true" ]; then
            color=$GREEN
            symbol="↓"
        else
            color=$RED  
            symbol="↑"
        fi
    else
        if [ "$is_negative" = "true" ]; then
            color=$RED
            symbol="↓"
        else
            color=$GREEN
            symbol="↑"
        fi
    fi
    
    echo -e "${color}${symbol} ${diff}%${unit}${NC}"
}

echo -e "\n${PURPLE}📊 COMPARACIÓN DE PERFORMANCE${NC}"
echo "============================================"

# Leer valores del JSON
OLD_TOTAL=$(jq -r '.bundle_sizes.total_kb' "$BASELINE")
OLD_MAIN=$(jq -r '.bundle_sizes.main_js_kb' "$BASELINE")
OLD_VENDORS=$(jq -r '.bundle_sizes.vendors_js_kb' "$BASELINE")
OLD_CSS=$(jq -r '.bundle_sizes.css_kb' "$BASELINE")
OLD_BUILD_TIME=$(jq -r '.build_performance.build_time_seconds' "$BASELINE")
OLD_DEPS=$(jq -r '.dependencies.package_count' "$BASELINE")

NEW_TOTAL=$(jq -r '.bundle_sizes.total_kb' "$CURRENT")
NEW_MAIN=$(jq -r '.bundle_sizes.main_js_kb' "$CURRENT")
NEW_VENDORS=$(jq -r '.bundle_sizes.vendors_js_kb' "$CURRENT")
NEW_CSS=$(jq -r '.bundle_sizes.css_kb' "$CURRENT")
NEW_BUILD_TIME=$(jq -r '.build_performance.build_time_seconds' "$CURRENT")
NEW_DEPS=$(jq -r '.dependencies.package_count' "$CURRENT")

# Calcular diferencias
TOTAL_DIFF=$(calc_diff "$OLD_TOTAL" "$NEW_TOTAL")
MAIN_DIFF=$(calc_diff "$OLD_MAIN" "$NEW_MAIN")
VENDORS_DIFF=$(calc_diff "$OLD_VENDORS" "$NEW_VENDORS")
CSS_DIFF=$(calc_diff "$OLD_CSS" "$NEW_CSS")
BUILD_DIFF=$(calc_diff "$OLD_BUILD_TIME" "$NEW_BUILD_TIME")
DEPS_DIFF=$(calc_diff "$OLD_DEPS" "$NEW_DEPS")

# Mostrar comparación
echo -e "${BLUE}📦 Bundle Sizes${NC}"
echo "  Total:   ${OLD_TOTAL} KB → ${NEW_TOTAL} KB $(show_change "$TOTAL_DIFF" "" true)"
echo "  Main JS: ${OLD_MAIN} KB → ${NEW_MAIN} KB $(show_change "$MAIN_DIFF" "" true)"
echo "  Vendors: ${OLD_VENDORS} KB → ${NEW_VENDORS} KB $(show_change "$VENDORS_DIFF" "" true)"
echo "  CSS:     ${OLD_CSS} KB → ${NEW_CSS} KB $(show_change "$CSS_DIFF" "" true)"

echo -e "\n${BLUE}⚡ Performance${NC}"
echo "  Build Time: ${OLD_BUILD_TIME}s → ${NEW_BUILD_TIME}s $(show_change "$BUILD_DIFF" "" true)"
echo "  Dependencies: ${OLD_DEPS} → ${NEW_DEPS} $(show_change "$DEPS_DIFF" "" true)"

# Evaluación general
echo -e "\n${PURPLE}🎯 EVALUACIÓN GENERAL${NC}"
echo "========================"

SIGNIFICANT_CHANGE=false

# Verificar cambios significativos (>5%)
for diff in "$TOTAL_DIFF" "$MAIN_DIFF" "$VENDORS_DIFF"; do
    if [ "$diff" != "N/A" ]; then
        abs_diff=$(echo "$diff" | tr -d '-')
        if [ "$(echo "$abs_diff > 5" | bc -l)" -eq 1 ]; then
            SIGNIFICANT_CHANGE=true
            break
        fi
    fi
done

if [ "$SIGNIFICANT_CHANGE" = "true" ]; then
    echo -e "${GREEN}✅ Cambios significativos detectados (>5%)${NC}"
    echo -e "${BLUE}💡 Recomendación: Documentar cambios para revisión upstream${NC}"
else
    echo -e "${YELLOW}📊 Cambios menores detectados (<5%)${NC}"
    echo -e "${BLUE}💡 Recomendación: Continuar con más optimizaciones${NC}"
fi

# Guardar reporte de comparación
REPORT_FILE="metrics/baselines/comparison_${TIMESTAMP}.json"
cat > "$REPORT_FILE" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "git_commit": "$(git rev-parse --short HEAD)",
  "comparison": {
    "bundle_total_diff_percent": $TOTAL_DIFF,
    "main_js_diff_percent": $MAIN_DIFF,
    "vendors_diff_percent": $VENDORS_DIFF,
    "css_diff_percent": $CSS_DIFF,
    "build_time_diff_percent": $BUILD_DIFF,
    "dependencies_diff_percent": $DEPS_DIFF
  },
  "significant_change": $SIGNIFICANT_CHANGE,
  "baseline_file": "$BASELINE",
  "current_metrics": $(cat "$CURRENT")
}
EOF

echo -e "\n${GREEN}📊 Reporte guardado en: ${REPORT_FILE}${NC}"