import axios from 'axios';

// Create axios instance with base configuration
const baseURL = import.meta.env.VITE_API_URL || 'https://veh-maint-app-production.up.railway.app/api';
console.log('🔧 API Base URL:', baseURL);
console.log('🌍 Environment:', import.meta.env.MODE);

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Session management
class SessionManager {
  static getSessionId() {
    return localStorage.getItem('sessionId');
  }

  static setSession(sessionId, user, expiresAt) {
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('sessionExpiresAt', expiresAt);
  }

  static clearSession() {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionExpiresAt');
  }

  static getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static isSessionValid() {
    const sessionId = this.getSessionId();
    const expiresAt = localStorage.getItem('sessionExpiresAt');
    
    if (!sessionId || !expiresAt) {
      return false;
    }
    
    return new Date() < new Date(expiresAt);
  }
}

// Request interceptor to add session ID to headers
api.interceptors.request.use(
  (config) => {
    const sessionId = SessionManager.getSessionId();
    if (sessionId) {
      config.headers['x-session-id'] = sessionId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or invalid
      SessionManager.clearSession();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Services
export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        SessionManager.setSession(
          response.data.sessionId,
          response.data.user,
          response.data.expiresAt
        );
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log('🔐 Attempting login with URL:', api.defaults.baseURL);
      console.log('📝 Credentials:', { identifier: credentials.identifier, password: '[HIDDEN]' });
      
      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login response:', response.data);
      
      if (response.data.success) {
        SessionManager.setSession(
          response.data.sessionId,
          response.data.user,
          response.data.expiresAt
        );
      }
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method
        }
      });
      throw error.response?.data || { message: 'Login failed: ' + error.message };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
      SessionManager.clearSession();
      return { success: true };
    } catch (error) {
      SessionManager.clearSession(); // Clear session anyway
      return { success: true };
    }
  },

  // Validate session
  validateSession: async () => {
    try {
      const response = await api.get('/auth/validate');
      return response.data;
    } catch (error) {
      SessionManager.clearSession();
      throw error.response?.data || { message: 'Session validation failed' };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get profile' };
    }
  }
};

export const taskOrderService = {
  // Create new task order
  create: async (formData) => {
    try {
      const response = await api.post('/task-orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create task order' };
    }
  },

  // Get all task orders
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/task-orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get task orders' };
    }
  },

  // Get task order by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/task-orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get task order' };
    }
  },

  // Approve task order
  approve: async (id, approvalData) => {
    try {
      const response = await api.patch(`/task-orders/${id}/approve`, approvalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to approve task order' };
    }
  },

  // Complete task order
  complete: async (id, formData) => {
    try {
      const response = await api.patch(`/task-orders/${id}/complete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to complete task order' };
    }
  }
};

export const driverService = {
  // Get all drivers
  getAll: async () => {
    try {
      const response = await api.get('/drivers');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get drivers' };
    }
  },

  // Get driver by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/drivers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get driver' };
    }
  }
};

export const vehicleService = {
  // Get all vehicles
  getAll: async () => {
    try {
      const response = await api.get('/equipment');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get vehicles' };
    }
  },

  // Get vehicle by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/equipment/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get vehicle' };
    }
  }
};

export const maintenanceService = {
  // Get maintenance schedules
  getSchedules: async () => {
    try {
      const response = await api.get('/maintenance');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get maintenance schedules' };
    }
  },

  // Create maintenance schedule
  create: async (scheduleData) => {
    try {
      const response = await api.post('/maintenance', scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create maintenance schedule' };
    }
  }
};

// Export session manager and axios instance
export { SessionManager, api };
export default api;