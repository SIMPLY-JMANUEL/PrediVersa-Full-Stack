const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/.env' });

// El token que debería estar en localStorage del frontend
// Para probar, puedes obtenerlo desde las DevTools del navegador:
// 1. F12 -> Console
// 2. localStorage.getItem('token')

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║        VERIFICACIÓN DE TOKEN JWT                  ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

console.log('📝 JWT_SECRET en .env:', process.env.JWT_SECRET || '(no definido - usando default)');
console.log('📝 JWT_SECRET que se usará:', process.env.JWT_SECRET || 'CAMBIAR_CLAVE_JWT_SEGURA_MINIMO_32_CARACTERES');

// Ejemplo: Generar un nuevo token para testuser6
const testPayload = {
  user: {
    id: 1,
    nombre: 'Test User',
    correo: 'test@example.com',
    usuario: 'testuser6',
    rol: 'Administrador',
    activo: 'SI'
  }
};

const newToken = jwt.sign(
  testPayload,
  process.env.JWT_SECRET || 'CAMBIAR_CLAVE_JWT_SEGURA_MINIMO_32_CARACTERES',
  { expiresIn: '24h' }
);

console.log('\n✅ Token generado para prueba:');
console.log(newToken);
console.log('\n📋 Para usar este token:');
console.log('1. Abre el frontend en el navegador (http://localhost:3000)');
console.log('2. Abre la consola del navegador (F12)');
console.log('3. Ejecuta: localStorage.setItem("token", "' + newToken + '")');
console.log('4. Recarga la página y prueba el formulario de reportes');

// Si quieres verificar un token existente, descomenta esto:
// const tokenToVerify = 'PEGA_AQUI_EL_TOKEN_DEL_LOCALSTORAGE';
// try {
//   const decoded = jwt.verify(tokenToVerify, process.env.JWT_SECRET || 'CAMBIAR_CLAVE_JWT_SEGURA_MINIMO_32_CARACTERES');
//   console.log('\n✅ Token válido. Contenido:', decoded);
// } catch (error) {
//   console.log('\n❌ Token inválido:', error.message);
// }

console.log('\n═══════════════════════════════════════════════════\n');
