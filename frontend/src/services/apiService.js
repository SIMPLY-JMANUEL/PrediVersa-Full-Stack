// services/apiService.js
// Servicio central para comunicación con el backend

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Clase para manejar todas las llamadas a la API
 */
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Método genérico para hacer requests HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);

      const response = await window.fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Response: ${endpoint}`, data);

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Operación exitosa',
      };
    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error);
      return {
        success: false,
        error: error.message,
        message: 'Error de conexión con el servidor',
      };
    }
  }

  // ============== MÉTODOS DE USUARIOS ==============

  /**
   * Búsqueda de usuarios con paginación
   */
  async searchUsers(searchParams, page = 1, limit = 10) {
    const params = new window.URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Si searchParams es un objeto, extraer los parámetros
    if (typeof searchParams === 'object' && searchParams !== null) {
      if (searchParams.documento) {
        params.append('documento', searchParams.documento);
      }
      if (searchParams.nombre) {
        params.append('nombre', searchParams.nombre);
      }
    } else if (searchParams) {
      // Si es una cadena, usarla como búsqueda general
      params.append('q', searchParams);
    }

    return this.request(`/users-sqlite/search?${params}`);
  }

  /**
   * Crear nuevo usuario
   */
  async createUser(userData) {
    return this.request('/users-sqlite', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(userId) {
    return this.request(`/users-sqlite/${userId}`);
  }

  /**
   * Actualizar usuario
   */
  async updateUser(userId, userData) {
    return this.request(`/users-sqlite/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Eliminar usuario
   */
  async deleteUser(userId) {
    return this.request(`/users-sqlite/${userId}`, {
      method: 'DELETE',
    });
  }

  // ============== MÉTODOS DE PERFIL ==============

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile() {
    return this.request('/profile');
  }

  /**
   * Actualizar perfil del usuario
   */
  async updateProfile(profileData) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // ============== MÉTODOS DE ADMINISTRADOR ==============

  /**
   * Obtener estadísticas del dashboard admin
   */
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  /**
   * Obtener usuarios recientes
   */
  async getRecentUsers(limit = 10) {
    return this.request(`/admin/users?limit=${limit}`);
  }

  /**
   * Obtener alertas del sistema
   */
  async getSystemAlerts() {
    return this.request('/admin/alerts');
  }

  // ============== MÉTODOS DE ESTUDIANTE ==============

  /**
   * Enviar respuestas de cuestionario emocional
   */
  async submitEmotionalQuestionnaire(answers) {
    return this.request('/student/emotional-questionnaire', {
      method: 'POST',
      body: JSON.stringify(answers),
    });
  }

  /**
   * Obtener historial de cuestionarios
   */
  async getQuestionnaireHistory() {
    return this.request('/student/questionnaire-history');
  }

  /**
   * Enviar reporte de violencia
   */
  async submitViolenceReport(reportData) {
    return this.request('/student/violence-report', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  // ============== MÉTODOS DE AUTENTICACIÓN ==============

  /**
   * Iniciar sesión
   */
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response;
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    localStorage.removeItem('token');
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // ============== MÉTODOS DE PQR ==============

  /**
   * Crear nueva PQR
   */
  async createPQR(pqrData) {
    return this.request('/pqr', {
      method: 'POST',
      body: JSON.stringify(pqrData),
    });
  }

  /**
   * Obtener PQRs del usuario
   */
  async getUserPQRs() {
    return this.request('/pqr');
  }

  /**
   * Obtener todas las PQRs (admin)
   */
  async getAllPQRs() {
    return this.request('/admin/pqr');
  }
}

// Exportar instancia singleton
const apiService = new ApiService();
export default apiService;

// Exportar también métodos específicos para facilitar importación
export const {
  searchUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  getAdminStats,
  getRecentUsers,
  getSystemAlerts,
  submitEmotionalQuestionnaire,
  getQuestionnaireHistory,
  submitViolenceReport,
  login,
  logout,
  createPQR,
  getUserPQRs,
  getAllPQRs,
} = apiService;
