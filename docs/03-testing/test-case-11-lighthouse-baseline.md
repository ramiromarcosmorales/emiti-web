 # Test Case 11: Auditoría Lighthouse - Baseline Inicial 
 
 ## Información General 
 - **Fecha de ejecución:** 24/11/2025 
  - **URL testeada:** https://ramiromarcosmorales.github.io/emiti-web/
 - **Rama:** develop (antes de feature branches del parcial) 
 - **Navegador:** Chrome 142 (DevTools Lighthouse) 
 
 ## Umbrales Mínimos Definidos 
 - **Performance:** ≥ 80 
 - **Accessibility:** ≥ 90 
 - **Best Practices:** ≥ 85 
 - **SEO:** ≥ 80 
 
 ## Resultados Obtenidos 
 
 ### Performance: 100
 - First Contentful Paint: 0.6 s 
 - Largest Contentful Paint: 0.6s 
 - Total Blocking Time: 0 ms
 - Cumulative Layout Shift: 0 
 - Speed Index: 0.6 s   
 ![Captura Performance](../screenshots/lighthouse-baseline-performance.png) 
 
 ### Accessibility: 87
 - Contraste insuficiente en boton entre texto y fondo
 - Touch targets pequeños, los enlaces del menu tienen tamaño/espaciado reducido    
 ![Captura Accessibility](../screenshots/lighthouse-baseline-accessibility.png) 
 
 ### Best Practices: 96 
 - Los únicos puntos marcados estan relacionados con touch targets pequeños (coincide con accesibilidad)
 - No hay problemas criticos ni advertencias serias  
 
 ### SEO: 100 
 - La estructura de la página cumple con los requisitos básicos de SEO

 ## Issues Generadas 
 - [#130] Ajuste de contraste del boton principal e incrementar tamaño/espaciado de los links de navegacion 
 
 ## Conclusiones 
 El estado inicial del proyecto en index.html es muy bueno:
- Performance (100) y SEO (100), sin problemas criticos.
- Best Practices solo con advertencias menores relacionadas con accesibilidad tactil.
- Accesibilidad (87) con oportunidades claras de mejora en contraste y targets táctiles.

