import React, { useState } from 'react'
import { MediaPlanProvider } from './context/MediaPlanContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Wizard } from './wizard/Wizard'
import { Dashboard } from './pages'
import Login from './pages/Login'
import Register from './pages/Register'
import ModeSelectionPage from './pages/ModeSelectionPage'
import ChatbotPage from './pages/ChatbotPage'
import SimulationMode from './pages/SimulationMode'
import { Navbar } from './components'
import './styles/index.css'

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState('mode-selection') // 'mode-selection', 'wizard', 'dashboard', 'chatbot', 'simulation'
  const [authPage, setAuthPage] = useState('login') // 'login', 'register'

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {authPage === 'login' ? (
          <Login onSwitchToRegister={() => setAuthPage('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthPage('login')} />
        )}
      </div>
    );
  }

  // Page de sélection de mode (sans Navbar)
  if (page === 'mode-selection') {
    return (
      <ModeSelectionPage 
        onSelectMode={(mode) => {
          if (mode === 'calculette') {
            setPage('wizard');
          } else if (mode === 'chatbot') {
            setPage('chatbot');
          } else if (mode === 'simulation') {
            setPage('simulation');
          }
        }}
      />
    );
  }

  // Page Chatbot (avec son propre header)
  if (page === 'chatbot') {
    return (
      <ChatbotPage 
        onBack={() => setPage('mode-selection')}
      />
    );
  }

  // Page Simulation KPI (avec son propre header)
  if (page === 'simulation') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mini navbar pour simulation */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
            <button
              onClick={() => setPage('mode-selection')}
              className="flex items-center gap-2 text-gray-600 hover:text-corse-rouge transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Retour aux modes
            </button>
            <img
              src="/data/logo_corse_matin.jpg"
              alt="Logo"
              className="h-8 w-auto rounded"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
        <div className="pt-14">
          <SimulationMode />
        </div>
      </div>
    );
  }

  // Mode Calculette (wizard + dashboard)
  return (
    <MediaPlanProvider>
      <Navbar 
        onLogoClick={() => setPage('mode-selection')}
        currentPage={page}
        onNavigateToDashboard={() => setPage('dashboard')}
        onNavigateToModeSelection={() => setPage('mode-selection')}
      />
      
      <div className="min-h-screen bg-gray-50">
        {page === 'wizard' && (
          <Wizard
            onComplete={() => setPage('dashboard')}
          />
        )}
        
        {page === 'dashboard' && (
          <Dashboard
            onCreateNew={() => setPage('wizard')}
          />
        )}
      </div>
    </MediaPlanProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
