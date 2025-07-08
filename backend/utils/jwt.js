// utils/jwt.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secreto';
const { users } = require('../data');

function jwtRequired(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Token requerido' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ msg: 'Token inválido' });
  }
}

function roleRequired(role) {
  return (req, res, next) => {
    const user = users.find(u => u.id == req.userId);
    if (!user || user.rol !== role) {
      return res.status(403).json({ msg: 'Acceso no autorizado' });
    }
    req.user = user;
    next();
  };
}

module.exports = { jwtRequired, roleRequired };
