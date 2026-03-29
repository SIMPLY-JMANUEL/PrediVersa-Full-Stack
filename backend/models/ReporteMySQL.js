// Reporte Model para MySQL/AWS RDS
const { pool, query } = require('../config/database-mysql');

class Reporte {
  static async createReporte(reporteData, usuarioId = null) {
    const {
      isAnonymous = false,
      personalData = {},
      institutionData = {},
      incidentData = {},
    } = reporteData || {};

    const sql = `
      INSERT INTO Reportes (
        Es_Anonimo,
        Nombre_Completo,
        Tipo_Documento,
        Numero_Documento,
        Fecha_Nacimiento,
        Edad,
        Genero,
        Estado_Civil,
        Email,
        Telefono,
        Direccion,
        Ocupacion,
        EPS,
        Historial_Medico,
        Condicion_Especial,
        Grado_Cargo,
        Institucion,
        Contacto_Emergencia,
        Telefono_Emergencia,
        Descripcion,
        Evidencia,
        Contexto,
        Correo_Contacto,
        Estado_Reporte,
        Prioridad,
        Usuario_Id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      isAnonymous ? 1 : 0,
      personalData.fullName || null,
      personalData.documentType || null,
      personalData.documentNumber || null,
      personalData.birthDate || null,
      personalData.age || null,
      personalData.gender || null,
      personalData.civilStatus || null,
      personalData.email || null,
      personalData.phone || null,
      personalData.address || null,
      personalData.occupation || null,
      institutionData.eps || null,
      institutionData.medicalHistory || null,
      institutionData.specialCondition || null,
      institutionData.gradeOrPosition || null,
      institutionData.institution || null,
      institutionData.emergencyContactName || null,
      institutionData.emergencyContactPhone || null,
      incidentData.description || null,
      incidentData.evidence || null,
      incidentData.context || null,
      incidentData.contactEmail || null,
      'Abierto',
      'Media',
      usuarioId || null,
    ];

    const [result] = await pool.query(sql, params);
    return {
      Id_Reporte: result.insertId,
      numeroReporte: `RPT-${String(result.insertId).padStart(6, '0')}`,
    };
  }

  static async getReportesByUser(usuarioId, limit = 50, offset = 0) {
    const sql = `
      SELECT * FROM Reportes
      WHERE Usuario_Id = ? OR (? IS NULL)
      ORDER BY Fecha_Registro DESC
      LIMIT ? OFFSET ?
    `;
    return query(sql, [usuarioId, usuarioId, limit, offset]);
  }

  static async getReporteById(id) {
    const sql = 'SELECT * FROM Reportes WHERE Id_Reporte = ?';
    const rows = await query(sql, [id]);
    return rows[0] || null;
  }
}

module.exports = Reporte;
