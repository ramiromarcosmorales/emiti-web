export class StorageObserver {
  constructor(sistema) {
    this.sistema = sistema;
  }

  actualizar() {
    // Cada vez que el sujeto avisa → se guarda el estado
    this.sistema.guardarEnStorage();
  }
}