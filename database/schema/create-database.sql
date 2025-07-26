-- ========================================
-- PrediVersa - Script de Creación de Base de Datos
-- Fecha: 22 de julio de 2025
-- Propósito: Configuración inicial para desarrollo
-- ========================================

-- Crear base de datos
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'PrediVersa')
BEGIN
    CREATE DATABASE PrediVersa;
    PRINT '✅ Base de datos PrediVersa creada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ Base de datos PrediVersa ya existe';
END
GO

-- Usar la base de datos
USE PrediVersa;
GO

-- Crear login y usuario para la aplicación
IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name = 'prediversa_user')
BEGIN
    CREATE LOGIN prediversa_user WITH PASSWORD = 'Prediversa123!';
    PRINT '✅ Login prediversa_user creado';
END
ELSE
BEGIN
    PRINT '⚠️ Login prediversa_user ya existe';
END

-- Crear usuario en la base de datos
IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = 'prediversa_user')
BEGIN
    CREATE USER prediversa_user FOR LOGIN prediversa_user;
    PRINT '✅ Usuario prediversa_user creado en la base de datos';
END
ELSE
BEGIN
    PRINT '⚠️ Usuario prediversa_user ya existe en la base de datos';
END

-- Otorgar permisos
ALTER ROLE db_datareader ADD MEMBER prediversa_user;
ALTER ROLE db_datawriter ADD MEMBER prediversa_user;
GRANT EXECUTE TO prediversa_user;

PRINT '✅ Permisos otorgados a prediversa_user';
PRINT '🎉 Configuración de base de datos completada';

-- Información del sistema
SELECT 
    GETDATE() as FechaCreacion,
    SYSTEM_USER as UsuarioSistema,
    DB_NAME() as BaseDatos,
    @@VERSION as VersionSQL;
