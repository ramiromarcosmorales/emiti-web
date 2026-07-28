# Framework - Angular

## Breve reseña

Angular es un framework de frontend desarrollado y mantenido por Google, basado en TypeScript. A diferencia de librerías como React, Angular es un framework "completo" (opinado): incluye de forma nativa enrutamiento, inyección de dependencias, formularios reactivos, HTTP client y herramientas de testing, sin necesidad de sumar librerías externas para armar la arquitectura básica de una aplicación. Su unidad fundamental es el **componente**, compuesto por una clase TypeScript, una plantilla HTML y estilos propios, organizados en **módulos**.

## Motivación y justificación

El proyecto Emití ya está construido con una base sólida de Programación Orientada a Objetos: las clases `Cliente`, `Factura`, `ItemFactura` e `Impuesto` (en `js/models/`) validan sus propios datos en el constructor, exponen métodos de negocio (`subtotal()`, `calcularIVA()`, `marcarPagada()`) y se serializan con `toJSON()`/`fromJSON()`. Este patrón de "clases con estado y comportamiento propio" es exactamente el modelo mental que usa Angular para sus componentes y servicios.

Además, hoy la sincronización entre datos y vista se resuelve con **manipulación manual del DOM**. Un caso concreto es la función `renderProductosDemo()` en `js/script.js`, que por cada producto:

1. Crea nodos con `document.createElement`.
2. Les asigna clases y contenido a mano.
3. Registra un listener con `addEventListener` dentro de un `forEach`.
4. Los inserta uno por uno con `appendChild`.

Angular reemplaza este patrón con **data binding declarativo** (`*ngFor`, `(click)`), eliminando la construcción manual de nodos y reduciendo el riesgo de "fugas" de listeners cuando la lista se vuelve a renderizar (algo que en el código actual se mitiga llamando a `contenedor.replaceChildren()` antes de cada render, un workaround que Angular no necesita).

## Nivel de dificultad de adaptación

La curva de aprendizaje de Angular es **media-alta** respecto a herramientas más livianas (Vue, Alpine.js), por:

- Necesidad de aprender TypeScript (tipado, decoradores, interfaces).
- Conceptos propios del framework: módulos, componentes, servicios, inyección de dependencias, ciclo de vida de componentes y RxJS para manejo de datos asíncronos.
- Tooling específico (Angular CLI) y reorganización del proyecto en base a su estructura de carpetas por módulos/componentes.

Para el equipo de Emití, sin embargo, la transición conceptual es más simple que para alguien que solo trabajó con JavaScript funcional: las clases de `js/models/` ya validan invariantes en el constructor y separan responsabilidades, que es exactamente el patrón que Angular espera en sus `services`. El mayor esfuerzo estaría en:

- Migrar `SistemaFacturacion` (que hoy actúa como sujeto de un patrón Observer casero, con `suscribir()`/`notificar()`) hacia un servicio Angular con `BehaviorSubject` de RxJS, que resuelve el mismo problema de forma nativa.
- Reescribir las vistas HTML actuales (`facturas.html`, `nueva-factura.html`, etc.) como templates de componentes.
- Reemplazar las funciones `render()` manuales (en `initFacturas`, `initConfiguracion`) por bindings declarativos.

## Ejemplo de código - "Antes y después"

**Antes (Vanilla JavaScript)** — `js/script.js`, línea 12 - 64, función `renderProductosDemo`:

```javascript
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

    const h6 = document.createElement("h6");
    h6.className = "fw-bold";
    h6.textContent = p.nombre;

    const precio = document.createElement("p");
    precio.className = "fw-semibold mb-3";
    precio.textContent = "$" + p.precio.toFixed(2);

    const btn = document.createElement("button");
    btn.className = "btn btn-primary btn-sm mt-auto";
    btn.textContent = "Usar en factura";

    btn.addEventListener("click", () => {
      const inputDesc = document.getElementById("productoFactura");
      const inputPrecio = document.getElementById("precioFactura");
      if (inputDesc) inputDesc.value = p.nombre;
      if (inputPrecio) inputPrecio.value = p.precio;
      mostrarToast("Producto demo cargado en la factura.", "info");
    });

    body.appendChild(h6);
    body.appendChild(precio);
    body.appendChild(btn);
    wrapper.appendChild(body);
    card.appendChild(wrapper);
    contenedor.appendChild(card);
  });
}
```

**Después (Angular)** — el mismo comportamiento como componente, sin manipulación manual del DOM:

```typescript
// productos-demo.component.ts
@Component({
  selector: 'app-productos-demo',
  templateUrl: './productos-demo.component.html'
})
export class ProductosDemoComponent {
  @Input() productos: Producto[] = [];

  constructor(private facturaService: FacturaService, private toast: ToastService) {}

  usarEnFactura(p: Producto): void {
    this.facturaService.setProductoActual(p.nombre, p.precio);
    this.toast.mostrar('Producto demo cargado en la factura.', 'info');
  }
}
```

```html
<!-- productos-demo.component.html -->
<div class="col-12 col-md-6 col-lg-3" *ngFor="let p of productos">
  <div class="card h-100 shadow-sm">
    <div class="card-body d-flex flex-column">
      <h6 class="fw-bold">{{ p.nombre }}</h6>
      <p class="fw-semibold mb-3">${{ p.precio.toFixed(2) }}</p>
      <button class="btn btn-primary btn-sm mt-auto" (click)="usarEnFactura(p)">
        Usar en factura
      </button>
    </div>
  </div>
</div>
```

El `*ngFor` reemplaza el `forEach` + `createElement`, el `(click)` reemplaza el `addEventListener` registrado dentro del bucle, y ya no hace falta llamar manualmente a `replaceChildren()`: Angular se encarga de reconciliar la vista cada vez que cambia el array `productos`.