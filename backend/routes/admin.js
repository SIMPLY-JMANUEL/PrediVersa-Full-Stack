const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, getUserById, searchUsers } = require('../models/UserMySQL');
const Alerta = require('../models/AlertaMySQL');

// Helper para respuestas uniformes
function sendResponse(
  res,
  { success = true, msg = '', data = null, status = 200 }
) {
  res.status(status).json({ success, msg, data });
}

// GET /api/admin/system-status - Obtener estado del sistema
router.get('/system-status', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'operational',
      services: {
        backend: 'running',
        frontend: 'running',
        api_gateway: 'running',
      },
      timestamp: new Date().toISOString(),
    },
  });
});

// GET /api/admin/perfil - Perfil del admin
router.get('/perfil', (req, res) => {
  sendResponse(res, {
    data: {
      id: 1,
      nombre: 'Administrador',
      correo: 'admin@prediversa.com',
      rol: 'admin',
    },
  });
});

// GET /api/admin/stats - Estadísticas básicas
router.get('/stats', (req, res) => {
  sendResponse(res, {
    data: {
      usuarios_activos: 7,
      usuarios_totales: 7,
      sesiones_activas: 1,
      uptime: Math.floor(process.uptime()),
      totalUsers: 7,
      totalStudents: 3,
      totalTeachers: 2,
      totalParents: 1,
      recentReports: 5,
      pendingPQRs: 2,
    },
  });
});

// GET /api/admin/system-alerts - Alertas del sistema (mock)
router.get('/system-alerts', (req, res) => {
  const alerts = [
    {
      id: 1,
      title: 'Sistema Operativo',
      message: 'Todos los servicios funcionando correctamente',
      timestamp: new Date().toISOString(),
      level: 'info',
    },
    {
      id: 2,
      title: 'Usuarios Activos',
      message: 'Se registraron 3 nuevos usuarios hoy',
      timestamp: new Date().toISOString(),
      level: 'success',
    },
  ];

  sendResponse(res, {
    success: true,
    data: alerts,
  });
});

// GET /api/admin/users - Obtener usuarios desde AWS RDS MySQL
router.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    sendResponse(res, { data: users });
  } catch (error) {
    console.error('Error getting users:', error);
    sendResponse(res, {
      success: false,
      msg: 'Error al obtener usuarios',
      status: 500,
    });
  }
});

// POST /api/admin/users - Crear usuario en AWS RDS MySQL
router.post('/users', async (req, res) => {
  try {
    console.log('📝 Crear usuario - Request body completo:', JSON.stringify(req.body, null, 2));
    const {
      nombre,
      correo,
      usuario,
      password,
      rol,
      telefono,
      edad,
      tipoDocumento,
      numeroDocumento,
      direccion,
      fechaNacimiento,
      sexo,
      eps,
      condicionEspecial,
      descripcionCondicion,
      contactoEmergencia,
      numeroContactoEmergencia,
      activo,
    } = req.body;

    console.log('📊 Campos extraídos:', {
      nombre,
      correo,
      usuario,
      password: password ? '***' : undefined,
      rol,
      numeroDocumento,
      tipoDocumento
    });

    if (!nombre || !correo || !usuario || !password || !rol || !numeroDocumento) {
      console.error('❌ Faltan campos obligatorios:', {
        nombre: !!nombre,
        correo: !!correo,
        usuario: !!usuario,
        password: !!password,
        rol: !!rol,
        numeroDocumento: !!numeroDocumento
      });
      return sendResponse(res, {
        success: false,
        msg: 'Faltan campos obligatorios: nombre, correo, usuario, password, rol, numeroDocumento',
        status: 400,
      });
    }

    // Mapear a la estructura que espera el modelo UserMySQL.createUser
    const userData = {
      nombreCompleto: nombre,
      correo,
      usuario,
      contrasena: password,
      perfil: rol,
      telefono: telefono || '',
      edad: edad || null,
      activo: activo || 'SI',
      // Campos opcionales con valores por defecto para evitar NOT NULL
      tipoDocumento: tipoDocumento || '',
      identificacion: numeroDocumento,
      direccion: direccion || '',
      fechaNacimiento: fechaNacimiento || null,
      sexo: sexo || '',
      eps: eps || '',
      condicionEspecial: condicionEspecial || '',
      descripcionCondicion: descripcionCondicion || '',
      contactoEmergencia: contactoEmergencia || '',
      numeroContactoEmergencia: numeroContactoEmergencia || '',
    };

    console.log('🔄 Datos mapeados para UserMySQL.createUser:', userData);

    const newUserId = await createUser(userData);

    console.log('✅ Usuario creado exitosamente con ID:', newUserId.id);

    sendResponse(res, {
      msg: 'Usuario creado exitosamente',
      data: { id: newUserId.id },
    });
  } catch (error) {
    console.error('❌ Error creating user - Stack:', error.stack);
    console.error('❌ Error creating user - Message:', error.message);
    sendResponse(res, {
      success: false,
      msg: `Error al crear usuario: ${error.message}`,
      status: 500,
    });
  }
});

// GET /api/admin/search-users - Buscar usuarios por documento o nombre
router.get('/search-users', async (req, res) => {
  try {
    const { documento, nombre } = req.query;

    if (!documento && !nombre) {
      return sendResponse(res, {
        success: false,
        msg: 'Debe proporcionar al menos un criterio de búsqueda (documento o nombre)',
        status: 400,
      });
    }

    // Usar el modelo UserMySQL para buscar
    const users = await searchUsers(documento, nombre);
    
    sendResponse(res, {
      success: true,
      data: users,
      msg: `Se encontraron ${users.length} usuarios`
    });
  } catch (error) {
    console.error('Error en búsqueda de usuarios:', error);
    sendResponse(res, {
      success: false,
      msg: 'Error al buscar usuarios: ' + error.message,
      status: 500,
    });
  }
});

// GET /api/admin/users/:id - Obtener usuario por ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    
    if (!user) {
      return sendResponse(res, {
        success: false,
        msg: 'Usuario no encontrado',
        status: 404,
      });
    }

    sendResponse(res, {
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    sendResponse(res, {
      success: false,
      msg: 'Error al obtener usuario',
      status: 500,
    });
  }
});

// PUT /api/admin/users/:id - Actualizar usuario
router.put('/users/:id', async (req, res) => {
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
      direccion,
      epsSeguroMedico,
      condicionEspecial,
      contactoEmergencia,
      telefonoFamiliar,
      perfil,
      usuario,
      usuarioActivo,
      contrasena,
    } = req.body;

    // Construir objeto de actualización
    const userData = {};
    if (nombreCompleto) userData.Nombre_Completo = nombreCompleto;
    if (tipoDocumento) userData.Tipo_Documento = tipoDocumento;
    if (numeroDocumento) userData.Identificacion = numeroDocumento;
    if (fechaNacimiento) userData.Fecha_Nacimiento = fechaNacimiento;
    if (edad) userData.Edad = edad;
    if (sexo) userData.Sexo = sexo;
    if (correoElectronico) userData.Correo = correoElectronico;
    if (direccion) userData.Direccion = direccion;
    if (epsSeguroMedico) userData.EPS = epsSeguroMedico;
    if (condicionEspecial) userData.Condicion_Especial = condicionEspecial;
    if (contactoEmergencia) userData.Contacto_Emergencia = contactoEmergencia;
    if (telefonoFamiliar) userData.Numero_Contacto_Emergencia = telefonoFamiliar;
    if (perfil) userData.Perfil = perfil;
    if (usuario) userData.Usuario = usuario;
    if (usuarioActivo) userData.Activo = usuarioActivo;
    if (contrasena) userData.Contrasena = contrasena;

    console.log('📝 Actualizando usuario ID:', id);
    console.log('📦 Datos a actualizar:', userData);

    const User = require('../models/UserMySQL');
    const success = await User.updateUser(id, userData);

    if (success) {
      sendResponse(res, {
        success: true,
        msg: 'Usuario actualizado correctamente',
      });
    } else {
      sendResponse(res, {
        success: false,
        msg: 'No se pudo actualizar el usuario',
        status: 400,
      });
    }
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    sendResponse(res, {
      success: false,
      msg: 'Error al actualizar usuario: ' + error.message,
      status: 500,
    });
  }
});

// DELETE /api/admin/users/:id - Eliminar usuario (desactivar)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const User = require('../models/UserMySQL');
    const success = await User.deleteUser(id);

    if (success) {
      sendResponse(res, {
        success: true,
        msg: 'Usuario desactivado correctamente',
      });
    } else {
      sendResponse(res, {
        success: false,
        msg: 'No se pudo desactivar el usuario',
        status: 400,
      });
    }
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    sendResponse(res, {
      success: false,
      msg: 'Error al eliminar usuario: ' + error.message,
      status: 500,
    });
  }
});

// ========================================
// ENDPOINTS DE ALERTAS
// ========================================

// POST /api/admin/alerts - Crear nueva alerta
router.post('/alerts', async (req, res) => {
  try {
    const alertaData = req.body;

    console.log('📝 Crear alerta - Data recibida:', JSON.stringify(alertaData, null, 2));

    // Validaciones básicas
    if (!alertaData.tipo_alerta || !alertaData.ubicacion || !alertaData.nombre_reportante) {
      return sendResponse(res, {
        success: false,
        msg: 'Faltan campos obligatorios: tipo_alerta, ubicacion, nombre_reportante',
        status: 400,
      });
    }

    // Crear alerta
    const result = await Alerta.createAlerta(alertaData);

    console.log('✅ Alerta creada exitosamente:', result);

    sendResponse(res, {
      success: true,
      msg: 'Alerta registrada exitosamente',
      data: { 
        id: result.Id_Alerta, 
        numeroAlerta: result.numeroAlerta
      },
    });
  } catch (error) {
    console.error('❌ Error creating alert:', error);
    sendResponse(res, {
      success: false,
      msg: 'Error al crear alerta: ' + error.message,
      status: 500,
    });
  }
});

// GET /api/admin/alerts - Obtener todas las alertas
router.get('/alerts', async (req, res) => {
  try {
    const { estado, prioridad, limit = 100, offset = 0 } = req.query;

    let alertas;
    if (estado) {
      alertas = await Alerta.getAlertasByEstado(estado, parseInt(limit), parseInt(offset));
    } else if (prioridad) {
      alertas = await Alerta.getAlertasByPrioridad(prioridad, parseInt(limit), parseInt(offset));
    } else {
      alertas = await Alerta.getAllAlertas(parseInt(limit), parseInt(offset));
    }

    sendResponse(res, {
      success: true,
      data: alertas,
      msg: `Se encontraron ${alertas.length} alertas`,
    });
  } catch (error) {
    console.error('Error obteniendo alertas:', error);
    sendResponse(res, {
      success: false,
      msg: 'Error al obtener alertas: ' + error.message,
      status: 500,
    });
  }
});

// GET /api/admin/alerts/:id - Obtener alerta por ID
router.get('/alerts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const alerta = await Alerta.getAlertaById(id);

    if (!alerta) {
      return sendResponse(res, {
        success: false,
        msg: 'Alerta no encontrada',
        status: 404,
      });
    }

    sendResponse(res, {
      success: true,
      data: alerta,
    });
  } catch (error) {
    console.error('Error obteniendo alerta:', error);
    sendResponse(res, {
      success: false,
      msg: 'Error al obtener alerta: ' + error.message,
      status: 500,
    });
  }
});

// PUT /api/admin/alerts/:id - Actualizar alerta
router.put('/alerts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const alertaData = req.body;

    console.log('📝 Actualizar alerta ID:', id);

    const success = await Alerta.updateAlerta(id, alertaData);

    if (success) {
      sendResponse(res, {
        success: true,
        msg: 'Alerta actualizada correctamente',
      });
    } else {
      sendResponse(res, {
        success: false,
        msg: 'No se pudo actualizar la alerta',
        status: 400,
      });
    }
  } catch (error) {
    console.error('Error actualizando alerta:', error);
    sendResponse(res, {
      success: false,
      msg: 'Error al actualizar alerta: ' + error.message,
      status: 500,
    });
  }
});

// DELETE /api/admin/alerts/:id - Eliminar/archivar alerta
router.delete('/alerts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const success = await Alerta.deleteAlerta(id);

    if (success) {
      sendResponse(res, {
        success: true,
        msg: 'Alerta archivada correctamente',
      });
    } else {
      sendResponse(res, {
        success: false,
        msg: 'No se pudo archivar la alerta',
        status: 400,
      });
    }
  } catch (error) {
    console.error('Error eliminando alerta:', error);
    sendResponse(res, {
      success: false,
      msg: 'Error al eliminar alerta: ' + error.message,
      status: 500,
    });
  }
});

module.exports = router;
