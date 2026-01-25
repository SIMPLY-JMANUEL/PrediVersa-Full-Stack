const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, acceso denegado' });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'CAMBIAR_CLAVE_JWT_SEGURA_MINIMO_32_CARACTERES'
    );
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token no válido' });
  }
};
