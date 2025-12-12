import React from 'react';
import { Calculator, Bot, ArrowRight, Sparkles, FileText, BarChart3, MessageSquare, Target, TrendingUp, PieChart, Users, ShoppingCart } from 'lucide-react';

const ModeSelectionPage = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <img
              src="/data/logo_corse_matin.jpg"
              alt="Corse-Matin Logo"
              className="h-12 w-auto rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-2xl font-bold text-corse-noir">Corse-Matin</h1>
              <p className="text-sm text-corse-gris-light">Outils Plan Média</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-corse-noir mb-4">
            Choisissez votre <span className="text-corse-rouge">outil</span>
          </h2>
          <p className="text-lg text-corse-gris max-w-3xl mx-auto">
            Créez des plans médias professionnels avec notre calculette guidée, simulez vos KPIs prévisionnels, ou conversez avec notre assistant IA.
          </p>
        </div>

        {/* Cards Container - 3 colonnes */}
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Mode Calculette */}
          <div 
            onClick={() => onSelectMode('calculette')}
            className="group bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-corse-rouge hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-corse-rouge to-red-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                  <Calculator className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Calculette</h3>
                  <p className="text-red-100">Mode guidé étape par étape</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <p className="text-corse-gris mb-6">
                Créez un plan média complet en suivant un assistant étape par étape. Idéal pour une approche structurée.
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-sm text-corse-noir">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-corse-rouge" size={16} />
                  </div>
                  <span>Formulaire guidé en 5 étapes</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-corse-noir">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-corse-rouge" size={16} />
                  </div>
                  <span>Répartition budgétaire automatique</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-corse-noir">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Target className="text-corse-rouge" size={16} />
                  </div>
                  <span>Sélection d'offres pré-configurées</span>
                </li>
              </ul>

              {/* CTA Button */}
              <button className="w-full py-4 bg-gradient-to-r from-corse-rouge to-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 group-hover:from-red-700 group-hover:to-red-800 transition shadow-lg">
                Lancer la Calculette
                <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>

          {/* Mode 2 - Simulation KPI */}
          <div 
            onClick={() => onSelectMode('simulation')}
            className="group bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden relative"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                  <TrendingUp className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Simulation KPI</h3>
                  <p className="text-blue-100">Prévisions de performance</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <p className="text-corse-gris mb-6">
                Construisez un panier de supports et obtenez des projections KPI détaillées avec visualisations graphiques.
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-sm text-corse-noir">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="text-blue-600" size={16} />
                  </div>
                  <span>Panier de supports avec remises</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-corse-noir">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <PieChart className="text-blue-600" size={16} />
                  </div>
                  <span>GRP, CPM, Taux de couverture</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-corse-noir">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="text-blue-600" size={16} />
                  </div>
                  <span>Pénétration par segment de cible</span>
                </li>
              </ul>

              {/* CTA Button */}
              <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 group-hover:from-blue-700 group-hover:to-indigo-700 transition shadow-lg">
                Lancer la Simulation
                <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </button>
            </div>

            {/* Badge PRO */}
            <div className="absolute top-4 right-4">
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={12} />
                PRO
              </span>
            </div>
          </div>

          {/* Mode Chatbot */}
          <div 
            onClick={() => onSelectMode('chatbot')}
            className="group bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-purple-500 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                  <Bot className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Assistant IA</h3>
                  <p className="text-purple-100">Mode conversationnel intelligent</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <p className="text-corse-gris mb-6">
                Discutez avec notre assistant IA pour créer un plan média personnalisé en fonction de vos besoins.
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-sm text-corse-noir">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="text-purple-600" size={16} />
                  </div>
                  <span>Conversation naturelle en français</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-corse-noir">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-purple-600" size={16} />
                  </div>
                  <span>Recommandations personnalisées IA</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-corse-noir">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="text-purple-600" size={16} />
                  </div>
                  <span>Contexte métier Corse Matin intégré</span>
                </li>
              </ul>

              {/* CTA Button */}
              <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 group-hover:from-purple-700 group-hover:to-indigo-700 transition shadow-lg">
                Démarrer la conversation
                <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </button>
            </div>

            {/* Badge IA */}
            <div className="absolute top-4 right-4">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Sparkles size={12} />
                NOUVEAU
              </span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-sm text-corse-gris-light">
            💡 Les deux outils utilisent les données et tarifs officiels de Corse Matin
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeSelectionPage;
