// Test Login con AWS RDS MySQL
const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Probando login con AWS RDS MySQL...\n');
    
    const response = await axios.post('http://localhost:5003/api/auth/login', {
      usuario: 'Admin',
      password: '123456789'
    });
    
    console.log('✅ Login exitoso!');
    console.log('\n📝 Respuesta:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('\n🌍 Tu aplicación ahora usa AWS RDS MySQL');
    console.log('🔑 Puedes acceder desde cualquier dispositivo con estas credenciales');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testLogin();
