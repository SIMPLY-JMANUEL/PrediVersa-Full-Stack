# 🔒 RECOMENDACIONES DE SEGURIDAD Y ARQUITECTURA

## 🎯 OBJETIVO
Proporcionar recomendaciones específicas de seguridad para fortalecer la arquitectura de PrediVersa, enfocándose en la protección de datos sensibles, prevención de vulnerabilidades y mejores prácticas de desarrollo seguro.

---

## 🚨 VULNERABILIDADES CRÍTICAS IDENTIFICADAS

### 1. **EXPOSICIÓN DE DATOS SENSIBLES EN FRONTEND**
**Problema:** Datos personales almacenados en localStorage
```javascript
// ❌ VULNERABLE - Datos accesibles desde DevTools
localStorage.setItem('documento', '123456789');
localStorage.setItem('fechaNacimiento', '1990-01-01');
```

**Solución:**
```javascript
// ✅ SEGURO - Solo tokens y datos no sensibles
localStorage.setItem('token', 'jwt_token_here');
localStorage.setItem('sessionId', 'session_id_here');

// Datos sensibles desde API protegida
const userData = await fetch('/api/user/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

### 2. **CÁLCULOS CRÍTICOS EN FRONTEND**
**Problema:** Evaluaciones psicológicas manipulables
```javascript
// ❌ VULNERABLE - Cliente puede alterar la puntuación
const finalScore = positiveScore - negativeScore;
if (finalScore >= 5) {
  message = '¡Excelente estado emocional!';
}
```

**Solución:**
```javascript
// ✅ SEGURO - Cálculo en backend con validación
const response = await fetch('/api/evaluations/emotional', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ respuestas: encryptedAnswers })
});
```

---

### 3. **REPORTES SIN PERSISTENCIA**
**Problema:** Reportes de violencia solo en memoria
```javascript
// ❌ PELIGROSO - Reporte se pierde
console.log('Reporte enviado:', reportData);
showNotification('Reporte enviado');
```

**Solución:**
```javascript
// ✅ SEGURO - Persistencia con confirmación
const reportResponse = await fetch('/api/reports/incident', {
  method: 'POST',
  body: JSON.stringify(encryptedReportData)
});
const { reportNumber, assignedTo } = await reportResponse.json();
```

---

## 🛡️ RECOMENDACIONES DE SEGURIDAD POR CATEGORÍA

### **A. AUTENTICACIÓN Y AUTORIZACIÓN**

#### 1. **Implementar JWT con Refresh Tokens**
```javascript
// backend/utils/jwt.js
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, rol: user.rol },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' } // Token corto
  );
  
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // Token largo
  );
  
  return { accessToken, refreshToken };
};
```

#### 2. **Middleware de Verificación Robusta**
```javascript
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ msg: 'Token requerido' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    // Verificar que el usuario aún existe
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: 'Usuario no válido' });
    }
    
    // Verificar que el token no está en blacklist
    const isBlacklisted = await checkTokenBlacklist(token);
    if (isBlacklisted) {
      return res.status(401).json({ msg: 'Token revocado' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};
```

---

### **B. PROTECCIÓN DE DATOS**

#### 1. **Encriptación de Datos Sensibles**
```javascript
// services/encryptionService.js
const crypto = require('crypto');

class EncryptionService {
  static encrypt(text) {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key);
    cipher.setAAD(Buffer.from('prediversa', 'utf8'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }
  
  static decrypt(encryptedData) {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    
    const decipher = crypto.createDecipher(algorithm, key);
    decipher.setAAD(Buffer.from('prediversa', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

#### 2. **Hashing de Datos Sensibles**
```javascript
// Para documentos y datos identificables
const hashSensitiveData = (data) => {
  const salt = process.env.DATA_SALT;
  return crypto.createHash('sha256').update(data + salt).digest('hex');
};

// Ejemplo de uso
const hashedDocument = hashSensitiveData(userDocument);
// Guardar hash en lugar del documento real
```

---

### **C. VALIDACIÓN Y SANITIZACIÓN**

#### 1. **Validación de Entrada Robusta**
```javascript
const { body, validationResult } = require('express-validator');

const validateQuestionnaireInput = [
  body('respuestas')
    .isObject()
    .withMessage('Respuestas debe ser un objeto'),
  
  body('respuestas.*')
    .isIn(['1', '2', '3', '4', '5', 'si', 'no'])
    .withMessage('Valor de respuesta no válido'),
  
  body('tipoEvaluacion')
    .isIn(['emocional', 'violencia', 'victima', 'derechos'])
    .withMessage('Tipo de evaluación no válido'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];
```

#### 2. **Sanitización XSS**
```javascript
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const sanitizeInput = (html) => {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  
  return purify.sanitize(html, {
    ALLOWED_TAGS: [], // No permitir HTML
    ALLOWED_ATTR: []
  });
};

// Middleware de sanitización
const sanitizeReportData = (req, res, next) => {
  if (req.body.datosIncidente) {
    req.body.datosIncidente.descripcion = sanitizeInput(req.body.datosIncidente.descripcion);
    req.body.datosIncidente.contexto = sanitizeInput(req.body.datosIncidente.contexto);
  }
  next();
};
```

---

### **D. RATE LIMITING Y PREVENCIÓN DE ABUSOS**

#### 1. **Rate Limiting Granular**
```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('redis');

const redisClient = Redis.createClient();

// Rate limiting para evaluaciones
const evaluationLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'eval:'
  }),
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 3, // máximo 3 evaluaciones por día
  message: {
    error: 'Límite de evaluaciones excedido',
    retryAfter: '24 horas'
  },
  keyGenerator: (req) => `${req.ip}:${req.user.id}`
});

// Rate limiting para reportes
const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 reportes por hora
  keyGenerator: (req) => `${req.ip}:${req.user.id}`
});
```

#### 2. **Detección de Patrones Sospechosos**
```javascript
const detectSuspiciousActivity = async (req, res, next) => {
  const userId = req.user.id;
  const activity = req.route.path;
  
  // Verificar intentos rápidos consecutivos
  const recentAttempts = await getRecentAttempts(userId, activity);
  
  if (recentAttempts.length > 10) { // 10 intentos en poco tiempo
    await flagSuspiciousUser(userId);
    return res.status(429).json({
      error: 'Actividad sospechosa detectada'
    });
  }
  
  await logActivity(userId, activity, req.ip);
  next();
};
```

---

### **E. LOGGING Y AUDITORÍA**

#### 1. **Sistema de Auditoría Completo**
```javascript
// models/AuditLog.js
const AuditLog = {
  async log(action, userId, details = {}, ipAddress = null) {
    await AuditLogModel.create({
      action,
      user_id: userId,
      details: JSON.stringify(details),
      ip_address: ipAddress,
      timestamp: new Date(),
      user_agent: details.userAgent
    });
  }
};

// Middleware de auditoría
const auditMiddleware = (action) => {
  return (req, res, next) => {
    res.on('finish', () => {
      AuditLog.log(action, req.user?.id, {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        userAgent: req.get('User-Agent')
      }, req.ip);
    });
    next();
  };
};
```

#### 2. **Logging de Seguridad**
```javascript
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'prediversa-security' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/security.log',
      level: 'warn' 
    }),
    new winston.transports.File({ 
      filename: 'logs/security-error.log', 
      level: 'error' 
    })
  ]
});

// Uso
securityLogger.warn('Intento de acceso no autorizado', {
  userId: req.user?.id,
  ip: req.ip,
  resource: req.originalUrl
});
```

---

### **F. PROTECCIÓN DE APIS**

#### 1. **Headers de Seguridad**
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.prediversa.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

#### 2. **CORS Configurado**
```javascript
const cors = require('cors');

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://prediversa.com',
      'https://app.prediversa.com',
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

---

## 🔧 CONFIGURACIÓN DE ENTORNO SEGURO

### **Variables de Entorno Requeridas**
```bash
# .env
NODE_ENV=production
PORT=3001

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=prediversa_prod
DB_USER=prediversa_user
DB_PASS=super_secure_password

# JWT
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_here
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_here

# Encriptación
ENCRYPTION_KEY=32_byte_hex_key_for_aes_256_encryption
DATA_SALT=random_salt_for_hashing_sensitive_data

# Rate Limiting
REDIS_URL=redis://localhost:6379

# Email (para notificaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@prediversa.com
SMTP_PASS=email_app_password

# Monitoring
SENTRY_DSN=your_sentry_dsn_here
LOG_LEVEL=info
```

### **Configuración de Base de Datos Segura**
```sql
-- Crear usuario con permisos limitados
CREATE USER 'prediversa_app'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE ON prediversa.* TO 'prediversa_app'@'localhost';
GRANT DELETE ON prediversa.audit_logs TO 'prediversa_app'@'localhost';

-- Habilitar SSL
REQUIRE SSL;

-- Configurar backup automático
SET GLOBAL log_bin = ON;
```

---

## 📊 MONITOREO Y ALERTAS

### **1. Métricas de Seguridad**
```javascript
// metrics/securityMetrics.js
const prometheus = require('prom-client');

const securityMetrics = {
  failedLogins: new prometheus.Counter({
    name: 'failed_login_attempts_total',
    help: 'Total number of failed login attempts',
    labelNames: ['ip', 'reason']
  }),
  
  suspiciousActivity: new prometheus.Counter({
    name: 'suspicious_activity_total',
    help: 'Total number of suspicious activities detected',
    labelNames: ['type', 'severity']
  }),
  
  dataAccess: new prometheus.Histogram({
    name: 'sensitive_data_access_duration',
    help: 'Time taken to access sensitive data',
    labelNames: ['endpoint', 'user_role']
  })
};
```

### **2. Alertas Automáticas**
```javascript
const sendSecurityAlert = async (event, details) => {
  const criticalEvents = [
    'multiple_failed_logins',
    'data_breach_attempt',
    'privilege_escalation',
    'suspicious_report_pattern'
  ];
  
  if (criticalEvents.includes(event)) {
    await sendEmail({
      to: 'security@prediversa.com',
      subject: `🚨 Alerta de Seguridad: ${event}`,
      body: `
        Evento: ${event}
        Detalles: ${JSON.stringify(details, null, 2)}
        Timestamp: ${new Date().toISOString()}
        Requiere: Revisión inmediata
      `
    });
  }
};
```

---

## 🎯 CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Autenticación y Autorización (Semana 1)**
- [ ] Implementar JWT con refresh tokens
- [ ] Crear middleware de verificación robusta
- [ ] Implementar sistema de blacklist de tokens
- [ ] Configurar rate limiting para login

### **Fase 2: Protección de Datos (Semana 2)**
- [ ] Implementar encriptación de datos sensibles
- [ ] Crear endpoints seguros para datos personales
- [ ] Eliminar datos sensibles de localStorage
- [ ] Implementar hashing para documentos

### **Fase 3: Validación y Sanitización (Semana 3)**
- [ ] Implementar validación robusta en todos los endpoints
- [ ] Agregar sanitización XSS
- [ ] Crear validadores personalizados
- [ ] Implementar esquemas de validación con Joi/Yup

### **Fase 4: Auditoría y Monitoreo (Semana 4)**
- [ ] Implementar sistema de logs de seguridad
- [ ] Crear métricas de seguridad
- [ ] Configurar alertas automáticas
- [ ] Implementar dashboard de seguridad

### **Fase 5: Testing y Despliegue (Semana 5)**
- [ ] Realizar pruebas de penetración
- [ ] Testing de carga y estrés
- [ ] Validar configuración de producción
- [ ] Despliegue gradual con monitoreo

---

## 🚀 MEJORES PRÁCTICAS ADICIONALES

### **1. Principio de Menor Privilegio**
- Usuarios solo acceden a sus propios datos
- Roles granulares (student, teacher, parent, moderator, admin)
- Permisos específicos por endpoint

### **2. Defensa en Profundidad**
- Múltiples capas de validación
- Encriptación en tránsito y en reposo
- Monitoreo continuo de anomalías

### **3. Privacidad por Diseño**
- Minimización de datos recolectados
- Consentimiento explícito para datos sensibles
- Derecho al olvido implementado

### **4. Respuesta a Incidentes**
- Plan de respuesta documentado
- Procedimientos de notificación
- Backup y recuperación automatizados

---

*Este documento debe ser revisado y actualizado trimestralmente.*
*Última actualización: $(Get-Date)*
*Responsable: Equipo de Seguridad PrediVersa*
