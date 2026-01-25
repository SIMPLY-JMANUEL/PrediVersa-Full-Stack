const axios = require('axios');

async function testCreateReporte() {
  try {
    // Primero hacer login para obtener token
    console.log('🔐 Iniciando sesión...');
    const loginResponse = await axios.post('http://localhost:5003/api/auth/login', {
      usuario: 'testuser6',
      contraseña: 'test123'
    });

    if (!loginResponse.data.token) {
      throw new Error('No se obtuvo token de autenticación');
    }

    const token = loginResponse.data.token;
    console.log('✅ Login exitoso, token obtenido\n');

    // Preparar datos del reporte
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const reporteData = {
      numeroIncidente: `INC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${random}`,
      fechaIngreso: new Date().toISOString().split('T')[0],
      estadoAlerta: 'Abierto',
      tipoAlerta: 'Bullying',
      nivelGravedad: 'Alto',
      atencionInmediata: 'Sí',
      institucionSede: 'Colegio PrediVersa - Sede Principal',
      nombreEstudiante: 'Juan Carlos Pérez',
      gradoGrupo: '10-A',
      lugarSuceso: 'Patio de recreo',
      fechaHoraSuceso: new Date().toISOString(),
      nombreCompleto: 'María González',
      tipoDocumento: 'CC',
      numeroDocumento: '1234567890',
      fechaNacimiento: '1985-03-15',
      edad: 39,
      sexoGenero: 'Femenino',
      estadoCivil: 'Casado',
      correoElectronico: 'maria.gonzalez@example.com',
      telefonoContacto: '3001234567',
      direccionResidencia: 'Calle 123 #45-67, Bogotá',
      responsableAsignado: 'Coordinador de Convivencia',
      descripcionDetallada: 'Se reporta situación de acoso escolar hacia estudiante Juan Carlos Pérez. El incidente ocurrió durante el descanso en el patio de recreo, donde un grupo de estudiantes lo agredieron verbalmente y lo amenazaron. Se requiere intervención inmediata.',
      medidasTomadas: 'Se citó a los padres de familia. Se activó el protocolo de convivencia escolar.',
      contactoFamiliar: 'Padre',
      nombreFamiliar: 'Pedro Pérez',
      telefonoFamiliar: '3009876543',
      archivosAdjuntos: [],
      observacionesAdicionales: 'Este es un registro de prueba automatizado para validar el sistema de generación de reportes.'
    };

    console.log('📋 Creando reporte de prueba...');
    console.log('   Número de incidente:', reporteData.numeroIncidente);
    console.log('   Tipo de alerta:', reporteData.tipoAlerta);
    console.log('   Nivel de gravedad:', reporteData.nivelGravedad);

    // Crear el reporte
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.post('http://localhost:5003/api/admin/reportes', reporteData, config);

    console.log('\n✅ REPORTE CREADO EXITOSAMENTE');
    console.log('─'.repeat(60));
    console.log('ID:', response.data.data.id);
    console.log('Número de Incidente:', response.data.data.numeroIncidente);
    console.log('Mensaje:', response.data.msg);
    console.log('─'.repeat(60));

    // Verificar que se creó consultando la lista
    console.log('\n📊 Consultando lista de reportes...');
    const listResponse = await axios.get('http://localhost:5003/api/admin/reportes', config);
    
    console.log(`\n✅ Total de reportes en sistema: ${listResponse.data.data.length}`);
    if (listResponse.data.data.length > 0) {
      console.log('\nÚltimo reporte creado:');
      const ultimoReporte = listResponse.data.data[0];
      console.log('  - ID:', ultimoReporte.Id_Reporte);
      console.log('  - Número:', ultimoReporte.Numero_Incidente);
      console.log('  - Estado:', ultimoReporte.Estado_Alerta);
      console.log('  - Tipo:', ultimoReporte.Tipo_Alerta);
      console.log('  - Estudiante:', ultimoReporte.Nombre_Estudiante);
      console.log('  - Fecha:', ultimoReporte.Fecha_Ingreso);
    }

    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERROR:', error.response?.data?.msg || error.message);
    if (error.response?.data) {
      console.error('Detalles:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

testCreateReporte();
