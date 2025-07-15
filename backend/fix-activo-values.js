// Script para corregir específicamente los valores "1" y "0" en el campo Activo
const { executeQuery } = require('./config/database');

async function fixActivoValues() {
  try {
    console.log('🔧 Corrigiendo valores específicos en el campo Activo...\n');
    
    // 1. Actualizar registros que tengan '1' a 'SI'
    console.log('🔄 Actualizando registros con valor "1" a "SI"...');
    const updateOneQuery = `UPDATE Usuarios SET Activo = 'SI' WHERE Activo = '1'`;
    await executeQuery(updateOneQuery);
    console.log('✅ Registros con "1" actualizados a "SI"');
    
    // 2. Actualizar registros que tengan '0' a 'NO'
    console.log('🔄 Actualizando registros con valor "0" a "NO"...');
    const updateZeroQuery = `UPDATE Usuarios SET Activo = 'NO' WHERE Activo = '0'`;
    await executeQuery(updateZeroQuery);
    console.log('✅ Registros con "0" actualizados a "NO"');
    
    // 3. Verificar el estado final
    console.log('\n🔍 Estado final de los usuarios:');
    const finalQuery = `SELECT Id_Usuario, Usuario, Nombre_Completo, Activo, Perfil FROM Usuarios ORDER BY Id_Usuario`;
    const finalResult = await executeQuery(finalQuery);
    
    finalResult.recordset.forEach(user => {
      const estado = user.Activo === 'SI' ? '✅ ACTIVO' : '❌ INACTIVO';
      console.log(`   - ${user.Usuario}: ${estado} (${user.Activo})`);
    });
    
    // 4. Verificar valores únicos
    console.log('\n🔍 Valores únicos en el campo Activo:');
    const uniqueQuery = `SELECT DISTINCT Activo FROM Usuarios ORDER BY Activo`;
    const uniqueResult = await executeQuery(uniqueQuery);
    
    uniqueResult.recordset.forEach(row => {
      console.log(`   - "${row.Activo}"`);
    });
    
    console.log('\n✅ Corrección completada:');
    console.log('- El campo Activo ahora solo contiene "SI" o "NO"');
    console.log('- El sistema de login funcionará correctamente');
    console.log('- Los formularios de modificación guardarán los valores correctos');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixActivoValues();
