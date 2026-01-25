const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });

async function setupReportes() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
  });

  try {
    console.log('\n📋 Creando tabla Reportes en MySQL...');

    const createSql = `
      CREATE TABLE IF NOT EXISTS Reportes (
        Id_Reporte INT AUTO_INCREMENT PRIMARY KEY,
        Es_Anonimo TINYINT(1) NOT NULL DEFAULT 0,
        Nombre_Completo VARCHAR(255) NULL,
        Tipo_Documento VARCHAR(50) NULL,
        Numero_Documento VARCHAR(50) NULL,
        Fecha_Nacimiento DATE NULL,
        Edad INT NULL,
        Genero VARCHAR(50) NULL,
        Estado_Civil VARCHAR(50) NULL,
        Email VARCHAR(255) NULL,
        Telefono VARCHAR(50) NULL,
        Direccion VARCHAR(255) NULL,
        Ocupacion VARCHAR(100) NULL,
        EPS VARCHAR(100) NULL,
        Historial_Medico TEXT NULL,
        Condicion_Especial TEXT NULL,
        Grado_Cargo VARCHAR(100) NULL,
        Institucion VARCHAR(255) NULL,
        Contacto_Emergencia VARCHAR(255) NULL,
        Telefono_Emergencia VARCHAR(50) NULL,
        Descripcion LONGTEXT NOT NULL,
        Evidencia LONGTEXT NULL,
        Contexto LONGTEXT NULL,
        Correo_Contacto VARCHAR(255) NULL,
        Estado_Reporte VARCHAR(50) NOT NULL DEFAULT 'Abierto',
        Prioridad VARCHAR(50) NOT NULL DEFAULT 'Media',
        Fecha_Registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        Fecha_Actualizacion DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
        Usuario_Id INT NULL,
        INDEX idx_usuario (Usuario_Id),
        INDEX idx_estado (Estado_Reporte),
        INDEX idx_fecha (Fecha_Registro)
      )
    `;

    await pool.query(createSql);
    const [columns] = await pool.query('SHOW COLUMNS FROM Reportes');
    console.log('\n✅ Tabla Reportes lista. Columnas:');
    columns.forEach(c => console.log(` - ${c.Field} (${c.Type})`));
  } catch (error) {
    console.error('\n❌ Error creando tabla Reportes:', error.message);
  } finally {
    await pool.end();
  }
}

setupReportes();
