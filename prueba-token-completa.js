const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/.env' });

async function probarToken() {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║        PRUEBA DE TOKEN Y LOGIN                    ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  try {
    // 1. Hacer login
    console.log('1️⃣ Intentando login con testuser6/test123...');
    const loginResponse = await axios.post('http://localhost:5003/api/auth/login', {
      usuario: 'testuser6',
      password: 'test123'
    });

    if (loginResponse.data.success) {
      const token = loginResponse.data.token;
      console.log('✅ Login exitoso');
      console.log('📝 Token recibido:', token.substring(0, 50) + '...');

      // 2. Decodificar token SIN verificar
      const decoded = jwt.decode(token);
      console.log('\n2️⃣ Token decodificado (sin verificar):');
      console.log(JSON.stringify(decoded, null, 2));

      // 3. Verificar token con el JWT_SECRET del .env
      console.log('\n3️⃣ Verificando token con JWT_SECRET del .env...');
      console.log('JWT_SECRET usado:', process.env.JWT_SECRET || 'CAMBIAR_CLAVE_JWT_SEGURA_MINIMO_32_CARACTERES');
      
      try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'CAMBIAR_CLAVE_JWT_SEGURA_MINIMO_32_CARACTERES');
        console.log('✅ Token VÁLIDO con JWT_SECRET del .env');
        console.log(JSON.stringify(verified, null, 2));
      } catch (error) {
        console.log('❌ Token INVÁLIDO con JWT_SECRET del .env:', error.message);
      }

      // 4. Intentar usarlo en una ruta protegida (crear reporte)
      console.log('\n4️⃣ Probando token en ruta protegida (POST /api/admin/reportes)...');
      try {
        const reporteResponse = await axios.post('http://localhost:5003/api/admin/reportes', {
          fechaIngreso: new Date().toISOString().split('T')[0],
          estadoAlerta: 'Activa',
          tipoAlerta: 'Prueba Token',
          nombreCompleto: 'Usuario de Prueba Token',
          descripcionDetallada: 'Esta es una prueba del token JWT'
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ Reporte creado exitosamente con el token');
        console.log('📝 Respuesta:', JSON.stringify(reporteResponse.data, null, 2));
      } catch (error) {
        console.log('❌ Error al crear reporte:', error.response?.data?.msg || error.message);
      }

    } else {
      console.log('❌ Login falló:', loginResponse.data.msg);
    }

  } catch (error) {
    console.log('❌ Error en la prueba:', error.response?.data || error.message);
  }

  console.log('\n═══════════════════════════════════════════════════\n');
}

probarToken();
