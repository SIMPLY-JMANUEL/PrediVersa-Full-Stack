import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Footer from './Footer';

// Lazy loading de páginas públicas
const Home = lazy(() => import('../pages/Home.jsx'));
const Capacitaciones = lazy(() => import('../pages/Capacitaciones.jsx'));
const EnfoqueEducativo = lazy(() => import('../pages/EnfoqueEducativo.jsx'));
const EnfoqueEmpresarial = lazy(() => import('../pages/EnfoqueEmpresarial.jsx'));
const Equipo = lazy(() => import('../pages/Equipo.jsx'));
const QuienesSomos = lazy(() => import('../pages/QuienesSomos.jsx'));
const Objetivos = lazy(() => import('../pages/Objetivos.jsx'));
const Contacto = lazy(() => import('../pages/Contacto.jsx'));
const Noticias = lazy(() => import('../pages/Noticias.jsx'));

// Lazy loading de autenticación y dashboards
const Login = lazy(() => import('../pages/Login.jsx')); // Usando Login corregido
const Dashboard = lazy(() => import('../pages/dashboards/Dashboard'));
const AdminDashboard = lazy(
  () => import('../pages/dashboards/AdminDashboard.jsx')
);
const ModeratorDashboard = lazy(
  () => import('../pages/dashboards/ModeratorDashboard')
);
const TeacherDashboard = lazy(
  () => import('../pages/dashboards/TeacherDashboard.jsx')
);
const AttendantDashboard = lazy(
  () => import('../pages/dashboards/AttendantDashboard') // Nuevo dashboard de Acudiente
);
const StudentDashboard = lazy(
  () => import('../pages/dashboards/StudentDashboard.jsx')
);
const Profile = lazy(() => import('../pages/Profile.jsx'));
const Courses = lazy(() => import('../pages/Courses.jsx'));
const RoleTestingPage = lazy(() => import('../pages/RoleTestingPage.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));

// Componente de carga personalizado
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="large" />
  </div>
);

// Router optimizado con rutas públicas y protegidas
const AppRouter: React.FC = () => {
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
            
            {/* Ruta de dashboard general (fallback) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Otras rutas protegidas */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/role-testing"
              element={
                <ProtectedRoute>
                  <RoleTestingPage />
                </ProtectedRoute>
              }
            />

            {/* Rutas públicas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {!hideHeaderFooter && <Footer />}
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default AppRouter;
