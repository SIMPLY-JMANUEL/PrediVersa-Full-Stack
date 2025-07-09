const axios = require('axios');

// Configuración base
const BASE_URL = 'http://localhost:5001/api';

async function testBasicEndpoints() {
  console.log('🧪 PRUEBA BÁSICA DE ENDPOINTS (SIN AUTENTICACIÓN)');
  console.log('===================================================\n');

  try {
    // 1. Probar servidor
    console.log('1️⃣ Probando conexión al servidor...');
    const testResponse = await axios.get(`${BASE_URL}/test`);
    console.log('✅ Servidor:', testResponse.data.message);
    console.log('');

    // 2. Probar endpoint emocional (sin auth)
    console.log('2️⃣ Probando endpoint emocional...');
    const emotionalData = {
      respuestas: {
        pregunta1: "4",
        pregunta2: "3",
        pregunta3: "2",
        pregunta4: "4",
        pregunta5: "3"
      }
    };
    
    const emotionalResponse = await axios.post(`${BASE_URL}/student/test/emocional`, emotionalData);
    console.log('✅ Respuesta emocional:');
    console.log('   - Promedio:', emotionalResponse.data.data.promedio);
    console.log('   - Nivel:', emotionalResponse.data.data.nivelBienestar);
    console.log('   - Mensaje:', emotionalResponse.data.data.mensaje);
    console.log('');

    // 3. Probar endpoint violencia (sin auth)
    console.log('3️⃣ Probando endpoint violencia...');
    const violenceData = {
      respuestas: {
        pregunta1: "no",
        pregunta2: "si",
        pregunta3: "no",
        pregunta4: "si",
        pregunta5: "no"
      }
    };
    
    const violenceResponse = await axios.post(`${BASE_URL}/student/test/violencia`, violenceData);
    console.log('✅ Respuesta violencia:');
    console.log('   - Situaciones detectadas:', violenceResponse.data.data.situacionesDetectadas);
    console.log('   - Nivel de riesgo:', violenceResponse.data.data.nivelRiesgo);
    console.log('   - Mensaje:', violenceResponse.data.data.mensaje);
    console.log('');

    console.log('🎉 ¡TODAS LAS PRUEBAS EXITOSAS!');
    console.log('✅ Los endpoints están funcionando correctamente');

  } catch (error) {
    console.error('❌ Error en las pruebas:');
    if (error.response) {
      console.error('   - Status:', error.response.status);
      console.error('   - Data:', error.response.data);
    } else {
      console.error('   - Message:', error.message);
    }
  }
}

// Ejecutar las pruebas
testBasicEndpoints();
