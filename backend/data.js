// data.js
// Arrays en memoria para simular la base de datos

const users = [
  // Ejemplo de usuario admin
  {
    id: 1,
    nombre: 'Admin',
    correo: 'admin@prediversa.com',
    contraseña: '$2a$10$yQrYmsxA/iHExDbizYKGkOIsRvTBy4ph6YHNgS9BsflI.nR0w6naK', // admin123
    rol: 'admin',
    fecha_registro: new Date().toISOString()
  }
  // ...otros usuarios
];

const recursos = [
  // { id, titulo, descripcion, url, autor_id, fecha_creacion }
];

const cuestionarios = [
  // { id, titulo, descripcion, fecha_creacion, preguntas: [] }
];

const reportes = [
  // { id, estudiante_id, contenido, fecha }
];

const respuestas = [
  // { id, usuario_id, cuestionario_id, fecha_respuesta, respuestas }
];

module.exports = { users, recursos, cuestionarios, reportes, respuestas };
