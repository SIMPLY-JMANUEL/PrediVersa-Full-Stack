// Test de login y estadísticas desde el frontend
const fs = require('fs');
const path = require('path');

// Simular fetch para Node.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testLogin() {
  try {
    console.log('🔐 Probando login...');
    
    const loginData = {
      usuario: 'Admin',
      contraseña: '123456789'
    };
    
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    console.log(`📡 Status login: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login exitoso');
      console.log('Token obtenido:', data.token ? 'Sí' : 'No');
      return data.token;
    } else {
      const errorText = await response.text();
      console.error('❌ Error en login:', errorText);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error de conexión login:', error.message);
    return null;
  }
}

async function testStats(token) {
  try {
    console.log('\n📊 Probando estadísticas...');
    
    const response = await fetch('http://localhost:5001/api/admin/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    
    console.log(`📡 Status stats: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Estadísticas obtenidas exitosamente:');
      console.log('   - Total usuarios:', data.totalUsuarios);
      console.log('   - Usuarios activos:', data.usuariosActivos);
      console.log('   - Estudiantes:', data.estudiantes);
      console.log('   - Profesores:', data.profesores);
      console.log('   - Moderadores:', data.moderadores);
      console.log('   - Administradores:', data.administradores);
      return data;
    } else {
      const errorText = await response.text();
      console.error('❌ Error en stats:', errorText);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error de conexión stats:', error.message);
    return null;
  }
}

async function main() {
  console.log('🧪 Test de Login y Estadísticas - Simulando Frontend');
  console.log('====================================================\n');
  
  // Paso 1: Login
  const token = await testLogin();
  
  if (token) {
    // Paso 2: Obtener estadísticas
    const stats = await testStats(token);
    
    if (stats) {
      console.log('\n🎉 ¡Test completado exitosamente!');
      console.log('   El problema NO está en el backend');
      console.log('   Revisar la implementación en el frontend');
    } else {
      console.log('\n❌ Error obteniendo estadísticas');
      console.log('   Problema en el endpoint de estadísticas');
    }
  } else {
    console.log('\n❌ Error en el login');
    console.log('   Problema en el endpoint de autenticación');
  }
}

main().catch(console.error);
