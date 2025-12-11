import React, { createContext, useState, useCallback } from 'react';

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
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Validation basique
      if (!email || !password) {
        throw new Error('Email et mot de passe requis');
      }

      if (!email.includes('@')) {
        throw new Error('Email invalide');
      }

      if (password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      // Créer un utilisateur simulé
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };

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
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 500));

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

      // Vérifier si l'utilisateur existe déjà (simulé)
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (existingUsers.find(u => u.email === email)) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Créer un nouvel utilisateur
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };

      // Sauvegarder dans la liste des utilisateurs enregistrés
      existingUsers.push({ email, password });
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

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
