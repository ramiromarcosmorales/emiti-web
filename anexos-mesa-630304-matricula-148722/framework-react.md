# Framework - React (Frontend) aplicado a EMITÍ WEB

## Descripción 
**React** es una librería (usada como framework) para construir interfaces basadas en **componentes** y **render declarativo**.  
En vez de “armar DOM a mano” (createElement/appendChild), la UI se define como resultado del **estado**.

---

## Motivación / justificación (aplicado al proyecto)
En `EMITÍ WEB` se ve un patrón típico ideal para React:
- Render dinámico de productos demo (cards) y acciones “Usar en factura”.
- Manejo de estados de interfaz: **loading / success / error**.
- Feedback visual con `mostrarToast(...)`.

React beneficiaría porque:
- Centraliza estado (productos/estado/error) y el render sale de eso.
- Reduce repetición y complejidad de DOM imperativo.
- Facilita escalar a más pantallas y componentes (listado facturas, formulario, etc.).

---

## Dificultad de adaptación
**Media/Alta** si migrás todo el proyecto a SPA.  
**Media** si migrás por módulos (recomendado): empezar por “Productos Demo”.

Cambios típicos:
- Pasar render/estados UI a componentes React.
- Reemplazar manipulación DOM manual por JSX y estado.
- Definir integración con Bootstrap (clases + componentes propios).

---

## Ejemplo “Antes y Después” 

###  Antes (Vanilla JS - DOM imperativo)
**Referencia**
- Ruta: `js/script.js`
- Líneas: [41–52](https://github.com/ramiromarcosmorales/emiti-web/blob/develop/js/script.js#L41-L52)
- Líneas: [640–687](https://github.com/ramiromarcosmorales/emiti-web/blob/develop/js/script.js#L640-L687)

**Fragmento real (evento + side effects sobre inputs):**
```js
btn.addEventListener("click", () => {
  const inputDesc = document.getElementById("productoFactura");
  const inputPrecio = document.getElementById("precioFactura");

  if (inputDesc) inputDesc.value = p.nombre;
  if (inputPrecio) inputPrecio.value = p.precio;

  mostrarToast("Producto demo cargado en la factura.", "info");
});
```
--- 
**Fragmento 2  (estado LOADING + success/error)**
---
```js

cont.replaceChildren();
const loadingWrapper = document.createElement("div");
loadingWrapper.className =
  "text-center py-3 d-flex justify-content-center align-items-center gap-2";

const spinner = document.createElement("div");
spinner.className = "spinner-border spinner-border-sm";
spinner.setAttribute("role", "status");

const loadingText = document.createElement("span");
loadingText.textContent = "Cargando productos demo...";

loadingWrapper.appendChild(spinner);
loadingWrapper.appendChild(loadingText);
cont.appendChild(loadingWrapper);

try {
  const productos = await fetchFakeStoreProducts();

  if (!productos || productos.length === 0) {
    cont.replaceChildren();
    mostrarToast("No se encontraron productos demo", "info");
    return;
  }

  cont.replaceChildren();
  renderProductosDemo(productos);
  mostrarToast("✔ Productos demo cargados", "success");
} catch (err) {
  cont.replaceChildren();
  mostrarToast(err.message || "Error cargando productos demo", "danger");
}
```


#### Se observa en Vanilla:

 - Render y estados UI controlados con manipulación manual del DOM.

 - Side effects (inputs + toast) directamente desde eventos.

 - Más código repetitivo cuando crece la UI.

 ### Después  (React - UI declarativa + estado)

```js
 import { useEffect, useState } from "react";

export function ProductosDemo({ onUsarProducto }) {
  const [estado, setEstado] = useState("loading"); // loading | success | error
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setEstado("loading");
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error("No se pudieron cargar productos demo");
        const data = await res.json();

        setProductos((data ?? []).map(p => ({
          nombre: p.title,
          categoria: p.category,
          precio: Number(p.price ?? 0),
        })));

        setEstado("success");
      } catch (e) {
        setError(e.message || "Error cargando productos demo");
        setEstado("error");
      }
    })();
  }, []);

  if (estado === "loading") return <p>Cargando productos demo...</p>;
  if (estado === "error") return <p className="text-danger">{error}</p>;
  if (productos.length === 0) return <p>No se encontraron productos demo.</p>;

  return (
    <div className="row g-3">
      {productos.map((p, i) => (
        <div className="col-12 col-md-6 col-lg-3" key={i}>
          <button className="btn btn-primary btn-sm" onClick={() => onUsarProducto(p)}>
            Usar en factura
          </button>
        </div>
      ))}
    </div>
  );
}
```
### Conclusión
 React es especialmente útil para interfaces dinámicas con estados visuales, listas y muchos  eventos.
 El módulo de “productos demo” en EMITÍ WEB es un candidato directo para migración incremental.