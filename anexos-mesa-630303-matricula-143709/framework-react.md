# Framework - React

React es una librería/framework de JavaScript para construir interfaces de usuario basadas en componentes. Permite render declarativo mediante JSX y manejo de estado, lo cual facilita la creación de interfaces dinámicas y escalables.

---

## Motivación y justificación
Emití actualmente renderiza partes de la interfaz mediante manipulación manual del DOM (createElement, appendChild, etc.). React beneficiaría al proyecto porque permite:
- dividir la UI en componentes reutilizables
- manejar el estado de la interfaz de forma clara
- reducir código repetitivo y mejorar mantenimiento

---

## Nivel de dificultad de adaptación
**Dificultad: Media.**  
Requiere migrar pantallas HTML a componentes React e incorporar un build tool (por ejemplo Vite). La lógica de negocio actual en `js/models/` es reutilizable, pero el manejo de UI debería reestructurarse.

---

## Ejemplo de código - “Antes y después”

**Código tomado de:**
- Archivo: `js/script.js`
- Función: `renderProductosDemo(productos)`
- Líneas: 12–64

### ANTES (Vanilla JS)
```js
function renderProductosDemo(productos) {
  const contenedor = document.getElementById("productosDemo");
  if (!contenedor) return;

  contenedor.replaceChildren(); 

  productos.forEach((p) => {
    const card = document.createElement("div");
    card.className = "col-12 col-md-6 col-lg-3";

    const wrapper = document.createElement("div");
    wrapper.className = "card h-100 shadow-sm";

    const body = document.createElement("div");
    body.className = "card-body d-flex flex-column";

    const nombre = document.createElement("h6");
    nombre.className = "card-title";
    nombre.textContent = p.nombre;

    const categoria = document.createElement("p");
    categoria.className = "text-muted mb-1 small";
    categoria.textContent = p.categoria;

    const precio = document.createElement("p");
    precio.className = "fw-bold mt-auto";
    precio.textContent = `$${p.precio}`;

    body.appendChild(nombre);
    body.appendChild(categoria);
    body.appendChild(precio);

    wrapper.appendChild(body);
    card.appendChild(wrapper);
    contenedor.appendChild(card);
  });
}
```

### DESPUÉS (React)

```jsx
function ProductosDemo({ productos }) {
  return (
    <div className="row g-3" id="productosDemo">
      {productos.map((p) => (
        <div className="col-12 col-md-6 col-lg-3" key={p.id}>
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
              <h6 className="card-title">{p.nombre}</h6>
              <p className="text-muted mb-1 small">{p.categoria}</p>
              <p className="fw-bold mt-auto">${p.precio}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```
---