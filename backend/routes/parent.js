// routes/parent.js
// Rutas para el rol padre usando arrays en memoria
const express = require('express');
const router = express.Router();
const { jwtRequired, roleRequired } = require('../utils/jwt');
// Se usa la base de datos en lugar de arrays en memoria

// Helper para respuestas uniformes
function sendResponse(res, { success = true, msg = '', data = null, status = 200 }) {
  res.status(status).json({ success, msg, data });
}

// GET /parent/perfil
// Devuelve el perfil del padre autenticado
router.get('/perfil', jwtRequired, roleRequired('padre'), (req, res) => {
  const { id, nombre, correo, rol } = req.user;
  sendResponse(res, { data: { id, nombre, correo, rol } });
});

// GET /parent/cuestionarios
// Lista de cuestionarios activos (simulación: todos activos)
router.get('/cuestionarios', jwtRequired, roleRequired('padre'), (req, res) => {
  const lista = cuestionarios.map(c => ({
    id: c.id,
    titulo: c.titulo,
    descripcion: c.descripcion,
    fecha_creacion: c.fecha_creacion
  }));
  sendResponse(res, { data: lista });
});

// GET /parent/resultados/:student_id
// Resultados del hijo (pendiente de lógica real)
router.get('/resultados/:student_id', jwtRequired, roleRequired('padre'), (req, res) => {
  sendResponse(res, { success: false, msg: 'Funcionalidad pendiente', status: 501 });
});

module.exports = router;
