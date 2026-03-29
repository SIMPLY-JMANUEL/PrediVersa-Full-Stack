require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3002;

const BACKEND_URL = process.env.BACKEND_SERVICE_URL || 'http://localhost:5003';

console.log('🚀 Iniciando API Gateway PrediVersa...');
console.log(`📡 Puerto: ${PORT}`);
console.log(`🔗 Backend URL: ${BACKEND_URL}`);

// Configuración de CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.json());

// Middleware de autenticación condicional
// NOTA: Por ahora el API Gateway solo actúa como proxy sin autenticación
// La autenticación se maneja en el backend
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path}`);
  next();
});

// Proxy al backend Node.js
app.use(
  '/api',
  createProxyMiddleware({
    target: BACKEND_URL,
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
