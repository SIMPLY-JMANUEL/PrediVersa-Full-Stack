const mysql = require('mysql2/promise');
require('dotenv').config();

async function createRequerimientosTable() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'prediversa',
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('\n📋 Creando tabla Requerimientos_Seguimiento en MySQL...\n');

    // Crear tabla Requerimientos_Seguimiento
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS Requerimientos_Seguimiento (
        Id_Requerimiento INT AUTO_INCREMENT PRIMARY KEY,
        Id_Alerta INT NULL,
        Numero_Alerta VARCHAR(20) NULL,
        Numero_Caso VARCHAR(50) NULL,
        Fecha_Requerimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
        Descripcion_Requerimiento LONGTEXT NOT NULL,
        Estado_Requerimiento VARCHAR(50) NOT NULL DEFAULT 'pendiente',
        Prioridad VARCHAR(20) NOT NULL DEFAULT 'normal',
        Fecha_Limite DATETIME NULL,
        Profesional_Asignado VARCHAR(255) NULL,
        Fecha_Seguimiento DATETIME NULL,
        Resultado_Seguimiento LONGTEXT NULL,
        Porcentaje_Completitud INT DEFAULT 0,
        Acciones_Tomadas LONGTEXT NULL,
        Proximas_Acciones LONGTEXT NULL,
        Requiere_Seguimiento_Adicional VARCHAR(10) NULL,
        Fecha_Proximo_Seguimiento DATETIME NULL,
        Intervinientes JSON NULL,
        Evidencia_Documental LONGTEXT NULL,
        Observaciones LONGTEXT NULL,
        Usuario_Id INT NULL,
        Fecha_Actualizacion DATETIME NULL,
        INDEX idx_estado (Estado_Requerimiento),
        INDEX idx_alerta (Id_Alerta),
        INDEX idx_fecha (Fecha_Requerimiento),
        INDEX idx_prioridad (Prioridad),
        FOREIGN KEY (Usuario_Id) REFERENCES usuarios(Id_Usuario) ON DELETE SET NULL
      )
    `;

    await pool.query(createTableSQL);
    console.log('✅ Tabla Requerimientos_Seguimiento creada/verificada');

    // Verificar columnas
    const [columns] = await pool.query('SHOW COLUMNS FROM Requerimientos_Seguimiento');
    console.log('\n✅ Columnas de la tabla:');
    columns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    console.log('\n🎉 ¡Tabla Requerimientos_Seguimiento lista para usar!');
    
    // Crear índice para búsquedas rápidas por estado
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_requerimientos_estado_fecha 
      ON Requerimientos_Seguimiento(Estado_Requerimiento, Fecha_Requerimiento DESC)
    `);
    
    console.log('✅ Índices adicionales creados');
    
  } catch (error) {
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('⚠️ La tabla Requerimientos_Seguimiento ya existe');
    } else {
      console.error('❌ Error:', error.message);
      throw error;
    }
  } finally {
    await pool.end();
  }
}

createRequerimientosTable();
