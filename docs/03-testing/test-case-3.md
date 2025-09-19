# Test Case 3: Performance y Velocidad de Carga

## Objetivo
Evaluar el rendimiento de la página en términos de velocidad de carga y métricas Core Web Vitals.

## Herramientas Utilizadas
- Google PageSpeed Insights
- GTmetrix
- Chrome DevTools Lighthouse

## Capturas Requeridas

1. **Google PageSpeed Insights**
   - Captura del puntaje de **Performance**:  
   ![Performance](../screenshots/performance.png)
   - Captura de las métricas **FCP, LCP, CLS, FID**:
   ![Metrics](../screenshots/metrics.png)

2. **GTmetrix**
   - Captura del **GTmetrix Grade**:
   ![Grade](../screenshots/grade.png)
   - Captura de **Performance** y **Structure**:
   ![Grade](../screenshots/performance-gtmetrix.png)
   ![Structure](../screenshots/structure-gtmetrix.png)
   - Captura de **Fully Loaded Time** y **Page Size**:  
   ![Fully-Loaded-Time-And-Page-Size](../screenshots/fully-loaded-time-page-size.png)

3. **Chrome DevTools Lighthouse**
   - Captura del **report completo**.
   - Mostrar claramente las métricas **Core Web Vitals**.
   - Indicar la versión de Chrome usada (opcional).
   ![Lighthouse Report](../screenshots/lighthouse-report.png)

## Métricas Obtenidas

### Google PageSpeed Insights
- **Performance Score:** 100/100
- **First Contentful Paint (FCP):** 0.4s
- **Largest Contentful Paint (LCP):** 0.6s
- **Cumulative Layout Shift (CLS):** 0
- **First Input Delay (FID):** N/A

### GTmetrix Results
- **GTmetrix Grade:** A
- **Performance:** 100%
- **Structure:** 97%
- **Fully Loaded Time:** 434ms
- **Page Size:** 178KB

### Lighthouse Audit
![Lighthouse Report](../screenshots/lighthouse-report.png)

## Optimizaciones Implementadas
Pendiente de aplicar

## Comparativas Antes/Después
| Métrica         | Antes  | Después |
|-----------------|--------|---------|
| Performance     | 100/100| [n] |
| FCP             | 0.4s   | [n] |
| LCP             | 0.6s   | [n] |
| CLS             | 0      | [n] |
| Page Size       | 178KB  | [n] |
| Fully Loaded    | 434ms  | [n] |