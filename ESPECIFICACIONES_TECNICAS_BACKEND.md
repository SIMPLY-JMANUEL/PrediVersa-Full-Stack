# 🔧 ESPECIFICACIONES TÉCNICAS: ENDPOINTS BACKEND REQUERIDOS

## 📚 ÍNDICE
1. [Endpoints de Evaluación de Cuestionarios](#endpoints-evaluación)
2. [Endpoints de Reportes](#endpoints-reportes)
3. [Endpoints de Estadísticas](#endpoints-estadísticas)
4. [Endpoints de Datos Seguros](#endpoints-datos-seguros)
5. [Modelos de Base de Datos](#modelos-bd)
6. [Middlewares de Seguridad](#middlewares)
7. [Ejemplos de Implementación](#ejemplos)

---

## 🧠 ENDPOINTS DE EVALUACIÓN DE CUESTIONARIOS {#endpoints-evaluación}

### 1. **Evaluación Emocional**
```javascript
POST /api/student/cuestionarios/emocional/evaluar
```

**Request Body:**
```json
{
  "respuestas": {
    "pregunta1": "4",
    "pregunta2": "3",
    "pregunta3": "5",
    "pregunta4": "4",
    "pregunta5": "3",
    "pregunta6": "2",
    "pregunta7": "1",
    "pregunta8": "2",
    "pregunta9": "1",
    "pregunta10": "2"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "evaluacionId": 123,
    "puntuacion": 7,
    "nivel": "positivo",
    "mensaje": "¡Excelente! Tu estado emocional es muy positivo. Sigue así 😊",
    "recomendaciones": [
      "Mantén tus rutinas de bienestar",
      "Comparte tu energía positiva con otros"
    ],
    "siguienteEvaluacion": "2024-01-30",
    "progreso": {
      "evaluacionesCompletadas": 3,
      "mejoraDesdeUltima": "+2 puntos"
    }
  }
}
```

**Lógica del Backend:**
```javascript
const evaluarEstadoEmocional = (respuestas) => {
  const preguntasPositivas = ['pregunta1', 'pregunta2', 'pregunta3', 'pregunta4', 'pregunta5'];
  const preguntasNegativas = ['pregunta6', 'pregunta7', 'pregunta8', 'pregunta9', 'pregunta10'];
  
  let puntuacionPositiva = 0;
  let puntuacionNegativa = 0;
  
  preguntasPositivas.forEach(p => {
    puntuacionPositiva += parseInt(respuestas[p] || 0);
  });
  
  preguntasNegativas.forEach(p => {
    puntuacionNegativa += parseInt(respuestas[p] || 0);
  });
  
  const puntuacionFinal = puntuacionPositiva - puntuacionNegativa;
  
  let nivel, mensaje;
  if (puntuacionFinal >= 5) {
    nivel = 'excelente';
    mensaje = '¡Excelente! Tu estado emocional es muy positivo. Sigue así 😊';
  } else if (puntuacionFinal >= 0) {
    nivel = 'positivo';
    mensaje = 'Tu estado emocional está balanceado. Te recomendamos seguir cuidando tu bienestar 💙';
  } else {
    nivel = 'necesita_atencion';
    mensaje = 'Notamos que puedes estar pasando por un momento difícil. Te recomendamos hablar con nuestro equipo de apoyo 🤗';
  }
  
  return { puntuacionFinal, nivel, mensaje };
};
```

---

### 2. **Evaluación de Violencia**
```javascript
POST /api/student/cuestionarios/violencia/evaluar
```

**Request Body:**
```json
{
  "respuestas": {
    "pregunta1": "no",
    "pregunta2": "si", 
    "pregunta3": "no",
    "pregunta4": "si",
    "pregunta5": "no"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "evaluacionId": 124,
    "situacionesDetectadas": 2,
    "nivelRiesgo": "medio",
    "requiereAtencion": true,
    "mensaje": "⚠️ Has identificado algunas situaciones preocupantes. Te recomendamos hablar con nuestro equipo de orientación para recibir apoyo.",
    "recursosSugeridos": [
      {
        "id": 1,
        "titulo": "Cómo identificar violencia escolar",
        "tipo": "guia",
        "url": "/recursos/violencia-escolar"
      }
    ],
    "contactoEmergencia": {
      "telefono": "+57 123 456 7890",
      "email": "apoyo@prediversa.com",
      "disponible24h": true
    }
  }
}
```

---

### 3. **Evaluación de Señales de Víctima**
```javascript
POST /api/student/cuestionarios/victima/evaluar
```

**Request Body:**
```json
{
  "respuestas": {
    "pregunta1": "si",
    "pregunta2": "si",
    "pregunta3": "no", 
    "pregunta4": "si"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "evaluacionId": 125,
    "senalesDetectadas": 3,
    "nivelAlerta": "alto",
    "requiereIntervencion": true,
    "mensaje": "🚨 Has identificado varias señales de que alguien puede estar en peligro. Te recomendamos buscar ayuda profesional para saber cómo actuar de la mejor manera.",
    "accionesRecomendadas": [
      "Acércate con cuidado a la persona",
      "Ofrece apoyo sin juzgar",
      "Busca ayuda profesional",
      "Mantén la confidencialidad"
    ],
    "protocoloSeguimiento": {
      "notificarEquipo": true,
      "seguimientoEn": "24 horas",
      "asignadoA": "equipo_psicologico"
    }
  }
}
```

---

### 4. **Evaluación de Conocimiento de Derechos**
```javascript
POST /api/student/cuestionarios/derechos/evaluar
```

**Request Body:**
```json
{
  "respuestas": {
    "pregunta1": "si",
    "pregunta2": "si",
    "pregunta3": "no"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "evaluacionId": 126,
    "respuestasCorrectas": 2,
    "porcentajeAcierto": 67,
    "nivel": "bueno",
    "mensaje": "👍 Tienes un buen conocimiento de tus derechos, pero hay áreas que puedes reforzar. Te recomendamos revisar más información.",
    "areasDeRefuerzo": [
      "Derechos en situaciones de acoso",
      "Procedimientos de denuncia"
    ],
    "recursosEducativos": [
      {
        "titulo": "Cartilla de Derechos del Estudiante",
        "tipo": "pdf",
        "url": "/recursos/derechos-estudiante.pdf"
      }
    ]
  }
}
```

---

## 📋 ENDPOINTS DE REPORTES {#endpoints-reportes}

### 1. **Crear Reporte de Incidente**
```javascript
POST /api/student/reportes/incidente
```

**Request Body:**
```json
{
  "esAnonimo": false,
  "datosPersonales": {
    "nombreCompleto": "Juan Pérez",
    "tipoDocumento": "CC",
    "numeroDocumento": "123456789",
    "fechaNacimiento": "2005-03-15",
    "edad": "18",
    "genero": "masculino",
    "estadoCivil": "soltero",
    "email": "juan.perez@email.com",
    "telefono": "+57 300 123 4567",
    "direccion": "Calle 123 #45-67",
    "ocupacion": "estudiante"
  },
  "datosInstitucion": {
    "eps": "EPS Salud Total",
    "historialMedico": "Ninguno relevante",
    "condicionEspecial": "Ninguna",
    "gradoPosicion": "11° Grado",
    "institucion": "Colegio San José",
    "nombreContactoEmergencia": "María Pérez",
    "telefonoContactoEmergencia": "+57 310 987 6543"
  },
  "datosIncidente": {
    "descripcion": "Situación de acoso verbal en el recreo",
    "evidencia": "Testimonios de compañeros",
    "contexto": "Patio principal durante el recreo",
    "emailContacto": "juan.perez@email.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "numeroReporte": "RPT-240130-001",
    "fechaCreacion": "2024-01-30T10:30:00Z",
    "estado": "recibido",
    "tiempoRespuestaEstimado": "24-48 horas",
    "casosAsignado": {
      "responsable": "Dra. Ana García",
      "departamento": "Bienestar Estudiantil",
      "contacto": "ana.garcia@prediversa.com"
    },
    "siguientesPasos": [
      "Tu reporte ha sido recibido y registrado",
      "Será revisado por nuestro equipo especializado",
      "Recibirás una respuesta inicial en 24-48 horas",
      "Se te contactará para seguimiento si es necesario"
    ]
  }
}
```

---

### 2. **Crear PQR (Petición, Queja, Reclamo, Sugerencia)**
```javascript
POST /api/student/reportes/pqr
```

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan.perez@email.com",
  "tipo": "sugerencia",
  "asunto": "Mejora en el sistema de reportes",
  "mensaje": "Sugiero añadir una función de chat en tiempo real para casos urgentes.",
  "urgencia": "media"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "numeroPQR": "PQR-240130-002",
    "tipo": "Sugerencia",
    "fechaCreacion": "2024-01-30T10:45:00Z",
    "estado": "registrada",
    "tiempoRespuestaEstimado": "5-7 días laborales",
    "departamentoAsignado": "Mejora Continua",
    "mensaje": "Tu sugerencia ha sido registrada con éxito. Nos pondremos en contacto contigo pronto."
  }
}
```

---

### 3. **Obtener Mis Reportes**
```javascript
GET /api/student/reportes/mis-reportes?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportes": [
      {
        "id": 1,
        "numero": "RPT-240130-001",
        "tipo": "incidente",
        "fechaCreacion": "2024-01-30T10:30:00Z",
        "estado": "en_proceso",
        "progreso": 60,
        "ultimaActualizacion": "2024-01-31T14:20:00Z"
      },
      {
        "id": 2,
        "numero": "PQR-240130-002", 
        "tipo": "sugerencia",
        "fechaCreacion": "2024-01-30T10:45:00Z",
        "estado": "respondida",
        "progreso": 100,
        "ultimaActualizacion": "2024-02-02T09:15:00Z"
      }
    ],
    "paginacion": {
      "paginaActual": 1,
      "totalPaginas": 1,
      "totalRegistros": 2,
      "registrosPorPagina": 10
    }
  }
}
```

---

## 📊 ENDPOINTS DE ESTADÍSTICAS {#endpoints-estadísticas}

### 1. **Obtener Estadísticas Personales**
```javascript
GET /api/student/estadisticas/personales
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resumen": {
      "cuestionariosCompletados": 4,
      "recursosVistos": 12,
      "conversaciones": 8,
      "diasActivos": 15,
      "logros": 6,
      "mensajesNuevos": 2
    },
    "progreso": {
      "nivelBienestar": "bueno",
      "mejoraMensual": "+15%",
      "tendenciaEmocional": "estable",
      "ultimaEvaluacion": "2024-01-30T10:30:00Z"
    },
    "logrosRecientes": [
      {
        "id": 1,
        "titulo": "Primera Evaluación Completada",
        "descripcion": "Completaste tu primera evaluación emocional",
        "fechaObtenido": "2024-01-28T14:20:00Z",
        "icono": "🏆"
      },
      {
        "id": 2,
        "titulo": "Semana Activa",
        "descripcion": "Usaste la plataforma 5 días consecutivos",
        "fechaObtenido": "2024-01-30T09:00:00Z",
        "icono": "📅"
      }
    ],
    "proximosObjetivos": [
      {
        "objetivo": "Completar evaluación de derechos",
        "progreso": 0,
        "recompensa": "Certificado de Conocimiento"
      }
    ]
  }
}
```

---

### 2. **Registrar Actividad**
```javascript
POST /api/student/estadisticas/actividad
```

**Request Body:**
```json
{
  "tipoActividad": "recurso_visto",
  "detalles": {
    "recursoId": 5,
    "tiempoVisualizacion": 120,
    "completado": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "actividadRegistrada": true,
    "nuevosLogros": [
      {
        "titulo": "Explorador de Recursos",
        "descripcion": "Viste 10 recursos educativos"
      }
    ],
    "estadisticasActualizadas": {
      "recursosVistos": 13,
      "logros": 7
    }
  }
}
```

---

## 🔐 ENDPOINTS DE DATOS SEGUROS {#endpoints-datos-seguros}

### 1. **Obtener Datos Personales Seguros**
```javascript
GET /api/student/datos-personales/seguros
```

**Response:**
```json
{
  "success": true,
  "data": {
    "informacionBasica": {
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan.perez@email.com",
      "telefono": "+57 300 123 4567",
      "fechaNacimiento": "2005-03-15",
      "edad": 18
    },
    "informacionAcademica": {
      "institucion": "Colegio San José",
      "grado": "11°",
      "jornada": "mañana"
    },
    "configuracion": {
      "notificacionesEmail": true,
      "notificacionesSMS": false,
      "perfilPublico": false
    },
    "estadoSesion": {
      "ultimoAcceso": "2024-01-30T10:30:00Z",
      "dispositivosActivos": 1,
      "ubicacionUltimoAcceso": "Bogotá, Colombia"
    }
  }
}
```

---

### 2. **Actualizar Perfil**
```javascript
PUT /api/student/perfil/actualizar
```

**Request Body:**
```json
{
  "telefono": "+57 300 999 8888",
  "configuracion": {
    "notificacionesEmail": false,
    "notificacionesSMS": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "perfilActualizado": true,
    "cambiosAplicados": [
      "Teléfono actualizado",
      "Configuración de notificaciones modificada"
    ],
    "siguienteVerificacion": "Se enviará código de verificación al nuevo número"
  }
}
```

---

## 🗄️ MODELOS DE BASE DE DATOS {#modelos-bd}

### **1. Tabla: evaluaciones_cuestionarios**
```sql
CREATE TABLE evaluaciones_cuestionarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  tipo_evaluacion ENUM('emocional', 'violencia', 'victima', 'derechos') NOT NULL,
  respuestas JSON NOT NULL,
  puntuacion INT NOT NULL,
  nivel VARCHAR(50) NOT NULL,
  mensaje TEXT NOT NULL,
  requiere_atencion BOOLEAN DEFAULT FALSE,
  nivel_riesgo ENUM('bajo', 'medio', 'alto') DEFAULT 'bajo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario_tipo (usuario_id, tipo_evaluacion),
  INDEX idx_fecha (fecha_creacion),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

### **2. Tabla: reportes_incidentes**
```sql
CREATE TABLE reportes_incidentes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero_reporte VARCHAR(20) UNIQUE NOT NULL,
  usuario_id INT NOT NULL,
  es_anonimo BOOLEAN DEFAULT FALSE,
  datos_personales JSON,
  datos_institucion JSON,
  datos_incidente JSON NOT NULL,
  estado ENUM('recibido', 'en_proceso', 'resuelto', 'cerrado') DEFAULT 'recibido',
  prioridad ENUM('baja', 'media', 'alta', 'critica') DEFAULT 'media',
  asignado_a INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_numero (numero_reporte),
  INDEX idx_usuario (usuario_id),
  INDEX idx_estado (estado),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (asignado_a) REFERENCES usuarios(id)
);
```

### **3. Tabla: estadisticas_usuarios**
```sql
CREATE TABLE estadisticas_usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT UNIQUE NOT NULL,
  cuestionarios_completados INT DEFAULT 0,
  recursos_vistos INT DEFAULT 0,
  conversaciones INT DEFAULT 0,
  dias_activos INT DEFAULT 0,
  logros INT DEFAULT 0,
  mensajes_nuevos INT DEFAULT 0,
  ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

### **4. Tabla: logros_usuarios**
```sql
CREATE TABLE logros_usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  icono VARCHAR(10),
  categoria VARCHAR(50),
  fecha_obtenido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  INDEX idx_fecha (fecha_obtenido),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

---

## 🛡️ MIDDLEWARES DE SEGURIDAD {#middlewares}

### **1. Validación de Datos de Entrada**
```javascript
const validateQuestionnaireData = (req, res, next) => {
  const { respuestas } = req.body;
  
  if (!respuestas || typeof respuestas !== 'object') {
    return res.status(400).json({
      success: false,
      msg: 'Las respuestas son requeridas y deben ser un objeto'
    });
  }
  
  // Validar que las respuestas no estén vacías
  const answersValues = Object.values(respuestas);
  if (answersValues.length === 0 || answersValues.some(val => !val)) {
    return res.status(400).json({
      success: false,
      msg: 'Todas las respuestas son requeridas'
    });
  }
  
  next();
};
```

### **2. Rate Limiting para Evaluaciones**
```javascript
const rateLimit = require('express-rate-limit');

const questionnaireRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 5, // máximo 5 evaluaciones por día
  message: {
    success: false,
    msg: 'Has excedido el límite de evaluaciones por día. Intenta mañana.'
  },
  keyGenerator: (req) => `questionnaire_${req.user.id}`,
  standardHeaders: true,
  legacyHeaders: false
});
```

### **3. Sanitización de Datos**
```javascript
const sanitizeReportData = (req, res, next) => {
  const { datosIncidente } = req.body;
  
  if (datosIncidente) {
    // Sanitizar descripción para prevenir XSS
    datosIncidente.descripcion = sanitizeHtml(datosIncidente.descripcion);
    datosIncidente.evidencia = sanitizeHtml(datosIncidente.evidencia);
    datosIncidente.contexto = sanitizeHtml(datosIncidente.contexto);
  }
  
  next();
};
```

---

## 💻 EJEMPLOS DE IMPLEMENTACIÓN {#ejemplos}

### **Controlador de Evaluación Emocional**
```javascript
// controllers/questionnaireController.js
const evaluateEmotionalQuestionnaire = async (req, res) => {
  try {
    const { respuestas } = req.body;
    const userId = req.user.id;
    
    // Calcular puntuación
    const evaluation = calculateEmotionalScore(respuestas);
    
    // Guardar en base de datos
    const evaluationRecord = await EvaluacionCuestionario.create({
      usuario_id: userId,
      tipo_evaluacion: 'emocional',
      respuestas: respuestas,
      puntuacion: evaluation.puntuacionFinal,
      nivel: evaluation.nivel,
      mensaje: evaluation.mensaje,
      requiere_atencion: evaluation.nivel === 'necesita_atencion'
    });
    
    // Actualizar estadísticas
    await updateUserStats(userId, 'cuestionario_completado');
    
    // Verificar si es el primer cuestionario (nuevo logro)
    const isFirstQuestionnaire = await checkFirstQuestionnaire(userId);
    if (isFirstQuestionnaire) {
      await awardAchievement(userId, 'primera_evaluacion');
    }
    
    res.json({
      success: true,
      data: {
        evaluacionId: evaluationRecord.id,
        puntuacion: evaluation.puntuacionFinal,
        nivel: evaluation.nivel,
        mensaje: evaluation.mensaje,
        // ... más datos
      }
    });
    
  } catch (error) {
    console.error('Error en evaluación emocional:', error);
    res.status(500).json({
      success: false,
      msg: 'Error interno del servidor'
    });
  }
};
```

### **Servicio de Estadísticas**
```javascript
// services/statsService.js
class StatsService {
  static async updateUserStats(userId, activityType, details = {}) {
    try {
      let stats = await EstadisticasUsuario.findOne({ where: { usuario_id: userId } });
      
      if (!stats) {
        stats = await EstadisticasUsuario.create({ usuario_id: userId });
      }
      
      switch (activityType) {
        case 'cuestionario_completado':
          stats.cuestionarios_completados += 1;
          break;
        case 'recurso_visto':
          stats.recursos_vistos += 1;
          break;
        case 'conversacion_iniciada':
          stats.conversaciones += 1;
          break;
        case 'dia_activo':
          stats.dias_activos += 1;
          break;
      }
      
      stats.ultima_actividad = new Date();
      await stats.save();
      
      return stats;
    } catch (error) {
      console.error('Error actualizando estadísticas:', error);
      throw error;
    }
  }
  
  static async awardAchievement(userId, achievementType) {
    const achievements = {
      'primera_evaluacion': {
        titulo: 'Primera Evaluación Completada',
        descripcion: 'Completaste tu primera evaluación emocional',
        icono: '🏆',
        categoria: 'evaluaciones'
      },
      'semana_activa': {
        titulo: 'Semana Activa',
        descripcion: 'Usaste la plataforma 7 días consecutivos',
        icono: '📅',
        categoria: 'actividad'
      }
      // ... más logros
    };
    
    const achievement = achievements[achievementType];
    if (!achievement) return;
    
    // Verificar si ya tiene este logro
    const existing = await LogroUsuario.findOne({
      where: { usuario_id: userId, titulo: achievement.titulo }
    });
    
    if (!existing) {
      await LogroUsuario.create({
        usuario_id: userId,
        ...achievement
      });
      
      // Actualizar contador de logros
      await this.updateUserStats(userId, 'logro_obtenido');
    }
  }
}
```

---

*Documento técnico generado para migración de lógica frontend → backend*
*Versión: 1.0 | Fecha: $(Get-Date)*
