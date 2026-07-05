'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't restore user from localStorage - start fresh
    setLoading(false);

    // Listen for storage changes from other components
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        const updatedUser = e.newValue ? JSON.parse(e.newValue) : null;
        setUser(updatedUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const register = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', {
        username,
        password,
      });
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error.response?.data?.error || 'Registration failed';
    }
  };

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        username,
        password,
      });
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error.response?.data?.error || 'Login failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const activateCreator = async (creatorData) => {
    try {
      const res = await axios.post('http://localhost:3001/api/user/activate-creator', {
        user_id: user.id,
        ...creatorData,
      });
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to activate creator profile';
    }
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, activateCreator, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
