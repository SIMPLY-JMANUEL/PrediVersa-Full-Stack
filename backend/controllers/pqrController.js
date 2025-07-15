// controllers/pqrController.js
// Lógica para gestión de reportes/PQR con validación y helpers reutilizables

// Se usa la base de datos en lugar de arrays en memoria
const { isValidEmail, isValidPhone } = require('../utils/validators');

/**
 * Crea un nuevo reporte/PQR con validación robusta.
 */
function crearPqr(req, res) {
  const {
    tipo,
    descripcion,
    datosSolicitante,
    datosInstitucion,
    fechaIngreso,
  } = req.body;
  if (!tipo || !descripcion || !datosSolicitante) {
    return res.status(400).json({ msg: 'Faltan campos obligatorios' });
  }
  // Validar email y teléfono del solicitante si existen
  if (datosSolicitante?.email && !isValidEmail(datosSolicitante.email)) {
    return res.status(400).json({ msg: 'Email del solicitante inválido' });
  }
  if (datosSolicitante?.telefono && !isValidPhone(datosSolicitante.telefono)) {
    return res.status(400).json({ msg: 'Teléfono del solicitante inválido' });
  }
  const nuevoReporte = {
    id: reportes.length + 1,
    tipo,
    descripcion,
    datosSolicitante,
    datosInstitucion: datosInstitucion || {},
    fechaIngreso: fechaIngreso || new Date().toISOString(),
    estado: 'abierto',
    historial: [],
  };
  reportes.push(nuevoReporte);
  res.status(201).json({ msg: 'Reporte creado', reporte: nuevoReporte });
}

/**
 * Devuelve todos los reportes.
 */
function listarPqr(req, res) {
  res.json({ reportes });
}

/**
 * Actualiza el estado o seguimiento de un reporte.
 */
function actualizarPqr(req, res) {
  const { id } = req.params;
  const reporte = reportes.find(r => r.id == id);
  if (!reporte) {
    return res.status(404).json({ msg: 'Reporte no encontrado' });
  }
  const { estado, actuacion, descripcionActuacion } = req.body;
  if (estado) reporte.estado = estado;
  if (actuacion) {
    reporte.historial.push({
      fecha: new Date().toISOString(),
      actuacion,
      descripcion: descripcionActuacion || '',
    });
  }
  res.json({ msg: 'Reporte actualizado', reporte });
}

module.exports = {
  crearPqr,
  listarPqr,
  actualizarPqr,
};
