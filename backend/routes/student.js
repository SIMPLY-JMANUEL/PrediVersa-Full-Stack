// routes/student.js
// Rutas para el rol estudiante usando arrays en memoria
const express = require('express');
const router = express.Router();
const { jwtRequired, roleRequired } = require('../utils/jwt');
const { users, cuestionarios, recursos, respuestas } = require('../data');
const validateQuestionnaire = require('../middlewares/validateQuestionnaire');

// Helper para respuestas uniformes
function sendResponse(
  res,
  { success = true, msg = '', data = null, status = 200 }
) {
  res.status(status).json({ success, msg, data });
}

// GET /student/perfil
// Devuelve el perfil del estudiante autenticado
router.get('/perfil', jwtRequired, roleRequired('estudiante'), (req, res) => {
  const { id, nombre, correo, rol } = req.user;
  sendResponse(res, { data: { id, nombre, correo, rol } });
});

// GET /student/dashboard
// Resumen de actividad del estudiante
router.get(
  '/dashboard',
  jwtRequired,
  roleRequired('estudiante'),
  (req, res) => {
    const total_cuestionarios = cuestionarios.length;
    const recursos_disponibles = recursos.length;
    const respuestas_hechas = respuestas.filter(
      r => r.usuario_id == req.user.id
    ).length;
    sendResponse(res, {
      data: {
        nombre: req.user.nombre,
        total_cuestionarios,
        recursos_disponibles,
        respuestas_hechas,
        fecha_ultimo_acceso: req.user.fecha_registro,
      },
    });
  }
);

// GET /student/cuestionarios
// Lista de cuestionarios disponibles
router.get(
  '/cuestionarios',
  jwtRequired,
  roleRequired('estudiante'),
  (req, res) => {
    const lista = cuestionarios.map(c => ({
      id: c.id,
      titulo: c.titulo,
      descripcion: c.descripcion,
      fecha_creacion: c.fecha_creacion,
    }));
    sendResponse(res, { data: lista });
  }
);

// POST /student/cuestionarios/:id/responder
// Registrar respuestas a un cuestionario
router.post(
  '/cuestionarios/:id/responder',
  jwtRequired,
  roleRequired('estudiante'),
  (req, res) => {
    const { respuestas: resp } = req.body;
    const cuestionario = cuestionarios.find(c => c.id == req.params.id);
    if (!cuestionario) {
      return sendResponse(res, {
        success: false,
        msg: 'Cuestionario no encontrado',
        status: 404,
      });
    }
    if (!resp || !Array.isArray(resp) || resp.length === 0) {
      return sendResponse(res, {
        success: false,
        msg: 'Faltan respuestas',
        status: 400,
      });
    }
    respuestas.push({
      id: respuestas.length + 1,
      usuario_id: req.user.id,
      cuestionario_id: req.params.id,
      fecha_respuesta: new Date().toISOString(),
      respuestas: resp,
    });
    sendResponse(res, { msg: 'Respuesta registrada correctamente' });
  }
);

// GET /student/historial
// Historial de cuestionarios respondidos
router.get(
  '/historial',
  jwtRequired,
  roleRequired('estudiante'),
  (req, res) => {
    const historial = respuestas
      .filter(r => r.usuario_id == req.user.id)
      .map(r => ({
        cuestionario_id: r.cuestionario_id,
        fecha_respuesta: r.fecha_respuesta,
        respuestas: r.respuestas,
      }));
    sendResponse(res, { data: historial });
  }
);

// GET /student/recursos
// Recursos disponibles para el estudiante
router.get('/recursos', jwtRequired, roleRequired('estudiante'), (req, res) => {
  const lista = recursos.map(r => ({
    id: r.id,
    titulo: r.titulo,
    descripcion: r.descripcion,
    url: r.url,
    fecha_creacion: r.fecha_creacion,
  }));
  sendResponse(res, { data: lista });
});

// ==============================================
// ENDPOINTS ESPECÍFICOS PARA ENCUESTAS DE EVALUACIÓN
// ==============================================

// ENDPOINTS DE PRUEBA (SIN AUTENTICACIÓN) - SOLO PARA TESTING
// TODO: Eliminar estos endpoints en producción

// GET /student/test/ping
// Endpoint simple de ping para verificar conectividad
router.get('/test/ping', (req, res) => {
  sendResponse(res, {
    data: {
      message: 'Endpoint de estudiante funcionando',
      timestamp: new Date().toISOString(),
      available_endpoints: [
        'GET /student/test/ping',
        'POST /student/test/emocional',
        'POST /student/test/violencia',
      ],
    },
  });
});

// POST /student/test/emocional
// Endpoint de prueba para evaluación emocional (sin auth)
router.post('/test/emocional', (req, res) => {
  const { respuestas } = req.body;

  if (!respuestas || typeof respuestas !== 'object') {
    return sendResponse(res, {
      success: false,
      msg: 'Respuestas inválidas',
      status: 400,
    });
  }

  // Lógica de evaluación emocional
  const valores = Object.values(respuestas).map(v => parseInt(v));
  const sumaTotal = valores.reduce((sum, val) => sum + val, 0);
  const promedio = sumaTotal / valores.length;

  let nivelBienestar,
    mensaje,
    requiereAtencion = false;

  if (promedio >= 4) {
    nivelBienestar = 'alto';
    mensaje =
      '😊 Tu bienestar emocional está en un buen nivel. Continúa cuidando tu salud mental.';
  } else if (promedio >= 2.5) {
    nivelBienestar = 'medio';
    mensaje =
      '😐 Tu bienestar emocional es moderado. Considera buscar apoyo si sientes que lo necesitas.';
    requiereAtencion = true;
  } else {
    nivelBienestar = 'bajo';
    mensaje =
      '😔 Tu bienestar emocional necesita atención. Te recomendamos hablar con nuestro equipo de apoyo.';
    requiereAtencion = true;
  }

  sendResponse(res, {
    data: {
      evaluacionId: Date.now(),
      puntuacionTotal: sumaTotal,
      promedio: promedio.toFixed(1),
      nivelBienestar,
      requiereAtencion,
      mensaje,
      recursosSugeridos: requiereAtencion
        ? [
            {
              id: 1,
              titulo: 'Técnicas de manejo emocional',
              tipo: 'guia',
              url: '/recursos/bienestar-emocional',
            },
          ]
        : [],
      contactoEmergencia: requiereAtencion
        ? {
            telefono: '+57 123 456 7890',
            email: 'apoyo@prediversa.com',
            disponible24h: true,
          }
        : null,
    },
  });
});

// POST /student/test/violencia
// Endpoint de prueba para evaluación de violencia (sin auth)
router.post('/test/violencia', (req, res) => {
  const { respuestas } = req.body;

  if (!respuestas || typeof respuestas !== 'object') {
    return sendResponse(res, {
      success: false,
      msg: 'Respuestas inválidas',
      status: 400,
    });
  }

  // Contar respuestas "si" (situaciones de violencia detectadas)
  const answers = Object.values(respuestas);
  const situacionesDetectadas = answers.filter(
    answer => answer === 'si'
  ).length;

  let nivelRiesgo,
    mensaje,
    requiereAtencion = false;

  if (situacionesDetectadas === 0) {
    nivelRiesgo = 'bajo';
    mensaje =
      '✅ Excelente. No identificas situaciones de violencia en tu entorno. Mantente siempre alerta y recuerda que puedes acudir a nosotros si algo cambia.';
  } else if (situacionesDetectadas <= 2) {
    nivelRiesgo = 'medio';
    mensaje =
      '⚠️ Has identificado algunas situaciones preocupantes. Te recomendamos hablar con nuestro equipo de orientación para recibir apoyo.';
    requiereAtencion = true;
  } else {
    nivelRiesgo = 'alto';
    mensaje =
      '🚨 Has identificado varias situaciones de violencia. Es importante que busques ayuda inmediatamente. Nuestro equipo está aquí para apoyarte.';
    requiereAtencion = true;
  }

  sendResponse(res, {
    data: {
      evaluacionId: Date.now(),
      situacionesDetectadas,
      nivelRiesgo,
      requiereAtencion,
      mensaje,
      recursosSugeridos: requiereAtencion
        ? [
            {
              id: 1,
              titulo: 'Cómo identificar violencia escolar',
              tipo: 'guia',
              url: '/recursos/violencia-escolar',
            },
          ]
        : [],
      contactoEmergencia: requiereAtencion
        ? {
            telefono: '+57 123 456 7890',
            email: 'apoyo@prediversa.com',
            disponible24h: true,
          }
        : null,
    },
  });
});

// POST /student/cuestionarios/emocional/evaluar
// Evaluar estado emocional del estudiante
router.post(
  '/cuestionarios/emocional/evaluar',
  jwtRequired,
  roleRequired('estudiante'),
  validateQuestionnaire,
  (req, res) => {
    const { respuestas } = req.body;

    if (!respuestas || typeof respuestas !== 'object') {
      return sendResponse(res, {
        success: false,
        msg: 'Respuestas inválidas',
        status: 400,
      });
    }

    // Lógica de evaluación emocional
    const valores = Object.values(respuestas).map(v => parseInt(v));
    const sumaTotal = valores.reduce((sum, val) => sum + val, 0);
    const promedio = sumaTotal / valores.length;

    let nivelBienestar,
      mensaje,
      requiereAtencion = false;

    if (promedio >= 4) {
      nivelBienestar = 'alto';
      mensaje =
        '😊 Tu bienestar emocional está en un buen nivel. Continúa cuidando tu salud mental.';
    } else if (promedio >= 2.5) {
      nivelBienestar = 'medio';
      mensaje =
        '😐 Tu bienestar emocional es moderado. Considera buscar apoyo si sientes que lo necesitas.';
      requiereAtencion = true;
    } else {
      nivelBienestar = 'bajo';
      mensaje =
        '😔 Tu bienestar emocional necesita atención. Te recomendamos hablar con nuestro equipo de apoyo.';
      requiereAtencion = true;
    }

    // Guardar evaluación
    const evaluacionId = respuestas.length + 1;
    respuestas.push({
      id: evaluacionId,
      usuario_id: req.user.id,
      tipo_evaluacion: 'emocional',
      fecha_evaluacion: new Date().toISOString(),
      respuestas_originales: respuestas,
      puntuacion: sumaTotal,
      promedio,
      nivel: nivelBienestar,
      requiere_atencion: requiereAtencion,
    });

    sendResponse(res, {
      data: {
        evaluacionId,
        puntuacionTotal: sumaTotal,
        promedio: promedio.toFixed(1),
        nivelBienestar,
        requiereAtencion,
        mensaje,
        recursosSugeridos: requiereAtencion
          ? [
              {
                id: 1,
                titulo: 'Técnicas de manejo emocional',
                tipo: 'guia',
                url: '/recursos/bienestar-emocional',
              },
            ]
          : [],
        contactoEmergencia: requiereAtencion
          ? {
              telefono: '+57 123 456 7890',
              email: 'apoyo@prediversa.com',
              disponible24h: true,
            }
          : null,
      },
    });
  }
);

// POST /student/cuestionarios/violencia/evaluar
// Evaluar situaciones de violencia identificadas
router.post(
  '/cuestionarios/violencia/evaluar',
  jwtRequired,
  roleRequired('estudiante'),
  validateQuestionnaire,
  (req, res) => {
    const { respuestas } = req.body;

    if (!respuestas || typeof respuestas !== 'object') {
      return sendResponse(res, {
        success: false,
        msg: 'Respuestas inválidas',
        status: 400,
      });
    }

    // Contar respuestas "si" (situaciones de violencia detectadas)
    const answers = Object.values(respuestas);
    const situacionesDetectadas = answers.filter(
      answer => answer === 'si'
    ).length;

    let nivelRiesgo,
      mensaje,
      requiereAtencion = false;

    if (situacionesDetectadas === 0) {
      nivelRiesgo = 'bajo';
      mensaje =
        '✅ Excelente. No identificas situaciones de violencia en tu entorno. Mantente siempre alerta y recuerda que puedes acudir a nosotros si algo cambia.';
    } else if (situacionesDetectadas <= 2) {
      nivelRiesgo = 'medio';
      mensaje =
        '⚠️ Has identificado algunas situaciones preocupantes. Te recomendamos hablar con nuestro equipo de orientación para recibir apoyo.';
      requiereAtencion = true;
    } else {
      nivelRiesgo = 'alto';
      mensaje =
        '🚨 Has identificado varias situaciones de violencia. Es importante que busques ayuda inmediatamente. Nuestro equipo está aquí para apoyarte.';
      requiereAtencion = true;
    }

    // Guardar evaluación
    const evaluacionId = respuestas.length + 1;
    respuestas.push({
      id: evaluacionId,
      usuario_id: req.user.id,
      tipo_evaluacion: 'violencia',
      fecha_evaluacion: new Date().toISOString(),
      respuestas_originales: respuestas,
      situaciones_detectadas: situacionesDetectadas,
      nivel_riesgo: nivelRiesgo,
      requiere_atencion: requiereAtencion,
    });

    sendResponse(res, {
      data: {
        evaluacionId,
        situacionesDetectadas,
        nivelRiesgo,
        requiereAtencion,
        mensaje,
        recursosSugeridos: requiereAtencion
          ? [
              {
                id: 1,
                titulo: 'Cómo identificar violencia escolar',
                tipo: 'guia',
                url: '/recursos/violencia-escolar',
              },
            ]
          : [],
        contactoEmergencia: requiereAtencion
          ? {
              telefono: '+57 123 456 7890',
              email: 'apoyo@prediversa.com',
              disponible24h: true,
            }
          : null,
      },
    });
  }
);

// POST /student/cuestionarios/victima/evaluar
// Evaluar señales de víctima de violencia
router.post(
  '/cuestionarios/victima/evaluar',
  jwtRequired,
  roleRequired('estudiante'),
  validateQuestionnaire,
  (req, res) => {
    const { respuestas } = req.body;

    if (!respuestas || typeof respuestas !== 'object') {
      return sendResponse(res, {
        success: false,
        msg: 'Respuestas inválidas',
        status: 400,
      });
    }

    // Contar señales positivas
    const answers = Object.values(respuestas);
    const senalesDetectadas = answers.filter(answer => answer === 'si').length;

    let nivelRiesgo,
      mensaje,
      requiereAtencion = false,
      activarProtocolo = false;

    if (senalesDetectadas === 0) {
      nivelRiesgo = 'bajo';
      mensaje =
        '✅ No se detectan señales de victimización. Continúa cuidándote y mantente alerta.';
    } else if (senalesDetectadas <= 2) {
      nivelRiesgo = 'medio';
      mensaje =
        '⚠️ Se detectan algunas señales preocupantes. Te recomendamos hablar con alguien de confianza.';
      requiereAtencion = true;
    } else {
      nivelRiesgo = 'alto';
      mensaje =
        '🚨 Se detectan múltiples señales de victimización. Es urgente que busques ayuda especializada.';
      requiereAtencion = true;
      activarProtocolo = true;
    }

    // Guardar evaluación
    const evaluacionId = respuestas.length + 1;
    respuestas.push({
      id: evaluacionId,
      usuario_id: req.user.id,
      tipo_evaluacion: 'victima',
      fecha_evaluacion: new Date().toISOString(),
      respuestas_originales: respuestas,
      senales_detectadas: senalesDetectadas,
      nivel_riesgo: nivelRiesgo,
      requiere_atencion: requiereAtencion,
      activar_protocolo: activarProtocolo,
    });

    sendResponse(res, {
      data: {
        evaluacionId,
        senalesDetectadas,
        nivelRiesgo,
        requiereAtencion,
        activarProtocolo,
        mensaje,
        recursosSugeridos: requiereAtencion
          ? [
              {
                id: 1,
                titulo: 'Protocolo de protección',
                tipo: 'protocolo',
                url: '/recursos/protocolo-proteccion',
              },
            ]
          : [],
        contactoEmergencia: requiereAtencion
          ? {
              telefono: '+57 123 456 7890',
              email: 'apoyo@prediversa.com',
              disponible24h: true,
            }
          : null,
      },
    });
  }
);

// POST /student/cuestionarios/derechos/evaluar
// Evaluar conocimiento sobre derechos
router.post(
  '/cuestionarios/derechos/evaluar',
  jwtRequired,
  roleRequired('estudiante'),
  validateQuestionnaire,
  (req, res) => {
    const { respuestas } = req.body;

    if (!respuestas || typeof respuestas !== 'object') {
      return sendResponse(res, {
        success: false,
        msg: 'Respuestas inválidas',
        status: 400,
      });
    }

    // Respuestas correctas (hardcodeadas para demo)
    const respuestasCorrectas = {
      pregunta1: 'si', // Derecho a educación libre de violencia
      pregunta2: 'no', // Profesores NO pueden revisar pertenencias sin consentimiento
      pregunta3: 'si', // Derecho a denunciar discriminación
    };

    // Calcular respuestas correctas
    const respuestasUsuario = respuestas;
    let respuestasAcertadas = 0;

    Object.keys(respuestasCorrectas).forEach(pregunta => {
      if (respuestasUsuario[pregunta] === respuestasCorrectas[pregunta]) {
        respuestasAcertadas++;
      }
    });

    let nivelConocimiento, mensaje;

    if (respuestasAcertadas === 3) {
      nivelConocimiento = 'alto';
      mensaje =
        '🌟 ¡Excelente! Conoces muy bien tus derechos. Este conocimiento te empodera y te protege.';
    } else if (respuestasAcertadas === 2) {
      nivelConocimiento = 'medio';
      mensaje =
        '👍 Tienes un buen conocimiento de tus derechos, pero hay áreas que puedes reforzar. Te recomendamos revisar más información.';
    } else {
      nivelConocimiento = 'bajo';
      mensaje =
        '📖 Es importante que te informes más sobre tus derechos. El conocimiento es tu mejor herramienta de protección.';
    }

    // Guardar evaluación
    const evaluacionId = respuestas.length + 1;
    respuestas.push({
      id: evaluacionId,
      usuario_id: req.user.id,
      tipo_evaluacion: 'derechos',
      fecha_evaluacion: new Date().toISOString(),
      respuestas_originales: respuestas,
      respuestas_correctas: respuestasAcertadas,
      total_preguntas: 3,
      nivel_conocimiento: nivelConocimiento,
    });

    sendResponse(res, {
      data: {
        evaluacionId,
        respuestasCorrectas: respuestasAcertadas,
        totalPreguntas: 3,
        porcentajeAcierto: Math.round((respuestasAcertadas / 3) * 100),
        nivelConocimiento,
        mensaje,
        recursosSugeridos:
          respuestasAcertadas < 3
            ? [
                {
                  id: 1,
                  titulo: 'Guía de derechos estudiantiles',
                  tipo: 'guia',
                  url: '/recursos/derechos-estudiantiles',
                },
              ]
            : [],
        respuestasDetalladas: Object.keys(respuestasCorrectas).map(
          pregunta => ({
            pregunta,
            tuRespuesta: respuestasUsuario[pregunta],
            respuestaCorrecta: respuestasCorrectas[pregunta],
            esCorrecta:
              respuestasUsuario[pregunta] === respuestasCorrectas[pregunta],
          })
        ),
      },
    });
  }
);

module.exports = router;
