import React, { useState } from 'react'
import { MediaPlanProvider } from './context/MediaPlanContext'
import { Wizard } from './wizard/Wizard'
import { Home, Dashboard } from './pages'
import './styles/index.css'

function App() {
  const [page, setPage] = useState('home') // 'home', 'wizard', 'dashboard'

  return (
    <MediaPlanProvider>
      <div className="min-h-screen bg-gray-50">
        {page === 'home' && (
          <Home 
            onStartWizard={() => setPage('wizard')}
          />
        )}
        
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

        {/* Navigation flottante */}
        {page !== 'home' && (
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => setPage('home')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
            >
              🏠 Accueil
            </button>
          </div>
        )}

        {page !== 'dashboard' && page !== 'home' && (
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={() => setPage('dashboard')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors font-semibold text-sm"
            >
              📊 Tableau de Bord
            </button>
          </div>
        )}
      </div>
    </MediaPlanProvider>
  )
}

export default App
