// Database Adapter - AWS RDS MySQL
require('dotenv').config();

const UserMySQL = require('./models/UserMySQL');

const db = {
  User: UserMySQL,
  dialect: 'mysql',
  
  // Función auxiliar para ejecutar queries
  async executeQuery(sql, params = []) {
    const { pool } = require('./config/database-mysql');
    const [rows] = await pool.query(sql, params);
    return { recordset: rows, rowsAffected: [rows.length] };
  }
};

module.exports = db;
