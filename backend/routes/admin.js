const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, getUserById } = require('../models/UserSQL');

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
      usuarios_activos: 7,
      usuarios_totales: 7,
      sesiones_activas: 1,
      uptime: Math.floor(process.uptime()),
      totalUsers: 7,
      totalStudents: 3,
      totalTeachers: 2,
      totalParents: 1,
      recentReports: 5,
      pendingPQRs: 2,
    },
  });
});

// GET /api/admin/alerts - Alertas del sistema
router.get('/alerts', (req, res) => {
  const alerts = [
    {
      id: 1,
      title: 'Sistema Operativo',
      message: 'Todos los servicios funcionando correctamente',
      timestamp: new Date().toISOString(),
      level: 'info',
    },
    {
      id: 2,
      title: 'Usuarios Activos',
      message: 'Se registraron 3 nuevos usuarios hoy',
      timestamp: new Date().toISOString(),
      level: 'success',
    },
  ];

  sendResponse(res, {
    success: true,
    data: alerts,
  });
});

// GET /api/admin/users - Obtener usuarios desde SQL Server
router.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    sendResponse(res, { data: users });
  } catch (error) {
    console.error('Error getting users:', error);
    sendResponse(res, {
      success: false,
      msg: 'Error al obtener usuarios',
      status: 500,
    });
  }
});

// POST /api/admin/users - Crear usuario en SQL Server
router.post('/users', async (req, res) => {
  try {
    const { nombre, correo, usuario, password, rol, telefono, edad } = req.body;

    if (!nombre || !correo || !usuario || !password || !rol) {
      return sendResponse(res, {
        success: false,
        msg: 'Faltan campos obligatorios',
        status: 400,
      });
    }

    const newUserId = await createUser({
      nombre,
      correo,
      usuario,
      password,
      rol,
      telefono: telefono || '',
      edad: edad || null,
      activo: 'SI',
    });

    sendResponse(res, {
      msg: 'Usuario creado exitosamente',
      data: { id: newUserId },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    sendResponse(res, {
      success: false,
      msg: 'Error al crear usuario',
      status: 500,
    });
  }
});

module.exports = router;
