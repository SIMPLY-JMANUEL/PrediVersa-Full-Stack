// controllers/statsController.js
// Lógica para estadísticas y logros del usuario con validación y helpers

const stats = {};
const { isValidEmail } = require('../utils/validators');

/**
 * Actualiza las estadísticas del usuario.
 */
function actualizarStats(req, res) {
  const { userId, cuestionariosCompletados, diasActivos, achievements, email } =
    req.body;
  if (!userId) return res.status(400).json({ msg: 'userId requerido' });
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ msg: 'Email inválido' });
  }
  if (!stats[userId]) {
    stats[userId] = {
      cuestionariosCompletados: 0,
      diasActivos: 1,
      achievements: [],
      ultimoAcceso: new Date().toISOString(),
      email: email || '',
    };
  }
  if (typeof cuestionariosCompletados === 'number')
    stats[userId].cuestionariosCompletados = cuestionariosCompletados;
  if (typeof diasActivos === 'number') stats[userId].diasActivos = diasActivos;
  if (Array.isArray(achievements)) stats[userId].achievements = achievements;
  if (email) stats[userId].email = email;
  stats[userId].ultimoAcceso = new Date().toISOString();
  res.json({ msg: 'Estadísticas actualizadas', stats: stats[userId] });
}

/**
 * Obtiene las estadísticas del usuario.
 */
function obtenerStats(req, res) {
  const userId = req.params.userId;
  if (!userId || !stats[userId])
    return res
      .status(404)
      .json({ msg: 'No hay estadísticas para este usuario' });
  res.json({ stats: stats[userId] });
}

module.exports = {
  actualizarStats,
  obtenerStats,
};
