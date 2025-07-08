// routes/teacher.js
// Rutas para el rol docente usando arrays en memoria
const express = require('express');
const router = express.Router();
const { jwtRequired, roleRequired } = require('../utils/jwt');
const { users, cuestionarios } = require('../data');

// Helper para respuestas uniformes
function sendResponse(res, { success = true, msg = '', data = null, status = 200 }) {
  res.status(status).json({ success, msg, data });
}

// GET /teacher/perfil
// Devuelve el perfil del docente autenticado
router.get('/perfil', jwtRequired, roleRequired('profesor'), (req, res) => {
  const { id, nombre, correo, rol } = req.user;
  sendResponse(res, { data: { id, nombre, correo, rol } });
});

// GET /teacher/cuestionarios
// Lista de cuestionarios disponibles para el docente
router.get('/cuestionarios', jwtRequired, roleRequired('profesor'), (req, res) => {
  const lista = cuestionarios.map(c => ({
    id: c.id,
    titulo: c.titulo
  }));
  sendResponse(res, { data: lista });
});

module.exports = router;
