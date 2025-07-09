// routes/pqr.js
// Rutas para gestión de reportes/PQR
const express = require('express');
const router = express.Router();
const { jwtRequired } = require('../utils/jwt');
const pqrController = require('../controllers/pqrController');

// Crear nuevo reporte/PQR
router.post('/', jwtRequired, pqrController.crearPqr);
// Listar todos los reportes (solo admin/moderador)
router.get('/', jwtRequired, pqrController.listarPqr);
// Actualizar reporte (seguimiento, estado)
router.put('/:id', jwtRequired, pqrController.actualizarPqr);

module.exports = router;
