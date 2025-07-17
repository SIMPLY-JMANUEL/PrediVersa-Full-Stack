require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/User');

// ================== AUTENTICACIÓN ==================
// @route   POST /api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { usuario, correo, contraseña, password } = req.body;

    // Validar entrada - puede ser usuario o correo, y contraseña o password
    const finalPassword = contraseña || password;
    if ((!usuario && !correo) || !finalPassword) {
      return res.status(400).json({
        msg: 'Por favor, proporciona usuario/correo y contraseña'
      });
    }

    // Buscar usuario por nombre de usuario o correo en la base de datos
    const identifier = usuario || correo;
    const user = await User.findByUsernameOrEmail(identifier);
    
    if (!user) {
      return res.status(400).json({
        msg: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está inactivo
    if (user.isInactive) {
      return res.status(403).json({
        msg: 'Usuario inactivo. Contacte al administrador del sistema.',
        code: 'USER_INACTIVE'
      });
    }

    // Verificar contraseña
    const isMatch = await User.verifyPassword(finalPassword, user.contraseña);
    if (!isMatch) {
      return res.status(400).json({
        msg: 'Credenciales inválidas'
      });
    }

    // Crear token JWT
    const payload = {
      user: {
        id: user.id,
        nombre: user.nombre,
        usuario: user.usuario,
        correo: user.correo,
        rol: user.rol
      }
    };

    const jwtSecret = process.env.JWT_SECRET || 'prediversa_secret_key_2024_very_secure_token_for_authentication_do_not_share_in_production';

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('Error generando JWT:', err);
          throw err;
        }
        res.json({
          token,
          user: {
            id: user.id,
            nombre: user.nombre,
            usuario: user.usuario,
            correo: user.correo,
            rol: user.rol
          }
        });
      }
    );

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    // Validar entrada
    if (!nombre || !correo || !contraseña || !rol) {
      return res.status(400).json({
        msg: 'Por favor, proporciona todos los campos requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.correo === correo);
    if (existingUser) {
      return res.status(400).json({
        msg: 'El usuario ya existe'
      });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // Crear nuevo usuario
    const newUser = {
      id: users.length + 1,
      nombre,
      correo,
      contraseña: hashedPassword,
      rol
    };

    users.push(newUser);

    // Crear token JWT
    const payload = {
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        correo: newUser.correo,
        rol: newUser.rol
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          throw err;
        }
        res.json({
          token,
          user: {
            id: newUser.id,
            nombre: newUser.nombre,
            correo: newUser.correo,
            rol: newUser.rol
          }
        });
      }
    );

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// @route   GET /api/auth/me
// @desc    Obtener información del usuario autenticado
// @access  Private
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

// @route   GET /api/auth/ping
// @desc    Prueba de vida del backend
// @access  Public
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// ================== RECUPERACIÓN Y RESETEO DE CONTRASEÑA ==================
const resetTokens = {};

// @route   POST /api/auth/forgot-password
// @desc    Generar token de recuperación de contraseña
// @access  Public
router.post('/forgot-password', (req, res) => {
  const { correo } = req.body;
  const usuario = users.find(u => u.correo === correo);
  if (!usuario) {
    return res.status(404).json({ msg: 'Correo no encontrado' });
  }
  const token = crypto.randomBytes(20).toString('hex');
  resetTokens[token] = { correo, expires: Date.now() + 3600 * 1000 }; // 1 hora
  // En producción: enviar el token por email
  res.json({ msg: 'Token generado', token });
});

// @route   POST /api/auth/reset-password
// @desc    Restablecer contraseña usando token
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { token, nueva_contraseña } = req.body;
  const data = resetTokens[token];
  if (!data) {
    return res.status(400).json({ msg: 'Token inválido' });
  }
  if (Date.now() > data.expires) {
    delete resetTokens[token];
    return res.status(400).json({ msg: 'Token expirado' });
  }
  const usuario = users.find(u => u.correo === data.correo);
  if (!usuario) {
    return res.status(404).json({ msg: 'Usuario no encontrado' });
  }
  const salt = await bcrypt.genSalt(10);
  usuario.contraseña = await bcrypt.hash(nueva_contraseña, salt);
  delete resetTokens[token];
  res.json({ msg: 'Contraseña restablecida correctamente' });
});

// Configuración de rutas por rol
const routesByRole = {
  admin: [
    { path: '/dashboard', component: 'Dashboard', label: 'Dashboard General' },
    { path: '/admin', component: 'AdminDashboard', label: 'Administración' },
    { path: '/profile', component: 'Profile', label: 'Perfil' },
    { path: '/courses', component: 'Courses', label: 'Cursos' },
    { path: '/moderator', component: 'ModeratorDashboard', label: 'Moderación' },
    { path: '/teacher', component: 'TeacherDashboard', label: 'Profesores' },
    { path: '/parent', component: 'ParentDashboard', label: 'Padres' },
    { path: '/student', component: 'StudentDashboard', label: 'Estudiantes' }
  ],
  teacher: [
    { path: '/dashboard', component: 'Dashboard', label: 'Dashboard' },
    { path: '/teacher', component: 'TeacherDashboard', label: 'Panel Profesor' },
    { path: '/profile', component: 'Profile', label: 'Perfil' },
    { path: '/courses', component: 'Courses', label: 'Cursos' }
  ],
  student: [
    { path: '/dashboard', component: 'Dashboard', label: 'Dashboard' },
    { path: '/student', component: 'StudentDashboard', label: 'Panel Estudiante' },
    { path: '/profile', component: 'Profile', label: 'Perfil' },
    { path: '/courses', component: 'Courses', label: 'Cursos' }
  ],
  parent: [
    { path: '/dashboard', component: 'Dashboard', label: 'Dashboard' },
    { path: '/parent', component: 'ParentDashboard', label: 'Panel Padre' },
    { path: '/profile', component: 'Profile', label: 'Perfil' }
  ],
  moderator: [
    { path: '/dashboard', component: 'Dashboard', label: 'Dashboard' },
    { path: '/moderator', component: 'ModeratorDashboard', label: 'Panel Moderador' },
    { path: '/profile', component: 'Profile', label: 'Perfil' }
  ]
};

// Endpoint para obtener rutas disponibles para el usuario autenticado
router.get('/routes', auth, (req, res) => {
  try {
    const userRole = req.user.rol;
    const availableRoutes = routesByRole[userRole] || [];

    res.json({
      success: true,
      routes: availableRoutes,
      userRole: userRole,
      defaultRoute: availableRoutes.length > 0 ? availableRoutes[0].path : '/dashboard'
    });
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Middleware para verificar acceso a rutas específicas
router.get('/verify-route/:route', auth, (req, res) => {
  try {
    const userRole = req.user.rol;
    const requestedRoute = req.params.route;
    const availableRoutes = routesByRole[userRole] || [];

    const hasAccess = availableRoutes.some(route =>
      route.path === `/${requestedRoute}` || route.path === requestedRoute
    );

    res.json({
      success: true,
      hasAccess: hasAccess,
      userRole: userRole,
      requestedRoute: requestedRoute
    });
  } catch (error) {
    console.error('Error al verificar ruta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
