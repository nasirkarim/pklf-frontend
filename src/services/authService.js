import { request } from './api';

const TOKEN_KEY = 'pk_lost_found_token';

export const authService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Register citizen account
   * POST /api/auth/register
   */
  async register(userData) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (data?.token) {
      this.setToken(data.token);
    }
    return data;
  },

  /**
   * Sign in with email and password
   * POST /api/auth/login
   */
  async login(credentials) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (data?.token) {
      this.setToken(data.token);
    }
    return data;
  },

  /**
   * Get current authenticated user
   * GET /api/auth/me
   */
  async getCurrentUser() {
    return request('/auth/me', {
      method: 'GET',
    });
  },

  /**
   * Update citizen profile
   * PUT /api/users/profile
   */
  async updateProfile(profileData) {
    return request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Get user profile details
   * GET /api/users/profile
   */
  async getUserProfile() {
    return request('/users/profile', {
      method: 'GET',
    });
  },

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network failures on logout
    } finally {
      this.removeToken();
    }
  },
};

export default authService;
