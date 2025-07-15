const bcrypt = require('bcryptjs');
const sql = require('mssql');

// Configuración de la base de datos SQL Server
const dbConfig = {
  server: 'DESKTOP-5R27AVI\\PREDIVERSA',
  database: 'PrediVersa',
  user: 'sa',
  password: '123456789',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    instanceName: 'PREDIVERSA'
  }
};

async function createAdminUser() {
  try {
    console.log('🔐 Creando usuario administrador...');
    
    // Conectar a la base de datos
    const pool = await sql.connect(dbConfig);
    console.log('✅ Conectado a SQL Server');
    
    // Generar hash de la contraseña
    const hashedPassword = await bcrypt.hash('123456789', 10);
    console.log('🔑 Contraseña hasheada generada');
    
    // Primero verificar si el usuario ya existe
    const checkQuery = `
      SELECT COUNT(*) as count FROM Usuarios 
      WHERE Nombre_Usuario = 'Admin' OR Correo_Electronico = 'admin@prediversa.com'
    `;
    
    const checkResult = await pool.request().query(checkQuery);
    
    if (checkResult.recordset[0].count > 0) {
      console.log('⚠️  Usuario administrador ya existe');
      
      // Actualizar la contraseña existente
      const updateQuery = `
        UPDATE Usuarios 
        SET Contrasena_Hash = @password, Activo = 1
        WHERE Nombre_Usuario = 'Admin' OR Correo_Electronico = 'admin@prediversa.com'
      `;
      
      await pool.request()
        .input('password', sql.NVarChar, hashedPassword)
        .query(updateQuery);
      
      console.log('✅ Contraseña del administrador actualizada');
      
    } else {
      console.log('👤 Creando nuevo usuario administrador...');
      
      // Crear nuevo usuario administrador
      const insertQuery = `
        INSERT INTO Usuarios (
          Nombre_Usuario, 
          Correo_Electronico, 
          Nombre_Completo, 
          Contrasena_Hash, 
          Activo,
          Rol,
          Telefono,
          Direccion,
          Condicion_Especial
        ) VALUES (
          'Admin', 
          'admin@prediversa.com', 
          'Administrador PrediVersa', 
          @password, 
          1,
          'admin',
          '0000000000',
          'Dirección Administrativa',
          @condicion
        )
      `;
      
      await pool.request()
        .input('password', sql.NVarChar, hashedPassword)
        .input('condicion', sql.VarBinary, Buffer.from('Administrador', 'utf8'))
        .query(insertQuery);
      
      console.log('✅ Usuario administrador creado exitosamente');
    }
    
    // Verificar el usuario creado
    const verifyQuery = `
      SELECT Id_Usuario, Nombre_Usuario, Correo_Electronico, Nombre_Completo, Activo
      FROM Usuarios 
      WHERE Nombre_Usuario = 'Admin'
    `;
    
    const verifyResult = await pool.request().query(verifyQuery);
    
    if (verifyResult.recordset.length > 0) {
      const user = verifyResult.recordset[0];
      console.log('🎉 Usuario verificado:');
      console.log(`   ID: ${user.Id_Usuario}`);
      console.log(`   Usuario: ${user.Nombre_Usuario}`);
      console.log(`   Correo: ${user.Correo_Electronico}`);
      console.log(`   Nombre: ${user.Nombre_Completo}`);
      console.log(`   Activo: ${user.Activo ? 'Sí' : 'No'}`);
      console.log('');
      console.log('📋 CREDENCIALES PARA LOGIN:');
      console.log('   Usuario: Admin');
      console.log('   Contraseña: 123456789');
      console.log('');
      console.log('✅ Ya puedes hacer login en el sistema');
    }
    
    // Cerrar conexión
    await pool.close();
    console.log('🔐 Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAdminUser();
