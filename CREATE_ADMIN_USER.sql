-- Script SQL para crear usuario administrador
-- Ejecutar en SQL Server Management Studio o similar

-- Verificar si el usuario ya existe
SELECT COUNT(*) as count FROM Usuarios WHERE Nombre_Usuario = 'Admin';

-- Si no existe, crear el usuario
IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Nombre_Usuario = 'Admin')
BEGIN
    INSERT INTO Usuarios (
        Nombre_Usuario, 
        Correo_Electronico, 
        Nombre_Completo, 
        Contrasena_Hash, 
        Rol,
        Activo,
        Telefono,
        Direccion,
        Condicion_Especial
    ) VALUES (
        'Admin', 
        'admin@prediversa.com', 
        'Administrador PrediVersa', 
        '$2a$10$yQrYmsxA/iHExDbizYKGkOIsRvTBy4ph6YHNgS9BsflI.nR0w6naK', -- Hash de "123456789"
        'admin',
        1,
        '0000000000',
        'Dirección Administrativa',
        CONVERT(varbinary(50), 'Administrador')
    );
    
    PRINT 'Usuario administrador creado exitosamente';
END
ELSE
BEGIN
    -- Actualizar contraseña si ya existe
    UPDATE Usuarios 
    SET Contrasena_Hash = '$2a$10$yQrYmsxA/iHExDbizYKGkOIsRvTBy4ph6YHNgS9BsflI.nR0w6naK',
        Activo = 1
    WHERE Nombre_Usuario = 'Admin';
    
    PRINT 'Usuario administrador actualizado';
END

-- Verificar el usuario creado
SELECT Id_Usuario, Nombre_Usuario, Correo_Electronico, Nombre_Completo, Rol, Activo
FROM Usuarios 
WHERE Nombre_Usuario = 'Admin';

-- Credenciales para login:
-- Usuario: Admin
-- Contraseña: 123456789
