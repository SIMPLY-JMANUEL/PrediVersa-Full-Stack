const { executeQuery } = require('./config/database');

async function testUserCreation() {
  console.log('🧪 Probando creación de usuario...');
  
  try {
    // Datos de prueba
    const testData = {
      nombreCompleto: 'Usuario Prueba',
      tipoDocumento: 'Cédula de Ciudadanía',
      numeroDocumento: '12345678',
      fechaNacimiento: '1990-01-01',
      edad: 33,
      sexo: 'Masculino',
      correoElectronico: 'test@test.com',
      telefono: '1234567890',
      direccion: 'Dirección de prueba',
      epsSeguroMedico: 'EPS Prueba',
      condicionEspecial: 'Ninguna',
      contactoEmergencia: '0987654321',
      usuarioActivo: 1,
      perfil: 'Estudiante',
      contrasena: 'test123456',
      usuario: 'testuser'
    };

    // Primero verificar la estructura de la tabla
    console.log('🔍 Verificando estructura de la tabla usuarios...');
    const tableStructure = await executeQuery(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'usuarios'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('📋 Estructura de la tabla:');
    tableStructure.recordset.forEach(col => {
      console.log(`  ${col.COLUMN_NAME}: ${col.DATA_TYPE}(${col.CHARACTER_MAXIMUM_LENGTH || 'N/A'}) - Nullable: ${col.IS_NULLABLE}`);
    });

    // Luego verificar duplicados
    console.log('\n🔍 Verificando duplicados...');
    const checkDuplicatesQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN Identificacion = @numeroDocumento THEN 1 ELSE 0 END) as doc_duplicates,
        SUM(CASE WHEN Correo = @correoElectronico THEN 1 ELSE 0 END) as email_duplicates,
        SUM(CASE WHEN Contacto_Emergencia = @contactoEmergencia THEN 1 ELSE 0 END) as phone_duplicates
      FROM usuarios 
      WHERE Identificacion = @numeroDocumento 
         OR Correo = @correoElectronico 
         OR Contacto_Emergencia = @contactoEmergencia
    `;

    const duplicates = await executeQuery(checkDuplicatesQuery, {
      numeroDocumento: testData.numeroDocumento,
      correoElectronico: testData.correoElectronico,
      contactoEmergencia: testData.contactoEmergencia
    });

    console.log('📊 Resultado verificación duplicados:', duplicates.recordset[0]);

    if (duplicates.recordset[0].total > 0) {
      console.log('⚠️ Se encontraron registros duplicados, limpiando...');
      await executeQuery(`
        DELETE FROM usuarios 
        WHERE Identificacion = @numeroDocumento 
           OR Correo = @correoElectronico 
           OR Contacto_Emergencia = @contactoEmergencia
      `, {
        numeroDocumento: testData.numeroDocumento,
        correoElectronico: testData.correoElectronico,
        contactoEmergencia: testData.contactoEmergencia
      });
      console.log('🧹 Registros duplicados eliminados');
    }

    // Intentar la inserción
    console.log('\n📝 Intentando insertar usuario...');
    
    // Obtener el próximo ID disponible
    const maxIdQuery = 'SELECT ISNULL(MAX(Id_Usuario), 0) + 1 as nextId FROM usuarios';
    const maxIdResult = await executeQuery(maxIdQuery);
    const nextId = maxIdResult.recordset[0].nextId;
    console.log(`🔢 Próximo ID disponible: ${nextId}`);
    
    const insertQuery = `
      INSERT INTO usuarios (
        Id_Usuario,
        Nombre_Completo,
        Perfil,
        Usuario,
        Correo,
        Activo,
        Identificacion,
        Contrasena,
        Contacto_Emergencia,
        Sexo,
        Tipo_Documento,
        Edad,
        Direccion,
        EPS,
        Numero_Contacto_Emergencia,
        Fecha_Nacimiento
      ) VALUES (
        @idUsuario,
        @nombreCompleto,
        @perfil,
        @usuario,
        @correoElectronico,
        @usuarioActivo,
        @numeroDocumento,
        @contrasena,
        @telefono,
        @sexo,
        @tipoDocumento,
        @edad,
        @direccion,
        @epsSeguroMedico,
        @contactoEmergencia,
        @fechaNacimiento
      )
    `;

    await executeQuery(insertQuery, {
      idUsuario: nextId,
      nombreCompleto: testData.nombreCompleto,
      perfil: testData.perfil,
      usuario: testData.usuario,
      correoElectronico: testData.correoElectronico,
      usuarioActivo: testData.usuarioActivo,
      numeroDocumento: testData.numeroDocumento,
      contrasena: testData.contrasena.padEnd(10, ' '),
      telefono: testData.telefono,
      sexo: testData.sexo,
      tipoDocumento: testData.tipoDocumento,
      edad: testData.edad,
      direccion: testData.direccion,
      epsSeguroMedico: testData.epsSeguroMedico,
      contactoEmergencia: testData.contactoEmergencia,
      fechaNacimiento: testData.fechaNacimiento
    });

    console.log('✅ Usuario creado exitosamente!');

    // Verificar que se insertó
    const verification = await executeQuery(`
      SELECT Usuario, Nombre_Completo, Correo 
      FROM usuarios 
      WHERE Identificacion = @numeroDocumento
    `, { numeroDocumento: testData.numeroDocumento });

    console.log('🎯 Usuario verificado:', verification.recordset[0]);

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    console.error('📝 Stack trace:', error.stack);
  }
}

testUserCreation().then(() => {
  console.log('🏁 Prueba completada');
  process.exit(0);
}).catch(err => {
  console.error('💥 Error fatal:', err);
  process.exit(1);
});
