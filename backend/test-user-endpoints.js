// Script de prueba para los nuevos endpoints de usuario
const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (err) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testUserEndpoints() {
  try {
    console.log('🧪 Probando endpoints de usuario...\n');

    // 1. Primero hacer login para obtener token
    console.log('1. Realizando login...');
    const loginOptions = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const loginResult = await makeRequest(loginOptions, {
      correo: 'Admin',
      password: '123456789'
    });

    if (loginResult.status !== 200) {
      throw new Error(`Login failed: ${loginResult.status}`);
    }

    console.log('✅ Login exitoso');
    const token = loginResult.data.token;

    // 2. Probar endpoint de datos actuales del usuario
    console.log('\n2. Probando endpoint de datos actuales del admin...');
    const currentUserOptions = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/profile/admin/current-user',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const currentUserResult = await makeRequest(currentUserOptions);
    if (currentUserResult.status === 200) {
      console.log('✅ Datos del usuario actual:', JSON.stringify(currentUserResult.data, null, 2));
    } else {
      console.log('❌ Error obteniendo datos actuales:', currentUserResult.status, currentUserResult.data);
    }

    // 3. Probar endpoint de búsqueda de usuario
    console.log('\n3. Probando endpoint de búsqueda de usuario...');
    const searchOptions = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/profile/admin/search-user/987654321',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const searchResult = await makeRequest(searchOptions);
    if (searchResult.status === 200) {
      console.log('✅ Usuario encontrado:', JSON.stringify(searchResult.data, null, 2));
    } else {
      console.log('❌ Error en búsqueda:', searchResult.status, searchResult.data);
    }

    console.log('\n🎉 Pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
testUserEndpoints();
