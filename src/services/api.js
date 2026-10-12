const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const API_BASE_URL = RAW_API_BASE.replace(/\/+$/, '');
const TOKEN_KEY = 'pk_lost_found_token';

/**
 * Common fetch helper with JSON and error handling
 */
export const request = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  // Attach token from localStorage if available
  const token = localStorage.getItem(TOKEN_KEY);
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // For FormData, let the browser set Content-Type with multipart boundary
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const defaultHeaders = isFormData ? {} : { 'Content-Type': 'application/json' };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...authHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // If 401 Unauthorized, clean stored token
      if (response.status === 401 && token) {
        localStorage.removeItem(TOKEN_KEY);
      }

      let errorMessage = data?.message;
      if (!errorMessage) {
        if (response.status === 502 || response.status === 503 || response.status === 504) {
          errorMessage = 'Backend server is unreachable (Status 502 Bad Gateway). Please ensure the backend server is running on port 5000.';
        } else {
          errorMessage = `Request failed with status ${response.status}`;
        }
      }
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status) throw error;
    // Network or parse error
    const netError = new Error(error.message || 'Network communication failure');
    netError.status = 0;
    throw netError;
  }
};

export const apiService = {
  /**
   * Health Check: GET /api/health
   */
  async checkHealth() {
    return request('/health');
  },

  /**
   * Placeholder endpoints for future phases
   */
  async getReports() {
    return request('/reports');
  },
};

export default apiService;
