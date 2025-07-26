// utils/jwt.js
const jwt = require('jsonwebtoken');

// Obtener la clave secreta desde las variables de entorno
const JWT_SECRET =
  process.env.JWT_SECRET ||
  'prediversa_jwt_secret_key_2025_ultra_secure_token_generation';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

// Función para generar un token JWT
const generateToken = payload => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
      issuer: 'prediversa-backend',
      audience: 'prediversa-users',
    });
    console.log(
      '✅ Token JWT generado para usuario:',
      payload.userId || payload.id
    );
    return token;
  } catch (error) {
    console.error('❌ Error generando token JWT:', error.message);
    throw new Error('Error generando token de autenticación');
  }
};

// Función para verificar un token JWT
const verifyToken = token => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'prediversa-backend',
      audience: 'prediversa-users',
    });
    console.log(
      '✅ Token JWT verificado para usuario:',
      decoded.userId || decoded.id
    );
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('❌ Token JWT expirado');
      throw new Error('Token expirado');
    } else if (error.name === 'JsonWebTokenError') {
      console.error('❌ Token JWT inválido');
      throw new Error('Token inválido');
    } else {
      console.error('❌ Error verificando token JWT:', error.message);
      throw new Error('Error verificando token');
    }
  }
};

// Función para decodificar un token sin verificar (para debug)
const decodeToken = token => {
  try {
    const decoded = jwt.decode(token, { complete: true });
    return decoded;
  } catch (error) {
    console.error('❌ Error decodificando token:', error.message);
    return null;
  }
};

// Función para extraer token del header Authorization
const extractTokenFromHeader = authHeader => {
  if (!authHeader) {
    return null;
  }

  // Verificar formato "Bearer <token>"
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Si no tiene el prefijo Bearer, asumir que es solo el token
  return authHeader;
};

// Función para verificar si un token está próximo a expirar
const isTokenExpiringSoon = (token, minutesThreshold = 30) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.payload.exp) {
      return false;
    }

    const expirationTime = decoded.payload.exp * 1000; // Convertir a millisegundos
    const currentTime = Date.now();
    const timeToExpiry = expirationTime - currentTime;
    const thresholdMs = minutesThreshold * 60 * 1000;

    return timeToExpiry <= thresholdMs;
  } catch (error) {
    console.error('❌ Error verificando expiración del token:', error.message);
    return true; // Si hay error, asumir que está expirando
  }
};

// Función para refrescar un token (generar uno nuevo con los mismos datos)
const refreshToken = oldToken => {
  try {
    const decoded = verifyToken(oldToken);

    // Crear nuevo payload sin los campos de tiempo
    const newPayload = {
      userId: decoded.userId,
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      nombre: decoded.nombre,
    };

    return generateToken(newPayload);
  } catch (error) {
    console.error('❌ Error refrescando token:', error.message);
    throw new Error('No se puede refrescar el token');
  }
};

// Función para obtener información del usuario desde el token
const getUserFromToken = token => {
  try {
    const decoded = verifyToken(token);
    return {
      userId: decoded.userId,
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      nombre: decoded.nombre,
    };
  } catch (error) {
    console.error('❌ Error obteniendo usuario del token:', error.message);
    return null;
  }
};

// Middleware para requerir JWT
const jwtRequired = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        error: 'Token de acceso requerido',
        code: 'MISSING_TOKEN',
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: error.message,
      code: 'INVALID_TOKEN',
    });
  }
};

// Middleware para requerir un rol específico
const roleRequired = requiredRole => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuario no autenticado',
        code: 'NOT_AUTHENTICATED',
      });
    }

    const userRole = (req.user.rol || req.user.role || '').trim().toLowerCase();
    const required = requiredRole.toLowerCase();

    if (userRole !== required) {
      return res.status(403).json({
        error: `Acceso denegado. Se requiere rol: ${requiredRole}`,
        code: 'INSUFFICIENT_PERMISSIONS',
        userRole: userRole,
        requiredRole: required,
      });
    }

    next();
  };
};

// Middleware para requerir múltiples roles
const rolesRequired = allowedRoles => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuario no autenticado',
        code: 'NOT_AUTHENTICATED',
      });
    }

    const userRole = (req.user.rol || req.user.role || '').trim().toLowerCase();
    const allowedLower = allowedRoles.map(role => role.toLowerCase());

    if (!allowedLower.includes(userRole)) {
      return res.status(403).json({
        error: `Acceso denegado. Roles permitidos: ${allowedRoles.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSIONS',
        userRole: userRole,
        allowedRoles: allowedLower,
      });
    }

    next();
  };
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  extractTokenFromHeader,
  isTokenExpiringSoon,
  refreshToken,
  getUserFromToken,
  jwtRequired,
  roleRequired,
  rolesRequired,
  JWT_SECRET,
  JWT_EXPIRY,
};
