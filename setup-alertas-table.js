const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });

async function createAlertas() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'prediversa',
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('\n📋 Creando tabla Alertas en MySQL...\n');

    // Crear tabla Alertas
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS Alertas (
        Id_Alerta INT AUTO_INCREMENT PRIMARY KEY,
        Tipo_Alerta VARCHAR(100) NOT NULL,
        Fecha_Hora_Incidente DATETIME NOT NULL,
        Ubicacion VARCHAR(255) NOT NULL,
        Requiere_Atencion_Inmediata VARCHAR(10) NOT NULL,
        Es_Reiterativo VARCHAR(10) NOT NULL,
        Canal_Reporte VARCHAR(50) NOT NULL,
        Nombre_Estudiante VARCHAR(255) NULL,
        Identificacion_Estudiante VARCHAR(50) NULL,
        Curso_Grado VARCHAR(50) NULL,
        Edad_Reportado INT NULL,
        Tipo_Reportado VARCHAR(100) NULL,
        Nombre_Reportante VARCHAR(255) NOT NULL,
        Identificacion_Reportante VARCHAR(50) NOT NULL,
        Relacion_Reportado VARCHAR(100) NULL,
        Telefono_Reportante VARCHAR(20) NULL,
        Email_Reportante VARCHAR(255) NULL,
        Categoria_Incidente VARCHAR(100) NOT NULL,
        Descripcion_Detallada LONGTEXT NOT NULL,
        Evidencias LONGTEXT NULL,
        Testigos LONGTEXT NULL,
        Contexto_Previo LONGTEXT NULL,
        Estado_Alerta VARCHAR(50) NOT NULL,
        Prioridad VARCHAR(50) NOT NULL,
        Coordinador_Asignado VARCHAR(100) NULL,
        Observaciones_Preliminares LONGTEXT NULL,
        Consentimiento_Informado TINYINT(1) NOT NULL,
        Proteccion_Datos TINYINT(1) NOT NULL,
        Cumplimiento_Normativo TINYINT(1) NOT NULL,
        Fecha_Registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        Fecha_Actualizacion DATETIME NULL,
        Usuario_Id INT NULL,
        INDEX idx_estado (Estado_Alerta),
        INDEX idx_prioridad (Prioridad),
        INDEX idx_fecha (Fecha_Registro),
        INDEX idx_usuario (Usuario_Id)
      )
    `;

    await pool.query(createTableSQL);
    console.log('✅ Tabla Alertas creada');

    // Verificar columnas
    const [columns] = await pool.query('SHOW COLUMNS FROM Alertas');
    console.log('\n✅ Columnas de la tabla Alertas:');
    console.log('  ' + columns.map(c => c.Field).join(', '));

    console.log('\n🎉 ¡Tabla Alertas lista para usar!');
  } catch (error) {
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('⚠️ La tabla Alertas ya existe');
    } else {
      console.error('\n❌ Error:', error.code || error.message || error);
      console.error('Stack:', error.stack);
    }
  } finally {
    await pool.end();
  }
}

createAlertas();
