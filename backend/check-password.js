const { executeQuery } = require('./config/database');

async function checkPasswordColumn() {
  try {
    const result = await executeQuery(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'Contrasena'
    `);
    
    console.log('Estructura del campo Contrasena:');
    result.recordset.forEach(row => {
      console.log(row);
    });
    
    process.exit(0);
  } catch(error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkPasswordColumn();
