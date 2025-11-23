import { Factura } from "./Factura.js";
import { Impuesto } from "./Impuesto.js";
import { Cliente } from "./Cliente.js";
import StorageUtil from "../utils/storage.js";

export class SistemaFacturacion {
  constructor() {
    this.facturas = [];
    this.impuestos = [];
    this.config = null;

    // --- OBSERVER ---
    this.observers = [];
  }

  // ----------------------------------------------------------
  // OBSERVER
  // ----------------------------------------------------------
  suscribir(observer) {
    this.observers.push(observer);
  }

  notificar() {
    this.observers.forEach(o => o.actualizar());
  }

  // ----------------------------------------------------------
  // CONFIGURACIÓN
  // ----------------------------------------------------------
  setConfig(config) {
    this.config = config;
    this.notificar();
  }

  // ----------------------------------------------------------
  // IMPUESTOS
  // ----------------------------------------------------------
  agregarImpuesto(imp) {
    // Si no tiene ID, generarlo automáticamente
    if (!imp.id && imp.id !== 0) {
      const maxId = this.impuestos.length > 0 
        ? Math.max(...this.impuestos.map(i => i.id))
        : 0;
      imp.id = maxId + 1;
    }

    const instancia = imp instanceof Impuesto ? imp : new Impuesto(imp);

    if (this.getImpuestoByNombre(instancia.nombre)) {
      throw new Error(`El impuesto "${instancia.nombre}" ya existe.`);
    }

    this.impuestos.push(instancia);
    this.notificar();
  }

  eliminarImpuesto(id) {
    const numId = Number(id);

    if (isNaN(numId)) throw new Error(`ID inválido: ${id}`);

    const existe = this.getImpuestoById(numId);
    if (!existe) throw new Error(`No existe un impuesto con ID ${numId}.`);

    this.impuestos = this.impuestos.filter(imp => imp.id !== numId);
    this.notificar();
  }

  tasaIVA() {
    const iva = this.impuestos.find(
      i => i.nombre.toUpperCase() === "IVA" && i.activo
    );
    return iva ? iva.porcentaje : 21;
  }

  // ----------------------------------------------------------
  // FACTURAS
  // ----------------------------------------------------------
  generarNumero() {
    if (this.facturas.length === 0) return "001";
    const max = Math.max(...this.facturas.map(f => +f.numero));
    return String(max + 1).padStart(3, "0");
  }

  crearFactura({ cliente, tipo, fecha, descripcion, items }) {
    if (!cliente || !tipo || !fecha || !descripcion || !items?.length) {
      throw new Error("Faltan datos obligatorios para crear la factura.");
    }

    const numero = this.generarNumero();
    const id = this.facturas.length + 1;

    if (this.getFacturaByNumero(numero)) {
      throw new Error(`Ya existe una factura con el número ${numero}`);
    }

    const factura = new Factura({
      id,
      numero,
      cliente,
      tipo,
      fecha,
      descripcion,
      items,
      tasaIVA: this.tasaIVA(),
    });

    if (this.getFacturaById(factura.id)) {
      throw new Error(`Ya existe una factura con el id ${factura.id}`);
    }

    this.facturas.push(factura);
    this.notificar();

    return factura;
  }

  eliminarFactura(id) {
    const f = this.getFacturaById(id);
    if (!f) throw new Error(`No existe la factura con id ${id}`);

    this.facturas = this.facturas.filter(x => x.id !== id);
    this.notificar();
  }

  marcarPagadaPorId(id) {
    const factura = this.getFacturaById(id);
    if (!factura) throw new Error(`No existe la factura con id ${id}`);

    if (factura.estado === "pagada") {
      throw new Error(`La factura ${factura.numero} ya estaba pagada.`);
    }

    factura.marcarPagada();
    this.notificar();
  }

  marcarPagada(numero) {
    const f = this.getFacturaByNumero(numero);
    if (!f) throw new Error(`No existe la factura N° ${numero}`);
    this.marcarPagadaPorId(f.id);
  }

  // ----------------------------------------------------------
  // BÚSQUEDA / LECTURA
  // ----------------------------------------------------------
  getFacturaById(id) {
    return this.facturas.find(f => f.id === id) ?? null;
  }

  getFacturaByNumero(numero) {
    return this.facturas.find(f => f.numero === numero) ?? null;
  }

  getImpuestoById(id) {
    return this.impuestos.find(i => i.id === id) ?? null;
  }

  getImpuestoByNombre(nombre) {
    const n = String(nombre).toLowerCase();
    return this.impuestos.find(i => i.nombre.toLowerCase() === n) ?? null;
  }

  buscar(criterio) {
    const c = String(criterio).toLowerCase();
    return this.facturas.filter(f =>
      f.cliente.nombre.toLowerCase().includes(c) ||
      f.numero.includes(criterio) ||
      f.cliente.cuit.includes(criterio)
    );
  }

  listar() {
    return this.facturas;
  }

  // ----------------------------------------------------------
  // PERSISTENCIA
  // ----------------------------------------------------------
  guardarEnStorage() {
    const data = this.toJSON();
    StorageUtil.guardar("app:facturacion:sistema", data, "local");
  }

  cargarDesdeStorage() {
    const data = StorageUtil.obtener("app:facturacion:sistema", "local");
    if (!data) return;

    this.facturas = (data.facturas ?? []).map(Factura.fromJSON);
    this.impuestos = (data.impuestos ?? []).map(Impuesto.fromJSON);
    this.config = data.config ?? null;
  }

  limpiarTodo() {
    StorageUtil.eliminar("app:facturacion:sistema", "local");
    this.facturas = [];
    this.impuestos = [];
    this.config = null;
    this.notificar();
  }

  // ----------------------------------------------------------
  // SERIALIZACIÓN
  // ----------------------------------------------------------
  toJSON() {
    return {
      facturas: this.facturas.map(f => f.toJSON()),
      impuestos: this.impuestos.map(i => i.toJSON()),
      config: this.config,
    };
  }

  static fromJSON(data) {
    const sistema = new SistemaFacturacion();
    sistema.facturas = (data.facturas ?? []).map(Factura.fromJSON);
    sistema.impuestos = (data.impuestos ?? []).map(Impuesto.fromJSON);
    sistema.config = data.config ?? null;
    return sistema;
  }

  // ----------------------------------------------------------
  // MÉTRICAS
  // ----------------------------------------------------------
  getMetrics() {
    const cantidad = this.facturas.length;
    const pagadas = this.facturas.filter(f => f.estado === "pagada");
    const pendientes = this.facturas.filter(f => f.estado !== "pagada");

    const totalFacturado = this.facturas.reduce((a, f) => a + f.total, 0);
    const totalPendiente = pendientes.reduce((a, f) => a + f.total, 0);

    const porTipo = this.facturas.reduce((acc, f) => {
      acc[f.tipo] = (acc[f.tipo] ?? 0) + 1;
      return acc;
    }, {});

    return {
      cantidad,
      pagadas: pagadas.length,
      pendientes: pendientes.length,
      totalFacturado: +totalFacturado.toFixed(2),
      totalPendiente: +totalPendiente.toFixed(2),
      porTipo,
    };
  }

  // ----------------------------------------------------------
  // WRAPPERS DE FORMULARIO
  // ----------------------------------------------------------
  crearFacturaDesdeForm({ cliente, tipo, fecha, descripcion, items }) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("La factura debe tener al menos un ítem.");
    }

    const itemsFormateados = items.map(item => ({
      producto: item.producto || item.nombre || "",
      precio: Number(item.precio) || 0,
      cantidad: Number(item.cantidad) || 1
    }));

    for (const item of itemsFormateados) {
      if (!item.producto || item.producto.trim() === "") {
        throw new Error("Todos los ítems deben tener un producto válido.");
      }
      if (item.precio <= 0) {
        throw new Error("Todos los ítems deben tener un precio mayor a 0.");
      }
    }

    const clienteInstancia = cliente instanceof Cliente
      ? cliente
      : new Cliente(cliente);

    const factura = this.crearFactura({
      cliente: clienteInstancia,
      tipo,
      fecha,
      descripcion,
      items: itemsFormateados
    });

    // Guardar en storage después de crear
    this.guardarEnStorage();

    return factura;
  }

  crearImpuestoDesdeForm({ nombre, porcentaje, activo = true }) {
    if (!nombre || typeof nombre !== "string" || nombre.trim().length < 3) {
      throw new Error("El nombre del impuesto debe tener al menos 3 caracteres.");
    }

    const porcentajeNum = Number(porcentaje);
    if (isNaN(porcentajeNum) || porcentajeNum <= 0 || porcentajeNum > 100) {
      throw new Error("El porcentaje debe ser un número entre 0.1 y 100.");
    }

    this.agregarImpuesto({
      nombre: nombre.trim(),
      porcentaje: porcentajeNum,
      activo: Boolean(activo)
    });

    // Guardar en storage después de crear
    this.guardarEnStorage();
  }
}
