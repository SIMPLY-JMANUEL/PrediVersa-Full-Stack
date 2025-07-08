const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();
const auth = require('../middlewares/auth');

// Base de datos simulada de usuarios (en producción usar MongoDB)
const users = [
  {
    id: 1,
    nombre: 'Juliana Fajardo',
    correo: 'admin@prediversa.com',
    contraseña: '$2a$10$yQrYmsxA/iHExDbizYKGkOIsRvTBy4ph6YHNgS9BsflI.nR0w6naK', // admin123
    rol: 'admin'
  },
  {
    id: 2,
    nombre: 'Andrey Luna',
    correo: 'profesor@prediversa.com',
    contraseña: '$2a$10$yQrYmsxA/iHExDbizYKGkOIsRvTBy4ph6YHNgS9BsflI.nR0w6naK', // admin123
    rol: 'teacher'
  },
  {
    id: 3,
    nombre: 'Carlos Rodríguez',
    correo: 'estudiante@prediversa.com',
    contraseña: '$2a$10$yQrYmsxA/iHExDbizYKGkOIsRvTBy4ph6YHNgS9BsflI.nR0w6naK', // admin123
    rol: 'student'
  },
  {
    id: 4,
    nombre: 'Harold Salcedo',
    correo: 'padre@prediversa.com',
    contraseña: '$2a$10$yQrYmsxA/iHExDbizYKGkOIsRvTBy4ph6YHNgS9BsflI.nR0w6naK', // admin123
    rol: 'parent'
  },
  {
    id: 5,
    nombre: 'Moderador',
    correo: 'moderador@prediversa.com',
    contraseña: '$2a$10$yQrYmsxA/iHExDbizYKGkOIsRvTBy4ph6YHNgS9BsflI.nR0w6naK', // admin123
    rol: 'moderator'
  }
];

// ================== AUTENTICACIÓN ==================
// @route   POST /api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Validar entrada
    if (!correo || !contraseña) {
      return res.status(400).json({ 
        msg: 'Por favor, proporciona correo y contraseña' 
      });
    }

    // Buscar usuario
    const user = users.find(u => u.correo === correo);
    if (!user) {
      return res.status(400).json({ 
        msg: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
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
        correo: user.correo,
        rol: user.rol
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
            id: user.id,
            nombre: user.nombre,
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

module.exports = router;
