import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => authService.getToken());
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize and check user session from stored token
  const loadUser = useCallback(async () => {
    const existingToken = authService.getToken();
    if (!existingToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await authService.getCurrentUser();
      if (res?.success && res?.user) {
        setUser(res.user);
        setToken(existingToken);
      } else {
        setUser(null);
        authService.removeToken();
      }
    } catch {
      setUser(null);
      authService.removeToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Log in user with credentials
   */
  const login = async (credentials) => {
    setAuthError(null);
    try {
      const data = await authService.login(credentials);
      if (data?.token && data?.user) {
        setUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user };
      }
      throw new Error(data?.message || 'Login failed');
    } catch (err) {
      const msg = err.data?.message || err.message || 'Login failed';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  /**
   * Register new citizen account
   */
  const register = async (userData) => {
    setAuthError(null);
    try {
      const data = await authService.register(userData);
      if (data?.token && data?.user) {
        setUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user };
      }
      throw new Error(data?.message || 'Registration failed');
    } catch (err) {
      const msg = err.data?.message || err.message || 'Registration failed';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  /**
   * Update authenticated profile
   */
  const updateProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      if (data?.success && data?.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      throw new Error(data?.message || 'Update failed');
    } catch (err) {
      const msg = err.data?.message || err.message || 'Failed to update profile';
      throw new Error(msg);
    }
  };

  /**
   * Log out user
   */
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      setAuthError(null);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: Boolean(user && user.role === 'admin'),
    loading,
    authError,
    login,
    register,
    logout,
    updateProfile,
    refetchUser: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
