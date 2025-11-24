export async function generarPDF(factura) {
  let jsPDF;
  
  if (window.jspdf && window.jspdf.jsPDF) {
    jsPDF = window.jspdf.jsPDF;
  } else if (window.jspdf) {
    jsPDF = window.jspdf;
  } else {
    if (window.mostrarToast) {
      window.mostrarToast("Error: La librería jsPDF no se ha cargado correctamente. Por favor, recarga la página.", "danger");
    } else {
      console.error("Error: La librería jsPDF no se ha cargado correctamente.");
      alert("Error: La librería jsPDF no se ha cargado correctamente. Por favor, recarga la página.");
    }
    return;
  }

  const doc = new jsPDF();

  const MARGEN_IZQ = 15;
  const MARGEN_DER = 195;
  const ANCHO_PAGINA = 210;
  const ALTO_PAGINA = 297;

  const COLOR_PRIMARIO = [46, 125, 50];
  const COLOR_TEXTO = [44, 62, 80];
  const COLOR_GRIS = [128, 128, 128];
  const COLOR_FONDO_HEADER = [240, 240, 240];

  // Header
  doc.setFillColor(...COLOR_FONDO_HEADER);
  doc.rect(0, 0, ANCHO_PAGINA, 40, 'F');

  const logo = await getBase64ImageFromURL('assets/logo.png');
  doc.addImage(logo, 'PNG', MARGEN_IZQ, 5, 30, 30);
  

  doc.setFontSize(14);
  doc.setTextColor(...COLOR_TEXTO);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURA", MARGEN_DER, 15, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`N°: ${factura.numero}`, MARGEN_DER, 22, { align: "right" });

  const fecha = new Date(factura.fecha).toLocaleDateString("es-AR");
  doc.text(`Fecha: ${fecha}`, MARGEN_DER, 27, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.text(`TIPO ${factura.tipo}`, MARGEN_DER, 33, { align: "right" });

  let yPos = 50;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLOR_TEXTO);
  doc.text("Cliente:", MARGEN_IZQ, yPos);

  yPos += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(factura.cliente.nombre, MARGEN_IZQ, yPos);
  
  yPos += 5;
  doc.setTextColor(...COLOR_GRIS);
  doc.text(`CUIT: ${factura.cliente.cuit}`, MARGEN_IZQ, yPos);
  
  yPos += 5;
  doc.text(factura.cliente.direccion, MARGEN_IZQ, yPos);
  
  yPos += 5;
  doc.text(`${factura.cliente.email} | ${factura.cliente.telefono}`, MARGEN_IZQ, yPos);

  yPos += 10;

  if (factura.descripcion) {
    doc.setTextColor(...COLOR_TEXTO);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Descripción:", MARGEN_IZQ, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    const anchoDescripcion = MARGEN_DER - MARGEN_IZQ;
    const descripcionLines = doc.splitTextToSize(factura.descripcion, anchoDescripcion);
    // Renderizar cada línea correctamente
    descripcionLines.forEach((linea) => {
      doc.text(linea, MARGEN_IZQ, yPos);
      yPos += 5;
    });
    yPos += 3;
  }

  // Tabla de items
  yPos += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_TEXTO);
  doc.text("Productos / Ítems", MARGEN_IZQ, yPos);
  yPos += 7;

  // Header tabla
  doc.setFillColor(...COLOR_FONDO_HEADER);
  doc.rect(MARGEN_IZQ, yPos - 5, MARGEN_DER - MARGEN_IZQ, 8, 'F');
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Producto", MARGEN_IZQ + 2, yPos);
  doc.text("Cant.", MARGEN_IZQ + 100, yPos);
  doc.text("Precio Unit.", MARGEN_IZQ + 120, yPos);
  doc.text("Subtotal", MARGEN_DER - 2, yPos, { align: "right" });

  yPos += 8;

  doc.setDrawColor(...COLOR_GRIS);
  doc.line(MARGEN_IZQ, yPos, MARGEN_DER, yPos);
  yPos += 5;

  // Items
  const formatter = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_TEXTO);

  factura.items.forEach((item) => {
    if (yPos > ALTO_PAGINA - 60) {
      doc.addPage();
      yPos = 20;
    }

    const productoLines = doc.splitTextToSize(item.producto, 80);
    doc.text(productoLines, MARGEN_IZQ + 2, yPos);
    
    doc.text(item.cantidad.toString(), MARGEN_IZQ + 100, yPos);
    
    doc.text(formatter.format(item.precio), MARGEN_IZQ + 120, yPos);
    
    doc.text(formatter.format(item.subtotal()), MARGEN_DER - 2, yPos, { align: "right" });

    yPos += Math.max(productoLines.length * 5, 8);
  });

  yPos += 5;
  doc.line(MARGEN_IZQ, yPos, MARGEN_DER, yPos);
  yPos += 8;

  const subtotal = factura.calcularSubtotal();
  const iva = factura.calcularIVA();
  const total = factura.total;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", MARGEN_IZQ + 120, yPos);
  doc.text(formatter.format(subtotal), MARGEN_DER - 2, yPos, { align: "right" });

  yPos += 7;
  doc.text(`IVA (${factura.tasaIVA}%):`, MARGEN_IZQ + 120, yPos);
  doc.text(formatter.format(iva), MARGEN_DER - 2, yPos, { align: "right" });

  yPos += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARIO);
  doc.text("TOTAL:", MARGEN_IZQ + 120, yPos);
  doc.text(formatter.format(total), MARGEN_DER - 2, yPos, { align: "right" });

  yPos += 15;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOR_TEXTO);
  doc.text(`Estado: ${factura.estado.toUpperCase()}`, MARGEN_IZQ, yPos);

  // Footer
  const footerY = ALTO_PAGINA - 15;
  const ahora = new Date();
  const fechaGen = nowFormatted(ahora);
  
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_GRIS);
  doc.text(`Generado el ${fechaGen}`, ANCHO_PAGINA / 2, footerY, { align: "center" });

  doc.save(`factura_${factura.numero}.pdf`);
  if (window.mostrarToast) {
    window.mostrarToast("✔ PDF descargado con éxito", "success");
  }
}

function nowFormatted(date) {
  const d = date.toLocaleDateString("es-AR", { day: '2-digit', month: '2-digit', year: 'numeric' });
  const t = date.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' });
  return `${d} a las ${t}`;
}

function getBase64ImageFromURL(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = error => reject(error);
    img.src = url;
  });
}
