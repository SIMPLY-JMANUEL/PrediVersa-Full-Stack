const axios = require('axios');

async function getAllAlertas() {
  try {
    console.log('\n📊 Recuperando todas las alertas registradas...\n');

    const response = await axios.get('http://localhost:5003/api/admin/alerts', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });

    if (response.data.success && response.data.data) {
      const alertas = response.data.data;
      
      console.log(`✅ Se encontraron ${alertas.length} alertas en la base de datos\n`);
      console.log('═'.repeat(80));
      
      alertas.forEach((alerta, index) => {
        console.log(`\n[${index + 1}] Alerta ID: ${alerta.Id_Alerta}`);
        console.log(`    Tipo: ${alerta.Tipo_Alerta}`);
        console.log(`    Ubicación: ${alerta.Ubicacion}`);
        console.log(`    Reportante: ${alerta.Nombre_Reportante}`);
        console.log(`    Categoría: ${alerta.Categoria_Incidente}`);
        console.log(`    Estado: ${alerta.Estado_Alerta}`);
        console.log(`    Prioridad: ${alerta.Prioridad}`);
        console.log(`    Fecha: ${new Date(alerta.Fecha_Registro).toLocaleString('es-CO')}`);
      });
      
      console.log('\n' + '═'.repeat(80));
      console.log(`\n📈 Resumen:`);
      console.log(`   Total de alertas: ${alertas.length}`);
      console.log(`   Por prioridad:`);
      
      const prioridades = {};
      alertas.forEach(a => {
        prioridades[a.Prioridad] = (prioridades[a.Prioridad] || 0) + 1;
      });
      
      Object.entries(prioridades).forEach(([prio, count]) => {
        console.log(`     • ${prio}: ${count}`);
      });
      
      console.log(`\n   Por estado:`);
      const estados = {};
      alertas.forEach(a => {
        estados[a.Estado_Alerta] = (estados[a.Estado_Alerta] || 0) + 1;
      });
      
      Object.entries(estados).forEach(([est, count]) => {
        console.log(`     • ${est}: ${count}`);
      });
      
    } else {
      console.log('❌ Error:', response.data.msg);
    }

  } catch (error) {
    console.error('\n❌ Error al recuperar alertas:', error.message);
  }
}

getAllAlertas();
