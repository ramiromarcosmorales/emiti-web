const E = () => window.Emiti;

describe("Validaciones y utilidades", () => {
  describe("validarTextoObligatorio", () => {
    it("devuelve true con texto válido", () => {
      expect(E().validarTextoObligatorio("Ramiro")).toBeTrue();
    });

    it("devuelve false con formatos inválidos", () => {
      expect(E().validarTextoObligatorio("")).toBeFalse();
      expect(E().validarTextoObligatorio("   ")).toBeFalse();
      expect(E().validarTextoObligatorio(null)).toBeFalse();
      expect(E().validarTextoObligatorio(undefined)).toBeFalse();
      expect(E().validarTextoObligatorio(123)).toBeFalse();
      expect(E().validarTextoObligatorio({})).toBeFalse();
    });
  });

  describe("validarEmail", () => {
    it("devuelve true con email válido", () => {
      expect(E().validarEmail("ramiro@email.com")).toBeTrue();
    });

    it("devuelve false con formatos inválidos", () => {
      expect(E().validarEmail("ramiro@")).toBeFalse();
      expect(E().validarEmail("ramiro@email")).toBeFalse();
      expect(E().validarEmail("ramiro")).toBeFalse();
      expect(E().validarEmail("")).toBeFalse();
      expect(E().validarEmail("  ")).toBeFalse();
      expect(E().validarEmail("ramiro@@email..com")).toBeFalse();
    });
  });

  describe("validarCUIT", () => {
    it("devuelve true con cuit válido (con o sin separadores)", () => {
      expect(E().validarCUIT("20123456781")).toBeTrue();
      expect(E().validarCUIT("20-12345678-1")).toBeTrue();
      expect(E().validarCUIT("20 12345678 1")).toBeTrue();
    });

    it("devuelve false con formato inválido", () => {
      expect(E().validarCUIT("ABCDEFGHJKL")).toBeFalse();
      expect(E().validarCUIT("201234567810")).toBeFalse();
      expect(E().validarCUIT("2012345678")).toBeFalse();
      expect(E().validarCUIT("")).toBeFalse();
      expect(E().validarCUIT("   ")).toBeFalse();
    });
  });

  describe("validarNumeroPositivo", () => {
    it("devuelve true con número válido", () => {
      expect(E().validarNumeroPositivo(5)).toBeTrue();
      expect(E().validarNumeroPositivo(Number.MAX_SAFE_INTEGER)).toBeTrue();
    });

    it("devuelve false con cero o negativos", () => {
      expect(E().validarNumeroPositivo(0)).toBeFalse();
      expect(E().validarNumeroPositivo(-50)).toBeFalse();
    });

    it("devuelve false con string, vacío o null/undefined", () => {
      expect(E().validarNumeroPositivo("test")).toBeFalse();
      expect(E().validarNumeroPositivo("5")).toBeFalse();
      expect(E().validarNumeroPositivo()).toBeFalse();
      expect(E().validarNumeroPositivo(null)).toBeFalse();
      expect(E().validarNumeroPositivo(undefined)).toBeFalse();
    });
  });

  describe("validarFecha", () => {
    it("devuelve true con fecha válida en formato YYYY-MM-DD", () => {
      expect(E().validarFecha("2025-11-30")).toBeTrue();
    });

    it("devuelve false con formato invalido", () => {
      expect(E().validarFecha("30/12/2025")).toBeFalse();
      expect(E().validarFecha("")).toBeFalse();
      expect(E().validarFecha(null)).toBeFalse();
      expect(E().validarFecha(undefined)).toBeFalse();
    });
  });

  describe("formatearMoneda", () => {
    it("devuelve un string formateado", () => {
      const s = E().formatearMoneda(2000);
      expect(typeof s).toBe("string");
      expect(s).toMatch(/\$\s?\d/);
    });

    // pendiente de definir contrato, cuando se vea excepciones se puede validar esto
    it("maneja entradas inválidas de forma controlada (definir contrato)", () => {
      expect(() => E().formatearMoneda("test")).toThrow();
      expect(() => E().formatearMoneda("")).toThrow();
      expect(() => E().formatearMoneda(null)).toThrow();
      expect(() => E().formatearMoneda(undefined)).toThrow();
    });
  });
});


describe("Cálculos de facturación", () => {
  describe("calcularIVA", () => {
    it("21% por defecto", () => {
      expect(E().calcularIVA(1000)).toBeCloseTo(210, 2);
    });
  
    it("10% de 1000", () => {
      expect(E().calcularIVA(1000, 10)).toBeCloseTo(100, 2);
    });

    it("maneja decimales (1500.50 de 21%)", () => {
      expect(E().calcularIVA(1500.50)).toBeCloseTo(315.10, 2);
    });
  });

  describe("calcularTotal", () => {
    it("devuelve resultado válido de la suma", () => {
      expect(E().calcularTotal(1000, 500)).toBe(1500);
    });
    
    it("subtotal 0 devuelve 0", () => {
      expect(E().calcularTotal(0)).toBe(0);
    });
  });

  describe("otro", () => {
    it("subtotal 1000 devuelve mmm", () => {
      expect(E().calcularTotal(1000)).toBe(0);
    });
  })

  describe("generarNumeroFactura", () => {
    let facturas;
    beforeEach(() => facturas = JSON.parse(JSON.stringify(E().dataStore.facturas)));
    afterEach(() => { E().dataStore.facturas.length = 0; facturas.forEach(f => E().dataStore.facturas.push(f)); }); 
  
    it("devuelve 004 con una nueva factura", () => {
      expect(E().generarNumeroFactura()).toBe("004");
    });

    it("devuelve 001 con dataStore vacío", () => {
      E().dataStore.facturas.length = 0;
      expect(E().generarNumeroFactura()).toBe("001");
    });
  });

  describe("crearFactura", () => {
    let facturas;
    const client = { cliente: "Rmairo", cuit: "20410101010", email: "ramiro@mail.com", direccion: "street 123"}
    const items = [{ producto:"Serv", precio:1000 }, { producto:"Prod", precio:500 }];

    beforeEach(() => {
      facturas = JSON.parse(JSON.stringify(E().dataStore.facturas));
      E().dataStore.facturas.length = 0;
      E().dataStore.facturas.push({ numero: "001", total: 1 }, { numero: "010", total: 2});
    });

    afterEach(() => { E().dataStore.facturas.length = 0; facturas.forEach(f => E().dataStore.facturas.push(f)); });

    // factura a
    it("devuelve la suma del subtotal y iva por default (21%)", () => {
      const f = E().crearFactura(client, { tipo: "A", fecha: "2025-10-25", descripcion: 'Test' }, items);
      expect(f.subtotal).toBe(1500)
      expect(f.iva).toBeCloseTo(315, 2);
      expect(f.total).toBeCloseTo(1815, 2);
    });

    // factura b
    it("devuelve la suma del subtotal y iva informativo", () => {
      const f = E().crearFactura(client, { tipo: "B", fecha: "2025-10-25", descripcion: 'Test' }, items);
      expect(f.subtotal).toBe(1500);
      expect(f.total).toBeCloseTo(1500);
      expect(f.iva).toBeCloseTo(315, 2);
    });

    // factura c
    it("devuelve sin iva", () => {
      const f = E().crearFactura(client, { tipo: "C", fecha: "2025-10-25", descripcion: 'Test' }, items);
      expect(f.subtotal).toBe(1500);
      expect(f.iva).toBe(0);
      expect(f.total).toBe(1500);
    });
  });
});

describe("Gestión de Facturas", () => {
  it("devuelve factura", () => {
    const f1 = E().buscarFacturas("Juan");
    expect(Array.isArray(f1)).toBeTrue();

    const f2 = E().buscarFacturas("001");
    expect(f2.find(f => f.numero === "001")).toBeDefined();

    const f3 = E().buscarFacturas("27-87654321-0");
    expect(f3.find(f => f.cuit.includes("27-87654321-0"))).toBeDefined();
  });

  it("devuelve array vacio cuando no hay coincidencia", () => {
    const f = E().buscarFacturas("TEST");
    expect(Array.isArray(f)).toBeTrue();
    expect(f.length).toBe(0);
  });

});

describe("Métricas del Dashboard", () => {
  it("calcularMetricas", () => {
    const metricas = E().calcularMetricas();
    // se asumen los sig. valores de acuerdo a la dataset definida
    expect(metricas.totalFacturas).toBe(3);
    expect(metricas.facturasPagadas).toBe(1);
    expect(typeof metricas.importeTotal).toBe("number");
    expect(typeof metricas.promedio).toBe("number");
  })
});