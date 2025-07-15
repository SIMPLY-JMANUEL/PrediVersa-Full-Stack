// Script para crear un usuario inactivo de ejemplo
const { executeQuery } = require('./config/database');

async function createInactiveUser() {
  try {
    console.log('🔧 Creando usuario inactivo de ejemplo...\n');
    
    // Cambiar el usuario "Moder" a inactivo
    const updateQuery = `UPDATE Usuarios SET Activo = 'NO' WHERE Usuario = 'Moder'`;
    await executeQuery(updateQuery);
    console.log('✅ Usuario "Moder" cambiado a INACTIVO');
    
    // Verificar el cambio
    const checkQuery = `SELECT Usuario, Nombre_Completo, Activo FROM Usuarios WHERE Usuario = 'Moder'`;
    const result = await executeQuery(checkQuery);
    
    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      const estado = user.Activo === 'SI' ? '✅ ACTIVO' : '❌ INACTIVO';
      console.log(`📋 Usuario Moder: ${estado} (${user.Activo})`);
    }
    
    console.log('\n✅ Ahora tienes:');
    console.log('- Usuario "Admin": ACTIVO (puede hacer login)');
    console.log('- Usuario "Moder": INACTIVO (NO puede hacer login)');
    console.log('- Esto permite probar ambos casos');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createInactiveUser();
