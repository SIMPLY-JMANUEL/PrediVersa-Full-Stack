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
        WHERE TABLE_NAME = 'Usuarios'
      `);

      if (tableCheck.recordset[0].tableExists > 0) {
        console.log('✅ Tabla Usuarios verificada - usando estructura existente');
      } else {
        console.log('⚠️ Tabla Usuarios no existe');
      }
    } catch (error) {
      console.error('❌ Error verificando tabla usuarios:', error.message);
    }
  }

  // No insertar usuarios por defecto ya que la tabla ya tiene datos
  static async insertDefaultUsers() {
    try {
      const existingUsers = await executeQuery('SELECT COUNT(*) as count FROM Usuarios');
      console.log(`✅ La tabla Usuarios tiene ${existingUsers.recordset[0].count} registros`);
    } catch (error) {
      console.error('❌ Error verificando usuarios:', error.message);
    }
  }

  // Buscar usuario por nombre de usuario o correo usando la estructura real
  static async findByUsernameOrEmail(identifier) {
    try {
      // Primero verificar si el usuario existe (sin importar si está activo)
      const userExistsQuery = `
        SELECT 
          Id_Usuario as id,
          Nombre_Completo as nombre,
          Perfil as rol,
          Usuario as usuario,
          Correo as correo,
          Contrasena as contraseña,
          Activo as activo,
          Identificacion as identificacion
        FROM Usuarios 
        WHERE (Usuario = @identifier OR Correo = @identifier)
      `;
      
      const userExistsResult = await executeQuery(userExistsQuery, { identifier });
      
      if (userExistsResult.recordset.length === 0) {
        console.log('❌ Usuario no encontrado en la base de datos');
        return null;
      }
      
      const user = userExistsResult.recordset[0];
      
      // Verificar si el usuario está activo
      if (user.activo !== 'SI') {
        console.log(`⚠️ Usuario ${user.usuario} encontrado pero está INACTIVO (Estado: ${user.activo})`);
        return { 
          ...user, 
          isInactive: true,
          message: 'Usuario inactivo. Contacte al administrador.' 
        };
      }
      
      console.log(`✅ Usuario ${user.usuario} encontrado y ACTIVO`);
      
      // Limpiar la contraseña de espacios extra si existe
      if (user.contraseña) {
        user.contraseña = user.contraseña.trim();
      }
      
      return user;
      
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
        FROM Usuarios 
        WHERE Id_Usuario = @id
        AND Activo = 'SI'
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
        INSERT INTO Usuarios (Nombre_Completo, Rol, Nombre_Usuario, Correo_Electronico, Numero_Identificacion, Contrasena_Hash, Activo)
        VALUES (@nombre, @rol, @usuario, @correo, @identificacion, @contraseña, 1)
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
          Rol as rol,
          Nombre_Usuario as usuario,
          Correo_Electronico as correo,
          Activo as activo,
          Numero_Identificacion as identificacion
        FROM Usuarios 
        WHERE Activo = 1
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
        UPDATE Usuarios
        SET Nombre_Completo = @nombre, Correo_Electronico = @correo, Rol = @rol
        WHERE Id_Usuario = @id
      `;

      await executeQuery(query, { id, nombre, correo, rol });

      return await this.findById(id);
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error.message);
      throw error;
    }
  }

  // Validar contraseña considerando que las contraseñas pueden estar hasheadas
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
      console.error('❌ Error verificando contraseña:', error.message);
      return false;
    }
  }

  // Hashear contraseña
  static async hashPassword(password) {
    try {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      console.error('❌ Error hasheando contraseña:', error.message);
      throw error;
    }
  }
}

module.exports = User;
