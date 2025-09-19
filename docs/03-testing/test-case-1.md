# Test Case 1: Compatibilidad Navegadores Desktop

## Objetivo
Verificar la correcta visualización y funcionalidad en navegadores desktop principales.

## Herramientas Utilizadas
- BrowserStack Live Testing
- Can I Use Database
- CSS Stats

## Navegadores Probados
| Navegador | Versión | OS | Resultado |
|-----------|---------|----|-----------|
| Chrome | 140 | Windows 11 | ✅ |
| Firefox | 142 | Windows 11 | ✅ |
| Safari | 17.3 | macOS | ✅ |
| Edge | 140 | Windows 11 | ✅ |

## Capturas de Pantalla
### Chrome
![Chrome Desktop](../screenshots/chrome-desktop.jpg)

### Firefox
![Firefox Desktop](../screenshots/firefox-desktop.jpg)

### Safari
![Safari Desktop](../screenshots/safari-desktop.jpg)

### Edge
![Edge Desktop](../screenshots/edge-desktop.jpg)

## Issues Encontrados
No se detectaron problemas de visualización ni de compatibilidad entre los diversos navegadores y sistemas operativos probados.

## Métricas de Compatibilidad (por navegador)

**Definición:**  
Se calcula en base al total de propiedades únicas de CSS detectadas con **CSS Stats** (`TotalProps`).  
Para cada navegador, se cuentan las propiedades soportadas según **Can I Use** (`CompatibleProps`).  

**Fórmula:**  
Compatibilidad CSS (por navegador) = (CompatibleProps / TotalProps) * 100

### Evidencias Requeridas
1. **Captura de CSS Stats** mostrando `TotalProps`.  
   ![CSS Stats Overview](../screenshots/css-stats.png)

2. **Capturas de 4 propiedades consultadas en Can I Use** (una por imagen), indicando si están soportadas en cada navegador.   
   ![Can I Use - Grid](../screenshots/caniuse-grid.png)  
   ![Can I Use - Flexbox](../screenshots/caniuse-flexbox.png)  
   ![Can I Use - Box Shadow](../screenshots/caniuse-box-shadow.png)  
   ![Can I Use - Border Radius](../screenshots/caniuse-border-radius.png)  

### Tabla de Resultados
| Navegador | TotalProps | CompatibleProps | Compatibilidad CSS |
|-----------|------------|-----------------|---------------------|
| Chrome | 48 | 48 | 100% |
| Firefox | 48 | 48 | 100% |
| Safari | 48 | 48 | 100% |
| Edge | 48 | 48 | 100% |
