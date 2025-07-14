// Script para verificar login y estadísticas
const { executeQuery } = require('./config/database');

async function verificarLogin() {
  try {
    console.log('🔍 Verificando credenciales de administrador...');
    
    // Consulta para verificar el usuario administrador
    const query = `
      SELECT Usuario, Correo, Contrasena, Perfil, Activo 
      FROM Usuarios 
      WHERE Perfil = 'Administrador' AND Activo IN ('SI', '1')
    `;
    
    const result = await executeQuery(query);
    
    if (result.recordset.length > 0) {
      const admin = result.recordset[0];
      console.log('✅ Usuario administrador encontrado:');
      console.log(`   - Usuario: ${admin.Usuario}`);
      console.log(`   - Correo: ${admin.Correo}`);
      console.log(`   - Perfil: ${admin.Perfil}`);
      console.log(`   - Activo: ${admin.Activo}`);
      console.log(`   - Contraseña: ${admin.Contrasena}`);
      
      console.log('\n📝 Para hacer login usar:');
      console.log(`   - Campo: usuario o correo = "${admin.Usuario}" o "${admin.Correo}"`);
      console.log(`   - Campo: contraseña = "${admin.Contrasena.trim()}"`);
      
      return admin;
    } else {
      console.log('❌ No se encontró usuario administrador activo');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error al verificar login:', error);
    return null;
  }
}

async function verificarEstadisticas() {
  try {
    console.log('\n📊 Verificando estadísticas...');
    
    // Consulta de estadísticas
    const statsQuery = `
      SELECT 
        COUNT(*) as totalUsuarios,
        SUM(CASE WHEN Activo = 'SI' OR Activo = '1' THEN 1 ELSE 0 END) as usuariosActivos,
        SUM(CASE WHEN Activo = 'NO' OR Activo = '0' THEN 1 ELSE 0 END) as usuariosInactivos,
        SUM(CASE WHEN Perfil = 'Estudiante' THEN 1 ELSE 0 END) as estudiantes,
        SUM(CASE WHEN Perfil = 'Padre' OR Perfil = 'Padre/Madre/Acudiente' OR Perfil = 'Acudiente' THEN 1 ELSE 0 END) as padres,
        SUM(CASE WHEN Perfil = 'Profesor' OR Perfil = 'Docente' THEN 1 ELSE 0 END) as profesores,
        SUM(CASE WHEN Perfil = 'Moderador' THEN 1 ELSE 0 END) as moderadores,
        SUM(CASE WHEN Perfil = 'Administrador' THEN 1 ELSE 0 END) as administradores
      FROM Usuarios
    `;
    
    const result = await executeQuery(statsQuery);
    const stats = result.recordset[0];
    
    console.log('✅ Estadísticas obtenidas:');
    console.log(`   - Total usuarios: ${stats.totalUsuarios}`);
    console.log(`   - Usuarios activos: ${stats.usuariosActivos}`);
    console.log(`   - Usuarios inactivos: ${stats.usuariosInactivos}`);
    console.log(`   - Estudiantes: ${stats.estudiantes}`);
    console.log(`   - Padres/Acudientes: ${stats.padres}`);
    console.log(`   - Profesores/Docentes: ${stats.profesores}`);
    console.log(`   - Moderadores: ${stats.moderadores}`);
    console.log(`   - Administradores: ${stats.administradores}`);
    
    return stats;
    
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    return null;
  }
}

async function main() {
  console.log('🚀 Sistema PrediVersa - Verificación de Login y Estadísticas');
  console.log('=============================================================\n');
  
  const admin = await verificarLogin();
  const stats = await verificarEstadisticas();
  
  if (admin && stats) {
    console.log('\n🎉 ¡Sistema verificado exitosamente!');
    console.log('\n🔗 Enlaces del sistema:');
    console.log('   - Frontend: http://localhost:3000');
    console.log('   - Backend: http://localhost:5001/api');
    console.log('   - API Gateway: http://localhost:3001');
    console.log('\n🔐 Credenciales de prueba:');
    console.log(`   - Usuario: ${admin.Usuario}`);
    console.log(`   - Contraseña: ${admin.Contrasena.trim()}`);
  } else {
    console.log('\n❌ Sistema no está completamente funcional');
  }
}

main().catch(console.error);
