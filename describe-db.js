const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });

async function describeTables() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('\n📋 Tablas en la base de datos:\n');

    const [tables] = await pool.query('SHOW TABLES');
    for (const tableObj of tables) {
      const tableName = Object.values(tableObj)[0];
      const [columns] = await pool.query(`SHOW COLUMNS FROM ${tableName}`);
      console.log(`🔹 ${tableName}:`);
      columns.forEach(col => {
        console.log(`   - ${col.Field} (${col.Type})`);
      });
      console.log();
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

describeTables();
