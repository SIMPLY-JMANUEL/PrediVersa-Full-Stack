const { testConnection, executeQuery } = require('./config/database');

async function testDatabase() {
  console.log('🔍 Probando conexión a la base de datos...');
  
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ Conexión exitosa a SQL Server');
      
      // Probar una consulta simple
      const result = await executeQuery('SELECT @@VERSION as version');
      console.log('📋 Versión de SQL Server:', result.recordset[0].version);
      
      // Verificar si existe la tabla de usuarios
      const tableCheck = await executeQuery(`
        SELECT COUNT(*) as tableExists 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'usuarios'
      `);
      
      if (tableCheck.recordset[0].tableExists > 0) {
        console.log('✅ Tabla usuarios existe');
        
        // Consultar usuarios
        const users = await executeQuery('SELECT id, nombre, usuario, correo, rol FROM usuarios');
        console.log('👥 Usuarios en la base de datos:');
        users.recordset.forEach(user => {
          console.log(`  - ${user.nombre} (${user.usuario}) - ${user.rol}`);
        });
      } else {
        console.log('⚠️ Tabla usuarios no existe');
      }
      
    } else {
      console.log('❌ No se pudo conectar a la base de datos');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDatabase();
