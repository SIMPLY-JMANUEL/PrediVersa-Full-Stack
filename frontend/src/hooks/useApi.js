/**
 * 🎣 Custom Hooks para API calls en PrediVersa
 *
 * Estos hooks proporcionan una interfaz React limpia para usar el API client
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api-client';

/**
 * 🔑 Hook para autenticación
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async credentials => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(credentials);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
      throw new Error(response.message || 'Error de autenticación');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiClient.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  // Verificar sesión al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  };
};

/**
 * 👥 Hook para gestión de usuarios
 */
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getUsers();
      setUsers(response.users || response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(
    async userData => {
      try {
        const response = await apiClient.createUser(userData);
        await fetchUsers(); // Refrescar lista
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [fetchUsers]
  );

  const updateUser = useCallback(
    async (id, userData) => {
      try {
        const response = await apiClient.updateUser(id, userData);
        await fetchUsers(); // Refrescar lista
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [fetchUsers]
  );

  const deleteUser = useCallback(
    async id => {
      try {
        const response = await apiClient.deleteUser(id);
        await fetchUsers(); // Refrescar lista
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [fetchUsers]
  );

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

/**
 * 📊 Hook para datos del dashboard
 */
export const useDashboard = userId => {
  const [stats, setStats] = useState(null);
  const [alarmas, setAlarmas] = useState([]);
  const [incidentes, setIncidentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const [statsResponse, alarmasResponse, incidentesResponse] =
        await Promise.all([
          apiClient.getDashboardStats(),
          apiClient.getAlarmas(userId),
          apiClient.getIncidentesPendientes(),
        ]);

      setStats(statsResponse);
      setAlarmas(alarmasResponse.alarmas || alarmasResponse);
      setIncidentes(incidentesResponse.incidentes || incidentesResponse);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    alarmas,
    incidentes,
    loading,
    error,
    refresh: fetchDashboardData,
  };
};

/**
 * 🔄 Hook genérico para cualquier API call
 */
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
  };
};
