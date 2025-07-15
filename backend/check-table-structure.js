const { executeQuery } = require('./config/database');

async function checkTableStructure() {
  console.log('🔍 Verificando estructura de la tabla usuarios...');

  try {
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

    // Consultar datos del usuario Admin
    const adminData = await executeQuery('SELECT * FROM usuarios WHERE Usuario = \'Admin\'');
    console.log('\n👥 Datos del usuario Admin:');
    if (adminData.recordset.length > 0) {
      console.log(JSON.stringify(adminData.recordset[0], null, 2));
    } else {
      console.log('No se encontró el usuario Admin');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTableStructure();
