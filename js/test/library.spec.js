/* Test Suite - Librería Externa jsPDF */

// Mock básico de jsPDF para evitar PDF real
const jsPDFMock = function () {
  return {
    text: jasmine.createSpy("text"),
    save: jasmine.createSpy("save")
  };
};

// Simula carga global de la librería (como CDN)
window.jspdf = { jsPDF: jsPDFMock };

// Importamos la función que usa jsPDF en el proyecto
import { generarPDF } from "../utils/pdfjs.js";

describe("LIBRERÍA: jsPDF", () => {

  // 1) Test de inicialización de la librería
  it("La librería jsPDF está cargada en window.jspdf", () => {
    expect(window.jspdf).toBeDefined();
    expect(typeof window.jspdf.jsPDF).toBe("function");
  });

  // 2) Test de configuración correcta (constructor + métodos)
  it("Crea una instancia de jsPDF con métodos text() y save()", () => {
    const instancia = new window.jspdf.jsPDF();

    expect(instancia.text).toBeDefined();
    expect(typeof instancia.text).toBe("function");

    expect(instancia.save).toBeDefined();
    expect(typeof instancia.save).toBe("function");
  });

  // 3) Test de funcionalidad principal integrada (generarPDF)
  it("generarPDF() llama a jsPDF.text() y jsPDF.save()", () => {
    const facturaFake = {
      numero: "001-00001234",
      cliente: { nombre: "Cliente Test" },
      total: 1500
    };

    generarPDF(facturaFake);

    const instancia = window.jspdf.jsPDF.calls.mostRecent().returnValue;

    expect(instancia.text).toHaveBeenCalled();
    expect(instancia.save).toHaveBeenCalled();
  });

  // 4) Manejo de errores de la librería
  it("generarPDF() captura errores si jsPDF falla", () => {
    const facturaFake = {
      numero: "999",
      cliente: { nombre: "Error Test" },
      total: 0
    };

    const original = window.jspdf.jsPDF;

    window.jspdf.jsPDF = function () {
      throw new Error("Falla intencional");
    };

    expect(() => generarPDF(facturaFake)).not.toThrow();

    window.jspdf.jsPDF = original; // restaurar
  });

  // 5) Interacción con otros módulos (dominio Factura)
  it("generarPDF() recibe una factura válida del sistema", () => {
    const factura = {
      numero: "001-5",
      cliente: { nombre: "Juan" },
      total: 2000
    };

    expect(() => generarPDF(factura)).not.toThrow();
  });

});
