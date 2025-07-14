# Testing del Commit fcb8384 en LibreRouter Real

## 📋 Plan de Testing para Hardware Real

**Target**: LibreRouter en `10.13.74.126`  
**Commit bajo evaluación**: `fcb8384` - LazyMap changes + locate mock APIs  
**Objetivo**: Evaluar impacto de performance del cambio LazyMap.tsx

## 🎯 Cambios Críticos a Evaluar

### 1. **LazyMap.tsx Changes**
- **Antes**: Lazy loading de componentes Leaflet
- **Después**: Direct imports de componentes Leaflet
- **Riesgo**: Aumento en bundle size inicial y tiempo de carga

### 2. **locate Mock APIs**
- **Cambio**: Agrega mock data para development
- **Verificación**: Confirmar que NO interfiere con producción

## 🧪 Metodología de Testing

### Fase 1: Preparación del Entorno

```bash
# 1. Crear branch de testing
git checkout -b test/fcb8384-real-hardware

# 2. Cherry-pick del commit a evaluar
git cherry-pick fcb8384

# 3. Build para producción
npm run build:production

# 4. Verificar bundle size
ls -la build/bundle.* | awk '{print $9 " - " $5/1024 " KB"}'
```

### Fase 2: Deployment a LibreRouter Real

```bash
# Deploy a router real con medición de performance
time scp -r ./build/* root@10.13.74.126:/www/app/
```

### Fase 3: Testing Performance Comparativo

#### 3.1 Baseline (Versión Actual v0.2.27)
```bash
# Mediciones antes del cambio
curl -w "@curl-format.txt" -o /dev/null -s "http://10.13.74.126/app"
```

#### 3.2 Testing Post-Change
```bash
# Mediciones después del deploy
curl -w "@curl-format.txt" -o /dev/null -s "http://10.13.74.126/app"
```

### Fase 4: Testing Funcional

#### 4.1 Verificar Locate Plugin
- [ ] Navigate to `/locate` en el router real
- [ ] Verificar que mapa carga correctamente  
- [ ] Confirmar que NO usa mock data en producción
- [ ] Probar set location functionality

#### 4.2 Verificar Componentes LazyMap
- [ ] Navigate a cualquier página con mapas
- [ ] Verificar tiempo de carga de componentes Leaflet
- [ ] Confirmar que no hay errores JavaScript

## 📊 Métricas a Recopilar

### Performance Metrics
- [ ] **Bundle size**: Antes vs después
- [ ] **Time to first byte (TTFB)**
- [ ] **Time to interactive (TTI)**
- [ ] **JavaScript load time**
- [ ] **Memory usage** en LibreRouter

### Functional Metrics  
- [ ] **Locate plugin functionality**: ✅/❌
- [ ] **Map rendering**: ✅/❌
- [ ] **Mock data isolation**: ✅/❌ (should NOT appear in production)
- [ ] **Error rate**: Count JavaScript errors

## 🛠️ Comandos de Testing

### Setup de Testing Environment

```bash
# Crear curl format file para mediciones
cat > curl-format.txt << 'EOF'
     time_namelookup:  %{time_namelookup}s\n
        time_connect:  %{time_connect}s\n
     time_appconnect:  %{time_appconnect}s\n
    time_pretransfer:  %{time_pretransfer}s\n
       time_redirect:  %{time_redirect}s\n
  time_starttransfer:  %{time_starttransfer}s\n
                     ----------\n
          time_total:  %{time_total}s\n
           size_download: %{size_download} bytes\n
EOF
```

### Performance Testing Scripts

```bash
# 1. Baseline measurement (current v0.2.27)
echo "=== BASELINE v0.2.27 ===" > performance_results.txt
for i in {1..5}; do
    curl -w "@curl-format.txt" -o /dev/null -s "http://10.13.74.126/app" >> performance_results.txt
    echo "--- Run $i ---" >> performance_results.txt
done

# 2. Deploy and test fcb8384
npm run build:production
scp -r ./build/* root@10.13.74.126:/www/app/

# 3. Post-change measurement
echo "=== POST fcb8384 ===" >> performance_results.txt
for i in {1..5}; do
    curl -w "@curl-format.txt" -o /dev/null -s "http://10.13.74.126/app" >> performance_results.txt
    echo "--- Run $i ---" >> performance_results.txt
done
```

### Functional Testing

```bash
# Test locate API in production (should NOT use mocks)
curl -X POST http://10.13.74.126/ubus \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"call","params":["00000000000000000000000000000000","lime-location","get",{}]}'

# Verificar que respuesta es real data, no mock
```

## 📋 Criterios de Evaluación

### ✅ PASS Criteria
- Performance degradation < 10%
- Bundle size increase < 20KB
- All locate functionality works in production
- NO mock data appears in production
- NO JavaScript errors

### ❌ FAIL Criteria  
- Performance degradation > 20%
- Bundle size increase > 50KB
- Locate plugin breaks in production
- Mock data leaks to production
- Critical JavaScript errors

## 📝 Formato de Resultados

### Performance Results Template

```
## Performance Testing Results - fcb8384

### Bundle Size
- Before: XXX KB
- After: XXX KB  
- Change: +/- XX KB (XX%)

### Load Time (Average of 5 runs)
- Before: X.XXX seconds
- After: X.XXX seconds
- Change: +/- X.XXX seconds (XX%)

### Functional Testing
- Locate plugin: ✅/❌
- Map rendering: ✅/❌
- Production data: ✅/❌
- Error count: X errors

### Recommendation
- ✅ APPROVE for backporting
- ❌ REJECT - requires optimization
- ⚠️ CONDITIONAL - minor issues
```

## 🚀 Next Steps Based on Results

### If PASS ✅
```bash
# Add to recommended backporting list
echo "fcb8384 - APPROVED after real hardware testing" >> BACKPORTING_GUIDE_v0.2.28.md
```

### If FAIL ❌  
```bash
# Document issues and recommend against backporting
echo "fcb8384 - NOT RECOMMENDED due to performance issues" >> BACKPORTING_GUIDE_v0.2.28.md
```

### If CONDITIONAL ⚠️
```bash
# Document specific concerns and optimization needed
echo "fcb8384 - CONDITIONAL - optimize before backporting" >> BACKPORTING_GUIDE_v0.2.28.md
```

---

*Testing plan para validación real del commit fcb8384 en LibreRouter hardware*