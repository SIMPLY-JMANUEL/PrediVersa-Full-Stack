require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });
    
    console.log('✅ Conectado a BD');
    
    const [users] = await conn.execute(`
      SELECT Usuario, Contrasena, Perfil 
      FROM Usuarios 
      WHERE Usuario IN ('admin', 'Moder', 'testuser6')
      LIMIT 3
    `);
    
    console.log('\n🔑 Credenciales disponibles:');
    users.forEach(u => {
      console.log(`  Usuario: ${u.Usuario}`);
      console.log(`  Contraseña: ${u.Contrasena}`);
      console.log(`  Perfil: ${u.Perfil}`);
      console.log('  ---');
    });
    
    await conn.end();
  } catch(e) {
    console.error('❌ Error:', e.message);
  }
})();
