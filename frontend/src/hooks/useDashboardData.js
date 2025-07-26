// hooks/useDashboardData.js
// Hook personalizado para manejar datos de dashboards con conexión a la API

import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

/**
 * Hook para manejar datos del AdminDashboard
 */
export const useAdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    recentReports: 0,
    pendingPQRs: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  // Cargar estadísticas del dashboard
  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getAdminStats();
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error cargando estadísticas');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar usuarios recientes
  const loadRecentUsers = useCallback(async (limit = 10) => {
    try {
      const response = await apiService.getRecentUsers(limit);
      if (response.success) {
        setRecentUsers(response.data);
      }
    } catch (err) {
      console.error('Error loading recent users:', err);
    }
  }, []);

  // Cargar alertas del sistema
  const loadSystemAlerts = useCallback(async () => {
    try {
      const response = await apiService.getSystemAlerts();
      if (response.success) {
        setSystemAlerts(response.data);
      }
    } catch (err) {
      console.error('Error loading system alerts:', err);
    }
  }, []);

  // Buscar usuarios
  const searchUsers = useCallback(async searchParams => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.searchUsers(searchParams);
      if (response.success) {
        setUsers(response.data);
        return response.data;
      } else {
        setError(response.message);
        return [];
      }
    } catch (err) {
      setError('Error buscando usuarios');
      console.error('Error searching users:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear usuario
  const createUser = useCallback(
    async userData => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.createUser(userData);
        if (response.success) {
          // Recargar estadísticas y usuarios recientes
          await Promise.all([loadStats(), loadRecentUsers()]);
          return response;
        } else {
          setError(response.message);
          return response;
        }
      } catch (err) {
        setError('Error creando usuario');
        console.error('Error creating user:', err);
        return { success: false, message: 'Error creando usuario' };
      } finally {
        setLoading(false);
      }
    },
    [loadStats, loadRecentUsers]
  );

  // Cargar datos iniciales - ejecutar solo una vez al montar
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([loadStats(), loadRecentUsers(), loadSystemAlerts()]);
    };

    loadInitialData();
  }, []); // Sin dependencias para que solo se ejecute una vez

  return {
    // Estados
    loading,
    error,
    users,
    stats,
    recentUsers,
    systemAlerts,

    // Métodos
    searchUsers,
    createUser,
    loadStats,
    loadRecentUsers,
    loadSystemAlerts,

    // Helpers
    refreshData: () =>
      Promise.all([loadStats(), loadRecentUsers(), loadSystemAlerts()]),
  };
};

/**
 * Hook para manejar datos del StudentDashboard
 */
export const useStudentDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questionnaireHistory, setQuestionnaireHistory] = useState([]);
  const [profile, setProfile] = useState(null);

  // Cargar perfil del estudiante
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getProfile();
      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error cargando perfil');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar historial de cuestionarios
  const loadQuestionnaireHistory = useCallback(async () => {
    try {
      const response = await apiService.getQuestionnaireHistory();
      if (response.success) {
        setQuestionnaireHistory(response.data);
      }
    } catch (err) {
      console.error('Error loading questionnaire history:', err);
    }
  }, []);

  // Enviar cuestionario emocional
  const submitEmotionalQuestionnaire = useCallback(
    async answers => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.submitEmotionalQuestionnaire(answers);
        if (response.success) {
          // Recargar historial
          await loadQuestionnaireHistory();
          return response;
        } else {
          setError(response.message);
          return response;
        }
      } catch (err) {
        setError('Error enviando cuestionario');
        console.error('Error submitting questionnaire:', err);
        return { success: false, message: 'Error enviando cuestionario' };
      } finally {
        setLoading(false);
      }
    },
    [loadQuestionnaireHistory]
  );

  // Enviar reporte de violencia
  const submitViolenceReport = useCallback(async reportData => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.submitViolenceReport(reportData);
      if (response.success) {
        return response;
      } else {
        setError(response.message);
        return response;
      }
    } catch (err) {
      setError('Error enviando reporte');
      console.error('Error submitting report:', err);
      return { success: false, message: 'Error enviando reporte' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar perfil
  const updateProfile = useCallback(async profileData => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.updateProfile(profileData);
      if (response.success) {
        setProfile(response.data);
        return response;
      } else {
        setError(response.message);
        return response;
      }
    } catch (err) {
      setError('Error actualizando perfil');
      console.error('Error updating profile:', err);
      return { success: false, message: 'Error actualizando perfil' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([loadProfile(), loadQuestionnaireHistory()]);
    };

    loadInitialData();
  }, []); // Dependencias vacías para ejecutar solo una vez

  return {
    // Estados
    loading,
    error,
    profile,
    questionnaireHistory,

    // Métodos
    loadProfile,
    updateProfile,
    submitEmotionalQuestionnaire,
    submitViolenceReport,
    loadQuestionnaireHistory,

    // Helpers
    refreshData: () => Promise.all([loadProfile(), loadQuestionnaireHistory()]),
  };
};

/**
 * Hook genérico para PQRs
 */
export const usePQR = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pqrs, setPqrs] = useState([]);

  // Cargar PQRs del usuario
  const loadUserPQRs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getUserPQRs();
      if (response.success) {
        setPqrs(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error cargando PQRs');
      console.error('Error loading PQRs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva PQR
  const createPQR = useCallback(
    async pqrData => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.createPQR(pqrData);
        if (response.success) {
          await loadUserPQRs(); // Recargar lista
          return response;
        } else {
          setError(response.message);
          return response;
        }
      } catch (err) {
        setError('Error creando PQR');
        console.error('Error creating PQR:', err);
        return { success: false, message: 'Error creando PQR' };
      } finally {
        setLoading(false);
      }
    },
    [loadUserPQRs]
  );

  useEffect(() => {
    loadUserPQRs();
  }, [loadUserPQRs]);

  return {
    loading,
    error,
    pqrs,
    createPQR,
    loadUserPQRs,
    refreshData: loadUserPQRs,
  };
};
