import React, { useState, useEffect } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import OffersSelector from '../components/OffersSelector';
import { adjustAllChannelsForBudget } from '../utils/budgetAdjuster';

const Step4Budget = ({ planData = {}, onUpdate, onNext, onBack = () => {} }) => {
  const [budgetAmount, setBudgetAmount] = useState(planData.budget || 15000);
  const [previousBudget, setPreviousBudget] = useState(planData.budget || 15000);
  const [budgetAdjusted, setBudgetAdjusted] = useState(false);
  const [distributionMode, setDistributionMode] = useState(
    planData.distributionMode || 'auto'
  );
  const [customDistribution, setCustomDistribution] = useState(
    planData.customDistribution || { print: 40, digital: 50, social: 10, event: 0 }
  );
  const [channelDetails, setChannelDetails] = useState(
    planData.channelDetails || {
      print: { selectedOffers: [] },
      digital: { selectedOffers: [] },
      social: { selectedOffers: [] },
      event: { selectedOffers: [] }
    }
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
    const newBudget = Math.max(1000, value);
    
    // Vérifier s'il y a des offres à ajuster
    const hasOffers = Object.values(channelDetails).some(
      channel => channel?.selectedOffers?.length > 0
    );

    if (hasOffers && newBudget !== budgetAmount) {
      // Ajuster les offres pour le nouveau budget
      const adjustedChannels = adjustAllChannelsForBudget(
        channelDetails,
        budgetAmount,
        newBudget
      );
      setChannelDetails(adjustedChannels);
      setBudgetAdjusted(true);
      
      // Réinitialiser après 3 secondes
      setTimeout(() => setBudgetAdjusted(false), 3000);
    }

    setBudgetAmount(newBudget);
    setPreviousBudget(newBudget);
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

  const addOffer = (channel) => {
    setChannelDetails(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        selectedOffers: [
          ...(prev[channel]?.selectedOffers || []),
          {
            mediaName: '',
            placement: '',
            format: '',
            quantity: 1,
            unitPrice: 0,
            budgetAllocated: 0,
            frequency: '',
            timing: '',
            circulation: '',
            reach: '',
            impressions: 0,
            notes: ''
          }
        ]
      }
    }));
  };

  const updateOffer = (channel, offerIndex, field, value) => {
    setChannelDetails(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        selectedOffers: prev[channel].selectedOffers.map((offer, idx) =>
          idx === offerIndex ? { ...offer, [field]: value } : offer
        )
      }
    }));
  };

  const removeOffer = (channel, offerIndex) => {
    setChannelDetails(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        selectedOffers: prev[channel].selectedOffers.filter((_, idx) => idx !== offerIndex)
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate({
        budget: budgetAmount,
        distributionMode,
        customDistribution,
        effectiveDistribution: distribution,
        channelDetails,
      });
      onNext();
    }
  };

  const calculateChannelBudget = (channel) => {
    return Math.round((budgetAmount * distribution[channel]) / 100);
  };

  const totalDistribution = Object.values(customDistribution).reduce((a, b) => a + b, 0);

  // Calculer le total des offres sélectionnées
  const calculateTotalOffers = () => {
    let total = 0;
    Object.values(channelDetails).forEach(channel => {
      const offers = channel?.selectedOffers || [];
      offers.forEach(offer => {
        total += offer.budgetAllocated || 0;
      });
    });
    return total;
  };

  const totalOffersValue = calculateTotalOffers();
  const offerCoverage = budgetAmount > 0 ? Math.round((totalOffersValue / budgetAmount) * 100) : 0;

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-corse-rouge rounded-full"></div>
            <h1 className="text-3xl font-bold text-corse-noir">Budget de Campagne</h1>
          </div>
          <p className="text-corse-gris-light">Définissez votre budget et sa répartition par canal</p>
        </div>

        {/* Alerte d'ajustement des offres */}
        {budgetAdjusted && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900">Offres ajustées automatiquement</p>
              <p className="text-sm text-blue-800 mt-1">
                Les quantités et budgets des offres sélectionnées ont été ajustés proportionnellement pour respecter votre nouveau budget.
              </p>
            </div>
          </div>
        )}

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

            {/* Statut du budget des offres */}
            {totalOffersValue > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold text-corse-noir text-sm">Budget utilisé par les offres</p>
                  <p className="text-lg font-bold text-corse-rouge">{totalOffersValue.toLocaleString()}€</p>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      offerCoverage > 100
                        ? 'bg-red-500'
                        : offerCoverage > 80
                        ? 'bg-orange-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(offerCoverage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="text-corse-gris">Couverture du budget</span>
                  <span className={`font-semibold ${
                    offerCoverage > 100
                      ? 'text-red-600'
                      : offerCoverage > 80
                      ? 'text-orange-600'
                      : 'text-green-600'
                  }`}>
                    {offerCoverage}%
                  </span>
                </div>
                {offerCoverage > 100 && (
                  <p className="text-xs text-red-600 mt-2">⚠️ Les offres dépassent le budget. Augmentez le budget ou réduisez les offres.</p>
                )}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-corse-gris mb-3 uppercase">Modèles rapides</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {templates.map(t => (
                  <button
                    key={t.budget}
                    type="button"
                    onClick={() => {
                      // Ajuster les offres pour le nouveau budget
                      const hasOffers = Object.values(channelDetails).some(
                        channel => channel?.selectedOffers?.length > 0
                      );
                      if (hasOffers && t.budget !== budgetAmount) {
                        const adjustedChannels = adjustAllChannelsForBudget(
                          channelDetails,
                          budgetAmount,
                          t.budget
                        );
                        setChannelDetails(adjustedChannels);
                        setBudgetAdjusted(true);
                        setTimeout(() => setBudgetAdjusted(false), 3000);
                      }
                      setBudgetAmount(t.budget);
                      setPreviousBudget(t.budget);
                    }}
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
            <div className="mt-6 p-4 bg-white border-2 border-gray-200 rounded-lg">
              <p className="text-xs font-semibold text-corse-gris uppercase mb-3">Répartition effectue</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-corse-rouge">{distribution.print}%</p>
                  <p className="text-xs text-corse-gris mt-1">Print</p>
                  <p className="text-sm font-semibold text-corse-noir">{calculateChannelBudget('print')}€</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-corse-rouge">{distribution.digital}%</p>
                  <p className="text-xs text-corse-gris mt-1">Digital</p>
                  <p className="text-sm font-semibold text-corse-noir">{calculateChannelBudget('digital')}€</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-corse-rouge">{distribution.social}%</p>
                  <p className="text-xs text-corse-gris mt-1">Réseaux Sociaux</p>
                  <p className="text-sm font-semibold text-corse-noir">{calculateChannelBudget('social')}€</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-corse-rouge">{distribution.event}%</p>
                  <p className="text-xs text-corse-gris mt-1">Événements</p>
                  <p className="text-sm font-semibold text-corse-noir">{calculateChannelBudget('event')}€</p>
                </div>
              </div>
            </div>
          </div>

          {/* Détails des offres par canal */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
            <h3 className="text-lg font-semibold text-corse-noir mb-4">
              Détails des placements par canal
            </h3>
            <p className="text-sm text-corse-gris-light mb-4">
              Spécifiez les supports, formats et placements pour chaque canal
            </p>

            <div className="space-y-6">
              {/* PRINT */}
              <div className="border-2 border-amber-200 rounded-lg p-4 bg-amber-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg text-corse-noir flex items-center gap-2">
                    <span className="text-2xl">📰</span> Presse ({distribution.print}%)
                  </h4>
                  {distribution.print > 0 && (
                    <button
                      type="button"
                      onClick={() => addOffer('print')}
                      className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      <Plus size={16} /> Ajouter une offre
                    </button>
                  )}
                </div>

                {distribution.print === 0 ? (
                  <p className="text-sm text-corse-gris-light italic">Budget à 0% pour ce canal</p>
                ) : (
                  <>
                    {/* Sélecteur d'offres */}
                    <div className="mb-6">
                      <OffersSelector
                        channel="print"
                        onAddOffer={(offer) => {
                          setChannelDetails(prev => ({
                            ...prev,
                            print: {
                              ...prev.print,
                              selectedOffers: [...(prev.print?.selectedOffers || []), offer]
                            }
                          }));
                        }}
                      />
                    </div>

                    {/* Offres saisies manuellement */}
                    <div className="space-y-3">
                    {(channelDetails.print?.selectedOffers || []).map((offer, idx) => (
                      <div key={idx} className="bg-white rounded p-4 border border-amber-200">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-semibold text-corse-noir">Offre {idx + 1}</h5>
                          <button
                            type="button"
                            onClick={() => removeOffer('print', idx)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Ex: Corse-Matin (page 2)"
                            value={offer.mediaName}
                            onChange={(e) => updateOffer('print', idx, 'mediaName', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="text"
                            placeholder="Ex: Page 2"
                            value={offer.placement}
                            onChange={(e) => updateOffer('print', idx, 'placement', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="text"
                            placeholder="Ex: 1/4 page"
                            value={offer.format}
                            onChange={(e) => updateOffer('print', idx, 'format', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="number"
                            placeholder="Circulation estimée"
                            value={offer.circulation}
                            onChange={(e) => updateOffer('print', idx, 'circulation', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="number"
                            placeholder="Coût unitaire (€)"
                            value={offer.unitPrice}
                            onChange={(e) => updateOffer('print', idx, 'unitPrice', parseFloat(e.target.value))}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="number"
                            placeholder="Quantité"
                            value={offer.quantity}
                            onChange={(e) => updateOffer('print', idx, 'quantity', parseInt(e.target.value))}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <textarea
                            placeholder="Notes (optionnel)"
                            value={offer.notes}
                            onChange={(e) => updateOffer('print', idx, 'notes', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge md:col-span-2"
                            rows="2"
                          />
                        </div>
                      </div>
                    ))}
                    </div>
                  </>
                )}
              </div>

              {/* DIGITAL */}
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg text-corse-noir flex items-center gap-2">
                    <span className="text-2xl">💻</span> Numérique ({distribution.digital}%)
                  </h4>
                  {distribution.digital > 0 && (
                    <button
                      type="button"
                      onClick={() => addOffer('digital')}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      <Plus size={16} /> Ajouter une offre
                    </button>
                  )}
                </div>

                {distribution.digital === 0 ? (
                  <p className="text-sm text-corse-gris-light italic">Budget à 0% pour ce canal</p>
                ) : (
                  <>
                    {/* Sélecteur d'offres */}
                    <div className="mb-6">
                      <OffersSelector
                        channel="digital"
                        onAddOffer={(offer) => {
                          setChannelDetails(prev => ({
                            ...prev,
                            digital: {
                              ...prev.digital,
                              selectedOffers: [...(prev.digital?.selectedOffers || []), offer]
                            }
                          }));
                        }}
                      />
                    </div>

                    {/* Offres saisies manuellement */}
                    <div className="space-y-3">
                    {(channelDetails.digital?.selectedOffers || []).map((offer, idx) => (
                      <div key={idx} className="bg-white rounded p-4 border border-blue-200">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-semibold text-corse-noir">Offre {idx + 1}</h5>
                          <button
                            type="button"
                            onClick={() => removeOffer('digital', idx)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Ex: corsematin.fr (homepage)"
                            value={offer.mediaName}
                            onChange={(e) => updateOffer('digital', idx, 'mediaName', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="text"
                            placeholder="Ex: Bandeau premium"
                            value={offer.placement}
                            onChange={(e) => updateOffer('digital', idx, 'placement', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="text"
                            placeholder="Ex: 300x250"
                            value={offer.format}
                            onChange={(e) => updateOffer('digital', idx, 'format', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="number"
                            placeholder="Impressions estimées"
                            value={offer.impressions}
                            onChange={(e) => updateOffer('digital', idx, 'impressions', parseInt(e.target.value))}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="text"
                            placeholder="Ex: 30 jours"
                            value={offer.frequency}
                            onChange={(e) => updateOffer('digital', idx, 'frequency', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="number"
                            placeholder="Coût total (€)"
                            value={offer.budgetAllocated}
                            onChange={(e) => updateOffer('digital', idx, 'budgetAllocated', parseFloat(e.target.value))}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <textarea
                            placeholder="Notes (optionnel)"
                            value={offer.notes}
                            onChange={(e) => updateOffer('digital', idx, 'notes', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge md:col-span-2"
                            rows="2"
                          />
                        </div>
                      </div>
                    ))}
                    </div>
                  </>
                )}
              </div>

              {/* SOCIAL */}
              <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg text-corse-noir flex items-center gap-2">
                    <span className="text-2xl">📱</span> Réseaux Sociaux ({distribution.social}%)
                  </h4>
                  {distribution.social > 0 && (
                    <button
                      type="button"
                      onClick={() => addOffer('social')}
                      className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      <Plus size={16} /> Ajouter une offre
                    </button>
                  )}
                </div>

                {distribution.social === 0 ? (
                  <p className="text-sm text-corse-gris-light italic">Budget à 0% pour ce canal</p>
                ) : (
                  <>
                    {/* Sélecteur d'offres */}
                    <div className="mb-6">
                      <OffersSelector
                        channel="social"
                        onAddOffer={(offer) => {
                          setChannelDetails(prev => ({
                            ...prev,
                            social: {
                              ...prev.social,
                              selectedOffers: [...(prev.social?.selectedOffers || []), offer]
                            }
                          }));
                        }}
                      />
                    </div>

                    {/* Offres saisies manuellement */}
                    <div className="space-y-3">
                    {(channelDetails.social?.selectedOffers || []).map((offer, idx) => (
                      <div key={idx} className="bg-white rounded p-4 border border-purple-200">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-semibold text-corse-noir">Offre {idx + 1}</h5>
                          <button
                            type="button"
                            onClick={() => removeOffer('social', idx)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Ex: Facebook Ads"
                            value={offer.mediaName}
                            onChange={(e) => updateOffer('social', idx, 'mediaName', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="text"
                            placeholder="Ex: Feed & Stories"
                            value={offer.placement}
                            onChange={(e) => updateOffer('social', idx, 'placement', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="text"
                            placeholder="Ex: 1200x628"
                            value={offer.format}
                            onChange={(e) => updateOffer('social', idx, 'format', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="text"
                            placeholder="Ex: 25-54 ans"
                            value={offer.reach}
                            onChange={(e) => updateOffer('social', idx, 'reach', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="number"
                            placeholder="Impressions estimées"
                            value={offer.impressions}
                            onChange={(e) => updateOffer('social', idx, 'impressions', parseInt(e.target.value))}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="number"
                            placeholder="Coût total (€)"
                            value={offer.budgetAllocated}
                            onChange={(e) => updateOffer('social', idx, 'budgetAllocated', parseFloat(e.target.value))}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <textarea
                            placeholder="Notes (optionnel)"
                            value={offer.notes}
                            onChange={(e) => updateOffer('social', idx, 'notes', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge md:col-span-2"
                            rows="2"
                          />
                        </div>
                      </div>
                    ))}
                    </div>
                  </>
                )}
              </div>

              {/* EVENTS */}
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg text-corse-noir flex items-center gap-2">
                    <span className="text-2xl">🎪</span> Événementiel ({distribution.event}%)
                  </h4>
                  {distribution.event > 0 && (
                    <button
                      type="button"
                      onClick={() => addOffer('event')}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      <Plus size={16} /> Ajouter une offre
                    </button>
                  )}
                </div>

                {distribution.event === 0 ? (
                  <p className="text-sm text-corse-gris-light italic">Budget à 0% pour ce canal</p>
                ) : (
                  <>
                    {/* Sélecteur d'offres */}
                    <div className="mb-6">
                      <OffersSelector
                        channel="event"
                        onAddOffer={(offer) => {
                          setChannelDetails(prev => ({
                            ...prev,
                            event: {
                              ...prev.event,
                              selectedOffers: [...(prev.event?.selectedOffers || []), offer]
                            }
                          }));
                        }}
                      />
                    </div>

                    {/* Offres saisies manuellement */}
                    <div className="space-y-3">
                    {(channelDetails.event?.selectedOffers || []).map((offer, idx) => (
                      <div key={idx} className="bg-white rounded p-4 border border-green-200">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-semibold text-corse-noir">Offre {idx + 1}</h5>
                          <button
                            type="button"
                            onClick={() => removeOffer('event', idx)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Ex: Stand salon automne"
                            value={offer.mediaName}
                            onChange={(e) => updateOffer('event', idx, 'mediaName', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="text"
                            placeholder="Ex: Premium booth"
                            value={offer.placement}
                            onChange={(e) => updateOffer('event', idx, 'placement', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="text"
                            placeholder="Ex: 2-3 octobre 2024"
                            value={offer.frequency}
                            onChange={(e) => updateOffer('event', idx, 'frequency', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="number"
                            placeholder="Visitors attendus"
                            value={offer.reach}
                            onChange={(e) => updateOffer('event', idx, 'reach', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <input
                            type="number"
                            placeholder="Coût total (€)"
                            value={offer.budgetAllocated}
                            onChange={(e) => updateOffer('event', idx, 'budgetAllocated', parseFloat(e.target.value))}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge"
                          />
                          <textarea
                            placeholder="Notes (optionnel)"
                            value={offer.notes}
                            onChange={(e) => updateOffer('event', idx, 'notes', e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-corse-rouge md:col-span-2"
                            rows="2"
                          />
                        </div>
                      </div>
                    ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 border-2 border-corse-gris text-corse-noir font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
            >
              ← Retour
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-corse-rouge to-red-700 text-white font-semibold py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-md"
            >
              Générer le Plan →
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