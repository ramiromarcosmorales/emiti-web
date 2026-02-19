# Framework - Express.js (Node.js)

Express.js es un framework para Node.js que permite crear servidores HTTP y APIs REST de forma simple mediante rutas y middlewares. 
Es una base común en proyectos backend con JavaScript.

---

## Motivación y justificación
Emití actualmente funciona como una aplicación frontend que:
- consume una API externa para productos demo
- trabaja con persistencia local (por ejemplo localStorage)

Esto limita:
- acceso desde múltiples dispositivos
- persistencia real de clientes/facturas
- escalabilidad del proyecto (usuarios, roles, historial)
- validaciones centralizadas

Express beneficiaría a Emití porque permitiría:
- crear una API propia para clientes, facturas e items
- centralizar validaciones y reglas de negocio del lado servidor
- escalar el proyecto hacia un sistema real con base de datos (por ejemplo MongoDB)

---

## Nivel de dificultad de adaptación
**Dificultad: Media-Alta.**  
Requiere crear un backend separado, definir endpoints REST y reemplazar parte del flujo actual basado en localStorage por requests HTTP.

---

## Ejemplo de código - “Antes y después”

**Código tomado de:**
- Archivo: `js/api/apiService.js`
- Función: `fetchFakeStoreProducts(limit = 8)`
- Líneas: 4–27

### ANTES (Vanilla JS)
```js
export async function fetchFakeStoreProducts(limit = 8) {
  const url = `https://fakestoreapi.com/products?limit=${limit}`;

  try {
    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error("Error al obtener productos desde la API externa.");
    }

    const raw = await resp.json();

    // Normalización minimal
    return raw.map(p => ({
      id: p.id,
      nombre: p.title.trim(),
      categoria: p.category,
      precio: Number(p.price)
    }));
  } catch (err) {
    console.error("[API] Error FakeStore:", err);
    throw new Error("No se pudieron cargar los productos demo.");
  }
}
```
### DESPUÉS (Express - API propia)

```js
import express from "express";

const app = express();
app.use(express.json());

app.get("/api/productos-demo", async (req, res) => {
  const limit = Number(req.query.limit ?? 8);

  const url = `https://fakestoreapi.com/products?limit=${limit}`;

  try {
    const resp = await fetch(url);

    if (!resp.ok) {
      return res.status(502).json({ error: "Error en API externa" });
    }

    const raw = await resp.json();

    const data = raw.map(p => ({
      id: p.id,
      nombre: p.title.trim(),
      categoria: p.category,
      precio: Number(p.price)
    }));

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "No se pudieron cargar productos demo" });
  }
});

app.listen(3000, () => console.log("API lista en http://localhost:3000"));
```

---