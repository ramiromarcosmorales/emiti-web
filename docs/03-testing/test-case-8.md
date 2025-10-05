# Test Case 8: Responsive – Implementación de Componente Avanzado Bootstrap 

## Objetivo
Verificar la correcta integración, personalización visual y comportamiento responsive del toast agregar en configuración verde en distintos dispositivos y navegadores, asegurando la coherencia visual y funcional del proyecto.
  

## Herramientas Utilizadas
- BrowserStack Mobile Testing  
- Chrome DevTools Device Mode  
- Google PageSpeed Insights
- Lambdatest  

## Dispositivos Probados
| Dispositivo       | Resolución | Navegador | Orientación         | Resultado |
|-------------------|------------|-----------|---------------------|-----------|
| iPhone 14 Pro     | 393x852    | Safari    | Portrait/Landscape  | ❌ |
| Galaxy S23        | 360x780    | Chrome    | Portrait/Landscape  | ❌ |
| iPad Air          | 820x1180   | Safari    | Portrait/Landscape  | ✅ |
| Desktop (Laptop)  | >1024px    | Chrome    | Landscape           | ✅ |

## Breakpoints Verificados
- **Mobile:** 320px – 768px  
- **Tablet:** 768px – 1024px  
- **Desktop:** 1024px+  

---

## Validaciones específicas
- Verificar que el componente se visualice correctamente en **mobile, tablet y desktop**.  
- Confirmar que **no se produzca scroll horizontal indeseado** en mobile.  
- Validar que la **interacción (clic/touch)** funcione correctamente en dispositivos táctiles.  
- Revisar que la personalización aplicada en `css/styles.css`, `css/components.css` y `css/bootstrap-overrides.css` mantenga la **identidad visual del proyecto**.  

---

## Capturas por Dispositivo

### iPhone 14 Pro

**Toast Configuracion**
- Portrait:

![iPhone 14 Pro Portrait Configuracion](../screenshots/14pro_configuracion_portrait.png)

**Toast Configuracion**
- Landscape:

![iPhone 14 Pro Landscape  Configuracion](../screenshots/14pro_configuracion_landscape.png)


---

### Samsung Galaxy S23

**Toast Configuracion**
- Portrait:

![Galaxy S23 Portrait  Configuracion](../screenshots/S23_configuracion_portrait.png)

**Toast Configuracion**
- Landscape:

![Galaxy S23 Landscape Configuracion](../screenshots/S23_configuracion_landscape.png)


---

### iPad Air
**Toast Configuracion**
- Portrait:

![iPad Air Portrait Configuracion](../screenshots/Ipad_configuracion_portrait.png)

**Toast Configuracion**
- Landscape:

![iPad Air Landscape Configuracion](../screenshots/Ipad_configuracion_landscape.png)


---

### Desktop

**Vista Configuracion**

![Desktop Configuracion](../screenshots/Desktop_configuracion.png)

---

## DevTools → Performance & Network

### Performance Overview

![Performance Metrics](../screenshots/performance_configuracion.png)

- **LCP (Largest Contentful Paint):** 0.32 s  
- **INP (Interaction to Next Paint):** 32 ms 
- **CLS (Cumulative Layout Shift):** 0.02  
- **Resultado general:** rendimiento estable y carga fluida de toast.

## Detalle de Recursos en Network
![Network Recursos CSS](../screenshots/network_configuracion.png)

| Archivo | Tipo | Tamaño | Tiempo |
|----------|------|--------|--------|
| bootstrap.min.css | stylesheet | 33.8 kB | 69 ms |
| bootstrap-overrides.css | stylesheet | 0.7 kB | 111 ms |
| styles.css | stylesheet | 1.0 kB | 54 ms |
| components.css | stylesheet | 1.9 kB | 59 ms |
| responsive.css | stylesheet | 2.5 kB | 59 ms |

---

## Performance en Mobile
 **Reporte de PageSpeed**  

![Results](../screenshots/PageSpeed_configuracion.png)  

| Métrica | Antes | Después |
|----------|--------|----------|
| Rendimiento (PageSpeed) | 87 | 72 |
| FCP | 3.2 s | 4.5 s |
| LCP | 0.6 s | 4.5 s |
| CLS | 0     | 0.00 |
| Tamaño de Página | 294 KB | 258 KB |
| Fully Loaded | 692 ms | 322 ms |

---

## Resultado Esperado
- El modal **se adapta correctamente** a todos los dispositivos y resoluciones.  
- Mantiene la **identidad visual** del proyecto.  
- No genera **bloqueos de carga** ni retrasa la renderización.  
- El **toast de confirmación** se muestra correctamente en verde tras guardar o añadir datos.

---

## Issues Encontrados
| IssueID | Descripción |
|----------|-------------|
| [#73](https://github.com/ramiromarcosmorales/emiti-web/issues/73) | Scroll leve en landscape de Iphone 14 Pro durante apertura de modal |

---
