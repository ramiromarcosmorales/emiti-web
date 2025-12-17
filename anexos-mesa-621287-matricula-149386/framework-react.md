# Framework - React.js

React es una librería de JavaScript desarrollada por Meta que permite la construcción de interfaces de usuario. Su principal característica es el uso de un **Virtual DOM** y una arquitectura basada en componentes, permitiéndola crear interfaces dinámicas sin manipular manualmente el DOM del navegador.

## Motivación y Justificación para Emití

Elegí React para Emití ya que soluciona el principal problema de escalabilidad del código actual: la mezcla de lógica y vista en el archivo `script.js`.

### Beneficios Clave:
* **Adiós a la manipulación manual**: Actualmente, funciones como `renderItemsList()` o `crearFilaMovimiento()` construyen HTML línea por línea. React automatiza esto sincronizando la vista con los datos.
* **Componentización**: Elementos como las **cards** de facturas o las filas de ítems (`ItemFactura`) se convierten en componentes reutilizables, facilitando el mantenimiento.
* **Gestión de Estado**: React maneja eficientemente los cambios (como agregar un ítem a la factura) sin tener que recargar partes del DOM a mano.

### Nivel de Dificultad de Adapatación
* **Esfuerzo**: Alto.
  Implica desacoplar la lógica de la vista. Actualmente, el manejo del DOM se realiza de forma manual y está mezclado con la lógica de negocio, la migración requiere extraer esa responsabilidad para delegarla en **componentes reutilizables**, eliminando la necesidad de crear y gestionar etiquetas HTML manualmente.
* **Curva de Aprendizaje**: Modereada (requiere aprender JSX y Hooks).
* **Cambios Requeridos**: Reemplazar la estructura actual y los scripts por una aplicación SPA (Single Page Application).

## Ejemplo de Código - "Antes y Después"

### Antes (Vainilla JS - Código actual en `script.js`) 
Para mostrar los ítems en el modal, hoy creamos elementos DOM manualmente e iteramos un array temporal:

```javascript
itemsTemp.forEach((item, index) => {
    const itemEl = document.createElement("div");
    itemEl.className = "list-group-item d-flex justify-content-between";

    const strong = document.createElement("strong");
    strong.textContent = item.producto; 

    const btnEliminar = document.createElement("button");
    btnEliminar.addEventListener("click", () => {
        itemsTemp.splice(index, 1);
        renderItemsList();
    });

    itemEl.appendChild(strong);
    itemEl.appendChild(btnEliminar);
    listaItems.appendChild(itemEl);
});
```

### Después (Implementación con React)
Definimos qué queremos ver, y React se encarga de renderizarlo cuando cambian los datos:

```javascript
function ListaItems({ items, alEliminar }) {
  return (V
    <div className="list-group">
      {items.map((item, index) => (
        <div key={index} className="list-group-item d-flex justify-content-between">
          <div>
            <strong>{item.producto}</strong>
            <br />
            <small className="text-muted">${item.precio}</small>
          </div>
          
          <button className="btn btn-outline-danger" onClick={() => alEliminar(index)}>
             <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      ))}
    </div>
  );
}
```