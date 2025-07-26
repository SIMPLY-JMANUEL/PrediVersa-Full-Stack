const express = require('express');
const router = express.Router();

// Helper para respuestas uniformes
function sendResponse(
  res,
  { success = true, msg = '', data = null, status = 200 }
) {
  res.status(status).json({ success, msg, data });
}

// GET /api/admin/system-status - Obtener estado del sistema
router.get('/system-status', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'operational',
      services: {
        backend: 'running',
        frontend: 'running',
        api_gateway: 'running',
      },
      timestamp: new Date().toISOString(),
    },
  });
});

// GET /api/admin/perfil - Perfil del admin
router.get('/perfil', (req, res) => {
  sendResponse(res, {
    data: {
      id: 1,
      nombre: 'Administrador',
      correo: 'admin@prediversa.com',
      rol: 'admin',
    },
  });
});

// GET /api/admin/stats - Estadísticas básicas
router.get('/stats', (req, res) => {
  sendResponse(res, {
    data: {
      usuarios_activos: 3,
      usuarios_totales: 3,
      sesiones_activas: 1,
      uptime: Math.floor(process.uptime()),
    },
  });
});

module.exports = router;
