// Database Adapter - Funciona con MySQL y SQL Server
require('dotenv').config();

const DB_DIALECT = process.env.DB_DIALECT || 'mssql';
let db;

if (DB_DIALECT === 'mysql') {
  // Para MySQL/AWS RDS
  const UserMySQL = require('./models/UserMySQL');
  
  db = {
    User: UserMySQL,
    dialect: 'mysql',
    
    // Función auxiliar para ejecutar queries
    async executeQuery(sql, params = []) {
      const { pool } = require('./config/database-mysql');
      const [rows] = await pool.query(sql, params);
      return { recordset: rows, rowsAffected: [rows.length] };
    }
  };
  
} else {
  // Para SQL Server
  const UserSQL = require('./models/UserDirectSQL');
  const { executeQuery } = require('./config/database');
  
  db = {
    User: UserSQL,
    dialect: 'mssql',
    executeQuery
  };
}

module.exports = db;
