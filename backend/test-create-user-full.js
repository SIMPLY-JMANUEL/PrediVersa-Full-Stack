const https = require('https');
const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const protocol = options.port === 443 ? https : http;
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testCreateUser() {
  console.log('🔐 Paso 1: Haciendo login...');
  
  // Paso 1: Login para obtener token
  const loginOptions = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const loginData = JSON.stringify({
    usuario: 'Admin',
    password: '123456789'
  });

  try {
    const loginResponse = await makeRequest(loginOptions, loginData);
    console.log(`📡 Login Status: ${loginResponse.statusCode}`);
    
    if (loginResponse.statusCode !== 200) {
      console.error('❌ Error en login:', loginResponse.body);
      return;
    }

    const loginResult = JSON.parse(loginResponse.body);
    const token = loginResult.token;
    console.log('✅ Login exitoso, token obtenido');

    // Paso 2: Crear usuario con el token
    console.log('\n👤 Paso 2: Creando usuario...');
    
    const userData = {
      nombreCompleto: 'Test Usuario Seis',
      tipoDocumento: 'Cédula de Ciudadanía',
      numeroDocumento: '66666666',
      fechaNacimiento: '1990-01-01',
      edad: 34,
      sexo: 'Masculino',
      correoElectronico: 'test6@test.com',
      telefono: '3006666666',
      direccion: 'Dirección de prueba',
      eps: 'EPS Test',
      condicionEspecial: 'Ninguna',
      descripcionCondicion: '',
      telefonoFamiliar: '3007777777',
      estadoActivo: '1',
      perfil: 'Estudiante',
      contrasena: 'test123',
      usuario: 'testuser6'
    };

    const createUserOptions = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/profile/admin/create-user',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const createUserData = JSON.stringify(userData);
    console.log('📤 Enviando datos:', userData);

    const createResponse = await makeRequest(createUserOptions, createUserData);
    console.log(`📡 Create User Status: ${createResponse.statusCode}`);
    console.log('📝 Response Body:', createResponse.body);

    if (createResponse.statusCode === 200 || createResponse.statusCode === 201) {
      console.log('✅ Usuario creado exitosamente!');
    } else {
      console.log('❌ Error al crear usuario');
      // Parsear el error para ver más detalles
      try {
        const errorResponse = JSON.parse(createResponse.body);
        console.log('🔍 Error details:', errorResponse);
      } catch (e) {
        console.log('🔍 Raw error:', createResponse.body);
      }
    }

  } catch (error) {
    console.error('💥 Error en la prueba:', error);
  }
}

testCreateUser();
