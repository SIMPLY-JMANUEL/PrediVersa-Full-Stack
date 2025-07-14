/* eslint-disable */
// routes/admin.js
// Rutas de administración usando arrays en memoria (adaptable a DB en el futuro)
const express = require('express');
const router = express.Router();
const { users, recursos } = require('../data');
const adminController = require('../controllers/adminController');
const { jwtRequired, roleRequired } = require('../utils/jwt');
const { getAdminStats } = require('../controllers/statsController');

// GET /admin/stats - Obtener estadísticas administrativas
router.get('/stats', jwtRequired, roleRequired('admin'), getAdminStats);

// POST /admin/usuarios/generar-credenciales
router.post(
  '/usuarios/generar-credenciales',
  jwtRequired,
  roleRequired('admin'),
  adminController.generateCredentials
);

// Helper para respuestas uniformes
function sendResponse(
  res,
  { success = true, msg = '', data = null, status = 200 }
) {
  res.status(status).json({ success, msg, data });
}

// GET /admin/perfil
// Devuelve el perfil del admin autenticado
router.get('/perfil', jwtRequired, roleRequired('admin'), (req, res) => {
  const { id, nombre, correo, rol } = req.user;
  sendResponse(res, { data: { id, nombre, correo, rol } });
});

// GET /admin/usuarios
// Lista de usuarios
router.get('/usuarios', jwtRequired, roleRequired('admin'), (req, res) => {
  const lista = users.map(u => ({
    id: u.id,
    nombre: u.nombre,
    correo: u.correo,
    rol: u.rol,
    fecha_registro: u.fecha_registro,
  }));
  sendResponse(res, { data: lista });
});

// PUT /admin/usuarios/:id
// Actualizar usuario
router.put('/usuarios/:id', jwtRequired, roleRequired('admin'), (req, res) => {
  const { nombre, correo, rol } = req.body;
  const usuario = users.find(u => u.id == req.params.id);
  if (!usuario) {
    return sendResponse(res, {
      success: false,
      msg: 'Usuario no encontrado',
      status: 404,
    });
  }
  if (nombre) {
    usuario.nombre = nombre;
  }
  if (correo) {
    usuario.correo = correo;
  }
  if (rol) {
    usuario.rol = rol;
  }
  sendResponse(res, { msg: 'Usuario actualizado correctamente' });
});

// DELETE /admin/usuarios/:id
router.delete(
  '/usuarios/:id',
  jwtRequired,
  roleRequired('admin'),
  (req, res) => {
    const idx = users.findIndex(u => u.id == req.params.id);
    if (idx === -1) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    users.splice(idx, 1);
    res.json({ msg: 'Usuario eliminado correctamente' });
  }
);

// GET /admin/recursos
router.get('/recursos', jwtRequired, roleRequired('admin'), (req, res) => {
  res.json(
    recursos.map(r => ({
      id: r.id,
      titulo: r.titulo,
      descripcion: r.descripcion,
      url: r.url,
      autor_id: r.autor_id,
      fecha_creacion: r.fecha_creacion,
    }))
  );
});

// DELETE /admin/recursos/:id
router.delete(
  '/recursos/:id',
  jwtRequired,
  roleRequired('admin'),
  (req, res) => {
    const idx = recursos.findIndex(r => r.id == req.params.id);
    if (idx === -1) {
      return res.status(404).json({ msg: 'Recurso no encontrado' });
    }
    recursos.splice(idx, 1);
    res.json({ msg: 'Recurso eliminado correctamente' });
  }
);

const os = require('os');

// GET /admin/system-status
router.get('/system-status', jwtRequired, roleRequired('admin'), (req, res) => {
  // Simulación de métricas (puedes usar datos reales si lo deseas)
  const rendimiento = 98.5; // Puedes calcularlo dinámicamente si lo prefieres
  const seguridad = 'Óptima'; // O lógica real si tienes análisis de seguridad
  const usoRecursos =
    Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 1000) / 10;
  const uptime = Math.floor(process.uptime() / 60); // minutos
  const usuariosActivos = Math.floor(Math.random() * 100) + 10; // Simulado
  const peticionesUltimaHora = Math.floor(Math.random() * 500) + 100; // Simulado
  const version = process.version;
  const plataforma = process.platform;

  res.json({
    rendimiento,
    seguridad,
    usoRecursos,
    uptime,
    usuariosActivos,
    peticionesUltimaHora,
    version,
    plataforma,
  });
});

module.exports = router;

/*
Notas:
- Asegúrate de tener los arrays `users` y `recursos` exportados desde un archivo común (por ejemplo, data.js).
- Para migrar a base de datos, solo reemplaza los métodos de array por los de tu ORM.
- Integra este archivo en server.js con:
    const adminRoutes = require('./routes/admin');
    app.use('/admin', adminRoutes);
*/
