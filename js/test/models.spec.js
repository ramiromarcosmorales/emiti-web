import { Cliente } from "../models/Cliente.js";
import { ItemFactura } from "../models/ItemFactura.js";
import { Factura } from "../models/Factura.js";
import { SistemaFacturacion } from "../models/SistemaFacturacion.js";
import { Impuesto } from "../models/Impuesto.js";

describe("POO - Modelos de Emití", () => {

  // ----------------------- CLIENTE -----------------------
  describe("Cliente", () => {
    it("crea un cliente válido y normaliza el CUIT", () => {
      const c = new Cliente({
        nombre: "Homero Simpson",
        cuit: "20-12345678-1",
        direccion: "Evergreen Terrace 742",
        email: "homero@simpson.com",
        telefono: "1150054004"
      });

      expect(c.nombre).toBe("Homero Simpson");
      expect(c.cuit).toMatch(/^\d{11}$/);
      expect(c.cuit).toBe("20123456781");
    });

    it("lanza error si el CUIT no tiene 11 dígitos numéricos", () => {
      expect(() => new Cliente({
        nombre: "Homero Simpson",
        cuit: "20001",
        direccion: "Evergreen Terrace 742",
        email: "homero@simpson.com",
        telefono: "1150054004"
      })).toThrowError("El CUIT debe tener exactamente 11 dígitos numéricos.");
    });

    it("lanza error si el email es inválido", () => {
      expect(() => new Cliente({
        nombre: "Homero Simpson",
        cuit: "20-12345678-1",
        direccion: "Evergreen Terrace 742",
        email: "no-es-un-mail",
        telefono: "1150054004"
      })).toThrow();
    });
  });

  // ----------------------- ITEM FACTURA -----------------------
  describe("ItemFactura", () => {
    it("calcula el subtotal como precio * cantidad", () => {
      const item = new ItemFactura({
        producto: "Servicio X",
        precio: 1000,
        cantidad: 3
      });

      expect(item.subtotal()).toBe(3000);
    });

    it("lanza error si el precio es inválido", () => {
      expect(() => new ItemFactura({
        producto: "Servicio X",
        precio: -100,
        cantidad: 1
      })).toThrow();
    });

    it("lanza error si la cantidad es inválida", () => {
      expect(() => new ItemFactura({
        producto: "Servicio X",
        precio: 1000,
        cantidad: 0
      })).toThrow();
    });
  });

  // ----------------------- FACTURA -----------------------
  describe("Factura", () => {
    function crearFacturaBase() {
      const cliente = new Cliente({
        nombre: "Cliente Test",
        cuit: "20-12345678-1",
        direccion: "Calle Falsa 123",
        email: "cliente@test.com",
        telefono: "1122334455"
      });

      const items = [
        new ItemFactura({ producto: "Producto 1", precio: 1000, cantidad: 2 }),
        new ItemFactura({ producto: "Producto 2", precio: 500, cantidad: 1 })
      ];

      return { cliente, items };
    }

    it("calcula subtotal, IVA y total correctamente para tipo A", () => {
      const { cliente, items } = crearFacturaBase();

      const factura = new Factura({
        id: 1,
        numero: "001",
        cliente,
        tipo: "A",
        fecha: "2025-11-12",
        descripcion: "Factura de prueba",
        items,
        tasaIVA: 21,
        estado: "pendiente"
      });

      const subtotal = factura.calcularSubtotal();
      const iva = factura.calcularIVA();
      const total = factura.calcularTotal();

      expect(subtotal).toBe(2500);
      expect(iva).toBeCloseTo(525, 2);   // 21% de 2500
      expect(total).toBeCloseTo(3025, 2);
      expect(factura.total).toBeCloseTo(total, 2);
    });

    it("marca la factura como pagada y lanza error si ya lo estaba", () => {
      const { cliente, items } = crearFacturaBase();

      const factura = new Factura({
        id: 1,
        numero: "001",
        cliente,
        tipo: "A",
        fecha: "2025-11-12",
        descripcion: "Factura de prueba",
        items,
        tasaIVA: 21,
        estado: "pendiente"
      });

      factura.marcarPagada();
      expect(factura.estado).toBe("pagada");

      expect(() => factura.marcarPagada()).toThrow();
    });

    it("serializa y deserializa correctamente con toJSON / fromJSON", () => {
      const { cliente, items } = crearFacturaBase();

      const factura = new Factura({
        id: 1,
        numero: "001",
        cliente,
        tipo: "A",
        fecha: "2025-11-12",
        descripcion: "Factura de prueba",
        items,
        tasaIVA: 21,
        estado: "pendiente"
      });

      const json = factura.toJSON();
      const copia = Factura.fromJSON(json);

      expect(copia.id).toBe(factura.id);
      expect(copia.numero).toBe(factura.numero);
      expect(copia.cliente.nombre).toBe(factura.cliente.nombre);
      expect(copia.items.length).toBe(factura.items.length);
      expect(copia.total).toBeCloseTo(factura.total, 2);
    });
  });

  // ----------------------- SISTEMA FACTURACIÓN -----------------------
  describe("SistemaFacturacion", () => {
    it("crea facturas, permite marcarlas como pagadas y eliminarlas", () => {
      const sistema = new SistemaFacturacion();

      const cliente = new Cliente({
        nombre: "Cliente Sistema",
        cuit: "20-55555555-5",
        direccion: "Calle Sistema 123",
        email: "sistema@test.com",
        telefono: "1199999999"
      });

      const items = [
        new ItemFactura({ producto: "Servicio Sistema", precio: 2000, cantidad: 1 })
      ];

      const factura = sistema.crearFactura({
        cliente,
        tipo: "A",
        fecha: "2025-11-12",
        descripcion: "Factura en sistema",
        items
      });

      expect(sistema.facturas.length).toBe(1);

      // Métricas
      const metrics = sistema.getMetrics();
      expect(metrics.cantidad).toBe(1);
      expect(metrics.totalFacturado).toBeCloseTo(factura.total, 2);
      expect(metrics.pagadas).toBe(0);

      // Marcar pagada
      sistema.marcarPagadaPorId(factura.id);
      const pagada = sistema.getFacturaById(factura.id);
      expect(pagada.estado).toBe("pagada");

      // Eliminar
      sistema.eliminarFactura(factura.id);
      expect(sistema.getFacturaById(factura.id)).toBeNull();
      expect(sistema.facturas.length).toBe(0);
    });

    it("usa una tasa de IVA por defecto si no hay impuesto configurado", () => {
      const sistema = new SistemaFacturacion();
      expect(typeof sistema.tasaIVA()).toBe("number");
    });

    it("permite agregar un impuesto y evita duplicados por nombre", () => {
      const sistema = new SistemaFacturacion();

      sistema.agregarImpuesto(new Impuesto({
        id: 1,
        nombre: "IVA",
        porcentaje: 21,
        activo: true
      }));

      expect(() => sistema.agregarImpuesto({
        id: 2,
        nombre: "IVA",
        porcentaje: 21,
        activo: true
      })).toThrow();
    });
  });
});
