// routes/shared.js
// Rutas compartidas para todos los roles
const express = require('express');
const router = express.Router();

// Helper para respuestas uniformes
function sendResponse(res, { success = true, msg = '', data = null, status = 200 }) {
  res.status(status).json({ success, msg, data });
}

// GET /shared/test
// Ruta de prueba compartida
router.get('/test', (req, res) => {
  sendResponse(res, { msg: 'Rutas compartidas funcionando' });
});

module.exports = router;
