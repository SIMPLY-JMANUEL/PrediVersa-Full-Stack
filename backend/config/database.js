const sql = require('mssql');
require('dotenv').config(); // Añadido para cargar las variables del archivo .env

// Configuración de la base de datos SQL Server AHORA LEE DESDE .ENV
const dbConfig = {
  server: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false, // Para conexiones locales
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Pool de conexiones global
let poolPromise;

// Función para obtener el pool de conexiones
const getPool = () => {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(dbConfig)
      .connect()
      .then(pool => {
        console.log('✅ Conectado a SQL Server');
        return pool;
      })
      .catch(err => {
        console.error('❌ Error de conexión a SQL Server:', err);
        poolPromise = null; // Reset para permitir reintentos
        throw err;
      });
  }
  return poolPromise;
};

// Función para ejecutar consultas
const executeQuery = async (query, params = {}) => {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Agregar parámetros si existen
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });

    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error('Error ejecutando consulta:', error);
    throw error;
  }
};

// Función para cerrar la conexión
const closePool = async () => {
  try {
    if (poolPromise) {
      const pool = await poolPromise;
      await pool.close();
      poolPromise = null;
      console.log('🔌 Conexión a SQL Server cerrada');
    }
  } catch (error) {
    console.error('Error cerrando conexión:', error);
  }
};

// Función de prueba de conexión
const testConnection = async () => {
  try {
    const result = await executeQuery('SELECT 1 as test');
    console.log('🔧 Prueba de conexión exitosa:', result.recordset);
    return true;
  } catch (error) {
    console.error('🔧 Prueba de conexión fallida:', error.message);
    return false;
  }
};

module.exports = {
  sql,
  getPool,
  executeQuery,
  closePool,
  testConnection,
  dbConfig,
};
