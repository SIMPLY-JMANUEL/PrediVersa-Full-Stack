import React, { useState, useEffect } from 'react';
import SystemStatus from './components/SystemStatus';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo-prediversa.png';
import './HeaderDashboard.css';
import './components/AdminDashboard.css';
import '../../styles/main.css'; // Sistema CSS unificado
import './_dashboard-variables.css'; // Variables CSS centralizadas
import './AdminDashboard.css';
import SettingsPanel from '../../components/SettingsPanel.jsx';
import AlertarForm from './components/AlertarForm';
import ReportesForm from './components/ReportesForm';
import RemisionForm from './components/RemisionForm';
import SeguimientoForm from './components/SeguimientoForm';
import PqrAdminForm from './components/PqrAdminForm';
import PqrSeguimientoForm from './components/PqrSeguimientoForm';
import SoporteForm from './components/SoporteForm';
import UserManagement from './components/UserManagement';
import { useAdminDashboard } from '../../hooks/useDashboardData';
import useProfile from '../../hooks/useProfile';
import axios from 'axios';

// NUEVO ORDEN DE TABS: Crear usuario, Consultar/Modificar Usuario, Alerta, Reportes, Remisión de Atención, Seguimiento, Administrador de PQR, Seguimiento PQR, Comunicación y Soporte
const mainTabs = [
  { label: 'Crear usuario', key: 'crearusuario', icon: '👤' },
  {
    label: 'Consultar/Modificar Usuario',
    key: 'consultarmodificar',
    icon: '🔍',
  },
  { label: 'Alerta', key: 'alertar', icon: '🚨' },
  { label: 'Reportes', key: 'reportes', icon: '📊' },
  { label: 'Remisión de Atención', key: 'remision', icon: '🏥' },
  { label: 'Seguimiento', key: 'seguimiento', icon: '📋' },
  { label: 'Administrador de PQR', key: 'pqradmin', icon: '📝' },
  { label: 'Seguimiento PQR', key: 'pqrseguimiento', icon: '🔍' },
  { label: 'Comunicación y Soporte', key: 'soporte', icon: '💬' },
];

// Opciones para los campos desplegables
const TIPO_DOCUMENTO_OPTIONS = [
  'Cédula de Ciudadanía',
  'Tarjeta de Identidad',
  'Registro Civil',
  'Cédula de Extranjería',
  'Permiso Especial de Permanencia',
  'Permiso por Protección Temporal',
];

const SEXO_OPTIONS = ['Masculino', 'Femenino'];

const EPS_OPTIONS = [
  'Coosalud',
  'Nueva EPS',
  'Mutual Ser',
  'Salud Mía',
  'Aliansalud',
  'Salud Total',
  'Sanitas',
  'Sura',
  'Famisanar',
  'SOS (Servicio Occidental de Salud)',
  'Comfenalco Valle',
  'Compensar',
  'EPM (Empresas Públicas de Medellín)',
  'Fondo de Pasivo Social de Ferrocarriles Nacionales de Colombia',
  'Cajacopi Atlántico',
  'Capresoca',
  'Comfachocó',
  'Comfaoriente',
  'EPS Familiar de Colombia',
  'Asmet Salud',
  'Emssanar',
  'Capital Salud',
  'Savia Salud',
  'Dusakawi EPSI',
  'Asociación Indígena del Cauca EPSI',
  'Anas Wayuu EPSI',
  'Mallamas EPSI',
  'Pijaos Salud EPSI',
];

const CONDICION_ESPECIAL_OPTIONS = [
  'No Aplica',
  'Condición Médica',
  'Condición Sicológica',
];

const PERFIL_OPTIONS = [
  'Administrador',
  'Moderador',
  'Docente',
  'Acudiente',
  'Estudiante',
];

const ACTIVO_OPTIONS = ['SI', 'NO'];

function AdminDashboard() {
  const { error } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('crearusuario');
  const [showSettings, setShowSettings] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserEditor, setShowUserEditor] = useState(false);
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
    // Datos básicos del usuario conectados a la base de datos
    nombreCompleto: '', // Nombre_Completo - solo alfabético
    tipoDocumento: '', // Tipo_Documento - desplegable
    numeroDocumento: '', // Identificacion - numérico 5-15 caracteres
    fechaNacimiento: '', // Fecha_Nacimiento - tipo fecha
    edad: '', // Edad - calculado automáticamente
    sexo: '', // Sexo - desplegable Masculino/Femenino
    correoElectronico: '', // Correo - validación email
    direccion: '', // Direccion - alfanumérico
    epsSeguroMedico: '', // EPS - desplegable con opciones
    condicionEspecial: '', // Condicion_Especial - desplegable
    contactoEmergencia: '', // Contacto_Emergencia - solo alfabético
    telefonoFamiliar: '', // Numero_Contacto_Emergencia - numérico 10 caracteres
    usuarioActivo: 'SI', // Activo - desplegable SI/NO
    perfil: '', // Perfil - desplegable con roles
    contrasena: '', // Contrasena - campo con sugerencia
    usuario: '', // Usuario - campo alfanumérico único
    encontrado: false,
  });

  // Hook para manejar datos del dashboard con conexión a BD
  const {
    loading,
    error: dashboardError,
    users,
    stats,
    recentUsers,
    systemAlerts,
    searchUsers,
    createUser,
    refreshData,
  } = useAdminDashboard();

  // Estado para datos del usuario desde localStorage/memoria
  const [userData, setUserData] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      name: user.nombre || 'Administrador',
      lastName: '',
      role: user.rol || 'Administrador',
      documentType: 'Cédula de Ciudadanía',
      documentNumber: user.id?.toString() || '12345678',
      email: user.correo || 'admin@prediversa.com',
      phone: '+57 300 123 4567',
      address: 'Sede Principal PrediVersa',
      photo: null,
      contactoEmergencia: 'Contacto Principal',
      activo: true,
    };
  });

  // Estado de carga para los datos del usuario
  const [loadingUserData, setLoadingUserData] = useState(false);

  // Estado centralizado del perfil admin
  const [adminProfileState, setAdminProfileState] = useState(userData);
  // Estado para la foto de perfil del admin
  const [profilePhoto, setProfilePhoto] = useState(userData.photo);

  // Cargar todos los datos del dashboard al montar el componente
  React.useEffect(() => {
    console.log('🔄 AdminDashboard mounted, loading data...');
    refreshData();
  }, []); // Solo se ejecuta una vez al montar el componente

  // Redirección automática si no hay token
  React.useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('user');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Redirección automática si hay error de autenticación
  React.useEffect(() => {
    if (error || dashboardError) {
      console.error('Authentication error:', error || dashboardError);
      // No redirigir automáticamente en este sistema sin base de datos
    }
  }, [error, dashboardError, navigate]);

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

  // Función para buscar usuarios (simulada - adaptar a tu backend)
  const handleUserSearch = async (searchDocument = '', searchName = '') => {
    const docToSearch = searchDocument || userSearch;
    const nameToSearch = searchName || nameSearch;

    if (!docToSearch.trim() && !nameToSearch.trim()) {
      alert('Por favor ingrese un número de documento o nombre para buscar');
      return;
    }

    try {
      setLoadingSearch(true);

      // Simular búsqueda con usuarios de ejemplo
      const mockUsers = [
        {
          Id_Usuario: 1,
          Nombre_Completo: 'Juan Pérez García',
          Tipo_Documento: 'Cédula de Ciudadanía',
          Identificacion: '12345678',
          Correo: 'juan.perez@ejemplo.com',
          Numero_Contacto_Emergencia: '3001234567',
          Perfil: 'Estudiante',
          Activo: 'SI',
          Fecha_Nacimiento: '1990-01-15',
          Edad: 34,
          Sexo: 'Masculino',
          Direccion: 'Calle 123 #45-67',
          EPS: 'Sura',
          Condicion_Especial: 'No Aplica',
          Contacto_Emergencia: 'María García',
          Usuario: 'juan.perez',
        },
        {
          Id_Usuario: 2,
          Nombre_Completo: 'Ana María López',
          Tipo_Documento: 'Cédula de Ciudadanía',
          Identificacion: '87654321',
          Correo: 'ana.lopez@ejemplo.com',
          Numero_Contacto_Emergencia: '3009876543',
          Perfil: 'Profesor',
          Activo: 'SI',
          Fecha_Nacimiento: '1985-05-20',
          Edad: 39,
          Sexo: 'Femenino',
          Direccion: 'Carrera 98 #76-54',
          EPS: 'Nueva EPS',
          Condicion_Especial: 'No Aplica',
          Contacto_Emergencia: 'Carlos López',
          Usuario: 'ana.lopez',
        },
      ];

      // Filtrar resultados basados en los criterios de búsqueda
      const filtered = mockUsers.filter(
        user =>
          (!docToSearch || user.Identificacion.includes(docToSearch)) &&
          (!nameToSearch ||
            user.Nombre_Completo.toLowerCase().includes(
              nameToSearch.toLowerCase()
            ))
      );

      setSearchResults(filtered);
      if (filtered.length === 0) {
        alert('No se encontraron usuarios con los criterios especificados');
      }
    } catch (error) {
      console.error('Error searching users:', error);
      alert('Error de conexión. Intente nuevamente.');
    } finally {
      setLoadingSearch(false);
    }
  };

  // Función para seleccionar un usuario para editar
  const handleSelectUser = user => {
    setSelectedUser(user);
    setUserForm({
      nombreCompleto: user.Nombre_Completo || '',
      tipoDocumento: user.Tipo_Documento || '',
      numeroDocumento: user.Identificacion || '',
      fechaNacimiento: user.Fecha_Nacimiento
        ? user.Fecha_Nacimiento.split('T')[0]
        : '',
      edad: user.Edad || '',
      sexo: user.Sexo || '',
      correoElectronico: user.Correo || '',
      direccion: user.Direccion || '',
      epsSeguroMedico: user.EPS || '',
      condicionEspecial: user.Condicion_Especial || '',
      contactoEmergencia: user.Contacto_Emergencia || '',
      telefonoFamiliar: user.Numero_Contacto_Emergencia || '',
      perfil: user.Perfil || '',
      usuario: user.Usuario || '',
      usuarioActivo: user.Activo && user.Activo.trim() === 'SI' ? 'SI' : 'NO',
      contrasena: '',
      encontrado: true,
    });
    setShowUserEditor(true);
  };

  // Función para actualizar usuario
  const handleUpdateUser = async e => {
    e.preventDefault();

    if (!selectedUser) {
      alert('No hay usuario seleccionado para actualizar');
      return;
    }

    // Validaciones básicas
    if (
      !userForm.nombreCompleto ||
      !userForm.tipoDocumento ||
      !userForm.numeroDocumento ||
      !userForm.fechaNacimiento ||
      !userForm.sexo ||
      !userForm.correoElectronico ||
      !userForm.direccion ||
      !userForm.epsSeguroMedico ||
      !userForm.condicionEspecial ||
      !userForm.contactoEmergencia ||
      !userForm.telefonoFamiliar ||
      !userForm.perfil ||
      !userForm.usuario ||
      !userForm.usuarioActivo
    ) {
      alert('Por favor complete todos los campos obligatorios marcados con *');
      return;
    }

    try {
      // Simular actualización exitosa
      alert('Usuario actualizado correctamente');
      setShowUserEditor(false);
      setSelectedUser(null);
      // Refrescar resultados de búsqueda
      handleUserSearch();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error al actualizar usuario');
    }
  };

  // Función para limpiar búsqueda
  const handleClearSearch = () => {
    setUserSearch('');
    setNameSearch('');
    setSearchResults([]);
    setSelectedUser(null);
    setShowUserEditor(false);
  };

  // useEffect para calcular edad cuando cambia fecha de nacimiento
  useEffect(() => {
    if (userForm.fechaNacimiento) {
      const today = new Date();
      const birthDate = new Date(userForm.fechaNacimiento);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      setUserForm(prev => ({
        ...prev,
        edad: age,
      }));
    }
  }, [userForm.fechaNacimiento]);

  const handleClearUser = () => {
    setUserForm({
      nombreCompleto: '',
      tipoDocumento: '',
      numeroDocumento: '',
      fechaNacimiento: '',
      edad: '',
      sexo: '',
      correoElectronico: '',
      direccion: '',
      epsSeguroMedico: '',
      condicionEspecial: '',
      contactoEmergencia: '',
      telefonoFamiliar: '',
      usuarioActivo: 'SI',
      perfil: '',
      contrasena: '',
      usuario: '',
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
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  const handleUserFormSubmit = async e => {
    e.preventDefault();

    try {
      // Validaciones básicas
      if (
        !userForm.nombreCompleto ||
        !userForm.numeroDocumento ||
        !userForm.correoElectronico ||
        !userForm.usuario ||
        !userForm.perfil
      ) {
        alert(
          'Por favor, complete todos los campos obligatorios marcados con *'
        );
        return;
      }

      console.log('📝 Enviando usuario a SQL Server...', userForm);

      // Llamada real a la API de SQL Server
      const response = await axios.post(
        '/api/admin/users',
        {
          nombre: userForm.nombreCompleto,
          correo: userForm.correoElectronico,
          usuario: userForm.usuario,
          password: userForm.numeroDocumento, // Usar documento como contraseña temporal
          rol: userForm.perfil,
          telefono: userForm.telefono || '',
          edad: userForm.edad || null,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        alert(
          `✅ Usuario creado exitosamente en SQL Server!\n\nNombre: ${userForm.nombreCompleto}\nUsuario: ${userForm.usuario}\nCorreo: ${userForm.correoElectronico}\nPerfil: ${userForm.perfil}\nID: ${response.data.data.id}`
        );

        // Limpiar el formulario después del éxito
        handleClearUser();

        // Recargar datos si es necesario
        console.log(
          '✅ Usuario guardado en SQL Server con ID:',
          response.data.data.id
        );
      } else {
        throw new Error(response.data.msg || 'Error desconocido');
      }
    } catch (error) {
      console.error('❌ Error creating user:', error);
      const errorMsg =
        error.response?.data?.msg || error.message || 'Error al crear usuario';
      alert(`❌ Error al crear usuario: ${errorMsg}`);
    }
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

  console.log('📊 Dashboard data:', { stats, recentUsers, systemAlerts });

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
              {loadingUserData ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#666',
                    fontSize: '14px',
                  }}
                >
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{ marginRight: '8px' }}
                  ></i>
                  Cargando datos...
                </div>
              ) : (
                <>
                  <div className="info-row">
                    <span>
                      <strong>Nombre Completo:</strong> {adminProfileState.name}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>
                      <strong>Perfil:</strong> {adminProfileState.role}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>
                      <strong>Tipo de Documento:</strong>{' '}
                      {adminProfileState.documentType}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>
                      <strong>Número de Documento:</strong>{' '}
                      {adminProfileState.documentNumber || 'No disponible'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>
                      <strong>Correo Electrónico:</strong>{' '}
                      {adminProfileState.email || 'No disponible'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>
                      <strong>Teléfono Personal:</strong>{' '}
                      {adminProfileState.phone || 'No disponible'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>
                      <strong>Dirección:</strong>{' '}
                      {adminProfileState.address || 'No disponible'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>
                      <strong>Estado:</strong>
                      <span
                        style={{
                          color: adminProfileState.activo
                            ? '#4caf50'
                            : '#f44336',
                          fontWeight: 'bold',
                          marginLeft: '5px',
                        }}
                      >
                        {adminProfileState.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </span>
                  </div>
                </>
              )}
            </section>
            <section className="system-status-container">
              <SystemStatus />
            </section>
            <section className="stats-container">
              <h3>
                <i className="fas fa-chart-bar" /> Estadísticas del Sistema
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{ marginRight: '8px' }}
                  />
                  Cargando estadísticas...
                </div>
              ) : (
                <>
                  <div className="stat-row">
                    <i className="fas fa-users" />
                    <span>
                      <strong>Total Usuarios:</strong> {stats?.totalUsers || 0}
                    </span>
                  </div>
                  <div className="stat-row">
                    <i className="fas fa-user-graduate" />
                    <span>
                      <strong>Estudiantes:</strong> {stats?.totalStudents || 0}
                    </span>
                  </div>
                  <div className="stat-row">
                    <i className="fas fa-chalkboard-teacher" />
                    <span>
                      <strong>Profesores:</strong> {stats?.totalTeachers || 0}
                    </span>
                  </div>
                  <div className="stat-row">
                    <i className="fas fa-user-friends" />
                    <span>
                      <strong>Padres:</strong> {stats?.totalParents || 0}
                    </span>
                  </div>
                  <div className="stat-row">
                    <i className="fas fa-clipboard-list" />
                    <span>
                      <strong>Reportes Recientes:</strong>{' '}
                      {stats?.recentReports || 0}
                    </span>
                  </div>
                  <div className="stat-row">
                    <i className="fas fa-exclamation-triangle" />
                    <span>
                      <strong>PQRs Pendientes:</strong>{' '}
                      {stats?.pendingPQRs || 0}
                    </span>
                  </div>
                </>
              )}
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <button
                  onClick={refreshData}
                  style={{
                    background: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '0.9em',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.target.style.background = '#1976d2')}
                  onMouseLeave={e => (e.target.style.background = '#2196f3')}
                >
                  <i className="fas fa-sync-alt" /> Actualizar
                </button>
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
                
                /* RESPONSIVE FORMS */
                @media (max-width: 768px) {
                  .user-create-section,
                  .premium-tab-section {
                    padding: 20px 16px !important;
                    margin-bottom: 20px !important;
                  }
                  
                  .main-html {
                    flex-direction: column !important;
                    height: auto !important;
                  }
                  
                  .dashboard-sidebar {
                    min-width: auto !important;
                    max-width: none !important;
                    margin-bottom: 20px !important;
                  }
                  
                  .right-panel-html {
                    padding: 12px 16px !important;
                  }
                }
                
                @media (max-width: 480px) {
                  .user-create-section,
                  .premium-tab-section {
                    padding: 16px 12px !important;
                    border-radius: 12px !important;
                  }
                  
                  .dashboard-tabs .tab-btn {
                    min-width: 80px !important;
                    font-size: 0.85em !important;
                    padding: 8px 0 6px 0 !important;
                  }
                }
              `}</style>
            </nav>

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
              {/* Crear Usuario */}
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
                      <i
                        className="fas fa-user-plus"
                        style={{ fontSize: 22 }}
                      />
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
                </section>
              )}

              {/* Consultar/Modificar Usuario */}
              {activeTab === 'consultarmodificar' && (
                <section
                  className="premium-tab-section"
                  style={{
                    background:
                      'linear-gradient(135deg, #fafdff 80%, #e3f2fd 100%)',
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
                      <i
                        className="fas fa-user-edit"
                        style={{ fontSize: 22 }}
                      />
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
                        Consultar/Modificar Usuario
                      </h2>
                      <div
                        style={{
                          color: '#4a4a4a',
                          fontSize: '1.07em',
                          marginTop: 2,
                          fontWeight: 400,
                        }}
                      >
                        Busca y modifica información de usuarios del sistema
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: '#bbdefb',
                      margin: '18px 0 32px 0',
                      borderRadius: 2,
                    }}
                  />

                  {/* Formulario de búsqueda */}
                  <div
                    style={{
                      background: '#fff',
                      padding: '24px 28px',
                      borderRadius: 16,
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.05)',
                      marginBottom: 24,
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
                          background: '#2196f3',
                          color: '#fff',
                          borderRadius: '50%',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 12,
                        }}
                      >
                        <i className="fas fa-search" style={{ fontSize: 18 }} />
                      </div>
                      <h3
                        style={{
                          color: '#2196f3',
                          fontWeight: 700,
                          fontSize: '1.2em',
                          margin: 0,
                        }}
                      >
                        Buscar Usuario
                      </h3>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 16,
                        marginBottom: 20,
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
                          Buscar por Documento:
                        </label>
                        <input
                          type="text"
                          placeholder="Número de documento"
                          value={userSearch}
                          onChange={e => setUserSearch(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #ddd',
                            borderRadius: 8,
                            fontSize: '1em',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box',
                          }}
                        />
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
                          Buscar por Nombre:
                        </label>
                        <input
                          type="text"
                          placeholder="Nombre completo"
                          value={nameSearch}
                          onChange={e => setNameSearch(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #ddd',
                            borderRadius: 8,
                            fontSize: '1em',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        type="button"
                        onClick={() => handleUserSearch()}
                        disabled={loadingSearch}
                        style={{
                          background: loadingSearch
                            ? '#ccc'
                            : 'linear-gradient(90deg, #2196f3 60%, #42a5f5 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '12px 24px',
                          fontWeight: 600,
                          cursor: loadingSearch ? 'not-allowed' : 'pointer',
                          transition: 'transform 0.1s, box-shadow 0.2s',
                          fontSize: '1em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <i
                          className={
                            loadingSearch
                              ? 'fas fa-spinner fa-spin'
                              : 'fas fa-search'
                          }
                        />
                        {loadingSearch ? 'Buscando...' : 'Buscar'}
                      </button>
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        style={{
                          background: '#f5f5f5',
                          color: '#666',
                          border: '1px solid #ddd',
                          borderRadius: 8,
                          padding: '12px 20px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '1em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <i className="fas fa-eraser" />
                        Limpiar
                      </button>
                    </div>
                  </div>

                  {/* Resultados de búsqueda */}
                  <div
                    style={{
                      background: '#fff',
                      padding: '24px 28px',
                      borderRadius: 16,
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.05)',
                      minHeight: 200,
                    }}
                  >
                    {loadingSearch ? (
                      <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <i
                          className="fas fa-spinner fa-spin"
                          style={{
                            fontSize: 32,
                            color: '#2196f3',
                            marginBottom: 16,
                          }}
                        />
                        <p style={{ margin: 0, color: '#666' }}>
                          Buscando usuarios...
                        </p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div>
                        <h3 style={{ color: '#2196f3', marginBottom: 20 }}>
                          Resultados encontrados ({searchResults.length})
                        </h3>
                        <div
                          style={{
                            display: 'grid',
                            gap: 16,
                            maxHeight: 400,
                            overflowY: 'auto',
                            paddingRight: 8,
                          }}
                        >
                          {searchResults.map(user => (
                            <div
                              key={user.Id_Usuario}
                              style={{
                                background: '#f8f9fa',
                                padding: '16px 20px',
                                borderRadius: 12,
                                border: '1px solid #e9ecef',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginBottom: 8,
                                  }}
                                >
                                  <div
                                    style={{
                                      background: '#2196f3',
                                      color: '#fff',
                                      borderRadius: '50%',
                                      width: 32,
                                      height: 32,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.9em',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {user.Nombre_Completo?.charAt(
                                      0
                                    )?.toUpperCase() || 'U'}
                                  </div>
                                  <div>
                                    <h4
                                      style={{
                                        margin: 0,
                                        color: '#333',
                                        fontSize: '1.1em',
                                      }}
                                    >
                                      {user.Nombre_Completo || 'Sin nombre'}
                                    </h4>
                                    <p
                                      style={{
                                        margin: 0,
                                        color: '#666',
                                        fontSize: '0.9em',
                                      }}
                                    >
                                      {user.Tipo_Documento}:{' '}
                                      {user.Identificacion}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: 20,
                                    fontSize: '0.85em',
                                    color: '#666',
                                  }}
                                >
                                  <span>
                                    <i
                                      className="fas fa-envelope"
                                      style={{ marginRight: 6 }}
                                    />
                                    {user.Correo || 'Sin email'}
                                  </span>
                                  <span>
                                    <i
                                      className="fas fa-user-tag"
                                      style={{ marginRight: 6 }}
                                    />
                                    {user.Perfil || 'Sin perfil'}
                                  </span>
                                  <span
                                    style={{
                                      color:
                                        user.Activo === 'SI'
                                          ? '#4caf50'
                                          : '#f44336',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <i
                                      className={`fas ${
                                        user.Activo === 'SI'
                                          ? 'fa-check-circle'
                                          : 'fa-times-circle'
                                      }`}
                                      style={{ marginRight: 6 }}
                                    />
                                    {user.Activo === 'SI'
                                      ? 'Activo'
                                      : 'Inactivo'}
                                  </span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleSelectUser(user);
                                  }}
                                  style={{
                                    background: '#2196f3',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 6,
                                    padding: '8px 16px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '0.9em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                  }}
                                >
                                  <i className="fas fa-edit" />
                                  Editar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', color: '#888' }}>
                        <div
                          style={{
                            background: '#f0f0f0',
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                          }}
                        >
                          <i
                            className="fas fa-users"
                            style={{ fontSize: 36, color: '#bbb' }}
                          />
                        </div>
                        <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>
                          Resultados de Búsqueda
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.95em' }}>
                          Utiliza los filtros de búsqueda para encontrar
                          usuarios
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

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

      {/* Modal para editar usuario */}
      {showUserEditor && selectedUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowUserEditor(false)}
        >
          <div
            style={{
              background: '#fff',
              padding: '32px',
              borderRadius: 16,
              maxWidth: '800px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <h2 style={{ margin: 0, color: '#2196f3', fontWeight: 700 }}>
                Editar Usuario
              </h2>
              <button
                type="button"
                onClick={() => setShowUserEditor(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: 0,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'all 0.2s',
                }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 20,
                }}
              >
                {/* Campos básicos del formulario de edición */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: 6,
                      fontWeight: 500,
                      color: '#333',
                    }}
                  >
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={userForm.nombreCompleto}
                    onChange={e =>
                      setUserForm({
                        ...userForm,
                        nombreCompleto: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      fontSize: '1em',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: 6,
                      fontWeight: 500,
                      color: '#333',
                    }}
                  >
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={userForm.correoElectronico}
                    onChange={e =>
                      setUserForm({
                        ...userForm,
                        correoElectronico: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      fontSize: '1em',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: 6,
                      fontWeight: 500,
                      color: '#333',
                    }}
                  >
                    Perfil *
                  </label>
                  <select
                    value={userForm.perfil}
                    onChange={e =>
                      setUserForm({ ...userForm, perfil: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      fontSize: '1em',
                      boxSizing: 'border-box',
                    }}
                    required
                  >
                    <option value="">Seleccionar perfil</option>
                    {PERFIL_OPTIONS.map(perfil => (
                      <option key={perfil} value={perfil}>
                        {perfil}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  marginTop: 24,
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowUserEditor(false)}
                  style={{
                    background: '#f5f5f5',
                    color: '#666',
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background:
                      'linear-gradient(90deg, #2196f3 60%, #42a5f5 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <i className="fas fa-save" /> Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
