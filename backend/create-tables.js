const { executeQuery } = require('./config/database');

async function createTables() {
  try {
    // Crear tabla Evaluaciones
    const createEvaluacionesQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Evaluaciones' AND xtype='U')
      CREATE TABLE Evaluaciones (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UsuarioId INT NOT NULL,
        Titulo NVARCHAR(255) NOT NULL,
        Descripcion NVARCHAR(MAX),
        Tipo NVARCHAR(50) NOT NULL,
        Estado NVARCHAR(20) NOT NULL DEFAULT 'Activa',
        FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
        FechaActualizacion DATETIME DEFAULT GETDATE(),
        Puntuacion INT DEFAULT 0,
        TiempoLimite INT DEFAULT 0
      )
    `;

    await executeQuery(createEvaluacionesQuery);
    console.log('✅ Tabla Evaluaciones creada exitosamente');

    // Crear tabla Alertas
    const createAlertasQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Alertas' AND xtype='U')
      CREATE TABLE Alertas (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UsuarioId INT NOT NULL,
        Titulo NVARCHAR(255) NOT NULL,
        Descripcion NVARCHAR(MAX),
        Tipo NVARCHAR(50) NOT NULL,
        Estado NVARCHAR(20) NOT NULL DEFAULT 'Activa',
        Prioridad NVARCHAR(20) NOT NULL DEFAULT 'Media',
        FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
        FechaVencimiento DATETIME,
        Leida BIT DEFAULT 0
      )
    `;

    await executeQuery(createAlertasQuery);
    console.log('✅ Tabla Alertas creada exitosamente');

    // Insertar datos de prueba
    const insertEvaluacionesQuery = `
      INSERT INTO Evaluaciones (UsuarioId, Titulo, Descripcion, Tipo, Puntuacion, TiempoLimite)
      VALUES 
        (1, 'Evaluación de Matemáticas', 'Evaluación inicial de matemáticas básicas', 'Académica', 85, 60),
        (1, 'Evaluación de Comprensión Lectora', 'Evaluación de habilidades de lectura', 'Académica', 78, 45),
        (1, 'Evaluación Socioemocional', 'Evaluación de habilidades sociales', 'Socioemocional', 92, 30)
    `;

    await executeQuery(insertEvaluacionesQuery);
    console.log('✅ Datos de prueba insertados en Evaluaciones');

    const insertAlertasQuery = `
      INSERT INTO Alertas (UsuarioId, Titulo, Descripcion, Tipo, Prioridad)
      VALUES 
        (1, 'Bienvenido al Sistema', 'Bienvenido a PrediVersa. Complete su perfil para comenzar.', 'Información', 'Alta'),
        (1, 'Actualización Disponible', 'Hay una nueva versión del sistema disponible.', 'Sistema', 'Media'),
        (1, 'Recordatorio de Evaluación', 'Tienes evaluaciones pendientes por completar.', 'Recordatorio', 'Media')
    `;

    await executeQuery(insertAlertasQuery);
    console.log('✅ Datos de prueba insertados en Alertas');

    console.log('🎉 Todas las tablas han sido creadas exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando tablas:', error);
    process.exit(1);
  }
}

createTables();
