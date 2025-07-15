import React, { useState, useEffect } from 'react';
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

// NUEVO ORDEN DE TABS: Crear usuario, Consultar/Modificar Usuario, Alerta, Reportes, Remisión de Atención, Seguimiento, Administrador de PQR, Seguimiento PQR, Comunicación y Soporte
const mainTabs = [
  { label: 'Crear usuario', key: 'crearusuario' },
  { label: 'Consultar/Modificar Usuario', key: 'consultarmodificar' },
  { label: 'Alerta', key: 'alertar' },
  { label: 'Reportes', key: 'reportes' },
  { label: 'Remisión de Atención', key: 'remision' },
  { label: 'Seguimiento', key: 'seguimiento' },
  { label: 'Administrador de PQR', key: 'pqradmin' },
  { label: 'Seguimiento PQR', key: 'pqrseguimiento' },
  { label: 'Comunicación y Soporte', key: 'soporte' },
];

// Opciones para los campos desplegables
const TIPO_DOCUMENTO_OPTIONS = [
  'Cédula de Ciudadanía',
  'Tarjeta de Identidad',
  'Registro Civil',
  'Cédula de Extranjería',
  'Permiso Especial de Permanencia',
  'Permiso por Protección Temporal'
];

const SEXO_OPTIONS = [
  'Masculino',
  'Femenino'
];

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
  'Pijaos Salud EPSI'
];

const CONDICION_ESPECIAL_OPTIONS = [
  'No Aplica',
  'Condición Médica',
  'Condición Sicológica'
];

const PERFIL_OPTIONS = [
  'Administrador',
  'Moderador',
  'Docente',
  'Acudiente',
  'Estudiante'
];

const ACTIVO_OPTIONS = [
  'SI',
  'NO'
];

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
    // telefono: '', // Telefono - campo no existe en la tabla
    direccion: '', // Direccion - alfanumérico
    epsSeguroMedico: '', // EPS - desplegable con opciones
    condicionEspecial: '', // Condicion_Especial - desplegable
    // descripcionCondicion: '', // Descripcion_Condicion - campo no existe en la tabla
    contactoEmergencia: '', // Contacto_Emergencia - solo alfabético
    telefonoFamiliar: '', // Numero_Contacto_Emergencia - numérico 10 caracteres
    usuarioActivo: 'SI', // Activo - desplegable SI/NO
    perfil: '', // Perfil - desplegable con roles
    contrasena: '', // Contrasena - campo con sugerencia
    usuario: '', // Usuario - campo alfanumérico único
    encontrado: false,
  });

  // Estado para datos del usuario desde la base de datos
  const [userData, setUserData] = useState({
    name: localStorage.getItem('nombre') || 'Administrador',
    lastName: '',
    role: 'Administrador',
    documentType: 'Cédula de Ciudadanía',
    documentNumber: '',
    email: '',
    phone: '',
    address: '',
    photo: '',
    contactoEmergencia: '',
    activo: true
  });

  // Estado de carga para los datos del usuario
  const [loadingUserData, setLoadingUserData] = useState(true);

  // Función para cargar datos del usuario desde la base de datos
  const loadUserDataFromDB = async () => {
    try {
      setLoadingUserData(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5001/api/profile/admin/current-user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const dbUser = result.data;
          setUserData({
            name: dbUser.nombreCompleto || 'Administrador',
            lastName: '',
            role: dbUser.perfil || 'Administrador',
            documentType: dbUser.tipoDocumento || 'Cédula de Ciudadanía',
            documentNumber: dbUser.identificacion || '',
            email: dbUser.correo || '',
            phone: dbUser.telefono || '',
            address: dbUser.direccion || '',
            photo: dbUser.foto || '',
            contactoEmergencia: dbUser.contactoEmergencia || '',
            activo: dbUser.activo
          });
        }
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Error cargando datos del usuario:', response.statusText);
      }
    } catch (error) {
      console.error('Error conectando con la base de datos:', error);
    } finally {
      setLoadingUserData(false);
    }
  };

  // Estado centralizado del perfil admin
  const [adminProfileState, setAdminProfileState] = useState(userData);
  // Estado para la foto de perfil del admin
  const [profilePhoto, setProfilePhoto] = useState(userData.photo);

  // Estado para las estadísticas del dashboard
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    usuariosInactivos: 0,
    estudiantes: 0,
    padres: 0,
    profesores: 0,
    moderadores: 0,
    administradores: 0,
    evaluaciones: 0,
    alertas: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Cargar datos del usuario al montar el componente
  React.useEffect(() => {
    loadUserDataFromDB();
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Actualizar adminProfileState cuando userData cambie
  React.useEffect(() => {
    setAdminProfileState(userData);
    setProfilePhoto(userData.photo);
  }, [userData]);

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

  // Función para buscar usuarios conectada a la base de datos
  const handleUserSearch = async (searchDocument = '', searchName = '') => {
    // Usar parámetros o los estados actuales
    const docToSearch = searchDocument || userSearch;
    const nameToSearch = searchName || nameSearch;
    
    if (!docToSearch.trim() && !nameToSearch.trim()) {
      alert('Por favor ingrese un número de documento o nombre para buscar');
      return;
    }

    try {
      setLoadingSearch(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Construir parámetros de búsqueda
      const params = new URLSearchParams();
      if (docToSearch.trim()) params.append('documento', docToSearch.trim());
      if (nameToSearch.trim()) params.append('nombre', nameToSearch.trim());

      const response = await fetch(`http://localhost:5001/api/users/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSearchResults(result.data);
          if (result.data.length === 0) {
            alert('No se encontraron usuarios con los criterios especificados');
          }
        } else {
          alert(result.msg || 'Error al buscar usuarios');
        }
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const error = await response.json();
        alert(error.msg || 'Error al buscar usuarios');
      }
    } catch (error) {
      console.error('Error conectando con la base de datos:', error);
      alert('Error de conexión. Verifique su conexión a internet.');
    } finally {
      setLoadingSearch(false);
    }
  };

  // Función para seleccionar un usuario para editar
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      nombreCompleto: user.Nombre_Completo || '',
      tipoDocumento: user.Tipo_Documento || '',
      numeroDocumento: user.Identificacion || '',
      fechaNacimiento: user.Fecha_Nacimiento ? user.Fecha_Nacimiento.split('T')[0] : '',
      edad: user.Edad || '',
      sexo: user.Sexo || '',
      correoElectronico: user.Correo || '',
      // telefono: user.Telefono || '', // Campo no existe en la tabla
      direccion: user.Direccion || '',
      epsSeguroMedico: user.EPS || '',
      condicionEspecial: user.Condicion_Especial || '',
      // descripcionCondicion: user.Descripcion_Condicion || '', // Campo no existe en la tabla
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
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      alert('No hay usuario seleccionado para actualizar');
      return;
    }

    // Validaciones requeridas
    if (!userForm.nombreCompleto || !userForm.tipoDocumento || !userForm.numeroDocumento ||
        !userForm.fechaNacimiento || !userForm.sexo || !userForm.correoElectronico ||
        !userForm.direccion || !userForm.epsSeguroMedico || !userForm.condicionEspecial ||
        !userForm.contactoEmergencia || !userForm.telefonoFamiliar || !userForm.perfil ||
        !userForm.usuario || !userForm.usuarioActivo) {
      alert('Por favor complete todos los campos obligatorios marcados con *');
      return;
    }

    // Validaciones de formato
    const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!namePattern.test(userForm.nombreCompleto)) {
      alert('El nombre completo solo puede contener letras y espacios');
      return;
    }

    const documentPattern = /^\d{5,15}$/;
    if (!documentPattern.test(userForm.numeroDocumento)) {
      alert('El número de documento debe tener entre 5 y 15 números');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userForm.correoElectronico)) {
      alert('Por favor ingrese un correo electrónico válido');
      return;
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(userForm.telefonoFamiliar)) {
      alert('El teléfono de emergencia debe tener exactamente 10 números');
      return;
    }

    if (!namePattern.test(userForm.contactoEmergencia)) {
      alert('El contacto de emergencia solo puede contener letras y espacios');
      return;
    }

    const usernamePattern = /^[a-zA-Z0-9._-]+$/;
    if (!usernamePattern.test(userForm.usuario)) {
      alert('El usuario solo puede contener letras, números, puntos, guiones y guiones bajos');
      return;
    }

    if (userForm.usuario.length < 3 || userForm.usuario.length > 20) {
      alert('El usuario debe tener entre 3 y 20 caracteres');
      return;
    }

    if (userForm.contrasena && userForm.contrasena.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const updateData = {
        nombreCompleto: userForm.nombreCompleto,
        tipoDocumento: userForm.tipoDocumento,
        numeroDocumento: userForm.numeroDocumento,
        fechaNacimiento: userForm.fechaNacimiento,
        edad: userForm.edad,
        sexo: userForm.sexo,
        correoElectronico: userForm.correoElectronico,
        // telefono: userForm.telefono, // Campo no existe en la tabla
        direccion: userForm.direccion,
        epsSeguroMedico: userForm.epsSeguroMedico,
        condicionEspecial: userForm.condicionEspecial,
        // descripcionCondicion: userForm.descripcionCondicion, // Campo no existe en la tabla
        contactoEmergencia: userForm.contactoEmergencia,
        telefonoFamiliar: userForm.telefonoFamiliar,
        usuarioActivo: userForm.usuarioActivo,
        perfil: userForm.perfil,
        usuario: userForm.usuario,
      };

      // Solo incluir contraseña si se ha ingresado una nueva
      if (userForm.contrasena.trim()) {
        updateData.contrasena = userForm.contrasena;
      }

      const response = await fetch(`http://localhost:5001/api/users/${selectedUser.Id_Usuario}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('Usuario actualizado correctamente');
          setShowUserEditor(false);
          setSelectedUser(null);
          // Actualizar los resultados de búsqueda
          handleUserSearch();
        } else {
          alert(result.msg || 'Error al actualizar usuario');
        }
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const error = await response.json();
        alert(error.msg || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      alert('Error de conexión. Verifique su conexión a internet.');
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

  // Función para obtener estadísticas del dashboard
  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No se encontró token de autenticación');
        return;
      }

      const response = await fetch('http://localhost:5001/api/admin/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          totalUsuarios: data.totalUsuarios || 0,
          usuariosActivos: data.usuariosActivos || 0,
          usuariosInactivos: data.usuariosInactivos || 0,
          estudiantes: data.estudiantes || 0,
          padres: data.padres || 0,
          profesores: data.profesores || 0,
          moderadores: data.moderadores || 0,
          administradores: data.administradores || 0,
          evaluaciones: data.evaluaciones || 0,
          alertas: data.alertas || 0
        });
      } else if (response.status === 401) {
        console.error('Token expirado o inválido');
        navigate('/login');
      } else {
        console.error('Error al obtener estadísticas:', response.statusText);
      }
    } catch (error) {
      console.error('Error conectando con el backend:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    fetchDashboardStats();
  }, [navigate]);

  // useEffect para calcular edad cuando cambia fecha de nacimiento
  useEffect(() => {
    if (userForm.fechaNacimiento) {
      const today = new Date();
      const birthDate = new Date(userForm.fechaNacimiento);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setUserForm(prev => ({
        ...prev,
        edad: age
      }));
    }
  }, [userForm.fechaNacimiento]);

  const handleClearUser = () => {
    setUserForm({
      // Limpiar todos los campos del formulario
      nombreCompleto: '',
      tipoDocumento: '',
      numeroDocumento: '',
      fechaNacimiento: '',
      edad: '',
      sexo: '',
      correoElectronico: '',
      // telefono: '', // Campo no existe en la tabla
      direccion: '',
      epsSeguroMedico: '',
      condicionEspecial: '',
      // descripcionCondicion: '', // Campo no existe en la tabla
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

  // Función para calcular edad basada en fecha de nacimiento
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

  // Función para generar contraseña segura
  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Función para validar solo letras (sin números ni caracteres especiales)
  const validateAlphabetic = (value) => {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
  };

  // Función para validar números
  const validateNumeric = (value) => {
    return /^\d+$/.test(value);
  };

  // Función para validar email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleUserFormChange = e => {
    const { name, value } = e.target;
    let newValue = value;

    // Validaciones específicas por campo
    switch (name) {
      case 'nombreCompleto':
      case 'nombreFamiliarContacto':
        // Solo permitir letras y espacios
        if (value && !validateAlphabetic(value)) {
          return; // No actualizar si contiene números o caracteres especiales
        }
        break;
      
      case 'numeroDocumento':
        // Solo números, entre 5 y 15 caracteres
        if (value && (!validateNumeric(value) || value.length > 15)) {
          return;
        }
        break;
      
      case 'telefonoUsuario':
      case 'telefonoFamiliarContacto':
        // Solo números, exactamente 10 caracteres
        if (value && (!validateNumeric(value) || value.length > 10)) {
          return;
        }
        break;
      
      case 'fechaNacimiento':
        // Calcular edad automáticamente
        const edad = calculateAge(value);
        setUserForm(prev => ({ ...prev, [name]: value, edad }));
        return;
      
      case 'condicionEspecial':
        // Si es "No Aplica", no hay campo descripción en la tabla
        break;
      
      default:
        // Para otros campos no hay validación especial
        break;
    }

    setUserForm({ ...userForm, [name]: newValue });
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validaciones básicas antes de enviar
      if (!userForm.nombreCompleto || !userForm.numeroDocumento || !userForm.correoElectronico || !userForm.telefono || !userForm.usuario || !userForm.perfil) {
        alert('Por favor, complete todos los campos obligatorios marcados con *');
        return;
      }

      // Validar que el correo tenga formato válido
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userForm.correoElectronico)) {
        alert('Por favor, ingrese un correo electrónico válido');
        return;
      }

      // Validar que el teléfono tenga exactamente 10 dígitos
      if (userForm.telefono.length !== 10 || !/^\d+$/.test(userForm.telefono)) {
        alert('El teléfono debe tener exactamente 10 dígitos');
        return;
      }

      // Validar que el número de documento tenga entre 5 y 15 dígitos
      if (userForm.numeroDocumento.length < 5 || userForm.numeroDocumento.length > 15 || !/^\d+$/.test(userForm.numeroDocumento)) {
        alert('El número de documento debe tener entre 5 y 15 dígitos');
        return;
      }

      // Validar que el usuario tenga formato alfanumérico válido
      if (!/^[a-zA-Z0-9._-]+$/.test(userForm.usuario)) {
        alert('El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos');
        return;
      }

      // Validar descripción de condición si es requerida
      if (userForm.condicionEspecial && userForm.condicionEspecial !== 'No Aplica' && (!userForm.descripcionCondicion || userForm.descripcionCondicion.trim() === '')) {
        alert('La descripción de la condición es obligatoria cuando se selecciona una condición especial diferente a "No Aplica"');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('No se encontró token de autenticación. Por favor, inicie sesión nuevamente.');
        return;
      }

      // Enviar datos al backend
      const response = await fetch('http://localhost:5001/api/profile/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombreCompleto: userForm.nombreCompleto,
          tipoDocumento: userForm.tipoDocumento,
          numeroDocumento: userForm.numeroDocumento,
          fechaNacimiento: userForm.fechaNacimiento,
          edad: userForm.edad,
          sexo: userForm.sexo,
          correoElectronico: userForm.correoElectronico,
          telefono: userForm.telefono,
          direccion: userForm.direccion,
          eps: userForm.epsSeguroMedico,
          condicionEspecial: userForm.condicionEspecial,
          descripcionCondicion: userForm.descripcionCondicion,
          contactoEmergencia: userForm.contactoEmergencia,
          telefonoFamiliar: userForm.telefonoFamiliar,
          estadoActivo: userForm.usuarioActivo,
          perfil: userForm.perfil,
          contrasena: userForm.contrasena,
          usuario: userForm.usuario
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`✅ Usuario creado exitosamente!\n\nNombre: ${data.data.nombreCompleto}\nUsuario: ${data.data.usuario}\nCorreo: ${data.data.correoElectronico}\nPerfil: ${data.data.perfil}`);
        
        // Limpiar el formulario después del éxito
        handleClearUser();
      } else {
        // Manejar errores específicos de duplicados
        if (data.duplicateFields && data.duplicateFields.length > 0) {
          alert(`❌ Error: Ya existe un usuario con los siguientes datos:\n\n${data.duplicateFields.join('\n')}\n\nPor favor, verifique la información e intente nuevamente.`);
        } else {
          alert(`❌ Error al crear usuario: ${data.msg || 'Error desconocido'}`);
        }
      }
    } catch (error) {
      console.error('Error enviando datos al servidor:', error);
      alert('❌ Error de conexión al servidor. Por favor, verifique que el backend esté funcionando e intente nuevamente.');
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
              {loadingUserData ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '20px', 
                  color: '#666',
                  fontSize: '14px' 
                }}>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                  Cargando datos desde la base de datos...
                </div>
              ) : (
                <>
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
                      {adminProfileState.documentNumber || 'No disponible'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>
                      <strong>Correo:</strong> {adminProfileState.email || 'No disponible'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>
                      <strong>Teléfono:</strong> {adminProfileState.phone || 'No disponible'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>
                      <strong>Dirección:</strong> {adminProfileState.address || 'No disponible'}
                    </span>
                  </div>
                  {adminProfileState.contactoEmergencia && (
                    <div className="info-row">
                      <span>
                        <strong>Contacto de emergencia:</strong> {adminProfileState.contactoEmergencia}
                      </span>
                    </div>
                  )}
                  <div className="info-row">
                    <span>
                      <strong>Estado:</strong> 
                      <span style={{ 
                        color: adminProfileState.activo ? '#4caf50' : '#f44336',
                        fontWeight: 'bold',
                        marginLeft: '5px'
                      }}>
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
              {loadingStats ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }} />
                  Cargando estadísticas...
                </div>
              ) : (
                <>
                  <div className="stat-row">
                    <i className="fas fa-users" />
                    <span>
                      <strong>Total Usuarios:</strong> {stats.totalUsuarios.toLocaleString()}
                    </span>
                  </div>
                  <div className="stat-row">
                    <i className="fas fa-user-check" style={{ color: '#4caf50' }} />
                    <span>
                      <strong>Activos:</strong> {stats.usuariosActivos.toLocaleString()}
                    </span>
                  </div>
                  <div className="stat-row">
                    <i className="fas fa-user-times" style={{ color: '#f44336' }} />
                    <span>
                      <strong>Inactivos:</strong> {stats.usuariosInactivos.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ height: '1px', background: '#e0e0e0', margin: '10px 0' }} />
                  <div className="stat-row">
                    <i className="fas fa-user-graduate" />
                    <span>
                      <strong>Estudiantes:</strong> {stats.estudiantes.toLocaleString()}
                    </span>
                  </div>
                  <div className="stat-row">
                    <i className="fas fa-user-friends" />
                    <span>
                      <strong>Padres/Acudientes:</strong> {stats.padres.toLocaleString()}
                    </span>
                  </div>
                  <div className="stat-row">
                    <i className="fas fa-chalkboard-teacher" />
                    <span>
                      <strong>Profesores:</strong> {stats.profesores.toLocaleString()}
                    </span>
                  </div>
                  <div className="stat-row">
                    <i className="fas fa-user-shield" />
                    <span>
                      <strong>Moderadores:</strong> {stats.moderadores.toLocaleString()}
                    </span>
                  </div>
                  <div className="stat-row">
                    <i className="fas fa-user-cog" />
                    <span>
                      <strong>Administradores:</strong> {stats.administradores.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ height: '1px', background: '#e0e0e0', margin: '10px 0' }} />
                  <div className="stat-row">
                    <i className="fas fa-clipboard-list" />
                    <span>
                      <strong>Evaluaciones:</strong> {stats.evaluaciones.toLocaleString()}
                    </span>
                  </div>
                  <div className="stat-row">
                    <i className="fas fa-exclamation-triangle" />
                    <span>
                      <strong>Alertas:</strong> {stats.alertas.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <button
                  onClick={fetchDashboardStats}
                  style={{
                    background: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '0.9em',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.background = '#1976d2'}
                  onMouseLeave={e => e.target.style.background = '#2196f3'}
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
                      <i className="fas fa-user-edit" style={{ fontSize: 22 }} />
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
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
                          onChange={(e) => setUserSearch(e.target.value)}
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
                          onFocus={e => e.target.style.borderColor = '#2196f3'}
                          onBlur={e => e.target.style.borderColor = '#ddd'}
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
                          onChange={(e) => setNameSearch(e.target.value)}
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
                          onFocus={e => e.target.style.borderColor = '#2196f3'}
                          onBlur={e => e.target.style.borderColor = '#ddd'}
                        />
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        type="button"
                        onClick={() => handleUserSearch()}
                        disabled={loadingSearch}
                        style={{
                          background: loadingSearch ? '#ccc' : 'linear-gradient(90deg, #2196f3 60%, #42a5f5 100%)',
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
                        onMouseEnter={e => {
                          if (!loadingSearch) {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 16px 0 rgba(33, 150, 243, 0.3)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!loadingSearch) {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }
                        }}
                      >
                        <i className={loadingSearch ? "fas fa-spinner fa-spin" : "fas fa-search"} />
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
                        onMouseEnter={e => {
                          e.target.style.background = '#eeeeee';
                          e.target.style.borderColor = '#ccc';
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = '#f5f5f5';
                          e.target.style.borderColor = '#ddd';
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
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: '#2196f3', marginBottom: 16 }} />
                        <p style={{ margin: 0, color: '#666' }}>Buscando usuarios...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div>
                        <h3 style={{ color: '#2196f3', marginBottom: 20 }}>
                          Resultados encontrados ({searchResults.length})
                        </h3>
                        <div style={{ 
                          display: 'grid', 
                          gap: 16, 
                          maxHeight: 400, 
                          overflowY: 'auto',
                          paddingRight: 8
                        }}>
                          {searchResults.map((user, index) => (
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
                                cursor: 'pointer'
                              }}
                              onMouseEnter={e => {
                                e.target.style.background = '#e3f2fd';
                                e.target.style.borderColor = '#2196f3';
                              }}
                              onMouseLeave={e => {
                                e.target.style.background = '#f8f9fa';
                                e.target.style.borderColor = '#e9ecef';
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
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
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {user.Nombre_Completo?.charAt(0)?.toUpperCase() || 'U'}
                                  </div>
                                  <div>
                                    <h4 style={{ margin: 0, color: '#333', fontSize: '1.1em' }}>
                                      {user.Nombre_Completo || 'Sin nombre'}
                                    </h4>
                                    <p style={{ margin: 0, color: '#666', fontSize: '0.9em' }}>
                                      {user.Tipo_Documento}: {user.Identificacion}
                                    </p>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: 20, fontSize: '0.85em', color: '#666' }}>
                                  <span><i className="fas fa-envelope" style={{ marginRight: 6 }} />{user.Correo || 'Sin email'}</span>
                                  <span><i className="fas fa-phone" style={{ marginRight: 6 }} />{user.Numero_Contacto_Emergencia || 'Sin teléfono'}</span>
                                  <span><i className="fas fa-user-tag" style={{ marginRight: 6 }} />{user.Perfil || 'Sin perfil'}</span>
                                  <span style={{ 
                                    color: user.Activo === 'SI' ? '#4caf50' : '#f44336',
                                    fontWeight: 'bold'
                                  }}>
                                    <i className={`fas ${user.Activo === 'SI' ? 'fa-check-circle' : 'fa-times-circle'}`} style={{ marginRight: 6 }} />
                                    {user.Activo === 'SI' ? 'Activo' : 'Inactivo'}
                                  </span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
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
                                  onMouseEnter={e => {
                                    e.target.style.background = '#1976d2';
                                  }}
                                  onMouseLeave={e => {
                                    e.target.style.background = '#2196f3';
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
                          <i className="fas fa-users" style={{ fontSize: 36, color: '#bbb' }} />
                        </div>
                        <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>
                          Resultados de Búsqueda
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.95em' }}>
                          Utiliza los filtros de búsqueda para encontrar usuarios
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
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
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
                onMouseEnter={e => {
                  e.target.style.background = '#f0f0f0';
                  e.target.style.color = '#333';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#666';
                }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                {/* Información básica */}
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={userForm.nombreCompleto}
                    onChange={(e) => setUserForm({...userForm, nombreCompleto: e.target.value})}
                    placeholder="Solo letras y espacios"
                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                    title="Solo se permiten letras y espacios"
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Tipo de Documento *
                  </label>
                  <select
                    value={userForm.tipoDocumento}
                    onChange={(e) => setUserForm({...userForm, tipoDocumento: e.target.value})}
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    {TIPO_DOCUMENTO_OPTIONS.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    value={userForm.numeroDocumento}
                    onChange={(e) => setUserForm({...userForm, numeroDocumento: e.target.value})}
                    placeholder="Entre 5 y 15 números"
                    pattern="\d{5,15}"
                    minLength="5"
                    maxLength="15"
                    title="Solo números, entre 5 y 15 caracteres"
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    value={userForm.fechaNacimiento}
                    onChange={(e) => setUserForm({...userForm, fechaNacimiento: e.target.value})}
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Edad
                  </label>
                  <input
                    type="number"
                    value={userForm.edad}
                    readOnly
                    placeholder="Se calcula automáticamente"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      fontSize: '1em',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: '#f5f5f5',
                      cursor: 'not-allowed'
                    }}
                    min="1"
                    max="120"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Sexo *
                  </label>
                  <select
                    value={userForm.sexo}
                    onChange={(e) => setUserForm({...userForm, sexo: e.target.value})}
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  >
                    <option value="">Seleccionar sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={userForm.correoElectronico}
                    onChange={(e) => setUserForm({...userForm, correoElectronico: e.target.value})}
                    placeholder="usuario@ejemplo.com"
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Dirección Residencia *
                  </label>
                  <input
                    type="text"
                    value={userForm.direccion}
                    onChange={(e) => setUserForm({...userForm, direccion: e.target.value})}
                    placeholder="Dirección completa"
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    EPS o Seguro Médico *
                  </label>
                  <select
                    name="epsSeguroMedico"
                    value={userForm.epsSeguroMedico}
                    onChange={(e) => setUserForm({...userForm, epsSeguroMedico: e.target.value})}
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  >
                    <option value="">Seleccione EPS</option>
                    {EPS_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Condición Especial *
                  </label>
                  <select
                    value={userForm.condicionEspecial}
                    onChange={(e) => setUserForm({...userForm, condicionEspecial: e.target.value})}
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  >
                    <option value="">Seleccione condición</option>
                    {CONDICION_ESPECIAL_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Contacto de Emergencia *
                  </label>
                  <input
                    type="text"
                    value={userForm.contactoEmergencia}
                    onChange={(e) => setUserForm({...userForm, contactoEmergencia: e.target.value})}
                    placeholder="Solo letras y espacios"
                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                    title="Solo se permiten letras y espacios"
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Teléfono de Emergencia *
                  </label>
                  <input
                    type="text"
                    value={userForm.telefonoFamiliar}
                    onChange={(e) => setUserForm({...userForm, telefonoFamiliar: e.target.value})}
                    placeholder="Exactamente 10 números"
                    pattern="\d{10}"
                    minLength="10"
                    maxLength="10"
                    title="Exactamente 10 números"
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Perfil *
                  </label>
                  <select
                    value={userForm.perfil}
                    onChange={(e) => setUserForm({...userForm, perfil: e.target.value})}
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  >
                    <option value="">Seleccionar perfil</option>
                    {PERFIL_OPTIONS.map(perfil => (
                      <option key={perfil} value={perfil}>{perfil}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Usuario *
                  </label>
                  <input
                    type="text"
                    value={userForm.usuario}
                    onChange={(e) => setUserForm({...userForm, usuario: e.target.value})}
                    placeholder="Nombre de usuario único"
                    pattern="^[a-zA-Z0-9._-]+$"
                    title="Solo se permiten letras, números, puntos, guiones y guiones bajos"
                    minLength="3"
                    maxLength="20"
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Estado *
                  </label>
                  <select
                    value={userForm.usuarioActivo}
                    onChange={(e) => setUserForm({...userForm, usuarioActivo: e.target.value})}
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    required
                  >
                    {ACTIVO_OPTIONS.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                    Nueva Contraseña (opcional)
                  </label>
                  <input
                    type="password"
                    value={userForm.contrasena}
                    onChange={(e) => setUserForm({...userForm, contrasena: e.target.value})}
                    placeholder="Dejar vacío para mantener la actual"
                    minLength="8"
                    title="Mínimo 8 caracteres"
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
                    onFocus={e => e.target.style.borderColor = '#2196f3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
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
                    transition: 'all 0.2s',
                    fontSize: '1em',
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
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(90deg, #2196f3 60%, #42a5f5 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
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
                    e.target.style.boxShadow = '0 4px 16px 0 rgba(33, 150, 243, 0.3)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <i className="fas fa-save" />
                  Guardar Cambios
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
