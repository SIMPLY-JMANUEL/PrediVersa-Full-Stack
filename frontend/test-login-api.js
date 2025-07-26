// Test de Login API desde Frontend
console.log('🧪 Testing login API from frontend...');

const testLogin = async (usuario, contraseña) => {
  try {
    console.log(`\n🔍 Testing login: ${usuario}`);

    const response = await fetch('http://localhost:5003/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        correo: usuario,
        contraseña: contraseña,
      }),
    });

    console.log('📊 Response status:', response.status);

    const data = await response.json();
    console.log('📦 Response data:', data);

    if (data.success && data.user) {
      console.log('✅ Login successful!');
      console.log('👤 User details:');
      console.log('  - Nombre:', data.user.nombre);
      console.log('  - Usuario:', data.user.usuario);
      console.log('  - Rol:', data.user.rol);
      console.log('  - Activo:', data.user.activo);

      // Simular redirección
      const getDashboardRoute = rol => {
        const profileRoutes = {
          ADMIN: '/dashboard/admin',
          ESTUDIANTE: '/dashboard/student',
          MODERADOR: '/dashboard/moderator',
          PROFESOR: '/dashboard/teacher',
          PADRE: '/dashboard/parent',
          MADRE: '/dashboard/parent',
        };
        return profileRoutes[rol] || '/dashboard';
      };

      const dashboardRoute = getDashboardRoute(data.user.rol);
      console.log('🚀 Dashboard route:', dashboardRoute);
    } else {
      console.log('❌ Login failed:', data.msg || 'Unknown error');
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
};

// Probar con diferentes usuarios
const testUsers = [
  { usuario: 'AD.01', contraseña: 'A1234567' },
  { usuario: 'ES.01', contraseña: 'G1234567' },
  { usuario: 'MO.01', contraseña: 'C1234567' },
  { usuario: 'PR.01', contraseña: 'E1234567' },
  { usuario: 'PA.01', contraseña: 'I1234567' },
];

async function runTests() {
  for (const user of testUsers) {
    await testLogin(user.usuario, user.contraseña);
    await new Promise(resolve => setTimeout(resolve, 500)); // Pausa entre tests
  }
  console.log('\n🏁 All tests completed!');
}

runTests();
