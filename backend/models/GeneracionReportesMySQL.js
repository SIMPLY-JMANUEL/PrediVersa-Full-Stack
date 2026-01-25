const { pool } = require('../config/database-mysql');

class GeneracionReportesMySQL {
  // Crear un nuevo reporte
  static async createReporte(reporteData) {
    const {
      numeroIncidente,
      fechaIngreso,
      estadoAlerta,
      tipoAlerta,
      nivelGravedad,
      atencionInmediata,
      institucionSede,
      nombreEstudiante,
      gradoGrupo,
      lugarSuceso,
      fechaHoraSuceso,
      nombreCompleto,
      tipoDocumento,
      numeroDocumento,
      fechaNacimiento,
      edad,
      sexoGenero,
      estadoCivil,
      correoElectronico,
      telefonoContacto,
      direccionResidencia,
      responsableAsignado,
      descripcionDetallada,
      medidasTomadas,
      contactoFamiliar,
      nombreFamiliar,
      telefonoFamiliar,
      archivosAdjuntos,
      observacionesAdicionales,
      usuarioId
    } = reporteData;

    // Normalizadores
    const toNull = (v) => (v === undefined || v === null || v === '' ? null : v);
    const toIntOrNull = (v) => {
      if (v === undefined || v === null || v === '') return null;
      const n = parseInt(v, 10);
      return Number.isNaN(n) ? null : n;
    };

    const sql = `
      INSERT INTO GeneracionReportes (
        Numero_Incidente,
        Fecha_Ingreso,
        Estado_Alerta,
        Tipo_Alerta,
        Nivel_Gravedad,
        Atencion_Inmediata,
        Institucion_Sede,
        Nombre_Estudiante,
        Grado_Grupo,
        Lugar_Suceso,
        Fecha_Hora_Suceso,
        Nombre_Completo,
        Tipo_Documento,
        Numero_Documento,
        Fecha_Nacimiento,
        Edad,
        Sexo_Genero,
        Estado_Civil,
        Correo_Electronico,
        Telefono_Contacto,
        Direccion_Residencia,
        Responsable_Asignado,
        Descripcion_Detallada,
        Medidas_Tomadas,
        Contacto_Familiar,
        Nombre_Familiar,
        Telefono_Familiar,
        Archivos_Adjuntos,
        Observaciones_Adicionales,
        Usuario_Id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      toNull(numeroIncidente),
      toNull(fechaIngreso),
      toNull(estadoAlerta),
      toNull(tipoAlerta),
      toNull(nivelGravedad),
      toNull(atencionInmediata),
      toNull(institucionSede),
      toNull(nombreEstudiante),
      toNull(gradoGrupo),
      toNull(lugarSuceso),
      toNull(fechaHoraSuceso),
      toNull(nombreCompleto),
      toNull(tipoDocumento),
      toNull(numeroDocumento),
      toNull(fechaNacimiento),
      toIntOrNull(edad),
      toNull(sexoGenero),
      toNull(estadoCivil),
      toNull(correoElectronico),
      toNull(telefonoContacto),
      toNull(direccionResidencia),
      toNull(responsableAsignado),
      toNull(descripcionDetallada),
      toNull(medidasTomadas),
      toNull(contactoFamiliar),
      toNull(nombreFamiliar),
      toNull(telefonoFamiliar),
      JSON.stringify(archivosAdjuntos || []),
      toNull(observacionesAdicionales),
      toIntOrNull(usuarioId)
    ];

    const [result] = await pool.query(sql, values);
    return {
      id: result.insertId,
      numeroIncidente,
    };
  }

  // Obtener un reporte por ID
  static async getReporteById(id) {
    const sql = 'SELECT * FROM GeneracionReportes WHERE Id_Reporte = ?';
    
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  // Obtener reporte por número de incidente
  static async getReporteByNumero(numero) {
    const sql = 'SELECT * FROM GeneracionReportes WHERE Numero_Incidente = ?';
    
    const [rows] = await pool.query(sql, [numero]);
    return rows[0] || null;
  }

  // Obtener todos los reportes con filtros opcionales
  static async getAllReportes(filtros = {}, limit = 50, offset = 0) {
    let sql = 'SELECT * FROM GeneracionReportes WHERE 1=1';
    const values = [];

    if (filtros.estadoAlerta) {
      sql += ' AND Estado_Alerta = ?';
      values.push(filtros.estadoAlerta);
    }

    if (filtros.tipoAlerta) {
      sql += ' AND Tipo_Alerta = ?';
      values.push(filtros.tipoAlerta);
    }

    if (filtros.usuarioId) {
      sql += ' AND Usuario_Id = ?';
      values.push(filtros.usuarioId);
    }

    if (filtros.fechaDesde && filtros.fechaHasta) {
      sql += ' AND Fecha_Ingreso BETWEEN ? AND ?';
      values.push(filtros.fechaDesde, filtros.fechaHasta);
    }

    sql += ' ORDER BY Fecha_Ingreso DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.query(sql, values);
    return rows;
  }

  // Actualizar un reporte
  static async updateReporte(id, reporteData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(reporteData)) {
      const columnMap = {
        numeroIncidente: 'Numero_Incidente',
        fechaIngreso: 'Fecha_Ingreso',
        estadoAlerta: 'Estado_Alerta',
        tipoAlerta: 'Tipo_Alerta',
        nivelGravedad: 'Nivel_Gravedad',
        atencionInmediata: 'Atencion_Inmediata',
        institucionSede: 'Institucion_Sede',
        nombreEstudiante: 'Nombre_Estudiante',
        gradoGrupo: 'Grado_Grupo',
        lugarSuceso: 'Lugar_Suceso',
        fechaHoraSuceso: 'Fecha_Hora_Suceso',
        nombreCompleto: 'Nombre_Completo',
        tipoDocumento: 'Tipo_Documento',
        numeroDocumento: 'Numero_Documento',
        fechaNacimiento: 'Fecha_Nacimiento',
        edad: 'Edad',
        sexoGenero: 'Sexo_Genero',
        estadoCivil: 'Estado_Civil',
        correoElectronico: 'Correo_Electronico',
        telefonoContacto: 'Telefono_Contacto',
        direccionResidencia: 'Direccion_Residencia',
        responsableAsignado: 'Responsable_Asignado',
        descripcionDetallada: 'Descripcion_Detallada',
        medidasTomadas: 'Medidas_Tomadas',
        contactoFamiliar: 'Contacto_Familiar',
        nombreFamiliar: 'Nombre_Familiar',
        telefonoFamiliar: 'Telefono_Familiar',
        archivosAdjuntos: 'Archivos_Adjuntos',
        observacionesAdicionales: 'Observaciones_Adicionales'
      };

      if (columnMap[key]) {
        fields.push(`${columnMap[key]} = ?`);
        values.push(key === 'archivosAdjuntos' ? JSON.stringify(value) : value);
      }
    }

    if (fields.length === 0) {
      return { affectedRows: 0 };
    }

    values.push(id);
    const sql = `UPDATE GeneracionReportes SET ${fields.join(', ')} WHERE Id_Reporte = ?`;

    const [result] = await pool.query(sql, values);
    return result;
  }

  // Eliminar un reporte
  static async deleteReporte(id) {
    const sql = 'DELETE FROM GeneracionReportes WHERE Id_Reporte = ?';
    
    const [result] = await pool.query(sql, [id]);
    return result;
  }

  // Obtener estadísticas de reportes
  static async getEstadisticas(filtros = {}) {
    let sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN Estado_Alerta = 'Abierto' THEN 1 ELSE 0 END) as abiertos,
        SUM(CASE WHEN Estado_Alerta = 'En Proceso' THEN 1 ELSE 0 END) as enProceso,
        SUM(CASE WHEN Estado_Alerta = 'Cerrado' THEN 1 ELSE 0 END) as cerrados
      FROM GeneracionReportes
      WHERE 1=1
    `;
    const values = [];

    if (filtros.usuarioId) {
      sql += ' AND Usuario_Id = ?';
      values.push(filtros.usuarioId);
    }

    if (filtros.fechaDesde && filtros.fechaHasta) {
      sql += ' AND Fecha_Ingreso BETWEEN ? AND ?';
      values.push(filtros.fechaDesde, filtros.fechaHasta);
    }

    const [rows] = await pool.query(sql, values);
    return rows[0] || {};
  }
}

module.exports = GeneracionReportesMySQL;
