import StorageUtil from "../utils/storage.js";

describe("StorageUtil", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("guarda y obtiene un objeto en localStorage", () => {
    const data = { id: 1, nombre: "Test" };
    const ok = StorageUtil.guardar("test:obj", data, "local");
    expect(ok).toBeTrue();

    const result = StorageUtil.obtener("test:obj", "local");
    expect(result).toEqual(data);
  });

  it("guarda y obtiene un string en sessionStorage", () => {
    const ok = StorageUtil.guardar("test:string", "hola", "session");
    expect(ok).toBeTrue();

    const result = StorageUtil.obtener("test:string", "session");
    expect(result).toBe("hola");
  });

  it("actualizar es equivalente a guardar", () => {
    StorageUtil.guardar("test:update", { valor: 1 }, "local");
    const ok = StorageUtil.actualizar("test:update", { valor: 2 }, "local");
    expect(ok).toBeTrue();

    const result = StorageUtil.obtener("test:update", "local");
    expect(result).toEqual({ valor: 2 });
  });

  it("eliminar borra la clave del storage", () => {
    StorageUtil.guardar("test:delete", "dato", "local");
    StorageUtil.eliminar("test:delete", "local");

    const result = StorageUtil.obtener("test:delete", "local");
    expect(result).toBeNull();
  });

  it("listar devuelve solo las claves con el prefijo indicado", () => {
    StorageUtil.guardar("app:test:1", "a", "local");
    StorageUtil.guardar("app:test:2", "b", "local");
    StorageUtil.guardar("otra:clave", "c", "local");

    const claves = StorageUtil.listar("app:test", "local");
    expect(claves).toContain("app:test:1");
    expect(claves).toContain("app:test:2");
    expect(claves).not.toContain("otra:clave");
  });

  it("limpiar borra todas las claves del storage seleccionado", () => {
    StorageUtil.guardar("k1", "a", "local");
    StorageUtil.guardar("k2", "b", "local");

    StorageUtil.limpiar("local");

    expect(localStorage.length).toBe(0);
  });

  it("obtener devuelve el string original si el JSON está corrupto", () => {
    localStorage.setItem("test:corrupto", "{no-es-json-valido");
    const result = StorageUtil.obtener("test:corrupto", "local");
    expect(result).toBe("{no-es-json-valido");
  });
});
