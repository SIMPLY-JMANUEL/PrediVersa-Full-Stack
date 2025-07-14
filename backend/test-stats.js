// Test script para verificar las estadísticas administrativas
const { executeQuery } = require('./config/database');

async function testAdminStats() {
  try {
    console.log('🔍 Probando consulta de estadísticas administrativas...');
    
    // Consulta para obtener estadísticas de usuarios
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

    const statsResult = await executeQuery(statsQuery);
    const stats = statsResult.recordset[0];

    console.log('📊 Estadísticas obtenidas:');
    console.log(`Total de usuarios: ${stats.totalUsuarios}`);
    console.log(`Usuarios activos: ${stats.usuariosActivos}`);
    console.log(`Usuarios inactivos: ${stats.usuariosInactivos}`);
    console.log(`Estudiantes: ${stats.estudiantes}`);
    console.log(`Padres: ${stats.padres}`);
    console.log(`Profesores: ${stats.profesores}`);
    console.log(`Moderadores: ${stats.moderadores}`);
    console.log(`Administradores: ${stats.administradores}`);

    // Verificar también perfiles únicos
    const perfilesQuery = `
      SELECT DISTINCT Perfil, COUNT(*) as cantidad
      FROM Usuarios
      GROUP BY Perfil
      ORDER BY cantidad DESC
    `;

    const perfilesResult = await executeQuery(perfilesQuery);
    
    console.log('\n🏷️  Perfiles únicos encontrados:');
    perfilesResult.recordset.forEach(perfil => {
      console.log(`- ${perfil.Perfil}: ${perfil.cantidad}`);
    });

    // Verificar estados únicos
    const estadosQuery = `
      SELECT DISTINCT Activo, COUNT(*) as cantidad
      FROM Usuarios
      GROUP BY Activo
      ORDER BY cantidad DESC
    `;

    const estadosResult = await executeQuery(estadosQuery);
    
    console.log('\n🔄 Estados únicos encontrados:');
    estadosResult.recordset.forEach(estado => {
      console.log(`- ${estado.Activo}: ${estado.cantidad}`);
    });

    console.log('\n✅ Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error al probar estadísticas:', error);
  }
}

// Ejecutar el test
testAdminStats().then(() => {
  console.log('Script terminado');
  process.exit(0);
}).catch(error => {
  console.error('Error general:', error);
  process.exit(1);
});
