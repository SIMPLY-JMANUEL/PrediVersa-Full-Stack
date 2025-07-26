const { executeQuery } = require('../config/database-simple');

// Función para obtener usuario por credenciales
const getUserByCredentials = async (identifier, password) => {
  try {
    const query = `
      SELECT 
        Id_Usuario as id,
        Nombre_Completo as nombre,
        Correo as correo,
        Usuario as usuario,
        Perfil as rol,
        Activo as activo,
        Telefono as telefono,
        Edad as edad,
        Fecha_Nacimiento as fechaNacimiento,
        Tipo_Documento as tipoDocumento,
        Identificacion as identificacion
      FROM usuarios 
      WHERE (Correo = @identifier OR Usuario = @identifier) 
        AND Contrasena = @password
        AND Activo = 1
    `;

    const result = await executeQuery(query, {
      identifier: identifier,
      password: password,
    });

    return result.recordset.length > 0 ? result.recordset[0] : null;
  } catch (error) {
    console.error('Error al buscar usuario:', error);
    throw error;
  }
};

// Función para obtener todos los usuarios
const getAllUsers = async () => {
  try {
    const query = `
      SELECT 
        Id_Usuario as id,
        Nombre_Completo as nombre,
        Correo as correo,
        Usuario as usuario,
        Perfil as rol,
        Activo as activo,
        Telefono as telefono,
        Edad as edad,
        Fecha_Nacimiento as fechaNacimiento
      FROM usuarios 
      ORDER BY Id_Usuario
    `;

    const result = await executeQuery(query);
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

// Función para obtener usuario por ID
const getUserById = async id => {
  try {
    const query = `
      SELECT 
        Id_Usuario as id,
        Nombre_Completo as nombre,
        Correo as correo,
        Usuario as usuario,
        Perfil as rol,
        Activo as activo,
        Telefono as telefono,
        Edad as edad,
        Fecha_Nacimiento as fechaNacimiento,
        Tipo_Documento as tipoDocumento,
        Identificacion as identificacion
      FROM usuarios 
      WHERE Id_Usuario = @id
    `;

    const result = await executeQuery(query, { id: id });
    return result.recordset.length > 0 ? result.recordset[0] : null;
  } catch (error) {
    console.error('Error al buscar usuario por ID:', error);
    throw error;
  }
};

// Función para crear nuevo usuario
const createUser = async userData => {
  try {
    // Obtener el próximo ID disponible
    const maxIdResult = await executeQuery(
      'SELECT MAX(Id_Usuario) as maxId FROM usuarios'
    );
    const nextId = (maxIdResult.recordset[0].maxId || 0) + 1;

    const query = `
      INSERT INTO usuarios (
        Id_Usuario, Nombre_Completo, Correo, Usuario, Contrasena, Perfil, 
        Activo, Telefono, Edad, Tipo_Documento, Identificacion
      ) 
      VALUES (
        @id, @nombre, @correo, @usuario, @password, @rol, 
        @activo, @telefono, @edad, @tipoDocumento, @identificacion
      );
    `;

    await executeQuery(query, {
      id: nextId,
      nombre: userData.nombre,
      correo: userData.correo,
      usuario: userData.usuario,
      password: userData.password,
      rol: userData.rol,
      activo: userData.activo || 'SI',
      telefono: userData.telefono || '',
      edad: userData.edad || null,
      tipoDocumento: userData.tipoDocumento || '',
      identificacion: userData.identificacion || '',
    });

    return nextId;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

module.exports = {
  getUserByCredentials,
  getAllUsers,
  getUserById,
  createUser,
};
