// controllers/statsController.js
// Lógica para estadísticas y logros del usuario con validación y helpers

const stats = {};
const { isValidEmail } = require('../utils/validators');
const { executeQuery } = require('../config/database');

/**
 * Obtiene estadísticas administrativas del sistema
 */
const getAdminStats = async (req, res) => {
  try {
    // Consulta para obtener estadísticas de usuarios
    const statsQuery = `
      SELECT 
        COUNT(*) as totalUsuarios,
        SUM(CASE WHEN Activo = 'SI' OR Activo = '1' THEN 1 ELSE 0 END) as usuariosActivos,
        SUM(CASE WHEN Activo = 'NO' OR Activo = '0' THEN 1 ELSE 0 END) as usuariosInactivos,
        SUM(CASE WHEN Perfil = 'Estudiante' THEN 1 ELSE 0 END) as estudiantes,
        SUM(CASE WHEN Perfil = 'Padre' OR Perfil = 'Padre/Madre/Acudiente' OR Perfil = 'Acudiente' THEN 1 ELSE 0 END) as padres,
        SUM(CASE WHEN Perfil = 'Profesor' OR Perfil = 'Docente' THEN 1 ELSE 0 END) as profesores,
        SUM(CASE WHEN Perfil = 'Moderador' THEN 1 ELSE 0 END) as moderadores,
        SUM(CASE WHEN Perfil = 'Administrador' THEN 1 ELSE 0 END) as administradores
      FROM Usuarios
    `;

    const statsResult = await executeQuery(statsQuery);
    const stats = statsResult.recordset[0];

    // Consulta para obtener número de evaluaciones (si existe tabla evaluaciones)
    let evaluaciones = 0;
    try {
      const evaluacionesQuery = 'SELECT COUNT(*) as total FROM Evaluaciones';
      const evaluacionesResult = await executeQuery(evaluacionesQuery);
      evaluaciones = evaluacionesResult.recordset[0].total;
    } catch {
      console.log('Tabla Evaluaciones no encontrada, usando valor por defecto');
    }

    // Consulta para obtener número de alertas (si existe tabla alertas)
    let alertas = 0;
    try {
      const alertasQuery = 'SELECT COUNT(*) as total FROM Alertas WHERE estado = \'Activa\'';
      const alertasResult = await executeQuery(alertasQuery);
      alertas = alertasResult.recordset[0].total;
    } catch {
      console.log('Tabla Alertas no encontrada, usando valor por defecto');
    }

    const response = {
      totalUsuarios: parseInt(stats.totalUsuarios) || 0,
      usuariosActivos: parseInt(stats.usuariosActivos) || 0,
      usuariosInactivos: parseInt(stats.usuariosInactivos) || 0,
      estudiantes: parseInt(stats.estudiantes) || 0,
      padres: parseInt(stats.padres) || 0,
      profesores: parseInt(stats.profesores) || 0,
      moderadores: parseInt(stats.moderadores) || 0,
      administradores: parseInt(stats.administradores) || 0,
      evaluaciones: parseInt(evaluaciones) || 0,
      alertas: parseInt(alertas) || 0
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

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
  getAdminStats
};
