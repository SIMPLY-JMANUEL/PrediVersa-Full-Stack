const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { getUserByCredentials, getAllUsers } = require('../models/UserSQL');

// @route   POST /api/auth/login
// @desc    Autenticar usuario y obtener token con SQL Server
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log('🔍 Login route hit - SQL Server Integration');
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

    // Buscar usuario en SQL Server
    console.log('🔍 Searching user in SQL Server...');
    const user = await getUserByCredentials(identifier, pwd);

    if (!user) {
      console.log('❌ Invalid credentials');
      return res.status(401).json({
        success: false,
        msg: 'Credenciales inválidas',
      });
    }

    console.log('🔍 User found in SQL Server:', {
      id: user.id,
      usuario: user.usuario,
      correo: user.correo,
      rol: user.rol,
      activo: user.activo,
    });

    // Verificar que el usuario esté activo
    if (user.activo !== 'SI' && user.activo !== true && user.activo !== 1) {
      console.log('❌ User inactive');
      return res.status(403).json({
        success: false,
        msg: 'Usuario inactivo. Contacta al administrador.',
      });
    }

    // Crear token JWT
    const payload = {
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        usuario: user.usuario,
        rol: user.rol,
        activo: user.activo,
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'prediversa_secret_2024',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful with SQL Server, token generated');

    res.json({
      success: true,
      token,
      user: payload.user,
    });
  } catch (error) {
    console.error('❌ Error en login SQL Server:', error);
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
    console.log('🔍 Getting users from SQL Server...');
    const users = await getAllUsers();

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
