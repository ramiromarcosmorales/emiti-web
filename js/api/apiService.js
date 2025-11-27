// ----------------------------------------------------------
// FakeStoreAPI - Productos demo
// ----------------------------------------------------------
export async function fetchFakeStoreProducts(limit = 8) {
  const url = `https://fakestoreapi.com/products?limit=${limit}`;

  try {
    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error("Error al obtener productos desde la API externa.");
    }

    const raw = await resp.json();

    // Normalización minimal
    return raw.map(p => ({
      id: p.id,
      nombre: p.title.trim(),
      categoria: p.category,
      precio: Number(p.price)
    }));
  } catch (err) {
    console.error("[API] Error FakeStore:", err);
    throw new Error("No se pudieron cargar los productos demo.");
  }
}
