require('dotenv').config();
const { query } = require('./config/database-mysql');

async function checkUsers() {
  try {
    const users = await query('SELECT Id_Usuario, Usuario, Perfil, Activo, Contrasena FROM Usuarios LIMIT 15');
    console.log('\nUsuarios en la BD:');
    users.forEach(u => {
      console.log(`\n  ID: ${u.Id_Usuario}`);
      console.log(`  Usuario: ${u.Usuario}`);
      console.log(`  Perfil: ${u.Perfil}`);
      console.log(`  Activo: ${u.Activo}`);
      console.log(`  Contraseña: ${u.Contrasena}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
