const mysql = require('mysql2/promise');
const fs = require('fs');

const dbConfig = {
  host: 'prediversa-db.ce1qo0a0sygg.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Pruebas2026...',
  port: 3306,
  multipleStatements: true
};

async function migrateDatabase() {
  let connection;
  
  try {
    console.log('🔗 Conectando a RDS MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión exitosa\n');
    
    // 1. Crear esquema
    console.log('📋 Creando esquema de base de datos...');
    const schema = fs.readFileSync('migrate-schema-mysql.sql', 'utf-8');
    await connection.query(schema);
    console.log('✅ Esquema creado\n');
    
    // 2. Usar base de datos
    await connection.query('USE PrediVersa');
    
    // 3. Insertar datos
    console.log('📊 Insertando datos de usuarios...');
    const data = fs.readFileSync('migrate-data-mysql.sql', 'utf-8');
    await connection.query(data);
    console.log('✅ Datos insertados\n');
    
    // 4. Verificar datos
    console.log('🔍 Verificando datos...');
    const [users] = await connection.query('SELECT COUNT(*) as total FROM Usuarios');
    console.log(`✅ Total usuarios migrados: ${users[0].total}\n`);
    
    // 5. Mostrar algunos usuarios
    const [sampleUsers] = await connection.query(
      'SELECT Id_Usuario, Usuario, Perfil, Activo FROM Usuarios LIMIT 5'
    );
    console.log('👥 Usuarios de ejemplo:');
    sampleUsers.forEach(u => {
      console.log(`   - ${u.Usuario} (${u.Perfil}) - Activo: ${u.Activo}`);
    });
    
    console.log('\n🎉 ¡Migración completada exitosamente!');
    console.log('\n📝 Configuración para .env:');
    console.log('DB_HOST=prediversa-db.ce1qo0a0sygg.us-east-1.rds.amazonaws.com');
    console.log('DB_PORT=3306');
    console.log('DB_NAME=PrediVersa');
    console.log('DB_USER=admin');
    console.log('DB_PASSWORD=Pruebas2026...');
    console.log('DB_DIALECT=mysql');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

migrateDatabase();
