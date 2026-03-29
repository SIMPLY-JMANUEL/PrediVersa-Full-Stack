/**
 * Script de prueba para agregar registros reales en cada formulario
 * Ejecuta intentos de creación con datos válidos
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5003/api';
let authToken = null;

// Colores para consola
const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const resultados = [];

function log(status, formulario, mensaje, data = null) {
  const color = status === 'SUCCESS' ? c.green : status === 'WARNING' ? c.yellow : c.red;
  console.log(`${color}[${status}]${c.reset} ${formulario}: ${mensaje}`);
  if (data) console.log(`  └─ Data:`, data);
  resultados.push({ status, formulario, mensaje, data, timestamp: new Date().toISOString() });
}

// Intentar login con múltiples credenciales
async function login() {
  console.log(`\n${c.cyan}═══════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.cyan}  🔐 AUTENTICACIÓN${c.reset}`);
  console.log(`${c.cyan}═══════════════════════════════════════════════════${c.reset}\n`);
  
  const credenciales = [
    { usuario: 'testuser6', password: 'test123', name: 'testuser6/test123 (Admin)' },
    { usuario: 'Moder', password: '123456789', name: 'Moder/123456789 (Moderador)' },
    { usuario: 'admin', password: 'admin123', name: 'admin/admin123' }
  ];
  
  for (const cred of credenciales) {
    try {
      console.log(`Intentando login con: ${cred.name}...`);
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        usuario: cred.usuario,
        password: cred.password
      }, { timeout: 5000 });
      
      if (response.data.token) {
        authToken = response.data.token;
        log('SUCCESS', '🔐 Login', `Autenticado como: ${cred.usuario}`, { 
          usuario: cred.usuario,
          perfil: response.data.user?.perfil || response.data.user?.rol 
        });
        return true;
      }
    } catch (error) {
      console.log(`  └─ ${c.red}✗${c.reset} ${error.response?.data?.msg || error.message}`);
    }
  }
  
  log('ERROR', '🔐 Login', 'No se pudo autenticar con ninguna credencial');
  return false;
}

// 1. CREAR USUARIO
async function crearUsuario() {
  console.log(`\n${c.cyan}═══════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.cyan}  👤 FORMULARIO: CREAR USUARIO${c.reset}`);
  console.log(`${c.cyan}═══════════════════════════════════════════════════${c.reset}\n`);
  
  try {
    const timestamp = Date.now();
    const datos = {
      nombre: 'Juan Carlos Pérez González',
      correo: `juan.perez.${timestamp}@prediversa.edu.co`,
      usuario: `jperez${timestamp}`.substring(0, 15),
      password: 'Estudiante2024!',
      rol: 'estudiante',
      numeroDocumento: `10${timestamp}`.substring(0, 10),
      tipoDocumento: 'CC',
      telefono: '3001234567',
      fechaNacimiento: '2005-03-15',
      edad: 19,
      sexo: 'M',
      direccion: 'Calle 123 #45-67, Bogotá',
      eps: 'Compensar',
      condicionEspecial: 'Ninguna',
      descripcionCondicion: '',
      contactoEmergencia: 'María González (Madre)',
      numeroContactoEmergencia: '3109876543',
      activo: 'SI'
    };
    
    console.log('📤 Enviando datos:', JSON.stringify(datos, null, 2));
    
    const response = await axios.post(`${BASE_URL}/admin/users`, datos, {
      headers: { Authorization: `Bearer ${authToken}` },
      timeout: 10000
    });
    
    log('SUCCESS', '👤 Usuario', 'Usuario creado exitosamente', {
      id: response.data.data?.id,
      usuario: datos.usuario,
      correo: datos.correo
    });
    
    return response.data.data?.id;
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    log('ERROR', '👤 Usuario', msg, error.response?.data);
    return null;
  }
}

// 2. CREAR SEGUIMIENTO
async function crearSeguimiento() {
  console.log(`\n${c.cyan}═══════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.cyan}  📋 FORMULARIO: SEGUIMIENTO${c.reset}`);
  console.log(`${c.cyan}═══════════════════════════════════════════════════${c.reset}\n`);
  
  try {
    const timestamp = Date.now();
    const datos = {
      numeroCaso: `#SEG-${timestamp}`.substring(0, 15),
      descripcionRequerimiento: 'Seguimiento académico por bajo rendimiento en matemáticas. Se requiere refuerzo y apoyo personalizado.',
      estadoRequerimiento: 'en_proceso',
      prioridad: 'media',
      profesionalAsignado: 'Psicóloga María Torres',
      fechaSeguimiento: new Date().toISOString().split('T')[0],
      resultadoSeguimiento: 'Se observa desmotivación en el estudiante. Se recomienda realizar sesiones de orientación y coordinar con el docente de matemáticas.',
      accionesTomadas: 'Primera sesión de orientación realizada. Se identificaron factores familiares que afectan el rendimiento.',
      proximasAcciones: 'Agendar sesión con padres de familia. Coordinar plan de refuerzo académico.',
      requiereSeguimientoAdicional: 'si',
      fechaProximoSeguimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      intervinientes: [
        {
          nombre: 'Carlos Ramírez',
          rol: 'Docente',
          entidad: 'Colegio PrediVersa',
          relacion: 'Profesor de matemáticas'
        },
        {
          nombre: 'Ana Gómez',
          rol: 'Coordinadora Académica',
          entidad: 'Colegio PrediVersa',
          relacion: 'Coordinadora'
        }
      ],
      observaciones: 'Caso requiere atención cercana. Estudiante muestra disposición para mejorar.'
    };
    
    console.log('📤 Enviando datos de seguimiento...');
    
    const response = await axios.post(`${BASE_URL}/seguimiento/crear`, datos, {
      headers: { Authorization: `Bearer ${authToken}` },
      timeout: 10000
    });
    
    log('SUCCESS', '📋 Seguimiento', 'Seguimiento creado exitosamente', {
      id: response.data.data?.id,
      numeroCaso: datos.numeroCaso
    });
    
    return response.data.data?.id;
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    log('ERROR', '📋 Seguimiento', msg, error.response?.data);
    return null;
  }
}

// 3. CREAR ALERTA
async function crearAlerta() {
  console.log(`\n${c.cyan}═══════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.cyan}  🚨 FORMULARIO: ALERTA${c.reset}`);
  console.log(`${c.cyan}═══════════════════════════════════════════════════${c.reset}\n`);
  
  try {
    const timestamp = Date.now();
    const datos = {
      tipo_alerta: 'bullying',
      fecha_hora: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ubicacion: 'Patio de recreo - Zona de cancha',
      requiere_atencion_inmediata: 'si',
      es_reiterativo: 'no',
      canal_reporte: 'Presencial',
      nombre_estudiante: 'Pedro Martínez López',
      identificacion_estudiante: '1098765432',
      curso_grado: '8° A',
      edad: '14',
      tipo_reportado: 'estudiante',
      nombre_reportante: 'Lucía Fernández',
      identificacion_reportante: '52789456',
      relacion_reportado: 'Docente',
      telefono_reportante: '3112345678',
      email_reportante: 'lucia.fernandez@prediversa.edu.co',
      categoria_incidente: 'Acoso verbal',
      descripcion_detallada: 'Se observó que un grupo de estudiantes de grado 9° realiza comentarios ofensivos hacia el estudiante Pedro Martínez de manera reiterada durante el descanso. El estudiante se muestra visiblemente afectado.',
      evidencias: 'Observación directa de la docente. Testimonio del estudiante afectado.',
      testigos: 'Varios estudiantes del grado 8° presenciaron la situación.',
      contexto_previo: 'Esta es la primera vez que se reporta formalmente, aunque el estudiante menciona que viene ocurriendo desde hace dos semanas.',
      estado_alerta: 'Activa',
      prioridad: 'alta',
      coordinador_asignado: 'Coordinador de Convivencia - Roberto Sánchez',
      observaciones_preliminares: 'Se requiere intervención inmediata. Se citará a los padres de familia de los estudiantes involucrados.',
      consentimiento_informado: true,
      proteccion_datos: true,
      cumplimiento_normativo: true
    };
    
    console.log('📤 Enviando alerta de bullying...');
    
    const response = await axios.post(`${BASE_URL}/admin/alerts`, datos, {
      headers: { Authorization: `Bearer ${authToken}` },
      timeout: 10000
    });
    
    log('SUCCESS', '🚨 Alerta', 'Alerta creada exitosamente', {
      id: response.data.data?.id || response.data.id,
      numeroAlerta: response.data.data?.numeroAlerta,
      tipo: datos.tipo_alerta
    });
    
    return response.data.data?.id || response.data.id;
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    log('ERROR', '🚨 Alerta', msg, error.response?.data);
    return null;
  }
}

// 4. CREAR REPORTE
async function crearReporte() {
  console.log(`\n${c.cyan}═══════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.cyan}  📝 FORMULARIO: REPORTE${c.reset}`);
  console.log(`${c.cyan}═══════════════════════════════════════════════════${c.reset}\n`);
  
  try {
    const timestamp = Date.now();
    const datos = {
      fechaIngreso: new Date().toISOString().split('T')[0],
      estadoAlerta: 'Activa',
      tipoAlerta: 'Bienestar Emocional',
      nivelGravedad: 'Medio',
      atencionInmediata: 'No',
      institucionSede: 'Colegio PrediVersa - Sede Principal',
      nombreEstudiante: 'Sofía Ramírez Castro',
      gradoGrupo: '10° B',
      lugarSuceso: 'Salón de clases',
      fechaHoraSuceso: new Date().toISOString(),
      nombreCompleto: 'Sofía Ramírez Castro',
      tipoDocumento: 'CC',
      numeroDocumento: '1087654321',
      fechaNacimiento: '2008-05-15',
      edad: 16,
      sexoGenero: 'F',
      estadoCivil: 'Soltero',
      correoElectronico: 'sofia.ramirez@estudiante.prediversa.edu.co',
      telefonoContacto: '3156789012',
      direccionResidencia: 'Carrera 50 #28-15',
      responsableAsignado: 'Orientadora María José Pérez',
      descripcionDetallada: 'Estudiante presenta signos de ansiedad y estrés académico. Ha manifestado dificultades para dormir y concentrarse en clases. Se muestra retraída y evita la interacción social.',
      medidasTomadas: 'Primera sesión de orientación. Seguimiento con psicólogo escolar.',
      contactoFamiliar: 'Si',
      nombreFamiliar: 'Patricia Castro (Madre)',
      telefonoFamiliar: '3201234567',
      observacionesAdicionales: 'La estudiante ha solicitado apoyo voluntariamente. Muestra disposición para trabajar en su bienestar emocional.'
    };
    
    console.log('📤 Enviando reporte de bienestar...');
    
    const response = await axios.post(`${BASE_URL}/admin/reportes`, datos, {
      headers: { Authorization: `Bearer ${authToken}` },
      timeout: 10000
    });
    
    log('SUCCESS', '📝 Reporte', 'Reporte creado exitosamente', {
      id: response.data.data?.id || response.data.id,
      tipo: datos.tipoAlerta,
      estudiante: datos.nombreEstudiante
    });
    
    return response.data.data?.id || response.data.id;
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    log('ERROR', '📝 Reporte', msg, error.response?.data);
    return null;
  }
}

// 5. CREAR REMISIÓN
async function crearRemision() {
  console.log(`\n${c.cyan}═══════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.cyan}  🏥 FORMULARIO: REMISIÓN${c.reset}`);
  console.log(`${c.cyan}═══════════════════════════════════════════════════${c.reset}\n`);
  
  try {
    const timestamp = Date.now();
    const datos = {
      numeroAlertaVinculada: 'ALR-000012',
      tipoAlerta: 'Salud Mental',
      nombreEstudiante: 'Andrés Felipe Rojas',
      edad: 17,
      gradoCargo: '11° A',
      institucionSede: 'Colegio PrediVersa',
      descripcionBreve: 'Estudiante con episodios de ansiedad severa',
      estadoActualAlerta: 'Activa',
      fechaRemision: new Date().toISOString().split('T')[0],
      motivoRemision: 'Estudiante requiere atención especializada en salud mental. Presenta episodios de ansiedad severa que interfieren con su desempeño académico. Se requiere valoración por psiquiatría.',
      areaDestino: 'Psiquiatría',
      entidadReceptora: 'Centro de Atención Psicológica Integral - CAPI',
      profesionalAsignado: 'Psicóloga Educativa - Dra. Laura Méndez',
      estadoRemision: 'pendiente',
      comentariosRemitente: 'Padres de familia han sido informados y autorizan la remisión. Se adjunta historia clínica preliminar. Se solicita valoración prioritaria dado el impacto en el bienestar del estudiante.',
      notificoAcudiente: 'Si',
      fechaHoraCita: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      observacionesSeguimiento: 'Requiere seguimiento quincenal. Coordinación con familia y equipo académico.'
    };
    
    console.log('📤 Enviando remisión...');
    
    const response = await axios.post(`${BASE_URL}/admin/remisiones`, datos, {
      headers: { Authorization: `Bearer ${authToken}` },
      timeout: 10000
    });
    
    log('SUCCESS', '🏥 Remisión', 'Remisión creada exitosamente', {
      id: response.data.data?.id || response.data.id,
      areaDestino: datos.areaDestino,
      estudiante: datos.nombreEstudiante
    });
    
    return response.data.data?.id || response.data.id;
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    log('ERROR', '🏥 Remisión', msg, error.response?.data);
    return null;
  }
}

// GENERAR REPORTE FINAL
function generarReporte() {
  console.log(`\n${c.magenta}═══════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.magenta}  📊 REPORTE FINAL DE PRUEBAS${c.reset}`);
  console.log(`${c.magenta}═══════════════════════════════════════════════════${c.reset}\n`);
  
  const exitosos = resultados.filter(r => r.status === 'SUCCESS').length;
  const errores = resultados.filter(r => r.status === 'ERROR').length;
  const total = resultados.length;
  const porcentaje = total > 0 ? ((exitosos/total)*100).toFixed(2) : 0;
  
  console.log(`${c.cyan}📈 ESTADÍSTICAS:${c.reset}`);
  console.log(`  Total de operaciones: ${total}`);
  console.log(`  ${c.green}✓ Exitosas: ${exitosos}${c.reset}`);
  console.log(`  ${c.red}✗ Fallidas: ${errores}${c.reset}`);
  console.log(`  Tasa de éxito: ${porcentaje}%\n`);
  
  console.log(`${c.cyan}📋 DETALLE:${c.reset}`);
  resultados.forEach(r => {
    const icon = r.status === 'SUCCESS' ? '✓' : '✗';
    const color = r.status === 'SUCCESS' ? c.green : c.red;
    console.log(`  ${color}${icon}${c.reset} ${r.formulario}: ${r.mensaje}`);
    if (r.data) {
      console.log(`     └─ ${JSON.stringify(r.data)}`);
    }
  });
  
  // Guardar en archivo
  const fs = require('fs');
  const reporte = {
    fecha: new Date().toISOString(),
    estadisticas: { total, exitosos, errores, porcentaje },
    resultados
  };
  fs.writeFileSync('./reporte-prueba-registros.json', JSON.stringify(reporte, null, 2));
  
  console.log(`\n${c.green}✓${c.reset} Reporte guardado en: reporte-prueba-registros.json\n`);
  
  return { exitosos, total, porcentaje };
}

// EJECUTAR TODAS LAS PRUEBAS
async function ejecutarPruebas() {
  console.log(`\n${c.magenta}╔═══════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.magenta}║     PRUEBAS DE CREACIÓN DE REGISTROS REALES      ║${c.reset}`);
  console.log(`${c.magenta}╚═══════════════════════════════════════════════════╝${c.reset}`);
  
  // Login
  const loginSuccess = await login();
  
  if (!loginSuccess) {
    console.log(`\n${c.yellow}⚠️  Continuando sin autenticación (se esperan errores)${c.reset}\n`);
  }
  
  // Ejecutar pruebas de cada formulario
  await crearUsuario();
  await crearSeguimiento();
  await crearAlerta();
  await crearReporte();
  await crearRemision();
  
  // Generar reporte
  const { exitosos, total, porcentaje } = generarReporte();
  
  // Mensaje final
  if (porcentaje >= 80) {
    console.log(`${c.green}✅ Sistema operativo: ${porcentaje}% de éxito${c.reset}`);
  } else if (porcentaje >= 50) {
    console.log(`${c.yellow}⚠️  Sistema parcialmente operativo: ${porcentaje}% de éxito${c.reset}`);
  } else {
    console.log(`${c.red}❌ Sistema requiere atención: ${porcentaje}% de éxito${c.reset}`);
  }
  
  console.log(`\n${c.cyan}Nota: Si hay errores de autenticación, verifica la conexión a la base de datos.${c.reset}\n`);
}

// EJECUTAR
ejecutarPruebas().catch(error => {
  console.error(`\n${c.red}❌ Error fatal:${c.reset}`, error.message);
  process.exit(1);
});
