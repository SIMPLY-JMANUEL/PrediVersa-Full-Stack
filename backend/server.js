require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
app.set('trust proxy', 1);
const PORT = 5003; // Forzar puerto 5003

console.log('Iniciando backend PrediVersa...');
console.log(`🚀 Puerto configurado: ${PORT}`);

// Middlewares de seguridad
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por 15 minutos
});
app.use('/api/', limiter);

// Middleware para parsing JSON simplificado
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging para debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Rutas principales agrupadas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

// Ruta de perfil
app.get('/api/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Profile endpoint',
    data: null
  });
});

// Middleware de manejo de errores JSON
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error('❌ JSON Parse Error:', error.message);
    console.error('📄 Request headers:', req.headers);
    return res.status(400).json({
      success: false,
      msg: 'Invalid JSON format',
      error: error.message,
    });
  }
  next(error);
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Servidor PrediVersa funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Ruta raíz del API
app.get('/api', (req, res) => {
  res.json({
    message: 'API PrediVersa funcionando',
    version: '1.0.0',
    endpoints: [
      '/api/auth/login',
      '/api/profile',
      '/api/admin/stats',
      '/api/test',
    ],
  });
});

// Manejo de errores global
app.use((err, req, res, _next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    msg: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'Ruta no encontrada' });
});

// Inicialización del servidor sin base de datos
function startServer() {
  try {
    console.log('🚀 Servidor ejecutándose en puerto', PORT);
    console.log(`📡 API disponible en http://localhost:${PORT}/api`);

    app.listen(PORT, () => {
      console.log(`🌟 Servidor PrediVersa corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n🔴 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🔴 Cerrando servidor...');
  process.exit(0);
});

startServer();
