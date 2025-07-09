// routes/stats.js
// Rutas para estadísticas y logros del usuario
const express = require('express');
const router = express.Router();
const { jwtRequired } = require('../utils/jwt');
const statsController = require('../controllers/statsController');

// Actualizar estadísticas del usuario
router.post('/actualizar', jwtRequired, statsController.actualizarStats);
// Obtener estadísticas del usuario
router.get('/:userId', jwtRequired, statsController.obtenerStats);

module.exports = router;
