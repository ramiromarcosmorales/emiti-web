// ==============================================================================
// js/script.js - CONTROLADOR PRINCIPAL (EVENTOS + DOM)
// Tarea: Orquestar la UI usando la lógica del Dominio (POO)
// ==============================================================================

// 1. IMPORTS Y COORDINACIÓN
import { SistemaFacturacion } from './models/SistemaFacturacion.js';
import { Validador } from './models/Validador.js';
import { ItemFactura } from './models/ItemFactura.js';
// Importación por defecto del módulo de almacenamiento
import StorageUtil from './utils/storage.js'; 

// 2. VARIABLES GLOBALES DE ESTADO (Mínimas y centradas en la UI)
let sistemaFacturacion = null;
let itemsTemporales = [];

// 3. LISTENERS PRINCIPALES
document.addEventListener('DOMContentLoaded', inicializarApp);

// ==============================================================================
// 4. FUNCIONES DE INICIALIZACIÓN
// ==============================================================================

function inicializarApp() {
    // 1. Instanciar el sistema
    sistemaFacturacion = new SistemaFacturacion();

    // 2. Cargar datos desde localStorage (delegado a SistemaFacturacion.cargarDesdeStorage())
    sistemaFacturacion.cargarDesdeStorage();

    // 3. Configurar eventos de UI
    configurarEventos();
    
    // 4. Renderizar el estado inicial de la UI
    renderizarUIInicial();
}

/**
 * Renderiza el estado inicial de la UI: lista de facturas y dashboard.
 */
function renderizarUIInicial() {
    renderizarListaFacturas(sistemaFacturacion.listar());
    // Usa el método centralizado en la clase de dominio
    renderizarDashboard(sistemaFacturacion.getMetrics()); 
    renderizarItemsTemporales();
}

// ==============================================================================
// 5. CONFIGURACIÓN DE EVENTOS
// ==============================================================================

function configurarEventos() {
    const formFactura = document.getElementById('form-factura-cliente');
    if (formFactura) {
        formFactura.addEventListener('submit', manejarCreacionFactura);
        formFactura.addEventListener('input', manejarValidacionEnTiempoReal);
    }
    
    const formItem = document.getElementById('form-agregar-item');
    if (formItem) {
        formItem.addEventListener('submit', manejarAgregarItem);
        formItem.addEventListener('input', manejarValidacionEnTiempoReal);
    }

    const listaFacturas = document.getElementById('lista-facturas');
    if (listaFacturas) {
        listaFacturas.addEventListener('click', manejarAccionesFactura);
    }
}

// ==============================================================================
// 6. FUNCIONES MANEJADORAS DE EVENTOS
// ==============================================================================

/**
 * Manejador para el submit del formulario de ítems temporales.
 */
function manejarAgregarItem(event) {
    event.preventDefault();
    const formId = 'form-agregar-item';
    const form = document.getElementById(formId);
    
    // Captura los valores del formulario de items
    const itemData = {
        producto: form.elements['item-producto']?.value,
        // Se asume que ItemFactura validará que esto sea un número positivo.
        precio: parseFloat(form.elements['item-precio']?.value) 
    };

    try {
        // 1. Creación de objeto ItemFactura (delegan validación a la clase)
        const nuevoItem = new ItemFactura(itemData);
        
        // 2. Actualizar estado y UI
        itemsTemporales.push(nuevoItem);
        mostrarMensajeExito(`Ítem '${nuevoItem.producto}' añadido. Ítems: ${itemsTemporales.length}`);
        limpiarFormulario(formId);
        renderizarItemsTemporales();
        
    } catch (error) {
        // Captura errores de validación de ItemFactura (ej: Precio <= 0 o no numérico)
        mostrarError("Error al validar/procesar el ítem: " + error.message);
    }
}

/**
 * Manejador para el submit del formulario principal de creación de factura.
 */
function manejarCreacionFactura(event) {
    event.preventDefault(); 
    const formId = 'form-factura-cliente';
    
    const datosFactura = capturarDatosFactura(formId);
    // Validación inicial: revisa si los campos básicos están llenos y si hay ítems.
    if (!validarFormularioCompleto(datosFactura, itemsTemporales)) {
        mostrarError("Por favor, corrige los errores y añade al menos un ítem.");
        return;
    }

    // 1. ORQUESTACIÓN: Llamada al método de la clase de Dominio
    try {
        datosFactura.items = itemsTemporales; 
        
        // crearFactura() internamente valida (Cliente, CUIT), calcula totales y persiste.
        const facturaCreada = sistemaFacturacion.crearFactura(datosFactura); 

        // 2. Limpieza y Renderizado
        itemsTemporales = [];
        mostrarMensajeExito(`Factura #${facturaCreada.numero} creada exitosamente.`);
        limpiarFormulario(formId);
        renderizarListaFacturas(sistemaFacturacion.listar()); 
        renderizarItemsTemporales(); 

    } catch (error) {
        // Captura errores de Lógica de Negocio (ej: CUIT inválido lanzado desde Cliente.js)
        mostrarError("Error de Lógica de Negocio: " + error.message);
    }
}

/**
 * Maneja eventos de click en la lista de facturas (Delegación: Pagar/Eliminar).
 */
function manejarAccionesFactura(event) {
    const target = event.target;
    // Buscamos el atributo data-factura-numero en el contenedor de la factura
    const facturaElement = target.closest('[data-factura-numero]');
    
    if (!facturaElement) return;

    const numeroFactura = facturaElement.dataset.facturaNumero; 
    if (!numeroFactura) return;

    // Acción: Marcar Pagada
    if (target.classList.contains('btn-marcar-pagada')) {
        if (confirmacionEnUI(`¿Confirmas el pago de la Factura N° ${numeroFactura}?`)) { 
            try {
                // ORQUESTACIÓN: Llama al wrapper que resuelve por número
                sistemaFacturacion.marcarPagada(numeroFactura); 
                renderizarListaFacturas(sistemaFacturacion.listar());
                mostrarMensajeExito(`Factura N° ${numeroFactura} marcada como PAGADA.`);
            } catch (error) {
                mostrarError(error.message);
            }
        }
    }
    
    // Acción: Eliminar Factura
    if (target.classList.contains('btn-eliminar')) {
         // Se obtiene la instancia para conseguir el ID, ya que la UI solo tiene el número.
         const factura = sistemaFacturacion.getFacturaByNumero(numeroFactura);
         if (!factura) {
             mostrarError("Factura no encontrada para eliminar.");
             return;
         }

         if (confirmacionEnUI(`¿Seguro que deseas eliminar la Factura N° ${numeroFactura}?`)) {
            try {
                // ORQUESTACIÓN: Llama a SistemaFacturacion.eliminarFactura(id)
                sistemaFacturacion.eliminarFactura(factura.id); 
                renderizarListaFacturas(sistemaFacturacion.listar());
                mostrarMensajeExito(`Factura N° ${numeroFactura} eliminada.`);
            } catch (error) {
                mostrarError(error.message);
            }
        }
    }
}


/**
 * Maneja la validación de inputs mientras el usuario escribe.
 * Delega toda la lógica de validación a la clase Validador.
 */
function manejarValidacionEnTiempoReal(event) {
    const input = event.target;
    // Ignorar elementos que no sean campos de formulario
    if (input.tagName !== 'INPUT' && input.tagName !== 'SELECT' && input.tagName !== 'TEXTAREA') return;

    let esValido = true;
    const value = input.value.trim();
    const validationType = input.dataset.validation;
    
    if (validationType) {
        // Usa la propiedad dinámica para llamar al método estático correspondiente en Validador
        esValido = Validador[validationType] ? Validador[validationType](value) : true;
    }

    aplicarFeedbackVisual(input, esValido);
}


// ==============================================================================
// 7. FUNCIONES DE MANIPULACIÓN DEL DOM (Entradas, Salidas, Estados)
// ==============================================================================

/**
 * NOTA: La lógica de métricas fue movida a SistemaFacturacion.js.
 * La función calcularMetricas() local ha sido ELIMINADA.
 */


function capturarDatosFactura(formId) {
    const form = document.getElementById(formId);
    if (!form) return {};
    
    // Captura los campos por su atributo 'name'
    const data = {
        cliente: {
            nombre: form.elements['cliente-nombre']?.value,
            cuit: form.elements['cliente-cuit']?.value,
            direccion: form.elements['cliente-direccion']?.value,
            email: form.elements['cliente-email']?.value,
            telefono: form.elements['cliente-telefono']?.value,
        },
        tipo: form.elements['factura-tipo']?.value,
        fecha: form.elements['factura-fecha']?.value,
        descripcion: form.elements['factura-descripcion']?.value,
    };
    
    return data;
}

/**
 * Validación previa a la lógica de negocio (solo campos mínimos).
 */
function validarFormularioCompleto(datosFactura, items) {
    const c = datosFactura.cliente;
    const f = datosFactura;
    
    // Valida nombre y CUIT (usando Validador.js)
    const clienteValido = Validador.texto(c.nombre) && Validador.cuit(c.cuit);
    // Valida descripción, fecha y tipo (usando Validador.js)
    const facturaValida = Validador.texto(f.descripcion) && Validador.fecha(f.fecha) && Validador.texto(f.tipo);
    
    // Requisito final: al menos un ítem agregado
    return clienteValido && facturaValida && items.length > 0;
}

function aplicarFeedbackVisual(input, esValido) {
    input.classList.remove('is-valid', 'is-invalid');
    if (input.value.trim() === '') return;
    
    if (esValido) {
        input.classList.add('is-valid');
    } else {
        input.classList.add('is-invalid');
    }
}

/**
 * Modifica el DOM para mostrar la lista de facturas (Salida dinámica).
 */
function renderizarListaFacturas(facturas) {
    const listaFacturasDiv = document.getElementById('lista-facturas');
    if (!listaFacturasDiv) return;

    listaFacturasDiv.innerHTML = ''; 
    const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

    if (facturas.length === 0) {
        listaFacturasDiv.innerHTML = '<p class="text-info">No hay facturas registradas.</p>';
        renderizarDashboard(sistemaFacturacion.getMetrics());
        return;
    }
    
    facturas.forEach(factura => {
        const item = document.createElement('div');
        const estadoClass = factura.estado === 'pagada' ? 'bg-success text-white' : 'bg-warning text-dark';
        item.className = `factura-item p-3 mb-2 rounded shadow-sm ${estadoClass}`;
        // CRÍTICO: Adjuntamos el número de factura para las acciones
        item.dataset.facturaNumero = factura.numero; 

        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>Factura N° ${factura.numero} (${factura.tipo})</strong> - Cliente: ${factura.cliente.nombre}<br>
                    Total: ${formatter.format(factura.total)} - Estado: ${factura.estado.toUpperCase()}
                </div>
                <div class="btn-group">
                    ${factura.estado !== 'pagada' ? '<button class="btn btn-sm btn-success btn-marcar-pagada">Pagar</button>' : ''}
                    <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
                </div>
            </div>
        `;
        listaFacturasDiv.appendChild(item);
    });
    // Se actualiza el dashboard con las métricas del sistema
    renderizarDashboard(sistemaFacturacion.getMetrics());
}

/**
 * Renderiza la lista de ítems temporales.
 */
function renderizarItemsTemporales() {
    const container = document.getElementById('lista-items-temporales'); 
    if (!container) return;
    
    container.innerHTML = '';
    
    if (itemsTemporales.length === 0) {
        container.innerHTML = '<p class="text-secondary small">Añade ítems aquí.</p>';
        return;
    }

    const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

    itemsTemporales.forEach((item, index) => {
        const itemEl = document.createElement('li');
        itemEl.className = 'list-group-item d-flex justify-content-between align-items-center';
        itemEl.innerHTML = `
            ${item.producto} - ${formatter.format(item.precio)}
            <button class="btn btn-sm btn-outline-danger" data-index="${index}" onclick="manejarEliminarItemTemporal(${index})">X</button>
        `;
        container.appendChild(itemEl);
    });
}

/**
 * Renderiza las métricas del dashboard.
 */
function renderizarDashboard(metricas) {
    const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
    
    // Se asume que existen los elementos con estos IDs
    const totalFacturasEl = document.getElementById('total-facturas');
    const importeTotalEl = document.getElementById('importe-total');
    const promedioEl = document.getElementById('promedio');
    const facturasPagadasEl = document.getElementById('facturas-pagadas');

    // Los nombres de las propiedades se alinean con getMetrics()
    if (totalFacturasEl) totalFacturasEl.textContent = metricas.cantidad ?? 0; // Usar 'cantidad' de getMetrics
    // NOTA: Para el promedio, necesitarías recalcular o añadirlo a getMetrics,
    // pero usando importeTotal y facturasPagadas podemos inferirlo para simplicidad.
    const promedio = metricas.cantidad > 0 ? metricas.totalFacturado / metricas.cantidad : 0;
    
    if (importeTotalEl) importeTotalEl.textContent = formatter.format(metricas.totalFacturado ?? 0);
    if (promedioEl) promedioEl.textContent = formatter.format(promedio ?? 0);
    if (facturasPagadasEl) facturasPagadasEl.textContent = metricas.pagadas ?? 0;
}


// --- GESTIÓN DE ESTADOS DE UI (Error/Success) ---

function mostrarError(mensaje) {
    const container = document.getElementById('feedback-container');
    if (container) {
        container.innerHTML = `<div class="alert alert-danger" role="alert">❌ ERROR: ${mensaje}</div>`;
        container.style.display = 'block';
    }
}

function mostrarMensajeExito(mensaje) {
    const container = document.getElementById('feedback-container');
    if (container) {
        container.innerHTML = `<div class="alert alert-success" role="alert">✅ ÉXITO: ${mensaje}</div>`;
        container.style.display = 'block';
        setTimeout(() => container.style.display = 'none', 5000);
    }
}

function confirmacionEnUI(pregunta) {
    return window.confirm(pregunta); 
}

function limpiarFormulario(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
    }
}

// Función global (para ser usada desde el HTML)
window.manejarEliminarItemTemporal = function(index) {
    if (index >= 0 && index < itemsTemporales.length) {
        itemsTemporales.splice(index, 1);
        renderizarItemsTemporales();
        mostrarMensajeExito("Ítem temporal eliminado.");
    }
}