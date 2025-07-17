// utils/emailService.js
const nodemailer = require('nodemailer');

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'prediversapruebas@gmail.com',
    pass: 'wzjt xrua ukeb nxyi'
  }
});

// Función para enviar correo de bienvenida con credenciales
async function sendWelcomeEmail(userEmail, userData) {
  try {
    console.log('📧 Enviando correo de bienvenida a:', userEmail);
    
    const mailOptions = {
      from: 'prediversapruebas@gmail.com',
      to: userEmail,
      subject: '¡Bienvenido a PrediVersa! - Credenciales de Acceso',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a PrediVersa</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .credentials { background-color: #e8f5e8; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; }
            .warning { background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .btn { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 ¡Bienvenido a PrediVersa!</h1>
            </div>
            <div class="content">
              <p>Estimado/a <strong>${userData.nombreCompleto}</strong>,</p>
              
              <p>¡Felicitaciones! Tu cuenta en PrediVersa ha sido creada exitosamente. A continuación encontrarás tus credenciales de acceso:</p>
              
              <div class="credentials">
                <h3>📋 Información de tu cuenta:</h3>
                <p><strong>Nombre:</strong> ${userData.nombreCompleto}</p>
                <p><strong>Correo:</strong> ${userData.correoElectronico}</p>
                <p><strong>Usuario:</strong> ${userData.usuario}</p>
                <p><strong>Contraseña:</strong> ${userData.contrasena}</p>
                <p><strong>Perfil:</strong> ${userData.perfil}</p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong> Por seguridad, te recomendamos cambiar tu contraseña una vez que ingreses al sistema.
              </div>
              
              <p>Puedes acceder al sistema PrediVersa en el siguiente enlace:</p>
              <p style="text-align: center;">
                <a href="http://localhost:3000" class="btn">Acceder a PrediVersa</a>
              </p>
              
              <h3>📞 Información de contacto registrada:</h3>
              <ul>
                <li><strong>Teléfono:</strong> ${userData.telefono}</li>
                <li><strong>Dirección:</strong> ${userData.direccion}</li>
                ${userData.contactoEmergencia ? `<li><strong>Contacto de emergencia:</strong> ${userData.contactoEmergencia} (${userData.telefonoFamiliar})</li>` : ''}
              </ul>
              
              <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
              
              <p>¡Esperamos que disfrutes de tu experiencia en PrediVersa!</p>
              
              <p>Saludos cordiales,<br>
              <strong>El equipo de PrediVersa</strong></p>
            </div>
            <div class="footer">
              <p>Este es un mensaje automático, por favor no responder a este correo.</p>
              <p>© 2025 PrediVersa. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado exitosamente:', info.messageId);
    return {
      success: true,
      messageId: info.messageId
    };
    
  } catch (error) {
    console.error('❌ Error enviando correo:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Función para verificar la conexión del servicio de correo
async function verifyEmailService() {
  try {
    await transporter.verify();
    console.log('✅ Servicio de correo verificado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error verificando servicio de correo:', error);
    return false;
  }
}

module.exports = {
  sendWelcomeEmail,
  verifyEmailService
};
