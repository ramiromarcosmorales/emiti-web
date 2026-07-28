# EMITI WEB

- **Apellido Nombre** Harika Varela Sebasthian Ezequiel 
- **Materia - Carrera**  Programación WEB I - Tecnicatura en Programación de Sistemas
- **Profesor**  Matias Velasquez
- **Año** 2026

---

## Introducción

Emití es una herramienta web diseñada para la gestión eficiente de comprobantes y facturas.
Ofrece una interfaz clara e intuitiva que facilita la emisión, visualización y organización de documentos fiscales,
optimizando la experiencia del usuario a través de un diseño moderno y responsive.


---

## Stack tecnológico

**Descripción del stack utilizado en la aplicación**

- HTML5
- CSS3
- Bootstrap 5
- JavaScript ES6+
- Librerías externas: emails.js
- Jasmine
- Lighthouse
- PlantUML
- Figma
- Git y GitHub (con ramas protegidas y gestión de PRs)
- Visual Studio Code
- Herramientas de QA: BrowserStack, PageSpeed Insights, WAVE, GTMetrix, ResponsivelyApp, - - -  SauceLabs
---

## Anexos

- Mesa N° 645008 - N° Matrícula 148722 - Anexo - **"Frameworks y Node JS"**

# Anexo - "Frameworks y Node JS"

Una breve explicación de cuáles son los frameworks y herramientas de desarrollo que se pueden utilizar con JavaScript, qué es el stack MERN, MEAN, y una comparación entre ambos.

## MERN vs MEAN

**MERN** (MongoDB, Express, React, Node.js) y **MEAN** (MongoDB, Express, Angular, Node.js) son dos stacks full-stack basados en JavaScript de punta a punta, tanto en el cliente como en el servidor. Ambos comparten la misma base de backend (MongoDB, Express y Node.js) y se diferencian únicamente en la capa de frontend: MERN utiliza React (una librería de UI basada en componentes y JSX), mientras que MEAN utiliza Angular (un framework completo, opinado, basado en TypeScript e inyección de dependencias).

En el caso de **Emití**, el proyecto se desarrolló hasta ahora con HTML5, CSS3, Bootstrap 5 y JavaScript ES6+ vanilla en el cliente, con una arquitectura POO bien definida en `js/models/` (clases `Cliente`, `Factura`, `ItemFactura`, `Impuesto`, `SistemaFacturacion`), patrón Observer para sincronizar el estado con `localStorage` (`StorageObserver`), y manipulación manual del DOM en `js/script.js`. El envío de emails (`js/api/email.js`) y el consumo de datos externos (`js/api/apiService.js`) se resuelven íntegramente del lado del cliente, sin backend propio.

Por eso este anexo evalúa cómo evolucionaría el proyecto si se migrara hacia un stack tipo **MEAN**, incorporando Angular en el frontend (aprovechando que la lógica POO ya existente se traduce naturalmente a componentes/servicios) y Node.js con Express en el backend (para sacar del cliente responsabilidades sensibles, como el envío de emails con credenciales embebidas).

## Frameworks elegidos

- **Angular** (frontend)
- **Node.js con Express** (backend)

---

Ver el detalle de cada uno en:

- [framework-angular.md](./framework-angular.md)
- [framework-nodejs.md](./framework-nodejs.md)