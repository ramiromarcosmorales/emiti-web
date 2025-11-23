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
    const nombreInput = document.getElementById("nombreImpuesto");
    const porcentajeInput = document.getElementById("porcentajeImpuesto");

    // Función de validación visual
    function validarCampoUI(input, esValido) {
      if (!input) return;
      if (esValido) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
      } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
      }
    }

    // Validación en tiempo real
    if (nombreInput) {
      nombreInput.addEventListener("input", () => {
        const ok = nombreInput.value.trim().length >= 3;
        validarCampoUI(nombreInput, ok);
      });
    }

    if (porcentajeInput) {
      porcentajeInput.addEventListener("input", () => {
        const v = Number(porcentajeInput.value);
        const ok = !isNaN(v) && v > 0 && v <= 100;
        validarCampoUI(porcentajeInput, ok);
      });
    }

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
        
        // Limpiar clases de validación
        if (nombreInput) nombreInput.classList.remove("is-valid", "is-invalid");
        if (porcentajeInput) porcentajeInput.classList.remove("is-valid", "is-invalid");

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
  if (!form) return;
  
  const toastFactura = new bootstrap.Toast(document.getElementById("toastFactura"));
  let itemsTemp = [];

  const productoInput = document.getElementById("productoFacturaModal");
  const precioInput = document.getElementById("precioFacturaModal");
  const addItemBtn = document.getElementById("addItemBtnModal");
  const crearBtn = document.getElementById("crearFacturaBtn");

  // Validación en tiempo real de campos del formulario
  const clienteInput = document.getElementById("clienteFactura");
  const cuitInput = document.getElementById("cuitFactura");
  const direccionInput = document.getElementById("direccionFactura");
  const emailInput = document.getElementById("emailFactura");
  const telefonoInput = document.getElementById("telefonoFactura");
  const fechaInput = document.getElementById("fechaFactura");
  const descripcionInput = document.getElementById("descripcionFactura");

  // Función de validación visual
  function validarCampoUI(input, esValido) {
    if (!input) return;
    if (esValido) {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }
  }

  // Validación Cliente
  if (clienteInput) {
    clienteInput.addEventListener("input", () => {
      const ok = clienteInput.value.trim().length >= 3;
      validarCampoUI(clienteInput, ok);
    });
  }

  // Validación CUIT (exactamente 11 dígitos)
  if (cuitInput) {
    cuitInput.addEventListener("input", () => {
      const cuitLimpio = cuitInput.value.replace(/[-.\s]/g, "");
      const ok = /^\d{11}$/.test(cuitLimpio);
      validarCampoUI(cuitInput, ok);
    });
  }

  // Validación Dirección
  if (direccionInput) {
    direccionInput.addEventListener("input", () => {
      const ok = direccionInput.value.trim().length > 0;
      validarCampoUI(direccionInput, ok);
    });
  }

  // Validación Email
  if (emailInput) {
    emailInput.addEventListener("input", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const ok = emailRegex.test(emailInput.value.trim());
      validarCampoUI(emailInput, ok);
    });
  }

  // Validación Teléfono
  if (telefonoInput) {
    telefonoInput.addEventListener("input", () => {
      const telefonoRegex = /^[0-9+\-\s]{6,20}$/;
      const ok = telefonoRegex.test(telefonoInput.value.trim());
      validarCampoUI(telefonoInput, ok);
    });
  }

  // Validación Fecha
  if (fechaInput) {
    fechaInput.addEventListener("input", () => {
      const ok = fechaInput.value.trim().length > 0;
      validarCampoUI(fechaInput, ok);
    });
  }

  // Validación Descripción
  if (descripcionInput) {
    descripcionInput.addEventListener("input", () => {
      const ok = descripcionInput.value.trim().length >= 3;
      validarCampoUI(descripcionInput, ok);
    });
  }

  // Validación en tiempo real de ítems
  if (productoInput) {
    productoInput.addEventListener("input", () => {
      const ok = productoInput.value.trim().length > 0;
      validarCampoUI(productoInput, ok);
    });
  }

  if (precioInput) {
    precioInput.addEventListener("input", () => {
      const v = Number(precioInput.value);
      const ok = !isNaN(v) && v > 0;
      validarCampoUI(precioInput, ok);
    });
  }

  // Función para renderizar la lista de ítems
  const listaItems = document.getElementById("listaItemsAgregadosModal");
  function renderItemsList() {
    if (!listaItems) return;
    
    listaItems.innerHTML = "";
    
    if (itemsTemp.length === 0) {
      listaItems.innerHTML = '<p class="text-muted small mb-0">No hay ítems agregados aún.</p>';
      return;
    }

    const f = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
    const listGroup = document.createElement("div");
    listGroup.className = "list-group";

    itemsTemp.forEach((item, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = "list-group-item d-flex justify-content-between align-items-center";
      
      itemEl.innerHTML = `
        <div class="flex-grow-1">
          <strong>${item.producto}</strong>
          <br>
          <small class="text-muted">${f.format(item.precio)}</small>
        </div>
        <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-item" data-index="${index}">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;
      
      listGroup.appendChild(itemEl);
    });

    listaItems.appendChild(listGroup);

    // Agregar event listeners para eliminar ítems
    listaItems.querySelectorAll(".btn-eliminar-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        itemsTemp.splice(index, 1);
        renderItemsList();
        mostrarToast("Ítem eliminado", "info");
      });
    });
  }

  // Inicializar lista vacía
  renderItemsList();

  // Botón agregar ítem
  if (addItemBtn) {
    addItemBtn.addEventListener("click", () => {
      try {
        if (!productoInput || !precioInput) return;

        const producto = productoInput.value.trim();
        const precioNum = Number(precioInput.value);

        const prodOk = producto.length > 0;
        const precOk = !isNaN(precioNum) && precioNum > 0;

        validarCampoUI(productoInput, prodOk);
        validarCampoUI(precioInput, precOk);

        if (!prodOk || !precOk) {
          mostrarToast("Completá un producto y un precio válido (> 0) antes de agregar.", "danger");
          return;
        }

        itemsTemp.push(new ItemFactura({ producto, precio: precioNum }));
        renderItemsList();

        productoInput.value = "";
        precioInput.value = "";
        productoInput.classList.remove("is-valid", "is-invalid");
        precioInput.classList.remove("is-valid", "is-invalid");

        mostrarToast("✔ Ítem agregado", "success");
      } catch (err) {
        mostrarToast(err.message, "danger");
      }
    });
  }

  // Botón crear factura
  if (crearBtn) {
    crearBtn.addEventListener("click", (e) => {
      e.preventDefault();

      try {
        if (itemsTemp.length === 0) {
          mostrarToast("La factura debe tener al menos un ítem agregado.", "danger");
          return;
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
        renderItemsList();
        form.reset();
        // Limpiar clases de validación
        [clienteInput, cuitInput, direccionInput, emailInput, telefonoInput, fechaInput, descripcionInput, productoInput, precioInput].forEach(input => {
          if (input) input.classList.remove("is-valid", "is-invalid");
        });

        bootstrap.Modal.getInstance(document.getElementById("modalFactura"))?.hide();
        toastFactura.show();
        actualizarMetricas();

      } catch (err) {
        mostrarToast(err.message, "danger");
      }
    });
  }
}



// NUEVA FACTURA

function initNuevaFactura() {
  const form = document.getElementById("formFactura");
  if (!form) return;

  const addItemBtn = document.getElementById("addItemBtn");
  const toastFactura = new bootstrap.Toast(document.getElementById("toastFactura"));
  let itemsTemp = [];

  const productoInput = document.getElementById("productoFactura");
  const precioInput = document.getElementById("precioFactura");

  // Función de validación visual
  function validarCampoUI(input, esValido) {
    if (!input) return;
    if (esValido) {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }
  }

  // Validación en tiempo real de campos del formulario
  const clienteInput = document.getElementById("clienteFactura");
  const cuitInput = document.getElementById("cuitFactura");
  const direccionInput = document.getElementById("direccionFactura");
  const emailInput = document.getElementById("emailFactura");
  const telefonoInput = document.getElementById("telefonoFactura");
  const fechaInput = document.getElementById("fechaFactura");
  const descripcionInput = document.getElementById("descripcionFactura");

  // Validación Cliente
  if (clienteInput) {
    clienteInput.addEventListener("input", () => {
      const ok = clienteInput.value.trim().length >= 3;
      validarCampoUI(clienteInput, ok);
    });
  }

  // Validación CUIT (exactamente 11 dígitos)
  if (cuitInput) {
    cuitInput.addEventListener("input", () => {
      const cuitLimpio = cuitInput.value.replace(/[-.\s]/g, "");
      const ok = /^\d{11}$/.test(cuitLimpio);
      validarCampoUI(cuitInput, ok);
    });
  }

  // Validación Dirección
  if (direccionInput) {
    direccionInput.addEventListener("input", () => {
      const ok = direccionInput.value.trim().length > 0;
      validarCampoUI(direccionInput, ok);
    });
  }

  // Validación Email
  if (emailInput) {
    emailInput.addEventListener("input", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const ok = emailRegex.test(emailInput.value.trim());
      validarCampoUI(emailInput, ok);
    });
  }

  // Validación Teléfono
  if (telefonoInput) {
    telefonoInput.addEventListener("input", () => {
      const telefonoRegex = /^[0-9+\-\s]{6,20}$/;
      const ok = telefonoRegex.test(telefonoInput.value.trim());
      validarCampoUI(telefonoInput, ok);
    });
  }

  // Validación Fecha
  if (fechaInput) {
    fechaInput.addEventListener("input", () => {
      const ok = fechaInput.value.trim().length > 0;
      validarCampoUI(fechaInput, ok);
    });
  }

  // Validación Descripción
  if (descripcionInput) {
    descripcionInput.addEventListener("input", () => {
      const ok = descripcionInput.value.trim().length >= 3;
      validarCampoUI(descripcionInput, ok);
    });
  }

  // Validación en tiempo real de ítems
  if (productoInput) {
    productoInput.addEventListener("input", () => {
      const ok = productoInput.value.trim().length > 0;
      validarCampoUI(productoInput, ok);
    });
  }

  if (precioInput) {
    precioInput.addEventListener("input", () => {
      const v = Number(precioInput.value);
      const ok = !isNaN(v) && v > 0;
      validarCampoUI(precioInput, ok);
    });
  }

  // Función para renderizar la lista de ítems
  const listaItems = document.getElementById("listaItemsAgregados");
  function renderItemsList() {
    if (!listaItems) return;
    
    listaItems.innerHTML = "";
    
    if (itemsTemp.length === 0) {
      listaItems.innerHTML = '<p class="text-muted small mb-0">No hay ítems agregados aún.</p>';
      return;
    }

    const f = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
    const listGroup = document.createElement("div");
    listGroup.className = "list-group";

    itemsTemp.forEach((item, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = "list-group-item d-flex justify-content-between align-items-center";
      
      itemEl.innerHTML = `
        <div class="flex-grow-1">
          <strong>${item.producto}</strong>
          <br>
          <small class="text-muted">${f.format(item.precio)}</small>
        </div>
        <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-item" data-index="${index}">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;
      
      listGroup.appendChild(itemEl);
    });

    listaItems.appendChild(listGroup);

    // Agregar event listeners para eliminar ítems
    listaItems.querySelectorAll(".btn-eliminar-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        itemsTemp.splice(index, 1);
        renderItemsList();
        mostrarToast("Ítem eliminado", "info");
      });
    });
  }

  // Inicializar lista vacía
  renderItemsList();

  // Agregar ítem al array
  if (addItemBtn) {
    addItemBtn.addEventListener("click", () => {
      try {
        if (!productoInput || !precioInput) return;

        const producto = productoInput.value.trim();
        const precioNum = Number(precioInput.value);

        const prodOk = producto.length > 0;
        const precOk = !isNaN(precioNum) && precioNum > 0;

        validarCampoUI(productoInput, prodOk);
        validarCampoUI(precioInput, precOk);

        if (!prodOk || !precOk) {
          mostrarToast("Completá un producto y un precio válido (> 0) antes de agregar.", "danger");
          return;
        }

        itemsTemp.push(new ItemFactura({ producto, precio: precioNum }));
        renderItemsList();

        productoInput.value = "";
        precioInput.value = "";
        productoInput.classList.remove("is-valid", "is-invalid");
        precioInput.classList.remove("is-valid", "is-invalid");

        mostrarToast("✔ Ítem agregado", "success");

      } catch (err) {
        mostrarToast(err.message, "danger");
      }
    });
  }

  // Crear factura
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    try {
      if (itemsTemp.length === 0) {
        mostrarToast("La factura debe tener al menos un ítem agregado.", "danger");
        return;
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
      renderItemsList();
      form.reset();
      // Limpiar clases de validación
      [clienteInput, cuitInput, direccionInput, emailInput, telefonoInput, fechaInput, descripcionInput, productoInput, precioInput].forEach(input => {
        if (input) input.classList.remove("is-valid", "is-invalid");
      });

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

    if (e.target.classList.contains("btn-ver-detalles")) {
      mostrarDetallesFactura(factura);
    }

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

      const cardEl = clone.querySelector(".factura-card");
      cardEl.dataset.facturaNumero = factura.numero;

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

  // Función para mostrar detalles de factura
  function mostrarDetallesFactura(factura) {
    const modalBody = document.getElementById("detallesFacturaBody");
    const modal = new bootstrap.Modal(document.getElementById("modalDetallesFactura"));
    const f = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
    const fechaFormateada = new Date(factura.fecha).toLocaleDateString("es-AR");

    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="row g-3">
        <div class="col-12">
          <h6 class="text-muted mb-1">Número de Factura</h6>
          <p class="mb-0 fw-bold">${factura.numero} (${factura.tipo})</p>
        </div>

        <div class="col-12">
          <h6 class="text-muted mb-1">Fecha</h6>
          <p class="mb-0">${fechaFormateada}</p>
        </div>

        <div class="col-12">
          <h6 class="text-muted mb-1">Cliente</h6>
          <p class="mb-0 fw-bold">${factura.cliente.nombre}</p>
          <p class="mb-0 small text-muted">CUIT: ${factura.cliente.cuit}</p>
          <p class="mb-0 small text-muted">${factura.cliente.direccion}</p>
          <p class="mb-0 small text-muted">${factura.cliente.email} | ${factura.cliente.telefono}</p>
        </div>

        <div class="col-12">
          <h6 class="text-muted mb-1">Descripción</h6>
          <p class="mb-0">${factura.descripcion || "Sin descripción"}</p>
        </div>

        <div class="col-12">
          <h6 class="text-muted mb-2">Productos / Ítems</h6>
          <div class="table-responsive">
            <table class="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th class="text-end">Cantidad</th>
                  <th class="text-end">Precio Unit.</th>
                  <th class="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${factura.items.map(item => `
                  <tr>
                    <td>${item.producto}</td>
                    <td class="text-end">${item.cantidad}</td>
                    <td class="text-end">${f.format(item.precio)}</td>
                    <td class="text-end">${f.format(item.subtotal())}</td>
                  </tr>
                `).join("")}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-end fw-bold">Subtotal:</td>
                  <td class="text-end fw-bold">${f.format(factura.calcularSubtotal())}</td>
                </tr>
                <tr>
                  <td colspan="3" class="text-end">IVA (${factura.tasaIVA}%):</td>
                  <td class="text-end">${f.format(factura.calcularIVA())}</td>
                </tr>
                <tr class="table-success">
                  <td colspan="3" class="text-end fw-bold">Total:</td>
                  <td class="text-end fw-bold">${f.format(factura.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="col-12">
          <h6 class="text-muted mb-1">Estado</h6>
          <span class="badge ${factura.estado === "pagada" ? "bg-success" : "bg-warning"}">${factura.estado}</span>
        </div>
      </div>
    `;

    modal.show();
  }
}



// CONFIGURACIÓN (Impuestos) – usando <template-impuesto>

function initConfiguracion() {
  const lista = document.getElementById("lista-impuestos");
  const template = document.getElementById("template-impuesto");
  const form = document.getElementById("formAgregarImpuesto");
  const toastOk = new bootstrap.Toast(document.getElementById("toastImpuestoOk"));
  const btnEstadoNuevo = document.getElementById("btnEstadoNuevo");
  const btnAgregar = document.getElementById("agregarImpuestoBtn");

  // Botón ACTIVO / INACTIVO
  if (btnEstadoNuevo) {
    btnEstadoNuevo.addEventListener("click", () => {
      btnEstadoNuevo.classList.toggle("activo");
      btnEstadoNuevo.classList.toggle("inactivo");
      btnEstadoNuevo.textContent = btnEstadoNuevo.classList.contains("activo") ? "Activo" : "Inactivo";
    });
  }

  // Validación en tiempo real
  const nombreInput = document.getElementById("nuevoNombre");
  const porcentajeInput = document.getElementById("nuevoPorcentaje");

  function validarCampoUI(input, esValido) {
    if (!input) return;
    if (esValido) {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }
  }

  if (nombreInput) {
    nombreInput.addEventListener("input", () => {
      const ok = nombreInput.value.trim().length >= 3;
      validarCampoUI(nombreInput, ok);
    });
  }

  if (porcentajeInput) {
    porcentajeInput.addEventListener("input", () => {
      const v = Number(porcentajeInput.value);
      const ok = !isNaN(v) && v > 0 && v <= 100;
      validarCampoUI(porcentajeInput, ok);
    });
  }

  render();

  if (btnAgregar) {
    btnAgregar.addEventListener("click", () => {
      try {
        sistema.crearImpuestoDesdeForm({
          nombre: form.nuevoNombre.value.trim(),
          porcentaje: Number(form.nuevoPorcentaje.value),
          activo: btnEstadoNuevo?.classList.contains("activo") ?? true,
        });

        form.reset();
        // Volver a dejar el botón "Activo"
        if (btnEstadoNuevo) {
          btnEstadoNuevo.classList.add("activo");
          btnEstadoNuevo.classList.remove("inactivo");
          btnEstadoNuevo.textContent = "Activo";
        }
        // Limpiar clases de validación
        if (nombreInput) nombreInput.classList.remove("is-valid", "is-invalid");
        if (porcentajeInput) porcentajeInput.classList.remove("is-valid", "is-invalid");

        toastOk.show();
        render();

      } catch (err) {
        mostrarToast(err.message, "danger");
      }
    });
  }

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
      clone.querySelector(".imp-porcentaje").textContent = imp.porcentaje;
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