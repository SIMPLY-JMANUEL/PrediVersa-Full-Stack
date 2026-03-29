const axios = require('axios');

// Diferentes tipos de alertas para probar
const alertasData = [
  {
    tipo_alerta: 'Acoso Sexual',
    ubicacion: 'Baños de la escuela',
    nombre_reportante: 'Psicóloga Escolar',
    identificacion_reportante: '1234567890',
    categoria_incidente: 'Abuso Sexual',
    descripcion_detallada: 'Reporte de comportamiento inapropiado en área restringida',
    prioridad: 'Alta',
    estado_alerta: 'Abierta'
  },
  {
    tipo_alerta: 'Violencia Psicológica',
    ubicacion: 'Salón de clases',
    nombre_reportante: 'Docente de Matemáticas',
    identificacion_reportante: '9876543210',
    categoria_incidente: 'Insultos y Discriminación',
    descripcion_detallada: 'Estudiante fue discriminado por sus compañeros durante la clase',
    prioridad: 'Media',
    estado_alerta: 'Abierta'
  },
  {
    tipo_alerta: 'Consumo de Sustancias',
    ubicacion: 'Cafetería',
    nombre_reportante: 'Coordinador de Convivencia',
    identificacion_reportante: '5555555555',
    categoria_incidente: 'Posesión de Alcohol/Drogas',
    descripcion_detallada: 'Se sospecha presencia de sustancias controladas',
    prioridad: 'Muy Alta',
    estado_alerta: 'Abierta'
  },
  {
    tipo_alerta: 'Ausencia Injustificada',
    ubicacion: 'Rectoría',
    nombre_reportante: 'Rector',
    identificacion_reportante: '7777777777',
    categoria_incidente: 'Inasistencia',
    descripcion_detallada: 'Estudiante ha faltado 10 días consecutivos sin justificación',
    prioridad: 'Media',
    estado_alerta: 'Abierta'
  },
  {
    tipo_alerta: 'Hurto',
    ubicacion: 'Biblioteca',
    nombre_reportante: 'Bibliotecaria',
    identificacion_reportante: '3333333333',
    categoria_incidente: 'Robo de Propiedad',
    descripcion_detallada: 'Se reportó pérdida de libros de la biblioteca',
    prioridad: 'Media',
    estado_alerta: 'Abierta'
  }
];

async function testMultipleAlertas() {
  console.log('\n🧪 Iniciando pruebas múltiples de alertas...\n');
  console.log(`📊 Se van a crear ${alertasData.length} alertas diferentes\n`);

  for (let i = 0; i < alertasData.length; i++) {
    const alerta = alertasData[i];
    
    try {
      console.log(`\n[${i + 1}/${alertasData.length}] 📝 ${alerta.tipo_alerta}`);
      console.log(`   Ubicación: ${alerta.ubicacion}`);
      console.log(`   Prioridad: ${alerta.prioridad}`);

      const response = await axios.post('http://localhost:5003/api/admin/alerts', alerta, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      });

      if (response.data.success) {
        console.log(`   ✅ Registrada: ${response.data.data.numeroAlerta}`);
      } else {
        console.log(`   ❌ Error: ${response.data.msg}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Pruebas completadas');
  console.log('='.repeat(60) + '\n');
}

testMultipleAlertas();
