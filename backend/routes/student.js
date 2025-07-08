// routes/student.js
// Rutas para el rol estudiante usando arrays en memoria
const express = require('express');
const router = express.Router();
const { jwtRequired, roleRequired } = require('../utils/jwt');
const { users, cuestionarios, recursos, respuestas } = require('../data');

// Helper para respuestas uniformes
function sendResponse(res, { success = true, msg = '', data = null, status = 200 }) {
  res.status(status).json({ success, msg, data });
}

// GET /student/perfil
// Devuelve el perfil del estudiante autenticado
router.get('/perfil', jwtRequired, roleRequired('estudiante'), (req, res) => {
  const { id, nombre, correo, rol } = req.user;
  sendResponse(res, { data: { id, nombre, correo, rol } });
});

// GET /student/dashboard
// Resumen de actividad del estudiante
router.get('/dashboard', jwtRequired, roleRequired('estudiante'), (req, res) => {
  const total_cuestionarios = cuestionarios.length;
  const recursos_disponibles = recursos.length;
  const respuestas_hechas = respuestas.filter(r => r.usuario_id == req.user.id).length;
  sendResponse(res, {
    data: {
      nombre: req.user.nombre,
      total_cuestionarios,
      recursos_disponibles,
      respuestas_hechas,
      fecha_ultimo_acceso: req.user.fecha_registro
    }
  });
});

// GET /student/cuestionarios
// Lista de cuestionarios disponibles
router.get('/cuestionarios', jwtRequired, roleRequired('estudiante'), (req, res) => {
  const lista = cuestionarios.map(c => ({
    id: c.id,
    titulo: c.titulo,
    descripcion: c.descripcion,
    fecha_creacion: c.fecha_creacion
  }));
  sendResponse(res, { data: lista });
});

// POST /student/cuestionarios/:id/responder
// Registrar respuestas a un cuestionario
router.post('/cuestionarios/:id/responder', jwtRequired, roleRequired('estudiante'), (req, res) => {
  const { respuestas: resp } = req.body;
  const cuestionario = cuestionarios.find(c => c.id == req.params.id);
  if (!cuestionario) {
    return sendResponse(res, { success: false, msg: 'Cuestionario no encontrado', status: 404 });
  }
  if (!resp || !Array.isArray(resp) || resp.length === 0) {
    return sendResponse(res, { success: false, msg: 'Faltan respuestas', status: 400 });
  }
  respuestas.push({
    id: respuestas.length + 1,
    usuario_id: req.user.id,
    cuestionario_id: req.params.id,
    fecha_respuesta: new Date().toISOString(),
    respuestas: resp
  });
  sendResponse(res, { msg: 'Respuesta registrada correctamente' });
});

// GET /student/historial
// Historial de cuestionarios respondidos
router.get('/historial', jwtRequired, roleRequired('estudiante'), (req, res) => {
  const historial = respuestas.filter(r => r.usuario_id == req.user.id).map(r => ({
    cuestionario_id: r.cuestionario_id,
    fecha_respuesta: r.fecha_respuesta,
    respuestas: r.respuestas
  }));
  sendResponse(res, { data: historial });
});

// GET /student/recursos
// Recursos disponibles para el estudiante
router.get('/recursos', jwtRequired, roleRequired('estudiante'), (req, res) => {
  const lista = recursos.map(r => ({
    id: r.id,
    titulo: r.titulo,
    descripcion: r.descripcion,
    url: r.url,
    fecha_creacion: r.fecha_creacion
  }));
  sendResponse(res, { data: lista });
});

module.exports = router;
