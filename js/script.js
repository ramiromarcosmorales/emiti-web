// ==============================================================================
// EMITÍ - CONTROLADOR GLOBAL (UI + DOM + EVENTOS)
// Maneja la lógica completa de index.html, nueva-factura.html, facturas.html y configuracion.html
// ==============================================================================

import { SistemaFacturacion } from "./models/SistemaFacturacion.js";
import { Cliente } from "./models/Cliente.js";
import { ItemFactura } from "./models/ItemFactura.js";
import { Impuesto } from "./models/Impuesto.js";
import { Validador } from "./models/Validador.js";

// ===============================
// ESTADO GLOBAL Y CONFIGURACIÓN
// ===============================
const sistema = new SistemaFacturacion();
sistema.cargarDesdeStorage();

document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  if (!main) return;

  // Detección de página según la clase principal del <main>
  if (main.classList.contains("dashboard")) {
    initDashboard();
  } else if (main.classList.contains("nueva-factura")) {
    initNuevaFactura();
  } else if (main.classList.contains("facturas")) {
    // 🧩 Corre ambas: listado y creación de facturas desde el modal
    initFacturas();
    initNuevaFactura();
  } else if (main.classList.contains("configuracion")) {
    initConfiguracion();
  }
});


// ==============================================================================
// SECCIÓN 1: DASHBOARD (index.html)
// ==============================================================================
function initDashboard() {
  console.log("📊 Dashboard inicializado");

  actualizarMetricas();

  // === EVENTOS DEL MODAL "AÑADIR IMPUESTO" ===
  const formImpuesto = document.getElementById("formImpuesto");
  const guardarImpuestoBtn = document.getElementById("guardarImpuestoBtn");
  const toastImpuesto = document.getElementById("toastImpuesto");
  const toastFactura = document.getElementById("toastFactura");
  const modalImpuesto = document.getElementById("modalImpuesto");

  const toastOk = toastImpuesto ? new bootstrap.Toast(toastImpuesto) : null;
  const toastFacturaOk = toastFactura ? new bootstrap.Toast(toastFactura) : null;

  if (guardarImpuestoBtn && formImpuesto) {
    guardarImpuestoBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombreImpuesto").value.trim();
      const porcentaje = parseFloat(document.getElementById("porcentajeImpuesto").value.trim());

      try {
        if (!Validador.texto(nombre)) throw new Error("El nombre del impuesto es obligatorio.");
        if (!Validador.numero(porcentaje)) throw new Error("El porcentaje debe ser un número válido.");

        const impuesto = new Impuesto({
          id: Date.now(),
          nombre,
          porcentaje,
          activo: true,
        });

        sistema.agregarImpuesto(impuesto);
        sistema.guardarEnStorage();

        const modal = bootstrap.Modal.getInstance(modalImpuesto);
        if (modal) modal.hide();
        if (toastOk) toastOk.show();

        formImpuesto.reset();
        console.log("✅ Impuesto agregado:", impuesto);
      } catch (err) {
        alert("Error al guardar impuesto: " + err.message);
      }
    });
  }

  // === EVENTO DEL MODAL "NUEVA FACTURA" (REUTILIZA MISMO CÓDIGO) ===
  const formFactura = document.querySelector("#modalFactura form");
  const crearFacturaBtn = document.getElementById("crearFacturaBtn");
  let itemsTemporales = [];

  if (formFactura && crearFacturaBtn) {
    crearFacturaBtn.addEventListener("click", (e) => {
      e.preventDefault();

      try {
        const nombre = document.getElementById("clienteFactura").value.trim();
        const cuit = document.getElementById("cuitFactura").value.trim();
        const direccion = document.getElementById("direccionFactura").value.trim();
        const email = document.getElementById("emailFactura").value.trim();
        const telefono = document.getElementById("telefonoFactura").value.trim();
        const tipo = document.getElementById("tipoFactura").value;
        const fecha = document.getElementById("fechaFactura").value;
        const descripcion = document.getElementById("descripcionFactura").value.trim();

        if (!Validador.texto(nombre)) throw new Error("El nombre del cliente es obligatorio.");
        if (!Validador.cuit(cuit)) throw new Error("El CUIT debe tener 11 dígitos numéricos.");
        if (email && !Validador.email(email)) throw new Error("El email no tiene un formato válido.");
        if (telefono && !Validador.telefono(telefono)) throw new Error("El teléfono contiene caracteres inválidos.");
        if (!Validador.texto(descripcion)) throw new Error("La descripción es obligatoria.");

        const productoInput = formFactura.querySelector('input[placeholder="Producto / Ítem"]');
        const precioInput = formFactura.querySelector('input[placeholder="Precio"]');
        if (productoInput?.value.trim() && precioInput?.value.trim()) {
          const item = new ItemFactura({
            producto: productoInput.value.trim(),
            precio: parseFloat(precioInput.value.trim()),
          });
          itemsTemporales.push(item);
        }

        if (itemsTemporales.length === 0) throw new Error("Debe agregar al menos un ítem.");

        const cliente = new Cliente({ nombre, cuit, direccion, email, telefono });
        const factura = sistema.crearFactura({
          cliente,
          tipo,
          fecha,
          descripcion,
          items: itemsTemporales,
        });

        sistema.guardarEnStorage();
        itemsTemporales = [];
        formFactura.reset();

        const modalFactura = bootstrap.Modal.getInstance(document.getElementById("modalFactura"));
        if (modalFactura) modalFactura.hide();
        if (toastFacturaOk) toastFacturaOk.show();

        console.log("✅ Factura creada:", factura);
        actualizarMetricas();
      } catch (err) {
        alert("Error: " + err.message);
      }
    });
  }

  function actualizarMetricas() {
    const metrics = sistema.getMetrics();
    const f = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

    const total = document.getElementById("total-facturas");
    const totalImporte = document.getElementById("importe-total");
    const promedio = document.getElementById("promedio");
    const pagadas = document.getElementById("facturas-pagadas");

    if (total) total.textContent = metrics.cantidad ?? 0;
    if (totalImporte) totalImporte.textContent = f.format(metrics.totalFacturado ?? 0);
    if (promedio)
      promedio.textContent = f.format(
        metrics.cantidad > 0 ? metrics.totalFacturado / metrics.cantidad : 0
      );
    if (pagadas) pagadas.textContent = metrics.pagadas ?? 0;
  }
}

// ==============================================================================
// SECCIÓN 2: NUEVA FACTURA (nueva-factura.html)
// ==============================================================================
function initNuevaFactura() {
  console.log("🧾 Modo: Nueva Factura");
  const formFactura = document.getElementById("formFactura");
  const crearFacturaBtn = document.getElementById("crearFacturaBtn");
  const addItemBtn = document.getElementById("addItemBtn");
  const toastFactura = document.getElementById("toastFactura");
  const toast = toastFactura ? new bootstrap.Toast(toastFactura) : null;
  const modalFactura = document.getElementById("modalFactura");

  let itemsTemporales = [];

  if (addItemBtn) {
    addItemBtn.addEventListener("click", (e) => {
      e.preventDefault();
      try {
        const producto = document.getElementById("productoFactura").value.trim();
        const precio = document.getElementById("precioFactura").value.trim();

        if (!Validador.texto(producto)) throw new Error("El nombre del producto es obligatorio.");
        if (!Validador.numero(precio)) throw new Error("El precio debe ser un número válido mayor a 0.");

        const item = new ItemFactura({ producto, precio });
        itemsTemporales.push(item);

        limpiarCamposItem();
        alert(`Ítem "${producto}" agregado.`);
      } catch (err) {
        alert("Error al agregar ítem: " + err.message);
      }
    });
  }

  if (formFactura && crearFacturaBtn) {
    formFactura.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const nombre = document.getElementById("clienteFactura").value.trim();
        const cuit = document.getElementById("cuitFactura").value.trim();
        const direccion = document.getElementById("direccionFactura").value.trim();
        const email = document.getElementById("emailFactura").value.trim();
        const telefono = document.getElementById("telefonoFactura").value.trim();
        const tipo = document.getElementById("tipoFactura").value;
        const fecha = document.getElementById("fechaFactura").value;
        const descripcion = document.getElementById("descripcionFactura").value.trim();

        if (!Validador.texto(nombre)) throw new Error("El nombre del cliente es obligatorio.");
        if (!Validador.cuit(cuit)) throw new Error("El CUIT debe tener 11 dígitos numéricos.");
        if (email && !Validador.email(email)) throw new Error("El email no tiene un formato válido.");
        if (telefono && !Validador.telefono(telefono)) throw new Error("El teléfono contiene caracteres inválidos.");
        if (!Validador.texto(descripcion)) throw new Error("La descripción es obligatoria.");
        if (itemsTemporales.length === 0) throw new Error("Debe agregar al menos un ítem.");

        const cliente = new Cliente({ nombre, cuit, direccion, email, telefono });
        const factura = sistema.crearFactura({
          cliente,
          tipo,
          fecha,
          descripcion,
          items: itemsTemporales,
        });

        sistema.guardarEnStorage();
        formFactura.reset();
        itemsTemporales = [];

        const modal = bootstrap.Modal.getInstance(modalFactura);
        if (modal) modal.hide();
        if (toast) toast.show();

        console.log("Factura creada:", factura);
      } catch (err) {
        alert("Error: " + err.message);
      }
    });
  }

  function limpiarCamposItem() {
    document.getElementById("productoFactura").value = "";
    document.getElementById("precioFactura").value = "";
  }
}

// ==============================================================================
// SECCIÓN 3: FACTURAS (facturas.html)
// ==============================================================================
function initFacturas() {
  console.log("📄 Modo: Listado de Facturas");

  const contenedor = document.getElementById("lista-facturas");
  if (!contenedor) return;

  renderizarFacturas();

  contenedor.addEventListener("click", (e) => {
    const target = e.target;
    const facturaEl = target.closest("[data-factura-numero]");
    if (!facturaEl) return;

    const numero = facturaEl.dataset.facturaNumero;
    const factura = sistema.getFacturaByNumero(numero);
    if (!factura) return;

    if (target.classList.contains("btn-marcar-pagada")) {
      if (confirm(`¿Confirmas marcar como pagada la Factura N° ${numero}?`)) {
        sistema.marcarPagada(numero);
        sistema.guardarEnStorage();
        renderizarFacturas();
        mostrarToast(`Factura N° ${numero} marcada como pagada.`, "success");
      }
    }

    if (target.classList.contains("btn-eliminar")) {
      if (confirm(`¿Eliminar la Factura N° ${numero}?`)) {
        sistema.eliminarFactura(factura.id);
        renderizarFacturas();
        mostrarToast(`Factura N° ${numero} eliminada.`, "warning");
      }
    }
  });

function renderizarFacturas() {
  const contenedor = document.getElementById("lista-facturas");
  const template = document.getElementById("template-factura");
  contenedor.innerHTML = "";

  const facturas = sistema.listar();
  const f = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

  if (facturas.length === 0) {
    contenedor.innerHTML = `<p class="text-muted text-center mt-3">No hay facturas registradas.</p>`;
    return;
  }

  facturas.forEach((factura) => {
    const clone = template.content.cloneNode(true);
    const card = clone.querySelector(".factura-card");

    // Estado visual
    if (factura.estado === "pagada") {
      card.classList.add("border-success", "bg-light");
      clone.querySelector(".factura-estado").innerHTML = `<span class="badge bg-success">Pagada</span>`;
      const btnPagar = clone.querySelector(".btn-marcar-pagada");
      btnPagar.disabled = true;
      btnPagar.textContent = "Pagada";
      btnPagar.classList.replace("btn-success", "btn-outline-secondary");
    } else {
      card.classList.add("border-warning", "bg-white");
      clone.querySelector(".factura-estado").innerHTML = `<span class="badge bg-warning text-dark">Pendiente</span>`;
    }

    // Datos dinámicos
    clone.querySelector(".factura-numero").textContent = `Factura N° ${factura.numero} (${factura.tipo})`;
    clone.querySelector(".factura-cliente").textContent = factura.cliente.nombre;
    clone.querySelector(".factura-total").textContent = f.format(factura.total);

    // Atributo identificador
    card.dataset.facturaNumero = factura.numero;

    contenedor.appendChild(clone);
  });
}
}

// ==============================================================================
// SECCIÓN 4: CONFIGURACIÓN (configuracion.html)
// ==============================================================================
function initConfiguracion() {
  console.log("⚙️ Modo: Configuración");

  const formImpuesto = document.getElementById("formAgregarImpuesto");
  const guardarBtn = document.getElementById("agregarImpuestoBtn");
  const toastImpuestoOk = document.getElementById("toastImpuestoOk");
  const listaImpuestos = document.querySelector(".list-group"); // lista de impuestos existentes
  const toastImpuesto = toastImpuestoOk ? new bootstrap.Toast(toastImpuestoOk) : null;

  // Función para renderizar todos los impuestos guardados
  function renderizarImpuestos() {
    if (!listaImpuestos) return;
    listaImpuestos.innerHTML = "";

    const impuestos = sistema.impuestos ?? [];
    if (impuestos.length === 0) {
      listaImpuestos.innerHTML = `<div class="list-group-item text-muted">No hay impuestos configurados.</div>`;
      return;
    }

    impuestos.forEach((imp) => {
      const item = document.createElement("div");
      item.classList.add("list-group-item");
      item.innerHTML = `
        <div class="row align-items-center g-2 imp-item">
          <div class="col-12 col-sm d-flex align-items-center gap-2 name-group">
            <div class="form-check m-0 d-flex align-items-center gap-2">
              <input class="form-check-input" type="checkbox" ${imp.activo ? "checked" : ""}>
              <label class="form-check-label fw-semibold m-0">${imp.nombre}</label>
            </div>
            <span class="badge bg-light text-dark px-2 py-1">${imp.porcentaje}%</span>
          </div>
          <div class="col-auto btn-estado-col">
            <button type="button" class="btn-estado ${imp.activo ? "activo" : ""}">
              ${imp.activo ? "Activo" : "Inactivo"}
            </button>
          </div>
          <div class="col-auto ms-sm-auto actions-col d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-light border rounded-pill btn-sm btn-eliminar" data-id="${imp.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>`;
      listaImpuestos.appendChild(item);
    });
  }

  // Evento de agregar nuevo impuesto
  if (formImpuesto && guardarBtn) {
    guardarBtn.addEventListener("click", (e) => {
      e.preventDefault();

      try {
        const nombre = document.getElementById("nuevoNombre").value.trim();
        const porcentaje = parseFloat(document.getElementById("nuevoPorcentaje").value);
        const activo = document.getElementById("btnEstadoNuevo").classList.contains("activo");

        if (!Validador.texto(nombre)) throw new Error("El nombre del impuesto es obligatorio.");
        if (!Validador.numero(porcentaje)) throw new Error("El valor del IVA debe ser un número válido.");

        const nuevoImpuesto = new Impuesto({
          id: Date.now(),
          nombre,
          porcentaje,
          activo,
        });

        sistema.agregarImpuesto(nuevoImpuesto);
        sistema.guardarEnStorage();

        formImpuesto.reset();
        if (toastImpuesto) toastImpuesto.show();
        console.log("✅ Impuesto agregado:", nuevoImpuesto);

        // Actualiza la lista visual
        renderizarImpuestos();
      } catch (err) {
        mostrarToast("Error: " + err.message, "danger");
      }
    });
  }

  renderizarImpuestos();

  // 🗑️ Eliminar impuesto
  if (listaImpuestos) {
    listaImpuestos.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-eliminar");
      if (!btn) return;

      const id = btn.dataset.id;
      if (!id) return;

      // Confirmación opcional
      if (!confirm("¿Seguro que querés eliminar este impuesto?")) return;

      // Filtramos y guardamos
      sistema.impuestos = sistema.impuestos.filter((i) => String(i.id) !== String(id));
      sistema.guardarEnStorage();

      // Vuelve a renderizar la lista
      renderizarImpuestos();

      mostrarToast("Impuesto eliminado correctamente.", "warning");
    });
  }

// ==============================================================================
// UTILIDADES COMUNES
// ==============================================================================
function mostrarToast(mensaje, tipo = "info") {
  const toastContainer = document.querySelector(".toast-container") || crearToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${tipo} border-0 show mb-2`;
  toast.role = "alert";
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${mensaje}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  toastContainer.appendChild(toast);
  new bootstrap.Toast(toast).show();
}

function crearToastContainer() {
  const container = document.createElement("div");
  container.className = "toast-container position-fixed bottom-0 end-0 p-3";
  document.body.appendChild(container);
  return container;
}}
