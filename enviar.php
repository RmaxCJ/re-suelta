<?php
// Asegurar que solo se acepten peticiones POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Recoger y limpiar los datos del formulario (Alineado con los 'name' del HTML)
    $nombre = strip_tags(trim($_POST["nombre"]));
    $telefono = strip_tags(trim($_POST["telefono"]));
    $email = filter_var(trim($_POST["correo"]), FILTER_SANITIZE_EMAIL);
    $motivo = strip_tags(trim($_POST["motivo"]));
    $mensaje = trim($_POST["mensaje"]);

    // Validar que los campos obligatorios no estén vacíos
    if (empty($nombre) || empty($telefono) || empty($motivo) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Por favor completa todos los campos correctamente.";
        exit;
    }

    // Tu correo de destino
    $destinatario = "rogelio_max@hotmail.com";
    $asunto = "🌿 Nuevo mensaje de re:suelta: " . $nombre;

    // Cabeceras obligatorias
    $cabeceras = "MIME-Version: 1.0" . "\r\n";
    $cabeceras .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $cabeceras .= "From: Webmaster <webmaster@luegoluegoatumesa.com>" . "\r\n";
    $cabeceras .= "Reply-To: " . $email . "\r\n";

    // Diseño del correo en HTML estilizado para la marca re:suelta
    $contenido_correo = '
    <html>
    <head>
        <style>
            body { background-color: #faf8f4; font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #3d3830; }
            .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8eed8; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
            .email-header { background-color: #5a6e3a; padding: 25px; text-align: center; border-bottom: 3px solid #e8a87c; }
            .email-header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: normal; letter-spacing: 1px; font-style: italic; }
            .email-body { padding: 30px; }
            .info-box { background-color: #fdf0e6; border-left: 4px solid #e8a87c; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
            .info-label { color: #5a6e3a; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
            .info-value { font-size: 16px; color: #3d3830; margin-top: 5px; }
            .mensaje-box { background-color: #faf8f4; padding: 20px; border-radius: 8px; border: 1px solid #e8eed8; margin-top: 15px; }
            .email-footer { background-color: #f9f9f9; text-align: center; padding: 20px; font-size: 12px; color: #7a6e62; border-top: 1px solid #eeeeee; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h1>re:suelta | Nuevo Contacto Web</h1>
            </div>
            <div class="email-body">
                <p style="font-size: 16px; margin-top: 0; color: #7a6e62;">Has recibido un nuevo mensaje desde el formulario web de tu página:</p>
                
                <div class="info-box">
                    <div class="info-label">Nombre:</div>
                    <div class="info-value">' . htmlspecialchars($nombre) . '</div>
                </div>

                <div class="info-box">
                    <div class="info-label">WhatsApp / Teléfono:</div>
                    <div class="info-value">' . htmlspecialchars($telefono) . '</div>
                </div>

                <div class="info-box">
                    <div class="info-label">Correo Electrónico:</div>
                    <div class="info-value"><a href="mailto:' . htmlspecialchars($email) . '" style="color: #7a9050; text-decoration: none;">' . htmlspecialchars($email) . '</a></div>
                </div>

                <div class="info-box">
                    <div class="info-label">Motivo de consulta:</div>
                    <div class="info-value">' . htmlspecialchars($motivo) . '</div>
                </div>

                <div class="info-label" style="margin-top: 25px;">Mensaje adicional:</div>
                <div class="mensaje-box">
                    <p style="margin: 0; line-height: 1.6; color: #3d3830;">' . nl2br(htmlspecialchars($mensaje)) . '</p>
                </div>
            </div>
            <div class="email-footer">
                Espacio de psicología integral • Silvana Guerrero Araujo
            </div>
        </div>
    </body>
    </html>
    ';

    // Enviar el correo
    if (mail($destinatario, $asunto, $contenido_correo, $cabeceras)) {
        http_response_code(200);
        echo "¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.";
    } else {
        http_response_code(500);
        echo "Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.";
    }

} else {
    http_response_code(403);
    echo "Petición no válida.";
}
?>