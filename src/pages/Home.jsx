import React from 'react'
import { Button, Card, CardGrid } from '../components'

export const Home = ({ onStartWizard }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            📊 Plan Média Pro
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Créez vos stratégies de publicité sans dépendre d'un backend
          </p>
          <Button variant="primary" size="lg" onClick={onStartWizard} className="bg-white text-blue-600 hover:bg-blue-50">
            🚀 Créer un Plan Média
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/95">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Wizard Intuitif</h3>
            <p className="text-gray-600 text-sm">
              Un assistant étape par étape pour composer votre plan média facilement
            </p>
          </Card>

          <Card className="bg-white/95">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Analyses Visuelles</h3>
            <p className="text-gray-600 text-sm">
              Graphiques en temps réel pour visualiser votre budget et audience
            </p>
          </Card>

          <Card className="bg-white/95">
            <div className="text-4xl mb-3">💾</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Stockage Local</h3>
            <p className="text-gray-600 text-sm">
              Sauvegardez vos plans en localStorage sans dépendre d'un serveur
            </p>
          </Card>

          <Card className="bg-white/95">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Multi-Supports</h3>
            <p className="text-gray-600 text-sm">
              Presse, Web, Réseaux sociaux, Vidéo, Podcasts... Tous vos médias
            </p>
          </Card>

          <Card className="bg-white/95">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Calculs de Budget</h3>
            <p className="text-gray-600 text-sm">
              Gestion automatique des prix et calcul du ROI en fonction de l'audience
            </p>
          </Card>

          <Card className="bg-white/95">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">100% Front-End</h3>
            <p className="text-gray-600 text-sm">
              Construit avec React + Vite + TailwindCSS. Aucune dépendance serveur
            </p>
          </Card>
        </div>

        {/* How it works */}
        <Card className="bg-white/95 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📖 Comment ça marche ?</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">1</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sélectionner un client</h3>
                <p className="text-gray-600 text-sm">Identifiez qui est votre client et son type (B2C/B2B)</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">2</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Choisir les supports média</h3>
                <p className="text-gray-600 text-sm">Quotidiens, portails web, réseaux sociaux, vidéo...</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">3</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sélectionner les formats</h3>
                <p className="text-gray-600 text-sm">Bannières, vidéos, insertions, stories...</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">4</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Définir les quantités</h3>
                <p className="text-gray-600 text-sm">Budget automatiquement calculé en temps réel</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">5</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analyser avec des graphiques</h3>
                <p className="text-gray-600 text-sm">Répartition budgets, audience, comparatifs supports</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">6</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sauvegarder le plan</h3>
                <p className="text-gray-600 text-sm">Gardez en mémoire vos plans pour les consulter plus tard</p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button variant="primary" size="lg" onClick={onStartWizard} className="bg-white text-blue-600 hover:bg-blue-50">
            🚀 Démarrer Maintenant
          </Button>
          <p className="text-blue-100 mt-4 text-sm">
            Aucun compte requis · 100% local · Données sécurisées
          </p>
        </div>
      </div>
    </div>
  )
}
