import React, { createContext, useState, useCallback } from 'react';
import { verifyCredentials, registerUser, emailExists } from '../utils/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Charger l'utilisateur depuis localStorage au démarrage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Validation basique
      if (!email || !password) {
        throw new Error('Email et mot de passe requis');
      }

      if (!email.includes('@')) {
        throw new Error('Email invalide');
      }

      // Vérifier les identifiants via le service d'authentification
      const result = await verifyCredentials(email, password);
      
      if (!result.success) {
        throw new Error(result.error || 'Email ou mot de passe incorrect');
      }

      const userData = result.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, confirmPassword) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      // Validation
      if (!email || !password || !confirmPassword) {
        throw new Error('Tous les champs sont requis');
      }

      if (!email.includes('@')) {
        throw new Error('Email invalide');
      }

      if (password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      if (password !== confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      // Enregistrer via le service d'authentification
      const result = await registerUser(email, password);
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de l\'inscription');
      }

      const userData = result.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthError(null);
    localStorage.removeItem('user');
  }, []);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = {
    user,
    isLoading,
    authError,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
