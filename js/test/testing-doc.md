# Documentación de Testing - Suite Jasmine

## Índice
1. [Ejecución de Tests](#ejecución-de-tests)
2. [Suites de Tests](#suites-de-tests)
3. [Métricas de Cobertura](#métricas-de-cobertura)
4. [Capturas de Pantalla](#capturas-de-pantalla)
5. [Issues Conocidos](#issues-conocidos)

---

## Ejecución de Tests

### Pasos para Ejecutar
1. Abrir `test-runner.html` en el navegador
2. Los tests se ejecutan automáticamente
3. Verificar resultados en la interfaz de Jasmine

### Interpretación de Resultados
- **Verde**: Tests pasando ✅
- **Rojo**: Tests fallando ❌
- **Amarillo**: Tests pendientes ⚠️

---

## Suites de Tests

### Suite 1: Validaciones y Utilidades
**Funciones Testeadas:**
- `validarTextoObligatorio()` - valida los campos de texto  
- `validarEmail()` - valida formato de email  
- `validarCUIT()` - valida formato de CUIT  
- `validarNumeroPositivo()` - valida que solo acepte números mayores que 0  
- `validarFecha()` - valida formato de fecha  
- `formatearMoneda()` - formatea numeros como moneda argentina  

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | Texto válido "Ramiro" devuelve true | Happy Path |
| 2 | Campos vacíos o null retornan false | Caso Borde |
| 3 | Email con formato inválido retorna false | Validación de Errores |
| 4 | CUIT con formato válido | Happy Path |
| 5 | Números negativos o ceros inválidos | Caso borde |
| 6 | Moneda devuelve string formateado | Happy Path |

---

### Suite 2: Cálculos de Facturación
**Funciones Testeadas:**
- `calcularIVA()` - calcula el IVA de un subtotal
- `calcularTotal()` - suma subtotal e IVA
- `generarNumeroFactura()` - genera número de factura autoincremental
- `crearFactura()` - crea una nueva factura de tipo A, B Y C

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | IVA del 21% calculado correctamente | Happy Path |
| 2 | IVA decimal redondeado correctamente | Caso Borde |
| 3 | Total con 0 devuelve 0 | Caso Borde |
| 4 | Genera número "004" según dataset | Happy Path |
| 5 | Factura tipo C sin IVA | Validación de lógica de negocio |

---

### Suite 3: Gestión de Facturas
**Funciones Testeadas:**
- `buscarFacturas()` - busca facturas por nombre, número o CUIT

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | Devuelve un array con las facturas del cliente | Happy Path |
| 2 | Devuelve array vacío cuando no hay coincidencias | Validación de Errores |
| 3 | Verifica estructura de array y objetos | Operaciones con Arrays/Objetos |

---

### Suite 4: Métricas del Dashboard
**Funciones Testeadas:**
- `calcularMetricas()` - obtiene el total de facturas, promedio e importe total

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | Retorna totales correctos | Happy Path |
| 2 | Valores numéricos válidos en promedio y total | Cálculos y Algoritmos |

---

## Métricas de Cobertura

### Resumen General
| Métrica | Valor |
|---------|-------|
| Total de Tests | 25 |
| Tests Pasando | 25 ✅ |
| Tests Fallando | 0 ❌ |
| Porcentaje de Éxito | 100% |

### Cobertura por Tipo de Test
| Tipo | Cantidad | Porcentaje |
|------|----------|------------|
| Happy Path | 14 | 56% |
| Casos Borde | 4 | 16% |
| Validación de Errores | 6 | 24% |
| Operaciones Arrays/Objetos | 1 | 4% |

### Análisis de Cobertura de Código

**Metodología:** Se revisó manualmente cada función del código fuente y se verificó qué líneas son ejecutadas por los tests implementados.

| Función | Líneas Totales | Tests | Líneas Cubiertas | Cobertura |
|---------|----------------|-------|------------------|-----------|
| `validarTextoObligatorio()` | 3 | ✅ | 3 | 100% |
| `validarEmail()` | 3 | ✅ | 3 | 100% |
| `validarCUIT()` | 5 | ✅ | 5 | 100% |
| `validarNumeroPositivo()` | 2 | ✅ | 2 | 100% |
| `validarFecha()` | 7 | ✅ | 7 | 100% |
| `formatearMoneda()` | 3 | ✅ | 3 | 100% |
| `calcularIVA()` | 2 | ✅ | 2 | 100% |
| `calcularTotal()` | 2 | ✅ | 2 | 100% |
| `generarNumeroFactura()` | 4 | ✅ | 4 | 100% |
| `crearFactura()` | 17 | ✅ | 17 | 100% |
| `buscarFacturas()` | 4 | ✅ | 4 | 100% |
| `calcularMetricas()` | 8 | ✅ | 8 | 100% |

**Cobertura Total Estimada:** 100% (60/60 líneas ejecutables)

#### Líneas NO Cubiertas
- `formatearMoneda()` - validación de tipo sin implementación de excepciones

---

## Capturas de Pantalla

### Tests Pasando
![Tests Exitosos](./screenshots/tests-passing.png)
*Todos los tests ejecutándose correctamente*

### Vista Detallada de Suites
![Suite Detalle](./screenshots/suite-detail.png)
*Expansión de una suite mostrando tests individuales*

---

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