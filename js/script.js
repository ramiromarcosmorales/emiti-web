// EMITÍ - CONTROLADOR PRINCIPAL (DOM + EVENTOS)


import { SistemaFacturacion } from "./models/SistemaFacturacion.js";
import { Cliente } from "./models/Cliente.js";
import { ItemFactura } from "./models/ItemFactura.js";
import { Impuesto } from "./models/Impuesto.js";
import { StorageObserver} from "./models/StorageObserver.js";

const sistema = new SistemaFacturacion();
sistema.suscribir(new StorageObserver(sistema)); 
sistema.cargarDesdeStorage();

// Función helper para guardar y actualizar UI
function guardarYActualizar(callback) {
  try {
    callback();
    sistema.guardarEnStorage();
    return true;
  } catch (err) {
    mostrarToast(err.message, "danger");
    return false;
  }
}

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

        guardarYActualizar(() => {
          sistema.agregarImpuesto(imp);
        });

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
    
    listaItems.replaceChildren();
    
    if (itemsTemp.length === 0) {
      const p = document.createElement("p");
      p.className = "text-muted small mb-0";
      p.textContent = "No hay ítems agregados aún.";
      listaItems.appendChild(p);
      return;
    }

    const f = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
    const listGroup = document.createElement("div");
    listGroup.className = "list-group";

    itemsTemp.forEach((item, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = "list-group-item d-flex justify-content-between align-items-center";
      
      const contenido = document.createElement("div");
      contenido.className = "flex-grow-1";
      
      const strong = document.createElement("strong");
      strong.textContent = item.producto;
      contenido.appendChild(strong);
      
      const br = document.createElement("br");
      contenido.appendChild(br);
      
      const small = document.createElement("small");
      small.className = "text-muted";
      small.textContent = f.format(item.precio);
      contenido.appendChild(small);
      
      const btnEliminar = document.createElement("button");
      btnEliminar.type = "button";
      btnEliminar.className = "btn btn-sm btn-outline-danger btn-eliminar-item";
      btnEliminar.dataset.index = index;
      
      const icon = document.createElement("i");
      icon.className = "fa-solid fa-trash";
      btnEliminar.appendChild(icon);
      
      btnEliminar.addEventListener("click", () => {
        itemsTemp.splice(index, 1);
        renderItemsList();
        mostrarToast("Ítem eliminado", "info");
      });
      
      itemEl.appendChild(contenido);
      itemEl.appendChild(btnEliminar);
      listGroup.appendChild(itemEl);
    });

    listaItems.appendChild(listGroup);
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

  // Función para validar todos los campos antes de crear la factura
  function validarFormularioCompleto() {
    const errores = [];
    let primerCampoInvalido = null;

    // Limpiar clases de validación previas
    [clienteInput, cuitInput, direccionInput, emailInput, telefonoInput, fechaInput, descripcionInput].forEach(input => {
      if (input) input.classList.remove("is-invalid", "is-valid");
    });

    // Validar Cliente
    if (!clienteInput || clienteInput.value.trim().length < 3) {
      errores.push("El nombre del cliente debe tener al menos 3 caracteres.");
      if (clienteInput) {
        clienteInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = clienteInput;
      }
    } else if (clienteInput) {
      clienteInput.classList.add("is-valid");
    }

    // Validar CUIT
    if (!cuitInput) {
      errores.push("El CUIT es obligatorio.");
    } else {
      const cuitLimpio = cuitInput.value.replace(/[-.\s]/g, "");
      if (!/^\d{11}$/.test(cuitLimpio)) {
        errores.push("El CUIT debe tener exactamente 11 dígitos.");
        cuitInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = cuitInput;
      } else {
        cuitInput.classList.add("is-valid");
      }
    }

    // Validar Dirección
    if (!direccionInput || direccionInput.value.trim().length === 0) {
      errores.push("La dirección es obligatoria.");
      if (direccionInput) {
        direccionInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = direccionInput;
      }
    } else if (direccionInput) {
      direccionInput.classList.add("is-valid");
    }

    // Validar Email
    if (!emailInput) {
      errores.push("El email es obligatorio.");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        errores.push("El email ingresado no tiene un formato válido.");
        emailInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = emailInput;
      } else {
        emailInput.classList.add("is-valid");
      }
    }

    // Validar Teléfono
    if (!telefonoInput) {
      errores.push("El teléfono es obligatorio.");
    } else {
      const telefonoRegex = /^[0-9+\-\s]{6,20}$/;
      if (!telefonoRegex.test(telefonoInput.value.trim())) {
        errores.push("El teléfono contiene caracteres inválidos.");
        telefonoInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = telefonoInput;
      } else {
        telefonoInput.classList.add("is-valid");
      }
    }

    // Validar Fecha
    if (!fechaInput || !fechaInput.value.trim()) {
      errores.push("La fecha es obligatoria.");
      if (fechaInput) {
        fechaInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = fechaInput;
      }
    } else if (fechaInput) {
      fechaInput.classList.add("is-valid");
    }

    // Validar Descripción
    if (!descripcionInput || descripcionInput.value.trim().length < 3) {
      errores.push("La descripción debe tener al menos 3 caracteres.");
      if (descripcionInput) {
        descripcionInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = descripcionInput;
      }
    } else if (descripcionInput) {
      descripcionInput.classList.add("is-valid");
    }

    // Validar Ítems
    if (itemsTemp.length === 0) {
      errores.push("La factura debe tener al menos un ítem agregado.");
    }

    if (errores.length > 0) {
      mostrarToast(errores[0], "danger");
      if (primerCampoInvalido) {
        primerCampoInvalido.focus();
      }
      return false;
    }

    return true;
  }

  // Botón crear factura
  if (crearBtn) {
    crearBtn.addEventListener("click", (e) => {
      e.preventDefault();

      try {
        // Validar todos los campos antes de continuar
        if (!validarFormularioCompleto()) {
          return;
        }

        const cliente = new Cliente({
          nombre: form.clienteFactura.value,
          cuit: form.cuitFactura.value,
          direccion: form.direccionFactura.value,
          email: form.emailFactura.value,
          telefono: form.telefonoFactura.value,
        });

        guardarYActualizar(() => {
          sistema.crearFactura({
            cliente,
            tipo: form.tipoFactura.value,
            fecha: form.fechaFactura.value,
            descripcion: form.descripcionFactura.value,
            items: itemsTemp,
          });
        });

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
  const crearBtn = document.getElementById("crearFacturaBtn");
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
    
    listaItems.replaceChildren();
    
    if (itemsTemp.length === 0) {
      const p = document.createElement("p");
      p.className = "text-muted small mb-0";
      p.textContent = "No hay ítems agregados aún.";
      listaItems.appendChild(p);
      return;
    }

    const f = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
    const listGroup = document.createElement("div");
    listGroup.className = "list-group";

    itemsTemp.forEach((item, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = "list-group-item d-flex justify-content-between align-items-center";
      
      const contenido = document.createElement("div");
      contenido.className = "flex-grow-1";
      
      const strong = document.createElement("strong");
      strong.textContent = item.producto;
      contenido.appendChild(strong);
      
      const br = document.createElement("br");
      contenido.appendChild(br);
      
      const small = document.createElement("small");
      small.className = "text-muted";
      small.textContent = f.format(item.precio);
      contenido.appendChild(small);
      
      const btnEliminar = document.createElement("button");
      btnEliminar.type = "button";
      btnEliminar.className = "btn btn-sm btn-outline-danger btn-eliminar-item";
      btnEliminar.dataset.index = index;
      
      const icon = document.createElement("i");
      icon.className = "fa-solid fa-trash";
      btnEliminar.appendChild(icon);
      
      btnEliminar.addEventListener("click", () => {
        itemsTemp.splice(index, 1);
        renderItemsList();
        mostrarToast("Ítem eliminado", "info");
      });
      
      itemEl.appendChild(contenido);
      itemEl.appendChild(btnEliminar);
      listGroup.appendChild(itemEl);
    });

    listaItems.appendChild(listGroup);
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

  // Función para validar todos los campos antes de crear la factura
  function validarFormularioCompleto() {
    const errores = [];
    let primerCampoInvalido = null;

    // Limpiar clases de validación previas
    [clienteInput, cuitInput, direccionInput, emailInput, telefonoInput, fechaInput, descripcionInput].forEach(input => {
      if (input) input.classList.remove("is-invalid", "is-valid");
    });

    // Validar Cliente
    if (!clienteInput || clienteInput.value.trim().length < 3) {
      errores.push("El nombre del cliente debe tener al menos 3 caracteres.");
      if (clienteInput) {
        clienteInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = clienteInput;
      }
    } else if (clienteInput) {
      clienteInput.classList.add("is-valid");
    }

    // Validar CUIT
    if (!cuitInput) {
      errores.push("El CUIT es obligatorio.");
    } else {
      const cuitLimpio = cuitInput.value.replace(/[-.\s]/g, "");
      if (!/^\d{11}$/.test(cuitLimpio)) {
        errores.push("El CUIT debe tener exactamente 11 dígitos.");
        cuitInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = cuitInput;
      } else {
        cuitInput.classList.add("is-valid");
      }
    }

    // Validar Dirección
    if (!direccionInput || direccionInput.value.trim().length === 0) {
      errores.push("La dirección es obligatoria.");
      if (direccionInput) {
        direccionInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = direccionInput;
      }
    } else if (direccionInput) {
      direccionInput.classList.add("is-valid");
    }

    // Validar Email
    if (!emailInput) {
      errores.push("El email es obligatorio.");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        errores.push("El email ingresado no tiene un formato válido.");
        emailInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = emailInput;
      } else {
        emailInput.classList.add("is-valid");
      }
    }

    // Validar Teléfono
    if (!telefonoInput) {
      errores.push("El teléfono es obligatorio.");
    } else {
      const telefonoRegex = /^[0-9+\-\s]{6,20}$/;
      if (!telefonoRegex.test(telefonoInput.value.trim())) {
        errores.push("El teléfono contiene caracteres inválidos.");
        telefonoInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = telefonoInput;
      } else {
        telefonoInput.classList.add("is-valid");
      }
    }

    // Validar Fecha
    if (!fechaInput || !fechaInput.value.trim()) {
      errores.push("La fecha es obligatoria.");
      if (fechaInput) {
        fechaInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = fechaInput;
      }
    } else if (fechaInput) {
      fechaInput.classList.add("is-valid");
    }

    // Validar Descripción
    if (!descripcionInput || descripcionInput.value.trim().length < 3) {
      errores.push("La descripción debe tener al menos 3 caracteres.");
      if (descripcionInput) {
        descripcionInput.classList.add("is-invalid");
        if (!primerCampoInvalido) primerCampoInvalido = descripcionInput;
      }
    } else if (descripcionInput) {
      descripcionInput.classList.add("is-valid");
    }

    // Validar Ítems
    if (itemsTemp.length === 0) {
      errores.push("La factura debe tener al menos un ítem agregado.");
    }

    if (errores.length > 0) {
      mostrarToast(errores[0], "danger");
      if (primerCampoInvalido) {
        primerCampoInvalido.focus();
      }
      return false;
    }

    return true;
  }

  // Función para procesar la creación de la factura
  function procesarCrearFactura() {
    try {
      // Validar todos los campos antes de continuar
      if (!validarFormularioCompleto()) {
        return;
      }

      const cliente = new Cliente({
        nombre: form.clienteFactura.value,
        cuit: form.cuitFactura.value,
        direccion: form.direccionFactura.value,
        email: form.emailFactura.value,
        telefono: form.telefonoFactura.value,
      });

      if (guardarYActualizar(() => {
        sistema.crearFactura({
          cliente,
          tipo: form.tipoFactura.value,
          fecha: form.fechaFactura.value,
          descripcion: form.descripcionFactura.value,
          items: itemsTemp,
        });
      })) {
        itemsTemp = [];
        renderItemsList();
        form.reset();
        // Limpiar clases de validación
        [clienteInput, cuitInput, direccionInput, emailInput, telefonoInput, fechaInput, descripcionInput, productoInput, precioInput].forEach(input => {
          if (input) input.classList.remove("is-valid", "is-invalid");
        });

        bootstrap.Modal.getInstance(document.getElementById("modalFactura"))?.hide();
        toastFactura.show();
      }
    } catch (err) {
      mostrarToast(err.message, "danger");
    }
  }

  // Crear factura - Event listener para submit del formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    procesarCrearFactura();
  });

  // Crear factura - Event listener para click del botón (cuando está fuera del formulario)
  if (crearBtn) {
    crearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      procesarCrearFactura();
    });
  }
}



// FACTURAS

function initFacturas() {
  const cont = document.getElementById("lista-facturas");
  const template = document.getElementById("template-factura");
  const modalConfirmar = document.getElementById("modalConfirmarEliminar");
  const btnConfirmarEliminar = document.getElementById("confirmarEliminarBtn");
  if (!cont || !template) return;

  let facturaAEliminar = null;

  // Configurar modal de confirmación
  if (btnConfirmarEliminar && modalConfirmar) {
    btnConfirmarEliminar.addEventListener("click", () => {
      if (facturaAEliminar) {
        if (guardarYActualizar(() => {
          sistema.eliminarFactura(facturaAEliminar.id);
        })) {
          render();
          mostrarToast("✔ Factura eliminada", "warning");
          bootstrap.Modal.getInstance(modalConfirmar)?.hide();
          facturaAEliminar = null;
        }
      }
    });
  }

  function mostrarModalConfirmarEliminar(factura) {
    facturaAEliminar = factura;
    const modal = new bootstrap.Modal(modalConfirmar);
    modal.show();
  }

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
      if (guardarYActualizar(() => {
        sistema.marcarPagada(numero);
      })) {
        render();
        mostrarToast("✔ Factura pagada", "success");
      }
    }

    if (e.target.classList.contains("btn-eliminar")) {
      mostrarModalConfirmarEliminar(factura);
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

  // Función para mostrar detalles de factura
  function mostrarDetallesFactura(factura) {
    const modalBody = document.getElementById("detallesFacturaBody");
    const modalEl = document.getElementById("modalDetallesFactura");
    if (!modalBody || !modalEl) return;

    const modal = new bootstrap.Modal(modalEl);
    const f = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
    const fechaFormateada = new Date(factura.fecha).toLocaleDateString("es-AR");

    modalBody.replaceChildren();

    const row = document.createElement("div");
    row.className = "row g-3";

    // Número de Factura
    const colNumero = document.createElement("div");
    colNumero.className = "col-12";
    const h6Numero = document.createElement("h6");
    h6Numero.className = "text-muted mb-1";
    h6Numero.textContent = "Número de Factura";
    const pNumero = document.createElement("p");
    pNumero.className = "mb-0 fw-bold";
    pNumero.textContent = `${factura.numero} (${factura.tipo})`;
    colNumero.appendChild(h6Numero);
    colNumero.appendChild(pNumero);
    row.appendChild(colNumero);

    // Fecha
    const colFecha = document.createElement("div");
    colFecha.className = "col-12";
    const h6Fecha = document.createElement("h6");
    h6Fecha.className = "text-muted mb-1";
    h6Fecha.textContent = "Fecha";
    const pFecha = document.createElement("p");
    pFecha.className = "mb-0";
    pFecha.textContent = fechaFormateada;
    colFecha.appendChild(h6Fecha);
    colFecha.appendChild(pFecha);
    row.appendChild(colFecha);

    // Cliente
    const colCliente = document.createElement("div");
    colCliente.className = "col-12";
    const h6Cliente = document.createElement("h6");
    h6Cliente.className = "text-muted mb-1";
    h6Cliente.textContent = "Cliente";
    const pClienteNombre = document.createElement("p");
    pClienteNombre.className = "mb-0 fw-bold";
    pClienteNombre.textContent = factura.cliente.nombre;
    const pClienteCuit = document.createElement("p");
    pClienteCuit.className = "mb-0 small text-muted";
    pClienteCuit.textContent = `CUIT: ${factura.cliente.cuit}`;
    const pClienteDir = document.createElement("p");
    pClienteDir.className = "mb-0 small text-muted";
    pClienteDir.textContent = factura.cliente.direccion;
    const pClienteContacto = document.createElement("p");
    pClienteContacto.className = "mb-0 small text-muted";
    pClienteContacto.textContent = `${factura.cliente.email} | ${factura.cliente.telefono}`;
    colCliente.appendChild(h6Cliente);
    colCliente.appendChild(pClienteNombre);
    colCliente.appendChild(pClienteCuit);
    colCliente.appendChild(pClienteDir);
    colCliente.appendChild(pClienteContacto);
    row.appendChild(colCliente);

    // Descripción
    const colDesc = document.createElement("div");
    colDesc.className = "col-12";
    const h6Desc = document.createElement("h6");
    h6Desc.className = "text-muted mb-1";
    h6Desc.textContent = "Descripción";
    const pDesc = document.createElement("p");
    pDesc.className = "mb-0";
    pDesc.textContent = factura.descripcion || "Sin descripción";
    colDesc.appendChild(h6Desc);
    colDesc.appendChild(pDesc);
    row.appendChild(colDesc);

    // Tabla de ítems
    const colItems = document.createElement("div");
    colItems.className = "col-12";
    const h6Items = document.createElement("h6");
    h6Items.className = "text-muted mb-2";
    h6Items.textContent = "Productos / Ítems";
    
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-responsive";
    const table = document.createElement("table");
    table.className = "table table-sm table-bordered";
    
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    const thProducto = document.createElement("th");
    thProducto.textContent = "Producto";
    const thCantidad = document.createElement("th");
    thCantidad.className = "text-end";
    thCantidad.textContent = "Cantidad";
    const thPrecio = document.createElement("th");
    thPrecio.className = "text-end";
    thPrecio.textContent = "Precio Unit.";
    const thSubtotal = document.createElement("th");
    thSubtotal.className = "text-end";
    thSubtotal.textContent = "Subtotal";
    trHead.appendChild(thProducto);
    trHead.appendChild(thCantidad);
    trHead.appendChild(thPrecio);
    trHead.appendChild(thSubtotal);
    thead.appendChild(trHead);
    
    const tbody = document.createElement("tbody");
    factura.items.forEach(item => {
      const tr = document.createElement("tr");
      const tdProducto = document.createElement("td");
      tdProducto.textContent = item.producto;
      const tdCantidad = document.createElement("td");
      tdCantidad.className = "text-end";
      tdCantidad.textContent = item.cantidad;
      const tdPrecio = document.createElement("td");
      tdPrecio.className = "text-end";
      tdPrecio.textContent = f.format(item.precio);
      const tdSubtotal = document.createElement("td");
      tdSubtotal.className = "text-end";
      tdSubtotal.textContent = f.format(item.subtotal());
      tr.appendChild(tdProducto);
      tr.appendChild(tdCantidad);
      tr.appendChild(tdPrecio);
      tr.appendChild(tdSubtotal);
      tbody.appendChild(tr);
    });
    
    const tfoot = document.createElement("tfoot");
    const trSubtotal = document.createElement("tr");
    const tdSubtotalLabel = document.createElement("td");
    tdSubtotalLabel.colSpan = 3;
    tdSubtotalLabel.className = "text-end fw-bold";
    tdSubtotalLabel.textContent = "Subtotal:";
    const tdSubtotalVal = document.createElement("td");
    tdSubtotalVal.className = "text-end fw-bold";
    tdSubtotalVal.textContent = f.format(factura.calcularSubtotal());
    trSubtotal.appendChild(tdSubtotalLabel);
    trSubtotal.appendChild(tdSubtotalVal);
    
    const trIVA = document.createElement("tr");
    const tdIVALabel = document.createElement("td");
    tdIVALabel.colSpan = 3;
    tdIVALabel.className = "text-end";
    tdIVALabel.textContent = `IVA (${factura.tasaIVA}%):`;
    const tdIVAVal = document.createElement("td");
    tdIVAVal.className = "text-end";
    tdIVAVal.textContent = f.format(factura.calcularIVA());
    trIVA.appendChild(tdIVALabel);
    trIVA.appendChild(tdIVAVal);
    
    const trTotal = document.createElement("tr");
    trTotal.className = "table-success";
    const tdTotalLabel = document.createElement("td");
    tdTotalLabel.colSpan = 3;
    tdTotalLabel.className = "text-end fw-bold";
    tdTotalLabel.textContent = "Total:";
    const tdTotalVal = document.createElement("td");
    tdTotalVal.className = "text-end fw-bold";
    tdTotalVal.textContent = f.format(factura.total);
    trTotal.appendChild(tdTotalLabel);
    trTotal.appendChild(tdTotalVal);
    
    tfoot.appendChild(trSubtotal);
    tfoot.appendChild(trIVA);
    tfoot.appendChild(trTotal);
    
    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(tfoot);
    tableWrapper.appendChild(table);
    colItems.appendChild(h6Items);
    colItems.appendChild(tableWrapper);
    row.appendChild(colItems);

    // Estado
    const colEstado = document.createElement("div");
    colEstado.className = "col-12";
    const h6Estado = document.createElement("h6");
    h6Estado.className = "text-muted mb-1";
    h6Estado.textContent = "Estado";
    const badge = document.createElement("span");
    badge.className = factura.estado === "pagada" ? "badge bg-success" : "badge bg-warning";
    badge.textContent = factura.estado;
    colEstado.appendChild(h6Estado);
    colEstado.appendChild(badge);
    row.appendChild(colEstado);

    modalBody.appendChild(row);
    modal.show();
  }

  // Llamar a render() inicialmente para mostrar las facturas
  render();
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

    if (guardarYActualizar(() => {
      sistema.eliminarImpuesto(btn.dataset.id);
    })) {
      render();
      mostrarToast("✔ Impuesto eliminado", "warning");
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