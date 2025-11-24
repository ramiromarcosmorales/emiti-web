// js/api/apiService.js
// ----------------------------------------------------------
// Servicio de APIs externas para EMITÍ
// ----------------------------------------------------------

// Credenciales de EmailJS
const EMAILJS_PUBLIC_KEY = "ZG0bwtkRkJ9TiqOPH";
const EMAILJS_SERVICE_ID = "service_xdaswcx";
const EMAILJS_TEMPLATE_ID = "template_k12jp2e";

/**
 * Inicializa el SDK de EmailJS.
 */
export function initEmailAPI() {
  if (!window.emailjs) {
    console.warn("[EmailAPI] SDK de EmailJS no encontrado en window.emailjs");
    return;
  }
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

/**
 * Sanitiza un texto
 * @param {any} value
 * @param {number} maxLen
 * @returns {string}
 */
function sanitizeText(value, maxLen = 255) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ") // quita saltos
    .replace(/[<>]/g, "")     // quita < >
    .slice(0, maxLen)
    .trim();
}

/**
 * Construye el payload para EmailJS a partir de una factura del dominio.
 * Aplica map / filter / reduce sobre los items.
 * @param {Factura} factura
 * @returns {Object}
 */
export function buildInvoiceEmailPayload(factura) {
  if (!factura || !factura.cliente) {
    throw new Error("Factura inválida para enviar por email.");
  }

  const clienteNombre = sanitizeText(factura.cliente.nombre, 80);
  const clienteEmail = sanitizeText(factura.cliente.email, 120);

  if (!clienteNombre || !clienteEmail) {
    throw new Error("La factura no tiene nombre o email de cliente válidos.");
  }

  // map
  const itemsNormalizados = (factura.items ?? [])
    .map((item) => {
      const cantidad = Number(item.cantidad ?? 1) || 1;
      const precio = Number(item.precio ?? 0) || 0;
      const subtotal =
        typeof item.subtotal === "function"
          ? Number(item.subtotal()) || 0
          : cantidad * precio;

      return {
        producto: sanitizeText(item.producto, 80),
        cantidad,
        precio,
        subtotal,
      };
    })
    // filter
    .filter((i) => i.producto && i.precio >= 0);

  // reduce
  const totalCalculado = itemsNormalizados.reduce(
    (acc, item) => acc + item.subtotal,
    0
  );

  const totalItems = itemsNormalizados.length;

  const itemsDescripcion = itemsNormalizados
    .map(
      (item) =>
        `- ${item.producto} x${item.cantidad} - $${item.subtotal.toFixed(2)}`
    )
    .join("\n");

  return {
    to_name: clienteNombre,
    to_email: clienteEmail,

    factura_numero: factura.numero,
    factura_fecha: factura.fecha,
    factura_descripcion: sanitizeText(factura.descripcion, 500),

    factura_total: totalCalculado.toFixed(2),
    factura_items_count: totalItems.toString(),
    factura_items_list: itemsDescripcion || "Sin ítems",

    factura_estado: factura.estado ?? "pendiente",
  };
}

/**
 * Envía un email de factura usando EmailJS.
 * @param {Object} templateParams
 * @returns {Promise<{status: "success", data: any}>}
 */
export async function sendInvoiceEmail(templateParams) {
  if (!window.emailjs) {
    throw new Error("El SDK de EmailJS no está cargado en la página.");
  }

  if (!templateParams?.to_email) {
    throw new Error("No se recibió un email de destino válido.");
  }

  let intentos = 0;
  const maxIntentos = 2;

  while (true) {
    try {
      const resp = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      return {
        status: "success",
        data: resp,
      };
    } catch (error) {
      intentos++;
      const esUltimoIntento = intentos >= maxIntentos;

      if (esUltimoIntento) {
        console.error("[EmailAPI] Error al enviar email:", error);
        throw new Error(
          "No se pudo enviar el email de la factura. Intentá nuevamente más tarde."
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}