import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const userData = response.data;
      
      if (userData.status !== 'PENDING') {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      return userData; 
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const setupPassword = async (username, password) => {
    try {
      const response = await api.post('/auth/setup-password', { username, password });
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Password setup failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, setupPassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
