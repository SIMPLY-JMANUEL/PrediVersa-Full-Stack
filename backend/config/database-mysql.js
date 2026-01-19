// AWS RDS MySQL Database Configuration
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4'
});

// Función auxiliar para queries
async function query(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// Función para obtener una sola fila
async function querySingle(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows[0] || null;
}

// Test de conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a AWS RDS MySQL');
    console.log(`📍 Host: ${process.env.DB_HOST}`);
    console.log(`🗄️  Base de datos: ${process.env.DB_DATABASE}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a RDS:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  query,
  querySingle,
  testConnection
};
