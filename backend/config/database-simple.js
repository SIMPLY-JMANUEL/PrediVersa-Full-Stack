const sql = require('mssql');

// Configuración simple para SQL Server con Windows Authentication
const config = {
  server: 'localhost',
  database: 'PrediVersa',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    instancename: 'SQLEXPRESS',
  },
  authentication: {
    type: 'ntlm',
    options: {
      domain: '',
      userName: '',
      password: '',
    },
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Pool de conexiones
let pool;

const connectDB = async () => {
  try {
    console.log('🔄 Intentando conectar a SQL Server...');

    if (pool) {
      await pool.close();
    }

    pool = await sql.connect(config);
    console.log('✅ Conectado a SQL Server PrediVersa');
    return pool;
  } catch (error) {
    console.error('❌ Error conectando a SQL Server:', error.message);
    throw error;
  }
};

const executeQuery = async (query, params = {}) => {
  try {
    if (!pool) {
      await connectDB();
    }

    const request = pool.request();

    // Agregar parámetros si los hay
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });

    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error('❌ Error ejecutando query:', error.message);
    throw error;
  }
};

const closeConnection = async () => {
  try {
    if (pool) {
      await pool.close();
      console.log('🔒 Conexión a SQL Server cerrada');
    }
  } catch (error) {
    console.error('❌ Error cerrando conexión:', error.message);
  }
};

module.exports = {
  connectDB,
  executeQuery,
  closeConnection,
  sql,
};
