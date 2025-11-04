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

### FLUJO 1: Dashboard – Visualización de métricas

**Funciones Testeadas:**
- `calcularMetricas()` - obtiene el total de facturas, promedio e importe total
- `mostrarDashboard()` - muestra las métricas del dashboard usando alert

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | Retorna totales correctos | Happy Path |
| 2 | Valores numéricos válidos en promedio y total | Happy Path |
| 3 | Calcula métricas correctamente con array vacío | Caso Borde |
| 4 | Maneja facturas con total igual a 0 | Caso Borde |
| 5 | Calcula promedio correcto con una sola factura | Caso Borde |
| 6 | Maneja facturas con valores decimales múltiples | Caso Borde |
| 7 | Muestra las métricas correctamente usando alert | Happy Path |

---

### FLUJO 2: Nueva Factura – Creación de facturas

#### Validaciones

**Funciones Testeadas:**
- `validarTextoObligatorio()` - valida los campos de texto  
- `validarEmail()` - valida formato de email  
- `validarCUIT()` - valida formato de CUIT  
- `validarNumeroPositivo()` - valida que solo acepte números mayores que 0  
- `validarFecha()` - valida formato de fecha

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | Texto válido devuelve true | Happy Path |
| 2 | Campos vacíos, null o undefined retornan false | Caso Borde |
| 3 | Texto con solo espacios retorna false | Caso Borde |
| 4 | Email con formato válido devuelve true | Happy Path |
| 5 | Email con formato inválido retorna false | Validación de Errores |
| 6 | Email sin @ retorna false | Validación de Errores |
| 7 | Email con múltiples @ retorna false | Validación de Errores |
| 8 | CUIT con formato válido (con o sin separadores) devuelve true | Happy Path |
| 9 | CUIT con menos de 11 dígitos retorna false | Validación de Errores |
| 10 | CUIT con más de 11 dígitos retorna false | Validación de Errores |
| 11 | CUIT con caracteres no numéricos retorna false | Validación de Errores |
| 12 | CUIT vacío o null retorna false | Caso Borde |
| 13 | Números positivos válidos devuelven true | Happy Path |
| 14 | Números negativos o cero retornan false | Caso Borde |
| 15 | Strings, null o undefined retornan false | Validación de Errores |
| 16 | Fecha con formato válido YYYY-MM-DD devuelve true | Happy Path |
| 17 | Fecha con formato inválido retorna false | Validación de Errores |
| 18 | Fecha vacía o null retorna false | Caso Borde |

#### Utilidades

**Funciones Testeadas:**
- `formatearMoneda()` - formatea numeros como moneda argentina  
- `calcularTotal()` - suma subtotal e IVA
- `generarNumeroFactura()` - genera número de factura autoincremental

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | Formatea números como moneda argentina | Happy Path |
| 2 | Formatea cero correctamente | Caso Borde |
| 3 | Calcula total correctamente (subtotal + IVA) | Happy Path |
| 4 | Total con 0 devuelve 0 | Caso Borde |
| 5 | Maneja redondeo correcto con decimales | Caso Borde |
| 6 | Genera número de factura secuencial | Happy Path |
| 7 | Genera "001" cuando array está vacío | Caso Borde |
| 8 | Genera correctamente con números no secuenciales | Caso Borde |

#### Creación de Facturas

**Funciones Testeadas:**
- `crearFactura()` - crea una nueva factura de tipo A, B Y C
- `solicitarDatosCliente()` - solicita y valida datos del cliente
- `solicitarDatosFactura()` - solicita y valida datos de la factura
- `solicitarItemsFactura()` - solicita items de la factura

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | Crea factura tipo A con IVA discrimado | Happy Path |
| 2 | Crea factura tipo B con IVA incluido | Happy Path |
| 3 | Crea factura tipo C sin IVA | Happy Path |
| 4 | Maneja items con precios decimales | Caso Borde |
| 5 | Verifica formateo de CUIT en factura creada | Happy Path |
| 6 | Maneja array de items vacío | Caso Borde |
| 7 | Solicita y valida datos del cliente correctamente | Happy Path |
| 8 | Valida CUIT inválido y solicita nuevamente | Validación de Errores |
| 9 | Valida email inválido y solicita nuevamente | Validación de Errores |
| 10 | Permite cancelar entrada de datos (retorna null) | Caso Borde |
| 11 | Solicita y valida datos de factura correctamente | Happy Path |
| 12 | Valida tipo de factura inválido y solicita nuevamente | Validación de Errores |
| 13 | Valida fecha inválida y solicita nuevamente | Validación de Errores |
| 14 | Solicita items y permite agregar múltiples | Happy Path |
| 15 | Valida precio inválido (no numérico) y solicita nuevamente | Validación de Errores |
| 16 | Rechaza precio igual a 0 | Validación de Errores |
| 17 | Maneja cancelación al ingresar producto | Caso Borde |
| 18 | Verifica operaciones con array de items | Operaciones con Arrays/Objetos |

---

### FLUJO 3: Facturas – Gestión de facturas existentes

**Funciones Testeadas:**
- `buscarFacturas()` - busca facturas por nombre, número o CUIT
- `listarFacturas()` - lista todas las facturas
- `mostrarDetalleFactura()` - muestra el detalle completo de una factura

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | Busca facturas por nombre de cliente | Happy Path |
| 2 | Busca facturas por número de factura | Happy Path |
| 3 | Busca facturas por CUIT | Happy Path |
| 4 | Devuelve array vacío cuando no hay coincidencias | Validación de Errores |
| 5 | Verifica estructura de array y objetos retornados | Operaciones con Arrays/Objetos |
| 6 | Busca sin distinguir mayúsculas/minúsculas | Caso Borde |
| 7 | Lista todas las facturas usando alert | Happy Path |
| 8 | Muestra mensaje cuando no hay facturas | Caso Borde |
| 9 | Muestra detalle completo de factura | Happy Path |
| 10 | Maneja factura con múltiples items | Operaciones con Arrays/Objetos |

---

### FLUJO 4: Configuración – Impuestos

**Funciones Testeadas:**
- `calcularIVA()` - calcula el IVA de un subtotal
- `listarImpuestos()` - lista todos los impuestos configurados
- `agregarImpuesto()` - agrega un nuevo impuesto
- `usarCalculadoraIVA()` - calcula IVA usando la calculadora

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | Calcula IVA del 21% correctamente | Happy Path |
| 2 | Calcula IVA con porcentaje personalizado | Happy Path |
| 3 | IVA decimal redondeado correctamente | Caso Borde |
| 4 | Calcula IVA con porcentaje 0 (retorna 0) | Caso Borde |
| 5 | Calcula IVA con subtotal 0 (retorna 0) | Caso Borde |
| 6 | Lista todos los impuestos usando alert | Happy Path |
| 7 | Muestra mensaje cuando no hay impuestos | Caso Borde |
| 8 | Agrega un nuevo impuesto correctamente | Happy Path |
| 9 | Valida que el nombre sea obligatorio (vacío) | Validación de Errores |
| 10 | Valida que el porcentaje esté entre 0 y 100 | Validación de Errores |
| 11 | Rechaza porcentaje negativo | Validación de Errores |
| 12 | Rechaza porcentaje mayor a 100 | Validación de Errores |
| 13 | Calcula IVA usando calculadora | Happy Path |
| 14 | Usa 21% por defecto si no se ingresa porcentaje | Caso Borde |
| 15 | Valida que el precio sea un número positivo | Validación de Errores |
| 16 | Rechaza precio negativo o cero | Validación de Errores |
| 17 | Verifica operaciones con array de impuestos | Operaciones con Arrays/Objetos |

---

## Métricas de Cobertura

### Resumen General
| Métrica | Valor |
|---------|-------|
| Total de Tests | 48 |
| Tests Pasando | 48 ✅ |
| Tests Fallando | 0 ❌ |
| Porcentaje de Éxito | 100% |

### Cobertura por Tipo de Test (Requisitos)
| Tipo de Test | Cantidad | Porcentaje |
|--------------|----------|------------|
| Happy Path (Funcionalidad básica) | 20 | 42% |
| Casos Borde y Valores Límite | 16 | 33% |
| Validación de Errores | 9 | 19% |
| Operaciones con Arrays/Objetos | 3 | 6% |
| **Total** | **48** | **100%** |

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

**Última Actualización:** 31/10/2025  
**Tester/QA Engineer:** Ramiro Marcos Morales  
**Colaboración con:** Desarrollador JavaScript - Sebasthian Harika
