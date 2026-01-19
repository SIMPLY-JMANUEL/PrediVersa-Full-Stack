require('dotenv').config();
const { testConnection } = require('./config/database');

console.log('\n🧪 Probando conexión a AWS RDS MySQL...\n');
console.log('Configuración:');
console.log(`- DB_HOST: ${process.env.DB_HOST}`);
console.log(`- DB_PORT: ${process.env.DB_PORT}`);
console.log(`- DB_DATABASE: ${process.env.DB_DATABASE}`);
console.log(`- DB_USER: ${process.env.DB_USER}`);
console.log(`- DB_DIALECT: ${process.env.DB_DIALECT}\n`);

testConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Conexión exitosa a AWS RDS!');
      console.log('🌍 Tu base de datos ya es global y accesible desde cualquier dispositivo');
      
      // Probar query
      const User = require('./models/UserMySQL');
      return User.getAllUsers();
    } else {
      console.log('\n❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }
  })
  .then(users => {
    if (users) {
      console.log(`\n👥 Usuarios encontrados: ${users.length}`);
      users.slice(0, 5).forEach(u => {
        console.log(`   - ${u.Usuario} (${u.Perfil})`);
      });
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
