// Test de conectividad desde Frontend a Backend
const fetch = require('node-fetch');

async function testFrontendToBackend() {
  console.log('🔍 Probando conectividad Frontend -> Backend');
  
  try {
    // Probar endpoint de test
    const testResponse = await fetch('http://localhost:5001/api/test');
    const testData = await testResponse.json();
    
    console.log('✅ Endpoint de test:', testData.message);
    
    // Probar endpoint de login (para obtener token)
    const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        correo: 'admin@prediversa.com',
        contraseña: 'admin123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login exitoso para admin');
      
      // Probar endpoint de estadísticas con token
      const statsResponse = await fetch('http://localhost:5001/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('✅ Estadísticas obtenidas exitosamente:');
        console.log(`   - Total usuarios: ${statsData.totalUsuarios}`);
        console.log(`   - Usuarios activos: ${statsData.usuariosActivos}`);
        console.log(`   - Estudiantes: ${statsData.estudiantes}`);
        console.log(`   - Profesores: ${statsData.profesores}`);
      } else {
        console.log('❌ Error obteniendo estadísticas:', statsResponse.status);
      }
    } else {
      console.log('❌ Error en login:', loginResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Error de conectividad:', error.message);
  }
}

testFrontendToBackend();
