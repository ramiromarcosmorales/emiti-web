# Test Case 10: Responsive – Implementación de Componente Avanzado HTML (2)

## Objetivo
Validar la integración, compatibilidad y comportamiento responsive del componente avanzado HTML **Details & Summary** en diferentes dispositivos y navegadores.

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

![Imagen](https://drive.google.com/uc?export=view&id=1K3qNjvBvji-t2ivCOYxTwAVn48o8RKxW)

 2. Evidencia de compatibilidad o limitaciones
 
![Imagen](https://drive.google.com/uc?export=view&id=1o1JeDpG7WyIACqWag-Y0P2Zf4xwggTJS)

- **W3C HTML Validator:** 

![Imagen](https://drive.google.com/uc?export=view&id=14csowmoGYVwS6i-d4tYJhqyw5D2Mxoq-)

---

## Performance en Mobile de la página con PageSpeed.

![Imagen](https://drive.google.com/uc?export=view&id=1lI5N3_wzdpk3eikH9q0nl6MC5Tg7nBlD)

- Confirmacion que los recursos cargados no bloqueen renderización.  

![Imagen](https://drive.google.com/uc?export=view&id=1cDLT1BJbK9gNNylqSShk6vFy5x2USNJA)

![Imagen](https://drive.google.com/uc?export=view&id=1umq8LbeZ4J0MLeTc5ltG9weXD4liwh_y)

![Imagen](https://drive.google.com/uc?export=view&id=1AtvCG1GG05GcZUc19DciuxwivSuG18EP)

## Performance con ajustes

![Imagen](https://drive.google.com/uc?export=view&id=1ifxKhoOR6IRYcANme2_K4xFkIU7qmNcz) 
 
Resultado del **First Contentful Paint (FCP)** y **Largest Contentful Paint (LCP)** debido a que es una nueva pantalla.  

![Imagen](https://drive.google.com/uc?export=view&id=1qB3rZM_fBxBvPH1pFKXxh4_CgSl1kNWh)

---

## Imagenes
1. **Mobile iPhone 14 Pro** 

![Imagen](https://drive.google.com/uc?export=view&id=1ia_B-sLGFROBqlH3GlfW-v0WqI7hgDz6)

![Imagen](https://drive.google.com/uc?export=view&id=1_yTrcrHNdcUh7OmLE_JbwyU1QBoS1wvO)

![Imagen](https://drive.google.com/uc?export=view&id=10C6EBz7rpBWbsygwN0pzRYsZ93IO59bg)

![Imagen](https://drive.google.com/uc?export=view&id=12_cdNDUa_o7gPcic6xAt296iuYHF6eBN)

2. **Mobile Galaxy S23**   

![Imagen](https://drive.google.com/uc?export=view&id=1F9AeJJdekh1tlRRUxAqhjqK8AXi3y2xl)

![Imagen](https://drive.google.com/uc?export=view&id=1vWvHbZTOE4L5XrRurZXuRPJxKr68-x40)

![Imagen](https://drive.google.com/uc?export=view&id=1vx73CetAopmsdD5fI-4WA15hBWd6aBpX)

![Imagen](https://drive.google.com/uc?export=view&id=18HsDPl4ufcj9lmXY7IdFUiHX44t7C8H0)

3. **Tablet (iPad Air)**   

![Imagen](https://drive.google.com/uc?export=view&id=1vU9tAk_z_DWDS00Jd8XReSWienM-ZfHm)

![Imagen](https://drive.google.com/uc?export=view&id=1QxoCF20-XChvX6IwD-qQpUp9nCtm7uD4)

![Imagen](https://drive.google.com/uc?export=view&id=1eR3fhtvd9Mw0Ff7tDkmTuOottawg_ic3)

![Imagen](https://drive.google.com/uc?export=view&id=1zVQXsxGiMAq7JekCIdVk_xamyp3yJQ_z)


4. **Desktop**   

![Imagen](https://drive.google.com/uc?export=view&id=1lBrq4GINV7vEYueJ88INwevqteC6gqw2)

![Imagen](https://drive.google.com/uc?export=view&id=1Dc6CFlVaBPIQGTBIKzJRPpVWs1QaMH-n)

---

## Resultado Esperado
- El componente HTML se adapta y funciona correctamente en todos los dispositivos probados.  
- Mantiene la coherencia del diseño e integración con Bootstrap.  
- No afecta de forma crítica la performance en mobile.  
- Es compatible con los principales navegadores según **Can I Use** y válido según **W3C HTML Validator**.  

---

## Issues encontrados

| IssueID | Descripción 
|----|-------------|
| [#88](https://github.com/ramiromarcosmorales/emiti-web/issues/88) | Ajuste de Performance 