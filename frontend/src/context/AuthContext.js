import { createContext, useCallback, useEffect, useState } from 'react';
import { http } from '../api/http.js';

export const AuthContext = createContext(undefined);

const TOKEN_KEY = 'yc_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const persistAuth = (payload) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem(TOKEN_KEY, payload.token);
  };

  const login = async (credentials) => {
    const { data } = await http.post('/auth/login', credentials);
    persistAuth(data);
  };

  const signup = async (payload) => {
    const { data } = await http.post('/auth/signup', payload);
    persistAuth(data);
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await http.get('/profile');
      setUser(data);
    } catch (error) {
      console.error('Failed to refresh profile', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

