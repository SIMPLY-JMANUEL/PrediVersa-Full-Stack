import React, { useState } from 'react';
import {
  refreshUserPermissions,
  clearRouteCache,
} from '../components/ProtectedRoute';

const RoleTestingPage = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const testUsers = {
    admin: { correo: 'admin@prediversa.com', contraseña: 'admin123' },
    teacher: { correo: 'profesor@prediversa.com', contraseña: 'admin123' },
    student: { correo: 'estudiante@prediversa.com', contraseña: 'admin123' },
    parent: { correo: 'padre@prediversa.com', contraseña: 'admin123' },
    moderator: { correo: 'moderador@prediversa.com', contraseña: 'admin123' },
  };

  const loginAsRole = async role => {
    const user = testUsers[role];
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        clearRouteCache();
        refreshUserPermissions();

        setTestResults({
          success: true,
          role,
          user: data.user,
          message: `Login exitoso como ${role}`,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setTestResults({
        success: false,
        role,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearRouteCache();
    refreshUserPermissions();
    setTestResults(null);
    setSelectedRole('');
  };

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Testing de Roles y Permisos</h1>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Estado Actual</h2>
        {currentUser ? (
          <div>
            <p>
              <strong>Usuario:</strong> {currentUser.nombre}
            </p>
            <p>
              <strong>Rol:</strong> {currentUser.rol}
            </p>
            <p>
              <strong>Email:</strong> {currentUser.correo}
            </p>
            <button
              onClick={logout}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <p>No hay usuario logueado</p>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg border mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Probar Login con Diferentes Roles
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(testUsers).map(role => (
            <button
              key={role}
              onClick={() => loginAsRole(role)}
              disabled={loading}
              className={`p-3 rounded-lg border ${
                selectedRole === role
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 hover:bg-gray-100'
              } ${
                loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {testResults && (
        <div
          className={`p-4 rounded-lg ${
            testResults.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          } border`}
        >
          <h3 className="font-semibold mb-2">Resultado del Test</h3>
          {testResults.success ? (
            <div>
              <p className="text-green-700">✅ {testResults.message}</p>
              <p className="text-sm text-gray-600 mt-2">
                Ahora puedes navegar por la aplicación para probar las rutas
                disponibles para el rol <strong>{testResults.role}</strong>
              </p>
            </div>
          ) : (
            <p className="text-red-700">❌ Error: {testResults.error}</p>
          )}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <h3 className="font-semibold mb-2">Instrucciones de Testing</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Selecciona un rol para hacer login automático</li>
          <li>
            Una vez logueado, navega por las diferentes rutas usando la URL
          </li>
          <li>
            Verifica que solo puedas acceder a las rutas permitidas para tu rol
          </li>
          <li>
            Prueba rutas como: /admin, /teacher, /student, /parent, /moderator
          </li>
          <li>
            Las rutas no permitidas te redirigirán automáticamente a /login
          </li>
        </ol>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Rutas esperadas por rol:</h4>
          <ul className="text-xs space-y-1">
            <li>
              <strong>Admin:</strong> Todas las rutas
            </li>
            <li>
              <strong>Teacher:</strong> /dashboard, /teacher, /profile, /courses
            </li>
            <li>
              <strong>Student:</strong> /dashboard, /student, /profile, /courses
            </li>
            <li>
              <strong>Parent:</strong> /dashboard, /parent, /profile
            </li>
            <li>
              <strong>Moderator:</strong> /dashboard, /moderator, /profile
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg mt-6">
        <h3 className="font-semibold mb-2">Utilidades de Testing</h3>
        <div className="space-x-2">
          <button
            onClick={() => {
              clearRouteCache();
              refreshUserPermissions();
            }}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
          >
            Limpiar Cache
          </button>
          <button
            onClick={() => refreshUserPermissions()}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Refrescar Permisos
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleTestingPage;
