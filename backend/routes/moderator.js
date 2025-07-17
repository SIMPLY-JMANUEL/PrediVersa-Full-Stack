// routes/moderator.js
// Rutas para el rol moderador usando arrays en memoria
const express = require('express');
const router = express.Router();
const { jwtRequired, roleRequired } = require('../utils/jwt');
// Se usa la base de datos en lugar de arrays en memoria

// Helper para respuestas uniformes
function sendResponse(res, { success = true, msg = '', data = null, status = 200 }) {
  res.status(status).json({ success, msg, data });
}

// GET /moderator/perfil
// Devuelve el perfil del moderador autenticado
router.get('/perfil', jwtRequired, roleRequired('moderador'), (req, res) => {
  const { id, nombre, correo, rol } = req.user;
  sendResponse(res, { data: { id, nombre, correo, rol } });
});

// GET /moderator/dashboard
// Resumen de actividad del moderador
router.get('/dashboard', jwtRequired, roleRequired('moderador'), (req, res) => {
  const total_reportes = reportes.length;
  const total_estudiantes = users.filter(u => u.rol === 'estudiante').length;
  const total_padres = users.filter(u => u.rol === 'padre').length;
  sendResponse(res, {
    data: {
      nombre: req.user.nombre,
      total_reportes,
      total_estudiantes,
      total_padres,
      fecha_ultimo_acceso: req.user.fecha_registro
    }
  });
});

// GET /moderator/reportes
// Lista de reportes
router.get('/reportes', jwtRequired, roleRequired('moderador'), (req, res) => {
  const lista = reportes.map(r => ({
    id: r.id,
    estudiante_id: r.estudiante_id,
    contenido: r.contenido,
    fecha: r.fecha
  }));
  sendResponse(res, { data: lista });
});

// GET /moderator/reportes/:id
// Detalle de un reporte
router.get('/reportes/:id', jwtRequired, roleRequired('moderador'), (req, res) => {
  const reporte = reportes.find(r => r.id == req.params.id);
  if (!reporte) {
    return sendResponse(res, { success: false, msg: 'Reporte no encontrado', status: 404 });
  }
  sendResponse(res, { data: reporte });
});

// GET /moderator/usuarios/estudiantes
// Lista de estudiantes
router.get('/usuarios/estudiantes', jwtRequired, roleRequired('moderador'), (req, res) => {
  const estudiantes = users.filter(u => u.rol === 'estudiante');
  const lista = estudiantes.map(e => ({
    id: e.id,
    nombre: e.nombre,
    correo: e.correo,
    fecha_registro: e.fecha_registro
  }));
  sendResponse(res, { data: lista });
});

module.exports = router;
