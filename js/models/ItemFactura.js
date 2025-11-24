export class ItemFactura {
    /**
     * Representa un ítem dentro de una factura (producto + precio)
     * @param {Object} param0
     * @param {string} param0.producto - Nombre del producto o servicio
     * @param {number|string} param0.precio - Precio unitario del ítem
     * @param {number} [param0.cantidad=1] - Cantidad de ítems
     */
    constructor({ producto, precio, cantidad = 1 }) {

        if (typeof producto !== "string" || producto.trim() === "") {
            throw new Error("El producto es obligatorio.");
        }

        const numeroCantidad = Number(cantidad);
        if (isNaN(numeroCantidad) || numeroCantidad <= 0) {
            throw new Error(`Cantidad inválida: ${cantidad}.`);
        }

        this.producto = producto.trim();
        this.precio = this._validarPrecio(precio);
        this.cantidad = numeroCantidad;
    }

    /**
     * Valida y convierte el precio a número positivo
     * @param {number|string} valor
     * @returns {number}
     */
    _validarPrecio(valor) {
        const numero = Number(valor);
        if (isNaN(numero) || numero <= 0) {
            throw new Error(`Precio inválido para "${this.producto}". Debe ser un número positivo.`);
        }
        return Math.round(numero * 100) / 100; // mantiene 2 decimales
    }

    /**
     * Calcula el subtotal del ítem (precio * cantidad)
     * @returns {number}
     */
    subtotal() {
        return this.precio * this.cantidad;
    }

    /**
     * Convierte el ítem a JSON serializable
     * @returns {Object}
     */
    toJSON() {
        return {
            producto: this.producto,
            precio: this.precio,
            cantidad: this.cantidad
        };
    }

    /**
     * Crea una instancia desde JSON
     * @param {Object} data
     * @returns {ItemFactura}
     */
    static fromJSON(data) {
        return new ItemFactura(data);
    }
}