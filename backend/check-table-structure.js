const { testConnection, executeQuery } = require('./config/database');

async function checkTableStructure() {
  console.log('🔍 Verificando estructura de la tabla usuarios...');

  try {
    const isConnected = await testConnection();

    if (isConnected) {
      console.log('✅ Conexión exitosa a SQL Server');

      // Verificar la estructura de la tabla usuarios
      const columns = await executeQuery(`
        SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          IS_NULLABLE,
          CHARACTER_MAXIMUM_LENGTH
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'usuarios'
        ORDER BY ORDINAL_POSITION
      `);

      console.log('📋 Estructura de la tabla usuarios:');
      columns.recordset.forEach(col => {
        console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE}${col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : ''} ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });

      // Consultar todos los datos de la tabla
      const allData = await executeQuery('SELECT * FROM usuarios');
      console.log('\n👥 Datos actuales en la tabla:');
      allData.recordset.forEach((row, index) => {
        console.log(`  Registro ${index + 1}:`, row);
      });

    } else {
      console.log('❌ No se pudo conectar a la base de datos');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTableStructure();
