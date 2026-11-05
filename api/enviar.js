export default async function handler(req, res) {
  // Asegurar que solo se acepten peticiones POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido." });
  }

  // Extraer los datos enviados desde el frontend
  const { nombre, telefono, correo, motivo, mensaje } = req.body;

  if (!nombre || !telefono || !correo || !motivo) {
    return res
      .status(400)
      .json({ error: "Por favor completa todos los campos correctamente." });
  }

  // AQUÍ ESTÁ EL CAMBIO: Ahora busca el nombre específico que le pusiste en Vercel
  const resendApiKey = process.env.RESEND_API_KEY_RESUELTA;

  // Plantilla HTML del correo (Estilo re:suelta)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { background-color: #faf8f4; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; color: #3d3830; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8eed8; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
            .header { background-color: #5a6e3a; padding: 25px; text-align: center; border-bottom: 3px solid #e8a87c; }
            .header h2 { color: #ffffff; margin: 0; font-size: 22px; font-weight: normal; letter-spacing: 1px; font-style: italic; }
            .body-content { padding: 30px; }
            .field { margin-bottom: 20px; border-left: 4px solid #e8a87c; padding-left: 15px; background: #fdf0e6; padding-top: 12px; padding-bottom: 12px; border-radius: 0 4px 4px 0; }
            .label { color: #5a6e3a; font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { font-size: 15px; color: #3d3830; margin-top: 6px; }
            .message-box { background-color: #faf8f4; border: 1px solid #e8eed8; border-radius: 8px; padding: 16px; margin-top: 8px; white-space: pre-wrap; font-size: 14px; color: #3d3830; }
            .footer { background-color: #f9f9f9; text-align: center; padding: 20px; font-size: 11px; color: #7a6e62; border-top: 1px solid #eeeeee; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>re:suelta | Nueva Solicitud de Cita</h2>
            </div>
            <div class="body-content">
                <div class="field">
                    <div class="label">Nombre</div>
                    <div class="value"><strong>${nombre}</strong></div>
                </div>
                <div class="field">
                    <div class="label">WhatsApp / Teléfono</div>
                    <div class="value">
                        <a href="https://wa.me/${telefono.replace(/[^0-9]/g, "")}" target="_blank" style="color: #5a6e3a; text-decoration: none; font-weight: bold;">
                            ${telefono} 📱 (Abrir Chat)
                        </a>
                    </div>
                </div>
                <div class="field">
                    <div class="label">Correo Electrónico</div>
                    <div class="value"><a href="mailto:${correo}" style="color: #5a6e3a; text-decoration: none;">${correo}</a></div>
                </div>
                <div class="field">
                    <div class="label">Motivo de Consulta</div>
                    <div class="value">${motivo}</div>
                </div>
                <div class="label" style="margin-top: 24px; padding-left: 15px;">Mensaje adicional</div>
                <div class="message-box">${mensaje || "Sin mensaje adicional"}</div>
            </div>
            <div class="footer">
                Enviado automáticamente desde la web de re:suelta
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "re:suelta Web <onboarding@resend.dev>",
        to: ["rogelio_max@hotmail.com"],
        subject: `🌿 Nuevo contacto: ${nombre}`,
        reply_to: correo,
        html: htmlContent,
      }),
    });

    if (response.ok) {
      return res
        .status(200)
        .json({
          message:
            "¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.",
        });
    } else {
      return res
        .status(500)
        .json({
          error: "Hubo un problema al enviar el mensaje. Inténtalo de nuevo.",
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error de servidor. Inténtalo más tarde." });
  }
}
