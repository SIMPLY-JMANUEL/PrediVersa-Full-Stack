const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });

async function recreateAlertas() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('\n🔄 Recreando tabla Alertas con estructura correcta...\n');

    // Renombrar tabla antigua
    try {
      await pool.query('RENAME TABLE Alertas TO Alertas_OLD');
      console.log('✅ Tabla Alertas antigua renombrada a Alertas_OLD');
    } catch (e) {
      if (e.code !== 'ER_NO_SUCH_TABLE') {
        console.log('⚠️ No hay tabla Alertas anterior');
      }
    }

    // Crear tabla nueva con estructura correcta
    const createTableSQL = `
      CREATE TABLE Alertas (
        Id_Alerta INT AUTO_INCREMENT PRIMARY KEY,
        Tipo_Alerta VARCHAR(100) NOT NULL,
        Fecha_Hora_Incidente DATETIME NOT NULL,
        Ubicacion VARCHAR(255) NOT NULL,
        Requiere_Atencion_Inmediata VARCHAR(10) NOT NULL DEFAULT 'no',
        Es_Reiterativo VARCHAR(10) NOT NULL DEFAULT 'no',
        Canal_Reporte VARCHAR(50),
        Nombre_Estudiante VARCHAR(255),
        Identificacion_Estudiante VARCHAR(50),
        Curso_Grado VARCHAR(50),
        Edad_Reportado INT,
        Tipo_Reportado VARCHAR(100),
        Nombre_Reportante VARCHAR(255) NOT NULL,
        Identificacion_Reportante VARCHAR(50) NOT NULL,
        Relacion_Reportado VARCHAR(100),
        Telefono_Reportante VARCHAR(20),
        Email_Reportante VARCHAR(255),
        Categoria_Incidente VARCHAR(100) NOT NULL,
        Descripcion_Detallada LONGTEXT NOT NULL,
        Evidencias LONGTEXT,
        Testigos LONGTEXT,
        Contexto_Previo LONGTEXT,
        Estado_Alerta VARCHAR(50) NOT NULL DEFAULT 'Abierta',
        Prioridad VARCHAR(50) NOT NULL DEFAULT 'Media',
        Coordinador_Asignado VARCHAR(100),
        Observaciones_Preliminares LONGTEXT,
        Consentimiento_Informado TINYINT(1) NOT NULL DEFAULT 0,
        Proteccion_Datos TINYINT(1) NOT NULL DEFAULT 0,
        Cumplimiento_Normativo TINYINT(1) NOT NULL DEFAULT 0,
        Fecha_Registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        Fecha_Actualizacion DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
        Usuario_Id INT NULL,
        
        INDEX idx_estado (Estado_Alerta),
        INDEX idx_prioridad (Prioridad),
        INDEX idx_fecha (Fecha_Registro),
        INDEX idx_usuario (Usuario_Id)
      )
    `;

    await pool.query(createTableSQL);
    console.log('✅ Tabla Alertas creada con estructura correcta');

    // Verificar columnas
    const [columns] = await pool.query('SHOW COLUMNS FROM Alertas');
    console.log('\n✅ Columnas creadas:');
    columns.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type})`);
    });

    console.log('\n🎉 ¡Tabla Alertas lista para recibir datos!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

recreateAlertas();
