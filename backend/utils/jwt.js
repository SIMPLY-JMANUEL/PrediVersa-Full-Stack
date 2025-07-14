// utils/jwt.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secreto';
const { users } = require('../data');
const { executeQuery } = require('../config/database');

function jwtRequired(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Token requerido' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.user?.id || decoded.id;
    req.user = decoded.user;
    next();
  } catch {
    return res.status(401).json({ msg: 'Token inválido' });
  }
}

function roleRequired(role) {
  return async (req, res, next) => {
    try {
      // Intentar obtener usuario de la base de datos SQL primero
      if (req.user && req.user.rol) {
        // Usuario ya decodificado del token
        const userRole = req.user.rol;
        if (userRole === role || userRole === 'Administrador' && role === 'admin') {
          return next();
        }
      }
      
      // Fallback a array en memoria si no se encuentra en token
      const user = users.find(u => u.id == req.userId);
      if (!user || user.rol !== role) {
        return res.status(403).json({ msg: 'Acceso no autorizado' });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error('Error en roleRequired:', error);
      return res.status(403).json({ msg: 'Acceso no autorizado' });
    }
  };
}

module.exports = { jwtRequired, roleRequired };
