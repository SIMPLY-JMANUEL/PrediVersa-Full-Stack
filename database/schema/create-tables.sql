-- ========================================
-- PrediVersa - Estructura de Tablas
-- Fecha: 22 de julio de 2025
-- Propósito: Definición completa de esquema de base de datos
-- NOTA: Solo estructura, SIN datos reales
-- ========================================

USE PrediVersa;
GO

-- ========================================
-- TABLA PRINCIPAL: usuarios
-- ========================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'usuarios')
BEGIN
    CREATE TABLE usuarios (
        -- Campos principales
        Id_Usuario INT IDENTITY(1,1) NOT NULL,
        Nombre_Completo NVARCHAR(255) NOT NULL,
        Correo NVARCHAR(255) NOT NULL,
        Usuario NVARCHAR(100) NOT NULL,
        Password NVARCHAR(255) NOT NULL,
        Perfil NVARCHAR(50) NOT NULL,
        
        -- Información personal
        Fecha_Nacimiento DATE NULL,
        Telefono NVARCHAR(20) NULL,
        Direccion NVARCHAR(500) NULL,
        Genero NVARCHAR(20) NULL,
        Estado_Civil NVARCHAR(30) NULL,
        Ocupacion NVARCHAR(100) NULL,
        Nivel_Educativo NVARCHAR(50) NULL,
        
        -- Metadatos del sistema
        Fecha_Registro DATETIME NOT NULL DEFAULT GETDATE(),
        Ultimo_Acceso DATETIME NULL,
        Estado_Cuenta NVARCHAR(20) NOT NULL DEFAULT 'activo',
        Intentos_Login INT NOT NULL DEFAULT 0,
        Fecha_Ultimo_Cambio_Password DATETIME NULL,
        
        -- Recuperación de contraseña
        Token_Recuperacion NVARCHAR(255) NULL,
        Fecha_Expiracion_Token DATETIME NULL,
        
        -- Configuraciones
        Preferencias_Notificacion NVARCHAR(MAX) NULL,
        
        -- Constraint de clave primaria
        CONSTRAINT PK_usuarios PRIMARY KEY (Id_Usuario)
    );
    
    PRINT '✅ Tabla usuarios creada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla usuarios ya existe';
END
GO

-- ========================================
-- ÍNDICES ÚNICOS
-- ========================================

-- Índice único para correo
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_usuarios_correo')
BEGIN
    CREATE UNIQUE INDEX IX_usuarios_correo ON usuarios(Correo);
    PRINT '✅ Índice único IX_usuarios_correo creado';
END

-- Índice único para usuario
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_usuarios_usuario')
BEGIN
    CREATE UNIQUE INDEX IX_usuarios_usuario ON usuarios(Usuario);
    PRINT '✅ Índice único IX_usuarios_usuario creado';
END

-- ========================================
-- ÍNDICES DE BÚSQUEDA
-- ========================================

-- Índice para perfil (búsquedas frecuentes por rol)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_usuarios_perfil')
BEGIN
    CREATE INDEX IX_usuarios_perfil ON usuarios(Perfil);
    PRINT '✅ Índice IX_usuarios_perfil creado';
END

-- Índice para estado de cuenta
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_usuarios_estado')
BEGIN
    CREATE INDEX IX_usuarios_estado ON usuarios(Estado_Cuenta);
    PRINT '✅ Índice IX_usuarios_estado creado';
END

-- Índice para fecha de registro
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_usuarios_fecha_registro')
BEGIN
    CREATE INDEX IX_usuarios_fecha_registro ON usuarios(Fecha_Registro);
    PRINT '✅ Índice IX_usuarios_fecha_registro creado';
END

-- Índice compuesto para login
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_usuarios_login')
BEGIN
    CREATE INDEX IX_usuarios_login ON usuarios(Usuario, Estado_Cuenta);
    PRINT '✅ Índice IX_usuarios_login creado';
END

-- ========================================
-- CHECK CONSTRAINTS
-- ========================================

-- Constraint para perfiles válidos
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_usuarios_perfil')
BEGIN
    ALTER TABLE usuarios ADD CONSTRAINT CK_usuarios_perfil 
    CHECK (Perfil IN ('admin', 'estudiante', 'profesor', 'padre', 'moderador'));
    PRINT '✅ Constraint CK_usuarios_perfil creado';
END

-- Constraint para estados válidos
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_usuarios_estado')
BEGIN
    ALTER TABLE usuarios ADD CONSTRAINT CK_usuarios_estado 
    CHECK (Estado_Cuenta IN ('activo', 'inactivo', 'suspendido', 'bloqueado', 'eliminado'));
    PRINT '✅ Constraint CK_usuarios_estado creado';
END

-- Constraint para género válido
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_usuarios_genero')
BEGIN
    ALTER TABLE usuarios ADD CONSTRAINT CK_usuarios_genero 
    CHECK (Genero IN ('Masculino', 'Femenino', 'Otro', 'Prefiero no decir') OR Genero IS NULL);
    PRINT '✅ Constraint CK_usuarios_genero creado';
END

-- Constraint para intentos de login
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_usuarios_intentos')
BEGIN
    ALTER TABLE usuarios ADD CONSTRAINT CK_usuarios_intentos 
    CHECK (Intentos_Login >= 0 AND Intentos_Login <= 10);
    PRINT '✅ Constraint CK_usuarios_intentos creado';
END

-- ========================================
-- TABLAS ADICIONALES (para futuras funcionalidades)
-- ========================================

-- Tabla para logs de actividad
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'logs_actividad')
BEGIN
    CREATE TABLE logs_actividad (
        Id_Log INT IDENTITY(1,1) PRIMARY KEY,
        Id_Usuario INT NOT NULL,
        Accion NVARCHAR(100) NOT NULL,
        Descripcion NVARCHAR(500) NULL,
        IP_Address NVARCHAR(45) NULL,
        User_Agent NVARCHAR(500) NULL,
        Fecha_Accion DATETIME NOT NULL DEFAULT GETDATE(),
        
        CONSTRAINT FK_logs_usuario FOREIGN KEY (Id_Usuario) 
        REFERENCES usuarios(Id_Usuario) ON DELETE CASCADE
    );
    
    CREATE INDEX IX_logs_usuario ON logs_actividad(Id_Usuario);
    CREATE INDEX IX_logs_fecha ON logs_actividad(Fecha_Accion);
    
    PRINT '✅ Tabla logs_actividad creada';
END

-- Tabla para sesiones activas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'sesiones_activas')
BEGIN
    CREATE TABLE sesiones_activas (
        Id_Sesion INT IDENTITY(1,1) PRIMARY KEY,
        Id_Usuario INT NOT NULL,
        Token_JWT NVARCHAR(500) NOT NULL,
        IP_Address NVARCHAR(45) NULL,
        User_Agent NVARCHAR(500) NULL,
        Fecha_Login DATETIME NOT NULL DEFAULT GETDATE(),
        Fecha_Expiracion DATETIME NOT NULL,
        Estado NVARCHAR(20) NOT NULL DEFAULT 'activa',
        
        CONSTRAINT FK_sesiones_usuario FOREIGN KEY (Id_Usuario) 
        REFERENCES usuarios(Id_Usuario) ON DELETE CASCADE
    );
    
    CREATE INDEX IX_sesiones_usuario ON sesiones_activas(Id_Usuario);
    CREATE INDEX IX_sesiones_token ON sesiones_activas(Token_JWT);
    CREATE INDEX IX_sesiones_estado ON sesiones_activas(Estado);
    
    PRINT '✅ Tabla sesiones_activas creada';
END

-- ========================================
-- FUNCIONES ÚTILES
-- ========================================

-- Función para obtener estadísticas de usuarios
IF OBJECT_ID('fn_estadisticas_usuarios') IS NOT NULL
    DROP FUNCTION fn_estadisticas_usuarios;
GO

CREATE FUNCTION fn_estadisticas_usuarios()
RETURNS TABLE
AS
RETURN
(
    SELECT 
        COUNT(*) as Total_Usuarios,
        SUM(CASE WHEN Estado_Cuenta = 'activo' THEN 1 ELSE 0 END) as Usuarios_Activos,
        SUM(CASE WHEN Perfil = 'admin' THEN 1 ELSE 0 END) as Administradores,
        SUM(CASE WHEN Perfil = 'estudiante' THEN 1 ELSE 0 END) as Estudiantes,
        SUM(CASE WHEN Perfil = 'profesor' THEN 1 ELSE 0 END) as Profesores,
        SUM(CASE WHEN Perfil = 'padre' THEN 1 ELSE 0 END) as Padres,
        SUM(CASE WHEN Perfil = 'moderador' THEN 1 ELSE 0 END) as Moderadores,
        SUM(CASE WHEN Ultimo_Acceso > DATEADD(day, -30, GETDATE()) THEN 1 ELSE 0 END) as Activos_Ultimo_Mes
    FROM usuarios
);
GO

PRINT '✅ Función fn_estadisticas_usuarios creada';

-- ========================================
-- TABLA: Alertas
-- ========================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Alertas')
BEGIN
    CREATE TABLE Alertas (
        Id_Alerta INT IDENTITY(1,1) PRIMARY KEY,
        Numero_Alerta AS 'ALR-' + RIGHT('000000' + CAST(Id_Alerta AS VARCHAR(6)), 6) PERSISTED,
        
        -- Información básica
        Tipo_Alerta NVARCHAR(100) NOT NULL,
        Fecha_Hora_Incidente DATETIME NOT NULL,
        Ubicacion NVARCHAR(255) NOT NULL,
        Requiere_Atencion_Inmediata NVARCHAR(10) NOT NULL,
        Es_Reiterativo NVARCHAR(10) NOT NULL,
        Canal_Reporte NVARCHAR(50) NOT NULL,
        
        -- Datos del reportado
        Nombre_Estudiante NVARCHAR(255) NULL,
        Identificacion_Estudiante NVARCHAR(50) NULL,
        Curso_Grado NVARCHAR(50) NULL,
        Edad_Reportado INT NULL,
        Tipo_Reportado NVARCHAR(100) NULL,
        
        -- Datos del reportante
        Nombre_Reportante NVARCHAR(255) NOT NULL,
        Identificacion_Reportante NVARCHAR(50) NOT NULL,
        Relacion_Reportado NVARCHAR(100) NULL,
        Telefono_Reportante NVARCHAR(20) NULL,
        Email_Reportante NVARCHAR(255) NULL,
        
        -- Contenido del reporte
        Categoria_Incidente NVARCHAR(100) NOT NULL,
        Descripcion_Detallada NVARCHAR(MAX) NOT NULL,
        Evidencias NVARCHAR(MAX) NULL,
        Testigos NVARCHAR(MAX) NULL,
        Contexto_Previo NVARCHAR(MAX) NULL,
        
        -- Gestión institucional
        Estado_Alerta NVARCHAR(50) NOT NULL,
        Prioridad NVARCHAR(50) NOT NULL,
        Coordinador_Asignado NVARCHAR(100) NULL,
        Observaciones_Preliminares NVARCHAR(MAX) NULL,
        
        -- Legalidad y privacidad
        Consentimiento_Informado BIT NOT NULL,
        Proteccion_Datos BIT NOT NULL,
        Cumplimiento_Normativo BIT NOT NULL,
        
        -- Metadatos
        Fecha_Registro DATETIME NOT NULL DEFAULT GETDATE(),
        Fecha_Actualizacion DATETIME NULL,
        Usuario_Id INT NULL,
        
        CONSTRAINT FK_Alertas_Usuario FOREIGN KEY (Usuario_Id) 
        REFERENCES usuarios(Id_Usuario) ON DELETE SET NULL
    );
    
    PRINT '✅ Tabla Alertas creada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla Alertas ya existe';
END
GO

-- Índices para Alertas
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Alertas_Estado')
BEGIN
    CREATE INDEX IX_Alertas_Estado ON Alertas(Estado_Alerta);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Alertas_Prioridad')
BEGIN
    CREATE INDEX IX_Alertas_Prioridad ON Alertas(Prioridad);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Alertas_Fecha')
BEGIN
    CREATE INDEX IX_Alertas_Fecha ON Alertas(Fecha_Registro);
END

PRINT '✅ Índices de Alertas creados';
GO

-- ========================================
-- PROCEDIMIENTOS ALMACENADOS
-- ========================================

-- Procedimiento para crear usuario
IF OBJECT_ID('sp_crear_usuario') IS NOT NULL
    DROP PROCEDURE sp_crear_usuario;
GO

CREATE PROCEDURE sp_crear_usuario
    @Nombre_Completo NVARCHAR(255),
    @Correo NVARCHAR(255),
    @Usuario NVARCHAR(100),
    @Password NVARCHAR(255),
    @Perfil NVARCHAR(50),
    @Resultado INT OUTPUT,
    @Mensaje NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Verificar si el correo ya existe
        IF EXISTS (SELECT 1 FROM usuarios WHERE Correo = @Correo)
        BEGIN
            SET @Resultado = 0;
            SET @Mensaje = 'El correo electrónico ya está registrado';
            RETURN;
        END
        
        -- Verificar si el usuario ya existe
        IF EXISTS (SELECT 1 FROM usuarios WHERE Usuario = @Usuario)
        BEGIN
            SET @Resultado = 0;
            SET @Mensaje = 'El nombre de usuario ya está en uso';
            RETURN;
        END
        
        -- Insertar el nuevo usuario
        INSERT INTO usuarios (Nombre_Completo, Correo, Usuario, Password, Perfil)
        VALUES (@Nombre_Completo, @Correo, @Usuario, @Password, @Perfil);
        
        SET @Resultado = 1;
        SET @Mensaje = 'Usuario creado exitosamente';
        
    END TRY
    BEGIN CATCH
        SET @Resultado = 0;
        SET @Mensaje = 'Error al crear usuario: ' + ERROR_MESSAGE();
    END CATCH
END
GO

PRINT '✅ Procedimiento sp_crear_usuario creado';

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger para registrar cambios en la tabla usuarios
IF OBJECT_ID('tr_usuarios_auditoria') IS NOT NULL
    DROP TRIGGER tr_usuarios_auditoria;
GO

CREATE TRIGGER tr_usuarios_auditoria
ON usuarios
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Registrar INSERT
    IF EXISTS (SELECT * FROM inserted) AND NOT EXISTS (SELECT * FROM deleted)
    BEGIN
        INSERT INTO logs_actividad (Id_Usuario, Accion, Descripcion)
        SELECT Id_Usuario, 'CREAR_USUARIO', 'Usuario creado: ' + Usuario
        FROM inserted;
    END
    
    -- Registrar UPDATE
    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        INSERT INTO logs_actividad (Id_Usuario, Accion, Descripcion)
        SELECT i.Id_Usuario, 'ACTUALIZAR_USUARIO', 'Usuario actualizado: ' + i.Usuario
        FROM inserted i;
    END
    
    -- Registrar DELETE
    IF EXISTS (SELECT * FROM deleted) AND NOT EXISTS (SELECT * FROM inserted)
    BEGIN
        INSERT INTO logs_actividad (Id_Usuario, Accion, Descripcion)
        SELECT Id_Usuario, 'ELIMINAR_USUARIO', 'Usuario eliminado: ' + Usuario
        FROM deleted;
    END
END
GO

PRINT '✅ Trigger tr_usuarios_auditoria creado';

-- ========================================
-- VISTA PARA CONSULTAS FRECUENTES
-- ========================================

-- Vista de usuarios activos con información básica
IF OBJECT_ID('vw_usuarios_activos') IS NOT NULL
    DROP VIEW vw_usuarios_activos;
GO

CREATE VIEW vw_usuarios_activos
AS
SELECT 
    Id_Usuario,
    Nombre_Completo,
    Correo,
    Usuario,
    Perfil,
    Fecha_Registro,
    Ultimo_Acceso,
    DATEDIFF(day, Ultimo_Acceso, GETDATE()) as Dias_Sin_Acceso,
    CASE 
        WHEN Ultimo_Acceso IS NULL THEN 'Nunca'
        WHEN Ultimo_Acceso > DATEADD(day, -1, GETDATE()) THEN 'Hoy'
        WHEN Ultimo_Acceso > DATEADD(day, -7, GETDATE()) THEN 'Esta semana'
        WHEN Ultimo_Acceso > DATEADD(day, -30, GETDATE()) THEN 'Este mes'
        ELSE 'Hace más de un mes'
    END as Estado_Actividad
FROM usuarios
WHERE Estado_Cuenta = 'activo';
GO

PRINT '✅ Vista vw_usuarios_activos creada';

-- ========================================
-- INFORMACIÓN FINAL
-- ========================================

PRINT '🎉 ¡Estructura de base de datos PrediVersa creada exitosamente!';
PRINT '';
PRINT '📊 Resumen de objetos creados:';
PRINT '  • 3 Tablas: usuarios, logs_actividad, sesiones_activas';
PRINT '  • 6 Índices para optimización';
PRINT '  • 4 Check constraints para validación';
PRINT '  • 1 Función: fn_estadisticas_usuarios';
PRINT '  • 1 Procedimiento: sp_crear_usuario';
PRINT '  • 1 Trigger: tr_usuarios_auditoria';
PRINT '  • 1 Vista: vw_usuarios_activos';
PRINT '';
PRINT '🔧 Próximo paso: Ejecutar seed/demo-data.sql para datos de prueba';
PRINT '📚 Documentación: Ver MAPA_ENTIDAD_USUARIO.md para más detalles';

-- Mostrar estadísticas iniciales
SELECT * FROM fn_estadisticas_usuarios();
