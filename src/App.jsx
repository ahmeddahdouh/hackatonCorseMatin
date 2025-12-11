import React, { useState } from 'react'
import { MediaPlanProvider } from './context/MediaPlanContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Wizard } from './wizard/Wizard'
import { Dashboard } from './pages'
import Login from './pages/Login'
import Register from './pages/Register'
import { Navbar } from './components'
import './styles/index.css'

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState('wizard') // 'wizard', 'dashboard'
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

  return (
    <MediaPlanProvider>
      <Navbar 
        onLogoClick={() => setPage('wizard')}
        currentPage={page}
        onNavigateToDashboard={() => setPage('dashboard')}
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
