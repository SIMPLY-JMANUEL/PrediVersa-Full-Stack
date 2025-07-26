import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

// Importar estilos principales PRIMERO
import './styles/main.css'; // ✨ Sistema completo de estilos unificado
import './styles/PageStyles.css'; // 🔄 MANTENER: Estilos específicos de páginas
import './styles/global-institucional.css'; // 🎨 Estilos institucionales globales

// Importa tus páginas
import Home from './pages/Home';
import AppEnfoqueEducativo from './pages/AppEnfoqueEducativo';
import AppEnfoqueEmpresarial from './pages/AppEnfoqueEmpresarial';
import Capacitaciones from './pages/Capacitaciones';
import Contacto from './pages/Contacto';
import Noticias from './pages/Noticias';
import DesarrolloBackend from './pages/DesarrolloBackend';
import DisenodeExperiencia from './pages/DiseñodeExperiencia';
import EstudiosyAnalisis from './pages/EstudiosyAnalisis';
import GestiondeProducto from './pages/GestiondeProducto';
import Metas from './pages/Metas';
import MisionyVision from './pages/MisionyVision';
import Objetivos from './pages/Objetivos';
import Planes from './pages/Planes';
// importaciones eliminadas: Capacitaciones, EnfoqueEducativo, EnfoqueEmpresarial, Equipo, QuienesSomos, Contacto, PlanAvanzado, PlanBasico, PlanPremium
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Dashboards
import AdminDashboard from './pages/dashboards/AdminDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import ParentDashboard from './pages/dashboards/ParentDashboard';
import ModeratorDashboard from './pages/dashboards/ModeratorDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

// Importa tus componentes globales
import Header from './components/Header';
import Footer from './components/Footer';
import BackgroundShapes from './components/BackgroundShapes';
import Preloader from './components/Preloader';

// Contextos
import { AuthProvider } from './contexts/AuthContext';
// importación eliminada: HomeButton

function AppContent() {
  const location = useLocation();
  // Oculta el Header en cualquier dashboard
  const hideHeader = location.pathname.startsWith('/dashboard');
  // Oculta el Footer en dashboards y en la página de login
  const hideFooter =
    location.pathname.startsWith('/dashboard') ||
    location.pathname === '/login';

  return (
    <>
      <BackgroundShapes />
      <Preloader />
      {!hideHeader && <Header />}
      <main role="main" className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Servicios */}
          <Route
            path="/servicios/educativo"
            element={<AppEnfoqueEducativo />}
          />
          <Route
            path="/servicios/empresarial"
            element={<AppEnfoqueEmpresarial />}
          />
          <Route
            path="/servicios/capacitaciones"
            element={<Capacitaciones />}
          />
          <Route path="/servicios/entorno" element={<EstudiosyAnalisis />} />
          {/* Quiénes Somos */}
          <Route path="/quienes/mision" element={<MisionyVision />} />
          <Route path="/quienes/objetivos" element={<Objetivos />} />
          <Route path="/quienes/metas" element={<Metas />} />
          {/* Equipo de Trabajo */}
          <Route path="/equipo/producto" element={<GestiondeProducto />} />
          <Route path="/equipo/diseno" element={<DisenodeExperiencia />} />
          <Route path="/equipo/backend" element={<DesarrolloBackend />} />
          {/* Planes */}
          <Route path="/planes" element={<Planes />} />
          {/* Otros */}
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboards */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/parent" element={<ParentDashboard />} />
          <Route path="/dashboard/moderator" element={<ModeratorDashboard />} />
          <Route
            path="/dashboard/superadmin"
            element={<SuperAdminDashboard />}
          />
          {/* Ruta por defecto para dashboard - redirige a login */}
          <Route path="/dashboard" element={<Login />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Botón de regreso eliminado, se usará otro componente */}
      </main>
      {!hideFooter && <Footer />}
      <div className="particles" id="particles" />
    </>
  );
}

function App() {
  // ...existing code...
  useEffect(() => {
    // Inicializa AOS
    import('aos').then(AOS => AOS.init());

    // Fade-in-on-scroll
    const fadeElements = document.querySelectorAll('.fade-in-on-scroll');
    const observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeElements.forEach(el => observer.observe(el));

    // Carga scripts externos (Botpress, etc.)
    const loadChatbot = () => {
      try {
        // Verificar si ya existen scripts similares
        const existingBotpress = document.querySelector(
          'script[src*="botpress"]'
        );
        if (existingBotpress) {
          existingBotpress.remove();
        }

        // Script principal de Botpress
        const botpressScript = document.createElement('script');
        botpressScript.src =
          'https://cdn.botpress.cloud/webchat/v3.0/inject.js';
        botpressScript.defer = true;
        document.head.appendChild(botpressScript);

        // Script personalizado del bot - cargar después del core
        window.setTimeout(() => {
          const customBotScript = document.createElement('script');
          customBotScript.src =
            'https://files.bpcontent.cloud/2025/06/14/17/20250614175412-PSVAMY0N.js';
          customBotScript.defer = true;
          document.head.appendChild(customBotScript);
        }, 500);

        // Limpieza de scripts al desmontar
        return () => {
          try {
            const scripts = document.querySelectorAll(
              'script[src*="botpress"], script[src*="bpcontent"]'
            );
            scripts.forEach(script => {
              if (document.head.contains(script)) {
                document.head.removeChild(script);
              }
            });
          } catch (error) {
            console.warn('Error removing chatbot scripts:', error);
          }
        };
      } catch (error) {
        console.error('Error initializing chatbot:', error);
        return () => {}; // Return empty cleanup function
      }
    };

    return loadChatbot();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
