import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SuperAdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

function SuperAdminDashboard() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newUser, setNewUser] = useState({
    usuario: '',
    password: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: 'Estudiante',
    tipo_usuario: 'regular',
  });
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchSystemInfo = async () => {
    try {
      const response = await window.fetch(`${API_URL}/superadmin/system-info`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener información del sistema');
      }

      const result = await response.json();

      // La API devuelve datos en result.data
      if (result.success && result.data) {
        const { systemInfo, userStats } = result.data;

        // Procesar estadísticas de usuarios
        const totalUsers = userStats.reduce((sum, stat) => sum + stat.total, 0);
        const activeUsers = userStats.reduce(
          (sum, stat) => sum + stat.activos,
          0
        );
        const inactiveUsers = userStats.reduce(
          (sum, stat) => sum + stat.inactivos,
          0
        );
        const superAdmins =
          userStats.find(stat => stat.tipo_usuario === 'superadmin')?.total ||
          0;

        setSystemInfo({
          totalUsers,
          activeUsers,
          inactiveUsers,
          superAdmins,
          server: {
            status: 'Activo',
            uptime: `${Math.floor(systemInfo.serverUptime / 60)} minutos`,
            memory: `Node.js ${systemInfo.nodeVersion}`,
          },
          database: {
            type: 'SQLite',
            path: systemInfo.databasePath,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching system info:', error);
      setError('Error al cargar información del sistema');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await window.fetch(`${API_URL}/superadmin/users`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const data = await response.json();
      // La API devuelve usuarios en data.users.users
      setUsers(data.users?.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al cargar usuarios');
    }
  };

  const createUser = async e => {
    e.preventDefault();
    try {
      const response = await window.fetch(`${API_URL}/superadmin/create-user`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Error al crear usuario');
      }

      window.alert('Usuario creado exitosamente');
      setNewUser({
        usuario: '',
        password: '',
        nombre: '',
        apellido: '',
        email: '',
        rol: 'Estudiante',
        tipo_usuario: 'regular',
      });
      fetchUsers(); // Recargar lista de usuarios
    } catch (error) {
      console.error('Error creating user:', error);
      window.alert(`Error al crear usuario: ${error.message}`);
    }
  };

  const toggleUserStatus = async userId => {
    try {
      const response = await window.fetch(
        `${API_URL}/superadmin/toggle-user-status/${userId}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Error al cambiar estado del usuario');
      }

      fetchUsers(); // Recargar lista de usuarios
    } catch (error) {
      console.error('Error toggling user status:', error);
      window.alert('Error al cambiar estado del usuario');
    }
  };

  const deleteUser = async userId => {
    if (
      !window.confirm('¿Estás seguro de que quieres eliminar este usuario?')
    ) {
      return;
    }

    try {
      const response = await window.fetch(
        `${API_URL}/superadmin/delete-user/${userId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }

      fetchUsers(); // Recargar lista de usuarios
    } catch (error) {
      console.error('Error deleting user:', error);
      window.alert('Error al eliminar usuario');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      navigate('/');
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.tipo_usuario !== 'superadmin') {
        navigate('/dashboard');
        return;
      }
    } catch {
      navigate('/');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSystemInfo(), fetchUsers()]);
      setLoading(false);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  if (loading) {
    return (
      <div className="superadmin-dashboard">
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Cargando panel de Super Administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="superadmin-dashboard">
      <header className="superadmin-header">
        <div className="header-content">
          <h1>🔧 Panel de Super Administrador</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <nav className="superadmin-nav">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 Usuarios
        </button>
        <button
          className={activeTab === 'create-user' ? 'active' : ''}
          onClick={() => setActiveTab('create-user')}
        >
          ➕ Crear Usuario
        </button>
      </nav>

      <main className="superadmin-content">
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {activeTab === 'dashboard' && systemInfo && (
          <div className="dashboard-tab">
            <h2>Información del Sistema</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>👥 Total Usuarios</h3>
                <p className="stat-number">{systemInfo.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>✅ Usuarios Activos</h3>
                <p className="stat-number">{systemInfo.activeUsers}</p>
              </div>
              <div className="stat-card">
                <h3>❌ Usuarios Inactivos</h3>
                <p className="stat-number">{systemInfo.inactiveUsers}</p>
              </div>
              <div className="stat-card">
                <h3>🔧 Super Admins</h3>
                <p className="stat-number">{systemInfo.superAdmins}</p>
              </div>
            </div>

            <div className="system-info">
              <h3>Detalles del Sistema</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Servidor:</strong> {systemInfo.server.status}
                </div>
                <div className="info-item">
                  <strong>Base de Datos:</strong> {systemInfo.database.type}
                </div>
                <div className="info-item">
                  <strong>Tiempo Activo:</strong> {systemInfo.server.uptime}
                </div>
                <div className="info-item">
                  <strong>Memoria:</strong> {systemInfo.server.memory}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <h2>Gestión de Usuarios</h2>
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Nombre Completo</th>
                    <th>Tipo Usuario</th>
                    <th>Estado</th>
                    <th>Fecha Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.nombre_completo}</td>
                      <td>
                        <span className={`user-type ${user.tipo_usuario}`}>
                          {user.tipo_usuario}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status ${
                            user.activo === 1 ? 'active' : 'inactive'
                          }`}
                        >
                          {user.activo === 1 ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        {new Date(user.fecha_creacion).toLocaleDateString()}
                      </td>
                      <td className="actions">
                        <button
                          className="toggle-btn"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.activo === 1 ? '🔒' : '🔓'}
                        </button>
                        {user.tipo_usuario !== 'superadmin' && (
                          <button
                            className="delete-btn"
                            onClick={() => deleteUser(user.id)}
                          >
                            🗑️
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'create-user' && (
          <div className="create-user-tab">
            <h2>Crear Nuevo Usuario</h2>
            <form className="create-user-form" onSubmit={createUser}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Usuario:</label>
                  <input
                    type="text"
                    value={newUser.usuario}
                    onChange={e =>
                      setNewUser({ ...newUser, usuario: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contraseña:</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={e =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    value={newUser.nombre}
                    onChange={e =>
                      setNewUser({ ...newUser, nombre: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Apellido:</label>
                  <input
                    type="text"
                    value={newUser.apellido}
                    onChange={e =>
                      setNewUser({ ...newUser, apellido: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={e =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rol:</label>
                  <select
                    value={newUser.rol}
                    onChange={e =>
                      setNewUser({ ...newUser, rol: e.target.value })
                    }
                  >
                    <option value="Estudiante">Estudiante</option>
                    <option value="Docente">Docente</option>
                    <option value="Acudiente">Acudiente</option>
                    <option value="Moderador">Moderador</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo de Usuario:</label>
                  <select
                    value={newUser.tipo_usuario}
                    onChange={e =>
                      setNewUser({ ...newUser, tipo_usuario: e.target.value })
                    }
                  >
                    <option value="regular">Regular</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="create-btn">
                Crear Usuario
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default SuperAdminDashboard;
