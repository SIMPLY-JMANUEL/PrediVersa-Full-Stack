// Controlador de perfil con validación avanzada

const profiles = {};
const { isValidPhone, isValidEmail } = require('../utils/validators');

/**
 * Obtiene el perfil del usuario autenticado.
 */
function getProfile(req, res) {
  const userId = req.user.id;
  res.json(profiles[userId] || {});
}

/**
 * Actualiza el perfil del usuario autenticado con validación.
 */
function updateProfile(req, res) {
  const userId = req.user.id;
  const { theme, language, phone, address, email } = req.body;
  let photo = profiles[userId]?.photo || '';
  if (req.file) {
    photo = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      'base64'
    )}`;
  }
  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({ msg: 'Formato de teléfono inválido' });
  }
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ msg: 'Formato de email inválido' });
  }
  profiles[userId] = {
    theme: theme || 'light',
    language: language || 'es',
    phone: phone || '',
    address: address || '',
    email: email || '',
    photo,
  };
  res.json(profiles[userId]);
}

module.exports = {
  getProfile,
  updateProfile,
};
