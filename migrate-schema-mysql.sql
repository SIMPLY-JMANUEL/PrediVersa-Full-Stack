-- PrediVersa Database Migration to MySQL
-- Generated: 2026-01-18

DROP DATABASE IF EXISTS PrediVersa;
CREATE DATABASE PrediVersa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE PrediVersa;

-- Tabla: Usuarios
CREATE TABLE Usuarios (
  Id_Usuario INT AUTO_INCREMENT PRIMARY KEY,
  Nombre_Completo VARCHAR(255),
  Tipo_Documento VARCHAR(50),
  Identificacion VARCHAR(50),
  Telefono VARCHAR(50),
  Correo VARCHAR(100),
  Direccion VARCHAR(255),
  Usuario VARCHAR(50) NOT NULL UNIQUE,
  Fecha_Nacimiento DATE,
  Edad INT,
  Sexo VARCHAR(20),
  EPS VARCHAR(100),
  Perfil VARCHAR(50),
  Condicion_Especial VARCHAR(255),
  Descripcion_Condicion_Especial TEXT,
  Contrasena VARCHAR(255) NOT NULL,
  Contacto_Emergencia VARCHAR(255),
  Numero_Contacto_Emergencia VARCHAR(50),
  Activo VARCHAR(2) DEFAULT 'Si',
  Foto LONGBLOB,
  Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario (Usuario),
  INDEX idx_perfil (Perfil),
  INDEX idx_activo (Activo)
) ENGINE=InnoDB;

-- Tabla: TiposDocumento
CREATE TABLE TiposDocumento (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(50) NOT NULL,
  Codigo VARCHAR(10) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Tabla: Generos
CREATE TABLE Generos (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- Tabla: EstadoCivil
CREATE TABLE EstadoCivil (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- Tabla: EPS
CREATE TABLE EPS (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(100) NOT NULL,
  Codigo VARCHAR(20)
) ENGINE=InnoDB;

-- Tabla: Instituciones
CREATE TABLE Instituciones (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(255) NOT NULL,
  Direccion VARCHAR(255),
  Telefono VARCHAR(50),
  Email VARCHAR(100)
) ENGINE=InnoDB;

-- Tabla: Grados
CREATE TABLE Grados (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(50) NOT NULL,
  Nivel VARCHAR(50)
) ENGINE=InnoDB;

-- Tabla: TiposPQR
CREATE TABLE TiposPQR (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(100) NOT NULL,
  Descripcion TEXT
) ENGINE=InnoDB;

-- Tabla: NivelesUrgencia
CREATE TABLE NivelesUrgencia (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(50) NOT NULL,
  Nivel INT
) ENGINE=InnoDB;

-- Tabla: PQR
CREATE TABLE PQR (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Tipo_PQR_Id INT,
  Usuario_Id INT,
  Titulo VARCHAR(255) NOT NULL,
  Descripcion TEXT,
  Nivel_Urgencia_Id INT,
  Estado VARCHAR(50) DEFAULT 'Pendiente',
  Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Fecha_Actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (Tipo_PQR_Id) REFERENCES TiposPQR(Id),
  FOREIGN KEY (Usuario_Id) REFERENCES Usuarios(Id_Usuario),
  FOREIGN KEY (Nivel_Urgencia_Id) REFERENCES NivelesUrgencia(Id)
) ENGINE=InnoDB;

-- Tabla: Formulario
CREATE TABLE Formulario (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Usuario_Id INT,
  Datos_JSON TEXT,
  Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Usuario_Id) REFERENCES Usuarios(Id_Usuario)
) ENGINE=InnoDB;

-- Tabla: Evaluaciones
CREATE TABLE Evaluaciones (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Usuario_Id INT,
  Tipo VARCHAR(100),
  Resultado_JSON TEXT,
  Fecha_Evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Usuario_Id) REFERENCES Usuarios(Id_Usuario)
) ENGINE=InnoDB;

-- Tabla: Alertas
CREATE TABLE Alertas (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Usuario_Id INT,
  Tipo_Alerta VARCHAR(100),
  Mensaje TEXT,
  Nivel VARCHAR(20),
  Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Leida BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (Usuario_Id) REFERENCES Usuarios(Id_Usuario)
) ENGINE=InnoDB;

-- Tabla: ReportesEstudiantes
CREATE TABLE ReportesEstudiantes (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Estudiante_Id INT,
  Docente_Id INT,
  Tipo_Reporte VARCHAR(100),
  Descripcion TEXT,
  Fecha_Reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Estudiante_Id) REFERENCES Usuarios(Id_Usuario),
  FOREIGN KEY (Docente_Id) REFERENCES Usuarios(Id_Usuario)
) ENGINE=InnoDB;
