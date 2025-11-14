/* Módulo de utilidades para trabajar con localStorage y sessionStorage */

const StorageUtil = {
  /**
   * Guarda un valor en storage.
   * Serializa a JSON si es un objeto o array.
   * @param {string} clave - Clave del dato
   * @param {any} valor - Valor a guardar (se serializará a JSON si es objeto)
   * @param {string} tipo - 'local' para localStorage, 'session' para sessionStorage
   * @returns {boolean} true si se guardó correctamente
   */
  guardar(clave, valor, tipo = "local") {
    try {
      const store = tipo === "local" ? localStorage : sessionStorage;
      const data =
        typeof valor === "object" ? JSON.stringify(valor) : String(valor);
      store.setItem(clave, data);
      return true;
    } catch (error) {
      console.error("[StorageUtil.guardar] Error:", error);
      return false;
    }
  },

  /**
   * Obtiene un valor del storage y trata de deserializarlo.
   * @param {string} clave - Clave del dato a obtener
   * @param {string} tipo - 'local' para localStorage, 'session' para sessionStorage
   * @returns {any|null} Valor deserializado o null si no existe
   */
 
  obtener(clave, tipo = "local") {
    try {
      const store = tipo === "local" ? localStorage : sessionStorage;
      const data = store.getItem(clave);
      if (data === null) return null;

      // Intenta convertir de JSON a objeto; si no es JSON, devuelve el string
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    } catch (error) {
      console.error("[StorageUtil.obtener] Error:", error);
      return null;
    }
  },

  /**
   * Actualiza un valor existente (es equivalente a guardar).
   * @param {string} clave - Clave del dato a actualizar
   * @param {any} valor - Nuevo valor
   * @param {string} tipo - 'local' para localStorage, 'session' para sessionStorage
   * @returns {boolean} true si se actualizó correctamente
   */
  
  actualizar(clave, valor, tipo = "local") {
    return this.guardar(clave, valor, tipo);
  },

  /**
   * Elimina un valor de storage según la clave.
   * @param {string} clave - Clave del dato a eliminar
   * @param {string} tipo - 'local' para localStorage, 'session' para sessionStorage
   */
  
  eliminar(clave, tipo = "local") {
    try {
      const store = tipo === "local" ? localStorage : sessionStorage;
      store.removeItem(clave);
    } catch (error) {
      console.error("[StorageUtil.eliminar] Error:", error);
    }
  },

  /**
   * Lista todas las claves que empiecen con un prefijo.
   * @param {string} prefijo - Texto con el que deben comenzar las claves
   * @param {string} tipo - 'local' para localStorage, 'session' para sessionStorage
   * @returns {Array<string>} Lista de claves encontradas
   */
  listar(prefijo = "", tipo = "local") {
    try {
      const store = tipo === "local" ? localStorage : sessionStorage;
      const claves = [];
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i);
        if (!prefijo || k.startsWith(prefijo)) {
          claves.push(k);
        }
      }
      return claves;
    } catch (error) {
      console.error("[StorageUtil.listar] Error:", error);
      return [];
    }
  },

  /**
   * Limpia todo el storage seleccionado.
   * @param {string} tipo - 'local' para localStorage, 'session' para sessionStorage
   */
  limpiar(tipo = "local") {
    try {
      const store = tipo === "local" ? localStorage : sessionStorage;
      store.clear();
    } catch (error) {
      console.error("[StorageUtil.limpiar] Error:", error);
    }
  },
};


export default StorageUtil;
