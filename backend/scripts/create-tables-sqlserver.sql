-- Script para crear las tablas de PrediVersa en SQL Server
USE PrediVersa;

GO
-- Crear tabla de usuarios
IF NOT EXISTS (
    SELECT
        *
    FROM
        sysobjects
    WHERE
        name = 'usuarios'
        AND xtype = 'U'
) BEGIN
CREATE TABLE
    usuarios (
        id INT IDENTITY (1, 1) PRIMARY KEY,
        nombre NVARCHAR (100) NOT NULL,
        correo NVARCHAR (150) NOT NULL UNIQUE,
        usuario NVARCHAR (50) NOT NULL UNIQUE,
        password NVARCHAR (255) NOT NULL,
        rol NVARCHAR (20) NOT NULL CHECK (
            rol IN (
                'admin',
                'estudiante',
                'profesor',
                'padre',
                'moderador'
            )
        ),
        activo BIT NOT NULL DEFAULT 1,
        fecha_registro DATETIME2 DEFAULT GETDATE (),
        ultimo_acceso DATETIME2 NULL
    );

PRINT 'Tabla usuarios creada exitosamente';

END ELSE BEGIN PRINT 'Tabla usuarios ya existe';

END GO
-- Insertar usuarios por defecto
IF NOT EXISTS (
    SELECT
        *
    FROM
        usuarios
    WHERE
        correo = 'admin@prediversa.com'
) BEGIN
INSERT INTO
    usuarios (nombre, correo, usuario, password, rol, activo)
VALUES
    (
        'Administrador',
        'admin@prediversa.com',
        'admin',
        'admin123',
        'admin',
        1
    ),
    (
        'Estudiante Test',
        'estudiante@prediversa.com',
        'estudiante',
        'admin123',
        'estudiante',
        1
    ),
    (
        'Profesor Test',
        'profesor@prediversa.com',
        'profesor',
        'admin123',
        'profesor',
        1
    ),
    (
        'Padre Test',
        'padre@prediversa.com',
        'padre',
        'admin123',
        'padre',
        1
    ),
    (
        'Moderador Test',
        'moderador@prediversa.com',
        'moderador',
        'admin123',
        'moderador',
        1
    ),
    (
        'Admin Master',
        'Admin@prediversa.com',
        'Admin',
        '123456789',
        'admin',
        1
    );

PRINT 'Usuarios por defecto insertados';

END ELSE BEGIN PRINT 'Usuarios por defecto ya existen';

END GO
-- Verificar datos insertados
SELECT
    id,
    nombre,
    correo,
    usuario,
    rol,
    activo,
    fecha_registro
FROM
    usuarios
ORDER BY
    id;

GO