// Utilidad para testing de roles y permisos
export const testUsers = {
  admin: {
    correo: 'admin@prediversa.com',
    contraseña: 'admin123',
    rol: 'admin',
    expectedRoutes: [
      '/dashboard',
      '/admin',
      '/profile',
      '/courses',
      '/moderator',
      '/teacher',
      '/parent',
      '/student',
    ],
  },
  teacher: {
    correo: 'profesor@prediversa.com',
    contraseña: 'admin123',
    rol: 'teacher',
    expectedRoutes: ['/dashboard', '/teacher', '/profile', '/courses'],
  },
  student: {
    correo: 'estudiante@prediversa.com',
    contraseña: 'admin123',
    rol: 'student',
    expectedRoutes: ['/dashboard', '/student', '/profile', '/courses'],
  },
  parent: {
    correo: 'padre@prediversa.com',
    contraseña: 'admin123',
    rol: 'parent',
    expectedRoutes: ['/dashboard', '/parent', '/profile'],
  },
  moderator: {
    correo: 'moderador@prediversa.com',
    contraseña: 'admin123',
    rol: 'moderator',
    expectedRoutes: ['/dashboard', '/moderator', '/profile'],
  },
};

// Función para hacer login automático en testing
export const loginAsRole = async role => {
  const user = testUsers[role];
  if (!user) {
    throw new Error(`Rol ${role} no encontrado`);
  }

  try {
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: user.correo,
        contraseña: user.contraseña,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en login: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log(`✅ Login exitoso como ${role}:`, data.user);
      return data;
    } else {
      throw new Error(data.message || 'Error en login');
    }
  } catch (error) {
    console.error(`❌ Error en login como ${role}:`, error);
    throw error;
  }
};

// Función para testing de rutas
export const testRouteAccess = async routes => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const results = [];

  for (const route of routes) {
    try {
      const cleanRoute = route.startsWith('/') ? route.substring(1) : route;
      const response = await fetch(
        `http://localhost:5001/api/auth/verify-route/${cleanRoute}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        results.push({
          route,
          hasAccess: data.hasAccess,
          userRole: data.userRole,
          status: 'success',
        });
      } else {
        results.push({
          route,
          hasAccess: false,
          error: `HTTP ${response.status}`,
          status: 'error',
        });
      }
    } catch (error) {
      results.push({
        route,
        hasAccess: false,
        error: error.message,
        status: 'error',
      });
    }
  }

  return results;
};

// Función para testing completo de un rol
export const testRolePermissions = async role => {
  console.log(`🧪 Iniciando testing para rol: ${role}`);

  try {
    // 1. Login
    const loginResult = await loginAsRole(role);
    console.log(`✅ Login exitoso para ${role}`);

    // 2. Obtener rutas esperadas
    const expectedRoutes = testUsers[role].expectedRoutes;
    console.log(`📋 Rutas esperadas para ${role}:`, expectedRoutes);

    // 3. Testing de acceso a rutas
    const routeResults = await testRouteAccess(expectedRoutes);

    // 4. Testing de rutas no permitidas (sample)
    const allRoutes = [
      '/admin',
      '/teacher',
      '/student',
      '/parent',
      '/moderator',
    ];
    const forbiddenRoutes = allRoutes.filter(r => !expectedRoutes.includes(r));
    const forbiddenResults = await testRouteAccess(forbiddenRoutes);

    // 5. Resultados
    const allowedCount = routeResults.filter(r => r.hasAccess).length;
    const deniedCount = forbiddenResults.filter(r => !r.hasAccess).length;

    console.log(`📊 Resultados para ${role}:`);
    console.log(
      `   ✅ Rutas permitidas: ${allowedCount}/${routeResults.length}`
    );
    console.log(
      `   ❌ Rutas denegadas correctamente: ${deniedCount}/${forbiddenResults.length}`
    );

    return {
      role,
      loginSuccess: true,
      allowedRoutes: routeResults,
      deniedRoutes: forbiddenResults,
      summary: {
        totalAllowed: allowedCount,
        totalDenied: deniedCount,
        expectedAllowed: routeResults.length,
        expectedDenied: forbiddenResults.length,
      },
    };
  } catch (error) {
    console.error(`❌ Error en testing de ${role}:`, error);
    return {
      role,
      loginSuccess: false,
      error: error.message,
    };
  }
};

// Función para testing de todos los roles
export const testAllRoles = async () => {
  console.log('🚀 Iniciando testing completo de todos los roles...');

  const results = {};

  for (const role of Object.keys(testUsers)) {
    results[role] = await testRolePermissions(role);
    // Pequeña pausa entre tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('📋 Resumen completo de testing:', results);
  return results;
};

export default {
  testUsers,
  loginAsRole,
  testRouteAccess,
  testRolePermissions,
  testAllRoles,
};
