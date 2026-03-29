const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database-mysql');

async function main() {
  const sqlPath = path.join(__dirname, '..', '..', 'database', 'schema', 'create-remisiones-mysql.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log('🚀 Ejecutando script SQL de remisiones...');
  await pool.query(sql);
  console.log('✅ Tabla Remisiones creada/verificada');
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Error creando tabla Remisiones:', err.message);
  process.exit(1);
});
