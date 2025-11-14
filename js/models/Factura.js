import { Cliente } from "./Cliente.js";
import { ItemFactura } from "./ItemFactura.js";

export class Factura {
  constructor({ id, numero, cliente, tipo, fecha, descripcion, items, tasaIVA, estado }) {

    // --- VALIDACIONES BASE ---
    if (!id || isNaN(Number(id))) {
      throw new Error("La factura debe tener un ID numérico válido.");
    }

    if (!numero || typeof numero !== "string") {
      throw new Error("La factura debe tener un número válido.");
    }

    // Cliente debe ser instancia válida
    if (!(cliente instanceof Cliente)) {
      throw new Error("El cliente de la factura es inválido.");
    }

    // Tipo debe ser A, B o C
    const tiposValidos = ["A", "B", "C"];
    if (!tipo || !tiposValidos.includes(tipo.toUpperCase())) {
      throw new Error(`El tipo de factura debe ser A, B o C (recibido: "${tipo}").`);
    }

    // Fecha
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) {
      throw new Error("La fecha de la factura no es válida.");
    }

    // Items
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("La factura debe contener al menos un ítem.");
    }

    const itemsConvertidos = items.map(item => 
      item instanceof ItemFactura ? item : new ItemFactura(item)
    );

    // tasaIVA valida
    const t = Number(tasaIVA);
    if (isNaN(t) || t < 0) {
      throw new Error("La tasa de IVA es inválida.");
    }

    // --- ASIGNACIÓN ---
    this.id = Number(id);
    this.numero = numero;
    this.cliente = cliente;
    this.tipo = tipo.toUpperCase();
    this.fecha = fechaObj;
    this.descripcion = descripcion ?? "";
    this.items = itemsConvertidos;
    this.tasaIVA = t;
    this.estado = estado ?? "pendiente";

    this.total = this.calcularTotal();
  }

  calcularSubtotal() {
    return this.items.reduce((acc, item) => acc + item.subtotal(), 0);
  }

  calcularIVA() {
    const subtotal = this.calcularSubtotal();
    switch (this.tipo) {
      case "A":
        return subtotal * (this.tasaIVA / 100);
      case "B":
        return subtotal * (this.tasaIVA / 200);
      case "C":
        return 0;
      default:
        return 0;
    }
  }

  calcularTotal() {
    return this.calcularSubtotal() + this.calcularIVA();
  }

  marcarPagada() {
    if (this.estado === "pagada") {
      throw new Error(`La factura ${this.numero} ya estaba pagada.`);
    }
    this.estado = "pagada";
  }

  toJSON() {
    return {
      id: this.id,
      numero: this.numero,
      cliente: this.cliente.toJSON(),
      tipo: this.tipo,
      fecha: this.fecha.toISOString(), // ✅ formato correcto
      descripcion: this.descripcion,
      items: this.items.map(item => item.toJSON()),
      tasaIVA: this.tasaIVA,
      estado: this.estado,
      total: this.total
    };
  }

  static fromJSON(data) {
    return new Factura({
      id: data.id,
      numero: data.numero,
      cliente: Cliente.fromJSON(data.cliente),
      tipo: data.tipo,
      fecha: data.fecha,
      descripcion: data.descripcion,
      items: data.items.map(ItemFactura.fromJSON),
      tasaIVA: data.tasaIVA,
      estado: data.estado
    });
  }
}