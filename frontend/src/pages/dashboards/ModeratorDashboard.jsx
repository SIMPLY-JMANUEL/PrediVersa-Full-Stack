import React, { useState } from 'react';
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

// PESTAÑAS ESPECÍFICAS PARA MODERADOR: Supervisión, Reportes, Gestión de Usuarios, Análisis y Configuración
const mainTabs = [
  { label: 'Supervisión General', key: 'supervision' },
  { label: 'Reportes y Denuncias', key: 'reportes' },
  { label: 'Gestión de Usuarios', key: 'usuarios' },
  { label: 'Análisis de Contenido', key: 'analisis' },
  { label: 'Configuración del Sistema', key: 'configuracion' }
];

function ModeratorDashboard() {
  const { profile, loading, error } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('supervision');
  const [showSettings, setShowSettings] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [reportSearch, setReportSearch] = useState('');
  const [showUserCreationFlow, setShowUserCreationFlow] = useState(false);
  const [userCreationData, setUserCreationData] = useState({
    status: '', // Vacío para mostrar "Seleccionar"
    role: '', // Vacío para mostrar "Seleccionar"
    autoEmail: '',
    autoPassword: '',
    autoUsername: '',
    confirmed: false
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
    encontrado: false
  });
  
  // Datos del moderador dinámicos desde localStorage
  const userData = {
    name: localStorage.getItem('nombre') || 'Moderador',
    lastName: '',
    role: 'Moderador',
    documentType: 'DNI',
    documentNumber: '87654321',
    email: 'moderador@prediversa.com',
    phone: '321987654',
    address: 'Calle 456, Ciudad',
    photo: '',
  };

  // Estado centralizado del perfil moderador
  const [moderatorProfileState, setModeratorProfileState] = useState(userData);
  // Estado para la foto de perfil del moderador
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

  const openSettings = (e) => {
    e.preventDefault();
    setShowSettings(true);
  };

  // Handler para guardar cambios desde SettingsPanel
  const handleSettingsSave = (newProfile) => {
    setModeratorProfileState((prev) => ({ ...prev, ...newProfile }));
    if (newProfile.photo) {
      setProfilePhoto(newProfile.photo);
    }
  };

  // Handler para cambiar la foto de perfil
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        setModeratorProfileState((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers para búsquedas
  const handleUserSearch = (e) => {
    e.preventDefault();
    setUserForm({
      // Datos básicos del usuario - datos de ejemplo
      nombreCompleto: 'Juan Carlos Pérez López',
      tipoDocumento: 'Cédula de Ciudadanía',
      numeroDocumento: userSearch,
      fechaNacimiento: '1995-03-20',
      edad: '29',
      sexoGenero: 'Masculino',
      estadoCivil: 'Soltero(a)',
      correoElectronico: 'juan.perez@correo.com',
      telefonoUsuario: '3012345678',
      direccionResidencia: 'Carrera 12 #34-56, Barrio Norte, Medellín',
      epsSeguroMedico: 'Sura EPS',
      antecedentesMedicos: 'Ninguno',
      condicionEspecial: 'Ninguna',
      gradoCargo: 'Moderador Jr.',
      institucionEmpresa: 'PrediVersa',
      usuarioActivo: 'activo',
      rol: 'moderador',
      nombreFamiliarContacto: 'María López (Madre)',
      telefonoFamiliarContacto: '3098765432',
      password: '',
      foto: 'https://randomuser.me/api/portraits/men/32.jpg',
      encontrado: true
    });
  };

  const handleReportSearch = (e) => {
    e.preventDefault();
    console.log('Buscando reporte:', reportSearch);
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
      encontrado: false
    });
    setUserSearch('');
    setShowUserCreationFlow(false);
    setUserCreationData({
      status: '',
      role: '',
      autoEmail: '',
      autoPassword: '',
      autoUsername: '',
      confirmed: false
    });
  };

  const handleUserFormChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleUserFormSubmit = (e) => {
    e.preventDefault();
    alert('Usuario guardado/actualizado');
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
    return `${cleanName}${cleanLastName ? '.' + cleanLastName.slice(0, 6) : ''}${domain}`;
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
      confirmed: false
    };
    
    setUserCreationData(autoData);
    setShowUserCreationFlow(true);
  };

  // Handler para crear el usuario final
  const handleCreateUser = () => {
    setUserCreationData(prev => ({ ...prev, confirmed: true }));
    // Aquí iría la lógica para enviar los datos al backend
    setTimeout(() => {
      alert(`¡Usuario ${userForm.nombreCompleto} creado exitosamente!\n\nUsuario: ${userCreationData.autoUsername}\nCorreo: ${userCreationData.autoEmail}\nContraseña: ${userCreationData.autoPassword}`);
      handleClearUser();
      setShowUserCreationFlow(false);
      setUserCreationData({
        status: '',
        role: '',
        autoEmail: '',
        autoPassword: '',
        autoUsername: '',
        confirmed: false
      });
    }, 1000);
  };

  // TIPOGRAFÍA UNIFICADA: Estilos consistentes para todos los formularios
  const unifiedTypography = {
    // Fuente base del sistema
    fontFamily: `'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
    
    // Tamaños de fuente estandarizados
    fontSize: {
      small: '0.875rem',    // 14px
      normal: '1rem',       // 16px - tamaño base estándar
      medium: '1.125rem',   // 18px
      large: '1.25rem',     // 20px
      xlarge: '1.5rem'      // 24px
    },
    
    // Pesos de fuente
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    
    // Altura de línea
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625
    }
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
      fontFamily: unifiedTypography.fontFamily
    },
    
    // Estilo para legends
    legend: {
      fontWeight: unifiedTypography.fontWeight.semibold,
      color: '#1976d2',
      fontSize: unifiedTypography.fontSize.normal,
      fontFamily: unifiedTypography.fontFamily,
      lineHeight: unifiedTypography.lineHeight.normal
    },
    
    // Estilo para labels
    label: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.normal,
      fontWeight: unifiedTypography.fontWeight.medium,
      color: '#333333',
      lineHeight: unifiedTypography.lineHeight.normal,
      display: 'block',
      marginBottom: '4px'
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
      boxSizing: 'border-box'
    },
    
    // Estilo para texto descriptivo
    description: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.small,
      fontWeight: unifiedTypography.fontWeight.normal,
      color: '#666666',
      lineHeight: unifiedTypography.lineHeight.normal,
      marginTop: '4px'
    },
    
    // Estilo para botones
    button: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.normal,
      fontWeight: unifiedTypography.fontWeight.medium,
      lineHeight: unifiedTypography.lineHeight.normal
    },
    
    // Estilo para títulos de sección
    sectionTitle: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.large,
      fontWeight: unifiedTypography.fontWeight.bold,
      color: '#1976d2',
      lineHeight: unifiedTypography.lineHeight.tight,
      margin: 0
    },
    
    // Estilo para subtítulos
    subtitle: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.medium,
      fontWeight: unifiedTypography.fontWeight.medium,
      color: '#4a4a4a',
      lineHeight: unifiedTypography.lineHeight.normal,
      margin: 0
    }
  };

  // COMPATIBILIDAD: Mantenemos los estilos originales pero con tipografía unificada
  const fieldsetStyle = unifiedStyles.fieldset;
  const legendStyle = unifiedStyles.legend;

  return (
    <div className="student-dashboard-html" style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#f6f8fa',
      fontFamily: `'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
      paddingTop: '80px'
    }}>
      {/* Header fijo */}
      <header className="header-main-html" role="banner">
        <div className="header-logo-title-html">
          <img src={logo} alt="PrediVersa Logo" className="header-logo-img-html" />
          <span className="header-title-html">Panel del Moderador</span>
        </div>
        <div className="header-user-actions-html">
          <span className="header-user-name-html">
            <i className="fas fa-user-circle" style={{ marginRight: 8, color: "#1976d2" }}></i>
            {moderatorProfileState.name} {moderatorProfileState.lastName}
          </span>
          <button
            className="header-btn-html"
            onClick={openSettings}
            title="Configuración"
            aria-label="Configuración"
          >
            <i className="fas fa-cog"></i>
          </button>
          <button
            className="header-btn-html"
            onClick={handleLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </header>

      <div className="student-dashboard-html">
        <main className="main-html" style={{ 
          display: 'flex', 
          alignItems: 'stretch', 
          height: 'calc(100vh - 80px)',
          flex: 1, 
          gap: '24px', 
          padding: 0, 
          width: '100%', 
          margin: 0, 
          boxSizing: 'border-box'
        }}>
          {/* Panel izquierdo */}
          <aside className="dashboard-sidebar" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            minWidth: '320px',
            maxWidth: '350px',
            background: '#fff',
            borderRight: '1px solid #b3c6d6',
            overflowY: 'auto',
            boxShadow: '2px 0 8px rgba(25, 118, 210, 0.1)'
          }}>
            {/* Contenedor de imagen de perfil con lógica de cambio */}
            <section className="profile-image-container" style={{ height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <label htmlFor="moderator-profile-photo-upload" style={{ cursor: 'pointer', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Perfil" className="settings-profile-img" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '50%', border: '2px solid #1976d2' }} />
                ) : (
                  <div className="profile-image-placeholder" style={{ width: 120, height: 120, borderRadius: '50%', background: '#e3eafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: '#b0b8d1', border: '2px solid #1976d2' }}>
                    <i className="fas fa-user-circle"></i>
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 8, right: 8, background: '#fff', borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', padding: 6 }}>
                  <i className="fas fa-camera" style={{ color: '#1976d2', fontSize: 20 }}></i>
                </div>
                <input
                  id="moderator-profile-photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProfilePhotoChange}
                />
              </label>
              <div style={{ marginTop: 8, fontWeight: 500, color: '#1976d2', fontSize: 15 }}>Fotografía de perfil</div>
            </section>
            <section className="user-info-container">
              <div className="info-row"><span><strong>Nombre:</strong> {moderatorProfileState.name} {moderatorProfileState.lastName}</span></div>
              <div className="info-row"><span><strong>Cargo:</strong> {moderatorProfileState.role}</span></div>
              <div className="info-row"><span><strong>Tipo documento:</strong> {moderatorProfileState.documentType}</span></div>
              <div className="info-row"><span><strong>Número documento:</strong> {moderatorProfileState.documentNumber}</span></div>
              <div className="info-row"><span><strong>Correo:</strong> {moderatorProfileState.email}</span></div>
              <div className="info-row"><span><strong>Teléfono:</strong> {moderatorProfileState.phone}</span></div>
              <div className="info-row"><span><strong>Dirección:</strong> {moderatorProfileState.address}</span></div>
            </section>
            <section className="system-status-container">
              <h3><i className="fas fa-shield-alt"></i> Estado de Moderación</h3>
              <div className="status-row"><i className="fas fa-eye"></i><span><strong>Supervisión:</strong> Activa</span></div>
              <div className="status-row"><i className="fas fa-check-circle"></i><span><strong>Contenido:</strong> Moderado</span></div>
              <div className="status-row"><i className="fas fa-clock"></i><span><strong>Respuesta:</strong> 2.5h promedio</span></div>
            </section>
            <section className="stats-container">
              <h3><i className="fas fa-chart-bar"></i> Estadísticas</h3>
              <div className="stat-row"><i className="fas fa-exclamation-triangle"></i><span><strong>Reportes Pendientes:</strong> 12</span></div>
              <div className="stat-row"><i className="fas fa-eye"></i><span><strong>Contenidos Revisados:</strong> 847</span></div>
              <div className="stat-row"><i className="fas fa-users"></i><span><strong>Usuarios Activos:</strong> 1,245</span></div>
              <div className="stat-row"><i className="fas fa-ban"></i><span><strong>Acciones Tomadas:</strong> 23</span></div>
              <div className="stat-row"><i className="fas fa-clock"></i><span><strong>Tiempo Promedio:</strong> 24h</span></div>
              <div className="stat-row"><i className="fas fa-shield-check"></i><span><strong>Casos Resueltos:</strong> 156</span></div>
            </section>
          </aside>

          {/* Panel derecho */}
          <section className="right-panel-html" style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            minWidth: 0,
            padding: '18px 24px',
            background: '#fff',
            overflowY: 'auto',
            gap: '18px'
          }} aria-label="Panel principal">

            {/* Sección de Búsqueda de Reportes */}
            <section
              className="report-search-section"
              style={{
                background: 'linear-gradient(135deg, #fafdff 80%, #fff3e0 100%)',
                border: '1.5px solid #d0d7e6',
                borderRadius: 18,
                padding: '24px 28px 20px 28px',
                marginBottom: 24,
                boxShadow: '0 4px 24px 0 rgba(255, 152, 0, 0.08)',
                width: '100%',
                position: 'relative',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <div style={{
                  background: '#ff9800',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                  boxShadow: '0 2px 8px 0 rgba(255, 152, 0, 0.15)'
                }}>
                  <i className="fas fa-search" style={{ fontSize: 20 }}></i>
                </div>
                <div>
                  <h2 style={{ color: '#ff9800', fontWeight: 800, fontSize: '1.25em', margin: 0, letterSpacing: 0.3 }}>Búsqueda de Reportes</h2>
                  <div style={{ color: '#4a4a4a', fontSize: '1em', marginTop: 2, fontWeight: 400 }}>
                    Busca y gestiona reportes pendientes de moderación
                  </div>
                </div>
              </div>
              <div style={{ height: 1, background: '#ffe0b2', margin: '14px 0 20px 0', borderRadius: 2 }} />
              
              <form onSubmit={handleReportSearch} style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <input
                  type="text"
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  placeholder="ID del reporte o palabras clave"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1.5px solid #ffe0b2',
                    borderRadius: 12,
                    fontSize: '1em',
                    outline: 'none',
                    transition: 'border 0.2s, box-shadow 0.2s',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff9800';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 152, 0, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ffe0b2';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(90deg, #ff9800 60%, #ffb74d 100%)',
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
                    gap: 8
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 16px 0 rgba(255, 152, 0, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <i className="fas fa-search"></i>
                  Buscar
                </button>
              </form>
            </section>

            {/* Menú principal de pestañas */}
            <nav className="menus-html dashboard-tabs" aria-label="Menú principal">
              {mainTabs.map(tab => (
                <button
                  key={tab.key}
                  className={activeTab === tab.key ? 'tab-btn active' : 'tab-btn'}
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

            {/* Gestión de Usuario solo en la pestaña usuarios */}
            {activeTab === 'usuarios' && (
              <section
                className="user-create-section"
                style={{
                  background: 'linear-gradient(135deg, #fafdff 80%, #e3eafc 100%)',
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
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{
                    background: '#1976d2',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                    boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)'
                  }}>
                    <i className="fas fa-user-plus" style={{ fontSize: 22 }}></i>
                  </div>
                  <div>
                    <h2 style={{ color: '#1976d2', fontWeight: 800, fontSize: '1.35em', margin: 0, letterSpacing: 0.5 }}>Gestión de usuarios</h2>
                    <div style={{ color: '#4a4a4a', fontSize: '1.07em', marginTop: 2, fontWeight: 400 }}>
                      Busca, edita y administra usuarios del sistema.
                    </div>
                  </div>
                </div>
                <div style={{ height: 1, background: '#e3eafc', margin: '18px 0 24px 0', borderRadius: 2 }} />
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
                    letterSpacing: 0.2
                  }}
                  alwaysShowForm={true}
                />
                {/* Feedback visual al guardar */}
                <div id="user-form-feedback" style={{ display: 'none', position: 'absolute', top: 18, right: 24, background: '#e3fcec', color: '#1976d2', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.08)' }}>
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
                    .report-search-section { padding: 18px 2vw 18px 2vw !important; }
                  }
                  @media (max-width: 900px) {
                    .user-create-section { padding: 10px 0 10px 0 !important; border-radius: 0 !important; box-shadow: none !important; }
                    .report-search-section { 
                      padding: 16px 12px 16px 12px !important; 
                      border-radius: 12px !important; 
                      margin-bottom: 16px !important;
                    }
                    .report-search-section form {
                      flex-direction: column !important;
                      gap: 10px !important;
                    }
                  }
                `}</style>
              </section>
            )}

            {/* Contenido de las pestañas */}
            <div className="tab-content-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto' }}>
              
              {activeTab === 'supervision' && (
                <div className="tab-content-section" style={{ padding: '8px' }}>
                  <SoporteForm fieldsetStyle={fieldsetStyle} legendStyle={legendStyle} unifiedStyles={unifiedStyles} />
                </div>
              )}

              {activeTab === 'reportes' && (
                <div className="tab-content-section" style={{ padding: '8px' }}>
                  <ReportesForm fieldsetStyle={fieldsetStyle} legendStyle={legendStyle} unifiedStyles={unifiedStyles} />
                </div>
              )}

              {/* La pestaña usuarios ya está manejada arriba */}

              {activeTab === 'analisis' && (
                <div className="tab-content-section" style={{ padding: '8px' }}>
                  <SeguimientoForm fieldsetStyle={fieldsetStyle} legendStyle={legendStyle} unifiedStyles={unifiedStyles} />
                </div>
              )}

              {activeTab === 'configuracion' && (
                <div className="tab-content-section" style={{ padding: '8px' }}>
                  <PqrAdminForm fieldsetStyle={fieldsetStyle} legendStyle={legendStyle} unifiedStyles={unifiedStyles} />
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Panel de configuración */}
      {showSettings && (
        <>
          <div className="overlay show" onClick={() => setShowSettings(false)} />
          <SettingsPanel
            onClose={() => setShowSettings(false)}
            onSave={handleSettingsSave}
            initialProfile={{
              photo: moderatorProfileState.photo,
              phone: moderatorProfileState.phone,
              address: moderatorProfileState.address,
              theme: moderatorProfileState.theme || 'light',
              language: moderatorProfileState.language || 'es',
              name: moderatorProfileState.name,
              lastName: moderatorProfileState.lastName,
              role: moderatorProfileState.role,
              documentType: moderatorProfileState.documentType,
              documentNumber: moderatorProfileState.documentNumber,
              email: moderatorProfileState.email
            }}
          />
        </>
      )}
    </div>
  );
}

export default ModeratorDashboard;