/**
 * Script de inyección para actualizar token en el frontend
 * Ejecutar en la consola del navegador (F12) en http://localhost:3000
 */

// Token válido generado recientemente
const newToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo1LCJub21icmUiOiJUZXN0IFVzdWFyaW8gU2VpcyIsImNvcnJlbyI6InRlc3Q2QHRlc3QuY29tIiwidXN1YXJpbyI6InRlc3R1c2VyNiIsInJvbCI6IkFkbWluaXN0cmFkb3IiLCJhY3Rpdm8iOiJTSSJ9LCJpYXQiOjE3Njk0Nzg3MDYsImV4cCI6MTc2OTU2NTEwNn0.lqLTPNg6_Ob10tyKGGh3h4z05rmt6JN3lFAGhZ4KwoU';

// Paso 1: Limpiar token anterior
console.log('🧹 Limpiando tokens anteriores...');
localStorage.removeItem('token');
sessionStorage.removeItem('token');

// Paso 2: Guardar nuevo token
console.log('📝 Guardando nuevo token...');
localStorage.setItem('token', newToken);

// Paso 3: Verificar que se guardó
const savedToken = localStorage.getItem('token');
if (savedToken === newToken) {
  console.log('✅ Token guardado correctamente en localStorage');
  console.log('🔐 Token:', savedToken.substring(0, 50) + '...');
} else {
  console.error('❌ Error: No se guardó el token correctamente');
}

// Paso 4: Recargar la página
console.log('⏳ Recargando página en 2 segundos...');
setTimeout(() => {
  location.reload();
}, 2000);

console.log('✅ Sistema listo para usar sin errores de token');
