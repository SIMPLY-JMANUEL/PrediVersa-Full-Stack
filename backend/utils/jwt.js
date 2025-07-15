// utils/jwt.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secreto';

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
      // Verificar usuario decodificado del token
      if (req.user && req.user.rol) {
        const userRole = req.user.rol;
        if (userRole === role || userRole === 'Administrador' && role === 'admin') {
          return next();
        }
      }
      
      return res.status(403).json({ msg: 'Acceso no autorizado' });
    } catch (error) {
      console.error('Error en roleRequired:', error);
      return res.status(403).json({ msg: 'Acceso no autorizado' });
    }
  };
}

module.exports = { jwtRequired, roleRequired };
