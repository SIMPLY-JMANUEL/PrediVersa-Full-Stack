import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo-prediversa.png';
import './HeaderDashboard.css';
import './components/AdminDashboard.css';
import SettingsPanel from '../../components/SettingsPanel.jsx';
import useProfile from '../../hooks/useProfile';

function TeacherDashboard() {
  const { profile, loading, error } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('clases');
  const [showSettings, setShowSettings] = useState(false);
  
  // Estados para gestión académica
  const [classSearch, setClassSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [resourceSearch, setResourceSearch] = useState('');
  
  // Datos del docente desde localStorage
  const userData = {
    name: localStorage.getItem('nombre') || 'Docente',
    lastName: localStorage.getItem('apellido') || '',
    role: 'Docente',
    documentType: 'DNI',
    documentNumber: '98765432',
    email: 'docente@prediversa.com',
    phone: '321654987',
    address: 'Calle 789, Ciudad',
    photo: '',
    subject: 'Matemáticas',
    grade: '10° Grado'
  };

  // Estado centralizado del perfil docente
  const [teacherProfileState, setTeacherProfileState] = useState(userData);
  // Estado para la foto de perfil del docente
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
    setTeacherProfileState((prev) => ({ ...prev, ...newProfile }));
    if (newProfile.photo) {
      setProfilePhoto(newProfile.photo);
    }
  };

  // Obtener icono para pestañas
  const getTabIcon = (tab) => {
    const icons = {
      clases: 'fa-chalkboard-teacher',
      evaluaciones: 'fa-clipboard-check',
      recursos: 'fa-book-open',
      comunicacion: 'fa-comments',
      seguimiento: 'fa-chart-line'
    };
    return icons[tab] || 'fa-circle';
  };

  // Obtener título para pestañas
  const getTabTitle = (tab) => {
    const titles = {
      clases: 'Gestión de Clases',
      evaluaciones: 'Evaluaciones',
      recursos: 'Recursos',
      comunicacion: 'Comunicación',
      seguimiento: 'Seguimiento'
    };
    return titles[tab] || 'Sección';
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
      boxSizing: 'border-box',
      width: '100%'
    },
    
    // Estilo para descriptions
    description: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.small,
      fontWeight: unifiedTypography.fontWeight.normal,
      color: '#666666',
      lineHeight: unifiedTypography.lineHeight.normal,
      marginTop: '4px'
    },
    
    button: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.normal,
      fontWeight: unifiedTypography.fontWeight.medium,
      lineHeight: unifiedTypography.lineHeight.normal,
      padding: '12px 24px',
      borderRadius: 8,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    
    sectionTitle: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.xlarge,
      fontWeight: unifiedTypography.fontWeight.bold,
      color: '#1976d2',
      lineHeight: unifiedTypography.lineHeight.tight,
      margin: 0
    },
    
    subtitle: {
      fontFamily: unifiedTypography.fontFamily,
      fontSize: unifiedTypography.fontSize.medium,
      fontWeight: unifiedTypography.fontWeight.medium,
      color: '#4a4a4a',
      lineHeight: unifiedTypography.lineHeight.normal,
      margin: 0
    }
  };

  // Renderizar contenido de pestañas
  const renderTabContent = () => {
    switch (activeTab) {
      case 'clases':
        return (
          <section style={{
            background: '#fff',
            borderRadius: 14,
            padding: 24,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1.5px solid #e8f4fd'
          }}>
            <h3 style={{
              ...unifiedStyles.sectionTitle,
              fontSize: unifiedTypography.fontSize.large,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center'
            }}>
              <i className="fas fa-chalkboard-teacher" style={{ marginRight: 12, color: '#1976d2' }}></i>
              Gestión de Clases
            </h3>
            
            {/* Lista de clases del docente */}
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{
                background: 'linear-gradient(135deg, #f8fffe 80%, #e8f5e8 100%)',
                border: '1.5px solid #d0f0c0',
                borderRadius: 12,
                padding: 20,
                marginBottom: 16
              }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ ...unifiedStyles.label, marginBottom: 0 }}>Materia:</span>
                  <span style={{ fontWeight: unifiedTypography.fontWeight.bold, marginLeft: 8 }}>
                    {userData.subject}
                  </span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ ...unifiedStyles.label, marginBottom: 0 }}>Grado:</span>
                  <span style={{ marginLeft: 8 }}>{userData.grade}</span>
                </div>
                <div>
                  <span style={{ ...unifiedStyles.label, marginBottom: 0 }}>Estudiantes:</span>
                  <span style={{ marginLeft: 8 }}>28 estudiantes activos</span>
                </div>
              </div>
            </div>
            
            <button style={{
              ...unifiedStyles.button,
              background: 'linear-gradient(90deg, #1976d2 60%, #2196f3 100%)',
              color: '#fff'
            }}>
              <i className="fas fa-plus" style={{ marginRight: 8 }}></i>
              Nueva Clase
            </button>
          </section>
        );
        
      case 'evaluaciones':
        return (
          <section style={{
            background: '#fff',
            borderRadius: 14,
            padding: 24,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1.5px solid #e8f4fd'
          }}>
            <h3 style={{
              ...unifiedStyles.sectionTitle,
              fontSize: unifiedTypography.fontSize.large,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center'
            }}>
              <i className="fas fa-clipboard-check" style={{ marginRight: 12, color: '#4caf50' }}></i>
              Sistema de Evaluaciones
            </h3>
            
            {/* Centro de evaluaciones */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fffe 80%, #e8f5e8 100%)',
              border: '1.5px solid #d0f0c0',
              borderRadius: 12,
              padding: 20,
              marginBottom: 16
            }}>
              <h4 style={{
                fontFamily: unifiedTypography.fontFamily,
                fontSize: unifiedTypography.fontSize.medium,
                fontWeight: unifiedTypography.fontWeight.bold,
                color: '#2e7d32',
                marginBottom: 12
              }}>
                Evaluaciones Pendientes
              </h4>
              
              <div style={{ marginBottom: 12 }}>
                <div style={{
                  background: '#fff',
                  border: '1px solid #d0f0c0',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <strong>Examen de Álgebra</strong>
                    <span style={{ fontSize: unifiedTypography.fontSize.small, color: '#666' }}>
                      Pendiente revisión
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: unifiedTypography.fontSize.small }}>
                    28 estudiantes por evaluar - Fecha límite: 30/01/2024
                  </p>
                </div>
                
                <div style={{
                  background: '#fff',
                  border: '1px solid #d0f0c0',
                  borderRadius: 8,
                  padding: 12
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <strong>Taller de Trigonometría</strong>
                    <span style={{ fontSize: unifiedTypography.fontSize.small, color: '#666' }}>
                      En progreso
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: unifiedTypography.fontSize.small }}>
                    15 de 28 estudiantes evaluados
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{
                ...unifiedStyles.button,
                background: 'transparent',
                color: '#1976d2',
                border: '1px solid #1976d2'
              }}>
                <i className="fas fa-clipboard-list" style={{ marginRight: 8 }}></i>
                Ver Todas
              </button>
              <button style={{
                ...unifiedStyles.button,
                background: 'linear-gradient(90deg, #1976d2 60%, #2196f3 100%)',
                color: '#fff'
              }}>
                <i className="fas fa-plus" style={{ marginRight: 8 }}></i>
                Nueva Evaluación
              </button>
            </div>
          </section>
        );
        
      default:
        return (
          <section style={{
            background: '#fff',
            borderRadius: 14,
            padding: 24,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1.5px solid #e8f4fd'
          }}>
            <h3 style={unifiedStyles.sectionTitle}>Contenido en desarrollo</h3>
            <p>Esta sección está siendo desarrollada.</p>
          </section>
        );
    }
  };

  return (
    <div className="teacher-dashboard-html">
      <header className="header-main-html">
        <div className="header-logo-title-html">
          <img src={logo} alt="PrediVersa Logo" className="header-logo-img-html" />
          <span className="header-title-html">Panel del Profesor</span>
        </div>
        <div className="header-user-actions-html">
          <span className="header-user-name-html">
            <i className="fas fa-user-circle" style={{ marginRight: 8, color: "#1976d2" }}></i>
            {userData.name} {userData.lastName}
          </span>
          <button
            className="header-btn-html"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </header>
      
      <main style={{ 
        paddingTop: 80, 
        paddingLeft: 40, 
        paddingRight: 40, 
        fontFamily: unifiedTypography.fontFamily,
        background: '#fafdff',
        minHeight: '100vh'
      }}>
        {/* Header de bienvenida premium */}
        <section style={{
          background: 'linear-gradient(135deg, #fafdff 80%, #fff3e0 100%)',
          border: '1.5px solid #d0d7e6',
          borderRadius: 14,
          padding: 24,
          marginBottom: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.16)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)';
        }}>
          <div>
            <h1 style={{ 
              ...unifiedStyles.sectionTitle,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center'
            }}>
              <i className="fas fa-chalkboard-teacher" style={{ marginRight: 16, fontSize: 36, color: '#1976d2' }}></i>
              Bienvenido, {userData.name}
            </h1>
            <p style={{
              ...unifiedStyles.subtitle,
              color: '#666',
              margin: 0
            }}>
              Gestiona tus clases y acompaña el aprendizaje de tus estudiantes.
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #1976d2 60%, #2196f3 100%)',
            borderRadius: 50,
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="fas fa-graduation-cap" style={{ fontSize: 32, color: '#fff' }}></i>
          </div>
        </section>

        {/* Navegación de pestañas premium */}
        <nav style={{
          background: '#fff',
          borderRadius: 14,
          padding: '8px 16px',
          marginBottom: 32,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '1.5px solid #e8f4fd'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8
          }}>
            {['clases', 'evaluaciones'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: unifiedTypography.fontFamily,
                  fontSize: unifiedTypography.fontSize.medium,
                  fontWeight: activeTab === tab ? unifiedTypography.fontWeight.bold : unifiedTypography.fontWeight.medium,
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: activeTab === tab 
                    ? 'linear-gradient(135deg, #1976d2 60%, #2196f3 100%)' 
                    : 'transparent',
                  color: activeTab === tab ? '#fff' : '#666',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <i className={`fas ${getTabIcon(tab)}`} style={{ marginRight: 8 }}></i>
                {getTabTitle(tab)}
              </button>
            ))}
          </div>
        </nav>

        {/* Contenido principal de pestañas */}
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 1 }}>
            {renderTabContent()}
          </div>

          {/* Panel lateral premium */}
          <aside style={{
            width: 320,
            background: '#fff',
            borderRadius: 14,
            padding: 24,
            height: 'fit-content',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            border: '1.5px solid #e8f4fd',
            position: 'sticky',
            top: 24
          }}>
            <h3 style={{
              ...unifiedStyles.sectionTitle,
              fontSize: unifiedTypography.fontSize.large,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center'
            }}>
              <i className="fas fa-user-tie" style={{ marginRight: 12, color: '#1976d2' }}></i>
              Mi Perfil Docente
            </h3>

            {/* Info del docente */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fffe 80%, #e8f5e8 100%)',
              border: '1.5px solid #d0f0c0',
              borderRadius: 12,
              padding: 20,
              marginBottom: 24
            }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4caf50 60%, #8bc34a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  border: '3px solid #fff',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                }}>
                  <i className="fas fa-chalkboard-teacher" style={{ fontSize: 28, color: '#fff' }}></i>
                </div>
                <h4 style={{
                  fontFamily: unifiedTypography.fontFamily,
                  fontSize: unifiedTypography.fontSize.medium,
                  fontWeight: unifiedTypography.fontWeight.bold,
                  color: '#2e7d32',
                  margin: '0 0 4px 0'
                }}>
                  {userData.name} {userData.lastName}
                </h4>
                <p style={{
                  ...unifiedStyles.subtitle,
                  fontSize: unifiedTypography.fontSize.small,
                  color: '#666',
                  margin: 0
                }}>
                  {userData.subject} - {userData.grade}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #d0f0c0', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ ...unifiedStyles.label, margin: 0 }}>Clases activas:</span>
                  <span style={{ fontWeight: unifiedTypography.fontWeight.bold, color: '#2e7d32' }}>
                    3
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ ...unifiedStyles.label, margin: 0 }}>Estudiantes:</span>
                  <span style={{ fontWeight: unifiedTypography.fontWeight.bold, color: '#2e7d32' }}>
                    28
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ ...unifiedStyles.label, margin: 0 }}>Evaluaciones:</span>
                  <span style={{ 
                    background: '#ff9800', 
                    color: '#fff', 
                    padding: '2px 8px', 
                    borderRadius: 6,
                    fontSize: unifiedTypography.fontSize.small,
                    fontWeight: unifiedTypography.fontWeight.bold
                  }}>
                    2 pendientes
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div>
              <h4 style={{
                fontFamily: unifiedTypography.fontFamily,
                fontSize: unifiedTypography.fontSize.medium,
                fontWeight: unifiedTypography.fontWeight.bold,
                color: '#1976d2',
                marginBottom: 16
              }}>
                Acciones Rápidas
              </h4>

              <button style={{
                ...unifiedStyles.button,
                width: '100%',
                background: 'linear-gradient(90deg, #2196f3 60%, #03a9f4 100%)',
                color: '#fff',
                marginBottom: 12,
                fontSize: unifiedTypography.fontSize.small,
                justifyContent: 'flex-start'
              }}>
                <i className="fas fa-calendar-plus" style={{ marginRight: 8 }}></i>
                Programar Clase
              </button>

              <button style={{
                ...unifiedStyles.button,
                width: '100%',
                background: 'linear-gradient(90deg, #ff9800 60%, #ffc107 100%)',
                color: '#fff',
                marginBottom: 12,
                fontSize: unifiedTypography.fontSize.small,
                justifyContent: 'flex-start'
              }}>
                <i className="fas fa-clipboard-check" style={{ marginRight: 8 }}></i>
                Nueva Evaluación
              </button>

              <button style={{
                ...unifiedStyles.button,
                width: '100%',
                background: 'linear-gradient(90deg, #9c27b0 60%, #e91e63 100%)',
                color: '#fff',
                marginBottom: 12,
                fontSize: unifiedTypography.fontSize.small,
                justifyContent: 'flex-start'
              }}>
                <i className="fas fa-book-open" style={{ marginRight: 8 }}></i>
                Recursos
              </button>

              <button style={{
                ...unifiedStyles.button,
                width: '100%',
                background: 'linear-gradient(90deg, #607d8b 60%, #90a4ae 100%)',
                color: '#fff',
                fontSize: unifiedTypography.fontSize.small,
                justifyContent: 'flex-start'
              }}
              onClick={openSettings}
              >
                <i className="fas fa-user-cog" style={{ marginRight: 8 }}></i>
                Editar Perfil
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* SettingsPanel para configuración del perfil */}
      {showSettings && (
        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          userProfile={teacherProfileState}
          onSave={handleSettingsSave}
        />
      )}
    </div>
  );
}

export default TeacherDashboard;
