import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Importar estilos principales PRIMERO
import "./styles/main.css";          // ✨ NUEVO: Sistema completo de estilos
import "./App.css";                  // 🔄 MANTENER: Para compatibilidad
import "./styles/PageStyles.css";    // 🔄 MANTENER: Estilos específicos

// Importa tus páginas
import Home from "./pages/Home";
import Capacitaciones from "./pages/Capacitaciones";
import EnfoqueEducativo from "./pages/EnfoqueEducativo";
import EnfoqueEmpresarial from "./pages/EnfoqueEmpresarial";
import Equipo from "./pages/Equipo";
import QuienesSomos from "./pages/QuienesSomos";
import Objetivos from "./pages/Objetivos";
import Contacto from "./pages/Contacto";
import Noticias from "./pages/Noticias";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Dashboards
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import ParentDashboard from "./pages/dashboards/ParentDashboard";
import ModeratorDashboard from "./pages/dashboards/ModeratorDashboard";

// Importa tus componentes globales
import Header from "./components/Header";
import Footer from "./components/Footer";
import BackgroundShapes from "./components/BackgroundShapes";
import Preloader from "./components/Preloader";
import BackToTop from "./components/BackToTop";

// Importa estilos de animaciones
import "./components/Animations.css";

function AppContent() {
  const location = useLocation();
  // Oculta el Header en cualquier dashboard
  const hideHeader = location.pathname.startsWith("/dashboard");

  return (
    <>
      <BackgroundShapes />
      <Preloader />
      {!hideHeader && <Header />}
      <main role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capacitaciones" element={<Capacitaciones />} />
          <Route path="/enfoque-educativo" element={<EnfoqueEducativo />} />
          <Route path="/enfoque-empresarial" element={<EnfoqueEmpresarial />} />
          <Route path="/equipo" element={<Equipo />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/objetivos" element={<Objetivos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/login" element={<Login />} />
          
          {/* Dashboards */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/parent" element={<ParentDashboard />} />
          <Route path="/dashboard/moderator" element={<ModeratorDashboard />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
      <div className="particles" id="particles"></div>
    </>
  );
}

function App() {
  useEffect(() => {
    // Inicializa AOS
    import("aos").then(AOS => AOS.init());

    // Fade-in-on-scroll
    const fadeElements = document.querySelectorAll('.fade-in-on-scroll');
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => observer.observe(el));

    // Carga scripts externos (Botpress, etc.)
    const loadChatbot = () => {
      try {
        // Verificar si ya existen scripts similares
        const existingBotpress = document.querySelector('script[src*="botpress"]');
        if (existingBotpress) {
          existingBotpress.remove();
        }

        // Script principal de Botpress
        const botpressScript = document.createElement("script");
        botpressScript.src = "https://cdn.botpress.cloud/webchat/v3.0/inject.js";
        botpressScript.defer = true;
        document.head.appendChild(botpressScript);

        // Script personalizado del bot - cargar después del core
        setTimeout(() => {
          const customBotScript = document.createElement("script");
          customBotScript.src = "https://files.bpcontent.cloud/2025/06/14/17/20250614175412-PSVAMY0N.js";
          customBotScript.defer = true;
          document.head.appendChild(customBotScript);
        }, 500);

        // Limpieza de scripts al desmontar
        return () => {
          try {
            const scripts = document.querySelectorAll('script[src*="botpress"], script[src*="bpcontent"]');
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
      <AppContent />
    </Router>
  );
}

export default App;