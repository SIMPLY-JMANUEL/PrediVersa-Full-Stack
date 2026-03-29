-- Tabla de remisiones de atención vinculadas a alertas
CREATE TABLE IF NOT EXISTS Remisiones (
  Id_Remision INT AUTO_INCREMENT PRIMARY KEY,
  Id_Alerta INT NULL,
  Numero_Alerta_Vinculada VARCHAR(50) NULL,
  Tipo_Alerta VARCHAR(100) NULL,
  Nombre_Estudiante VARCHAR(150) NULL,
  Edad VARCHAR(10) NULL,
  Grado_Cargo VARCHAR(50) NULL,
  Institucion_Sede VARCHAR(150) NULL,
  Descripcion_Breve TEXT NULL,
  Estado_Actual_Alerta VARCHAR(50) NULL,

  Fecha_Remision DATE NOT NULL,
  Motivo_Remision TEXT NULL,
  Area_Destino VARCHAR(100) NOT NULL,
  Entidad_Receptora VARCHAR(150) NULL,
  Profesional_Asignado VARCHAR(150) NULL,
  Estado_Remision VARCHAR(50) NOT NULL,
  Comentarios_Remitente TEXT NULL,

  Archivo_Adjunto JSON NULL,
  Notifico_Acudiente VARCHAR(10) NULL,
  Fecha_Hora_Cita DATETIME NULL,
  Observaciones_Seguimiento TEXT NULL,

  Usuario_Id INT NULL,
  Fecha_Registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Fecha_Actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_remision_alerta FOREIGN KEY (Id_Alerta) REFERENCES Alertas(Id_Alerta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
