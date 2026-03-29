// Alerta Model para MySQL/AWS RDS
const { pool, query, querySingle } = require('../config/database-mysql');

class Alerta {
  // Crear nueva alerta
  static async createAlerta(alertaData) {
    try {
      const sql = `
        INSERT INTO Alertas (
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
          Usuario_Id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        alertaData.tipo_alerta || '',
        alertaData.fecha_hora || new Date(),
        alertaData.ubicacion || '',
        alertaData.requiere_atencion_inmediata || 'no',
        alertaData.es_reiterativo || 'no',
        alertaData.canal_reporte || '',
        alertaData.nombre_estudiante || null,
        alertaData.identificacion_estudiante || null,
        alertaData.curso_grado || null,
        alertaData.edad || null,
        alertaData.tipo_reportado || null,
        alertaData.nombre_reportante || '',
        alertaData.identificacion_reportante || '',
        alertaData.relacion_reportado || null,
        alertaData.telefono_reportante || null,
        alertaData.email_reportante || null,
        alertaData.categoria_incidente || '',
        alertaData.descripcion_detallada || '',
        alertaData.evidencias || null,
        alertaData.testigos || null,
        alertaData.contexto_previo || null,
        alertaData.estado_alerta || 'nuevo',
        alertaData.prioridad || 'media',
        alertaData.coordinador_asignado || null,
        alertaData.observaciones_preliminares || null,
        alertaData.consentimiento_informado ? 1 : 0,
        alertaData.proteccion_datos ? 1 : 0,
        alertaData.cumplimiento_normativo ? 1 : 0,
        alertaData.usuario_id || null
      ];

      // Ejecutar INSERT directamente para obtener insertId
      const [result] = await pool.query(sql, params);
      console.log('✅ Alerta creada exitosamente con ID:', result.insertId);
      
      return {
        Id_Alerta: result.insertId,
        numeroAlerta: `ALR-${String(result.insertId).padStart(6, '0')}`
      };
    } catch (error) {
      console.error('❌ Error en createAlerta:', error);
      throw error;
    }
  }

  // Obtener alerta por ID
  static async getAlertaById(id) {
    try {
      const sql = 'SELECT * FROM Alertas WHERE Id_Alerta = ?';
      return await querySingle(sql, [id]);
    } catch (error) {
      console.error('Error en getAlertaById:', error);
      throw error;
    }
  }

  // Obtener todas las alertas
  static async getAllAlertas(limit = 100, offset = 0) {
    try {
      const sql = `
        SELECT * FROM Alertas 
        ORDER BY Fecha_Registro DESC 
        LIMIT ? OFFSET ?
      `;
      return await query(sql, [limit, offset]);
    } catch (error) {
      console.error('Error en getAllAlertas:', error);
      throw error;
    }
  }

  // Buscar alertas por estado
  static async getAlertasByEstado(estado, limit = 100, offset = 0) {
    try {
      const sql = `
        SELECT * FROM Alertas 
        WHERE Estado_Alerta = ? 
        ORDER BY Fecha_Registro DESC 
        LIMIT ? OFFSET ?
      `;
      return await query(sql, [estado, limit, offset]);
    } catch (error) {
      console.error('Error en getAlertasByEstado:', error);
      throw error;
    }
  }

  // Buscar alertas por prioridad
  static async getAlertasByPrioridad(prioridad, limit = 100, offset = 0) {
    try {
      const sql = `
        SELECT * FROM Alertas 
        WHERE Prioridad = ? 
        ORDER BY Fecha_Registro DESC 
        LIMIT ? OFFSET ?
      `;
      return await query(sql, [prioridad, limit, offset]);
    } catch (error) {
      console.error('Error en getAlertasByPrioridad:', error);
      throw error;
    }
  }

  // Actualizar alerta
  static async updateAlerta(id, alertaData) {
    try {
      const fields = [];
      const values = [];

      // Mapear campos de entrada a nombres de BD
      const fieldMapping = {
        tipo_alerta: 'Tipo_Alerta',
        fecha_hora: 'Fecha_Hora_Incidente',
        ubicacion: 'Ubicacion',
        requiere_atencion_inmediata: 'Requiere_Atencion_Inmediata',
        es_reiterativo: 'Es_Reiterativo',
        canal_reporte: 'Canal_Reporte',
        nombre_estudiante: 'Nombre_Estudiante',
        identificacion_estudiante: 'Identificacion_Estudiante',
        curso_grado: 'Curso_Grado',
        edad: 'Edad_Reportado',
        tipo_reportado: 'Tipo_Reportado',
        nombre_reportante: 'Nombre_Reportante',
        identificacion_reportante: 'Identificacion_Reportante',
        relacion_reportado: 'Relacion_Reportado',
        telefono_reportante: 'Telefono_Reportante',
        email_reportante: 'Email_Reportante',
        categoria_incidente: 'Categoria_Incidente',
        descripcion_detallada: 'Descripcion_Detallada',
        evidencias: 'Evidencias',
        testigos: 'Testigos',
        contexto_previo: 'Contexto_Previo',
        estado_alerta: 'Estado_Alerta',
        prioridad: 'Prioridad',
        coordinador_asignado: 'Coordinador_Asignado',
        observaciones_preliminares: 'Observaciones_Preliminares',
      };

      Object.keys(alertaData).forEach(key => {
        if (alertaData[key] !== undefined && fieldMapping[key]) {
          fields.push(`${fieldMapping[key]} = ?`);
          values.push(alertaData[key]);
        }
      });

      // Agregar fecha de actualización
      fields.push('Fecha_Actualizacion = NOW()');

      values.push(id);
      
      const sql = `UPDATE Alertas SET ${fields.join(', ')} WHERE Id_Alerta = ?`;
      const result = await query(sql, values);
      return result.affectedRows > 0 || true;
    } catch (error) {
      console.error('❌ Error en updateAlerta:', error);
      throw error;
    }
  }

  // Eliminar alerta (soft delete - cambiar estado)
  static async deleteAlerta(id) {
    try {
      const sql = 'UPDATE Alertas SET Estado_Alerta = ? WHERE Id_Alerta = ?';
      const result = await query(sql, ['archivado', id]);
      return true;
    } catch (error) {
      console.error('❌ Error en deleteAlerta:', error);
      throw error;
    }
  }
}

module.exports = Alerta;
