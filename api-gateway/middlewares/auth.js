const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (req.path === '/' || req.path.startsWith('/public')) {
    return next();
  }
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};
