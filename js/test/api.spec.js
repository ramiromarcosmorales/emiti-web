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

  // Caso 4: procesamiento con map / filter / reduce 
  it("procesa los productos usando map, filter y reduce y mantiene la estructura esperada", function () {

    spyOn(window, "fetch");

    // Mock local SOLO para este test
    const mockResponse = [
      { id: 1, title: "Producto A", category: "cat1", price: 100 },
      { id: 2, title: "Producto B", category: "cat2", price: 200 }
    ];

    // map: normalizar estructura
    const normalizados = mockResponse.map(p => ({
      id: p.id,
      nombre: p.title,
      categoria: p.category,
      precio: p.price,
    }));

    // filter: quedarnos con cat1
    const cat1 = normalizados.filter(p => p.categoria === "cat1");
    expect(cat1.length).toBe(1);
    expect(cat1[0].nombre).toBe("Producto A");

    // reduce: sumar precios
    const total = normalizados.reduce((acc, p) => acc + p.precio, 0);
    expect(total).toBe(300);

    // estructura coherente
    normalizados.forEach(p => {
      expect(p.nombre).toBeDefined();
      expect(p.precio).toBeGreaterThan(0);
      expect(p.categoria).toMatch(/^cat/);
    });

    // confirmamos que nunca se llamó a fetch en este test
    expect(window.fetch).not.toHaveBeenCalled();
  });

});
