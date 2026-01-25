const axios = require('axios');

// Datos de prueba para una alerta
const alertaData = {
  tipo_alerta: 'Bullying',
  fecha_hora: new Date().toISOString(),
  ubicacion: 'Patio de la escuela',
  requiere_atencion_inmediata: 'sí',
  es_reiterativo: 'no',
  canal_reporte: 'Docente',
  nombre_estudiante: 'Juan Pérez García',
  identificacion_estudiante: '1098765432',
  curso_grado: '8A',
  edad: '14',
  tipo_reportado: 'Estudiante',
  nombre_reportante: 'María López Rodríguez',
  identificacion_reportante: '1087654321',
  relacion_reportado: 'Docente',
  telefono_reportante: '3001234567',
  email_reportante: 'maria.lopez@escuela.edu.co',
  categoria_incidente: 'Violencia física',
  descripcion_detallada: 'Se presenciaron empujones entre dos estudiantes en el patio durante el recreo.',
  evidencias: 'Videograbación de vigilancia',
  testigos: '5 estudiantes presenciaron los hechos',
  contexto_previo: 'Discusión previa sobre un trabajo en grupo',
  estado_alerta: 'Abierta',
  prioridad: 'Alta',
  coordinador_asignado: 'Coordinador de Convivencia',
  observaciones_preliminares: 'Se requiere intervención inmediata',
  consentimiento_informado: true,
  proteccion_datos: true,
  cumplimiento_normativo: true
};

// Función para hacer la prueba
async function testAddAlerta() {
  try {
    console.log('\n📝 Enviando alerta de prueba...\n');
    console.log('Datos:', JSON.stringify(alertaData, null, 2));

    const response = await axios.post('http://localhost:5003/api/admin/alerts', alertaData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });

    console.log('\n✅ ¡Éxito!\n');
    console.log('Respuesta del servidor:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.success && response.data.data) {
      console.log('\n🎉 Alerta registrada exitosamente!');
      console.log(`Número de alerta: ${response.data.data.numeroAlerta || response.data.data.id}`);
    }
  } catch (error) {
    console.error('\n❌ Error al enviar la alerta:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Datos:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Mensaje:', error.message);
      console.error('Error completo:', error);
    }
  }
}

// Ejecutar la prueba
testAddAlerta();
