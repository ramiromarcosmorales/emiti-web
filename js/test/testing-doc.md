## Issues Conocidos

### Issue #95: `validarTextoObligatorio` no retorna boolean y rompe con tipos no string 
- **Severidad:** Alta
- **Suite Afectada:** `describe("Validaciones y Utilidades")`
- **Test Afectado:** `it("devuelve false con formatos inválidos")`
- **Comportamiento Esperado:** Retorna `false` para `""`, `null`, `undefined`, espacios, números y objetos.
- **Comportamiento Obtenido:** `TypeError: value.trim is not a function con null/undefined/número/objeto`
- **Pasos para Reproducir:**
  1. Abrir `test-runner.html`
  2. Acceder al test `validarTextoObligatorio` del suite `Validaciones y Utilidades`
  3. Ver el error que devuelve
- **Código del Test que Falla:**
  ```javascript
    expect(E().validarTextoObligatorio(null)).toBeFalse();
  ```
- **GitHub Issue:** #95
- **Estado:** Resuelto  

### Issue #97: `validarNumeroPositivo` acepta strings númericos
- **Severidad:** Alta
- **Suite Afectada:** `describe("Validaciones y Utilidades")`
- **Test Afectado:** `it("devuelve false con string, vacío o null/undefined")`
- **Comportamiento Esperado:** Solo números positivos, strings numéricos deben ser inválidos.
- **Comportamiento Obtenido:** Devuelve `true` para "5"
- **Pasos para Reproducir:**
  1. Abrir `test-runner.html`
  2. Acceder al test `validarNumeroPositivo` del suite `Validaciones y Utilidades`
  3. Ver el error que devuelve
- **Código del Test que Falla:**
  ```javascript
    expect(E().validarNumeroPositivo("5")).toBeFalse();
  ```
- **GitHub Issue:** #97
- **Estado:** Resuelto   

### Issue #99: `calcularTotal` devuelve `NaN` si no se pasa el IVA
- **Severidad:** Alta
- **Suite Afectada:** `describe("Cálculos de facturación")`
- **Test Afectado:** `it("subtotal 0 devuelve 0")`
- **Comportamiento Esperado:** Debería devolver 0
- **Comportamiento Obtenido:** Devuelve `NaN`
- **Pasos para Reproducir:**
  1. Abrir `test-runner.html`
  2. Acceder al test `calcularTotal` del suite `Cálculos de facturación`
  3. Ver el error que devuelve
- **Código del Test que Falla:**
  ```javascript
    expect(E().calcularTotal(0)).toBe(0);
  ```
- **GitHub Issue:** #99
- **Estado:** Resuelto

---

## Limitaciones del Testing

- Arranque del menú interactivo: si falta `window.__TEST__` o la exportación a `window.Emiti`, el prompt bloquea la carga de specs.

---

**Última Actualización:** 24/10/2025  
**Tester/QA Engineer:** Ramiro Marcos Morales  
**Colaboración con:** Desarrollador JavaScript - Sebasthian Harika