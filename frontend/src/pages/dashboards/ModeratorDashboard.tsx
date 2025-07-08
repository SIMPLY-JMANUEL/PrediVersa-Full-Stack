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
import useProfile from '../../hooks/useProfile';

// ORDEN DE TABS PARA MODERADOR: Alerta, Reportes, Remisión de Atención, Seguimiento, Administrador de PQR, Seguimiento PQR, Comunicación y Soporte
const mainTabs = [
  { label: 'Alerta', key: 'alertar' },
  { label: 'Reportes', key: 'reportes' },
  { label: 'Remisión de Atención', key: 'remision' },
  { label: 'Seguimiento', key: 'seguimiento' },
  { label: 'Administrador de PQR', key: 'pqradmin' },
  { label: 'Seguimiento PQR', key: 'pqrseguimiento' },
  { label: 'Comunicación y Soporte', key: 'soporte' }
];

interface UserCreationData {
  status: string;
  role: string;
  autoEmail: string;
  autoPassword: string;
  autoUsername: string;
  confirmed: boolean;
}

interface UserForm {
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correoElectronico: string;
  telefono: string;
  fechaNacimiento: string;
  genero: string;
  estado: string;
  ciudad: string;
  direccion: string;
  ocupacion: string;
  nivelEducativo: string;
  institucionEducativa: string;
  programaAcademico: string;
  semestreActual: string;
  promedio: string;
  observaciones: string;
}

const ModeratorDashboard: React.FC = () => {
  const { profile, loading, error } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('alertar');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>('');
  const [showUserCreationFlow, setShowUserCreationFlow] = useState<boolean>(false);
  const [userCreationData, setUserCreationData] = useState<UserCreationData>({
    status: '',
    role: '',
    autoEmail: '',
    autoPassword: '',
    autoUsername: '',
    confirmed: false
  });
  const [userForm, setUserForm] = useState<UserForm>({
    nombreCompleto: '',
    tipoDocumento: '',
    numeroDocumento: '',
    correoElectronico: '',
    telefono: '',
    fechaNacimiento: '',
    genero: '',
    estado: '',
    ciudad: '',
    direccion: '',
    ocupacion: '',
    nivelEducativo: '',
    institucionEducativa: '',
    programaAcademico: '',
    semestreActual: '',
    promedio: '',
    observaciones: ''
  });

  // TIPOGRAFÍA UNIFICADA
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

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'alertar':
        return <AlertarForm fieldsetStyle={fieldsetStyle} legendStyle={legendStyle} unifiedStyles={unifiedStyles} />;
      case 'reportes':
        return <ReportesForm fieldsetStyle={fieldsetStyle} legendStyle={legendStyle} unifiedStyles={unifiedStyles} />;
      case 'remision':
        return <RemisionForm fieldsetStyle={fieldsetStyle} legendStyle={legendStyle} unifiedStyles={unifiedStyles} />;
      case 'seguimiento':
        return <SeguimientoForm fieldsetStyle={fieldsetStyle} legendStyle={legendStyle} unifiedStyles={unifiedStyles} />;
      case 'pqradmin':
        return <PqrAdminForm fieldsetStyle={fieldsetStyle} legendStyle={legendStyle} unifiedStyles={unifiedStyles} />;
      case 'pqrseguimiento':
        return <PqrSeguimientoForm fieldsetStyle={fieldsetStyle} legendStyle={legendStyle} unifiedStyles={unifiedStyles} />;
      case 'soporte':
        return <SoporteForm fieldsetStyle={fieldsetStyle} legendStyle={legendStyle} unifiedStyles={unifiedStyles} />;
      default:
        return <AlertarForm fieldsetStyle={fieldsetStyle} legendStyle={legendStyle} unifiedStyles={unifiedStyles} />;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error al cargar el dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header-dashboard">
        <div className="header-content">
          <div className="logo-section">
            <img src={logo} alt="Logo Prediversa" className="logo" />
            <h1 className="dashboard-title">Panel de Moderador</h1>
          </div>
          <div className="header-actions">
            <button onClick={toggleSettings} className="settings-btn">
              ⚙️
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          {/* Sección de perfil */}
          <div className="profile-section">
            <div className="profile-image-container" style={{ padding: '8px', textAlign: 'center' }}>
              <div className="profile-image-wrapper">
                <img 
                  src={(profile as any)?.profileImage || "/api/placeholder/80/80"} 
                  alt="Perfil" 
                  className="profile-image"
                />
              </div>
            </div>
            <div className="profile-info">
              <h3>{(profile as any)?.fullName || 'Moderador'}</h3>
              <p className="profile-role">Moderador</p>
              <p className="profile-email">{(profile as any)?.email || 'moderador@prediversa.com'}</p>
            </div>
          </div>

          {/* Estado del sistema */}
          <div className="system-status">
            <h4>Estado del Sistema</h4>
            <div className="status-item">
              <span className="status-indicator active"></span>
              <span>Plataforma Activa</span>
            </div>
            <div className="status-item">
              <span className="status-indicator active"></span>
              <span>Servicios Operativos</span>
            </div>
            <div className="status-item">
              <span className="status-indicator warning"></span>
              <span>Mantenimiento Programado</span>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="quick-stats">
            <h4>Estadísticas</h4>
            <div className="stat-item">
              <span className="stat-number">156</span>
              <span className="stat-label">Usuarios Activos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">89</span>
              <span className="stat-label">Alertas Activas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">23</span>
              <span className="stat-label">PQR Pendientes</span>
            </div>
          </div>
        </aside>

        {/* Panel principal derecho */}
        <main className="main-content">
          <div className="right-panel" style={{ padding: '8px' }}>
            {/* Pestañas principales */}
            <div className="main-tabs">
              {mainTabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => handleTabClick(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenido de las pestañas */}
            <div className="tab-content">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>

      {/* Panel de configuración */}
      {showSettings && (
        <SettingsPanel 
          onClose={toggleSettings} 
          onSave={() => {}} 
          initialProfile={(profile as any) || {}} 
        />
      )}
    </div>
  );
};

export default ModeratorDashboard;
