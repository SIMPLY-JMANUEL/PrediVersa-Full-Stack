const { executeQuery } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Verificar que la tabla usuarios existe (no crearla ya que ya existe)
  static async createUsersTable() {
    try {
      // Solo verificar que la tabla existe
      const tableCheck = await executeQuery(`
        SELECT COUNT(*) as tableExists 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'Usuarios' AND TABLE_SCHEMA = 'Dbo'
      `);

      if (tableCheck.recordset[0].tableExists > 0) {
        console.log('✅ Tabla Dbo.Usuarios verificada - usando estructura existente');
      } else {
        console.log('⚠️ Tabla Dbo.Usuarios no existe');
      }
    } catch (error) {
      console.error('❌ Error verificando tabla usuarios:', error.message);
    }
  }

  // No insertar usuarios por defecto ya que la tabla ya tiene datos
  static async insertDefaultUsers() {
    try {
      const existingUsers = await executeQuery('SELECT COUNT(*) as count FROM Dbo.Usuarios');
      console.log(`✅ La tabla Dbo.Usuarios tiene ${existingUsers.recordset[0].count} registros`);
    } catch (error) {
      console.error('❌ Error verificando usuarios:', error.message);
    }
  }

  // Buscar usuario por nombre de usuario o correo usando la estructura real
  static async findByUsernameOrEmail(identifier) {
    try {
      const query = `
        SELECT 
          Id_Usuario as id,
          Nombre_Completo as nombre,
          Perfil as rol,
          Usuario as usuario,
          Correo as correo,
          Contrasena as contraseña,
          Activo as activo,
          Identificacion as identificacion
        FROM Dbo.Usuarios 
        WHERE (Usuario = @identifier OR Correo = @identifier)
        AND LTRIM(RTRIM(Activo)) = 'SI'
      `;

      const result = await executeQuery(query, { identifier });

      if (result.recordset.length > 0) {
        const user = result.recordset[0];
        // Limpiar la contraseña de espacios extra
        user.contraseña = user.contraseña.trim();
        return user;
      }

      return null;
    } catch (error) {
      console.error('❌ Error buscando usuario:', error.message);
      return null;
    }
  }

  // Buscar usuario por ID
  static async findById(id) {
    try {
      const query = `
        SELECT 
          Id_Usuario as id,
          Nombre_Completo as nombre,
          Perfil as rol,
          Usuario as usuario,
          Correo as correo,
          Activo as activo,
          Identificacion as identificacion
        FROM usuarios 
        WHERE Id_Usuario = @id
        AND LTRIM(RTRIM(Activo)) = 'SI'
      `;
      
      const result = await executeQuery(query, { id });

      if (result.recordset.length > 0) {
        return result.recordset[0];
      }

      return null;
    } catch (error) {
      console.error('❌ Error buscando usuario por ID:', error.message);
      return null;
    }
  }

  // Crear nuevo usuario (si es necesario)
  static async create(userData) {
    try {
      const { nombre, usuario, correo, contraseña, rol, identificacion } = userData;
      
      const query = `
        INSERT INTO usuarios (Nombre_Completo, Perfil, Usuario, Correo, Identificacion, Contrasena, Activo)
        VALUES (@nombre, @rol, @usuario, @correo, @identificacion, @contraseña, 'SI')
      `;
      
      await executeQuery(query, {
        nombre,
        rol,
        usuario,
        correo,
        identificacion,
        contraseña
      });
      
      console.log('✅ Usuario creado exitosamente');
      return await this.findByUsernameOrEmail(usuario);
    } catch (error) {
      console.error('❌ Error creando usuario:', error.message);
      throw error;
    }
  }

  // Obtener todos los usuarios (para propósitos administrativos)
  static async findAll() {
    try {
      const query = `
        SELECT 
          Id_Usuario as id,
          Nombre_Completo as nombre,
          Perfil as rol,
          Usuario as usuario,
          Correo as correo,
          Activo as activo,
          Identificacion as identificacion
        FROM usuarios 
        WHERE LTRIM(RTRIM(Activo)) = 'SI'
        ORDER BY Id_Usuario
      `;
      
      const result = await executeQuery(query);
      return result.recordset;
    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error.message);
      return [];
    }
  }

  // Actualizar usuario
  static async update(id, userData) {
    try {
      const { nombre, correo, rol } = userData;

      const query = `
        UPDATE usuarios
        SET Nombre_Completo = @nombre, Correo = @correo, Perfil = @rol
        WHERE Id_Usuario = @id
      `;

      await executeQuery(query, { id, nombre, correo, rol });

      return await this.findById(id);
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error.message);
      throw error;
    }
  }

  // Validar contraseña considerando que las contraseñas actuales no están hasheadas
  static async verifyPassword(inputPassword, storedPassword) {
    try {
      // Limpiar la contraseña almacenada de espacios extra
      const cleanStoredPassword = storedPassword.trim();
      
      // Primero intentar comparación directa (contraseñas no hasheadas)
      if (inputPassword === cleanStoredPassword) {
        return true;
      }
      
      // Si no coincide, intentar bcrypt (por si hay contraseñas hasheadas)
      try {
        return await bcrypt.compare(inputPassword, cleanStoredPassword);
      } catch {
        // Si bcrypt falla, no es una contraseña hasheada
        return false;
      }
    } catch (error) {
      console.error('❌ Error validando contraseña:', error.message);
      return false;
    }
  }
}

module.exports = User;
