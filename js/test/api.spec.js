// js/test/api.spec.js
import { fetchFakeStoreProducts } from "../api/apiService.js";

describe("API – FakeStoreProducts (fetch async)", function () {

  const mockResponse = [
    { id: 1, title: "Producto A", category: "cat1", price: 100 },
    { id: 2, title: "Producto B", category: "cat2", price: 200 }
  ];

  
  // Caso 1: fetch exitoso
  
  it("debe obtener productos normalizados desde la API externa", async function () {

    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    );

    const data = await fetchFakeStoreProducts(2);

    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(Array.isArray(data)).toBeTrue();
    expect(data.length).toBe(2);

    // normalización
    expect(data[0].nombre).toBe("Producto A");
    expect(data[0].precio).toBe(100);
    expect(data[0].categoria).toBe("cat1");
  });

  
  // Caso 2: error HTTP
  
  it("debe lanzar error si la API responde con error", async function () {
    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({ ok: false })
    );

    let errorDetectado;

    try {
      await fetchFakeStoreProducts();
    } catch (err) {
      errorDetectado = err;
    }

    expect(errorDetectado).toBeDefined();
    expect(errorDetectado.message).toContain("No se pudieron cargar");
  });

  
  // Caso 3: error de red
  
  it("debe lanzar error si fetch falla", async function () {

    spyOn(window, "fetch").and.returnValue(
      Promise.reject(new Error("Network error"))
    );

    let errorDetectado;

    try {
      await fetchFakeStoreProducts();
    } catch (err) {
      errorDetectado = err;
    }

    expect(errorDetectado).toBeDefined();
    expect(errorDetectado.message).toContain("No se pudieron cargar");
  });

});
