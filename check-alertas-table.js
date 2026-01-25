const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAlertas() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'prediversa',
    port: process.env.DB_PORT || 3306
  });

  try {
    // Verificar si la tabla existe
    const [tables] = await pool.query('SHOW TABLES LIKE "Alertas"');
    console.log('\n📋 Tablas encontradas:', tables);

    if (tables.length === 0) {
      console.log('\n❌ La tabla Alertas NO existe en MySQL');
      console.log('\n💡 Necesitas crear la tabla. Ejecuta:');
      console.log('mysql -h <host> -u <user> -p <database> < database/schema/create-tables-mysql.sql');
    } else {
      // Obtener columnas
      const [columns] = await pool.query('SHOW COLUMNS FROM Alertas');
      console.log('\n✅ La tabla Alertas EXISTE. Columnas:');
      columns.forEach(col => {
        console.log(`  - ${col.Field} (${col.Type})`);
      });
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAlertas();
