require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authMiddleware = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT || 3002;

console.log('🚀 Iniciando API Gateway PrediVersa...');
console.log(`📡 Puerto: ${PORT}`);
console.log(
  `🔗 Backend URL: ${
    process.env.BACKEND_SERVICE_URL || 'http://localhost:5002'
  }`
);

// Configuración de CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.json());

// Rutas excluidas de autenticación
const excludedPaths = (
  process.env.AUTH_EXCLUDED_PATHS ||
  '/health,/status,/api/auth/login,/api/auth/register'
).split(',');

// Middleware de autenticación condicional
app.use((req, res, next) => {
  console.log(`🔍 Ruta solicitada: ${req.path}`);
  const isExcluded = excludedPaths.some(path => req.path.startsWith(path));
  console.log(`🔒 ¿Ruta excluida de auth?: ${isExcluded}`);
  if (isExcluded) {
    console.log(`✅ Permitiendo acceso sin auth a: ${req.path}`);
    return next();
  }
  console.log(`🔐 Aplicando middleware de auth a: ${req.path}`);
  return authMiddleware(req, res, next);
});

// Proxy al backend Node.js
app.use(
  '/api',
  createProxyMiddleware({
    target: process.env.BACKEND_SERVICE_URL || 'http://localhost:5002',
    changeOrigin: true,
    timeout: parseInt(process.env.PROXY_TIMEOUT) || 30000,
    onError: (err, req, res) => {
      console.error('❌ Error en proxy:', err.message);
      res.status(502).json({ error: 'Error de conexión con el backend' });
    },
  })
);

// Proxy a microservicio Python (si existe)
app.use(
  '/api/python',
  createProxyMiddleware({
    target: process.env.PYTHON_SERVICE_URL || 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: { '^/api/python': '/api' },
    timeout: parseInt(process.env.PROXY_TIMEOUT) || 30000,
    onError: (err, req, res) => {
      console.error('❌ Error en proxy Python:', err.message);
      res.status(502).json({ error: 'Servicio Python no disponible' });
    },
  })
);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      backend: process.env.BACKEND_SERVICE_URL || 'http://localhost:5002',
      python: process.env.PYTHON_SERVICE_URL || 'http://localhost:5000',
    },
  });
});

// Status endpoint
app.get('/status', (req, res) => {
  res.json({ message: 'API Gateway funcionando correctamente' });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'PrediVersa API Gateway',
    version: '1.0.0',
    endpoints: ['/api', '/health', '/status'],
  });
});

app.listen(PORT, () => {
  console.log(`✅ API Gateway ejecutándose en puerto ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
