// Test API endpoint para estadísticas administrativas
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5001/api';

// Token de prueba para autenticación (reemplazar con uno válido)
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tYnJlIjoiQWRtaW4iLCJjb3JyZW8iOiJhZG1pbkBwcmVkaXZlcnNhLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzM3NDQxMjY4LCJleHAiOjE3Mzc0NDQ4Njh9.fakeTokenForTesting';

async function testAdminStatsAPI() {
  try {
    console.log('🔍 Probando endpoint de estadísticas administrativas...');
    
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📡 Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error HTTP: ${response.status} - ${errorText}`);
      return;
    }

    const data = await response.json();
    
    console.log('✅ Respuesta exitosa:');
    console.log(JSON.stringify(data, null, 2));
    
    // Verificar estructura esperada
    const expectedFields = [
      'totalUsuarios', 'usuariosActivos', 'usuariosInactivos', 
      'estudiantes', 'padres', 'profesores', 'moderadores', 
      'administradores', 'evaluaciones', 'alertas'
    ];
    
    const missingFields = expectedFields.filter(field => !(field in data));
    
    if (missingFields.length > 0) {
      console.warn('⚠️ Campos faltantes:', missingFields);
    } else {
      console.log('✅ Estructura de respuesta válida');
    }
    
  } catch (error) {
    console.error('❌ Error al probar API:', error.message);
  }
}

// Prueba sin token (debería fallar)
async function testUnauthorized() {
  try {
    console.log('\n🔍 Probando acceso sin autorización...');
    
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`📡 Status: ${response.status}`);
    
    if (response.status === 401) {
      console.log('✅ Correctamente rechazado sin token');
    } else {
      console.warn('⚠️ Se esperaba error 401, pero obtuvo:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar pruebas
async function runTests() {
  await testAdminStatsAPI();
  await testUnauthorized();
  console.log('\n🏁 Pruebas completadas');
}

runTests();
