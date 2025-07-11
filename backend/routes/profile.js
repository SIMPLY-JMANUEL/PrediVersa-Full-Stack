// backend/routes/profile.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { executeQuery } = require('../config/database');

// Ruta protegida para obtener el perfil del usuario autenticado
router.get('/', auth, (req, res) => {
  // req.user viene del middleware auth (decodificado del token)
  if (!req.user) {
    return res.status(401).json({ msg: 'Token no válido o expirado' });
  }
  res.json({
    profile: {
      id: req.user.id,
      nombre: req.user.nombre,
      correo: req.user.correo,
      rol: req.user.rol
    }
  });
});

// Ruta para obtener datos completos del usuario desde la base de datos
router.get('/admin/current-user', auth, async (req, res) => {
  try {
    console.log('DEBUG - req.user:', req.user);
    console.log('DEBUG - req.user.rol:', req.user.rol);
    console.log('DEBUG - Tipo de rol:', typeof req.user.rol);
    
    if (!req.user || (req.user.rol !== 'admin' && req.user.rol !== 'Administrador')) {
      return res.status(403).json({ msg: 'Acceso denegado. Solo administradores.' });
    }

    // Buscar en la base de datos por el ID del usuario autenticado
    const query = `
      SELECT 
        Id_Usuario,
        Nombre_Completo,
        Perfil,
        Usuario,
        Correo,
        Activo,
        Identificacion,
        Contacto_Emergencia
      FROM dbo.usuarios 
      WHERE Id_Usuario = @userId
    `;

    const result = await executeQuery(query, { userId: req.user.id });
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado en la base de datos' });
    }

    const userData = result.recordset[0];
    
    // Formatear los datos para el frontend
    const formattedUser = {
      id: userData.Id_Usuario,
      nombreCompleto: userData.Nombre_Completo,
      perfil: userData.Perfil,
      usuario: userData.Usuario,
      correo: userData.Correo,
      activo: userData.Activo?.trim() === 'SI',
      identificacion: userData.Identificacion,
      contactoEmergencia: userData.Contacto_Emergencia || '',
      // Campos adicionales para el perfil del admin
      tipoDocumento: 'Cédula de Ciudadanía',
      telefono: '',
      direccion: '',
      foto: ''
    };

    res.json({
      success: true,
      data: formattedUser
    });

  } catch (error) {
    console.error('Error obteniendo datos del usuario:', error);
    res.status(500).json({
      success: false,
      msg: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Ruta para buscar usuarios por identificación (para el admin)
router.get('/admin/search-user/:identificacion', auth, async (req, res) => {
  try {
    if (!req.user || (req.user.rol !== 'admin' && req.user.rol !== 'Administrador')) {
      return res.status(403).json({ msg: 'Acceso denegado. Solo administradores.' });
    }

    const { identificacion } = req.params;
    
    if (!identificacion) {
      return res.status(400).json({ msg: 'Identificación requerida' });
    }

    // Buscar en la base de datos por identificación
    const query = `
      SELECT 
        Id_Usuario,
        Nombre_Completo,
        Perfil,
        Usuario,
        Correo,
        Activo,
        Identificacion,
        Contacto_Emergencia
      FROM dbo.usuarios 
      WHERE Identificacion = @identificacion
    `;

    const result = await executeQuery(query, { identificacion });
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'Usuario no encontrado con esa identificación'
      });
    }

    const userData = result.recordset[0];
    
    // Formatear los datos para el frontend
    const formattedUser = {
      id: userData.Id_Usuario,
      nombreCompleto: userData.Nombre_Completo,
      perfil: userData.Perfil,
      usuario: userData.Usuario,
      correo: userData.Correo,
      activo: userData.Activo?.trim() === 'SI',
      identificacion: userData.Identificacion,
      contactoEmergencia: userData.Contacto_Emergencia || '',
      // Campos adicionales simulados para el formulario
      tipoDocumento: 'Cédula de Ciudadanía',
      fechaNacimiento: '',
      edad: '',
      sexoGenero: '',
      estadoCivil: '',
      telefono: '',
      direccion: '',
      eps: '',
      antecedentesMedicos: '',
      condicionEspecial: '',
      gradoCargo: '',
      institucion: '',
      foto: '',
      encontrado: true
    };

    res.json({
      success: true,
      data: formattedUser
    });

  } catch (error) {
    console.error('Error buscando usuario:', error);
    res.status(500).json({
      success: false,
      msg: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Ruta para crear un nuevo usuario con validación de duplicados
router.post('/admin/create-user', auth, async (req, res) => {
  try {
    // Verificar que el usuario sea administrador
    if (!req.user || (req.user.rol !== 'admin' && req.user.rol !== 'Administrador')) {
      return res.status(403).json({ msg: 'Acceso denegado. Solo administradores.' });
    }

    const {
      nombreCompleto,
      tipoDocumento,
      numeroDocumento,
      fechaNacimiento,
      edad,
      sexo,
      correoElectronico,
      telefono,
      direccion,
      eps, // desde frontend
      epsSeguroMedico, // nombre alternativo
      condicionEspecial,
      descripcionCondicion,
      contactoEmergencia,
      telefonoFamiliar, // desde frontend
      estadoActivo, // desde frontend
      usuarioActivo, // nombre alternativo
      perfil,
      contrasena,
      usuario
    } = req.body;

    // Mapear campos del frontend a los nombres esperados
    const finalEps = eps || epsSeguroMedico || 'No especificado';
    const finalContactoEmergencia = telefonoFamiliar || contactoEmergencia || telefono;
    const finalUsuarioActivo = estadoActivo !== undefined ? estadoActivo : (usuarioActivo !== undefined ? usuarioActivo : '1');

    // Validar campos requeridos
    if (!nombreCompleto || !numeroDocumento || !correoElectronico || !telefono || !usuario || !perfil) {
      return res.status(400).json({
        success: false,
        msg: 'Faltan campos requeridos: Nombre Completo, Número de Documento, Correo, Teléfono, Usuario y Perfil son obligatorios'
      });
    }

    // Validar longitud de contraseña (máximo 10 caracteres para el campo nchar(10))
    if (!contrasena || contrasena.length > 10) {
      return res.status(400).json({
        success: false,
        msg: 'La contraseña es obligatoria y debe tener máximo 10 caracteres'
      });
    }

    // Verificar duplicados en base de datos
    const checkDuplicatesQuery = `
      SELECT 
        Identificacion,
        Correo,
        Numero_Contacto_Emergencia,
        Usuario
      FROM dbo.usuarios 
      WHERE Identificacion = @numeroDocumento 
         OR Correo = @correoElectronico 
         OR Contacto_Emergencia = @telefono
         OR Usuario = @usuario
    `;

    const duplicateCheck = await executeQuery(checkDuplicatesQuery, {
      numeroDocumento,
      correoElectronico,
      telefono: finalContactoEmergencia,
      usuario
    });

    if (duplicateCheck.recordset && duplicateCheck.recordset.length > 0) {
      const duplicates = duplicateCheck.recordset[0];
      let duplicateFields = [];
      
      if (duplicates.Identificacion === numeroDocumento) duplicateFields.push('Número de Documento');
      if (duplicates.Correo === correoElectronico) duplicateFields.push('Correo Electrónico');
      if (duplicates.Contacto_Emergencia === telefono) duplicateFields.push('Teléfono');
      if (duplicates.Usuario === usuario) duplicateFields.push('Usuario');

      return res.status(400).json({
        success: false,
        msg: `Ya existe un usuario con los siguientes datos: ${duplicateFields.join(', ')}`,
        duplicateFields
      });
    }

    // Obtener el próximo ID disponible
    const maxIdQuery = `SELECT ISNULL(MAX(Id_Usuario), 0) + 1 as nextId FROM dbo.usuarios`;
    const maxIdResult = await executeQuery(maxIdQuery);
    const nextId = maxIdResult.recordset[0].nextId;

    // Insertar nuevo usuario
    const insertQuery = `
      INSERT INTO dbo.usuarios (
        Id_Usuario,
        Nombre_Completo,
        Perfil,
        Usuario,
        Correo,
        Activo,
        Identificacion,
        Contrasena,
        Contacto_Emergencia,
        Sexo,
        Tipo_Documento,
        Edad,
        Direccion,
        EPS,
        Numero_Contacto_Emergencia,
        Fecha_Nacimiento
      ) VALUES (
        @idUsuario,
        @nombreCompleto,
        @perfil,
        @usuario,
        @correoElectronico,
        @activo,
        @numeroDocumento,
        @contrasena,
        @telefono,
        @sexo,
        @tipoDocumento,
        @edad,
        @direccion,
        @epsSeguroMedico,
        @contactoEmergencia,
        @fechaNacimiento
      )
    `;

    await executeQuery(insertQuery, {
      idUsuario: nextId,
      nombreCompleto,
      perfil,
      usuario,
      correoElectronico,
      activo: finalUsuarioActivo, // Cambiar usuarioActivo por activo
      numeroDocumento,
      contrasena: contrasena.padEnd(10, ' '), // Asegurar que tenga exactamente 10 caracteres
      telefono,
      sexo,
      tipoDocumento,
      edad: parseInt(edad) || 0,
      direccion,
      epsSeguroMedico: finalEps,
      contactoEmergencia: finalContactoEmergencia,
      fechaNacimiento
    });

    res.json({
      success: true,
      msg: 'Usuario creado exitosamente',
      data: {
        nombreCompleto,
        usuario,
        correoElectronico,
        perfil
      }
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({
      success: false,
      msg: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
