import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo-prediversa.png';
import './HeaderDashboard.css';
import './StudentDashboard.css';
import './components/AdminDashboard.css'; // Importamos los estilos del AdminDashboard
import useProfile from '../../hooks/useProfile';
import SettingsPanel from '../../components/SettingsPanel';

const StudentDashboard = () => {
  const { profile, updateProfile, error } = useProfile();
  const navigate = useNavigate();

  // Estados centralizados
  const [showSettings, setShowSettings] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [showEmotionalQuestionnaire, setShowEmotionalQuestionnaire] =
    useState(false);
  const [emotionalAnswers, setEmotionalAnswers] = useState({
    pregunta1: '',
    pregunta2: '',
    pregunta3: '',
    pregunta4: '',
    pregunta5: '',
    pregunta6: '',
    pregunta7: '',
    pregunta8: '',
    pregunta9: '',
    pregunta10: '',
  });

  // Estados de respuestas para cada cuestionario
  const [violenceTypesAnswers, setViolenceTypesAnswers] = useState({
    pregunta1: '',
    pregunta2: '',
    pregunta3: '',
    pregunta4: '',
    pregunta5: '',
  });

  const [reportAnswers, setReportAnswers] = useState({
    pregunta1: '',
    pregunta2: '',
    pregunta3: '',
  });

  const [victimSignsAnswers, setVictimSignsAnswers] = useState({
    pregunta1: '',
    pregunta2: '',
    pregunta3: '',
    pregunta4: '',
  });

  const [rightsAnswers, setRightsAnswers] = useState({
    pregunta1: '',
    pregunta2: '',
    pregunta3: '',
  });

  // Estado para notificaciones
  const [notification, setNotification] = useState(null);

  // Estados para rastrear estadísticas dinámicas
  const [completedQuestionnaireStats, setCompletedQuestionnaireStats] =
    useState({
      emotional: false,
      violence: false,
      report: false,
      victim: false,
      rights: false,
    });
  const [userStats, setUserStats] = useState({
    conversations: 0,
    activeDays: 1, // Empieza con 1 (día actual)
    achievements: 0,
    newMessages: 0,
    resourcesViewed: 0,
  });

  // Estado para animaciones de estadísticas
  const [statsAnimations, setStatsAnimations] = useState({
    conversations: false,
    achievements: false,
    newMessages: false,
    resourcesViewed: false,
  });

  // Estado para controlar qué cuestionario está activo en la página
  const [activeQuestionnaire, setActiveQuestionnaire] = useState(null);
  const [isQuestionnaireExpanded, setIsQuestionnaireExpanded] = useState(false);

  // Estados para el sistema de pestañas de Reporte y Apoyo Personal
  const [activeSupportTab, setActiveSupportTab] = useState(null);
  const [isSupportTabExpanded, setIsSupportTabExpanded] = useState(false);
  const [reportForm, setReportForm] = useState({
    isAnonymous: null,
    personalData: {
      fullName: '',
      documentType: '',
      documentNumber: '',
      birthDate: '',
      age: '',
      gender: '',
      civilStatus: '',
      email: '',
      phone: '',
      address: '',
      occupation: '',
    },
    institutionData: {
      eps: '',
      medicalHistory: '',
      specialCondition: '',
      gradeOrPosition: '',
      institution: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
    incidentData: {
      description: '',
      evidence: '',
      context: '',
      contactEmail: '',
    },
  });
  const [suggestionForm, setSuggestionForm] = useState({
    name: '',
    email: '',
    type: '', // PQR: 'peticion', 'queja', 'reclamo', 'sugerencia'
    subject: '',
    message: '',
    urgency: 'media', // 'baja', 'media', 'alta'
  });

  // Datos del usuario dinámicos desde localStorage con fallbacks seguros
  const userData = {
    name: localStorage.getItem('nombre') || 'Estudiante',
    lastName: localStorage.getItem('apellido') || '',
    documentType: localStorage.getItem('tipoDocumento') || 'DNI',
    documentNumber: localStorage.getItem('documento') || '',
    birthDate: localStorage.getItem('fechaNacimiento') || '',
    age: localStorage.getItem('edad') || '',
    phone: localStorage.getItem('telefono') || '',
    email: localStorage.getItem('correo') || '',
    rol: localStorage.getItem('rol') || 'student',
    fechaRegistro: localStorage.getItem('fechaRegistro') || '',
  };

  // Estado centralizado del perfil estudiante
  const [studentProfileState, setStudentProfileState] = useState({
    ...userData,
    photo: profile?.photo || '',
  });

  // --- Handlers organizados y optimizados ---
  const openSettings = e => {
    e.preventDefault();
    setShowSettings(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSettingsSave = newProfile => {
    setStudentProfileState(prev => ({ ...prev, ...newProfile }));
    if (newProfile.photo) {
      setProfilePhoto(newProfile.photo);
    }
    updateProfile(newProfile);
  };

  const handleProfilePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        setStudentProfileState(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const showNotification = (type, title, message, score = null) => {
    setNotification({ type, title, message, score });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handler unificado para expandir cuestionarios
  const handleQuestionnaireExpand = questionnaireType => {
    if (activeQuestionnaire === questionnaireType && isQuestionnaireExpanded) {
      // Si ya está expandido, lo contraemos
      setIsQuestionnaireExpanded(false);
      setTimeout(() => setActiveQuestionnaire(null), 300);
    } else {
      // Expandir nuevo cuestionario
      setActiveQuestionnaire(questionnaireType);
      setIsQuestionnaireExpanded(true);
      // Scroll suave hacia el cuestionario
      setTimeout(() => {
        const questionnaireElement = document.getElementById(
          'questionnaire-container'
        );
        if (questionnaireElement) {
          questionnaireElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 150);
    }
  };

  // Handler para cerrar cuestionario
  const handleQuestionnaireClose = () => {
    setIsQuestionnaireExpanded(false);
    setTimeout(() => {
      setActiveQuestionnaire(null);
      // Reset de respuestas según el tipo
      if (activeQuestionnaire === 'emotional') {
        setEmotionalAnswers({
          pregunta1: '',
          pregunta2: '',
          pregunta3: '',
          pregunta4: '',
          pregunta5: '',
          pregunta6: '',
          pregunta7: '',
          pregunta8: '',
          pregunta9: '',
          pregunta10: '',
        });
      } else if (activeQuestionnaire === 'violence') {
        setViolenceTypesAnswers({
          pregunta1: '',
          pregunta2: '',
          pregunta3: '',
          pregunta4: '',
          pregunta5: '',
        });
      } else if (activeQuestionnaire === 'report') {
        setReportAnswers({
          pregunta1: '',
          pregunta2: '',
          pregunta3: '',
        });
      } else if (activeQuestionnaire === 'victim') {
        setVictimSignsAnswers({
          pregunta1: '',
          pregunta2: '',
          pregunta3: '',
          pregunta4: '',
        });
      } else if (activeQuestionnaire === 'rights') {
        setRightsAnswers({
          pregunta1: '',
          pregunta2: '',
          pregunta3: '',
        });
      }
    }, 300);
  };

  const handleEmotionalQuestionnaireOpen = () => {
    handleQuestionnaireExpand('emotional');
  };

  const handleEmotionalQuestionnaireClose = () => {
    setShowEmotionalQuestionnaire(false);
    setEmotionalAnswers({
      pregunta1: '',
      pregunta2: '',
      pregunta3: '',
      pregunta4: '',
      pregunta5: '',
      pregunta6: '',
      pregunta7: '',
      pregunta8: '',
      pregunta9: '',
      pregunta10: '',
    });
  };

  const handleEmotionalAnswerChange = (pregunta, valor) => {
    setEmotionalAnswers(prev => ({
      ...prev,
      [pregunta]: valor,
    }));
  };

  const handleEmotionalQuestionnaireSubmit = () => {
    console.log('Respuestas del cuestionario emocional:', emotionalAnswers);

    // Calcular puntuación
    const positiveQuestions = [
      'pregunta1',
      'pregunta2',
      'pregunta3',
      'pregunta4',
      'pregunta5',
    ];
    const negativeQuestions = [
      'pregunta6',
      'pregunta7',
      'pregunta8',
      'pregunta9',
      'pregunta10',
    ];

    let positiveScore = 0;
    let negativeScore = 0;

    positiveQuestions.forEach(q => {
      if (emotionalAnswers[q]) positiveScore += parseInt(emotionalAnswers[q]);
    });

    negativeQuestions.forEach(q => {
      if (emotionalAnswers[q]) negativeScore += parseInt(emotionalAnswers[q]);
    });

    const finalScore = positiveScore - negativeScore;

    let message = '';
    if (finalScore >= 5) {
      message = '¡Excelente! Tu estado emocional es muy positivo. Sigue así 😊';
    } else if (finalScore >= 0) {
      message =
        'Tu estado emocional está balanceado. Te recomendamos seguir cuidando tu bienestar 💙';
    } else {
      message =
        'Notamos que puedes estar pasando por un momento difícil. Te recomendamos hablar con nuestro equipo de apoyo 🤗';
    }

    // Actualizar estadísticas solo si es la primera vez que completa el cuestionario
    const isFirstTime = !completedQuestionnaireStats.emotional;
    if (isFirstTime) {
      setCompletedQuestionnaireStats(prev => ({ ...prev, emotional: true }));
      setUserStats(prev => ({
        ...prev,
        achievements: prev.achievements + 1,
        conversations: prev.conversations + 1,
      }));
    }

    showNotification('success', 'Cuestionario Completado', message, finalScore);
    handleQuestionnaireClose();
  };

  // Handlers para cuestionario de tipos de violencia
  const handleViolenceTypesQuestionnaireSubmit = () => {
    console.log(
      'Respuestas del cuestionario de tipos de violencia:',
      violenceTypesAnswers
    );

    const answers = Object.values(violenceTypesAnswers).filter(
      answer => answer !== ''
    );
    const yesCount = answers.filter(answer => answer === 'si').length;

    let message = '';
    if (yesCount === 0) {
      message =
        '✅ Excelente. No identificas situaciones de violencia en tu entorno. Mantente siempre alerta y recuerda que puedes acudir a nosotros si algo cambia.';
    } else if (yesCount <= 2) {
      message =
        '⚠️ Has identificado algunas situaciones preocupantes. Te recomendamos hablar con nuestro equipo de orientación para recibir apoyo.';
    } else {
      message =
        '🚨 Has identificado varias situaciones de violencia. Es importante que busques ayuda inmediatamente. Nuestro equipo está aquí para apoyarte.';
    }

    // Actualizar estadísticas
    const isFirstTime = !completedQuestionnaireStats.violence;
    if (isFirstTime) {
      setCompletedQuestionnaireStats(prev => ({ ...prev, violence: true }));
      setUserStats(prev => ({
        ...prev,
        achievements: prev.achievements + 1,
        newMessages: yesCount > 0 ? prev.newMessages + 1 : prev.newMessages, // Mensaje nuevo si hay situaciones de riesgo
      }));
    }

    showNotification(
      yesCount === 0 ? 'success' : yesCount <= 2 ? 'warning' : 'danger',
      'Evaluación Completada',
      message,
      `${yesCount}/5`
    );
    handleQuestionnaireClose();
    setViolenceTypesAnswers({
      pregunta1: '',
      pregunta2: '',
      pregunta3: '',
      pregunta4: '',
      pregunta5: '',
    });
  };

  // Handlers para cuestionario de denuncia
  const handleReportQuestionnaireSubmit = () => {
    console.log('Respuestas del cuestionario de denuncia:', reportAnswers);

    const needsHelp =
      reportAnswers.pregunta1 === 'si' || reportAnswers.pregunta2 === 'si';
    const knowsProcess = reportAnswers.pregunta3 === 'si';

    let message = '';
    if (needsHelp && knowsProcess) {
      message =
        '💪 Es valiente de tu parte buscar ayuda. Ya conoces el proceso, pero recuerda que nuestro equipo está aquí para acompañarte en cada paso.';
    } else if (needsHelp && !knowsProcess) {
      message =
        '🤝 Reconocer que necesitas ayuda es el primer paso. Te explicaremos todo el proceso de denuncia y te acompañaremos. No estás solo/a.';
    } else if (!needsHelp && knowsProcess) {
      message =
        '👍 Es excelente que conozcas el proceso de denuncia. Comparte esta información con otros que puedan necesitarla.';
    } else {
      message =
        '📚 Te recomendamos informarte sobre el proceso de denuncia. El conocimiento es poder y puede ayudar a ti o a otros en el futuro.';
    }

    // Actualizar estadísticas
    const isFirstTime = !completedQuestionnaireStats.report;
    if (isFirstTime) {
      setCompletedQuestionnaireStats(prev => ({ ...prev, report: true }));
      setUserStats(prev => ({
        ...prev,
        achievements: prev.achievements + 1,
        newMessages: needsHelp ? prev.newMessages + 1 : prev.newMessages, // Mensaje nuevo si necesita ayuda
        resourcesViewed: prev.resourcesViewed + 1, // Incrementar recursos vistos por completar evaluación
      }));
    }

    showNotification(
      needsHelp ? 'warning' : 'info',
      'Evaluación Completada',
      message
    );
    handleQuestionnaireClose();
    setReportAnswers({
      pregunta1: '',
      pregunta2: '',
      pregunta3: '',
    });
  };

  // Handlers para cuestionario de señales de víctima
  const handleVictimSignsQuestionnaireSubmit = () => {
    console.log(
      'Respuestas del cuestionario de señales de víctima:',
      victimSignsAnswers
    );

    const answers = Object.values(victimSignsAnswers).filter(
      answer => answer !== ''
    );
    const yesCount = answers.filter(answer => answer === 'si').length;

    let message = '';
    if (yesCount === 0) {
      message =
        '✅ No identificas señales de que alguien cercano esté siendo víctima de violencia. Mantén esta actitud observadora y empática.';
    } else if (yesCount <= 2) {
      message =
        '⚠️ Has identificado algunas señales preocupantes en alguien cercano. Te recomendamos acercarte con cuidado y ofrecer apoyo.';
    } else {
      message =
        '🚨 Has identificado varias señales de que alguien puede estar en peligro. Te recomendamos buscar ayuda profesional para saber cómo actuar de la mejor manera.';
    }

    // Actualizar estadísticas
    const isFirstTime = !completedQuestionnaireStats.victim;
    if (isFirstTime) {
      setCompletedQuestionnaireStats(prev => ({ ...prev, victim: true }));
      setUserStats(prev => ({
        ...prev,
        achievements: prev.achievements + 1,
        conversations:
          yesCount > 0 ? prev.conversations + 1 : prev.conversations, // Incrementar conversaciones si detecta señales
        resourcesViewed: prev.resourcesViewed + 1,
      }));
    }

    showNotification(
      yesCount === 0 ? 'success' : yesCount <= 2 ? 'warning' : 'danger',
      'Evaluación Completada',
      message,
      `${yesCount}/4`
    );
    handleQuestionnaireClose();
    setVictimSignsAnswers({
      pregunta1: '',
      pregunta2: '',
      pregunta3: '',
      pregunta4: '',
    });
  };

  // Handlers para cuestionario de derechos
  const handleRightsQuestionnaireSubmit = () => {
    console.log('Respuestas del cuestionario de derechos:', rightsAnswers);

    const answers = Object.values(rightsAnswers).filter(
      answer => answer !== ''
    );
    const correctCount = answers.filter(answer => answer === 'si').length;

    let message = '';
    if (correctCount === 3) {
      message =
        '🌟 ¡Excelente! Conoces muy bien tus derechos. Este conocimiento te empodera y te protege.';
    } else if (correctCount === 2) {
      message =
        '👍 Tienes un buen conocimiento de tus derechos, pero hay áreas que puedes reforzar. Te recomendamos revisar más información.';
    } else {
      message =
        '📖 Es importante que te informes más sobre tus derechos. El conocimiento es tu mejor herramienta de protección.';
    }

    // Actualizar estadísticas
    const isFirstTime = !completedQuestionnaireStats.rights;
    if (isFirstTime) {
      setCompletedQuestionnaireStats(prev => ({ ...prev, rights: true }));
      setUserStats(prev => ({
        ...prev,
        achievements: prev.achievements + (correctCount === 3 ? 2 : 1), // Doble logro por puntuación perfecta
        resourcesViewed: prev.resourcesViewed + 1,
        activeDays: prev.activeDays, // Mantener los días activos actuales
      }));
    }

    showNotification(
      correctCount === 3 ? 'success' : correctCount === 2 ? 'warning' : 'info',
      'Evaluación Completada',
      message,
      `${correctCount}/3`
    );
    handleQuestionnaireClose();
    setRightsAnswers({
      pregunta1: '',
      pregunta2: '',
      pregunta3: '',
    });
  };

  // Handlers para el sistema de pestañas de Reporte y Apoyo Personal
  const handleSupportTabExpand = tabType => {
    if (activeSupportTab === tabType && isSupportTabExpanded) {
      setIsSupportTabExpanded(false);
      setTimeout(() => setActiveSupportTab(null), 300);
    } else {
      setActiveSupportTab(tabType);
      setIsSupportTabExpanded(true);
      setTimeout(() => {
        const supportElement = document.getElementById('support-container');
        if (supportElement) {
          supportElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 150);
    }
  };

  const handleSupportTabClose = () => {
    setIsSupportTabExpanded(false);
    setTimeout(() => {
      setActiveSupportTab(null);
      // Reset forms
      setReportForm({
        isAnonymous: null,
        personalData: {
          fullName: '',
          documentType: '',
          documentNumber: '',
          birthDate: '',
          age: '',
          gender: '',
          civilStatus: '',
          email: '',
          phone: '',
          address: '',
          occupation: '',
        },
        institutionData: {
          eps: '',
          medicalHistory: '',
          specialCondition: '',
          gradeOrPosition: '',
          institution: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
        },
        incidentData: {
          description: '',
          evidence: '',
          context: '',
          contactEmail: '',
        },
      });
      setSuggestionForm({
        name: '',
        email: '',
        type: '',
        subject: '',
        message: '',
        urgency: 'media',
      });
    }, 300);
  };

  const handleReportSubmit = () => {
    // Generar número de reporte
    const reportNumber = `RPT-${Date.now().toString().substr(-6)}`;
    console.log('Reporte enviado:', { ...reportForm, reportNumber });

    // Actualizar estadísticas
    setUserStats(prev => ({
      ...prev,
      conversations: prev.conversations + 1, // Nueva conversación con equipo de apoyo
      newMessages: prev.newMessages + 1, // Mensaje de confirmación
      resourcesViewed: prev.resourcesViewed + 1, // Recurso utilizado (sistema de reporte)
    }));

    showNotification(
      'success',
      'Reporte Enviado',
      `Tu reporte ha sido registrado con el número: ${reportNumber}. Recibirás seguimiento pronto.`
    );
    handleSupportTabClose();
  };

  const handleSuggestionSubmit = () => {
    // Generar número de PQR
    const pqrNumber = `PQR-${Date.now().toString().substr(-6)}`;
    const typeLabels = {
      peticion: 'Petición',
      queja: 'Queja',
      reclamo: 'Reclamo',
      sugerencia: 'Sugerencia',
    };

    console.log('PQR enviada:', { ...suggestionForm, pqrNumber });

    // Actualizar estadísticas
    setUserStats(prev => ({
      ...prev,
      conversations: prev.conversations + 1, // Nueva conversación/comunicación
      achievements:
        suggestionForm.type === 'sugerencia'
          ? prev.achievements + 1
          : prev.achievements, // Logro extra por sugerencia constructiva
      resourcesViewed: prev.resourcesViewed + 1, // Recurso utilizado (sistema PQR)
    }));

    const typeLabel = typeLabels[suggestionForm.type] || 'Comunicación';
    showNotification(
      'success',
      `${typeLabel} Enviada`,
      `Tu ${typeLabel.toLowerCase()} ha sido registrada con el número: ${pqrNumber}. Recibirás respuesta pronto.`
    );

    // Reset del formulario
    setSuggestionForm({
      name: '',
      email: '',
      type: '',
      subject: '',
      message: '',
      urgency: 'media',
    });
    handleSupportTabClose();
  };

  // --- Effects con mejor gestión de dependencias ---
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (error) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [error, navigate]);

  // Sincronizar profile con estado local
  useEffect(() => {
    if (profile) {
      setStudentProfileState(prev => ({ ...prev, ...profile }));
      setProfilePhoto(profile.photo || '');
    }
  }, [profile]);

  // Gestionar días activos (incrementar cuando el usuario accede al dashboard)
  useEffect(() => {
    const lastVisit = localStorage.getItem('lastDashboardVisit');
    const today = new Date().toDateString();

    if (lastVisit !== today) {
      // Es un día diferente, incrementar días activos
      setUserStats(prev => ({
        ...prev,
        activeDays: prev.activeDays + 1,
      }));
      localStorage.setItem('lastDashboardVisit', today);
    }
  }, []);

  // Función para manejar interacción con el chat IA
  const handleChatInteraction = () => {
    setUserStats(prev => ({
      ...prev,
      conversations: prev.conversations + 1,
      resourcesViewed: prev.resourcesViewed + 1, // El chat IA cuenta como recurso
    }));
    // Activar animaciones
    setStatsAnimations(prev => ({
      ...prev,
      conversations: true,
      resourcesViewed: true,
    }));
    setTimeout(
      () =>
        setStatsAnimations(prev => ({
          ...prev,
          conversations: false,
          resourcesViewed: false,
        })),
      1000
    );
  };

  // --- Renderizado condicional mejorado ---
  if (error) {
    return (
      <div
        className="error-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Error al cargar perfil</div>
      </div>
    );
  }

  return (
    <div className="student-dashboard-html">
      {/* Header profesional fijo con mejores atributos de accesibilidad */}
      <header className="header-main-html" role="banner">
        <div className="header-logo-title-html">
          <img
            src={logo}
            alt="PrediVersa Logo"
            className="header-logo-img-html"
          />
          <span className="header-title-html">Panel del Estudiante</span>
        </div>
        <div className="header-user-actions-html">
          <span className="header-user-name-html">
            <i
              className="fas fa-user-circle"
              style={{ marginRight: 8, color: '#1976d2' }}
            />
            {studentProfileState.name} {studentProfileState.lastName}
          </span>
          <button
            className="header-btn-html"
            onClick={openSettings}
            title="Configuración"
            aria-label="Configuración de usuario"
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
          }}
        >
          {/* Panel izquierdo con estructura del AdminDashboard */}
          <aside className="dashboard-sidebar">
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
                htmlFor="student-profile-photo-upload"
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
                {profilePhoto || studentProfileState.photo ? (
                  <img
                    src={profilePhoto || studentProfileState.photo}
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
                  id="student-profile-photo-upload"
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

            {/* Información del usuario */}
            <section className="user-info-container">
              <div className="info-row">
                <span>
                  <strong>Nombre:</strong> {studentProfileState.name}{' '}
                  {studentProfileState.lastName}
                </span>
              </div>
              <div className="info-row">
                <span>
                  <strong>Tipo documento:</strong>{' '}
                  {studentProfileState.documentType}
                </span>
              </div>
              <div className="info-row">
                <span>
                  <strong>Número documento:</strong>{' '}
                  {studentProfileState.documentNumber}
                </span>
              </div>
              <div className="info-row">
                <span>
                  <strong>Fecha nacimiento:</strong>{' '}
                  {studentProfileState.birthDate}
                </span>
              </div>
              <div className="info-row">
                <span>
                  <strong>Edad:</strong> {studentProfileState.age}
                </span>
              </div>
              <div className="info-row">
                <span>
                  <strong>Teléfono:</strong> {studentProfileState.phone}
                </span>
              </div>
              <div className="info-row">
                <span>
                  <strong>Dirección:</strong>{' '}
                  {studentProfileState.address || 'No especificado'}
                </span>
              </div>
            </section>

            {/* Estado académico del estudiante */}
            <section className="system-status-container">
              <h3>
                <i className="fas fa-graduation-cap" /> Estado Académico
              </h3>
              <div className="status-row">
                <i className="fas fa-star" />
                <span>
                  <strong>Progreso:</strong> 85.2%
                </span>
              </div>
              <div className="status-row">
                <i className="fas fa-check-circle" />
                <span>
                  <strong>Cuestionarios:</strong> Completados
                </span>
              </div>
              <div className="status-row">
                <i className="fas fa-heart" />
                <span>
                  <strong>Bienestar:</strong> Bueno
                </span>
              </div>
            </section>

            {/* Estadísticas del estudiante */}
            <section className="stats-container">
              <h3>
                <i className="fas fa-chart-bar" /> Mis Estadísticas
              </h3>
              <div className="stat-row">
                <i className="fas fa-clipboard-check" />
                <span>
                  <strong>Cuestionarios:</strong>{' '}
                  {
                    Object.values(completedQuestionnaireStats).filter(Boolean)
                      .length
                  }
                  /5
                </span>
              </div>
              <div
                className={`stat-row ${
                  statsAnimations.resourcesViewed ? 'stat-animated' : ''
                }`}
              >
                <i className="fas fa-book-open" />
                <span>
                  <strong>Recursos vistos:</strong> {userStats.resourcesViewed}
                </span>
              </div>
              <div
                className={`stat-row ${
                  statsAnimations.conversations ? 'stat-animated' : ''
                }`}
              >
                <i className="fas fa-comments" />
                <span>
                  <strong>Conversaciones:</strong> {userStats.conversations}
                </span>
              </div>
              <div className="stat-row">
                <i className="fas fa-calendar-check" />
                <span>
                  <strong>Días activo:</strong> {userStats.activeDays}
                </span>
              </div>
              <div
                className={`stat-row ${
                  statsAnimations.achievements ? 'stat-animated' : ''
                }`}
              >
                <i className="fas fa-trophy" />
                <span>
                  <strong>Logros:</strong> {userStats.achievements}
                </span>
              </div>
              <div
                className={`stat-row ${
                  statsAnimations.newMessages ? 'stat-animated' : ''
                }`}
              >
                <i className="fas fa-envelope" />
                <span>
                  <strong>Mensajes nuevos:</strong> {userStats.newMessages}
                </span>
              </div>
            </section>
          </aside>

          {/* Panel derecho con estructura mejorada */}
          <section
            className="right-panel-html"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}
            aria-label="Panel principal de contenido"
          >
            {/* Chat de IA Premium - Alineado igual que AdminDashboard */}
            <section
              className="premium-section chat-ai-section"
              style={{
                background:
                  'linear-gradient(135deg, #fafdff 80%, #e3f2fd 100%)',
                border: '1.5px solid #d0d7e6',
                borderRadius: 18,
                padding: '24px 28px 20px 28px', // Mismo padding que AdminDashboard para alineación
                marginTop: 0,
                marginBottom: 24,
                boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.08)',
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
                  <i className="fas fa-robot" style={{ fontSize: 22 }} />
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
                    ¡Hola {studentProfileState.name}! 👋
                  </h2>
                  <div
                    style={{
                      color: '#4a4a4a',
                      fontSize: '1.07em',
                      marginTop: 2,
                      fontWeight: 400,
                    }}
                  >
                    Tu asistente virtual está aquí para ayudarte en todo
                    momento.
                  </div>
                </div>
              </div>
              <div
                style={{
                  height: 1,
                  background: '#bbdefb',
                  margin: '18px 0 24px 0',
                  borderRadius: 2,
                }}
              />

              <div
                className="chat-text-html"
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  border: '1px solid #e3f2fd',
                }}
              >
                <div
                  className="message bot"
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <span role="img" aria-label="robot" style={{ fontSize: 24 }}>
                    🤖
                  </span>
                  <span style={{ color: '#333', fontSize: '1.05em' }}>
                    Hola {studentProfileState.name}, ¿en qué puedo ayudarte hoy?
                    Puedes preguntarme sobre cuestionarios, recursos o cualquier
                    duda que tengas.
                  </span>
                </div>
              </div>
              <div
                className="chat-input-html"
                style={{ display: 'flex', gap: 12 }}
              >
                <input
                  type="text"
                  placeholder="Escribe tu mensaje aquí..."
                  aria-label="Mensaje para el chat"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1.5px solid #bbdefb',
                    borderRadius: 25,
                    fontSize: '1em',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                />
                <button
                  type="button"
                  aria-label="Enviar mensaje"
                  onClick={handleChatInteraction}
                  style={{
                    background:
                      'linear-gradient(90deg, #1976d2 60%, #2196f3 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 25,
                    padding: '12px 24px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                  }}
                >
                  Enviar
                </button>
              </div>
            </section>

            {/* Acciones Rápidas Premium */}
            <section
              className="premium-section actions-section"
              style={{
                background:
                  'linear-gradient(135deg, #fafdff 80%, #fff3e0 100%)',
                border: '1.5px solid #d0d7e6',
                borderRadius: 18,
                padding: '32px 32px 28px 32px',
                marginBottom: 24,
                boxShadow: '0 4px 24px 0 rgba(255, 152, 0, 0.08)',
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
                  <i className="fas fa-bolt" style={{ fontSize: 22 }} />
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
                    Acciones Rápidas
                  </h2>
                  <div
                    style={{
                      color: '#4a4a4a',
                      fontSize: '1.07em',
                      marginTop: 2,
                      fontWeight: 400,
                    }}
                  >
                    Herramientas esenciales para tu bienestar y seguimiento
                    personal.
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

              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  marginBottom: '0',
                  position: 'relative',
                }}
              >
                {/* Línea conectora visual cuando hay pestaña activa */}
                {activeQuestionnaire && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: '4px',
                      background:
                        activeQuestionnaire === 'emotional'
                          ? '#2196f3'
                          : activeQuestionnaire === 'violence'
                          ? '#f44336'
                          : activeQuestionnaire === 'report'
                          ? '#ff9800'
                          : activeQuestionnaire === 'victim'
                          ? '#9c27b0'
                          : '#4caf50',
                      borderRadius: '2px 2px 0 0',
                      zIndex: 10,
                      opacity: 0.8,
                    }}
                  />
                )}
                <button
                  className={`tab-btn ${
                    activeQuestionnaire === 'emotional' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={handleEmotionalQuestionnaireOpen}
                  style={{
                    background:
                      activeQuestionnaire === 'emotional'
                        ? 'linear-gradient(90deg, #1565c0 60%, #2196f3 100%)'
                        : 'linear-gradient(90deg, #2196f3 60%, #42a5f5 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius:
                      activeQuestionnaire === 'emotional'
                        ? '12px 12px 0 0'
                        : '12px',
                    padding: '14px 20px',
                    fontWeight: 700,
                    fontSize: '0.95em',
                    cursor: 'pointer',
                    boxShadow:
                      activeQuestionnaire === 'emotional'
                        ? '0 -2px 8px rgba(33, 150, 243, 0.2)'
                        : '0 2px 12px rgba(33, 150, 243, 0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flex: '1 1 200px',
                    minWidth: 180,
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: activeQuestionnaire === 'emotional' ? 10 : 1,
                    transform:
                      activeQuestionnaire === 'emotional'
                        ? 'translateY(2px)'
                        : 'translateY(0)',
                  }}
                >
                  <i className="fas fa-heart" />
                  ¿Cómo me siento hoy?
                </button>

                <button
                  className={`tab-btn ${
                    activeQuestionnaire === 'violence' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() => handleQuestionnaireExpand('violence')}
                  style={{
                    background:
                      activeQuestionnaire === 'violence'
                        ? 'linear-gradient(90deg, #d32f2f 60%, #f44336 100%)'
                        : 'linear-gradient(90deg, #f44336 60%, #e53935 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius:
                      activeQuestionnaire === 'violence'
                        ? '12px 12px 0 0'
                        : '12px',
                    padding: '14px 20px',
                    fontWeight: 700,
                    fontSize: '0.95em',
                    cursor: 'pointer',
                    boxShadow:
                      activeQuestionnaire === 'violence'
                        ? '0 -2px 8px rgba(244, 67, 54, 0.2)'
                        : '0 2px 12px rgba(244, 67, 54, 0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flex: '1 1 200px',
                    minWidth: 180,
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: activeQuestionnaire === 'violence' ? 10 : 1,
                    transform:
                      activeQuestionnaire === 'violence'
                        ? 'translateY(2px)'
                        : 'translateY(0)',
                  }}
                >
                  <i className="fas fa-exclamation-triangle" />
                  Tipos de Violencia
                </button>

                <button
                  className={`tab-btn ${
                    activeQuestionnaire === 'report' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() => handleQuestionnaireExpand('report')}
                  style={{
                    background:
                      activeQuestionnaire === 'report'
                        ? 'linear-gradient(90deg, #f57c00 60%, #ff9800 100%)'
                        : 'linear-gradient(90deg, #ff9800 60%, #ffb74d 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius:
                      activeQuestionnaire === 'report'
                        ? '12px 12px 0 0'
                        : '12px',
                    padding: '14px 20px',
                    fontWeight: 700,
                    fontSize: '0.95em',
                    cursor: 'pointer',
                    boxShadow:
                      activeQuestionnaire === 'report'
                        ? '0 -2px 8px rgba(255, 152, 0, 0.2)'
                        : '0 2px 12px rgba(255, 152, 0, 0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flex: '1 1 200px',
                    minWidth: 180,
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: activeQuestionnaire === 'report' ? 10 : 1,
                    transform:
                      activeQuestionnaire === 'report'
                        ? 'translateY(2px)'
                        : 'translateY(0)',
                  }}
                >
                  <i className="fas fa-file-alt" />
                  ¿Debo denunciar?
                </button>

                <button
                  className={`tab-btn ${
                    activeQuestionnaire === 'victim' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() => handleQuestionnaireExpand('victim')}
                  style={{
                    background:
                      activeQuestionnaire === 'victim'
                        ? 'linear-gradient(90deg, #7b1fa2 60%, #9c27b0 100%)'
                        : 'linear-gradient(90deg, #9c27b0 60%, #ba68c8 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius:
                      activeQuestionnaire === 'victim'
                        ? '12px 12px 0 0'
                        : '12px',
                    padding: '14px 20px',
                    fontWeight: 700,
                    fontSize: '0.95em',
                    cursor: 'pointer',
                    boxShadow:
                      activeQuestionnaire === 'victim'
                        ? '0 -2px 8px rgba(156, 39, 176, 0.2)'
                        : '0 2px 12px rgba(156, 39, 176, 0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flex: '1 1 200px',
                    minWidth: 180,
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: activeQuestionnaire === 'victim' ? 10 : 1,
                    transform:
                      activeQuestionnaire === 'victim'
                        ? 'translateY(2px)'
                        : 'translateY(0)',
                  }}
                >
                  <i className="fas fa-search" />
                  Señales de Víctima
                </button>

                <button
                  className={`tab-btn ${
                    activeQuestionnaire === 'rights' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() => handleQuestionnaireExpand('rights')}
                  style={{
                    background:
                      activeQuestionnaire === 'rights'
                        ? 'linear-gradient(90deg, #388e3c 60%, #4caf50 100%)'
                        : 'linear-gradient(90deg, #4caf50 60%, #66bb6a 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius:
                      activeQuestionnaire === 'rights'
                        ? '12px 12px 0 0'
                        : '12px',
                    padding: '14px 20px',
                    fontWeight: 700,
                    fontSize: '0.95em',
                    cursor: 'pointer',
                    boxShadow:
                      activeQuestionnaire === 'rights'
                        ? '0 -2px 8px rgba(76, 175, 80, 0.2)'
                        : '0 2px 12px rgba(76, 175, 80, 0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flex: '1 1 200px',
                    minWidth: 180,
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: activeQuestionnaire === 'rights' ? 10 : 1,
                    transform:
                      activeQuestionnaire === 'rights'
                        ? 'translateY(2px)'
                        : 'translateY(0)',
                  }}
                >
                  <i className="fas fa-balance-scale" />
                  Conoce tus Derechos
                </button>
              </div>
            </section>

            {/* Contenedor Dinámico de Cuestionarios */}
            {activeQuestionnaire && (
              <section
                id="questionnaire-container"
                className={`questionnaire-dynamic-container ${
                  isQuestionnaireExpanded ? 'expanded' : ''
                }`}
                style={{
                  background: 'linear-gradient(135deg, #fff 80%, #f8f9fa 100%)',
                  border: '2px solid #e9ecef',
                  borderTop: 'none',
                  borderRadius: '0 0 18px 18px',
                  padding: isQuestionnaireExpanded ? '32px' : '0',
                  marginTop: '-8px',
                  marginBottom: 24,
                  boxShadow: isQuestionnaireExpanded
                    ? '0 8px 32px rgba(0,0,0,0.12)'
                    : 'none',
                  maxHeight: isQuestionnaireExpanded ? '800px' : '0',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: isQuestionnaireExpanded ? 1 : 0,
                  transform: isQuestionnaireExpanded
                    ? 'translateY(0)'
                    : 'translateY(-20px)',
                  zIndex: 5,
                }}
              >
                {isQuestionnaireExpanded && (
                  <>
                    {/* Header del Cuestionario */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 24,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                        }}
                      >
                        <div
                          style={{
                            background:
                              activeQuestionnaire === 'emotional'
                                ? '#2196f3'
                                : activeQuestionnaire === 'violence'
                                ? '#f44336'
                                : activeQuestionnaire === 'report'
                                ? '#ff9800'
                                : activeQuestionnaire === 'victim'
                                ? '#9c27b0'
                                : '#4caf50',
                            color: '#fff',
                            borderRadius: '50%',
                            width: 50,
                            height: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          }}
                        >
                          <i
                            className={`fas ${
                              activeQuestionnaire === 'emotional'
                                ? 'fa-heart'
                                : activeQuestionnaire === 'violence'
                                ? 'fa-exclamation-triangle'
                                : activeQuestionnaire === 'report'
                                ? 'fa-file-alt'
                                : activeQuestionnaire === 'victim'
                                ? 'fa-search'
                                : 'fa-balance-scale'
                            }`}
                            style={{ fontSize: 20 }}
                          />
                        </div>
                        <div>
                          <h2
                            style={{
                              margin: 0,
                              fontSize: '1.5em',
                              color: '#333',
                              fontWeight: 700,
                            }}
                          >
                            {activeQuestionnaire === 'emotional'
                              ? '¿Cómo me siento hoy?'
                              : activeQuestionnaire === 'violence'
                              ? 'Tipos de Violencia'
                              : activeQuestionnaire === 'report'
                              ? '¿Debo denunciar?'
                              : activeQuestionnaire === 'victim'
                              ? 'Señales de Víctima'
                              : 'Conoce tus Derechos'}
                          </h2>
                          <p
                            style={{
                              margin: '4px 0 0',
                              color: '#666',
                              fontSize: '1.05em',
                            }}
                          >
                            {activeQuestionnaire === 'emotional'
                              ? 'Evalúa tu estado emocional actual'
                              : activeQuestionnaire === 'violence'
                              ? 'Identifica situaciones de violencia'
                              : activeQuestionnaire === 'report'
                              ? 'Evalúa tu situación y opciones'
                              : activeQuestionnaire === 'victim'
                              ? 'Identifica señales en otros'
                              : 'Evalúa tu conocimiento sobre derechos'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleQuestionnaireClose}
                        style={{
                          background: '#f5f5f5',
                          border: '1px solid #ddd',
                          borderRadius: '50%',
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <i className="fas fa-times" style={{ color: '#666' }} />
                      </button>
                    </div>

                    {/* Contenido del Cuestionario */}
                    <div style={{ marginBottom: 24 }}>
                      {activeQuestionnaire === 'emotional' && (
                        <>
                          <div
                            style={{
                              background: '#f8f9fa',
                              borderRadius: 12,
                              padding: '16px 20px',
                              marginBottom: 24,
                              border: '1px solid #e9ecef',
                            }}
                          >
                            <h3
                              style={{
                                color: '#495057',
                                fontWeight: 600,
                                fontSize: '1.1em',
                                margin: '0 0 12px 0',
                              }}
                            >
                              Escala de respuestas:
                            </h3>
                            <div
                              style={{
                                display: 'flex',
                                gap: 20,
                                flexWrap: 'wrap',
                                fontSize: '0.95em',
                              }}
                            >
                              <span style={{ color: '#6c757d' }}>
                                <strong>1</strong> = Casi nunca
                              </span>
                              <span style={{ color: '#6c757d' }}>
                                <strong>2</strong> = A veces
                              </span>
                              <span style={{ color: '#6c757d' }}>
                                <strong>3</strong> = Casi siempre
                              </span>
                            </div>
                          </div>

                          <div
                            style={{
                              display: 'grid',
                              gap: 16,
                              maxHeight: '400px',
                              overflowY: 'auto',
                              padding: '0 8px',
                            }}
                          >
                            {[
                              {
                                id: 'pregunta1',
                                text: 'Me siento feliz con las cosas que hago cada día',
                              },
                              {
                                id: 'pregunta2',
                                text: 'Tengo ganas de jugar o hacer cosas divertidas',
                              },
                              {
                                id: 'pregunta3',
                                text: 'Me siento con energía cuando me levanto en la mañana',
                              },
                              {
                                id: 'pregunta4',
                                text: 'Me siento amado(a) por mi familia o personas cercanas',
                              },
                              {
                                id: 'pregunta5',
                                text: 'Me gusta estar con otras personas',
                              },
                              {
                                id: 'pregunta6',
                                text: 'A veces me siento triste sin saber por qué',
                              },
                              {
                                id: 'pregunta7',
                                text: 'Siento que nadie me entiende',
                              },
                              {
                                id: 'pregunta8',
                                text: 'Me cuesta concentrarme aunque quiera',
                              },
                              {
                                id: 'pregunta9',
                                text: 'A veces me gustaría desaparecer o no estar aquí',
                              },
                              {
                                id: 'pregunta10',
                                text: 'Siento que las cosas no van a mejorar',
                              },
                            ].map((pregunta, index) => (
                              <div
                                key={pregunta.id}
                                style={{
                                  background: '#fff',
                                  borderRadius: 12,
                                  padding: '16px 20px',
                                  border: '1px solid #e9ecef',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                }}
                              >
                                <div style={{ marginBottom: 12 }}>
                                  <span
                                    style={{
                                      background: '#2196f3',
                                      color: '#fff',
                                      borderRadius: '50%',
                                      width: 24,
                                      height: 24,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.8em',
                                      fontWeight: 600,
                                      marginRight: 12,
                                    }}
                                  >
                                    {index + 1}
                                  </span>
                                  <span
                                    style={{
                                      color: '#333',
                                      fontSize: '1em',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {pregunta.text}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: 8,
                                    justifyContent: 'center',
                                  }}
                                >
                                  {[1, 2, 3].map(valor => (
                                    <label
                                      key={valor}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        padding: '8px 12px',
                                        borderRadius: 8,
                                        border: '2px solid',
                                        borderColor:
                                          emotionalAnswers[pregunta.id] ===
                                          valor.toString()
                                            ? '#2196f3'
                                            : '#e9ecef',
                                        background:
                                          emotionalAnswers[pregunta.id] ===
                                          valor.toString()
                                            ? '#e3f2fd'
                                            : '#fff',
                                        transition: 'all 0.2s ease',
                                        minWidth: 50,
                                      }}
                                    >
                                      <input
                                        type="radio"
                                        name={pregunta.id}
                                        value={valor}
                                        checked={
                                          emotionalAnswers[pregunta.id] ===
                                          valor.toString()
                                        }
                                        onChange={e =>
                                          handleEmotionalAnswerChange(
                                            pregunta.id,
                                            e.target.value
                                          )
                                        }
                                        style={{ display: 'none' }}
                                      />
                                      <span
                                        style={{
                                          fontSize: '1.1em',
                                          fontWeight: 700,
                                          color:
                                            emotionalAnswers[pregunta.id] ===
                                            valor.toString()
                                              ? '#2196f3'
                                              : '#6c757d',
                                        }}
                                      >
                                        {valor}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {activeQuestionnaire === 'violence' && (
                        <div
                          style={{
                            display: 'grid',
                            gap: 16,
                            maxHeight: '400px',
                            overflowY: 'auto',
                            padding: '0 8px',
                          }}
                        >
                          {[
                            {
                              id: 'pregunta1',
                              text: '¿Has presenciado o experimentado violencia física (golpes, empujones, etc.)?',
                            },
                            {
                              id: 'pregunta2',
                              text: '¿Has sido víctima o testigo de violencia psicológica (insultos, humillaciones, amenazas)?',
                            },
                            {
                              id: 'pregunta3',
                              text: '¿Has observado o vivido violencia sexual (tocamientos no deseados, comentarios inapropiados)?',
                            },
                            {
                              id: 'pregunta4',
                              text: '¿Has experimentado discriminación por tu género, raza, orientación sexual o religión?',
                            },
                            {
                              id: 'pregunta5',
                              text: '¿Has sido víctima de ciberbullying o acoso en redes sociales?',
                            },
                          ].map((pregunta, index) => (
                            <div
                              key={pregunta.id}
                              style={{
                                background: '#fff',
                                borderRadius: 12,
                                padding: '16px 20px',
                                border: '1px solid #ffebee',
                              }}
                            >
                              <p
                                style={{
                                  margin: '0 0 12px',
                                  fontWeight: 600,
                                  color: '#333',
                                  fontSize: '1em',
                                }}
                              >
                                {index + 1}. {pregunta.text}
                              </p>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: 16,
                                  justifyContent: 'center',
                                }}
                              >
                                {['si', 'no'].map(opcion => (
                                  <label
                                    key={opcion}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 8,
                                      cursor: 'pointer',
                                      padding: '8px 16px',
                                      borderRadius: 8,
                                      border: '2px solid',
                                      borderColor:
                                        violenceTypesAnswers[pregunta.id] ===
                                        opcion
                                          ? '#f44336'
                                          : '#e9ecef',
                                      background:
                                        violenceTypesAnswers[pregunta.id] ===
                                        opcion
                                          ? '#ffebee'
                                          : '#fff',
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={pregunta.id}
                                      value={opcion}
                                      checked={
                                        violenceTypesAnswers[pregunta.id] ===
                                        opcion
                                      }
                                      onChange={e =>
                                        setViolenceTypesAnswers(prev => ({
                                          ...prev,
                                          [pregunta.id]: e.target.value,
                                        }))
                                      }
                                      style={{ display: 'none' }}
                                    />
                                    <span
                                      style={{
                                        textTransform: 'capitalize',
                                        fontWeight: 600,
                                        color:
                                          violenceTypesAnswers[pregunta.id] ===
                                          opcion
                                            ? '#f44336'
                                            : '#666',
                                      }}
                                    >
                                      {opcion}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeQuestionnaire === 'report' && (
                        <div
                          style={{
                            display: 'grid',
                            gap: 16,
                            maxHeight: '400px',
                            overflowY: 'auto',
                            padding: '0 8px',
                          }}
                        >
                          {[
                            {
                              id: 'pregunta1',
                              text: '¿Te encuentras en una situación que consideras peligrosa o dañina?',
                            },
                            {
                              id: 'pregunta2',
                              text: '¿Has sido víctima de algún tipo de violencia que requiere ser denunciada?',
                            },
                            {
                              id: 'pregunta3',
                              text: '¿Conoces los pasos para presentar una denuncia formal?',
                            },
                          ].map((pregunta, index) => (
                            <div
                              key={pregunta.id}
                              style={{
                                background: '#fff',
                                borderRadius: 12,
                                padding: '16px 20px',
                                border: '1px solid #fff3e0',
                              }}
                            >
                              <p
                                style={{
                                  margin: '0 0 12px',
                                  fontWeight: 600,
                                  color: '#333',
                                  fontSize: '1em',
                                }}
                              >
                                {index + 1}. {pregunta.text}
                              </p>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: 16,
                                  justifyContent: 'center',
                                }}
                              >
                                {['si', 'no'].map(opcion => (
                                  <label
                                    key={opcion}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 8,
                                      cursor: 'pointer',
                                      padding: '8px 16px',
                                      borderRadius: 8,
                                      border: '2px solid',
                                      borderColor:
                                        reportAnswers[pregunta.id] === opcion
                                          ? '#ff9800'
                                          : '#e9ecef',
                                      background:
                                        reportAnswers[pregunta.id] === opcion
                                          ? '#fff3e0'
                                          : '#fff',
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={pregunta.id}
                                      value={opcion}
                                      checked={
                                        reportAnswers[pregunta.id] === opcion
                                      }
                                      onChange={e =>
                                        setReportAnswers(prev => ({
                                          ...prev,
                                          [pregunta.id]: e.target.value,
                                        }))
                                      }
                                      style={{ display: 'none' }}
                                    />
                                    <span
                                      style={{
                                        textTransform: 'capitalize',
                                        fontWeight: 600,
                                        color:
                                          reportAnswers[pregunta.id] === opcion
                                            ? '#ff9800'
                                            : '#666',
                                      }}
                                    >
                                      {opcion}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeQuestionnaire === 'victim' && (
                        <div
                          style={{
                            display: 'grid',
                            gap: 16,
                            maxHeight: '400px',
                            overflowY: 'auto',
                            padding: '0 8px',
                          }}
                        >
                          {[
                            {
                              id: 'pregunta1',
                              text: '¿Has notado cambios drásticos en el comportamiento de alguien cercano?',
                            },
                            {
                              id: 'pregunta2',
                              text: '¿Alguien que conoces muestra signos de aislamiento social o miedo constante?',
                            },
                            {
                              id: 'pregunta3',
                              text: '¿Has observado marcas físicas inexplicables en alguien?',
                            },
                            {
                              id: 'pregunta4',
                              text: '¿Alguien cercano te ha pedido ayuda de manera indirecta o con señales?',
                            },
                          ].map((pregunta, index) => (
                            <div
                              key={pregunta.id}
                              style={{
                                background: '#fff',
                                borderRadius: 12,
                                padding: '16px 20px',
                                border: '1px solid #f3e5f5',
                              }}
                            >
                              <p
                                style={{
                                  margin: '0 0 12px',
                                  fontWeight: 600,
                                  color: '#333',
                                  fontSize: '1em',
                                }}
                              >
                                {index + 1}. {pregunta.text}
                              </p>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: 16,
                                  justifyContent: 'center',
                                }}
                              >
                                {['si', 'no'].map(opcion => (
                                  <label
                                    key={opcion}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 8,
                                      cursor: 'pointer',
                                      padding: '8px 16px',
                                      borderRadius: 8,
                                      border: '2px solid',
                                      borderColor:
                                        victimSignsAnswers[pregunta.id] ===
                                        opcion
                                          ? '#9c27b0'
                                          : '#e9ecef',
                                      background:
                                        victimSignsAnswers[pregunta.id] ===
                                        opcion
                                          ? '#f3e5f5'
                                          : '#fff',
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={pregunta.id}
                                      value={opcion}
                                      checked={
                                        victimSignsAnswers[pregunta.id] ===
                                        opcion
                                      }
                                      onChange={e =>
                                        setVictimSignsAnswers(prev => ({
                                          ...prev,
                                          [pregunta.id]: e.target.value,
                                        }))
                                      }
                                      style={{ display: 'none' }}
                                    />
                                    <span
                                      style={{
                                        textTransform: 'capitalize',
                                        fontWeight: 600,
                                        color:
                                          victimSignsAnswers[pregunta.id] ===
                                          opcion
                                            ? '#9c27b0'
                                            : '#666',
                                      }}
                                    >
                                      {opcion}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeQuestionnaire === 'rights' && (
                        <div
                          style={{
                            display: 'grid',
                            gap: 16,
                            maxHeight: '400px',
                            overflowY: 'auto',
                            padding: '0 8px',
                          }}
                        >
                          {[
                            {
                              id: 'pregunta1',
                              text: '¿Sabes que tienes derecho a vivir libre de violencia?',
                            },
                            {
                              id: 'pregunta2',
                              text: '¿Conoces las instituciones donde puedes denunciar violencia?',
                            },
                            {
                              id: 'pregunta3',
                              text: '¿Sabes que tienes derecho a recibir apoyo psicológico y legal gratuito?',
                            },
                          ].map((pregunta, index) => (
                            <div
                              key={pregunta.id}
                              style={{
                                background: '#fff',
                                borderRadius: 12,
                                padding: '16px 20px',
                                border: '1px solid #e8f5e8',
                              }}
                            >
                              <p
                                style={{
                                  margin: '0 0 12px',
                                  fontWeight: 600,
                                  color: '#333',
                                  fontSize: '1em',
                                }}
                              >
                                {index + 1}. {pregunta.text}
                              </p>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: 16,
                                  justifyContent: 'center',
                                }}
                              >
                                {['si', 'no'].map(opcion => (
                                  <label
                                    key={opcion}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 8,
                                      cursor: 'pointer',
                                      padding: '8px 16px',
                                      borderRadius: 8,
                                      border: '2px solid',
                                      borderColor:
                                        rightsAnswers[pregunta.id] === opcion
                                          ? '#4caf50'
                                          : '#e9ecef',
                                      background:
                                        rightsAnswers[pregunta.id] === opcion
                                          ? '#e8f5e8'
                                          : '#fff',
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={pregunta.id}
                                      value={opcion}
                                      checked={
                                        rightsAnswers[pregunta.id] === opcion
                                      }
                                      onChange={e =>
                                        setRightsAnswers(prev => ({
                                          ...prev,
                                          [pregunta.id]: e.target.value,
                                        }))
                                      }
                                      style={{ display: 'none' }}
                                    />
                                    <span
                                      style={{
                                        textTransform: 'capitalize',
                                        fontWeight: 600,
                                        color:
                                          rightsAnswers[pregunta.id] === opcion
                                            ? '#4caf50'
                                            : '#666',
                                      }}
                                    >
                                      {opcion}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Botones de Acción */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 12,
                        justifyContent: 'center',
                        borderTop: '1px solid #e9ecef',
                        paddingTop: 20,
                      }}
                    >
                      <button
                        onClick={() => {
                          if (activeQuestionnaire === 'emotional')
                            handleEmotionalQuestionnaireSubmit();
                          else if (activeQuestionnaire === 'violence')
                            handleViolenceTypesQuestionnaireSubmit();
                          else if (activeQuestionnaire === 'report')
                            handleReportQuestionnaireSubmit();
                          else if (activeQuestionnaire === 'victim')
                            handleVictimSignsQuestionnaireSubmit();
                          else handleRightsQuestionnaireSubmit();
                        }}
                        disabled={
                          (activeQuestionnaire === 'emotional' &&
                            Object.values(emotionalAnswers).some(
                              answer => answer === ''
                            )) ||
                          (activeQuestionnaire === 'violence' &&
                            Object.values(violenceTypesAnswers).some(
                              answer => answer === ''
                            )) ||
                          (activeQuestionnaire === 'report' &&
                            Object.values(reportAnswers).some(
                              answer => answer === ''
                            )) ||
                          (activeQuestionnaire === 'victim' &&
                            Object.values(victimSignsAnswers).some(
                              answer => answer === ''
                            )) ||
                          (activeQuestionnaire === 'rights' &&
                            Object.values(rightsAnswers).some(
                              answer => answer === ''
                            ))
                        }
                        style={{
                          background:
                            (activeQuestionnaire === 'emotional' &&
                              Object.values(emotionalAnswers).some(
                                answer => answer === ''
                              )) ||
                            (activeQuestionnaire === 'violence' &&
                              Object.values(violenceTypesAnswers).some(
                                answer => answer === ''
                              )) ||
                            (activeQuestionnaire === 'report' &&
                              Object.values(reportAnswers).some(
                                answer => answer === ''
                              )) ||
                            (activeQuestionnaire === 'victim' &&
                              Object.values(victimSignsAnswers).some(
                                answer => answer === ''
                              )) ||
                            (activeQuestionnaire === 'rights' &&
                              Object.values(rightsAnswers).some(
                                answer => answer === ''
                              ))
                              ? '#9e9e9e'
                              : activeQuestionnaire === 'emotional'
                              ? 'linear-gradient(90deg, #2196f3 60%, #42a5f5 100%)'
                              : activeQuestionnaire === 'violence'
                              ? 'linear-gradient(90deg, #f44336 60%, #e53935 100%)'
                              : activeQuestionnaire === 'report'
                              ? 'linear-gradient(90deg, #ff9800 60%, #ffb74d 100%)'
                              : activeQuestionnaire === 'victim'
                              ? 'linear-gradient(90deg, #9c27b0 60%, #ba68c8 100%)'
                              : 'linear-gradient(90deg, #4caf50 60%, #66bb6a 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 12,
                          padding: '14px 32px',
                          fontWeight: 700,
                          fontSize: '1.1em',
                          cursor:
                            (activeQuestionnaire === 'emotional' &&
                              Object.values(emotionalAnswers).some(
                                answer => answer === ''
                              )) ||
                            (activeQuestionnaire === 'violence' &&
                              Object.values(violenceTypesAnswers).some(
                                answer => answer === ''
                              )) ||
                            (activeQuestionnaire === 'report' &&
                              Object.values(reportAnswers).some(
                                answer => answer === ''
                              )) ||
                            (activeQuestionnaire === 'victim' &&
                              Object.values(victimSignsAnswers).some(
                                answer => answer === ''
                              )) ||
                            (activeQuestionnaire === 'rights' &&
                              Object.values(rightsAnswers).some(
                                answer => answer === ''
                              ))
                              ? 'not-allowed'
                              : 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                      >
                        <i className="fas fa-paper-plane" />
                        Enviar Respuestas
                      </button>
                      <button
                        onClick={handleQuestionnaireClose}
                        style={{
                          background:
                            'linear-gradient(90deg, #9e9e9e 60%, #bdbdbd 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 12,
                          padding: '14px 32px',
                          fontWeight: 700,
                          fontSize: '1.1em',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                      >
                        <i className="fas fa-times" />
                        Cancelar
                      </button>
                    </div>
                  </>
                )}
              </section>
            )}

            {/* Sistema de Pestañas - Reporte y Apoyo Personal */}
            <section
              className="premium-section support-tabs-section"
              style={{
                background:
                  'linear-gradient(135deg, #fafdff 80%, #f3e5f5 100%)',
                border: '1.5px solid #d0d7e6',
                borderRadius: 18,
                padding: '32px 32px 28px 32px',
                marginBottom: 24,
                boxShadow: '0 4px 24px 0 rgba(156, 39, 176, 0.08)',
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
                  <i
                    className="fas fa-hands-helping"
                    style={{ fontSize: 22 }}
                  />
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
                    Reporte y Apoyo Personal
                  </h2>
                  <div
                    style={{
                      color: '#4a4a4a',
                      fontSize: '1.07em',
                      marginTop: 2,
                      fontWeight: 400,
                    }}
                  >
                    Herramientas completas para tu seguridad y bienestar.
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

              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  marginBottom: '0',
                  position: 'relative',
                }}
              >
                {/* Línea conectora visual cuando hay pestaña activa */}
                {activeSupportTab && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: '4px',
                      background: '#9c27b0',
                      borderRadius: '2px 2px 0 0',
                      zIndex: 10,
                      opacity: 0.8,
                    }}
                  />
                )}

                <button
                  className={`tab-btn ${
                    activeSupportTab === 'report' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() => handleSupportTabExpand('report')}
                  style={{
                    background:
                      activeSupportTab === 'report'
                        ? 'linear-gradient(90deg, #d32f2f 60%, #f44336 100%)'
                        : 'linear-gradient(90deg, #f44336 60%, #e53935 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius:
                      activeSupportTab === 'report' ? '12px 12px 0 0' : '12px',
                    padding: '12px 16px',
                    fontWeight: 700,
                    fontSize: '0.85em',
                    cursor: 'pointer',
                    boxShadow:
                      activeSupportTab === 'report'
                        ? '0 -2px 8px rgba(244, 67, 54, 0.2)'
                        : '0 2px 12px rgba(244, 67, 54, 0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flex: '1 1 140px',
                    minWidth: 120,
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: activeSupportTab === 'report' ? 10 : 1,
                    transform:
                      activeSupportTab === 'report'
                        ? 'translateY(2px)'
                        : 'translateY(0)',
                  }}
                >
                  <i className="fas fa-file-alt" />
                  Reporte
                </button>

                <button
                  className={`tab-btn ${
                    activeSupportTab === 'myReports' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() => handleSupportTabExpand('myReports')}
                  style={{
                    background:
                      activeSupportTab === 'myReports'
                        ? 'linear-gradient(90deg, #1565c0 60%, #2196f3 100%)'
                        : 'linear-gradient(90deg, #2196f3 60%, #42a5f5 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius:
                      activeSupportTab === 'myReports'
                        ? '12px 12px 0 0'
                        : '12px',
                    padding: '12px 16px',
                    fontWeight: 700,
                    fontSize: '0.85em',
                    cursor: 'pointer',
                    boxShadow:
                      activeSupportTab === 'myReports'
                        ? '0 -2px 8px rgba(33, 150, 243, 0.2)'
                        : '0 2px 12px rgba(33, 150, 243, 0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flex: '1 1 140px',
                    minWidth: 120,
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: activeSupportTab === 'myReports' ? 10 : 1,
                    transform:
                      activeSupportTab === 'myReports'
                        ? 'translateY(2px)'
                        : 'translateY(0)',
                  }}
                >
                  <i className="fas fa-list" />
                  Mis Reportes
                </button>

                <button
                  className={`tab-btn ${
                    activeSupportTab === 'help' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() => handleSupportTabExpand('help')}
                  style={{
                    background:
                      activeSupportTab === 'help'
                        ? 'linear-gradient(90deg, #f57c00 60%, #ff9800 100%)'
                        : 'linear-gradient(90deg, #ff9800 60%, #ffb74d 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius:
                      activeSupportTab === 'help' ? '12px 12px 0 0' : '12px',
                    padding: '12px 16px',
                    fontWeight: 700,
                    fontSize: '0.85em',
                    cursor: 'pointer',
                    boxShadow:
                      activeSupportTab === 'help'
                        ? '0 -2px 8px rgba(255, 152, 0, 0.2)'
                        : '0 2px 12px rgba(255, 152, 0, 0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flex: '1 1 140px',
                    minWidth: 120,
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: activeSupportTab === 'help' ? 10 : 1,
                    transform:
                      activeSupportTab === 'help'
                        ? 'translateY(2px)'
                        : 'translateY(0)',
                  }}
                >
                  <i className="fas fa-question-circle" />
                  Necesito Ayuda
                </button>

                <button
                  className={`tab-btn ${
                    activeSupportTab === 'violence' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() => handleSupportTabExpand('violence')}
                  style={{
                    background:
                      activeSupportTab === 'violence'
                        ? 'linear-gradient(90deg, #7b1fa2 60%, #9c27b0 100%)'
                        : 'linear-gradient(90deg, #9c27b0 60%, #ba68c8 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius:
                      activeSupportTab === 'violence'
                        ? '12px 12px 0 0'
                        : '12px',
                    padding: '12px 16px',
                    fontWeight: 700,
                    fontSize: '0.85em',
                    cursor: 'pointer',
                    boxShadow:
                      activeSupportTab === 'violence'
                        ? '0 -2px 8px rgba(156, 39, 176, 0.2)'
                        : '0 2px 12px rgba(156, 39, 176, 0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flex: '1 1 140px',
                    minWidth: 120,
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: activeSupportTab === 'violence' ? 10 : 1,
                    transform:
                      activeSupportTab === 'violence'
                        ? 'translateY(2px)'
                        : 'translateY(0)',
                  }}
                >
                  <i className="fas fa-exclamation-triangle" />
                  Tipos de Violencia
                </button>

                <button
                  className={`tab-btn ${
                    activeSupportTab === 'recommendations' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() => handleSupportTabExpand('recommendations')}
                  style={{
                    background:
                      activeSupportTab === 'recommendations'
                        ? 'linear-gradient(90deg, #388e3c 60%, #4caf50 100%)'
                        : 'linear-gradient(90deg, #4caf50 60%, #66bb6a 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius:
                      activeSupportTab === 'recommendations'
                        ? '12px 12px 0 0'
                        : '12px',
                    padding: '12px 16px',
                    fontWeight: 700,
                    fontSize: '0.85em',
                    cursor: 'pointer',
                    boxShadow:
                      activeSupportTab === 'recommendations'
                        ? '0 -2px 8px rgba(76, 175, 80, 0.2)'
                        : '0 2px 12px rgba(76, 175, 80, 0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flex: '1 1 140px',
                    minWidth: 120,
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: activeSupportTab === 'recommendations' ? 10 : 1,
                    transform:
                      activeSupportTab === 'recommendations'
                        ? 'translateY(2px)'
                        : 'translateY(0)',
                  }}
                >
                  <i className="fas fa-lightbulb" />
                  Recomendaciones
                </button>

                <button
                  className={`tab-btn ${
                    activeSupportTab === 'suggestions' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() => handleSupportTabExpand('suggestions')}
                  style={{
                    background:
                      activeSupportTab === 'suggestions'
                        ? 'linear-gradient(90deg, #616161 60%, #757575 100%)'
                        : 'linear-gradient(90deg, #757575 60%, #9e9e9e 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius:
                      activeSupportTab === 'suggestions'
                        ? '12px 12px 0 0'
                        : '12px',
                    padding: '12px 16px',
                    fontWeight: 700,
                    fontSize: '0.85em',
                    cursor: 'pointer',
                    boxShadow:
                      activeSupportTab === 'suggestions'
                        ? '0 -2px 8px rgba(117, 117, 117, 0.2)'
                        : '0 2px 12px rgba(117, 117, 117, 0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flex: '1 1 140px',
                    minWidth: 120,
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: activeSupportTab === 'suggestions' ? 10 : 1,
                    transform:
                      activeSupportTab === 'suggestions'
                        ? 'translateY(2px)'
                        : 'translateY(0)',
                  }}
                >
                  <i className="fas fa-comment" />
                  PQR
                </button>

                <button
                  className={`tab-btn ${
                    activeSupportTab === 'emotional' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() => handleSupportTabExpand('emotional')}
                  style={{
                    background:
                      activeSupportTab === 'emotional'
                        ? 'linear-gradient(90deg, #c2185b 60%, #e91e63 100%)'
                        : 'linear-gradient(90deg, #e91e63 60%, #f06292 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius:
                      activeSupportTab === 'emotional'
                        ? '12px 12px 0 0'
                        : '12px',
                    padding: '12px 16px',
                    fontWeight: 700,
                    fontSize: '0.85em',
                    cursor: 'pointer',
                    boxShadow:
                      activeSupportTab === 'emotional'
                        ? '0 -2px 8px rgba(233, 30, 99, 0.2)'
                        : '0 2px 12px rgba(233, 30, 99, 0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flex: '1 1 140px',
                    minWidth: 120,
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: activeSupportTab === 'emotional' ? 10 : 1,
                    transform:
                      activeSupportTab === 'emotional'
                        ? 'translateY(2px)'
                        : 'translateY(0)',
                  }}
                >
                  <i className="fas fa-heart" />
                  Soporte Emocional
                </button>
              </div>
            </section>

            {/* Contenedor Dinámico de Pestañas de Apoyo */}
            {activeSupportTab && (
              <section
                id="support-container"
                className={`support-dynamic-container ${
                  isSupportTabExpanded ? 'expanded' : ''
                }`}
                style={{
                  background: 'linear-gradient(135deg, #fff 80%, #f8f9fa 100%)',
                  border: '2px solid #e9ecef',
                  borderTop: 'none',
                  borderRadius: '0 0 18px 18px',
                  padding: isSupportTabExpanded ? '32px' : '0',
                  marginTop: '-8px',
                  marginBottom: 24,
                  boxShadow: isSupportTabExpanded
                    ? '0 8px 32px rgba(0,0,0,0.12)'
                    : 'none',
                  maxHeight: isSupportTabExpanded ? '1000px' : '0',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: isSupportTabExpanded ? 1 : 0,
                  transform: isSupportTabExpanded
                    ? 'translateY(0)'
                    : 'translateY(-20px)',
                  zIndex: 5,
                }}
              >
                {isSupportTabExpanded && (
                  <>
                    {/* Header del contenido */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 24,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                        }}
                      >
                        <div
                          style={{
                            background: '#9c27b0',
                            color: '#fff',
                            borderRadius: '50%',
                            width: 50,
                            height: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          }}
                        >
                          <i
                            className={`fas ${
                              activeSupportTab === 'report'
                                ? 'fa-file-alt'
                                : activeSupportTab === 'myReports'
                                ? 'fa-list'
                                : activeSupportTab === 'help'
                                ? 'fa-question-circle'
                                : activeSupportTab === 'violence'
                                ? 'fa-exclamation-triangle'
                                : activeSupportTab === 'recommendations'
                                ? 'fa-lightbulb'
                                : activeSupportTab === 'suggestions'
                                ? 'fa-comment'
                                : 'fa-heart'
                            }`}
                            style={{ fontSize: 20 }}
                          />
                        </div>
                        <div>
                          <h2
                            style={{
                              margin: 0,
                              fontSize: '1.5em',
                              color: '#333',
                              fontWeight: 700,
                            }}
                          >
                            {activeSupportTab === 'report'
                              ? 'Reporte de Incidentes'
                              : activeSupportTab === 'myReports'
                              ? 'Mis Reportes'
                              : activeSupportTab === 'help'
                              ? 'Necesito Ayuda'
                              : activeSupportTab === 'violence'
                              ? 'Tipos de Violencia'
                              : activeSupportTab === 'recommendations'
                              ? 'Recomendaciones'
                              : activeSupportTab === 'suggestions'
                              ? 'PQR'
                              : 'Soporte Emocional'}
                          </h2>
                          <p
                            style={{
                              margin: '4px 0 0',
                              color: '#666',
                              fontSize: '1.05em',
                            }}
                          >
                            {activeSupportTab === 'report'
                              ? 'Reporta situaciones que afecten tus derechos o bienestar'
                              : activeSupportTab === 'myReports'
                              ? 'Consulta el estado de tus reportes realizados'
                              : activeSupportTab === 'help'
                              ? 'Guía rápida si te sientes en riesgo o confundido'
                              : activeSupportTab === 'violence'
                              ? 'Información sobre tipos de violencia para protegerte'
                              : activeSupportTab === 'recommendations'
                              ? 'Consejos para cuidar tu salud emocional'
                              : activeSupportTab === 'suggestions'
                              ? 'Peticiones, Quejas, Reclamos y Sugerencias'
                              : 'Conecta con nuestro equipo de profesionales'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleSupportTabClose}
                        style={{
                          background: '#f5f5f5',
                          border: '1px solid #ddd',
                          borderRadius: '50%',
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <i className="fas fa-times" style={{ color: '#666' }} />
                      </button>
                    </div>

                    {/* Contenido dinámico según la pestaña */}
                    <div style={{ marginBottom: 24 }}>
                      {/* Contenido del Reporte */}
                      {activeSupportTab === 'report' && (
                        <div
                          style={{
                            maxHeight: '600px',
                            overflowY: 'auto',
                            padding: '0 8px',
                            // Scroll personalizado
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#ccc #f5f5f5',
                          }}
                        >
                          {/* Pregunta inicial sobre anonimato */}
                          <div
                            style={{
                              marginBottom: 24,
                              padding: '24px',
                              background:
                                'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                              borderRadius: 16,
                              border: '1px solid #dee2e6',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            }}
                          >
                            <h3
                              style={{
                                color: '#495057',
                                fontWeight: 600,
                                marginBottom: 16,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                fontSize: '1.15em',
                              }}
                            >
                              <i
                                className="fas fa-user-secret"
                                style={{ color: '#6c5ce7' }}
                              />
                              ¿Este reporte es anónimo?
                            </h3>
                            <p
                              style={{
                                color: '#6c757d',
                                marginBottom: 20,
                                lineHeight: 1.5,
                                fontSize: '0.95em',
                              }}
                            >
                              Si eliges "Sí", no necesitarás proporcionar datos
                              personales. Si eliges "No", deberás completar tu
                              información de contacto.
                            </p>
                            <div
                              style={{
                                display: 'flex',
                                gap: 16,
                                flexWrap: 'wrap',
                              }}
                            >
                              {[
                                {
                                  key: 'si',
                                  label: 'Sí, mantener anónimo',
                                  icon: 'fas fa-user-secret',
                                  color: '#6c5ce7',
                                },
                                {
                                  key: 'no',
                                  label: 'No, incluir mis datos',
                                  icon: 'fas fa-user-circle',
                                  color: '#00b894',
                                },
                              ].map(option => (
                                <label
                                  key={option.key}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    cursor: 'pointer',
                                    padding: '16px 24px',
                                    borderRadius: 12,
                                    border: '2px solid',
                                    borderColor:
                                      reportForm.isAnonymous ===
                                      (option.key === 'si')
                                        ? option.color
                                        : '#e9ecef',
                                    background:
                                      reportForm.isAnonymous ===
                                      (option.key === 'si')
                                        ? `${option.color}15`
                                        : '#fff',
                                    transition: 'all 0.3s ease',
                                    minWidth: '200px',
                                    boxShadow:
                                      reportForm.isAnonymous ===
                                      (option.key === 'si')
                                        ? `0 4px 15px ${option.color}25`
                                        : '0 2px 8px rgba(0,0,0,0.1)',
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name="isAnonymous"
                                    checked={
                                      reportForm.isAnonymous ===
                                      (option.key === 'si')
                                    }
                                    onChange={() =>
                                      setReportForm(prev => ({
                                        ...prev,
                                        isAnonymous: option.key === 'si',
                                      }))
                                    }
                                    style={{ display: 'none' }}
                                  />
                                  <i
                                    className={option.icon}
                                    style={{
                                      fontSize: '1.2em',
                                      color:
                                        reportForm.isAnonymous ===
                                        (option.key === 'si')
                                          ? option.color
                                          : '#6c757d',
                                    }}
                                  />
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      color:
                                        reportForm.isAnonymous ===
                                        (option.key === 'si')
                                          ? option.color
                                          : '#495057',
                                      fontSize: '0.95em',
                                    }}
                                  >
                                    {option.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Formulario condicional */}
                          {reportForm.isAnonymous !== null && (
                            <>
                              {!reportForm.isAnonymous && (
                                <>
                                  {/* Sección: Datos personales */}
                                  {/* Container principal para las dos secciones lado a lado */}
                                  <div
                                    style={{
                                      display: 'grid',
                                      gap: 24,
                                      gridTemplateColumns:
                                        window.innerWidth >= 1024
                                          ? '1fr 1fr'
                                          : '1fr',
                                      marginBottom: 32,
                                    }}
                                  >
                                    {/* Sección: Datos personales */}
                                    <div
                                      style={{
                                        padding: '24px',
                                        background: '#fff',
                                        borderRadius: 12,
                                        border: '1px solid #e9ecef',
                                        height: 'fit-content',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#495057',
                                          fontWeight: 600,
                                          marginBottom: 20,
                                          paddingBottom: 12,
                                          borderBottom: '2px solid #e9ecef',
                                          fontSize: '1.1em',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 8,
                                        }}
                                      >
                                        <i
                                          className="fas fa-user"
                                          style={{ color: '#9c27b0' }}
                                        />
                                        Datos personales
                                      </h3>
                                      <div style={{ display: 'grid', gap: 16 }}>
                                        <div>
                                          <label
                                            style={{
                                              display: 'block',
                                              marginBottom: 8,
                                              fontWeight: 500,
                                              color: '#495057',
                                            }}
                                          >
                                            Nombre completo *
                                          </label>
                                          <input
                                            type="text"
                                            placeholder="Ingresa tu nombre completo"
                                            value={
                                              reportForm.personalData.fullName
                                            }
                                            onChange={e =>
                                              setReportForm(prev => ({
                                                ...prev,
                                                personalData: {
                                                  ...prev.personalData,
                                                  fullName: e.target.value,
                                                },
                                              }))
                                            }
                                            style={{
                                              width: '100%',
                                              padding: '12px 16px',
                                              borderRadius: 8,
                                              border: '1px solid #ddd',
                                              fontSize: '1em',
                                              transition:
                                                'border-color 0.2s, box-shadow 0.2s',
                                              background: '#fafafa',
                                            }}
                                            onFocus={e => {
                                              e.target.style.borderColor =
                                                '#9c27b0';
                                              e.target.style.boxShadow =
                                                '0 0 0 3px rgba(156, 39, 176, 0.1)';
                                              e.target.style.background =
                                                '#fff';
                                            }}
                                            onBlur={e => {
                                              e.target.style.borderColor =
                                                '#ddd';
                                              e.target.style.boxShadow = 'none';
                                              e.target.style.background =
                                                '#fafafa';
                                            }}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: 'grid',
                                            gap: 16,
                                            gridTemplateColumns:
                                              window.innerWidth >= 768
                                                ? '1fr 1fr'
                                                : '1fr',
                                          }}
                                        >
                                          <div>
                                            <label
                                              style={{
                                                display: 'block',
                                                marginBottom: 8,
                                                fontWeight: 500,
                                                color: '#495057',
                                              }}
                                            >
                                              Tipo de documento *
                                            </label>
                                            <select
                                              value={
                                                reportForm.personalData
                                                  .documentType
                                              }
                                              onChange={e =>
                                                setReportForm(prev => ({
                                                  ...prev,
                                                  personalData: {
                                                    ...prev.personalData,
                                                    documentType:
                                                      e.target.value,
                                                  },
                                                }))
                                              }
                                              style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: 8,
                                                border: '1px solid #ddd',
                                                fontSize: '1em',
                                                background: '#fafafa',
                                                cursor: 'pointer',
                                              }}
                                            >
                                              <option value="">
                                                Seleccionar
                                              </option>
                                              <option value="DNI">DNI</option>
                                              <option value="Pasaporte">
                                                Pasaporte
                                              </option>
                                              <option value="Cedula">
                                                Cédula
                                              </option>
                                            </select>
                                          </div>
                                          <div>
                                            <label
                                              style={{
                                                display: 'block',
                                                marginBottom: 8,
                                                fontWeight: 500,
                                                color: '#495057',
                                              }}
                                            >
                                              Número de documento *
                                            </label>
                                            <input
                                              type="text"
                                              placeholder="Número"
                                              value={
                                                reportForm.personalData
                                                  .documentNumber
                                              }
                                              onChange={e =>
                                                setReportForm(prev => ({
                                                  ...prev,
                                                  personalData: {
                                                    ...prev.personalData,
                                                    documentNumber:
                                                      e.target.value,
                                                  },
                                                }))
                                              }
                                              style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: 8,
                                                border: '1px solid #ddd',
                                                fontSize: '1em',
                                                background: '#fafafa',
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            display: 'grid',
                                            gap: 16,
                                            gridTemplateColumns:
                                              window.innerWidth >= 768
                                                ? '1fr 1fr'
                                                : '1fr',
                                          }}
                                        >
                                          <div>
                                            <label
                                              style={{
                                                display: 'block',
                                                marginBottom: 8,
                                                fontWeight: 500,
                                                color: '#495057',
                                              }}
                                            >
                                              Fecha de nacimiento *
                                            </label>
                                            <input
                                              type="date"
                                              value={
                                                reportForm.personalData
                                                  .birthDate
                                              }
                                              onChange={e =>
                                                setReportForm(prev => ({
                                                  ...prev,
                                                  personalData: {
                                                    ...prev.personalData,
                                                    birthDate: e.target.value,
                                                  },
                                                }))
                                              }
                                              style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: 8,
                                                border: '1px solid #ddd',
                                                fontSize: '1em',
                                                background: '#fafafa',
                                              }}
                                            />
                                          </div>
                                          <div>
                                            <label
                                              style={{
                                                display: 'block',
                                                marginBottom: 8,
                                                fontWeight: 500,
                                                color: '#495057',
                                              }}
                                            >
                                              Edad *
                                            </label>
                                            <input
                                              type="number"
                                              placeholder="Edad"
                                              value={
                                                reportForm.personalData.age
                                              }
                                              onChange={e =>
                                                setReportForm(prev => ({
                                                  ...prev,
                                                  personalData: {
                                                    ...prev.personalData,
                                                    age: e.target.value,
                                                  },
                                                }))
                                              }
                                              style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: 8,
                                                border: '1px solid #ddd',
                                                fontSize: '1em',
                                                background: '#fafafa',
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            display: 'grid',
                                            gap: 16,
                                            gridTemplateColumns:
                                              window.innerWidth >= 768
                                                ? '1fr 1fr'
                                                : '1fr',
                                          }}
                                        >
                                          <div>
                                            <label
                                              style={{
                                                display: 'block',
                                                marginBottom: 8,
                                                fontWeight: 500,
                                                color: '#495057',
                                              }}
                                            >
                                              Sexo / Género *
                                            </label>
                                            <select
                                              value={
                                                reportForm.personalData.gender
                                              }
                                              onChange={e =>
                                                setReportForm(prev => ({
                                                  ...prev,
                                                  personalData: {
                                                    ...prev.personalData,
                                                    gender: e.target.value,
                                                  },
                                                }))
                                              }
                                              style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: 8,
                                                border: '1px solid #ddd',
                                                fontSize: '1em',
                                                background: '#fafafa',
                                                cursor: 'pointer',
                                              }}
                                            >
                                              <option value="">
                                                Seleccionar
                                              </option>
                                              <option value="Masculino">
                                                Masculino
                                              </option>
                                              <option value="Femenino">
                                                Femenino
                                              </option>
                                              <option value="Otro">Otro</option>
                                              <option value="Prefiero no decir">
                                                Prefiero no decir
                                              </option>
                                            </select>
                                          </div>
                                          <div>
                                            <label
                                              style={{
                                                display: 'block',
                                                marginBottom: 8,
                                                fontWeight: 500,
                                                color: '#495057',
                                              }}
                                            >
                                              Estado civil
                                            </label>
                                            <select
                                              value={
                                                reportForm.personalData
                                                  .civilStatus
                                              }
                                              onChange={e =>
                                                setReportForm(prev => ({
                                                  ...prev,
                                                  personalData: {
                                                    ...prev.personalData,
                                                    civilStatus: e.target.value,
                                                  },
                                                }))
                                              }
                                              style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: 8,
                                                border: '1px solid #ddd',
                                                fontSize: '1em',
                                                background: '#fafafa',
                                                cursor: 'pointer',
                                              }}
                                            >
                                              <option value="">
                                                Seleccionar
                                              </option>
                                              <option value="Soltero/a">
                                                Soltero/a
                                              </option>
                                              <option value="Casado/a">
                                                Casado/a
                                              </option>
                                              <option value="Divorciado/a">
                                                Divorciado/a
                                              </option>
                                              <option value="Viudo/a">
                                                Viudo/a
                                              </option>
                                              <option value="Unión libre">
                                                Unión libre
                                              </option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Sección: Contacto */}
                                    <div
                                      style={{
                                        padding: '24px',
                                        background: '#fff',
                                        borderRadius: 12,
                                        border: '1px solid #e9ecef',
                                        height: 'fit-content',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#495057',
                                          fontWeight: 600,
                                          marginBottom: 20,
                                          paddingBottom: 12,
                                          borderBottom: '2px solid #e9ecef',
                                          fontSize: '1.1em',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 8,
                                        }}
                                      >
                                        <i
                                          className="fas fa-address-book"
                                          style={{ color: '#17a2b8' }}
                                        />
                                        Contacto
                                      </h3>
                                      <div style={{ display: 'grid', gap: 16 }}>
                                        <div>
                                          <label
                                            style={{
                                              display: 'block',
                                              marginBottom: 8,
                                              fontWeight: 500,
                                              color: '#495057',
                                            }}
                                          >
                                            Correo electrónico *
                                          </label>
                                          <input
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                            value={
                                              reportForm.personalData.email
                                            }
                                            onChange={e =>
                                              setReportForm(prev => ({
                                                ...prev,
                                                personalData: {
                                                  ...prev.personalData,
                                                  email: e.target.value,
                                                },
                                              }))
                                            }
                                            style={{
                                              width: '100%',
                                              padding: '12px 16px',
                                              borderRadius: 8,
                                              border: '1px solid #ddd',
                                              fontSize: '1em',
                                              background: '#fafafa',
                                              transition:
                                                'border-color 0.2s, box-shadow 0.2s',
                                            }}
                                            onFocus={e => {
                                              e.target.style.borderColor =
                                                '#17a2b8';
                                              e.target.style.boxShadow =
                                                '0 0 0 3px rgba(23, 162, 184, 0.1)';
                                              e.target.style.background =
                                                '#fff';
                                            }}
                                            onBlur={e => {
                                              e.target.style.borderColor =
                                                '#ddd';
                                              e.target.style.boxShadow = 'none';
                                              e.target.style.background =
                                                '#fafafa';
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <label
                                            style={{
                                              display: 'block',
                                              marginBottom: 8,
                                              fontWeight: 500,
                                              color: '#495057',
                                            }}
                                          >
                                            Teléfono del usuario *
                                          </label>
                                          <input
                                            type="tel"
                                            placeholder="Número de teléfono"
                                            value={
                                              reportForm.personalData.phone
                                            }
                                            onChange={e =>
                                              setReportForm(prev => ({
                                                ...prev,
                                                personalData: {
                                                  ...prev.personalData,
                                                  phone: e.target.value,
                                                },
                                              }))
                                            }
                                            style={{
                                              width: '100%',
                                              padding: '12px 16px',
                                              borderRadius: 8,
                                              border: '1px solid #ddd',
                                              fontSize: '1em',
                                              background: '#fafafa',
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <label
                                            style={{
                                              display: 'block',
                                              marginBottom: 8,
                                              fontWeight: 500,
                                              color: '#495057',
                                            }}
                                          >
                                            Dirección de residencia *
                                          </label>
                                          <input
                                            type="text"
                                            placeholder="Dirección completa de residencia"
                                            value={
                                              reportForm.personalData.address
                                            }
                                            onChange={e =>
                                              setReportForm(prev => ({
                                                ...prev,
                                                personalData: {
                                                  ...prev.personalData,
                                                  address: e.target.value,
                                                },
                                              }))
                                            }
                                            style={{
                                              width: '100%',
                                              padding: '12px 16px',
                                              borderRadius: 8,
                                              border: '1px solid #ddd',
                                              fontSize: '1em',
                                              background: '#fafafa',
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <label
                                            style={{
                                              display: 'block',
                                              marginBottom: 8,
                                              fontWeight: 500,
                                              color: '#495057',
                                            }}
                                          >
                                            Ocupación
                                          </label>
                                          <input
                                            type="text"
                                            placeholder="Tu ocupación actual"
                                            value={
                                              reportForm.personalData
                                                .occupation || ''
                                            }
                                            onChange={e =>
                                              setReportForm(prev => ({
                                                ...prev,
                                                personalData: {
                                                  ...prev.personalData,
                                                  occupation: e.target.value,
                                                },
                                              }))
                                            }
                                            style={{
                                              width: '100%',
                                              padding: '12px 16px',
                                              borderRadius: 8,
                                              border: '1px solid #ddd',
                                              fontSize: '1em',
                                              background: '#fafafa',
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}

                              {reportForm.isAnonymous && (
                                <div
                                  style={{
                                    marginBottom: 24,
                                    padding: '24px',
                                    background:
                                      'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                                    borderRadius: 12,
                                    border: '1px solid #ffeaa7',
                                    boxShadow:
                                      '0 2px 10px rgba(255, 193, 7, 0.15)',
                                  }}
                                >
                                  <h3
                                    style={{
                                      color: '#856404',
                                      fontWeight: 600,
                                      marginBottom: 16,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 12,
                                    }}
                                  >
                                    <i
                                      className="fas fa-user-secret"
                                      style={{ color: '#6c5ce7' }}
                                    />
                                    Reporte Anónimo - Contacto Opcional
                                  </h3>
                                  <p
                                    style={{
                                      color: '#856404',
                                      marginBottom: 16,
                                      fontSize: '0.95em',
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    <i
                                      className="fas fa-info-circle"
                                      style={{ marginRight: 8 }}
                                    />
                                    Si deseas recibir seguimiento de tu reporte,
                                    puedes proporcionar un correo electrónico
                                    (opcional).
                                  </p>
                                  <input
                                    type="email"
                                    placeholder="Correo electrónico de contacto (opcional)"
                                    value={reportForm.incidentData.contactEmail}
                                    onChange={e =>
                                      setReportForm(prev => ({
                                        ...prev,
                                        incidentData: {
                                          ...prev.incidentData,
                                          contactEmail: e.target.value,
                                        },
                                      }))
                                    }
                                    style={{
                                      width: '100%',
                                      padding: '12px 16px',
                                      borderRadius: 8,
                                      border: '1px solid #ddd',
                                      fontSize: '1em',
                                    }}
                                  />
                                </div>
                              )}

                              {/* Información del incidente */}
                              <div
                                style={{
                                  padding: '24px',
                                  background: '#fff',
                                  borderRadius: 12,
                                  border: '1px solid #e9ecef',
                                }}
                              >
                                <h3
                                  style={{
                                    color: '#495057',
                                    fontWeight: 600,
                                    marginBottom: 20,
                                    paddingBottom: 12,
                                    borderBottom: '2px solid #e9ecef',
                                    fontSize: '1.1em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                  }}
                                >
                                  <i
                                    className="fas fa-exclamation-circle"
                                    style={{ color: '#dc3545' }}
                                  />
                                  Información del Incidente
                                </h3>
                                <div style={{ display: 'grid', gap: 16 }}>
                                  <div>
                                    <label
                                      style={{
                                        display: 'block',
                                        marginBottom: 8,
                                        fontWeight: 500,
                                        color: '#495057',
                                      }}
                                    >
                                      Descripción detallada del incidente *
                                    </label>
                                    <textarea
                                      placeholder="Describe detalladamente lo sucedido, incluyendo fechas, lugares y personas involucradas..."
                                      value={
                                        reportForm.incidentData.description
                                      }
                                      onChange={e =>
                                        setReportForm(prev => ({
                                          ...prev,
                                          incidentData: {
                                            ...prev.incidentData,
                                            description: e.target.value,
                                          },
                                        }))
                                      }
                                      style={{
                                        width: '100%',
                                        minHeight: '120px',
                                        padding: '12px 16px',
                                        borderRadius: 8,
                                        border: '1px solid #ddd',
                                        fontSize: '1em',
                                        resize: 'vertical',
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label
                                      style={{
                                        display: 'block',
                                        marginBottom: 8,
                                        fontWeight: 500,
                                        color: '#495057',
                                      }}
                                    >
                                      Evidencias disponibles (opcional)
                                    </label>
                                    <textarea
                                      placeholder="Describe cualquier evidencia que tengas: fotos, videos, mensajes, testigos, etc."
                                      value={reportForm.incidentData.evidence}
                                      onChange={e =>
                                        setReportForm(prev => ({
                                          ...prev,
                                          incidentData: {
                                            ...prev.incidentData,
                                            evidence: e.target.value,
                                          },
                                        }))
                                      }
                                      style={{
                                        width: '100%',
                                        minHeight: '80px',
                                        padding: '12px 16px',
                                        borderRadius: 8,
                                        border: '1px solid #ddd',
                                        fontSize: '1em',
                                        resize: 'vertical',
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label
                                      style={{
                                        display: 'block',
                                        marginBottom: 8,
                                        fontWeight: 500,
                                        color: '#495057',
                                      }}
                                    >
                                      Contexto previo (opcional)
                                    </label>
                                    <textarea
                                      placeholder="¿Había ocurrido algo similar antes? ¿Hay antecedentes relevantes?"
                                      value={reportForm.incidentData.context}
                                      onChange={e =>
                                        setReportForm(prev => ({
                                          ...prev,
                                          incidentData: {
                                            ...prev.incidentData,
                                            context: e.target.value,
                                          },
                                        }))
                                      }
                                      style={{
                                        width: '100%',
                                        minHeight: '80px',
                                        padding: '12px 16px',
                                        borderRadius: 8,
                                        border: '1px solid #ddd',
                                        fontSize: '1em',
                                        resize: 'vertical',
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Botón de envío */}
                              <div
                                style={{
                                  marginTop: 32,
                                  textAlign: 'center',
                                  padding: '24px',
                                  background:
                                    'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                  borderRadius: 12,
                                  border: '1px solid #dee2e6',
                                }}
                              >
                                <button
                                  onClick={handleReportSubmit}
                                  disabled={
                                    !reportForm.incidentData.description.trim()
                                  }
                                  style={{
                                    background:
                                      reportForm.incidentData.description.trim()
                                        ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                                        : '#ccc',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '16px 48px',
                                    borderRadius: 12,
                                    fontSize: '1.1em',
                                    fontWeight: 600,
                                    cursor:
                                      reportForm.incidentData.description.trim()
                                        ? 'pointer'
                                        : 'not-allowed',
                                    transition: 'all 0.3s ease',
                                    boxShadow:
                                      reportForm.incidentData.description.trim()
                                        ? '0 4px 15px rgba(220, 53, 69, 0.3)'
                                        : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    margin: '0 auto',
                                    transform: 'translateY(0)',
                                  }}
                                  onMouseOver={e => {
                                    if (
                                      reportForm.incidentData.description.trim()
                                    ) {
                                      e.target.style.transform =
                                        'translateY(-2px)';
                                      e.target.style.boxShadow =
                                        '0 6px 20px rgba(220, 53, 69, 0.4)';
                                    }
                                  }}
                                  onMouseOut={e => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow =
                                      reportForm.incidentData.description.trim()
                                        ? '0 4px 15px rgba(220, 53, 69, 0.3)'
                                        : 'none';
                                  }}
                                >
                                  <i className="fas fa-paper-plane" />
                                  Enviar Reporte
                                </button>
                                {!reportForm.incidentData.description.trim() && (
                                  <p
                                    style={{
                                      color: '#6c757d',
                                      fontSize: '0.9em',
                                      marginTop: 12,
                                      fontStyle: 'italic',
                                    }}
                                  >
                                    Por favor, describe el incidente para enviar
                                    el reporte
                                  </p>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Contenido de Mis Reportes */}
                      {activeSupportTab === 'myReports' && (
                        <div
                          style={{ textAlign: 'center', padding: '40px 20px' }}
                        >
                          <i
                            className="fas fa-inbox"
                            style={{
                              fontSize: '3em',
                              color: '#ccc',
                              marginBottom: 16,
                            }}
                          />
                          <h3 style={{ color: '#666', marginBottom: 12 }}>
                            No tienes reportes registrados
                          </h3>
                          <p style={{ color: '#999', fontSize: '1.05em' }}>
                            Cuando realices un reporte, aparecerá aquí con su
                            estado de seguimiento.
                          </p>
                        </div>
                      )}

                      {/* Contenido de Necesito Ayuda */}
                      {activeSupportTab === 'help' && (
                        <div style={{ padding: '20px' }}>
                          <div
                            style={{
                              display: 'grid',
                              gap: 20,
                              gridTemplateColumns:
                                'repeat(auto-fit, minmax(300px, 1fr))',
                            }}
                          >
                            <div
                              style={{
                                background: '#fff3cd',
                                border: '1px solid #ffeaa7',
                                borderRadius: 12,
                                padding: '20px',
                              }}
                            >
                              <h3
                                style={{
                                  color: '#856404',
                                  marginBottom: 16,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                }}
                              >
                                <i className="fas fa-exclamation-circle" />
                                ¿Qué hacer?
                              </h3>
                              <ul
                                style={{
                                  color: '#6c5701',
                                  margin: 0,
                                  paddingLeft: 20,
                                }}
                              >
                                <li>Mantén la calma y busca un lugar seguro</li>
                                <li>Documenta la situación si es posible</li>
                                <li>Contacta a una persona de confianza</li>
                                <li>No enfrentes solo/a la situación</li>
                              </ul>
                            </div>
                            <div
                              style={{
                                background: '#d4edda',
                                border: '1px solid #c3e6cb',
                                borderRadius: 12,
                                padding: '20px',
                              }}
                            >
                              <h3
                                style={{
                                  color: '#155724',
                                  marginBottom: 16,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                }}
                              >
                                <i className="fas fa-users" />
                                ¿A quién acudir?
                              </h3>
                              <ul
                                style={{
                                  color: '#0c5460',
                                  margin: 0,
                                  paddingLeft: 20,
                                }}
                              >
                                <li>Línea nacional: 123 (emergencias)</li>
                                <li>Familia o amigos de confianza</li>
                                <li>Profesores o autoridades educativas</li>
                                <li>Nuestro equipo de apoyo</li>
                              </ul>
                            </div>
                            <div
                              style={{
                                background: '#f8d7da',
                                border: '1px solid #f5c6cb',
                                borderRadius: 12,
                                padding: '20px',
                              }}
                            >
                              <h3
                                style={{
                                  color: '#721c24',
                                  marginBottom: 16,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                }}
                              >
                                <i className="fas fa-shield-alt" />
                                ¿Cómo cuidarte?
                              </h3>
                              <ul
                                style={{
                                  color: '#491217',
                                  margin: 0,
                                  paddingLeft: 20,
                                }}
                              >
                                <li>No guardes secretos que te hagan daño</li>
                                <li>Confía en tus instintos</li>
                                <li>Busca apoyo emocional profesional</li>
                                <li>Recuerda: no es tu culpa</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Contenido de Tipos de Violencia */}
                      {activeSupportTab === 'violence' && (
                        <div
                          style={{
                            padding: '24px',
                            maxHeight: 'none', // Eliminamos limitación de altura
                            overflowY: 'visible', // Aseguramos que todo sea visible
                          }}
                        >
                          {/* Header descriptivo */}
                          <div
                            style={{
                              background:
                                'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                              padding: '20px',
                              borderRadius: 12,
                              marginBottom: 24,
                              border: '1px solid #dee2e6',
                            }}
                          >
                            <h3
                              style={{
                                color: '#495057',
                                fontWeight: 600,
                                marginBottom: 8,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                              }}
                            >
                              <i
                                className="fas fa-shield-alt"
                                style={{ color: '#dc3545' }}
                              />
                              Tipos de Violencia
                            </h3>
                            <p
                              style={{
                                color: '#6c757d',
                                margin: 0,
                                lineHeight: 1.5,
                              }}
                            >
                              Información sobre tipos de violencia para
                              protegerte y reconocer situaciones de riesgo
                            </p>
                          </div>

                          {/* Grid de tipos de violencia */}
                          <div
                            style={{
                              display: 'grid',
                              gap: 20,
                              gridTemplateColumns:
                                'repeat(auto-fit, minmax(320px, 1fr))',
                            }}
                          >
                            {[
                              {
                                type: 'Física',
                                color: '#dc3545',
                                icon: 'fas fa-hand-paper',
                                description:
                                  'Golpes, empujones, pellizcos, o cualquier daño corporal.',
                                examples:
                                  'Bofetadas, puñetazos, patadas, jalones de cabello.',
                              },
                              {
                                type: 'Psicológica',
                                color: '#6f42c1',
                                icon: 'fas fa-brain',
                                description:
                                  'Daño emocional mediante humillaciones, amenazas o chantajes.',
                                examples:
                                  'Insultos constantes, amenazas, manipulación, aislamiento.',
                              },
                              {
                                type: 'Verbal',
                                color: '#fd7e14',
                                icon: 'fas fa-comment-slash',
                                description:
                                  'Uso de palabras para lastimar, humillar o degradar.',
                                examples:
                                  'Gritos, insultos, burlas, comentarios hirientes.',
                              },
                              {
                                type: 'Sexual',
                                color: '#e83e8c',
                                icon: 'fas fa-exclamation-triangle',
                                description:
                                  'Cualquier acto sexual sin consentimiento o inapropiado.',
                                examples:
                                  'Tocamientos, comentarios sexuales, acoso, abuso.',
                              },
                              {
                                type: 'Negligencia',
                                color: '#6c757d',
                                icon: 'fas fa-user-times',
                                description:
                                  'Falta de cuidado o atención a necesidades básicas.',
                                examples:
                                  'No proveer comida, cuidado médico, educación, protección.',
                              },
                            ].map((item, index) => (
                              <div
                                key={index}
                                style={{
                                  background: '#fff',
                                  border: `2px solid ${item.color}30`,
                                  borderRadius: 16,
                                  padding: '24px',
                                  borderLeft: `6px solid ${item.color}`,
                                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                                  transition:
                                    'transform 0.2s ease, box-shadow 0.2s ease',
                                  cursor: 'default',
                                }}
                                onMouseOver={e => {
                                  e.currentTarget.style.transform =
                                    'translateY(-4px)';
                                  e.currentTarget.style.boxShadow = `0 8px 25px ${item.color}20`;
                                }}
                                onMouseOut={e => {
                                  e.currentTarget.style.transform =
                                    'translateY(0)';
                                  e.currentTarget.style.boxShadow =
                                    '0 4px 15px rgba(0,0,0,0.08)';
                                }}
                              >
                                {/* Header de la tarjeta */}
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginBottom: 16,
                                  }}
                                >
                                  <div
                                    style={{
                                      background: `${item.color}15`,
                                      borderRadius: '50%',
                                      width: 48,
                                      height: 48,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <i
                                      className={item.icon}
                                      style={{
                                        fontSize: '1.4em',
                                        color: item.color,
                                      }}
                                    />
                                  </div>
                                  <h3
                                    style={{
                                      color: item.color,
                                      margin: 0,
                                      fontSize: '1.3em',
                                      fontWeight: 600,
                                    }}
                                  >
                                    {item.type}
                                  </h3>
                                </div>

                                {/* Descripción */}
                                <p
                                  style={{
                                    color: '#333',
                                    marginBottom: 16,
                                    lineHeight: 1.6,
                                    fontSize: '1em',
                                  }}
                                >
                                  {item.description}
                                </p>

                                {/* Ejemplos */}
                                <div
                                  style={{
                                    background: `${item.color}08`,
                                    padding: '16px',
                                    borderRadius: 12,
                                    border: `1px solid ${item.color}20`,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 8,
                                      marginBottom: 8,
                                    }}
                                  >
                                    <i
                                      className="fas fa-lightbulb"
                                      style={{
                                        color: item.color,
                                        fontSize: '0.9em',
                                      }}
                                    />
                                    <strong
                                      style={{
                                        color: item.color,
                                        fontSize: '0.95em',
                                      }}
                                    >
                                      Ejemplos:
                                    </strong>
                                  </div>
                                  <span
                                    style={{
                                      color: '#555',
                                      lineHeight: 1.5,
                                      fontSize: '0.95em',
                                    }}
                                  >
                                    {item.examples}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Footer informativo */}
                          <div
                            style={{
                              marginTop: 32,
                              padding: '20px',
                              background:
                                'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                              borderRadius: 12,
                              border: '1px solid #ffeaa7',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                marginBottom: 12,
                              }}
                            >
                              <i
                                className="fas fa-info-circle"
                                style={{ color: '#856404' }}
                              />
                              <strong
                                style={{ color: '#856404', fontSize: '1.1em' }}
                              >
                                Recuerda:
                              </strong>
                            </div>
                            <p
                              style={{
                                color: '#6c5701',
                                margin: 0,
                                lineHeight: 1.6,
                              }}
                            >
                              Si reconoces alguno de estos tipos de violencia en
                              tu entorno, no dudes en buscar ayuda. Ningún tipo
                              de violencia es normal o aceptable. Tu seguridad y
                              bienestar son prioritarios.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Contenido de Recomendaciones */}
                      {activeSupportTab === 'recommendations' && (
                        <div style={{ padding: '20px' }}>
                          <div style={{ display: 'grid', gap: 16 }}>
                            {[
                              {
                                title: 'Habla con alguien de confianza',
                                icon: 'fas fa-comments',
                                description:
                                  'Comparte tus sentimientos con familia, amigos o profesores.',
                                color: '#28a745',
                              },
                              {
                                title: 'No te aísles',
                                icon: 'fas fa-users',
                                description:
                                  'Mantén conexiones sociales saludables y actividades grupales.',
                                color: '#17a2b8',
                              },
                              {
                                title: 'Pide ayuda si te sientes mal',
                                icon: 'fas fa-hand-holding-heart',
                                description:
                                  'No esperes a sentirte peor. Busca apoyo profesional cuando lo necesites.',
                                color: '#ffc107',
                              },
                              {
                                title: 'Haz cosas que te hagan sentir bien',
                                icon: 'fas fa-smile',
                                description:
                                  'Dedica tiempo a actividades que disfrutes y te relajen.',
                                color: '#6f42c1',
                              },
                            ].map((item, index) => (
                              <div
                                key={index}
                                style={{
                                  background: '#fff',
                                  border: '1px solid #e9ecef',
                                  borderRadius: 12,
                                  padding: '20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 16,
                                }}
                              >
                                <div
                                  style={{
                                    background: item.color,
                                    color: '#fff',
                                    borderRadius: '50%',
                                    width: 50,
                                    height: 50,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <i
                                    className={item.icon}
                                    style={{ fontSize: '1.2em' }}
                                  />
                                </div>
                                <div>
                                  <h3
                                    style={{
                                      color: '#333',
                                      marginBottom: 8,
                                      fontSize: '1.1em',
                                    }}
                                  >
                                    {item.title}
                                  </h3>
                                  <p
                                    style={{
                                      color: '#666',
                                      margin: 0,
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contenido de Sugerencias y PQR */}
                      {activeSupportTab === 'suggestions' && (
                        <div style={{ padding: '24px' }}>
                          {/* Header explicativo */}
                          <div
                            style={{
                              background:
                                'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                              padding: '20px',
                              borderRadius: 12,
                              marginBottom: 24,
                              border: '1px solid #dee2e6',
                            }}
                          >
                            <h3
                              style={{
                                color: '#495057',
                                fontWeight: 600,
                                marginBottom: 8,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                              }}
                            >
                              <i
                                className="fas fa-comment-dots"
                                style={{ color: '#28a745' }}
                              />
                              PQR - Peticiones, Quejas y Reclamos
                            </h3>
                            <p
                              style={{
                                color: '#6c757d',
                                margin: 0,
                                lineHeight: 1.5,
                              }}
                            >
                              Envía tus peticiones, quejas, reclamos o
                              sugerencias para mejorar nuestros servicios
                            </p>
                          </div>

                          {/* Formulario PQR */}
                          <div
                            style={{
                              background: '#fff',
                              borderRadius: 16,
                              padding: '32px',
                              border: '1px solid #e9ecef',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                            }}
                          >
                            <div style={{ display: 'grid', gap: 20 }}>
                              {/* Tipo de PQR */}
                              <div>
                                <label
                                  style={{
                                    display: 'block',
                                    marginBottom: 12,
                                    fontWeight: 600,
                                    color: '#495057',
                                    fontSize: '1.05em',
                                  }}
                                >
                                  Tipo de comunicación *
                                </label>
                                <div
                                  style={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                      'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: 12,
                                  }}
                                >
                                  {[
                                    {
                                      key: 'peticion',
                                      label: 'Petición',
                                      icon: 'fas fa-hand-paper',
                                      color: '#17a2b8',
                                      desc: 'Solicitar información o servicios',
                                    },
                                    {
                                      key: 'queja',
                                      label: 'Queja',
                                      icon: 'fas fa-exclamation-circle',
                                      color: '#ffc107',
                                      desc: 'Expresar insatisfacción con un servicio',
                                    },
                                    {
                                      key: 'reclamo',
                                      label: 'Reclamo',
                                      icon: 'fas fa-gavel',
                                      color: '#dc3545',
                                      desc: 'Solicitar solución a un problema',
                                    },
                                    {
                                      key: 'sugerencia',
                                      label: 'Sugerencia',
                                      icon: 'fas fa-lightbulb',
                                      color: '#28a745',
                                      desc: 'Proponer mejoras o ideas',
                                    },
                                  ].map(type => (
                                    <label
                                      key={type.key}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '16px',
                                        borderRadius: 12,
                                        border: '2px solid',
                                        borderColor:
                                          suggestionForm.type === type.key
                                            ? type.color
                                            : '#e9ecef',
                                        background:
                                          suggestionForm.type === type.key
                                            ? `${type.color}10`
                                            : '#fff',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        textAlign: 'center',
                                      }}
                                    >
                                      <input
                                        type="radio"
                                        name="pqrType"
                                        value={type.key}
                                        checked={
                                          suggestionForm.type === type.key
                                        }
                                        onChange={e =>
                                          setSuggestionForm(prev => ({
                                            ...prev,
                                            type: e.target.value,
                                          }))
                                        }
                                        style={{ display: 'none' }}
                                      />
                                      <i
                                        className={type.icon}
                                        style={{
                                          fontSize: '1.5em',
                                          color:
                                            suggestionForm.type === type.key
                                              ? type.color
                                              : '#6c757d',
                                        }}
                                      />
                                      <span
                                        style={{
                                          fontWeight: 600,
                                          color:
                                            suggestionForm.type === type.key
                                              ? type.color
                                              : '#495057',
                                          fontSize: '0.95em',
                                        }}
                                      >
                                        {type.label}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: '0.8em',
                                          color: '#6c757d',
                                          lineHeight: 1.3,
                                        }}
                                      >
                                        {type.desc}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              {/* Información personal */}
                              <div
                                style={{
                                  display: 'grid',
                                  gap: 16,
                                  gridTemplateColumns: '1fr 1fr',
                                }}
                              >
                                <div>
                                  <label
                                    style={{
                                      display: 'block',
                                      marginBottom: 8,
                                      fontWeight: 500,
                                      color: '#495057',
                                    }}
                                  >
                                    Nombre completo *
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Tu nombre completo"
                                    value={suggestionForm.name}
                                    onChange={e =>
                                      setSuggestionForm(prev => ({
                                        ...prev,
                                        name: e.target.value,
                                      }))
                                    }
                                    style={{
                                      width: '100%',
                                      padding: '12px 16px',
                                      borderRadius: 8,
                                      border: '1px solid #ddd',
                                      fontSize: '1em',
                                      background: '#fafafa',
                                      transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e =>
                                      (e.target.style.borderColor = '#28a745')
                                    }
                                    onBlur={e =>
                                      (e.target.style.borderColor = '#ddd')
                                    }
                                  />
                                </div>
                                <div>
                                  <label
                                    style={{
                                      display: 'block',
                                      marginBottom: 8,
                                      fontWeight: 500,
                                      color: '#495057',
                                    }}
                                  >
                                    Correo electrónico *
                                  </label>
                                  <input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={suggestionForm.email}
                                    onChange={e =>
                                      setSuggestionForm(prev => ({
                                        ...prev,
                                        email: e.target.value,
                                      }))
                                    }
                                    style={{
                                      width: '100%',
                                      padding: '12px 16px',
                                      borderRadius: 8,
                                      border: '1px solid #ddd',
                                      fontSize: '1em',
                                      background: '#fafafa',
                                      transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e =>
                                      (e.target.style.borderColor = '#28a745')
                                    }
                                    onBlur={e =>
                                      (e.target.style.borderColor = '#ddd')
                                    }
                                  />
                                </div>
                              </div>

                              {/* Asunto y prioridad */}
                              <div
                                style={{
                                  display: 'grid',
                                  gap: 16,
                                  gridTemplateColumns: '2fr 1fr',
                                }}
                              >
                                <div>
                                  <label
                                    style={{
                                      display: 'block',
                                      marginBottom: 8,
                                      fontWeight: 500,
                                      color: '#495057',
                                    }}
                                  >
                                    Asunto *
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Describe brevemente el tema de tu comunicación"
                                    value={suggestionForm.subject}
                                    onChange={e =>
                                      setSuggestionForm(prev => ({
                                        ...prev,
                                        subject: e.target.value,
                                      }))
                                    }
                                    style={{
                                      width: '100%',
                                      padding: '12px 16px',
                                      borderRadius: 8,
                                      border: '1px solid #ddd',
                                      fontSize: '1em',
                                      background: '#fafafa',
                                    }}
                                  />
                                </div>
                                <div>
                                  <label
                                    style={{
                                      display: 'block',
                                      marginBottom: 8,
                                      fontWeight: 500,
                                      color: '#495057',
                                    }}
                                  >
                                    Prioridad
                                  </label>
                                  <select
                                    value={suggestionForm.urgency}
                                    onChange={e =>
                                      setSuggestionForm(prev => ({
                                        ...prev,
                                        urgency: e.target.value,
                                      }))
                                    }
                                    style={{
                                      width: '100%',
                                      padding: '12px 16px',
                                      borderRadius: 8,
                                      border: '1px solid #ddd',
                                      fontSize: '1em',
                                      background: '#fafafa',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <option value="baja">Baja</option>
                                    <option value="media">Media</option>
                                    <option value="alta">Alta</option>
                                  </select>
                                </div>
                              </div>

                              {/* Mensaje */}
                              <div>
                                <label
                                  style={{
                                    display: 'block',
                                    marginBottom: 8,
                                    fontWeight: 500,
                                    color: '#495057',
                                  }}
                                >
                                  Descripción detallada *
                                </label>
                                <textarea
                                  placeholder="Describe detalladamente tu petición, queja, reclamo o sugerencia..."
                                  value={suggestionForm.message}
                                  onChange={e =>
                                    setSuggestionForm(prev => ({
                                      ...prev,
                                      message: e.target.value,
                                    }))
                                  }
                                  style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    padding: '12px 16px',
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                    fontSize: '1em',
                                    background: '#fafafa',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                  }}
                                />
                              </div>

                              {/* Botones de acción */}
                              <div
                                style={{
                                  display: 'flex',
                                  gap: 12,
                                  justifyContent: 'center',
                                  marginTop: 24,
                                  paddingTop: 24,
                                  borderTop: '1px solid #e9ecef',
                                }}
                              >
                                <button
                                  onClick={handleSuggestionSubmit}
                                  disabled={
                                    !suggestionForm.type ||
                                    !suggestionForm.name.trim() ||
                                    !suggestionForm.email.trim() ||
                                    !suggestionForm.subject.trim() ||
                                    !suggestionForm.message.trim()
                                  }
                                  style={{
                                    background:
                                      !suggestionForm.type ||
                                      !suggestionForm.name.trim() ||
                                      !suggestionForm.email.trim() ||
                                      !suggestionForm.subject.trim() ||
                                      !suggestionForm.message.trim()
                                        ? '#ccc'
                                        : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 12,
                                    padding: '16px 32px',
                                    fontWeight: 600,
                                    fontSize: '1.1em',
                                    cursor:
                                      !suggestionForm.type ||
                                      !suggestionForm.name.trim() ||
                                      !suggestionForm.email.trim() ||
                                      !suggestionForm.subject.trim() ||
                                      !suggestionForm.message.trim()
                                        ? 'not-allowed'
                                        : 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    boxShadow:
                                      !suggestionForm.type ||
                                      !suggestionForm.name.trim() ||
                                      !suggestionForm.email.trim() ||
                                      !suggestionForm.subject.trim() ||
                                      !suggestionForm.message.trim()
                                        ? 'none'
                                        : '0 4px 15px rgba(40, 167, 69, 0.3)',
                                  }}
                                >
                                  <i className="fas fa-paper-plane" />
                                  Enviar{' '}
                                  {suggestionForm.type
                                    ? suggestionForm.type === 'peticion'
                                      ? 'Petición'
                                      : suggestionForm.type === 'queja'
                                      ? 'Queja'
                                      : suggestionForm.type === 'reclamo'
                                      ? 'Reclamo'
                                      : 'Sugerencia'
                                    : 'PQR'}
                                </button>
                                <button
                                  onClick={handleSupportTabClose}
                                  style={{
                                    background: '#f8f9fa',
                                    color: '#6c757d',
                                    border: '1px solid #dee2e6',
                                    borderRadius: 12,
                                    padding: '16px 24px',
                                    fontWeight: 500,
                                    fontSize: '1em',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                  }}
                                  onMouseOver={e => {
                                    e.target.style.background = '#e9ecef';
                                    e.target.style.borderColor = '#adb5bd';
                                  }}
                                  onMouseOut={e => {
                                    e.target.style.background = '#f8f9fa';
                                    e.target.style.borderColor = '#dee2e6';
                                  }}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Footer informativo */}
                          <div
                            style={{
                              marginTop: 24,
                              padding: '16px',
                              background:
                                'linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%)',
                              borderRadius: 12,
                              border: '1px solid #bee5eb',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 8,
                              }}
                            >
                              <i
                                className="fas fa-info-circle"
                                style={{ color: '#0c5460' }}
                              />
                              <strong
                                style={{ color: '#0c5460', fontSize: '0.95em' }}
                              >
                                Información importante:
                              </strong>
                            </div>
                            <p
                              style={{
                                color: '#0c5460',
                                margin: 0,
                                fontSize: '0.9em',
                                lineHeight: 1.4,
                              }}
                            >
                              Tu comunicación será revisada por nuestro equipo.
                              Recibirás una respuesta en un plazo máximo de 5
                              días hábiles.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Contenido de Soporte Emocional */}
                      {activeSupportTab === 'emotional' && (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                          <div style={{ marginBottom: 24 }}>
                            <div
                              style={{
                                background:
                                  'linear-gradient(135deg, #e91e63, #ad1457)',
                                color: '#fff',
                                borderRadius: '50%',
                                width: 80,
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                              }}
                            >
                              <i
                                className="fas fa-heart"
                                style={{ fontSize: '2em' }}
                              />
                            </div>
                            <h3 style={{ color: '#333', marginBottom: 16 }}>
                              ¿Quieres hablar con alguien?
                            </h3>
                            <p
                              style={{
                                color: '#666',
                                fontSize: '1.1em',
                                lineHeight: 1.6,
                                maxWidth: 500,
                                margin: '0 auto 24px',
                              }}
                            >
                              Nuestro equipo de psicólogos está aquí para
                              apoyarte. No dudes en contactarnos si necesitas
                              orientación o simplemente quieres conversar. Tu
                              bienestar es nuestra prioridad.
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              showNotification(
                                'info',
                                'Contacto Iniciado',
                                'Te conectaremos con un psicólogo en breve. Revisa tu correo para más detalles.'
                              )
                            }
                            style={{
                              background:
                                'linear-gradient(90deg, #e91e63 60%, #f06292 100%)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 12,
                              padding: '16px 32px',
                              fontWeight: 700,
                              fontSize: '1.1em',
                              cursor: 'pointer',
                              boxShadow: '0 4px 16px rgba(233, 30, 99, 0.3)',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              margin: '0 auto',
                            }}
                          >
                            <i className="fas fa-comments" />
                            Contactar Psicólogo
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    {activeSupportTab === 'report' &&
                      reportForm.isAnonymous !== null && (
                        <div
                          style={{
                            display: 'flex',
                            gap: 12,
                            justifyContent: 'center',
                            borderTop: '1px solid #e9ecef',
                            paddingTop: 20,
                          }}
                        >
                          <button
                            onClick={handleReportSubmit}
                            disabled={
                              !reportForm.incidentData.description.trim()
                            }
                            style={{
                              background:
                                !reportForm.incidentData.description.trim()
                                  ? '#9e9e9e'
                                  : 'linear-gradient(90deg, #f44336 60%, #e53935 100%)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 12,
                              padding: '14px 32px',
                              fontWeight: 700,
                              fontSize: '1.1em',
                              cursor:
                                !reportForm.incidentData.description.trim()
                                  ? 'not-allowed'
                                  : 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }}
                          >
                            <i className="fas fa-paper-plane" />
                            Enviar Reporte
                          </button>
                          <button
                            onClick={handleSupportTabClose}
                            style={{
                              background:
                                'linear-gradient(90deg, #9e9e9e 60%, #bdbdbd 100%)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 12,
                              padding: '14px 32px',
                              fontWeight: 700,
                              fontSize: '1.1em',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }}
                          >
                            <i className="fas fa-times" />
                            Cancelar
                          </button>
                        </div>
                      )}
                  </>
                )}
              </section>
            )}
          </section>
        </main>
      </div>

      {/* Cuestionario Emocional Modal */}
      {showEmotionalQuestionnaire && (
        <>
          <div
            className="overlay show"
            onClick={handleEmotionalQuestionnaireClose}
          />
          <div
            className="emotional-questionnaire-modal"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              borderRadius: 16,
              padding: '32px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              zIndex: 1001,
              border: '2px solid #e3f2fd',
            }}
          >
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
              <div
                style={{
                  background: '#2196f3',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 60,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                }}
              >
                <i className="fas fa-heart" style={{ fontSize: 28 }} />
              </div>
              <h2
                style={{
                  color: '#2196f3',
                  fontWeight: 700,
                  fontSize: '1.5em',
                  margin: '0 0 8px 0',
                }}
              >
                ¿Cómo me siento hoy?
              </h2>
              <p style={{ color: '#666', fontSize: '1.1em', margin: 0 }}>
                Realiza un breve cuestionario para conocer tu estado emocional
                actual.
              </p>
            </div>

            <div
              style={{
                background: '#f8f9fa',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: 24,
                border: '1px solid #e9ecef',
              }}
            >
              <h3
                style={{
                  color: '#495057',
                  fontWeight: 600,
                  fontSize: '1.1em',
                  margin: '0 0 12px 0',
                }}
              >
                Escala de respuestas:
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: 20,
                  flexWrap: 'wrap',
                  fontSize: '0.95em',
                }}
              >
                <span style={{ color: '#6c757d' }}>
                  <strong>1</strong> = Casi nunca
                </span>
                <span style={{ color: '#6c757d' }}>
                  <strong>2</strong> = A veces
                </span>
                <span style={{ color: '#6c757d' }}>
                  <strong>3</strong> = Casi siempre
                </span>
              </div>
            </div>

            <div className="questionnaire-form" style={{ marginBottom: 24 }}>
              {[
                {
                  id: 'pregunta1',
                  text: 'Me siento feliz con las cosas que hago cada día',
                },
                {
                  id: 'pregunta2',
                  text: 'Tengo ganas de jugar o hacer cosas divertidas',
                },
                {
                  id: 'pregunta3',
                  text: 'Me siento con energía cuando me levanto en la mañana',
                },
                {
                  id: 'pregunta4',
                  text: 'Me siento amado(a) por mi familia o personas cercanas',
                },
                { id: 'pregunta5', text: 'Me gusta estar con otras personas' },
                {
                  id: 'pregunta6',
                  text: 'A veces me siento triste sin saber por qué',
                },
                { id: 'pregunta7', text: 'Siento que nadie me entiende' },
                {
                  id: 'pregunta8',
                  text: 'Me cuesta concentrarme aunque quiera',
                },
                {
                  id: 'pregunta9',
                  text: 'A veces me gustaría desaparecer o no estar aquí',
                },
                {
                  id: 'pregunta10',
                  text: 'Siento que las cosas no van a mejorar',
                },
              ].map((pregunta, index) => (
                <div
                  key={pregunta.id}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: '20px',
                    marginBottom: 16,
                    border: '1px solid #e9ecef',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <span
                      style={{
                        background: '#2196f3',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85em',
                        fontWeight: 600,
                        marginRight: 12,
                      }}
                    >
                      {index + 1}
                    </span>
                    <span
                      style={{
                        color: '#333',
                        fontSize: '1.05em',
                        fontWeight: 500,
                      }}
                    >
                      {pregunta.text}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 12,
                      justifyContent: 'center',
                    }}
                  >
                    {[1, 2, 3].map(valor => (
                      <label
                        key={valor}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: '2px solid',
                          borderColor:
                            emotionalAnswers[pregunta.id] === valor.toString()
                              ? '#2196f3'
                              : '#e9ecef',
                          background:
                            emotionalAnswers[pregunta.id] === valor.toString()
                              ? '#e3f2fd'
                              : '#fff',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <input
                          type="radio"
                          name={pregunta.id}
                          value={valor}
                          checked={
                            emotionalAnswers[pregunta.id] === valor.toString()
                          }
                          onChange={e =>
                            handleEmotionalAnswerChange(
                              pregunta.id,
                              e.target.value
                            )
                          }
                          style={{ display: 'none' }}
                        />
                        <span
                          style={{
                            fontSize: '1.2em',
                            fontWeight: 700,
                            color:
                              emotionalAnswers[pregunta.id] === valor.toString()
                                ? '#2196f3'
                                : '#6c757d',
                          }}
                        >
                          {valor}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={handleEmotionalQuestionnaireSubmit}
                disabled={Object.values(emotionalAnswers).some(
                  answer => answer === ''
                )}
                style={{
                  background: Object.values(emotionalAnswers).some(
                    answer => answer === ''
                  )
                    ? '#9e9e9e'
                    : 'linear-gradient(90deg, #4caf50 60%, #66bb6a 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px 32px',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  cursor: Object.values(emotionalAnswers).some(
                    answer => answer === ''
                  )
                    ? 'not-allowed'
                    : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <i className="fas fa-paper-plane" />
                Enviar Respuestas
              </button>
              <button
                onClick={handleEmotionalQuestionnaireClose}
                style={{
                  background:
                    'linear-gradient(90deg, #9e9e9e 60%, #bdbdbd 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px 32px',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <i className="fas fa-times" />
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}

      {/* Notificación Elegante */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background:
              notification.type === 'success'
                ? 'linear-gradient(135deg, #4caf50, #66bb6a)'
                : notification.type === 'warning'
                ? 'linear-gradient(135deg, #ff9800, #ffb74d)'
                : notification.type === 'danger'
                ? 'linear-gradient(135deg, #f44336, #e57373)'
                : 'linear-gradient(135deg, #2196f3, #64b5f6)',
            color: '#fff',
            padding: '20px 24px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            zIndex: 1002,
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
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
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i
                className={`fas ${
                  notification.type === 'success'
                    ? 'fa-check-circle'
                    : notification.type === 'warning'
                    ? 'fa-exclamation-triangle'
                    : notification.type === 'danger'
                    ? 'fa-times-circle'
                    : 'fa-info-circle'
                }`}
                style={{ fontSize: 18 }}
              />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1em', fontWeight: 700 }}>
                {notification.title}
              </h3>
              {notification.score && (
                <div
                  style={{ fontSize: '0.9em', opacity: 0.9, fontWeight: 500 }}
                >
                  Puntuación: {notification.score}
                </div>
              )}
            </div>
            <button
              onClick={() => setNotification(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '16px',
                marginLeft: 'auto',
                padding: '4px',
                borderRadius: '4px',
                opacity: 0.8,
              }}
            >
              <i className="fas fa-times" />
            </button>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: '1em',
              lineHeight: 1.4,
              opacity: 0.95,
            }}
          >
            {notification.message}
          </p>
        </div>
      )}

      {/* Settings Panel mejorado */}
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
              photo: studentProfileState.photo,
              phone: studentProfileState.phone,
              address: studentProfileState.address,
              theme: studentProfileState.theme || 'light',
              language: studentProfileState.language || 'es',
              // Campos adicionales del estudiante
              name: studentProfileState.name,
              lastName: studentProfileState.lastName,
              documentType: studentProfileState.documentType,
              documentNumber: studentProfileState.documentNumber,
              email: studentProfileState.email,
              birthDate: studentProfileState.birthDate,
              age: studentProfileState.age,
            }}
          />
        </>
      )}

      {/* Estilos premium para StudentDashboard */}
      <style>{`
        /* Estilos específicos para el sidebar del estudiante que complementan AdminDashboard.css */
        .dashboard-sidebar {
          display: flex;
          flex-direction: column;
          gap: 18px;
          width: 100%;
          max-width: 340px;
          margin: 0 auto;
          padding: 24px 18px 24px 18px;
        }

        .profile-image-container {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 0;
        }

        .user-info-container,
        .system-status-container,
        .stats-container {
          background: #fafdff;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .info-row,
        .status-row,
        .stat-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1em;
          color: #333;
        }

        .info-row i,
        .status-row i,
        .stat-row i {
          color: #1976d2;
          font-size: 1.2em;
          min-width: 22px;
          text-align: center;
        }

        .stats-container h3,
        .system-status-container h3 {
          color: #1976d2;
          font-size: 1.08em;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
        }

        .info-row strong,
        .status-row strong,
        .stat-row strong {
          color: #1976d2;
          font-weight: 600;
        }

        /* Efectos hover para secciones premium */
        .premium-section:hover {
          box-shadow: 0 6px 32px 0 rgba(0, 0, 0, 0.12) !important;
          transform: translateY(-2px);
        }
        
        /* Efectos hover para botones de acción */
        .action-btn-html:hover, .btn-html:hover, .btn-secondary-html:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15) !important;
        }
        
        /* Efectos hover para elementos de cuestionarios */
        .questionnaire-item-html:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px 0 rgba(76, 175, 80, 0.15) !important;
        }
        
        /* Efectos focus para inputs */
        .chat-input-html input:focus {
          border-color: #1976d2 !important;
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important;
        }
        
        /* Efectos hover para botones de menú */
        .menus-html button:hover:not(.active) {
          background: #f3e5f5 !important;
          transform: translateY(-1px);
        }
        
        /* Responsividad para secciones premium */
        @media (max-width: 1200px) {
          .premium-section {
            padding: 24px 20px 20px 20px !important;
            margin-bottom: 20px !important;
          }
          .premium-section h2 {
            font-size: 1.25em !important;
          }
          .dashboard-sidebar {
            max-width: 320px;
            padding: 18px 12px 18px 12px;
          }
        }
        
        @media (max-width: 900px) {
          .premium-section {
            padding: 18px 16px 16px 16px !important;
            border-radius: 12px !important;
            margin-bottom: 16px !important;
          }
          .premium-section h2 {
            font-size: 1.15em !important;
          }
          .premium-section > div:first-child > div:first-child {
            width: 36px !important;
            height: 36px !important;
          }
          .premium-section > div:first-child > div:first-child i {
            font-size: 18px !important;
          }
          .questionnaires-list-html {
            gap: 12px !important;
          }
          .questionnaire-item-html {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .questionnaire-item-html .btn-html {
            align-self: flex-end !important;
          }
          .menus-html {
            gap: 8px !important;
          }
          .menus-html button {
            padding: 8px 12px !important;
            font-size: 0.9em !important;
          }
          .dashboard-sidebar {
            max-width: 100%;
            padding: 12px 8px;
          }
          .profile-image-container {
            padding: 14px 0;
          }
          .user-info-container,
          .system-status-container,
          .stats-container {
            padding: 12px 14px;
          }
        }
        
        @media (max-width: 600px) {
          .premium-section {
            padding: 16px 12px 14px 12px !important;
            border-radius: 8px !important;
          }
          .premium-section h2 {
            font-size: 1.1em !important;
          }
          .premium-section > div:first-child {
            flex-direction: column !important;
            align-items: flex-start !important;
            text-align: left !important;
          }
          .premium-section > div:first-child > div:first-child {
            margin-right: 0 !important;
            margin-bottom: 8px !important;
          }
          .questionnaire-item-html {
            padding: 16px 18px !important;
          }
          .chat-input-html {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .chat-input-html button {
            align-self: flex-end !important;
            width: auto !important;
          }
          .action-btn-html {
            flex: 1 !important;
            justify-content: center !important;
            min-width: 0 !important;
          }
          .dashboard-sidebar {
            padding: 8px 4px;
          }
          .info-row,
          .status-row,
          .stat-row {
            font-size: 0.95em;
          }
        }
        
        /* Animaciones suaves */
        .premium-section, .questionnaire-item-html, .action-btn-html, .btn-html, .btn-secondary-html, .menus-html button {
          transition: all 0.2s ease-in-out !important;
        }
        
        /* Mejoras de accesibilidad */
        .premium-section:focus-within {
          outline: 2px solid #1976d2;
          outline-offset: 2px;
        }
        
        /* Optimización para dispositivos táctiles */
        @media (hover: none) {
          .premium-section:hover, .questionnaire-item-html:hover, .action-btn-html:hover, .btn-html:hover {
            transform: none !important;
          }
        }

        /* Estilos para el modal del cuestionario emocional */
        .emotional-questionnaire-modal, .questionnaire-modal {
          animation: modalFadeIn 0.3s ease-out;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .overlay.show {
          opacity: 1;
        }

        /* Estilos para botones de acciones rápidas */
        .action-btn-html:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
        }

        .action-btn-html:active {
          transform: translateY(0);
        }

        /* Estilos para sistema de pestañas horizontales */
        .tab-btn {
          position: relative;
          overflow: hidden;
        }

        .tab-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
        }

        .tab-btn:hover::before {
          left: 100%;
        }

        .tab-btn.active {
          border-bottom: none !important;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15), 
                      0 4px 0 rgba(255, 255, 255, 1) !important;
        }

        .tab-btn:not(.active):hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2) !important;
        }

        /* Estilos responsivos para pestañas */
        @media (max-width: 1200px) {
          .tab-btn {
            flex: 1 1 180px !important;
            font-size: 0.9em !important;
            padding: 12px 16px !important;
          }
        }

        @media (max-width: 900px) {
          .tab-btn {
            flex: 1 1 150px !important;
            font-size: 0.85em !important;
            padding: 10px 12px !important;
            min-width: 140px !important;
          }
        }

        @media (max-width: 700px) {
          .tab-btn {
            flex: 1 1 100% !important;
            min-width: 100% !important;
            border-radius: 12px !important;
            margin-bottom: 8px !important;
          }
          
          .tab-btn.active {
            border-radius: 12px !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
            transform: scale(1.02) !important;
          }

          /* En móvil, el contenedor debe tener bordes completos */
          .questionnaire-dynamic-container {
            border-radius: 18px !important;
            border-top: 2px solid #e9ecef !important;
            margin-top: 16px !important;
          }
        }

        /* Contenedor de cuestionarios responsivo */
        .questionnaire-dynamic-container {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .questionnaire-dynamic-container.expanded {
          animation: expandQuestionnaire 0.4s ease-out;
        }

        @keyframes expandQuestionnaire {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Optimización para scroll en cuestionarios */
        .questionnaire-dynamic-container [style*="overflowY: auto"] {
          scrollbar-width: thin;
          scrollbar-color: #ccc #f5f5f5;
        }

        .questionnaire-dynamic-container [style*="overflowY: auto"]::-webkit-scrollbar {
          width: 6px;
        }

        .questionnaire-dynamic-container [style*="overflowY: auto"]::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 3px;
        }

        .questionnaire-dynamic-container [style*="overflowY: auto"]::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;
        }

        .questionnaire-dynamic-container [style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
          background: #999;
        }

        /* Estilos para el nuevo sistema de pestañas de apoyo */
        .support-dynamic-container {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .support-dynamic-container.expanded {
          animation: expandSupportContainer 0.4s ease-out;
        }

        @keyframes expandSupportContainer {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Responsividad mejorada para pestañas de apoyo */
        @media (max-width: 1200px) {
          .support-tabs-section .tab-btn {
            flex: 1 1 120px !important;
            font-size: 0.8em !important;
            padding: 10px 12px !important;
            min-width: 100px !important;
          }
        }

        @media (max-width: 900px) {
          .support-tabs-section .tab-btn {
            flex: 1 1 100px !important;
            font-size: 0.75em !important;
            padding: 8px 10px !important;
            min-width: 90px !important;
          }
        }

        @media (max-width: 700px) {
          .support-tabs-section .tab-btn {
            flex: 1 1 100% !important;
            min-width: 100% !important;
            border-radius: 12px !important;
            margin-bottom: 8px !important;
            font-size: 0.9em !important;
            padding: 12px 16px !important;
          }
          
          .support-tabs-section .tab-btn.active {
            border-radius: 12px !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
            transform: scale(1.02) !important;
          }

          /* En móvil, el contenedor debe tener bordes completos */
          .support-dynamic-container {
            border-radius: 18px !important;
            border-top: 2px solid #e9ecef !important;
            margin-top: 16px !important;
          }
        }

        /* Optimización para formularios dentro de pestañas */
        .support-dynamic-container input,
        .support-dynamic-container textarea,
        .support-dynamic-container select {
          transition: border-color 0.2s ease;
        }

        .support-dynamic-container input:focus,
        .support-dynamic-container textarea:focus,
        .support-dynamic-container select:focus {
          outline: none;
          border-color: #9c27b0 !important;
          box-shadow: 0 0 0 2px rgba(156, 39, 176, 0.1);
        }

        /* Estilos para contenedor dinámico de cuestionarios */
        .questionnaire-dynamic-container {
          will-change: max-height, opacity, transform;
        }

        .questionnaire-dynamic-container.expanded {
          border-color: #2196f3 !important;
        }

        /* Scroll personalizado para cuestionarios */
        .questionnaire-dynamic-container div[style*="overflowY: auto"]::-webkit-scrollbar {
          width: 8px;
        }

        .questionnaire-dynamic-container div[style*="overflowY: auto"]::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .questionnaire-dynamic-container div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .questionnaire-dynamic-container div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Responsividad para el modal del cuestionario */
        @media (max-width: 768px) {
          .emotional-questionnaire-modal, .questionnaire-modal {
            width: 95% !important;
            padding: 20px !important;
            max-height: 90vh !important;
          }
          
          .emotional-questionnaire-modal h2, .questionnaire-modal h2 {
            font-size: 1.3em !important;
          }
          
          .questionnaire-form > div {
            padding: 16px !important;
          }
          
          .questionnaire-form > div > div:last-child {
            flex-direction: column !important;
            gap: 8px !important;
          }
          
          .questionnaire-form label {
            width: 100% !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            padding: 12px 16px !important;
          }
        }

        @media (max-width: 480px) {
          .emotional-questionnaire-modal, .questionnaire-modal {
            width: 98% !important;
            padding: 16px !important;
          }
          
          .emotional-questionnaire-modal > div:last-child, .questionnaire-modal > div:last-child {
            flex-direction: column !important;
            gap: 8px !important;
          }
          
          .emotional-questionnaire-modal > div:last-child button, .questionnaire-modal > div:last-child button {
            width: 100% !important;
            justify-content: center !important;
          }

          /* Botones de acciones rápidas responsivos */
          .action-btn-html {
            flex: 1 1 100% !important;
            min-width: auto !important;
            padding: 14px 20px !important;
            font-size: 0.9em !important;
          }

          /* Contenedor dinámico móvil */
          .questionnaire-dynamic-container {
            padding: 16px !important;
            border-radius: 8px !important;
            margin-bottom: 16px !important;
          }

          .questionnaire-dynamic-container div[style*="display: flex"][style*="justifyContent: space-between"] {
            flex-direction: column !important;
            gap: 16px !important;
          }

          .questionnaire-dynamic-container div[style*="display: flex"][style*="gap: 16px"] {
            flex-direction: column !important;
            gap: 12px !important;
          }

          .questionnaire-dynamic-container div[style*="display: flex"][style*="gap: 12px"][style*="justifyContent: center"] {
            flex-direction: column !important;
            gap: 8px !important;
          }

          .questionnaire-dynamic-container button {
            width: 100% !important;
            justify-content: center !important;
          }
        }

        /* Estilos adicionales para pantallas medianas */
        @media (max-width: 768px) {
          .action-btn-html {
            flex: 1 1 calc(50% - 6px) !important;
            font-size: 0.9em !important;
            padding: 12px 16px !important;
          }

          /* Notificaciones responsivas */
          div[style*="position: fixed"][style*="top: 20px"] {
            top: 10px !important;
            right: 10px !important;
            left: 10px !important;
            max-width: calc(100vw - 20px) !important;
          }

          /* Contenedor dinámico responsivo */
          .questionnaire-dynamic-container {
            padding: 20px !important;
            border-radius: 12px !important;
          }

          .questionnaire-dynamic-container div[style*="maxHeight: 400px"] {
            max-height: 300px !important;
          }

          .questionnaire-dynamic-container div[style*="display: flex"][style*="gap: 8px"] {
            flex-direction: column !important;
            gap: 8px !important;
          }

          .questionnaire-dynamic-container label {
            min-width: auto !important;
            padding: 10px 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
