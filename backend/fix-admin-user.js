// Corregir usuario Admin para que tenga "SI" en lugar de "1"
const { executeQuery } = require('./config/database');

async function fixAdminUser() {
  try {
    console.log('🔧 Corrigiendo usuario Admin...\n');
    
    // Actualizar Admin a activo
    const updateAdminQuery = `UPDATE Usuarios SET Activo = 'SI' WHERE Usuario = 'Admin'`;
    await executeQuery(updateAdminQuery);
    console.log('✅ Usuario Admin actualizado a ACTIVO');
    
    // Verificar el cambio
    const verifyQuery = `SELECT Usuario, Activo FROM Usuarios WHERE Usuario = 'Admin'`;
    const result = await executeQuery(verifyQuery);
    
    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      const estado = user.Activo === 'SI' ? '✅ ACTIVO' : '❌ INACTIVO';
      console.log(`📋 Usuario Admin: ${estado} (${user.Activo})`);
    }
    
    console.log('\n✅ Corrección finalizada. Ahora puedes:');
    console.log('- Hacer login como Admin con contraseña 123456789');
    console.log('- Usar el formulario de modificación de usuarios');
    console.log('- El campo Activo guardará correctamente "SI" o "NO"');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixAdminUser();
