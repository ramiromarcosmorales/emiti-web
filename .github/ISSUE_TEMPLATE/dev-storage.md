---
name: "Issue Desarrollador Storage"
about: "Tareas del rol Desarrollador Storage: persistencia con LocalStorage/SessionStorage"
title: "[Desarrollador Storage] - "
labels: [storage]
assignees: [victoriaimo]
---

### Descripción
Crear una capa de persistencia de datos con funciones CRUD basadas en LocalStorage y/o SessionStorage, asegurando consistencia e integridad de la información.

### Criterios de aceptación
- [ ] Archivo `/js/utils/storage.js` creado y documentado.
- [ ] Métodos: `guardar()`, `obtener()`, `actualizar()`, `eliminar()`, `listar()`, `limpiar()`.
- [ ] Manejo de errores (storage lleno, datos inválidos o corruptos).
- [ ] Pruebas unitarias básicas implementadas junto a QA.
- [ ] Documentación `/docs/05-storage/storage-doc.md` actualizada.
- [ ] PR creada y registrada en `changelog.md`.
