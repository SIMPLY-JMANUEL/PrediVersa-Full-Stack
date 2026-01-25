// User Model para MySQL/AWS RDS
const { pool, query, querySingle } = require('../config/database-mysql');

class User {
  // Obtener usuario por nombre de usuario
  static async getUserByUsername(usuario) {
    try {
      const sql = `
        SELECT * FROM Usuarios 
        WHERE TRIM(Usuario) = ? AND TRIM(Activo) = 'SI'
      `;
      return await querySingle(sql, [usuario.trim()]);
    } catch (error) {
      console.error('Error en getUserByUsername:', error);
      throw error;
    }
  }

  // Obtener usuario por credenciales (login)
  static async getUserByCredentials(usuario, contrasena) {
    try {
      const sql = `
        SELECT * FROM Usuarios 
        WHERE TRIM(Usuario) = ? 
        AND TRIM(Contrasena) = ? 
        AND TRIM(Activo) = 'SI'
      `;
      return await querySingle(sql, [usuario.trim(), contrasena.trim()]);
    } catch (error) {
      console.error('Error en getUserByCredentials:', error);
      throw error;
    }
  }

  // Obtener usuario por ID
  static async getUserById(id) {
    try {
      const sql = 'SELECT * FROM Usuarios WHERE Id_Usuario = ?';
      return await querySingle(sql, [id]);
    } catch (error) {
      console.error('Error en getUserById:', error);
      throw error;
    }
  }

  // Buscar usuarios por documento o nombre
  static async searchUsers(documento, nombre) {
    try {
      let sql = 'SELECT * FROM Usuarios WHERE Activo = "SI"';
      const params = [];

      if (documento) {
        sql += ' AND (Identificacion LIKE ? OR Usuario LIKE ?)';
        params.push(`%${documento}%`, `%${documento}%`);
      }

      if (nombre) {
        sql += ' AND Nombre_Completo LIKE ?';
        params.push(`%${nombre}%`);
      }

      sql += ' ORDER BY Id_Usuario DESC LIMIT 100';

      return await query(sql, params);
    } catch (error) {
      console.error('Error en searchUsers:', error);
      throw error;
    }
  }

  // Obtener todos los usuarios
  static async getAllUsers() {
    try {
      const sql = `
        SELECT Id_Usuario, Usuario, Perfil, Nombre_Completo, 
               Correo, Telefono, Activo 
        FROM Usuarios 
        ORDER BY Id_Usuario
      `;
      return await query(sql);
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      throw error;
    }
  }

  // Obtener usuarios por rol/perfil
  static async getUsersByRole(perfil) {
    try {
      const sql = `
        SELECT * FROM Usuarios 
        WHERE TRIM(Perfil) = ? AND TRIM(Activo) = 'SI'
      `;
      return await query(sql, [perfil.trim()]);
    } catch (error) {
      console.error('Error en getUsersByRole:', error);
      throw error;
    }
  }

  // Crear nuevo usuario
  static async createUser(userData) {
    try {
      const sql = `
        INSERT INTO Usuarios (
          Nombre_Completo, Tipo_Documento, Identificacion, Telefono,
          Correo, Direccion, Usuario, Fecha_Nacimiento, Edad, Sexo,
          EPS, Perfil, Condicion_Especial, Descripcion_Condicion_Especial,
          Contrasena, Contacto_Emergencia, Numero_Contacto_Emergencia, Activo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        userData.nombreCompleto,
        userData.tipoDocumento,
        userData.identificacion,
        userData.telefono,
        userData.correo,
        userData.direccion,
        userData.usuario,
        userData.fechaNacimiento,
        userData.edad,
        userData.sexo,
        userData.eps,
        userData.perfil,
        userData.condicionEspecial,
        userData.descripcionCondicion,
        userData.contrasena,
        userData.contactoEmergencia,
        userData.numeroContactoEmergencia,
        userData.activo || 'SI'
      ];
      
      const [result] = await pool.query(sql, params);
      return { id: result.insertId };
    } catch (error) {
      console.error('Error en createUser:', error);
      throw error;
    }
  }

  // Actualizar usuario
  static async updateUser(id, userData) {
    try {
      const fields = [];
      const values = [];

      Object.keys(userData).forEach(key => {
        if (userData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(userData[key]);
        }
      });

      values.push(id);
      
      const sql = `UPDATE Usuarios SET ${fields.join(', ')} WHERE Id_Usuario = ?`;
      const [result] = await pool.query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en updateUser:', error);
      throw error;
    }
  }

  // Eliminar usuario (soft delete)
  static async deleteUser(id) {
    try {
      const sql = 'UPDATE Usuarios SET Activo = ? WHERE Id_Usuario = ?';
      const [result] = await pool.query(sql, ['NO', id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en deleteUser:', error);
      throw error;
    }
  }
}

module.exports = User;
