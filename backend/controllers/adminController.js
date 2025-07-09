// controllers/adminController.js
// Lógica para generación de credenciales automáticas

// Importar validadores y generadores reutilizables
const {
  generateAutoUsername,
  generateAutoEmail,
  generateAutoPassword,
  isValidPassword,
  isValidPhone,
  isValidEmail,
} = require('../utils/validators');

/**
 * Genera credenciales automáticas y responde con validación robusta.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function generateCredentials(req, res) {
  const { nombre, apellido, documento, telefono } = req.body;
  if (!nombre || !documento) {
    return res.status(400).json({ msg: 'Nombre y documento son requeridos' });
  }
  const autoUsername = generateAutoUsername(nombre, documento);
  const autoEmail = generateAutoEmail(nombre, apellido);
  const autoPassword = generateAutoPassword();

  // Validación redundante de email
  if (!isValidEmail(autoEmail)) {
    return res.status(400).json({ msg: 'Email generado no es válido' });
  }
  // Validación redundante de contraseña
  if (!isValidPassword(autoPassword)) {
    return res
      .status(400)
      .json({ msg: 'Contraseña generada no cumple requisitos de seguridad' });
  }
  // Si se envía teléfono, validar
  if (telefono && !isValidPhone(telefono)) {
    return res.status(400).json({ msg: 'Formato de teléfono inválido' });
  }

  res.json({ autoUsername, autoEmail, autoPassword });
}

module.exports = {
  generateCredentials,
};
