## Datos que se almacenan

### En `localStorage` (persiste)

Se guarda los datos que deben conservarse entre sesiones del usuario, deben permanecer guardados incluso al cerrar el navegador:

| Clase | Que se guarda | Descripcion |
|--------|----------------|-------------|
| `SistemaFacturacion` | Estado completo del sistema | Contiene las listas de facturas, clientes, impuestos y configuracion general. |
| `Factura` | Historial de facturas emitidas | Cada factura confirmada con cliente, items, subtotal, IVA y total. |
| `Cliente` | Listado de clientes registrados | Se mantiene la informacion de los clientes para reutilizarlos en futuras facturas. |
| `Impuesto` | Impuestos definidos por el usuario | Incluye nombre, porcentaje y estado (activo/inactivo). |
| `Config` (propiedad de `SistemaFacturacion`) | Parámetros globales | IVA predeterminado y moneda. |

---

### En `sessionStorage` (temporal)

Se guardan los datos momentaneos o de trabajo, que solo se usan mientras el usuario mantiene abierta la pestaña o ventana.  
Sirven para formularios, borradores y vistas previas.

| Contexto | Que se guarda | Descripcion |
|-----------|----------------|-------------|
| `Factura` (en creacion) | Factura en curso | Datos del comprobante antes de ser emitido. |
| `ItemFactura` | Items temporales de la factura | Elementos agregados al comprobante antes de confirmarlo. |
| `Cliente` | Cliente temporal | Cliente seleccionado en el formulario actual. |
| `Interfaz Facturas` | Filtros y busqueda | Texto de busqueda o estado de filtro aplicado. |
| `Interfaz Facturas` | Vista previa de factura | Totales y calculos antes de emitir. |

---

## Estructura de claves

| Clave | Tipo de almacenamiento | Descripcion |
|--------|------------------------|--------------|
| `app:facturacion:sistema` | localStorage | Estado completo del sistema (facturas, clientes, impuestos y configuracion). |
| `app:facturacion:historial` | localStorage | Historial de facturas emitidas y guardadas. |
| `app:clientes:listado` | localStorage | Listado de clientes registrados. |
| `app:configuracion:impuestos` | localStorage | Impuestos creados por el usuario. |
| `app:configuracion:parametros` | localStorage | Parametros generales (IVA y moneda). |
| `app:facturacion:actual` | sessionStorage | Factura en curso mientras se completa el formulario. |
| `app:facturacion:items-temp` | sessionStorage | Items agregados temporalmente antes de emitir. |
| `app:facturacion:cliente-temp` | sessionStorage | Cliente seleccionado de forma temporal. |
| `app:facturacion:filtros` | sessionStorage | Texto de busqueda o estado de filtro aplicado. |
| `app:facturacion:preview` | sessionStorage | Datos y totales mostrados en la vista previa. |

## Formato de datos (Schemas JSON)

### Factura:  `app:facturacion:historial`
Cada factura contiene los datos del cliente, los items cargados y los totales. Este formato se usa para guardar el historial de facturas emitidas y tambien para la factura en curso.

```json
{
  "id": 1,
  "numero": "0001-000001",
  "cliente": {
    "nombre": "Juan Perez",
    "cuit": "20123456789",
    "direccion": "Av. Corrientes 1234",
    "email": "juan@email.com",
    "telefono": "011-1234-5678"
  },
  "tipo": "A",
  "fecha": "2025-01-01",
  "descripcion": "Servicios de consultoria",
  "items": [
    { "producto": "Consultoria IT", "precio": 15000 }
  ],
  "subtotal": 15000,
  "iva": 3150,
  "total": 18150,
  "estado": "Pagada"
}
```

### Cliente: `app:clientes:listado`
Guarda los datos basicos de cada cliente registrado en el sistema.
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "cuit": "20123456789",
  "direccion": "Av. Corrientes 1234",
  "email": "juan@email.com",
  "telefono": "011-1234-5678"
}
```
### Impuesto: `app:configuracion:impuestos`
Cada impuesto definido por el usuario se guarda con su nombre, porcentaje y estado.
```json
{
  "id": 1,
  "nombre": "IVA",
  "porcentaje": 21,
  "activo": true
}
```

### Configuracion: `app:configuracion:parametros`
Guarda los parametros generales del sistema, como el IVA predeterminado y la moneda de trabajo.

```json
{
  "iva": 21,
  "moneda": "ARS",
  "empresa": "Mi Empresa SRL",
  "cuit": "30-12345678-9",
  "direccion": "Av. Principal 123",
  "telefono": "011-1234-5678",
  "email": "contacto@miempresa.com"
}
```

## Diferencia entre *localStorage* y *sessionStorage* en el proyecto

En nuestro proyecto *Emití Web* se utiliza **localStorage** para guardar la informacion permanente del sistema.  Los datos almacenados en este espacio se mantienen incluso si el usuario cierra y vuelve a abrir el navegador.  Aca se guardan las facturas emitidas, la configuracion general, los impuestos y los clientes registrados.   

Asimismo, tambien utiliza **sessionStorage** para manejar datos temporales o de trabajo, que solo deben conservarse mientras el usuario mantiene abierta la pestaña o ventana actual.  Al cerrar la sesion del navegador, toda la informacion guardada en este espacio se elimina automaticamente.  Se usa, por ejemplo, para almacenar la factura que se esta creando, los filtros de busqueda aplicados en la interfaz y los datos de vista previa antes de emitir una factura.

Por lo tanto, se eligio guardar facturas, clientes, impuestos y configuracion en localStorage porque son datos de negocio que el usuario espera ver cada vez que entra al sistema. En cambio, los datos de factura en curso, filtros y vista previa se guardan en sessionStorage porque son estados de pantalla que no hace falta recuperar en otra sesion.

## Ejemplos de uso

### Guardar datos persistentes

Cuando el usuario crea una nueva factura o modifica la configuración, el sistema guarda los datos en **localStorage** para que permanezcan disponibles entre sesiones.

```js

//Ejemplos Ilustrativos
// Guardar todas las facturas emitidas
StorageUtil.guardar("app:facturacion:historial", sistema.facturas.map(f => f.toJSON()), "local");

// Guardar los impuestos configurados
StorageUtil.guardar("app:configuracion:impuestos", sistema.impuestos.map(i => i.toJSON()), "local");

// Guardar la configuración general (IVA, moneda, empresa)
StorageUtil.guardar("app:configuracion:parametros", sistema.config, "local");

//Ejemplo REAL tomado de js/models/SistemaFacturacion.js

const data = sistema.toJSON();
StorageUtil.guardar("app:facturacion:sistema", data, "local");
```

### Recuperar datos del sistema

Permite que el usuario encuentre toda su informacion disponible sin necesidad de volver a cargarla.

```js
// Ejemplo REAL tomado de js/models/SistemaFacturacion.js
const data = StorageUtil.obtener("app:facturacion:sistema", "local");

if (data) {
  sistema.facturas  = (data.facturas  ?? []).map(Factura.fromJSON);
  sistema.impuestos = (data.impuestos ?? []).map(Impuesto.fromJSON);
  sistema.config    = data.config ?? null;
}
```

### Guardar datos temporales

Durante la creación de una factura, se usan claves de sessionStorage para guardar informacion temporal que solo existe mientras el usuario tiene la pestaña abierta.
```js
// Ejemplo ILUSTRATIVO basado en las funciones del módulo StorageUtil
// Guardar la factura que se está creando
StorageUtil.guardar("app:facturacion:actual", facturaEnCurso.toJSON(), "session");

// Guardar los ítems agregados temporalmente
StorageUtil.guardar("app:facturacion:items-temp", items, "session");
```
### Eliminar datos persistentes

Este es el comportamiento real del sistema: al borrar los datos de facturación, el sistema elimina solamente la clave correspondiente y reinicia las estructuras internas.

```js
// Ejemplo REAL tomado de js/models/SistemaFacturacion.js
StorageUtil.eliminar("app:facturacion:sistema", "local");

sistema.facturas  = [];
sistema.impuestos = [];
sistema.config    = null;
```


### Eliminar datos temporales

Una vez que la factura fue emitida o el usuario cierra el formulario, los datos temporales deben eliminarse del navegador para evitar inconsistencias.
```js
// Ejemplo ILUSTRATIVO basado en las funciones del módulo StorageUtil
StorageUtil.eliminar("app:facturacion:actual", "session");
StorageUtil.eliminar("app:facturacion:items-temp", "session");
```

### Limpiar todos los datos

El sistema también puede utilizar la función limpiar() del módulo StorageUtil para borrar todo el contenido del tipo de almacenamiento elegido, se usa, por ejemplo, al reiniciar el sistema o restablecer la configuración.
```js
//Ejemplo ILUSTRATIVO
StorageUtil.limpiar("local");   // Limpia todo el localStorage
StorageUtil.limpiar("session"); // Limpia todo el sessionStorage
```