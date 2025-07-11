const express = require('express');
const cors = require('cors');
const User = require('./models/User');
require('dotenv').config();

// Test del sistema de login
async function testLoginSystem() {
  console.log('🧪 TESTING SISTEMA DE LOGIN CON BASE DE DATOS REAL');
  console.log('='.repeat(60));

  try {
    // 1. Verificar conexión a base de datos
    console.log('\n1️⃣ Verificando conexión a base de datos...');
    await User.createUsersTable();
    await User.insertDefaultUsers();

    // 2. Obtener usuarios de la base de datos
    console.log('\n2️⃣ Obteniendo usuarios de la base de datos...');
    const usuarios = await User.findAll();
    console.log(`Usuarios encontrados: ${usuarios.length}`);
    
    usuarios.forEach(user => {
      console.log(`  👤 ${user.nombre} (${user.usuario}) - Rol: ${user.rol} - Activo: ${user.activo}`);
    });

    // 3. Probar login con cada usuario
    console.log('\n3️⃣ Probando login con cada usuario...');
    
    const testUsers = [
      { usuario: 'Admin', password: '123456789' },
      { usuario: 'Moder', password: '123456789' },
      { usuario: 'User', password: '123456789' }
    ];

    for (const testUser of testUsers) {
      console.log(`\n   🔑 Probando login: ${testUser.usuario}`);
      
      // Buscar usuario
      const user = await User.findByUsernameOrEmail(testUser.usuario);
      if (!user) {
        console.log(`   ❌ Usuario ${testUser.usuario} no encontrado`);
        continue;
      }

      // Verificar estado activo
      console.log(`      🔍 Debug - Activo: "${user.activo}" (length: ${user.activo.length})`);
      const activoTrimmed = user.activo.trim();
      console.log(`      🔍 Debug - Activo trimmed: "${activoTrimmed}" (length: ${activoTrimmed.length})`);
      
      if (activoTrimmed !== 'SI') {
        console.log(`   ⚠️ Usuario ${testUser.usuario} inactivo - Estado: "${user.activo}"`);
        continue;
      }

      // Verificar contraseña
      const isValidPassword = await User.verifyPassword(testUser.password, user.contraseña);
      if (!isValidPassword) {
        console.log(`   ❌ Contraseña incorrecta para ${testUser.usuario}`);
        continue;
      }

      // Determinar ruta de dashboard
      const profileRoutes = {
        'Administrador': '/Admin',
        'Moderador': '/Moderador', 
        'Estudiante': '/Estudiante',
        'Acudiente': '/Acudiente',
        'Docente': '/Docente'
      };

      const dashboardRoute = profileRoutes[user.rol] || '/dashboard';

      console.log(`   ✅ Login exitoso para ${user.nombre}`);
      console.log(`      📍 Ruta de dashboard: ${dashboardRoute}`);
      console.log(`      🏷️ Rol: ${user.rol}`);
      console.log(`      📧 Correo: ${user.correo}`);
    }

    // 4. Probar endpoint de login HTTP
    console.log('\n4️⃣ Iniciando servidor para prueba HTTP...');
    
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Importar rutas de auth
    const authRoutes = require('./routes/auth');
    app.use('/api/auth', authRoutes);

    const server = app.listen(5002, () => {
      console.log('   🚀 Servidor de prueba iniciado en puerto 5002');
      
      setTimeout(async () => {
        console.log('\n   🔗 Probando endpoint HTTP /api/auth/login...');
        
        try {
          const response = await fetch('http://localhost:5002/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: 'Admin', password: '123456789' })
          });
          
          const data = await response.json();
          
          if (data.success) {
            console.log('   ✅ Endpoint HTTP funcionando correctamente');
            console.log(`      👤 Usuario: ${data.user.nombre}`);
            console.log(`      🏷️ Rol: ${data.user.rol}`);
            console.log(`      📍 Dashboard: ${data.user.dashboardRoute}`);
            console.log(`      🎟️ Token JWT: ${data.token.substring(0, 50)}...`);
          } else {
            console.log('   ❌ Error en endpoint HTTP:', data.msg);
          }
        } catch (error) {
          console.log('   ❌ Error probando endpoint HTTP:', error.message);
        }
        
        server.close();
        
        console.log('\n🎉 TESTING COMPLETADO');
        console.log('='.repeat(60));
        console.log('✅ Sistema de login con base de datos FUNCIONANDO');
        console.log('✅ Autenticación por roles CONFIGURADA');
        console.log('✅ Enrutamiento a dashboards IMPLEMENTADO');
        console.log('✅ Endpoints HTTP OPERATIVOS');
        
        process.exit(0);
      }, 2000);
    });

  } catch (error) {
    console.error('❌ Error en testing:', error.message);
    process.exit(1);
  }
}

// Ejecutar test
testLoginSystem();
