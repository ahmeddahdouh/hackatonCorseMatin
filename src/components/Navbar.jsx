import React from 'react'
import { useAuth } from '../context/AuthContext'

export const Navbar = ({ onLogoClick, currentPage, onNavigateToDashboard }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Corse-Matin */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            title="Retour au wizard"
          >
            {/* Logo Image Corse-Matin */}
            <img
              src="/data/logo_corse_matin.jpg"
              alt="Corse-Matin Logo"
              className="h-10 w-auto flex-shrink-0 rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </button>

          {/* Menu centre - Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={onNavigateToDashboard}
              className={`text-sm font-semibold px-4 py-2 rounded-lg transition ${
                currentPage === 'dashboard'
                  ? 'bg-corse-rouge text-white'
                  : 'text-corse-noir hover:bg-red-50'
              }`}
              title="Historique des plans"
            >
              📊 Historique
            </button>
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-3 text-sm">
                <span className="text-corse-gris">
                  👤 {user.email}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-50 text-corse-rouge border-2 border-corse-rouge rounded-lg hover:bg-corse-rouge hover:text-white transition-colors font-semibold"
                >
                  Déconnexion
                </button>
              </div>
            )}
            <a
              href="https://www.corsematin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-xs text-corse-gris hover:text-corse-rouge transition-colors font-medium px-3 py-2 rounded-lg hover:bg-red-50"
            >
              🌐 Corse-Matin.com
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
