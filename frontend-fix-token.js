/**
 * Script para limpiar y renovar el token JWT del frontend
 * Ejecutar: node frontend-fix-token.js
 */
const axios = require('axios');

const API_URL = 'http://localhost:5003';
const TEST_USER = 'testuser6';
const TEST_PASS = 'test123';

async function fixToken() {
  try {
    console.log('🔄 Limpiando tokens antiguos...');
    console.log('📝 Iniciando sesión para obtener nuevo token...');
    
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      usuario: TEST_USER,
      password: TEST_PASS
    });

    if (response.data.success && response.data.token) {
      const token = response.data.token;
      console.log(`\n✅ Token generado exitosamente`);
      console.log(`📋 Usuario: ${response.data.user.usuario}`);
      console.log(`👤 Perfil: ${response.data.user.rol}`);
      console.log(`\n🔐 Token (guarda en localStorage como 'token'):`);
      console.log(`${token}\n`);
      
      console.log('📌 Instrucciones para el frontend:');
      console.log('1. Abre la consola del navegador (F12)');
      console.log('2. Ve a Application > Local Storage > http://localhost:3000');
      console.log('3. Elimina la clave "token" si existe');
      console.log('4. Copia y pega el token anterior en la consola:');
      console.log(`localStorage.setItem('token', '${token}');`);
      console.log('5. Recarga la página (F5)');
      console.log('\n✅ El token debe estar válido ahora');
      
    } else {
      console.error('❌ Error: No se generó token');
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

fixToken();
