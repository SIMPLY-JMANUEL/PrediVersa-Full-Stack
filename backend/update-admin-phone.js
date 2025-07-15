// Script para actualizar el teléfono personal del usuario Admin
const { executeQuery } = require('./config/database');

async function updateAdminPhone() {
  try {
    console.log('📱 ACTUALIZANDO TELÉFONO PERSONAL DEL ADMIN');
    console.log('==========================================');
    
    // Actualizar el teléfono personal del usuario Admin
    const updateQuery = `
      UPDATE dbo.usuarios 
      SET Telefono = '3001234567' 
      WHERE Usuario = 'Admin'
    `;
    
    await executeQuery(updateQuery);
    console.log('✅ Teléfono personal actualizado exitosamente');
    
    // Verificar la actualización
    const verifyQuery = `
      SELECT 
        Nombre_Completo,
        Usuario,
        Telefono,
        Contacto_Emergencia,
        Numero_Contacto_Emergencia
      FROM dbo.usuarios 
      WHERE Usuario = 'Admin'
    `;
    
    const result = await executeQuery(verifyQuery);
    
    if (result.recordset.length > 0) {
      const admin = result.recordset[0];
      
      console.log('\n📋 VERIFICACIÓN DE ACTUALIZACIÓN:');
      console.log('----------------------------------');
      console.log(`👤 Usuario: ${admin.Usuario}`);
      console.log(`📝 Nombre: ${admin.Nombre_Completo}`);
      console.log(`📞 Teléfono Personal: ${admin.Telefono}`);
      console.log(`👥 Contacto de Emergencia: ${admin.Contacto_Emergencia}`);
      console.log(`🚨 Teléfono de Emergencia: ${admin.Numero_Contacto_Emergencia}`);
      
      console.log('\n🎯 RESULTADO EN LA TARJETA:');
      console.log('---------------------------');
      console.log(`✅ Teléfono Personal: ${admin.Telefono}`);
      console.log(`✅ Contacto de Emergencia: ${admin.Contacto_Emergencia}`);
      console.log(`✅ Teléfono de Emergencia: ${admin.Numero_Contacto_Emergencia}`);
      
      console.log('\n🎉 ACTUALIZACIÓN COMPLETADA');
      console.log('Ahora la tarjeta mostrará ambos números de teléfono correctamente');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateAdminPhone();
