// Test directo de la ruta de autenticación
const express = require('express');
const cors = require('cors');
const User = require('./models/User');
require('dotenv').config();

// Configurar express mínimo
const app = express();
app.use(cors());
app.use(express.json());

// Importar la ruta de auth
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Ruta de test simple
app.get('/test', (req, res) => {
  res.json({ message: 'Test server funcionando' });
});

// Inicializar servidor en puerto diferente
const PORT = 5003;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor de test ejecutándose en puerto ${PORT}`);
  
  // Verificar que la base de datos funciona
  try {
    await User.createUsersTable();
    await User.insertDefaultUsers();
    console.log('✅ Base de datos verificada');
  } catch (error) {
    console.error('❌ Error con base de datos:', error.message);
  }
});
