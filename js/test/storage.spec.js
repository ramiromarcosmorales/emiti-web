import StorageUtil from "../utils/storage.js";

describe("UTILIDAD: Storage", () => {

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // ============================================================
  // 🟢 HAPPY PATHS
  // ============================================================

  it("Guarda y obtiene un perfil de empleado correctamente", () => {
    const empleado = {
      legajo: 1234,
      nombre: "Ramiro",
      apellido: "Morales",
      cargo: "Desarrollador Full Stack",
      area: "Sistemas"
    };

    const guardado = StorageUtil.guardar("rrhh:empleado_1234", empleado, "local");
    expect(guardado).toBeTrue();

    const recuperado = StorageUtil.obtener("rrhh:empleado_1234", "local");
    
    expect(recuperado).toEqual(empleado);
    expect(recuperado.nombre).toBe("Ramiro");
    expect(recuperado.cargo).toBe("Desarrollador Full Stack");
  });

  it("Actualiza el puesto de trabajo correctamente (Ascenso)", () => {
    StorageUtil.guardar("puesto:ramiro", "Dev Junior", "local");
    
    StorageUtil.actualizar("puesto:ramiro", "Dev Senior", "local");
    
    expect(StorageUtil.obtener("puesto:ramiro", "local")).toBe("Dev Senior");
  });

  it("Elimina un contrato finalizado del storage", () => {
    StorageUtil.guardar("contrato:temp_2024", { estado: "Vigente" }, "local");
    
    StorageUtil.eliminar("contrato:temp_2024", "local");
    
    const resultado = StorageUtil.obtener("contrato:temp_2024", "local");
    expect(resultado).toBeNull();
  });

  // ============================================================
  // 🟠 EDGE CASES
  // ============================================================

  it("Devuelve null si se busca un empleado que no existe", () => {
    const res = StorageUtil.obtener("rrhh:empleado_9999", "local");
    expect(res).toBeNull();
  });

  it("Maneja datos de nómina corruptos sin romper la ejecución", () => {
    const nominaCorrupta = "{ empleado: 'Ramiro', sueldo: ... error }";
    localStorage.setItem("rrhh:nomina_actual", nominaCorrupta);
    
    const resultado = StorageUtil.obtener("rrhh:nomina_actual", "local");
    expect(resultado).toBe(nominaCorrupta);
  });

  it("Listar filtra correctamente los empleados por área (prefijo)", () => {
    StorageUtil.guardar("it:dev:1", "Ramiro", "local");
    StorageUtil.guardar("it:qa:2", "Sebasthian", "local");
    StorageUtil.guardar("ventas:vendedor:1", "Carlos", "local"); // Otra área

    const personalIT = StorageUtil.listar("it:", "local");
    
    expect(personalIT.length).toBe(2);
    expect(personalIT).toContain("it:dev:1");
    expect(personalIT).toContain("it:qa:2");
    expect(personalIT).not.toContain("ventas:vendedor:1");
  });

  it("Listar devuelve array vacío si no hay empleados en esa categoría", () => {
    StorageUtil.guardar("rrhh:activo", "si", "local");
    
    const res = StorageUtil.listar("gerencia:", "local");
    
    expect(Array.isArray(res)).toBeTrue();
    expect(res.length).toBe(0);
  });

  it("Limpiar borra SOLO los datos locales (Cache) manteniendo la Sesión", () => {
    StorageUtil.guardar("app:cache_fotos", "...", "local");
    StorageUtil.guardar("session:usuario", "Ramiro", "session");

    StorageUtil.limpiar("local");

    expect(StorageUtil.obtener("app:cache_fotos", "local")).toBeNull();
    expect(StorageUtil.obtener("session:usuario", "session")).toBe("Ramiro"); // La sesión sigue viva
  });

  // ============================================================
  // 🔴 TESTS EXTRAS
  // ============================================================

  it("Maneja correctamente el cambio de tipo de dato (Objeto JSON <-> String)", () => {
    
    StorageUtil.guardar("dato:cambiante", { valor: 100 }, "local");
    let res = StorageUtil.obtener("dato:cambiante", "local");
    expect(typeof res).toBe("object");

    StorageUtil.actualizar("dato:cambiante", "ahora soy texto", "local");
    res = StorageUtil.obtener("dato:cambiante", "local");
    
    expect(typeof res).toBe("string");
    expect(res).toBe("ahora soy texto");
  });

  it("Listar devuelve TODAS las claves si el prefijo es vacío", () => {
    StorageUtil.guardar("a:1", "1", "local");
    StorageUtil.guardar("b:2", "2", "local");

    const todas = StorageUtil.listar("", "local");
    
    expect(todas.length).toBe(2);
    expect(todas).toContain("a:1");
    expect(todas).toContain("b:2");
  });

  it("Maneja claves nulas o indefinidas en obtener/guardar sin explotar", () => {
    const guardado = StorageUtil.guardar(null, "valor_nulo", "local");
    expect(guardado).toBeTrue();

    const recuperado = StorageUtil.obtener(null, "local");
    expect(recuperado).toBe("valor_nulo");
  });

});