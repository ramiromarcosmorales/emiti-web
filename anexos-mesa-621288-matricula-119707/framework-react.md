# Framework – React.js

React es una librería de JavaScript desarrollada por Meta que se usa para construir interfaces de usuario dinámicas, siendo su principal característica la gestión del estado de la interfaz, permitiendo que la vista se actualice automáticamente cuando cambian los datos, sin necesidad de manipular el DOM manualmente.

React propone un modelo declarativo: el desarrollador define qué se debe mostrar según el estado actual, y la librería se encarga de mantener la interfaz sincronizada.

### Motivación y justificación para Emití

En el proyecto Emití, gran parte de la interacción con el usuario se gestiona actualmente desde el archivo script.js, donde se combinan manejo de eventos, validaciones, alertas y actualización manual del DOM.
Este enfoque funciona, pero a medida que el sistema crece se vuelve difícil de mantener y escalar, por lo tanto React permitiría centralizar y ordenar el manejo del estado visual, mejorando especialmente la experiencia del usuario, la claridad del flujo de acciones y el control de errores y validaciones.

### Nivel de dificultad de adaptación

* Esfuerzo: Medio–Alto. La adaptación implicaría reorganizar la lógica de la interfaz actual, trasladando el control del estado visual a componentes React.
* Curva de aprendizaje: Moderada. Se requiere aprender conceptos como componentes, estado (useState), manejo de eventos y flujo unidireccional de datos.
* Cambios requeridos: Reemplazar alertas y validaciones dispersas por estado controlado, separar claramente la lógica visual de la lógica del sistema y mejorar el mantenimiento de la interfaz a largo plazo

### Ejemplo de código – “Antes y Después”
* Antes (Vanilla JavaScript – manejo de la interfaz en el navegador)

En la versión actual de Emití, el agregado de ítems a una factura se maneja mediante eventos y validaciones directas, utilizando alertas (scrip.js):

```javascript
btnAgregarItem.addEventListener("click", () => {
  const producto = inputProducto.value.trim();
  const precio = Number(inputPrecio.value);

  if (!producto || precio <= 0) {
    alert("Debe completar correctamente el producto y el precio");
    return;
  }

  itemsTemp.push({ producto, precio });
  renderItemsList();
});
```

Este enfoque mezcla validación, lógica y presentación, utiliza alertas poco amigables y dificulta extender el flujo (mensajes persistentes, estados intermedios)

* Después (Implementación con React)

Con React, el estado de la interfaz se maneja explícitamente, y la vista se actualiza automáticamente según ese estado:

```javascript
function AgregarItem({ onAgregar }) {
  const [producto, setProducto] = React.useState("");
  const [precio, setPrecio] = React.useState("");
  const [error, setError] = React.useState("");

  const agregar = () => {
    if (!producto || precio <= 0) {
      setError("Debe completar correctamente el producto y el precio");
      return;
    }

    setError("");
    onAgregar({ producto, precio: Number(precio) });
  };

  return (
    <>
      {error && <p className="text-danger">{error}</p>}

      <input
        type="text"
        value={producto}
        onChange={(e) => setProducto(e.target.value)}
        placeholder="Producto"
      />

      <input
        type="number"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        placeholder="Precio"
      />

      <button onClick={agregar}>Agregar ítem</button>
    </>
  );
}
```

En este enfoque el error forma parte del estado, se elimina el uso de alertas, la interfaz refleja claramente la situación actual y el flujo es más claro y mantenible

* Conclusión

React permitiría mejorar significativamente la gestión del estado visual y la experiencia de uso de Emití. Más allá de la creación de componentes, su principal aporte estaría en ofrecer un flujo de interacción más claro, controlado y predecible, facilitando el mantenimiento y la evolución del sistema sin aumentar la complejidad del código.