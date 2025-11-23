import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setShowAuthModal(false);
      } else {
        setUser(null);
        setShowAuthModal(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setShowAuthModal(true);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setShowAuthModal(false);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (name, email, password, role = 'student') => {
    try {
      const response = await authAPI.register(name, email, password, role);
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setShowAuthModal(false);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setShowAuthModal(true);
      
      // Clear any cached form data and force form reset
      if (typeof window !== 'undefined') {
        // Clear localStorage if any auth data is stored there
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Force a page reload to clear any browser autofill data
        // This ensures a clean slate for the next login
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    }
  };

  const value = {
    user,
    loading,
    showAuthModal,
    setShowAuthModal,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
