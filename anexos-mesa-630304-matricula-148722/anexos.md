# Anexo - “Frameworks & NodeJS”

## Contexto: frameworks, tooling y ecosistema JavaScript

En el ecosistema **JavaScript** existen múltiples herramientas y frameworks para construir aplicaciones web modernas. En términos generales, podemos dividir el stack en dos capas:

- **Frontend**: se trabaja principalmente con HTML/CSS/JS, y puede ampliarse con frameworks/librerías que facilitan arquitectura por componentes, estado, ruteo, etc.
- **Backend (servidor / API)**: se puede implementar con **Node.js** (JavaScript del lado servidor). Allí es común usar frameworks para estructurar endpoints, middlewares, validaciones y servicios.

### Node.js 
**Node.js** es un entorno de ejecución de JavaScript fuera del navegador 
  Permite:
- Crear servidores HTTP, APIs REST y servicios
- Manejar archivos, procesos, dependencias (npm)
- Implementar middlewares, autenticación, logging, etc.

---

## Stacks MERN y MEAN (visión general)

### MERN
El stack **MERN** está compuesto por:
- **MongoDB** 
- **Express** 
- **React** 
- **Node.js** 
### MEAN
El stack **MEAN** está compuesto por:
- **MongoDB**
- **Express**
- **Angular** 
- **Node.js**

### MERN vs MEAN
La diferencia principal está en el **frontend**:
- **MERN** usa **React**
- **MEAN** usa **Angular**

Ambos usan **Node.js + Express** en backend y **MongoDB** como base de datos.

---

## Frameworks elegidos

- **React (Frontend)**[Framework - React](./framework-react.md)

- **Express (Backend sobre Node.js)**[Framework - Express](./framework-express.md)

---

## Conclusión 
- React aporta **componentización**, mejor mantenimiento del UI y escalabilidad cuando crece la aplicación.
- Express aporta **estructura de servidor**, facilita APIs, middlewares y separa responsabilidades (frontend consume datos del backend).
