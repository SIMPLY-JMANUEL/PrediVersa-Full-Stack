/**
 * Script de prueba automatizado para todos los formularios de PrediVersa
 * Ejecuta pruebas de creación de registros en cada formulario
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5003/api';
let authToken = null;

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Resultados de las pruebas
const testResults = [];

// Helper para registrar resultados
function logResult(formulario, status, mensaje, data = null) {
  const resultado = {
    formulario,
    status,
    mensaje,
    data,
    timestamp: new Date().toISOString()
  };
  testResults.push(resultado);
  
  const color = status === 'ÉXITO' ? colors.green : status === 'ADVERTENCIA' ? colors.yellow : colors.red;
  console.log(`${color}[${status}]${colors.reset} ${formulario}: ${mensaje}`);
  if (data) {
    console.log(`  └─ Datos:`, JSON.stringify(data, null, 2));
  }
}

// 1. Autenticación
async function login() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  PRUEBA 1: AUTENTICACIÓN${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`);
  
  try {
    // Intentar con varios usuarios posibles
    const credenciales = [
      { usuario: 'testuser', password: 'test123456' },
      { usuario: 'admin', password: 'admin123' },
      { usuario: 'admin', password: 'Admin@123' },
      { usuario: 'administrador', password: 'admin123' }
    ];
    
    for (const cred of credenciales) {
      try {
        const response = await axios.post(`${BASE_URL}/auth/login`, cred);
        
        if (response.data.token) {
          authToken = response.data.token;
          logResult('Login', 'ÉXITO', `Autenticación exitosa con usuario: ${cred.usuario}`, { usuario: cred.usuario });
          return true;
        }
      } catch (err) {
        // Continuar con el siguiente
        continue;
      }
    }
    
    logResult('Login', 'ERROR', 'No se pudo autenticar con ninguna credencial. Usando token simulado.');
    // Usar token simulado para continuar pruebas de estructura
    authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
    return true; // Continuar con pruebas sin autenticación real
    
  } catch (error) {
    logResult('Login', 'ERROR', error.response?.data?.msg || error.message);
    authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
    return true; // Continuar con pruebas
  }
}

// 2. Crear Usuario
async function testCrearUsuario() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  PRUEBA 2: CREAR USUARIO${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`);
  
  try {
    const timestamp = Date.now();
    const response = await axios.post(
      `${BASE_URL}/admin/users`,
      {
        nombre: `Usuario Prueba ${timestamp}`,
        correo: `prueba${timestamp}@test.com`,
        usuario: `usuario${timestamp}`,
        password: 'Test123',
        rol: 'estudiante',
        numeroDocumento: `${timestamp}`.substring(0, 10),
        tipoDocumento: 'CC',
        telefono: '3001234567',
        edad: 25,
        activo: 'SI'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    logResult('Crear Usuario', 'ÉXITO', response.data.msg, { id: response.data.data?.id });
  } catch (error) {
    logResult('Crear Usuario', 'ERROR', error.response?.data?.msg || error.message);
  }
}

// 3. Crear Seguimiento
async function testCrearSeguimiento() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  PRUEBA 3: CREAR SEGUIMIENTO${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`);
  
  try {
    const timestamp = Date.now();
    const response = await axios.post(
      `${BASE_URL}/seguimiento/crear`,
      {
        numeroCaso: `#ALR-${timestamp}`.substring(0, 15),
        descripcionRequerimiento: 'Seguimiento de prueba automatizado',
        estadoRequerimiento: 'en_proceso',
        profesionalAsignado: 'Profesional Test',
        fechaSeguimiento: new Date().toISOString().split('T')[0],
        resultadoSeguimiento: 'Prueba exitosa de seguimiento',
        proximasAcciones: 'Continuar con monitoreo',
        requiereSeguimientoAdicional: 'si',
        fechaProximoSeguimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        intervinientes: [
          { nombre: 'Test Interviniente', rol: 'Orientador', entidad: 'Colegio Test' }
        ]
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    logResult('Crear Seguimiento', 'ÉXITO', response.data.msg, { id: response.data.data?.id });
  } catch (error) {
    logResult('Crear Seguimiento', 'ERROR', error.response?.data?.msg || error.message);
  }
}

// 4. Crear Alerta
async function testCrearAlerta() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  PRUEBA 4: CREAR ALERTA${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`);
  
  try {
    const timestamp = Date.now();
    const response = await axios.post(
      `${BASE_URL}/admin/alerts`,
      {
        tipo_alerta: 'Riesgo Académico',
        ubicacion: 'Sede Principal',
        nombre_reportante: 'Docente Test',
        descripcion_detallada: `Alerta de prueba automatizada ${timestamp}`,
        categoria_incidente: 'Academico',
        prioridad: 'media',
        estado_alerta: 'nuevo'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    logResult('Crear Alerta', 'ÉXITO', response.data.msg || 'Alerta creada', { id: response.data.data?.id || response.data.id });
  } catch (error) {
    logResult('Crear Alerta', 'ERROR', error.response?.data?.msg || error.message);
  }
}

// 5. Crear Reporte
async function testCrearReporte() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  PRUEBA 5: CREAR REPORTE${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`);
  
  try {
    const timestamp = Date.now();
    const response = await axios.post(
      `${BASE_URL}/admin/reportes`,
      {
        fechaIngreso: new Date().toISOString().split('T')[0],
        estadoAlerta: 'Abierto',
        tipoAlerta: 'Bienestar',
        nombreCompleto: 'Estudiante Test',
        descripcionDetallada: `Reporte de prueba automatizado ${timestamp}`,
        nivelGravedad: 'Media',
        responsableAsignado: 'Profesional Test',
        observacionesAdicionales: 'Reporte generado por prueba automatizada'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    logResult('Crear Reporte', 'ÉXITO', response.data.msg || 'Reporte creado', { id: response.data.data?.id || response.data.id });
  } catch (error) {
    logResult('Crear Reporte', 'ERROR', error.response?.data?.msg || error.message);
  }
}

// 6. Crear Remisión
async function testCrearRemision() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  PRUEBA 6: CREAR REMISIÓN${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`);
  
  try {
    const timestamp = Date.now();
    const response = await axios.post(
      `${BASE_URL}/admin/remisiones`,
      {
        numeroAlertaVinculada: `ALR-${timestamp}`.substring(0, 15),
        nombreEstudiante: 'Estudiante Test',
        motivoRemision: `Remisión de prueba automatizada ${timestamp}`,
        fechaRemision: new Date().toISOString().split('T')[0],
        areaDestino: 'Psicologia',
        estadoRemision: 'pendiente',
        observacionesSeguimiento: 'Remisión generada por prueba automatizada'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    logResult('Crear Remisión', 'ÉXITO', response.data.msg || 'Remisión creada', { id: response.data.data?.id || response.data.id });
  } catch (error) {
    logResult('Crear Remisión', 'ERROR', error.response?.data?.msg || error.message);
  }
}

// Generar reporte final
function generarReporte() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  REPORTE FINAL DE PRUEBAS${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`);
  
  const exitosos = testResults.filter(r => r.status === 'ÉXITO').length;
  const errores = testResults.filter(r => r.status === 'ERROR').length;
  const total = testResults.length;
  
  console.log(`${colors.blue}📊 RESUMEN GENERAL:${colors.reset}`);
  console.log(`  • Total de pruebas: ${total}`);
  console.log(`  • ${colors.green}Exitosas: ${exitosos}${colors.reset}`);
  console.log(`  • ${colors.red}Fallidas: ${errores}${colors.reset}`);
  console.log(`  • Porcentaje de éxito: ${((exitosos/total)*100).toFixed(2)}%\n`);
  
  console.log(`${colors.blue}📋 DETALLE POR FORMULARIO:${colors.reset}`);
  testResults.forEach(result => {
    const icon = result.status === 'ÉXITO' ? '✓' : '✗';
    const color = result.status === 'ÉXITO' ? colors.green : colors.red;
    console.log(`  ${color}${icon}${colors.reset} ${result.formulario}: ${result.mensaje}`);
  });
  
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  FIN DEL REPORTE${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`);
  
  // Guardar reporte en archivo
  const fs = require('fs');
  const reportPath = './reporte-pruebas-formularios.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    fecha: new Date().toISOString(),
    resumen: {
      total,
      exitosos,
      errores,
      porcentajeExito: ((exitosos/total)*100).toFixed(2)
    },
    resultados: testResults
  }, null, 2));
  
  console.log(`${colors.green}✓${colors.reset} Reporte guardado en: ${reportPath}\n`);
}

// Ejecutar todas las pruebas
async function ejecutarPruebas() {
  console.log(`\n${colors.blue}╔═══════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║  PRUEBAS AUTOMATIZADAS - FORMULARIOS PREDIVERSA  ║${colors.reset}`);
  console.log(`${colors.blue}╚═══════════════════════════════════════════════════╝${colors.reset}\n`);
  
  // 1. Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log(`\n${colors.red}❌ No se pudo autenticar. Abortando pruebas.${colors.reset}\n`);
    return;
  }
  
  // 2-6. Pruebas de formularios
  await testCrearUsuario();
  await testCrearSeguimiento();
  await testCrearAlerta();
  await testCrearReporte();
  await testCrearRemision();
  
  // Reporte final
  generarReporte();
}

// Ejecutar
ejecutarPruebas().catch(error => {
  console.error(`\n${colors.red}❌ Error fatal:${colors.reset}`, error.message);
  process.exit(1);
});
