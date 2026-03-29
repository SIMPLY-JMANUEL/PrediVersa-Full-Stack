const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const GeneracionReportesMySQL = require('../models/GeneracionReportesMySQL');

async function main() {
  try {
    const sample = {
      numeroIncidente: `INC-${Date.now()}`,
      fechaIngreso: new Date().toISOString().split('T')[0],
      estadoAlerta: 'Abierto',
      tipoAlerta: 'Incidente de prueba',
      nivelGravedad: 'Media',
      atencionInmediata: 'Si',
      institucionSede: 'Sede Central',
      nombreEstudiante: 'Estudiante Demo',
      gradoGrupo: '10A',
      lugarSuceso: 'Patio',
      fechaHoraSuceso: new Date(),
      nombreCompleto: 'Usuario Administrador',
      tipoDocumento: 'CC',
      numeroDocumento: '1234567890',
      fechaNacimiento: '1990-01-01',
      edad: 35,
      sexoGenero: 'M',
      estadoCivil: 'Soltero',
      correoElectronico: 'admin@example.com',
      telefonoContacto: '3001234567',
      direccionResidencia: 'Calle 123',
      responsableAsignado: 'Coordinador',
      descripcionDetallada: 'Registro de prueba automatizada.',
      medidasTomadas: 'Ninguna',
      contactoFamiliar: 'Madre',
      nombreFamiliar: 'Maria Perez',
      telefonoFamiliar: '3009876543',
      archivosAdjuntos: [],
      observacionesAdicionales: 'Observación de prueba',
      usuarioId: null,
    };

    const result = await GeneracionReportesMySQL.createReporte(sample);
    console.log('✅ Registro creado:', result);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creando registro:', err);
    process.exit(1);
  }
}

main();
