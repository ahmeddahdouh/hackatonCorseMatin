import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = ({ onSwitchToRegister }) => {
  const { login, isLoading, authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // L'erreur est gérée par le context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-corse-rouge to-red-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
        {/* En-tête avec logo */}
        <div className="bg-gradient-to-r from-corse-rouge to-red-700 p-8 text-center">
          {/* Logo Image Corse-Matin */}
          <img
            src="/data/logo_corse_matin.jpg"
            alt="Corse-Matin Logo"
            className="h-20 w-auto mx-auto mb-4 rounded"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          
          <h2 className="text-white font-bold text-2xl">Corse-Matin</h2>
          <p className="text-red-100 text-sm mt-1">Calculette Plan Média</p>
        </div>

        {/* Contenu Login */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-corse-noir mb-2">Connexion</h1>
            <p className="text-corse-gris-light">Bienvenue sur Corse-Matin Calculette</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
          {authError && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">⚠️ {authError}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-corse-noir mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vous@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-corse-rouge focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-corse-noir mb-2">
              Mot de passe *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-corse-rouge focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-corse-rouge to-red-700 text-white font-semibold py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-corse-gris-light text-sm">
              Pas encore inscrit ?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-corse-rouge font-semibold hover:text-red-700 transition"
              >
                Créer un compte
              </button>
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-corse-gris-light text-center">
              Demo: Utilisez n'importe quel email valide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
