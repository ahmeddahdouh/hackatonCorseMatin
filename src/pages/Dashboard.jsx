import React, { useState, useEffect } from 'react';
import { getMediaPlans, deletePlanMedia, exportPlanAsJSON } from '../utils/planStorage';
import { PlanDetails } from './PlanDetails';
import { PlanStatsChart } from './PlanStatsChart';

export const Dashboard = ({ onCreateNew }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Charger les plans media
    const mediaPlans = getMediaPlans();
    setPlans(mediaPlans);
    setLoading(false);
  }, []);

  const handleDeletePlan = (planId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
      deletePlanMedia(planId);
      const updatedPlans = getMediaPlans();
      setPlans(updatedPlans);
      setSelectedPlan(null);
    }
  };

  const handleExport = (plan) => {
    exportPlanAsJSON(plan);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowDetails(true);
  };

  const handleViewFullDetails = (plan) => {
    setSelectedPlan(plan);
    setShowDetails(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos plans...</p>
        </div>
      </div>
    );
  }

  if (showDetails && selectedPlan) {
    return (
      <PlanDetails
        plan={selectedPlan}
        onBack={() => setShowDetails(false)}
        onDelete={(planId) => {
          handleDeletePlan(planId);
          setShowDetails(false);
        }}
        onExport={handleExport}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-12 bg-corse-rouge rounded-full"></div>
              <div>
                <h1 className="text-4xl font-bold text-corse-noir">Mes Plans Média</h1>
                <p className="text-corse-gris-light mt-1">Gérez et consultez vos campagnes publicitaires</p>
              </div>
            </div>
            <button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-corse-rouge to-red-700 text-white font-semibold px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-md"
            >
              + Créer un nouveau plan
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
              <p className="text-corse-gris-light text-sm font-semibold uppercase">Total de plans</p>
              <p className="text-4xl font-bold text-corse-noir mt-2">{plans.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500 shadow-sm">
              <p className="text-corse-gris-light text-sm font-semibold uppercase">Budget total</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {(plans.reduce((sum, p) => sum + (p.budget || 0), 0) / 1000).toFixed(0)}K€
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border-l-4 border-green-500 shadow-sm">
              <p className="text-corse-gris-light text-sm font-semibold uppercase">Audience totale</p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {(plans.reduce((sum, p) => sum + (p.kpis?.estimatedReach || 0), 0) / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des plans */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-corse-rouge to-red-700 px-6 py-4">
                <h2 className="text-white font-bold text-lg">Plans médias ({plans.length})</h2>
              </div>
              
              {plans.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-corse-gris-light mb-4">Aucun plan créé pour l'instant</p>
                  <button
                    onClick={onCreateNew}
                    className="bg-corse-rouge text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    Créer un plan
                  </button>
                </div>
              ) : (
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => handlePlanSelect(plan)}
                      className={`p-4 transition border-l-4 cursor-pointer ${
                        selectedPlan?.id === plan.id
                          ? 'bg-red-50 border-corse-rouge'
                          : 'hover:bg-gray-50 border-transparent hover:border-corse-rouge/50'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-corse-noir truncate">{plan.clientName}</p>
                          <p className="text-xs text-corse-gris mt-1">📋 {plan.campaignName}</p>
                          <p className="text-xs text-corse-gris-light mt-1">{formatDate(plan.createdAt)}</p>
                          <p className="text-sm font-bold text-corse-rouge mt-2">{plan.budget?.toLocaleString()}€</p>
                        </div>
                        <div className="flex-shrink-0 bg-corse-rouge text-white px-3 py-2 rounded-lg font-semibold text-sm whitespace-nowrap">
                          Voir →
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Détail du plan sélectionné */}
          <div className="lg:col-span-2">
            {selectedPlan ? (
              <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4">
                {/* Entête du plan */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-corse-noir">{selectedPlan.clientName}</h2>
                      <p className="text-sm text-corse-gris mt-1">📋 {selectedPlan.campaignName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-corse-gris uppercase font-semibold">Budget Global</p>
                      <p className="text-3xl font-bold text-corse-rouge">{selectedPlan.budget?.toLocaleString()}€</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-corse-gris font-semibold uppercase">Matricule</p>
                      <p className="text-corse-noir font-semibold mt-1">{selectedPlan.clientMatricule}</p>
                    </div>
                    <div>
                      <p className="text-xs text-corse-gris font-semibold uppercase">Secteur</p>
                      <p className="text-corse-noir font-semibold mt-1">{selectedPlan.sector}</p>
                    </div>
                    <div>
                      <p className="text-xs text-corse-gris font-semibold uppercase">Créé le</p>
                      <p className="text-corse-noir font-semibold mt-1">{formatDate(selectedPlan.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-corse-gris font-semibold uppercase">Zone</p>
                      <p className="text-corse-noir font-semibold mt-1">{selectedPlan.region === 'corse' ? '🇫🇷 Corse' : '🌍 Ailleurs'}</p>
                    </div>
                  </div>

                  {/* Boutons actions */}
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleExport(selectedPlan)}
                      className="flex-1 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-semibold border-2 border-blue-200"
                    >
                      📥 Télécharger
                    </button>
                    <button
                      onClick={() => handleDeletePlan(selectedPlan.id)}
                      className="flex-1 bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition font-semibold border-2 border-red-200"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>

                {/* Statistiques et graphiques */}
                <PlanStatsChart plan={selectedPlan} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-full min-h-[500px]">
                <div className="text-center">
                  <p className="text-4xl mb-4">📋</p>
                  <p className="text-corse-gris-light text-lg">Sélectionnez un plan pour voir les statistiques</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
