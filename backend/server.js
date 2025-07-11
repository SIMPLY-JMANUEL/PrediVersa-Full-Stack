const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { testConnection, closePool } = require('./config/database');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1); // Permite que express-rate-limit funcione correctamente detrás de proxies
const PORT = process.env.PORT || 5001; // Usa variable de entorno si está definida

console.log('Iniciando backend PrediVersa...');

// Middlewares de seguridad
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://192.168.0.102:3000'],
    credentials: true
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana de tiempo
});
app.use(limiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas principales agrupadas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/student', require('./routes/student'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/moderator', require('./routes/moderator'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/parent', require('./routes/parent'));
app.use('/api/shared', require('./routes/shared'));
app.use('/api/pqr', require('./routes/pqr'));
app.use('/api/stats', require('./routes/stats'));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Servidor PrediVersa funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores global
app.use((err, req, res) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    msg: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'Ruta no encontrada' });
});

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    console.log('🔌 Conectando a SQL Server...');
    const connectionSuccess = await testConnection();

    if (connectionSuccess) {
      console.log('📋 Inicializando tablas...');
      await User.createUsersTable();
      await User.insertDefaultUsers();
      console.log('✅ Base de datos inicializada correctamente');
    } else {
      console.log('⚠️ No se pudo conectar a la base de datos, usando datos en memoria');
    }
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message);
    console.log('⚠️ Continuando con datos en memoria...');
  }
};

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🔌 Cerrando conexiones...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔌 Cerrando conexiones...');
  await closePool();
  process.exit(0);
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);

  // Inicializar base de datos
  await initializeDatabase();
});

module.exports = app;
