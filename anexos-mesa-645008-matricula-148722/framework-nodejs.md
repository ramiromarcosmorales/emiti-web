# Framework - Node.js (con Express)

## Breve reseña

Node.js es un entorno de ejecución de JavaScript del lado del servidor, construido sobre el motor V8 de Chrome. Permite ejecutar JavaScript fuera del navegador, habilitando el desarrollo de backends, APIs REST y scripts de automatización. **Express** es el framework minimalista más utilizado sobre Node.js para construir servidores HTTP y APIs mediante rutas, middlewares y controladores.

## Motivación y justificación

Emití resuelve hoy el envío de emails de factura completamente del lado del cliente, en `js/api/email.js`, usando el SDK de EmailJS:

```javascript
const EMAILJS_PUBLIC_KEY = "iF4Z8fx4piITsYRqT";
const EMAILJS_SERVICE_ID = "service_fuk92qg";
const EMAILJS_TEMPLATE_ID = "template_3r0z5ac";
```

Estas credenciales quedan **embebidas en el bundle de JavaScript que se descarga al navegador**, visibles para cualquiera que inspeccione el código fuente. Además, `sendInvoiceEmail()` se ejecuta directamente desde el cliente, sin ningún control de límite de uso ni validación adicional del lado del servidor: si alguien copia esas credenciales, podría enviar emails usando la cuenta de EmailJS del proyecto sin pasar por la aplicación.

Migrar este flujo a un backend con Node.js y Express permitiría:

- Mover las credenciales (`EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, o directamente las credenciales de un proveedor SMTP) a variables de entorno del servidor, fuera del alcance del cliente.
- Agregar una capa de validación y *rate limiting* antes de disparar cualquier envío.
- Centralizar la construcción del payload (hoy en `buildInvoiceEmailPayload()`) en un solo lugar confiable, en vez de depender de que el cliente arme correctamente los datos.
- Sumar persistencia real (por ejemplo, guardar las facturas en una base de datos en vez de únicamente en `localStorage`, como hace hoy `SistemaFacturacion.guardarEnStorage()`).

## Nivel de dificultad de adaptación

La curva de aprendizaje es **baja-media** para el equipo, porque:

- El lenguaje sigue siendo JavaScript (ES6+): las clases de `js/models/` (con su patrón de validación en el constructor y serialización `toJSON()`/`fromJSON()`) se pueden reutilizar casi sin cambios en un backend Node.js.
- Express agrega una capa simple de rutas y middlewares, con curva de aprendizaje suave.
- El mayor esfuerzo está en aprender: diseño de una API REST, manejo de variables de entorno (`dotenv`), y despliegue de un servidor (hoy el proyecto se sirve como sitio estático, lo cual no es posible para un backend con estado).

## Ejemplo de código - "Antes y después"

**Antes (Vanilla JavaScript en el cliente)** — `js/api/email.js`, línea 7 - 9 (credenciales embebidas) y línea 133 - 169 (función `sendInvoiceEmail`):

```javascript
const EMAILJS_PUBLIC_KEY = "iF4Z8fx4piITsYRqT";
const EMAILJS_SERVICE_ID = "service_fuk92qg";
const EMAILJS_TEMPLATE_ID = "template_3r0z5ac";

export async function sendInvoiceEmail(templateParams) {
  if (!window.emailjs) {
    throw new Error("El SDK de EmailJS no está cargado en la página.");
  }
  if (!templateParams?.to_email) {
    throw new Error("No se recibió un email de destino válido.");
  }

  let intentos = 0;
  const maxIntentos = 2;

  while (true) {
    try {
      const resp = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );
      return { status: "success", data: resp };
    } catch (error) {
      intentos++;
      if (intentos >= maxIntentos) {
        throw new Error("No se pudo enviar el email de la factura.");
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}
```

**Después (Node.js + Express)** — el envío se mueve al servidor; el cliente solo llama a un endpoint propio, sin conocer ninguna credencial:

```javascript
// server/routes/facturas.js
const express = require("express");
const router = express.Router();
const { enviarEmailFactura } = require("../services/emailService");

router.post("/api/facturas/:numero/enviar-email", async (req, res) => {
  try {
    const resultado = await enviarEmailFactura(req.body);
    res.status(200).json({ status: "success", data: resultado });
  } catch (error) {
    res.status(502).json({ status: "error", message: "No se pudo enviar el email de la factura." });
  }
});

module.exports = router;
```

```javascript
// server/services/emailService.js
// Las credenciales viven en variables de entorno del servidor, nunca en el cliente
require("dotenv").config();
const emailjs = require("@emailjs/nodejs");

async function enviarEmailFactura(templateParams) {
  if (!templateParams?.to_email) {
    throw new Error("No se recibió un email de destino válido.");
  }

  return emailjs.send(
    process.env.EMAILJS_SERVICE_ID,
    process.env.EMAILJS_TEMPLATE_ID,
    templateParams,
    { publicKey: process.env.EMAILJS_PUBLIC_KEY, privateKey: process.env.EMAILJS_PRIVATE_KEY }
  );
}

module.exports = { enviarEmailFactura };
```

En el cliente, `sendInvoiceEmail` se reduce a un simple `fetch` a un endpoint propio, sin exponer ninguna credencial:

```javascript
// js/api/email.js (versión con backend)
export async function sendInvoiceEmail(templateParams) {
  const resp = await fetch(`/api/facturas/${templateParams.factura_numero}/enviar-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(templateParams),
  });

  if (!resp.ok) {
    throw new Error("No se pudo enviar el email de la factura.");
  }

  return resp.json();
}
```

Esto muestra el valor concreto de sumar Node.js: no cambia demasiado la forma del código del cliente, pero saca del navegador toda credencial sensible y centraliza la lógica de reintentos y validación en un solo lugar confiable.