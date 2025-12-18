# Framework - Express.js (Node.js)

Express.js es el framework más popular para **Node.js**. Permite crear servidores web y APIs REST de manera minimalista y flexible, siendo el estándar para desarrollar el lado backend en aplicaciones JS.

## Motivación y Justificación para Emití

Actualmente, Emití posee toda la lógica en el navegador del usuario y los datos mueren allí. Express.js es necesario para poder transformar el proyecto en un sistema real. 

### Beneficios Clave:
* ***Persistencia Real**: Permite conectar `SistemaFacturacion` con una base de datos real, asegurando que las facturas no se pierdan al borrar el historial.
* **Seguridad**: Validaciones críticas se ejecutan en el servidor, lejos de la manipulación del usuario.
* **API Centralizada**: Expone endpoints (ej. `POST /api/facturas`) que pueden ser consumidos por la web.

## Nivel de Dificultad de Adaptación

* **Esfuerzo**: Alto.
  Implica centralizar la gestión de datos. Actualmente, la lógica y almacenamiento funcionan localmente en el navegador, la adaptación requiere extraer el nucleo para migrarlo hacía una API, separando el procesamiento de datos de la interfaz de usuario.
* **Curva de Aprendizaje**: Alta (requiere conocimientos de HTTP, asincronía y BD).
* **Cambios Requeridos**: Migrar la lógica de negocio de `SistemaFacturacion.js` y `StorageUtils.js` a controladores en el servidor.

## Ejemplo de Código - "Antes y Después"

### Antes (Vanilla JS - Código actual en `SistemaFacturacion.js`)
La creación de factura es síncrona, insegura y local:

```javascript
// Archivo: js/models/SistemaFacturacion.js
crearFactura({ cliente, items, ...otros }) {
    const numero = this.generarNumero();
    
    const factura = new Factura({ numero, cliente, items, ... });

    this.facturas.push(factura);
    this.notificar();
    
    return factura;
}
```

### Después (Implementación con Express.js - Ruta POST)
El servidor recibe la petición, valida y guarda en base de datos de forma asíncrona:

```javascript
router.post('/api/facturas', async (req, res) => {
    try {
        const { cliente, items } = req.body;
        
        const proximoNumero = await FacturaModel.countDocuments() + 1;
        
        const nuevaFactura = new FacturaModel({
            numero: proximoNumero,
            cliente,
            items
        });

        await nuevaFactura.save();

        res.status(201).json({ status: 'ok', data: nuevaFactura });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la factura' });
    }
});
```