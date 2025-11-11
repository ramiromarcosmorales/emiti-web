/**
 * Representa un impuesto del sistema (ej. IVA, IIBB).
 * Contiene nombre, porcentaje y estado de activación.
 */
export class Impuesto {

    /**
     * @param {Object} param0
     * @param {number} param0.id - ID único del impuesto
     * @param {string} param0.nombre - Nombre del impuesto (ej: "IVA")
     * @param {number} param0.porcentaje - Porcentaje (ej: 21)
     * @param {boolean} param0.activo - Estado del impuesto
     */
    constructor({ id, nombre, porcentaje, activo = false }) {

        // --- VALIDACIÓN DE ID ---
        if (id === undefined || id === null || isNaN(Number(id)) || Number(id) < 0) {
            throw new Error("El impuesto debe tener un ID numérico válido.");
        }

        // --- VALIDACIÓN DE NOMBRE ---
        if (typeof nombre !== "string" || nombre.trim() === "") {
            throw new Error("El nombre del impuesto es obligatorio.");
        }

        // --- VALIDACIÓN DE PORCENTAJE ---
        const p = Number(porcentaje);
        if (isNaN(p) || p < 0 || p > 100) {
            throw new Error("El porcentaje del impuesto debe ser un número entre 0 y 100.");
        }

        // --- VALIDACIÓN DE ACTIVO ---
        if (typeof activo !== "boolean") {
            throw new Error("El estado 'activo' debe ser booleano.");
        }

        this.id = Number(id);
        this.nombre = nombre.trim();
        this.porcentaje = p;
        this.activo = activo;
    }

    /**
     * Activa o desactiva el impuesto.
     * @param {boolean} estado - true para activar, false para desactivar
     */
    setActivo(estado) {
        if (typeof estado !== "boolean") {
            throw new Error("El estado debe ser booleano.");
        }
        this.activo = estado;
    }

    /**
     * Cambia el porcentaje del impuesto.
     * @param {number} nuevoPorcentaje - Valor nuevo entre 0 y 100
     */
    setPorcentaje(nuevoPorcentaje) {
        const p = Number(nuevoPorcentaje);
        if (!isNaN(p) && p >= 0 && p <= 100) {
            this.porcentaje = p;
        } else {
            throw new Error("Porcentaje inválido. Debe ser un número entre 0 y 100.");
        }
    }

    /**
     * Retorna el impuesto como objeto JSON serializable.
     */
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            porcentaje: this.porcentaje,
            activo: this.activo
        };
    }

    /**
     * Crea una instancia de Impuesto desde un objeto JSON.
     * @param {Object} data - Objeto con los mismos campos que la clase.
     * @returns {Impuesto}
     */
    static fromJSON(data) {
        return new Impuesto({
            id: data.id,
            nombre: data.nombre,
            porcentaje: data.porcentaje,
            activo: data.activo
        });
    }
}

