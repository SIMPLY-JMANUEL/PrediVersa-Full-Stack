import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Footer from './Footer';

// Importaciones directas para evitar problemas de TypeScript
import Home from '../pages/Home.jsx';
import Capacitaciones from '../pages/Capacitaciones.jsx';
import EnfoqueEducativo from '../pages/EnfoqueEducativo.jsx';
import EnfoqueEmpresarial from '../pages/EnfoqueEmpresarial.jsx';
import Equipo from '../pages/Equipo.jsx';
import QuienesSomos from '../pages/QuienesSomos.jsx';
import Objetivos from '../pages/Objetivos.jsx';
import Contacto from '../pages/Contacto.jsx';
import Noticias from '../pages/Noticias.jsx';
import Login from '../pages/Login.jsx';
import AdminDashboard from '../pages/dashboards/AdminDashboard.jsx';
import ModeratorDashboard from '../pages/dashboards/ModeratorDashboard.jsx';
import TeacherDashboard from '../pages/dashboards/TeacherDashboard.jsx';
import AttendantDashboard from '../pages/dashboards/AttendantDashboard.tsx';
import StudentDashboard from '../pages/dashboards/StudentDashboard.jsx';
import NotFound from '../pages/NotFound.jsx';

// Componente de carga simple
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

// Router principal con autenticación
const AppRouterComplete = () => {
  const location = useLocation();
  
  // Ocultar Header y Footer en dashboards y login
  const hideHeaderFooter = location.pathname.startsWith("/Admin") || 
                          location.pathname.startsWith("/Moderador") || 
                          location.pathname.startsWith("/Estudiante") || 
                          location.pathname.startsWith("/Acudiente") || 
                          location.pathname.startsWith("/Docente") || 
                          location.pathname.startsWith("/dashboard") ||
                          location.pathname === "/login";

  return (
    <ErrorBoundary>
      <AuthProvider>
        {!hideHeaderFooter && <Header />}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Rutas públicas */}
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
            
            {/* Rutas de Dashboard por Perfil */}
            <Route
              path="/Admin"
              element={
                <ProtectedRoute requiredRole="Administrador">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Moderador"
              element={
                <ProtectedRoute requiredRole="Moderador">
                  <ModeratorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Estudiante"
              element={
                <ProtectedRoute requiredRole="Estudiante">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Acudiente"
              element={
                <ProtectedRoute requiredRole="Acudiente">
                  <AttendantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Docente"
              element={
                <ProtectedRoute requiredRole="Docente">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />

            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {!hideHeaderFooter && <Footer />}
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default AppRouterComplete;
