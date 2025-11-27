// js/api/apiService.js
// ----------------------------------------------------------
// Servicio de APIs externas para EMITÍ
// ----------------------------------------------------------

// Credenciales de EmailJS
const EMAILJS_PUBLIC_KEY = "iF4Z8fx4piITsYRqT";
const EMAILJS_SERVICE_ID = "service_fuk92qg";
const EMAILJS_TEMPLATE_ID = "template_3r0z5ac";

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
 * Formatea fecha estilo AFIP (solo DD/MM/YYYY) usando zona horaria AR
 */
function formatFecha(fecha) {
  try {
    return new Date(fecha).toLocaleDateString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return String(fecha);
  }
}

/**
 * Sanitiza un texto
 */
function sanitizeText(value, maxLen = 255) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/[<>]/g, "")
    .slice(0, maxLen)
    .trim();
}

/**
 * Construye el payload para EmailJS a partir de una factura del dominio.
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

  // map → normaliza items
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
    .filter((i) => i.producto && i.precio >= 0);

  // reduce → calcula total
  const totalCalculado = itemsNormalizados.reduce(
    (acc, item) => acc + item.subtotal,
    0
  );

  // tabla HTML final
  const itemsTableHTML = itemsNormalizados
    .map((item) => {
      return `
        <tr>
          <td style="padding:6px 10px; border-top:1px solid #e2e8f0;">
            ${item.producto}
          </td>
          <td style="padding:6px; border-top:1px solid #e2e8f0; text-align:center;">
            ${item.cantidad}
          </td>
          <td style="padding:6px; border-top:1px solid #e2e8f0; text-align:right;">
            $${item.precio.toFixed(2)}
          </td>
          <td style="padding:6px 10px; border-top:1px solid #e2e8f0; text-align:right;">
            $${item.subtotal.toFixed(2)}
          </td>
        </tr>
      `;
    })
    .join("");

  return {
    to_name: clienteNombre,
    to_email: clienteEmail,

    factura_numero: factura.numero,

    // 🚀 Ahora SOLO fecha, no hora
    factura_fecha: formatFecha(factura.fecha),

    factura_descripcion: sanitizeText(factura.descripcion, 500),
    factura_total: totalCalculado.toFixed(2),

    factura_items_table:
      itemsTableHTML ||
      `<tr>
         <td colspan="4" style="padding:8px; font-style:italic; color:#718096;">
           Sin ítems
         </td>
       </tr>`,

    factura_estado: factura.estado ?? "pendiente",
  };
}

/**
 * Envía un email de factura usando EmailJS.
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
      if (intentos >= maxIntentos) {
        console.error("[EmailAPI] Error al enviar email:", error);
        throw new Error(
          "No se pudo enviar el email de la factura. Intentá nuevamente más tarde."
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}

// ----------------------------------------------------------
// FakeStoreAPI - Productos demo
// ----------------------------------------------------------
export async function fetchFakeStoreProducts(limit = 8) {
  const url = `https://fakestoreapi.com/products?limit=${limit}`;

  try {
    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error("Error al obtener productos desde la API externa.");
    }

    const raw = await resp.json();

    // Normalización minimal
    return raw.map(p => ({
      id: p.id,
      nombre: p.title.trim(),
      categoria: p.category,
      precio: Number(p.price)
    }));
  } catch (err) {
    console.error("[API] Error FakeStore:", err);
    throw new Error("No se pudieron cargar los productos demo.");
  }
}
