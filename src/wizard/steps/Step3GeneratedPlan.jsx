import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../components';
import { generateSmartPlan } from '../../utils/smartPlanGenerator';
import { useDataLoader } from '../../hooks/useDataLoader';

/**
 * Étape 3: Plan Généré
 * Affichage du plan média généré automatiquement
 */
export default function Step3GeneratedPlan({ plan, onUpdate, onNext }) {
  const [generatedPlan, setGeneratedPlan] = useState(plan.generatedPlan || null);
  const [loading, setLoading] = useState(!plan.generatedPlan);

  const { data: prices } = useDataLoader('prices.json');
  const { data: supports } = useDataLoader('supports.json');
  const { data: formats } = useDataLoader('formats.json');
  const { data: audiences } = useDataLoader('audiences.json');

  useEffect(() => {
    if (loading && prices && supports && formats && audiences && plan.budget) {
      // Générer le plan automatiquement
      const newPlan = generateSmartPlan(
        plan.objectives || [],
        {
          age: plan.targetAge,
          csp: plan.targetCSP,
          region: plan.region,
        },
        plan.budget,
        prices,
        supports,
        formats,
        audiences
      );

      setGeneratedPlan(newPlan);
      setLoading(false);
    }
  }, [prices, supports, formats, audiences, loading, plan.budget, plan.objectives, plan.targetAge, plan.targetCSP, plan.region]);

  const handleNext = () => {
    onUpdate({ generatedPlan });
    onNext();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Génération de votre plan média...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card title="✨ Votre Plan Média Généré">
        {generatedPlan && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <p className="text-xs font-semibold text-blue-600 uppercase">Budget Utilisé</p>
                <p className="text-2xl font-bold text-blue-900">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(generatedPlan.kpis.budgetUtilise)}
                </p>
                {generatedPlan.kpis.budgetRestant > 0 && (
                  <p className="text-xs text-blue-600 mt-2">
                    Reste: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(generatedPlan.kpis.budgetRestant)}
                  </p>
                )}
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <p className="text-xs font-semibold text-green-600 uppercase">Audience Estimée</p>
                <p className="text-2xl font-bold text-green-900">
                  {(generatedPlan.kpis.reachTotal / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-green-600 mt-2">contacts</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <p className="text-xs font-semibold text-purple-600 uppercase">Impressions</p>
                <p className="text-2xl font-bold text-purple-900">
                  {(generatedPlan.kpis.impressionsTotal / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-purple-600 mt-2">visibilités</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <p className="text-xs font-semibold text-orange-600 uppercase">CPM Moyen</p>
                <p className="text-2xl font-bold text-orange-900">
                  {generatedPlan.kpis.cpmMoyen.toFixed(2)}€
                </p>
                <p className="text-xs text-orange-600 mt-2">par 1000 impressions</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">📰 Print</p>
                <p className="text-xl font-bold text-gray-900">{generatedPlan.kpis.printPercentage}%</p>
                <p className="text-xs text-gray-600 mt-1">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(generatedPlan.distribution.print)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">🌐 Digital</p>
                <p className="text-xl font-bold text-gray-900">{generatedPlan.kpis.digitalPercentage}%</p>
                <p className="text-xs text-gray-600 mt-1">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(generatedPlan.distribution.digital)}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="font-semibold text-blue-900 mb-3">📋 Détail du Plan:</p>
              <div className="space-y-2">
                {generatedPlan.offers.map((offer, idx) => (
                  <div key={idx} className="flex justify-between items-start bg-white p-3 rounded border border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-800">{offer.supportName}</p>
                      <p className="text-xs text-gray-600">{offer.formatName}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        📊 Reach: {(offer.reach / 1000).toFixed(0)}K | Impressions: {(offer.impressions / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(offer.totalPrice)}
                      </p>
                      <p className="text-xs text-gray-600">x{offer.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>

      <div className="flex gap-3 pt-4">
        <Button variant="secondary" onClick={() => window.history.back()} className="w-full">
          ← Retour
        </Button>
        <Button variant="primary" onClick={handleNext} className="w-full">
          Aperçu & PDF →
        </Button>
      </div>
    </div>
  );
}
