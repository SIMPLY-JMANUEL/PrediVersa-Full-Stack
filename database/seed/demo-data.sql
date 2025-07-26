-- ========================================
-- PrediVersa - Datos de Demostración
-- Fecha: 22 de julio de 2025
-- Propósito: Datos ficticios para testing y desarrollo
-- IMPORTANTE: Estos NO son datos reales de usuarios
-- ========================================
USE PrediVersa;

GO PRINT '🚀 Iniciando inserción de datos de demostración...';

-- ========================================
-- LIMPIAR DATOS EXISTENTES (solo para demo)
-- ========================================
-- Desactivar temporalmente las restricciones de FK
ALTER TABLE logs_actividad NOCHECK CONSTRAINT FK_logs_usuario;

ALTER TABLE sesiones_activas NOCHECK CONSTRAINT FK_sesiones_usuario;

-- Limpiar datos existentes
DELETE FROM sesiones_activas;

DELETE FROM logs_actividad;

DELETE FROM usuarios;

-- Reactivar restricciones
ALTER TABLE logs_actividad CHECK CONSTRAINT FK_logs_usuario;

ALTER TABLE sesiones_activas CHECK CONSTRAINT FK_sesiones_usuario;

-- Resetear IDENTITY
DBCC CHECKIDENT ('usuarios', RESEED, 0);

DBCC CHECKIDENT ('logs_actividad', RESEED, 0);

DBCC CHECKIDENT ('sesiones_activas', RESEED, 0);

PRINT '🧹 Datos anteriores eliminados (solo para demo)';

-- ========================================
-- USUARIOS DE DEMOSTRACIÓN
-- ========================================
-- Contraseñas hasheadas con BCrypt (todas son: "Demo123!")
-- Hash: $2b$10$rOaU7aGJzKj.8h5Y4K0.6uXK9qE8K.4hGJ.9wE2p.8QfW1fE3fJqC
INSERT INTO
    usuarios (
        Nombre_Completo,
        Correo,
        Usuario,
        Password,
        Perfil,
        Fecha_Nacimiento,
        Telefono,
        Direccion,
        Genero,
        Estado_Civil,
        Ocupacion,
        Nivel_Educativo,
        Ultimo_Acceso
    )
VALUES
    -- ADMINISTRADOR
    (
        'Juan Carlos Administrador',
        'admin@prediversa-demo.com',
        'admin_demo',
        '$2b$10$rOaU7aGJzKj.8h5Y4K0.6uXK9qE8K.4hGJ.9wE2p.8QfW1fE3fJqC',
        'admin',
        '1985-03-15',
        '+57 300 123 4567',
        'Calle 123 #45-67, Bogotá, Colombia',
        'Masculino',
        'Casado',
        'Administrador de Sistemas',
        'Ingeniería de Sistemas',
        DATEADD (hour, -2, GETDATE ())
    ),
    -- PROFESORES
    (
        'María Elena Rodríguez',
        'profesora.maria@prediversa-demo.com',
        'prof_maria',
        '$2b$10$rOaU7aGJzKj.8h5Y4K0.6uXK9qE8K.4hGJ.9wE2p.8QfW1fE3fJqC',
        'profesor',
        '1978-08-22',
        '+57 310 234 5678',
        'Carrera 45 #12-34, Medellín, Colombia',
        'Femenino',
        'Casado',
        'Docente de Primaria',
        'Licenciatura en Educación',
        DATEADD (hour, -5, GETDATE ())
    ),
    (
        'Carlos Andrés Jiménez',
        'profesor.carlos@prediversa-demo.com',
        'prof_carlos',
        '$2b$10$rOaU7aGJzKj.8h5Y4K0.6uXK9qE8K.4hGJ.9wE2p.8QfW1fE3fJqC',
        'profesor',
        '1982-12-10',
        '+57 320 345 6789',
        'Avenida 80 #23-45, Cali, Colombia',
        'Masculino',
        'Soltero',
        'Docente de Secundaria',
        'Licenciatura en Matemáticas',
        DATEADD (day, -1, GETDATE ())
    ),
    -- ESTUDIANTES
    (
        'Ana Sofía González',
        'estudiante.ana@prediversa-demo.com',
        'est_ana',
        '$2b$10$rOaU7aGJzKj.8h5Y4K0.6uXK9qE8K.4hGJ.9wE2p.8QfW1fE3fJqC',
        'estudiante',
        '2005-06-18',
        '+57 315 456 7890',
        'Calle 67 #34-56, Barranquilla, Colombia',
        'Femenino',
        'Soltero',
        'Estudiante',
        'Bachillerato',
        DATEADD (hour, -1, GETDATE ())
    ),
    (
        'Diego Alejandro Morales',
        'estudiante.diego@prediversa-demo.com',
        'est_diego',
        '$2b$10$rOaU7aGJzKj.8h5Y4K0.6uXK9qE8K.4hGJ.9wE2p.8QfW1fE3fJqC',
        'estudiante',
        '2004-11-25',
        '+57 325 567 8901',
        'Transversal 12 #78-90, Bucaramanga, Colombia',
        'Masculino',
        'Soltero',
        'Estudiante',
        'Bachillerato',
        DATEADD (hour, -8, GETDATE ())
    ),
    (
        'Isabella Martínez López',
        'estudiante.isabella@prediversa-demo.com',
        'est_isabella',
        '$2b$10$rOaU7aGJzKj.8h5Y4K0.6uXK9qE8K.4hGJ.9wE2p.8QfW1fE3fJqC',
        'estudiante',
        '2006-02-14',
        '+57 335 678 9012',
        'Diagonal 25 #56-78, Cartagena, Colombia',
        'Femenino',
        'Soltero',
        'Estudiante',
        'Bachillerato',
        DATEADD (day, -2, GETDATE ())
    ),
    -- PADRES DE FAMILIA
    (
        'Roberto Carlos Pérez',
        'padre.roberto@prediversa-demo.com',
        'padre_roberto',
        '$2b$10$rOaU7aGJzKj.8h5Y4K0.6uXK9qE8K.4hGJ.9wE2p.8QfW1fE3fJqC',
        'padre',
        '1975-09-08',
        '+57 312 789 0123',
        'Calle 89 #12-23, Pereira, Colombia',
        'Masculino',
        'Casado',
        'Ingeniero Civil',
        'Ingeniería Civil',
        DATEADD (day, -3, GETDATE ())
    ),
    (
        'Liliana Patricia Vásquez',
        'madre.liliana@prediversa-demo.com',
        'madre_liliana',
        '$2b$10$rOaU7aGJzKj.8h5Y4K0.6uXK9qE8K.4hGJ.9wE2p.8QfW1fE3fJqC',
        'padre',
        '1980-04-30',
        '+57 322 890 1234',
        'Carrera 34 #67-89, Manizales, Colombia',
        'Femenino',
        'Casado',
        'Psicóloga',
        'Psicología',
        DATEADD (hour, -12, GETDATE ())
    ),
    -- MODERADOR
    (
        'Sandra Milena Torres',
        'moderadora.sandra@prediversa-demo.com',
        'mod_sandra',
        '$2b$10$rOaU7aGJzKj.8h5Y4K0.6uXK9qE8K.4hGJ.9wE2p.8QfW1fE3fJqC',
        'moderador',
        '1983-07-16',
        '+57 318 901 2345',
        'Avenida 15 #45-67, Ibagué, Colombia',
        'Femenino',
        'Soltero',
        'Coordinadora Académica',
        'Especialización en Educación',
        DATEADD (hour, -4, GETDATE ())
    );

PRINT '✅ Usuarios de demostración insertados exitosamente';

-- ========================================
-- LOGS DE ACTIVIDAD DE DEMOSTRACIÓN
-- ========================================
INSERT INTO
    logs_actividad (
        Id_Usuario,
        Accion,
        Descripcion,
        IP_Address,
        User_Agent,
        Fecha_Accion
    )
VALUES
    (
        1,
        'LOGIN',
        'Inicio de sesión exitoso',
        '192.168.1.100',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        DATEADD (hour, -2, GETDATE ())
    ),
    (
        1,
        'CREAR_USUARIO',
        'Usuario creado: est_ana',
        '192.168.1.100',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        DATEADD (hour, -1, GETDATE ())
    ),
    (
        2,
        'LOGIN',
        'Inicio de sesión exitoso',
        '192.168.1.101',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        DATEADD (hour, -5, GETDATE ())
    ),
    (
        4,
        'LOGIN',
        'Inicio de sesión exitoso',
        '192.168.1.102',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        DATEADD (hour, -1, GETDATE ())
    ),
    (
        5,
        'LOGIN',
        'Inicio de sesión exitoso',
        '192.168.1.103',
        'Mozilla/5.0 (Android 10; Mobile)',
        DATEADD (hour, -8, GETDATE ())
    );

PRINT '✅ Logs de actividad de demostración insertados';

-- ========================================
-- SESIONES ACTIVAS DE DEMOSTRACIÓN
-- ========================================
INSERT INTO
    sesiones_activas (
        Id_Usuario,
        Token_JWT,
        IP_Address,
        User_Agent,
        Fecha_Login,
        Fecha_Expiracion
    )
VALUES
    (
        1,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo.token.admin',
        '192.168.1.100',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        DATEADD (hour, -2, GETDATE ()),
        DATEADD (hour, 22, GETDATE ())
    ),
    (
        4,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo.token.student',
        '192.168.1.102',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        DATEADD (hour, -1, GETDATE ()),
        DATEADD (hour, 23, GETDATE ())
    );

PRINT '✅ Sesiones activas de demostración insertadas';

-- ========================================
-- INFORMACIÓN FINAL Y ESTADÍSTICAS
-- ========================================
PRINT '🎉 ¡Datos de demostración insertados exitosamente!';

PRINT '';

PRINT '📊 Resumen de datos creados:';

-- Mostrar estadísticas usando la función creada
SELECT
    *
FROM
    fn_estadisticas_usuarios ();

PRINT '';

PRINT '👥 Usuarios de prueba creados:';

PRINT '  🔑 Admin: admin_demo / Demo123!';

PRINT '  👨‍🏫 Profesor: prof_maria / Demo123!';

PRINT '  👨‍🏫 Profesor: prof_carlos / Demo123!';

PRINT '  🎓 Estudiante: est_ana / Demo123!';

PRINT '  🎓 Estudiante: est_diego / Demo123!';

PRINT '  🎓 Estudiante: est_isabella / Demo123!';

PRINT '  👨‍👩‍👧‍👦 Padre: padre_roberto / Demo123!';

PRINT '  👨‍👩‍👧‍👦 Madre: madre_liliana / Demo123!';

PRINT '  🛡️ Moderador: mod_sandra / Demo123!';

PRINT '';

PRINT '🔐 Todas las contraseñas son: Demo123!';

PRINT '📧 Correos: [usuario]@prediversa-demo.com';

PRINT '🌍 Ubicaciones: Diversas ciudades de Colombia';

PRINT '';

PRINT '⚠️ IMPORTANTE: Estos son datos FICTICIOS para desarrollo y testing';

PRINT '❌ NO usar en ambiente de producción con datos reales';

PRINT '';

PRINT '🚀 Sistema listo para desarrollo y pruebas!';

-- Mostrar algunos registros para verificación
SELECT
    TOP 5 Id_Usuario,
    Nombre_Completo,
    Usuario,
    Perfil,
    Fecha_Registro,
    Estado_Cuenta
FROM
    usuarios
ORDER BY
    Id_Usuario;