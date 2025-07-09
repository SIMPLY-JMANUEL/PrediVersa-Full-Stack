import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';
import ProtectedRoute from './ProtectedRoute';

// Lazy loading de páginas
const Home = lazy(() => import('../pages/Home.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
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
const ParentDashboard = lazy(
  () => import('../pages/dashboards/ParentDashboard.jsx')
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

// Router optimizado
const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRoute="dashboard">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRoute="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/moderator"
              element={
                <ProtectedRoute requiredRoute="moderator">
                  <ModeratorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher"
              element={
                <ProtectedRoute requiredRoute="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent"
              element={
                <ProtectedRoute requiredRoute="parent">
                  <ParentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student"
              element={
                <ProtectedRoute requiredRoute="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute requiredRoute="profile">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute requiredRoute="courses">
                  <Courses />
                </ProtectedRoute>
              }
            />
            <Route path="/test-roles" element={<RoleTestingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default AppRouter;
