const { executeQuery } = require('./config/database');

async function checkTableStructure() {
  try {
    const result = await executeQuery(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'usuarios' 
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('Columnas de la tabla usuarios:');
    result.recordset.forEach(row => {
      console.log('- ' + row.COLUMN_NAME);
    });
    
    process.exit(0);
  } catch(error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkTableStructure();
