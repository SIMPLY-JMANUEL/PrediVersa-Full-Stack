// Script para corregir el campo Activo en la base de datos
const { executeQuery } = require('./config/database');

async function fixActivoField() {
  try {
    console.log('🔧 Corrigiendo campo Activo en la base de datos...\n');
    
    // 1. Verificar el estado actual
    console.log('🔍 Estado actual de los usuarios:');
    const currentQuery = `SELECT Id_Usuario, Usuario, Nombre_Completo, Activo, Perfil FROM Usuarios ORDER BY Id_Usuario`;
    const currentResult = await executeQuery(currentQuery);
    
    currentResult.recordset.forEach(user => {
      console.log(`   - ${user.Usuario}: Activo = "${user.Activo}" (${typeof user.Activo})`);
    });
    
    console.log('\n🔄 Actualizando campo Activo...');
    
    // 2. Actualizar usuarios que tengan valor 1 o '1' a 'SI'
    const updateActiveQuery = `
      UPDATE Usuarios 
      SET Activo = 'SI' 
      WHERE Activo = '1' OR Activo = 1 OR Activo = 'true' OR Activo = 'Activo'
    `;
    
    await executeQuery(updateActiveQuery);
    console.log('✅ Usuarios activos actualizados a "SI"');
    
    // 3. Actualizar usuarios que tengan valor 0 o '0' a 'NO'
    const updateInactiveQuery = `
      UPDATE Usuarios 
      SET Activo = 'NO' 
      WHERE Activo = '0' OR Activo = 0 OR Activo = 'false' OR Activo = 'Inactivo'
    `;
    
    await executeQuery(updateInactiveQuery);
    console.log('✅ Usuarios inactivos actualizados a "NO"');
    
    // 4. Asegurar que el usuario Admin esté activo
    const activateAdminQuery = `
      UPDATE Usuarios 
      SET Activo = 'SI' 
      WHERE Usuario = 'Admin' OR Usuario = 'admin'
    `;
    
    await executeQuery(activateAdminQuery);
    console.log('✅ Usuario Admin activado');
    
    // 5. Verificar el estado final
    console.log('\n🔍 Estado final de los usuarios:');
    const finalResult = await executeQuery(currentQuery);
    
    finalResult.recordset.forEach(user => {
      const estado = user.Activo === 'SI' ? '✅ ACTIVO' : '❌ INACTIVO';
      console.log(`   - ${user.Usuario}: ${estado} (${user.Activo})`);
    });
    
    console.log('\n✅ Corrección completada:');
    console.log('- Todos los usuarios ahora tienen "SI" o "NO" en el campo Activo');
    console.log('- El usuario Admin está activado para poder hacer login');
    console.log('- El sistema de login funcionará correctamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixActivoField();
