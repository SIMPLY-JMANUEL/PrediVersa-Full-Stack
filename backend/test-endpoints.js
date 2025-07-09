const axios = require('axios');

// Configuración base
const BASE_URL = 'http://localhost:5001/api';

// Token de prueba (simplificado para testing)
const TEST_TOKEN = 'test-token';

// Función para hacer las pruebas
async function testEndpoints() {
  console.log('🧪 INICIANDO PRUEBAS DE ENDPOINTS');
  console.log('=====================================\n');

  try {
    // 1. Probar endpoint de prueba general
    console.log('1️⃣ Probando endpoint de prueba general...');
    const testResponse = await axios.get(`${BASE_URL}/test`);
    console.log('✅ Servidor respondiendo:', testResponse.data.message);
    console.log('');

    // 2. Probar endpoint emocional
    console.log('2️⃣ Probando endpoint de encuesta emocional...');
    try {
      const emotionalResponse = await axios.post(`${BASE_URL}/student/cuestionarios/emocional/evaluar`, {
        respuestas: {
          pregunta1: "4",
          pregunta2: "3",
          pregunta3: "2",
          pregunta4: "4",
          pregunta5: "3"
        }
      }, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Encuesta emocional:', emotionalResponse.data);
    } catch (error) {
      console.log('❌ Error en encuesta emocional:', error.response?.data || error.message);
    }
    console.log('');

    // 3. Probar endpoint de violencia
    console.log('3️⃣ Probando endpoint de encuesta de violencia...');
    try {
      const violenceResponse = await axios.post(`${BASE_URL}/student/cuestionarios/violencia/evaluar`, {
        respuestas: {
          pregunta1: "no",
          pregunta2: "si",
          pregunta3: "no",
          pregunta4: "si",
          pregunta5: "no"
        }
      }, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Encuesta violencia:', violenceResponse.data);
    } catch (error) {
      console.log('❌ Error en encuesta violencia:', error.response?.data || error.message);
    }
    console.log('');

    // 4. Probar endpoint de víctima
    console.log('4️⃣ Probando endpoint de encuesta de señales de víctima...');
    try {
      const victimResponse = await axios.post(`${BASE_URL}/student/cuestionarios/victima/evaluar`, {
        respuestas: {
          pregunta1: "no",
          pregunta2: "si",
          pregunta3: "no",
          pregunta4: "no",
          pregunta5: "si"
        }
      }, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Encuesta víctima:', victimResponse.data);
    } catch (error) {
      console.log('❌ Error en encuesta víctima:', error.response?.data || error.message);
    }
    console.log('');

    // 5. Probar endpoint de derechos
    console.log('5️⃣ Probando endpoint de encuesta de derechos...');
    try {
      const rightsResponse = await axios.post(`${BASE_URL}/student/cuestionarios/derechos/evaluar`, {
        respuestas: {
          pregunta1: "si",
          pregunta2: "no",
          pregunta3: "si"
        }
      }, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Encuesta derechos:', rightsResponse.data);
    } catch (error) {
      console.log('❌ Error en encuesta derechos:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }

  console.log('\n🎉 PRUEBAS COMPLETADAS');
}

// Ejecutar las pruebas
testEndpoints();
