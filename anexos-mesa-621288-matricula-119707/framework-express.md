# Framework – Express.js (Node.js)

Express es un framework para Node.js que permite crear servidores web y APIs de manera sencilla y flexible, siendo su objetivo principal es manejar solicitudes HTTP, definir rutas y centralizar la lógica que no debería ejecutarse en el navegador del usuario.

Express se usa habitualmente como capa intermedia de control, encargada de validar datos, aplicar reglas de negocio y responder a las peticiones del frontend.

### Motivación y justificación

Actualmente, en Emití gran parte de las validaciones y decisiones importantes se realizan directamente en el navegador, dentro de archivos como script.js, lo que implica que reglas críticas del sistema pueden ser manipuladas o incluso evitadas desde el lado del cliente.
Express permitiría centralizar las reglas de negocio y validaciones importantes, asegurando que el flujo del sistema sea consistente y seguro, independientemente de cómo se comporte la interfaz.

En lugar de enfocarse únicamente en persistencia, Express aportaría además valor como validador de datos.

### Nivel de dificultad de adaptación

* Esfuerzo: Medio. La adaptación no requiere modificar toda la interfaz, sino agregar una capa intermedia que reciba y valide la información antes de continuar el flujo del sistema.
* Curva de aprendizaje: Moderada. Requiere comprender conceptos básicos de HTTP (POST, GET), manejo de rutas, envío y recepción de datos en formato JSON
* Cambios requeridos: Identificar validaciones críticas actualmente dispersas en el frontend, centralizar esas validaciones en rutas de Express y ajustar el frontend para consumir las respuestas del servidor

### Ejemplo de código – “Antes y Después”
* Antes (Vanilla JavaScript – validaciones en el navegador)

En la versión actual de Emití, la validación del producto y el precio se realiza directamente en el navegador, dentro del controlador principal del DOM:

<!--Extracto tomado del archivo js/script.js, línea 876-->

```javascript
if (!prodOk || !precOk) {
  mostrarToast(
    "Completá un producto y un precio válido (> 0) antes de agregar.",
    "danger"
  );
  return;
}
```
En este enfoque la validación depende completamente del comportamiento del cliente.

* Después (Implementación conceptual con Express – validaciones centralizadas)
 Con Express, la misma regla de validación se traslada al servidor:

```javascript
app.post("/api/items/validar", (req, res) => {
  const { producto, precio } = req.body;

  if (!producto || producto.trim().length === 0) {
    return res.status(400).json({
      error: "El producto es obligatorio"
    });
  }

  if (isNaN(precio) || precio <= 0) {
    return res.status(400).json({
      error: "El precio debe ser mayor a cero"
    });
  }

  res.json({ estado: "Ítem válido para agregar a la factura" });
});
```

En este enfoque las reglas se aplican en un único lugar, el frontend solo consume el resultado de la validación, y se refuerza la seguridad y coherencia del sistema

* Conclusión

Express permitiría fortalecer Emití mediante la centralización de validaciones y reglas de negocio, reduciendo la dependencia del navegador y mejorando el control del flujo general del sistema.

Más allá de la persistencia de datos, su aporte principal consiste en garantizar que las operaciones críticas respeten reglas consistentes, preparando al proyecto para una arquitectura más robusta y escalable.