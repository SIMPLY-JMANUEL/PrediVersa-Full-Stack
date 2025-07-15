const { executeQuery } = require('./config/database');

async function createSimpleAdminUser() {
  try {
    console.log('🔐 Creando usuario administrador...');
    
    // Primero verificar si el usuario ya existe
    const checkQuery = `
      SELECT COUNT(*) as count FROM Usuarios 
      WHERE Usuario = 'Admin' OR Correo = 'admin@prediversa.com'
    `;
    
    const checkResult = await executeQuery(checkQuery);
    
    if (checkResult.recordset[0].count > 0) {
      console.log('⚠️  Usuario administrador ya existe');
      
      // Actualizar la contraseña existente (contraseña simple de 10 caracteres)
      const updateQuery = `
        UPDATE Usuarios 
        SET Contrasena = '123456789', Activo = 'SI'
        WHERE Usuario = 'Admin' OR Correo = 'admin@prediversa.com'
      `;
      
      await executeQuery(updateQuery);
      
      console.log('✅ Contraseña del administrador actualizada');
      
    } else {
      console.log('👤 Creando nuevo usuario administrador...');
      
      // Crear nuevo usuario administrador
      const insertQuery = `
        INSERT INTO Usuarios (
          Usuario, 
          Correo, 
          Nombre_Completo, 
          Contrasena, 
          Activo,
          Perfil,
          Identificacion,
          Contacto_Emergencia,
          Sexo,
          Tipo_Documento,
          Edad,
          Direccion,
          EPS,
          Condicion_Especial,
          Numero_Contacto_Emergencia,
          Fecha_Nacimiento
        ) VALUES (
          'Admin', 
          'admin@prediversa.com', 
          'Administrador PrediVersa', 
          '123456789', 
          'SI',
          'admin',
          '0000000000',
          'N/A',
          'N/A',
          'CC',
          30,
          'Direccion Admin',
          'N/A',
          @condicion,
          'N/A',
          '1990-01-01'
        )
      `;
      
      await executeQuery(insertQuery, {
        condicion: Buffer.from('Admin', 'utf8')
      });
      
      console.log('✅ Usuario administrador creado exitosamente');
    }
    
    // Verificar el usuario creado
    const verifyQuery = `
      SELECT Id_Usuario, Usuario, Correo, Nombre_Completo, Perfil, Activo, Contrasena
      FROM Usuarios 
      WHERE Usuario = 'Admin'
    `;
    
    const verifyResult = await executeQuery(verifyQuery);
    
    if (verifyResult.recordset.length > 0) {
      const user = verifyResult.recordset[0];
      console.log('🎉 Usuario verificado:');
      console.log(`   ID: ${user.Id_Usuario}`);
      console.log(`   Usuario: ${user.Usuario}`);
      console.log(`   Correo: ${user.Correo}`);
      console.log(`   Nombre: ${user.Nombre_Completo}`);
      console.log(`   Perfil: ${user.Perfil}`);
      console.log(`   Activo: ${user.Activo}`);
      console.log(`   Contraseña: ${user.Contrasena}`);
      console.log('');
      console.log('📋 CREDENCIALES PARA LOGIN:');
      console.log('   Usuario: Admin');
      console.log('   Contraseña: 123456789');
      console.log('');
      console.log('✅ Ya puedes hacer login en el sistema');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createSimpleAdminUser();
