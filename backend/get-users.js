const { executeQuery } = require('./config/database');

async function getUsers() {
  try {
    const result = await executeQuery('SELECT Usuario, Perfil, Correo, Contrasena FROM usuarios');
    console.log('👥 Usuarios existentes:');
    result.recordset.forEach(user => {
      console.log(`- Usuario: ${user.Usuario}`);
      console.log(`  Perfil: ${user.Perfil}`);
      console.log(`  Correo: ${user.Correo}`);
      console.log(`  Contraseña: [${user.Contrasena}]`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

getUsers();
