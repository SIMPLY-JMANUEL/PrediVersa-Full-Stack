/**
 * 🚀 API Client Centralizado para PrediVersa
 *
 * Esta es mi recomendación para manejar todas las APIs de manera consistente.
 * Incluye manejo de errores, timeouts, interceptores y autenticación automática.
 */

class ApiClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '/api';
    this.timeout = 10000; // 10 segundos
    this.retryAttempts = 3;
  }

  /**
   * 🔧 Configuración de headers por defecto
   */
  getDefaultHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    // Agregar token automáticamente si existe
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * 🚦 Método principal para hacer requests
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: {
        ...this.getDefaultHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await this.fetchWithTimeout(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * ⏱️ Fetch con timeout personalizado
   */
  async fetchWithTimeout(url, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * 📊 Manejo de respuestas
   */
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(
        error.message || error.msg || 'Error en la respuesta del servidor'
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  }

  /**
   * 🚨 Manejo centralizado de errores
   */
  handleError(error) {
    console.error('❌ API Error:', error);

    // Manejar errores de autenticación
    if (error.message.includes('401') || error.message.includes('Token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }

    // Manejar errores de timeout
    if (error.name === 'AbortError') {
      throw new Error(
        'La solicitud tardó demasiado tiempo. Verifica tu conexión.'
      );
    }

    // Manejar errores de red
    if (error.message.includes('Failed to fetch')) {
      throw new Error(
        'Error de conexión. Verifica que el servidor esté funcionando.'
      );
    }

    throw error;
  }

  /**
   * 🔑 Métodos específicos para autenticación
   */
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Guardar token automáticamente
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  async refreshToken() {
    return await this.request('/auth/refresh', { method: 'POST' });
  }

  /**
   * 👥 Métodos para usuarios
   */
  async getUsers() {
    return await this.request('/users');
  }

  async getUser(id) {
    return await this.request(`/users/${id}`);
  }

  async createUser(userData) {
    return await this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return await this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return await this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * 📈 Métodos para analytics/dashboard
   */
  async getDashboardStats() {
    return await this.request('/dashboard/stats');
  }

  async getAlarmas(userId) {
    return await this.request(`/alarmas/${userId}`);
  }

  async getIncidentesPendientes() {
    return await this.request('/incidentes-pendientes');
  }
}

// 🌟 Exportar instancia singleton
const apiClient = new ApiClient();
export default apiClient;

// 🎯 Exportar métodos individuales para mayor conveniencia
export const {
  login,
  logout,
  refreshToken,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats,
  getAlarmas,
  getIncidentesPendientes,
} = apiClient;
