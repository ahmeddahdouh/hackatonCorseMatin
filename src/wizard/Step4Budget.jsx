import React, { useState } from 'react';

const Step4Budget = ({ planData = {}, onUpdate, onNext, onBack }) => {
  const [budgetAmount, setBudgetAmount] = useState(planData.budget || 15000);
  const [distributionMode, setDistributionMode] = useState(
    planData.distributionMode || 'auto'
  );
  const [customDistribution, setCustomDistribution] = useState(
    planData.customDistribution || { print: 40, digital: 50, social: 10, event: 0 }
  );
  const [errors, setErrors] = useState({});

  const templates = [
    { name: 'PME', budget: 5000 },
    { name: 'Petite Campagne', budget: 15000 },
    { name: 'Campagne Standard', budget: 30000 },
    { name: 'Grande Campagne', budget: 50000 },
  ];

  // Répartition auto par défaut
  const getAutoDistribution = () => {
    // Déterminer si trafic web est un objectif
    const hasTraficWeb = (planData.objectives || []).includes('trafic-web');
    if (hasTraficWeb) {
      return { print: 30, digital: 60, social: 10, event: 0 };
    }
    return { print: 40, digital: 45, social: 15, event: 0 };
  };

  const distribution = distributionMode === 'auto'
    ? getAutoDistribution()
    : customDistribution;

  const handleBudgetChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setBudgetAmount(Math.max(1000, value));
  };

  const handleDistributionChange = (channel, value) => {
    const newDistribution = { ...customDistribution };
    const oldValue = newDistribution[channel];
    const diff = value - oldValue;
    newDistribution[channel] = value;

    // Rééquilibrer les autres canaux
    const otherChannels = Object.keys(newDistribution).filter(c => c !== channel);
    const otherTotal = otherChannels.reduce((sum, c) => sum + newDistribution[c], 0);
    
    if (otherTotal + value === 100) {
      setCustomDistribution(newDistribution);
    } else if (otherTotal + value > 100) {
      // Réduire proportionnellement les autres canaux
      const ratio = (100 - value) / otherTotal;
      otherChannels.forEach(c => {
        newDistribution[c] = Math.round(newDistribution[c] * ratio);
      });
      setCustomDistribution(newDistribution);
    } else {
      setCustomDistribution(newDistribution);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (budgetAmount < 1000) {
      newErrors.budget = 'Le budget minimum est 1 000€';
    }
    if (distributionMode === 'custom') {
      const total = Object.values(customDistribution).reduce((a, b) => a + b, 0);
      if (total !== 100) {
        newErrors.distribution = `La répartition doit totaliser 100% (actuellement ${total}%)`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate({
        budget: budgetAmount,
        distributionMode,
        customDistribution,
        effectiveDistribution: distribution,
      });
      onNext();
    }
  };

  const calculateChannelBudget = (channel) => {
    return Math.round((budgetAmount * distribution[channel]) / 100);
  };

  const totalDistribution = Object.values(customDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-corse-blanc to-gray-50 p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-corse-rouge rounded-full"></div>
            <h1 className="text-3xl font-bold text-corse-noir">Budget de Campagne</h1>
          </div>
          <p className="text-corse-gris-light">Définissez votre budget et sa répartition par canal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Budget HT */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
            <label className="block text-sm font-semibold text-corse-noir mb-4">
              Budget global alloué (€ HT) *
            </label>
            
            <div className="mb-6">
              <input
                type="number"
                value={budgetAmount}
                onChange={handleBudgetChange}
                min="1000"
                step="1000"
                className={`w-full px-4 py-3 border-2 rounded-lg text-2xl font-bold focus:outline-none transition ${
                  errors.budget
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-corse-rouge'
                }`}
              />
              <p className="text-xs text-corse-gris-light mt-2">Minimum: 1 000€</p>
            </div>

            {/* Rapides templates */}
            <div>
              <p className="text-xs font-semibold text-corse-gris mb-3 uppercase">Modèles rapides</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {templates.map(t => (
                  <button
                    key={t.budget}
                    type="button"
                    onClick={() => setBudgetAmount(t.budget)}
                    className={`px-3 py-2 rounded-lg border-2 text-sm font-semibold transition ${
                      budgetAmount === t.budget
                        ? 'border-corse-rouge bg-red-50 text-corse-rouge'
                        : 'border-gray-300 bg-white text-corse-gris hover:border-corse-rouge'
                    }`}
                  >
                    {t.name}
                    <br />
                    <span className="text-xs">{(t.budget / 1000).toFixed(0)}k€</span>
                  </button>
                ))}
              </div>
            </div>

            {errors.budget && (
              <p className="text-red-600 text-sm mt-3">⚠️ {errors.budget}</p>
            )}
          </div>

          {/* Mode de répartition */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
            <h3 className="text-lg font-semibold text-corse-noir mb-4">
              Répartition par canal
            </h3>

            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => setDistributionMode('auto')}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  distributionMode === 'auto'
                    ? 'border-corse-rouge bg-red-50'
                    : 'border-gray-300 bg-white hover:border-corse-rouge'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-corse-rouge flex items-center justify-center mt-1">
                    {distributionMode === 'auto' && (
                      <div className="w-2 h-2 bg-corse-rouge rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-corse-noir">Au choix de la régie</p>
                    <p className="text-sm text-corse-gris-light">
                      Nous optimisons la répartition selon vos objectifs et cibles
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDistributionMode('custom')}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  distributionMode === 'custom'
                    ? 'border-corse-rouge bg-red-50'
                    : 'border-gray-300 bg-white hover:border-corse-rouge'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-corse-rouge flex items-center justify-center mt-1">
                    {distributionMode === 'custom' && (
                      <div className="w-2 h-2 bg-corse-rouge rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-corse-noir">Personnalisée</p>
                    <p className="text-sm text-corse-gris-light">
                      Vous définissez la répartition Print / Digital / Réseaux sociaux / Événement
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Sliders personnalisés */}
            {distributionMode === 'custom' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold text-corse-noir">Print</label>
                    <span className="text-lg font-bold text-corse-rouge">
                      {customDistribution.print}% ({calculateChannelBudget('print')}€)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customDistribution.print}
                    onChange={(e) => handleDistributionChange('print', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-corse-rouge"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold text-corse-noir">Digital</label>
                    <span className="text-lg font-bold text-corse-rouge">
                      {customDistribution.digital}% ({calculateChannelBudget('digital')}€)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customDistribution.digital}
                    onChange={(e) => handleDistributionChange('digital', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-corse-rouge"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold text-corse-noir">Réseaux Sociaux</label>
                    <span className="text-lg font-bold text-corse-rouge">
                      {customDistribution.social}% ({calculateChannelBudget('social')}€)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customDistribution.social}
                    onChange={(e) => handleDistributionChange('social', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-corse-rouge"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold text-corse-noir">Événements</label>
                    <span className="text-lg font-bold text-corse-rouge">
                      {customDistribution.event}% ({calculateChannelBudget('event')}€)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customDistribution.event}
                    onChange={(e) => handleDistributionChange('event', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-corse-rouge"
                  />
                </div>

                {errors.distribution && (
                  <p className="text-red-600 text-sm font-semibold">⚠️ {errors.distribution}</p>
                )}

                <div className={`text-sm font-semibold pt-2 border-t ${
                  totalDistribution === 100 ? 'text-green-700' : 'text-orange-700'
                }`}>
                  Total: {totalDistribution}%
                </div>
              </div>
            )}

            {/* Aperçu répartition */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 uppercase mb-3">Répartition effectue</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-corse-rouge">{distribution.print}%</p>
                  <p className="text-xs text-blue-700 mt-1">Print</p>
                  <p className="text-sm font-semibold text-blue-900">{calculateChannelBudget('print')}€</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-corse-rouge">{distribution.digital}%</p>
                  <p className="text-xs text-blue-700 mt-1">Digital</p>
                  <p className="text-sm font-semibold text-blue-900">{calculateChannelBudget('digital')}€</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-corse-rouge">{distribution.social}%</p>
                  <p className="text-xs text-blue-700 mt-1">Réseaux Sociaux</p>
                  <p className="text-sm font-semibold text-blue-900">{calculateChannelBudget('social')}€</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-corse-rouge">{distribution.event}%</p>
                  <p className="text-xs text-blue-700 mt-1">Événements</p>
                  <p className="text-sm font-semibold text-blue-900">{calculateChannelBudget('event')}€</p>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 border-2 border-corse-gris text-corse-noir font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
            >
              ← Retour
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-corse-rouge to-red-700 text-white font-semibold py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-md"
            >
              Continuer → Supports
            </button>
          </div>

          <p className="text-center text-xs text-corse-gris-light">
            * Champs obligatoires
          </p>
        </form>
      </div>
    </div>
  );
};

export default Step4Budget;
