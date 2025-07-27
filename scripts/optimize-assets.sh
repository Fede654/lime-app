#!/bin/bash

# Asset Optimization Script - Framework de Iteración Inteligente  
# Optimiza automáticamente imágenes y assets para reducir bundle size

set -e

echo "🖼️  Asset Optimization - LiMe-App"
echo "================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directorios a procesar
ASSETS_DIR="src/assets"
BUILD_ASSETS_DIR="build/assets"
DOCS_ASSETS_DIR="docs/assets"

# Función para optimizar imágenes PNG
optimize_png() {
    local input_dir=$1
    local files_processed=0
    local total_savings=0
    
    echo -e "${BLUE}🔍 Optimizando archivos PNG en $input_dir...${NC}"
    
    if [ ! -d "$input_dir" ]; then
        echo -e "${YELLOW}⚠️  Directorio no encontrado: $input_dir${NC}"
        return 0
    fi
    
    # Buscar archivos PNG
    while IFS= read -r -d '' file; do
        if [ -f "$file" ]; then
            local original_size=$(stat -c%s "$file")
            local backup_file="${file}.backup"
            
            # Crear backup si no existe
            if [ ! -f "$backup_file" ]; then
                cp "$file" "$backup_file"
            fi
            
            # Optimizar con pngquant
            if command -v pngquant >/dev/null 2>&1; then
                pngquant --quality=65-80 --output "$file" --force "$backup_file" 2>/dev/null || true
            fi
            
            # Verificar si se mejoró
            local new_size=$(stat -c%s "$file")
            local savings=$((original_size - new_size))
            
            if [ $savings -gt 0 ]; then
                local percent_saved=$(( (savings * 100) / original_size ))
                echo "  ✅ $(basename "$file"): ${original_size}B → ${new_size}B (-${percent_saved}%)"
                total_savings=$((total_savings + savings))
                files_processed=$((files_processed + 1))
            else
                # Restaurar si no hubo mejora
                cp "$backup_file" "$file"
            fi
        fi
    done < <(find "$input_dir" -name "*.png" -print0 2>/dev/null)
    
    echo -e "${GREEN}📊 PNG: $files_processed archivos optimizados, ${total_savings}B ahorrados${NC}"
    return $total_savings
}

# Función para optimizar imágenes JPEG
optimize_jpeg() {
    local input_dir=$1
    local files_processed=0
    local total_savings=0
    
    echo -e "${BLUE}🔍 Optimizando archivos JPEG en $input_dir...${NC}"
    
    if [ ! -d "$input_dir" ]; then
        echo -e "${YELLOW}⚠️  Directorio no encontrado: $input_dir${NC}"
        return 0
    fi
    
    # Buscar archivos JPEG/JPG
    while IFS= read -r -d '' file; do
        if [ -f "$file" ]; then
            local original_size=$(stat -c%s "$file")
            local backup_file="${file}.backup"
            
            # Crear backup si no existe
            if [ ! -f "$backup_file" ]; then
                cp "$file" "$backup_file"
            fi
            
            # Optimizar con mozjpeg (vía imagemin si está disponible)
            if command -v imagemin >/dev/null 2>&1; then
                imagemin "$backup_file" --out-dir="$(dirname "$file")" --plugin=mozjpeg --plugin.mozjpeg.quality=80 2>/dev/null || true
            fi
            
            # Verificar si se mejoró
            local new_size=$(stat -c%s "$file")
            local savings=$((original_size - new_size))
            
            if [ $savings -gt 0 ]; then
                local percent_saved=$(( (savings * 100) / original_size ))
                echo "  ✅ $(basename "$file"): ${original_size}B → ${new_size}B (-${percent_saved}%)"
                total_savings=$((total_savings + savings))
                files_processed=$((files_processed + 1))
            else
                # Restaurar si no hubo mejora
                cp "$backup_file" "$file"
            fi
        fi
    done < <(find "$input_dir" -name "*.jpg" -o -name "*.jpeg" -print0 2>/dev/null)
    
    echo -e "${GREEN}📊 JPEG: $files_processed archivos optimizados, ${total_savings}B ahorrados${NC}"
    return $total_savings
}

# Función para generar versiones WebP
generate_webp() {
    local input_dir=$1
    local files_processed=0
    local total_savings=0
    
    echo -e "${BLUE}🔍 Generando versiones WebP en $input_dir...${NC}"
    
    if [ ! -d "$input_dir" ]; then
        echo -e "${YELLOW}⚠️  Directorio no encontrado: $input_dir${NC}"
        return 0
    fi
    
    # Procesar PNG y JPEG
    while IFS= read -r -d '' file; do
        if [ -f "$file" ]; then
            local webp_file="${file%.*}.webp"
            
            # Solo generar si WebP no existe o es más antiguo
            if [ ! -f "$webp_file" ] || [ "$file" -nt "$webp_file" ]; then
                if command -v cwebp >/dev/null 2>&1; then
                    cwebp -q 80 "$file" -o "$webp_file" 2>/dev/null || true
                    
                    if [ -f "$webp_file" ]; then
                        local original_size=$(stat -c%s "$file")
                        local webp_size=$(stat -c%s "$webp_file")
                        local savings=$((original_size - webp_size))
                        
                        if [ $savings -gt 0 ]; then
                            local percent_saved=$(( (savings * 100) / original_size ))
                            echo "  ✅ $(basename "$webp_file"): ${original_size}B → ${webp_size}B (-${percent_saved}%)"
                            total_savings=$((total_savings + savings))
                            files_processed=$((files_processed + 1))
                        fi
                    fi
                fi
            fi
        fi
    done < <(find "$input_dir" -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -print0 2>/dev/null)
    
    echo -e "${GREEN}📊 WebP: $files_processed archivos generados, ${total_savings}B ahorrados potenciales${NC}"
}

# Función para optimizar SVG
optimize_svg() {
    local input_dir=$1
    local files_processed=0
    local total_savings=0
    
    echo -e "${BLUE}🔍 Optimizando archivos SVG en $input_dir...${NC}"
    
    if [ ! -d "$input_dir" ]; then
        echo -e "${YELLOW}⚠️  Directorio no encontrado: $input_dir${NC}"
        return 0
    fi
    
    # Buscar archivos SVG
    while IFS= read -r -d '' file; do
        if [ -f "$file" ]; then
            local original_size=$(stat -c%s "$file")
            local backup_file="${file}.backup"
            
            # Crear backup si no existe
            if [ ! -f "$backup_file" ]; then
                cp "$file" "$backup_file"
            fi
            
            # Optimizar con svgo si está disponible
            if command -v svgo >/dev/null 2>&1; then
                svgo "$file" 2>/dev/null || true
            else
                # Optimización básica manual: remover comentarios y espacios extra
                sed -i 's/<!--.*-->//g; s/  */ /g; s/> </></g' "$file" 2>/dev/null || cp "$backup_file" "$file"
            fi
            
            # Verificar si se mejoró
            local new_size=$(stat -c%s "$file")
            local savings=$((original_size - new_size))
            
            if [ $savings -gt 0 ]; then
                local percent_saved=$(( (savings * 100) / original_size ))
                echo "  ✅ $(basename "$file"): ${original_size}B → ${new_size}B (-${percent_saved}%)"
                total_savings=$((total_savings + savings))
                files_processed=$((files_processed + 1))
            else
                # Restaurar si no hubo mejora
                cp "$backup_file" "$file"
            fi
        fi
    done < <(find "$input_dir" -name "*.svg" -print0 2>/dev/null)
    
    echo -e "${GREEN}📊 SVG: $files_processed archivos optimizados, ${total_savings}B ahorrados${NC}"
    return $total_savings
}

# Función para limpiar archivos de backup
cleanup_backups() {
    local cleanup_count=0
    
    echo -e "${BLUE}🧹 Limpiando archivos de backup...${NC}"
    
    for dir in "$ASSETS_DIR" "$BUILD_ASSETS_DIR" "$DOCS_ASSETS_DIR"; do
        if [ -d "$dir" ]; then
            while IFS= read -r -d '' backup_file; do
                rm -f "$backup_file"
                cleanup_count=$((cleanup_count + 1))
            done < <(find "$dir" -name "*.backup" -print0 2>/dev/null)
        fi
    done
    
    echo -e "${GREEN}🗑️  $cleanup_count archivos de backup eliminados${NC}"
}

# Función principal
main() {
    local action=${1:-"optimize"}
    local total_savings=0
    
    case $action in
        "optimize"|"run")
            echo -e "${YELLOW}🚀 Iniciando optimización de assets...${NC}"
            
            # Procesar directorios
            for dir in "$ASSETS_DIR" "$BUILD_ASSETS_DIR" "$DOCS_ASSETS_DIR"; do
                if [ -d "$dir" ]; then
                    echo -e "\n${BLUE}📁 Procesando: $dir${NC}"
                    
                    optimize_png "$dir"
                    png_savings=$?
                    
                    optimize_jpeg "$dir" 
                    jpeg_savings=$?
                    
                    optimize_svg "$dir"
                    svg_savings=$?
                    
                    generate_webp "$dir"
                    
                    total_savings=$((total_savings + png_savings + jpeg_savings + svg_savings))
                fi
            done
            
            echo -e "\n${GREEN}✅ Optimización completada${NC}"
            echo -e "${YELLOW}💾 Total ahorrado: ${total_savings}B ($(( total_savings / 1024 ))KB)${NC}"
            ;;
        "clean"|"cleanup")
            cleanup_backups
            ;;
        "restore")
            echo -e "${BLUE}↩️  Restaurando desde backups...${NC}"
            local restored_count=0
            
            for dir in "$ASSETS_DIR" "$BUILD_ASSETS_DIR" "$DOCS_ASSETS_DIR"; do
                if [ -d "$dir" ]; then
                    while IFS= read -r -d '' backup_file; do
                        original_file="${backup_file%.backup}"
                        if [ -f "$backup_file" ]; then
                            cp "$backup_file" "$original_file"
                            restored_count=$((restored_count + 1))
                        fi
                    done < <(find "$dir" -name "*.backup" -print0 2>/dev/null)
                fi
            done
            
            echo -e "${GREEN}✅ $restored_count archivos restaurados${NC}"
            ;;
        *)
            echo -e "${YELLOW}Uso: $0 [optimize|clean|restore]${NC}"
            echo ""
            echo "Comandos disponibles:"
            echo "  optimize - Optimizar todas las imágenes (por defecto)"
            echo "  clean    - Limpiar archivos de backup"
            echo "  restore  - Restaurar desde backups"
            exit 1
            ;;
    esac
}

main "$@"