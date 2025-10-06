# Test Case 9: Responsive – Implementación de Componente Avanzado HTML (1)

## Objetivo
Validar la integración, compatibilidad y comportamiento responsive del componente **Calculadora de IVA** en configuracion.html, implementado con los elementos avanzados **datalist** y **output** en diferentes dispositivos y navegadores.

## Herramientas Utilizadas
- BrowserStack Mobile Testing  
- Chrome DevTools Device Mode  
- Google PageSpeed Insights  
- Can I Use (verificación de compatibilidad por navegador)  
- W3C HTML Validator (validación de estándares HTML5)  

## Dispositivos Probados
| Dispositivo       | Resolución | Navegador | Orientación         | Resultado |
|-------------------|------------|-----------|---------------------|-----------|
| iPhone 14 Pro     | 393x852    | Safari    | Portrait/Landscape  | ✅/✅ |
| Galaxy S23        | 360x780    | Chrome    | Portrait/Landscape  | ✅/✅ |
| iPad Air          | 820x1180   | Safari    | Portrait/Landscape  | ✅/✅ |
| Desktop (Laptop)  | >1024px    | Chrome    | Landscape           | ✅ |

## Breakpoints Verificados
- **Mobile:** 320px – 768px  
- **Tablet:** 768px – 1024px  
- **Desktop:** 1024px+  

---

- Confirmar que el componente HTML se adapte a diferentes resoluciones de pantalla.  
- Verificar que **no genere scroll horizontal indeseado**.  
- Validar compatibilidad de controles (play, pause, zoom, interacción táctil).  
- Revisar si el contenido embebido se adapta correctamente al **sistema de grillas de Bootstrap**.  
- Chequear que los estilos personalizados en `css/styles.css`, `css/components.css` y `css/bootstrap-overrides.css` mantengan coherencia visual con el resto del proyecto.

---

## Uso de herramientas de compatibilidad y validación
- **Can I Use:** Verificar compatibilidad del componente HTML con navegadores principales   

 1. Pantalla de resultados

![Imagen](https://drive.google.com/uc?export=view&id=1oMiQVp7l7CQxLUlCSusk1dgPO0hGfGlT)

 2. Evidencia de compatibilidad o limitaciones
 
![Imagen2](https://drive.google.com/uc?export=view&id=1Rzsl1v9UsxwfTL06clz2wI2A_LCdoJfr)

- **W3C HTML Validator:**   

![Imagen](https://drive.google.com/uc?export=view&id=1GooyXvyGsj9AV0Rg48PqAy6iCsAz28mS)

---

## Performance en Mobile con PageSpeed.  

![Imagen](https://drive.google.com/uc?export=view&id=1UpG0bPHD2N4m25qDDDAOlYM2fEvhtVC3)
  
- Confirmacion que los recursos cargados no bloqueen renderización. 

![Imagen](https://drive.google.com/uc?export=view&id=1w1VmXbaRIcoWiQeuLqoZJHBWdjDUHGGE)

![Imagen](https://drive.google.com/uc?export=view&id=1vhbdKen9ralzol_KrKgjSJ3Bi-GwFYhU)

![Imagen](https://drive.google.com/uc?export=view&id=113F9mTUB5k3Oe9EEEKvsyq-xZ84P1MEE)

- Comparación del **First Contentful Paint (FCP)** y **Largest Contentful Paint (LCP)** antes y después de agregar el componente.  

![Imagen](https://drive.google.com/uc?export=view&id=1DOpNp7zTAIra5VKfQxJFZbaHBzJ-tIFs)

![Imagen](https://drive.google.com/uc?export=view&id=1vF_ITJDmhRsXpucQz4GQ8g0dK5bcW2gc)

---

## Imagenes
1. **Mobile iPhone 14 Pro** 

![Imagen](https://drive.google.com/uc?export=view&id=1LCyVI6ybarbgXawW04Ovw0dqtDr3A87_)

![Imagen](https://drive.google.com/uc?export=view&id=1bqMiR00aKdF3a3rQK2sZ-RQyS6a_-djZ)

![Imagen](https://drive.google.com/uc?export=view&id=1fzufsFsQn4MbdcujRanZGIutK1NMZ5Vz)

![Imagen](https://drive.google.com/uc?export=view&id=1OfMqqchnrN1OGoltDO5FNsIYyml7uCiF)

2. **Mobile Galaxy S23**

![Imagen](https://drive.google.com/uc?export=view&id=1g0eXPqFuOxK9nFLFotKpP6CnYLUnl5hH)

![Imagen](https://drive.google.com/uc?export=view&id=18wpBsI6XHzG9-S2Bq803b6FlqyL8OiZa)

![Imagen](https://drive.google.com/uc?export=view&id=1TWY_utPCRxceyEdvkG9xzIz3IzSza7ML)

![Imagen](https://drive.google.com/uc?export=view&id=1LMuWpbIAmuVoMp5S3lbKmAFpO40Wp1pk)

3. **Tablet (iPad Air)** 

![Imagen](https://drive.google.com/uc?export=view&id=1zXpsteCNSoev5mzr1Hkv6Z8Kbt9z5iLM)

![Imagen](https://drive.google.com/uc?export=view&id=1tVm68Epk5T1GxyIlBuMI5L_n99V0oE50)

![Imagen](https://drive.google.com/uc?export=view&id=178FDMazz_T7VHfaqiyWZRqtu8GIFexKO)

![Imagen](https://drive.google.com/uc?export=view&id=1zpfrZToXhhyWyKbCxhe-BYK-wXLChFnv)

4. **Desktop** 

![Imagen](https://drive.google.com/uc?export=view&id=1KzYbhLcYx5mizWQWIPrO03k3aJzB2kDt)

![Imagen](https://drive.google.com/uc?export=view&id=1m-ohytkXWoJ1GRwz5lkUzVIS1V2EFH_l)

---

## Resultado Esperado
- El componente HTML se adapta y funciona correctamente en todos los dispositivos probados.  
- Mantiene la coherencia del diseño e integración con Bootstrap.  
- No afecta de forma crítica la performance en mobile.  
- Es compatible con los principales navegadores según **Can I Use** y válido según **W3C HTML Validator**.  

---
