-- ========================================
-- PrediVersa - Datos Estructurados Completos
-- Fecha: 23 de julio de 2025
-- Propósito: Crear usuarios estructurados según especificaciones
-- ========================================
USE PrediVersa;

GO PRINT '🧹 Iniciando limpieza y creación de datos estructurados...';

-- Limpiar datos actuales
DELETE FROM sesiones_activas;

DELETE FROM logs_actividad;

DELETE FROM usuarios;

-- Resetear contadores
DBCC CHECKIDENT ('usuarios', RESEED, 0);

PRINT '✅ Datos anteriores eliminados';

-- ========================================
-- USUARIOS ESTRUCTURADOS SEGÚN ESPECIFICACIÓN
-- ========================================
INSERT INTO
    usuarios (
        Nombre_Completo,
        Tipo_Documento,
        Identificacion,
        Telefono,
        Correo,
        Direccion,
        Usuario,
        Fecha_Nacimiento,
        Edad,
        Sexo,
        EPS,
        Perfil,
        Condicion_Especial,
        Descripción_Condicion_Especial,
        Contrasena,
        Contacto_Emergencia,
        Numero_Contacto_Emergencia,
        Activo
    )
VALUES
    -- ========================================
    -- ADMINISTRADORES (ID empiezan en 98)
    -- ========================================
    (
        'Administrador Azul',
        'Cedula de ciudadania',
        '98000001',
        '3201000001',
        'AD.01@prediversa.com',
        'CRR 01 CLL 01 Colombia',
        'AD.01',
        '1985-03-15',
        39,
        'Masculino',
        'EPS Sura',
        'admin',
        'Ninguna',
        'No aplica',
        'A1234567',
        'Contacto Rojo',
        '3202000001',
        1
    ),
    (
        'Administrador Rojo',
        'Cedula de ciudadania',
        '98000002',
        '3201000002',
        'AD.02@prediversa.com',
        'CRR 02 CLL 02 Colombia',
        'AD.02',
        '1980-07-22',
        44,
        'Femenino',
        'EPS Compensar',
        'admin',
        'Ninguna',
        'No aplica',
        'B1234567',
        'Contacto Verde',
        '3202000002',
        1
    ),
    -- ========================================
    -- MODERADORES (ID empiezan en 97)
    -- ========================================
    (
        'Moderador Verde',
        'Cedula de ciudadania',
        '97000001',
        '3201000003',
        'MO.01@prediversa.com',
        'CRR 03 CLL 03 Colombia',
        'MO.01',
        '1982-05-10',
        42,
        'Masculino',
        'EPS Salud Total',
        'moderador',
        'Ninguna',
        'No aplica',
        'C1234567',
        'Contacto Azul',
        '3202000003',
        1
    ),
    (
        'Moderador Amarillo',
        'Cedula de ciudadania',
        '97000002',
        '3201000004',
        'MO.02@prediversa.com',
        'CRR 04 CLL 04 Colombia',
        'MO.02',
        '1978-11-28',
        45,
        'Femenino',
        'EPS Nueva EPS',
        'moderador',
        'Ninguna',
        'No aplica',
        'D1234567',
        'Contacto Naranja',
        '3202000004',
        1
    ),
    -- ========================================
    -- PROFESORES (ID empiezan en 96)
    -- ========================================
    (
        'Profesor Naranja',
        'Cedula de ciudadania',
        '96000001',
        '3201000005',
        'PR.01@prediversa.com',
        'CRR 05 CLL 05 Colombia',
        'PR.01',
        '1975-09-12',
        48,
        'Masculino',
        'EPS Famisanar',
        'profesor',
        'Ninguna',
        'No aplica',
        'E1234567',
        'Contacto Rosa',
        '3202000005',
        1
    ),
    (
        'Profesor Rosa',
        'Cedula de ciudadania',
        '96000002',
        '3201000006',
        'PR.02@prediversa.com',
        'CRR 06 CLL 06 Colombia',
        'PR.02',
        '1983-02-18',
        41,
        'Femenino',
        'EPS Colsanitas',
        'profesor',
        'Ninguna',
        'No aplica',
        'F1234567',
        'Contacto Violeta',
        '3202000006',
        1
    ),
    -- ========================================
    -- ESTUDIANTES (ID empiezan en 95)
    -- ========================================
    (
        'Estudiante Violeta',
        'Cedula de ciudadania',
        '95000001',
        '3201000007',
        'ES.01@prediversa.com',
        'CRR 07 CLL 07 Colombia',
        'ES.01',
        '2005-06-25',
        19,
        'Femenino',
        'EPS Cafesalud',
        'estudiante',
        'Ninguna',
        'No aplica',
        'G1234567',
        'Contacto Gris',
        '3202000007',
        1
    ),
    (
        'Estudiante Gris',
        'Cedula de ciudadania',
        '95000002',
        '3201000008',
        'ES.02@prediversa.com',
        'CRR 08 CLL 08 Colombia',
        'ES.02',
        '2004-12-03',
        19,
        'Masculino',
        'EPS Medimas',
        'estudiante',
        'Ninguna',
        'No aplica',
        'H1234567',
        'Contacto Blanco',
        '3202000008',
        1
    ),
    -- ========================================
    -- PADRES/MADRES (ID empiezan en 94)
    -- ========================================
    (
        'Padre Blanco',
        'Cedula de ciudadania',
        '94000001',
        '3201000009',
        'PA.01@prediversa.com',
        'CRR 09 CLL 09 Colombia',
        'PA.01',
        '1972-04-14',
        52,
        'Masculino',
        'EPS Coomeva',
        'padre',
        'Ninguna',
        'No aplica',
        'I1234567',
        'Contacto Negro',
        '3202000009',
        1
    ),
    (
        'Madre Negro',
        'Cedula de ciudadania',
        '94000002',
        '3201000010',
        'PA.02@prediversa.com',
        'CRR 10 CLL 10 Colombia',
        'PA.02',
        '1976-08-30',
        47,
        'Femenino',
        'EPS Sanitas',
        'padre',
        'Ninguna',
        'No aplica',
        'J1234567',
        'Contacto Dorado',
        '3202000010',
        1
    );

PRINT '✅ 10 usuarios estructurados insertados exitosamente';

-- ========================================
-- LOGS DE ACTIVIDAD INICIALES
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
        'Mozilla/5.0 (Windows)',
        DATEADD (hour, -2, GETDATE ())
    ),
    (
        7,
        'LOGIN',
        'Inicio de sesión exitoso',
        '192.168.1.102',
        'Mozilla/5.0 (Mobile)',
        DATEADD (hour, -1, GETDATE ())
    );

PRINT '✅ Logs de actividad iniciales creados';

-- ========================================
-- INFORMACIÓN FINAL
-- ========================================
PRINT '🎉 ¡Datos estructurados creados exitosamente!';

PRINT '';

PRINT '📊 Resumen de usuarios creados:';

PRINT '  🔑 Administradores: AD.01, AD.02';

PRINT '  🛡️ Moderadores: MO.01, MO.02';

PRINT '  👨‍🏫 Profesores: PR.01, PR.02';

PRINT '  🎓 Estudiantes: ES.01, ES.02';

PRINT '  👨‍👩‍👧‍👦 Padres: PA.01, PA.02';

PRINT '';

PRINT '🔐 Patrón de contraseñas: [LETRA][7 NÚMEROS]';

PRINT '📧 Dominio de correos: @prediversa.com';

PRINT '🏠 Direcciones: CRR [##] CLL [##] Colombia';

PRINT '📱 Teléfonos: 320100000[#]';

PRINT '';

PRINT '✅ ESTRUCTURA COMPLETA Y LISTA PARA USO';

-- Mostrar resumen final
SELECT
    Id_Usuario as ID,
    Nombre_Completo as Nombre,
    Usuario,
    Correo,
    Perfil,
    Telefono,
    Direccion
FROM
    usuarios
ORDER BY
    Id_Usuario;