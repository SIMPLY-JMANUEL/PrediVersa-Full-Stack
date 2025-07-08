// backend/routes/profile.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// Ruta protegida para obtener el perfil del usuario autenticado
router.get('/', auth, (req, res) => {
  // req.user viene del middleware auth (decodificado del token)
  if (!req.user) {
    return res.status(401).json({ msg: 'Token no válido o expirado' });
  }
  res.json({
    profile: {
      id: req.user.id,
      nombre: req.user.nombre,
      correo: req.user.correo,
      rol: req.user.rol
    }
  });
});

module.exports = router;
