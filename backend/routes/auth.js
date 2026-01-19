const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Usar adaptador de base de datos (funciona con MySQL o SQL Server)
const db = require('../db-adapter');

// @route   POST /api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log(`🔍 Login route hit - ${db.dialect === 'mysql' ? 'AWS RDS MySQL' : 'SQL Server Local'}`);
    console.log('📦 Request body:', req.body);

    const { usuario, correoElectronico, correo, contraseña, password } =
      req.body || {};

    // Permitir múltiples formas de identificación
    const identifier = usuario || correoElectronico || correo;
    const pwd = contraseña || password;

    console.log('🔍 Processed:', { identifier, pwd: pwd ? '***' : 'MISSING' });

    if (!identifier || !pwd) {
      return res.status(400).json({
        success: false,
        msg: 'Por favor proporciona usuario/correo y contraseña',
      });
    }

    // Buscar usuario en la base de datos
    console.log(`🔍 Searching user in ${db.dialect}...`);
    const user = await db.User.getUserByCredentials(identifier, pwd);

    if (!user) {
      console.log('❌ Invalid credentials');
      return res.status(401).json({
        success: false,
        msg: 'Credenciales inválidas',
      });
    }

    console.log('🔍 User found:', {
      id: user.Id_Usuario || user.id,
      usuario: user.Usuario || user.usuario,
      correo: user.Correo || user.correo,
      rol: user.rol,
      perfil: user.Perfil || user.rol || user.perfil,
      activo: user.Activo || user.activo,
    });

    // Verificar que el usuario esté activo
    const activoValue = String(user.Activo || user.activo).trim().toUpperCase();
    if (![1, '1', 'TRUE', 'SI'].includes(activoValue) && user.activo !== true) {
      console.log('❌ User inactive, activo value:', activoValue);
      return res.status(403).json({
        success: false,
        msg: 'Usuario inactivo. Contacta al administrador.',
      });
    }

    // Crear token JWT
    const payload = {
      user: {
        id: user.Id_Usuario || user.id,
        nombre: (user.Nombre_Completo || user.nombre || '').trim(),
        correo: (user.Correo || user.correo || '').trim(),
        usuario: (user.Usuario || user.usuario || '').trim(),
        rol: (user.Perfil || user.rol || '').trim(),
        activo: user.Activo || user.activo,
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'prediversa_secret_2024',
      { expiresIn: '24h' }
    );

    console.log(`✅ Login successful with ${db.dialect}, token generated`);

    res.json({
      success: true,
      token,
      user: payload.user,
    });
  } catch (error) {
    console.error(`❌ Error en login (${db.dialect}):`, error);
    res.status(500).json({
      success: false,
      msg: 'Error del servidor',
    });
  }
});

// @route   GET /api/auth/users
// @desc    Obtener lista de usuarios (para admin)
// @access  Private
router.get('/users', async (req, res) => {
  try {
    console.log('🔍 Getting users from SQL Server with direct method...');
    const users = await getAllUsersDirect();

    res.json({
      success: true,
      users: users,
      count: users.length,
    });
  } catch (error) {
    console.error('❌ Error getting users:', error);
    res.status(500).json({
      success: false,
      msg: 'Error del servidor',
    });
  }
});

// @route   POST /api/auth/verify
// @desc    Verificar token
// @access  Public
router.post('/verify', (req, res) => {
  const token = req.header('x-auth-token') || req.body.token;

  if (!token) {
    return res.status(401).json({ msg: 'No token, autorización denegada' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'prediversa_secret_2024'
    );
    res.json({
      success: true,
      user: decoded.user,
    });
  } catch (error) {
    res.status(401).json({ msg: 'Token no válido' });
  }
});

module.exports = router;
