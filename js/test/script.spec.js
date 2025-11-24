import { SistemaFacturacion } from "../models/SistemaFacturacion.js";
import { Cliente } from "../models/Cliente.js";
import { ItemFactura } from "../models/ItemFactura.js";
import { Impuesto } from "../models/Impuesto.js";

describe("Flujos del sistema", () => {
  let sistema;

  beforeEach(() => {
    sistema = new SistemaFacturacion();
    sistema.limpiarTodo();
  });

  // ============================================================
  // 🟢 FLUJO 1: DASHBOARD Y MÉTRICAS
  // ============================================================
  describe("FLUJO 1: Dashboard y Visualización de Métricas", () => {
    it("Calcula metricas iniciales vacias correctamente", () => {
      const metricas = sistema.getMetrics();
      expect(metricas.cantidad).toBe(0);
      expect(metricas.totalFacturado).toBe(0);
      expect(metricas.pagadas).toBe(0);
    });

    it("Actualiza metricas al agregar facturas", () => {
      const cliente = new Cliente({ nombre: "Felipe", cuit: "20-1234567-11", direccion: "Street", email: "felipe@gmail.com", telefono: "1156858689"});
      const items = [new ItemFactura({ producto: "Chocolate", precio: 1000 })];
    
      sistema.crearFactura({ cliente, tipo: "C", fecha: "2025-11-21", descripcion: "F1", items});

      const metricas = sistema.getMetrics();
      expect(metricas.cantidad).toBe(1);
      expect(metricas.totalFacturado).toBeCloseTo(1000, 2);

      console.log(metricas);
    })

    it("Distingue entre facturas pagadas y pendientes en las metricas", () => {
      const cliente = new Cliente({ nombre: "Felipe", cuit: "20-1234567-11", direccion: "Street", email: "felipe@gmail.com", telefono: "1156858689"});
      const items = [new ItemFactura({ producto: "Chocolate", precio: 1000 })];
      
      const f1 = sistema.crearFactura({ cliente, tipo: "C", fecha: "2025-11-21", descripcion: "F1", items});
      const f2 = sistema.crearFactura({ cliente, tipo: "C", fecha: "2025-11-21", descripcion: "F2", items});

      sistema.marcarPagadaPorId(f1.id);

      const metricas = sistema.getMetrics();
      expect(metricas.pagadas).toBe(1);
      expect(metricas.pendientes).toBe(1);
      expect(metricas.cantidad).toBe(2);

      console.log(metricas);

    });
  });

  // ============================================================
  // 🟡 FLUJO 2: PROCESO DE FACTURACIÓN
  // ============================================================
  describe("FLUJO 2: Generación de nuevas facturas", () => {
    it("Permite crear facturas A, B Y C", () => {
      const cliente = new Cliente({ nombre: "Felipe", cuit: "20-1234567-11", direccion: "Street", email: "felipe@gmail.com", telefono: "1156858689"});
      const items = [new ItemFactura({ producto: "Chocolate", precio: 1000 })];

      // Sin IVA (Factura C)
      const factC = sistema.crearFactura({ cliente, tipo: "C", fecha: "2025-11-21", descripcion: "Factura C", items}); 
      expect(factC.total).toBe(1000);

      // Con IVA (FACTURA A)
      const factA = sistema.crearFactura({ cliente, tipo: "A", fecha: "2025-11-21", descripcion: "Factura A", items}); 
      expect(factA.total).toBe(1210)
    });

    it("Genera números de factura consecutivos", () => {
      const cliente = new Cliente({ nombre: "Felipe", cuit: "20-1234567-11", direccion: "Street", email: "felipe@gmail.com", telefono: "1156858689"});
      const items = [new ItemFactura({ producto: "Chocolate", precio: 1000 })];

      const f1 = sistema.crearFactura({ cliente, tipo: "B", fecha: "2025-11-21", descripcion: "Primera factura", items });
      const f2 = sistema.crearFactura({ cliente, tipo: "B", fecha: "2023-11-21", descripcion: "Segunda factura", items });
      
      expect(f1.numero).toBe("001");
      expect(f2.numero).toBe("002");
    });
  });

  // ============================================================
  // 🔵 FLUJO 3: GESTIÓN (BUSQUEDA Y LISTADO)
  // ============================================================
  describe("FLUJO 3: Gestión de facturas", () => {
    it("Busca facturas por nombre de cliente", () => {
      const cliente = new Cliente({ nombre: "Felipe", cuit: "20-1234567-11", direccion: "Street", email: "felipe@gmail.com", telefono: "1156858689"});
      const items = [new ItemFactura({ producto: "Chocolate", precio: 1000 })];
      sistema.crearFactura({ cliente, tipo: "C", fecha: "2025-11-21", descripcion: "Factura C", items});

      const resultados = sistema.buscar("felipe");
      expect(resultados.length).toBe(1);
      expect(resultados[0].cliente.nombre).toBe("Felipe");
    });

    it("Busca facturas por número", () => {
      const cliente = new Cliente({ nombre: "Felipe", cuit: "20-1234567-11", direccion: "Street", email: "felipe@gmail.com", telefono: "1156858689"});
      const items = [new ItemFactura({ producto: "Chocolate", precio: 1000 })];

      sistema.crearFactura({ cliente, tipo: "C", fecha: "2025-11-21", descripcion: "Factura C", items});

      const resultados = sistema.buscar("001");
      expect(resultados.length).toBe(1);
      expect(resultados[0].numero).toBe("001");
    });
  });

  // ============================================================
  // 🟣 FLUJO 4: CONFIGURACIÓN DE IMPUESTOS
  // ============================================================
  describe("FLUJO 4: Configuración e Impuestos", () => {
    it("Permite agregar un nuevo impuesto", () => {
      sistema.agregarImpuesto(new Impuesto({ id: 1, nombre: "IIBB", porcentaje: 10, activo: true }));

      const imp = sistema.getImpuestoByNombre("IIBB");
      expect(imp).toBeDefined();
      expect(imp.porcentaje).toBe(10);
    });

    it("Afecta el calculo de nuevas facturas si se modifica el IVA", () => {
      sistema.agregarImpuesto(new Impuesto({ id: 1, nombre: "IVA", porcentaje: 10, activo: true }));
      const cliente = new Cliente({ nombre: "Felipe", cuit: "20-1234567-11", direccion: "Street", email: "felipe@gmail.com", telefono: "1156858689"});
      const items = [new ItemFactura({ producto: "Chocolate", precio: 1000 })];

      const factura = sistema.crearFactura({ cliente, tipo: "A", fecha: "2025-11-21", descripcion: "Factura con 10% de impuesto", items});

      expect(factura.total).toBeCloseTo(1100, 2);
    });
  });
  
})