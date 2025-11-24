import { Cliente } from "../models/Cliente.js";
import { ItemFactura } from "../models/ItemFactura.js";
import { Factura } from "../models/Factura.js";
import { SistemaFacturacion } from "../models/SistemaFacturacion.js";
import { Impuesto } from "../models/Impuesto.js";

describe("POO - Modelos de Emití", () => {

  // ----------------------- CLIENTE -----------------------
  describe("Cliente", () => {
    describe("Constructor y Validaciones", () => {
      it("Debe crear un cliente válido y normaliza CUIT", () => {
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

      it("Debe lanzar error si el nombre está vacío", () => {
        expect(() => new Cliente({ nombre: "", cuit: "20-12345678-1", direccion: "Evergreen Terrace 742", email: "homero@simpson.com", telefono: "1150054004"}))
          .toThrowError(/nombre es obligatorio/);
      });

      it("Debe lanzar error si el email es inválido", () => {
        expect(() => new Cliente({ nombre: "Homero", cuit: "20-12345678-1", direccion: "Evergreen Terrace 742", email: "homero@.com", telefono: "1150054004"}))
        .toThrowError(/email ingresado no tiene un formato válido/);
      });

      it("Debe lanzar error si el CUIT no tiene 11 digitos", () => {
        expect(() => new Cliente({ nombre: "Homero", cuit: "123-23-32", direccion: "Evergreen Terrace 742", email: "homero@simpson.com", telefono: "1150054004"}))
          .toThrowError(/CUIT debe tener exactamente 11 dígitos numéricos/);
      });
    });

    describe("Serialización", () => {
      it("toJSON debe retornar un objeto plano correcto", () => {
        const c = new Cliente({
          nombre: "Homero Simpson",
          cuit: "20-12345678-1",
          direccion: "Evergreen Terrace 742",
          email: "homero@simpson.com",
          telefono: "1150054004"
        });
        const json = c.toJSON();
        expect(json.nombre).toBe("Homero Simpson");
        expect(json.cuit).toBe("20123456781")
      });

      it("fromJSON debe reconstruir instancia de Cliente", () => {
        const data = {
          nombre: "Homero Simpson",
          cuit: "20-12345678-1",
          direccion: "Evergreen Terrace 742",
          email: "homero@simpson.com",
          telefono: "1150054004"
        };
        const c = Cliente.fromJSON(data);

        expect(c).toBeInstanceOf(Cliente);
        expect(c.nombre).toBe("Homero Simpson");
      });
    });
  });

  // ----------------------- ITEM FACTURA -----------------------
  describe("ItemFactura", () => {
    it("Calcula subtotal correctamente", () => {
      const item = new ItemFactura({ producto: "Item", precio: 1000, cantidad: 5});
      expect(item.subtotal()).toBe(5000);
    });

    it("Debe lanzar error con precio negativo", () => {
      expect(() => new ItemFactura({ producto: "Item", precio: -1000, cantidad: 5})).toThrowError(/Precio inválido/);
    });

    it("toJSON y fromJSON funcionan correctamente", () => {
      const item = new ItemFactura({ producto: "Item", precio: 10, cantidad: 2 });
      const copia = ItemFactura.fromJSON(item.toJSON());
      expect(copia).toBeInstanceOf(ItemFactura);
      expect(copia.subtotal()).toBe(20);
    });

    it("Debe lanzar error si el nombre del producto está vacío", () => {
      expect(() => new ItemFactura({ producto: "", precio: 1000 }))
          .toThrowError("El producto es obligatorio.");
          
      expect(() => new ItemFactura({ producto: "   ", precio: 1000 }))
          .toThrowError("El producto es obligatorio.");
          
      expect(() => new ItemFactura({ producto: null, precio: 1000 }))
          .toThrowError("El producto es obligatorio.");
    });
  });

  // ----------------------- IMPUESTO -----------------------
  describe("Impuesto", () => {
    it("Crea impuesto válido", () => {
      const imp = new Impuesto({ id: 1, nombre: "IIBB", porcentaje: "10", activo: true });
      expect(imp.porcentaje).toBe(10);
    });

    it("Debe lanzar error si el porcentaje esta fuera del rango 0-100", () => {
      expect(() => new Impuesto({ id: 1, nombre: "IIBB", porcentaje: "101", activo: true })).toThrowError(/entre 0 y 100/);
    });

    it("Debe lanzar error si el nombre está vacío", () => {
      expect(() => new Impuesto({ id: 1, nombre: "", porcentaje: 10, activo: true })).toThrowError(/nombre del impuesto es obligatorio/);
    });
  });

  // ----------------------- FACTURA -----------------------
  describe("Factura", () => {
    let cliente, items;
    beforeEach(() => {
      cliente = new Cliente({
        nombre: "Homero Simpson",
        cuit: "20-12345678-1",
        direccion: "Evergreen Terrace 742",
        email: "homero@simpson.com",
        telefono: "1150054004"
      });
      items = [new ItemFactura({ producto: "Item", precio: 100, cantidad: 10})];
    });

    it("Constructor valida que existan items", () => {
      expect(() => new Factura({ id: 1, numero: "001", cliente, tipo: "B", fecha: "2025-11-25", items: [] }))
        .toThrowError(/debe contener al menos un ítem/);
    });

    it("Constructor valida tipo de factura válido", () => {
      expect(() => new Factura({ id: 1, numero: "001", cliente, tipo: "Z", fecha: "2025-11-25", items}))
        .toThrowError(/tipo de factura debe ser A, B o C/);
    });

    it("Debe lanzar error si la tasa IVA es inválida", () => {
      expect(() => new Factura({ id: 1, numero: "001", cliente, tipo: "A", fecha: "2025-11-21", items, tasaIVA: -5}))
        .toThrowError(/tasa de IVA es inválida/);

        expect(() => new Factura({ id: 1, numero: "001", cliente, tipo: "A", fecha: "2025-11-21", items, tasaIVA: "test"}))
        .toThrowError(/tasa de IVA es inválida/);
    });

    it("Debe lanzar error si el ID es null", () => {
      expect(() => new Factura({ id: null, número: "001", cliente, tipo: "A", fecha: "2025-11-21", items}))
        .toThrowError(/debe tener un ID numérico válido/);

      expect(() => new Factura({ id: "test", número: "001", cliente, tipo: "A", fecha: "2025-11-21", items}))
        .toThrowError(/debe tener un ID numérico válido/);
    });

    it("Debe lanzar error si el número de factura no es válido", () => {
      expect(() => new Factura({ id: 1, numero: "", cliente, tipo: "A", fecha: "2025-01-01", items }))
          .toThrowError(/debe tener un número válido/);
          
      expect(() => new Factura({ id: 1, numero: 123, cliente, tipo: "A", fecha: "2025-11-21", items }))
          .toThrowError(/debe tener un número válido/);
    });

    it("Debe lanzar error si el cliente no es una instancia de Cliente", () => {
      const clienteInvalido = { nombre: "Felipe" };
      expect(() => new Factura({ id: 1, numero: "001", cliente: clienteInvalido, tipo: "A", fecha: "2025-11-21", items }))
          .toThrowError(/es inválido/);
  });

    it("Debe lanzar error si la fecha es inválida", () => {
      expect(() => new Factura({ id: 1, numero: "001", cliente, tipo: "A", fecha: "test-123-test", items }))
          .toThrowError(/no es válida/);
    });

    it("marcarPagada cambia estado", () => {
      const f = new Factura({ id: 1, numero: "001", cliente, tipo: "C", fecha: "2025-11-25", items, tasaIVA: 21 });
      f.marcarPagada();

      expect(f.estado).toBe("pagada");
      expect(() => f.marcarPagada()).toThrowError(/ya estaba pagada/);
    });
  });

  // ----------------------- SISTEMA -----------------------
  describe("SistemaFacturacion", () => {
    let sistema;
    beforeEach(() => {
      sistema = new SistemaFacturacion();
      sistema.limpiarTodo();
    });

    it("FIX BUG #120: Debe respetar el IVA del 0% si se configura explícitamente", () => {
      sistema.limpiarTodo();
      sistema.agregarImpuesto(new Impuesto({ id: 1, nombre: "IVA", porcentaje: 0, activo: true }));
      
      const c = new Cliente({ nombre: "Test", cuit: "20123456781", direccion: "Dir", email: "t@t.com", telefono: "1134543434" });
      const items = [new ItemFactura({ producto: "Prod", precio: 1000 })];

      const factura = sistema.crearFactura({ cliente: c, tipo: "A", fecha: "2025-11-21", descripcion: "Test 0%", items });

      expect(factura.tasaIVA).toBe(0);
      expect(factura.calcularIVA()).toBe(0);
      expect(factura.total).toBe(1000);
    });

    it("generarNumero devuelve '001' si no hay facturas", () => {
      expect(sistema.generarNumero()).toBe("001");
    });

    it("No permite crear factura con datos faltantes", () => {
      expect(() => sistema.crearFactura({})).toThrowError(/Faltan datos obligatorios/);
    });

    it("No permite agregar impuestos duplicados por nombre", () => {
      sistema.agregarImpuesto(new Impuesto({ id: 1, nombre: "IIBB", porcentaje: 10 }));
      expect(() => sistema.agregarImpuesto({ id: 2, nombre: "IIBB", porcentaje: 10 }))
        .toThrowError(/ya existe/);
    });

    it("eliminarImpuesto() elimina correctamente un impuesto existente (Happy Path)", () => {
      sistema.agregarImpuesto(new Impuesto({ id: 999, nombre: "Test", porcentaje: 10, activo: true }));
      expect(sistema.impuestos.length).toBe(1);

      sistema.eliminarImpuesto(999);

      expect(sistema.impuestos.length).toBe(0);
      expect(sistema.getImpuestoById(999)).toBeNull();
    });

    it("eliminarImpuesto() lanza error si el ID no existe", () => {
      expect(() => sistema.eliminarImpuesto(100)).toThrowError(/No existe/);
    });

    it("generarNumero() incrementa correctamente el número (001 -> 002)", () => {
      const c = new Cliente({ nombre: "Test", cuit: "20123456781", direccion: "D", email: "t@t.com", telefono: "1137485745" });
      const items = [new ItemFactura({ producto: "P", precio: 10 })];
      
      sistema.crearFactura({ cliente: c, tipo: "C", fecha: "2025", descripcion: "Primera", items });

      expect(sistema.generarNumero()).toBe("002");
    });

    it("buscar() encuentra facturas por nombre de cliente o número", () => {
      const c = new Cliente({ nombre: "test", cuit: "20123456781", direccion: "D", email: "t@t.com", telefono: "1137485745" });
      const items = [new ItemFactura({ producto: "P", precio: 10 })];
      sistema.crearFactura({ cliente: c, tipo: "C", fecha: "2025", descripcion: "D", items });

      expect(sistema.buscar("test").length).toBe(1);
      expect(sistema.buscar("001").length).toBe(1);
    });

    it("buscar() Devuelve array vacío si no encuentra coincidencias", () => {
      const resultados = sistema.buscar("inexistente");
      expect(Array.isArray(resultados)).toBeTrue();
      expect(resultados.length).toBe(0);
    });

    it("Serialización completa del sistema (toJSON/fromJSON)", () => {
      sistema.agregarImpuesto(new Impuesto({ id: 10, nombre: "IMP", porcentaje: 5 }));
      const c = new Cliente({ nombre: "Felipe", cuit: "20123456781", direccion: "Street 123", email: "felioe@gmail.com", telefono: "1123123323" });
      sistema.crearFactura({ cliente: c, tipo: "C", fecha: "2025-11-23", descripcion: "Test", items: [new ItemFactura({producto:"p", precio:10})] });

      const json = sistema.toJSON();
      
      const sistema2 = SistemaFacturacion.fromJSON(json);

      expect(sistema2.facturas.length).toBe(1);
      expect(sistema2.impuestos.length).toBe(1);
      expect(sistema2.facturas[0]).toBeInstanceOf(Factura);
  });
  })
});