# Test Case 13: Auditoría Lighthouse - Post Library

## Información General
- **Fecha de ejecución:** 24/11/2025
- **URL testeada:** https://ramiromarcosmorales.github.io/emiti-web/
- **Rama:** develop (con libreria jsPDF integrada)
- **Cambios implementados:**
- Integracion de la libreria jsPDF
- Integración de la librería email.js

## Resultados Obtenidos

### Versión Escritorio – Página `index.html`

### Performance: 99
- First Contentful Paint: 0.7 s
- Largest Contentful Paint: 0.8 s
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0
- Speed Index: 0.7 s
![Captura Performance](../screenshots/lighthouse-Post-Integración-Librería-performance.png)

### Accessibility: 100
- No se detectaron problemas de accesibilidad   

![Captura Accessibility](../screenshots/lighthouse-Post-Integración-Librería-accssibility.png)

### Best Practices: 100
- No se detectaron problemas 

### SEO: 100
- No se registraron problemas

### Versión Mobile – Página `index.html`

### Performance: 87
- First Contentful Paint: 2.9 s
- Largest Contentful Paint: 3.2 s
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0
- Speed Index: 2.9 s  

![Captura Performance – Mobile](../screenshots/lighthouse-Post-Integración-Librería-performance-mobile.png)

### Accessibility: 100
- No se detectaron problemas

![Captura Accessibility – Mobile](../screenshots/lighthouse-Post-Integración-Librería-accesibility-mobile.png)

### Best Practices: 100
- No se detectaron problemas

### SEO: 100
- No se detectaron problemas

### Versión Escritorio – Página `nueva-factura.html`

### Performance: 99
- First Contentful Paint: 0.6 s
- Largest Contentful Paint: 0.7 s
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0.046
- Speed Index: 0.6 s
![Captura Performance](../screenshots/lighthouse-Post-Integración-Librería-performance-nf.png)

### Accessibility: 92
- Los botones no tienen nombres accesibles
- Los elementos de encabezado no aparecen en orden secuencial descendente   

![Captura Accessibility](../screenshots/lighthouse-Post-Integración-Librería-accesibility-nf.png)

### Best Practices: 100
- No se detectaron problemas 

### SEO: 100
- No se registraron problemas

### Versión Mobile – Página `nueva-factura.html`

### Performance: 92
- First Contentful Paint: 2.5 s
- Largest Contentful Paint: 2.8 s
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0.023
- Speed Index: 2.5 s  

![Captura Performance – Mobile](../screenshots/lighthouse-Post-Integración-Librería-performance-mobile-nf.png)

### Accessibility: 92
- Los botones no tienen nombres accesibles
- Los elementos de encabezado no aparecen en orden secuencial descendente   

![Captura Accessibility – Mobile](../screenshots/lighthouse-Post-Integración-Librería-accessibility-mobile-nf.png)

### Best Practices: 100
- No se detectaron problemas

### SEO: 100
- No se detectaron problemas

### Versión Escritorio – Página `facturas.html`

### Performance: 100
- First Contentful Paint: o.6 s
- Largest Contentful Paint: 0.7 s
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0.001
- Speed Index: 0.6 s  

![Captura Performance – Mobile](../screenshots/lighthouse-Post-Integración-Librería-performance-f.png)

### Accessibility: 100
- No se registraron problemas

![Captura Accessibility – Mobile](../screenshots/lighthouse-Post-Integración-Librería-accessibility-f.png)

### Best Practices: 100
- No se detectaron problemas 

### SEO: 100
- No se registraron problemas

### Versión Mobile – Página `facturas.html`

### Performance: 90
- First Contentful Paint: 2.6 s
- Largest Contentful Paint: 2.8 s
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0
- Speed Index: 4.1 s  

![Captura Performance – Mobile](../screenshots/lighthouse-Post-Integración-Librería-performance-mobile-f.png)

### Accessibility: 100
- No se registraron problemas

![Captura Accessibility – Mobile](../screenshots/lighthouse-Post-Integración-Librería-accessibility-mobile-f.png)

### Best Practices: 96
- Se detectó un problema de legibilidad: parte del texto utiliza tamaños de fuente menores a 12px (clase `.small` y etiqueta `<small>` provenientes de Bootstrap).

### SEO: 100
- No se detectaron problemas

### Versión Escritorio – Página `configuracion.html`

### Performance: 99
- First Contentful Paint: o.6 s
- Largest Contentful Paint: 0.9 s
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0.012
- Speed Index: 0.6 s  

![Captura Performance – Mobile](../screenshots/lighthouse-Post-Integración-Librería-performance-c.png)

### Accessibility: 96
- Los colores de fondo y de primer plano no tienen una relacion de contraste adecuado

![Captura Accessibility – Mobile](../screenshots/lighthouse-Post-Integración-Librería-accessibility-c.png)

### Best Practices: 100
- No se detectaron problemas 

### SEO: 100
- No se registraron problemas

### Versión Mobile – Página `configuracion.html`

### Performance: 95
- First Contentful Paint: 2.0 s
- Largest Contentful Paint: 2.7 s
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0.011
- Speed Index: 2.0 s  

![Captura Performance – Mobile](../screenshots/lighthouse-Post-Integración-Librería-performance-mobile-c.png)

### Accessibility: 96
- Los colores de fondo y de primer plano no tienen una relacion de contraste adecuado

![Captura Accessibility – Mobile](../screenshots/lighthouse-Post-Integración-Librería-accessibility-mobile-c.png)

### Best Practices: 100
- No se detectaron problemas

### SEO: 100
- No se detectaron problemas


### Análisis de Impacto
- La integración de jsPDF no afecta de forma significativa el rendimiento en escritorio, donde todas las páginas mantienen valores entre 98 y 100.
- En mobile, la inclusión de jspdf.umd.min.js aumenta ligeramente los tiempos de descarga, reduciendo la Performance entre 87 y 95, lo cual es esperable debido al peso de la librería.
- Se detectó un único impacto en Best Practices (Mobile) en la página facturas.html, debido a tamaños de fuente menores a 12px provenientes de Bootstrap.
- La Accesibilidad se mantiene estable en la mayoría de las páginas, salvo nueva-factura.html: botones sin nombre accesible y encabezados desordenados y configuracion.html: problemas de contraste de color.
- No se identifican efectos colaterales, fallos de carga, bloqueos de renderizado ni errores de JavaScript asociados a la integración de jsPDF o email.js.

- **Recomendaciones:**
- Optimizar la carga de la librería jsPDF
- Cargarla solo en páginas que realmente la utilicen (nueva-factura.html).
- Implementar defer o carga diferida para evitar bloqueos de red en mobile.
- Ajustar tamaños mínimos de fuente (small, .small) en mobile para resolver la advertencia de Best Practices.
- Corregir contraste de color en configuracion.html para mejorar Accesibilidad.
- Añadir nombres accesibles a los botones de nueva-factura.html.

## Issues Generadas
-  Se optimizo el logo de la aplicacion # 145

## Conclusiones
- La integración de la librería jsPDF fue exitosa y no compromete la estabilidad ni la funcionalidad del sitio. Si bien en desktop las métricas permanecen sobresalientes, en mobile se observan pequeñas variaciones de Performance debido al peso del script externo, algo esperado en contextos de red móvil simulada por Lighthouse.
- Asimismo, se relevaron oportunidades de mejora en accesibilidad y legibilidad provenientes principalmente de estilos de Bootstrap, no de la librería integrada.
- La integración de jsPDF está correctamente realizada y el sistema continúa operando con estándares óptimos para una aplicación web liviana.

Asimismo, se menciona que se optimizo la carga de la librería jsPDF en index.html, se implemento defer o carga diferida para evitar bloqueos de red en mobile.