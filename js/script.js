/**
 * EMITÍ - Sistema de Gestión de Facturas
 * JavaScript Logica de Negocio 
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
            iva: 4725, // IVA del 21% calculado e implícito
            total: 22500, // Precio final
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
            iva: 0, // IVA 0 (Monotributista)
            total: 5000, // Precio final
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


// FUNCIONES DE VALIDACIÓN (PURAS - TESTEABLES)


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
 * Valida formato de CUIT/CUIL (flexible)
 * Permite guiones, puntos o solo números, pero deben ser 11 dígitos.
 * @param {string} cuit - CUIT a validar
 * @returns {boolean} - true si es válido
 */
function validarCUIT(cuit) {
    if (!cuit) return false;
    // Limpia el CUIT/CUIL: elimina guiones, puntos y espacios.
    const cleanCuit = cuit.replace(/[-.\s]/g, ''); 
    // Valida que sean exactamente 11 dígitos
    return /^\d{11}$/.test(cleanCuit); 
}

/**
 * Valida que un número sea positivo
 * @param {number} numero - Número a validar
 * @returns {boolean} - true si es válido
 */
function validarNumeroPositivo(numero) {
    return !isNaN(numero) && numero > 0;
}

/**
 * Valida formato de fecha (YYYY-MM-DD)
 * @param {string} fecha - Fecha a validar
 * @returns {boolean} - true si es válido
 */
function validarFecha(fecha) {
    if (!fecha) return false;
    // Simple regex para el formato YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false; 
    
    const fechaObj = new Date(fecha);
    // Verifica si es una fecha válida y si el año coincide (evita desbordamiento)
    if (fechaObj instanceof Date && !isNaN(fechaObj)) {
        // Validación extra: nos aseguramos que el string de entrada coincida 
        // con el formato ISO de la fecha para evitar fechas parciales o inválidas.
        const iso = fechaObj.toISOString().split('T')[0];
        return iso === fecha;
    }
    return false;
}


// FUNCIONES DE UTILIDAD (PURAS - TESTEABLES)


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


// FLUJO 2: NUEVA FACTURA - CREACIÓN DE FACTURAS (I/O - IMPURAS CON VALIDACIÓN ITERATIVA)


/**
 * Solicita los datos del cliente para una nueva factura, con validación inmediata.
 * @returns {Object|null} - Datos del cliente o null si se cancela
 */
function solicitarDatosCliente() {
    let cliente, cuit, direccion, email, telefono;

    // 1. Cliente (Obligatorio)
    while (true) {
        cliente = prompt("Ingrese el nombre del cliente (Obligatorio):");
        if (cliente === null) return null; 
        if (validarTextoObligatorio(cliente)) break;
        alert("❌ Error: El nombre del cliente es obligatorio. Vuelva a intentar.");
    }
    
    // 2. CUIT/CUIL (Validación de 11 dígitos)
    while (true) {
        cuit = prompt("Ingrese el CUIT/CUIL del cliente (11 dígitos):");
        if (cuit === null) return null; 
        if (validarCUIT(cuit)) break;
        alert("❌ Error: El CUIT/CUIL debe ser un número de 11 dígitos válido. Vuelva a intentar.");
    }
    
    // 3. Dirección (Obligatorio)
    while (true) {
        direccion = prompt("Ingrese la dirección del cliente (Obligatorio):");
        if (direccion === null) return null; 
        if (validarTextoObligatorio(direccion)) break;
        alert("❌ Error: La dirección es obligatoria. Vuelva a intentar.");
    }

    // 4. Email (Validación de formato)
    while (true) {
        email = prompt("Ingrese el email del cliente (ej: usuario@dominio.com):");
        if (email === null) return null; 
        if (validarEmail(email)) break;
        alert("❌ Error: El email debe tener un formato válido. Vuelva a intentar.");
    }

    // 5. Teléfono (Obligatorio)
    while (true) {
        telefono = prompt("Ingrese el teléfono del cliente (Obligatorio):");
        if (telefono === null) return null; 
        if (validarTextoObligatorio(telefono)) break;
        alert("❌ Error: El teléfono es obligatorio. Vuelva a intentar.");
    }
    
    return { cliente, cuit, direccion, email, telefono };
}

/**
 * Solicita los datos de la factura, con validación inmediata.
 * @returns {Object|null} - Datos de la factura o null si se cancela
 */
function solicitarDatosFactura() {
    let tipo, fecha, descripcion;

    // 1. Tipo de Factura (A, B, C)
    while (true) {
        tipo = prompt("Ingrese el tipo de factura (A, B o C):\n" +
                      "A - Responsable Inscripto (discrimina IVA)\n" +
                      "B - Consumidor Final (incluye IVA)\n" +
                      "C - Monotributista (sin IVA)");
        if (tipo === null) return null; 
        
        const tipoUpper = tipo.toUpperCase().trim();
        if (['A', 'B', 'C'].includes(tipoUpper)) {
            tipo = tipoUpper; // Guardar el tipo en mayúsculas para consistencia
            break;
        }
        alert("❌ Error: El tipo de factura debe ser A, B o C. Vuelva a intentar.");
    }

    // 2. Fecha (YYYY-MM-DD)
    while (true) {
        fecha = prompt("Ingrese la fecha (YYYY-MM-DD):");
        if (fecha === null) return null; 
        
        if (validarFecha(fecha)) {
            break;
        }
        alert("❌ Error: La fecha debe tener un formato válido (YYYY-MM-DD). Vuelva a intentar.");
    }

    // 3. Descripción (Obligatorio)
    while (true) {
        descripcion = prompt("Ingrese la descripción de la factura (Obligatorio):");
        if (descripcion === null) return null; 
        if (validarTextoObligatorio(descripcion)) break;
        alert("❌ Error: La descripción es obligatoria. Vuelva a intentar.");
    }
    
    return { tipo, fecha, descripcion };
}

/**
 * Solicita los items de la factura, con validación inmediata para el precio.
 * @returns {Array} - Array de items
 */
function solicitarItemsFactura() {
    const items = [];
    let continuar = true;
    
    while (continuar) {
        let producto;
        // Bucle para validar que el nombre del producto no esté vacío
        while (true) {
            producto = prompt("Ingrese el nombre del producto/ítem (o Cancelar para terminar la carga):");
            if (producto === null) return items; // Sale de la función y retorna lo cargado
            if (validarTextoObligatorio(producto)) break;
            alert("❌ Error: El nombre del producto es obligatorio. Vuelva a intentar.");
        }
        
        let precio;
        // Bucle para validar que el precio sea un número positivo
        while (true) {
            const precioStr = prompt(`Ingrese el precio del producto "${producto}" (número positivo):`);
            if (precioStr === null) {
                precio = null;
                break; // El usuario canceló la entrada de precio, salta este ítem
            }
            
            precio = parseFloat(precioStr);
            if (validarNumeroPositivo(precio)) {
                break; 
            }
            alert("❌ Error: El precio debe ser un número positivo válido. Vuelva a intentar.");
        }

        if (precio !== null) {
            items.push({ producto, precio });
        }
        
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
            // FACTURA A: Discrimina el IVA
            iva = calcularIVA(subtotal);
            total = calcularTotal(subtotal, iva);
            break;
            
        case 'B':
            // FACTURA B: IVA incluido en el subtotal. Se calcula el IVA implícito para registro.
            iva = calcularIVA(subtotal);
            total = subtotal; // El precio de los items ya es el precio final
            break;
            
        case 'C':
            // FACTURA C: Monotributista. No lleva IVA.
            iva = 0; 
            total = subtotal; 
            break;
            
        default:
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
    
    // 1. Solicitar datos del cliente (Validación iterativa integrada)
    const datosCliente = solicitarDatosCliente();
    if (!datosCliente) {
        alert("Creación de factura cancelada.");
        return;
    }
    
    // Formatear el CUIT/CUIL limpio para guardarlo de forma consistente (lógica movida de la validación a la acción)
    const cuitLimpio = datosCliente.cuit.replace(/[-.\s]/g, '');
    datosCliente.cuit = cuitLimpio.substring(0, 2) + '-' + cuitLimpio.substring(2, 10) + '-' + cuitLimpio.substring(10, 11);
    
    // 2. Solicitar datos de la factura (Validación iterativa integrada)
    const datosFactura = solicitarDatosFactura();
    if (!datosFactura) {
        alert("Creación de factura cancelada.");
        return;
    }
    
    // 3. Solicitar items (Validación iterativa integrada)
    const items = solicitarItemsFactura();
    if (items.length === 0) {
        alert("Debe agregar al menos un ítem a la factura. Creación cancelada.");
        return;
    }
    
    // 4. Crear la factura
    const factura = crearFactura(datosCliente, datosFactura, items);
    
    // 5. Mostrar resumen
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
        console.log(`  ${index + 1}. ${item.producto} - ${formatearMoneda(item.precio)}`);
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
        mensaje += `  ${index + 1}. ${item.producto} - ${formatearMoneda(item.precio)}\n`;
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
    let nombre;
    while(true) {
        nombre = prompt("Ingrese el nombre del impuesto (Obligatorio):");
        if (nombre === null) return;
        if (validarTextoObligatorio(nombre)) break;
        alert("❌ Error: El nombre es obligatorio. Vuelva a intentar.");
    }
    
    let porcentaje;
    while(true) {
        const porcentajeStr = prompt(`Ingrese el porcentaje de "${nombre}" (0-100):`);
        if (porcentajeStr === null) return;
        
        porcentaje = parseFloat(porcentajeStr);
        if (!isNaN(porcentaje) && porcentaje >= 0 && porcentaje <= 100) {
            break;
        }
        alert("❌ Error: El porcentaje debe ser un número entre 0 y 100. Vuelva a intentar.");
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
    let precio;
    while(true) {
        const precioStr = prompt("Ingrese el precio neto (número positivo):");
        if (precioStr === null) return;
        
        precio = parseFloat(precioStr);
        if (validarNumeroPositivo(precio)) {
            break;
        }
        alert("❌ Error: El precio debe ser un número positivo válido. Vuelva a intentar.");
    }
    
    let porcentaje;
    while(true) {
        const porcentajeStr = prompt("Ingrese el porcentaje de IVA (por defecto 21%):");
        
        if (porcentajeStr === null || porcentajeStr.trim() === "") {
            porcentaje = 21;
            break;
        }
        
        porcentaje = parseFloat(porcentajeStr);
        if (!isNaN(porcentaje) && porcentaje >= 0 && porcentaje <= 100) {
            break;
        }
        alert("❌ Error: El porcentaje debe ser un número entre 0 y 100. Vuelva a intentar.");
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
            case null:
                continuar = false;
                alert("¡Gracias por usar EMITÍ!");
                break;
            default:
                alert("Opción no válida. Por favor, seleccione una opción del 1 al 5.");
        }
    }
}


// EXPORTACIÓN PARA TESTING (Se mantienen las funciones puras)


// Exponer funciones para testing 
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
    mostrarMenuPrincipal();
}