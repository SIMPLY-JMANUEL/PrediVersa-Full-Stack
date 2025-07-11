const User = require('./models/User');

async function testAuthentication() {
  console.log('🧪 Probando autenticación con estructura de base de datos real...\n');

  try {
    // Verificar tabla
    await User.createUsersTable();
    await User.insertDefaultUsers();

    console.log('\n📋 Probando usuarios existentes:');
    
    // Obtener todos los usuarios
    const allUsers = await User.findAll();
    console.log(`Usuarios encontrados: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`- ${user.nombre} (${user.usuario}) - Rol: ${user.rol}`);
    });

    console.log('\n🔐 Probando autenticación:');

    // Probar con usuario Admin
    console.log('\n1. Probando usuario Admin...');
    const adminUser = await User.findByUsernameOrEmail('Admin');
    if (adminUser) {
      console.log(`✅ Usuario encontrado: ${adminUser.nombre}`);
      
      // Probar diferentes contraseñas posibles
      const possiblePasswords = ['123456789', 'admin', 'Admin', 'admin123'];
      
      for (const password of possiblePasswords) {
        const isValid = await User.verifyPassword(password, adminUser.contraseña);
        console.log(`   Contraseña "${password}": ${isValid ? '✅ VÁLIDA' : '❌ inválida'}`);
        if (isValid) break;
      }
    } else {
      console.log('❌ Usuario Admin no encontrado');
    }

    // Probar con correo del usuario Admin
    console.log('\n2. Probando por correo...');
    const adminByEmail = await User.findByUsernameOrEmail('hals_93@hotmail.es');
    if (adminByEmail) {
      console.log(`✅ Usuario encontrado por correo: ${adminByEmail.nombre}`);
    } else {
      console.log('❌ Usuario no encontrado por correo');
    }

    // Probar con usuario Moder
    console.log('\n3. Probando usuario Moder...');
    const moderUser = await User.findByUsernameOrEmail('Moder');
    if (moderUser) {
      console.log(`✅ Usuario encontrado: ${moderUser.nombre}`);
      
      const possiblePasswords = ['123456789', 'moder', 'Moder', 'admin123'];
      
      for (const password of possiblePasswords) {
        const isValid = await User.verifyPassword(password, moderUser.contraseña);
        console.log(`   Contraseña "${password}": ${isValid ? '✅ VÁLIDA' : '❌ inválida'}`);
        if (isValid) break;
      }
    } else {
      console.log('❌ Usuario Moder no encontrado');
    }

    console.log('\n✅ Prueba de autenticación completada');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar la prueba
testAuthentication().then(() => {
  console.log('\n🏁 Prueba finalizada');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
