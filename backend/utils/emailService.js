// utils/emailService.js
const nodemailer = require('nodemailer');

// Configuración del transporter de email
const createTransporter = () => {
  // Si no hay configuración de email, usar un transporter de prueba
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.log(
      '⚠️ Configuración de email no encontrada, usando modo de prueba'
    );
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Función para enviar email de bienvenida
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();

    // Si no hay transporter, simular envío exitoso
    if (!transporter) {
      console.log(`📧 [SIMULADO] Email de bienvenida enviado a: ${userEmail}`);
      return {
        success: true,
        message: 'Email simulado (configuración pendiente)',
      };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '¡Bienvenido a PrediVersa!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">¡Bienvenido a PrediVersa, ${userName}!</h2>
          <p>Tu cuenta ha sido creada exitosamente.</p>
          <p>Ahora puedes acceder a todas las funcionalidades de nuestro sistema de gestión educativa.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Próximos pasos:</h3>
            <ul>
              <li>Completa tu perfil</li>
              <li>Explora las funcionalidades disponibles</li>
              <li>Contacta con soporte si necesitas ayuda</li>
            </ul>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Este es un mensaje automático, por favor no respondas a este email.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de bienvenida enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error enviando email de bienvenida:', error.message);
    return { success: false, error: error.message };
  }
};

// Función para enviar email de notificación
const sendNotificationEmail = async (userEmail, subject, message) => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log(
        `📧 [SIMULADO] Notificación enviada a: ${userEmail} - ${subject}`
      );
      return { success: true, message: 'Notificación simulada' };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">PrediVersa - Notificación</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
            ${message}
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            Este es un mensaje automático del sistema PrediVersa.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de notificación enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error enviando notificación:', error.message);
    return { success: false, error: error.message };
  }
};

// Función para verificar configuración de email
const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      return {
        success: false,
        message: 'Configuración de email no disponible',
      };
    }

    await transporter.verify();
    console.log('✅ Configuración de email verificada');
    return { success: true, message: 'Configuración de email correcta' };
  } catch (error) {
    console.error(
      '❌ Error verificando configuración de email:',
      error.message
    );
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendNotificationEmail,
  testEmailConfiguration,
};
