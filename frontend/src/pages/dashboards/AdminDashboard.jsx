import React, { useState } from 'react';
import SystemStatus from './components/SystemStatus';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo-prediversa.png';
import './HeaderDashboard.css';
import './components/AdminDashboard.css';
import SettingsPanel from '../../components/SettingsPanel.jsx';
import AlertarForm from './components/AlertarForm';
import ReportesForm from './components/ReportesForm';
import RemisionForm from './components/RemisionForm';
import SeguimientoForm from './components/SeguimientoForm';
import PqrAdminForm from './components/PqrAdminForm';
import PqrSeguimientoForm from './components/PqrSeguimientoForm';
import SoporteForm from './components/SoporteForm';
import UserManagement from './components/UserManagement';
import useProfile from '../../hooks/useProfile';

// NUEVO ORDEN DE TABS: Crear usuario, Alerta, Reportes, Remisión de Atención, Seguimiento, Administrador de PQR, Seguimiento PQR, Comunicación y Soporte
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
  const { error } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('crearusuario');
  const [showSettings, setShowSettings] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [showUserCreationFlow, setShowUserCreationFlow] = useState(false);
  const [userCreationData, setUserCreationData] = useState({
    status: '', // Vacío para mostrar "Seleccionar"
    role: '', // Vacío para mostrar "Seleccionar"
    autoEmail: '',
    autoPassword: '',
    autoUsername: '',
    confirmed: false,
  });
  const [userForm, setUserForm] = useState({
    // Datos básicos del usuario
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

  // Datos del usuario dinámicos desde localStorage
  const userData = {
    name: localStorage.getItem('nombre') || 'Administrador',
    lastName: '',
    role: 'Administrador',
    documentType: 'DNI',
    documentNumber: '12345678',
    email: 'admin@prediversa.com',
    phone: '321654987',
    address: 'Calle 123, Ciudad',
    photo: '',
  };

  // Estado centralizado del perfil admin
  const [adminProfileState, setAdminProfileState] = useState(userData);
  // Estado para la foto de perfil del admin
  const [profilePhoto, setProfilePhoto] = useState(userData.photo);

  // Redirección automática si no hay token
  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  // Redirección automática si hay error de autenticación
  React.useEffect(() => {
    if (error) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [error, navigate]);

  // --- Handlers ---
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const openSettings = e => {
    e.preventDefault();
    setShowSettings(true);
  };

  // Handler para guardar cambios desde SettingsPanel
  const handleSettingsSave = newProfile => {
    setAdminProfileState(prev => ({ ...prev, ...newProfile }));
    if (newProfile.photo) {
      setProfilePhoto(newProfile.photo);
    }
  };

  const handleUserSearch = e => {
    e.preventDefault();
    setUserForm({
      // Datos básicos del usuario - datos de ejemplo
      nombreCompleto: 'María Elena Rodríguez García',
      tipoDocumento: 'Cédula de Ciudadanía',
      numeroDocumento: userSearch,
      fechaNacimiento: '2010-05-15',
      edad: '14',
      sexoGenero: 'Femenino',
      estadoCivil: 'Soltero(a)',
      correoElectronico: 'maria.rodriguez@correo.com',
      telefonoUsuario: '3001234567',
      direccionResidencia: 'Calle 45 #23-67, Barrio Centro, Bogotá',
      epsSeguroMedico: 'Compensar EPS',
      antecedentesMedicos: 'Asma leve controlada',
      condicionEspecial: 'Ninguna',
      gradoCargo: '9° Grado',
      institucionEmpresa: 'Colegio San José',
      usuarioActivo: 'activo',
      rol: 'estudiante',
      nombreFamiliarContacto: 'Carlos Rodríguez (Padre)',
      telefonoFamiliarContacto: '3009876543',
      password: '',
      foto: 'https://randomuser.me/api/portraits/women/25.jpg',
      encontrado: true,
    });
  };

  const handleClearUser = () => {
    setUserForm({
      // Datos básicos del usuario - limpiar todos los campos
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
    alert('Usuario guardado/actualizado');
  };

  // Handler para cambiar la foto de perfil
  const handleProfilePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
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

  // Handler para confirmar datos del usuario y mostrar opciones de creación
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

  // Handler para crear el usuario final
  const handleCreateUser = () => {
    setUserCreationData(prev => ({ ...prev, confirmed: true }));
    // Aquí iría la lógica para enviar los datos al backend
    setTimeout(() => {
      alert(
        `¡Usuario ${userForm.nombreCompleto} creado exitosamente!\n\nUsuario: ${userCreationData.autoUsername}\nCorreo: ${userCreationData.autoEmail}\nContraseña: ${userCreationData.autoPassword}`
      );
      handleClearUser();
      setShowUserCreationFlow(false);
      setUserCreationData({
        status: '',
        role: '',
        autoEmail: '',
        autoPassword: '',
        autoUsername: '',
        confirmed: false,
      });
    }, 1000);
  };

  // --- Renderizado modular de pestañas ---
  // TIPOGRAFÍA UNIFICADA: Estilos consistentes para todos los formularios
  const unifiedTypography = {
    // Fuente base del sistema
    fontFamily:
      "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",

    // Tamaños de fuente estandarizados
    fontSize: {
      small: '0.875rem', // 14px
      normal: '1rem', // 16px - tamaño base estándar
      medium: '1.125rem', // 18px
      large: '1.25rem', // 20px
      xlarge: '1.5rem', // 24px
    },

    // Pesos de fuente
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    // Altura de línea
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
    },
  };

  // ESTILOS CENTRALIZADOS: Para todos los elementos de formulario
  const unifiedStyles = {
    // Estilo para fieldsets
    fieldset: {
      border: '1px solid #e0e0e0',
      borderRadius: 10,
      padding: 16,
      background: '#fafdff',
      marginBottom: 0,
      fontFamily: unifiedTypography.fontFamily,
    },

    // Estilo para legends
    legend: {
      fontWeight: unifiedTypography.fontWeight.semibold,
      color: '#1976d2',
      fontSize: unifiedTypography.fontSize.normal,
      fontFamily: unifiedTypography.fontFamily,
      lineHeight: unifiedTypography.lineHeight.normal,
    },

    // Estilo para labels
    label: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.normal,
      fontWeight: unifiedTypography.fontWeight.medium,
      color: '#333333',
      lineHeight: unifiedTypography.lineHeight.normal,
      display: 'block',
      marginBottom: '4px',
    },

    // Estilo para inputs, selects y textareas
    input: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.normal,
      fontWeight: unifiedTypography.fontWeight.normal,
      lineHeight: unifiedTypography.lineHeight.normal,
      color: '#333333',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: 4,
      backgroundColor: '#ffffff',
      boxSizing: 'border-box',
    },

    // Estilo para texto descriptivo
    description: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.small,
      fontWeight: unifiedTypography.fontWeight.normal,
      color: '#666666',
      lineHeight: unifiedTypography.lineHeight.normal,
      marginTop: '4px',
    },

    // Estilo para botones
    button: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.normal,
      fontWeight: unifiedTypography.fontWeight.medium,
      lineHeight: unifiedTypography.lineHeight.normal,
    },

    // Estilo para títulos de sección
    sectionTitle: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.large,
      fontWeight: unifiedTypography.fontWeight.bold,
      color: '#1976d2',
      lineHeight: unifiedTypography.lineHeight.tight,
      margin: 0,
    },

    // Estilo para subtítulos
    subtitle: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.medium,
      fontWeight: unifiedTypography.fontWeight.medium,
      color: '#4a4a4a',
      lineHeight: unifiedTypography.lineHeight.normal,
      margin: 0,
    },
  };

  // COMPATIBILIDAD: Mantenemos los estilos originales pero con tipografía unificada
  const fieldsetStyle = unifiedStyles.fieldset;
  const legendStyle = unifiedStyles.legend;

  return (
    <div
      className="student-dashboard-html"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#f6f8fa',
        fontFamily:
          "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        paddingTop: '80px',
      }}
    >
      {/* Header fijo */}
      <header className="header-main-html" role="banner">
        <div className="header-logo-title-html">
          <img
            src={logo}
            alt="PrediVersa Logo"
            className="header-logo-img-html"
          />
          <span className="header-title-html">Panel del Administrador</span>
        </div>
        <div className="header-user-actions-html">
          <span className="header-user-name-html">
            <i
              className="fas fa-user-circle"
              style={{ marginRight: 8, color: '#1976d2' }}
            />
            {adminProfileState.name} {adminProfileState.lastName}
          </span>
          <button
            className="header-btn-html"
            onClick={openSettings}
            title="Configuración"
            aria-label="Configuración"
          >
            <i className="fas fa-cog" />
          </button>
          <button
            className="header-btn-html"
            onClick={handleLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <i className="fas fa-sign-out-alt" />
          </button>
        </div>
      </header>

      <div className="student-dashboard-html">
        <main
          className="main-html"
          style={{
            display: 'flex',
            alignItems: 'stretch',
            height: 'calc(100vh - 80px)',
            flex: 1,
            gap: '24px',
            padding: 0,
            width: '100%',
            margin: 0,
            boxSizing: 'border-box',
          }}
        >
          {/* Panel izquierdo */}
          <aside
            className="dashboard-sidebar"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              minWidth: '320px',
              maxWidth: '350px',
              background: '#fff',
              borderRight: '1px solid #b3c6d6',
              overflowY: 'auto',
              boxShadow: '2px 0 8px rgba(25, 118, 210, 0.1)',
            }}
          >
            {/* Contenedor de imagen de perfil con lógica de cambio */}
            <section
              className="profile-image-container"
              style={{
                height: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <label
                htmlFor="profile-photo-upload"
                style={{
                  cursor: 'pointer',
                  width: 120,
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Perfil"
                    className="settings-profile-img"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '2px solid #1976d2',
                    }}
                  />
                ) : (
                  <div
                    className="profile-image-placeholder"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: '#e3eafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 64,
                      color: '#b0b8d1',
                      border: '2px solid #1976d2',
                    }}
                  >
                    <i className="fas fa-user-circle" />
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: '#fff',
                    borderRadius: '50%',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                    padding: 6,
                  }}
                >
                  <i
                    className="fas fa-camera"
                    style={{ color: '#1976d2', fontSize: 20 }}
                  />
                </div>
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProfilePhotoChange}
                />
              </label>
              <div
                style={{
                  marginTop: 8,
                  fontWeight: 500,
                  color: '#1976d2',
                  fontSize: 15,
                }}
              >
                Fotografía de perfil
              </div>
            </section>
            <section className="user-info-container">
              <div className="info-row">
                <span>
                  <strong>Nombre:</strong> {adminProfileState.name}{' '}
                  {adminProfileState.lastName}
                </span>
              </div>
              <div className="info-row">
                <span>
                  <strong>Cargo:</strong> {adminProfileState.role}
                </span>
              </div>
              <div className="info-row">
                <span>
                  <strong>Tipo documento:</strong>{' '}
                  {adminProfileState.documentType}
                </span>
              </div>
              <div className="info-row">
                <span>
                  <strong>Número documento:</strong>{' '}
                  {adminProfileState.documentNumber}
                </span>
              </div>
              <div className="info-row">
                <span>
                  <strong>Correo:</strong> {adminProfileState.email}
                </span>
              </div>
              <div className="info-row">
                <span>
                  <strong>Teléfono:</strong> {adminProfileState.phone}
                </span>
              </div>
              <div className="info-row">
                <span>
                  <strong>Dirección:</strong> {adminProfileState.address}
                </span>
              </div>
            </section>
            <section className="system-status-container">
              <SystemStatus />
            </section>
            <section className="stats-container">
              <h3>
                <i className="fas fa-chart-bar" /> Estadísticas
              </h3>
              <div className="stat-row">
                <i className="fas fa-users" />
                <span>
                  <strong>Total Usuarios:</strong> 1,247
                </span>
              </div>
              <div className="stat-row">
                <i className="fas fa-user-graduate" />
                <span>
                  <strong>Estudiantes:</strong> 856
                </span>
              </div>
              <div className="stat-row">
                <i className="fas fa-user-friends" />
                <span>
                  <strong>Padres:</strong> 324
                </span>
              </div>
              <div className="stat-row">
                <i className="fas fa-chalkboard-teacher" />
                <span>
                  <strong>Profesores:</strong> 42
                </span>
              </div>
              <div className="stat-row">
                <i className="fas fa-user-shield" />
                <span>
                  <strong>Moderadores:</strong> 8
                </span>
              </div>
              <div className="stat-row">
                <i className="fas fa-clipboard-list" />
                <span>
                  <strong>Evaluaciones:</strong> 2,341
                </span>
              </div>
              <div className="stat-row">
                <i className="fas fa-exclamation-triangle" />
                <span>
                  <strong>Alertas:</strong> 12
                </span>
              </div>
            </section>
          </aside>

          {/* Panel derecho */}
          <section
            className="right-panel-html"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              padding: '18px 24px',
              background: '#fff',
              overflowY: 'auto',
              gap: '18px',
            }}
            aria-label="Panel principal"
          >
            {/* Sección de Búsqueda de Usuario */}
            <section
              className="user-search-section"
              style={{
                background:
                  'linear-gradient(135deg, #fafdff 80%, #e8f5e8 100%)',
                border: '1.5px solid #d0d7e6',
                borderRadius: 18,
                padding: '24px 28px 20px 28px',
                marginBottom: 24,
                boxShadow: '0 4px 24px 0 rgba(76, 175, 80, 0.08)',
                width: '100%',
                position: 'relative',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    background: '#4caf50',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                    boxShadow: '0 2px 8px 0 rgba(76, 175, 80, 0.15)',
                  }}
                >
                  <i className="fas fa-search" style={{ fontSize: 20 }} />
                </div>
                <div>
                  <h2
                    style={{
                      color: '#4caf50',
                      fontWeight: 800,
                      fontSize: '1.25em',
                      margin: 0,
                      letterSpacing: 0.3,
                    }}
                  >
                    Búsqueda de Usuario
                  </h2>
                  <div
                    style={{
                      color: '#4a4a4a',
                      fontSize: '1em',
                      marginTop: 2,
                      fontWeight: 400,
                    }}
                  >
                    Busca cualquier usuario del sistema por número de documento
                  </div>
                </div>
              </div>
              <div
                style={{
                  height: 1,
                  background: '#c8e6c9',
                  margin: '14px 0 20px 0',
                  borderRadius: 2,
                }}
              />

              {/* Formulario de búsqueda */}
              <form
                onSubmit={handleUserSearch}
                style={{ display: 'flex', gap: 12, marginBottom: 20 }}
              >
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Número de documento del usuario"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1.5px solid #c8e6c9',
                    borderRadius: 12,
                    fontSize: '1em',
                    outline: 'none',
                    transition: 'border 0.2s, box-shadow 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#4caf50';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(76, 175, 80, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#c8e6c9';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background:
                      'linear-gradient(90deg, #4caf50 60%, #66bb6a 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '12px 24px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'transform 0.1s, box-shadow 0.2s',
                    fontSize: '1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow =
                      '0 4px 16px 0 rgba(76, 175, 80, 0.25)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <i className="fas fa-search" />
                  Buscar
                </button>
                {userForm.encontrado && (
                  <button
                    type="button"
                    onClick={handleClearUser}
                    style={{
                      background: '#f5f5f5',
                      color: '#666',
                      border: '1.5px solid #ddd',
                      borderRadius: 12,
                      padding: '12px 20px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '1em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                    onMouseEnter={e => {
                      e.target.style.background = '#eeeeee';
                      e.target.style.borderColor = '#ccc';
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = '#f5f5f5';
                      e.target.style.borderColor = '#ddd';
                    }}
                  >
                    <i className="fas fa-times" />
                    Limpiar
                  </button>
                )}
              </form>

              {/* Información del usuario encontrado */}
              {userForm.encontrado && (
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 14,
                    padding: '20px 24px',
                    border: '1px solid #c8e6c9',
                    boxShadow: '0 2px 12px 0 rgba(76, 175, 80, 0.08)',
                    animation: 'fadeIn 0.3s ease-in-out',
                  }}
                >
                  <div
                    className="user-info-header"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ marginRight: 20 }}>
                      {userForm.foto ? (
                        <img
                          src={userForm.foto}
                          alt="Foto del usuario"
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid #4caf50',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: '#e8f5e8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '3px solid #4caf50',
                          }}
                        >
                          <i
                            className="fas fa-user"
                            style={{ fontSize: 36, color: '#4caf50' }}
                          />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          color: '#4caf50',
                          fontWeight: 700,
                          fontSize: '1.4em',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {userForm.nombreCompleto}
                      </h3>
                      <div
                        style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}
                      >
                        <div style={{ color: '#666', fontSize: '1em' }}>
                          <strong style={{ color: '#4caf50' }}>
                            Documento:
                          </strong>{' '}
                          {userForm.numeroDocumento}
                        </div>
                        <div style={{ color: '#666', fontSize: '1em' }}>
                          <strong style={{ color: '#4caf50' }}>Tipo:</strong>{' '}
                          {userForm.tipoDocumento}
                        </div>
                        <div style={{ color: '#666', fontSize: '1em' }}>
                          <strong style={{ color: '#4caf50' }}>
                            Fecha Nacimiento:
                          </strong>{' '}
                          {userForm.fechaNacimiento}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información detallada en grid */}
                  <div
                    className="grid-info"
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: 16,
                      marginTop: 16,
                    }}
                  >
                    <div
                      style={{
                        background: '#f8f9fa',
                        padding: '14px 16px',
                        borderRadius: 10,
                      }}
                    >
                      <div
                        style={{
                          color: '#4caf50',
                          fontWeight: 600,
                          fontSize: '0.95em',
                          marginBottom: 8,
                        }}
                      >
                        <i
                          className="fas fa-id-card"
                          style={{ marginRight: 8 }}
                        />
                        Información Personal
                      </div>
                      <div
                        style={{
                          fontSize: '0.9em',
                          color: '#666',
                          lineHeight: 1.5,
                        }}
                      >
                        <div>
                          <strong>Edad:</strong> {userForm.edad} años
                        </div>
                        <div>
                          <strong>Género:</strong> {userForm.sexoGenero}
                        </div>
                        <div>
                          <strong>Estado Civil:</strong> {userForm.estadoCivil}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: '#f8f9fa',
                        padding: '14px 16px',
                        borderRadius: 10,
                      }}
                    >
                      <div
                        style={{
                          color: '#4caf50',
                          fontWeight: 600,
                          fontSize: '0.95em',
                          marginBottom: 8,
                        }}
                      >
                        <i
                          className="fas fa-envelope"
                          style={{ marginRight: 8 }}
                        />
                        Contacto
                      </div>
                      <div
                        style={{
                          fontSize: '0.9em',
                          color: '#666',
                          lineHeight: 1.5,
                        }}
                      >
                        <div>
                          <strong>Email:</strong> {userForm.correoElectronico}
                        </div>
                        <div>
                          <strong>Teléfono:</strong> {userForm.telefonoUsuario}
                        </div>
                        <div>
                          <strong>Dirección:</strong>{' '}
                          {userForm.direccionResidencia}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: '#f8f9fa',
                        padding: '14px 16px',
                        borderRadius: 10,
                      }}
                    >
                      <div
                        style={{
                          color: '#4caf50',
                          fontWeight: 600,
                          fontSize: '0.95em',
                          marginBottom: 8,
                        }}
                      >
                        <i
                          className="fas fa-graduation-cap"
                          style={{ marginRight: 8 }}
                        />
                        Información Académica/Profesional
                      </div>
                      <div
                        style={{
                          fontSize: '0.9em',
                          color: '#666',
                          lineHeight: 1.5,
                        }}
                      >
                        <div>
                          <strong>Grado/Cargo:</strong> {userForm.gradoCargo}
                        </div>
                        <div>
                          <strong>Institución:</strong>{' '}
                          {userForm.institucionEmpresa}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: '#f8f9fa',
                        padding: '14px 16px',
                        borderRadius: 10,
                      }}
                    >
                      <div
                        style={{
                          color: '#4caf50',
                          fontWeight: 600,
                          fontSize: '0.95em',
                          marginBottom: 8,
                        }}
                      >
                        <i
                          className="fas fa-heart"
                          style={{ marginRight: 8 }}
                        />
                        Información Médica
                      </div>
                      <div
                        style={{
                          fontSize: '0.9em',
                          color: '#666',
                          lineHeight: 1.5,
                        }}
                      >
                        <div>
                          <strong>EPS:</strong> {userForm.epsSeguroMedico}
                        </div>
                        <div>
                          <strong>Antecedentes:</strong>{' '}
                          {userForm.antecedentesMedicos}
                        </div>
                        <div>
                          <strong>Condición Especial:</strong>{' '}
                          {userForm.condicionEspecial}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón para confirmar datos y proceder con la creación */}
                  {!showUserCreationFlow && (
                    <div style={{ marginTop: 20, textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={handleConfirmUserData}
                        style={{
                          background:
                            'linear-gradient(90deg, #1976d2 60%, #2196f3 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 12,
                          padding: '14px 32px',
                          fontWeight: 700,
                          fontSize: '1.1em',
                          cursor: 'pointer',
                          transition: 'transform 0.1s, box-shadow 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          margin: '0 auto',
                          boxShadow: '0 4px 16px 0 rgba(25, 118, 210, 0.2)',
                        }}
                        onMouseEnter={e => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow =
                            '0 6px 24px 0 rgba(25, 118, 210, 0.3)';
                        }}
                        onMouseLeave={e => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow =
                            '0 4px 16px 0 rgba(25, 118, 210, 0.2)';
                        }}
                      >
                        <i className="fas fa-check-circle" />
                        Confirmar Datos y Crear Usuario
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Contenedor de Configuración de Usuario */}
              {userForm.encontrado && showUserCreationFlow && (
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 14,
                    padding: '24px 28px',
                    border: '1px solid #bbdefb',
                    boxShadow: '0 4px 20px 0 rgba(25, 118, 210, 0.12)',
                    marginTop: 20,
                    animation: 'fadeIn 0.3s ease-in-out',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        background: '#1976d2',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                        boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.15)',
                      }}
                    >
                      <i className="fas fa-user-cog" style={{ fontSize: 20 }} />
                    </div>
                    <div>
                      <h3
                        style={{
                          color: '#1976d2',
                          fontWeight: 700,
                          fontSize: '1.3em',
                          margin: 0,
                        }}
                      >
                        Configuración de Usuario
                      </h3>
                      <div
                        style={{ color: '#666', fontSize: '1em', marginTop: 4 }}
                      >
                        Configura los parámetros finales para la creación del
                        usuario
                      </div>
                    </div>
                  </div>

                  {!userCreationData.confirmed ? (
                    <>
                      {/* Estado y Rol del Usuario */}
                      <div
                        style={{
                          background: '#f8f9fa',
                          padding: '20px 24px',
                          borderRadius: 12,
                          marginBottom: 24,
                        }}
                      >
                        <h4
                          style={{
                            color: '#333',
                            margin: '0 0 16px 0',
                            fontSize: '1.15em',
                            fontWeight: 600,
                          }}
                        >
                          <i
                            className="fas fa-user-shield"
                            style={{ marginRight: 8 }}
                          />
                          Estado y Rol del Usuario
                        </h4>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: 16,
                          }}
                        >
                          <div>
                            <label
                              style={{
                                display: 'block',
                                marginBottom: 8,
                                color: '#333',
                                fontWeight: 500,
                              }}
                            >
                              Estado del Usuario:
                            </label>
                            <select
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #ddd',
                                borderRadius: 6,
                                fontSize: '1em',
                                background: '#fff',
                                color: userCreationData.status
                                  ? '#333'
                                  : '#999',
                              }}
                              value={userCreationData.status || ''}
                              onChange={e =>
                                setUserCreationData(prev => ({
                                  ...prev,
                                  status: e.target.value,
                                }))
                              }
                            >
                              <option
                                value=""
                                disabled
                                style={{ color: '#999' }}
                              >
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
                          <div>
                            <label
                              style={{
                                display: 'block',
                                marginBottom: 8,
                                color: '#333',
                                fontWeight: 500,
                              }}
                            >
                              Rol del Usuario:
                            </label>
                            <select
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #ddd',
                                borderRadius: 6,
                                fontSize: '1em',
                                background: '#fff',
                                color: userCreationData.role ? '#333' : '#999',
                              }}
                              value={userCreationData.role || ''}
                              onChange={e =>
                                setUserCreationData(prev => ({
                                  ...prev,
                                  role: e.target.value,
                                }))
                              }
                            >
                              <option
                                value=""
                                disabled
                                style={{ color: '#999' }}
                              >
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
                      </div>

                      {/* Datos generados automáticamente */}
                      <div
                        style={{
                          background: '#e3f2fd',
                          padding: '20px 24px',
                          borderRadius: 12,
                          marginBottom: 24,
                        }}
                      >
                        <h4
                          style={{
                            color: '#1976d2',
                            margin: '0 0 16px 0',
                            fontSize: '1.15em',
                            fontWeight: 600,
                          }}
                        >
                          <i
                            className="fas fa-magic"
                            style={{ marginRight: 8 }}
                          />
                          Datos Generados Automáticamente
                        </h4>
                        <div
                          className="auto-data-grid"
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: 16,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                color: '#666',
                                fontSize: '0.9em',
                                marginBottom: 4,
                              }}
                            >
                              Nombre de Usuario:
                            </div>
                            <div
                              style={{
                                background: '#fff',
                                padding: '10px 14px',
                                borderRadius: 6,
                                border: '1px solid #bbdefb',
                                fontFamily: 'monospace',
                                fontSize: '1em',
                                color: '#1976d2',
                                fontWeight: 600,
                              }}
                            >
                              {userCreationData.autoUsername}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                color: '#666',
                                fontSize: '0.9em',
                                marginBottom: 4,
                              }}
                            >
                              Correo Electrónico:
                            </div>
                            <div
                              style={{
                                background: '#fff',
                                padding: '10px 14px',
                                borderRadius: 6,
                                border: '1px solid #bbdefb',
                                fontFamily: 'monospace',
                                fontSize: '1em',
                                color: '#1976d2',
                                fontWeight: 600,
                              }}
                            >
                              {userCreationData.autoEmail}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                color: '#666',
                                fontSize: '0.9em',
                                marginBottom: 4,
                              }}
                            >
                              Contraseña Temporal:
                            </div>
                            <div
                              style={{
                                background: '#fff',
                                padding: '10px 14px',
                                borderRadius: 6,
                                border: '1px solid #bbdefb',
                                fontFamily: 'monospace',
                                fontSize: '1em',
                                color: '#1976d2',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
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
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#1976d2',
                                  cursor: 'pointer',
                                  padding: 4,
                                }}
                                title="Generar nueva contraseña"
                              >
                                <i className="fas fa-sync-alt" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div
                        style={{
                          display: 'flex',
                          gap: 16,
                          justifyContent: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setShowUserCreationFlow(false)}
                          style={{
                            background: '#f5f5f5',
                            color: '#666',
                            border: '1.5px solid #ddd',
                            borderRadius: 12,
                            padding: '12px 24px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '1em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <i className="fas fa-arrow-left" />
                          Volver a Datos
                        </button>
                        <button
                          type="button"
                          onClick={handleCreateUser}
                          style={{
                            background:
                              'linear-gradient(90deg, #4caf50 60%, #66bb6a 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 12,
                            padding: '12px 32px',
                            fontWeight: 700,
                            fontSize: '1.1em',
                            cursor: 'pointer',
                            transition: 'transform 0.1s, box-shadow 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            boxShadow: '0 4px 16px 0 rgba(76, 175, 80, 0.2)',
                          }}
                          onMouseEnter={e => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow =
                              '0 6px 24px 0 rgba(76, 175, 80, 0.3)';
                          }}
                          onMouseLeave={e => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow =
                              '0 4px 16px 0 rgba(76, 175, 80, 0.2)';
                          }}
                        >
                          <i className="fas fa-user-plus" />
                          Crear Usuario
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Confirmación de creación */
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <div
                        style={{
                          background: '#e8f5e8',
                          color: '#4caf50',
                          borderRadius: '50%',
                          width: 80,
                          height: 80,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 20px auto',
                          fontSize: 40,
                        }}
                      >
                        <i className="fas fa-check-circle" />
                      </div>
                      <h3
                        style={{
                          color: '#4caf50',
                          margin: '0 0 12px 0',
                          fontSize: '1.4em',
                        }}
                      >
                        ¡Usuario Creado Exitosamente!
                      </h3>
                      <p
                        style={{
                          color: '#666',
                          fontSize: '1.1em',
                          margin: '0 0 20px 0',
                        }}
                      >
                        El usuario <strong>{userForm.nombreCompleto}</strong> ha
                        sido creado con éxito.
                      </p>
                      <div
                        style={{
                          background: '#f8f9fa',
                          padding: '16px 20px',
                          borderRadius: 8,
                          margin: '0 auto',
                          maxWidth: 400,
                          fontSize: '0.95em',
                        }}
                      >
                        <div style={{ marginBottom: 8 }}>
                          <strong>Usuario:</strong>{' '}
                          {userCreationData.autoUsername}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>Correo:</strong> {userCreationData.autoEmail}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>Estado:</strong> {userCreationData.status}
                        </div>
                        <div>
                          <strong>Rol:</strong> {userCreationData.role}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Menú principal de pestañas */}
            <nav
              className="menus-html dashboard-tabs"
              aria-label="Menú principal"
            >
              {mainTabs.map(tab => (
                <button
                  key={tab.key}
                  className={
                    activeTab === tab.key ? 'tab-btn active' : 'tab-btn'
                  }
                  onClick={() => setActiveTab(tab.key)}
                  aria-current={activeTab === tab.key ? 'page' : undefined}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
              <style>{`
                .dashboard-tabs {
                  display: flex;
                  flex-direction: row;
                  width: 100%;
                  background: #fafdff;
                  border-bottom: 2.5px solid #e3eafc;
                  margin-bottom: 24px;
                  gap: 0;
                  padding: 0 0 0 0;
                  overflow-x: auto;
                }
                .dashboard-tabs .tab-btn {
                  flex: 1 1 0;
                  min-width: 140px;
                  padding: 16px 0 12px 0;
                  background: none;
                  border: none;
                  border-bottom: 3px solid transparent;
                  color: #1976d2;
                  font-weight: 600;
                  font-size: 1.08em;
                  letter-spacing: 0.01em;
                  cursor: pointer;
                  transition: background 0.18s, color 0.18s, border-bottom 0.18s;
                  outline: none;
                  position: relative;
                }
                .dashboard-tabs .tab-btn.active {
                  background: #e3eafc;
                  color: #0d47a1;
                  border-bottom: 3px solid #1976d2;
                  z-index: 2;
                }
                .dashboard-tabs .tab-btn:not(.active):hover {
                  background: #f0f6ff;
                  color: #1565c0;
                }
                @media (max-width: 900px) {
                  .dashboard-tabs .tab-btn { font-size: 0.98em; min-width: 110px; padding: 12px 0 10px 0; }
                }
                @media (max-width: 600px) {
                  .dashboard-tabs { flex-wrap: wrap; }
                  .dashboard-tabs .tab-btn { min-width: 100px; font-size: 0.93em; padding: 10px 0 8px 0; }
                }
              `}</style>
            </nav>

            {/* Gestión de Usuario solo en la pestaña Crear usuario */}
            {activeTab === 'crearusuario' && (
              <section
                className="user-create-section"
                style={{
                  background:
                    'linear-gradient(135deg, #fafdff 80%, #e3eafc 100%)',
                  border: '1.5px solid #d0d7e6',
                  borderRadius: 18,
                  padding: '32px 32px 28px 32px',
                  marginBottom: 32,
                  boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.08)',
                  width: '100%',
                  maxWidth: '100%',
                  minWidth: 0,
                  position: 'relative',
                  transition: 'box-shadow 0.2s',
                  alignSelf: 'stretch',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      background: '#1976d2',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 44,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 16,
                      boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)',
                    }}
                  >
                    <i className="fas fa-user-plus" style={{ fontSize: 22 }} />
                  </div>
                  <div>
                    <h2
                      style={{
                        color: '#1976d2',
                        fontWeight: 800,
                        fontSize: '1.35em',
                        margin: 0,
                        letterSpacing: 0.5,
                      }}
                    >
                      Registro de usuario
                    </h2>
                    <div
                      style={{
                        color: '#4a4a4a',
                        fontSize: '1.07em',
                        marginTop: 2,
                        fontWeight: 400,
                      }}
                    >
                      Diligencia todos los campos obligatorios para crear un
                      nuevo usuario.
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    height: 1,
                    background: '#e3eafc',
                    margin: '18px 0 24px 0',
                    borderRadius: 2,
                  }}
                />
                <UserManagement
                  userSearch={userSearch}
                  setUserSearch={setUserSearch}
                  userForm={userForm}
                  handleUserFormChange={handleUserFormChange}
                  handleUserFormSubmit={handleUserFormSubmit}
                  handleUserSearch={handleUserSearch}
                  handleClearUser={handleClearUser}
                  unifiedStyles={unifiedStyles}
                  fieldsetStyle={{
                    ...fieldsetStyle,
                    border: '1.5px solid #e0e0e0',
                    borderRadius: 12,
                    padding: '24px 18px',
                    background: '#fff',
                    marginBottom: 0,
                    boxShadow: '0 2px 12px 0 rgba(25, 118, 210, 0.04)',
                    transition: 'box-shadow 0.2s',
                    width: '100%',
                    maxWidth: '100%',
                  }}
                  legendStyle={{
                    ...legendStyle,
                    fontWeight: 700,
                    color: '#1976d2',
                    fontSize: '1.08em',
                    letterSpacing: 0.2,
                  }}
                  alwaysShowForm
                />
                {/* Feedback visual al guardar (puedes mejorar esto con un estado si lo deseas) */}
                <div
                  id="user-form-feedback"
                  style={{
                    display: 'none',
                    position: 'absolute',
                    top: 18,
                    right: 24,
                    background: '#e3fcec',
                    color: '#1976d2',
                    borderRadius: 8,
                    padding: '8px 18px',
                    fontWeight: 600,
                    fontSize: 15,
                    boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.08)',
                  }}
                >
                  ¡Usuario guardado correctamente!
                </div>
                {/* Estilos responsivos adicionales */}
                <style>{`
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                  
                  @media (max-width: 1200px) {
                    .user-create-section { padding: 18px 2vw 18px 2vw !important; }
                    .user-search-section { padding: 18px 2vw 18px 2vw !important; }
                  }
                  @media (max-width: 900px) {
                    .user-create-section { padding: 10px 0 10px 0 !important; border-radius: 0 !important; box-shadow: none !important; }
                    .user-search-section { 
                      padding: 16px 12px 16px 12px !important; 
                      border-radius: 12px !important; 
                      margin-bottom: 16px !important;
                    }
                    .user-search-section form {
                      flex-direction: column !important;
                      gap: 8px !important;
                    }
                    .user-search-section form button {
                      align-self: flex-end !important;
                    }
                    .user-search-section .grid-info {
                      grid-template-columns: 1fr !important;
                      gap: 12px !important;
                    }
                  }
                  @media (max-width: 600px) {
                    .user-search-section {
                      padding: 12px 8px 12px 8px !important;
                      border-radius: 8px !important;
                    }
                    .user-search-section h2 {
                      font-size: 1.1em !important;
                    }
                    .user-search-section .user-info-header {
                      flex-direction: column !important;
                      align-items: flex-start !important;
                      gap: 12px !important;
                    }
                    .user-search-section .user-info-header > div:first-child {
                      align-self: center !important;
                    }
                    .user-search-section .grid-info {
                      grid-template-columns: 1fr !important;
                      gap: 12px !important;
                    }
                    .user-search-section .user-creation-grid {
                      grid-template-columns: 1fr !important;
                      gap: 16px !important;
                    }
                    .user-search-section .auto-data-grid {
                      grid-template-columns: 1fr !important;
                      gap: 12px !important;
                    }
                  }
                  .user-create-section:focus-within, .user-create-section:hover {
                    box-shadow: 0 6px 32px 0 rgba(25, 118, 210, 0.13) !important;
                  }
                  .user-search-section:focus-within, .user-search-section:hover {
                    box-shadow: 0 6px 32px 0 rgba(76, 175, 80, 0.13) !important;
                  }
                  /* Estilos para todas las secciones premium */
                  .premium-tab-section:focus-within, .premium-tab-section:hover {
                    box-shadow: 0 6px 32px 0 rgba(0, 0, 0, 0.12) !important;
                  }
                  @media (max-width: 1200px) {
                    .premium-tab-section { padding: 18px 2vw 18px 2vw !important; }
                  }
                  @media (max-width: 900px) {
                    .premium-tab-section { padding: 10px 0 10px 0 !important; border-radius: 0 !important; box-shadow: none !important; }
                  }
                `}</style>
              </section>
            )}

            {/* Contenido de pestaña activa */}
            <div
              className="tab-content-container"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                overflowY: 'auto',
              }}
            >
              {/* Alerta */}
              {activeTab === 'alertar' && (
                <section
                  className="premium-tab-section"
                  style={{
                    background:
                      'linear-gradient(135deg, #fafdff 80%, #fff3e0 100%)',
                    border: '1.5px solid #d0d7e6',
                    borderRadius: 18,
                    padding: '32px 32px 28px 32px',
                    marginBottom: 32,
                    boxShadow: '0 4px 24px 0 rgba(255, 152, 0, 0.08)',
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    position: 'relative',
                    transition: 'box-shadow 0.2s',
                    alignSelf: 'stretch',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        background: '#ff9800',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                        boxShadow: '0 2px 8px 0 rgba(255, 152, 0, 0.15)',
                      }}
                    >
                      <i
                        className="fas fa-exclamation-triangle"
                        style={{ fontSize: 22 }}
                      />
                    </div>
                    <div>
                      <h2
                        style={{
                          color: '#ff9800',
                          fontWeight: 800,
                          fontSize: '1.35em',
                          margin: 0,
                          letterSpacing: 0.5,
                        }}
                      >
                        Gestión de Alerta
                      </h2>
                      <div
                        style={{
                          color: '#4a4a4a',
                          fontSize: '1.07em',
                          marginTop: 2,
                          fontWeight: 400,
                        }}
                      >
                        Gestión de Alerta Recibida - Administra y da seguimiento
                        a alertas críticas y eventos importantes.
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: '#ffe0b2',
                      margin: '18px 0 24px 0',
                      borderRadius: 2,
                    }}
                  />
                  <AlertarForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </section>
              )}

              {/* Reportes */}
              {activeTab === 'reportes' && (
                <section
                  className="premium-tab-section"
                  style={{
                    background:
                      'linear-gradient(135deg, #fafdff 80%, #e8f5e8 100%)',
                    border: '1.5px solid #d0d7e6',
                    borderRadius: 18,
                    padding: '32px 32px 28px 32px',
                    marginBottom: 32,
                    boxShadow: '0 4px 24px 0 rgba(76, 175, 80, 0.08)',
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    position: 'relative',
                    transition: 'box-shadow 0.2s',
                    alignSelf: 'stretch',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        background: '#4caf50',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                        boxShadow: '0 2px 8px 0 rgba(76, 175, 80, 0.15)',
                      }}
                    >
                      <i
                        className="fas fa-chart-line"
                        style={{ fontSize: 22 }}
                      />
                    </div>
                    <div>
                      <h2
                        style={{
                          color: '#4caf50',
                          fontWeight: 800,
                          fontSize: '1.35em',
                          margin: 0,
                          letterSpacing: 0.5,
                        }}
                      >
                        Generación de Reportes
                      </h2>
                      <div
                        style={{
                          color: '#4a4a4a',
                          fontSize: '1.07em',
                          marginTop: 2,
                          fontWeight: 400,
                        }}
                      >
                        Crea y exporta reportes detallados sobre el estado y
                        progreso del sistema.
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: '#c8e6c9',
                      margin: '18px 0 24px 0',
                      borderRadius: 2,
                    }}
                  />
                  <ReportesForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </section>
              )}

              {/* Remisión de Atención */}
              {activeTab === 'remision' && (
                <section
                  className="premium-tab-section"
                  style={{
                    background:
                      'linear-gradient(135deg, #fafdff 80%, #f3e5f5 100%)',
                    border: '1.5px solid #d0d7e6',
                    borderRadius: 18,
                    padding: '32px 32px 28px 32px',
                    marginBottom: 32,
                    boxShadow: '0 4px 24px 0 rgba(156, 39, 176, 0.08)',
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    position: 'relative',
                    transition: 'box-shadow 0.2s',
                    alignSelf: 'stretch',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        background: '#9c27b0',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                        boxShadow: '0 2px 8px 0 rgba(156, 39, 176, 0.15)',
                      }}
                    >
                      <i className="fas fa-user-md" style={{ fontSize: 22 }} />
                    </div>
                    <div>
                      <h2
                        style={{
                          color: '#9c27b0',
                          fontWeight: 800,
                          fontSize: '1.35em',
                          margin: 0,
                          letterSpacing: 0.5,
                        }}
                      >
                        Remisión de Atención
                      </h2>
                      <div
                        style={{
                          color: '#4a4a4a',
                          fontSize: '1.07em',
                          marginTop: 2,
                          fontWeight: 400,
                        }}
                      >
                        Gestiona remisiones médicas y derivaciones de atención
                        especializada.
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: '#e1bee7',
                      margin: '18px 0 24px 0',
                      borderRadius: 2,
                    }}
                  />
                  <RemisionForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </section>
              )}

              {/* Seguimiento */}
              {activeTab === 'seguimiento' && (
                <section
                  className="premium-tab-section"
                  style={{
                    background:
                      'linear-gradient(135deg, #fafdff 80%, #e0f2f1 100%)',
                    border: '1.5px solid #d0d7e6',
                    borderRadius: 18,
                    padding: '32px 32px 28px 32px',
                    marginBottom: 32,
                    boxShadow: '0 4px 24px 0 rgba(0, 150, 136, 0.08)',
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    position: 'relative',
                    transition: 'box-shadow 0.2s',
                    alignSelf: 'stretch',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        background: '#009688',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                        boxShadow: '0 2px 8px 0 rgba(0, 150, 136, 0.15)',
                      }}
                    >
                      <i className="fas fa-tasks" style={{ fontSize: 22 }} />
                    </div>
                    <div>
                      <h2
                        style={{
                          color: '#009688',
                          fontWeight: 800,
                          fontSize: '1.35em',
                          margin: 0,
                          letterSpacing: 0.5,
                        }}
                      >
                        Panel de Seguimiento
                      </h2>
                      <div
                        style={{
                          color: '#4a4a4a',
                          fontSize: '1.07em',
                          marginTop: 2,
                          fontWeight: 400,
                        }}
                      >
                        Monitorea el progreso y estado de casos, evaluaciones y
                        procesos.
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: '#b2dfdb',
                      margin: '18px 0 24px 0',
                      borderRadius: 2,
                    }}
                  />
                  <SeguimientoForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </section>
              )}

              {/* Administrador de PQR */}
              {activeTab === 'pqradmin' && (
                <section
                  className="premium-tab-section"
                  style={{
                    background:
                      'linear-gradient(135deg, #fafdff 80%, #fff8e1 100%)',
                    border: '1.5px solid #d0d7e6',
                    borderRadius: 18,
                    padding: '32px 32px 28px 32px',
                    marginBottom: 32,
                    boxShadow: '0 4px 24px 0 rgba(255, 193, 7, 0.08)',
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    position: 'relative',
                    transition: 'box-shadow 0.2s',
                    alignSelf: 'stretch',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        background: '#ffc107',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                        boxShadow: '0 2px 8px 0 rgba(255, 193, 7, 0.15)',
                      }}
                    >
                      <i
                        className="fas fa-clipboard-list"
                        style={{ fontSize: 22 }}
                      />
                    </div>
                    <div>
                      <h2
                        style={{
                          color: '#f57c00',
                          fontWeight: 800,
                          fontSize: '1.35em',
                          margin: 0,
                          letterSpacing: 0.5,
                        }}
                      >
                        Administrador de PQR
                      </h2>
                      <div
                        style={{
                          color: '#4a4a4a',
                          fontSize: '1.07em',
                          marginTop: 2,
                          fontWeight: 400,
                        }}
                      >
                        Gestiona peticiones, quejas, reclamos y solicitudes de
                        los usuarios.
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: '#ffecb3',
                      margin: '18px 0 24px 0',
                      borderRadius: 2,
                    }}
                  />
                  <PqrAdminForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </section>
              )}

              {/* Seguimiento PQR */}
              {activeTab === 'pqrseguimiento' && (
                <section
                  className="premium-tab-section"
                  style={{
                    background:
                      'linear-gradient(135deg, #fafdff 80%, #e8eaf6 100%)',
                    border: '1.5px solid #d0d7e6',
                    borderRadius: 18,
                    padding: '32px 32px 28px 32px',
                    marginBottom: 32,
                    boxShadow: '0 4px 24px 0 rgba(63, 81, 181, 0.08)',
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    position: 'relative',
                    transition: 'box-shadow 0.2s',
                    alignSelf: 'stretch',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        background: '#3f51b5',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                        boxShadow: '0 2px 8px 0 rgba(63, 81, 181, 0.15)',
                      }}
                    >
                      <i className="fas fa-search" style={{ fontSize: 22 }} />
                    </div>
                    <div>
                      <h2
                        style={{
                          color: '#3f51b5',
                          fontWeight: 800,
                          fontSize: '1.35em',
                          margin: 0,
                          letterSpacing: 0.5,
                        }}
                      >
                        Seguimiento PQR
                      </h2>
                      <div
                        style={{
                          color: '#4a4a4a',
                          fontSize: '1.07em',
                          marginTop: 2,
                          fontWeight: 400,
                        }}
                      >
                        Rastrea el estado y progreso de las solicitudes PQR en
                        el sistema.
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: '#c5cae9',
                      margin: '18px 0 24px 0',
                      borderRadius: 2,
                    }}
                  />
                  <PqrSeguimientoForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </section>
              )}

              {/* Comunicación y Soporte */}
              {activeTab === 'soporte' && (
                <section
                  className="premium-tab-section"
                  style={{
                    background:
                      'linear-gradient(135deg, #fafdff 80%, #fce4ec 100%)',
                    border: '1.5px solid #d0d7e6',
                    borderRadius: 18,
                    padding: '32px 32px 28px 32px',
                    marginBottom: 32,
                    boxShadow: '0 4px 24px 0 rgba(233, 30, 99, 0.08)',
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    position: 'relative',
                    transition: 'box-shadow 0.2s',
                    alignSelf: 'stretch',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        background: '#e91e63',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                        boxShadow: '0 2px 8px 0 rgba(233, 30, 99, 0.15)',
                      }}
                    >
                      <i className="fas fa-headset" style={{ fontSize: 22 }} />
                    </div>
                    <div>
                      <h2
                        style={{
                          color: '#e91e63',
                          fontWeight: 800,
                          fontSize: '1.35em',
                          margin: 0,
                          letterSpacing: 0.5,
                        }}
                      >
                        Comunicación y Soporte
                      </h2>
                      <div
                        style={{
                          color: '#4a4a4a',
                          fontSize: '1.07em',
                          marginTop: 2,
                          fontWeight: 400,
                        }}
                      >
                        Centro de comunicación y asistencia técnica para
                        usuarios del sistema.
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: '#f8bbd9',
                      margin: '18px 0 24px 0',
                      borderRadius: 2,
                    }}
                  />
                  <SoporteForm
                    fieldsetStyle={fieldsetStyle}
                    legendStyle={legendStyle}
                    unifiedStyles={unifiedStyles}
                  />
                </section>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Panel de configuración */}
      {showSettings && (
        <>
          <div
            className="overlay show"
            onClick={() => setShowSettings(false)}
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
              // Campos extra para edición futura
              name: adminProfileState.name,
              lastName: adminProfileState.lastName,
              role: adminProfileState.role,
              documentType: adminProfileState.documentType,
              documentNumber: adminProfileState.documentNumber,
              email: adminProfileState.email,
            }}
          />
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
