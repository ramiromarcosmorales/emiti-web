name: "Issue Tester QA - Segundo Parcial"
about: "Tareas del rol Tester QA: testing asincrónico, librerías externas y auditoría del sistema"
title: "[Tester QA] - "
labels: [testing, segundo-parcial]
assignees: [victoriaimo]
---

### 🧪 Descripción general

Realizar pruebas unitarias y funcionales con Jasmine sobre funcionalidades asincrónicas (`fetch`) y librerías externas integradas. Ejecutar auditorías Lighthouse (performance, accesibilidad, buenas prácticas y SEO) y documentar resultados. Reportar errores y coordinar con los desarrolladores.

---

### ✅ Criterios de aceptación

#### 🔹 Testing Jasmine

- [ ] Crear `api.spec.js` para funciones `fetch` (éxito, error HTTP, error red).
- [ ] Crear `library.spec.js` para la librería externa integrada.
- [ ] Actualizar `script.spec.js`, `models.spec.js` y `storage.spec.js` si corresponde.
- [ ] Verificar que `test-runner.html` funcione sin errores.

#### 🔹 Auditorías Lighthouse

- [ ] `test-case-11-lighthouse-baseline.md`: baseline antes de fetch/librerías.
- [ ] `test-case-12-lighthouse-post-fetch.md`: luego de integrar API.
- [ ] `test-case-13-lighthouse-post-library.md`: luego de librería externa.
- [ ] Incluir capturas de pantalla en `docs/03-testing/screenshots/`.

#### 🔹 Coordinación QA

- [ ] Crear issues por errores detectados.
- [ ] Asignar correctamente cada issue técnica.
- [ ] Documentar resultados en `testing-doc.md` y `changelog.md`.
- [ ] PR correctamente creada y asociada a esta issue.

---

###  Responsable
- **Nombre:** Victoria Imoberdorff  
- **Rol:** Tester QA / JavaScript  
- **Rama:** `feature/tester-qa-js-testing-suite`

---

