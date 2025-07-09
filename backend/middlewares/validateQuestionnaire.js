// middlewares/validateQuestionnaire.js
// Middleware robusto para validar datos de cuestionarios

module.exports = function validateQuestionnaire(req, res, next) {
  const { respuestas } = req.body;
  if (
    !respuestas ||
    typeof respuestas !== 'object' ||
    Array.isArray(respuestas)
  ) {
    return res.status(400).json({
      success: false,
      msg: 'El campo "respuestas" es requerido y debe ser un objeto.',
    });
  }
  const values = Object.values(respuestas);
  if (
    values.length === 0 ||
    values.some(val => val === undefined || val === null || val === '')
  ) {
    return res.status(400).json({
      success: false,
      msg: 'Todas las respuestas deben estar completas.',
    });
  }
  // Validar que los valores sean string o número y no contengan scripts
  for (const val of values) {
    if (typeof val !== 'string' && typeof val !== 'number') {
      return res.status(400).json({
        success: false,
        msg: 'Las respuestas deben ser texto o número.',
      });
    }
    if (typeof val === 'string' && /<script.*?>/i.test(val)) {
      return res.status(400).json({
        success: false,
        msg: 'Respuesta inválida.',
      });
    }
  }
  next();
};
