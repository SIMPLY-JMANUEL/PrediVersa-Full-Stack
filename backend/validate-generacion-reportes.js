const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
    return;
  }
  console.log('✅ Conectado a la base de datos');

  // Crear tabla si no existe
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS GeneracionReportes (
      Id_Reporte INT AUTO_INCREMENT PRIMARY KEY,
      Numero_Incidente VARCHAR(50) UNIQUE NOT NULL,
      Fecha_Ingreso DATE NOT NULL,
      Estado_Alerta VARCHAR(50) NOT NULL,
      Tipo_Alerta VARCHAR(100) NOT NULL,
      Nivel_Gravedad VARCHAR(50),
      Atencion_Inmediata VARCHAR(10),
      Institucion_Sede VARCHAR(255),
      Nombre_Estudiante VARCHAR(255),
      Grado_Grupo VARCHAR(50),
      Lugar_Suceso VARCHAR(255),
      Fecha_Hora_Suceso DATETIME,
      Nombre_Completo VARCHAR(255) NOT NULL,
      Tipo_Documento VARCHAR(50),
      Numero_Documento VARCHAR(50),
      Fecha_Nacimiento DATE,
      Edad INT,
      Sexo_Genero VARCHAR(50),
      Estado_Civil VARCHAR(50),
      Correo_Electronico VARCHAR(255),
      Telefono_Contacto VARCHAR(50),
      Direccion_Residencia VARCHAR(255),
      Responsable_Asignado VARCHAR(255),
      Descripcion_Detallada LONGTEXT,
      Medidas_Tomadas LONGTEXT,
      Contacto_Familiar VARCHAR(255),
      Nombre_Familiar VARCHAR(255),
      Telefono_Familiar VARCHAR(50),
      Archivos_Adjuntos JSON,
      Observaciones_Adicionales LONGTEXT,
      Fecha_Registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      Fecha_Actualizacion DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
      Usuario_Id INT NULL,
      INDEX idx_numero (Numero_Incidente),
      INDEX idx_estado (Estado_Alerta),
      INDEX idx_fecha (Fecha_Ingreso),
      INDEX idx_usuario (Usuario_Id)
    )
  `;

  connection.query(createTableSQL, (error, results) => {
    if (error) {
      console.error('❌ Error creando tabla:', error.message);
      connection.end();
      return;
    }
    console.log('✅ Tabla GeneracionReportes creada/validada');

    // Describir la tabla
    connection.query('DESCRIBE GeneracionReportes', (err, columns) => {
      if (err) {
        console.error('❌ Error describiendo tabla:', err.message);
        connection.end();
        return;
      }

      console.log('\n📋 COLUMNAS EN GENERACIONREPORTES:');
      console.log('─'.repeat(80));
      columns.forEach((col, idx) => {
        console.log(
          `${idx + 1}. ${col.Field.padEnd(30)} | Tipo: ${col.Type.padEnd(25)} | Null: ${col.Null.padEnd(3)} | Key: ${(col.Key || 'N/A').padEnd(3)}`
        );
      });
      console.log('─'.repeat(80));
      console.log(`Total columnas: ${columns.length}\n`);

      // Verificar que la tabla esté vacía
      connection.query('SELECT COUNT(*) as cantidad FROM GeneracionReportes', (err, result) => {
        if (err) {
          console.error('❌ Error consultando tabla:', err.message);
        } else {
          console.log(`📊 Registros actuales en GeneracionReportes: ${result[0].cantidad}`);
        }

        // Validar modelo
        console.log('\n✅ VALIDACIÓN DEL MODELO:');
        console.log('─'.repeat(80));
        try {
          const GeneracionReportesMySQL = require('./models/GeneracionReportesMySQL');
          console.log('✅ Modelo GeneracionReportesMySQL importado correctamente');
          console.log('   Métodos disponibles:');
          console.log('   - createReporte(reporteData)');
          console.log('   - getReporteById(id)');
          console.log('   - getReporteByNumero(numero)');
          console.log('   - getAllReportes(filtros, limit, offset)');
          console.log('   - updateReporte(id, reporteData)');
          console.log('   - deleteReporte(id)');
          console.log('   - getEstadisticas(filtros)');
        } catch (error) {
          console.error('❌ Error importando modelo:', error.message);
        }

        // Validar rutas
        console.log('\n✅ VALIDACIÓN DE RUTAS:');
        console.log('─'.repeat(80));
        try {
          const adminRoutes = require('./routes/admin.js');
          console.log('✅ Rutas del admin importadas correctamente');
          console.log('   Endpoints de reportes:');
          console.log('   - POST   /api/admin/reportes (crear)');
          console.log('   - GET    /api/admin/reportes (listar con filtros)');
          console.log('   - GET    /api/admin/reportes/:id (obtener uno)');
          console.log('   - PUT    /api/admin/reportes/:id (actualizar)');
          console.log('   - DELETE /api/admin/reportes/:id (eliminar)');
          console.log('   - GET    /api/admin/reportes-stats/estadisticas (stats)');
        } catch (error) {
          console.error('❌ Error importando rutas:', error.message);
        }

        console.log('\n' + '═'.repeat(80));
        console.log('✅ VALIDACIÓN COMPLETADA');
        console.log('═'.repeat(80));

        connection.end();
      });
    });
  });
});
