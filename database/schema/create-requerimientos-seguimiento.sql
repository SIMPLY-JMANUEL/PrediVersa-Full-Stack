-- Migración: Crear tabla Requerimientos_Seguimiento
-- Propósito: Almacenar el seguimiento de requerimientos asociados a alertas y casos

CREATE TABLE IF NOT EXISTS Requerimientos_Seguimiento (
  Id_Requerimiento INT AUTO_INCREMENT PRIMARY KEY,
  Id_Alerta INT NULL,
  Numero_Alerta VARCHAR(20) NULL,
  Numero_Caso VARCHAR(50) NULL,
  Fecha_Requerimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
  Descripcion_Requerimiento LONGTEXT NOT NULL,
  Estado_Requerimiento VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  Prioridad VARCHAR(20) NOT NULL DEFAULT 'normal',
  Fecha_Limite DATETIME NULL,
  Profesional_Asignado VARCHAR(255) NULL,
  Fecha_Seguimiento DATETIME NULL,
  Resultado_Seguimiento LONGTEXT NULL,
  Porcentaje_Completitud INT DEFAULT 0,
  Acciones_Tomadas LONGTEXT NULL,
  Proximas_Acciones LONGTEXT NULL,
  Requiere_Seguimiento_Adicional VARCHAR(10) NULL,
  Fecha_Proximo_Seguimiento DATETIME NULL,
  Intervinientes JSON NULL,
  Evidencia_Documental LONGTEXT NULL,
  Observaciones LONGTEXT NULL,
  Usuario_Id INT NULL,
  Fecha_Actualizacion DATETIME NULL,
  
  INDEX idx_estado (Estado_Requerimiento),
  INDEX idx_alerta (Id_Alerta),
  INDEX idx_fecha (Fecha_Requerimiento),
  INDEX idx_prioridad (Prioridad),
  INDEX idx_usuario (Usuario_Id),
  INDEX idx_estado_fecha (Estado_Requerimiento, Fecha_Requerimiento DESC),
  
  FOREIGN KEY (Usuario_Id) REFERENCES usuarios(Id_Usuario) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estados posibles: pendiente, en_proceso, completado, cancelado, suspendido, derivado
-- Prioridades: baja, normal, alta, urgente

PRINT '✅ Tabla Requerimientos_Seguimiento creada exitosamente';
