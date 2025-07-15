// controllers/userController.js
// Controlador para gestión de usuarios con conexión a Dbo.Usuarios

const { executeQuery } = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * Buscar usuarios por documento o nombre
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function searchUsers(req, res) {
  try {
    const { documento, nombre } = req.query;
    
    if (!documento && !nombre) {
      return res.status(400).json({
        success: false,
        msg: 'Debe proporcionar al menos un criterio de búsqueda (documento o nombre)'
      });
    }

    let query = `
      SELECT 
        Id_Usuario,
        Nombre_Completo,
        Tipo_Documento,
        Identificacion,
        Fecha_Nacimiento,
        Edad,
        Sexo,
        Correo,
        Direccion,
        EPS,
        Condicion_Especial,
        Numero_Contacto_Emergencia,
        Contacto_Emergencia,
        Activo,
        Perfil,
        Usuario,
        Contrasena
      FROM Dbo.Usuarios
      WHERE 1=1
    `;

    const params = {};

    if (documento) {
      query += ' AND Identificacion LIKE @documento';
      params.documento = `%${documento}%`;
    }

    if (nombre) {
      query += ' AND Nombre_Completo LIKE @nombre';
      params.nombre = `%${nombre}%`;
    }

    query += ' ORDER BY Id_Usuario DESC';

    const result = await executeQuery(query, params);

    // Convertir campos varbinary a string
    const users = result.recordset.map(user => {
      if (user.Condicion_Especial && Buffer.isBuffer(user.Condicion_Especial)) {
        user.Condicion_Especial = user.Condicion_Especial.toString('utf8');
      }
      return user;
    });

    res.json({
      success: true,
      data: users,
      msg: `Se encontraron ${users.length} usuarios`
    });

  } catch (error) {
    console.error('Error buscando usuarios:', error);
    res.status(500).json({
      success: false,
      msg: 'Error interno del servidor al buscar usuarios'
    });
  }
}

/**
 * Obtener usuario por ID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        Id_Usuario,
        Nombre_Completo,
        Tipo_Documento,
        Identificacion,
        Fecha_Nacimiento,
        Edad,
        Sexo,
        Correo,
        Direccion,
        EPS,
        Condicion_Especial,
        Numero_Contacto_Emergencia,
        Contacto_Emergencia,
        Activo,
        Perfil,
        Usuario,
        Contrasena
      FROM Dbo.Usuarios
      WHERE Id_Usuario = @id
    `;

    const result = await executeQuery(query, { id });

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'Usuario no encontrado'
      });
    }

    // Convertir el campo varbinary a string
    const userData = result.recordset[0];
    if (userData.Condicion_Especial && Buffer.isBuffer(userData.Condicion_Especial)) {
      userData.Condicion_Especial = userData.Condicion_Especial.toString('utf8');
    }

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      msg: 'Error interno del servidor al obtener usuario'
    });
  }
}

/**
 * Actualizar usuario
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const {
      nombreCompleto,
      tipoDocumento,
      numeroDocumento,
      fechaNacimiento,
      edad,
      sexo,
      correoElectronico,
      // telefono, // Campo no existe en la tabla
      direccion,
      epsSeguroMedico,
      condicionEspecial,
      // descripcionCondicion, // Campo no existe en la tabla
      contactoEmergencia,
      telefonoFamiliar,
      usuarioActivo,
      perfil,
      usuario,
      contrasena
    } = req.body;

    // Verificar que el usuario existe
    const checkQuery = 'SELECT Id_Usuario FROM Dbo.Usuarios WHERE Id_Usuario = @id';
    const checkResult = await executeQuery(checkQuery, { id });

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'Usuario no encontrado'
      });
    }

    // Construir consulta de actualización dinámicamente
    let updateQuery = 'UPDATE Dbo.Usuarios SET ';
    const updateParams = { id };
    const updateFields = [];

    if (nombreCompleto !== undefined) {
      updateFields.push('Nombre_Completo = @nombreCompleto');
      updateParams.nombreCompleto = nombreCompleto;
    }

    if (tipoDocumento !== undefined) {
      updateFields.push('Tipo_Documento = @tipoDocumento');
      updateParams.tipoDocumento = tipoDocumento;
    }

    if (numeroDocumento !== undefined) {
      updateFields.push('Identificacion = @numeroDocumento');
      updateParams.numeroDocumento = numeroDocumento;
    }

    if (fechaNacimiento !== undefined) {
      updateFields.push('Fecha_Nacimiento = @fechaNacimiento');
      updateParams.fechaNacimiento = fechaNacimiento;
    }

    if (edad !== undefined) {
      updateFields.push('Edad = @edad');
      updateParams.edad = edad;
    }

    if (sexo !== undefined) {
      updateFields.push('Sexo = @sexo');
      updateParams.sexo = sexo;
    }

    if (correoElectronico !== undefined) {
      updateFields.push('Correo = @correoElectronico');
      updateParams.correoElectronico = correoElectronico;
    }

    // Quitar campos que no existen en la tabla
    // if (telefono !== undefined) {
    //   updateFields.push('Telefono = @telefono');
    //   updateParams.telefono = telefono;
    // }

    if (direccion !== undefined) {
      updateFields.push('Direccion = @direccion');
      updateParams.direccion = direccion;
    }

    if (epsSeguroMedico !== undefined) {
      updateFields.push('EPS = @epsSeguroMedico');
      updateParams.epsSeguroMedico = epsSeguroMedico;
    }

    if (condicionEspecial !== undefined) {
      // Convertir string a buffer para el campo varbinary
      const bufferValue = Buffer.from(condicionEspecial, 'utf8');
      updateFields.push('Condicion_Especial = @condicionEspecial');
      updateParams.condicionEspecial = bufferValue;
    }

    // Quitar campos que no existen en la tabla
    // if (descripcionCondicion !== undefined) {
    //   updateFields.push('Descripcion_Condicion = @descripcionCondicion');
    //   updateParams.descripcionCondicion = descripcionCondicion;
    // }

    if (contactoEmergencia !== undefined) {
      updateFields.push('Contacto_Emergencia = @contactoEmergencia');
      updateParams.contactoEmergencia = contactoEmergencia;
    }

    if (telefonoFamiliar !== undefined) {
      updateFields.push('Numero_Contacto_Emergencia = @telefonoFamiliar');
      updateParams.telefonoFamiliar = telefonoFamiliar;
    }

    if (usuarioActivo !== undefined) {
      // Convertir el valor a BIT compatible
      const activoValue = usuarioActivo === 'Activo' || usuarioActivo === 'SI' || usuarioActivo === 'Sí' || usuarioActivo === '1' || usuarioActivo === 1 || usuarioActivo === true;
      updateFields.push('Activo = @usuarioActivo');
      updateParams.usuarioActivo = activoValue ? 1 : 0;
    }

    if (perfil !== undefined) {
      updateFields.push('Perfil = @perfil');
      updateParams.perfil = perfil;
    }

    if (usuario !== undefined) {
      updateFields.push('Usuario = @usuario');
      updateParams.usuario = usuario;
    }

    if (contrasena !== undefined) {
      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      updateFields.push('Contrasena = @contrasena');
      updateParams.contrasena = hashedPassword;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        msg: 'No se proporcionaron campos para actualizar'
      });
    }

    updateQuery += updateFields.join(', ') + ' WHERE Id_Usuario = @id';

    console.log('🔍 DEBUG - Update Query:', updateQuery);
    console.log('🔍 DEBUG - Update Params:', updateParams);

    await executeQuery(updateQuery, updateParams);

    res.json({
      success: true,
      msg: 'Usuario actualizado correctamente'
    });

  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      msg: 'Error interno del servidor al actualizar usuario'
    });
  }
}

/**
 * Obtener lista de todos los usuarios (con paginación)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getAllUsers(req, res) {
  try {
    const { page = 1, limit = 10, activo } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        Id_Usuario,
        Nombre_Completo,
        Tipo_Documento,
        Identificacion,
        Correo,
        Perfil,
        Activo
      FROM Dbo.Usuarios
      WHERE 1=1
    `;

    const params = {};

    if (activo !== undefined) {
      query += ' AND Activo = @activo';
      params.activo = activo;
    }

    query += ' ORDER BY Id_Usuario DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
    params.offset = offset;
    params.limit = parseInt(limit);

    const result = await executeQuery(query, params);

    // Obtener el total de registros
    let countQuery = 'SELECT COUNT(*) as total FROM Dbo.Usuarios WHERE 1=1';
    const countParams = {};

    if (activo !== undefined) {
      countQuery += ' AND Activo = @activo';
      countParams.activo = activo;
    }

    const countResult = await executeQuery(countQuery, countParams);
    const total = countResult.recordset[0].total;

    res.json({
      success: true,
      data: result.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      msg: 'Error interno del servidor al obtener usuarios'
    });
  }
}

/**
 * Eliminar usuario (cambiar estado a inactivo)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const checkQuery = 'SELECT Id_Usuario FROM Dbo.Usuarios WHERE Id_Usuario = @id';
    const checkResult = await executeQuery(checkQuery, { id });

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'Usuario no encontrado'
      });
    }

    // Cambiar estado a inactivo en lugar de eliminar
    const updateQuery = `
      UPDATE Dbo.Usuarios 
      SET Activo = 'NO'
      WHERE Id_Usuario = @id
    `;

    await executeQuery(updateQuery, { id });

    res.json({
      success: true,
      msg: 'Usuario desactivado correctamente'
    });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      msg: 'Error interno del servidor al eliminar usuario'
    });
  }
}

module.exports = {
  searchUsers,
  getUserById,
  updateUser,
  getAllUsers,
  deleteUser
};
