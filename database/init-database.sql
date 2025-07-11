-- Script para crear la base de datos PrediVersa en SQL Server
-- Ejecutar este script en SQL Server Management Studio o Azure Data Studio

-- Crear la base de datos si no existe
USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'PrediVersa')
BEGIN
    CREATE DATABASE PrediVersa;
    PRINT '✅ Base de datos PrediVersa creada exitosamente';
END
ELSE
BEGIN
    PRINT '📋 Base de datos PrediVersa ya existe';
END
GO

-- Usar la base de datos PrediVersa
USE PrediVersa;
GO

-- Crear tabla de usuarios si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='usuarios' AND xtype='U')
BEGIN
    CREATE TABLE usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        usuario NVARCHAR(50) UNIQUE NOT NULL,
        correo NVARCHAR(100) UNIQUE NOT NULL,
        nombre NVARCHAR(100) NOT NULL,
        contraseña NVARCHAR(255) NOT NULL,
        rol NVARCHAR(20) NOT NULL DEFAULT 'student',
        activo BIT DEFAULT 1,
        fecha_creacion DATETIME DEFAULT GETDATE(),
        fecha_actualizacion DATETIME DEFAULT GETDATE()
    );
    PRINT '✅ Tabla usuarios creada exitosamente';
END
ELSE
BEGIN
    PRINT '📋 Tabla usuarios ya existe';
END
GO

-- Crear tabla de encuestas si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='encuestas' AND xtype='U')
BEGIN
    CREATE TABLE encuestas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        titulo NVARCHAR(200) NOT NULL,
        descripcion NVARCHAR(MAX),
        tipo NVARCHAR(50) NOT NULL, -- 'student', 'teacher', 'parent'
        estado NVARCHAR(20) DEFAULT 'activa', -- 'activa', 'inactiva', 'finalizada'
        fecha_creacion DATETIME DEFAULT GETDATE(),
        fecha_fin DATETIME,
        creado_por INT,
        FOREIGN KEY (creado_por) REFERENCES usuarios(id)
    );
    PRINT '✅ Tabla encuestas creada exitosamente';
END
ELSE
BEGIN
    PRINT '📋 Tabla encuestas ya existe';
END
GO

-- Crear tabla de preguntas si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='preguntas' AND xtype='U')
BEGIN
    CREATE TABLE preguntas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        encuesta_id INT NOT NULL,
        pregunta NVARCHAR(MAX) NOT NULL,
        tipo NVARCHAR(50) NOT NULL, -- 'multiple', 'texto', 'escala'
        opciones NVARCHAR(MAX), -- JSON con opciones para preguntas múltiples
        requerida BIT DEFAULT 1,
        orden INT DEFAULT 0,
        FOREIGN KEY (encuesta_id) REFERENCES encuestas(id) ON DELETE CASCADE
    );
    PRINT '✅ Tabla preguntas creada exitosamente';
END
ELSE
BEGIN
    PRINT '📋 Tabla preguntas ya existe';
END
GO

-- Crear tabla de respuestas si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='respuestas' AND xtype='U')
BEGIN
    CREATE TABLE respuestas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        encuesta_id INT NOT NULL,
        pregunta_id INT NOT NULL,
        usuario_id INT NOT NULL,
        respuesta NVARCHAR(MAX) NOT NULL,
        fecha_respuesta DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (encuesta_id) REFERENCES encuestas(id) ON DELETE CASCADE,
        FOREIGN KEY (pregunta_id) REFERENCES preguntas(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        UNIQUE(pregunta_id, usuario_id) -- Un usuario solo puede responder una vez por pregunta
    );
    PRINT '✅ Tabla respuestas creada exitosamente';
END
ELSE
BEGIN
    PRINT '📋 Tabla respuestas ya existe';
END
GO

-- Crear tabla de PQR si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pqr' AND xtype='U')
BEGIN
    CREATE TABLE pqr (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tipo NVARCHAR(20) NOT NULL, -- 'peticion', 'queja', 'reclamo', 'sugerencia'
        asunto NVARCHAR(200) NOT NULL,
        descripcion NVARCHAR(MAX) NOT NULL,
        estado NVARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'en_proceso', 'resuelto', 'cerrado'
        prioridad NVARCHAR(20) DEFAULT 'media', -- 'baja', 'media', 'alta', 'critica'
        usuario_id INT NOT NULL,
        asignado_a INT NULL,
        fecha_creacion DATETIME DEFAULT GETDATE(),
        fecha_actualizacion DATETIME DEFAULT GETDATE(),
        fecha_resolucion DATETIME NULL,
        respuesta NVARCHAR(MAX) NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (asignado_a) REFERENCES usuarios(id)
    );
    PRINT '✅ Tabla PQR creada exitosamente';
END
ELSE
BEGIN
    PRINT '📋 Tabla PQR ya existe';
END
GO

PRINT '🎉 Estructura de base de datos PrediVersa completada';
PRINT '🔐 Conexión configurada para:';
PRINT '   • Servidor: DESKTOP-5R27AVI\PREDIVERSA';
PRINT '   • Base de datos: PrediVersa';
PRINT '   • Usuario: sa';
PRINT '   • Los usuarios por defecto serán creados automáticamente por la aplicación';
