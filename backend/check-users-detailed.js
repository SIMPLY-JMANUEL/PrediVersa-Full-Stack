const { executeQuery } = require('./config/database');

async function checkUsers() {
  try {
    const result = await executeQuery(`
      SELECT 
        Id_Usuario,
        Nombre_Completo,
        Usuario,
        Perfil,
        Activo,
        LEN(Activo) as ActivoLength,
        ASCII(LEFT(Activo, 1)) as FirstCharASCII,
        ASCII(RIGHT(Activo, 1)) as LastCharASCII
      FROM usuarios
    `);
    
    console.log('=== ANÁLISIS DE USUARIOS ===');
    result.recordset.forEach(user => {
      console.log(`Usuario: ${user.Usuario}`);
      console.log(`  Nombre: ${user.Nombre_Completo}`);
      console.log(`  Rol: ${user.Perfil}`);
      console.log(`  Activo: "${user.Activo}"`);
      console.log(`  Longitud Activo: ${user.ActivoLength}`);
      console.log(`  ASCII primer char: ${user.FirstCharASCII}`);
      console.log(`  ASCII último char: ${user.LastCharASCII}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();
