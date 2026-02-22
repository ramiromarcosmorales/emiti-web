

# Framework - Express (Node.js / Backend)

## Descripción 
**Express** es un framework minimalista para **Node.js** que permite construir:
- Servidores web
- APIs REST
- Rutas y middlewares (validación, logs, auth, CORS)
- Manejo estándar de JSON y códigos HTTP

Es una herramienta común en stacks MERN/MEAN.

---

##  Motivación y justificación 
En “Emití Web” ya hay consumo de una API externa (productos demo) y gestión de datos del lado cliente.

Express permitiría:
- Crear una **API propia** (`/api/facturas`, `/api/clientes`, `/api/productos-demo`)
- Centralizar reglas y validaciones en servidor (no solo en frontend)
- Evitar dependencia directa del frontend hacia APIs externas
- Preparar el proyecto para persistencia real (MongoDB/MySQL/etc.)

---

## Nivel de dificultad de adaptación
**Dificultad: Media**

### Requiere:
- Configurar un proyecto Node (npm)
- Crear rutas/controladores
- Definir almacenamiento (archivo JSON, DB, etc.) si se escala

### Cambio típico:
Frontend pasa de “datos locales / API externa directa” a “consumir endpoints propios”.

---

## Ejemplo de código - “Antes y después”

### Antes (Vanilla JS consumiendo API desde el frontend)

**Referencia REAL en el repo (OBLIGATORIO):**
- Ruta: `script.js`
- Líneas: [631–687](https://github.com/ramiromarcosmorales/emiti-web/blob/develop/js/script.js#L631-L687)

**Fragmento real (controlador):**
```js
import { fetchFakeStoreProducts } from "./api/apiService.js";

async function cargarProductosDemo() {
  const cont = document.getElementById("productosDemo");
  if (!cont) return;

  // LOADING
  cont.replaceChildren();
  // ... spinner + texto

  try {
    const productos = await fetchFakeStoreProducts();

    if (!productos || productos.length === 0) {
      // SUCCESS vacío
      return;
    }

    // SUCCESS normal
    cont.replaceChildren();
    renderProductosDemo(productos);
  } catch (err) {
    // ERROR
    cont.replaceChildren();
  }
}
```


### Después (Implementación con Express.js como API intermedia / API propia)

```js
import express from "express";

const app = express();

app.get("/api/productos-demo", async (req, res) => {
  try {
    const r = await fetch("https://fakestoreapi.com/products");
    if (!r.ok) return res.status(502).json({ message: "API externa no disponible" });

    const data = await r.json();

    // Normalización al formato usado por tu UI
    const productos = (data ?? []).map((p) => ({
      nombre: p.title,
      categoria: p.category,
      precio: Number(p.price ?? 0),
    }));

    res.status(200).json(productos);
  } catch (e) {
    res.status(500).json({ message: e.message || "Error interno" });
  }
});

app.listen(3000, () => console.log("API lista en http://localhost:3000"));
```

### Frontend consumiendo enpoint
```js
const res = await fetch("http://localhost:3000/api/productos-demo");
if (!res.ok) throw new Error("No se pudieron cargar productos demo");
const productos = await res.json();
renderProductosDemo(productos);
```
--- 
###  Conclusión  

#### Express agrega la separación correcta:

- Frontend: UI y experiencia

- Backend: datos, normalización, reglas, endpoints
Esto hace que EMITÍ WEB sea escalable y alineado a MERN/MEAN.
---