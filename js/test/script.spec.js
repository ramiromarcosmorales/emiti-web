// ============================================================
// 🟢 FLUJO 1: DASHBOARD – VISUALIZACIÓN DE MÉTRICAS
// ============================================================

describe("FLUJO 1: Dashboard – Visualización de métricas", () => {
  describe("calcularMetricas", () => {
    it("calcularMetricas", () => {
      const metricas = calcularMetricas(dataStore.facturas);
      // se asumen los sig. valores de acuerdo a la dataset definida
      expect(metricas.totalFacturas).toBe(3);
      expect(metricas.facturasPagadas).toBe(1);
      expect(typeof metricas.importeTotal).toBe("number");
      expect(typeof metricas.promedio).toBe("number");
    });

    it("calcula metricas correctamente con array vacio", () => {
      const metricas = calcularMetricas([]);
      expect(metricas.totalFacturas).toBe(0);
      expect(metricas.importeTotal).toBe(0);
      expect(metricas.promedio).toBe(0);
      expect(metricas.facturasPagadas).toBe(0);
    });

    it("maneja facturas con total igual a 0", () => {
      const facturasConCero = [{ total: 0, estado: "pendiente" }];
      const metricas = calcularMetricas(facturasConCero);
      expect(metricas.importeTotal).toBe(0);
      expect(metricas.promedio).toBe(0);
    });

    it("calcula promedio correcto con una sola factura", () => {
      const unaFactura = [{ total: 1000, estado: "pagada" }];
      const metricas = calcularMetricas(unaFactura);
      expect(metricas.totalFacturas).toBe(1);
      expect(metricas.importeTotal).toBe(1000);
      expect(metricas.promedio).toBe(1000);
    });

    it("maneja facturas con valores decimales multiples", () => {
      const facturasDecimales = [
        { total: 1234.56, estado: "pendiente" },
        { total: 5678.90, estado: "pagada" }
      ];
      const metricas = calcularMetricas(facturasDecimales);
      expect(metricas.importeTotal).toBeCloseTo(6913.46, 2);
      expect(metricas.promedio).toBeCloseTo(3456.73, 2);
    });
  });

  describe("mostrarDashboard", () => {
    let alertSpy;

    beforeEach(() => {
      alertSpy = spyOn(window, 'alert');
    });

    afterEach(() => {
      alertSpy.and.stub();
    });

    it("muestra las metricas correctamente usando alert", () => {
      mostrarDashboard();
      
      expect(alertSpy).toHaveBeenCalled();
      const alertCall = alertSpy.calls.mostRecent().args[0];
      expect(alertCall).toContain("DASHBOARD");
      expect(alertCall).toContain("Total Facturas");
    });
  });
});


// ============================================================
// 🟡 FLUJO 2: NUEVA FACTURA – CREACIÓN DE FACTURAS (I/O - IMPURAS CON VALIDACIÓN ITERATIVA)
// ============================================================

describe("FLUJO 2: Nueva Factura – Creación de facturas", () => {
  let alertSpy, promptSpy, confirmSpy;

  beforeEach(() => {
    // Configurar spies para alert, prompt y confirm
    alertSpy = spyOn(window, 'alert');
    promptSpy = spyOn(window, 'prompt');
    confirmSpy = spyOn(window, 'confirm');
  });

  afterEach(() => {
    // Restaurar funciones originales después de cada test
    alertSpy.and.stub();
    promptSpy.and.stub();
    confirmSpy.and.stub();
  });

  // --- Validaciones (se usan dentro de crearFactura)
  
  describe("validarTextoObligatorio", () => {
    it("devuelve true con texto valido", () => {
      expect(validarTextoObligatorio("Ramiro")).toBeTrue();
    });

    it("devuelve false con formatos invalidos", () => {
      expect(validarTextoObligatorio("")).toBeFalse();
      expect(validarTextoObligatorio("   ")).toBeFalse();
      expect(validarTextoObligatorio(null)).toBeFalse();
      expect(validarTextoObligatorio(undefined)).toBeFalse();
      expect(validarTextoObligatorio(123)).toBeFalse();
      expect(validarTextoObligatorio({})).toBeFalse();
    });
  });

  describe("validarEmail", () => {
    it("devuelve true con email valido", () => {
      expect(validarEmail("ramiro@email.com")).toBeTrue();
    });

    it("devuelve false con formatos invalidos", () => {
      expect(validarEmail("ramiro@")).toBeFalse();
      expect(validarEmail("ramiro@email")).toBeFalse();
      expect(validarEmail("ramiro")).toBeFalse();
      expect(validarEmail("")).toBeFalse();
      expect(validarEmail("  ")).toBeFalse();
      expect(validarEmail("ramiro@@email..com")).toBeFalse();
    });
  });

  describe("validarCUIT", () => {
    it("devuelve true con cuit valido (con o sin separadores)", () => {
      expect(validarCUIT("20123456781")).toBeTrue();
      expect(validarCUIT("20-12345678-1")).toBeTrue();
      expect(validarCUIT("20 12345678 1")).toBeTrue();
    });

    it("devuelve false con formato invalido", () => {
      expect(validarCUIT("ABCDEFGHJKL")).toBeFalse();
      expect(validarCUIT("201234567810")).toBeFalse();
      expect(validarCUIT("2012345678")).toBeFalse();
      expect(validarCUIT("")).toBeFalse();
      expect(validarCUIT("   ")).toBeFalse();
    });
  });

  describe("validarNumeroPositivo", () => {
    it("devuelve true con numero valido", () => {
      expect(validarNumeroPositivo(5)).toBeTrue();
      expect(validarNumeroPositivo(Number.MAX_SAFE_INTEGER)).toBeTrue();
    });

    it("devuelve false con cero o negativos", () => {
      expect(validarNumeroPositivo(0)).toBeFalse();
      expect(validarNumeroPositivo(-50)).toBeFalse();
    });

    it("devuelve false con string, vacio o null/undefined", () => {
      expect(validarNumeroPositivo("test")).toBeFalse();
      expect(validarNumeroPositivo("5")).toBeFalse();
      expect(validarNumeroPositivo()).toBeFalse();
      expect(validarNumeroPositivo(null)).toBeFalse();
      expect(validarNumeroPositivo(undefined)).toBeFalse();
    });
  });

  describe("validarFecha", () => {
    it("devuelve true con fecha valida en formato YYYY-MM-DD", () => {
      expect(validarFecha("2025-11-30")).toBeTrue();
    });

    it("devuelve false con formato invalido", () => {
      expect(validarFecha("30/12/2025")).toBeFalse();
      expect(validarFecha("")).toBeFalse();
      expect(validarFecha(null)).toBeFalse();
      expect(validarFecha(undefined)).toBeFalse();
    });
  });

  // --- Utilidades que intervienen en la creación

  describe("formatearMoneda", () => {
    it("devuelve un string formateado", () => {
      const s = formatearMoneda(2000);
      expect(typeof s).toBe("string");
      expect(s).toMatch(/\$\s?\d/);
    });

    it("formatea cero correctamente", () => {
      const s = formatearMoneda(0);
      expect(typeof s).toBe("string");
      expect(s).toContain("0");
    });
  });

  describe("calcularTotal", () => {
    it("devuelve resultado valido de la suma", () => {
      expect(calcularTotal(1000, 500)).toBe(1500);
    });
    
    it("subtotal 0 devuelve 0", () => {
      expect(calcularTotal(0)).toBe(0);
    });

    it("maneja redondeo correcto con decimales", () => {
      expect(calcularTotal(1000.123, 210.456)).toBeCloseTo(1210.58, 2);
    });
  });

  describe("generarNumeroFactura", () => {
    let facturas;
    beforeEach(() => facturas = JSON.parse(JSON.stringify(dataStore.facturas)));
    afterEach(() => { dataStore.facturas.length = 0; facturas.forEach(f => dataStore.facturas.push(f)); }); 
  
    it("devuelve 004 con una nueva factura", () => {
      expect(generarNumeroFactura(dataStore.facturas)).toBe("004");
    });

    it("devuelve 001 con dataStore vacio", () => {
      dataStore.facturas.length = 0;
      expect(generarNumeroFactura(dataStore.facturas)).toBe("001");
    });

    it("genera correctamente con numeros no secuenciales", () => {
      const facturasNoSecuenciales = [
        { numero: "001" },
        { numero: "005" },
        { numero: "010" }
      ];
      expect(generarNumeroFactura(facturasNoSecuenciales)).toBe("011");
    });
  });

  // --- Flujo principal de creación

  describe("crearFactura", () => {
    let facturas;
    const client = { cliente: "Rmairo", cuit: "20410101010", email: "ramiro@mail.com", direccion: "street 123", telefono: "011-1234-5678"}
    const items = [{ producto:"Serv", precio:1000 }, { producto:"Prod", precio:500 }];

    beforeEach(() => {
      facturas = JSON.parse(JSON.stringify(dataStore.facturas));
      dataStore.facturas.length = 0;
      dataStore.facturas.push({ numero: "001", total: 1 }, { numero: "010", total: 2});
    });

    afterEach(() => { dataStore.facturas.length = 0; facturas.forEach(f => dataStore.facturas.push(f)); });

    // factura a
    it("devuelve la suma del subtotal y iva por default (21%)", () => {
      const f = crearFactura(client, { tipo: "A", fecha: "2025-10-25", descripcion: 'Test' }, items);
      expect(f.subtotal).toBe(1500)
      expect(f.iva).toBeCloseTo(315, 2);
      expect(f.total).toBeCloseTo(1815, 2);
    });

    // factura b
    it("devuelve la suma del subtotal y iva informativo", () => {
      const f = crearFactura(client, { tipo: "B", fecha: "2025-10-25", descripcion: 'Test' }, items);
      expect(f.subtotal).toBe(1500);
      expect(f.total).toBeCloseTo(1500);
      expect(f.iva).toBeCloseTo(260.33, 2);
    });

    // factura c
    it("devuelve sin iva", () => {
      const f = crearFactura(client, { tipo: "C", fecha: "2025-10-25", descripcion: 'Test' }, items);
      expect(f.subtotal).toBe(1500);
      expect(f.iva).toBe(0);
      expect(f.total).toBe(1500);
    });

    it("maneja items con precios decimales", () => {
      const itemsDecimales = [
        { producto: "Producto 1", precio: 1234.56 },
        { producto: "Producto 2", precio: 789.12 }
      ];
      const f = crearFactura(client, { tipo: "A", fecha: "2025-10-25", descripcion: 'Test' }, itemsDecimales);
      expect(f.subtotal).toBeCloseTo(2023.68, 2);
      expect(f.total).toBeCloseTo(2448.65, 2);
    });

    it("verifica formateo de CUIT en factura creada", () => {
      const f = crearFactura(client, { tipo: "A", fecha: "2025-10-25", descripcion: 'Test' }, items);
      expect(f.cuit).toMatch(/^\d{2}-\d{8}-\d{1}$/);
    });

    it("maneja array de items vacio", () => {
      const f = crearFactura(client, { tipo: "A", fecha: "2025-10-25", descripcion: 'Test' }, []);
      expect(f.subtotal).toBe(0);
      expect(f.iva).toBe(0);
      expect(f.total).toBe(0);
    });
  });

  describe("solicitarDatosCliente", () => {
    it("valida y solicita datos del cliente correctamente", () => {
      // Simular entradas válidas del usuario
      promptSpy.and.returnValues(
        "Juan Pérez",
        "20-12345678-9",
        "Av. Corrientes 123",
        "juan@email.com",
        "011-1234-5678"
      );

      const datos = solicitarDatosCliente();

      expect(datos).not.toBeNull();
      expect(datos.cliente).toBe("Juan Pérez");
      expect(datos.cuit).toBe("20-12345678-9");
      expect(datos.direccion).toBe("Av. Corrientes 123");
      expect(datos.email).toBe("juan@email.com");
      expect(datos.telefono).toBe("011-1234-5678");
      expect(promptSpy).toHaveBeenCalled();
    });

    it("valida CUIT y solicita nuevamente si es invalido", () => {
      promptSpy.and.returnValues(
        "Juan Pérez",
        "123",
        "20-12345678-9",
        "Av. Corrientes 123",
        "juan@email.com",
        "011-1234-5678"
      );

      const datos = solicitarDatosCliente();

      expect(datos).not.toBeNull();
      expect(datos.cuit).toBe("20-12345678-9");
      expect(alertSpy).toHaveBeenCalled(); // Debe mostrar error de validación
    });

    it("permite cancelar durante la entrada de datos", () => {
      promptSpy.and.returnValue(null); // Simular cancelar

      const datos = solicitarDatosCliente();

      expect(datos).toBeNull();
    });

    it("valida email invalido y solicita nuevamente", () => {
      promptSpy.and.returnValues(
        "Juan Pérez",
        "20-12345678-9",
        "Av. Corrientes 123",
        "email-invalido",
        "juan@email.com",
        "011-1234-5678"
      );

      const datos = solicitarDatosCliente();

      expect(datos).not.toBeNull();
      expect(datos.email).toBe("juan@email.com");
      expect(alertSpy).toHaveBeenCalled(); // Debe mostrar error de validación
    });
  });

  describe("solicitarDatosFactura", () => {
    it("solicita y valida datos de factura correctamente", () => {
      promptSpy.and.returnValues(
        "A",
        "2025-01-15",
        "Servicios de consultoría"
      );

      const datos = solicitarDatosFactura();

      expect(datos).not.toBeNull();
      expect(datos.tipo).toBe("A");
      expect(datos.fecha).toBe("2025-01-15");
      expect(datos.descripcion).toBe("Servicios de consultoría");
    });

    it("valida tipo de factura y solicita nuevamente si es invalido", () => {
      promptSpy.and.returnValues(
        "X",
        "A",
        "2025-01-15",
        "Descripción"
      );

      const datos = solicitarDatosFactura();

      expect(datos).not.toBeNull();
      expect(datos.tipo).toBe("A");
      expect(alertSpy).toHaveBeenCalled(); // Debe mostrar error
    });

    it("valida fecha invalida y solicita nuevamente", () => {
      promptSpy.and.returnValues(
        "A",
        "30/12/2025",
        "2025-01-15",
        "Descripción"
      );

      const datos = solicitarDatosFactura();

      expect(datos).not.toBeNull();
      expect(datos.fecha).toBe("2025-01-15");
      expect(alertSpy).toHaveBeenCalled(); // Debe mostrar error
    });
  });

  describe("solicitarItemsFactura", () => {
    it("solicita items y permite agregar múltiples", () => {
      promptSpy.and.returnValues(
        "Producto 1",
        "1000",
        "Producto 2",
        "500"
      );
      confirmSpy.and.returnValues(
        true,                  // agregar otro ítem después del primero
        false                  // no agregar más después del segundo
      );

      const items = solicitarItemsFactura();

      expect(items.length).toBe(2);
      expect(items[0].producto).toBe("Producto 1");
      expect(items[0].precio).toBe(1000);
      expect(items[1].producto).toBe("Producto 2");
      expect(items[1].precio).toBe(500);
    });

    it("valida que el precio sea un numero positivo", () => {
      promptSpy.and.returnValues(
        "Producto 1",
        "abc",
        "1000",
        "Producto 2",
        "-100",
        "500"
      );
      confirmSpy.and.returnValues(
        true,               // agregar otro ítem
        false               // no agregar más
      );

      const items = solicitarItemsFactura();

      expect(items.length).toBe(2);
      expect(alertSpy).toHaveBeenCalled(); // Debe mostrar errores de validación
    });

    it("rechaza precio igual a 0", () => {
      promptSpy.and.returnValues(
        "Producto 1",
        "0",
        "1000"
      );
      confirmSpy.and.returnValue(false); // no agregar más

      const items = solicitarItemsFactura();

      expect(items.length).toBe(1);
      expect(items[0].precio).toBe(1000);
      expect(alertSpy).toHaveBeenCalled(); // Debe mostrar error
    });

    it("maneja cancelación al ingresar producto", () => {
      promptSpy.and.returnValue(null); // Simular cancelar al ingresar producto

      const items = solicitarItemsFactura();

      expect(items.length).toBe(0);
    });

    it("verifica operaciones con array de items", () => {
      promptSpy.and.returnValues(
        "Producto 1",
        "1000",
        "Producto 2",
        "500"
      );
      confirmSpy.and.returnValues(
        true,
        false
      );

      const items = solicitarItemsFactura();

      expect(Array.isArray(items)).toBeTrue();
      expect(items.length).toBe(2);
      expect(items[0].producto).toBeDefined();
      expect(items[0].precio).toBeDefined();
      expect(typeof items[0].precio).toBe('number');
    });
  });
});


// ============================================================
// 🔵 FLUJO 3: FACTURAS – GESTIÓN DE FACTURAS EXISTENTES
// ============================================================

describe("FLUJO 3: Facturas – Gestión de facturas existentes", () => {
  let alertSpy;

  beforeEach(() => {
    alertSpy = spyOn(window, 'alert');
  });

  afterEach(() => {
    alertSpy.and.stub();
  });

  describe("buscarFacturas", () => {
  it("devuelve factura", () => {
      const f1 = buscarFacturas("Juan");
    expect(Array.isArray(f1)).toBeTrue();

      const f2 = buscarFacturas("001");
    expect(f2.find(f => f.numero === "001")).toBeDefined();

      const f3 = buscarFacturas("27-87654321-0");
    expect(f3.find(f => f.cuit.includes("27-87654321-0"))).toBeDefined();
  });

  it("devuelve array vacio cuando no hay coincidencia", () => {
      const f = buscarFacturas("TEST");
    expect(Array.isArray(f)).toBeTrue();
    expect(f.length).toBe(0);
  });

    it("busca sin distinguir mayusculas/minusculas", () => {
      const f1 = buscarFacturas("juan");
      const f2 = buscarFacturas("JUAN");
      expect(f1.length).toBe(f2.length);
      expect(f1.length).toBeGreaterThan(0);
    });
  });

  describe("listarFacturas", () => {
    it("muestra lista de facturas usando alert", () => {
      listarFacturas();

      expect(alertSpy).toHaveBeenCalled();
      const alertCall = alertSpy.calls.mostRecent().args[0];
      expect(alertCall).toContain("LISTADO DE FACTURAS");
    });

    it("muestra mensaje cuando no hay facturas", () => {
      const facturasOriginales = JSON.parse(JSON.stringify(dataStore.facturas));
      dataStore.facturas.length = 0;

      listarFacturas();

      expect(alertSpy).toHaveBeenCalled();
      const alertCall = alertSpy.calls.mostRecent().args[0];
      expect(alertCall).toContain("No hay facturas registradas");

      // Restaurar
      dataStore.facturas.length = 0;
      facturasOriginales.forEach(f => dataStore.facturas.push(f));
    });
  });

  describe("mostrarDetalleFactura", () => {
    it("muestra detalle completo de factura", () => {
      const factura = dataStore.facturas[0];
      mostrarDetalleFactura(factura);

      expect(alertSpy).toHaveBeenCalled();
      const alertCall = alertSpy.calls.mostRecent().args[0];
      expect(alertCall).toContain("DETALLE DE FACTURA");
      expect(alertCall).toContain(factura.numero);
      expect(alertCall).toContain(factura.cliente);
    });

    it("maneja factura con múltiples items", () => {
      const facturaConMultiplesItems = {
        ...dataStore.facturas[0],
        items: [
          { producto: "Item 1", precio: 100 },
          { producto: "Item 2", precio: 200 },
          { producto: "Item 3", precio: 300 }
        ]
      };
      mostrarDetalleFactura(facturaConMultiplesItems);

      expect(alertSpy).toHaveBeenCalled();
      const alertCall = alertSpy.calls.mostRecent().args[0];
      expect(alertCall).toContain("Items:");
      expect(alertCall).toContain("Item 1");
      expect(alertCall).toContain("Item 2");
      expect(alertCall).toContain("Item 3");
    });
  });
});


// ============================================================
// 🟣 FLUJO 4: CONFIGURACIÓN – CONFIGURACIÓN DE IMPUESTOS
// ============================================================

describe("FLUJO 4: Configuración – Impuestos", () => {
  let alertSpy, promptSpy, confirmSpy;

  beforeEach(() => {
    // Configurar spies para alert, prompt y confirm
    alertSpy = spyOn(window, 'alert');
    promptSpy = spyOn(window, 'prompt');
    confirmSpy = spyOn(window, 'confirm');
  });

  afterEach(() => {
    // Restaurar funciones originales después de cada test
    alertSpy.and.stub();
    promptSpy.and.stub();
    confirmSpy.and.stub();
  });

  describe("calcularIVA", () => {
    it("21% por defecto", () => {
      expect(calcularIVA(1000)).toBeCloseTo(210, 2);
    });
  
    it("10% de 1000", () => {
      expect(calcularIVA(1000, 10)).toBeCloseTo(100, 2);
    });

    it("maneja decimales (1500.50 de 21%)", () => {
      expect(calcularIVA(1500.50)).toBeCloseTo(315.10, 2);
    });

    it("calcula IVA con porcentaje 0 (retorna 0)", () => {
      expect(calcularIVA(1000, 0)).toBe(0);
    });

    it("calcula IVA con subtotal 0 (retorna 0)", () => {
      expect(calcularIVA(0)).toBe(0);
    });
  });

  describe("listarImpuestos", () => {
    let impuestosOriginales;

    beforeEach(() => {
      impuestosOriginales = JSON.parse(JSON.stringify(dataStore.impuestos));
    });

    afterEach(() => {
      dataStore.impuestos.length = 0;
      impuestosOriginales.forEach(i => dataStore.impuestos.push(i));
    });

    it("lista todos los impuestos usando alert", () => {
      listarImpuestos();

      expect(alertSpy).toHaveBeenCalled();
      const alertCall = alertSpy.calls.mostRecent().args[0];
      expect(alertCall).toContain("IMPUESTOS CONFIGURADOS");
    });

    it("muestra mensaje cuando no hay impuestos", () => {
      dataStore.impuestos.length = 0;

      listarImpuestos();

      expect(alertSpy).toHaveBeenCalled();
      const alertCall = alertSpy.calls.mostRecent().args[0];
      expect(alertCall).toContain("No hay impuestos configurados");
    });
  });

  describe("agregarImpuesto", () => {
    let impuestosOriginales;

    beforeEach(() => {
      impuestosOriginales = JSON.parse(JSON.stringify(dataStore.impuestos));
    });

    afterEach(() => {
      dataStore.impuestos.length = 0;
      impuestosOriginales.forEach(i => dataStore.impuestos.push(i));
    });

    it("solicita datos y agrega un nuevo impuesto", () => {
      promptSpy.and.returnValues(
        "Ganancias",
        "15"
      );
      confirmSpy.and.returnValue(true);

      const impuestosAntes = dataStore.impuestos.length;
      agregarImpuesto();

      expect(dataStore.impuestos.length).toBe(impuestosAntes + 1);
      const nuevoImpuesto = dataStore.impuestos[dataStore.impuestos.length - 1];
      expect(nuevoImpuesto.nombre).toBe("Ganancias");
      expect(nuevoImpuesto.porcentaje).toBe(15);
      expect(nuevoImpuesto.activo).toBe(true);
      expect(alertSpy).toHaveBeenCalled(); // Confirmación de agregado
    });

    it("valida que el nombre sea obligatorio (vacio)", () => {
      promptSpy.and.returnValues(
        "",
        "Impuesto",
        "15"
      );
      confirmSpy.and.returnValue(true);

      agregarImpuesto();

      expect(alertSpy).toHaveBeenCalled(); // Debe mostrar error
      const nuevoImpuesto = dataStore.impuestos[dataStore.impuestos.length - 1];
      expect(nuevoImpuesto.nombre).toBe("Impuesto");
    });

    it("valida que el porcentaje este entre 0 y 100", () => {
      promptSpy.and.returnValues(
        "Impuesto Test",
        "150",
        "25"
      );
      confirmSpy.and.returnValue(true);

      agregarImpuesto();

      expect(alertSpy).toHaveBeenCalled(); // Debe mostrar error
      const nuevoImpuesto = dataStore.impuestos[dataStore.impuestos.length - 1];
      expect(nuevoImpuesto.porcentaje).toBe(25);
    });

    it("rechaza porcentaje negativo", () => {
      promptSpy.and.returnValues(
        "Impuesto Test",
        "-10",
        "25"
      );
      confirmSpy.and.returnValue(true);

      agregarImpuesto();

      expect(alertSpy).toHaveBeenCalled(); // Debe mostrar error
      const nuevoImpuesto = dataStore.impuestos[dataStore.impuestos.length - 1];
      expect(nuevoImpuesto.porcentaje).toBe(25);
    });

    it("rechaza porcentaje mayor a 100", () => {
      promptSpy.and.returnValues(
        "Impuesto Test",
        "101",
        "25"
      );
      confirmSpy.and.returnValue(true);

      agregarImpuesto();

      expect(alertSpy).toHaveBeenCalled(); // Debe mostrar error
    });

    it("verifica operaciones con array de impuestos", () => {
      promptSpy.and.returnValues(
        "Impuesto Test",
        "25"
      );
      confirmSpy.and.returnValue(true);

      const impuestosAntes = dataStore.impuestos.length;
      agregarImpuesto();

      expect(Array.isArray(dataStore.impuestos)).toBeTrue();
      expect(dataStore.impuestos.length).toBe(impuestosAntes + 1);
      const nuevoImpuesto = dataStore.impuestos[dataStore.impuestos.length - 1];
      expect(nuevoImpuesto.id).toBeDefined();
      expect(nuevoImpuesto.nombre).toBeDefined();
      expect(nuevoImpuesto.porcentaje).toBeDefined();
      expect(nuevoImpuesto.activo).toBeDefined();
    });
  });

  describe("usarCalculadoraIVA", () => {
    it("calcula IVA correctamente y muestra resultado", () => {
      promptSpy.and.returnValues(
        "1000",
        "21"
      );

      usarCalculadoraIVA();

      expect(alertSpy).toHaveBeenCalled();
      const alertCall = alertSpy.calls.mostRecent().args[0];
      expect(alertCall).toContain("CALCULADORA DE IVA");
      expect(alertCall).toContain("Precio neto");
    });

    it("usa 21% por defecto si no se ingresa porcentaje", () => {
      promptSpy.and.returnValues(
        "1000",
        ""
      );

      usarCalculadoraIVA();

      expect(alertSpy).toHaveBeenCalled();
    });

    it("valida que el precio sea un numero positivo", () => {
      promptSpy.and.returnValues(
        "abc",
        "1000",
        "21"
      );

      usarCalculadoraIVA();

      expect(alertSpy).toHaveBeenCalled(); // Debe mostrar el resultado
      expect(promptSpy.calls.count()).toBeGreaterThan(2); // Debe haber solicitado el precio dos veces
    });

    it("rechaza precio negativo o cero", () => {
      promptSpy.and.returnValues(
        "-100",
        "1000",
        "21"
      );

      usarCalculadoraIVA();

      expect(alertSpy).toHaveBeenCalled(); // Debe mostrar error de validación
    });
  });
});
