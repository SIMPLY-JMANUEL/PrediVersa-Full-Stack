const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema de Usuario
const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  correo: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Formato de correo inválido']
  },
  contraseña: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  rol: {
    type: String,
    enum: ['admin', 'teacher', 'student', 'parent', 'moderator'],
    default: 'student'
  },
  photo: {
    type: String,
    default: null
  },
  telefono: {
    type: String,
    default: null
  },
  biografia: {
    type: String,
    maxlength: [500, 'La biografía no puede exceder 500 caracteres'],
    default: null
  },
  configuraciones: {
    tema: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    idioma: {
      type: String,
      default: 'es'
    },
    notificaciones: {
      type: Boolean,
      default: true
    },
    privacidad: {
      type: String,
      enum: ['publico', 'privado'],
      default: 'publico'
    }
  },
  activo: {
    type: Boolean,
    default: true
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  ultimo_acceso: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware para encriptar contraseña
userSchema.pre('save', async function(next) {
  if (!this.isModified('contraseña')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.compararContraseña = async function(contraseñaCandidata) {
  return await bcrypt.compare(contraseñaCandidata, this.contraseña);
};

// Método para actualizar último acceso
userSchema.methods.actualizarUltimoAcceso = function() {
  this.ultimo_acceso = Date.now();
  return this.save();
};

// Índices para performance
userSchema.index({ correo: 1 });
userSchema.index({ rol: 1 });
userSchema.index({ fecha_registro: -1 });

// Esquema de Curso
const courseSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  estado: {
    type: String,
    enum: ['borrador', 'publicado', 'archivado'],
    default: 'borrador'
  },
  duracion: {
    type: Number, // en minutos
    min: [1, 'La duración debe ser mayor a 0']
  },
  nivel: {
    type: String,
    enum: ['principiante', 'intermedio', 'avanzado'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  thumbnail: {
    type: String,
    default: null
  },
  precio: {
    type: Number,
    min: [0, 'El precio no puede ser negativo'],
    default: 0
  },
  estudiantes_inscritos: [{
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fecha_inscripcion: {
      type: Date,
      default: Date.now
    },
    progreso: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  fecha_publicacion: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Índices para cursos
courseSchema.index({ instructor_id: 1 });
courseSchema.index({ estado: 1 });
courseSchema.index({ nivel: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ fecha_creacion: -1 });

// Esquema de Lección
const lessonSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  contenido: {
    type: String,
    required: [true, 'El contenido es requerido']
  },
  orden: {
    type: Number,
    required: true,
    min: [1, 'El orden debe ser mayor a 0']
  },
  tipo: {
    type: String,
    enum: ['video', 'texto', 'quiz', 'ejercicio'],
    required: true
  },
  duracion: {
    type: Number, // en minutos
    min: [1, 'La duración debe ser mayor a 0']
  },
  recursos: [{
    nombre: String,
    url: String,
    tipo: {
      type: String,
      enum: ['pdf', 'video', 'imagen', 'link', 'archivo']
    }
  }],
  video_url: {
    type: String,
    default: null
  },
  es_gratuita: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices para lecciones
lessonSchema.index({ course_id: 1, orden: 1 });

// Esquema de Quiz
const quizSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true
  },
  descripcion: {
    type: String,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    default: null
  },
  preguntas: [{
    pregunta: {
      type: String,
      required: true
    },
    tipo: {
      type: String,
      enum: ['multiple_choice', 'true_false', 'open_text', 'matching'],
      required: true
    },
    opciones: [String],
    respuesta_correcta: mongoose.Schema.Types.Mixed,
    puntos: {
      type: Number,
      min: [1, 'Los puntos deben ser mayor a 0'],
      default: 1
    },
    explicacion: String
  }],
  tiempo_limite: {
    type: Number, // en minutos
    min: [1, 'El tiempo límite debe ser mayor a 0']
  },
  intentos_permitidos: {
    type: Number,
    min: [1, 'Los intentos permitidos deben ser mayor a 0'],
    default: 3
  },
  puntuacion_minima: {
    type: Number,
    min: [0, 'La puntuación mínima no puede ser negativa'],
    max: [100, 'La puntuación mínima no puede exceder 100'],
    default: 60
  }
}, {
  timestamps: true
});

// Esquema de Respuesta de Quiz
const quizResponseSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  respuestas: [{
    pregunta_index: {
      type: Number,
      required: true
    },
    respuesta: mongoose.Schema.Types.Mixed,
    es_correcta: {
      type: Boolean,
      required: true
    },
    puntos_obtenidos: {
      type: Number,
      min: 0,
      default: 0
    }
  }],
  puntuacion_total: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  tiempo_empleado: {
    type: Number, // en segundos
    min: 0
  },
  intento_numero: {
    type: Number,
    min: 1,
    required: true
  },
  completado: {
    type: Boolean,
    default: false
  },
  fecha_inicio: {
    type: Date,
    default: Date.now
  },
  fecha_completado: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Índices para respuestas de quiz
quizResponseSchema.index({ usuario_id: 1, quiz_id: 1 });
quizResponseSchema.index({ fecha_completado: -1 });

// Crear modelos
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
const QuizResponse = mongoose.model('QuizResponse', quizResponseSchema);

module.exports = {
  User,
  Course,
  Lesson,
  Quiz,
  QuizResponse
};
