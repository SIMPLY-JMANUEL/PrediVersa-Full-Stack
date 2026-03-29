const axios = require('axios');

async function testRemisionWithDebug() {
  try {
    console.log('🔐 Iniciando sesión...');
    const loginResponse = await axios.post('http://localhost:5003/api/auth/login', {
      usuario: 'testuser6',
      contraseña: 'test123'
    });

    if (!loginResponse.data.token) throw new Error('No se obtuvo token');
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido:', token.substring(0, 30) + '...');
    console.log('🔍 Longitud del token:', token.length);

    // Verificar decodificación del token
    const jwt = require('jsonwebtoken');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'CAMBIAR_CLAVE_JWT_SEGURA_MINIMO_32_CARACTERES');
      console.log('✅ Token válido, datos decodificados:');
      console.log('  - ID Usuario:', decoded.user.id);
      console.log('  - Usuario:', decoded.user.usuario);
      console.log('  - Rol:', decoded.user.rol);
    } catch (jwtErr) {
      console.error('❌ Error al verificar token:', jwtErr.message);
      return;
    }

    const payload = {
      numeroAlertaVinculada: 'ALR-TEST-001',
      tipoAlerta: 'Prueba Debug',
      nombreEstudiante: 'Test Student',
      edad: '15',
      gradoCargo: '10-A',
      institucionSede: 'Test School',
      descripcionBreve: 'Descripción de prueba',
      estadoActualAlerta: 'Activa',
      fechaRemision: new Date().toISOString().split('T')[0],
      motivoRemision: 'Test motivo',
      areaDestino: 'psicologia',
      entidadReceptora: 'Test entidad',
      profesionalAsignado: 'Test profesional',
      estadoRemision: 'pendiente',
      comentariosRemitente: 'Test comentarios',
      notificoAcudiente: 'si',
      fechaHoraCita: null,
      observacionesSeguimiento: 'Test observaciones',
      archivoAdjunto: null
    };

    console.log('\n📋 Enviando remisión con token...');
    const config = { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      } 
    };

    console.log('🔍 Headers enviados:', JSON.stringify(config.headers, null, 2));

    const resp = await axios.post('http://localhost:5003/api/admin/remisiones', payload, config);

    console.log('\n✅ REMISIÓN CREADA');
    console.log('ID:', resp.data.data.id);
    console.log('Mensaje:', resp.data.msg);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.response?.data?.msg || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers enviados:', error.config?.headers);
    if (error.response?.data) {
      console.error('Respuesta completa:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

testRemisionWithDebug();
