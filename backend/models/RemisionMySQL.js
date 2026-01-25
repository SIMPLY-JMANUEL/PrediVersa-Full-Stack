const { pool } = require('../config/database-mysql');

class RemisionMySQL {
  static normalize(payload = {}) {
    const toNull = (v) => (v === undefined || v === null || v === '' ? null : v);
    return {
      idAlerta: toNull(payload.idAlerta),
      numeroAlertaVinculada: toNull(payload.numeroAlertaVinculada),
      tipoAlerta: toNull(payload.tipoAlerta),
      nombreEstudiante: toNull(payload.nombreEstudiante),
      edad: toNull(payload.edad),
      gradoCargo: toNull(payload.gradoCargo),
      institucionSede: toNull(payload.institucionSede),
      descripcionBreve: toNull(payload.descripcionBreve),
      estadoActualAlerta: toNull(payload.estadoActualAlerta),
      fechaRemision: toNull(payload.fechaRemision),
      motivoRemision: toNull(payload.motivoRemision),
      areaDestino: toNull(payload.areaDestino),
      entidadReceptora: toNull(payload.entidadReceptora),
      profesionalAsignado: toNull(payload.profesionalAsignado),
      estadoRemision: toNull(payload.estadoRemision),
      comentariosRemitente: toNull(payload.comentariosRemitente),
      archivoAdjunto: payload.archivoAdjunto || null,
      notificoAcudiente: toNull(payload.notificoAcudiente),
      fechaHoraCita: toNull(payload.fechaHoraCita),
      observacionesSeguimiento: toNull(payload.observacionesSeguimiento),
      usuarioId: toNull(payload.usuarioId),
    };
  }

  static async createRemision(data) {
    const n = this.normalize(data);
    const sql = `
      INSERT INTO Remisiones (
        Id_Alerta,
        Numero_Alerta_Vinculada,
        Tipo_Alerta,
        Nombre_Estudiante,
        Edad,
        Grado_Cargo,
        Institucion_Sede,
        Descripcion_Breve,
        Estado_Actual_Alerta,
        Fecha_Remision,
        Motivo_Remision,
        Area_Destino,
        Entidad_Receptora,
        Profesional_Asignado,
        Estado_Remision,
        Comentarios_Remitente,
        Archivo_Adjunto,
        Notifico_Acudiente,
        Fecha_Hora_Cita,
        Observaciones_Seguimiento,
        Usuario_Id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      n.idAlerta,
      n.numeroAlertaVinculada,
      n.tipoAlerta,
      n.nombreEstudiante,
      n.edad,
      n.gradoCargo,
      n.institucionSede,
      n.descripcionBreve,
      n.estadoActualAlerta,
      n.fechaRemision,
      n.motivoRemision,
      n.areaDestino,
      n.entidadReceptora,
      n.profesionalAsignado,
      n.estadoRemision,
      n.comentariosRemitente,
      n.archivoAdjunto ? JSON.stringify(n.archivoAdjunto) : null,
      n.notificoAcudiente,
      n.fechaHoraCita,
      n.observacionesSeguimiento,
      n.usuarioId,
    ];

    const [result] = await pool.query(sql, values);
    return { id: result.insertId };
  }

  static async getRemisionById(id) {
    const sql = 'SELECT * FROM Remisiones WHERE Id_Remision = ?';
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  static async getAllRemisiones(filtros = {}, limit = 50, offset = 0) {
    let sql = 'SELECT * FROM Remisiones WHERE 1=1';
    const values = [];

    if (filtros.estadoRemision) {
      sql += ' AND Estado_Remision = ?';
      values.push(filtros.estadoRemision);
    }

    if (filtros.areaDestino) {
      sql += ' AND Area_Destino = ?';
      values.push(filtros.areaDestino);
    }

    if (filtros.idAlerta) {
      sql += ' AND Id_Alerta = ?';
      values.push(filtros.idAlerta);
    }

    sql += ' ORDER BY Fecha_Registro DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.query(sql, values);
    return rows;
  }
}

module.exports = RemisionMySQL;
