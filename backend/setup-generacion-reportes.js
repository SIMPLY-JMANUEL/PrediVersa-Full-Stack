const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('✅ Conectado a la base de datos');

  const sql = `
    CREATE TABLE IF NOT EXISTS GeneracionReportes (
      Id_Reporte INT AUTO_INCREMENT PRIMARY KEY,
      Numero_Incidente VARCHAR(50) UNIQUE NOT NULL,
      Fecha_Ingreso DATE NOT NULL,
      Estado_Alerta VARCHAR(50) NOT NULL,
      Tipo_Alerta VARCHAR(100) NOT NULL,
      Nivel_Gravedad VARCHAR(50),
      Atencion_Inmediata VARCHAR(10),
      Institucion_Sede VARCHAR(255),
      
      -- Información del estudiante
      Nombre_Estudiante VARCHAR(255),
      Grado_Grupo VARCHAR(50),
      Lugar_Suceso VARCHAR(255),
      Fecha_Hora_Suceso DATETIME,
      
      -- Información personal
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
      
      -- Información de responsabilidad
      Responsable_Asignado VARCHAR(255),
      Descripcion_Detallada LONGTEXT,
      Medidas_Tomadas LONGTEXT,
      
      -- Contacto familiar
      Contacto_Familiar VARCHAR(255),
      Nombre_Familiar VARCHAR(255),
      Telefono_Familiar VARCHAR(50),
      
      -- Documentación
      Archivos_Adjuntos JSON,
      Observaciones_Adicionales LONGTEXT,
      
      -- Metadatos
      Fecha_Registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      Fecha_Actualizacion DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
      Usuario_Id INT NULL,
      
      -- Índices
      INDEX idx_numero (Numero_Incidente),
      INDEX idx_estado (Estado_Alerta),
      INDEX idx_fecha (Fecha_Ingreso),
      INDEX idx_usuario (Usuario_Id)
    )
  `;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('❌ Error creando tabla:', error);
    } else {
      console.log('✅ Tabla GeneracionReportes creada/validada exitosamente');
      
      // Describir la tabla
      connection.query('DESCRIBE GeneracionReportes', (err, columns) => {
        if (err) {
          console.error('Error describiendo tabla:', err);
        } else {
          console.log('\n📋 Columnas en GeneracionReportes:');
          console.table(columns);
        }
        connection.end();
      });
    }
  });
});
