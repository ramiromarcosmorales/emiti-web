# Test Case 13: Auditoría Lighthouse - Post Library

## Información General
- **Fecha de ejecución:** 24/11/2025
- **URL testeada:** https://ramiromarcosmorales.github.io/emiti-web/
- **Rama:** develop (con libreria jsPDF integrada)
- **Cambios implementados:**
- Integracion de la libreria jsPDF

## Resultados Obtenidos

### Performance: 99
- First Contentful Paint: 0.7 s
- Largest Contentful Paint: 0.7 s
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0
- Speed Index: 0.7 s
![Captura Performance](../screenshots/lighthouse-Post-Integración-Librería-performance.png)

### Accessibility: 100
- No se detectaron problemas de accesibilidad   

![Captura Accessibility](../screenshots/lighthouse-Post-Integración-Librería-accssibility.png)

### Best Practices: 96
- Se mantiene el mismo warning menor por resolución del logo `assets/logo.png`.

### SEO: 100
- No se registraron problemas

## Comparación con Baseline
| Métrica | Post -Fetch | Post-Library | Diferencia |
|---------|----------|------------|------------|
| Performance | 99 | 99 | 0 ✅ |
| Accessibility | 100 | 100 | 0 ✅ |
| Best Practices | 96 | 96 | 0 ✅ |
| SEO | 100 | 100 | 0 ✅ |

### Análisis de Impacto
- La integración de **jsPDF** no introduce degradación en las métricas.

- **Recomendaciones:**
- - Mantener la librería actualizada a futuras versiones estables.

## Issues Generadas
- No se generan issues, ya que todas las métricas se mantienen dentro de los umbrales definidos y sin cambios respecto al estado Post-Fetch.

## Conclusiones
La integración de la librería **jsPDF** para la generación de facturas en PDF fue exitosa y no impacta negativamente en la calidad técnica del sitio.  
La aplicación sigue manteniendo métricas sobresalientes en Performance (99), Accessibility (100), Best Practices (96) y SEO (100), incluso después de incorporar la nueva funcionalidad de descarga de comprobantes.