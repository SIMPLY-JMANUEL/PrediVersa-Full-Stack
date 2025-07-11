const { executeQuery } = require('./config/database');

async function checkExistingPasswords() {
  try {
    const result = await executeQuery(`
      SELECT Usuario, Contrasena, LEN(Contrasena) as Longitud 
      FROM usuarios
    `);
    
    console.log('Contraseñas existentes:');
    result.recordset.forEach(row => {
      console.log(`Usuario: ${row.Usuario}, Contraseña: "${row.Contrasena}", Longitud: ${row.Longitud}`);
    });
    
    process.exit(0);
  } catch(error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkExistingPasswords();
