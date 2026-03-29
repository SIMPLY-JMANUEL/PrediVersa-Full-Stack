-- ========================================
-- PrediVersa - Tabla Alertas para MySQL/AWS RDS
-- ========================================

USE PrediVersa;

-- Crear tabla Alertas
CREATE TABLE IF NOT EXISTS Alertas (
    Id_Alerta INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Información básica
    Tipo_Alerta VARCHAR(100) NOT NULL,
    Fecha_Hora_Incidente DATETIME NOT NULL,
    Ubicacion VARCHAR(255) NOT NULL,
    Requiere_Atencion_Inmediata VARCHAR(10) NOT NULL,
    Es_Reiterativo VARCHAR(10) NOT NULL,
    Canal_Reporte VARCHAR(50) NOT NULL,
    
    -- Datos del reportado
    Nombre_Estudiante VARCHAR(255) NULL,
    Identificacion_Estudiante VARCHAR(50) NULL,
    Curso_Grado VARCHAR(50) NULL,
    Edad_Reportado INT NULL,
    Tipo_Reportado VARCHAR(100) NULL,
    
    -- Datos del reportante
    Nombre_Reportante VARCHAR(255) NOT NULL,
    Identificacion_Reportante VARCHAR(50) NOT NULL,
    Relacion_Reportado VARCHAR(100) NULL,
    Telefono_Reportante VARCHAR(20) NULL,
    Email_Reportante VARCHAR(255) NULL,
    
    -- Contenido del reporte
    Categoria_Incidente VARCHAR(100) NOT NULL,
    Descripcion_Detallada LONGTEXT NOT NULL,
    Evidencias LONGTEXT NULL,
    Testigos LONGTEXT NULL,
    Contexto_Previo LONGTEXT NULL,
    
    -- Gestión institucional
    Estado_Alerta VARCHAR(50) NOT NULL,
    Prioridad VARCHAR(50) NOT NULL,
    Coordinador_Asignado VARCHAR(100) NULL,
    Observaciones_Preliminares LONGTEXT NULL,
    
    -- Legalidad y privacidad
    Consentimiento_Informado TINYINT(1) NOT NULL,
    Proteccion_Datos TINYINT(1) NOT NULL,
    Cumplimiento_Normativo TINYINT(1) NOT NULL,
    
    -- Metadatos
    Fecha_Registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Fecha_Actualizacion DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    Usuario_Id INT NULL,
    
    -- Índices
    INDEX idx_estado (Estado_Alerta),
    INDEX idx_prioridad (Prioridad),
    INDEX idx_fecha (Fecha_Registro),
    INDEX idx_usuario (Usuario_Id),
    
    -- Foreign key (opcional)
    CONSTRAINT FK_Alertas_Usuario FOREIGN KEY (Usuario_Id) 
        REFERENCES usuarios(Id_Usuario) ON DELETE SET NULL
);

-- Generar número de alerta calculado
CREATE TRIGGER IF NOT EXISTS tr_alerta_numero
BEFORE INSERT ON Alertas
FOR EACH ROW
BEGIN
    SET NEW.Numero_Alerta = CONCAT('ALR-', LPAD(NEW.Id_Alerta, 6, '0'));
END;

-- Crear vista para acceder al número de alerta
CREATE OR REPLACE VIEW vw_Alertas AS
SELECT 
    Id_Alerta,
    CONCAT('ALR-', LPAD(Id_Alerta, 6, '0')) AS Numero_Alerta,
    Tipo_Alerta,
    Fecha_Hora_Incidente,
    Ubicacion,
    Requiere_Atencion_Inmediata,
    Es_Reiterativo,
    Canal_Reporte,
    Nombre_Estudiante,
    Identificacion_Estudiante,
    Curso_Grado,
    Edad_Reportado,
    Tipo_Reportado,
    Nombre_Reportante,
    Identificacion_Reportante,
    Relacion_Reportado,
    Telefono_Reportante,
    Email_Reportante,
    Categoria_Incidente,
    Descripcion_Detallada,
    Evidencias,
    Testigos,
    Contexto_Previo,
    Estado_Alerta,
    Prioridad,
    Coordinador_Asignado,
    Observaciones_Preliminares,
    Consentimiento_Informado,
    Proteccion_Datos,
    Cumplimiento_Normativo,
    Fecha_Registro,
    Fecha_Actualizacion,
    Usuario_Id
FROM Alertas;

-- Mensaje de éxito
SELECT 'A✅ Tabla Alertas creada exitosamente en MySQL' AS resultado;
