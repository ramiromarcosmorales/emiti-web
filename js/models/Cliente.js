/**
 * Representa un cliente del sistema de facturación
 */
export class Cliente {
    /**
     * @param {Object} param0
     * @param {string} param0.nombre
     * @param {string} param0.cuit
     * @param {string} param0.direccion
     * @param {string} param0.email
     * @param {string} param0.telefono
     */
    constructor({ nombre, cuit, direccion, email, telefono }) {
        this.nombre = this._validarTexto(nombre, "nombre");
        this.cuit = this._validarCUIT(cuit);
        this.direccion = this._validarTexto(direccion, "dirección");
        this.email = this._validarEmail(email);
        this.telefono = this._validarTelefono(telefono);
    }

    _validarTexto(valor, campo) {
        if (typeof valor !== "string" || valor.trim() === "") {
            throw new Error(`El campo ${campo} es obligatorio.`);
        }
        return valor.trim();
    }

    _validarCUIT(cuit) {
        const limpio = String(cuit).replace(/[-.\s]/g, "");
        if (!/^\d{11}$/.test(limpio)) {
            throw new Error("El CUIT debe tener exactamente 11 dígitos numéricos.");
        }
        return limpio;
    }

    _validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            throw new Error("El email ingresado no tiene un formato válido.");
        }
        return email.trim();
    }

    _validarTelefono(t) {
        const regex = /^[0-9+\-\s]{6,20}$/;
        if (!regex.test(String(t).trim())) {
            throw new Error("El teléfono contiene caracteres inválidos.");
        }
        return t.trim();
    }


    toJSON() {
        return {
            nombre: this.nombre,
            cuit: this.cuit,
            direccion: this.direccion,
            email: this.email,
            telefono: this.telefono
        };
    }

    static fromJSON(data) {
        return new Cliente(data);
    }
}

