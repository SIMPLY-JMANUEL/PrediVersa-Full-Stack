import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo-prediversa.png';
import '../../styles/main.css'; // Sistema CSS unificado
import SettingsPanel from '../../components/SettingsPanel.jsx';
import AlertarForm from './components/AlertarForm';
import ReportesForm from './components/ReportesForm';
import RemisionForm from './components/RemisionForm';
import SeguimientoForm from './components/SeguimientoForm';
import PqrAdminForm from './components/PqrAdminForm';
import PqrSeguimientoForm from './components/PqrSeguimientoForm';
import SoporteForm from './components/SoporteForm';
import UserManagement from './components/UserManagement';

const mainTabs = [
  { label: 'Crear usuario', key: 'crearusuario' },
  { label: 'Alerta', key: 'alertar' },
  { label: 'Reportes', key: 'reportes' },
  { label: 'Remisión de Atención', key: 'remision' },
  { label: 'Seguimiento', key: 'seguimiento' },
  { label: 'Administrador de PQR', key: 'pqradmin' },
  { label: 'Seguimiento PQR', key: 'pqrseguimiento' },
  { label: 'Comunicación y Soporte', key: 'soporte' },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('crearusuario');
  const [showSettings, setShowSettings] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [showUserCreationFlow, setShowUserCreationFlow] = useState(false);

  // Estados del perfil del administrador
  const [adminProfileState, setAdminProfileState] = useState({
    name: 'Admin',
    lastName: 'PrediVersa',
    role: 'Administrador',
    email: 'admin@prediversa.edu.co',
    phone: '+57 300 123 4567',
    address: 'Sede Principal PrediVersa',
    documentType: 'CC',
    documentNumber: '12345678',
    photo: null,
    theme: 'light',
    language: 'es',
  });

  const [profilePhoto, setProfilePhoto] = useState(null);

  const [userCreationData, setUserCreationData] = useState({
    status: '',
    role: '',
    autoEmail: '',
    autoPassword: '',
    autoUsername: '',
    confirmed: false,
  });

  const [userForm, setUserForm] = useState({
    nombreCompleto: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    edad: '',
    sexoGenero: '',
    estadoCivil: '',
    correoElectronico: '',
    telefonoUsuario: '',
    direccionResidencia: '',
    epsSeguroMedico: '',
    antecedentesMedicos: '',
    condicionEspecial: '',
    gradoCargo: '',
    institucionEmpresa: '',
    usuarioActivo: 'activo',
    rol: '',
    nombreFamiliarContacto: '',
    telefonoFamiliarContacto: '',
    password: '',
    foto: '',
    encontrado: false,
  });

  // Handlers
  const handleLogout = () => {
    navigate('/login');
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const handleSettingsSave = newSettings => {
    setAdminProfileState(prev => ({ ...prev, ...newSettings }));
    setShowSettings(false);
  };

  const handleUserSearch = e => {
    e.preventDefault();
    if (userSearch.trim()) {
      // Simular búsqueda de usuario
      setUserForm(prev => ({
        ...prev,
        encontrado: true,
        nombreCompleto: 'Usuario de Prueba',
        numeroDocumento: userSearch,
        tipoDocumento: 'CC',
        fechaNacimiento: '1990-01-01',
        correoElectronico: 'usuario@ejemplo.com',
      }));
    }
  };

  const handleClearUser = () => {
    setUserForm({
      nombreCompleto: '',
      tipoDocumento: '',
      numeroDocumento: '',
      fechaNacimiento: '',
      edad: '',
      sexoGenero: '',
      estadoCivil: '',
      correoElectronico: '',
      telefonoUsuario: '',
      direccionResidencia: '',
      epsSeguroMedico: '',
      antecedentesMedicos: '',
      condicionEspecial: '',
      gradoCargo: '',
      institucionEmpresa: '',
      usuarioActivo: 'activo',
      rol: '',
      nombreFamiliarContacto: '',
      telefonoFamiliarContacto: '',
      password: '',
      foto: '',
      encontrado: false,
    });
    setUserSearch('');
    setShowUserCreationFlow(false);
    setUserCreationData({
      status: '',
      role: '',
      autoEmail: '',
      autoPassword: '',
      autoUsername: '',
      confirmed: false,
    });
  };

  const handleUserFormChange = e => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleUserFormSubmit = e => {
    e.preventDefault();
    window.alert('Usuario guardado/actualizado');
  };

  const handleProfilePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new window.FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        setAdminProfileState(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Funciones para generar datos automáticos
  const generateAutoUsername = (nombre, documento) => {
    const cleanName = nombre.toLowerCase().replace(/\s+/g, '');
    const lastDigits = documento.slice(-4);
    return `${cleanName.slice(0, 8)}${lastDigits}`;
  };

  const generateAutoEmail = (nombre, apellido = '') => {
    const cleanName = nombre.toLowerCase().replace(/\s+/g, '');
    const cleanLastName = apellido.toLowerCase().replace(/\s+/g, '');
    const domain = '@prediversa.edu.co';
    return `${cleanName}${
      cleanLastName ? `.${cleanLastName.slice(0, 6)}` : ''
    }${domain}`;
  };

  const generateAutoPassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleConfirmUserData = () => {
    const nombres = userForm.nombreCompleto.split(' ');
    const nombre = nombres[0] || '';
    const apellido = nombres[1] || '';

    const autoData = {
      status: '',
      role: '',
      autoEmail: generateAutoEmail(nombre, apellido),
      autoPassword: generateAutoPassword(),
      autoUsername: generateAutoUsername(nombre, userForm.numeroDocumento),
      confirmed: false,
    };

    setUserCreationData(autoData);
    setShowUserCreationFlow(true);
  };

  const handleCreateUser = () => {
    setUserCreationData(prev => ({ ...prev, confirmed: true }));
    window.setTimeout(() => {
      window.alert(
        `¡Usuario ${userForm.nombreCompleto} creado exitosamente!\n\nUsuario: ${userCreationData.autoUsername}\nCorreo: ${userCreationData.autoEmail}\nContraseña: ${userCreationData.autoPassword}`
      );
      handleClearUser();
    }, 1000);
  };

  // Estilos unificados para compatibilidad
  const unifiedStyles = {
    fieldset: {
      border: '1px solid var(--color-border-subtle)',
      borderRadius: 'var(--border-radius-lg)',
      padding: 'var(--spacing-lg)',
      background: 'var(--color-surface)',
      marginBottom: 'var(--spacing-md)',
    },
    legend: {
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-primary)',
      fontSize: 'var(--font-size-lg)',
    },
    label: {
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--color-text-primary)',
      display: 'block',
      marginBottom: 'var(--spacing-xs)',
    },
    input: {
      padding: 'var(--spacing-sm) var(--spacing-md)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-text-primary)',
    },
  };

  const fieldsetStyle = unifiedStyles.fieldset;
  const legendStyle = unifiedStyles.legend;

  return (
    <div className="dashboard-container dashboard-admin">
      <div className="dashboard-grid">
        {/* Sidebar */}
        <aside className="dashboard-sidebar" role="complementary">
          <div className="dashboard-nav-title">
            <img src={logo} alt="PrediVersa Logo" className="icon-lg" />
            Panel del Administrador
          </div>

          {/* Profile Section */}
          <div className="dashboard-card">
            <div
              className="profile-photo-container"
              style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}
            >
              <label
                htmlFor="profile-photo-upload"
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Perfil"
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '3px solid var(--color-primary)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'var(--color-primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid var(--color-primary)',
                    }}
                  >
                    <i
                      className="icon-user icon-xl"
                      style={{ color: 'var(--color-primary)' }}
                    />
                  </div>
                )}
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProfilePhotoChange}
                />
              </label>
            </div>

            <div className="dashboard-card-title">
              {adminProfileState.name} {adminProfileState.lastName}
            </div>
            <div className="dashboard-card-description">
              {adminProfileState.role}
            </div>

            <div
              style={{
                marginTop: 'var(--spacing-md)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              <div>
                <strong>Email:</strong> {adminProfileState.email}
              </div>
              <div>
                <strong>Teléfono:</strong> {adminProfileState.phone}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav role="navigation">
            <ul className="dashboard-nav-list">
              {mainTabs.map(tab => (
                <li key={tab.key} className="dashboard-nav-item">
                  <button
                    className={`dashboard-nav-link ${
                      activeTab === tab.key ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                    aria-current={activeTab === tab.key ? 'page' : undefined}
                    type="button"
                  >
                    <i className="icon-chevron-right" />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* System Status */}
          <div className="dashboard-card">
            <div className="dashboard-card-icon">
              <i className="icon-shield" />
            </div>
            <h3 className="dashboard-card-title">Estado del Sistema</h3>
            <div className="dashboard-status-indicator status-online">
              <i className="icon-check" />
              Sistema Operativo
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: 'var(--spacing-lg)' }}>
            <button
              className="btn-secondary btn-full-width"
              onClick={openSettings}
              style={{ marginBottom: 'var(--spacing-sm)' }}
            >
              <i className="icon-settings" />
              Configuración
            </button>
            <button
              className="btn-outline btn-full-width"
              onClick={handleLogout}
            >
              <i className="icon-logout" />
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main" role="main">
          <div className="dashboard-header">
            <h1 className="dashboard-header-title">Panel de Administración</h1>
            <p className="dashboard-header-subtitle">
              Gestiona usuarios, reportes y configuraciones del sistema
            </p>
          </div>

          <div className="dashboard-content">
            {/* User Search Section - Solo visible en pestaña crear usuario */}
            {activeTab === 'crearusuario' && (
              <section className="dashboard-form-section animate-fade-in">
                <h2 className="dashboard-form-title">
                  <i className="icon-search" />
                  Búsqueda de Usuario
                </h2>

                <form onSubmit={handleUserSearch} className="form-group">
                  <div className="input-group">
                    <input
                      type="text"
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      placeholder="Número de documento del usuario"
                      className="input-field"
                    />
                    <button type="submit" className="btn-primary">
                      <i className="icon-search" />
                      Buscar
                    </button>
                    {userForm.encontrado && (
                      <button
                        type="button"
                        onClick={handleClearUser}
                        className="btn-secondary"
                      >
                        <i className="icon-close" />
                        Limpiar
                      </button>
                    )}
                  </div>
                </form>

                {/* User Found Info */}
                {userForm.encontrado && (
                  <div className="dashboard-card animate-slide-in">
                    <div className="dashboard-card-icon">
                      <i className="icon-user-check" />
                    </div>
                    <h3 className="dashboard-card-title">
                      {userForm.nombreCompleto}
                    </h3>
                    <div className="dashboard-card-description">
                      <strong>Documento:</strong> {userForm.numeroDocumento} •
                      <strong>Tipo:</strong> {userForm.tipoDocumento}
                    </div>

                    {!showUserCreationFlow && (
                      <button
                        type="button"
                        onClick={handleConfirmUserData}
                        className="btn-primary btn-full-width animate-bounce-in"
                        style={{ marginTop: 'var(--spacing-md)' }}
                      >
                        <i className="icon-user-plus" />
                        Confirmar Datos y Crear Usuario
                      </button>
                    )}
                  </div>
                )}

                {/* User Creation Flow */}
                {userForm.encontrado && showUserCreationFlow && (
                  <div className="dashboard-form-section animate-fade-in">
                    <h3 className="dashboard-form-title">
                      <i className="icon-settings" />
                      Configuración de Usuario
                    </h3>

                    {!userCreationData.confirmed ? (
                      <>
                        <div className="form-grid">
                          <div className="form-group">
                            <label className="form-label">
                              Estado del Usuario:
                            </label>
                            <select
                              className="input-select"
                              value={userCreationData.status || ''}
                              onChange={e =>
                                setUserCreationData(prev => ({
                                  ...prev,
                                  status: e.target.value,
                                }))
                              }
                            >
                              <option value="" disabled>
                                Seleccionar
                              </option>
                              <option value="activo">Activo</option>
                              <option value="inactivo">Inactivo</option>
                              <option value="pendiente">
                                Pendiente de Activación
                              </option>
                              <option value="suspendido">Suspendido</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label">
                              Rol del Usuario:
                            </label>
                            <select
                              className="input-select"
                              value={userCreationData.role || ''}
                              onChange={e =>
                                setUserCreationData(prev => ({
                                  ...prev,
                                  role: e.target.value,
                                }))
                              }
                            >
                              <option value="" disabled>
                                Seleccionar
                              </option>
                              <option value="estudiante">Estudiante</option>
                              <option value="padre">
                                Padre/Madre/Acudiente
                              </option>
                              <option value="profesor">Profesor</option>
                              <option value="moderador">Moderador</option>
                              <option value="administrador">
                                Administrador
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="dashboard-card">
                          <h4 className="dashboard-card-title">
                            <i className="icon-magic" />
                            Datos Generados Automáticamente
                          </h4>
                          <div className="form-grid">
                            <div className="form-group">
                              <label className="form-label">Usuario:</label>
                              <div className="input-readonly">
                                {userCreationData.autoUsername}
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Email:</label>
                              <div className="input-readonly">
                                {userCreationData.autoEmail}
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Contraseña:</label>
                              <div
                                className="input-readonly"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 'var(--spacing-sm)',
                                }}
                              >
                                {userCreationData.autoPassword}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setUserCreationData(prev => ({
                                      ...prev,
                                      autoPassword: generateAutoPassword(),
                                    }))
                                  }
                                  className="btn-icon btn-ghost"
                                  title="Generar nueva contraseña"
                                >
                                  <i className="icon-refresh" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="form-actions">
                          <button
                            type="button"
                            onClick={() => setShowUserCreationFlow(false)}
                            className="btn-secondary"
                          >
                            <i className="icon-arrow-left" />
                            Volver a Datos
                          </button>
                          <button
                            type="button"
                            onClick={handleCreateUser}
                            className="btn-success"
                          >
                            <i className="icon-user-plus" />
                            Crear Usuario
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="dashboard-card text-center animate-bounce-in">
                        <div className="dashboard-card-icon success">
                          <i className="icon-check-circle" />
                        </div>
                        <h3 className="dashboard-card-title">
                          ¡Usuario Creado Exitosamente!
                        </h3>
                        <p className="dashboard-card-description">
                          El usuario <strong>{userForm.nombreCompleto}</strong>{' '}
                          ha sido creado con éxito.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* Tab Content */}
            <section className="dashboard-form-section">
              {activeTab === 'crearusuario' && (
                <div>
                  <h2 className="dashboard-form-title">
                    <i className="icon-user-plus" />
                    Registro de Usuario
                  </h2>
                  <UserManagement
                    userSearch={userSearch}
                    setUserSearch={setUserSearch}
                    userForm={userForm}
                    handleUserFormChange={handleUserFormChange}
                    handleUserFormSubmit={handleUserFormSubmit}
                    handleUserSearch={handleUserSearch}
                    handleClearUser={handleClearUser}
                    unifiedStyles={unifiedStyles}
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    alwaysShowForm
                  />
                </div>
              )}

              {activeTab === 'alertar' && (
                <div>
                  <h2 className="dashboard-form-title">
                    <i className="icon-alert" />
                    Gestión de Alerta
                  </h2>
                  <AlertarForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </div>
              )}

              {activeTab === 'reportes' && (
                <div>
                  <h2 className="dashboard-form-title">
                    <i className="icon-chart-line" />
                    Generación de Reportes
                  </h2>
                  <ReportesForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </div>
              )}

              {activeTab === 'remision' && (
                <div>
                  <h2 className="dashboard-form-title">
                    <i className="icon-medical" />
                    Remisión de Atención
                  </h2>
                  <RemisionForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </div>
              )}

              {activeTab === 'seguimiento' && (
                <div>
                  <h2 className="dashboard-form-title">
                    <i className="icon-tasks" />
                    Panel de Seguimiento
                  </h2>
                  <SeguimientoForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </div>
              )}

              {activeTab === 'pqradmin' && (
                <div>
                  <h2 className="dashboard-form-title">
                    <i className="icon-clipboard" />
                    Administrador de PQR
                  </h2>
                  <PqrAdminForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </div>
              )}

              {activeTab === 'pqrseguimiento' && (
                <div>
                  <h2 className="dashboard-form-title">
                    <i className="icon-search" />
                    Seguimiento PQR
                  </h2>
                  <PqrSeguimientoForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </div>
              )}

              {activeTab === 'soporte' && (
                <div>
                  <h2 className="dashboard-form-title">
                    <i className="icon-support" />
                    Comunicación y Soporte
                  </h2>
                  <SoporteForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="overlay-container">
          <div
            className="overlay-backdrop"
            onClick={() => setShowSettings(false)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Escape' || e.key === 'Enter') {
                setShowSettings(false);
              }
            }}
            aria-label="Cerrar configuración"
          />
          <SettingsPanel
            onClose={() => setShowSettings(false)}
            onSave={handleSettingsSave}
            initialProfile={{
              photo: adminProfileState.photo,
              phone: adminProfileState.phone,
              address: adminProfileState.address,
              theme: adminProfileState.theme || 'light',
              language: adminProfileState.language || 'es',
              name: adminProfileState.name,
              lastName: adminProfileState.lastName,
              role: adminProfileState.role,
              documentType: adminProfileState.documentType,
              documentNumber: adminProfileState.documentNumber,
              email: adminProfileState.email,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
