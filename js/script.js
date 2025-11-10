// EMITÍ - CONTROLADOR PRINCIPAL (DOM + EVENTOS)


import { SistemaFacturacion } from "./models/SistemaFacturacion.js";
import { Cliente } from "./models/Cliente.js";
import { ItemFactura } from "./models/ItemFactura.js";
import { Impuesto } from "./models/Impuesto.js";

const sistema = new SistemaFacturacion();
sistema.cargarDesdeStorage();

document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  if (!main) return;

  if (main.classList.contains("dashboard")) initDashboard();
  if (main.classList.contains("nueva-factura")) initNuevaFactura();
  if (main.classList.contains("facturas")) {
    initFacturas();
    initNuevaFactura(); // modal compartido
  }
  if (main.classList.contains("configuracion")) initConfiguracion();
});


// DASHBOARD

function initDashboard() {
  actualizarMetricas();

  const formImp = document.getElementById("formImpuesto");
  const guardarImp = document.getElementById("guardarImpuestoBtn");
  const modalImp = document.getElementById("modalImpuesto");
  const toastImp = new bootstrap.Toast(document.getElementById("toastImpuesto"));

  if (formImp && guardarImp) {
    guardarImp.addEventListener("click", (e) => {
      e.preventDefault();

      try {
        const imp = new Impuesto({
          id: Date.now(),
          nombre: formImp.nombreImpuesto.value,
          porcentaje: formImp.porcentajeImpuesto.value,
          activo: true,
        });

        sistema.agregarImpuesto(imp);
        sistema.guardarEnStorage();

        bootstrap.Modal.getInstance(modalImp)?.hide();
        toastImp.show();
        formImp.reset();

      } catch (err) {
        mostrarToast(err.message, "danger");
      }
    });
  }

  // Modal Nueva Factura (dashboard)
  initModalFacturaDashboard();
}

function actualizarMetricas() {
  const m = sistema.getMetrics();
  const f = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

  const total = document.getElementById("total-facturas");
  const totalImporte = document.getElementById("importe-total");
  const promedio = document.getElementById("promedio");
  const pagadas = document.getElementById("facturas-pagadas");

  if (total) total.textContent = m.cantidad;
  if (totalImporte) totalImporte.textContent = f.format(m.totalFacturado);
  if (promedio) promedio.textContent = f.format(m.cantidad ? m.totalFacturado / m.cantidad : 0);
  if (pagadas) pagadas.textContent = m.pagadas;
}

function initModalFacturaDashboard() {
  const form = document.querySelector("#modalFactura form");
  const toastFactura = new bootstrap.Toast(document.getElementById("toastFactura"));
  let itemsTemp = [];

  const productoInput = form?.querySelector('input[placeholder="Producto / Ítem"]');
  const precioInput = form?.querySelector('input[placeholder="Precio"]');

  document.getElementById("crearFacturaBtn")?.addEventListener("click", (e) => {
    e.preventDefault();

    try {
      if (productoInput?.value.trim() && precioInput?.value.trim()) {
        itemsTemp.push(new ItemFactura({
          producto: productoInput.value,
          precio: precioInput.value
        }));
      }

      const cliente = new Cliente({
        nombre: form.clienteFactura.value,
        cuit: form.cuitFactura.value,
        direccion: form.direccionFactura.value,
        email: form.emailFactura.value,
        telefono: form.telefonoFactura.value,
      });

      sistema.crearFactura({
        cliente,
        tipo: form.tipoFactura.value,
        fecha: form.fechaFactura.value,
        descripcion: form.descripcionFactura.value,
        items: itemsTemp,
      });

      sistema.guardarEnStorage();

      itemsTemp = [];
      form.reset();
      bootstrap.Modal.getInstance(document.getElementById("modalFactura"))?.hide();
      toastFactura.show();
      actualizarMetricas();

    } catch (err) {
      mostrarToast(err.message, "danger");
    }
  });
}



// NUEVA FACTURA

function initNuevaFactura() {
  const form = document.getElementById("formFactura");
  if (!form) return;

  const addItemBtn = document.getElementById("addItemBtn");
  const toastFactura = new bootstrap.Toast(document.getElementById("toastFactura"));
  let itemsTemp = [];

  // Agregar ítem al array
  addItemBtn?.addEventListener("click", () => {
    try {
      const producto = document.getElementById("productoFactura").value;
      const precio = document.getElementById("precioFactura").value;

      itemsTemp.push(new ItemFactura({ producto, precio }));

      document.getElementById("productoFactura").value = "";
      document.getElementById("precioFactura").value = "";

      mostrarToast("✔ Ítem agregado", "success");

    } catch (err) {
      mostrarToast(err.message, "danger");
    }
  });

  // Crear factura
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    try {
      const cliente = new Cliente({
        nombre: form.clienteFactura.value,
        cuit: form.cuitFactura.value,
        direccion: form.direccionFactura.value,
        email: form.emailFactura.value,
        telefono: form.telefonoFactura.value,
      });

      sistema.crearFactura({
        cliente,
        tipo: form.tipoFactura.value,
        fecha: form.fechaFactura.value,
        descripcion: form.descripcionFactura.value,
        items: itemsTemp,
      });

      sistema.guardarEnStorage();

      itemsTemp = [];
      form.reset();
      bootstrap.Modal.getInstance(document.getElementById("modalFactura"))?.hide();
      toastFactura.show();

    } catch (err) {
      mostrarToast(err.message, "danger");
    }
  });
}



// FACTURAS

function initFacturas() {
  const cont = document.getElementById("lista-facturas");
  const template = document.getElementById("template-factura");
  if (!cont || !template) return;

  render();

  cont.addEventListener("click", (e) => {
    const card = e.target.closest("[data-factura-numero]");
    if (!card) return;

    const numero = card.dataset.facturaNumero;
    const factura = sistema.getFacturaByNumero(numero);

    if (!factura) return;

    if (e.target.classList.contains("btn-marcar-pagada")) {
      try {
        sistema.marcarPagada(numero);
        sistema.guardarEnStorage();
        render();
        mostrarToast("✔ Factura pagada", "success");
      } catch (err) {
        mostrarToast(err.message, "danger");
      }
    }

    if (e.target.classList.contains("btn-eliminar")) {
      if (!confirm("¿Eliminar factura?")) return;

      sistema.eliminarFactura(factura.id);
      sistema.guardarEnStorage();
      render();
      mostrarToast("✔ Factura eliminada", "warning");
    }
  });

  function render() {
    cont.replaceChildren();

    const facturas = sistema.listar();
    const f = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

    facturas.forEach((factura) => {
      const clone = template.content.cloneNode(true);

      const card = clone.querySelector(".factura-card");
      card.dataset.facturaNumero = factura.numero;

      clone.querySelector(".factura-numero").textContent = `Factura N° ${factura.numero} (${factura.tipo})`;
      clone.querySelector(".factura-cliente").textContent = factura.cliente.nombre;
      clone.querySelector(".factura-total").textContent = f.format(factura.total);
      clone.querySelector(".factura-estado").textContent = factura.estado;

      if (factura.estado === "pagada") {
        clone.querySelector(".btn-marcar-pagada").disabled = true;
      }

      cont.appendChild(clone);
    });
  }
}



// CONFIGURACIÓN (Impuestos) – usando <template-impuesto>

function initConfiguracion() {
  const lista = document.getElementById("lista-impuestos");
  const template = document.getElementById("template-impuesto");
  const form = document.getElementById("formAgregarImpuesto");
  const toastOk = new bootstrap.Toast(document.getElementById("toastImpuestoOk"));

  render();

  form?.agregarImpuestoBtn?.addEventListener("click", () => {
    try {
      const imp = new Impuesto({
        id: Date.now(),
        nombre: form.nuevoNombre.value,
        porcentaje: form.nuevoPorcentaje.value,
        activo: document.getElementById("btnEstadoNuevo").classList.contains("activo"),
      });

      sistema.agregarImpuesto(imp);
      sistema.guardarEnStorage();

      form.reset();
      toastOk.show();
      render();

    } catch (err) {
      mostrarToast(err.message, "danger");
    }
  });

  lista?.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-eliminar");
    if (!btn) return;

    try {
      sistema.eliminarImpuesto(btn.dataset.id);
      sistema.guardarEnStorage();
      render();
      mostrarToast("✔ Impuesto eliminado", "warning");
    } catch (err) {
      mostrarToast(err.message, "danger");
    }
  });

  function render() {
    lista.replaceChildren();

    const impuestos = sistema.impuestos;

    impuestos.forEach((imp) => {
      const clone = template.content.cloneNode(true);

      clone.querySelector(".imp-check").checked = imp.activo;
      clone.querySelector(".imp-nombre").textContent = imp.nombre;
      clone.querySelector(".imp-porcentaje").textContent = `${imp.porcentaje}%`;
      clone.querySelector(".btn-eliminar").dataset.id = imp.id;

      lista.appendChild(clone);
    });
  }
}



// TOAST UTIL

function mostrarToast(msg, tipo = "info") {
  const cont = document.querySelector(".toast-container") || crearToastContainer();

  // Contenedor principal del toast
  const toastEl = document.createElement("div");
  toastEl.classList.add("toast", `text-bg-${tipo}`, "border-0", "show", "mb-2");
  toastEl.setAttribute("role", "alert");

  // Wrapper interno
  const wrap = document.createElement("div");
  wrap.classList.add("d-flex");

  // Cuerpo del mensaje
  const body = document.createElement("div");
  body.classList.add("toast-body");
  body.textContent = msg;

  // Botón de cerrar
  const btn = document.createElement("button");
  btn.classList.add("btn-close", "btn-close-white", "me-2", "m-auto");
  btn.setAttribute("type", "button");
  btn.setAttribute("data-bs-dismiss", "toast");

  // Armar el DOM
  wrap.appendChild(body);
  wrap.appendChild(btn);
  toastEl.appendChild(wrap);
  cont.appendChild(toastEl);

  new bootstrap.Toast(toastEl).show();
}

// Crea un contenedor si no existe
function crearToastContainer() {
  const c = document.createElement("div");
  c.className = "toast-container position-fixed bottom-0 end-0 p-3";
  document.body.appendChild(c);
  return c;
}
