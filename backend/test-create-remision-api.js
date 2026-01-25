const axios = require('axios');

async function testCreateRemision() {
  try {
    console.log('🔐 Iniciando sesión...');
    const loginResponse = await axios.post('http://localhost:5003/api/auth/login', {
      usuario: 'testuser6',
      contraseña: 'test123'
    });

    if (!loginResponse.data.token) throw new Error('No se obtuvo token de autenticación');
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso, token obtenido\n');

    const payload = {
      numeroAlertaVinculada: 'ALR-000123',
      tipoAlerta: 'Violencia psicológica',
      nombreEstudiante: 'María Elena Rodríguez García',
      edad: '14',
      gradoCargo: '9° Grado',
      institucionSede: 'Colegio San José',
      descripcionBreve: 'Situación de acoso escolar reportada por compañeros de clase...',
      estadoActualAlerta: 'Activa',
      fechaRemision: new Date().toISOString().split('T')[0],
      motivoRemision: 'Atención psicológica prioritaria',
      areaDestino: 'psicologia',
      entidadReceptora: 'Unidad de atención escolar',
      profesionalAsignado: 'Psicóloga Claudia Rojas',
      estadoRemision: 'pendiente',
      comentariosRemitente: 'Se solicita cita en las próximas 48 horas',
      notificoAcudiente: 'si',
      fechaHoraCita: null,
      observacionesSeguimiento: 'Primera remisión de prueba automática',
      archivoAdjunto: null
    };

    console.log('📋 Creando remisión de prueba...');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const resp = await axios.post('http://localhost:5003/api/admin/remisiones', payload, config);

    console.log('\n✅ REMISIÓN CREADA');
    console.log('────────────────────────────────────────');
    console.log('ID:', resp.data.data.id);
    console.log('Mensaje:', resp.data.msg);
    console.log('────────────────────────────────────────');

    console.log('\n📊 Consultando lista de remisiones...');
    const list = await axios.get('http://localhost:5003/api/admin/remisiones?limit=5', config);
    console.log(`Total recibidas: ${list.data.data.length}`);
    if (list.data.data.length) {
      const r = list.data.data[0];
      console.log('Última remisión:');
      console.log('  ID:', r.Id_Remision);
      console.log('  Área destino:', r.Area_Destino);
      console.log('  Estado:', r.Estado_Remision);
      console.log('  Fecha remisión:', r.Fecha_Remision);
    }
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.response?.data?.msg || error.message);
    if (error.response?.data) console.error('Detalles:', JSON.stringify(error.response.data, null, 2));
    process.exit(1);
  }
}

testCreateRemision();
