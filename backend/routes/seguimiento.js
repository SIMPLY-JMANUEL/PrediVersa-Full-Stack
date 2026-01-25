const express = require('express');
const router = express.Router();
const RequerimientosMySQL = require('../models/RequerimientosMySQL');
const verify = require('../middlewares/auth');

// Helper para respuestas uniformes
function sendResponse(
  res,
  { success = true, msg = '', data = null, status = 200 }
) {
  res.status(status).json({ success, msg, data });
}

// POST /api/seguimiento/crear - Crear nuevo requerimiento/seguimiento
router.post('/crear', verify, async (req, res) => {
  try {
    const {
      idAlerta,
      numeroAlerta,
      numeroCaso,
      descripcionRequerimiento,
      estadoRequerimiento,
      prioridad,
      fechaLimite,
      profesionalAsignado,
      fechaSeguimiento,
      resultadoSeguimiento,
      porcentajeCompletitud,
      accionesTomadas,
      proximasAcciones,
      requiereSeguimientoAdicional,
      fechaProximoSeguimiento,
      intervinientes,
      evidenciaDocumental,
      observaciones
    } = req.body;

    // Validaciones
    if (!descripcionRequerimiento || !descripcionRequerimiento.trim()) {
      return sendResponse(res, {
        success: false,
        msg: 'La descripción del requerimiento es obligatoria',
        status: 400
      });
    }

    if (!profesionalAsignado || !profesionalAsignado.trim()) {
      return sendResponse(res, {
        success: false,
        msg: 'El profesional asignado es obligatorio',
        status: 400
      });
    }

    if (!estadoRequerimiento) {
      return sendResponse(res, {
        success: false,
        msg: 'El estado del requerimiento es obligatorio',
        status: 400
      });
    }

    // Crear requerimiento
    const payload = {
      idAlerta: idAlerta || null,
      numeroAlerta: numeroAlerta || null,
      numeroCaso: numeroCaso || null,
      descripcionRequerimiento,
      estadoRequerimiento,
      prioridad: prioridad || 'normal',
      fechaLimite,
      profesionalAsignado,
      fechaSeguimiento: fechaSeguimiento || new Date().toISOString().split('T')[0],
      resultadoSeguimiento,
      porcentajeCompletitud: porcentajeCompletitud || 0,
      accionesTomadas,
      proximasAcciones,
      requiereSeguimientoAdicional,
      fechaProximoSeguimiento,
      intervinientes,
      evidenciaDocumental,
      observaciones,
      usuarioId: req.user?.id || null
    };

    const result = await RequerimientosMySQL.createRequerimiento(payload);

    return sendResponse(res, {
      success: true,
      msg: 'Requerimiento de seguimiento creado exitosamente',
      data: {
        id: result.id,
        numeroCaso
      },
      status: 201
    });

  } catch (error) {
    console.error('Error creando requerimiento:', error);
    return sendResponse(res, {
      success: false,
      msg: error.message || 'Error al crear el requerimiento de seguimiento',
      status: 500
    });
  }
});

// GET /api/seguimiento/:id - Obtener requerimiento por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const requerimiento = await RequerimientosMySQL.getRequerimientoById(id);

    if (!requerimiento) {
      return sendResponse(res, {
        success: false,
        msg: 'Requerimiento no encontrado',
        status: 404
      });
    }

    return sendResponse(res, {
      success: true,
      data: requerimiento
    });

  } catch (error) {
    console.error('Error obteniendo requerimiento:', error);
    return sendResponse(res, {
      success: false,
      msg: error.message || 'Error al obtener el requerimiento',
      status: 500
    });
  }
});

// GET /api/seguimiento/alerta/:idAlerta - Obtener requerimientos por alerta
router.get('/alerta/:idAlerta', async (req, res) => {
  try {
    const { idAlerta } = req.params;

    const requerimientos = await RequerimientosMySQL.getRequerimientosPorAlerta(idAlerta);

    return sendResponse(res, {
      success: true,
      data: requerimientos
    });

  } catch (error) {
    console.error('Error obteniendo requerimientos por alerta:', error);
    return sendResponse(res, {
      success: false,
      msg: error.message || 'Error al obtener los requerimientos',
      status: 500
    });
  }
});

// GET /api/seguimiento - Listar todos los requerimientos con filtros
router.get('/', async (req, res) => {
  try {
    const {
      estado,
      prioridad,
      profesional,
      numeroAlerta,
      limit = 50,
      offset = 0
    } = req.query;

    const filtros = {
      estadoRequerimiento: estado,
      prioridad,
      profesionalAsignado: profesional,
      numeroAlerta
    };

    const requerimientos = await RequerimientosMySQL.getAllRequerimientos(
      filtros,
      parseInt(limit),
      parseInt(offset)
    );

    return sendResponse(res, {
      success: true,
      data: requerimientos
    });

  } catch (error) {
    console.error('Error listando requerimientos:', error);
    return sendResponse(res, {
      success: false,
      msg: error.message || 'Error al listar los requerimientos',
      status: 500
    });
  }
});

// PUT /api/seguimiento/:id - Actualizar requerimiento
router.put('/:id', verify, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar que existe el requerimiento
    const requerimiento = await RequerimientosMySQL.getRequerimientoById(id);
    if (!requerimiento) {
      return sendResponse(res, {
        success: false,
        msg: 'Requerimiento no encontrado',
        status: 404
      });
    }

    const result = await RequerimientosMySQL.updateRequerimiento(id, updateData);

    return sendResponse(res, {
      success: true,
      msg: 'Requerimiento actualizado exitosamente',
      data: { affectedRows: result.affectedRows }
    });

  } catch (error) {
    console.error('Error actualizando requerimiento:', error);
    return sendResponse(res, {
      success: false,
      msg: error.message || 'Error al actualizar el requerimiento',
      status: 500
    });
  }
});

// DELETE /api/seguimiento/:id - Eliminar requerimiento
router.delete('/:id', verify, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que existe el requerimiento
    const requerimiento = await RequerimientosMySQL.getRequerimientoById(id);
    if (!requerimiento) {
      return sendResponse(res, {
        success: false,
        msg: 'Requerimiento no encontrado',
        status: 404
      });
    }

    const result = await RequerimientosMySQL.deleteRequerimiento(id);

    return sendResponse(res, {
      success: true,
      msg: 'Requerimiento eliminado exitosamente',
      data: { affectedRows: result.affectedRows }
    });

  } catch (error) {
    console.error('Error eliminando requerimiento:', error);
    return sendResponse(res, {
      success: false,
      msg: error.message || 'Error al eliminar el requerimiento',
      status: 500
    });
  }
});

// GET /api/seguimiento/resumen/estadisticas - Obtener resumen estadístico
router.get('/resumen/estadisticas', async (req, res) => {
  try {
    const resumen = await RequerimientosMySQL.getRequerimientosResumen();

    return sendResponse(res, {
      success: true,
      data: resumen
    });

  } catch (error) {
    console.error('Error obteniendo resumen:', error);
    return sendResponse(res, {
      success: false,
      msg: error.message || 'Error al obtener el resumen',
      status: 500
    });
  }
});

// GET /api/seguimiento/pendientes/lista - Obtener requerimientos pendientes
router.get('/pendientes/lista', async (req, res) => {
  try {
    const pendientes = await RequerimientosMySQL.getRequerimientosPendientes();

    return sendResponse(res, {
      success: true,
      data: pendientes
    });

  } catch (error) {
    console.error('Error obteniendo pendientes:', error);
    return sendResponse(res, {
      success: false,
      msg: error.message || 'Error al obtener los requerimientos pendientes',
      status: 500
    });
  }
});

// GET /api/seguimiento/vencidos/lista - Obtener requerimientos vencidos
router.get('/vencidos/lista', async (req, res) => {
  try {
    const vencidos = await RequerimientosMySQL.getRequerimientosVencidos();

    return sendResponse(res, {
      success: true,
      data: vencidos
    });

  } catch (error) {
    console.error('Error obteniendo vencidos:', error);
    return sendResponse(res, {
      success: false,
      msg: error.message || 'Error al obtener los requerimientos vencidos',
      status: 500
    });
  }
});

module.exports = router;
