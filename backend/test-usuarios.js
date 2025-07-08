// Script para probar todos los usuarios del sistema
const usuarios = [
  { correo: 'admin@prediversa.com', contraseña: 'admin123', rol: 'admin', nombre: 'Juliana Fajardo' },
  { correo: 'profesor@prediversa.com', contraseña: 'admin123', rol: 'teacher', nombre: 'Andrey Luna' },
  { correo: 'estudiante@prediversa.com', contraseña: 'admin123', rol: 'student', nombre: 'Carlos Rodríguez' },
  { correo: 'padre@prediversa.com', contraseña: 'admin123', rol: 'parent', nombre: 'Harold Salcedo' },
  { correo: 'moderador@prediversa.com', contraseña: 'admin123', rol: 'moderator', nombre: 'Moderador' }
];

async function probarLogin(usuario) {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: usuario.correo, contraseña: usuario.contraseña })
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ ${usuario.rol} (${usuario.nombre}): Login exitoso - Token: ${result.token.substring(0, 20)}...`);
      console.log(`   Usuario autenticado: ${result.user.nombre} (${result.user.rol})`);
      console.log(`   Redirección: /dashboard/${result.user.rol}\n`);
    } else {
      console.log(`❌ ${usuario.rol} (${usuario.nombre}): Error - ${result.msg}\n`);
    }
  } catch (error) {
    console.log(`💥 ${usuario.rol} (${usuario.nombre}): Error de conexión - ${error.message}\n`);
  }
}

async function probarTodosLosUsuarios() {
  console.log('🚀 Probando todos los usuarios del sistema PrediVersa...\n');
  
  for (const usuario of usuarios) {
    await probarLogin(usuario);
  }
  
  console.log('🎉 Pruebas completadas!');
}

probarTodosLosUsuarios();
