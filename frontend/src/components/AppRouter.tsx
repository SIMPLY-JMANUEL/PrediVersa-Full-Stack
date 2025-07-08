import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

// Lazy loading de páginas
const Home = lazy(() => import('../pages/Home.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Dashboard = lazy(() => import('../pages/dashboards/Dashboard'));
const AdminDashboard = lazy(() => import('../pages/dashboards/AdminDashboard.jsx'));
const ModeratorDashboard = lazy(() => import('../pages/dashboards/ModeratorDashboard.jsx'));
const TeacherDashboard = lazy(() => import('../pages/dashboards/TeacherDashboard.jsx'));
const ParentDashboard = lazy(() => import('../pages/dashboards/ParentDashboard.jsx'));
const StudentDashboard = lazy(() => import('../pages/dashboards/StudentDashboard.jsx'));
const Profile = lazy(() => import('../pages/Profile.jsx'));
const Courses = lazy(() => import('../pages/Courses.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));

// Componente de carga personalizado
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="large" />
  </div>
);

// High-order component para optimización
const withPerformance = (Component: React.ComponentType) => {
  return React.memo(Component);
};

// Router optimizado
const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/moderator" element={<ModeratorDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default AppRouter;
