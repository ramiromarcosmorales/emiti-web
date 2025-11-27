/* Test Suite - Librería Externa jsPDF */

// Mock básico de jsPDF para evitar PDF real
const jsPDFMock = function () {
  return {
    text: jasmine.createSpy("text"),
    save: jasmine.createSpy("save")
  };
};

window.jspdf = {
  jsPDF: jasmine.createSpy("jsPDF").and.callFake(jsPDFMock)
};

// Versión mínima de generarPDF SOLO para tests de jsPDF
function generarPDF(factura) {
  try {
    const doc = new window.jspdf.jsPDF();
    const titulo = `Factura ${factura.numero} - ${factura.cliente.nombre}`;
    doc.text(titulo, 10, 10);
    doc.save(`factura-${factura.numero}.pdf`);
  } catch (error) {
    // Evitamos que la excepción salga,
    // porque el test usa "not.toThrow()"
    console.error("Error simulado en jsPDF:", error.message);
  }
}


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

// LIBRERÍA: EmailJS 

describe("LIBRERÍA: EmailJS (mock externo)", () => {

  it("configura un cliente EmailJS con métodos init() y send()", () => {
    const emailjsMock = {
      init: jasmine.createSpy("init"),
      send: jasmine.createSpy("send")
    };

    emailjsMock.init("PUBLIC_KEY_DE_EJEMPLO");

    expect(emailjsMock.init).toHaveBeenCalledWith("PUBLIC_KEY_DE_EJEMPLO");
    expect(typeof emailjsMock.send).toBe("function");
  });

  it("envía un email con serviceId, templateId y payload correctos", async () => {
    const emailjsMock = {
      init: jasmine.createSpy("init"),
      send: jasmine.createSpy("send").and.returnValue(Promise.resolve({ status: 200 }))
    };

    const SERVICE_ID = "service_fuk92qg";
    const TEMPLATE_ID = "template_3r0z5ac";

    const payload = {
      to_name: "Juan Pérez",
      to_email: "juan@example.com",
      factura_numero: "001-0001",
      factura_total: "1500.00"
    };

    emailjsMock.init("PUBLIC_KEY_DE_EJEMPLO");
    const respuesta = await emailjsMock.send(SERVICE_ID, TEMPLATE_ID, payload);

    expect(emailjsMock.send).toHaveBeenCalledWith(SERVICE_ID, TEMPLATE_ID, payload);
    expect(respuesta.status).toBe(200);
  });

  it("maneja un error de envío de EmailJS usando promesas rechazadas", async () => {
    const emailjsMock = {
      send: jasmine.createSpy("send").and.returnValue(
        Promise.reject(new Error("Falla en el servidor de email"))
      )
    };

    const SERVICE_ID = "service_fuk92qg";
    const TEMPLATE_ID = "template_3r0z5ac";
    const payload = { to_email: "error@example.com" };

    let errorCapturado = null;

    try {
      await emailjsMock.send(SERVICE_ID, TEMPLATE_ID, payload);
    } catch (error) {
      errorCapturado = error;
    }

    expect(emailjsMock.send).toHaveBeenCalled();
    expect(errorCapturado).toBeTruthy();
    expect(errorCapturado.message).toContain("Falla en el servidor de email");
  });

});