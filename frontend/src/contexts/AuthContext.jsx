import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));

  useEffect(() => {
    // Set auth token in axios if it exists
    if (token) {
      import('../services/api').then(({ default: api }) => {
        api.setAuthToken(token);
      });
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.checkAuth();
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      const { token: newToken, user_id, username: userUsername, is_admin } = response.data;
      
      localStorage.setItem('auth_token', newToken);
      setToken(newToken);
      setUser({
        id: user_id,
        username: userUsername,
        is_admin: is_admin || false,
      });
      
      // Update axios default header
      const api = await import('../services/api');
      api.default.setAuthToken(newToken);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.',
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      
      // Remove axios default header
      const api = await import('../services/api');
      api.default.setAuthToken(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
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
