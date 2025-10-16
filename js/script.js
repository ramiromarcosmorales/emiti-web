/**
 * EMITÍ - Sistema de Gestión de Facturas
 * JavaScript Logica de Negocio
 * 
 * Este archivo contiene la lógica de negocio para los 4 flujos principales:
 * 1. Dashboard - Visualización de métricas
 * 2. Nueva Factura - Creación de facturas
 * 3. Facturas - Gestión de facturas existentes
 * 4. Configuración - Configuración de impuestos
 */


// DATOS GLOBALES Y CONFIGURACIÓN

/**
 * Almacenamiento de datos en memoria (simulando base de datos)
 */
const dataStore = {
    facturas: [
        {
            id: 1,
            numero: "001",
            cliente: "Juan Perez",
            cuit: "20-12345678-9",
            direccion: "Av. Corrientes 1234",
            email: "juan@email.com",
            telefono: "011-1234-5678",
            tipo: "A",
            fecha: "2025-01-01",
            descripcion: "Servicios de consultoría",
            items: [
                { producto: "Consultoría IT", precio: 15000 }
            ],
            subtotal: 15000,
            iva: 3150,
            total: 18150,
            estado: "pagada"
        },
        {
            id: 2,
            numero: "002",
            cliente: "María Lopez",
            cuit: "27-87654321-0",
            direccion: "Calle Falsa 456",
            email: "maria@email.com",
            telefono: "011-8765-4321",
            tipo: "B",
            fecha: "2025-01-02",
            descripcion: "Desarrollo de software",
            items: [
                { producto: "Desarrollo Web", precio: 22500 }
            ],
            subtotal: 22500,
            iva: 4725, // IVA del 21% calculado pero incluido en el precio
            total: 22500, // Precio ya incluye el IVA
            estado: "pendiente"
        },
        {
            id: 3,
            numero: "003",
            cliente: "Carlos García",
            cuit: "20-98765432-1",
            direccion: "Av. Santa Fe 789",
            email: "carlos@email.com",
            telefono: "011-9876-5432",
            tipo: "C",
            fecha: "2025-01-03",
            descripcion: "Servicios de mantenimiento",
            items: [
                { producto: "Mantenimiento mensual", precio: 5000 }
            ],
            subtotal: 5000,
            iva: 1050, // IVA del 21% calculado pero incluido en el precio
            total: 5000, // Precio ya incluye el IVA
            estado: "pendiente"
        }
    ],
    impuestos: [
        { id: 1, nombre: "IVA", porcentaje: 21, activo: true },
        { id: 2, nombre: "Percepción IIBB", porcentaje: 3, activo: false }
    ],
    configuracion: {
        empresa: "Mi Empresa SRL",
        cuit: "30-12345678-9",
        direccion: "Av. Principal 123",
        telefono: "011-1234-5678",
        email: "contacto@miempresa.com"
    }
};


// FUNCIONES DE VALIDACIÓN


/**
 * Valida si un string no está vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} - true si es válido
 */
function validarTextoObligatorio(value) {
    return value && value.trim().length > 0;
}

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida formato de CUIT/CUIL
 * @param {string} cuit - CUIT a validar
 * @returns {boolean} - true si es válido
 */
function validarCUIT(cuit) {
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    return cuitRegex.test(cuit);
}

/**
 * Valida que un número sea positivo
 * @param {number} numero - Número a validar
 * @returns {boolean} - true si es válido
 */
function validarNumeroPositivo(numero) {
    return numero > 0;
}

/**
 * Valida formato de fecha
 * @param {string} fecha - Fecha a validar
 * @returns {boolean} - true si es válido
 */
function validarFecha(fecha) {
    const fechaObj = new Date(fecha);
    return fechaObj instanceof Date && !isNaN(fechaObj);
}


// FUNCIONES DE UTILIDAD


/**
 * Formatea un número como moneda argentina
 * @param {number} monto - Monto a formatear
 * @returns {string} - Monto formateado
 */
function formatearMoneda(monto) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(monto);
}

/**
 * Genera el próximo número de factura
 * @returns {string} - Próximo número de factura
 */
function generarNumeroFactura() {
    const ultimaFactura = dataStore.facturas.reduce((max, factura) => {
        const numero = parseInt(factura.numero);
        return numero > max ? numero : max;
    }, 0);
    return String(ultimaFactura + 1).padStart(3, '0');
}

/**
 * Calcula el IVA de un monto
 * @param {number} subtotal - Subtotal
 * @param {number} porcentajeIVA - Porcentaje de IVA
 * @returns {number} - Monto del IVA
 */
function calcularIVA(subtotal, porcentajeIVA = 21) {
    return subtotal * (porcentajeIVA / 100);
}

/**
 * Calcula el total de una factura
 * @param {number} subtotal - Subtotal
 * @param {number} iva - Monto del IVA
 * @returns {number} - Total
 */
function calcularTotal(subtotal, iva) {
    return subtotal + iva;
}


// FLUJO 1: DASHBOARD - VISUALIZACIÓN DE MÉTRICAS

/**
 * Calcula las métricas del dashboard
 * @returns {Object} - Objeto con las métricas calculadas
 */
function calcularMetricas() {
    const facturas = dataStore.facturas;
    const totalFacturas = facturas.length;
    const importeTotal = facturas.reduce((sum, factura) => sum + factura.total, 0);
    const promedio = totalFacturas > 0 ? importeTotal / totalFacturas : 0;
    const facturasPagadas = facturas.filter(f => f.estado === 'pagada').length;
    
    return {
        totalFacturas,
        importeTotal,
        promedio,
        facturasPagadas
    };
}

/**
 * Muestra las métricas del dashboard
 */
function mostrarDashboard() {
    const metricas = calcularMetricas();
    
    console.log("=== DASHBOARD - MÉTRICAS PRINCIPALES ===");
    console.log(`Total Facturas: ${metricas.totalFacturas}`);
    console.log(`Importe Total: ${formatearMoneda(metricas.importeTotal)}`);
    console.log(`Promedio: ${formatearMoneda(metricas.promedio)}`);
    console.log(`Pagadas: ${metricas.facturasPagadas}`);
    console.log("=========================================");
    
    alert(`DASHBOARD - MÉTRICAS PRINCIPALES\n\n` +
          `Total Facturas: ${metricas.totalFacturas}\n` +
          `Importe Total: ${formatearMoneda(metricas.importeTotal)}\n` +
          `Promedio: ${formatearMoneda(metricas.promedio)}\n` +
          `Pagadas: ${metricas.facturasPagadas}`);
}


// FLUJO 2: NUEVA FACTURA - CREACIÓN DE FACTURAS


/**
 * Solicita los datos del cliente para una nueva factura
 * @returns {Object|null} - Datos del cliente o null si se cancela
 */
function solicitarDatosCliente() {
    const cliente = prompt("Ingrese el nombre del cliente:");
    if (!cliente) return null;
    
    const cuit = prompt("Ingrese el CUIT/CUIL del cliente:");
    if (!cuit) return null;
    
    const direccion = prompt("Ingrese la dirección del cliente:");
    if (!direccion) return null;
    
    const email = prompt("Ingrese el email del cliente:");
    if (!email) return null;
    
    const telefono = prompt("Ingrese el teléfono del cliente:");
    if (!telefono) return null;
    
    return { cliente, cuit, direccion, email, telefono };
}

/**
 * Solicita los datos de la factura
 * @returns {Object|null} - Datos de la factura o null si se cancela
 */
function solicitarDatosFactura() {
    const tipo = prompt("Ingrese el tipo de factura:\n" +
                       "A - Responsable Inscripto (discrimina IVA)\n" +
                       "B - Consumidor Final (incluye IVA)\n" +
                       "C - Monotributista (sin IVA)");
    if (!tipo) return null;
    
    const fecha = prompt("Ingrese la fecha (YYYY-MM-DD):");
    if (!fecha) return null;
    
    const descripcion = prompt("Ingrese la descripción de la factura:");
    if (!descripcion) return null;
    
    return { tipo, fecha, descripcion };
}

/**
 * Solicita los items de la factura
 * @returns {Array} - Array de items
 */
function solicitarItemsFactura() {
    const items = [];
    let continuar = true;
    
    while (continuar) {
        const producto = prompt("Ingrese el nombre del producto/ítem:");
        if (!producto) break;
        
        const precioStr = prompt("Ingrese el precio del producto:");
        if (!precioStr) break;
        
        const precio = parseFloat(precioStr);
        if (isNaN(precio) || precio <= 0) {
            alert("El precio debe ser un número positivo válido.");
            continue;
        }
        
        items.push({ producto, precio });
        
        continuar = confirm("¿Desea agregar otro ítem?");
    }
    
    return items;
}

/**
 * Crea una nueva factura
 * @param {Object} datosCliente - Datos del cliente
 * @param {Object} datosFactura - Datos de la factura
 * @param {Array} items - Items de la factura
 * @returns {Object} - Factura creada
 */
function crearFactura(datosCliente, datosFactura, items) {
    const subtotal = items.reduce((sum, item) => sum + item.precio, 0);
    
    let iva = 0;
    let total = 0;
    
    // Algoritmo condicional según reglas fiscales argentinas
    switch (datosFactura.tipo.toUpperCase()) {
        case 'A':
            // FACTURA A: Responsable Inscripto → Responsable Inscripto/Monotributista
            // Características: Discrimina el IVA por separado (crédito fiscal)
            iva = calcularIVA(subtotal);
            total = calcularTotal(subtotal, iva);
            break;
            
        case 'B':
            // FACTURA B: Responsable Inscripto → Consumidor Final/Monotributista/Exento
            // Características: Incluye IVA en el precio total (sin discriminar)
            // El precio ingresado ya incluye el IVA, pero el IVA sigue siendo 21%
            iva = calcularIVA(subtotal); // IVA del 21% calculado
            total = subtotal; // El precio ya incluye el IVA (no se suma)
            break;
            
        case 'C':
            // FACTURA C: Monotributista → Cualquier cliente
            // Características: Incluye IVA en el precio total (sin discriminar)
            // El precio ingresado ya incluye el IVA, pero el IVA sigue siendo 21%
            iva = calcularIVA(subtotal); // IVA del 21% calculado
            total = subtotal; // El precio ya incluye el IVA (no se suma)
            break;
            
        default:
            // Tipo no válido, usar lógica por defecto
            iva = 0;
            total = subtotal;
    }
    
    const nuevaFactura = {
        id: dataStore.facturas.length + 1,
        numero: generarNumeroFactura(),
        ...datosCliente,
        ...datosFactura,
        items,
        subtotal,
        iva,
        total,
        estado: "pendiente"
    };
    
    dataStore.facturas.push(nuevaFactura);
    return nuevaFactura;
}

/**
 * Flujo principal para crear una nueva factura
 */
function flujoNuevaFactura() {
    console.log("=== NUEVA FACTURA ===");
    
    // Solicitar datos del cliente
    const datosCliente = solicitarDatosCliente();
    if (!datosCliente) {
        alert("Creación de factura cancelada.");
        return;
    }
    
    // Validar datos del cliente
    if (!validarTextoObligatorio(datosCliente.cliente)) {
        alert("El nombre del cliente es obligatorio.");
        return;
    }
    
    if (!validarCUIT(datosCliente.cuit)) {
        alert("El CUIT/CUIL debe tener el formato XX-XXXXXXXX-X");
        return;
    }
    
    if (!validarEmail(datosCliente.email)) {
        alert("El email debe tener un formato válido.");
        return;
    }
    
    // Solicitar datos de la factura
    const datosFactura = solicitarDatosFactura();
    if (!datosFactura) {
        alert("Creación de factura cancelada.");
        return;
    }
    
    // Validar datos de la factura
    if (!['A', 'B', 'C'].includes(datosFactura.tipo)) {
        alert("El tipo de factura debe ser A, B o C.");
        return;
    }
    
    if (!validarFecha(datosFactura.fecha)) {
        alert("La fecha debe tener el formato YYYY-MM-DD.");
        return;
    }
    
    // Solicitar items
    const items = solicitarItemsFactura();
    if (items.length === 0) {
        alert("Debe agregar al menos un ítem a la factura.");
        return;
    }
    
    // Crear la factura
    const factura = crearFactura(datosCliente, datosFactura, items);
    
    // Mostrar resumen
    console.log("Factura creada exitosamente:");
    console.log(`Número: ${factura.numero}`);
    console.log(`Cliente: ${factura.cliente}`);
    console.log(`Total: ${formatearMoneda(factura.total)}`);
    
    alert(`✅ Factura creada exitosamente!\n\n` +
          `Número: ${factura.numero}\n` +
          `Cliente: ${factura.cliente}\n` +
          `Total: ${formatearMoneda(factura.total)}`);
}


// FLUJO 3: FACTURAS - GESTIÓN DE FACTURAS EXISTENTES


/**
 * Lista todas las facturas
 */
function listarFacturas() {
    console.log("=== LISTADO DE FACTURAS ===");
    
    if (dataStore.facturas.length === 0) {
        console.log("No hay facturas registradas.");
        alert("No hay facturas registradas.");
        return;
    }
    
    dataStore.facturas.forEach(factura => {
        console.log(`Factura #${factura.numero} - ${factura.cliente} - ${formatearMoneda(factura.total)} - ${factura.estado}`);
    });
    
    let mensaje = "=== LISTADO DE FACTURAS ===\n\n";
    dataStore.facturas.forEach(factura => {
        mensaje += `Factura #${factura.numero}\n`;
        mensaje += `Cliente: ${factura.cliente}\n`;
        mensaje += `Total: ${formatearMoneda(factura.total)}\n`;
        mensaje += `Estado: ${factura.estado}\n`;
        mensaje += `Fecha: ${factura.fecha}\n\n`;
    });
    
    alert(mensaje);
}

/**
 * Busca facturas por criterio
 * @param {string} criterio - Criterio de búsqueda
 * @returns {Array} - Facturas encontradas
 */
function buscarFacturas(criterio) {
    const criterioLower = criterio.toLowerCase();
    return dataStore.facturas.filter(factura => 
        factura.cliente.toLowerCase().includes(criterioLower) ||
        factura.numero.includes(criterio) ||
        factura.cuit.includes(criterio)
    );
}

/**
 * Muestra el detalle de una factura
 * @param {Object} factura - Factura a mostrar
 */
function mostrarDetalleFactura(factura) {
    console.log("=== DETALLE DE FACTURA ===");
    console.log(`Número: ${factura.numero}`);
    console.log(`Cliente: ${factura.cliente}`);
    console.log(`CUIT: ${factura.cuit}`);
    console.log(`Dirección: ${factura.direccion}`);
    console.log(`Email: ${factura.email}`);
    console.log(`Teléfono: ${factura.telefono}`);
    console.log(`Tipo: ${factura.tipo}`);
    console.log(`Fecha: ${factura.fecha}`);
    console.log(`Descripción: ${factura.descripcion}`);
    console.log("Items:");
    factura.items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.producto} - ${formatearMoneda(item.precio)}`);
    });
    console.log(`Subtotal: ${formatearMoneda(factura.subtotal)}`);
    console.log(`IVA: ${formatearMoneda(factura.iva)}`);
    console.log(`Total: ${formatearMoneda(factura.total)}`);
    console.log(`Estado: ${factura.estado}`);
    
    // Explicación del tipo de factura
    let tipoExplicacion = "";
    switch (factura.tipo.toUpperCase()) {
        case 'A':
            tipoExplicacion = " (Responsable Inscripto - discrimina IVA)";
            break;
        case 'B':
            tipoExplicacion = " (Consumidor Final - incluye IVA)";
            break;
        case 'C':
            tipoExplicacion = " (Monotributista - sin IVA)";
            break;
    }
    
    let mensaje = `=== DETALLE DE FACTURA ===\n\n`;
    mensaje += `Número: ${factura.numero}\n`;
    mensaje += `Cliente: ${factura.cliente}\n`;
    mensaje += `CUIT: ${factura.cuit}\n`;
    mensaje += `Dirección: ${factura.direccion}\n`;
    mensaje += `Email: ${factura.email}\n`;
    mensaje += `Teléfono: ${factura.telefono}\n`;
    mensaje += `Tipo: ${factura.tipo}${tipoExplicacion}\n`;
    mensaje += `Fecha: ${factura.fecha}\n`;
    mensaje += `Descripción: ${factura.descripcion}\n\n`;
    mensaje += `Items:\n`;
    factura.items.forEach((item, index) => {
        mensaje += `  ${index + 1}. ${item.producto} - ${formatearMoneda(item.precio)}\n`;
    });
    mensaje += `\nSubtotal: ${formatearMoneda(factura.subtotal)}\n`;
    mensaje += `IVA: ${formatearMoneda(factura.iva)}\n`;
    mensaje += `Total: ${formatearMoneda(factura.total)}\n`;
    mensaje += `Estado: ${factura.estado}`;
    
    alert(mensaje);
}

/**
 * Flujo principal para gestionar facturas
 */
function flujoGestionFacturas() {
    console.log("=== GESTIÓN DE FACTURAS ===");
    
    const opcion = prompt("Seleccione una opción:\n1. Listar todas las facturas\n2. Buscar facturas\n3. Ver detalle de factura\n4. Volver al menú principal");
    
    switch (opcion) {
        case "1":
            listarFacturas();
            break;
        case "2":
            const criterio = prompt("Ingrese el criterio de búsqueda (cliente, número o CUIT):");
            if (criterio) {
                const facturasEncontradas = buscarFacturas(criterio);
                if (facturasEncontradas.length === 0) {
                    alert("No se encontraron facturas con ese criterio.");
                } else {
                    console.log("Facturas encontradas:");
                    facturasEncontradas.forEach(factura => {
                        console.log(`Factura #${factura.numero} - ${factura.cliente} - ${formatearMoneda(factura.total)}`);
                    });
                    alert(`Se encontraron ${facturasEncontradas.length} factura(s) con ese criterio.`);
                }
            }
            break;
        case "3":
            const numeroFactura = prompt("Ingrese el número de factura:");
            if (numeroFactura) {
                const factura = dataStore.facturas.find(f => f.numero === numeroFactura);
                if (factura) {
                    mostrarDetalleFactura(factura);
                } else {
                    alert("No se encontró la factura con ese número.");
                }
            }
            break;
        case "4":
            return;
        default:
            alert("Opción no válida.");
    }
}


// FLUJO 4: CONFIGURACIÓN - CONFIGURACIÓN DE IMPUESTOS

/**
 * Lista todos los impuestos configurados
 */
function listarImpuestos() {
    console.log("=== IMPUESTOS CONFIGURADOS ===");
    
    if (dataStore.impuestos.length === 0) {
        console.log("No hay impuestos configurados.");
        alert("No hay impuestos configurados.");
        return;
    }
    
    dataStore.impuestos.forEach(impuesto => {
        const estado = impuesto.activo ? "Activo" : "Inactivo";
        console.log(`${impuesto.nombre} - ${impuesto.porcentaje}% - ${estado}`);
    });
    
    let mensaje = "=== IMPUESTOS CONFIGURADOS ===\n\n";
    dataStore.impuestos.forEach(impuesto => {
        const estado = impuesto.activo ? "Activo" : "Inactivo";
        mensaje += `${impuesto.nombre} - ${impuesto.porcentaje}% - ${estado}\n`;
    });
    
    alert(mensaje);
}

/**
 * Agrega un nuevo impuesto
 */
function agregarImpuesto() {
    const nombre = prompt("Ingrese el nombre del impuesto:");
    if (!nombre) return;
    
    const porcentajeStr = prompt("Ingrese el porcentaje del impuesto:");
    if (!porcentajeStr) return;
    
    const porcentaje = parseFloat(porcentajeStr);
    if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
        alert("El porcentaje debe ser un número entre 0 y 100.");
        return;
    }
    
    const activo = confirm("¿El impuesto está activo?");
    
    const nuevoImpuesto = {
        id: dataStore.impuestos.length + 1,
        nombre,
        porcentaje,
        activo
    };
    
    dataStore.impuestos.push(nuevoImpuesto);
    
    console.log(`Impuesto "${nombre}" agregado exitosamente.`);
    alert(`✅ Impuesto "${nombre}" agregado exitosamente.`);
}

/**
 * Calcula el IVA de un monto usando la calculadora
 */
function usarCalculadoraIVA() {
    const precioStr = prompt("Ingrese el precio neto:");
    if (!precioStr) return;
    
    const precio = parseFloat(precioStr);
    if (isNaN(precio) || precio <= 0) {
        alert("El precio debe ser un número positivo válido.");
        return;
    }
    
    const porcentajeStr = prompt("Ingrese el porcentaje de IVA (por defecto 21%):");
    const porcentaje = porcentajeStr ? parseFloat(porcentajeStr) : 21;
    
    if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
        alert("El porcentaje debe ser un número entre 0 y 100.");
        return;
    }
    
    const iva = calcularIVA(precio, porcentaje);
    const total = calcularTotal(precio, iva);
    
    console.log("=== CALCULADORA DE IVA ===");
    console.log(`Precio neto: ${formatearMoneda(precio)}`);
    console.log(`IVA (${porcentaje}%): ${formatearMoneda(iva)}`);
    console.log(`Total con IVA: ${formatearMoneda(total)}`);
    
    alert(`=== CALCULADORA DE IVA ===\n\n` +
          `Precio neto: ${formatearMoneda(precio)}\n` +
          `IVA (${porcentaje}%): ${formatearMoneda(iva)}\n` +
          `Total con IVA: ${formatearMoneda(total)}`);
}

/**
 * Flujo principal para la configuración
 */
function flujoConfiguracion() {
    console.log("=== CONFIGURACIÓN ===");
    
    const opcion = prompt("Seleccione una opción:\n1. Listar impuestos\n2. Agregar impuesto\n3. Calculadora de IVA\n4. Volver al menú principal");
    
    switch (opcion) {
        case "1":
            listarImpuestos();
            break;
        case "2":
            agregarImpuesto();
            break;
        case "3":
            usarCalculadoraIVA();
            break;
        case "4":
            return;
        default:
            alert("Opción no válida.");
    }
}

// MENÚ PRINCIPAL


/**
 * Muestra el menú principal y maneja la navegación
 */
function mostrarMenuPrincipal() {
    let continuar = true;
    
    while (continuar) {
        const opcion = prompt("=== EMITÍ - SISTEMA DE GESTIÓN DE FACTURAS ===\n\n" +
                              "Seleccione una opción:\n" +
                              "1. Dashboard (Ver métricas)\n" +
                              "2. Nueva Factura\n" +
                              "3. Gestionar Facturas\n" +
                              "4. Configuración\n" +
                              "5. Salir\n\n" +
                              "Ingrese el número de la opción:");
        
        switch (opcion) {
            case "1":
                mostrarDashboard();
                break;
            case "2":
                flujoNuevaFactura();
                break;
            case "3":
                flujoGestionFacturas();
                break;
            case "4":
                flujoConfiguracion();
                break;
            case "5":
                continuar = false;
                alert("¡Gracias por usar EMITÍ!");
                break;
            default:
                alert("Opción no válida. Por favor, seleccione una opción del 1 al 5.");
        }
    }
}



// INICIALIZACIÓN


/**
 * Inicializa la aplicación
 */
function inicializarAplicacion() {
    console.log("=== EMITÍ - SISTEMA DE GESTIÓN DE FACTURAS ===");
    console.log("Aplicación inicializada correctamente.");
    console.log("Datos de ejemplo cargados:");
    console.log(`- ${dataStore.facturas.length} facturas`);
    console.log(`- ${dataStore.impuestos.length} impuestos configurados`);
    
    // Mostrar el menú principal
    mostrarMenuPrincipal();
}


// EXPORTACIÓN PARA TESTING


// Exponer funciones para testing (no anidar en IIFE para facilitar testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validarTextoObligatorio,
        validarEmail,
        validarCUIT,
        validarNumeroPositivo,
        validarFecha,
        formatearMoneda,
        generarNumeroFactura,
        calcularIVA,
        calcularTotal,
        calcularMetricas,
        crearFactura,
        buscarFacturas,
        dataStore
    };
}

// Inicializar la aplicación cuando se carga el script
if (typeof window !== 'undefined') {
    // Solo iniciar la lógica de prompt/alert en el navegador
    mostrarMenuPrincipal();
}

