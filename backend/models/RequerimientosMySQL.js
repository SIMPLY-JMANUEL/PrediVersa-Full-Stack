const { pool } = require('../config/database-mysql');

class RequerimientosMySQL {
  static normalize(payload = {}) {
    const toNull = (v) => (v === undefined || v === null || v === '' ? null : v);
    return {
      idAlerta: toNull(payload.idAlerta),
      numeroAlerta: toNull(payload.numeroAlerta),
      numeroCaso: toNull(payload.numeroCaso),
      descripcionRequerimiento: toNull(payload.descripcionRequerimiento),
      estadoRequerimiento: payload.estadoRequerimiento || 'pendiente',
      prioridad: payload.prioridad || 'normal',
      fechaLimite: toNull(payload.fechaLimite),
      profesionalAsignado: toNull(payload.profesionalAsignado),
      fechaSeguimiento: toNull(payload.fechaSeguimiento),
      resultadoSeguimiento: toNull(payload.resultadoSeguimiento),
      porcentajeCompletitud: toNull(payload.porcentajeCompletitud) || 0,
      accionesTomadas: toNull(payload.accionesTomadas),
      proximasAcciones: toNull(payload.proximasAcciones),
      requiereSeguimientoAdicional: toNull(payload.requiereSeguimientoAdicional),
      fechaProximoSeguimiento: toNull(payload.fechaProximoSeguimiento),
      intervinientes: payload.intervinientes ? JSON.stringify(payload.intervinientes) : null,
      evidenciaDocumental: toNull(payload.evidenciaDocumental),
      observaciones: toNull(payload.observaciones),
      usuarioId: toNull(payload.usuarioId),
    };
  }

  static async createRequerimiento(data) {
    const n = this.normalize(data);
    const sql = `
      INSERT INTO Requerimientos_Seguimiento (
        Id_Alerta,
        Numero_Alerta,
        Numero_Caso,
        Descripcion_Requerimiento,
        Estado_Requerimiento,
        Prioridad,
        Fecha_Limite,
        Profesional_Asignado,
        Fecha_Seguimiento,
        Resultado_Seguimiento,
        Porcentaje_Completitud,
        Acciones_Tomadas,
        Proximas_Acciones,
        Requiere_Seguimiento_Adicional,
        Fecha_Proximo_Seguimiento,
        Intervinientes,
        Evidencia_Documental,
        Observaciones,
        Usuario_Id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      n.idAlerta,
      n.numeroAlerta,
      n.numeroCaso,
      n.descripcionRequerimiento,
      n.estadoRequerimiento,
      n.prioridad,
      n.fechaLimite,
      n.profesionalAsignado,
      n.fechaSeguimiento,
      n.resultadoSeguimiento,
      n.porcentajeCompletitud,
      n.accionesTomadas,
      n.proximasAcciones,
      n.requiereSeguimientoAdicional,
      n.fechaProximoSeguimiento,
      n.intervinientes,
      n.evidenciaDocumental,
      n.observaciones,
      n.usuarioId,
    ];

    try {
      const [result] = await pool.query(sql, values);
      return { id: result.insertId };
    } catch (error) {
      console.error('Error creando requerimiento:', error);
      throw error;
    }
  }

  static async getRequerimientoById(id) {
    const sql = 'SELECT * FROM Requerimientos_Seguimiento WHERE Id_Requerimiento = ?';
    try {
      const [rows] = await pool.query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error obteniendo requerimiento:', error);
      throw error;
    }
  }

  static async getRequerimientosPorAlerta(idAlerta) {
    const sql = 'SELECT * FROM Requerimientos_Seguimiento WHERE Id_Alerta = ? ORDER BY Fecha_Requerimiento DESC';
    try {
      const [rows] = await pool.query(sql, [idAlerta]);
      return rows || [];
    } catch (error) {
      console.error('Error obteniendo requerimientos por alerta:', error);
      throw error;
    }
  }

  static async getAllRequerimientos(filtros = {}, limit = 50, offset = 0) {
    let sql = 'SELECT * FROM Requerimientos_Seguimiento WHERE 1=1';
    const values = [];

    if (filtros.estadoRequerimiento) {
      sql += ' AND Estado_Requerimiento = ?';
      values.push(filtros.estadoRequerimiento);
    }

    if (filtros.prioridad) {
      sql += ' AND Prioridad = ?';
      values.push(filtros.prioridad);
    }

    if (filtros.profesionalAsignado) {
      sql += ' AND Profesional_Asignado LIKE ?';
      values.push(`%${filtros.profesionalAsignado}%`);
    }

    if (filtros.numeroAlerta) {
      sql += ' AND Numero_Alerta = ?';
      values.push(filtros.numeroAlerta);
    }

    sql += ' ORDER BY Fecha_Requerimiento DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    try {
      const [rows] = await pool.query(sql, values);
      return rows || [];
    } catch (error) {
      console.error('Error obteniendo requerimientos:', error);
      throw error;
    }
  }

  static async updateRequerimiento(id, data) {
    const n = this.normalize(data);
    const updates = [];
    const values = [];

    if (n.descripcionRequerimiento !== null) {
      updates.push('Descripcion_Requerimiento = ?');
      values.push(n.descripcionRequerimiento);
    }
    if (n.estadoRequerimiento) {
      updates.push('Estado_Requerimiento = ?');
      values.push(n.estadoRequerimiento);
    }
    if (n.prioridad) {
      updates.push('Prioridad = ?');
      values.push(n.prioridad);
    }
    if (n.fechaLimite !== null) {
      updates.push('Fecha_Limite = ?');
      values.push(n.fechaLimite);
    }
    if (n.profesionalAsignado !== null) {
      updates.push('Profesional_Asignado = ?');
      values.push(n.profesionalAsignado);
    }
    if (n.fechaSeguimiento !== null) {
      updates.push('Fecha_Seguimiento = ?');
      values.push(n.fechaSeguimiento);
    }
    if (n.resultadoSeguimiento !== null) {
      updates.push('Resultado_Seguimiento = ?');
      values.push(n.resultadoSeguimiento);
    }
    if (n.porcentajeCompletitud) {
      updates.push('Porcentaje_Completitud = ?');
      values.push(n.porcentajeCompletitud);
    }
    if (n.accionesTomadas !== null) {
      updates.push('Acciones_Tomadas = ?');
      values.push(n.accionesTomadas);
    }
    if (n.proximasAcciones !== null) {
      updates.push('Proximas_Acciones = ?');
      values.push(n.proximasAcciones);
    }
    if (n.requiereSeguimientoAdicional !== null) {
      updates.push('Requiere_Seguimiento_Adicional = ?');
      values.push(n.requiereSeguimientoAdicional);
    }
    if (n.fechaProximoSeguimiento !== null) {
      updates.push('Fecha_Proximo_Seguimiento = ?');
      values.push(n.fechaProximoSeguimiento);
    }
    if (n.observaciones !== null) {
      updates.push('Observaciones = ?');
      values.push(n.observaciones);
    }

    updates.push('Fecha_Actualizacion = NOW()');

    if (updates.length === 1) return { affectedRows: 0 };

    const sql = `UPDATE Requerimientos_Seguimiento SET ${updates.join(', ')} WHERE Id_Requerimiento = ?`;
    values.push(id);

    try {
      const [result] = await pool.query(sql, values);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Error actualizando requerimiento:', error);
      throw error;
    }
  }

  static async deleteRequerimiento(id) {
    const sql = 'DELETE FROM Requerimientos_Seguimiento WHERE Id_Requerimiento = ?';
    try {
      const [result] = await pool.query(sql, [id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Error eliminando requerimiento:', error);
      throw error;
    }
  }

  static async getRequerimientosResumen() {
    const sql = `
      SELECT 
        Estado_Requerimiento as estado,
        COUNT(*) as total,
        SUM(CASE WHEN Prioridad = 'alta' THEN 1 ELSE 0 END) as alta,
        SUM(CASE WHEN Prioridad = 'normal' THEN 1 ELSE 0 END) as normal,
        SUM(CASE WHEN Prioridad = 'baja' THEN 1 ELSE 0 END) as baja
      FROM Requerimientos_Seguimiento
      GROUP BY Estado_Requerimiento
    `;

    try {
      const [rows] = await pool.query(sql);
      return rows || [];
    } catch (error) {
      console.error('Error obteniendo resumen:', error);
      throw error;
    }
  }

  static async getRequerimientosPendientes() {
    const sql = `
      SELECT * FROM Requerimientos_Seguimiento 
      WHERE Estado_Requerimiento IN ('pendiente', 'en_proceso')
      AND (Fecha_Limite IS NULL OR Fecha_Limite >= NOW())
      ORDER BY Prioridad DESC, Fecha_Requerimiento ASC
    `;

    try {
      const [rows] = await pool.query(sql);
      return rows || [];
    } catch (error) {
      console.error('Error obteniendo requerimientos pendientes:', error);
      throw error;
    }
  }

  static async getRequerimientosVencidos() {
    const sql = `
      SELECT * FROM Requerimientos_Seguimiento 
      WHERE Estado_Requerimiento IN ('pendiente', 'en_proceso')
      AND Fecha_Limite IS NOT NULL 
      AND Fecha_Limite < NOW()
      ORDER BY Fecha_Limite ASC
    `;

    try {
      const [rows] = await pool.query(sql);
      return rows || [];
    } catch (error) {
      console.error('Error obteniendo requerimientos vencidos:', error);
      throw error;
    }
  }
}

module.exports = RequerimientosMySQL;
